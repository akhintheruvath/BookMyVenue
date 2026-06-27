const Venues = require("../../models/venue");
const { VENUE_STATUS_VALUES, VENUE_STATUSES } = require("../../constants/venue");
const {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   CATEGORY_POPULATE,
   OWNER_HIDDEN_FIELDS,
   parsePageParam,
} = require("./shared");

// Statuses that only exist on edit copies (editOf is set). When these are requested
// we must NOT filter editOf:null or we'd get zero results.
const EDIT_COPY_STATUSES = [VENUE_STATUSES.EDIT_DRAFT, VENUE_STATUSES.CHANGES_PENDING];

// Marks each APPROVED venue in the list with `editStatus`: the status of its
// in-progress edit copy ("EDIT_DRAFT" = venue owner is editing, "CHANGES_PENDING" =
// edits submitted and awaiting admin), or null when no open copy exists. Lets the
// venue owner UI relabel/guard the Edit button without a per-row request. One extra
// query for the whole page. Non-APPROVED venues are left untouched (editStatus
// only ever applies to a live original).
async function attachEditStatus(venues, ownerId) {
   const approvedIds = venues
      .filter((v) => v.status === VENUE_STATUSES.APPROVED)
      .map((v) => v._id);

   if (approvedIds.length === 0) return venues;

   const copiesOfApprovedVenues = await Venues.find({
      venueOwner: ownerId,
      editOf: { $in: approvedIds },
      status: { $in: EDIT_COPY_STATUSES },
      deletedAt: null,
   })
      .select("editOf status")
      .lean();

   // original id -> copy status. Only one open copy per original is possible
   // (getVenueForEdit is idempotent)
   const statusByOriginal = new Map(copiesOfApprovedVenues.map((c) => [String(c.editOf), c.status]));

   for (const venue of venues) {
      if (venue.status === VENUE_STATUSES.APPROVED) {
         venue.editStatus = statusByOriginal.get(String(venue._id)) ?? null;
      }
   }
   return venues;
}

// GET /venueOwner/venues — paginated venue owner venue list based on statuses passed.
// Query params:
//   status  comma-separated status values (e.g. "APPROVED" or "DRAFT,EDIT_DRAFT")
//   page    integer ≥1 (default 1)
//   limit   integer ≥1 (default 20)
//   countOnly "true" — returns { data: { total } } with no venue docs
async function venueOwnerListVenues(req, res) {
   try {
      const page = parsePageParam(req.query.page, DEFAULT_PAGE);
      const limit = parsePageParam(req.query.limit, DEFAULT_LIMIT);
      const skip = (page - 1) * limit;

      const filter = { venueOwner: req.user._id, deletedAt: null };

      if (req.query.status) {
         const requested = req.query.status.split(",").map(s => s.trim()).filter(s => VENUE_STATUS_VALUES.includes(s));
         if (requested.length === 0) return res.status(400).json({ message: "Invalid status value(s)" });
         filter.status = { $in: requested };
         // Only exclude edit copies when none of the requested statuses are copy-statuses
         const hasCopyStatus = requested.some(s => EDIT_COPY_STATUSES.includes(s));
         if (!hasCopyStatus) filter.editOf = null;
      } else {
         // No status filter — exclude copies so venue owner doesn't see duplicates
         filter.editOf = null;
      }

      if (req.query.countOnly === 'true') {
         const total = await Venues.countDocuments(filter);
         return res.status(200).json({ data: { total } });
      }

      const [venues, total] = await Promise.all([
         Venues.find(filter)
            .select(OWNER_HIDDEN_FIELDS)
            .populate(CATEGORY_POPULATE)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
         Venues.countDocuments(filter),
      ]);

      await attachEditStatus(venues, req.user._id);

      return res.status(200).json({
         data: venues,
         pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch venues" });
   }
}

module.exports = venueOwnerListVenues;

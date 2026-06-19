const Venues = require("../../models/venue");
const { VENUE_STATUS_VALUES, VENUE_STATUS } = require("../../constants/venue");
const {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   CATEGORY_POPULATE,
   VENUE_OWNER_VENUE_PROJECTION,
   parsePageParam,
} = require("./shared");

// Statuses that only exist on edit copies (editOf is set). When these are requested
// we must NOT filter editOf:null or we'd get zero results.
const EDIT_COPY_STATUSES = [VENUE_STATUS.EDIT_DRAFT, VENUE_STATUS.CHANGES_PENDING];

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
            .select(VENUE_OWNER_VENUE_PROJECTION)
            .populate(CATEGORY_POPULATE)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
         Venues.countDocuments(filter),
      ]);

      return res.status(200).json({
         data: venues,
         pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
   } catch (err) {
      return res.status(500).json({ error: err.message, message: "Failed to fetch venues" });
   }
}

module.exports = venueOwnerListVenues;

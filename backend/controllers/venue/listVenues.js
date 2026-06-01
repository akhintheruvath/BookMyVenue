const Venues = require("../../models/venue");
const {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   PUBLIC_VENUE_FILTER,
   PUBLIC_FIELDS,
   CATEGORY_POPULATE,
   parsePageParam,
} = require("./shared");

// GET /venues — public, paginated list of APPROVED venues.
async function listVenues(req, res) {
   try {
      const page = parsePageParam(req.query.page, DEFAULT_PAGE);
      const limit = parsePageParam(req.query.limit, DEFAULT_LIMIT);
      const skip = (page - 1) * limit;

      const [venues, total] = await Promise.all([
         Venues.find(PUBLIC_VENUE_FILTER)
            .select(PUBLIC_FIELDS)
            .populate(CATEGORY_POPULATE)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
         Venues.countDocuments(PUBLIC_VENUE_FILTER),
      ]);

      return res.status(200).json({
         data: venues,
         pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
         },
      });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch venues" });
   }
}

module.exports = listVenues;

const { VENUE_STATUS } = require("../../constants/venue");

// Pagination defaults for the public listing
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

// Public visibility rule: a venue is publicly readable only when it is
// APPROVED and not soft-deleted. Defined once, reused by every public read.
// (Owner-suspension check is added once the User/Owner collection exists.)
const PUBLIC_VENUE_FILTER = {
   status: VENUE_STATUS.APPROVED,
   deletedAt: null,
};

// Fields safe to expose publicly — keeps internal markers (deletedAt, owner, ect.) out.
const PUBLIC_FIELDS = "name description venueCategory capacity addressLine state district city pincode location basePrice images createdAt";

const CATEGORY_POPULATE = { path: "venueCategory", select: "identifier name" };

// Parse a pagination query param into a positive integer, falling back to a default.
function parsePageParam(rawValue, fallback) {
   const parsed = Number.parseInt(rawValue, 10);
   if (Number.isNaN(parsed) || parsed < 1) {
      return fallback;
   }
   return parsed;
}

module.exports = {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   PUBLIC_VENUE_FILTER,
   PUBLIC_FIELDS,
   CATEGORY_POPULATE,
   parsePageParam,
};

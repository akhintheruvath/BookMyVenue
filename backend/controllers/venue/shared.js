const { VENUE_STATUS } = require("../../constants/venue");
const Categories = require("../../models/category");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

const PUBLIC_VENUE_FILTER = {
   status: VENUE_STATUS.APPROVED,
   deletedAt: null,
};

const PUBLIC_FIELDS = "name description venueCategory capacity addressLine state district city pincode location basePrice images createdAt";

const CATEGORY_POPULATE = { path: "venueCategory", select: "identifier name" };

function parsePageParam(rawValue, fallback) {
   const parsed = Number.parseInt(rawValue, 10);
   if (Number.isNaN(parsed) || parsed < 1) return fallback;
   return parsed;
}

// Resolves a category identifier string (e.g. "resort") to its ObjectId.
// Returns null if the identifier doesn't match any active category — which
// will cause the query to return zero results (correct behaviour: unknown
// category = no matches, not an error).
async function resolveCategoryId(identifier) {
   if (!identifier) return undefined;
   const cat = await Categories.findOne({
      identifier: identifier.toLowerCase().trim(),
      isActive: true,
      deletedAt: null,
   }).select("_id").lean();
   return cat ? cat._id : null;
}

// Builds the MongoDB filter for the public venue listing.
// Always starts from PUBLIC_VENUE_FILTER (approved + not deleted) and
// optionally layers on district, category, and price constraints.
async function buildVenueFilter({ district, category, minPrice, maxPrice } = {}) {
   const filter = { ...PUBLIC_VENUE_FILTER };

   if (district) {
      // Case-insensitive exact match on district name.
      filter.district = { $regex: new RegExp(`^${district.trim()}$`, "i") };
   }

   if (category) {
      const categoryId = await resolveCategoryId(category);
      // null means the identifier was provided but matched nothing — force zero results.
      // undefined means it was not provided — skip the filter.
      if (categoryId !== undefined) {
         filter.venueCategory = categoryId;
      }
   }

   if (minPrice !== undefined || maxPrice !== undefined) {
      filter.basePrice = {};
      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (!Number.isNaN(min)) filter.basePrice.$gte = min;
      if (!Number.isNaN(max)) filter.basePrice.$lte = max;
      // If both were provided and unparseable, drop the empty object.
      if (Object.keys(filter.basePrice).length === 0) delete filter.basePrice;
   }

   return filter;
}

module.exports = {
   DEFAULT_PAGE,
   DEFAULT_LIMIT,
   PUBLIC_VENUE_FILTER,
   PUBLIC_FIELDS,
   CATEGORY_POPULATE,
   parsePageParam,
   buildVenueFilter,
};
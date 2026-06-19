const Venues = require("../../models/venue");
const { VENUE_STATUSES, SUBMITTABLE_STATUSES } = require("../../constants/venue");

// POST /venueOwner/venues/submit/:id
// Moves a venue from DRAFT → PENDING or EDIT_DRAFT → CHANGES_PENDING,
// putting it in the admin review.
//
// Rules:
//   - Venue must belong to req.user._id (venue owner check)
//   - Current status must be in SUBMITTABLE_STATUSES (DRAFT or EDIT_DRAFT)
//   - DRAFT      → set status to PENDING
//   - EDIT_DRAFT → set status to CHANGES_PENDING
//
// TODO:
//   1. Find venue by req.params.id where venueOwner === req.user._id and deletedAt === null
//   2. If not found return 404 { message: "Venue not found" }
//   3. If venue.status not in SUBMITTABLE_STATUSES return 400
//      { message: "Only DRAFT or EDIT_DRAFT venues can be submitted" }
//   4. Determine next status:
//        DRAFT      → PENDING
//        EDIT_DRAFT → CHANGES_PENDING
//   5. Set venue.status to next status, call venue.save()
//   6. Return 200 { message: "Venue submitted for review", data: { status: venue.status } }
//   7. On error return 500 { message: "Failed to submit venue" }
async function venueOwnerSubmitVenue(req, res) {
   // TODO: implement
   return res.status(501).json({ message: "Not implemented" });
}

module.exports = venueOwnerSubmitVenue;

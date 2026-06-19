const Venues = require("../../models/venue");
const { IN_PLACE_EDIT_STATUSES } = require("../../constants/venue");
const { EDITABLE_VENUE_FIELDS } = require("./shared");

// PATCH /venueOwner/venues/update/:id
// Autosave endpoint — partial update of a DRAFT or EDIT_DRAFT venue.
// Called debounced (~1s after the user stops typing) from the edit form.
//
// Rules:
//   - Venue must belong to req.user._id (venue owner check)
//   - Current status must be in IN_PLACE_EDIT_STATUSES (DRAFT or EDIT_DRAFT)
//   - Only fields listed in EDITABLE_VENUE_FIELDS may be updated — never trust
//     raw req.body spread; pick allowed keys only to prevent venue owner overwriting
//     status / venueOwner / editOf / isActive
//
// TODO:
//   1. Find venue by req.params.id where venueOwner === req.user._id and deletedAt === null
//   2. If not found return 404 { message: "Venue not found" }
//   3. If venue.status not in IN_PLACE_EDIT_STATUSES return 400
//      { message: "Only DRAFT or EDIT_DRAFT venues can be edited" }
//   4. Build an update object by picking only EDITABLE_VENUE_FIELDS keys from req.body
//      (ignore any other keys silently)
//   5. Apply picked fields onto the venue document and call venue.save()
//   6. Return 200 { message: "Venue saved", data: { updatedAt: venue.updatedAt } }
//   7. On error return 500 { message: "Failed to update venue" }
async function venueOwnerUpdateVenue(req, res) {
   // TODO: implement
   return res.status(501).json({ message: "Not implemented" });
}

module.exports = venueOwnerUpdateVenue;

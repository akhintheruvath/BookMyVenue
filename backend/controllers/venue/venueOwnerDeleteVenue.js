const Venues = require("../../models/venue");
const { VENUE_STATUS } = require("../../constants/venue");

// DELETE /venueOwner/venues/delete/:id
// Hard-deletes a DRAFT document OR an EDIT_DRAFT clone document.
// This is a permanent delete (not soft-delete) because:
//   - DRAFT  : venue was never submitted, safe to drop entirely
//   - EDIT_DRAFT: it is a clone of an APPROVED venue; deleting it discards the
//     in-progress edits without affecting the original APPROVED document
//
// Rules:
//   - Venue must belong to req.user._id (venue owner check)
//   - Only DRAFT or EDIT_DRAFT status is allowed; all other statuses return 400
//
// TODO:
//   1. Find venue by req.params.id where venueOwner === req.user._id and deletedAt === null
//   2. If not found return 404 { message: "Venue not found" }
//   3. If venue.status is not DRAFT or EDIT_DRAFT return 400
//      { message: "Only DRAFT or EDIT_DRAFT venues can be deleted" }
//   4. Call Venues.deleteOne({ _id: venue._id }) — hard delete, not soft
//   5. Return 200 { message: "Venue deleted" }
//   6. On error return 500 { message: "Failed to delete venue" }
async function venueOwnerDeleteVenue(req, res) {
   // TODO: implement
   return res.status(501).json({ message: "Not implemented" });
}

module.exports = venueOwnerDeleteVenue;

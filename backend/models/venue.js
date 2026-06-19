const mongoose = require("mongoose");
const { VENUE_STATUS_VALUES, VENUE_STATUSES } = require("../constants/venue");

// Embedded image reference. MVP stores plain URLs only (no upload pipeline for now)
const venueImageSchema = new mongoose.Schema(
   {
      url: { type: String, required: true, trim: true },
      sortOrder: { type: Number, default: 0 },
      isCover: { type: Boolean, default: false },
   },
   { _id: false }
);

const venueSchema = new mongoose.Schema(
   {
      // venueOwner id — required by the data model, but auth/venue owner isn't built yet.
      // Kept optional for now so seed data can exist before the User collection does.
      venueOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

      // Set on an EDIT COPY only: points to the original APPROVED venue this copy
      // edits. null on every normal venue.
      // Required to (a) link copy-> original for
      // the merge, (b) exclude copies from the venue owner's venue list, (c) tell a new
      // PENDING venue apart from an edit awaiting re-approval.
      editOf: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Venue",
         default: null,
         index: true,
      },

      name: { type: String, trim: true, default: "" },
      description: { type: String, trim: true, default: "" },
      // References the Category collection (admin-managed).
      venueCategory: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         default: null,
         index: true,
      },
      capacity: { type: Number, min: 0 },

      // Address fields.
      addressLine: { type: String, trim: true, default: "" },
      city: { type: String, trim: true },
      district: { type: String, trim: true, index: true },
      state: { type: String, trim: true, default: "Kerala" },
      pincode: { type: String, trim: true },

      // GeoJSON Point: [longitude, latitude]. Shaped for the Phase-1 radius
      // search ("venues near me"); the 2dsphere index will be added later.
      location: {
         type: { type: String, enum: ["Point"], default: "Point" },
         coordinates: { type: [Number], default: undefined }, // [lng, lat]
      },

      basePrice: { type: Number, min: 0, default: null },

      images: { type: [venueImageSchema], default: [] },

      // Listing lifecycle. New venues start PENDING; only APPROVED is public.
      status: {
         type: String,
         enum: VENUE_STATUS_VALUES,
         default: VENUE_STATUSES.DRAFT,
         index: true,
      },

      // Venue owner-controlled visibility toggle, orthogonal to `status`.
      // false = venue owner disabled the listing; hidden from public but not deleted.
      isActive: { type: Boolean, default: true },

      // Set by admin on rejection (admin endpoints come later). Surfaced to the venue owner.
      rejectionReason: { type: String, trim: true, default: "" },

      // Soft-delete marker. null = live(active).
      deletedAt: { type: Date, default: null },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema, "venues");

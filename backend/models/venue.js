const mongoose = require("mongoose");
const { VENUE_STATUS_VALUES, VENUE_STATUS } = require("../constants/venue");

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
      // owner_id — required by the data model, but auth/owner isn't built yet.
      // Kept optional for now so seed data can exist before the User collection does.
      owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

      name: { type: String, required: true, trim: true },
      description: { type: String, trim: true, default: "" },
      // References the Category collection (admin-managed).
      venueCategory: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         required: true,
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

      basePrice: { type: Number, required: true, min: 0 },

      images: { type: [venueImageSchema], default: [] },

      // Listing lifecycle. New venues start PENDING; only APPROVED is public.
      status: {
         type: String,
         enum: VENUE_STATUS_VALUES,
         default: VENUE_STATUS.PENDING,
         index: true,
      },

      // Soft-delete marker. null = live(active).
      deletedAt: { type: Date, default: null },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema, "venues");

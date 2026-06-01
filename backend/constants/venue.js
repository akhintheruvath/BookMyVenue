// Venue domain constants — shared across model, controllers, and seed.
// Centralized here so there are no magic strings scattered through the codebase.

// Listing lifecycle. Only APPROVED venues are publicly searchable
const VENUE_STATUS = {
   DRAFT: "DRAFT",
   PENDING: "PENDING",
   APPROVED: "APPROVED",
   REJECTED: "REJECTED", // REJECTED means admin declined (+rejectionReason); not terminal — owner can fix & resubmit (REJECTED → submit → PENDING)
   CHANGES_PENDING: "CHANGES_PENDING", // CHANGES_PENDING is the status for an already-approved venue that the owner has edited, while that edit waits for admin re-approval.
};

module.exports = {
   VENUE_STATUS,
   VENUE_STATUS_VALUES: Object.values(VENUE_STATUS),
};

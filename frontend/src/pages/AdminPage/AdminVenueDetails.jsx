import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const venueData = {
  id: 1,
  name: "Grand Palace Convention Center",
  category: "Convention Center",
  description:
    "A premium convention center suitable for weddings, conferences, exhibitions and corporate events.",
  address: "MG Road, Kochi, Kerala",
  capacity: 500,
  pricePerHour: 5000,
  contactPerson: "John Doe",
  phone: "+91 9876543210",
  email: "john@example.com",
  amenities: [
    "Parking",
    "Air Conditioning",
    "Stage",
    "Sound System",
    "WiFi",
  ],
  images: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3",
    "https://images.unsplash.com/photo-1511578314322-379afb476865",
  ],
};

export function AdminVenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    alert(`Venue ${id} approved`);
    navigate("/admin/venues/pending");
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    alert(`Venue ${id} rejected\nReason: ${reason}`);
    navigate("/admin/venues/pending");
  };

  return (
    <>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Venue Review
          </h1>
          <p className="mt-2 text-gray-500">
            Review venue details before approval.
          </p>
        </div>

        {/* Basic Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Venue Name
              </label>
              <p className="mt-1 font-medium">
                {venueData.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Category
              </label>
              <p className="mt-1">
                {venueData.category}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Capacity
              </label>
              <p className="mt-1">
                {venueData.capacity} Guests
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Price Per Hour
              </label>
              <p className="mt-1">
                ₹{venueData.pricePerHour}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-medium text-gray-500">
              Description
            </label>
            <p className="mt-1">
              {venueData.description}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Location
          </h2>

          <label className="text-sm font-medium text-gray-500">
            Address
          </label>

          <p className="mt-1">
            {venueData.address}
          </p>
        </div>

        {/* Contact */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Contact Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Contact Person
              </label>
              <p className="mt-1">
                {venueData.contactPerson}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone
              </label>
              <p className="mt-1">
                {venueData.phone}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Email
              </label>
              <p className="mt-1">
                {venueData.email}
              </p>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Amenities
          </h2>

          <div className="flex flex-wrap gap-2">
            {venueData.amenities.map((item) => (
              <span
                key={item}
                className="rounded-full bg-red-50 px-4 py-2 text-sm text-red-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            Venue Images
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {venueData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Venue ${index + 1}`}
                className="h-56 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={() => setShowRejectModal(true)}
            className="rounded-lg border border-red-600 px-6 py-3 font-medium text-red-600 hover:bg-red-50"
          >
            Reject
          </button>

          <button
            onClick={handleApprove}
            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <h2 className="text-xl font-semibold">
              Reject Venue
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Provide a reason for rejecting this venue.
            </p>

            <textarea
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="mt-4 w-full rounded-lg border border-gray-300 p-3"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
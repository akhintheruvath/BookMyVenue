export default function HomeVenueCard({ venue }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">

      <img
        src={venue.images?.[0]?.url}
        alt={venue.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">

        <h3 className="line-clamp-1 font-semibold">
          {venue.name}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {venue.venueCategory.name}
        </p>

        <p className="mt-2 text-sm text-gray-600">
          📍 {venue.district}
        </p>

        <p className="mt-1 text-sm text-gray-600">
          👥 {venue.capacity} Guests
        </p>

        <p className="mt-3 font-semibold text-red-600">
          ₹{venue.basePrice.toLocaleString()}
        </p>

      </div>

    </div>
  );
}
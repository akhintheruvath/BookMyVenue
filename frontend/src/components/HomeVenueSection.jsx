import { useState } from "react";
import { Link } from "react-router-dom";
import VenueCard from "./HomeVenueCard.jsx";

export default function HomeVenueSection({
  title,
  venues,
}) {
  const ITEMS_PER_PAGE = 8;

  const [startIndex, setStartIndex] = useState(0);

  const visibleVenues = venues.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const canGoPrev = startIndex > 0;
  const canGoNext =
    startIndex + ITEMS_PER_PAGE < venues.length;

  const handlePrev = () => {
    setStartIndex((prev) =>
      Math.max(prev - ITEMS_PER_PAGE, 0)
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(
        prev + ITEMS_PER_PAGE,
        venues.length - ITEMS_PER_PAGE
      )
    );
  };

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        <div className="flex items-center gap-3">
          {canGoPrev && (
            <button
              onClick={handlePrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition hover:bg-gray-100"
            >
              ←
            </button>
          )}

          <Link
            to="/category"
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Show All →
          </Link>

          {canGoNext && (
            <button
              onClick={handleNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition hover:bg-gray-100"
            >
              →
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleVenues.map((venue) => (
          <VenueCard
            key={venue._id}
            venue={venue}
          />
        ))}
      </div>
    </section>
  );
}
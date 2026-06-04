import { useEffect, useState } from "react";
import { getVenues } from "../../services/venue.service.js";
import VenueCard from "../../components/VenueCard.jsx";

export function Venue() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);

        const response = await getVenues(page);

        setVenues(response.data);
        setTotalPages(response.pagination.totalPages);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [page]);

  if (loading) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Venues</h1>
      <p>Loading venues...</p>
    </div>
  );
}

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        Venues
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue._id}
            venue={venue}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-10">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import { getVenues } from "../../services/venue.service.js";
import VenueCard from "../../components/VenueCard.jsx";

export function Venue() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadVenues();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-8">
        Venues
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <VenueCard
            key={venue._id}
            venue={venue}
          />
        ))}
      </div>

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { getVenues } from "../../services/venue.service.js";
import { getVenueCategories } from "../../services/venueCategory.service.js";
import { HomeVenueSection } from "../../components/HomeVenueSection.jsx";

function getRandomCategories(categories, count = 2) {
  const shuffled = [...categories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function Home() {
  const [venues, setVenues] = useState([]);
  const [categories, setCategories] = useState([]);

  const selectedCategories = useMemo(() => {
    if (!categories.length) return [];

    const stored = sessionStorage.getItem("homeCategories");

    if (stored) {
      return JSON.parse(stored);
    }

    const categoryNames = categories.map(
      (category) => category.name
    );

    const randomCategories =
      getRandomCategories(categoryNames);

    sessionStorage.setItem(
      "homeCategories",
      JSON.stringify(randomCategories)
    );

    return randomCategories;
  }, [categories]);

  useEffect(() => {
    async function loadData() {
      try {
        const venueResponse = await getVenues();
        const categoryResponse = await getVenueCategories();

        setVenues(venueResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);


  return (
    <div className="px-6 py-8">

      {/* Hero Banner */}

      <HomeVenueSection
        title="Top Rated Venues"
        venues={venues.slice(0, 4)}
      />

      <HomeVenueSection
        title="Best Prices"
        venues={[...venues]
          .sort((a, b) => a.basePrice - b.basePrice)
          .slice(0, 4)}
      />

      {selectedCategories[0] && (
        <HomeVenueSection
          title={`Top ${selectedCategories[0]}`}
          venues={venues
            .filter(
              (venue) =>
                venue.venueCategory?.name === selectedCategories[0]
            )
            .slice(0, 4)}
        />
      )}

      {selectedCategories[1] && (
        <HomeVenueSection
          title={`Top ${selectedCategories[1]}`}
          venues={venues
            .filter(
              (venue) =>
                venue.venueCategory?.name === selectedCategories[1]
            )
            .slice(0, 4)}
        />
      )}

    </div>
  );
}
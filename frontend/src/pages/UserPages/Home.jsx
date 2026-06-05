import { useEffect, useMemo, useState } from "react";
import { getVenues } from "../../services/venue.service.js";
import { getVenueCategories } from "../../services/venueCategory.service.js";
import HomeVenueSection from "../../components/HomeVenueSection.jsx";
import HomeBannerSection from "../../components/HomeBannerSection.jsx"

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
        setCategories(categoryResponse);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  const category1 = categories.find(
    (category) => category.name === selectedCategories[0]
  );

  const category2 = categories.find(
    (category) => category.name === selectedCategories[1]
  );


  return (
    <div className="px-6 py-8">

      <HomeBannerSection />


      <HomeVenueSection
        title="Top Picks"
        venues={venues.slice(0, 4)}
        showAllLink="/venue"
      />

      <HomeVenueSection
        title="Value Picks"
        venues={[...venues]
          .sort((a, b) => a.basePrice - b.basePrice)
          .slice(0, 4)}
        showAllLink="/venue"
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
          showAllLink={`/venue?category=${category1?.identifier}`}
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
          showAllLink={`/venue?category=${category2?.identifier}`}
        />
      )}

    </div>
  );
}
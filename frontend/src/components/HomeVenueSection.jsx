import VenueCard from "./HomeVenueCard.jsx";

export default function HomeVenueSection({
  title,
  venues,
}) {
  return (
    <section className="mb-12">

      <h2 className="mb-4 text-2xl font-semibold">
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {venues.map((venue) => (
          <VenueCard
            key={venue._id}
            venue={venue}
          />
        ))}

      </div>

    </section>
  );
}
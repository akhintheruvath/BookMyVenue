import { useNavigate } from "react-router-dom";

const pendingVenues = [
  {
    id: 1,
    name: "Grand Palace Convention Center",
    owner: "John Doe",
    location: "Kochi",
    submittedAt: "20 Jun 2026",
  },
  {
    id: 2,
    name: "Royal Garden Hall",
    owner: "Sarah Johnson",
    location: "Thrissur",
    submittedAt: "21 Jun 2026",
  },
  {
    id: 3,
    name: "Skyline Events",
    owner: "David Thomas",
    location: "Ernakulam",
    submittedAt: "22 Jun 2026",
  },
];

export function AdminVenueApprovals() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Venue Approvals
        </h1>
        <p className="mt-2 text-gray-500">
          Review and approve submitted venues.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Search venues..."
          className="w-80 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-red-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-sm text-gray-600">
              <th className="px-6 py-4">Venue Name</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4">Submitted On</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingVenues.map((venue) => (
              <tr
                key={venue.id}
                className="border-t border-gray-100"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {venue.name}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {venue.owner}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {venue.location}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {venue.submittedAt}
                </td>

                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() =>
                      navigate(`/admin/venues/${venue.id}`)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {pendingVenues.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-500"
                >
                  No venues waiting for approval.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
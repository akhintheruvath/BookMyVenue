import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VenueForm from "../../components/venueOwner/VenueForm.jsx";
import { getVenueById } from "../../services/venue.service.js";
import { updateVenue } from "../../services/venueOwner.service.js";

export function EditVenuePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        async function loadVenue() {
            try {
                const response = await getVenueById(id);
                setVenue(response.data);
            } catch (err) {
                setLoadError(err.message || "Failed to load venue.");
            } finally {
                setLoading(false);
            }
        }
        loadVenue();
    }, [id]);

    // `intent` is "draft" | "submit" — passed from VenueForm's button clicks.
    async function handleSubmit(payload, intent) {
        await updateVenue(id, { ...payload, intent });
        navigate("/venue-owner/my-venues");
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-sm text-gray-500">
                Loading venue…
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex items-center justify-center py-20 text-sm text-red-600">
                {loadError}
            </div>
        );
    }

    return (
        <VenueForm
            mode="edit"
            initialValues={venue}
            onSubmit={handleSubmit}
        />
    );
}
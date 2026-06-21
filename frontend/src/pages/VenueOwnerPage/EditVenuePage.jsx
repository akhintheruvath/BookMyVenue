import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VenueForm from "../../components/venueOwner/VenueForm.jsx";
import { getVenueOwnerVenueById, updateVenue, submitVenue } from "../../services/venueOwner.service.js";
import { showInfo } from "../../utils/toastBus";

export function EditVenuePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        async function loadVenue() {
            try {
                const data = await getVenueOwnerVenueById(id);
                setVenue(data);
            } catch (err) {
                setLoadError(err.message || "Failed to load venue.");
            } finally {
                setLoading(false);
            }
        }
        loadVenue();
    }, [id]);

    // Debounced autosave from the form — persists partial draft fields.
    async function handleAutosave(fields) {
        await updateVenue(id, fields);
    }

    // "Submit for Approval". Lets errors propagate so VenueForm can map a
    // missing-fields 400 onto the individual inputs.
    async function handleSubmit(payload) {
        await updateVenue(id, payload);
        await submitVenue(id);
        showInfo("Venue submitted for review");
        navigate("/venue-owner/my-venues");
    }

    function handleContinueLater() {
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
            initialValues={venue}
            onAutosave={handleAutosave}
            onSubmit={handleSubmit}
            onContinueLater={handleContinueLater}
        />
    );
}
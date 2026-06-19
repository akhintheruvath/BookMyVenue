import { useNavigate } from "react-router-dom";
import VenueForm from "../../components/venueOwner/VenueForm.jsx";
import { addVenue } from "../../services/venueOwner.service.js";

export function AddVenuePage() {
    const navigate = useNavigate();
    async function handleSubmit(payload, intent) {
        await addVenue({ ...payload, intent });
        navigate("/venue-owner/my-venues");
    }

    return (
        <VenueForm
            mode="create"
            initialValues={{}}
            onSubmit={handleSubmit}
        />
    );
}
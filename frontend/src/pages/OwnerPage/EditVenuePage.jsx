import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import VenueForm from "../../components/venueOwner/VenueForm";
import { getVenueById } from "../../services/venue.service.js";

export function EditVenuePage() {
    const { id } = useParams();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVenue = async () => {
            try {
                const response = await getVenueById(id);
                setVenue(response.data);
                console.log(response.data)
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadVenue();
    }, [id]);

    if (loading) {
        return <p>Loading venue...</p>;
    }

    return (
        <VenueForm
            mode="edit"
            initialValues={venue}
        />
    );
}
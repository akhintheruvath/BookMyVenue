import { useParams } from "react-router-dom";

export function VenueDetails() {
    const { id } = useParams();

    return (
        <div>
            <h1>Venue Details</h1>
            <p>Venue ID: {id}</p>
        </div>
    )
}
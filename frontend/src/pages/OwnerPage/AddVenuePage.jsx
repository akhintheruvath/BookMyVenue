import VenueForm from "../../components/venueOwner/VenueForm.jsx"
export function AddVenuePage(){
    return(
        <VenueForm
        mode="create"
      initialValues={null}
      />
    )
}
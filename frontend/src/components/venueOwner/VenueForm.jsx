import { useState, useEffect } from "react";
import { getVenueCategories } from "../../services/venueCategory.service.js";

export default function VenueForm({
    mode = "create",
    initialValues = {},
    onSubmit,
}) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [formData, setFormData] = useState({
        name: initialValues.name || "",
        description: initialValues.description || "",
        venueCategory: initialValues.venueCategory || "",

        capacity: initialValues.capacity || "",
        basePrice: initialValues.basePrice || "",

        addressLine: initialValues.addressLine || "",
        city: initialValues.city || "",
        district: initialValues.district || "",
        state: initialValues.state || "",
        pincode: initialValues.pincode || "",

        latitude:
            initialValues.location?.coordinates?.[1] || "",
        longitude:
            initialValues.location?.coordinates?.[0] || "",

        images: initialValues.images || [],
    });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(formData);
        }
    }

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getVenueCategories();
                setCategories(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingCategories(false);
            }
        }

        loadCategories();
    }, []);

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {mode === "edit"
                        ? "Edit Venue"
                        : "Add New Venue"}
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    {mode === "edit"
                        ? "Update your venue information."
                        : "Create a venue listing and submit it for approval."}
                </p>
            </div>

            {/* Basic Information */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Basic Information
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Venue Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Venue Category
                        </label>

                        <select
                            name="venueCategory"
                            value={formData.venueCategory}
                            onChange={handleChange}
                            disabled={loadingCategories}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        >
                            <option value="">
                                Select Category
                            </option>

                            {categories.map((category) => (
                                <option
                                    key={category._id}
                                    value={category._id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Venue Details */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Venue Details
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Capacity
                        </label>

                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Base Price
                        </label>

                        <input
                            type="number"
                            name="basePrice"
                            value={formData.basePrice}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2"
                        />
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Location
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        name="addressLine"
                        placeholder="Address Line"
                        value={formData.addressLine}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2"
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        />

                        <input
                            type="text"
                            name="district"
                            placeholder="District"
                            value={formData.district}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        />

                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        />
                    </div>
                </div>
            </section>

            {/* Coordinates */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Coordinates
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <input
                        type="text"
                        name="latitude"
                        placeholder="Latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="rounded-lg border border-gray-300 px-4 py-2"
                    />

                    <input
                        type="text"
                        name="longitude"
                        placeholder="Longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="rounded-lg border border-gray-300 px-4 py-2"
                    />
                </div>
            </section>

            {/* Images */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    Images
                </h2>

                <input
                    type="file"
                    multiple
                    className="block w-full"
                />
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-4 py-2"
                >
                    Save Draft
                </button>

                <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                    {mode === "edit"
                        ? "Save Changes"
                        : "Submit For Approval"}
                </button>
            </div>
        </form>
    );
}
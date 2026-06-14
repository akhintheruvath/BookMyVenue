import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getVenueCategories } from "../../services/venueCategory.service.js";

const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad",
    "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod",
];

// --- Small helpers -----------------------------------------------------------

function FieldError({ error }) {
    if (!error) return null;
    return <p className="mt-1.5 text-sm text-red-600">{error.message}</p>;
}

function inputCls(hasError) {
    return (
        "w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 " +
        "placeholder-gray-400 transition focus:outline-none focus:ring-2 " +
        (hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-300 focus:border-red-500 focus:ring-red-100")
    );
}

// ----------------------------------------------------------------------------

export default function VenueForm({ mode = "create", initialValues = {}, onSubmit }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [imageFiles, setImageFiles] = useState([]);   // new uploads
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [activeIntent, setActiveIntent] = useState("draft");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name:        initialValues.name        || "",
            description: initialValues.description || "",
            venueCategory: initialValues.venueCategory?._id
                        || initialValues.venueCategory
                        || "",
            capacity:    initialValues.capacity    || "",
            basePrice:   initialValues.basePrice   || "",
            addressLine: initialValues.addressLine || "",
            city:        initialValues.city        || "",
            district:    initialValues.district    || "",
            state:       initialValues.state       || "",
            pincode:     initialValues.pincode     || "",
            latitude:    initialValues.location?.coordinates?.[1] || "",
            longitude:   initialValues.location?.coordinates?.[0] || "",
        },
    });

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

    async function handleFormSubmit(data) {
        if (!onSubmit) return;

        setSubmitting(true);
        setSubmitError("");

        const payload = {
            name:           data.name.trim(),
            description:    data.description.trim(),
            venueCategory:  data.venueCategory,
            capacity:       Number(data.capacity),
            basePrice:      Number(data.basePrice),
            addressLine:    data.addressLine.trim(),
            city:           data.city.trim(),
            district:       data.district,
            state:          data.state.trim(),
            pincode:        data.pincode.trim(),
            ...(data.latitude && data.longitude
                ? {
                    location: {
                        type: "Point",
                        coordinates: [
                            parseFloat(data.longitude),
                            parseFloat(data.latitude),
                        ],
                    },
                  }
                : {}),
            imageFiles,   // caller decides how to upload
        };

        try {
            await onSubmit(payload, activeIntent);
        } catch (err) {
            setSubmitError(err.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    function triggerSubmit(intent) {
        setActiveIntent(intent);
        handleSubmit(handleFormSubmit)();
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {mode === "edit" ? "Edit Venue" : "Add New Venue"}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {mode === "edit"
                        ? "Update your venue information."
                        : "Create a venue listing and submit it for approval."}
                </p>
            </div>

            {/* Global submit error */}
            {submitError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                </div>
            )}

            {/* ── Basic Information ─────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Basic Information
                </h2>

                <div className="space-y-5">
                    {/* Venue Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Venue Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Royal Grand Hall"
                            className={inputCls(errors.name)}
                            {...register("name", {
                                required: "Venue name is required",
                                minLength: { value: 3, message: "Name must be at least 3 characters" },
                                maxLength: { value: 100, message: "Name must be under 100 characters" },
                            })}
                        />
                        <FieldError error={errors.name} />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe the venue — ambiance, highlights, what makes it special..."
                            className={inputCls(errors.description)}
                            {...register("description", {
                                required: "Description is required",
                                minLength: { value: 20, message: "Description must be at least 20 characters" },
                                maxLength: { value: 2000, message: "Description must be under 2000 characters" },
                            })}
                        />
                        <FieldError error={errors.description} />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Venue Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            disabled={loadingCategories}
                            className={inputCls(errors.venueCategory) + " cursor-pointer"}
                            {...register("venueCategory", {
                                required: "Please select a category",
                            })}
                        >
                            <option value="">
                                {loadingCategories ? "Loading categories…" : "Select a category"}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <FieldError error={errors.venueCategory} />
                    </div>
                </div>
            </section>

            {/* ── Venue Details ─────────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Venue Details
                </h2>

                <div className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Capacity (guests) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            placeholder="e.g. 500"
                            className={inputCls(errors.capacity)}
                            {...register("capacity", {
                                required: "Capacity is required",
                                min: { value: 1, message: "Capacity must be at least 1" },
                                max: { value: 100000, message: "Capacity seems too large" },
                                valueAsNumber: true,
                            })}
                        />
                        <FieldError error={errors.capacity} />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Base Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            placeholder="e.g. 50000"
                            className={inputCls(errors.basePrice)}
                            {...register("basePrice", {
                                required: "Base price is required",
                                min: { value: 0, message: "Price cannot be negative" },
                                valueAsNumber: true,
                            })}
                        />
                        <FieldError error={errors.basePrice} />
                    </div>
                </div>
            </section>

            {/* ── Location ──────────────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                    Location
                </h2>

                <div className="space-y-4">
                    {/* Address Line */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Address Line <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 42 MG Road, Near City Mall"
                            className={inputCls(errors.addressLine)}
                            {...register("addressLine", {
                                required: "Address is required",
                                minLength: { value: 5, message: "Enter a full address" },
                            })}
                        />
                        <FieldError error={errors.addressLine} />
                    </div>

                    {/* City + District */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Kochi"
                                className={inputCls(errors.city)}
                                {...register("city", {
                                    required: "City is required",
                                })}
                            />
                            <FieldError error={errors.city} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                District <span className="text-red-500">*</span>
                            </label>
                            <select
                                className={inputCls(errors.district) + " cursor-pointer"}
                                {...register("district", {
                                    required: "Please select a district",
                                })}
                            >
                                <option value="">Select district</option>
                                {KERALA_DISTRICTS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            <FieldError error={errors.district} />
                        </div>
                    </div>

                    {/* State + Pincode */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Kerala"
                                className={inputCls(errors.state)}
                                {...register("state", {
                                    required: "State is required",
                                })}
                            />
                            <FieldError error={errors.state} />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Pincode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 682001"
                                maxLength={6}
                                className={inputCls(errors.pincode)}
                                {...register("pincode", {
                                    required: "Pincode is required",
                                    pattern: {
                                        value: /^\d{6}$/,
                                        message: "Enter a valid 6-digit pincode",
                                    },
                                })}
                            />
                            <FieldError error={errors.pincode} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Coordinates (optional) ────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                    Coordinates
                </h2>
                <p className="mb-5 text-sm text-gray-500">
                    Optional — used to show the venue on a map.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Latitude
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 9.9312"
                            className={inputCls(errors.latitude)}
                            {...register("latitude", {
                                pattern: {
                                    value: /^-?\d{1,2}(\.\d+)?$/,
                                    message: "Enter a valid latitude",
                                },
                            })}
                        />
                        <FieldError error={errors.latitude} />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Longitude
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 76.2673"
                            className={inputCls(errors.longitude)}
                            {...register("longitude", {
                                pattern: {
                                    value: /^-?\d{1,3}(\.\d+)?$/,
                                    message: "Enter a valid longitude",
                                },
                            })}
                        />
                        <FieldError error={errors.longitude} />
                    </div>
                </div>
            </section>

            {/* ── Images ────────────────────────────────────────────────── */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-lg font-semibold text-gray-900">
                    Images
                </h2>
                <p className="mb-4 text-sm text-gray-500">
                    Upload photos of the venue. JPG or PNG, up to 5 MB each.
                </p>

                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:rounded-lg file:border-0
                        file:bg-red-50 file:px-4 file:py-2
                        file:text-sm file:font-medium file:text-red-600
                        hover:file:bg-red-100"
                    onChange={(e) => setImageFiles(Array.from(e.target.files))}
                />

                {/* Existing images (edit mode) */}
                {mode === "edit" && initialValues.images?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        {initialValues.images.map((img, i) => (
                            <img
                                key={i}
                                src={img.url}
                                alt={`venue-${i}`}
                                className="h-20 w-28 rounded-lg object-cover border border-gray-200"
                            />
                        ))}
                        <p className="w-full text-xs text-gray-400 mt-1">
                            Uploading new files will replace the existing images.
                        </p>
                    </div>
                )}

                {/* Preview newly selected files */}
                {imageFiles.length > 0 && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-gray-600">
                            Selected ({imageFiles.length}):
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {imageFiles.map((file, i) => (
                                <div key={i} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-20 w-28 rounded-lg object-cover border border-gray-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setImageFiles((prev) =>
                                                prev.filter((_, idx) => idx !== i)
                                            )
                                        }
                                        className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-xs leading-none hover:bg-red-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ── Actions ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-3 pb-8">
                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => triggerSubmit("draft")}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700
                        transition hover:border-gray-400 hover:bg-gray-50
                        disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting && activeIntent === "draft"
                        ? "Saving…"
                        : "Save as Draft"}
                </button>

                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => triggerSubmit("submit")}
                    className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white
                        transition hover:bg-red-700
                        disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting && activeIntent === "submit"
                        ? "Submitting…"
                        : mode === "edit"
                        ? "Save Changes"
                        : "Submit for Approval"}
                </button>
            </div>
        </div>
    );
}
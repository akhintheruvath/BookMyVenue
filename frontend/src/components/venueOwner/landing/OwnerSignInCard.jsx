import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { InputWithIcon } from "../../shared/form/InputWithIcon.jsx";
import { PasswordField } from "../../shared/form/PasswordField.jsx";
import { EMAIL_PATTERN } from "../../shared/form/inputClasses.js";
import bmvLogo from "../../../assets/bmvLogo.svg";

// Email/password sign-in card for venue owners.
// UI only for now — the actual login call + navigation are wired in a later slice.
export function OwnerSignInCard({ onSwitchToSignUp }) {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    function onSubmit() {
        // TODO (next slice): call the login API and navigate to the dashboard.
    }

    return (
        <div className="w-full max-w-md lg:w-md lg:shrink-0">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                <div className="mb-6 text-center">
                    <img
                        src={bmvLogo}
                        alt="BookMyVenue"
                        className="mx-auto mb-4 h-14 w-14"
                    />
                    <h2 className="text-2xl font-bold text-gray-900">
                        Venue Owner Sign In
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Sign in to manage your venues and bookings.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <InputWithIcon
                        id="owner-email"
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email}
                        registration={register("email", {
                            required: "Email is required",
                            pattern: {
                                value: EMAIL_PATTERN,
                                message: "Enter a valid email address",
                            },
                        })}
                    />

                    <PasswordField
                        id="owner-password"
                        label="Password"
                        placeholder="Enter your password"
                        show={showPassword}
                        onToggle={() => setShowPassword((s) => !s)}
                        error={errors.password}
                        registration={register("password", {
                            required: "Password is required",
                        })}
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-red-600 py-3 text-white transition hover:bg-red-700"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    New to BookMyVenue?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToSignUp}
                        className="font-semibold text-red-600 hover:underline"
                    >
                        Create an account
                    </button>
                </p>
            </div>
        </div>
    );
}

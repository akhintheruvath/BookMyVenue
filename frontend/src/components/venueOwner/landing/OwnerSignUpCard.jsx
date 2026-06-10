import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail } from "lucide-react";
import { InputWithIcon } from "../../shared/form/InputWithIcon.jsx";
import { PasswordField } from "../../shared/form/PasswordField.jsx";
import { EMAIL_PATTERN } from "../../shared/form/inputClasses.js";
import bmvLogo from "../../../assets/bmvLogo.svg";

// Email/password sign-up card for venue owners. Shown in place of the sign-in
// card when the user clicks "Create an account" (parent toggles between them).
// UI only for now — the actual register call + navigation are wired in a later slice.
export function OwnerSignUpCard({ onSwitchToSignIn }) {
    // A single toggle controls both the password and confirm-password fields.
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm();

    function onSubmit() {
        // TODO (next slice): call the register API and navigate to the dashboard.
    }

    const togglePassword = () => setShowPassword((s) => !s);

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
                        Create your account
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Start listing and managing your venues.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <InputWithIcon
                        id="owner-name"
                        label="Name"
                        icon={User}
                        type="text"
                        placeholder="Your name"
                        error={errors.name}
                        registration={register("name", {
                            required: "Name is required",
                            validate: (value) =>
                                value.trim().length > 0 || "Name is required",
                        })}
                    />

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
                        placeholder="At least 8 characters"
                        show={showPassword}
                        onToggle={togglePassword}
                        error={errors.password}
                        registration={register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                        })}
                    />

                    <PasswordField
                        id="owner-confirm-password"
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        show={showPassword}
                        onToggle={togglePassword}
                        error={errors.confirmPassword}
                        registration={register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: (value) =>
                                value === getValues("password") ||
                                "Passwords do not match",
                        })}
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-red-600 py-3 text-white transition hover:bg-red-700"
                    >
                        Create account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToSignIn}
                        className="font-semibold text-red-600 hover:underline"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}

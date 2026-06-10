import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";

// Simple email format check, reused for the email field rule.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // Shared input styling; swaps the border colour when the field has an error.
    const inputClass = (hasError) =>
        "w-full rounded-lg border py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 " +
        (hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
            : "border-gray-300 focus:border-red-500 focus:ring-red-100");

    return (
        <div className="w-full max-w-md lg:w-md lg:shrink-0">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 inline-flex rounded-xl bg-red-50 p-3 text-red-600">
                        <Building2 size={26} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Start listing and managing your venues.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div>
                        <label
                            htmlFor="owner-name"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <div className="relative">
                            <User
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="owner-name"
                                type="text"
                                placeholder="Your name"
                                className={inputClass(errors.name)}
                                {...register("name", {
                                    required: "Name is required",
                                    validate: (value) =>
                                        value.trim().length > 0 || "Name is required",
                                })}
                            />
                        </div>
                        {errors.name && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="owner-email"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <Mail
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="owner-email"
                                type="email"
                                placeholder="you@example.com"
                                className={inputClass(errors.email)}
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: EMAIL_PATTERN,
                                        message: "Enter a valid email address",
                                    },
                                })}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="owner-password"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="owner-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 8 characters"
                                className={inputClass(errors.password) + " pr-10"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="owner-confirm-password"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="owner-confirm-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                className={inputClass(errors.confirmPassword) + " pr-10"}
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === getValues("password") ||
                                        "Passwords do not match",
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

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

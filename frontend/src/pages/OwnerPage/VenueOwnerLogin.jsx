import { useState } from "react";
import { OwnerLandingInfo } from "../../components/venueOwner/landing/OwnerLandingInfo.jsx";
import { OwnerSignInCard } from "../../components/venueOwner/landing/OwnerSignInCard.jsx";
import { OwnerSignUpCard } from "../../components/venueOwner/landing/OwnerSignUpCard.jsx";

export function VenueOwnerLogin() {
    const [mode, setMode] = useState("signin");

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center gap-10 px-4 py-10 lg:flex-row lg:gap-16 lg:py-0">
                <OwnerLandingInfo />
                {mode === "signin" ? (
                    <OwnerSignInCard onSwitchToSignUp={() => setMode("signup")} />
                ) : (
                    <OwnerSignUpCard onSwitchToSignIn={() => setMode("signin")} />
                )}
            </div>
        </div>
    );
}
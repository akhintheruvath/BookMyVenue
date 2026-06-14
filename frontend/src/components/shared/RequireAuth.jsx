import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext.js";

// Reusable route guard. Wrap a group of routes with it as a layout route so
// every nested route is protected by default.
//
// On denial — not logged in, OR logged in with the wrong role — the user is
// sent to that route's "area". Where that is depends on `loginPath`:
//
//   // venue owners only -> denial redirects to the owner sign-in page
//   <Route element={<RequireAuth roles={["venueOwner"]} loginPath="/venue-owner" />}>...</Route>
//
//   // admins only -> denial redirects to the admin sign-in page
//   <Route element={<RequireAuth roles={["admin"]} loginPath="/admin" />}>...</Route>
//
//   // customer area has no login page, just the global sign-in modal:
//   // omit loginPath -> denial sends them home and opens the modal
//   <Route element={<RequireAuth roles={["customer"]} />}>...</Route>
//
// `roles` is required — every guarded area belongs to a specific role. The user
// must be logged in AND have one of those roles to enter.
//
// Auth is already verified by AuthProvider (it validates the token against the
// backend on load and clears it if invalid/expired), so here we only read the
// resolved result.
export function RequireAuth({ roles, loginPath }) {
    const { user, loading, openSignin } = useAuth();

    // Wait for the initial token check so a hard refresh doesn't bounce a
    // logged-in user to the login page before their session is restored.
    if (loading) return null;

    const allowed = user && roles.includes(user.role);
    if (allowed) return <Outlet />;

    // Denied. Areas with their own sign-in page (owner/admin) redirect there.
    // Customer-area routes have no page — they fall back to the home page plus
    // the global sign-in modal.
    if (loginPath) {
        return <Navigate to={loginPath} replace />;
    }
    return <RedirectToSignInModal openSignin={openSignin} />;
}

// Customer-area denial: navigate home and open the sign-in modal. Opening the
// modal is a state update, so it has to run in an effect, not during render.
function RedirectToSignInModal({ openSignin }) {
    useEffect(() => {
        openSignin();
    }, [openSignin]);

    return <Navigate to="/" replace />;
}

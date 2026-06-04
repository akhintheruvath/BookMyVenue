const Users = require("../../models/user");
const { USER_ROLES, SELF_SIGNUP_ROLES } = require("../../constants/user");
const { signAuthToken } = require("../../utils/jwt");
const { verifyGoogleIdToken } = require("./shared");

// Human-readable tab name for each self-signup role, used in error messages.
const ROLE_TAB_LABEL = {
   [USER_ROLES.CUSTOMER]: "User",
   [USER_ROLES.VENUE_OWNER]: "Venue Owner",
};

// POST /auth/googleLogin
// Body: { idToken, role } — the Google ID token from the frontend, plus the
// role the chosen tab represents ("customer" or "venueOwner").
// Verifies the token, creates the user with that role (or enforces their
// existing role), and returns our own app JWT.
async function googleLogin(req, res) {
   try {
      const { idToken, role } = req.body || {};
      if (!idToken) {
         return res.status(400).json({ message: "idToken is required" });
      }
      if (!SELF_SIGNUP_ROLES.includes(role)) {
         return res.status(400).json({ message: "A valid role is required" });
      }

      // 1. Verify the token really came from Google and is meant for us(this application).
      let profile;
      try {
         profile = await verifyGoogleIdToken(idToken);
      } catch (err) {
         return res
            .status(401)
            .json({ error: err.message, message: "Invalid Google token" });
      }

      // 2. Email is the primary identity key — find the existing user by it.
      let user = await Users.findOne({ email: profile.email });

      if (user) {
         // An existing account's role is fixed. If they signed in via the wrong
         // tab, refuse and point them at the correct one.
         if (user.role !== role) {
            const correctTab = ROLE_TAB_LABEL[user.role] || "the correct";
            return res.status(409).json({
               message: `Account exists already, login on "${correctTab}" tab or use a different email if you want to become a ${ROLE_TAB_LABEL[role].toLowerCase()}.`,
            });
         }
         // Keep Google-sourced fields fresh and link googleId if missing.
         user.googleId = profile.googleId;
         user.name = user.name || profile.name; // first priority is for the existing name (Maybe user sets their name themeselves from the user profile edit page)
         user.picture = user.picture || profile.picture; // first priority is for the existing picture
         await user.save();
      } else {
         user = await Users.create({
            googleId: profile.googleId,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            role,
         });
      }

      // 3. Issue our own app JWT for subsequent authenticated requests.
      const token = signAuthToken(user);

      return res.status(200).json({ data: { token } });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Login failed" });
   }
}

module.exports = googleLogin;

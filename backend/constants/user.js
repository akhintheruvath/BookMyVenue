const USER_ROLES = Object.freeze({
   CUSTOMER: "customer", // customer books venues (default for new sign-ups from user sign up tab)
   VENUE_OWNER: "venueOwner", // lists and manages venues
   ADMIN: "admin", // platform administration
});

const USER_ROLE_VALUES = Object.values(USER_ROLES);

// Roles a user may pick for themselves when signing up via the public tabs.
// "admin" is deliberately excluded — it can never be self-assigned.
const SELF_SIGNUP_ROLES = Object.freeze([
   USER_ROLES.CUSTOMER,
   USER_ROLES.VENUE_OWNER,
]);

module.exports = { USER_ROLES, USER_ROLE_VALUES, SELF_SIGNUP_ROLES };

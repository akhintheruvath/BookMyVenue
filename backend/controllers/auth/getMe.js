// GET /auth/me — returns the currently authenticated user.
// authenticate has already verified the token and attached req.user.
async function getMe(req, res) {
   try {
      const { _id, email, name, picture, role } = req.user;
      const user = {
         id: _id.toString(),
         email,
         name,
         picture,
         role,
      };

      return res.status(200).json({ data: { user } });
   } catch (err) {
      return res
         .status(500)
         .json({ error: err.message, message: "Failed to fetch user" });
   }
}

module.exports = getMe;

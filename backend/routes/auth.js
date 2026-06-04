const express = require("express");
const googleLogin = require("../controllers/auth/googleLogin");
const getMe = require("../controllers/auth/getMe");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/googleLogin", googleLogin);
router.get("/me", authenticate, getMe);

module.exports = router;

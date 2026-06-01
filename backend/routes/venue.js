const express = require("express");
const listVenues = require("../controllers/venue/listVenues");
const getVenueById = require("../controllers/venue/getVenueById");

const router = express.Router();

router.get("/", listVenues);
router.get("/:id", getVenueById);

module.exports = router;

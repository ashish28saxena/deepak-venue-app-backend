const express = require("express");
const { createVenue, getVenues, getVenueslist } = require("../controllers/Venuecontroller");
const { uploadAlbumImages } = require("../middleware/upload");

const router = express.Router();

router.post("/", uploadAlbumImages, createVenue);
router.get("/", getVenues);
router.get("/:id", getVenueslist);


module.exports = router;

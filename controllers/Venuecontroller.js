const fs = require("fs");
const Venue = require("../models/Venue");

// upload field name -> album category
const CATEGORY_FIELDS = {
  entranceImages: "Entrance & Exterior",
  foodImages: "Food & Catering",
  stageImages: "Stage & Mandap",
  hallImages: "Banquet Hall",
};

const removeUploadedFiles = (files = {}) => {
  Object.values(files)
    .flat()
    .forEach((f) => fs.unlink(f.path, () => {}));
};

// POST /api/venues  (multipart/form-data)
exports.createVenue = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const files = req.files || {};

    const albums = Object.entries(CATEGORY_FIELDS)
      .map(([field, category]) => ({
        category,
        images: (files[field] || []).map((f) => `${baseUrl}/uploads/${f.filename}`),
      }))
      .filter((a) => a.images.length > 0);

    const venue = await Venue.create({ ...req.body, albums });

    res.status(201).json({
      success: true,
      message: "Venue created successfully",
      data: venue,
    });
  } catch (err) {
    removeUploadedFiles(req.files); // save fail hua to uploaded files delete kar do

    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/venues
exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json({ success: true, data: venues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET /api/venues/id
exports.getVenueslist = async (req, res) => {
  try {
    const { id } = req.params;

    const venues = await Venue.findById(id);

    if (!venues) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.json({
      success: true,
      data: venues,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



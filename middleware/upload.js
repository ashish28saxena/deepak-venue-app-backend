const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) return cb(null, true);
  cb(new Error("Sirf JPG, PNG, WEBP ya GIF images allowed hain"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

// Album ki har category ke liye ek field (multiple images)
const albumFields = upload.fields([
  { name: "entranceImages", maxCount: 10 }, // Entrance & Exterior
  { name: "foodImages", maxCount: 10 },     // Food & Catering
  { name: "stageImages", maxCount: 10 },    // Stage & Mandap
  { name: "hallImages", maxCount: 10 },     // Banquet Hall
]);

// multer errors ko clean JSON me return karta hai
const uploadAlbumImages = (req, res, next) => {
  albumFields(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Har image 5MB se chhoti honi chahiye"
        : err.code === "LIMIT_UNEXPECTED_FILE"
        ? "Ek category me maximum 10 images allowed hain"
        : err.message;
    res.status(400).json({ success: false, errors: [message] });
  });
};

module.exports = { uploadAlbumImages };

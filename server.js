const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Uploaded images serve karo (frontend alag port par hai, isliye CORP header zaroori hai)
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Routes
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/Venueroutes");
const contactRoutesurl=require("./routes/contactRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/contact", contactRoutesurl);

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));





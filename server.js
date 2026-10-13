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
const venueRoutes = require("./routes/venueroutes");
const contactRoutesurl=require("./routes/contactRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/contact", contactRoutesurl);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
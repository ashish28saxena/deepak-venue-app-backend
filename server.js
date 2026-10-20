
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/Venueroutes");
const contactRoutes = require("./routes/contactRoutes");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});

// Reuse MongoDB connection across serverless invocations
let cachedConnection = null;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// Export app for Vercel
module.exports = app;

// Local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

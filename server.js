const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 const authRoutes = require("./routes/authRoutes");
 const venueRoutes = require("./routes/Venueroutes");
const contactRoutesurl=require("./routes/contactRoutes");

// Routes
//app.use("/api/venues", require("./routes/Venueroutes"));

 app.use("/api/auth", authRoutes);
 app.use("/api/venues", venueRoutes);
 app.use("/api/contact", contactRoutesurl);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running"
  });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

// Export Express app for Vercel
module.exports = app;


if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}






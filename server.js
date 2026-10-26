
// const express = require("express");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const cors = require("cors");

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: [
//     "http://localhost:3000",
//     "http://localhost:5173",
//     "https://shubhlagnmart-alpha.vercel.app"
//   ],
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// // MongoDB connection cache for Vercel serverless
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = {
//     conn: null,
//     promise: null,
//   };
// }

// async function connectDB() {
//   if (cached.conn && mongoose.connection.readyState === 1) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const uri = process.env.MONGODB_URI;

//     if (!uri) {
//       throw new Error("MONGODB_URI environment variable is missing");
//     }

//     cached.promise = mongoose.connect(uri, {
//       serverSelectionTimeoutMS: 10000,
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//     console.log("MongoDB connected successfully");
//     return cached.conn;
//   } catch (error) {
//     cached.promise = null;
//     cached.conn = null;
//     console.error("MongoDB connection failed:", error.message);
//     throw error;
//   }
// }

// // Health check
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "API is running",
//   });
// });

// // Connect to MongoDB BEFORE running API routes
// app.use(async (req, res, next) => {
//   try {
//     await connectDB();
//     next();
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Database connection failed",
//     });
//   }
// });

// // Import routes
// const authRoutes = require("./routes/authRoutes");
// const venueRoutes = require("./routes/Venueroutes");
// const contactRoutes = require("./routes/contactRoutes");

// // Register routes AFTER the database middleware
// app.use("/api/auth", authRoutes);
// app.use("/api/venues", venueRoutes);
// app.use("/api/contact", contactRoutes);

// // Export Express app for Vercel
// module.exports = app;



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
const authroutes = require("./routes/authRoutes");
const venueRoutes = require("./routes/venueroutes");
const contactRoutesurl=require("./routes/contactRoutes");

app.use("/api/auth", authroutes);
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

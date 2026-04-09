// index.js
// Main Express server entry point for EduMaster backend.
// Connects to MongoDB, sets up middleware, mounts routes, and starts listening.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URI, PORT } = require("./config");

// Import route handlers
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");

const app = express();

// ─────────────────────────────────────────────
// Global Middleware
// ─────────────────────────────────────────────

// Allow requests from the React frontend (localhost:5173 is Vite's default)
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use("/user", userRoutes);       // /user/signup, /user/signin, /user/purchases
app.use("/courses", courseRoutes);  // /courses/preview, /courses/purchase
app.use("/admin", adminRoutes);     // /admin/signup, /admin/signin, /admin/course

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "EduMaster API is running! 🚀" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// ─────────────────────────────────────────────
// Database Connection + Server Start
// ─────────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 EduMaster server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Exit if DB connection fails
  });

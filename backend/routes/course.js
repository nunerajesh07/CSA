// routes/course.js
// Handles public course listing and protected course purchases.

const express = require("express");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const userAuth = require("../middleware/userAuth");

const router = express.Router();

// ─────────────────────────────────────────────
// GET /courses/preview
// Public route — returns all available courses.
// No authentication required.
// ─────────────────────────────────────────────
router.get("/preview", async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }); // newest first
    res.json({ courses });
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────
// POST /courses/purchase
// Protected — user must be logged in.
// Creates a purchase record; prevents duplicates.
// ─────────────────────────────────────────────
router.post("/purchase", userAuth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId; // Set by userAuth middleware

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Check if user already purchased this course
    const alreadyPurchased = await Purchase.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(409).json({ message: "You already own this course!" });
    }

    // Create the purchase record
    await Purchase.create({ userId, courseId });

    res.status(201).json({ message: "Course purchased successfully! 🎉" });
  } catch (err) {
    // MongoDB duplicate key error (fallback for race conditions)
    if (err.code === 11000) {
      return res.status(409).json({ message: "You already own this course!" });
    }
    console.error("Purchase error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;

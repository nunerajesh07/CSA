// routes/admin.js
// Handles admin signup, signin, and all course management (CRUD).

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const adminAuth = require("../middleware/adminAuth");
const { JWT_ADMIN_SECRET } = require("../config");

const router = express.Router();

// ─────────────────────────────────────────────
// POST /admin/signup
// Creates a new admin account
// ─────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Check for duplicate email
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstname,
      lastname,
    });

    // Sign with ADMIN secret (different from user secret!)
    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Admin account created successfully!",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname,
      },
    });
  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────
// POST /admin/signin
// Authenticates admin and returns JWT
// ─────────────────────────────────────────────
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful!",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname,
      },
    });
  } catch (err) {
    console.error("Admin signin error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────
// POST /admin/course
// Protected — admin creates a new course
// ─────────────────────────────────────────────
router.post("/course", adminAuth, async (req, res) => {
  try {
    const { title, description, price, imageURL } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Title, description, and price are required." });
    }

    const course = await Course.create({
      title,
      description,
      price: Number(price),
      imageURL: imageURL || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
      creatorId: req.adminId, // From adminAuth middleware
    });

    res.status(201).json({ message: "Course created successfully!", course });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────
// PUT /admin/course
// Protected — admin updates an existing course
// courseId must be sent in request body
// ─────────────────────────────────────────────
router.put("/course", adminAuth, async (req, res) => {
  try {
    const { courseId, title, description, price, imageURL } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    // Make sure this course was created by the requesting admin
    const course = await Course.findOne({ _id: courseId, creatorId: req.adminId });
    if (!course) {
      return res.status(404).json({ message: "Course not found or access denied." });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = Number(price);
    if (imageURL) course.imageURL = imageURL;

    await course.save();

    res.json({ message: "Course updated successfully!", course });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});


router.get("/course/bulk", adminAuth, async (req, res) => {
  try {
    const courses = await Course.find({ creatorId: req.adminId }).sort({
      createdAt: -1,
    });

    res.json({ courses });
  } catch (err) {
    console.error("Get admin courses error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;

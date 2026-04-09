// routes/user.js
// Handles all user-related operations: signup, signin, and purchase history.

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const Course = require("../models/Course");
const userAuth = require("../middleware/userAuth");
const { JWT_USER_SECRET } = require("../config");

const router = express.Router();

// ─────────────────────────────────────────────
// POST /user/signup
// Creates a new user account with hashed password
// ─────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    // Validate required fields
    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Hash the password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstname,
      lastname,
    });

    // Generate JWT token for immediate login after signup
    const token = jwt.sign({ id: user._id }, JWT_USER_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    console.error("User signup error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────
// POST /user/signin
// Authenticates user and returns JWT
// ─────────────────────────────────────────────
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare submitted password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_USER_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    console.error("User signin error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─────────────────────────────────────────────
// GET /user/purchases
// Returns all courses purchased by the logged-in user
// Protected: requires a valid user JWT
// ─────────────────────────────────────────────
router.get("/purchases", userAuth, async (req, res) => {
  try {
    // Find all purchase records for this user
    const purchases = await Purchase.find({ userId: req.userId }).populate(
      "courseId" // Replace courseId ObjectId with full course data
    );

    // Extract just the course objects (filter out null in case a course was deleted)
    const courses = purchases
      .map((p) => p.courseId)
      .filter((c) => c !== null);

    res.json({ courses });
  } catch (err) {
    console.error("Get purchases error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;

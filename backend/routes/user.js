
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const Course = require("../models/Course");
const { requireAuth, requireUser } = require("../middleware/auth");
const { JWT_USER_SECRET } = require("../config");

const router = express.Router();




router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstname,
      lastname,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_USER_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("User signup error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});




router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_USER_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("User signin error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});





router.get("/purchases", requireAuth, requireUser, async (req, res) => {
  try {

    const purchases = await Purchase.find({ userId: req.userId }).populate(
      "courseId" 
    );

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

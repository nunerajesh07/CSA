


const express = require("express");
const Course = require("../models/Course");
const Purchase = require("../models/Purchase");
const { requireAuth, requireUser } = require("../middleware/auth");

const router = express.Router();





router.get("/preview", async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ createdAt: -1 }); 
    res.json({ courses });
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});





router.post("/purchase", requireAuth, requireUser, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.userId; 

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const alreadyPurchased = await Purchase.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(409).json({ message: "You already own this course!" });
    }

    await Purchase.create({ userId, courseId });

    res.status(201).json({ message: "Course purchased successfully! 🎉" });
  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({ message: "You already own this course!" });
    }
    console.error("Purchase error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;

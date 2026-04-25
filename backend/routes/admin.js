


const express = require("express");
const Course = require("../models/Course");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();




router.post("/course", requireAuth, requireAdmin, async (req, res) => {
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
      creatorId: req.userId,
    });

    res.status(201).json({ message: "Course created successfully!", course });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});





router.put("/course", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { courseId, title, description, price, imageURL } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const course = await Course.findOne({ _id: courseId, creatorId: req.userId });
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


router.get("/course/bulk", requireAuth, requireAdmin, async (req, res) => {
  try {
    const courses = await Course.find({ creatorId: req.userId }).sort({
      createdAt: -1,
    });

    res.json({ courses });
  } catch (err) {
    console.error("Get admin courses error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;

// models/Purchase.js
// Tracks which user purchased which course.
// Unique compound index prevents duplicate purchases (same user + same course).

const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: one user can only purchase a course once
purchaseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Purchase", purchaseSchema);

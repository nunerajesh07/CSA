
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URI, PORT } = require("./config");

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");

const app = express();




const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null;

app.use(
  cors({
    origin: [frontendUrl, "http://localhost:5173", "http://localhost:3000"].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());



app.use("/user", userRoutes);
app.use("/courses", courseRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CSA API is running! " });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Global Error]:", err.stack);
  res.status(500).json({ 
    message: "Something went wrong on the server.",
    error: process.env.NODE_ENV === "production" ? {} : err.message
  });
});



mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(` CSA server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err.message);
    process.exit(1);
  });

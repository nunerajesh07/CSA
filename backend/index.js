
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGO_URI, PORT } = require("./config");

const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const adminRoutes = require("./routes/admin");

const app = express();




app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
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

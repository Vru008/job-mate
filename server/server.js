require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const jobRoutes = require("./routes/jobRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // important

// Routes
app.use("/api/jobs", jobRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("DB Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("JobMate Backend Running 🚀");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const jobRoutes = require("./Routes/jobRoutes");
const aiRoutes = require("./Routes/aiRoutes");
const authRoutes = require("./Routes/authRoutes");
const applicationRoutes = require("./Routes/applicationRoutes");
const adminRoutes = require("./Routes/adminRoutes");

const Job = require("./Models/job");
const User = require("./Models/user");
const Application = require("./Models/application");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "15mb" })); // allow pasted text + uploaded resume PDFs

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("DB Error:", err));

// Public stats for the landing page
app.get("/api/stats", async (req, res) => {
  try {
    const [jobs, applications, seekers, companies] = await Promise.all([
      Job.countDocuments({ status: "open" }),
      Application.countDocuments(),
      User.countDocuments({ role: "seeker" }),
      Job.distinct("company").then((list) => list.filter(Boolean).length),
    ]);
    return res.json({ jobs, applications, seekers, companies });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("JobMate Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
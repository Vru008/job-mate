const express = require("express");
const User = require("../Models/user");
const Job = require("../Models/job");
const Application = require("../Models/application");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

// Every route here requires an admin.
router.use(protect, allow("admin"));

/* GET /api/admin/stats — platform overview */
router.get("/stats", async (req, res) => {
  try {
    const [users, seekers, recruiters, jobs, openJobs, applications] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "seeker" }),
        User.countDocuments({ role: "recruiter" }),
        Job.countDocuments(),
        Job.countDocuments({ status: "open" }),
        Application.countDocuments(),
      ]);
    return res.json({ users, seekers, recruiters, jobs, openJobs, applications });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* GET /api/admin/users — everyone (no passwords) */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* PUT /api/admin/users/:id — edit a user's name, role, or company */
router.put("/users/:id", async (req, res) => {
  const { name, role, company } = req.body;
  if (role && !["seeker", "recruiter", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  // An admin can't demote their own account (would lock them out).
  if (
    req.params.id === req.user._id.toString() &&
    role &&
    role !== "admin"
  ) {
    return res.status(400).json({ error: "You can't change your own role" });
  }

  try {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (company !== undefined) updates.company = company;

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* DELETE /api/admin/users/:id — remove a user and their data */
router.delete("/users/:id", async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't delete your own admin account" });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // cascade: their applications, their jobs (and those jobs' applications)
    await Application.deleteMany({ applicant: user._id });
    const jobs = await Job.find({ postedBy: user._id });
    const jobIds = jobs.map((j) => j._id);
    await Application.deleteMany({ job: { $in: jobIds } });
    await Job.deleteMany({ postedBy: user._id });
    await user.deleteOne();

    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* GET /api/admin/jobs — all jobs with poster name */
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email company")
      .sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* DELETE /api/admin/jobs/:id — remove a job and its applications */
router.delete("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

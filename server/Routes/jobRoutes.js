const express = require("express");
const Job = require("../Models/job");
const Application = require("../Models/application");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

/* =========================
   PUBLIC: browse open jobs
   GET /api/jobs?search=react
========================= */
router.get("/", async (req, res) => {
  try {
    const { search, type, visa } = req.query;
    const filter = { status: "open" };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }
    if (type && type !== "All") filter.type = type;
    if (visa === "true") filter.visaSponsorship = true;

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   RECRUITER: my own postings
   GET /api/jobs/mine
   (must come before /:id)
========================= */
router.get("/mine", protect, allow("recruiter", "admin"), async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   PUBLIC: one job
   GET /api/jobs/:id
========================= */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    return res.json(job);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   RECRUITER: create a job
   POST /api/jobs
========================= */
router.post("/", protect, allow("recruiter", "admin"), async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      company: req.body.company || req.user.company,
      postedBy: req.user._id,
    });
    return res.status(201).json(job);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   RECRUITER (owner) / ADMIN: update
   PUT /api/jobs/:id
========================= */
router.put("/:id", protect, allow("recruiter", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const isOwner = job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not your job posting" });
    }

    // don't let postedBy be overwritten
    const { postedBy, ...updates } = req.body;
    Object.assign(job, updates);
    await job.save();
    return res.json(job);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   RECRUITER (owner) / ADMIN: delete
   DELETE /api/jobs/:id
========================= */
router.delete("/:id", protect, allow("recruiter", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const isOwner = job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not your job posting" });
    }

    await job.deleteOne();
    // clean up applications tied to this job
    await Application.deleteMany({ job: job._id });
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

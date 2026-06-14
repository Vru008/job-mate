const express = require("express");
const Application = require("../Models/application");
const Job = require("../Models/job");
const { protect, allow } = require("../middleware/auth");

const router = express.Router();

/* =========================
   SEEKER: apply to a job
   POST /api/applications  { job, coverLetter?, resumeText? }
========================= */
router.post("/", protect, allow("seeker"), async (req, res) => {
  const { job, coverLetter, resumeText } = req.body;
  if (!job) return res.status(400).json({ error: "Job id is required" });

  try {
    const target = await Job.findById(job);
    if (!target || target.status !== "open") {
      return res.status(404).json({ error: "Job not found or closed" });
    }

    const application = await Application.create({
      job,
      applicant: req.user._id,
      coverLetter,
      resumeText,
    });
    return res.status(201).json(application);
  } catch (err) {
    // duplicate key = already applied
    if (err.code === 11000) {
      return res.status(409).json({ error: "You already applied to this job" });
    }
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   SEEKER: my applications (with job details)
   GET /api/applications/mine
========================= */
router.get("/mine", protect, allow("seeker"), async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job")
      .sort({ createdAt: -1 });
    return res.json(apps);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   RECRUITER (owner) / ADMIN: applicants for a job
   GET /api/applications/job/:jobId
========================= */
router.get("/job/:jobId", protect, allow("recruiter", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const isOwner = job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not your job posting" });
    }

    const apps = await Application.find({ job: job._id })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });
    return res.json(apps);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   RECRUITER (owner) / ADMIN: move an applicant through the pipeline
   PUT /api/applications/:id/status  { status }
========================= */
router.put("/:id/status", protect, allow("recruiter", "admin"), async (req, res) => {
  const { status } = req.body;
  if (!["Applied", "Interview", "Offer", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const app = await Application.findById(req.params.id).populate("job");
    if (!app) return res.status(404).json({ error: "Application not found" });

    const isOwner = app.job.postedBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not your job's applicant" });
    }

    app.status = status;
    await app.save();
    return res.json(app);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   SEEKER (own) / ADMIN: withdraw an application
   DELETE /api/applications/:id
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ error: "Application not found" });

    const isOwner = app.applicant.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not your application" });
    }

    await app.deleteOne();
    return res.json({ message: "Application withdrawn" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

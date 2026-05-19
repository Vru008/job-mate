const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

/* =========================
   ➕ CREATE JOB
   FIX: changed /add → /
   ========================= */
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    return res.status(201).json(job);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   📋 GET ALL JOBS
   ========================= */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.json(jobs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   🗑 DELETE JOB
   ========================= */
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   ✏️ UPDATE JOB
   ========================= */
router.put("/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.json(updatedJob);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
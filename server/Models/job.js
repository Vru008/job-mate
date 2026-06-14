const mongoose = require("mongoose");

// A job posting created by a recruiter. Seekers browse and apply to these.
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    description: String,
    requirements: String,
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
      default: "Full-time",
    },
    salary: String,
    visaSponsorship: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    // the recruiter who posted it
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);

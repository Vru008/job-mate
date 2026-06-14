const mongoose = require("mongoose");

// One seeker's application to one job. The recruiter who owns the job
// moves it through the pipeline (Applied -> Interview -> Offer / Rejected).
const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    coverLetter: String,
    resumeText: String,
    // private notes the seeker keeps for themselves
    notes: String,
  },
  { timestamps: true }
);

// A seeker can apply to a given job only once.
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);

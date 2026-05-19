const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  status: {
    type: String,
    default: "Applied"
  }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
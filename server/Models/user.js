const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["seeker", "recruiter", "admin"],
      default: "seeker",
    },
    // profile fields
    company: String, // mainly for recruiters
    headline: String, // e.g. "Frontend Developer" or "Hiring at TechCorp"
    location: String,
    bio: String,
    avatar: String, // base64 data URL or image link
    // password reset
    resetTokenHash: String,
    resetTokenExpires: Date,
  },
  { timestamps: true }
);

// Hash the password before saving (only when it changed).
// Async style — return/await instead of next() (Mongoose calls it as a promise).
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Helper to compare a plaintext password against the stored hash.
userSchema.methods.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);

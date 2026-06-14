const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../Models/user");
const { protect, signToken } = require("../middleware/auth");

const router = express.Router();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Sends the reset link by email IF SMTP is configured; returns true if sent.
async function sendResetEmail(to, resetUrl) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return false;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: `JobMate <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your JobMate password",
    html: `<p>You requested a password reset.</p>
           <p><a href="${resetUrl}">Click here to reset your password</a>. This link expires in 1 hour.</p>
           <p>If you didn't request this, you can ignore this email.</p>`,
  });
  return true;
}

// Shape the user object we send back (never include the password).
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  company: u.company || "",
  headline: u.headline || "",
  location: u.location || "",
  bio: u.bio || "",
  avatar: u.avatar || "",
});

/* REGISTER  POST /api/auth/register
   { name, email, password, role, company? } */
router.post("/register", async (req, res) => {
  const { name, email, password, role, company } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }
  if (role && !["seeker", "recruiter"].includes(role)) {
    // admin accounts are created manually, never via public signup
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "seeker",
      company: role === "recruiter" ? company : undefined,
    });

    return res.status(201).json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* LOGIN  POST /api/auth/login  { email, password } */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* CURRENT USER  GET /api/auth/me  (requires token) */
router.get("/me", protect, (req, res) => {
  return res.json({ user: publicUser(req.user) });
});

/* UPDATE OWN PROFILE  PUT /api/auth/me
   { name?, company?, headline?, location?, bio?, avatar? } */
router.put("/me", protect, async (req, res) => {
  const allowed = ["name", "company", "headline", "location", "bio", "avatar"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    return res.json({ user: publicUser(user) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* FORGOT PASSWORD  POST /api/auth/forgot-password  { email } */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond the same way so we don't reveal which emails exist.
    if (!user) {
      return res.json({ message: "If that email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");
    user.resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;
    const emailed = await sendResetEmail(user.email, resetUrl);

    // If email isn't configured, return the link so it still works (demo mode).
    if (emailed) {
      return res.json({ message: "A reset link has been sent to your email." });
    }
    return res.json({
      message: "Email isn't configured, so here's your reset link (demo mode):",
      resetUrl,
      demo: true,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* RESET PASSWORD  POST /api/auth/reset-password  { token, password } */
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const hash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetTokenHash: hash,
      resetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "This reset link is invalid or has expired" });
    }

    user.password = password; // pre-save hook hashes it
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    return res.json({ message: "Password reset — you can now log in." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/* CHANGE PASSWORD  PUT /api/auth/change-password
   { currentPassword, newPassword } */
router.put("/change-password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }

  try {
    const user = await User.findById(req.user._id); // includes password hash
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    user.password = newPassword; // pre-save hook hashes it
    await user.save();
    return res.json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/* Seed test accounts + sample jobs for local testing.
   Run from the server folder:  node seed.js
   Safe to re-run — it resets the demo accounts each time. */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Models/user");
const Job = require("./Models/job");
const Application = require("./Models/application");

const SEEKER = { name: "Sam Seeker", email: "seeker@jobmate.com", password: "Test@1234", role: "seeker" };
const RECRUITER = { name: "Riya Recruiter", email: "recruiter@jobmate.com", password: "Test@1234", role: "recruiter", company: "TechCorp" };
const ADMIN = { name: "Admin", email: "admin@jobmate.com", password: "Test@1234", role: "admin" };

const SAMPLE_JOBS = [
  {
    title: "Frontend Developer (React)",
    location: "Remote, US",
    type: "Full-time",
    salary: "$90k–$120k",
    visaSponsorship: true,
    description: "Build modern web apps with React. Work with a small, fast-moving team.",
    requirements: "2+ years React, JavaScript, CSS. Bonus: TypeScript, testing.",
  },
  {
    title: "Backend Engineer (Node.js)",
    location: "New York, NY",
    type: "Full-time",
    salary: "$110k–$140k",
    visaSponsorship: false,
    description: "Design and ship APIs for our growing platform.",
    requirements: "Node.js, Express, MongoDB. REST API design experience.",
  },
  {
    title: "Software Engineering Intern",
    location: "Remote",
    type: "Internship",
    salary: "$30/hr",
    visaSponsorship: true,
    description: "Summer internship working across our full stack.",
    requirements: "CS coursework, eagerness to learn. Any of: React, Node, Python.",
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB\n");

    // Reset demo accounts + their data
    const emails = [SEEKER.email, RECRUITER.email, ADMIN.email];
    const old = await User.find({ email: { $in: emails } });
    const oldIds = old.map((u) => u._id);
    await Application.deleteMany({ applicant: { $in: oldIds } });
    await Job.deleteMany({ postedBy: { $in: oldIds } });
    await User.deleteMany({ email: { $in: emails } });

    // Create accounts (password is hashed by the model's pre-save hook)
    const seeker = await User.create(SEEKER);
    const recruiter = await User.create(RECRUITER);
    await User.create(ADMIN);

    // Recruiter posts the sample jobs
    for (const j of SAMPLE_JOBS) {
      await Job.create({ ...j, company: recruiter.company, postedBy: recruiter._id });
    }

    console.log("✅ Seed complete!\n");
    console.log("  Seeker    →  seeker@jobmate.com    /  Test@1234");
    console.log("  Recruiter →  recruiter@jobmate.com /  Test@1234");
    console.log("  Admin     →  admin@jobmate.com     /  Test@1234");
    console.log(`\n  ${SAMPLE_JOBS.length} sample jobs posted by the recruiter.\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log("Seed failed:", err.message);
    process.exit(1);
  }
})();

const express = require("express");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const router = express.Router();

/* =========================
   Gemini client (Google AI) — FREE tier, no credit card needed.
   Get a key at https://aistudio.google.com/  → "Get API key"
   Put it in server/.env as GEMINI_API_KEY=...
   The key stays on the server and never reaches the browser.
========================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Free model that works on this key's project.
// If you ever hit rate limits, "gemini-2.5-flash-lite" has higher free quota.
const MODEL = "gemini-2.5-flash";

function ensureKey(res) {
  if (!process.env.GEMINI_API_KEY) {
    res
      .status(500)
      .json({ error: "GEMINI_API_KEY is not set in server/.env" });
    return false;
  }
  return true;
}

// Pull JSON out of a Gemini response (responseMimeType json returns clean JSON).
function parseJson(result) {
  const text = result.response.text();
  return JSON.parse(text);
}

/* =========================
   1) PARSE JOB DESCRIPTION → auto-fill the Add Job form
   POST /api/ai/parse-job   { text }
========================= */
router.post("/parse-job", async (req, res) => {
  if (!ensureKey(res)) return;

  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "No job description provided" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction:
        "You extract structured data from job postings. Detect whether the posting mentions visa / H1B / OPT sponsorship.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            company: { type: SchemaType.STRING },
            location: { type: SchemaType.STRING },
            visaSponsorship: { type: SchemaType.BOOLEAN },
            notes: { type: SchemaType.STRING },
          },
          required: ["title", "company", "location", "visaSponsorship", "notes"],
        },
      },
    });

    const result = await model.generateContent(
      `Extract the job details from this posting:\n\n${text}`
    );
    return res.json(parseJson(result));
  } catch (err) {
    console.log("parse-job error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   2) RESUME ↔ JOB MATCH SCORE
   POST /api/ai/match-resume  { resume?, resumePdf?, job }
========================= */
router.post("/match-resume", async (req, res) => {
  if (!ensureKey(res)) return;

  const { resume, resumePdf, job } = req.body;
  if ((!resume && !resumePdf) || !job) {
    return res
      .status(400)
      .json({ error: "A resume (text or PDF) and job text are required" });
  }

  // Build the prompt parts. If a PDF was uploaded, Gemini reads it directly.
  const parts = [];
  if (resumePdf) {
    parts.push({ inlineData: { mimeType: "application/pdf", data: resumePdf } });
    parts.push({ text: "The document above is the candidate's resume." });
  } else {
    parts.push({ text: `RESUME:\n${resume}` });
  }
  parts.push({
    text: `JOB DESCRIPTION:\n${job}\n\nScore how well this resume matches the job.`,
  });

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction:
        "You are a technical recruiter. Score how well a resume matches a job, honestly and specifically. Be encouraging but realistic.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.INTEGER },
            summary: { type: SchemaType.STRING },
            strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            gaps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
          required: ["score", "summary", "strengths", "gaps", "suggestions"],
        },
      },
    });

    const result = await model.generateContent(parts);
    return res.json(parseJson(result));
  } catch (err) {
    console.log("match-resume error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   3) CAREER ASSISTANT CHATBOT
   POST /api/ai/chat  { messages: [{ role, content }] }
========================= */
router.post("/chat", async (req, res) => {
  if (!ensureKey(res)) return;

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Gemini uses roles "user" and "model". Map and cap history.
  const contents = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-12)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content) }],
    }));

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction:
        "You are JobMate's career assistant. Help users with their job search: resume tips, interview prep, OPT/H1B visa questions, cover letters, and networking. Be concise, friendly, and practical. Use short paragraphs or bullet points.",
    });

    const result = await model.generateContent({ contents });
    return res.json({ reply: result.response.text() });
  } catch (err) {
    console.log("chat error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   4) FOLLOW-UP EMAIL DRAFTER
   POST /api/ai/follow-up  { job, userName? }
========================= */
router.post("/follow-up", async (req, res) => {
  if (!ensureKey(res)) return;

  const { job, userName } = req.body;
  if (!job || !job.company) {
    return res.status(400).json({ error: "Job details are required" });
  }

  const daysAgo = job.updatedAt
    ? Math.floor((Date.now() - new Date(job.updatedAt)) / (1000 * 60 * 60 * 24))
    : null;

  const details = [
    `Role: ${job.title || job.position || "the role"}`,
    `Company: ${job.company}`,
    job.location ? `Location: ${job.location}` : "",
    daysAgo != null ? `Days since applied: ${daysAgo}` : "",
    job.notes ? `My notes: ${job.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction:
        "You write short, polite, professional follow-up emails for job applicants who haven't heard back. Keep it warm, confident, and under 130 words. Reiterate interest, add light value, and ask about next steps. No fluff.",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            subject: { type: SchemaType.STRING },
            body: { type: SchemaType.STRING },
          },
          required: ["subject", "body"],
        },
      },
    });

    const result = await model.generateContent(
      `Write a follow-up email for this application.${
        userName ? ` My name is ${userName}.` : ""
      }\n\n${details}`
    );
    return res.json(parseJson(result));
  } catch (err) {
    console.log("follow-up error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   5) AI JOB DESCRIPTION GENERATOR (recruiters)
   POST /api/ai/job-description  { title, company?, notes? }
========================= */
router.post("/job-description", async (req, res) => {
  if (!ensureKey(res)) return;

  const { title, company, notes } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "A job title is required" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction:
        "You write clear, appealing job postings. Keep the description to 3-5 sentences and requirements as a short list of 4-6 concrete bullet points (plain text, one per line).",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            description: { type: SchemaType.STRING },
            requirements: { type: SchemaType.STRING },
          },
          required: ["description", "requirements"],
        },
      },
    });

    const result = await model.generateContent(
      `Write a job posting for: ${title}${company ? ` at ${company}` : ""}.${
        notes ? ` Extra context: ${notes}` : ""
      }`
    );
    return res.json(parseJson(result));
  } catch (err) {
    console.log("job-description error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

/* =========================
   6) AI COVER LETTER WRITER (seekers)
   POST /api/ai/cover-letter  { jobTitle, company, jobDescription?, applicantName? }
========================= */
router.post("/cover-letter", async (req, res) => {
  if (!ensureKey(res)) return;

  const { jobTitle, company, jobDescription, applicantName } = req.body;
  if (!jobTitle || !company) {
    return res.status(400).json({ error: "Job title and company are required" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction:
        "You write concise, genuine cover letters for job applications. Under 180 words, warm and specific, no clichés or over-the-top flattery. Return just the letter body text.",
    });

    const result = await model.generateContent(
      `Write a cover letter for the role "${jobTitle}" at ${company}.${
        applicantName ? ` Applicant name: ${applicantName}.` : ""
      }${jobDescription ? `\n\nJob details:\n${jobDescription}` : ""}`
    );
    return res.json({ coverLetter: result.response.text() });
  } catch (err) {
    console.log("cover-letter error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

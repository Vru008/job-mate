import axios from "axios";
import { API_BASE } from "../config";

const AI = `${API_BASE}/api/ai`;

// Paste a job posting → get { title, company, location, visaSponsorship, notes }
export const parseJob = (text) =>
  axios.post(`${AI}/parse-job`, { text }).then((r) => r.data);

// Resume (text OR base64 PDF) + job text → { score, summary, strengths, gaps, suggestions }
export const matchResume = ({ resume, resumePdf, job }) =>
  axios.post(`${AI}/match-resume`, { resume, resumePdf, job }).then((r) => r.data);

// Chat history → { reply }
export const chat = (messages) =>
  axios.post(`${AI}/chat`, { messages }).then((r) => r.data);

// Job object → { subject, body } follow-up email draft
export const followUp = (job, userName) =>
  axios.post(`${AI}/follow-up`, { job, userName }).then((r) => r.data);

// Recruiter: { title, company?, notes? } → { description, requirements }
export const generateJobDescription = (data) =>
  axios.post(`${AI}/job-description`, data).then((r) => r.data);

// Seeker: { jobTitle, company, jobDescription?, applicantName? } → { coverLetter }
export const generateCoverLetter = (data) =>
  axios.post(`${AI}/cover-letter`, data).then((r) => r.data);

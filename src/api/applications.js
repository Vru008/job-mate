import axios from "axios";
import { API_BASE } from "../config";

const APPS = `${API_BASE}/api/applications`;

// Seeker: apply to a job
export const applyToJob = (data) => axios.post(APPS, data).then((r) => r.data);

// Seeker: my applications (with job populated)
export const myApplications = () =>
  axios.get(`${APPS}/mine`).then((r) => r.data);

// Seeker (own) / admin: withdraw
export const withdrawApplication = (id) =>
  axios.delete(`${APPS}/${id}`).then((r) => r.data);

// Recruiter: applicants for one of my jobs
export const applicantsForJob = (jobId) =>
  axios.get(`${APPS}/job/${jobId}`).then((r) => r.data);

// Recruiter/admin: move applicant through the pipeline
export const setApplicationStatus = (id, status) =>
  axios.put(`${APPS}/${id}/status`, { status }).then((r) => r.data);

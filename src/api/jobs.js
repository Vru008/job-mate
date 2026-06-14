import axios from "axios";
import { API_BASE } from "../config";

const JOBS = `${API_BASE}/api/jobs`;

// Public: browse open jobs. params = { search?, type?, visa? }
export const listJobs = (params = {}) =>
  axios.get(JOBS, { params }).then((r) => r.data);

// Public: landing-page stats
export const publicStats = () =>
  axios.get(`${API_BASE}/api/stats`).then((r) => r.data);

// Public: one job
export const getJob = (id) => axios.get(`${JOBS}/${id}`).then((r) => r.data);

// Recruiter: my postings
export const myJobs = () => axios.get(`${JOBS}/mine`).then((r) => r.data);

// Recruiter: create / update / delete
export const createJob = (data) => axios.post(JOBS, data).then((r) => r.data);
export const updateJob = (id, data) =>
  axios.put(`${JOBS}/${id}`, data).then((r) => r.data);
export const deleteJob = (id) =>
  axios.delete(`${JOBS}/${id}`).then((r) => r.data);

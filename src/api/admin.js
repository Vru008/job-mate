import axios from "axios";
import { API_BASE } from "../config";

const ADMIN = `${API_BASE}/api/admin`;

export const adminStats = () => axios.get(`${ADMIN}/stats`).then((r) => r.data);
export const adminUsers = () => axios.get(`${ADMIN}/users`).then((r) => r.data);
export const adminUpdateUser = (id, data) =>
  axios.put(`${ADMIN}/users/${id}`, data).then((r) => r.data);
export const adminDeleteUser = (id) =>
  axios.delete(`${ADMIN}/users/${id}`).then((r) => r.data);
export const adminJobs = () => axios.get(`${ADMIN}/jobs`).then((r) => r.data);
export const adminDeleteJob = (id) =>
  axios.delete(`${ADMIN}/jobs/${id}`).then((r) => r.data);

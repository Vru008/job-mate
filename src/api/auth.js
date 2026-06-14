import axios from "axios";
import { API_BASE } from "../config";

const AUTH = `${API_BASE}/api/auth`;

export const registerApi = (data) =>
  axios.post(`${AUTH}/register`, data).then((r) => r.data);

export const loginApi = (data) =>
  axios.post(`${AUTH}/login`, data).then((r) => r.data);

export const meApi = (token) =>
  axios
    .get(`${AUTH}/me`, { headers: { Authorization: `Bearer ${token}` } })
    .then((r) => r.data);

export const updateMeApi = (data) =>
  axios.put(`${AUTH}/me`, data).then((r) => r.data);

export const changePasswordApi = (data) =>
  axios.put(`${AUTH}/change-password`, data).then((r) => r.data);

export const forgotPasswordApi = (email) =>
  axios.post(`${AUTH}/forgot-password`, { email }).then((r) => r.data);

export const resetPasswordApi = (token, password) =>
  axios.post(`${AUTH}/reset-password`, { token, password }).then((r) => r.data);

// Base URL for the backend API.
// Locally it falls back to localhost; in production (Vercel/Netlify) set
// REACT_APP_API_URL to your deployed backend URL, e.g.
// https://jobmate-backend.onrender.com
export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

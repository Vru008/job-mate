import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const HOME_FOR = { seeker: "/jobs", recruiter: "/recruiter" };

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("seeker");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register({ ...form, role });
      navigate(HOME_FOR[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.error || "Sign up failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create your account ✨</h2>
        <p>Join JobMate as a job seeker or a recruiter</p>

        <form onSubmit={handleSubmit} className="login-form">
          <p className="role-label">I am a</p>
          <div className="role-toggle">
            <button
              type="button"
              className={role === "seeker" ? "active" : ""}
              onClick={() => setRole("seeker")}
            >
              Job Seeker
            </button>
            <button
              type="button"
              className={role === "recruiter" ? "active" : ""}
              onClick={() => setRole("recruiter")}
            >
              Recruiter
            </button>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={change}
            required
          />

          {role === "recruiter" && (
            <input
              type="text"
              name="company"
              placeholder="Company name"
              value={form.company}
              onChange={change}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={change}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={change}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

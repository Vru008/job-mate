import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../../api/auth";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    setDemoUrl("");
    try {
      const data = await forgotPasswordApi(email);
      setMsg(data.message);
      if (data.resetUrl) {
        // demo mode: pull the token path so we can route within the app
        const path = data.resetUrl.split("/reset-password/")[1];
        setDemoUrl(path ? `/reset-password/${path}` : "");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Forgot password?</h2>
        <p>Enter your email and we'll send you a reset link.</p>

        <form onSubmit={submit} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}
          {msg && <p className="auth-success">{msg}</p>}
          {demoUrl && (
            <Link to={demoUrl} className="auth-demo-link">
              → Reset your password
            </Link>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Remembered it? <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

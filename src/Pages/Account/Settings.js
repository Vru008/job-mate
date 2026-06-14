import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { changePasswordApi } from "../../api/auth";
import "../Profile/Profile.css";

function Settings() {
  const { user } = useAuth();

  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const change = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (next !== confirm) {
      setError("New passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      await changePasswordApi({ currentPassword: cur, newPassword: next });
      setMsg("Password updated ✓");
      setCur("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err.response?.data?.error || "Could not update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pf-card">
      <h1>Settings</h1>
      <p className="pf-sub">Manage your account.</p>

      {/* ACCOUNT INFO */}
      <div className="set-info">
        <div>
          <span className="set-info-label">Email</span>
          <span>{user?.email}</span>
        </div>
        <div>
          <span className="set-info-label">Account type</span>
          <span style={{ textTransform: "capitalize" }}>{user?.role}</span>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <h2 className="set-section">Change password</h2>
      <form onSubmit={change} className="pf-form">
        <label className="pf-label">Current password</label>
        <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} required />

        <label className="pf-label">New password</label>
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} required />

        <label className="pf-label">Confirm new password</label>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />

        {error && <p className="pf-error">{error}</p>}
        {msg && <p className="pf-success">{msg}</p>}

        <button type="submit" className="pf-save" disabled={saving}>
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default Settings;

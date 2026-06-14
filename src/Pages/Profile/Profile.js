import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Profile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    company: user?.company || "",
    headline: user?.headline || "",
    location: user?.location || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const change = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setError("Image is too large — pick one under 1.5 MB.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => setForm((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    try {
      await updateUser(form);
      setMsg("Profile saved ✓");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save. Is the server running?");
    } finally {
      setSaving(false);
    }
  };

  return (
      <div className="pf-card">
        <h1>Your profile</h1>
        <p className="pf-sub">This is how you appear on JobMate.</p>

        <div className="pf-avatar-row">
          <div className="pf-avatar">
            {form.avatar ? (
              <img src={form.avatar} alt="avatar" />
            ) : (
              <span>{initials(form.name) || "?"}</span>
            )}
          </div>
          <div>
            <label className="pf-upload">
              Change photo
              <input type="file" accept="image/*" onChange={pickPhoto} hidden />
            </label>
            {form.avatar && (
              <button
                type="button"
                className="pf-remove"
                onClick={() => setForm((p) => ({ ...p, avatar: "" }))}
              >
                Remove
              </button>
            )}
            <p className="pf-role-tag">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={save} className="pf-form">
          <label className="pf-label">Name</label>
          <input name="name" value={form.name} onChange={change} required />

          <label className="pf-label">Email</label>
          <input value={user?.email || ""} disabled className="pf-disabled" />

          <label className="pf-label">Headline</label>
          <input
            name="headline"
            value={form.headline}
            onChange={change}
            placeholder={user?.role === "recruiter" ? "e.g. Hiring at TechCorp" : "e.g. Frontend Developer"}
          />

          {user?.role === "recruiter" && (
            <>
              <label className="pf-label">Company</label>
              <input name="company" value={form.company} onChange={change} />
            </>
          )}

          <label className="pf-label">Location</label>
          <input name="location" value={form.location} onChange={change} placeholder="City, Country" />

          <label className="pf-label">Bio</label>
          <textarea name="bio" rows={4} value={form.bio} onChange={change} placeholder="A short summary about you..." />

          {error && <p className="pf-error">{error}</p>}
          {msg && <p className="pf-success">{msg}</p>}

          <button type="submit" className="pf-save" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
  );
}

export default Profile;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createJob, updateJob } from "../../api/jobs";
import { generateJobDescription } from "../../api/ai";
import "./Recruiter.css";

function PostJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const editing = location.state?.job || null;

  const [form, setForm] = useState({
    title: editing?.title || "",
    location: editing?.location || "",
    type: editing?.type || "Full-time",
    salary: editing?.salary || "",
    visaSponsorship: editing?.visaSponsorship || false,
    description: editing?.description || "",
    requirements: editing?.requirements || "",
    status: editing?.status || "open",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  const generate = async () => {
    if (!form.title.trim() || genLoading) return;
    setGenLoading(true);
    setError("");
    try {
      const data = await generateJobDescription({ title: form.title });
      setForm((p) => ({
        ...p,
        description: data.description,
        requirements: data.requirements,
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Could not generate. Add a title first.");
    } finally {
      setGenLoading(false);
    }
  };

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editing) await updateJob(editing._id, form);
      else await createJob(form);
      navigate("/recruiter");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rc-page">
      <div className="rc-form-wrap">
        <h1>{editing ? "Edit job" : "Post a job"}</h1>
        <p className="rc-sub">Fill in the details candidates will see.</p>

        <form onSubmit={submit} className="rc-form">
          <label className="rc-label">Job title *</label>
          <input name="title" value={form.title} onChange={change} required placeholder="e.g. Frontend Developer" />

          <div className="rc-row">
            <div>
              <label className="rc-label">Location</label>
              <input name="location" value={form.location} onChange={change} placeholder="Remote / New York, NY" />
            </div>
            <div>
              <label className="rc-label">Type</label>
              <select name="type" value={form.type} onChange={change}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          <div className="rc-row">
            <div>
              <label className="rc-label">Salary</label>
              <input name="salary" value={form.salary} onChange={change} placeholder="$90k–$120k" />
            </div>
            <div>
              <label className="rc-label">Status</label>
              <select name="status" value={form.status} onChange={change}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <label className="rc-check">
            <input type="checkbox" name="visaSponsorship" checked={form.visaSponsorship} onChange={change} />
            This role offers visa / H1B sponsorship
          </label>

          <div className="rc-gen-row">
            <label className="rc-label">Description</label>
            <button type="button" className="rc-gen-btn" onClick={generate} disabled={genLoading || !form.title.trim()}>
              {genLoading ? "Generating…" : "✨ Generate with AI"}
            </button>
          </div>
          <textarea name="description" rows={4} value={form.description} onChange={change} placeholder="What the role is about... (or generate with AI from the title)" />

          <label className="rc-label">Requirements</label>
          <textarea name="requirements" rows={3} value={form.requirements} onChange={change} placeholder="Skills and experience needed..." />

          {error && <p className="rc-error">{error}</p>}

          <div className="rc-form-actions">
            <button type="button" className="rc-btn ghost" onClick={() => navigate("/recruiter")}>
              Cancel
            </button>
            <button type="submit" className="rc-btn primary" disabled={loading}>
              {loading ? "Saving..." : editing ? "Save changes" : "Post job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;

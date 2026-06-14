import React, { useState } from "react";
import { applyToJob } from "../../api/applications";
import { generateCoverLetter } from "../../api/ai";
import { useAuth } from "../../context/AuthContext";
import "./Seeker.css";

function ApplyModal({ job, onClose, onApplied }) {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [error, setError] = useState("");

  const writeWithAI = async () => {
    if (genLoading) return;
    setGenLoading(true);
    setError("");
    try {
      const { coverLetter: text } = await generateCoverLetter({
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        applicantName: user?.name,
      });
      setCoverLetter(text);
    } catch (err) {
      setError(err.response?.data?.error || "Could not generate. Try again.");
    } finally {
      setGenLoading(false);
    }
  };

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      await applyToJob({ job: job._id, coverLetter });
      onApplied(job._id);
    } catch (err) {
      setError(err.response?.data?.error || "Could not apply. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sk-overlay" onClick={onClose}>
      <div className="sk-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sk-modal-head">
          <div>
            <strong>Apply to {job.title}</strong>
            <span className="sk-modal-sub">{job.company}</span>
          </div>
          <button className="sk-close" onClick={onClose}>✕</button>
        </div>

        <div className="sk-cl-row">
          <label className="sk-label">Cover letter (optional)</label>
          <button type="button" className="sk-ai-btn" onClick={writeWithAI} disabled={genLoading}>
            {genLoading ? "Writing…" : "✨ Write with AI"}
          </button>
        </div>
        <textarea
          className="sk-textarea"
          rows={7}
          placeholder="Tell the recruiter why you're a great fit... (or let AI draft it)"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />

        {error && <p className="sk-error">{error}</p>}

        <div className="sk-modal-actions">
          <button className="sk-btn ghost" onClick={onClose}>Cancel</button>
          <button className="sk-btn primary" onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit application"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplyModal;

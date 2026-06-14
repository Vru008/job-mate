import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { myJobs, deleteJob, updateJob } from "../../api/jobs";
import { applicantsForJob } from "../../api/applications";
import "./Recruiter.css";

function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await myJobs();
      setJobs(data);
      // fetch applicant count per job
      const entries = await Promise.all(
        data.map(async (j) => {
          try {
            const apps = await applicantsForJob(j._id);
            return [j._id, apps.length];
          } catch {
            return [j._id, 0];
          }
        })
      );
      setCounts(Object.fromEntries(entries));
    } catch (err) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this job and all its applications?")) return;
    await deleteJob(id);
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  const toggleStatus = async (job) => {
    const next = job.status === "open" ? "closed" : "open";
    const updated = await updateJob(job._id, { status: next });
    setJobs((prev) => prev.map((j) => (j._id === job._id ? updated : j)));
  };

  const totalApplicants = Object.values(counts).reduce((a, b) => a + b, 0);
  const openCount = jobs.filter((j) => j.status === "open").length;

  return (
    <div className="rc-page">
      <div className="rc-header">
        <div>
          <h1>Recruiter dashboard</h1>
          <p className="rc-sub">Manage your postings and review applicants.</p>
        </div>
        <Link to="/recruiter/post" className="rc-btn primary">+ Post a job</Link>
      </div>

      <div className="rc-stats">
        <div className="rc-stat"><b>{jobs.length}</b><span>Total jobs</span></div>
        <div className="rc-stat"><b>{openCount}</b><span>Open</span></div>
        <div className="rc-stat"><b>{totalApplicants}</b><span>Applicants</span></div>
      </div>

      {loading ? (
        <p className="rc-empty">Loading your jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="rc-empty">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/recruiter/post" className="rc-btn primary">Post your first job</Link>
        </div>
      ) : (
        <div className="rc-job-list">
          {jobs.map((job) => (
            <div key={job._id} className="rc-job-card">
              <div className="rc-job-main">
                <div className="rc-job-titlerow">
                  <h3>{job.title}</h3>
                  <span className={`rc-status ${job.status}`}>{job.status}</span>
                </div>
                <p className="rc-job-meta">
                  {job.location || "—"} · {job.type}
                  {job.salary ? ` · ${job.salary}` : ""}
                </p>
                <button
                  className="rc-applicants-link"
                  onClick={() => navigate(`/recruiter/job/${job._id}/applicants`)}
                >
                  {counts[job._id] || 0} applicant{counts[job._id] === 1 ? "" : "s"} →
                </button>
              </div>

              <div className="rc-job-actions">
                <button className="rc-btn ghost small" onClick={() => toggleStatus(job)}>
                  {job.status === "open" ? "Close" : "Reopen"}
                </button>
                <button
                  className="rc-btn ghost small"
                  onClick={() => navigate("/recruiter/post", { state: { job } })}
                >
                  Edit
                </button>
                <button className="rc-btn danger small" onClick={() => remove(job._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;

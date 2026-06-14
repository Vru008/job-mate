import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJob } from "../../api/jobs";
import { applicantsForJob, setApplicationStatus } from "../../api/applications";
import "./Recruiter.css";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [j, a] = await Promise.all([
          getJob(jobId).catch(() => null),
          applicantsForJob(jobId),
        ]);
        setJob(j);
        setApps(a);
      } catch {
        setApps([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const changeStatus = async (id, status) => {
    const updated = await setApplicationStatus(id, status);
    setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status: updated.status } : a)));
  };

  return (
    <div className="rc-page">
      <div className="rc-header">
        <div>
          <button className="rc-back" onClick={() => navigate("/recruiter")}>← Back</button>
          <h1>Applicants {job ? `· ${job.title}` : ""}</h1>
          <p className="rc-sub">Review candidates and move them through your pipeline.</p>
        </div>
      </div>

      {loading ? (
        <p className="rc-empty">Loading applicants...</p>
      ) : apps.length === 0 ? (
        <p className="rc-empty">No one has applied yet.</p>
      ) : (
        <div className="rc-job-list">
          {apps.map((a) => {
            const open = openId === a._id;
            return (
              <div key={a._id} className="rc-app-card">
                <div className="rc-app-row">
                  <div>
                    <h3>{a.applicant?.name || "Applicant"}</h3>
                    <p className="rc-job-meta">
                      {a.applicant?.email} · applied {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <select
                    className={`rc-status-select ${a.status}`}
                    value={a.status}
                    onChange={(e) => changeStatus(a._id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {a.coverLetter && (
                  <button className="rc-applicants-link" onClick={() => setOpenId(open ? null : a._id)}>
                    {open ? "Hide cover letter" : "View cover letter"}
                  </button>
                )}
                {open && a.coverLetter && (
                  <div className="rc-cover">{a.coverLetter}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Applicants;

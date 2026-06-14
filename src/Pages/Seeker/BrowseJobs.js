import React, { useEffect, useState } from "react";
import { listJobs } from "../../api/jobs";
import { myApplications } from "../../api/applications";
import ApplyModal from "./ApplyModal";
import "./Seeker.css";

const TYPES = ["All", "Full-time", "Part-time", "Internship", "Contract"];

function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [visaOnly, setVisaOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [applyJob, setApplyJob] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = async (overrides = {}) => {
    setLoading(true);
    const params = {
      search,
      type,
      visa: visaOnly ? "true" : undefined,
      ...overrides,
    };
    try {
      const [jobsData, myApps] = await Promise.all([
        listJobs(params),
        myApplications().catch(() => []),
      ]);
      setJobs(jobsData);
      setAppliedIds(new Set(myApps.map((a) => a.job?._id).filter(Boolean)));
    } catch (err) {
      // leave jobs empty on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load();
  };

  // Filters apply immediately when changed.
  const pickType = (t) => {
    setType(t);
    load({ type: t });
  };
  const toggleVisa = () => {
    const next = !visaOnly;
    setVisaOnly(next);
    load({ visa: next ? "true" : undefined });
  };

  const handleApplied = (jobId) => {
    setAppliedIds((prev) => new Set(prev).add(jobId));
    setApplyJob(null);
  };

  return (
    <div className="sk-page">
      <div className="sk-header">
        <h1>Find your next role</h1>
        <p>Browse open positions and apply in one click.</p>
      </div>

      <form className="sk-search" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="Search by title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="sk-filters">
        <div className="sk-type-pills">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`sk-pill ${type === t ? "active" : ""}`}
              onClick={() => pickType(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="sk-visa-toggle">
          <input type="checkbox" checked={visaOnly} onChange={toggleVisa} />
          Visa sponsors only
        </label>
      </div>

      {loading ? (
        <p className="sk-empty">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="sk-empty">No open jobs yet. Check back soon.</p>
      ) : (
        <div className="sk-job-grid">
          {jobs.map((job) => {
            const applied = appliedIds.has(job._id);
            const open = expandedId === job._id;
            return (
              <div key={job._id} className="sk-job-card">
                <div className="sk-job-top">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="sk-company">{job.company}</p>
                  </div>
                  {job.visaSponsorship && (
                    <span className="sk-badge visa">Visa sponsor</span>
                  )}
                </div>

                <div className="sk-meta-row">
                  {job.location && <span>📍 {job.location}</span>}
                  {job.type && <span>💼 {job.type}</span>}
                  {job.salary && <span>💰 {job.salary}</span>}
                </div>

                {open && (
                  <div className="sk-job-desc">
                    {job.description && <p>{job.description}</p>}
                    {job.requirements && (
                      <>
                        <strong>Requirements</strong>
                        <p>{job.requirements}</p>
                      </>
                    )}
                  </div>
                )}

                <div className="sk-job-actions">
                  <button
                    className="sk-btn ghost"
                    onClick={() => setExpandedId(open ? null : job._id)}
                  >
                    {open ? "Hide" : "Details"}
                  </button>
                  {applied ? (
                    <button className="sk-btn applied" disabled>
                      ✓ Applied
                    </button>
                  ) : (
                    <button className="sk-btn primary" onClick={() => setApplyJob(job)}>
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {applyJob && (
        <ApplyModal
          job={applyJob}
          onClose={() => setApplyJob(null)}
          onApplied={handleApplied}
        />
      )}
    </div>
  );
}

export default BrowseJobs;

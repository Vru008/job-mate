import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminStats } from "../../api/admin";
import "./Admin.css";

function AdminConsole() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Total users", value: stats.users },
        { label: "Job seekers", value: stats.seekers },
        { label: "Recruiters", value: stats.recruiters },
        { label: "Jobs posted", value: stats.jobs },
        { label: "Open jobs", value: stats.openJobs },
        { label: "Applications", value: stats.applications },
      ]
    : [];

  return (
    <div className="ad-page">
      <div className="ad-header">
        <h1>Admin console</h1>
        <p className="ad-sub">Platform overview and moderation.</p>
      </div>

      {loading ? (
        <p className="ad-empty">Loading stats...</p>
      ) : !stats ? (
        <p className="ad-empty">Could not load stats.</p>
      ) : (
        <>
          <div className="ad-stats">
            {cards.map((c) => (
              <div key={c.label} className="ad-stat">
                <b>{c.value}</b>
                <span>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="ad-links">
            <Link to="/admin/users" className="ad-link-card">
              <h3>Manage users →</h3>
              <p>View and remove seekers, recruiters, and admins.</p>
            </Link>
            <Link to="/admin/jobs" className="ad-link-card">
              <h3>Manage jobs →</h3>
              <p>Review and take down any job posting.</p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminConsole;

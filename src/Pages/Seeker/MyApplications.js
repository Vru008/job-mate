import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myApplications, withdrawApplication } from "../../api/applications";
import "./Seeker.css";

const STATUS_CLASS = {
  Applied: "st-applied",
  Interview: "st-interview",
  Offer: "st-offer",
  Rejected: "st-rejected",
};

function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setApps(await myApplications());
    } catch (err) {
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const withdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;
    await withdrawApplication(id);
    setApps((prev) => prev.filter((a) => a._id !== id));
  };

  const counts = apps.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="sk-page">
      <div className="sk-header">
        <h1>My applications</h1>
        <p>Track every role you've applied to and where it stands.</p>
      </div>

      <div className="sk-stats">
        <div className="sk-stat"><b>{apps.length}</b><span>Total</span></div>
        <div className="sk-stat"><b>{counts.Applied || 0}</b><span>Applied</span></div>
        <div className="sk-stat"><b>{counts.Interview || 0}</b><span>Interview</span></div>
        <div className="sk-stat"><b>{counts.Offer || 0}</b><span>Offers</span></div>
      </div>

      {loading ? (
        <p className="sk-empty">Loading...</p>
      ) : apps.length === 0 ? (
        <p className="sk-empty">
          No applications yet. <Link to="/jobs">Browse jobs →</Link>
        </p>
      ) : (
        <div className="sk-app-list">
          {apps.map((a) => (
            <div key={a._id} className="sk-app-card">
              <div className="sk-app-info">
                <h3>{a.job?.title || "Job removed"}</h3>
                <p className="sk-company">{a.job?.company}</p>
                <p className="sk-app-date">
                  Applied {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="sk-app-right">
                <span className={`sk-status ${STATUS_CLASS[a.status]}`}>
                  {a.status}
                </span>
                <button className="sk-btn ghost small" onClick={() => withdraw(a._id)}>
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;

import React, { useMemo, useState } from "react";
import "./ApplicationTracking.css";

const STATUS_COLORS = {
  Applied: "status-applied",
  "Interview Scheduled": "status-interview",
  "Offer Received": "status-offer",
  Rejected: "status-rejected",
};

function ApplicationTracking() {
  const [search, setSearch] = useState("");

  const [applications] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      status: "Applied",
      date: "Feb 23, 2026",
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "DesignHub",
      status: "Interview Scheduled",
      date: "Feb 20, 2026",
    },
    {
      id: 3,
      title: "React Developer",
      company: "WebSolutions",
      status: "Offer Received",
      date: "Feb 15, 2026",
    },
    {
      id: 4,
      title: "Backend Developer",
      company: "CloudSync",
      status: "Rejected",
      date: "Feb 10, 2026",
    },
  ]);

  const filteredApps = useMemo(() => {
    return applications.filter(
      (app) =>
        app.title.toLowerCase().includes(search.toLowerCase()) ||
        app.company.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, applications]);

  return (
    <div className="app-tracking-container">

      {/* HEADER */}
      <header className="tracking-header">
        <h2>📋 Application Tracking</h2>
        <p>
          Track, manage, and analyze all your job applications in one place.
        </p>
      </header>

      {/* SEARCH BAR */}
      <div className="tracking-tools">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* CARDS */}
      <div className="tracking-cards">
        {filteredApps.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>

    </div>
  );
}

/* CARD COMPONENT */
const ApplicationCard = React.memo(({ app }) => {
  return (
    <div className="tracking-card">

      <div className="card-top">
        <h3>{app.title}</h3>
        <span className={`status-badge ${STATUS_COLORS[app.status]}`}>
          {app.status}
        </span>
      </div>

      <p><strong>Company:</strong> {app.company}</p>
      <p><strong>Date:</strong> {app.date}</p>

    </div>
  );
});

export default ApplicationTracking;
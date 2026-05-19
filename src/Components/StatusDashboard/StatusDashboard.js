import React from "react";
import "./StatusDashboard.css";

function StatusDashboard() {
  const stats = [
    { label: "Applied", count: 12, color: "#3b82f6" },
    { label: "Interview", count: 5, color: "#f59e0b" },
    { label: "Offers", count: 2, color: "#10b981" },
    { label: "Rejected", count: 7, color: "#ef4444" },
  ];

  const total = stats.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Status Dashboard</h1>
        <p>Track and analyze your job application journey in real time</p>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        {stats.map((item, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{ borderTop: `4px solid ${item.color}` }}
          >
            <h2>{item.count}</h2>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="progress-section">
        <h2>📈 Application Progress</h2>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(stats[0].count / total) * 100}%` }}
          ></div>
        </div>

        <p>
          You have completed <strong>{stats[0].count}</strong> applications out of{" "}
          <strong>{total}</strong> total job actions.
        </p>
      </div>

      {/* Insights Section */}
      <div className="insights">
        <h2>🧠 Insights</h2>

        <div className="insight-box">
          <p>
            🔥 You are actively applying to jobs — keep consistency for better results.
          </p>
        </div>

        <div className="insight-box">
          <p>
            📅 Most interviews are happening within 3–7 days after application.
          </p>
        </div>

        <div className="insight-box">
          <p>
            🎯 Focus on improving resume matching for better offer conversion.
          </p>
        </div>
      </div>

    </div>
  );
}

export default StatusDashboard;
import React from "react";
import JobList from "../Components/Jobs/JobList";
import "./Dashboard.css";

function Dashboard({ jobs = [], deleteJob }) {

  const total = jobs.length;
  const applied = jobs.filter(j => j.status === "Applied").length;
  const interview = jobs.filter(j => j.status === "Interview").length;
  const offer = jobs.filter(j => j.status === "Offer").length;

  const successRate = total ? Math.round((offer / total) * 100) : 0;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Career Command Center</h1>
        <p>
          Monitor your job applications, track progress, and analyze your career growth in real time.
        </p>
      </div>

      {/* STATS */}
      <div className="dashboard-stats">

        <div className="dash-card">
          <h2>{total}</h2>
          <p>Total Applications</p>
        </div>

        <div className="dash-card blue">
          <h2>{applied}</h2>
          <p>Applied</p>
        </div>

        <div className="dash-card purple">
          <h2>{interview}</h2>
          <p>Interviews</p>
        </div>

        <div className="dash-card green">
          <h2>{offer}</h2>
          <p>Offers</p>
        </div>

        <div className="dash-card gold">
          <h2>{successRate}%</h2>
          <p>Success Rate</p>
        </div>

      </div>

      {/* INSIGHTS SECTION */}
      <div className="dashboard-insights">

        <div className="insight-card">
          <h3>Weekly Progress</h3>
          <p>You are actively applying and improving your chances each week.</p>
        </div>

        <div className="insight-card">
          <h3>Interview Readiness</h3>
          <p>Focus on mock interviews to increase conversion rate.</p>
        </div>

        <div className="insight-card">
          <h3>Career Growth Tip</h3>
          <p>Consistency in applications increases interview opportunities by 3x.</p>
        </div>

      </div>

      {/* APPLICATION TRACKER */}
      <div className="dashboard-section">

        <div className="section-title">
          <h2>Application Tracker</h2>
          <p>Manage, edit, and track all your job applications</p>
        </div>

        <div className="job-wrapper">

          {jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No Applications Yet</h3>
              <p>
                Start adding jobs to track your progress and build your career dashboard.
              </p>
            </div>
          ) : (
            <JobList jobs={jobs} deleteJob={deleteJob} />
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
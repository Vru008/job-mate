import React from "react";
import JobForm from "../Components/Jobs/JobForm";
import "./AddJob.css";

function AddJob({ addJob }) {
  return (
    <div className="addjob-page">
      <div className="addjob-container">

        <div className="addjob-info">
          <h2>Track Your Next Opportunity 🚀</h2>

          <p>
            Add a new job application to your JobMate dashboard and stay organized.
          </p>

          <div className="info-box">
            <h4>✨ Why add jobs?</h4>
            <ul>
              <li>Track applications easily</li>
              <li>Monitor interview progress</li>
              <li>Stay organized</li>
            </ul>
          </div>
        </div>

        <div className="addjob-card">
          <div className="addjob-header">
            <h3>New Job Entry</h3>
          </div>

          <JobForm addJob={addJob} />
        </div>

      </div>
    </div>
  );
}

export default AddJob;
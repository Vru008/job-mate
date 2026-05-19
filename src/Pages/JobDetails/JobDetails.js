import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  // job data coming from Home page
  const job = location.state;

  if (!job) {
    return (
      <div className="job-details">
        <h2>No Job Found</h2>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="job-details">

      <div className="job-box">

        <h1>{job.title}</h1>
        <h3>{job.company}</h3>

        <p><b>Location:</b> {job.location || "Remote"}</p>

        <p className="description">
          {job.description || "No description provided"}
        </p>

        <div className="actions">

          <button className="apply-btn">
            Apply Now 🚀
          </button>

          <button onClick={() => navigate("/")}>
            Back to Jobs
          </button>

        </div>

      </div>

    </div>
  );
}

export default JobDetails;
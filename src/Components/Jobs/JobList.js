import React from "react";
import "./JobList.css";

function JobList({ jobs, deleteJob, setEditJob }) {
  return (
    <div>
      {jobs.map(job => (
        <div key={job.id} className="card">
          <h3>{job.company}</h3>
          <p>{job.position}</p>
          <p className="status">Status: {job.status}</p>
          <div className="buttons">
            <button className="edit" onClick={() => setEditJob(job)}>Edit</button>
            <button className="delete" onClick={() => deleteJob(job.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobList;
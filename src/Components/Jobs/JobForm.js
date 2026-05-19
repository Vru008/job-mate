import React, { useState, useEffect } from "react";
import "./JobForm.css";

function JobForm({ addJob, editJob }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");

  useEffect(() => {
    if (editJob) {
      setCompany(editJob.company);
      setPosition(editJob.position);
      setStatus(editJob.status);
    }
  }, [editJob]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      id: editJob ? editJob.id : Date.now(),
      company,
      position,
      status
    };

    addJob(newJob);
    setCompany("");
    setPosition("");
    setStatus("Applied");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Job Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
      <button type="submit">
        {editJob ? "Update Application" : "Add Application"}
      </button>
    </form>
  );
}

export default JobForm;
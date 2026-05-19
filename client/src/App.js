import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:5000/api/jobs");
    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async () => {
    await axios.post("http://localhost:5000/api/jobs/add", {
      title,
      company,
      status: "Applied",
    });

    setTitle("");
    setCompany("");
    fetchJobs();
  };

  const deleteJob = async (id) => {
    await axios.delete(`http://localhost:5000/api/jobs/${id}`);
    fetchJobs();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/jobs/${id}`, {
      status,
    });
    fetchJobs();
  };

  return (
    <div className="container">

      <h1>🚀 JobMate</h1>

      {/* ADD JOB CARD */}
      <div className="card">
        <h2>➕ Add Job</h2>

        <input
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />

        <input
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <br />

        <button className="add-btn" onClick={addJob}>
          Add Job
        </button>
      </div>

      {/* JOB LIST */}
      <h2>📋 Job List</h2>

      {jobs.map((job) => (
        <div key={job._id} className="card">
          <h3>{job.title}</h3>
          <p>{job.company}</p>

          <p>
            Status: <b>{job.status}</b>
          </p>

          <select
            value={job.status}
            onChange={(e) => updateStatus(job._id, e.target.value)}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>

          <br />

          <button
            className="delete-btn"
            onClick={() => deleteJob(job._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
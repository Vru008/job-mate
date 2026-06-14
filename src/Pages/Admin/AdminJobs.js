import React, { useEffect, useState } from "react";
import { adminJobs, adminDeleteJob } from "../../api/admin";
import "./Admin.css";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (job) => {
    if (!window.confirm(`Take down "${job.title}" and its applications?`)) return;
    try {
      await adminDeleteJob(job._id);
      setJobs((prev) => prev.filter((j) => j._id !== job._id));
    } catch (err) {
      alert(err.response?.data?.error || "Could not delete job");
    }
  };

  return (
    <div className="ad-page">
      <div className="ad-header">
        <h1>Jobs</h1>
        <p className="ad-sub">{jobs.length} job postings on the platform.</p>
      </div>

      {loading ? (
        <p className="ad-empty">Loading jobs...</p>
      ) : (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Posted by</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>{j.title}</td>
                  <td>{j.company}</td>
                  <td>{j.postedBy?.name || "—"}</td>
                  <td>
                    <span className={`ad-role ${j.status === "open" ? "r-seeker" : "r-admin"}`}>
                      {j.status}
                    </span>
                  </td>
                  <td>
                    <button className="ad-del" onClick={() => remove(j)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminJobs;

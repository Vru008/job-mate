import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom";
import axios from "axios";

import Navbar from "./Components/Common/NavBar";
import Footer from "./Components/Common/Footer";

import Home from "./Pages/Home/Home";
import Dashboard from "./Pages/Dashboard";
import AddJob from "./Pages/AddJob";
import About from "./Pages/About";
import Login from "./Pages/Home/Login";

import ApplicationTracking from "./Components/Applications/ApplicationTracking";
import InterviewScheduling from "./Components/Interviews/InterviewScheduling";
import StatusDashboard from "./Components/StatusDashboard/StatusDashboard";

import FreeAcc from "./Pages/Home/FreeAcc";
import ExploreFeatures from "./Pages/Home/ExploreFeatures";

/* ✅ NEW IMPORT (Job Details Page) */
import JobDetails from "./Pages/JobDetails/JobDetails";

import "./App.css";

/* =========================
   Scroll to top helper
========================= */
function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return null;
}

/* =========================
   MAIN APP
========================= */
function App() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editJob, setEditJob] = useState(null);

  const API = "http://localhost:5000/api/jobs";

  /* =========================
     FETCH JOBS (backend source)
  ========================= */
  const fetchJobs = async () => {
    try {
      const res = await axios.get(API);
      setJobs(res.data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =========================
     ADD JOB
  ========================= */
  const addJob = async (job) => {
    try {
      await axios.post(API, job);
      fetchJobs();
    } catch (err) {
      console.log("Add error:", err);
    }
  };

  /* =========================
     DELETE JOB
  ========================= */
  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchJobs();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  /* =========================
     FILTER JOBS
  ========================= */
  const filteredJobs =
    filter === "All"
      ? jobs
      : jobs.filter((job) => job.status === filter);

  return (
    <Router>
      <ScrollToTop />

      <Navbar />

      <Routes>

        {/* 🏠 HOME (Job Feed - Indeed style) */}
        <Route
          path="/"
          element={
            <Home
              jobs={jobs}
              addJob={addJob}
              deleteJob={deleteJob}
              editJob={editJob}
              setEditJob={setEditJob}
              setFilter={setFilter}
              filteredJobs={filteredJobs}
            />
          }
        />

        {/* 📄 JOB DETAILS PAGE (NEW) */}
        <Route path="/job/:id" element={<JobDetails />} />

        {/* 📊 DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              jobs={jobs}
              deleteJob={deleteJob}
              setEditJob={setEditJob}
            />
          }
        />

        {/* ➕ ADD JOB */}
        <Route
          path="/add-job"
          element={
            <AddJob
              addJob={addJob}
              editJob={editJob}
            />
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />

        <Route path="/ApplicationTracking" element={<ApplicationTracking />} />
        <Route path="/InterviewScheduling" element={<InterviewScheduling />} />
        <Route path="/status-dashboard" element={<StatusDashboard />} />

        <Route path="/freeacc" element={<FreeAcc />} />
        <Route path="/explorefeatures" element={<ExploreFeatures />} />

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./Home.css";

function Home() {

  /* =========================
     HERO STATS (your existing)
  ========================= */
  const [applications, setApplications] = useState(0);
  const [interviews, setInterviews] = useState(0);
  const [offers, setOffers] = useState(0);

  const started = useRef(false);

  /* =========================
     JOB SYSTEM (NEW - INDEED STYLE)
  ========================= */
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const API = "http://localhost:5000/api/jobs";

  const fetchJobs = async () => {
    try {
      const res = await axios.get(API);
      setJobs(res.data);
    } catch (err) {
      console.log("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* =========================
     FILTERED JOBS (INDEED SEARCH)
  ========================= */
  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     STATS ANIMATION (your existing)
  ========================= */
  useEffect(() => {

    const handleScroll = () => {

      const statsSection = document.querySelector(".stats-bar");

      if (!statsSection) return;

      const sectionTop = statsSection.getBoundingClientRect().top;

      if (
        sectionTop < window.innerHeight - 100 &&
        !started.current
      ) {

        started.current = true;

        let appCount = 0;
        let interviewCount = 0;
        let offerCount = 0;

        const appInterval = setInterval(() => {

          appCount += 100;

          if (appCount >= 10000) {
            appCount = 10000;
            clearInterval(appInterval);
          }

          setApplications(appCount);

        }, 20);

        const interviewInterval = setInterval(() => {

          interviewCount += 50;

          if (interviewCount >= 5000) {
            interviewCount = 5000;
            clearInterval(interviewInterval);
          }

          setInterviews(interviewCount);

        }, 20);

        const offerInterval = setInterval(() => {

          offerCount += 20;

          if (offerCount >= 2000) {
            offerCount = 2000;
            clearInterval(offerInterval);
          }

          setOffers(offerCount);

        }, 20);

      }

    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  return (

    <div className="home">

      {/* =========================
          HERO SECTION (UNCHANGED)
      ========================= */}
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >

        <div className="hero-glow"></div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >

          <span className="hero-badge">
            Smart Career Management Platform
          </span>

          <h1>Manage Your Job Search Like a Pro 🚀</h1>

          <p>
            JobMate helps you track applications, schedule interviews,
            monitor progress, and stay organized.
          </p>

          <div className="hero-actions">

            <Link to="/freeacc" className="primary-btn">
              Get Started
            </Link>

            <Link to="/explorefeatures" className="ghost-btn">
              Explore Features
            </Link>

          </div>

        </motion.div>

      </motion.section>

      {/* =========================
          NEW INDEED JOB SEARCH BAR
      ========================= */}
      <section className="job-search-section">

        <h2>Find Your Dream Job 🔍</h2>

        <input
          type="text"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="job-search-input"
        />

      </section>

      {/* =========================
          JOB LIST (INDEED STYLE)
      ========================= */}
      <section className="job-list">

        {filteredJobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="job-card">

              <h3>{job.title}</h3>
              <p><b>{job.company}</b></p>
              <p>{job.location || "Remote"}</p>

              <button className="apply-btn">
                View Details
              </button>

            </div>
          ))
        )}

      </section>

      {/* =========================
          STATS BAR (UNCHANGED)
      ========================= */}
      <motion.section className="stats-bar">

        <div className="stat-box">
          <h3>{applications}</h3>
          <p>Applications Tracked</p>
        </div>

        <div className="stat-box">
          <h3>{interviews}</h3>
          <p>Interviews Scheduled</p>
        </div>

        <div className="stat-box">
          <h3>{offers}</h3>
          <p>Offers Received</p>
        </div>

      </motion.section>

    </div>
  );
}

export default Home;
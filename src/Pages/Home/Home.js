import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { publicStats } from "../../api/jobs";
import "./Home.css";

const HOME_FOR = { seeker: "/jobs", recruiter: "/recruiter", admin: "/admin" };

function Home() {
  const { user, ready } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    publicStats().then(setStats).catch(() => {});
  }, []);

  // Logged-in users go straight to their portal.
  if (ready && user) {
    return <Navigate to={HOME_FOR[user.role] || "/"} replace />;
  }

  return (
    <div className="home">
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
          <span className="hero-badge">AI-powered job marketplace</span>

          <h1>Where talent meets opportunity 🚀</h1>

          <p>
            JobMate connects job seekers and recruiters in one place — browse
            roles, apply in a click, and let AI sharpen your resume. Recruiters
            post jobs and manage applicants effortlessly.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary-btn">
              Get Started — it's free
            </Link>
            <Link to="/login" className="ghost-btn">
              Log in
            </Link>
          </div>
        </motion.div>
      </motion.section>

      <section className="home-roles">
        <div className="role-col">
          <h3>For job seekers</h3>
          <ul>
            <li>Browse and apply to open roles</li>
            <li>Track every application in one place</li>
            <li>AI resume match score + career chatbot</li>
          </ul>
          <Link to="/register" className="role-link">Join as a seeker →</Link>
        </div>

        <div className="role-col">
          <h3>For recruiters</h3>
          <ul>
            <li>Post jobs in minutes</li>
            <li>Review applicants with cover letters</li>
            <li>Move candidates through your pipeline</li>
          </ul>
          <Link to="/register" className="role-link">Join as a recruiter →</Link>
        </div>
      </section>

      <motion.section className="stats-bar">
        <div className="stat-box">
          <h3>{stats ? stats.jobs : "—"}</h3>
          <p>Open jobs</p>
        </div>
        <div className="stat-box">
          <h3>{stats ? stats.companies : "—"}</h3>
          <p>Companies hiring</p>
        </div>
        <div className="stat-box">
          <h3>{stats ? stats.seekers : "—"}</h3>
          <p>Job seekers</p>
        </div>
      </motion.section>

      {/* HOW IT WORKS */}
      <section className="home-how">
        <h2>How it works</h2>
        <div className="how-grid">
          <div className="how-step">
            <span className="how-num">1</span>
            <h4>Create your account</h4>
            <p>Sign up in seconds as a job seeker or a recruiter.</p>
          </div>
          <div className="how-step">
            <span className="how-num">2</span>
            <h4>Browse or post</h4>
            <p>Seekers browse and filter roles; recruiters post jobs (AI writes the description).</p>
          </div>
          <div className="how-step">
            <span className="how-num">3</span>
            <h4>Apply or hire</h4>
            <p>Apply in one click with an AI cover letter, or review applicants and move them through your pipeline.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-features">
        <h2>Powered by AI, end to end</h2>
        <div className="feat-grid">
          <div className="feat-card"><h4>🎯 Resume match</h4><p>Score your fit for any job and see exactly what to improve.</p></div>
          <div className="feat-card"><h4>✍️ Cover letters</h4><p>Generate a tailored cover letter the moment you apply.</p></div>
          <div className="feat-card"><h4>📝 Job descriptions</h4><p>Recruiters get a full posting written from just a title.</p></div>
          <div className="feat-card"><h4>💬 Career chatbot</h4><p>Ask anything about resumes, interviews, or visas.</p></div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="home-cta">
        <h2>Ready to get started?</h2>
        <p>Join JobMate today — it's free.</p>
        <Link to="/register" className="primary-btn">Create your account</Link>
      </section>
    </div>
  );
}

export default Home;

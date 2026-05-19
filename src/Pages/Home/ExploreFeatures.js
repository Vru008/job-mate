import React from "react";
import { Link } from "react-router-dom";
import "./ExploreFeatures.css";

function ExploreFeatures() {
  return (
    <div className="explore-page">

      {/* HERO */}
      <section className="explore-hero">

        <div className="explore-content">
          <h1>Explore Powerful Features ✨</h1>

          <p>
            JobMate is designed to simplify your entire job search journey.
            From tracking applications to scheduling interviews, everything
            stays organized in one professional dashboard.
          </p>

          <Link to="/freeacc" className="explore-btn">
            Start Free Today
          </Link>
        </div>

      </section>

      {/* FEATURES GRID */}
      <section className="explore-features">

        <div className="explore-card">
          <div className="feature-icon">📋</div>

          <h2>Application Tracking</h2>

          <p>
            Keep track of every job application with company details,
            status updates, deadlines, and notes in one place.
          </p>
        </div>

        <div className="explore-card">
          <div className="feature-icon">📅</div>

          <h2>Interview Scheduling</h2>

          <p>
            Organize interview dates, meeting links, reminders,
            and recruiter details effortlessly.
          </p>
        </div>

        <div className="explore-card">
          <div className="feature-icon">📊</div>

          <h2>Status Dashboard</h2>

          <p>
            Visualize your job search performance with analytics,
            progress tracking, and smart insights.
          </p>
        </div>

        <div className="explore-card">
          <div className="feature-icon">⚡</div>

          <h2>Smart Workflow</h2>

          <p>
            Streamline your job search process with organized workflows
            and productivity-focused tools.
          </p>
        </div>

      </section>

      {/* EXTRA SECTION */}
      <section className="explore-extra">

        <h2>Built for Modern Job Seekers</h2>

        <p>
          Whether you are a student, graduate, or experienced professional,
          JobMate helps you stay focused and organized throughout your career journey.
        </p>

        <div className="extra-stats">

          <div className="stat-box">
            <h3>10K+</h3>
            <p>Applications Managed</p>
          </div>

          <div className="stat-box">
            <h3>5K+</h3>
            <p>Interview Schedules</p>
          </div>

          <div className="stat-box">
            <h3>99%</h3>
            <p>User Satisfaction</p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default ExploreFeatures;
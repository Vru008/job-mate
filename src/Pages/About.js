import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">

        <div className="about-container">

          <span className="badge">About JobMate</span>

          <h1>
            Built for Modern Job Seekers 🚀
          </h1>

          <p>
            JobMate is a smart career management platform designed to simplify
            job searching, organize applications, and help users stay in control
            of their career journey.
          </p>

        </div>

      </section>

      {/* MISSION */}
      <section className="about-section">

        <h2>Our Mission</h2>

        <p>
          We aim to remove chaos from job searching by providing a clean,
          structured system where users can track applications, interviews,
          and progress in one place without stress.
        </p>

      </section>

      {/* FEATURES HIGHLIGHT */}
      <section className="about-grid">

        <div className="card">
          <h3>📋 Application Tracking</h3>
          <p>Track every job application with status, dates, and company details.</p>
        </div>

        <div className="card">
          <h3>📅 Interview Management</h3>
          <p>Organize interviews with reminders and scheduling tools.</p>
        </div>

        <div className="card">
          <h3>📊 Progress Dashboard</h3>
          <p>Visualize your job search journey with clean analytics.</p>
        </div>

      </section>

      {/* CTA */}
      <section className="about-cta">

        <h2>Start Your Career Journey Smarter</h2>

        <p>
          Stop managing jobs in spreadsheets. Move to a structured system built for speed and clarity.
        </p>

      </section>

    </div>
  );
}

export default About;
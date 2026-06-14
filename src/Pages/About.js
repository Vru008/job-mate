import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="about-hero">
        <div className="about-container">
          <span className="badge">About JobMate</span>
          <h1>Where talent meets opportunity 🚀</h1>
          <p>
            JobMate is an AI-powered job marketplace that connects job seekers
            and recruiters in one place — browse roles, apply in a click, post
            jobs, and hire faster.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          We make hiring and job hunting simpler for both sides. Seekers find
          roles and apply instantly with AI help; recruiters post openings and
          manage applicants through a clean pipeline — no spreadsheets, no chaos.
        </p>
      </section>

      {/* FEATURES HIGHLIGHT */}
      <section className="about-grid">
        <div className="card">
          <h3>🔎 For seekers</h3>
          <p>Browse jobs, apply in one click, and track every application — with an AI resume match score and career chatbot.</p>
        </div>
        <div className="card">
          <h3>🏢 For recruiters</h3>
          <p>Post jobs in minutes (AI can write the description), review applicants, and move them through your hiring pipeline.</p>
        </div>
        <div className="card">
          <h3>🛡️ Built right</h3>
          <p>Secure accounts, role-based access, and an admin console overseeing the whole platform.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h2>Join the marketplace</h2>
        <p>
          Whether you're hiring or job hunting, JobMate gives you a fast,
          AI-assisted way to get there.
        </p>
      </section>

    </div>
  );
}

export default About;

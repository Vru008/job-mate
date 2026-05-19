import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">

          <h2 className="logo">JobMate</h2>

          <p>
            A modern career OS that helps you track applications,
            manage interviews, and stay organized with clarity.
          </p>

          {/* SOCIAL CENTER */}
          <div className="social">

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>

          </div>

        </div>

        {/* LINKS */}
        <div className="footer-links">

          <div>
            <h4>Platform</h4>

            <Link to="/" onClick={scrollToTop}>
              Home
            </Link>

            <Link to="/explore-features" onClick={scrollToTop}>
              Features
            </Link>

            <Link to="/status-dashboard" onClick={scrollToTop}>
              Dashboard
            </Link>
          </div>

          <div>
            <h4>Tools</h4>

            <Link to="/ApplicationTracking" onClick={scrollToTop}>
              Tracking
            </Link>

            <Link to="/InterviewScheduling" onClick={scrollToTop}>
              Interviews
            </Link>

            <Link to="/freeacc" onClick={scrollToTop}>
              Get Started
            </Link>
          </div>

          <div>
            <h4>Account</h4>

            <Link to="/login" onClick={scrollToTop}>
              Login
            </Link>

            <Link to="/freeacc" onClick={scrollToTop}>
              Create Account
            </Link>
          </div>

        </div>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} JobMate. All rights reserved.
        </p>

        <div className="meta">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Security</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
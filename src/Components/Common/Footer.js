import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="footer-top">
        {/* BRAND */}
        <div className="footer-brand">
          <h2 className="logo">JobMate</h2>
          <p>
            An AI-powered job marketplace connecting seekers and recruiters —
            browse, apply, post, and hire in one place.
          </p>
          <div className="social">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        {/* LINK COLUMNS */}
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <Link to="/" onClick={scrollToTop}>Home</Link>
            <Link to="/about" onClick={scrollToTop}>About</Link>
          </div>
          <div>
            <h4>For seekers</h4>
            <Link to="/register" onClick={scrollToTop}>Find a job</Link>
            <Link to="/register" onClick={scrollToTop}>AI resume match</Link>
            <Link to="/register" onClick={scrollToTop}>Track applications</Link>
          </div>
          <div>
            <h4>For recruiters</h4>
            <Link to="/register" onClick={scrollToTop}>Post a job</Link>
            <Link to="/register" onClick={scrollToTop}>Review applicants</Link>
            <Link to="/register" onClick={scrollToTop}>Hiring pipeline</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login" onClick={scrollToTop}>Login</Link>
            <Link to="/register" onClick={scrollToTop}>Create account</Link>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-news">
          <h4>Stay in the loop</h4>
          <p>Job tips and product updates, occasionally.</p>
          <form className="news-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@email.com" aria-label="Email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} JobMate. All rights reserved.</p>
        <div className="meta">
          <Link to="/privacy" onClick={scrollToTop}>Privacy</Link>
          <Link to="/terms" onClick={scrollToTop}>Terms</Link>
          <Link to="/security" onClick={scrollToTop}>Security</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

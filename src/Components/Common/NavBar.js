import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  };

  return (
    <>
      <nav className="navbar">

        <Link to="/" className="Left" onClick={scrollToTop}>
          JobMate
        </Link>

        <div className="desktop-nav">

          <NavLink to="/" className="nav-link" onClick={scrollToTop}>
            Home
          </NavLink>

          <NavLink to="/dashboard" className="nav-link" onClick={scrollToTop}>
            Dashboard
          </NavLink>

          <NavLink to="/add-job" className="nav-link" onClick={scrollToTop}>
            Add Job
          </NavLink>

          <NavLink to="/about" className="nav-link" onClick={scrollToTop}>
            About
          </NavLink>

          <NavLink to="/login" className="nav-cta" onClick={scrollToTop}>
            Login
          </NavLink>

        </div>

        <div
          className="hamburger"
          onClick={() => setMenuOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

        <div className="close-btn" onClick={closeMenu}>
          ✕
        </div>

        <NavLink to="/" className="mobile-link" onClick={scrollToTop}>
          Home
        </NavLink>

        <NavLink to="/dashboard" className="mobile-link" onClick={scrollToTop}>
          Dashboard
        </NavLink>

        <NavLink to="/add-job" className="mobile-link" onClick={scrollToTop}>
          Add Job
        </NavLink>

        <NavLink to="/about" className="mobile-link" onClick={scrollToTop}>
          About
        </NavLink>

        <NavLink to="/login" className="mobile-cta" onClick={scrollToTop}>
          Login
        </NavLink>

      </div>
    </>
  );
}

export default Navbar;
import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

// Menu links shown per role.
const LINKS_BY_ROLE = {
  guest: [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ],
  seeker: [
    { to: "/jobs", label: "Jobs" },
    { to: "/my-applications", label: "My Applications" },
    { to: "/resume-match", label: "Resume Match" },
  ],
  recruiter: [
    { to: "/recruiter", label: "Dashboard" },
    { to: "/recruiter/post", label: "Post a Job" },
  ],
  admin: [
    { to: "/admin", label: "Admin" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/jobs", label: "Jobs" },
  ],
};

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  const links = LINKS_BY_ROLE[user?.role || "guest"];

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="Left" onClick={scrollToTop}>
          JobMate
        </Link>

        <div className="desktop-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="nav-link"
              onClick={scrollToTop}
            >
              {l.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink to="/account/profile" className="nav-user" onClick={scrollToTop}>
                {user.name.split(" ")[0]} · {user.role}
              </NavLink>
              <button className="nav-cta" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" onClick={scrollToTop}>
                Login
              </NavLink>
              <NavLink to="/register" className="nav-cta" onClick={scrollToTop}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={closeMenu}>
          ✕
        </div>

        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className="mobile-link"
            onClick={scrollToTop}
          >
            {l.label}
          </NavLink>
        ))}

        {user ? (
          <>
            <NavLink to="/account/profile" className="mobile-link" onClick={scrollToTop}>
              Account
            </NavLink>
            <button className="mobile-cta" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="mobile-link" onClick={scrollToTop}>
              Login
            </NavLink>
            <NavLink to="/register" className="mobile-cta" onClick={scrollToTop}>
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;

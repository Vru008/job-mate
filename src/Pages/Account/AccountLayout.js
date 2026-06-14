import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Account.css";

function initials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Links shown in the account sidebar. role-specific shortcuts included.
const ROLE_SHORTCUTS = {
  seeker: [
    { to: "/jobs", label: "Browse jobs", icon: "🔍" },
    { to: "/my-applications", label: "My applications", icon: "📄" },
    { to: "/resume-match", label: "Resume match", icon: "🎯" },
  ],
  recruiter: [
    { to: "/recruiter", label: "My jobs", icon: "💼" },
    { to: "/recruiter/post", label: "Post a job", icon: "➕" },
  ],
  admin: [
    { to: "/admin", label: "Admin console", icon: "📊" },
    { to: "/admin/users", label: "Users", icon: "👥" },
    { to: "/admin/jobs", label: "Jobs", icon: "🗂️" },
  ],
};

function AccountLayout() {
  const { user, logout } = useAuth();
  const shortcuts = ROLE_SHORTCUTS[user?.role] || [];

  return (
    <div className="acc-page">
      <div className="acc-shell">
        <aside className="acc-side">
          <div className="acc-id">
            <div className="acc-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" />
              ) : (
                <span>{initials(user?.name) || "?"}</span>
              )}
            </div>
            <div className="acc-id-text">
              <strong>{user?.name}</strong>
              <span className="acc-role">{user?.role}</span>
            </div>
          </div>

          <nav className="acc-nav">
            <p className="acc-nav-label">Account</p>
            <NavLink to="/account/profile" className="acc-link">
              <span>👤</span> Profile
            </NavLink>
            <NavLink to="/account/settings" className="acc-link">
              <span>⚙️</span> Settings
            </NavLink>

            {shortcuts.length > 0 && (
              <>
                <p className="acc-nav-label">Shortcuts</p>
                {shortcuts.map((s) => (
                  <NavLink key={s.to} to={s.to} className="acc-link" end>
                    <span>{s.icon}</span> {s.label}
                  </NavLink>
                ))}
              </>
            )}
          </nav>

          <button className="acc-logout" onClick={logout}>
            Log out
          </button>
        </aside>

        <main className="acc-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AccountLayout;

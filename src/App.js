import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Navbar from "./Components/Common/NavBar";
import Footer from "./Components/Common/Footer";
import Chatbot from "./Components/Chatbot/Chatbot";

import Home from "./Pages/Home/Home";
import About from "./Pages/About";
import Login from "./Pages/Home/Login";
import Register from "./Pages/Home/Register";
import ForgotPassword from "./Pages/Home/ForgotPassword";
import ResetPassword from "./Pages/Home/ResetPassword";

import Privacy from "./Pages/Legal/Privacy";
import Terms from "./Pages/Legal/Terms";
import Security from "./Pages/Legal/Security";

import ResumeMatch from "./Pages/ResumeMatch/ResumeMatch";
import AccountLayout from "./Pages/Account/AccountLayout";
import Profile from "./Pages/Profile/Profile";
import Settings from "./Pages/Account/Settings";

import ProtectedRoute from "./Components/Auth/ProtectedRoute";

/* Seeker portal */
import BrowseJobs from "./Pages/Seeker/BrowseJobs";
import MyApplications from "./Pages/Seeker/MyApplications";

/* Recruiter portal */
import RecruiterDashboard from "./Pages/Recruiter/RecruiterDashboard";
import PostJob from "./Pages/Recruiter/PostJob";
import Applicants from "./Pages/Recruiter/Applicants";

/* Admin console */
import AdminConsole from "./Pages/Admin/AdminConsole";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminJobs from "./Pages/Admin/AdminJobs";

import "./App.css";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return null;
}

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/security" element={<Security />} />

        {/* Account area (side-nav) — any logged-in user */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ===== SEEKER PORTAL ===== */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute roles={["seeker"]}>
              <BrowseJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute roles={["seeker"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-match"
          element={
            <ProtectedRoute roles={["seeker"]}>
              <ResumeMatch />
            </ProtectedRoute>
          }
        />

        {/* ===== RECRUITER PORTAL ===== */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute roles={["recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/post"
          element={
            <ProtectedRoute roles={["recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/job/:jobId/applicants"
          element={
            <ProtectedRoute roles={["recruiter", "admin"]}>
              <Applicants />
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN CONSOLE ===== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminConsole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminJobs />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
      {/* Career chatbot is a seeker tool */}
      {user?.role === "seeker" && <Chatbot />}
    </Router>
  );
}

export default App;

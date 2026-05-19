import React, { useState } from "react";
import "./FreeAcc.css";

function FreeAcc() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Free Account Created Successfully 🚀 (connect backend later)");
  };

  return (
    <div className="freeacc-page">

      {/* LEFT INFO SECTION */}
      <div className="freeacc-left">
        <h1>Start Your FreeAcc 🚀</h1>
        <p>
          Create your free JobMate account and take control of your job search.
          Track applications, schedule interviews, and grow your career with clarity.
        </p>

        <ul>
          <li>📋 Track all job applications</li>
          <li>📅 Manage interview schedules</li>
          <li>📊 Visual career dashboard</li>
          <li>⚡ Smart job tracking system</li>
        </ul>
      </div>

      {/* FORM SECTION */}
      <div className="freeacc-right">

        <form className="freeacc-form" onSubmit={handleSubmit}>
          <h2>Create FreeAcc</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Create FreeAcc</button>

          <p className="note">
            By continuing, you agree to JobMate terms & privacy policy.
          </p>
        </form>

      </div>

    </div>
  );
}

export default FreeAcc;
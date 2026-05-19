import React from "react";
import "./InterviewScheduling.css";

export default function InterviewScheduling() {
  const interviews = [
    {
      id: 1,
      title: "Frontend Developer Interview",
      company: "TechCorp",
      date: "Feb 25, 2026",
      time: "10:00 AM",
      type: "Video Call",
      status: "Upcoming",
    },
    {
      id: 2,
      title: "UI/UX Designer Interview",
      company: "DesignHub",
      date: "Feb 28, 2026",
      time: "2:00 PM",
      type: "Onsite",
      status: "Scheduled",
    },
    {
      id: 3,
      title: "React Developer Technical Round",
      company: "WebSolutions",
      date: "Mar 2, 2026",
      time: "11:30 AM",
      type: "Video Call",
      status: "Preparation",
    },
  ];

  return (
    <div className="interview-container">

      {/* Header */}
      <div className="interview-header">
        <h2>📅 Interview Scheduling</h2>
        <p>
          Manage your upcoming interviews, prepare effectively, and never miss an opportunity.
        </p>
      </div>

      {/* Cards */}
      <div className="schedule-cards">
        {interviews.map((item) => (
          <div className="schedule-card" key={item.id}>

            <div className="card-top">
              <h3>{item.title}</h3>
              <span className="status-tag">{item.status}</span>
            </div>

            <p><strong>Company:</strong> {item.company}</p>
            <p>📅 {item.date}</p>
            <p>⏰ {item.time}</p>
            <p>💻 {item.type}</p>

            <button className="action-btn">View Details</button>
          </div>
        ))}
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h2>🧠 Interview Tips</h2>

        <div className="tip-box">
          ✔ Research the company before attending the interview
        </div>

        <div className="tip-box">
          ✔ Practice common coding and behavioral questions
        </div>

        <div className="tip-box">
          ✔ Keep your resume and portfolio ready
        </div>
      </div>

    </div>
  );
}
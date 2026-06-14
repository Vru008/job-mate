import React from "react";
import "./Legal.css";

function LegalLayout({ title, updated, children }) {
  return (
    <div className="legal-page">
      <div className="legal-card">
        <span className="legal-badge">Legal</span>
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: {updated}</p>
        <div className="legal-body">{children}</div>
        <p className="legal-note">
          JobMate is a portfolio demonstration project. This document is provided
          for illustrative purposes and is not legal advice.
        </p>
      </div>
    </div>
  );
}

export default LegalLayout;

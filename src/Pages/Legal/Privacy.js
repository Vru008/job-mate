import React from "react";
import LegalLayout from "./LegalLayout";

function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="June 2026">
      <p>
        This Privacy Policy explains what information JobMate collects, how we use
        it, and the choices you have. By using JobMate, you agree to this policy.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information</strong> — your name, email, and password (stored only as a secure hash).</li>
        <li><strong>Profile information</strong> — optional details you add, such as headline, location, bio, company, and a profile photo.</li>
        <li><strong>Activity</strong> — jobs you post or apply to, applications, and their statuses.</li>
        <li><strong>Content you provide to AI features</strong> — resume text or files and job descriptions you submit for analysis.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To operate the marketplace — let seekers apply and recruiters review applicants.</li>
        <li>To provide AI features such as resume matching and cover-letter generation.</li>
        <li>To secure your account and prevent abuse.</li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        AI features are powered by Google Gemini. Text you submit to those features
        is sent to Google's API to generate a response. Account and job data are
        stored in MongoDB. We do not sell your personal data.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>You can edit your profile or change your password at any time from your account settings.</li>
        <li>You can withdraw applications or delete jobs you posted.</li>
        <li>You may request deletion of your account by contacting us.</li>
      </ul>

      <h2>Contact</h2>
      <p>Questions about privacy? Reach out at privacy@jobmate.example.</p>
    </LegalLayout>
  );
}

export default Privacy;

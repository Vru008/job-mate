import React from "react";
import LegalLayout from "./LegalLayout";

function Security() {
  return (
    <LegalLayout title="Security" updated="June 2026">
      <p>
        We take the security of your account and data seriously. Here's an overview
        of how JobMate is built to protect you.
      </p>

      <h2>How we protect your data</h2>
      <ul>
        <li><strong>Passwords</strong> are never stored in plain text — they're hashed with bcrypt.</li>
        <li><strong>Authentication</strong> uses signed JSON Web Tokens (JWT) that expire automatically.</li>
        <li><strong>Role-based access control</strong> ensures seekers, recruiters, and admins can only access what they should.</li>
        <li><strong>Ownership checks</strong> stop one recruiter from viewing or editing another's jobs and applicants.</li>
        <li><strong>Secrets</strong> (database and API keys) live in server-side environment variables, never in the browser.</li>
      </ul>

      <h2>Your role in staying secure</h2>
      <ul>
        <li>Use a strong, unique password and update it from your settings if needed.</li>
        <li>Log out on shared devices.</li>
        <li>Be cautious about the personal information you include in your profile or resume.</li>
      </ul>

      <h2>Responsible disclosure</h2>
      <p>
        If you believe you've found a security issue, please report it to
        security@jobmate.example so we can investigate and address it.
      </p>
    </LegalLayout>
  );
}

export default Security;

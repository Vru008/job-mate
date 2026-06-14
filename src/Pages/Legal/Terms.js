import React from "react";
import LegalLayout from "./LegalLayout";

function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="June 2026">
      <p>
        These Terms govern your use of JobMate. By creating an account or using
        the platform, you agree to them.
      </p>

      <h2>Accounts</h2>
      <p>
        You're responsible for the accuracy of your information and for keeping
        your password secure. You may register as a job seeker or a recruiter, and
        your available features depend on your role.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Don't post false, misleading, or discriminatory job listings.</li>
        <li>Don't submit content you don't have the right to share.</li>
        <li>Don't attempt to access accounts or data that aren't yours.</li>
      </ul>

      <h2>Job postings and applications</h2>
      <p>
        Recruiters are responsible for the jobs they post; seekers are responsible
        for the applications they submit. JobMate is a platform that connects the
        two and does not guarantee hiring outcomes.
      </p>

      <h2>AI features</h2>
      <p>
        AI-generated content (resume scores, cover letters, job descriptions) is a
        helpful starting point, not professional advice. Always review and edit it
        before relying on it.
      </p>

      <h2>Termination</h2>
      <p>
        You may stop using JobMate at any time. We may suspend accounts that
        violate these Terms.
      </p>

      <h2>Disclaimer</h2>
      <p>
        JobMate is provided "as is" without warranties of any kind. To the extent
        permitted by law, we are not liable for damages arising from your use of
        the platform.
      </p>

      <h2>Contact</h2>
      <p>Questions about these Terms? Reach out at legal@jobmate.example.</p>
    </LegalLayout>
  );
}

export default Terms;

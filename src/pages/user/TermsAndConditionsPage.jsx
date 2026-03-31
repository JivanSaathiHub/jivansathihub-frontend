import "./LegalPage.css";

export default function TermsAndConditionsPage({ onBack, onMenuClick }) {
  return (
    <div className="site-wrapper">
      <main className="legal-main">
        <div className="legal-container">
          <button className="legal-back-btn" onClick={onBack}>← Back</button>
          <h1 className="legal-title">Terms and Conditions</h1>
          <p className="legal-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using JeevanSaathiHub, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.</p>
          </section>

          <section className="legal-section">
            <h2>2. Eligibility</h2>
            <p>You must be at least 18 years of age to register and use JeevanSaathiHub. By creating an account, you confirm that you are legally eligible to enter into a binding contract and meet all eligibility requirements.</p>
          </section>

          <section className="legal-section">
            <h2>3. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.</p>
          </section>

          <section className="legal-section">
            <h2>4. Prohibited Conduct</h2>
            <p>You agree not to use our service for any unlawful purpose, to harass or harm other users, to post false or misleading information, to impersonate any person, or to engage in any activity that disrupts or interferes with our services.</p>
          </section>

          <section className="legal-section">
            <h2>5. Membership and Payments</h2>
            <p>Some features of JeevanSaathiHub require a paid membership. All payments are processed securely. Membership fees are non-refundable except as outlined in our Refund Policy.</p>
          </section>

          <section className="legal-section">
            <h2>6. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time if you violate these terms or engage in conduct that we determine is harmful to other users or to our platform.</p>
          </section>

          <section className="legal-section">
            <h2>7. Limitation of Liability</h2>
            <p>JeevanSaathiHub is not responsible for the accuracy of user-provided information, the conduct of users, or the outcome of any meetings or relationships formed through our platform.</p>
          </section>

          <section className="legal-section">
            <h2>8. Contact Us</h2>
            <p>For any questions regarding these Terms and Conditions, please contact us at <strong>legal@jeevansaathihub.com</strong></p>
          </section>
        </div>
      </main>
    </div>
  );
}
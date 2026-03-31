import "./LegalPage.css";

export default function PrivacyPolicyPage({ onBack, onMenuClick }) {
  return (
    <div className="site-wrapper">
      <main className="legal-main">
        <div className="legal-container">
          <button className="legal-back-btn" onClick={onBack}>← Back</button>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, complete your profile, or interact with our services. This includes your name, email address, phone number, date of birth, photographs, and other profile information.</p>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, match you with compatible profiles, send you notifications about matches and interests, and communicate with you about your account and our services.</p>
          </section>

          <section className="legal-section">
            <h2>3. Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personally identifiable information to third parties without your consent, except as described in this policy. Your profile information is shared with other registered members as part of the matchmaking service.</p>
          </section>

          <section className="legal-section">
            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. All data is encrypted in transit and at rest.</p>
          </section>

          <section className="legal-section">
            <h2>5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information at any time through your account settings. You may also contact us directly to exercise these rights or to raise any concerns about how your data is handled.</p>
          </section>

          <section className="legal-section">
            <h2>6. Cookies</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience on our platform. Please refer to our Cookie Policy for detailed information about how we use cookies.</p>
          </section>

          <section className="legal-section">
            <h2>7. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <strong>privacy@jeevansaathihub.com</strong></p>
          </section>
        </div>
      </main>
    </div>
  );
}
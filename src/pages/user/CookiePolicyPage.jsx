import "./LegalPage.css";

export default function CookiePolicyPage({ onBack, onMenuClick }) {
  return (
    <div className="site-wrapper">
      <main className="legal-main">
        <div className="legal-container">
          <button className="legal-back-btn" onClick={onBack}>← Back</button>
          <h1 className="legal-title">Cookie Policy</h1>
          <p className="legal-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. What Are Cookies</h2>
            <p>Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences, keep you logged in, and understand how you use the site so we can improve your experience.</p>
          </section>

          <section className="legal-section">
            <h2>2. How We Use Cookies</h2>
            <p>JeevanSaathiHub uses cookies for the following purposes: to keep you logged into your account, to remember your language and display preferences, to analyse how our platform is used so we can improve it, and to provide relevant features and personalised content.</p>
          </section>

          <section className="legal-section">
            <h2>3. Types of Cookies We Use</h2>
            <p><strong>Essential Cookies:</strong> Required for the platform to function. These cannot be disabled as they are necessary for authentication and security.</p>
            <p><strong>Preference Cookies:</strong> Remember your settings such as language selection and display preferences.</p>
            <p><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our platform so we can improve performance and usability.</p>
          </section>

          <section className="legal-section">
            <h2>4. Managing Cookies</h2>
            <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our platform. Removing essential cookies may require you to log in again and reset your preferences.</p>
          </section>

          <section className="legal-section">
            <h2>5. Third-Party Cookies</h2>
            <p>We may use third-party services such as analytics providers that set their own cookies. These are governed by the respective third parties' privacy and cookie policies.</p>
          </section>

          <section className="legal-section">
            <h2>6. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.</p>
          </section>

          <section className="legal-section">
            <h2>7. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us at <strong>privacy@jeevansaathihub.com</strong></p>
          </section>
        </div>
      </main>
    </div>
  );
}
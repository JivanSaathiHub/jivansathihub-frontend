import "./LegalPage.css";

export default function RefundPolicyPage({ onBack, onMenuClick }) {
  return (
    <div className="site-wrapper">
      <main className="legal-main">
        <div className="legal-container">
          <button className="legal-back-btn" onClick={onBack}>← Back</button>
          <h1 className="legal-title">Refund Policy</h1>
          <p className="legal-updated">Last updated: January 1, 2025</p>

          <section className="legal-section">
            <h2>1. General Policy</h2>
            <p>At JeevanSaathiHub, we strive to provide the best possible matchmaking experience. All membership purchases are generally non-refundable once activated. However, we consider refund requests on a case-by-case basis under the circumstances outlined below.</p>
          </section>

          <section className="legal-section">
            <h2>2. Eligible Refund Scenarios</h2>
            <p>You may be eligible for a refund if: you were charged twice for the same subscription, a technical error on our part prevented you from accessing your purchased features, or you cancel within 24 hours of your first-time purchase and have not used any premium features.</p>
          </section>

          <section className="legal-section">
            <h2>3. Non-Refundable Situations</h2>
            <p>Refunds will not be issued for: change of mind after 24 hours, partial use of a membership period, inability to find a suitable match, account suspension due to violation of our Terms and Conditions, or free trial conversions.</p>
          </section>

          <section className="legal-section">
            <h2>4. How to Request a Refund</h2>
            <p>To request a refund, please contact our support team at <strong>support@jeevansaathihub.com</strong> within 7 days of the transaction. Please include your registered email address, transaction ID, and reason for the refund request.</p>
          </section>

          <section className="legal-section">
            <h2>5. Processing Time</h2>
            <p>Approved refunds will be processed within 7–10 business days and will be credited back to the original payment method. Processing times may vary depending on your bank or payment provider.</p>
          </section>

          <section className="legal-section">
            <h2>6. Contact Us</h2>
            <p>For refund-related queries, please reach us at <strong>support@jeevansaathihub.com</strong> or call our helpline during business hours.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
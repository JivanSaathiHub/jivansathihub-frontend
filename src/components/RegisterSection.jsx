import "./RegisterSection.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function RegisterSection({ onNavigate, onDashboard }) {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  return (
    <section className="register-section" id="register">
      <div className="section-header">
        <h2 className="inter-title">{t("register.title")}</h2>
        <p>{t("register.subtitle")}</p>
      </div>

      <div className="steps-grid">
        <div className="step">
          <div className="step-icon pink">
            <svg width="28" height="28" fill="#dc2626" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h5v1.5H8V16zm0-6h3v1.5H8V10z" />
            </svg>
          </div>
          <h3>{t("register.steps.createProfile.title")}</h3>
          <p>{t("register.steps.createProfile.desc")}</p>
        </div>

        <div className="step">
          <div className="step-icon yellow">
            <svg width="28" height="28" fill="#ca8a04" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h3>{t("register.steps.browseMatches.title")}</h3>
          <p>{t("register.steps.browseMatches.desc")}</p>
        </div>

        <div className="step">
          <div className="step-icon green">
            <svg width="28" height="28" fill="#16a34a" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h3>{t("register.steps.findPartner.title")}</h3>
          <p>{t("register.steps.findPartner.desc")}</p>
        </div>
      </div>

      <div className="register-cta-wrap">
        {isLoggedIn ? (
          <button className="hero-cta-btn" onClick={() => onDashboard()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Go to Dashboard
          </button>
        ) : (
          <button className="hero-cta-btn" onClick={() => onNavigate()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 8c0-2.21-1.79-4-4-4S5 5.79 5 8s1.79 4 4 4 4-1.79 4-4zm2 2v2h3v3h2v-3h3v-2h-3V7h-2v3h-3zM1 18v2h16v-2c0-2.66-5.33-4-8-4s-8 1.34-8 4z" />
            </svg>
            {t("register.button")}
          </button>
        )}
        <p className="hero-trust">{t("register.trust")}</p>
      </div>
    </section>
  );
}
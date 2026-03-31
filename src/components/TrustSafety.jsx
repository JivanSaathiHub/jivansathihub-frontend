import { trustPoints } from "../data/data";
import "./TrustSafety.css";
import { useTranslation } from "react-i18next";

export default function TrustSafety() {
  const { t } = useTranslation();

  return (
    <section className="trust-section">
      <div className="section-header">
        <h2>{t("trust.title")}</h2>
        <p>{t("trust.subtitle")}</p>
      </div>

      <div className="trust-grid">
        {trustPoints.map((tPoint, i) => (
          <div key={i} className="trust-card">
            <div className="trust-icon">
              <img src={tPoint.icon} alt={tPoint.title} />
            </div>
            <h4>{t(`trust.points.${i}.title`)}</h4>
            <p>{t(`trust.points.${i}.desc`)}</p>
          </div>
        ))}
      </div>

      <div className="trusted-by">
        <div className="trusted-icon">
          <img src="/Shield.png" alt="Shield" />
        </div>
        <h3>{t("trust.trustedTitle")}</h3>
        <p>{t("trust.trustedDesc")}</p>
      </div>
    </section>
  );
}
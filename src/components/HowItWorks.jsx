import { steps } from "../data/data";
import "./HowItWorks.css";
import { useTranslation } from "react-i18next";

const stepImages = {
  0: "/images/Container10.png",
  1: "/images/Container11.png",
  2: "/images/Container12.png",
};

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="how-section" id="howitworks">
      <div className="section-header">
        <h2>{t("how.title")}</h2>
        <p>{t("how.subtitle")}</p>
      </div>

      <div className="steps-grid">
        {steps.map((s, i) => (
          <div key={i} className="step-card-flip">
            <div className="step-card-inner">

              {/* FRONT */}
              <div className="step-card-front">
                <span className="step-num">{i + 1}</span>
                <div className="step-icon">
                  <img
                    src={stepImages[i]}
                    alt={t(`how.steps.${i}.title`)}
                    className="step-img"
                  />
                </div>
                <h4>{t(`how.steps.${i}.title`)}</h4>
                <p>{t(`how.steps.${i}.desc`)}</p>
              </div>

              {/* BACK */}
              <div className="step-card-back">
                <div className="step-back-num">{i + 1}</div>
                <h4>{t(`how.steps.${i}.title`)}</h4>
                <p>{t(`how.steps.${i}.desc`)}</p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
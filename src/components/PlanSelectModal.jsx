import "./PlanSelectModal.css";
import { useTranslation } from "react-i18next";

const PLANS = [
  {
    key: "free",
    icon: "⭐",
    name: "Free",
    price: "Free",
    priceNote: "forever",
    desc: "Basic features to get started",
    features: [
      "Create your profile",
      "View limited profiles",
      "Send up to 5 interests/day",
      "Basic search filters",
      "Limited chat messages",
    ],
    cta: "Get Started Free",
    comingSoon: false,
  },
  {
    key: "premium",
    icon: "👑",
    name: "Gold",
    price: "₹2,499",
    priceNote: "/month",
    desc: "Most popular for serious seekers",
    features: [
      "Unlimited profiles & interests",
      "View phone numbers",
      "Advanced filters",
      "Priority support",
      "Profile highlighted in search",
    ],
    cta: "Coming Soon",
    comingSoon: true,
  },
  {
    key: "elite",
    icon: "💎",
    name: "Platinum",
    price: "₹4,999",
    priceNote: "/month",
    desc: "Premium with dedicated support",
    features: [
      "Everything in Gold",
      "Unlimited phone & email access",
      "Dedicated relationship manager",
      "Horoscope & background check",
      "24/7 Priority support",
    ],
    cta: "Coming Soon",
    comingSoon: true,
  },
];

export default function PlanSelectModal({ onSelect }) {
  const { t } = useTranslation();

  const blockClose = (e) => e.stopPropagation();

  return (
    <div className="psm-overlay" onClick={blockClose}>
      <div className="psm-modal">

        <div className="psm-header">
          <div className="psm-header-badge">🎉 {t("psm.welcome")}</div>
          <h2 className="psm-title">{t("psm.title")}</h2>
          <p className="psm-sub">{t("psm.subtitle")}</p>
        </div>

        <div className="psm-plans">
          {PLANS.map((plan, i) => (
            <div
              key={plan.key}
              className={`psm-card ${plan.comingSoon ? "psm-card--soon" : "psm-card--free"}`}
            >
              {plan.key === "premium" && (
                <div className="psm-popular-badge">★ {t("psm.mostPopular")}</div>
              )}

              <div className="psm-card-top">
                <span className="psm-icon">{plan.icon}</span>
                <div>
                  <h3 className="psm-plan-name">
                    {t(`psm.plans.${i}.name`)}
                  </h3>
                  <p className="psm-plan-desc">
                    {t(`psm.plans.${i}.desc`)}
                  </p>
                </div>
              </div>

              <div className="psm-price-row">
                <span className="psm-price">
                  {t(`psm.plans.${i}.price`, { price: plan.price })}
                </span>
                <span className="psm-price-note">
                  {t(`psm.plans.${i}.priceNote`, { note: plan.priceNote })}
                </span>
              </div>

              <ul className="psm-features">
                {plan.features.map((f, j) => (
                  <li key={j}>
                    <span className="psm-feat-check">
                      {plan.comingSoon ? "·" : "✔"}
                    </span>{" "}
                    {t(`psm.plans.${i}.features.${j}`)}
                  </li>
                ))}
              </ul>

              <button
                className={`psm-btn ${plan.comingSoon ? "psm-btn--soon" : "psm-btn--free"}`}
                onClick={() => !plan.comingSoon && onSelect(plan.key)}
                disabled={plan.comingSoon}
              >
                {plan.comingSoon
                  ? `🔒 ${t("psm.comingSoon")}`
                  : t(`psm.plans.${i}.cta`)}
              </button>
            </div>
          ))}
        </div>

        <p className="psm-note">{t("psm.note")}</p>
      </div>
    </div>
  );
}
// src/components/MembershipPlans/MembershipPlans.jsx
import { useMembershipPlans } from "../hooks/useMembershipPlans";
import { useTranslation } from "react-i18next";
import "./MembershipPlans.css";

/* ── Static text maps ── */
const SECTION_TEXT = {
  en: {
    title:       "Membership Plans",
    subtitle:    "Choose the plan that works best for you",
    note:        "All plans come with a 7-day money-back guarantee",
    mostPopular: "Most Popular",
    comingSoon:  "Coming Soon",
    loading:     "Loading plans…",
    error:       "Could not load plans. Please refresh.",
    noPlans:     "No plans available right now.",
    forever:     "Forever",
  },
  hi: {
    title:       "सदस्यता योजनाएँ",
    subtitle:    "अपनी जरूरत की योजना चुनें",
    note:        "सभी योजनाओं में 7 दिन की मनी-बैक गारंटी है।",
    mostPopular: "सबसे लोकप्रिय",
    comingSoon:  "जल्द आ रहा है",
    loading:     "योजनाएँ लोड हो रही हैं…",
    error:       "योजनाएँ लोड नहीं हो सकीं।",
    noPlans:     "अभी कोई योजना उपलब्ध नहीं है।",
    forever:     "हमेशा के लिए",
  },
  mr: {
    title:       "सदस्यता योजना",
    subtitle:    "तुमच्यासाठी योग्य योजना निवडा",
    note:        "सर्व योजनांमध्ये ७ दिवसांची मनी-बॅक हमी आहे.",
    mostPopular: "सर्वाधिक लोकप्रिय",
    comingSoon:  "लवकरच येत आहे",
    loading:     "योजना लोड होत आहेत…",
    error:       "योजना लोड करता आल्या नाहीत.",
    noPlans:     "आत्ता कोणतीही योजना उपलब्ध नाही.",
    forever:     "कायमचे",
  },
};

/* ── Per-index theme — grey / red / gold ── */
const THEMES = [
  {
    headerBg:  "linear-gradient(145deg, #5a6474 0%, #4a5568 100%)",
    headerTxt: "#ffffff",
    icon:      "☆",
    ctaText:   { en: "Get Started",   hi: "शुरू करें",          mr: "सुरू करा"          },
    ctaBg:     "#f3f4f6",
    ctaColor:  "#374151",
    border:    "#e5e7eb",
  },
  {
    headerBg:  "linear-gradient(145deg, #cc0000 0%, #a80000 100%)",
    headerTxt: "#ffffff",
    icon:      "⚡",
    ctaText:   { en: "Coming Soon",   hi: "जल्द आ रहा है",      mr: "लवकरच येत आहे"    },
    ctaBg:     "#f3f4f6",
    ctaColor:  "#9ca3af",
    border:    "#cc0000",
  },
  {
    headerBg:  "linear-gradient(145deg, #f59e0b 0%, #d97706 100%)",
    headerTxt: "#ffffff",
    icon:      "👑",
    ctaText:   { en: "Coming Soon",   hi: "जल्द आ रहा है",      mr: "लवकरच येत आहे"    },
    ctaBg:     "#f3f4f6",
    ctaColor:  "#9ca3af",
    border:    "#e5e7eb",
  },
];

const FALLBACK = {
  headerBg:  "linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%)",
  headerTxt: "#ffffff",
  icon:      "★",
  ctaText:   { en: "Coming Soon",   hi: "जल्द आ रहा है",        mr: "लवकरच येत आहे"    },
  ctaBg:     "#f3f4f6",
  ctaColor:  "#9ca3af",
  border:    "#bfdbfe",
};

/* ── Icons ── */
const IcoCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IcoSpin = () => (
  <svg className="mp-spinner" width="32" height="32" viewBox="0 0 24 24"
    fill="none" stroke="#cc0000" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2a10 10 0 1 0 10 10" />
  </svg>
);

/* ── Plan Card ── */
function PlanCard({ plan, index, isMostPopular, sec, lang, onHomeClick }) {
  const t      = THEMES[index] || FALLBACK;
  const isFree = plan.price === 0;
  const cta    = t.ctaText[lang] || t.ctaText.en;

  const handleClick = () => {
    if (!isFree) return;
    if (typeof onHomeClick === "function") onHomeClick();
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={["mp-card", isMostPopular ? "mp-card--popular" : ""].filter(Boolean).join(" ")}
      style={{ "--c-border": t.border }}
    >
      {/* Popular ribbon */}
      {isMostPopular && (
        <div className="mp-ribbon">{sec.mostPopular}</div>
      )}

      {/* Coloured top section */}
      <div className="mp-card-top" style={{ background: t.headerBg }}>
        <div className="mp-card-icon">{t.icon}</div>
        <div className="mp-card-name" style={{ color: t.headerTxt }}>{plan.name}</div>
        <div className="mp-card-price-row" style={{ color: t.headerTxt }}>
          <span className="mp-sym">₹</span>
          <span className="mp-amt">{plan.price.toLocaleString("en-IN")}</span>
        </div>
        <div className="mp-card-period" style={{ color: `${t.headerTxt}bb` }}>
          {plan.duration && plan.duration !== "Forever" ? plan.duration : sec.forever}
        </div>
      </div>

      {/* Features + CTA */}
      <div className="mp-card-bottom">
        <ul className="mp-features">
          {(plan.features || []).map((f, j) => (
            <li key={j} className="mp-feature">
              <span className="mp-check"><IcoCheck /></span>
              {f}
            </li>
          ))}
          {(!plan.features || plan.features.length === 0) && (
            <li className="mp-feature-empty">—</li>
          )}
        </ul>

        <button
          className="mp-cta"
          style={
            isFree
              ? { background: t.ctaBg, color: t.ctaColor }
              : { background: "#f3f4f6", color: "#9ca3af", cursor: "not-allowed" }
          }
          onClick={handleClick}
          disabled={!isFree}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN
══════════════════════════════════════ */
export default function MembershipPlans({ onPlanClick, onHomeClick }) {
  const { i18n } = useTranslation();
  const rawLang  = i18n?.language || "en";
  const lang     = rawLang.slice(0, 2) in SECTION_TEXT ? rawLang.slice(0, 2) : "en";
  const sec      = SECTION_TEXT[lang];

  const { plans, loading, error } = useMembershipPlans();

  const popularIndex = plans.length >= 3 ? 1 : -1;

  return (
    <section className="mp-section" id="plans">
      <div className="mp-header">
        <h2 className="mp-header-title">{sec.title}</h2>
        <p  className="mp-header-sub">{sec.subtitle}</p>
      </div>

      {loading && (
        <div className="mp-state"><IcoSpin /><p>{sec.loading}</p></div>
      )}

      {!loading && error && (
        <div className="mp-state mp-state--error"><span>⚠️</span><p>{sec.error}</p></div>
      )}

      {!loading && !error && plans.length === 0 && (
        <div className="mp-state"><span style={{ fontSize: 36 }}>📋</span><p>{sec.noPlans}</p></div>
      )}

      {!loading && !error && plans.length > 0 && (
        <div className="mp-grid">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              index={i}
              isMostPopular={i === popularIndex}
              sec={sec}
              lang={lang}
              onHomeClick={onHomeClick}
            />
          ))}
        </div>
      )}

      {!loading && !error && plans.length > 0 && (
        <p className="mp-note">{sec.note}</p>
      )}
    </section>
  );
}
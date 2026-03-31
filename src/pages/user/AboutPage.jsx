import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./AboutPage.css";
import { useTranslation } from "react-i18next";

/* ── uploaded images ── */
import weddingPhoto from "../../assets/images/Container.png";
import teamPhoto from "../../assets/images/Container1.png";

/* ── SVG Icons ── */
const IconTarget = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconEye = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconHeart = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
    stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
             a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
             1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconShield = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
    stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconUsers = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
    stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconStar = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
    stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77
             l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const IconMessageCircle = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
    stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14
             a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#22c55e" />
    <polyline points="6 12 10 16 18 8"
      stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function AboutPage({ onBack, onLogin, onRegister, onHelp, onMenuClick }) {

  const { t } = useTranslation();

  const goLogin    = () => typeof onLogin    === "function" && onLogin();
  const goRegister = () => typeof onRegister === "function" && onRegister();
  // ✅ FIX 1: Contact Us and FAQ both go to Help page
  const goHelp     = () => typeof onHelp     === "function" && onHelp();

  const STATS = [
    { value: "10M+", label: t("about.stats.users") },
    { value: "5L+",  label: t("about.stats.success") },
    { value: "150+", label: t("about.stats.countries") },
    { value: "24/7", label: t("about.stats.support") },
  ];

  const VALUES = [
    { icon: <IconHeart />,  title: t("about.values.trust.title"),     desc: t("about.values.trust.desc") },
    { icon: <IconShield />, title: t("about.values.privacy.title"),   desc: t("about.values.privacy.desc") },
    { icon: <IconUsers />,  title: t("about.values.community.title"), desc: t("about.values.community.desc") },
    { icon: <IconStar />,   title: t("about.values.service.title"),   desc: t("about.values.service.desc") },
  ];

  const TEAM = [
    { initial: "R", name: t("about.team.rajesh.name"), role: t("about.team.rajesh.role"), color: "#cc0000", desc: t("about.team.rajesh.desc") },
    { initial: "P", name: t("about.team.priya.name"),  role: t("about.team.priya.role"),  color: "#cc0000", desc: t("about.team.priya.desc") },
    { initial: "V", name: t("about.team.vikram.name"), role: t("about.team.vikram.role"), color: "#cc0000", desc: t("about.team.vikram.desc") },
  ];

  const WHY_ITEMS = [
    t("about.why.1"), t("about.why.2"), t("about.why.3"), t("about.why.4"),
    t("about.why.5"), t("about.why.6"), t("about.why.7"), t("about.why.8"),
  ];

  return (
    <div className="ap-page">

      <Navbar
        onHomeClick={onBack}
        // ✅ FIX 2: removed onAboutClick — no self-navigation from About page
        onLoginClick={goLogin}
        onRegisterClick={goRegister}
        onHelpClick={goHelp}
        onMenuClick={onMenuClick}
      />

      {/* HERO */}
      <section className="ap-hero">
        <div className="ap-hero-inner">
          <h1 className="ap-hero-title">{t("about.hero.title")}</h1>
          <p className="ap-hero-sub">{t("about.hero.subtitle")}</p>
        </div>
      </section>

      {/* STATS */}
      <section className="ap-stats">
        <div className="ap-stats-inner">
          {STATS.map(s => (
            <div className="ap-stat" key={s.label}>
              <span className="ap-stat-value">{s.value}</span>
              <span className="ap-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="ap-story">
        <div className="ap-story-inner">
          <div className="ap-story-text">
            <h2 className="ap-section-title left">{t("about.story.title")}</h2>
            <p>{t("about.story.p1")}</p>
            <p>{t("about.story.p2")}</p>
            <p>{t("about.story.p3")}</p>
          </div>
          <div className="ap-story-img-wrap">
            <img src={weddingPhoto} alt="wedding" className="ap-story-img" />
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="ap-mv">
        <div className="ap-mv-inner">
          <div className="ap-mv-card">
            <div className="ap-mv-icon-wrap"><IconTarget /></div>
            <h3 className="ap-mv-title">{t("about.mission.title")}</h3>
            <p className="ap-mv-text">{t("about.mission.text")}</p>
          </div>
          <div className="ap-mv-card">
            <div className="ap-mv-icon-wrap"><IconEye /></div>
            <h3 className="ap-mv-title">{t("about.vision.title")}</h3>
            <p className="ap-mv-text">{t("about.vision.text")}</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="ap-values">
        <div className="ap-section-header">
          <h2 className="ap-section-title">{t("about.values.title")}</h2>
          <p className="ap-section-sub">{t("about.values.subtitle")}</p>
        </div>
        <div className="ap-values-grid">
          {VALUES.map(v => (
            <div className="ap-value-card" key={v.title}>
              <div className="ap-value-icon">{v.icon}</div>
              <h4 className="ap-value-title">{v.title}</h4>
              <p className="ap-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="ap-team">
        <div className="ap-section-header">
          <h2 className="ap-section-title">{t("about.team.title")}</h2>
          <p className="ap-section-sub">{t("about.team.subtitle")}</p>
        </div>
        <div className="ap-team-grid">
          {TEAM.map(m => (
            <div className="ap-team-card" key={m.name}>
              <div className="ap-team-avatar" style={{ background: m.color }}>{m.initial}</div>
              <h4 className="ap-team-name">{m.name}</h4>
              <span className="ap-team-role">{m.role}</span>
              <p className="ap-team-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="ap-why">
        <div className="ap-why-inner">
          <div className="ap-why-img-wrap">
            <img src={teamPhoto} alt="team" className="ap-why-img" />
          </div>
          <div className="ap-why-text">
            <h2 className="ap-section-title left">{t("about.why.title")}</h2>
            <ul className="ap-why-list">
              {WHY_ITEMS.map(item => (
                <li key={item} className="ap-why-item">
                  <span className="ap-why-icon"><IconCheck /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ap-cta">
        <div className="ap-cta-inner">
          <div className="ap-cta-icon"><IconMessageCircle /></div>
          <h2 className="ap-cta-title">{t("about.cta.title")}</h2>
          <p className="ap-cta-sub">{t("about.cta.subtitle")}</p>
          <div className="ap-cta-btns">
            {/* ✅ FIX 1: Contact Us → goes to Help page */}
            <button className="ap-cta-btn-outline" onClick={goHelp}>
              {t("about.cta.contact")}
            </button>
            {/* ✅ FAQ → also goes to Help page */}
            <button className="ap-cta-btn-white" onClick={goHelp}>
              {t("about.cta.faq")}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./MatchesPage.css";

/* ══════════════════════════════════════════
   ICONS (unchanged)
══════════════════════════════════════════ */
function IcoHeart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IcoHeartFill() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#16a34a" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IcoPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IcoBriefcase() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IcoGradCap() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IcoMsg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IcoVerifiedStar() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   MATCH DATA (remains in English for simplicity)
══════════════════════════════════════════ */
const MATCHES = [
  {
    id: 1,
    name: "Sneha Patel",
    age: 27,
    height: "5'5\"",
    city: "Ahmedabad, Gujarat",
    profession: "CA",
    education: "CA, B.Com",
    income: "₹20 LPA",
    matchPct: 92,
    matchedAgo: "3 days ago",
    status: "Online now",
    statusColor: "#16a34a",
    verified: true,
    interests: ["Photography", "Travel", "Music"],
    bio: "\"Family-oriented person looking for a caring and understanding life partner.\"",
    photo: "/images/bride1.png",
  },
  {
    id: 2,
    name: "Meera Reddy",
    age: 28,
    height: "5'5\"",
    city: "Hyderabad, Telangana",
    profession: "Data Analyst",
    education: "MS in Data Science",
    income: "₹16 LPA",
    matchPct: 88,
    matchedAgo: "5 days ago",
    status: "2 hours ago",
    statusColor: "#16a34a",
    verified: true,
    interests: ["Reading", "Cooking", "Yoga"],
    bio: "\"Ambitious professional seeking a supportive partner for life's journey.\"",
    photo: "/images/bride2.png",
  },
  {
    id: 3,
    name: "Sanya Malhotra",
    age: 26,
    height: "5'4\"",
    city: "Mumbai, Maharashtra",
    profession: "Investment Banker",
    education: "MBA Finance",
    income: "₹25 LPA",
    matchPct: 85,
    matchedAgo: "1 week ago",
    status: "1 day ago",
    statusColor: "#16a34a",
    verified: false,
    interests: ["Fitness", "Finance", "Travel"],
    bio: "\"Independent and career-focused, looking for someone who respects mutual goals.\"",
    photo: "/images/bride3.png",
  },
];

/* ══════════════════════════════════════════
   MATCH CARD (translated)
══════════════════════════════════════════ */
function MatchCard({ match, onViewProfile, onMessage }) {
  const { t } = useTranslation();
  const initials = match.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="mc-card">

      {/* ── Photo — padded rounded square, inside the card ── */}
      <div className="mc-photo-wrap">
        <div className="mc-photo-box">
          {match.photo && !imgError ? (
            <img
              src={match.photo}
              alt={match.name}
              className="mc-photo-img"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="mc-photo-initials">{initials}</div>
          )}
          {match.verified && (
            <span className="mc-verified-badge">
              <IcoVerifiedStar /> {t('matches.verifiedBadge')}
            </span>
          )}
          <span className="mc-status-bar" style={{ background: match.statusColor }}>
            {match.status}
          </span>
        </div>
      </div>

      {/* ── Info column ── */}
      <div className="mc-info-col">

        {/* Name row + match badge */}
        <div className="mc-top-row">
          <div className="mc-name-block">
            <h2 className="mc-name">{match.name}</h2>
            <p className="mc-age-height">{match.age} {t('interest.years_short')}, {match.height}</p>
          </div>
          <div className="mc-match-badge-wrap">
            <span className="mc-match-badge">
              <IcoHeartFill /> {match.matchPct}% {t('matches.match')}
            </span>
            <span className="mc-matched-ago">{t('matches.matchedAgo', { time: match.matchedAgo })}</span>
          </div>
        </div>

        {/* Details — 2 col grid */}
        <div className="mc-details-grid">
          <span className="mc-detail-item"><IcoPin /> {match.city}</span>
          <span className="mc-detail-item"><IcoBriefcase /> {match.profession}</span>
          <span className="mc-detail-item"><IcoGradCap /> {match.education}</span>
          <span className="mc-detail-item mc-income">{match.income}</span>
        </div>

        {/* Mutual interests */}
        <div className="mc-interests-row">
          <span className="mc-interests-label">{t('matches.mutualInterestsLabel')}</span>
          <span className="mc-interests-value">{match.interests.join(", ")}</span>
        </div>

        {/* Bio */}
        <p className="mc-bio">{match.bio}</p>

        {/* Buttons */}
        <div className="mc-actions">
          <button className="mc-btn-msg" onClick={() => onMessage?.(match.id)}>
            <IcoMsg /> {t('matches.sendMessage')}
          </button>
          <button className="mc-btn-view" onClick={() => onViewProfile?.(match.id)}>
            {t('matches.viewFullProfile')}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function MatchesPage({
  onBack,
  onLogin,
  onRegister,
  onHelp,
  onAboutClick,
  onMenuClick,
  onViewProfile,
  onPlanClick,
  onMessage,
}) {
  const { t } = useTranslation();
  const [matches] = useState(MATCHES);

  return (
    <div className="site-wrapper">
      <Navbar
        onHomeClick={onBack}
        onLoginClick={onLogin}
        onRegisterClick={onRegister}
        onHelpClick={onHelp}
        onAboutClick={onAboutClick}
        onMenuClick={onMenuClick}
      />

      <main className="mp-main">
        <div className="mp-page">

          {/* Heading */}
          <div className="mp-heading">
            <h1 className="mp-title">{t('matches.title')}</h1>
            <p className="mp-subtitle">{t('matches.subtitle')}</p>
          </div>

          {/* Active matches banner */}
          <div className="mp-banner">
            <div className="mp-banner-icon"><IcoHeart /></div>
            <div className="mp-banner-text">
              <span className="mp-banner-count">{t('matches.activeMatchesCount', { count: matches.length })}</span>
              <span className="mp-banner-sub">
                {t('matches.activeMatchesSub', { count: matches.length })}
              </span>
            </div>
          </div>

          {/* Cards */}
          <div className="mp-cards">
            {matches.map(m => (
              <MatchCard
                key={m.id}
                match={m}
                onViewProfile={onViewProfile}
                onMessage={onMessage}
              />
            ))}
          </div>

          {/* Upgrade banner */}
          <div className="mp-upgrade-banner">
            <div className="mp-upgrade-left">
              <span className="mp-upgrade-title">{t('matches.unlockFeaturesTitle')}</span>
              <span className="mp-upgrade-sub">{t('matches.unlockFeaturesSub')}</span>
            </div>
            <button className="mp-upgrade-btn" onClick={() => onPlanClick?.()}>
              {t('matches.upgradeButton')}
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
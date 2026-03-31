import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import "./Navbar.css";
import logoIcon from "../assets/logo-icon.png";

const SERVER = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SERVER}${url}`;
}

function timeAgo(date) {
  if (!date) return "";
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function useMenuItems() {
  const { t } = useTranslation();
  return [
    { key: "dashboard",  label: t("menu.dashboard"),    sub: null,                  badge: null,  icon: <IcoDashboard /> },
    { key: "profile",    label: t("menu.myProfile"),    sub: null,                  badge: null,  icon: <IcoProfile   /> },
    { key: "verify",     label: t("menu.verification"), sub: t("menu.kycSubtitle"), badge: "New", icon: <IcoVerify    />, highlight: true },
    { key: "interests",  label: t("menu.interests"),    sub: null,                  badge: null,  icon: <IcoHeart     /> },
    { key: "matches",    label: t("menu.matches"),      sub: null,                  badge: null,  icon: <IcoMatches   /> },
    { key: "messages",   label: t("menu.messages"),     sub: null,                  badge: null,  icon: <IcoMsg       /> },
    { key: "shortlist",  label: t("menu.shortlisted"),  sub: null,                  badge: null,  icon: <IcoStar      /> },
    { key: "settings",   label: t("menu.settings"),     sub: null,                  badge: null,  icon: <IcoSettings  /> },
  ];
}

/* ── Icons ── */
function IcoDashboard() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>; }
function IcoProfile()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function IcoVerify()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>; }
function IcoHeart()     { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function IcoMatches()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function IcoMsg()       { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function IcoStar()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function IcoSettings()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function IcoBell()      { return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function IcoChevron({ open }) { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}><polyline points="6 9 12 15 18 9"/></svg>; }
function IcoLogout()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }

function notifIcon(type) {
  if (type === "new_interest")      return "💌";
  if (type === "interest_accepted") return "🎉";
  if (type === "interest_declined") return "❌";
  if (type === "new_message")       return "💬";
  return "🔔";
}

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी",   flag: "🇮🇳" },
  { code: "mr", label: "मराठी",   flag: "🇮🇳" },
];

function LangDropdown() {
  const { i18n }    = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const currentCode = i18n?.language?.slice(0, 2) || "en";
  const current     = LANGUAGES.find(l => l.code === currentCode) || LANGUAGES[0];

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSelect = (code) => {
    if (i18n && i18n.changeLanguage) i18n.changeLanguage(code);
    localStorage.setItem("jsh_lang", code);
    setOpen(false);
  };

  return (
    <div className="nav-lang-wrap" ref={ref}>
      <button className="nav-lang-btn" onClick={() => setOpen(p => !p)} title="Change language">
        <span className="nav-lang-flag">{current.flag}</span>
        <span className="nav-lang-code">{current.code.toUpperCase()}</span>
        <IcoChevron open={open} />
      </button>
      {open && (
        <div className="nav-lang-dropdown">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`nav-lang-option ${currentCode === lang.code ? "active" : ""}`}
              onClick={() => handleSelect(lang.code)}
            >
              <span className="nav-lang-option-flag">{lang.flag}</span>
              <span className="nav-lang-option-label">{lang.label}</span>
              {currentCode === lang.code && <span className="nav-lang-option-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotifDropdown({ notifications, onClear, onClose, onMenuClick }) {
  return (
    <div className="notif-panel">
      <div className="notif-panel-header">
        <span className="notif-panel-title">Notifications</span>
        {notifications.length > 0 && (
          <button className="notif-clear-btn" onClick={onClear}>Clear all</button>
        )}
      </div>
      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="notif-empty">No new notifications</div>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <div key={n.id} className="notif-item" onClick={() => {
              onClose();
              if (n.type === "new_interest" || n.type === "interest_accepted") onMenuClick?.("interests");
              if (n.type === "new_message") onMenuClick?.("messages");
            }}>
              <span className="notif-item-icon">{notifIcon(n.type)}</span>
              <div className="notif-item-body">
                <span className="notif-item-title">{n.title}</span>
                <span className="notif-item-text">{n.body}</span>
                <span className="notif-item-time">{timeAgo(n.time)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Avatar({ user, size = 32, fontSize = 12, rounded = "8px" }) {
  const initials = (user?.fullName || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const photoUrl = resolvePhoto(user?.photos?.find(p => p.isPrimary)?.url || user?.photos?.[0]?.url || null);
  return (
    <div style={{ width: size, height: size, borderRadius: rounded, background: "#fde8e8", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {photoUrl
        ? <img src={photoUrl} alt={user?.fullName || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
        : <span style={{ fontSize, fontWeight: 700, color: "#cc0000", fontFamily: "var(--font-main)" }}>{initials}</span>
      }
    </div>
  );
}

function UserDropdown({ user, onMenuClick, onLogout }) {
  const { t } = useTranslation();
  const MENU  = useMenuItems();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const masked = user?.email?.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) =>
    a + "*".repeat(Math.min(b.length, 4)) + c) || "";

  return (
    <div className="ud-wrap" ref={ref}>
      <button className="ud-trigger" onClick={() => setOpen(p => !p)} aria-expanded={open}>
        <Avatar user={user} size={32} />
        <div className="ud-trigger-info">
          <span className="ud-name">{user?.fullName || "User"}</span>
          <span className={`ud-status ${user?.isVerified ? "verified" : "unverified"}`}>
            {user?.isVerified ? t("nav.verified") : t("nav.notVerified")}
          </span>
        </div>
        <IcoChevron open={open} />
      </button>
      {open && (
        <div className="ud-panel">
          <div className="ud-panel-header" onClick={() => { setOpen(false); onMenuClick?.("profile"); }} style={{ cursor: "pointer" }}>
            <Avatar user={user} size={48} rounded="50%" fontSize={16} />
            <div className="ud-panel-info">
              <span className="ud-panel-name">{user?.fullName}</span>
              <span className="ud-panel-email">{masked}</span>
              <span className={`ud-panel-status ${user?.isVerified ? "verified" : "unverified"}`}>
                {user?.isVerified ? t("nav.verified") : "○ " + t("nav.notVerified")}
              </span>
            </div>
          </div>
          <div className="ud-divider" />
          <ul className="ud-menu">
            {MENU.map((item) => (
              <>
                <li key={item.key}>
                  <button className={`ud-menu-item${item.highlight ? " ud-menu-verify" : ""}`} onClick={() => { setOpen(false); onMenuClick?.(item.key); }}>
                    <span className="ud-menu-icon">{item.icon}</span>
                    <span className="ud-menu-label-wrap">
                      <span className="ud-menu-label">{item.label}</span>
                      {item.sub && <span className="ud-menu-sub">{item.sub}</span>}
                    </span>
                    {item.badge && <span className="ud-menu-badge">{item.badge}</span>}
                  </button>
                </li>
                {item.key === "verify" && <li key="div-verify" aria-hidden="true"><div className="ud-divider" /></li>}
              </>
            ))}
          </ul>
          <div className="ud-divider" />
          <button className="ud-logout" onClick={() => { setOpen(false); onLogout(); }}>
            <IcoLogout /><span>{t("nav.logout")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════ */
export default function Navbar({
  onRegisterClick, onLoginClick, onHelpClick,
  onHomeClick, onAboutClick, onMenuClick, currentPage,
}) {
  const { t }                        = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const { notifications, unreadCount, clearNotif } = useSocketContext();

  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const [menuOpen, setMenuOpen]   = useState(false);
  const closeMenu                 = () => setMenuOpen(false);

  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleHome   = (e) => { e.preventDefault(); closeMenu(); if (onHomeClick) onHomeClick(); else window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleAbout  = (e) => { e.preventDefault(); closeMenu(); if (onAboutClick) onAboutClick(); };
  const handleHelp   = (e) => { e.preventDefault(); closeMenu(); if (onHelpClick)  onHelpClick();  };
  const handleLogin  = ()  => { closeMenu(); if (onLoginClick)    onLoginClick();    };
  const handleReg    = ()  => { closeMenu(); if (onRegisterClick) onRegisterClick(); };
  const handleLogout = ()  => {
    const confirmed = window.confirm(t("nav.logoutConfirm"));
    if (!confirmed) return;
    closeMenu(); logout();
    if (onHomeClick) onHomeClick();
  };

  const handleScroll = (id) => (e) => {
    e.preventDefault(); closeMenu();
    if (onHomeClick) {
      onHomeClick();
      setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            <span /><span /><span />
          </button>

          <div className="nav-logo" onClick={handleHome} style={{ cursor: "pointer" }}>
            <img src={logoIcon} alt="JeevanSaathiHub logo" className="logo-icon" />
            <span className="logo-text">JeevanSaathiHub</span>
          </div>

          <div className="nav-links">
            <a href="#home"     onClick={handleHome}             className={currentPage === "home"   ? "active" : ""}>{t("nav.home")}</a>
            <a href="#profiles" onClick={handleScroll("profiles")} className={currentPage === "search" ? "active" : ""}>{t("nav.searchProfiles")}</a>
            <a href="#about"    onClick={handleAbout}            className={currentPage === "about"  ? "active" : ""}>{t("nav.about")}</a>
            <a href="#stories"  onClick={handleScroll("stories")} className="">{t("nav.successStories")}</a>
            <a href="#plans"    onClick={handleScroll("plans")}   className={currentPage === "plans"  ? "active" : ""}>{t("nav.membershipPlans")}</a>
            <a href="#help"     onClick={handleHelp}             className={currentPage === "help"   ? "active" : ""}>{t("nav.help")}</a>
          </div>

          <div className="nav-right">
            <LangDropdown />
            {isLoggedIn ? (
              <div className="nav-user-area">
                <div className="nav-bell-wrap" ref={notifRef}>
                  <button className="nav-bell" aria-label="Notifications" onClick={() => setShowNotif(p => !p)}>
                    <IcoBell />
                    {unreadCount > 0 && (
                      <span className="nav-bell-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                    )}
                  </button>
                  {showNotif && (
                    <NotifDropdown
                      notifications={notifications}
                      onClear={() => { clearNotif(); setShowNotif(false); }}
                      onClose={() => setShowNotif(false)}
                      onMenuClick={onMenuClick}
                    />
                  )}
                </div>
                <UserDropdown user={user} onMenuClick={onMenuClick} onLogout={handleLogout} />
              </div>
            ) : (
              <div className="nav-actions">
                <button className="nav-btn-outline" onClick={handleLogin}>{t("nav.login")}</button>
                <button className="nav-btn-solid"   onClick={handleReg}>{t("nav.register")}</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-links">
          <a href="#home"     onClick={handleHome}             className={currentPage === "home"   ? "active" : ""}>🏠&nbsp; {t("nav.home")}</a>
          <a href="#profiles" onClick={handleScroll("profiles")} className={currentPage === "search" ? "active" : ""}>🔍&nbsp; {t("nav.searchProfiles")}</a>
          <a href="#about"    onClick={handleAbout}            className={currentPage === "about"  ? "active" : ""}>ℹ️&nbsp; {t("nav.about")}</a>
          <a href="#stories"  onClick={handleScroll("stories")} className="">💑&nbsp; {t("nav.successStories")}</a>
          <a href="#plans"    onClick={handleScroll("plans")}   className={currentPage === "plans"  ? "active" : ""}>⭐&nbsp; {t("nav.membershipPlans")}</a>
          <a href="#help"     onClick={handleHelp}             className={currentPage === "help"   ? "active" : ""}>❓&nbsp; {t("nav.help")}</a>
        </div>
        {isLoggedIn ? (
          <button className="mobile-logout" onClick={handleLogout}>
            <IcoLogout /> {t("nav.logout")}
          </button>
        ) : (
          <div className="mobile-menu-actions">
            <button className="nav-btn-outline mobile-full" onClick={handleLogin}>{t("nav.login")}</button>
            <button className="nav-btn-solid   mobile-full" onClick={handleReg}>{t("nav.registerFree")}</button>
          </div>
        )}
      </div>

      {menuOpen && <div className="mobile-backdrop" onClick={closeMenu} />}
    </>
  );
}
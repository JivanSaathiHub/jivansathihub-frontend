import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getReceivedInterests,
  getSentInterests,
  respondToInterest,
  addToShortlist,
  removeFromShortlist,
} from "../../api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./InterestsPage.css";

/* ══════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════ */
const SERVER = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SERVER}${url}`;
}

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=fdecea&color=c0392b&size=200`;
}

const FILTER_OPTIONS = [
  { value: "all",   labelKey: "interests.filter.all"   },
  { value: "today", labelKey: "interests.filter.today" },
  { value: "week",  labelKey: "interests.filter.week"  },
  { value: "month", labelKey: "interests.filter.month" },
];

const TABS = [
  { key: "pending",  labelKey: "interests.tab.pending"  },
  { key: "accepted", labelKey: "interests.tab.accepted" },
  { key: "declined", labelKey: "interests.tab.declined" },
  { key: "sent",     labelKey: "interests.tab.sent"     },
];

const SENT_LABELS = { en: "Sent", hi: "भेजे गए", mr: "पाठवलेले" };

/* ══════════════════════════════════════════════════════════
   HELPERS — map raw DB interest → card shape
══════════════════════════════════════════════════════════ */
function mapReceived(interest) {
  const s = interest.sender || {};
  const photo = resolvePhoto(
    s.photos?.find((p) => p.isPrimary)?.url || s.photos?.[0]?.url
  );
  return {
    id:          interest._id,
    profileId:   s._id,
    status:      interest.status || "pending",
    name:        s.fullName   || "Unknown",
    age:         s.age        || "—",
    height:      s.height     || "—",
    location:    [s.city, s.state].filter(Boolean).join(", ") || "—",
    profession:  s.profession || "—",
    education:   s.education  || "—",
    income:      s.annualIncome || "—",
    message:     interest.message || "",
    receivedAt:  interest.createdAt
      ? new Date(interest.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—",
    photo,
    shortlisted: false,
  };
}

function mapSent(interest) {
  const r = interest.receiver || {};
  const photo = resolvePhoto(
    r.photos?.find((p) => p.isPrimary)?.url || r.photos?.[0]?.url
  );
  return {
    id:         interest._id,
    profileId:  r._id,
    status:     interest.status || "pending",
    name:       r.fullName   || "Unknown",
    age:        r.age        || "—",
    height:     r.height     || "—",
    location:   [r.city, r.state].filter(Boolean).join(", ") || "—",
    profession: r.profession || "—",
    education:  r.education  || "—",
    income:     r.annualIncome || "—",
    message:    interest.message || "",
    sentAt:     interest.createdAt
      ? new Date(interest.createdAt).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—",
    photo,
    shortlisted: false,
  };
}

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
function IcoLocation() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IcoBriefcase() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function IcoGraduate() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
}
function IcoRupee() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12M6 8h12M6 13l6 8"/><path d="M6 8a6 6 0 0 0 0 5h12"/></svg>;
}
function IcoCheck() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function IcoX() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
}
function IcoEye() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IcoMsg() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function IcoStar({ filled }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke={filled ? "#f59e0b" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function IcoFilter() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
}
function IcoChevronDown() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
}
function IcoQuote() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>;
}
function IcoEmpty() {
  return <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}

/* ══════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════ */
function Avatar({ name, photo, size = 96 }) {
  const initials = (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const [err, setErr] = useState(false);
  return (
    <div className="ip-avatar" style={{ width: size, height: size }}>
      {photo && !err ? (
        <img src={photo} alt={name} onError={() => setErr(true)} />
      ) : (
        <img src={avatarUrl(name)} alt={name} />
      )}
    </div>
  );
}

function FilterDropdown({ value, onChange }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function h(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = FILTER_OPTIONS.find((o) => o.value === value);

  return (
    <div className="ip-filter-wrap" ref={ref}>
      <button className="ip-filter-btn" onClick={() => setOpen((p) => !p)}>
        <IcoFilter />
        <span>{t(selected.labelKey)}</span>
        <span className={`ip-filter-chevron ${open ? "open" : ""}`}>
          <IcoChevronDown />
        </span>
      </button>
      {open && (
        <div className="ip-filter-panel">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`ip-filter-item ${opt.value === value ? "active" : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InterestCard({ item, onAccept, onDecline, onViewProfile, onShortlist, isSent }) {
  const { t } = useTranslation();
  const [actionLoading, setActionLoading] = useState(false);

  const timeLabel = isSent ? item.sentAt : item.receivedAt;
  const navId     = isSent ? item.profileId : item.profileId;

  const handleAccept = async () => {
    setActionLoading(true);
    await onAccept(item.id);
    setActionLoading(false);
  };

  const handleDecline = async () => {
    setActionLoading(true);
    await onDecline(item.id);
    setActionLoading(false);
  };

  return (
    <div className={`ip-card ${item.status !== "pending" ? "ip-card--" + item.status : ""}`}>
      <div className="ip-card-accent" />
      <div className="ip-card-main">
        <Avatar name={item.name} photo={item.photo} />
        <div className="ip-card-body">

          <div className="ip-card-header">
            <div>
              <h3 className="ip-card-name">{item.name}</h3>
              <p className="ip-card-age">
                {item.age} {t("interest.years_short")}, {item.height}
              </p>
            </div>
            <button
              className={`ip-shortlist-btn ${item.shortlisted ? "active" : ""}`}
              onClick={() => onShortlist(item.id, item.profileId, item.shortlisted)}
              title={item.shortlisted ? t("interests.removeShortlist") : t("interests.shortlist")}
            >
              <IcoStar filled={item.shortlisted} />
            </button>
          </div>

          <div className="ip-card-meta">
            <span><IcoLocation /> {item.location}</span>
            <span><IcoBriefcase /> {item.profession}</span>
            <span><IcoGraduate /> {item.education}</span>
            <span><IcoRupee /> {item.income}</span>
          </div>

          {item.message && (
            <div className="ip-card-message">
              <IcoQuote />
              <p>"{item.message}"</p>
            </div>
          )}

          {/* Pending received */}
          {item.status === "pending" && !isSent && (
            <div className="ip-card-actions">
              <button
                className="ip-btn ip-btn--accept"
                onClick={handleAccept}
                disabled={actionLoading}
              >
                <IcoCheck /> {t("interests.accept")}
              </button>
              <button
                className="ip-btn ip-btn--decline"
                onClick={handleDecline}
                disabled={actionLoading}
              >
                <IcoX /> {t("interests.decline")}
              </button>
              <button className="ip-btn ip-btn--view" onClick={() => onViewProfile(navId)}>
                <IcoEye /> {t("interests.viewProfile")}
              </button>
              <span className="ip-card-time">
                {t("interests.received")} {timeLabel}
              </span>
            </div>
          )}

          {/* Pending sent */}
          {item.status === "pending" && isSent && (
            <div className="ip-card-actions">
              <span className="ip-status-badge" style={{ background: "#fef9c3", color: "#854d0e", border: "1px solid #fde68a" }}>
                ⏳ {t("interests.awaiting")}
              </span>
              <button className="ip-btn ip-btn--view" onClick={() => onViewProfile(navId)}>
                <IcoEye /> {t("interests.viewProfile")}
              </button>
              <span className="ip-card-time">
                {t("interests.sentLabel")} {timeLabel}
              </span>
            </div>
          )}

          {/* Accepted */}
          {item.status === "accepted" && (
            <div className="ip-card-actions">
              <span className="ip-status-badge ip-status-badge--accepted">
                ✓ {t("interests.accepted")}
              </span>
              <button className="ip-btn ip-btn--message" onClick={() => onViewProfile(navId)}>
                <IcoMsg /> {t("interests.message")}
              </button>
              <button className="ip-btn ip-btn--view" onClick={() => onViewProfile(navId)}>
                <IcoEye /> {t("interests.viewProfile")}
              </button>
              <span className="ip-card-time">
                {isSent ? t("interests.sentLabel") : t("interests.received")} {timeLabel}
              </span>
            </div>
          )}

          {/* Declined */}
          {item.status === "declined" && (
            <div className="ip-card-actions">
              <span className="ip-status-badge ip-status-badge--declined">
                ✕ {t("interests.declined")}
              </span>
              <button className="ip-btn ip-btn--view" onClick={() => onViewProfile(navId)}>
                <IcoEye /> {t("interests.viewProfile")}
              </button>
              <span className="ip-card-time">
                {isSent ? t("interests.sentLabel") : t("interests.received")} {timeLabel}
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function InterestsPage({
  onViewProfile, onBack, onLogin, onRegister,
  onHelp, onAboutClick, onMenuClick,
  initialTab,
}) {
  const { t, i18n } = useTranslation();

  const [received,  setReceived]  = useState([]);
  const [sent,      setSent]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [activeTab, setActiveTab] = useState(initialTab || "pending");
  const [filter,    setFilter]    = useState("all");

  /* ── Fetch both lists on mount ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [recRes, sentRes] = await Promise.all([
        getReceivedInterests(),
        getSentInterests(),
      ]);
      setReceived((recRes.interests  || []).map(mapReceived));
      setSent(    (sentRes.interests || []).map(mapSent));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load interests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Accept / Decline ── */
  const handleAccept = async (interestId) => {
    try {
      await respondToInterest(interestId, "accepted");
      setReceived((prev) =>
        prev.map((i) => (i.id === interestId ? { ...i, status: "accepted" } : i))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to accept interest.");
    }
  };

  const handleDecline = async (interestId) => {
    try {
      await respondToInterest(interestId, "declined");
      setReceived((prev) =>
        prev.map((i) => (i.id === interestId ? { ...i, status: "declined" } : i))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to decline interest.");
    }
  };

  /* ── Shortlist toggle (calls real API) ── */
  const handleShortlist = async (cardId, profileId, isCurrentlyShortlisted) => {
    // Optimistic update
    const toggle = (list) =>
      list.map((i) =>
        i.id === cardId ? { ...i, shortlisted: !isCurrentlyShortlisted } : i
      );

    if (activeTab === "sent") setSent(toggle);
    else setReceived(toggle);

    try {
      if (isCurrentlyShortlisted) {
        await removeFromShortlist(profileId);
      } else {
        await addToShortlist(profileId);
      }
    } catch (err) {
      // Revert on failure
      if (activeTab === "sent") setSent(toggle);
      else setReceived(toggle);
      alert(err?.response?.data?.message || "Shortlist action failed.");
    }
  };

  const handleViewProfile = (id) => { if (onViewProfile) onViewProfile(id); };

  /* ── Filter by time ── */
  function applyTimeFilter(list) {
    if (filter === "all") return list;
    const now  = Date.now();
    const cutoff = {
      today: 24 * 60 * 60 * 1000,
      week:  7  * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
    }[filter];
    return list.filter((item) => {
      const raw = item.sentAt || item.receivedAt;
      if (!raw || raw === "—") return true;
      const d = new Date(raw);
      return !isNaN(d) && now - d.getTime() < cutoff;
    });
  }

  const visibleReceived = applyTimeFilter(received);
  const visibleSent     = applyTimeFilter(sent);

  const counts = {
    pending:  received.filter((i) => i.status === "pending").length,
    accepted: received.filter((i) => i.status === "accepted").length,
    declined: received.filter((i) => i.status === "declined").length,
    sent:     sent.length,
  };

  const currentList =
    activeTab === "sent"
      ? visibleSent
      : visibleReceived.filter((i) => i.status === activeTab);

  const lang = (i18n.language || "en").slice(0, 2);

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

      <main className="ip-main">
        <div className="ip-page">

          <div className="ip-header">
            <h1 className="ip-title">{t("interests.title")}</h1>
            <p className="ip-subtitle">{t("interests.subtitle")}</p>
          </div>

          <div className="ip-content-card">

            <div className="ip-tabs">
              {TABS.map((tab) => {
                const label =
                  tab.key === "sent"
                    ? SENT_LABELS[lang] || SENT_LABELS.en
                    : t(tab.labelKey);
                return (
                  <button
                    key={tab.key}
                    className={`ip-tab ${activeTab === tab.key ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {label}
                    {counts[tab.key] > 0 && (
                      <span className="ip-tab-count">{counts[tab.key]}</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="ip-filter-bar">
              <FilterDropdown value={filter} onChange={setFilter} />
              <button
                className="ip-refresh-btn"
                onClick={fetchData}
                disabled={loading}
                title="Refresh"
                style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#cc0000", fontSize: 13 }}
              >
                {loading ? "Loading…" : "↻ Refresh"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "16px", color: "#dc2626", background: "#fef2f2", borderRadius: 8, margin: "12px 0", fontSize: 14 }}>
                {error}
              </div>
            )}

            {/* Loading skeleton */}
            {loading ? (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af" }}>
                Loading interests…
              </div>
            ) : (
              <div className="ip-list">
                {currentList.length === 0 ? (
                  <div className="ip-empty">
                    <IcoEmpty />
                    <p>
                      {t("interests.empty", {
                        tab: t(`interests.tab.${activeTab}`),
                      })}
                    </p>
                  </div>
                ) : (
                  currentList.map((item) => (
                    <InterestCard
                      key={item.id}
                      item={item}
                      isSent={activeTab === "sent"}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onViewProfile={handleViewProfile}
                      onShortlist={handleShortlist}
                    />
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
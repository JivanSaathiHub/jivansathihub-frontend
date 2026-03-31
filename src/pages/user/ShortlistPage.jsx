import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  getShortlist,
  addToShortlist,
  removeFromShortlist,
} from "../../api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./ShortlistPage.css";

/* ── Photo resolver ───────────────────────────────────────────────── */
const SERVER = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SERVER}${url}`;
}

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=fdecea&color=c0392b&size=300`;
}

/* ── Icons ───────────────────────────────────────────────────────── */
function IcoHeart({ filled }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24"
      fill={filled ? "#cc0000" : "none"}
      stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IcoMessage() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function IcoEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function IcoTrash() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  );
}
function IcoEmpty() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
      stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

/* ── Profile Card ────────────────────────────────────────────────── */
function ShortlistCard({ profile, onView, onMessage, onRemove }) {
  const { t } = useTranslation();
  const [removing, setRemoving] = useState(false);

  const photo = resolvePhoto(
    profile.photos?.find((p) => p.isPrimary)?.url ||
    profile.photos?.[0]?.url
  );

  const handleRemove = async (e) => {
    e.stopPropagation();
    setRemoving(true);
    await onRemove(profile._id);
    setRemoving(false);
  };

  return (
    <div className="sl-card">
      <div className="sl-card-photo-wrap">
        <img
          src={photo || avatarUrl(profile.fullName)}
          alt={profile.fullName}
          className="sl-card-photo"
          onError={(e) => { e.target.src = avatarUrl(profile.fullName); }}
        />
        {profile.isVerified && (
          <span className="sl-verified-badge">✓ {t("profileDetail.verified")}</span>
        )}
        {profile.gender && (
          <span className={`sl-gender-badge sl-gender-${profile.gender?.toLowerCase()}`}>
            {profile.gender}
          </span>
        )}
        <button
          className="sl-remove-btn"
          onClick={handleRemove}
          disabled={removing}
          title={t("shortlist.remove")}
        >
          <IcoTrash />
        </button>
      </div>

      <div className="sl-card-body">
        <h3 className="sl-card-name">{profile.fullName}</h3>
        <p className="sl-card-sub">
          {profile.age} {t("interest.years_short")}
          {profile.height ? ` • ${profile.height}` : ""}
          {profile.city   ? ` • ${profile.city}`   : ""}
        </p>
        {profile.profession && <p className="sl-card-job">{profile.profession}</p>}
        {profile.education  && <p className="sl-card-edu">{profile.education}</p>}

        <div className="sl-card-actions">
          <button className="sl-btn-primary" onClick={() => onView(profile._id)}>
            <IcoEye /> {t("shortlist.viewProfile")}
          </button>
          <button className="sl-btn-outline" onClick={() => onMessage(profile._id)}>
            <IcoMessage /> {t("shortlist.sendMessage")}
          </button>
          <button
            className="sl-btn-heart"
            onClick={handleRemove}
            disabled={removing}
          >
            <IcoHeart filled />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Empty State ─────────────────────────────────────────────────── */
function EmptyState({ onSearch }) {
  const { t } = useTranslation();
  return (
    <div className="sl-empty">
      <IcoEmpty />
      <h3 className="sl-empty-title">{t("shortlist.emptyTitle")}</h3>
      <p className="sl-empty-desc">{t("shortlist.emptyDesc")}</p>
      <button className="sl-empty-btn" onClick={onSearch}>
        {t("shortlist.browseProfiles")}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export default function ShortlistPage({
  onBack, onViewProfile, onMessage, onSearch,
  onLogin, onRegister, onHelp, onAboutClick, onMenuClick,
}) {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("all");

  /* ── Fetch from backend ── */
  const fetchShortlist = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getShortlist();
      setProfiles(data.profiles || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load shortlist.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchShortlist();
    else setLoading(false);
  }, [isLoggedIn, fetchShortlist]);

  /* ── Remove one ── */
  const handleRemove = async (profileId) => {
    // Optimistic remove
    setProfiles((prev) => prev.filter((p) => p._id !== profileId));
    try {
      await removeFromShortlist(profileId);
    } catch (err) {
      // Revert on error and re-fetch
      fetchShortlist();
      alert(err?.response?.data?.message || "Failed to remove from shortlist.");
    }
  };

  /* ── Clear all ── */
  const handleClearAll = async () => {
    if (!window.confirm(t("shortlist.confirmClear"))) return;
    const ids = profiles.map((p) => p._id);
    setProfiles([]);
    try {
      await Promise.all(ids.map((id) => removeFromShortlist(id)));
    } catch {
      fetchShortlist();
    }
  };

  /* ── Filter ── */
  const filtered = profiles.filter((p) => {
    if (filter === "bride") return p.gender === "Bride" || p.gender === "Female";
    if (filter === "groom") return p.gender === "Groom" || p.gender === "Male";
    return true;
  });

  const brides = profiles.filter((p) => p.gender === "Bride" || p.gender === "Female").length;
  const grooms = profiles.filter((p) => p.gender === "Groom" || p.gender === "Male").length;

  return (
    <div className="sl-page">
      <Navbar
        onRegisterClick={onRegister}
        onLoginClick={onLogin}
        onHelpClick={onHelp}
        onHomeClick={onBack}
        onAboutClick={onAboutClick}
        onMenuClick={onMenuClick}
      />

      <div className="sl-body">
        {/* ── Header ── */}
        <div className="sl-header">
          <div className="sl-header-left">
            <h1 className="sl-title">{t("shortlist.title")}</h1>
            <p className="sl-subtitle">
              {profiles.length > 0
                ? t("shortlist.subtitle", { count: profiles.length })
                : t("shortlist.subtitleEmpty")}
            </p>
          </div>
          {profiles.length > 0 && (
            <button className="sl-clear-btn" onClick={handleClearAll}>
              <IcoTrash /> {t("shortlist.clearAll")}
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{ padding: "12px 16px", color: "#dc2626", background: "#fef2f2", borderRadius: 8, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* ── Loading ── */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
            Loading shortlist…
          </div>
        ) : !isLoggedIn ? (
          <div className="sl-empty">
            <IcoEmpty />
            <h3 className="sl-empty-title">Please log in</h3>
            <p className="sl-empty-desc">You need to be logged in to view your shortlist.</p>
            <button className="sl-empty-btn" onClick={onLogin}>Log In</button>
          </div>
        ) : (
          <>
            {/* ── Stats row ── */}
            {profiles.length > 0 && (
              <div className="sl-stats-row">
                <div className="sl-stat-card">
                  <span className="sl-stat-value">{profiles.length}</span>
                  <span className="sl-stat-label">{t("shortlist.total")}</span>
                </div>
                <div className="sl-stat-card">
                  <span className="sl-stat-value">{brides}</span>
                  <span className="sl-stat-label">{t("shortlist.brides")}</span>
                </div>
                <div className="sl-stat-card">
                  <span className="sl-stat-value">{grooms}</span>
                  <span className="sl-stat-label">{t("shortlist.grooms")}</span>
                </div>
              </div>
            )}

            {/* ── Filter tabs ── */}
            {profiles.length > 0 && (
              <div className="sl-filter-tabs">
                {["all", "bride", "groom"].map((f) => (
                  <button
                    key={f}
                    className={`sl-filter-tab${filter === f ? " active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {t(`shortlist.filter_${f}`)}
                    <span className="sl-filter-count">
                      {f === "all" ? profiles.length : f === "bride" ? brides : grooms}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ── Grid ── */}
            {filtered.length === 0 ? (
              <EmptyState onSearch={onSearch || onBack} />
            ) : (
              <div className="sl-grid">
                {filtered.map((profile) => (
                  <ShortlistCard
                    key={profile._id}
                    profile={profile}
                    onView={onViewProfile  || (() => {})}
                    onMessage={onMessage   || (() => {})}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
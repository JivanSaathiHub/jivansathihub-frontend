import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getReceivedInterests, getSentInterests, getMatches,
  getMyProfile, respondToInterest,
} from "../../api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import "./DashboardPage.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/* ── Resolve photo URL ── */
const SERVER = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";
function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SERVER}${url}`;
}

/* ── Relative time helper ── */
function timeAgo(date, t) {
  if (!date) return "";
  const secs = Math.floor((Date.now() - new Date(date)) / 1000);
  if (secs < 60)    return t("time.just_now");
  if (secs < 3600)  return t("time.min_ago",   { count: Math.floor(secs / 60) });
  if (secs < 86400) return t("time.hours_ago",  { count: Math.floor(secs / 3600) });
  return t("time.days_ago", { count: Math.floor(secs / 86400) });
}

/* ══════════════════════════════════════════
   ICONS
══════════════════════════════════════════ */
function IcoHeart({ color = "#ef4444" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function IcoHeartSent({ color = "#f59e0b" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function IcoMatches({ color = "#16a34a" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function IcoMsg({ color = "#3b82f6" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function IcoStar({ color = "#a855f7" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function IcoEye({ color = "#6b7280" }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IcoCheck() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function IcoXCircle() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
}
function IcoClock() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function IcoArrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}
function IcoTrend() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function IcoCheckCircle({ done }) {
  return done
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>;
}
function IcoAdminShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  );
}
function IcoChevronRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

/* ══════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════ */
function StatCard({ icon, count, label, badge, onClick }) {
  const { t } = useTranslation();
  return (
    <div
      className={`db-stat${onClick ? " db-stat--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {badge && <span className="db-stat-badge">{t("badge.new")}</span>}
      <div className="db-stat-icon">{icon}</div>
      <div className="db-stat-count">{count}</div>
      <div className="db-stat-label">{label}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   INTEREST ROW
══════════════════════════════════════════ */
function InterestRow({ interest, onAccept, onDecline, onView }) {
  const { t } = useTranslation();
  const sender = interest.sender || {};
  const photo  = resolvePhoto(sender.photos?.find((p) => p.isPrimary)?.url || sender.photos?.[0]?.url);
  return (
    <div className="db-interest-row">
      <div className="db-interest-avatar">
        {photo
          ? <img src={photo} alt={sender.fullName} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          : (sender.fullName || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
        }
      </div>
      <div className="db-interest-info">
        <span className="db-interest-name">{sender.fullName || "—"}</span>
        <span className="db-interest-sub">{sender.age} {t("interest.years_short")}, {sender.city}</span>
        <span className="db-interest-job">{sender.profession || sender.education || ""}</span>
      </div>
      <div className="db-interest-actions">
        <button className="db-ico-btn" onClick={onAccept}  title={t("interest.accept")}>  <IcoCheck />   </button>
        <button className="db-ico-btn" onClick={onDecline} title={t("interest.decline")}> <IcoXCircle /> </button>
        <button className="db-view-btn" onClick={onView}>{t("interest.view_profile")}</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   ACTIVITY ROW
══════════════════════════════════════════ */
function ActivityRow({ text, boldName, time, onClick }) {
  const parts = boldName ? text.split(boldName) : [text];
  return (
    <div className="db-activity-row" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="db-activity-text">
        {parts[0]}{boldName && <strong>{boldName}</strong>}{parts[1]}
      </div>
      <div className="db-activity-right">
        <span className="db-activity-time"><IcoClock /> {time}</span>
        {onClick && <IcoArrow />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   RECOMMENDED PROFILE CARD
══════════════════════════════════════════ */
function RecommendedCard({ profile, onViewProfile }) {
  const photo = resolvePhoto(
    profile.primaryPhoto ||
    profile.photos?.find((p) => p.isPrimary)?.url ||
    profile.photos?.[0]?.url
  );
  return (
    <div className="db-rec-card" onClick={() => onViewProfile?.(profile._id)}>
      <div className="db-rec-photo">
        {photo
          ? <img src={photo} alt={profile.fullName} className="db-rec-img" />
          : <div className="db-rec-placeholder">{profile.fullName?.charAt(0)}</div>
        }
        {profile.isVerified && <span className="db-rec-verified">✓</span>}
      </div>
      <div className="db-rec-info">
        <h4>{profile.fullName}, {profile.age}</h4>
        <p>💼 {profile.profession || "—"}</p>
        <p>📍 {profile.city}</p>
      </div>
      <button
        className="db-view-btn"
        onClick={(e) => { e.stopPropagation(); onViewProfile?.(profile._id); }}
      >
        View Profile
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function DashboardPage({
  onBack, onLogin, onRegister, onHelp, onAboutClick, onMenuClick,
  onViewProfile, onSearch, onPlanClick, onAdminLoginClick,
}) {
  const { t }    = useTranslation();
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] || t("dashboard.default_user");
  const isAdmin   = user?.role === "admin" || user?.role === "superadmin";

  /* ── State ── */
  const [stats,       setStats]       = useState({ received: 0, sent: 0, matches: 0, views: 0 });
  const [pendingList, setPendingList] = useState([]);
  const [activity,    setActivity]    = useState([]);
  const [whoViewed,   setWhoViewed]   = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading,     setLoading]     = useState(true);

  /* ── Profile strength ── */
  const checks = [
    { label: t("dashboard.checklist.basic_details"),   done: !!(user?.religion && user?.height)  },
    { label: t("dashboard.checklist.photos_uploaded"),  done: (user?.photos?.length || 0) > 0     },
    { label: t("dashboard.checklist.about_me_written"), done: (user?.aboutMe?.length || 0) > 20   },
    { label: t("dashboard.checklist.profile_verified"), done: !!user?.isVerified                  },
  ];
  const profileStrength = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);

  /* ── Fetch all dashboard data ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes, matchesRes, profileRes, viewsRes, recRes] = await Promise.allSettled([
        getReceivedInterests(),
        getSentInterests(),
        getMatches(),
        getMyProfile(),
        fetch(`${API_BASE}/search/who-viewed-me`,   { credentials: "include" }).then((r) => r.json()),
        fetch(`${API_BASE}/search/recommendations`, { credentials: "include" }).then((r) => r.json()),
      ]);

      const received = receivedRes.status === "fulfilled" ? receivedRes.value : {};
      const sent     = sentRes.status     === "fulfilled" ? sentRes.value     : {};
      const matches  = matchesRes.status  === "fulfilled" ? matchesRes.value  : {};
      const profile  = profileRes.status  === "fulfilled" ? profileRes.value  : {};
      const views    = viewsRes.status    === "fulfilled" ? viewsRes.value    : {};
      const rec      = recRes.status      === "fulfilled" ? recRes.value      : {};

      setStats({
        received: received.interests?.length || 0,
        sent:     sent.interests?.length     || 0,
        matches:  matches.matches?.length    || 0,
        views:    profile.user?.profileViews || 0,
      });

      setPendingList((received.interests || []).filter((i) => i.status === "pending").slice(0, 5));
      setWhoViewed((views.recentViewers || []).slice(0, 5));
      setRecommended((rec.profiles || []).slice(0, 6));

      /* Activity feed */
      const feed = [];
      (received.interests || []).slice(0, 3).forEach((i) => {
        if (i.sender?.fullName) {
          feed.push({
            name: i.sender.fullName,
            text: t("activity.sent_interest", { name: i.sender.fullName }),
            time: timeAgo(i.createdAt, t),
            id:   i.sender._id,
          });
        }
      });
      (views.recentViewers || []).slice(0, 3).forEach((v) => {
        if (v.user?.fullName) {
          feed.push({
            name: v.user.fullName,
            text: t("activity.viewed_profile", { name: v.user.fullName }),
            time: timeAgo(v.viewedAt, t),
            id:   v.user._id,
          });
        }
      });
      setActivity(feed.slice(0, 6));

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Accept / Decline interest ── */
  const handleAccept = async (interestId) => {
    try {
      await respondToInterest(interestId, "accepted");
      setPendingList((p) => p.filter((i) => i._id !== interestId));
      setStats((s) => ({ ...s, matches: s.matches + 1, received: s.received - 1 }));
    } catch (err) { console.error(err); }
  };

  const handleDecline = async (interestId) => {
    try {
      await respondToInterest(interestId, "declined");
      setPendingList((p) => p.filter((i) => i._id !== interestId));
    } catch (err) { console.error(err); }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="site-wrapper">
        <Navbar
          onHomeClick={onBack}
          onLoginClick={onLogin}
          onRegisterClick={onRegister}
          onHelpClick={onHelp}
          onAboutClick={onAboutClick}
          onMenuClick={onMenuClick}
          currentPage="dashboard"
        />
        <main className="db-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
            <p>{t("dashboard.loading")}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="site-wrapper">
      <Navbar
        onHomeClick={onBack}
        onLoginClick={onLogin}
        onRegisterClick={onRegister}
        onHelpClick={onHelp}
        onAboutClick={onAboutClick}
        onMenuClick={onMenuClick}
        currentPage="dashboard"
      />

      <main className="db-main">
        <div className="db-page">

          {/* ── Welcome banner ── */}
          <div className="db-welcome">
            <div className="db-welcome-inner">
              <div className="db-welcome-text">
                <h1 className="db-welcome-title">{t("dashboard.welcome_back", { name: firstName })}</h1>
                <p className="db-welcome-sub">
                  {t("dashboard.profile_complete", { strength: profileStrength })}
                  {profileStrength < 100 && " " + t("dashboard.profile_incomplete_suggestion")}
                </p>
                {/* ── Complete Profile button — only shown when profile is incomplete ── */}
                {profileStrength < 100 && (
                  <button className="db-complete-btn" onClick={() => onMenuClick?.("edit-profile")}>
                    {t("dashboard.complete_profile_button")}
                  </button>
                )}
              </div>

              {isAdmin && (
                <button
                  className="db-admin-btn"
                  onClick={() => onAdminLoginClick?.()}
                  title="Access Admin Panel"
                >
                  <IcoAdminShield />
                  <span>Admin Panel</span>
                  <IcoChevronRight />
                </button>
              )}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="db-stats">
            <StatCard icon={<IcoHeart />}     count={stats.received} label={t("dashboard.stats.received")}      badge={stats.received > 0 ? "New" : null} onClick={() => onMenuClick?.("interests")} />
            <StatCard icon={<IcoHeartSent />} count={stats.sent}     label={t("dashboard.stats.sent")}          onClick={() => onMenuClick?.("interests")} />
            <StatCard icon={<IcoMatches />}   count={stats.matches}  label={t("dashboard.stats.matches")}       onClick={() => onMenuClick?.("matches")}   />
            <StatCard icon={<IcoMsg />}       count={0}              label={t("dashboard.stats.messages")}      onClick={() => onMenuClick?.("messages")}  />
            <StatCard icon={<IcoStar />}      count={0}              label={t("dashboard.stats.shortlisted")}   onClick={() => onMenuClick?.("shortlist")} />
            <StatCard icon={<IcoEye />}       count={stats.views}    label={t("dashboard.stats.profile_views")} onClick={() => onMenuClick?.("profile")}   />
          </div>

          {/* ── Two-column layout ── */}
          <div className="db-columns">

            {/* LEFT */}
            <div className="db-left">

              {/* Pending Interests */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">{t("dashboard.pending_interests_title", { count: pendingList.length })}</h2>
                  <button className="db-viewall-btn" onClick={() => onMenuClick?.("interests")}>{t("dashboard.view_all")}</button>
                </div>
                <div className="db-interest-list">
                  {pendingList.length === 0 ? (
                    <p className="db-empty">{t("dashboard.no_pending_interests")}</p>
                  ) : (
                    pendingList.map((i) => (
                      <InterestRow
                        key={i._id}
                        interest={i}
                        onAccept={()  => handleAccept(i._id)}
                        onDecline={() => handleDecline(i._id)}
                        onView={()    => onViewProfile?.(i.sender?._id)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="db-card">
                <div className="db-card-header">
                  <h2 className="db-card-title">{t("dashboard.recent_activity_title")}</h2>
                </div>
                <div className="db-activity-list">
                  {activity.length === 0 ? (
                    <p className="db-empty">{t("dashboard.no_recent_activity")}</p>
                  ) : (
                    activity.map((a, idx) => (
                      <ActivityRow
                        key={idx}
                        text={a.text}
                        boldName={a.name}
                        time={a.time}
                        onClick={() => a.id && onViewProfile?.(a.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Who Viewed My Profile */}
              {whoViewed.length > 0 && (
                <div className="db-card">
                  <div className="db-card-header">
                    <h2 className="db-card-title">{t("dashboard.who_viewed_title")}</h2>
                    <span className="db-viewall-info">{stats.views} {t("dashboard.total_views", { defaultValue: "total views" })}</span>
                  </div>
                  <div className="db-activity-list">
                    {whoViewed.map((v, idx) => (
                      <ActivityRow
                        key={idx}
                        text={t("activity.viewed_profile", { name: v.user?.fullName || "Someone" })}
                        boldName={v.user?.fullName || ""}
                        time={timeAgo(v.viewedAt, t)}
                        onClick={() => v.user?._id && onViewProfile?.(v.user._id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Profiles */}
              {recommended.length > 0 && (
                <div className="db-card">
                  <div className="db-card-header">
                    <h2 className="db-card-title">✨ {t("dashboard.recommended_title", { defaultValue: "Recommended for You" })}</h2>
                    <button className="db-viewall-btn" onClick={() => onSearch?.({})}>
                      {t("dashboard.view_all")}
                    </button>
                  </div>
                  <div className="db-rec-grid">
                    {recommended.map((p) => (
                      <RecommendedCard key={p._id} profile={p} onViewProfile={onViewProfile} />
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT */}
            <div className="db-right">

              {/* Profile Strength */}
              <div className="db-card">
                <h2 className="db-card-title" style={{ marginBottom: 16 }}>{t("dashboard.profile_strength_title")}</h2>
                <div className="db-strength-row">
                  <span className="db-strength-pct">{profileStrength}%</span>
                  <span className="db-strength-label">
                    {profileStrength >= 100
                      ? t("dashboard.strength_excellent")
                      : profileStrength >= 75
                      ? t("dashboard.strength_good")
                      : profileStrength >= 50
                      ? t("dashboard.strength_fair")
                      : t("dashboard.strength_incomplete")}
                  </span>
                </div>
                <div className="db-progress-track">
                  <div className="db-progress-fill" style={{ width: `${profileStrength}%` }} />
                </div>
                <ul className="db-checklist">
                  {checks.map((c, i) => (
                    <li key={i} className={`db-check-item ${c.done ? "done" : ""}`}>
                      <IcoCheckCircle done={c.done} />
                      <span>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Upgrade to Premium */}
              {user?.membership?.plan === "free" && (
                <div className="db-card db-card--premium">
                  <div className="db-premium-icon"><IcoTrend /></div>
                  <h3 className="db-premium-title">{t("dashboard.upgrade_premium_title")}</h3>
                  <p className="db-premium-sub">{t("dashboard.upgrade_premium_sub")}</p>
                  <button className="db-premium-btn" onClick={() => onPlanClick?.()}>
                    {t("dashboard.upgrade_premium_button")}
                  </button>
                </div>
              )}

              {/* Quick Actions */}
              <div className="db-card">
                <h2 className="db-card-title" style={{ marginBottom: 12 }}>{t("dashboard.quick_actions_title")}</h2>
                <div className="db-quick-actions">
                  <button className="db-quick-btn" onClick={() => onSearch?.({})}>
                    {t("dashboard.quick_find_matches")}
                  </button>
                  <button className="db-quick-btn" onClick={() => onMenuClick?.("profile")}>
                    {t("dashboard.quick_view_profile")}
                  </button>
                  <button className="db-quick-btn" onClick={() => onMenuClick?.("verify")}>
                    {t("dashboard.quick_verify_profile")}
                  </button>
                  <button className="db-quick-btn" onClick={() => onMenuClick?.("shortlist")}>
                    ⭐ {t("dashboard.quick_shortlist", { defaultValue: "Shortlist" })}
                  </button>
                  <button className="db-quick-btn" onClick={() => onMenuClick?.("messages")}>
                    💬 {t("dashboard.quick_messages", { defaultValue: "Messages" })}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
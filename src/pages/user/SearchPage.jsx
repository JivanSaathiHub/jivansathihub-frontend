import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { searchProfiles, sendInterest } from "../../api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./SearchPage.css";

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

const RELIGIONS = ["","Hindu","Muslim","Christian","Sikh","Jain","Buddhist","Other"];
const PER_PAGE  = 12;

/* ── Icons ── */
const IconEdu = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3.33 1.67 8.67 1.67 12 0v-5"/></svg>;
const IconJob = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
const IconPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;

/* ══════════════════════════════════════════
   SKELETON CARD
══════════════════════════════════════════ */
function SkeletonCard({ index }) {
  return (
    <div className="sp-card sp-sk-card" style={{ "--sk-delay": `${index * 0.1}s` }}>
      <div className="sp-sk-photo sp-sk-shine" />
      <div className="sp-card-body">
        <div className="sp-sk-shine sp-sk-line" style={{ width: "68%", height: 16, marginBottom: 8 }} />
        <div className="sp-sk-shine sp-sk-line" style={{ width: "46%", height: 12, marginBottom: 14 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          <div className="sp-sk-shine sp-sk-line" style={{ width: "78%" }} />
          <div className="sp-sk-shine sp-sk-line" style={{ width: "62%" }} />
          <div className="sp-sk-shine sp-sk-line" style={{ width: "50%" }} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <div className="sp-sk-shine sp-sk-btn" />
          <div className="sp-sk-shine sp-sk-btn" />
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      <div className="sp-progress-bar"><div className="sp-progress-fill" /></div>
      <div className="sp-sk-label">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        Finding your best matches…
      </div>
      <div className="sp-grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
      </div>
    </>
  );
}

/* ── Send Interest Modal ── */
function SendInterestModal({ profileName, onClose, onSend }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  return (
    <div className="si-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="si-modal">
        <h2 className="si-title">{t('search.modalTitle', { name: profileName })}</h2>
        <p className="si-desc">{t('search.modalDesc', { firstName: profileName.split(" ")[0] })}</p>
        <textarea
          className="si-textarea"
          placeholder={t('search.modalPlaceholder')}
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={4}
        />
        <div className="si-actions">
          <button className="si-btn-send" onClick={() => { onSend(message); onClose(); }}>{t('search.modalSendBtn')}</button>
          <button className="si-btn-cancel" onClick={onClose}>{t('search.modalCancelBtn')}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Match Score Badge ── */
function ScoreBadge({ score }) {
  const { t } = useTranslation();
  if (!score || score < 20) return null;
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#f59e0b" : "#6b7280";
  return (
    <span style={{ position: "absolute", top: 8, right: 8, background: color, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>
      {score}% {t('search.match')}
    </span>
  );
}

/* ══════════════════════════════════════════
   INTEREST BUTTON
══════════════════════════════════════════ */
function InterestButton({ status, onSend, t }) {
  if (status === "accepted") {
    return (
      <button
        className="sp-btn-interest sent"
        disabled
        style={{ background: "#dcfce7", borderColor: "#16a34a", color: "#16a34a", cursor: "default" }}
      >
        ✓ {t('search.connected')}
      </button>
    );
  }
  if (status === "pending") {
    return (
      <button
        className="sp-btn-interest sent"
        disabled
        style={{ background: "#fef9c3", borderColor: "#ca8a04", color: "#854d0e", cursor: "default" }}
      >
        ⏳ {t('search.interestSent')}
      </button>
    );
  }
  return (
    <button className="sp-btn-interest" onClick={onSend}>
      {t('search.sendInterest')}
    </button>
  );
}

/* ── Profile Card ── */
function ProfileCard({ profile, onInterest, onViewProfile, onOpenModal, localStatus }) {
  const { t } = useTranslation();
  const location = [profile.city, profile.state].filter(Boolean).join(", ");
  const photoUrl = resolvePhoto(profile.primaryPhoto);

  const effectiveStatus =
    localStatus ||
    profile.interestStatus ||
    (profile.interestSent ? "pending" : null);

  return (
    <div className="sp-card" style={{ position: "relative" }}>
      <ScoreBadge score={profile.matchScore} />
      <div className="sp-card-top">
        <div className="sp-card-badges">
          <span className="sp-badge sp-badge--gender">{profile.gender}</span>
          {profile.isVerified && <span className="sp-badge sp-badge--verified">✓ {t('search.verified')}</span>}
          {profile.membership?.plan !== "free" && (
            <span className="sp-badge" style={{ background: "#f59e0b", color: "#fff" }}>
              {profile.membership.plan === "elite" ? "⭐ Elite" : "⚡ Premium"}
            </span>
          )}
        </div>
        <button className="sp-card-heart" onClick={() => onInterest(profile._id)} aria-label="Save">
          <svg width="15" height="15" viewBox="0 0 24 24"
            fill={effectiveStatus === "accepted" ? "#cc0000" : "none"}
            stroke="#cc0000" strokeWidth="2.2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="sp-photo">
        {photoUrl ? (
          <img src={photoUrl} alt={profile.fullName} loading="lazy"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=fdecea&color=c0392b&size=300`; }}
          />
        ) : (
          <div className="sp-photo-initials">
            {(profile.fullName || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      <div className="sp-card-body">
        <h3 className="sp-name">{profile.fullName}, {profile.age}</h3>
        <p className="sp-sub">{[profile.height, profile.motherTongue].filter(Boolean).join(" | ")}</p>
        <ul className="sp-details">
          {profile.education  && <li><span className="sp-icon"><IconEdu /></span>{profile.education}</li>}
          {profile.profession && <li><span className="sp-icon"><IconJob /></span>{profile.profession}</li>}
          {location           && <li><span className="sp-icon"><IconPin /></span>{location}</li>}
        </ul>
        <div className="sp-card-actions">
          <button className="sp-btn-view" onClick={() => onViewProfile?.(profile._id)}>
            {t('search.viewProfile')}
          </button>
          <InterestButton
            status={effectiveStatus}
            onSend={() => onOpenModal(profile)}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ── */
function Pagination({ page, totalPages, onChange }) {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
  return (
    <div className="sp-pagination">
      <button className="sp-pg-btn" onClick={() => onChange(page - 1)} disabled={page === 1}>{t('search.previous')}</button>
      {pages.map(p => <button key={p} className={`sp-pg-btn${p === page ? " active" : ""}`} onClick={() => onChange(p)}>{p}</button>)}
      <button className="sp-pg-btn" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>{t('search.nextPage')}</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function SearchPage({
  onRegister, onLogin, onHelp, onBack,
  onViewProfile, prefill, onAboutClick, onMenuClick,
}) {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();

  const SORT_OPTIONS = [
    { value: "score",      label: t('search.sortBestMatch')      },
    { value: "lastActive", label: t('search.sortRecentlyActive') },
    { value: "age_asc",    label: t('search.sortAgeLowHigh')     },
    { value: "age_desc",   label: t('search.sortAgeHighLow')     },
    { value: "verified",   label: t('search.sortVerifiedFirst')  },
    { value: "newest",     label: t('search.sortNewest')         },
  ];

  const [filters, setFilters] = useState({
    gender:    prefill?.lookingFor || "",
    ageFrom:   prefill?.ageFrom    || "",
    ageTo:     prefill?.ageTo      || "",
    religion:  prefill?.religion   || "",
    location:  prefill?.location   || "",
    education: "",
  });
  const [sortBy,       setSortBy]       = useState("score");
  const [profiles,     setProfiles]     = useState([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});
  const [apiError,     setApiError]     = useState("");
  const [interestMap,  setInterestMap]  = useState({});
  const [modalProfile, setModalProfile] = useState(null);

  const didInitialFetch = useRef(false);

  /* ── Fetch ── */
  const fetchProfiles = useCallback(async (pg = 1, overrideFilters) => {
    setLoading(true);
    setApiError("");

    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    try {
      const active = overrideFilters || filters;
      const params = { page: pg, limit: PER_PAGE, sort: sortBy };
      if (active.gender)                                  params.gender    = active.gender;
      if (active.ageFrom)                                 params.ageFrom   = active.ageFrom;
      if (active.ageTo)                                   params.ageTo     = active.ageTo;
      if (active.religion && active.religion !== "Any")   params.religion  = active.religion;
      if (active.location)                                params.location  = active.location;
      if (active.education && active.education !== "Any") params.education = active.education;

      const data = await searchProfiles(params);
      setProfiles(data.profiles || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setPage(pg);
    } catch (err) {
      setApiError(err.response?.data?.message || t('search.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, isLoggedIn, t]);

  /* ── Auto-fetch on mount ── */
  useEffect(() => {
    if (isLoggedIn && !didInitialFetch.current) {
      didInitialFetch.current = true;
      const initialFilters = {
        gender:    prefill?.lookingFor || "",
        ageFrom:   prefill?.ageFrom    || "",
        ageTo:     prefill?.ageTo      || "",
        religion:  prefill?.religion   || "",
        location:  prefill?.location   || "",
        education: "",
      };
      fetchProfiles(1, initialFilters);
    }
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = field => e => {
    setFilters(p => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const validateFilters = () => {
    const e = {};
    const from = Number(filters.ageFrom), to = Number(filters.ageTo);
    if (filters.ageFrom && (from < 18 || from > 59)) e.ageFrom = t('search.errAgeFromRange');
    if (filters.ageTo   && (to   < 19 || to   > 60)) e.ageTo   = t('search.errAgeToRange');
    if (filters.ageFrom && filters.ageTo && from >= to) e.ageTo = t('search.errAgeCompare');
    return e;
  };

  const handleApply = () => {
    const errs = validateFilters();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    fetchProfiles(1);
  };

  const handleReset = () => {
    setFilters({ gender: "", ageFrom: "", ageTo: "", religion: "", location: "", education: "" });
    setErrors({}); setApiError("");
    if (isLoggedIn) setTimeout(() => fetchProfiles(1), 0);
  };

  const handlePageChange = pg => {
    fetchProfiles(pg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProfile = async (profileId) => {
    try { await fetch(`${API_BASE}/search/view/${profileId}`, { method: "POST", credentials: "include" }); } catch (_) {}
    onViewProfile?.(profileId);
  };

  const handleInterestToggle = (profileId) => {
    if (!isLoggedIn) { setApiError(t('search.loginToSendInterest')); return; }
    const profile = profiles.find(p => String(p._id) === String(profileId));
    if (profile) setModalProfile(profile);
  };

  const handleOpenModal = (profile) => {
    if (!isLoggedIn) { setApiError(t('search.loginToSendInterest')); return; }
    setModalProfile(profile);
  };

  const handleModalSend = async (message) => {
    if (!modalProfile) return;
    try {
      await sendInterest(modalProfile._id, message);
      setInterestMap(p => ({ ...p, [modalProfile._id]: "pending" }));
    } catch (err) {
      setApiError(err.response?.data?.message || t('search.sendInterestFailed'));
    }
  };

  const handleBannerLogin    = (e) => { e.stopPropagation(); onLogin?.();    };
  const handleBannerRegister = (e) => { e.stopPropagation(); onRegister?.(); };

  return (
    <div className="sp-page">
      <Navbar onRegisterClick={onRegister} onLoginClick={onLogin} onHelpClick={onHelp} onHomeClick={onBack} onAboutClick={onAboutClick} onMenuClick={onMenuClick} />

      {onBack && (
        <div className="sp-backbar">
          <div className="sp-backbar-inner">
            <button className="sp-back-btn" onClick={onBack}>{t('search.back')}</button>
          </div>
        </div>
      )}

      <div className="sp-main">
        <div className="sp-title-block">
          <h1 className="sp-page-title">{t('search.title')}</h1>
          <p className="sp-page-sub">
            {isLoggedIn ? t('search.showingProfiles', { count: total }) : t('search.loginToSearch')}
          </p>
        </div>

        {/* Filters */}
        <div className="sp-filter-card">
          <h2 className="sp-filter-heading">{t('search.filterProfiles')}</h2>
          <div className="sp-filter-row">
            <div className="sp-filter-field">
              <label className="sp-filter-label">{t('search.lookingFor')}</label>
              <select className="sp-filter-input" value={filters.gender} onChange={update("gender")}>
                <option value=""></option>
                <option value="Female">{t('search.bride')}</option>
                <option value="Male">{t('search.groom')}</option>
              </select>
            </div>
            <div className="sp-filter-field">
              <label className="sp-filter-label">{t('search.ageFrom')}</label>
              <select className={`sp-filter-input${errors.ageFrom ? " sp-input-err" : ""}`} value={filters.ageFrom} onChange={update("ageFrom")}>
                <option value=""></option>
                {Array.from({ length: 42 }, (_, i) => i + 18).map(a => <option key={a}>{a}</option>)}
              </select>
              {errors.ageFrom && <span className="sp-err-msg">{errors.ageFrom}</span>}
            </div>
            <div className="sp-filter-field">
              <label className="sp-filter-label">{t('search.ageTo')}</label>
              <select className={`sp-filter-input${errors.ageTo ? " sp-input-err" : ""}`} value={filters.ageTo} onChange={update("ageTo")}>
                <option value=""></option>
                {Array.from({ length: 42 }, (_, i) => i + 18).map(a => <option key={a}>{a}</option>)}
              </select>
              {errors.ageTo && <span className="sp-err-msg">{errors.ageTo}</span>}
            </div>
            <div className="sp-filter-field">
              <label className="sp-filter-label">{t('search.religion')}</label>
              <select className="sp-filter-input" value={filters.religion} onChange={update("religion")}>
                {RELIGIONS.map(r => <option key={r} value={r}>{r || t('search.any')}</option>)}
              </select>
            </div>
            <div className="sp-filter-field">
              <label className="sp-filter-label">{t('search.location')}</label>
              <input className="sp-filter-input" type="text" placeholder={t('search.cityOrState')} value={filters.location} onChange={update("location")} />
            </div>
          </div>
          <div className="sp-filter-actions">
            <button className="sp-apply-btn" onClick={handleApply} disabled={loading}>
              {loading ? t('search.searching') : t('search.applyFilters')}
            </button>
            <button className="sp-reset-btn" onClick={handleReset}>{t('search.reset')}</button>
            <div className="sp-sort-wrap">
              <label className="sp-sort-label">{t('search.sortBy')}</label>
              <select className="sp-sort-select" value={sortBy} onChange={e => { setSortBy(e.target.value); setTimeout(() => fetchProfiles(1), 0); }}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="sp-login-banner">
            <span>🔐 {t('search.loginBanner')}</span>
            <button className="sp-cta-login" onClick={handleBannerLogin}>{t('search.loginBtn')}</button>
            <button className="sp-cta-register" onClick={handleBannerRegister}>{t('search.registerBtn')}</button>
          </div>
        )}

        {apiError && (
          <div className="sp-api-error">
            ⚠ {apiError}
            {apiError.toLowerCase().includes("login") && (
              <button className="sp-cta-login" onClick={handleBannerLogin}>{t('search.loginBtn')}</button>
            )}
          </div>
        )}

        {loading && <SkeletonGrid />}

        {!loading && isLoggedIn && profiles.length === 0 && (
          <div className="sp-state-box">
            <div className="sp-state-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h3>{t('search.noProfiles')}</h3>
            <p>{t('search.tryAdjusting')}</p>
          </div>
        )}

        {!loading && profiles.length > 0 && (
          <>
            <div className="sp-grid">
              {profiles.map(p => (
                <ProfileCard
                  key={p._id}
                  profile={p}
                  localStatus={interestMap[p._id] || null}
                  onInterest={handleInterestToggle}
                  onViewProfile={handleViewProfile}
                  onOpenModal={handleOpenModal}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </>
        )}
      </div>

      <Footer />

      {modalProfile && (
        <SendInterestModal
          profileName={modalProfile.fullName}
          onClose={() => setModalProfile(null)}
          onSend={handleModalSend}
        />
      )}
    </div>
  );
}
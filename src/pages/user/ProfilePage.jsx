import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { uploadPhoto, deletePhoto } from '../../api';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./ProfilePage.css";

/* ── Backend base URL for photo display ── */
const SERVER = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

/* ── Helper: resolve photo URL (Cloudinary or local server) ── */
function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SERVER}${url}`;
}

/* ══════════════════════════════════════════
   ICONS (unchanged)
══════════════════════════════════════════ */
function IcoUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IcoMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function IcoPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.56 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l1.12-1.12a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function IcoPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IcoBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}
function IcoGradCap() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
function IcoHeart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function IcoStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function IcoCamera() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  );
}
function IcoShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function IcoPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function IcoEye() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function IcoAddPhoto() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/><line x1="12" y1="11" x2="12" y2="15"/><line x1="10" y1="13" x2="14" y2="13"/>
    </svg>
  );
}

/* ══════════════════════════════════════════
   SECTION CARD
══════════════════════════════════════════ */
function SectionCard({ icon, title, children }) {
  return (
    <div className="pp-section-card">
      <div className="pp-section-header">
        <span className="pp-section-icon">{icon}</span>
        <h2 className="pp-section-title">{title}</h2>
      </div>
      <div className="pp-section-body">{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DETAIL GRID ROW
══════════════════════════════════════════ */
function DetailGrid({ items }) {
  return (
    <div className="pp-detail-grid">
      {items.map((item, i) => (
        <div key={i} className="pp-detail-cell">
          <span className="pp-detail-label">{item.label}</span>
          <span className="pp-detail-value">{item.value || "—"}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function ProfilePage({
  onBack,
  onLogin,
  onRegister,
  onHelp,
  onAboutClick,
  onMenuClick,
  onVerifyClick,
  onEditClick,
}) {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const fileInputRef   = useRef(null);
  const photoUploadRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  /* ── Real user data with safe fallbacks ── */
  const fullName = user?.fullName || t('profilePage.defaultName');
  const age      = user?.age      || t('profilePage.defaultAge');
  const city     = user?.city     || "";
  const state    = user?.state    || "";
  const location = [city, state].filter(Boolean).join(", ") || t('profilePage.defaultLocation');

  /* ── Primary photo for sidebar ── */
  const primaryPhotoUrl = resolvePhoto(
    user?.photos?.find(p => p.isPrimary)?.url || user?.photos?.[0]?.url || null
  );

  /* ── Initials fallback ── */
  const initials = fullName
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  /* ── Stats ── */
  const profileViews  = user?.profileViews            || 0;
  const interestCount = user?.interestsReceived?.length || 0;
  const photoCount    = user?.photos?.length           || 0;

  /* ── Hobbies ── */
  const hobbiesRaw = user?.hobbies || "";
  const hobbies = Array.isArray(hobbiesRaw)
    ? hobbiesRaw
    : hobbiesRaw.split(",").map(h => h.trim()).filter(Boolean);

  /* ── Upload avatar (camera button) ── */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadPhoto(file);
      await refreshUser();
    } catch (err) {
      console.error("Avatar upload failed:", err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /* ── Upload gallery photos ── */
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        await uploadPhoto(file);
      }
      await refreshUser();
    } catch (err) {
      console.error("Gallery upload failed:", err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  /* ── Remove a photo ── */
  const handleRemovePhoto = async (photoId) => {
    try {
      await deletePhoto(photoId);
      await refreshUser();
    } catch (err) {
      console.error("Remove photo failed:", err.message);
    }
  };

  return (
    <div className="site-wrapper">
      <Navbar
        onHomeClick={onBack}
        onLoginClick={onLogin}
        onRegisterClick={onRegister}
        onHelpClick={onHelp}
        onAboutClick={onAboutClick}
        onMenuClick={onMenuClick}
        currentPage="myprofile"
      />

      <main className="pp-main">
        <div className="pp-page">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="pp-sidebar">

            <div className="pp-photo-wrap">
              <div className="pp-photo-box">
                <div className="pp-photo-placeholder">
                  {primaryPhotoUrl ? (
                    <img
                      src={primaryPhotoUrl}
                      alt={fullName}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="pp-photo-initials">{initials}</div>
                  )}
                </div>
                <button
                  className="pp-camera-btn"
                  title={uploading ? t('profilePage.uploading') : t('profilePage.changePhoto')}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <IcoCamera />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            <div className="pp-sidebar-info">
              <h1 className="pp-sidebar-name">{fullName}</h1>
              <p className="pp-sidebar-sub">
                {age !== t('profilePage.defaultAge') ? `${age} ${t('profilePage.years')}` : ""}
                {age !== t('profilePage.defaultAge') && location !== t('profilePage.defaultLocation') ? " • " : ""}
                {location}
              </p>
            </div>

            <button className="pp-verify-btn" onClick={onVerifyClick}>
              <IcoShield /> {t('profilePage.verifyProfile')}
            </button>
            <button className="pp-edit-btn" onClick={onEditClick}>
              <IcoPencil /> {t('profilePage.editProfile')}
            </button>

            <div className="pp-sidebar-stats">
              <div className="pp-stat-item">
                <IcoEye />
                <span className="pp-stat-num">{profileViews}</span>
                <span className="pp-stat-lbl">{t('profilePage.views')}</span>
              </div>
              <div className="pp-stat-item">
                <IcoHeart />
                <span className="pp-stat-num">{interestCount}</span>
                <span className="pp-stat-lbl">{t('profilePage.interests')}</span>
              </div>
              <div className="pp-stat-item">
                <IcoCamera />
                <span className="pp-stat-num">{photoCount}</span>
                <span className="pp-stat-lbl">{t('profilePage.photos')}</span>
              </div>
            </div>
          </aside>

          {/* ── RIGHT CONTENT ── */}
          <div className="pp-content">

            {/* About Me */}
            <SectionCard icon={<IcoUser />} title={t('profilePage.aboutMe')}>
              <p className="pp-about-text">
                {user?.aboutMe || t('profilePage.noAboutMe')}
              </p>
            </SectionCard>

            {/* Basic Details */}
            <SectionCard icon={<IcoUser />} title={t('profilePage.basicDetails')}>
              <DetailGrid items={[
                { label: t('profilePage.age'),            value: age !== t('profilePage.defaultAge') ? `${age} ${t('profilePage.years')}` : t('profilePage.defaultDash') },
                { label: t('profilePage.height'),         value: user?.height        },
                { label: t('profilePage.weight'),         value: user?.weight        },
                { label: t('profilePage.maritalStatus'), value: user?.maritalStatus },
                { label: t('profilePage.motherTongue'),  value: user?.motherTongue  },
                { label: t('profilePage.religion'),       value: user?.religion      },
                { label: t('profilePage.caste'),          value: user?.caste         },
              ]} />
            </SectionCard>

            {/* Contact Details */}
            <SectionCard icon={<IcoMail />} title={t('profilePage.contactDetails')}>
              <div className="pp-contact-grid">
                <div className="pp-contact-item">
                  <IcoMail />
                  <div>
                    <span className="pp-detail-label">{t('profilePage.email')}</span>
                    <span className="pp-detail-value">{user?.email || t('profilePage.defaultDash')}</span>
                  </div>
                </div>
                <div className="pp-contact-item">
                  <IcoPhone />
                  <div>
                    <span className="pp-detail-label">{t('profilePage.phone')}</span>
                    <span className="pp-detail-value">
                      {user?.mobile ? `+91 ${user.mobile}` : t('profilePage.defaultDash')}
                    </span>
                  </div>
                </div>
                <div className="pp-contact-item pp-contact-item--full">
                  <IcoPin />
                  <div>
                    <span className="pp-detail-label">{t('profilePage.location')}</span>
                    <span className="pp-detail-value">{location}</span>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Professional Details */}
            <SectionCard icon={<IcoBriefcase />} title={t('profilePage.professionalDetails')}>
              <DetailGrid items={[
                { label: t('profilePage.profession'),    value: user?.profession   },
                { label: t('profilePage.company'),       value: user?.employer     },
                { label: t('profilePage.annualIncome'), value: user?.annualIncome },
              ]} />
            </SectionCard>

            {/* Education Details */}
            <SectionCard icon={<IcoGradCap />} title={t('profilePage.educationDetails')}>
              <DetailGrid items={[
                { label: t('profilePage.highestQualification'), value: user?.education },
              ]} />
            </SectionCard>

            {/* Family Details */}
            <SectionCard icon={<IcoHeart />} title={t('profilePage.familyDetails')}>
              <DetailGrid items={[
                { label: t('profilePage.familyType'),        value: user?.familyType       },
                { label: t('profilePage.familyValues'),       value: user?.familyValues     },
                { label: t('profilePage.siblings'),            value: user?.siblings         },
                { label: t('profilePage.fatherOccupation'), value: user?.fatherOccupation },
                { label: t('profilePage.motherOccupation'), value: user?.motherOccupation },
              ]} />
            </SectionCard>

            {/* Hobbies & Interests */}
            {hobbies.length > 0 && (
              <SectionCard icon={<IcoStar />} title={t('profilePage.hobbies')}>
                <div className="pp-hobbies">
                  {hobbies.map((h, i) => (
                    <span key={i} className="pp-hobby-tag">{h}</span>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Photo Gallery */}
            <div className="pp-section-card">
              <div className="pp-section-header pp-gallery-header">
                <div className="pp-section-header-left">
                  <span className="pp-section-icon"><IcoCamera /></span>
                  <h2 className="pp-section-title">{t('profilePage.photoGallery')} ({photoCount})</h2>
                </div>
                <button
                  className="pp-add-photo-btn"
                  onClick={() => photoUploadRef.current?.click()}
                  disabled={uploading}
                >
                  <IcoAddPhoto /> {uploading ? t('profilePage.uploading') : t('profilePage.addPhotos')}
                </button>
                <input
                  ref={photoUploadRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleGalleryUpload}
                />
              </div>
              <div className="pp-section-body">
                {photoCount > 0 ? (
                  <div className="pp-gallery-grid">
                    {user.photos.map((photo, i) => (
                      <div key={photo._id || i} className="pp-gallery-cell" style={{ position: "relative" }}>
                        <img
                          src={resolvePhoto(photo.url)}
                          alt={`${t('profilePage.gallery')} ${i + 1}`}
                          className="pp-gallery-img"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                        <button
                          onClick={() => handleRemovePhoto(photo._id)}
                          style={{
                            position: "absolute", top: 4, right: 4,
                            width: 22, height: 22, borderRadius: "50%",
                            background: "rgba(0,0,0,0.6)", color: "#fff",
                            border: "none", cursor: "pointer", fontSize: 11,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          title={t('profilePage.remove')}
                        >✕</button>
                        {photo.isPrimary && (
                          <span style={{
                            position: "absolute", bottom: 4, left: 4,
                            background: "#16a34a", color: "#fff",
                            fontSize: 10, fontWeight: 700,
                            padding: "2px 7px", borderRadius: 20,
                          }}>{t('profilePage.main')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pp-gallery-grid">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="pp-gallery-cell">
                        <div className="pp-gallery-placeholder"><IcoCamera /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
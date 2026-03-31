import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./SettingsPage.css";

// Icons (unchanged)
function IcoGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}
function IcoPrivacy() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function IcoNotif() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function IcoDelete() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  );
}
function IcoChevron({ open }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{
        transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        flexShrink: 0,
        color: "#9ca3af",
      }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

/* ─── CONFIRMATION MODAL ───────────────────────────────────── */
function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  const { t } = useTranslation();
  return (
    <div className="sett-modal-overlay" onClick={onCancel}>
      <div className="sett-modal" onClick={e => e.stopPropagation()}>
        <div className="sett-modal-icon">⚠️</div>
        <h3 className="sett-modal-title">{title}</h3>
        <p className="sett-modal-msg">{message}</p>
        <div className="sett-modal-actions">
          <button className="sett-modal-cancel" onClick={onCancel}>
            {t('settingsPage.modal.cancel')}
          </button>
          <button className="sett-modal-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ACCORDION CARD ───────────────────────────────────────── */
function AccordionCard({ icon, title, sub, danger, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`settings-card${danger ? " settings-card--danger" : ""}${open ? " settings-card--open" : ""}`}>
      <button
        className="settings-card-header settings-card-header--btn"
        onClick={() => setOpen(o => !o)}
      >
        <span
          className="settings-card-icon"
          style={danger ? { color: "#cc0000", background: "#fff0f0" } : {}}
        >
          {icon}
        </span>
        <div className="settings-card-header-text">
          <h2 className="settings-card-title" style={danger ? { color: "#cc0000" } : {}}>
            {title}
          </h2>
          <p className="settings-card-sub">{sub}</p>
        </div>
        <IcoChevron open={open} />
      </button>
      {open && <div className="settings-card-body">{children}</div>}
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────────── */
export default function SettingsPage({
  onBack, onLogin, onRegister, onHelp, onAboutClick, onMenuClick,
}) {
  const { t, i18n } = useTranslation();
  useAuth();  // only needed for auth context, no destructuring

  const currentLang = i18n?.language?.slice(0, 2) || "en";

  const handleLangChange = (code) => {
    if (i18n && i18n.changeLanguage) i18n.changeLanguage(code);
    localStorage.setItem("jsh_lang", code);
  };

  const [modal, setModal] = useState(null);

  const handleDeactivate = () => {
    setModal(null);
    alert(t('settingsPage.modal.deactivate.alert')); // optional – you can replace with a proper toast
  };

  const handleDelete = () => {
    setModal(null);
    alert(t('settingsPage.modal.delete.alert'));
  };

  // Language list with translated labels
  const LANGUAGES = [
    { code: "en", label: t('settingsPage.language.enLabel'), native: "English", flag: "🇬🇧" },
    { code: "hi", label: t('settingsPage.language.hiLabel'), native: "हिंदी",   flag: "🇮🇳" },
    { code: "mr", label: t('settingsPage.language.mrLabel'), native: "मराठी",   flag: "🇮🇳" },
  ];

  // Notification items
  const notificationItems = [
    { label: t('settingsPage.notifications.items.0.label'), sub: t('settingsPage.notifications.items.0.sub') },
    { label: t('settingsPage.notifications.items.1.label'), sub: t('settingsPage.notifications.items.1.sub') },
    { label: t('settingsPage.notifications.items.2.label'), sub: t('settingsPage.notifications.items.2.sub') },
    { label: t('settingsPage.notifications.items.3.label'), sub: t('settingsPage.notifications.items.3.sub') },
  ];

  // Privacy items
  const privacyItems = [
    { label: t('settingsPage.privacy.items.0.label'), sub: t('settingsPage.privacy.items.0.sub') },
    { label: t('settingsPage.privacy.items.1.label'), sub: t('settingsPage.privacy.items.1.sub') },
    { label: t('settingsPage.privacy.items.2.label'), sub: t('settingsPage.privacy.items.2.sub') },
  ];

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

      <main className="settings-main">
        <div className="settings-page">

          <div className="settings-header">
            <h1 className="settings-title">{t('settingsPage.title')}</h1>
            <p className="settings-sub">{t('settingsPage.subtitle')}</p>
          </div>

          {/* Language section – hidden on desktop, visible on mobile/tablet */}
          <div className="settings-lang-section">
            <AccordionCard
              icon={<IcoGlobe />}
              title={t('settingsPage.language.title')}
              sub={t('settingsPage.language.sub')}
            >
              <div className="settings-lang-grid">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    className={`settings-lang-btn ${currentLang === lang.code ? "active" : ""}`}
                    onClick={() => handleLangChange(lang.code)}
                  >
                    <span className="settings-lang-flag">{lang.flag}</span>
                    <div className="settings-lang-info">
                      <span className="settings-lang-label">{lang.label}</span>
                      <span className="settings-lang-native">{lang.native}</span>
                    </div>
                    {currentLang === lang.code && (
                      <span className="settings-lang-check"><IcoCheck /></span>
                    )}
                  </button>
                ))}
              </div>
            </AccordionCard>
          </div>

          {/* Notifications */}
          <AccordionCard
            icon={<IcoNotif />}
            title={t('settingsPage.notifications.title')}
            sub={t('settingsPage.notifications.sub')}
          >
            <div className="settings-toggle-list">
              {notificationItems.map((item, i) => (
                <div key={i} className="settings-toggle-row">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-label">{item.label}</span>
                    <span className="settings-toggle-sub">{item.sub}</span>
                  </div>
                  <label className="settings-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="settings-slider" />
                  </label>
                </div>
              ))}
            </div>
          </AccordionCard>

          {/* Privacy */}
          <AccordionCard
            icon={<IcoPrivacy />}
            title={t('settingsPage.privacy.title')}
            sub={t('settingsPage.privacy.sub')}
          >
            <div className="settings-toggle-list">
              {privacyItems.map((item, i) => (
                <div key={i} className="settings-toggle-row">
                  <div className="settings-toggle-info">
                    <span className="settings-toggle-label">{item.label}</span>
                    <span className="settings-toggle-sub">{item.sub}</span>
                  </div>
                  <label className="settings-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="settings-slider" />
                  </label>
                </div>
              ))}
            </div>
          </AccordionCard>

          {/* Danger Zone */}
          <AccordionCard
            icon={<IcoDelete />}
            title={t('settingsPage.danger.title')}
            sub={t('settingsPage.danger.sub')}
            danger
          >
            <div className="settings-danger-btns">
              <button
                className="settings-danger-btn settings-danger-btn--outline"
                onClick={() => setModal("deactivate")}
              >
                {t('settingsPage.danger.deactivate')}
              </button>
              <button
                className="settings-danger-btn settings-danger-btn--solid"
                onClick={() => setModal("delete")}
              >
                {t('settingsPage.danger.delete')}
              </button>
            </div>
          </AccordionCard>

        </div>
      </main>

      <Footer />

      {modal === "deactivate" && (
        <ConfirmModal
          title={t('settingsPage.modal.deactivate.title')}
          message={t('settingsPage.modal.deactivate.message')}
          confirmLabel={t('settingsPage.modal.deactivate.confirm')}
          onConfirm={handleDeactivate}
          onCancel={() => setModal(null)}
        />
      )}
      {modal === "delete" && (
        <ConfirmModal
          title={t('settingsPage.modal.delete.title')}
          message={t('settingsPage.modal.delete.message')}
          confirmLabel={t('settingsPage.modal.delete.confirm')}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
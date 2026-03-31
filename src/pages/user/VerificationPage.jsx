import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./VerificationPage.css";

/* ══════════════════════════════════════════
   ICONS (unchanged)
══════════════════════════════════════════ */
function IcoShield() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IcoShieldSm() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b5bfc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IcoEye({ show }) {
  return show ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function IcoInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b5bfc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IcoUpload() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}
function IcoCamera() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function IcoCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IcoX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IcoClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IcoVerifyBtn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IcoCheckCircle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IcoCheckCircleFill() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#16a34a" />
      <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IcoCalendar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IcoGenderIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function IcoMapPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IcoPhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.56 1.22h3a2 2 0 0 1 2 1.72c.13 1 .37 1.97.72 2.9a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.91 6.91l1.27-1.27a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

/* ══════════════════════════════════════════
   OTP MODAL
══════════════════════════════════════════ */
function OtpModal({ onClose, onVerify, maskedPhone }) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setTimeout(() => setResendTimer(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const lastFilled = Math.min(pasted.length, 5);
    refs.current[lastFilled]?.focus();
  };

  const handleVerify = async () => {
    if (otp.join("").length < 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    onVerify();
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtp(["", "", "", "", "", ""]);
    refs.current[0]?.focus();
  };

  return (
    <div className="vp-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="vp-modal">
        <button className="vp-modal-close" onClick={onClose}><IcoClose /></button>

        <div className="vp-modal-icon">
          <IcoShieldSm />
        </div>

        <h2 className="vp-modal-title">{t('verificationPage.otpModal.title')}</h2>
        <p className="vp-modal-sub">
          {t('verificationPage.otpModal.sub', { phone: maskedPhone })}
        </p>

        <div className="vp-otp-boxes" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => refs.current[i] = el}
              className={`vp-otp-box ${digit ? "filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
            />
          ))}
        </div>

        <button
          className={`vp-btn-primary ${otp.join("").length < 6 ? "disabled" : ""}`}
          onClick={handleVerify}
          disabled={otp.join("").length < 6 || loading}
        >
          {loading ? (
            <span className="vp-spinner" />
          ) : (
            <><IcoVerifyBtn /> {t('verificationPage.otpModal.verifyBtn')}</>
          )}
        </button>

        <button
          className={`vp-resend-btn ${resendTimer > 0 ? "disabled" : ""}`}
          onClick={handleResend}
          disabled={resendTimer > 0}
        >
          {resendTimer > 0
            ? t('verificationPage.otpModal.resendTimer', { seconds: resendTimer })
            : t('verificationPage.otpModal.resend')}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STEP 1 — Enter Aadhaar
══════════════════════════════════════════ */
function Step1({ onSendOtp }) {
  const { t } = useTranslation();
  const [aadhaar, setAadhaar] = useState("");
  const [show, setShow]       = useState(false);
  const [error, setError]     = useState("");

  const format = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const handleChange = (e) => {
    setError("");
    setAadhaar(format(e.target.value));
  };

  const handleSubmit = () => {
    const digits = aadhaar.replace(/\s/g, "");
    if (digits.length !== 12) {
      setError(t('verificationPage.step1.errorInvalid'));
      return;
    }
    onSendOtp(aadhaar);
  };

  const filled = aadhaar.replace(/\s/g, "").length === 12;

  return (
    <div className="vp-card">
      <h2 className="vp-card-title">{t('verificationPage.step1.title')}</h2>

      <div className="vp-field">
        <label className="vp-label">{t('verificationPage.step1.aadhaarLabel')} <span className="vp-required">*</span></label>
        <div className={`vp-input-wrap ${error ? "error" : ""}`}>
          <input
            className="vp-input"
            type={show ? "text" : "password"}
            placeholder={t('verificationPage.step1.aadhaarPlaceholder')}
            value={aadhaar}
            onChange={handleChange}
            maxLength={14}
            inputMode="numeric"
          />
          <button className="vp-eye-btn" onClick={() => setShow(p => !p)} type="button">
            <IcoEye show={show} />
          </button>
        </div>
        {error && <span className="vp-error-msg">{error}</span>}
        <p className="vp-hint">{t('verificationPage.step1.hint')}</p>
      </div>

      <div className="vp-info-box">
        <div className="vp-info-header">
          <IcoInfo />
          <span>{t('verificationPage.step1.howItWorks')}</span>
        </div>
        <ul className="vp-info-list">
          <li>{t('verificationPage.step1.howItWorksItem1')}</li>
          <li>{t('verificationPage.step1.howItWorksItem2')}</li>
          <li>{t('verificationPage.step1.howItWorksItem3')}</li>
          <li>{t('verificationPage.step1.howItWorksItem4')}</li>
        </ul>
      </div>

      <button
        className={`vp-btn-primary ${filled ? "" : "disabled"}`}
        onClick={handleSubmit}
        disabled={!filled}
      >
        <IcoVerifyBtn /> {t('verificationPage.step1.sendOtpBtn')}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   STEP 2 — Verify Details (auto-fetched)
══════════════════════════════════════════ */
function Step2({ aadhaar, onNext }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="vp-card vp-card-center">
        <span className="vp-spinner large" />
        <p className="vp-loading-text">{t('verificationPage.step2.loading')}</p>
      </div>
    );
  }

  return (
    <div className="vp-card">

      <div className="vp-s2-success-row">
        <IcoCheckCircleFill />
        <div>
          <p className="vp-s2-success-title">{t('verificationPage.step2.successTitle')}</p>
          <p className="vp-s2-success-sub">{t('verificationPage.step2.successSub')}</p>
        </div>
      </div>

      <div className="vp-s2-profile-box">
        <div className="vp-s2-photo" />
        <div className="vp-s2-info">

          <div className="vp-s2-name-block">
            <span className="vp-s2-field-label">{t('verificationPage.step2.fullNameLabel')}</span>
            <span className="vp-s2-name">{t('verificationPage.step2.sampleName')}</span>
          </div>

          <div className="vp-s2-row2">
            <div className="vp-s2-field">
              <span className="vp-s2-field-icon"><IcoCalendar /> {t('verificationPage.step2.dobLabel')}</span>
              <span className="vp-s2-field-val">{t('verificationPage.step2.sampleDob')}</span>
            </div>
            <div className="vp-s2-field">
              <span className="vp-s2-field-icon"><IcoGenderIcon /> {t('verificationPage.step2.genderLabel')}</span>
              <span className="vp-s2-field-val">{t('verificationPage.step2.sampleGender')}</span>
            </div>
          </div>

          <div className="vp-s2-field">
            <span className="vp-s2-field-icon"><IcoMapPin /> {t('verificationPage.step2.addressLabel')}</span>
            <span className="vp-s2-field-val">{t('verificationPage.step2.sampleAddress')}</span>
          </div>

          <div className="vp-s2-field">
            <span className="vp-s2-field-icon"><IcoPhoneIcon /> {t('verificationPage.step2.mobileLabel')}</span>
            <span className="vp-s2-field-val">{t('verificationPage.step2.sampleMobile')}</span>
          </div>

        </div>
      </div>

      <div className="vp-s2-notice">
        <strong>{t('verificationPage.step2.noticeStrong')}</strong> {t('verificationPage.step2.noticeText')}
      </div>

      <button className="vp-btn-primary" onClick={onNext}>
        <IcoCheckCircle /> {t('verificationPage.step2.confirmBtn')}
      </button>

    </div>
  );
}

/* ══════════════════════════════════════════
   STEP 3 — Upload Documents
══════════════════════════════════════════ */
function UploadBox({ label, side }) {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(f.type)) return;
    if (f.size > 5 * 1024 * 1024) return;
    setFile(f);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="vp-field">
      <label className="vp-label">{label} <span className="vp-required">*</span></label>
      <div
        className={`vp-upload-box ${file ? "has-file" : ""}`}
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        {file ? (
          <div className="vp-upload-preview">
            {preview
              ? <img src={preview} alt="preview" className="vp-preview-img" />
              : <div className="vp-pdf-icon">PDF</div>
            }
            <div className="vp-upload-file-info">
              <span className="vp-upload-filename">{file.name}</span>
              <span className="vp-upload-filesize">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <button
              className="vp-upload-remove"
              onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); }}
            >
              <IcoClose />
            </button>
          </div>
        ) : (
          <div className="vp-upload-empty">
            <IcoUpload />
            <div className="vp-upload-text-wrap">
              <p className="vp-upload-text">{t('verificationPage.step3.uploadText', { side })}</p>
              <span className="vp-upload-hint">{t('verificationPage.step3.uploadHint')}</span>
            </div>
            <button
              className="vp-btn-choose"
              onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              <IcoCamera /> {t('verificationPage.step3.chooseFileBtn')}
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}

function Step3({ onComplete }) {
  const { t } = useTranslation();
  const guidelines = [
    { ok: true,  text: t('verificationPage.step3.guideline1') },
    { ok: true,  text: t('verificationPage.step3.guideline2') },
    { ok: true,  text: t('verificationPage.step3.guideline3') },
    { ok: true,  text: t('verificationPage.step3.guideline4') },
    { ok: false, text: t('verificationPage.step3.guideline5') },
  ];

  return (
    <div className="vp-card">
      <h2 className="vp-card-title">{t('verificationPage.step3.title')}</h2>
      <p className="vp-card-sub">{t('verificationPage.step3.sub')}</p>

      <UploadBox label={t('verificationPage.step3.frontLabel')} side={t('verificationPage.step3.frontSide')} />
      <UploadBox label={t('verificationPage.step3.backLabel')}  side={t('verificationPage.step3.backSide')}  />

      <div className="vp-guidelines-box">
        <p className="vp-guidelines-title">{t('verificationPage.step3.guidelinesTitle')}</p>
        <ul className="vp-guidelines-list">
          {guidelines.map((g, i) => (
            <li key={i} className={g.ok ? "ok" : "bad"}>
              {g.ok ? <IcoCheck /> : <IcoX />} {g.text}
            </li>
          ))}
        </ul>
      </div>

      <button className="vp-btn-green" onClick={onComplete}>
        <IcoCheckCircle /> {t('verificationPage.step3.completeBtn')}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   PROGRESS HEADER
══════════════════════════════════════════ */
function ProgressHeader({ step }) {
  const { t } = useTranslation();
  const steps = [
    { n: 1, label: t('verificationPage.progress.step1Label') },
    { n: 2, label: t('verificationPage.progress.step2Label') },
    { n: 3, label: t('verificationPage.progress.step3Label') },
  ];

  return (
    <div className="vp-progress-header">
      <div className="vp-progress-top">
        <div className="vp-progress-icon">
          <IcoShield />
        </div>
        <div className="vp-progress-title-wrap">
          <h1 className="vp-progress-title">{t('verificationPage.progress.title')}</h1>
          <p className="vp-progress-sub">{t('verificationPage.progress.sub')}</p>
        </div>
      </div>
      <div className="vp-steps-row">
        {steps.map((s, i) => (
          <div key={s.n} className="vp-step-item">
            <div className={`vp-step-circle ${step >= s.n ? "active" : ""} ${step > s.n ? "done" : ""}`}>
              {step > s.n ? "✓" : s.n}
            </div>
            <span className={`vp-step-label ${step >= s.n ? "active" : ""}`}>{s.label}</span>
            {i < steps.length - 1 && (
              <div className={`vp-step-arrow ${step > s.n ? "done" : ""}`}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function VerificationPage({
  onBack, onLogin, onRegister, onHelp, onAboutClick, onMenuClick, onComplete,
}) {
  const [step,       setStep]       = useState(1);
  const [aadhaar,    setAadhaar]    = useState("");
  const [showOtp,    setShowOtp]    = useState(false);
  const [maskedPhone]               = useState("****56");

  const handleSendOtp = (num) => {
    setAadhaar(num);
    setShowOtp(true);
  };

  const handleOtpVerify = () => {
    setShowOtp(false);
    setStep(2);
  };

  const handleStep2Next = () => setStep(3);

  const handleComplete = () => {
    onComplete?.();
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
      />

      <main className="vp-main">
        <div className="vp-page">
          <ProgressHeader step={step} />

          {step === 1 && <Step1 onSendOtp={handleSendOtp} />}
          {step === 2 && <Step2 aadhaar={aadhaar} onNext={handleStep2Next} />}
          {step === 3 && <Step3 onComplete={handleComplete} />}
        </div>
      </main>

      {showOtp && (
        <OtpModal
          onClose={() => setShowOtp(false)}
          onVerify={handleOtpVerify}
          maskedPhone={maskedPhone}
        />
      )}

      <Footer />
    </div>
  );
}
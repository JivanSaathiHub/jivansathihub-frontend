import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import API from "../../api/axios";
import "./LoginPage.css";

/* ════════════════════════════════════════
   FORGOT PASSWORD MODAL
════════════════════════════════════════ */
function ForgotPasswordModal({ onClose }) {
  const { t } = useTranslation();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSend = async () => {
    if (!email)                      { setError(t("forgotPassword.errors.emailRequired")); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError(t("forgotPassword.errors.emailInvalid")); return; }
    setLoading(true); setError("");
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || t("forgotPassword.errors.general"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 448,
        background: "#1f2937",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 28px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}>
          <h3 style={{ fontFamily: "var(--font-main)", fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
            {sent ? t("forgotPassword.titleSent") : t("forgotPassword.title")}
          </h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 16,
            color: "#6b7280", cursor: "pointer", padding: "2px 6px",
            borderRadius: 6, lineHeight: 1, fontFamily: "var(--font-main)",
          }}>✕</button>
        </div>

        <div style={{
          padding: "28px 28px 32px",
          display: "flex", flexDirection: "column", gap: 20,
          background: "#f8f8f9",
        }}>
          {sent ? (
            <>
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
                <p style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 8 }}>
                  {t("forgotPassword.checkEmail")}
                </p>
                <p style={{ fontFamily: "var(--font-main)", fontSize: 13.5, color: "#6b7280", lineHeight: 1.6 }}>
                  {t("forgotPassword.checkEmailDesc")}
                </p>
              </div>
              <div style={{ height: 1, background: "#374151", margin: "0 -28px" }} />
              <button onClick={onClose} style={{
                width: "100%", height: 52, borderRadius: 10,
                background: "#cc0000", color: "#fff",
                fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
                fontFamily: "var(--font-main)",
                boxShadow: "0 4px 16px rgba(204,0,0,0.35)",
              }}>
                {t("forgotPassword.backToLogin")}
              </button>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "var(--font-main)", fontSize: 13.5, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
                {t("forgotPassword.description")}
              </p>

              {error && (
                <div style={{
                  background: "#fff5f5", color: "#cc0000",
                  borderLeft: "4px solid #cc0000",
                  padding: "12px 28px", margin: "0 -28px",
                  fontSize: 13.5, fontWeight: 500,
                  fontFamily: "var(--font-main)",
                }}>
                  ⚠ {error}
                </div>
              )}

              <div className="field">
                <label style={{ color: "#cc0000", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-main)" }}>
                  {t("forgotPassword.emailLabel")}
                </label>
                <input
                  type="email"
                  placeholder={t("forgotPassword.emailPlaceholder")}
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  style={{
                    background: "#e7e9ed", border: "1.5px solid #374151",
                    color: "#0e0f0f", fontFamily: "var(--font-main)",
                    height: 52, borderRadius: 10, width: "100%",
                    padding: "0 14px", fontSize: 14, outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ height: 1, background: "#374151", margin: "0 -28px" }} />

              <button
                onClick={handleSend}
                disabled={loading}
                style={{
                  width: "100%", height: 52, borderRadius: 10,
                  background: "#cc0000", color: "#fff",
                  fontSize: 16, fontWeight: 700, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  fontFamily: "var(--font-main)",
                  boxShadow: "0 4px 16px rgba(204,0,0,0.35)",
                  letterSpacing: "0.2px",
                }}
              >
                {loading ? t("forgotPassword.sending") : t("forgotPassword.sendBtn")}
              </button>

              <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280", fontFamily: "var(--font-main)", margin: 0 }}>
                {t("forgotPassword.rememberedPassword")}{" "}
                <button onClick={onClose} style={{
                  background: "none", border: "none", fontSize: 14,
                  fontWeight: 700, color: "#cc0000", cursor: "pointer",
                  fontFamily: "var(--font-main)", padding: 0, marginLeft: 4,
                }}>
                  {t("forgotPassword.backToLogin")}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   RESET PASSWORD MODAL
════════════════════════════════════════ */
function ResetPasswordModal({ token, onClose }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState("");

  const handleReset = async () => {
    if (!password)            { setError(t("resetPassword.errors.required")); return; }
    if (password.length < 6)  { setError(t("resetPassword.errors.minLength")); return; }
    if (password !== confirm) { setError(t("resetPassword.errors.noMatch")); return; }
    setLoading(true); setError("");
    try {
      await API.post("/auth/reset-password", { token, password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || t("resetPassword.errors.general"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    window.history.replaceState({}, "", window.location.pathname);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 448,
        background: "#1f2937",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 28px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}>
          <h3 style={{ fontFamily: "var(--font-main)", fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
            {done ? t("resetPassword.titleDone") : t("resetPassword.title")}
          </h3>
          <button onClick={handleClose} style={{
            background: "none", border: "none", fontSize: 16,
            color: "#6b7280", cursor: "pointer", padding: "2px 6px",
            borderRadius: 6, lineHeight: 1, fontFamily: "var(--font-main)",
          }}>✕</button>
        </div>

        <div style={{
          padding: "28px 28px 32px",
          display: "flex", flexDirection: "column", gap: 20,
          background: "#f8f8f9",
        }}>
          {done ? (
            <>
              <div style={{ textAlign: "center", padding: "8px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ fontFamily: "var(--font-main)", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 8 }}>
                  {t("resetPassword.successTitle")}
                </p>
                <p style={{ fontFamily: "var(--font-main)", fontSize: 13.5, color: "#6b7280", lineHeight: 1.6 }}>
                  {t("resetPassword.successDesc")}
                </p>
              </div>
              <div style={{ height: 1, background: "#374151", margin: "0 -28px" }} />
              <button onClick={handleClose} style={{
                width: "100%", height: 52, borderRadius: 10,
                background: "#cc0000", color: "#fff",
                fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
                fontFamily: "var(--font-main)",
                boxShadow: "0 4px 16px rgba(204,0,0,0.35)",
              }}>
                {t("resetPassword.loginNow")}
              </button>
            </>
          ) : (
            <>
              {error && (
                <div style={{
                  background: "#fff5f5", color: "#cc0000",
                  borderLeft: "4px solid #cc0000",
                  padding: "12px 28px", margin: "0 -28px",
                  fontSize: 13.5, fontWeight: 500,
                  fontFamily: "var(--font-main)",
                }}>
                  ⚠ {error}
                </div>
              )}

              {[
                { label: t("resetPassword.newPassword"),     val: password, set: setPassword, ph: t("resetPassword.newPasswordPlaceholder")     },
                { label: t("resetPassword.confirmPassword"), val: confirm,  set: setConfirm,  ph: t("resetPassword.confirmPasswordPlaceholder") },
              ].map(f => (
                <div key={f.label} className="field">
                  <label style={{ color: "#cc0000", fontSize: 13, fontWeight: 500, fontFamily: "var(--font-main)" }}>
                    {f.label}
                  </label>
                  <input
                    type="password"
                    placeholder={f.ph}
                    value={f.val}
                    onChange={e => { f.set(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleReset()}
                    style={{
                      background: "#e7e9ed", border: "1.5px solid #374151",
                      color: "#0e0f0f", fontFamily: "var(--font-main)",
                      height: 52, borderRadius: 10, width: "100%",
                      padding: "0 14px", fontSize: 14, outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}

              <div style={{ height: 1, background: "#374151", margin: "0 -28px" }} />

              <button
                onClick={handleReset}
                disabled={loading}
                style={{
                  width: "100%", height: 52, borderRadius: 10,
                  background: "#cc0000", color: "#fff",
                  fontSize: 16, fontWeight: 700, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  fontFamily: "var(--font-main)",
                  boxShadow: "0 4px 16px rgba(204,0,0,0.35)",
                  letterSpacing: "0.2px",
                }}
              >
                {loading ? t("resetPassword.resetting") : t("resetPassword.resetBtn")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN LOGIN PAGE
════════════════════════════════════════ */
export default function LoginPage({ onBack, onRegister, onHelp, onAboutClick, onSuccess }) {
  const { t }     = useTranslation();
  const { login } = useAuth();

  const [form,       setForm]       = useState({ email: "", password: "" });
  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const resetToken = new URLSearchParams(window.location.search).get("reset_token");
  const [showReset, setShowReset]   = useState(!!resetToken);

  const update = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
    if (apiError) setApiError("");
  };

  const validate = () => {
  const errs = {};

  if (!form.password)
    errs.password = t('login.errors.passwordRequired');
  else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password)
  )
    errs.password = t('login.errors.passwordStrong');

  return errs;
};


  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setApiError("");
    try {
      await login(form.email, form.password);
      onSuccess?.();
    } catch (err) {
      setApiError(err.response?.data?.message || t('login.errors.general'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar
        onHomeClick={onBack}
        onHelpClick={onHelp}
        onAboutClick={onAboutClick}
        onLoginClick={() => {}}
        onRegisterClick={() => onRegister && onRegister(null)}
      />

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      {showReset && resetToken && (
        <ResetPasswordModal
          token={resetToken}
          onClose={() => setShowReset(false)}
        />
      )}

      <div className="login-card">
        <div className="login-card-header">
          <h3>{t('login.title')}</h3>
          <button className="login-close-btn" onClick={onBack} title={t('login.close')}>✕</button>
        </div>

        {apiError && (
          <div className="login-api-error">⚠ {apiError}</div>
        )}

        <div className="login-form">
          <div className="field">
            <label>{t('login.emailLabel')}</label>
            <input
              type="email"
              placeholder={t('login.emailPlaceholder')}
              value={form.email}
              onChange={update("email")}
              style={errors.email ? { borderColor: "#cc0000", background: "#fff5f5" } : {}}
            />
            {errors.email && <span className="login-field-err">⚠ {errors.email}</span>}
          </div>

          <div className="field">
            <label>{t('login.passwordLabel')}</label>
            <input
              type="password"
              placeholder={t('login.passwordPlaceholder')}
              value={form.password}
              onChange={update("password")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={errors.password ? { borderColor: "#cc0000", background: "#fff5f5" } : {}}
            />
            {errors.password && <span className="login-field-err">⚠ {errors.password}</span>}
          </div>

          <div className="login-row-meta">
            <label className="remember-label">
              <input type="checkbox" />
              <span>{t('login.rememberMe')}</span>
            </label>
            <button
              className="forgot-btn"
              type="button"
              onClick={() => setShowForgot(true)}
            >
              {t('login.forgotPassword')}
            </button>
          </div>

          <div className="login-divider" />

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}
          >
            {loading ? t('login.loggingIn') : t('login.loginButton')}
          </button>

          <p className="login-register-text">
            {t('login.noAccount')}
            <button className="register-link-btn" onClick={() => onRegister && onRegister(null)}>
              {t('login.registerFree')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useTranslation } from "react-i18next";
import "./Admin.css";
import adminBg from "../../assets/admin-bg.jpg";

export default function AdminLoginPage({ onSuccess, onBack }) {
  const { t }        = useTranslation();
  const { adminLogin } = useAdmin();                     // ← AdminContext, NOT AuthContext

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.value }));
    setError("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError(t("adminLogin.errors.bothRequired"));
      return;
    }
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      // adminLogin throws if credentials are wrong or role is not admin
      // If we reach here, login succeeded
      onSuccess();
    } catch (err) {
      setError(err.message || t("adminLogin.errors.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-login-page"
      style={{
        position:           "fixed",
        inset:              0,
        zIndex:             9999,
        backgroundImage:    `url(${adminBg})`,
        backgroundSize:     "cover",
        backgroundPosition: "center",
        backgroundRepeat:   "no-repeat",
      }}
    >
      {/* dark overlay */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />

      <div className="admin-login-card" style={{ position: "relative", zIndex: 1 }}>
        <div className="admin-login-logo">
          <span style={{ color: "#ff4444", fontWeight: 800, fontSize: 26 }}>JSH</span>
          <span style={{ fontWeight: 800, fontSize: 26, color: "#ffffff", marginLeft: 6 }}>
            {t("adminLogin.admin")}
          </span>
        </div>
        <p className="admin-login-sub">{t("adminLogin.sub")}</p>

        {error && <div className="admin-login-error">⚠ {error}</div>}

        <div className="admin-login-field">
          <label>{t("adminLogin.emailLabel")}</label>
          <input
            type="email"
            placeholder={t("adminLogin.emailPlaceholder")}
            value={form.email}
            onChange={set("email")}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="email"
          />
        </div>

        <div className="admin-login-field">
          <label>{t("adminLogin.passwordLabel")}</label>
          <input
            type="password"
            placeholder={t("adminLogin.passwordPlaceholder")}
            value={form.password}
            onChange={set("password")}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            autoComplete="current-password"
          />
        </div>

        <button className="admin-login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? t("adminLogin.loggingIn") : t("adminLogin.loginBtn")}
        </button>

        <button className="admin-login-back" onClick={onBack}>
          ← {t("adminLogin.backToSite")}
        </button>
      </div>
    </div>
  );
}
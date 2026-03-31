import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { sidebarApi, adminProfileApi } from "./adminApi";
import AdminDashboard        from "./AdminDashboard";
import AdminUsers            from "./AdminUsers";
import AdminMemberships      from "./AdminMemberships";
import AdminInterests        from "./AdminInterests";
import AdminVerifications    from "./AdminVerifications";
import AdminReports          from "./AdminReports";
import AdminAnalytics        from "./AdminAnalytics";
import AdminSupport          from "./AdminSupport";
import AdminFeedback         from "./AdminFeedback";
import AdminSettings         from "./AdminSettings";
import AdminSuccessStories   from "./AdminSuccessStories";
import "./Admin.css";

/* ── Inline SVG icons ──────────────────────────────────────────── */
const IcoDashboard    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>;
const IcoUsers        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IcoVerify       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoHeart        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoSubscriptions= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IcoReports      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const IcoAnalytics    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IcoSupport      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoFeedback     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcoSettings     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const IcoLogout       = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcoMenu         = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IcoClose        = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IcoStory        = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoEdit         = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IcoSave         = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IcoKey          = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const IcoShield       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoActivity     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

function LogoMark() {
  return (
    <div className="ap-logo-mark">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="#fff" strokeWidth="0">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ADMIN PROFILE PAGE
══════════════════════════════════════════════════════════ */
function AdminProfilePage({ currentUser }) {
  const [section,  setSection]  = useState("view");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwErr,    setPwErr]    = useState("");

  const [form, setForm] = useState({
    fullName: currentUser?.fullName || "",
    email:    currentUser?.email    || "",
    phone:    currentUser?.mobile   || currentUser?.phone || "",
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const initials  = (form.fullName || "A").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const roleLabel = currentUser?.role === "superadmin" ? "Super Admin" : "Admin";

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      await adminProfileApi.update({ fullName: form.fullName, mobile: form.phone });
      setSaved(true);
      setTimeout(() => { setSaved(false); setSection("view"); }, 1300);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    setPwErr("");
    if (!pw.current)            return setPwErr("Enter your current password.");
    if (pw.next.length < 8)     return setPwErr("New password must be at least 8 characters.");
    if (pw.next !== pw.confirm) return setPwErr("Passwords do not match.");
    setPwSaving(true);
    try {
      await adminProfileApi.changePassword?.({ current: pw.current, next: pw.next });
      setPw({ current: "", next: "", confirm: "" });
      setSection("view");
      alert("Password updated successfully.");
    } catch (err) {
      setPwErr(err.message || "Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  };

  const STATS = [
    { label: "Users Verified",     value: "—", icon: "✅", color: "#dcfce7", text: "#15803d" },
    { label: "Interests Reviewed", value: "—", icon: "💌", color: "#dbeafe", text: "#1d4ed8" },
    { label: "Reports Generated",  value: "—", icon: "📋", color: "#fef3c7", text: "#b45309" },
    { label: "Days Active",        value: "—", icon: "📅", color: "#ede9fe", text: "#7c3aed" },
  ];

  const sectionTitle = {
    "edit-info":       "Edit Personal Info",
    "change-password": "Change Password",
    "security":        "Security Settings",
    "activity":        "Activity Log",
  };

  const btnBack = {
    background: "#f3f4f6", color: "#374151",
    border: "1px solid #e5e7eb", display: "flex",
    alignItems: "center", gap: 6,
  };

  return (
    <div className="adp-wrap">
      <div className="adp-hero">
        <div className="adp-hero-left">
          <div className="adp-avatar-ring">
            <div className="adp-avatar">{initials}</div>
            <span className="adp-online-dot" title="Online" />
          </div>
          <div className="adp-hero-info">
            <h2 className="adp-hero-name">{form.fullName}</h2>
            <div className="adp-hero-meta">
              <span className="ap-badge ap-badge-superadmin">⭐ {roleLabel}</span>
            </div>
            <div className="adp-hero-contacts">
              <span className="adp-contact-chip">✉ {form.email}</span>
              {form.phone && <span className="adp-contact-chip">📞 {form.phone}</span>}
            </div>
          </div>
        </div>
        <div className="adp-hero-actions">
          {section === "view"
            ? <button className="ap-btn-red" style={{ display: "flex", alignItems: "center", gap: 7 }} onClick={() => setSection("edit-info")}><IcoEdit /> Edit Profile</button>
            : <button className="ap-action-btn" style={btnBack} onClick={() => { setPwErr(""); setSection("view"); }}>← Back to Profile</button>
          }
        </div>
      </div>

      {section !== "view" && (
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
          <span style={{ color: "#e11d48", cursor: "pointer", fontWeight: 500 }} onClick={() => { setPwErr(""); setSection("view"); }}>My Profile</span>
          <IcoChevronRight />
          <span style={{ color: "#374151", fontWeight: 600 }}>{sectionTitle[section]}</span>
        </nav>
      )}

      <div className="adp-stats-row">
        {STATS.map((s) => (
          <div key={s.label} className="adp-stat-card" style={{ borderTop: `3px solid ${s.text}` }}>
            <div className="adp-stat-icon" style={{ background: s.color, color: s.text }}>{s.icon}</div>
            <div className="adp-stat-value" style={{ color: s.text }}>{s.value}</div>
            <div className="adp-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {section === "view" && (
        <div className="adp-grid">
          <div className="ap-detail-card">
            <div className="ap-detail-section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>👤 Personal Information</span>
              <button className="ap-action-btn" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 5, padding: "5px 12px" }} onClick={() => setSection("edit-info")}><IcoEdit /> Edit</button>
            </div>
            <div className="ap-detail-grid">
              {[
                { label: "Full Name", value: form.fullName },
                { label: "Email",     value: form.email    },
                { label: "Phone",     value: form.phone || "—" },
                { label: "Role",      value: roleLabel     },
                { label: "Status",    value: <span style={{ color: "#15803d", fontWeight: 600 }}>● Active</span> },
              ].map((f) => (
                <div key={f.label} className="ap-detail-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ap-detail-card">
            <div className="ap-detail-section-title">⚙️ Account Settings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
              {[
                { icon: <IcoKey />,      label: "Change Password",   sub: "Update your login credentials",  key: "change-password" },
                { icon: <IcoShield />,   label: "Security Settings", sub: "2FA, active sessions & alerts",  key: "security"        },
                { icon: <IcoActivity />, label: "Activity Log",      sub: "View your recent admin actions",  key: "activity"        },
              ].map((item) => (
                <button key={item.key} onClick={() => setSection(item.key)}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 14px", borderRadius: 10, border: "1px solid #f3f4f6", background: "#fafafa", cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s, border-color 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#fecdd3"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f3f4f6"; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "#fff1f2", color: "#e11d48", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <span style={{ color: "#d1d5db" }}><IcoChevronRight /></span>
                </button>
              ))}
            </div>

            <div className="ap-detail-section-title">🔐 Permissions & Access</div>
            <div className="adp-permissions">
              {[
                { label: "User Management",       desc: "View, edit, block users"     },
                { label: "Verification Approval", desc: "Review Aadhaar eKYC records" },
                { label: "Subscription Control",  desc: "Manage membership plans"     },
                { label: "Reports & Analytics",   desc: "Export data, view analytics" },
                { label: "Admin Panel Settings",  desc: "Change panel configuration"  },
                { label: "Super Admin Access",    desc: "Full unrestricted access"    },
              ].map((p) => (
                <div key={p.label} className="adp-perm-row">
                  <div className="adp-perm-check">✅</div>
                  <div>
                    <div className="adp-perm-label">{p.label}</div>
                    <div className="adp-perm-desc">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "edit-info" && (
        <div className="ap-detail-card" style={{ maxWidth: 560 }}>
          <div className="ap-detail-section-title">✏️ Edit Personal Information</div>
          <div className="adp-form-grid">
            <div className="adp-form-field">
              <label>Full Name</label>
              <input type="text" className="adp-input" value={form.fullName} placeholder="Enter full name" onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="adp-form-field">
              <label>Phone Number</label>
              <input type="tel" className="adp-input" value={form.phone} placeholder="+91 XXXXX XXXXX" onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="adp-form-field">
              <label>Email &nbsp;<span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>cannot be changed</span></label>
              <input className="adp-input" value={form.email} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
            </div>
            <div className="adp-form-field">
              <label>Role &nbsp;<span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>system assigned</span></label>
              <input className="adp-input" value={roleLabel} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button className="ap-btn-red" disabled={saving || saved} style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 140 }} onClick={handleSaveInfo}>
              {saved ? "✓ Saved!" : saving ? "Saving…" : <><IcoSave /> Save Changes</>}
            </button>
            <button className="ap-action-btn" style={btnBack} onClick={() => setSection("view")}>Cancel</button>
          </div>
        </div>
      )}

      {section === "change-password" && (
        <div className="ap-detail-card" style={{ maxWidth: 480 }}>
          <div className="ap-detail-section-title">🔑 Change Password</div>
          <div className="adp-form-grid">
            {[
              { label: "Current Password", key: "current", ph: "Enter current password" },
              { label: "New Password",     key: "next",    ph: "Minimum 8 characters"   },
              { label: "Confirm Password", key: "confirm", ph: "Re-enter new password"  },
            ].map((f) => (
              <div key={f.key} className="adp-form-field">
                <label>{f.label}</label>
                <input type="password" className="adp-input" placeholder={f.ph} value={pw[f.key]} onChange={(e) => { setPwErr(""); setPw((p) => ({ ...p, [f.key]: e.target.value })); }} />
              </div>
            ))}
            {pwErr && <div style={{ fontSize: 12, color: "#b91c1c", background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "9px 13px" }}>⚠️ {pwErr}</div>}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button className="ap-btn-red" disabled={pwSaving} style={{ display: "flex", alignItems: "center", gap: 7 }} onClick={handleSavePassword}>
              {pwSaving ? "Updating…" : <><IcoKey /> Update Password</>}
            </button>
            <button className="ap-action-btn" style={btnBack} onClick={() => { setPwErr(""); setPw({ current: "", next: "", confirm: "" }); setSection("view"); }}>Cancel</button>
          </div>
        </div>
      )}

      {section === "security" && (
        <div className="adp-grid">
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">🛡 Security Preferences</div>
            <div className="adp-security-rows">
              {[
                { label: "Two-Factor Authentication", desc: "Add an extra layer of security to your login", on: false },
                { label: "Login Notifications",       desc: "Receive an email alert on every new login",   on: true  },
                { label: "Session Timeout",           desc: "Auto logout after 30 minutes of inactivity",  on: true  },
              ].map((s) => (
                <div key={s.label} className="adp-security-row">
                  <div>
                    <div className="adp-perm-label">{s.label}</div>
                    <div className="adp-perm-desc">{s.desc}</div>
                  </div>
                  <div className={`adp-toggle${s.on ? " on" : ""}`}><div className="adp-toggle-thumb" /></div>
                </div>
              ))}
            </div>
          </div>
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">💻 Active Sessions</div>
            <div className="adp-session-info" style={{ marginTop: 0 }}>
              {[
                { device: "Chrome — Windows 11", loc: "Pune, Maharashtra", time: "Now",         current: true  },
                { device: "Mobile — Android",    loc: "Mumbai, MH",        time: "2 hours ago", current: false },
              ].map((s) => (
                <div key={s.device} className="adp-session-row">
                  <div className="adp-session-device">
                    {s.current ? "💻" : "📱"} {s.device}
                    {s.current && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, background: "#dcfce7", color: "#15803d", borderRadius: 20, padding: "2px 8px" }}>Current</span>}
                  </div>
                  <div className="adp-session-meta">{s.loc} · {s.time}</div>
                  {!s.current && <button className="ap-action-btn ap-btn-danger" style={{ marginLeft: "auto", flexShrink: 0 }}>Revoke</button>}
                </div>
              ))}
            </div>
            <button className="ap-action-btn ap-btn-danger" style={{ width: "100%", justifyContent: "center", padding: 10, marginTop: 14 }}>🚫 Revoke All Other Sessions</button>
          </div>
        </div>
      )}

      {section === "activity" && (
        <div className="ap-detail-card">
          <div className="ap-detail-section-title">📋 Recent Activity</div>
          <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>📭</div>
            Activity log coming soon.
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   ADMIN LAYOUT
════════════════════════════════════════ */
export default function AdminLayout({ activeTab, onTabChange, onBack }) {
  const [tab,           setTab]           = useState(activeTab || "dashboard");
  const [prevTab,       setPrevTab]       = useState(null);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [sidebarCounts, setSidebarCounts] = useState({ totalUsers: 0, openTickets: 0 });

  // ── Use AdminContext, NOT AuthContext ──────────────────────────────────
  const { adminUser, adminLogout } = useAdmin();

  useEffect(() => {
    sidebarApi.getCounts()
      .then((res) => setSidebarCounts({ totalUsers: res.totalUsers || 0, openTickets: res.openTickets || 0 }))
      .catch(() => {});
  }, []);

  // ── Guard: if adminUser is null, show access denied ───────────────────
  if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 16 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Access Denied</div>
        <div style={{ fontSize: 14, color: "#9ca3af" }}>You don't have permission to view this page.</div>
        <button onClick={onBack} style={{ marginTop: 8, padding: "10px 24px", background: "#e11d48", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Go Back</button>
      </div>
    );
  }

  const isSuperAdmin = adminUser.role === "superadmin";
  const currentUser  = { fullName: adminUser.fullName, role: adminUser.role, email: adminUser.email, mobile: adminUser.mobile || "", phone: adminUser.phone || "" };
  const today        = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const changeTab = (key) => {
    setPrevTab((prev) => (prev !== key ? tab : prev));
    setTab(key);
    setSidebarOpen(false);
    if (onTabChange) onTabChange(key);
  };

  const handleAvatarClick = () => {
    if (tab === "adminprofile") {
      changeTab(prevTab && prevTab !== "adminprofile" ? prevTab : "dashboard");
    } else {
      changeTab("adminprofile");
    }
  };

  // ── Real logout: calls /auth/logout, clears cookie + admin state ──────
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out of the admin panel?")) return;
    await adminLogout();   // clears httpOnly cookie + adminUser state
    onBack();              // navigate back to home / login
  };

  const TABS = [
    { key: "dashboard",      label: "Dashboard",           Icon: IcoDashboard,      badge: null },
    { key: "users",          label: "User Management",     Icon: IcoUsers,          badge: sidebarCounts.totalUsers > 0 ? sidebarCounts.totalUsers.toLocaleString("en-IN") : null },
    { key: "verifications",  label: "Verifications",       Icon: IcoVerify,         badge: null },
    { key: "interests",      label: "Interests & Matches", Icon: IcoHeart,          badge: null },
    { key: "memberships",    label: "Subscriptions",       Icon: IcoSubscriptions,  badge: null },
    { key: "reports",        label: "Reports",             Icon: IcoReports,        badge: null },
    { key: "analytics",      label: "Analytics",           Icon: IcoAnalytics,      badge: null },
    { key: "support",        label: "Support Tickets",     Icon: IcoSupport,        badge: sidebarCounts.openTickets > 0 ? sidebarCounts.openTickets.toString() : null, badgeRed: true },
    { key: "successstories", label: "Success Stories",     Icon: IcoStory,          badge: null },
    { key: "feedback",       label: "Feedback",            Icon: IcoFeedback,       badge: null },
    { key: "settings",       label: "Settings",            Icon: IcoSettings,       badge: null },
  ];

  const tabLabel    = TABS.find((t) => t.key === tab)?.label || (tab === "adminprofile" ? "My Profile" : "Dashboard");
  const isProfileOpen = tab === "adminprofile";

  const renderContent = () => {
    switch (tab) {
      case "dashboard":      return <AdminDashboard onTabChange={changeTab} />;
      case "users":          return <AdminUsers isSuperAdmin={isSuperAdmin} />;
      case "verifications":  return <AdminVerifications />;
      case "interests":      return <AdminInterests />;
      case "memberships":    return <AdminMemberships />;
      case "reports":        return <AdminReports />;
      case "analytics":      return <AdminAnalytics />;
      case "support":        return <AdminSupport />;
      case "successstories": return <AdminSuccessStories />;
      case "feedback":       return <AdminFeedback />;
      case "settings":       return <AdminSettings isSuperAdmin={isSuperAdmin} />;
      case "adminprofile":   return <AdminProfilePage currentUser={currentUser} />;
      default:               return <AdminDashboard onTabChange={changeTab} />;
    }
  };

  return (
    <div className="ap-root">
      <style>{`
        .ap-nav { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.14) transparent; }
        .ap-nav::-webkit-scrollbar { width: 3px; }
        .ap-nav::-webkit-scrollbar-track { background: transparent; }
        .ap-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.14); border-radius: 999px; }
        .ap-nav::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
      `}</style>

      <div className={`ap-overlay${sidebarOpen ? " open" : ""}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`ap-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="ap-sidebar-header">
          <div className="ap-sidebar-logo-row">
            <LogoMark />
            <div>
              <div className="ap-sidebar-logo-name">JeevanSaathiHub</div>
              <div className="ap-sidebar-logo-sub">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="ap-nav">
          {TABS.map((t) => (
            <button key={t.key} className={`ap-nav-btn${tab === t.key ? " active" : ""}`} onClick={() => changeTab(t.key)}>
              <span className="ap-nav-icon"><t.Icon /></span>
              <span className="ap-nav-label">{t.label}</span>
              {t.badge && <span className={`ap-nav-badge${t.badgeRed ? " red" : ""}`}>{t.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="ap-sidebar-footer">
          {/* ── Real logout button ── */}
          <button className="ap-footer-logout-btn" onClick={handleLogout}>
            <IcoLogout /><span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="ap-main">
        <div className="ap-topbar">
          <div className="ap-topbar-left">
            <button className="ap-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
              {sidebarOpen ? <IcoClose /> : <IcoMenu />}
            </button>
            {tab === "dashboard" ? (
              <div>
                <div className="ap-topbar-title">Dashboard</div>
                <div className="ap-topbar-subtitle">Welcome back, {currentUser.fullName}</div>
              </div>
            ) : (
              <div className="ap-topbar-title">{tabLabel}</div>
            )}
          </div>
          <div className="ap-topbar-right">
            {tab === "dashboard" && (
              <div className="ap-topbar-date">
                <div className="ap-topbar-date-label">Today</div>
                <div className="ap-topbar-date-value">{today}</div>
              </div>
            )}
            <button
              className="ap-topbar-avatar"
              title={isProfileOpen ? "Close Profile" : "My Profile"}
              onClick={handleAvatarClick}
              style={{ cursor: "pointer", outline: "none", border: isProfileOpen ? "2.5px solid #e11d48" : "2.5px solid transparent", transition: "border-color 0.18s" }}
            >
              {currentUser.fullName.charAt(0).toUpperCase()}
            </button>
          </div>
        </div>
        <div className="ap-content">{renderContent()}</div>
      </main>
    </div>
  );
}
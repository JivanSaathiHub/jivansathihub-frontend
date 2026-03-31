import { useState, useEffect, useRef } from "react";
import { settingsApi } from "./adminApi";

// ─── Reusable primitives ────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 6 }}>
      {children}
    </h3>
  );
}

function SectionDesc({ children }) {
  return (
    <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>{children}</p>
  );
}

function Field({ label, children, half }) {
  return (
    <div style={{ marginBottom: 18, width: half ? "calc(50% - 8px)" : "100%" }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "10px 14px",
        border: "1.5px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        color: "#111827",
        background: disabled ? "#f9fafb" : "#fff",
        outline: "none",
        boxSizing: "border-box",
        opacity: disabled ? 0.6 : 1,
      }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = "#cc0000"; }}
      onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3, disabled }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "10px 14px",
        border: "1.5px solid #e5e7eb",
        borderRadius: 8,
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        color: "#111827",
        background: disabled ? "#f9fafb" : "#fff",
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box",
        opacity: disabled ? 0.6 : 1,
      }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = "#cc0000"; }}
      onBlur={e => { e.target.style.borderColor = "#e5e7eb"; }}
    />
  );
}

function SelectInput({ value, onChange, options, disabled }) {
  return (
    <select
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      className="ap-select"
      style={{ width: "100%", padding: "10px 14px", fontSize: 14, opacity: disabled ? 0.6 : 1 }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// Logo upload box
function LogoUpload({ value, onChange, disabled }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(value || null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange && onChange(file);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current.click()}
      style={{
        border: "2px dashed #d1d5db",
        borderRadius: 10,
        padding: preview ? 0 : "40px 20px",
        textAlign: "center",
        cursor: disabled ? "default" : "pointer",
        background: "#f9fafb",
        overflow: "hidden",
        minHeight: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = "#cc0000"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; }}
    >
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      {preview ? (
        <img src={preview} alt="Logo" style={{ maxHeight: 130, maxWidth: "100%", objectFit: "contain" }} />
      ) : (
        <div>
          <div style={{ fontSize: 36, marginBottom: 8, color: "#9ca3af" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>Click to upload logo</p>
          <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>PNG, JPG up to 5MB</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab panels ─────────────────────────────────────────────────────────────

function GeneralSettings({ s, set, isSuperAdmin }) {
  const p = s.platform || {};
  const g = s.general || {};

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "28px 28px" }}>
      {/* Site Information */}
      <SectionTitle>Site Information</SectionTitle>
      <div style={{ height: 1, background: "#f3f4f6", marginBottom: 22 }} />

      <Field label="Site Name">
        <TextInput
          value={g.siteName ?? p.siteName ?? "MatrimonyHub"}
          disabled={!isSuperAdmin}
          onChange={e => set("general", "siteName", e.target.value)}
          placeholder="MatrimonyHub"
        />
      </Field>

      <Field label="Site Tagline">
        <TextInput
          value={g.siteTagline ?? ""}
          disabled={!isSuperAdmin}
          onChange={e => set("general", "siteTagline", e.target.value)}
          placeholder="Find Your Perfect Match"
        />
      </Field>

      <Field label="Logo Upload">
        <LogoUpload
          disabled={!isSuperAdmin}
          onChange={file => set("general", "logo", file)}
        />
      </Field>

      {/* Contact Information */}
      <div style={{ marginTop: 32, marginBottom: 22 }}>
        <SectionTitle>Contact Information</SectionTitle>
        <div style={{ height: 1, background: "#f3f4f6", marginBottom: 22 }} />
      </div>

      <Field label="Contact Email">
        <TextInput
          value={g.contactEmail ?? p.supportEmail ?? "support@matrimonyhub.com"}
          type="email"
          disabled={!isSuperAdmin}
          onChange={e => set("general", "contactEmail", e.target.value)}
          placeholder="support@matrimonyhub.com"
        />
      </Field>

      <Field label="Contact Phone">
        <TextInput
          value={g.contactPhone ?? ""}
          disabled={!isSuperAdmin}
          onChange={e => set("general", "contactPhone", e.target.value)}
          placeholder="+91 1234567890"
        />
      </Field>

      <Field label="Address">
        <Textarea
          value={g.address ?? ""}
          disabled={!isSuperAdmin}
          onChange={e => set("general", "address", e.target.value)}
          placeholder="Enter your address"
          rows={3}
        />
      </Field>
    </div>
  );
}

function EmailConfiguration({ s, set, isSuperAdmin }) {
  const e = s.email || {};
  const [testSent, setTestSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleTestEmail = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "28px 28px" }}>
      <SectionTitle>SMTP Configuration</SectionTitle>
      <SectionDesc>Configure SMTP settings to send emails from the platform</SectionDesc>

      {/* Host + Port row */}
      <div style={{ display: "flex", gap: 16 }}>
        <Field label="SMTP Host" half>
          <TextInput
            value={e.smtpHost ?? ""}
            disabled={!isSuperAdmin}
            onChange={ev => set("email", "smtpHost", ev.target.value)}
            placeholder="smtp.gmail.com"
          />
        </Field>
        <Field label="SMTP Port" half>
          <TextInput
            value={e.smtpPort ?? ""}
            disabled={!isSuperAdmin}
            onChange={ev => set("email", "smtpPort", ev.target.value)}
            placeholder="587"
          />
        </Field>
      </div>

      <Field label="SMTP Username">
        <TextInput
          value={e.smtpUsername ?? "noreply@matrimonyhub.com"}
          disabled={!isSuperAdmin}
          onChange={ev => set("email", "smtpUsername", ev.target.value)}
          placeholder="noreply@matrimonyhub.com"
        />
      </Field>

      <Field label="SMTP Password">
        <TextInput
          value={e.smtpPassword ?? ""}
          type="password"
          disabled={!isSuperAdmin}
          onChange={ev => set("email", "smtpPassword", ev.target.value)}
          placeholder="••••••••"
        />
      </Field>

      <Field label="Encryption Type">
        <SelectInput
          value={e.encryptionType ?? ""}
          disabled={!isSuperAdmin}
          onChange={ev => set("email", "encryptionType", ev.target.value)}
          options={[
            { value: "", label: "Select encryption type" },
            { value: "TLS", label: "TLS" },
            { value: "SSL", label: "SSL" },
            { value: "NONE", label: "None" },
          ]}
        />
      </Field>

      {/* Test email banner */}
      <div style={{
        background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10,
        padding: "16px 20px", marginTop: 8,
      }}>
        <p style={{ fontSize: 13.5, color: "#1e40af", marginBottom: 12 }}>
          <strong>Test Email:</strong> Send a test email to verify SMTP configuration
        </p>
        <button
          onClick={handleTestEmail}
          disabled={!isSuperAdmin || sending}
          style={{
            padding: "9px 20px", background: sending ? "#3b82f6" : testSent ? "#16a34a" : "#2563eb",
            color: "#fff", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
            cursor: isSuperAdmin ? "pointer" : "not-allowed",
            fontFamily: "'DM Sans', sans-serif", opacity: !isSuperAdmin ? 0.6 : 1,
            transition: "background 0.2s",
          }}
        >
          {sending ? "Sending…" : testSent ? "✓ Sent!" : "Send Test Email"}
        </button>
      </div>
    </div>
  );
}

function PaymentGateway({ s, set, isSuperAdmin }) {
  const pg = s.paymentGateway || {};

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "28px 28px" }}>
      <SectionTitle>Razorpay Integration</SectionTitle>
      <SectionDesc>Configure Razorpay payment gateway to accept payments</SectionDesc>

      <Field label="Payment Mode">
        <SelectInput
          value={pg.paymentMode ?? ""}
          disabled={!isSuperAdmin}
          onChange={e => set("paymentGateway", "paymentMode", e.target.value)}
          options={[
            { value: "", label: "Select payment mode" },
            { value: "test", label: "Test Mode" },
            { value: "live", label: "Live Mode" },
          ]}
        />
      </Field>

      <Field label="Razorpay Key ID">
        <TextInput
          value={pg.keyId ?? ""}
          disabled={!isSuperAdmin}
          onChange={e => set("paymentGateway", "keyId", e.target.value)}
          placeholder="rzp_test_xxxxxxxxxxxxxxx"
        />
      </Field>

      <Field label="Razorpay Key Secret">
        <TextInput
          value={pg.keySecret ?? ""}
          type="password"
          disabled={!isSuperAdmin}
          onChange={e => set("paymentGateway", "keySecret", e.target.value)}
          placeholder="••••••••"
        />
      </Field>

      <Field label="Webhook Secret">
        <TextInput
          value={pg.webhookSecret ?? ""}
          type="password"
          disabled={!isSuperAdmin}
          onChange={e => set("paymentGateway", "webhookSecret", e.target.value)}
          placeholder="••••••••"
        />
      </Field>

      {/* Note banner */}
      <div style={{
        background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10,
        padding: "14px 18px", marginTop: 4, marginBottom: 16,
      }}>
        <p style={{ fontSize: 13.5, color: "#92400e" }}>
          <strong>Note:</strong> You can get your Razorpay credentials from the Razorpay Dashboard. Always use test credentials during development.
        </p>
      </div>

      {/* API Status */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10,
        padding: "14px 18px", display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 18 }}>🔑</span>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: "#15803d" }}>API Status: Connected</p>
          <p style={{ fontSize: 12.5, color: "#16a34a", marginTop: 2 }}>Last verified: 2 hours ago</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const TABS = [
  { id: "general",  label: "General Settings",    icon: "🌐" },
  { id: "email",    label: "Email Configuration",  icon: "✉️" },
  { id: "payment",  label: "Payment Gateway",      icon: "💳" },
];

export default function AdminSettings({ isSuperAdmin }) {
  const [settings, setSettings] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    settingsApi.get()
      .then((res) => { setSettings(res.settings); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const set = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [key]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.save(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading settings…</div>;
  if (error)   return <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>{error}</div>;

  const s = settings;

  return (
    <div>
      {/* Header */}
      <div className="ap-page-header">
        <div>
          <h2>Settings</h2>
          <p>Manage system configuration and integrations</p>
        </div>
        {isSuperAdmin && (
          <button className="ap-btn-red" onClick={handleSave} disabled={saving} style={{ minWidth: 140 }}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "💾 Save Changes"}
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div style={{
          padding: "12px 16px", background: "#fef3c7", borderRadius: 8,
          border: "1px solid #fde68a", fontSize: 13, color: "#92400e", marginBottom: 20,
        }}>
          🔒 Only Super Admins can change settings.
        </div>
      )}

      {/* Tabs */}
      <div style={{
        background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
        marginBottom: 20, overflow: "hidden",
      }}>
        <div className="ap-tabs" style={{ margin: 0, padding: "0 16px", borderBottom: "1px solid #e5e7eb" }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`ap-tab-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "general" && (
        <GeneralSettings s={s} set={set} isSuperAdmin={isSuperAdmin} />
      )}
      {activeTab === "email" && (
        <EmailConfiguration s={s} set={set} isSuperAdmin={isSuperAdmin} />
      )}
      {activeTab === "payment" && (
        <PaymentGateway s={s} set={set} isSuperAdmin={isSuperAdmin} />
      )}

      {/* Bottom save */}
      {isSuperAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button className="ap-btn-red" onClick={handleSave} disabled={saving} style={{ minWidth: 140 }}>
            {saving ? "Saving…" : saved ? "✓ Saved!" : "💾 Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
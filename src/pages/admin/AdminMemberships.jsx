import { useState, useEffect, useCallback } from "react";
import { plansApi } from "./adminApi";
import rupeeImg from "../../assets/Container.png";
/* ── Icons ─────────────────────────────────────────────────────────────────── */
const IcoRupee = () => (
  <img src={rupeeImg} width="23" height="23" alt="₹"
    style={{ display: "inline-block", verticalAlign: "middle" }} />
);

const IcoUsers = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoCheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IcoEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const IcoX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcoPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IcoXSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── Stat Card ──────────────────────────────────────────────────────────────── */
function StatCard({ icon, iconBg, iconColor, label, value }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
      padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flex: 1,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 12, flexShrink: 0,
        background: iconBg, color: iconColor,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}

/* ── Plan Modal (Add / Edit) ────────────────────────────────────────────────── */
function PlanModal({ mode, plan, onClose, onSave }) {
  const [form, setForm] = useState({
    name:     plan?.name     || "",
    price:    plan?.price    ?? 0,
    duration: plan?.duration || "",
    features: plan?.features?.length ? [...plan.features] : ["", ""],
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const setField = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const setFeature = (idx, val) => {
    const f = [...form.features];
    f[idx]  = val;
    setForm((p) => ({ ...p, features: f }));
  };
  const addFeature    = () => setForm((p) => ({ ...p, features: [...p.features, ""] }));
  const removeFeature = (idx) => setForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    if (!form.name.trim())     return setError("Plan name is required.");
    if (!form.duration.trim()) return setError("Duration is required.");
    setSaving(true);
    setError("");
    try {
      await onSave({
        name:     form.name.trim(),
        price:    Number(form.price),
        duration: form.duration.trim(),
        features: form.features.filter((f) => f.trim()),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 500,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      }} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #f3f4f6",
        }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
            {mode === "add" ? "Add New Plan" : "Edit Plan"}
          </span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#9ca3af", display: "flex", alignItems: "center", padding: 2,
          }}><IcoX /></button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>

          {error && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* Plan Name */}
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
              Plan Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="e.g., Silver"
              style={{
                width: "100%", padding: "10px 13px", border: "1.5px solid #e5e7eb",
                borderRadius: 8, fontSize: 14, fontFamily: "inherit",
                outline: "none", color: "#111827", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Price + Duration */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
                Price (₹)
              </label>
              <input
                type="number" min="0"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                placeholder="0"
                style={{
                  width: "100%", padding: "10px 13px", border: "1.5px solid #e5e7eb",
                  borderRadius: 8, fontSize: 14, fontFamily: "inherit",
                  outline: "none", color: "#111827", boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, display: "block", marginBottom: 6 }}>
                Duration
              </label>
              <input
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                placeholder="e.g., 3 Months"
                style={{
                  width: "100%", padding: "10px 13px", border: "1.5px solid #e5e7eb",
                  borderRadius: 8, fontSize: 14, fontFamily: "inherit",
                  outline: "none", color: "#111827", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, display: "block", marginBottom: 8 }}>
              Features
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.features.map((f, idx) => (
                <div key={idx} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={f}
                    onChange={(e) => setFeature(idx, e.target.value)}
                    placeholder="Enter feature"
                    style={{
                      flex: 1, padding: "10px 13px", border: "1.5px solid #e5e7eb",
                      borderRadius: 8, fontSize: 14, fontFamily: "inherit",
                      outline: "none", color: "#111827",
                    }}
                  />
                  <button onClick={() => removeFeature(idx)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#cc0000", display: "flex", alignItems: "center", flexShrink: 0,
                  }}><IcoXSmall /></button>
                </div>
              ))}
              <button onClick={addFeature} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#cc0000", fontSize: 13, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 0", fontFamily: "inherit",
              }}>
                <IcoPlus /> Add Feature
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 24px", borderTop: "1px solid #f3f4f6",
          display: "flex", gap: 10,
        }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", background: "#f3f4f6",
            border: "none", borderRadius: 8, fontSize: 14,
            fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 1, padding: "11px",
            background: mode === "add" ? "#cc0000" : "#2563eb",
            border: "none", borderRadius: 8, fontSize: 14,
            fontWeight: 600, color: "#fff", cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1, fontFamily: "inherit",
          }}>
            {saving ? "Saving…" : mode === "add" ? "Add Plan" : "Update Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Plan Card ──────────────────────────────────────────────────────────────── */
function PlanCard({ plan, onEdit, onToggle, onDelete, actionId }) {
  const busy      = actionId === plan._id;
  const isFree    = plan.price === 0;
  const isGold    = plan.name.toLowerCase() === "gold";
  const isPremium = plan.name.toLowerCase() === "premium";

  /* Card accent colours */
  const accent = isFree
    ? { bg: "#f9fafb",   border: "#e5e7eb", titleColor: "#111827" }
    : isGold
    ? { bg: "#fffbeb",   border: "#fde68a", titleColor: "#111827" }
    : isPremium
    ? { bg: "#faf5ff",   border: "#e9d5ff", titleColor: "#111827" }
    : { bg: "#eff6ff",   border: "#bfdbfe", titleColor: "#111827" };

  return (
    <div style={{
      background: accent.bg,
      border: `1px solid ${accent.border}`,
      borderRadius: 16, display: "flex", flexDirection: "column",
      overflow: "hidden", opacity: busy ? 0.6 : 1,
    }}>
      {/* Top section */}
      <div style={{ padding: "22px 22px 18px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: accent.titleColor }}>{plan.name}</div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
            background: plan.isActive ? "#dcfce7" : "#fee2e2",
            color:      plan.isActive ? "#15803d" : "#b91c1c",
          }}>
            {plan.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>
            ₹{plan.price.toLocaleString("en-IN")}
          </span>
          {plan.duration && plan.duration !== "Forever" && (
            <span style={{ fontSize: 14, color: "#6b7280" }}>/{plan.duration}</span>
          )}
        </div>

        {/* Subscriber count */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          {(plan.subscriberCount || 0).toLocaleString("en-IN")} subscribers
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: accent.border, margin: "0 22px" }} />

      {/* Features */}
      <div style={{ padding: "16px 22px 20px", flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Features:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(plan.features || []).map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13.5, color: "#374151" }}>
              <span style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }}><IcoCheck /></span>
              {f}
            </div>
          ))}
          {(!plan.features || plan.features.length === 0) && (
            <div style={{ fontSize: 13, color: "#9ca3af" }}>No features listed</div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        padding: "14px 22px 18px",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        {/* Edit */}
        <button onClick={() => onEdit(plan)} disabled={busy} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", background: "#2563eb", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: busy ? "not-allowed" : "pointer", fontFamily: "inherit",
        }}>
          <IcoEdit /> Edit
        </button>

        {/* Deactivate / Activate */}
        <button onClick={() => onToggle(plan)} disabled={busy} style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px",
          background: plan.isActive ? "#f97316" : "#16a34a",
          color: "#fff",
          border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: busy ? "not-allowed" : "pointer", fontFamily: "inherit",
        }}>
          {busy ? "…" : plan.isActive ? "Deactivate" : "Activate"}
        </button>

        {/* Delete */}
        <button onClick={() => onDelete(plan)} disabled={busy} style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 36, height: 36, background: "#fee2e2", color: "#cc0000",
          border: "none", borderRadius: 8, cursor: busy ? "not-allowed" : "pointer",
          flexShrink: 0,
        }}>
          <IcoTrash />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export default function AdminMemberships() {
  const [plans,    setPlans]    = useState([]);
  const [stats,    setStats]    = useState({ totalPlans: 0, totalSubscribers: 0, activePlans: 0 });
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [modal,    setModal]    = useState(null); // null | { mode: "add" } | { mode: "edit", plan }
  const [actionId, setActionId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await plansApi.getAll();
      setPlans(res.plans   || []);
      setStats(res.stats   || { totalPlans: 0, totalSubscribers: 0, activePlans: 0 });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (data) => {
    await plansApi.create(data);
    load();
  };

  const handleEdit = async (data) => {
    await plansApi.update(modal.plan._id, data);
    load();
  };

  const handleToggle = async (plan) => {
    if (!window.confirm(`${plan.isActive ? "Deactivate" : "Activate"} the "${plan.name}" plan?`)) return;
    setActionId(plan._id);
    try {
      await plansApi.toggle(plan._id);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Delete the "${plan.name}" plan? This cannot be undone.`)) return;
    setActionId(plan._id);
    try {
      await plansApi.delete(plan._id);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="ap-page-header">
        <div>
          <h2>Membership Plans</h2>
          <p>Manage subscription plans and pricing</p>
        </div>
        <button className="ap-btn-red" onClick={() => setModal({ mode: "add" })}>
          + Add New Plan
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatCard
          icon={<IcoRupee />}
          iconBg="#eff6ff" iconColor="#2563eb"
          label="Total Plans"
          value={stats.totalPlans}
        />
        <StatCard
          icon={<IcoUsers />}
          iconBg="#f5f3ff" iconColor="#7c3aed"
          label="Total Subscribers"
          value={(stats.totalSubscribers || 0).toLocaleString("en-IN")}
        />
        <StatCard
          icon={<IcoCheckCircle />}
          iconBg="#dcfce7" iconColor="#15803d"
          label="Active Plans"
          value={stats.activePlans}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontSize: 14 }}>
          Loading plans…
        </div>
      )}

      {/* Empty */}
      {!loading && !error && plans.length === 0 && (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>No plans yet</div>
          <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>Create your first membership plan</div>
          <button className="ap-btn-red" onClick={() => setModal({ mode: "add" })}>+ Add New Plan</button>
        </div>
      )}

      {/* Plan cards grid */}
      {!loading && plans.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20,
        }}>
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              actionId={actionId}
              onEdit={(p) => setModal({ mode: "edit", plan: p })}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <PlanModal
          mode={modal.mode}
          plan={modal.plan || null}
          onClose={() => setModal(null)}
          onSave={modal.mode === "add" ? handleAdd : handleEdit}
        />
      )}
    </div>
  );
}
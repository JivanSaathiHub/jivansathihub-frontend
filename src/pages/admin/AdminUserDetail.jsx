import { useState, useEffect } from "react";
import { usersApi, membershipsApi } from "./adminApi";
import { Ico } from "./icons";
import { Badge, Avatar } from "./shared";

const PLAN_FEATURES = {
  premium: ["Unlimited Profile Views","Unlimited Interests","Direct Messaging","Priority Support","Advanced Search Filters","Profile Highlighting"],
  elite:   ["Unlimited Profile Views","Unlimited Interests","Direct Messaging","Priority Support","Advanced Search Filters","Profile Highlighting","Featured Listing","Dedicated Relationship Manager"],
  free:    [],
};

/* ── Subscription tab ── */
function SubscriptionTab({ user, onUpgrade, onCancel, isSuperAdmin, loading }) {
  const m         = user.membership || {};
  const planLabel = (m.plan || "free").charAt(0).toUpperCase() + (m.plan || "free").slice(1);
  const features  = PLAN_FEATURES[m.plan] || [];

  return (
    <div>
      <div className="ap-detail-section-title">Current Subscription</div>
      <div className="ap-sub-plan-card">
        <div>
          <div className="ap-sub-plan-title">{planLabel} Plan</div>
          <div className="ap-sub-plan-status">
            {m.isActive ? "Active subscription" : "No active subscription"}
          </div>
          {m.startDate && (
            <div className="ap-sub-plan-dates">
              <div className="ap-sub-plan-date"><label>Start Date</label><p>{m.startDate}</p></div>
              <div className="ap-sub-plan-date"><label>End Date</label><p>{m.endDate || "—"}</p></div>
            </div>
          )}
        </div>
        <div className="ap-sub-plan-icon">{Ico.creditCard}</div>
      </div>

      {features.length > 0 && (
        <>
          <div className="ap-sub-features-title">Subscription Features</div>
          <div className="ap-sub-features-grid">
            {features.map((f) => (
              <div className="ap-sub-feature" key={f}>
                <span className="ap-sub-feature-icon">{Ico.check}</span>{f}
              </div>
            ))}
          </div>
        </>
      )}

      {user.paymentHistory?.length > 0 && (
        <>
          <div className="ap-sub-history-title">Payment History</div>
          <div className="ap-detail-card" style={{ padding: "0 22px" }}>
            {user.paymentHistory.map((p, i) => (
              <div className="ap-sub-history-row" key={i}>
                <div>
                  <div className="ap-sub-history-name">{p.label}</div>
                  <div className="ap-sub-history-date">{p.date}</div>
                </div>
                <div className="ap-sub-history-amount">{p.amount}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {isSuperAdmin && (
        <div className="ap-detail-card" style={{ marginTop: 16 }}>
          <div className="ap-detail-section-title">Admin Actions</div>
          <div className="ap-actions">
            <button className="ap-action-btn ap-btn-blue" onClick={onUpgrade} disabled={loading}>
              {loading ? "…" : "Upgrade Plan"}
            </button>
            {m.isActive && (
              <button className="ap-action-btn ap-btn-warn" onClick={onCancel} disabled={loading}>
                {loading ? "…" : "Cancel Membership"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ADMIN USER DETAIL
   Props:
     userId    — MongoDB _id string  (AdminUsers passes this)
     onBack    — callback
     isSuperAdmin — boolean
═══════════════════════════════════════════════════════ */
export default function AdminUserDetail({ userId, onBack, isSuperAdmin }) {
  const [user,          setUser]          = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error,         setError]         = useState("");
  const [tab,           setTab]           = useState("overview");

  /* ── Load user ── */
  useEffect(() => {
    setLoading(true);
    usersApi.getById(userId)
      .then((res) => { setUser(res.user); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  /* ── Loading / error ── */
  if (loading) {
    return (
      <div className="ap-detail-wrap">
        <button className="ap-back-btn" onClick={onBack}>{Ico.arrowLeft}</button>
        <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>Loading user details…</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="ap-detail-wrap">
        <button className="ap-back-btn" onClick={onBack}>{Ico.arrowLeft}</button>
        <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>{error || "User not found."}</div>
      </div>
    );
  }

  /* ── Actions ── */
  const handleToggleBlock = async () => {
    const action = user.isActive ? "Deactivate" : "Activate";
    if (!window.confirm(`${action} ${user.fullName}?`)) return;
    setActionLoading(true);
    try {
      if (user.isActive) {
        await usersApi.block(user._id);
        setUser((u) => ({ ...u, isActive: false }));
      } else {
        await usersApi.unblock(user._id);
        setUser((u) => ({ ...u, isActive: true }));
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete ${user.fullName}? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      await usersApi.delete(user._id);
      onBack();
    } catch (err) {
      alert(`Error: ${err.message}`);
      setActionLoading(false);
    }
  };

  const handleUpgrade = async () => {
    const plan = window.prompt(`Upgrade ${user.fullName} to which plan?\nType: premium or elite`);
    if (!plan || !["premium", "elite"].includes(plan.toLowerCase())) return;
    const days = window.prompt(`Duration in days? (leave blank for default: premium=180, elite=365)`);
    setActionLoading(true);
    try {
      const res = await membershipsApi.upgrade(user._id, plan.toLowerCase(), days ? Number(days) : undefined);
      alert(res.message);
      /* Refresh user to get updated membership */
      const fresh = await usersApi.getById(user._id);
      setUser(fresh.user);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelMembership = async () => {
    if (!window.confirm(`Cancel ${user.fullName}'s membership?`)) return;
    setActionLoading(true);
    try {
      await membershipsApi.cancel(user._id);
      setUser((u) => ({ ...u, membership: { ...u.membership, isActive: false } }));
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { key: "overview",     label: "Overview",        icon: Ico.users     },
    { key: "profile",      label: "Profile Details", icon: Ico.doc       },
    { key: "subscription", label: "Subscription",    icon: Ico.creditCard },
  ];

  return (
    <div className="ap-detail-wrap">
      {/* Header */}
      <div className="ap-detail-header">
        <div className="ap-detail-header-left">
          <button className="ap-back-btn" onClick={onBack}>{Ico.arrowLeft}</button>
          <div className="ap-detail-title-group">
            <h2>User Details</h2>
            <p>View and manage user information</p>
          </div>
        </div>
        <div className="ap-detail-header-btns">
          <button
            className="ap-btn-red"
            style={{ background: user.isActive ? "#cc0000" : "#16a34a" }}
            onClick={handleToggleBlock}
            disabled={actionLoading}
          >
            {Ico.users} {actionLoading ? "…" : user.isActive ? "Deactivate" : "Activate"}
          </button>
          {isSuperAdmin && (
            <button
              className="ap-btn-red"
              style={{ background: "#b91c1c" }}
              onClick={handleDelete}
              disabled={actionLoading}
            >
              🗑 Delete User
            </button>
          )}
        </div>
      </div>

      {/* Profile summary card */}
      <div className="ap-detail-profile-card">
        <div className="ap-profile-top">
          <div className={`ap-profile-avatar ${user.gender === "Female" ? "ap-avatar-f" : "ap-avatar-m"}`}>
            {user.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="ap-profile-info">
            <div className="ap-profile-name">{user.fullName}</div>
            <div className="ap-profile-uid">User ID: #{String(user._id).slice(-6).toUpperCase()}</div>
            <div className="ap-profile-contacts">
              <span className="ap-profile-contact">{Ico.mail} {user.email}</span>
              <span className="ap-profile-contact">{Ico.phone} {user.mobile}</span>
              <span className="ap-profile-contact">{Ico.location} {user.city}, {user.state}</span>
              <span className="ap-profile-contact">{Ico.calendar} Joined {user.joinedDate}</span>
            </div>
          </div>
          <div className="ap-profile-badges">
            {user.isVerified && <Badge type="verified" label="✓ Verified" />}
            <Badge type={user.isActive ? "active" : "blocked"} label={user.isActive ? "Active" : "Blocked"} />
            <Badge
              type={user.membership?.plan || "free"}
              label={(user.membership?.plan || "Free").charAt(0).toUpperCase() + (user.membership?.plan || "free").slice(1)}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="ap-profile-stats">
          <div className="ap-profile-stat">
            <div className="ap-profile-stat-icon">{Ico.eye}</div>
            <div className="ap-profile-stat-label">Profile Views</div>
            <div className="ap-profile-stat-value">{user.profileViews}</div>
          </div>
          <div className="ap-profile-stat">
            <div className="ap-profile-stat-icon">{Ico.heart}</div>
            <div className="ap-profile-stat-label">Interests</div>
            <div className="ap-profile-stat-value">{user.interests}</div>
          </div>
          <div className="ap-profile-stat">
            <div className="ap-profile-stat-icon">{Ico.clock}</div>
            <div className="ap-profile-stat-label">Last Active</div>
            <div className="ap-profile-stat-value" style={{ fontSize: 15, paddingTop: 4 }}>{user.lastActive}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ap-tabs">
        {tabs.map((t) => (
          <button key={t.key} className={`ap-tab-btn${tab === t.key ? " active" : ""}`} onClick={() => setTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <>
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">Basic Information</div>
            <div className="ap-detail-grid">
              <div className="ap-detail-field"><label>Age</label><p>{user.age} years</p></div>
              <div className="ap-detail-field"><label>Gender</label><p>{user.gender}</p></div>
              <div className="ap-detail-field"><label>Height</label><p>{user.height || "—"}</p></div>
              <div className="ap-detail-field"><label>Marital Status</label><p>{user.maritalStatus || "—"}</p></div>
              <div className="ap-detail-field"><label>Religion</label><p>{user.religion || "—"}</p></div>
              <div className="ap-detail-field"><label>Mother Tongue</label><p>{user.motherTongue || "—"}</p></div>
            </div>
          </div>
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">Verification Status</div>
            <div className="ap-detail-grid">
              <div className="ap-detail-field">
                <label>Verification Method</label>
                <p style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: user.isVerified ? "#16a34a" : "#9ca3af", display: "inline-block" }} />
                  {user.verificationMethod}
                </p>
              </div>
              <div className="ap-detail-field"><label>Verified On</label><p>{user.verifiedOn}</p></div>
            </div>
          </div>
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">About</div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{user.about || "—"}</p>
          </div>
        </>
      )}

      {/* Profile Details */}
      {tab === "profile" && (
        <>
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">💼 Professional Details</div>
            <div className="ap-detail-grid">
              <div className="ap-detail-field"><label>Education</label><p>{user.education || "—"}</p></div>
              <div className="ap-detail-field"><label>Occupation</label><p>{user.occupation || "—"}</p></div>
              <div className="ap-detail-field"><label>Company</label><p>{user.company || "—"}</p></div>
              <div className="ap-detail-field"><label>Annual Income</label><p>{user.annualIncome || "—"}</p></div>
            </div>
          </div>
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">👪 Family Details</div>
            <div className="ap-detail-grid">
              <div className="ap-detail-field"><label>Family Type</label><p>{user.familyType || "—"}</p></div>
              <div className="ap-detail-field"><label>Father's Occupation</label><p>{user.fathersOccupation || "—"}</p></div>
              <div className="ap-detail-field"><label>Mother's Occupation</label><p>{user.mothersOccupation || "—"}</p></div>
              <div className="ap-detail-field"><label>Siblings</label><p>{user.siblings || "—"}</p></div>
            </div>
          </div>
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">Contact Details</div>
            <div className="ap-detail-grid">
              <div className="ap-detail-field"><label>Email</label><p>{user.email}</p></div>
              <div className="ap-detail-field"><label>Phone</label><p>{user.mobile}</p></div>
              <div className="ap-detail-field"><label>Location</label><p>{user.city}, {user.state}</p></div>
            </div>
          </div>
        </>
      )}

      {/* Subscription */}
      {tab === "subscription" && (
        <SubscriptionTab
          user={user}
          isSuperAdmin={isSuperAdmin}
          loading={actionLoading}
          onUpgrade={handleUpgrade}
          onCancel={handleCancelMembership}
        />
      )}
    </div>
  );
}
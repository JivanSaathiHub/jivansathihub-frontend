import { useState, useEffect, useCallback } from "react";
import { interestsApi } from "./adminApi";
import { Ico } from "./icons";
import { Badge, Avatar, Pagination } from "./shared";

const LIMIT = 10;

/* ── Match score bar ─────────────────────────────────────────────────────── */
function MatchBar({ score }) {
  return (
    <div className="ap-match-bar-wrap">
      <div className="ap-match-bar">
        <div className="ap-match-bar-fill" style={{ width: `${score}%` }} />
      </div>
      <span className="ap-match-score-pct">{score}%</span>
    </div>
  );
}

/* ── User avatar circle ──────────────────────────────────────────────────── */
function UserCircle({ user, size = 80 }) {
  const initials = (user?.fullName || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const isFemale = user?.gender === "Female";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: isFemale ? "#fce7f3" : "#dbeafe",
      color: isFemale ? "#be185d" : "#1d4ed8",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 600, flexShrink: 0,
      border: `3px solid ${isFemale ? "#f9a8d4" : "#93c5fd"}`,
      overflow: "hidden",
    }}>
      {user?.photo
        ? <img src={user.photo} alt={user.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : initials
      }
    </div>
  );
}

/* ── Compatibility score box ─────────────────────────────────────────────── */
function CompatBox({ label, score, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 100, padding: "14px 16px", borderRadius: 10,
      background: `${color}15`, border: `1px solid ${color}30`,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{score}%</div>
      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{label}</div>
    </div>
  );
}

/* ── Stat row item ───────────────────────────────────────────────────────── */
function StatRow({ icon, label, value }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", background: "#f9fafb", borderRadius: 8, marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#374151", fontSize: 14 }}>
        <span style={{ fontSize: 16 }}>{icon}</span> {label}
      </div>
      <div style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}>{value}</div>
    </div>
  );
}

/* ── Profile comparison card ─────────────────────────────────────────────── */
function ProfileCard({ user, role, onViewProfile }) {
  const fields = [
    { label: "Occupation",     value: user?.occupation   || "—" },
    { label: "Education",      value: user?.education    || "—" },
    { label: "Location",       value: user?.location     || "—" },
    { label: "Annual Income",  value: user?.annualIncome || "—" },
    { label: "Height",         value: user?.height       || "—", half: true },
    { label: "Religion",       value: user?.religion     || "—", half: true },
    { label: "Mother Tongue",  value: user?.motherTongue || "—", half: true },
    { label: "Marital Status", value: user?.maritalStatus|| "—", half: true },
  ];

  const halves = fields.filter((f) => f.half);
  const fulls  = fields.filter((f) => !f.half);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="ap-detail-card" style={{ marginBottom: 0 }}>
        {/* Profile header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
          <UserCircle user={user} size={52} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{user?.fullName}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{user?.age} years</div>
          </div>
        </div>

        {/* Full-width fields */}
        {fulls.map((f) => (
          <div key={f.label} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#9ca3af", marginBottom: 4 }}>
              <span>🏢</span> {f.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{f.value}</div>
          </div>
        ))}

        {/* Half-width grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 20 }}>
          {halves.map((f) => (
            <div key={f.label}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>{f.label}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* View Full Profile button */}
        <button
          onClick={() => onViewProfile && onViewProfile(user?._id)}
          style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "none",
            background: "#cc0000", color: "#fff", fontWeight: 600, fontSize: 14,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          👁 View Full Profile
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INTEREST DETAIL PAGE
   Matches Image 2 (Profile Comparison) and Image 3 (Overview)
════════════════════════════════════════════════════════════════════════════ */
function InterestDetail({ interestId, onBack }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("overview");

  useEffect(() => {
    setLoading(true);
    interestsApi.getById(interestId)
      .then((res) => { setData(res.interest); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [interestId]);

  if (loading) {
    return (
      <div className="ap-detail-wrap">
        <button className="ap-back-btn" onClick={onBack}>{Ico.arrowLeft} Back to Interests</button>
        <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>Loading interest details…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="ap-detail-wrap">
        <button className="ap-back-btn" onClick={onBack}>{Ico.arrowLeft} Back to Interests</button>
        <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>{error || "Interest not found."}</div>
      </div>
    );
  }

  const statusColor = data.status === "accepted" ? "#16a34a" : data.status === "declined" ? "#b91c1c" : "#d97706";
  const statusBg    = data.status === "accepted" ? "#dcfce7" : data.status === "declined" ? "#fee2e2" : "#fef3c7";

  return (
    <div className="ap-detail-wrap">
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button className="ap-back-btn" onClick={onBack}>{Ico.arrowLeft} Back to Interests</button>
      </div>

      {/* ── Title row ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>Interest Details</h2>
          <span style={{
            background: statusBg, color: statusColor, fontSize: 12, fontWeight: 600,
            padding: "3px 10px", borderRadius: 20, border: `1px solid ${statusColor}40`,
          }}>
            ✓ {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#6b7280" }}>
          <span>Interest ID: {data.interestId}</span>
          <span>•</span>
          <span>📅 Sent on {data.sentAt}</span>
          <span>•</span>
          <span>↗ {data.matchScore}% Match</span>
        </div>
      </div>

      {/* ── Sender ↔ Receiver card ── */}
      <div style={{
        background: "linear-gradient(135deg, #fff5f5 0%, #fff 50%, #f0fdf4 100%)",
        border: "1px solid #fecaca", borderRadius: 16, padding: 28, marginBottom: 24,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        {/* Sender */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <UserCircle user={data.sender} size={80} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{data.sender?.fullName}</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
            {data.sender?.age} years, {data.sender?.city}, {data.sender?.state}
          </div>
          <button style={{ background: "none", border: "none", color: "#cc0000", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            👁 View Profile
          </button>
          <div style={{ marginTop: 8 }}>
            <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>
              Sender
            </span>
          </div>
        </div>

        {/* Center heart */}
        <div style={{ textAlign: "center", minWidth: 120 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%", background: "#fff",
            boxShadow: "0 4px 16px rgba(204,0,0,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, margin: "0 auto 8px",
          }}>
            ❤️
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
            {data.status === "accepted" ? "Interest Accepted" : data.status === "declined" ? "Interest Declined" : "Interest Pending"}
          </div>
          {data.responseTime && (
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
              Response time: {data.responseTime}
            </div>
          )}
        </div>

        {/* Receiver */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <UserCircle user={data.receiver} size={80} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{data.receiver?.fullName}</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
            {data.receiver?.age} years, {data.receiver?.city}, {data.receiver?.state}
          </div>
          <button style={{ background: "none", border: "none", color: "#7c3aed", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            👁 View Profile
          </button>
          <div style={{ marginTop: 8 }}>
            <span style={{ background: "#ede9fe", color: "#7c3aed", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>
              Receiver
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="ap-tabs" style={{ marginBottom: 20 }}>
        {["overview", "comparison"].map((t) => (
          <button key={t} className={`ap-tab-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {t === "overview" ? "Overview" : "Profile Comparison"}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════
          OVERVIEW TAB — Image 3
      ════════════════════════════════════ */}
      {tab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Compatibility Analysis */}
          <div className="ap-detail-card">
            <div className="ap-detail-section-title">
              <span style={{ marginRight: 8 }}>⭐</span> Compatibility Analysis
            </div>

            {/* Overall bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 14, color: "#374151" }}>Overall Match Score</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#cc0000" }}>{data.compatibility.overall}%</div>
              </div>
              <div style={{ height: 10, background: "#f3f4f6", borderRadius: 5, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 5,
                  width: `${data.compatibility.overall}%`,
                  background: "linear-gradient(90deg, #cc0000, #ff6b6b)",
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>

            {/* 4 breakdown boxes */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <CompatBox label="Lifestyle"  score={data.compatibility.lifestyle}  color="#3b82f6" />
              <CompatBox label="Background" score={data.compatibility.background} color="#16a34a" />
              <CompatBox label="Education"  score={data.compatibility.education}  color="#374151" />
              <CompatBox label="Values"     score={data.compatibility.values}     color="#ec4899" />
            </div>
          </div>

          {/* Interest Message */}
          {data.message && (
            <div className="ap-detail-card">
              <div className="ap-detail-section-title">
                <span style={{ marginRight: 8 }}>💬</span> Interest Message
              </div>
              <div style={{
                background: "#f9fafb", borderRadius: 10, padding: "16px 18px",
                fontSize: 14, color: "#374151", lineHeight: 1.6,
              }}>
                {data.message}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
                <span>👤 From {data.sender?.fullName}</span>
                <span>•</span>
                <span>📅 {data.sentAt}</span>
              </div>
            </div>
          )}

          {/* Bottom two columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Interaction Statistics */}
            <div className="ap-detail-card">
              <div className="ap-detail-section-title">
                <span style={{ marginRight: 8 }}>📈</span> Interaction Statistics
              </div>
              <StatRow icon="💬" label="Messages Exchanged" value={data.interactions.messagesExchanged} />
              <StatRow icon="📞" label="Phone Calls"         value={data.interactions.phoneCalls} />
              <StatRow icon="📹" label="Video Calls"         value={data.interactions.videoCalls} />
              <StatRow icon="📅" label="Meetings Scheduled"  value={data.interactions.meetingsScheduled} />
              {data.interactions.lastInteraction && (
                <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>
                  🕐 Last interaction: {data.interactions.lastInteraction}
                </div>
              )}
            </div>

            {/* Interest Details */}
            <div className="ap-detail-card">
              <div className="ap-detail-section-title">
                <span style={{ marginRight: 8 }}>🔶</span> Interest Details
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>Interest Type</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{data.interestType}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>Sent Date</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>📅 {data.sentAt}</div>
                </div>
                {data.respondedAt && (
                  <div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>
                      {data.status === "accepted" ? "Accepted Date" : "Responded Date"}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>📅 {data.respondedAt}</div>
                  </div>
                )}
                {data.responseTime && (
                  <div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>Response Time</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>🕐 {data.responseTime}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>Current Status</div>
                  <span style={{
                    background: statusBg, color: statusColor, fontSize: 12, fontWeight: 600,
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    ✓ {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Notes */}
          {data.systemNotes?.length > 0 && (
            <div className="ap-detail-card">
              <div className="ap-detail-section-title">
                <span style={{ marginRight: 8 }}>🔔</span> System Notes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.systemNotes.map((n, i) => (
                  <div key={i} style={{
                    background: "#fffbeb", border: "1px solid #fde68a",
                    borderRadius: 8, padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 14, color: "#374151" }}>{n.note}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                      Added by {n.addedBy} • {n.addedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════
          PROFILE COMPARISON TAB — Image 2
      ════════════════════════════════════ */}
      {tab === "comparison" && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <ProfileCard user={data.sender}   role="Sender"   />
          <ProfileCard user={data.receiver} role="Receiver" />
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   INTERESTS LIST PAGE — Image 1
════════════════════════════════════════════════════════════════════════════ */
export default function AdminInterests() {
  const [interests,   setInterests]   = useState([]);
  const [stats,       setStats]       = useState({});
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("all");
  const [search,      setSearch]      = useState("");
  const [timeRange,   setTimeRange]   = useState("");
  const [deleting,    setDeleting]    = useState(null);
  const [selectedId,  setSelectedId]  = useState(null);

  /* Load stats */
  useEffect(() => {
    interestsApi.getStats()
      .then((res) => setStats(res.stats || {}))
      .catch(() => {});
  }, []);

  /* Load list */
  const loadInterests = useCallback(() => {
    setLoading(true);
    interestsApi.getAll({
      page, limit: LIMIT,
      status:    activeTab === "all" ? "" : activeTab,
      search,
      timeRange,
    })
      .then((res) => {
        setInterests(res.interests   || []);
        setTotal(res.total           || 0);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, activeTab, search, timeRange]);

  useEffect(() => { loadInterests(); }, [loadInterests]);

  /* Show detail page */
  if (selectedId) {
    return (
      <InterestDetail
        interestId={selectedId}
        onBack={() => setSelectedId(null)}
      />
    );
  }

  const switchTab = (key) => { setActiveTab(key); setPage(1); };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this interest? This will also remove it from both users' records.")) return;
    setDeleting(id);
    try {
      await interestsApi.delete(id);
      setInterests((prev) => prev.filter((i) => i._id !== id));
      setTotal((t) => t - 1);
      interestsApi.getStats().then((r) => setStats(r.stats || {}));
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const tabDefs = [
    { key: "all",      label: `All (${stats.total    || 0})` },
    { key: "accepted", label: `Accepted (${stats.accepted || 0})` },
    { key: "pending",  label: `Pending (${stats.pending  || 0})` },
    { key: "declined", label: `Declined (${stats.declined || 0})` },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="ap-page-header">
        <div>
          <h2>Interests &amp; Matches</h2>
          <p>Monitor all interest requests and matches</p>
        </div>
        <button className="ap-btn-red" onClick={() => interestsApi.export().catch((e) => alert(e.message))}>
          {Ico.download} Export Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="ap-interests-stat-grid">
        <div className="ap-interests-stat-card">
          <div className="ap-interests-stat-header">
            <div className="ap-interests-stat-icon blue">{Ico.heartBig}</div>
            <span className="ap-interests-stat-name blue">Total Interests</span>
          </div>
          <div className="ap-interests-stat-value">{(stats.total || 0).toLocaleString()}</div>
          <div className="ap-interests-stat-sub">All time</div>
        </div>
        <div className="ap-interests-stat-card">
          <div className="ap-interests-stat-header">
            <div className="ap-interests-stat-icon green">{Ico.checkCircle}</div>
            <span className="ap-interests-stat-name green">Accepted</span>
          </div>
          <div className="ap-interests-stat-value">{stats.accepted || 0}</div>
          <div className="ap-interests-stat-sub">{stats.successRate || 0}% success rate</div>
        </div>
        <div className="ap-interests-stat-card">
          <div className="ap-interests-stat-header">
            <div className="ap-interests-stat-icon red">{Ico.xCircle}</div>
            <span className="ap-interests-stat-name red">Declined</span>
          </div>
          <div className="ap-interests-stat-value">{stats.declined || 0}</div>
          <div className="ap-interests-stat-sub">Rejected requests</div>
        </div>
        <div className="ap-interests-stat-card">
          <div className="ap-interests-stat-header">
            <div className="ap-interests-stat-icon amber">{Ico.clockCircle}</div>
            <span className="ap-interests-stat-name amber">Pending</span>
          </div>
          <div className="ap-interests-stat-value">{stats.pending || 0}</div>
          <div className="ap-interests-stat-sub">Awaiting response</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="ap-interest-tabs">
        {tabDefs.map((t) => (
          <button key={t.key} className={`ap-interest-tab${activeTab === t.key ? " active" : ""}`}
            onClick={() => switchTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + time filter */}
      <div className="ap-filter-bar">
        <div className="ap-search-wrap">
          <span className="ap-search-icon">{Ico.search}</span>
          <input
            className="ap-search"
            placeholder="Search by sender or receiver name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="ap-select" value={timeRange} onChange={(e) => { setTimeRange(e.target.value); setPage(1); }}>
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Interest From</th>
              <th>Interest To</th>
              <th>Match Score</th>
              <th>Date &amp; Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>Loading…</td></tr>
            )}
            {!loading && interests.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>
                {total === 0 ? "No interests yet." : "No results match your search."}
              </td></tr>
            )}
            {!loading && interests.map((i) => (
              <tr
                key={i._id}
                style={{ opacity: deleting === i._id ? 0.4 : 1, cursor: "pointer" }}
                onClick={() => setSelectedId(i._id)}
              >
                <td>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{i.sender.fullName}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>ID: {i.sender.id}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: "#111827" }}>{i.receiver.fullName}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>ID: {i.receiver.id}</div>
                </td>
                <td><MatchBar score={i.matchScore} /></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#6b7280" }}>
                    {Ico.calendar} {i.createdAt}
                  </div>
                </td>
                <td>
                  <Badge
                    type={i.status}
                    label={
                      i.status === "accepted" ? "✓ Accepted" :
                      i.status === "declined" ? "✗ Declined" : "⏱ Pending"
                    }
                  />
                </td>
                <td>
                  <div className="ap-actions" onClick={(e) => e.stopPropagation()}>
                    {/* Eye / view button */}
                    <button
                      className="ap-btn-icon"
                      title="View Details"
                      onClick={(e) => { e.stopPropagation(); setSelectedId(i._id); }}
                    >
                      {Ico.eye}
                    </button>
                    <button
                      className="ap-action-btn ap-btn-danger"
                      disabled={deleting === i._id}
                      onClick={(e) => handleDelete(e, i._id)}
                    >
                      {deleting === i._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} perPage={LIMIT} onPage={setPage} />
    </div>
  );
}
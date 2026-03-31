import { useState, useEffect, useCallback } from "react";
import { feedbackApi } from "./adminApi";

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const IcoChat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IcoClock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcoCheckCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IcoStar = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const IcoChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IcoX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ── Star renderer ──────────────────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="16" height="16" viewBox="0 0 24 24"
          fill={s <= rating ? "#f59e0b" : "none"}
          stroke={s <= rating ? "#f59e0b" : "#d1d5db"}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

/* ── Category badge ─────────────────────────────────────────────────────────── */
function CategoryBadge({ cat }) {
  const map = {
    Positive:   { bg: "#dcfce7", color: "#15803d" },
    Suggestion: { bg: "#dbeafe", color: "#1d4ed8" },
    Issue:      { bg: "#fee2e2", color: "#b91c1c" },
    Negative:   { bg: "#fee2e2", color: "#b91c1c" },
  };
  const s = map[cat] || { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 99,
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>{cat}</span>
  );
}

/* ── Status badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    Resolved: { bg: "#dcfce7", color: "#15803d" },
    Pending:  { bg: "#fef3c7", color: "#b45309" },
  };
  const s = map[status] || { bg: "#f3f4f6", color: "#6b7280" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: 99,
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>{status}</span>
  );
}

/* ── Feedback Detail Modal ──────────────────────────────────────────────────── */
function FeedbackModal({ item, onClose, onResolve }) {
  if (!item) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)", overflow: "hidden",
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #f3f4f6",
        }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Feedback Details</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#9ca3af", display: "flex", alignItems: "center", padding: 2,
          }}><IcoX /></button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          {/* User */}
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>User</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{item.userName}</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{item.userEmail}</div>
          </div>

          <div style={{ height: 1, background: "#f3f4f6" }} />

          {/* Rating */}
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>Rating</div>
            <Stars rating={item.rating} />
          </div>

          {/* Subject */}
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Subject</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{item.subject}</div>
          </div>

          {/* Message */}
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 }}>Message</div>
            <div style={{
              background: "#f9fafb", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "12px 14px",
              fontSize: 13.5, color: "#374151", lineHeight: 1.6,
            }}>{item.message}</div>
          </div>

          {/* Category / Status / Date */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Category</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{item.category}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Status</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{item.status}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>Date</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{item.date}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "0 24px 20px" }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "11px",
            background: "#f3f4f6", border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer",
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Stat Card ──────────────────────────────────────────────────────────────── */
function StatCard({ icon, iconBg, iconColor, label, value }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb",
      padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flex: 1,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: iconBg, color: iconColor,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function AdminFeedback() {
  const [feedbacks,   setFeedbacks]   = useState([]);
  const [stats,       setStats]       = useState({ total: 0, pending: 0, resolved: 0, avgRating: "0.0" });
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState("All Status");
  const [ratingFilter,setRatingFilter]= useState("All Ratings");
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalCount,  setTotalCount]  = useState(0);
  const [modal,       setModal]       = useState(null);
  const [statusOpen,  setStatusOpen]  = useState(false);
  const [ratingOpen,  setRatingOpen]  = useState(false);

  const LIMIT = 5;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page, limit: LIMIT,
        search: search || undefined,
        status: statusFilter !== "All Status"   ? statusFilter : undefined,
        rating: ratingFilter !== "All Ratings"  ? ratingFilter.replace(" Stars", "").replace(" Star", "") : undefined,
      };
      const res = await feedbackApi.getAll(params);
      setFeedbacks(res.feedbacks || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
      setStats({
        total:     res.stats?.total     || 0,
        pending:   res.stats?.pending   || 0,
        resolved:  res.stats?.resolved  || 0,
        avgRating: res.stats?.avgRating || "0.0",
      });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, ratingFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* search debounce */
  useEffect(() => { setPage(1); }, [search, statusFilter, ratingFilter]);

  const handleResolve = async (id) => {
    try {
      await feedbackApi.resolve(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await feedbackApi.delete(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const paginationPages = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i++) pages.push(i);
    return pages;
  };

  return (
    <div>
      {/* Page header */}
      <div className="ap-page-header">
        <div>
          <h2>Feedback Management</h2>
          <p>Manage user feedback and reviews</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard icon={<IcoChat />}         iconBg="#eff6ff" iconColor="#2563eb" label="Total Feedback" value={stats.total} />
        <StatCard icon={<IcoClock />}        iconBg="#fef3c7" iconColor="#b45309" label="Pending"        value={stats.pending} />
        <StatCard icon={<IcoCheckCircle />}  iconBg="#dcfce7" iconColor="#15803d" label="Resolved"       value={stats.resolved} />
        <StatCard icon={<IcoStar />}         iconBg="#fef9c3" iconColor="#d97706" label="Avg Rating"     value={stats.avgRating} />
      </div>

      {/* Filter bar */}
      <div style={{
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
        padding: "14px 16px", display: "flex", gap: 10,
        alignItems: "center", marginBottom: 16, flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
            <IcoSearch />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name or subject..."
            style={{
              width: "100%", padding: "9px 12px 9px 34px",
              border: "1.5px solid #e5e7eb", borderRadius: 8,
              fontSize: 13, fontFamily: "inherit",
              outline: "none", background: "#f9fafb", color: "#111827",
            }}
          />
        </div>

        {/* Status dropdown */}
        <div style={{ position: "relative" }}>
          <button onClick={() => { setStatusOpen((p) => !p); setRatingOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8,
            background: "#f9fafb", fontSize: 13, fontFamily: "inherit",
            cursor: "pointer", color: "#374151", whiteSpace: "nowrap",
          }}>
            {statusFilter} <IcoChevron />
          </button>
          {statusOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", right: 0,
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)", zIndex: 50, minWidth: 140, overflow: "hidden",
            }}>
              {["All Status", "Pending", "Resolved"].map((s) => (
                <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); }} style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 14px", border: "none", cursor: "pointer",
                  fontSize: 13, fontFamily: "inherit",
                  background: statusFilter === s ? "#eff6ff" : "#fff",
                  color: statusFilter === s ? "#1d4ed8" : "#374151",
                }}>{s}</button>
              ))}
            </div>
          )}
        </div>

        {/* Rating dropdown */}
        <div style={{ position: "relative" }}>
          <button onClick={() => { setRatingOpen((p) => !p); setStatusOpen(false); }} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 14px", border: "1.5px solid #e5e7eb", borderRadius: 8,
            background: "#f9fafb", fontSize: 13, fontFamily: "inherit",
            cursor: "pointer", color: "#374151", whiteSpace: "nowrap",
          }}>
            {ratingFilter} <IcoChevron />
          </button>
          {ratingOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", right: 0,
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)", zIndex: 50, minWidth: 140, overflow: "hidden",
            }}>
              {["All Ratings", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"].map((r) => (
                <button key={r} onClick={() => { setRatingFilter(r); setRatingOpen(false); }} style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "10px 14px", border: "none", cursor: "pointer",
                  fontSize: 13, fontFamily: "inherit",
                  background: ratingFilter === r ? "#eff6ff" : "#fff",
                  color: ratingFilter === r ? "#1d4ed8" : "#374151",
                }}>{r}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 1.4fr 1.2fr 1fr 1.2fr 1.2fr",
          padding: "10px 20px", background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb", gap: 8,
        }}>
          {["USER", "SUBJECT", "RATING", "CATEGORY", "DATE", "STATUS", "ACTIONS"].map((h) => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
            Loading feedback…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ padding: "20px", color: "#b91c1c", fontSize: 13 }}>⚠️ {error}</div>
        )}

        {/* Empty */}
        {!loading && !error && feedbacks.length === 0 && (
          <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
            No feedback found
          </div>
        )}

        {/* Rows */}
        {!loading && !error && feedbacks.map((item) => (
          <div key={item._id} style={{
            display: "grid",
            gridTemplateColumns: "2fr 2fr 1.4fr 1.2fr 1fr 1.2fr 1.2fr",
            alignItems: "center", padding: "14px 20px",
            borderBottom: "1px solid #f3f4f6", gap: 8,
            transition: "background 0.15s",
          }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
            onMouseLeave={(e) => e.currentTarget.style.background = ""}
          >
            {/* User */}
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{item.userName}</div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 1 }}>{item.userEmail}</div>
            </div>

            {/* Subject */}
            <div style={{ fontSize: 13.5, color: "#374151" }}>{item.subject}</div>

            {/* Rating */}
            <div><Stars rating={item.rating} /></div>

            {/* Category */}
            <div><CategoryBadge cat={item.category} /></div>

            {/* Date */}
            <div style={{ fontSize: 13, color: "#6b7280" }}>{item.date}</div>

            {/* Status */}
            <div><StatusBadge status={item.status} /></div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {/* View */}
              <button onClick={() => setModal(item)} title="View details" style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#2563eb", display: "flex", alignItems: "center", padding: 4,
              }}><IcoEye /></button>

              {/* Resolve (only if pending) */}
              {item.status === "Pending" && (
                <button onClick={() => handleResolve(item._id)} title="Mark resolved" style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#15803d", display: "flex", alignItems: "center", padding: 4,
                }}><IcoCheck /></button>
              )}

              {/* Delete */}
              <button onClick={() => handleDelete(item._id)} title="Delete" style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#cc0000", display: "flex", alignItems: "center", padding: 4,
              }}><IcoTrash /></button>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {!loading && !error && feedbacks.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", flexWrap: "wrap", gap: 10,
          }}>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Showing {(page - 1) * LIMIT + 1} to {Math.min(page * LIMIT, totalCount)} of {totalCount} feedbacks
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="ap-pg-btn">Previous</button>
              {paginationPages().map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`ap-pg-btn${page === p ? " ap-pg-active" : ""}`}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="ap-pg-btn">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <FeedbackModal item={modal} onClose={() => setModal(null)} onResolve={handleResolve} />
    </div>
  );
}
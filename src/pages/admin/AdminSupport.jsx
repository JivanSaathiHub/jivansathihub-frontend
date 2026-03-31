import { useState, useEffect } from "react";
import { supportApi } from "./adminApi";
import { Pagination } from "./shared";

const LIMIT = 10;

const CATEGORIES = ["Technical Issue", "Payment Issue", "Account Issue", "General Query", "Feature Request"];
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES   = ["Pending", "Resolved"];

/* ── Priority badge ──────────────────────────────────────────────────────── */
function PriorityBadge({ priority }) {
  const map = {
    High:   { bg: "#fee2e2", color: "#dc2626" },
    Medium: { bg: "#fef9c3", color: "#ca8a04" },
    Low:    { bg: "#e0f2fe", color: "#0284c7" },
  };
  const s = map[priority] || map.Medium;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 12px", borderRadius: 99,
      fontSize: 12, fontWeight: 600,
    }}>{priority || "—"}</span>
  );
}

/* ── Status badge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    Pending:  { bg: "#fef9c3", color: "#ca8a04" },
    Resolved: { bg: "#dcfce7", color: "#16a34a" },
  };
  const label = status === "inProgress" ? "In Progress"
              : status ? status.charAt(0).toUpperCase() + status.slice(1)
              : "Pending";
  const key = label === "In Progress" ? "Pending" : label;
  const s   = map[key] || map.Pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 14px", borderRadius: 99,
      fontSize: 12, fontWeight: 600,
    }}>{label}</span>
  );
}

/* ── Ticket Detail Modal ─────────────────────────────────────────────────── */
function TicketModal({ ticket, onClose, onResolve }) {
  if (!ticket) return null;
  const date = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString("en-IN")
    : "—";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520,
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        maxHeight: "90vh", display: "flex", flexDirection: "column",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: "1px solid #f3f4f6",
        }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Ticket Details</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#9ca3af", fontSize: 22, lineHeight: 1, padding: 2,
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* User */}
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 3 }}>User</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{ticket.userName || "Unknown"}</div>
          </div>

          {/* Email + Phone */}
          <div className="ap-spt-modal-2col">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9ca3af", fontSize: 12, marginBottom: 3 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                Email
              </div>
              <div style={{ fontSize: 13, color: "#111827" }}>{ticket.userEmail || "—"}</div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9ca3af", fontSize: 12, marginBottom: 3 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Phone
              </div>
              <div style={{ fontSize: 13, color: "#111827" }}>{ticket.phone || "—"}</div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 3 }}>Subject</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{ticket.subject || "—"}</div>
          </div>

          {/* Message */}
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 6 }}>Message</div>
            <div style={{
              background: "#f9fafb", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "12px 14px",
              fontSize: 13, color: "#374151", lineHeight: 1.6,
            }}>{ticket.message || "No message provided."}</div>
          </div>

          {/* Category / Priority / Status / Date */}
          <div className="ap-spt-modal-4col">
            {[
              { label: "Category", value: ticket.category || "—" },
              { label: "Priority", value: ticket.priority || "—" },
              { label: "Status",   value: ticket.status   || "Pending" },
              { label: "Date",     value: date },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
          {ticket.status !== "resolved" && ticket.status !== "Resolved" && (
            <button onClick={() => onResolve(ticket)} style={{
              flex: 1, padding: "11px", background: "#16a34a",
              border: "none", borderRadius: 8, fontSize: 14,
              fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit",
            }}>Mark as Resolved</button>
          )}
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", background: "#f3f4f6",
            border: "none", borderRadius: 8, fontSize: 14,
            fontWeight: 600, color: "#374151", cursor: "pointer", fontFamily: "inherit",
          }}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export default function AdminSupport() {
  const [tickets,    setTickets]    = useState([]);
  const [stats,      setStats]      = useState({ total: 0, pending: 0, resolved: 0, highPriority: 0 });
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);

  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    supportApi.getAll({ page, limit: LIMIT, status, category, priority, search })
      .then((res) => {
        setTickets(res.tickets    || []);
        setStats(res.stats        || { total: 0, pending: 0, resolved: 0, highPriority: 0 });
        setTotal(res.total        || 0);
        setTotalPages(res.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, status, category, priority, search]);

  const handleResolve = async (ticket) => {
    try {
      await supportApi.update(ticket._id, { status: "resolved" });
      setTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, status: "Resolved" } : t));
      setSelected(prev => prev ? { ...prev, status: "Resolved" } : prev);
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (ticket) => {
    if (!window.confirm(`Delete ticket from "${ticket.userName}"? This cannot be undone.`)) return;
    try {
      await supportApi.delete(ticket._id);
      setTickets(prev => prev.filter(t => t._id !== ticket._id));
    } catch (err) { alert(err.message); }
  };

  const statCards = [
    {
      label: "Total Tickets", value: stats.total,
      iconBg: "#eff6ff", iconColor: "#3b82f6",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
    {
      label: "Pending", value: stats.pending,
      iconBg: "#fff7ed", iconColor: "#f97316",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
    },
    {
      label: "Resolved", value: stats.resolved,
      iconBg: "#f0fdf4", iconColor: "#16a34a",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: "High Priority", value: stats.highPriority,
      iconBg: "#fff1f2", iconColor: "#dc2626",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
  ];

  const resetFilters = () => { setSearch(""); setStatus(""); setCategory(""); setPriority(""); setPage(1); };

  return (
    <div>
      {/* Page header */}
      <div className="ap-page-header">
        <div>
          <h2>Support Tickets</h2>
          <p>Manage contact form submissions and support requests</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="ap-spt-stat-grid">
        {statCards.map((s) => (
          <div key={s.label} className="ap-spt-stat-card">
            <div style={{
              width: 52, height: 52, borderRadius: 12, flexShrink: 0,
              background: s.iconBg, color: s.iconColor,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="ap-spt-filter-bar">
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or subject..."
            className="ap-search"
            style={{ paddingLeft: 34 }}
          />
        </div>
        <div className="ap-spt-selects">
          <select className="ap-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
          </select>
          <select className="ap-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="ap-select" value={priority} onChange={e => { setPriority(e.target.value); setPage(1); }}>
            <option value="">All Priority</option>
            {PRIORITIES.map(p => <option key={p} value={p.toLowerCase()}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        <table className="ap-table ap-spt-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Subject</th>
              <th className="ap-spt-hide-md">Category</th>
              <th>Priority</th>
              <th className="ap-spt-hide-sm">Date &amp; Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>Loading…</td></tr>
            )}
            {!loading && tickets.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
                  <div style={{ fontWeight: 600, color: "#111827", fontSize: 16 }}>No tickets found</div>
                  <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>
                    {search || status || category || priority
                      ? <button onClick={resetFilters} style={{ background: "none", border: "none", color: "#cc0000", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>Clear filters</button>
                      : "When users submit support requests, they'll appear here."}
                  </div>
                </td>
              </tr>
            )}
            {!loading && tickets.map((t) => {
              const dt = t.createdAt ? new Date(t.createdAt) : null;
              const dateStr = dt ? dt.toLocaleDateString("en-IN")  : "—";
              const timeStr = dt ? dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";
              const isResolved = t.status === "resolved" || t.status === "Resolved";

              return (
                <tr key={t._id}>
                  <td>
                    <div style={{ fontWeight: 600, color: "#111827", fontSize: 13 }}>{t.userName || "Unknown"}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{t.userEmail || ""}</div>
                  </td>
                  <td style={{ color: "#374151", fontSize: 13 }}>{t.subject || "—"}</td>
                  <td className="ap-spt-hide-md" style={{ color: "#374151", fontSize: 13 }}>{t.category || "—"}</td>
                  <td><PriorityBadge priority={t.priority} /></td>
                  <td className="ap-spt-hide-sm" style={{ color: "#374151", fontSize: 12 }}>
                    <div>{dateStr}</div>
                    {timeStr && <div style={{ color: "#9ca3af" }}>{timeStr}</div>}
                  </td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => setSelected(t)} title="View" style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#3b82f6", display: "flex", padding: 2,
                      }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      {!isResolved && (
                        <button onClick={() => handleResolve(t)} title="Mark as Resolved" style={{
                          background: "none", border: "none", cursor: "pointer",
                          color: "#16a34a", display: "flex", padding: 2,
                        }}>
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        </button>
                      )}
                      <button onClick={() => handleDelete(t)} title="Delete" style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#dc2626", display: "flex", padding: 2,
                      }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Showing count + Pagination */}
      {total > 0 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: 16, padding: "12px 20px", background: "#fff",
          borderRadius: 12, border: "1px solid #e5e7eb", flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>
            Showing {tickets.length} of {total} ticket{total !== 1 ? "s" : ""}
          </span>
          <Pagination page={page} totalPages={totalPages} total={total} perPage={LIMIT} onPage={setPage} />
        </div>
      )}

      {/* Ticket detail modal */}
      {selected && (
        <TicketModal
          ticket={selected}
          onClose={() => setSelected(null)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}
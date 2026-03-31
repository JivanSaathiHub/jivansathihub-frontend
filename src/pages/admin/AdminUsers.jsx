import { useState, useEffect, useCallback } from "react";
import { usersApi } from "./adminApi";
import { Ico } from "./icons";
import { Badge, Avatar, Pagination } from "./shared";
import AdminUserDetail from "./AdminUserDetail";

const LIMIT = 10;

export default function AdminUsers({ isSuperAdmin }) {
  const [users,        setUsers]        = useState([]);
  const [stats,        setStats]        = useState({});
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [page,         setPage]         = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [actionLoading,setActionLoading]= useState(null); // id of user being acted on
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [filters,      setFilters]      = useState({ gender: "", plan: "", verified: "", active: "" });
  const [selectedUser, setSelectedUser] = useState(null);

  /* ── Load stats once ── */
  useEffect(() => {
    usersApi.getStats()
      .then((res) => setStats(res.stats || {}))
      .catch(() => {});
  }, []);

  /* ── Load users whenever page / search / filters change ── */
  const loadUsers = useCallback(() => {
    setLoading(true);
    usersApi.getAll({ page, limit: LIMIT, search, ...filters })
      .then((res) => {
        setUsers(res.users      || []);
        setTotal(res.total      || 0);
        setTotalPages(res.totalPages || 1);
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, search, filters]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  /* ── If a user is selected, show detail page ── */
  if (selectedUser) {
    return (
      <AdminUserDetail
        userId={selectedUser}
        onBack={() => { setSelectedUser(null); loadUsers(); }}
        isSuperAdmin={isSuperAdmin}
      />
    );
  }

  /* ── Helpers ── */
  const setFilter = (key, val) => {
    setFilters((p) => ({ ...p, [key]: val }));
    setPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  /* ── Actions ── */
  const handleBlock = async (e, u) => {
    e.stopPropagation();
    if (!window.confirm(`Block ${u.fullName}? They won't be able to log in.`)) return;
    setActionLoading(u._id);
    try {
      await usersApi.block(u._id);
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, isActive: false } : x));
      setStats((s) => ({ ...s })); // trigger re-render
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (e, u) => {
    e.stopPropagation();
    if (!window.confirm(`Unblock ${u.fullName}?`)) return;
    setActionLoading(u._id);
    try {
      await usersApi.unblock(u._id);
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, isActive: true } : x));
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (e, u) => {
    e.stopPropagation();
    if (!window.confirm(`Permanently delete ${u.fullName}? This cannot be undone.`)) return;
    setActionLoading(u._id);
    try {
      await usersApi.delete(u._id);
      setUsers((prev) => prev.filter((x) => x._id !== u._id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRole = async (e, u) => {
    e.stopPropagation();
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!window.confirm(`Change ${u.fullName}'s role to ${newRole}?`)) return;
    setActionLoading(u._id);
    try {
      await usersApi.updateRole(u._id, newRole);
      setUsers((prev) => prev.map((x) => x._id === u._id ? { ...x, role: newRole } : x));
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async () => {
    try { await usersApi.export(); }
    catch (err) { alert(`Export failed: ${err.message}`); }
  };

  return (
    <div>
      {/* Page header */}
      <div className="ap-page-header">
        <div>
          <h2>User Management</h2>
          <p>Manage all registered users</p>
        </div>
        <button className="ap-btn-red" onClick={handleExport}>
          {Ico.download} Export Users
        </button>
      </div>

      {/* Quick stats — real numbers from backend */}
      <div className="ap-qs-grid">
        <div className="ap-qs-card">
          <div className="ap-qs-label">Total Users</div>
          <div className="ap-qs-value">{(stats.total || 0).toLocaleString("en-IN")}</div>
        </div>
        <div className="ap-qs-card">
          <div className="ap-qs-label">Verified Users</div>
          <div className="ap-qs-value">{(stats.verified || 0).toLocaleString("en-IN")}</div>
        </div>
        <div className="ap-qs-card">
          <div className="ap-qs-label">Premium Users</div>
          <div className="ap-qs-value">{(stats.premium || 0).toLocaleString("en-IN")}</div>
        </div>
        <div className="ap-qs-card">
          <div className="ap-qs-label">New Today</div>
          <div className="ap-qs-value">{(stats.newToday || 0).toLocaleString("en-IN")}</div>
          <div className="ap-qs-sub">Since midnight</div>
        </div>
      </div>

      {/* Filters */}
      <div className="ap-filter-bar">
        <div className="ap-search-wrap">
          <span className="ap-search-icon">{Ico.search}</span>
          <input
            className="ap-search"
            placeholder="Search by name, email, phone…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <select className="ap-select" value={filters.active}   onChange={(e) => setFilter("active",   e.target.value)}>
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Blocked</option>
        </select>
        <select className="ap-select" value={filters.plan}     onChange={(e) => setFilter("plan",     e.target.value)}>
          <option value="">All Subscription</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
          <option value="elite">Elite</option>
        </select>
        <select className="ap-select" value={filters.verified} onChange={(e) => setFilter("verified", e.target.value)}>
          <option value="">All Verification</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
        <select className="ap-select" value={filters.gender}   onChange={(e) => setFilter("gender",   e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* User list */}
      <div className="ap-user-list">
        <div className="ap-user-row-header">
          <span className="ap-col-label">User</span>
          <span className="ap-col-label">Contact</span>
          <span className="ap-col-label">Details</span>
          <span className="ap-col-label">Subscription</span>
          <span className="ap-col-label">Stats</span>
          <span className="ap-col-label">Status</span>
        </div>

        {loading && (
          <div className="ap-loading">Loading users…</div>
        )}

        {!loading && error && (
          <div style={{ padding: 24, textAlign: "center", color: "#b91c1c" }}>
            {error} — <button onClick={loadUsers} style={{ color: "#cc0000", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>retry</button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="ap-loading">
            {search || Object.values(filters).some(Boolean)
              ? "No users match your filters."
              : "No users registered yet."}
          </div>
        )}

        {!loading && users.map((u) => {
          const busy = actionLoading === u._id;
          return (
            <div
              key={u._id}
              className={`ap-user-row${!u.isActive ? " blocked-row" : ""}`}
              onClick={() => setSelectedUser(u._id)}
              style={{ opacity: busy ? 0.6 : 1, pointerEvents: busy ? "none" : "auto" }}
            >
              {/* User */}
              <div className="ap-user-info">
                <Avatar user={u} />
                <div>
                  <div className="ap-user-name">
                    {u.fullName}
                    {u.isVerified && <span className="ap-verify-dot">{Ico.check}</span>}
                  </div>
                  <div className="ap-user-id">ID: #{String(u._id).slice(-6).toUpperCase()}</div>
                </div>
              </div>

              {/* Contact */}
              <div className="ap-contact-info">
                <div className="ap-contact-row"><span className="ap-contact-icon">{Ico.mail}</span>{u.email}</div>
                <div className="ap-contact-row"><span className="ap-contact-icon">{Ico.phone}</span>{u.mobile}</div>
              </div>

              {/* Details */}
              <div className="ap-details-info">
                <div className="ap-detail-row">
                  <span className="ap-contact-icon">{Ico.location}</span>{u.city}, {u.state}
                </div>
                <div className="ap-detail-row" style={{ color: "#9ca3af", fontSize: 12 }}>
                  {u.age} years, {u.gender}
                </div>
              </div>

              {/* Subscription */}
              <div>
                <Badge
                  type={u.membership?.plan || "free"}
                  label={(u.membership?.plan || "Free").charAt(0).toUpperCase() + (u.membership?.plan || "free").slice(1)}
                />
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Joined {u.joinedDate}</div>
              </div>

              {/* Stats */}
              <div className="ap-stats-info">
                <div className="ap-stat-row-sm">{u.profileViews} views</div>
                <div className="ap-stat-row-sm">{u.interests} interests</div>
              </div>

              {/* Status + actions */}
              <div onClick={(e) => e.stopPropagation()}>
                <Badge type={u.isActive ? "active" : "inactive"} label={u.isActive ? "Active" : "Inactive"} />
                <div className="ap-actions" style={{ marginTop: 6 }}>
                  {u.isActive ? (
                    <button className="ap-action-btn ap-btn-warn" onClick={(e) => handleBlock(e, u)} disabled={busy}>
                      {busy ? "…" : "Block"}
                    </button>
                  ) : (
                    <button className="ap-action-btn ap-btn-success" onClick={(e) => handleUnblock(e, u)} disabled={busy}>
                      {busy ? "…" : "Unblock"}
                    </button>
                  )}
                  {isSuperAdmin && u.role !== "superadmin" && (
                    <button className="ap-action-btn ap-btn-blue" onClick={(e) => handleRole(e, u)} disabled={busy}>
                      {u.role === "admin" ? "Demote" : "Make Admin"}
                    </button>
                  )}
                  {u.role !== "admin" && u.role !== "superadmin" && (
                    <button className="ap-action-btn ap-btn-danger" onClick={(e) => handleDelete(e, u)} disabled={busy}>
                      Del
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} perPage={LIMIT} onPage={setPage} />
    </div>
  );
}
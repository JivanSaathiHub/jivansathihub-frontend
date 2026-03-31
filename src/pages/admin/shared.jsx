// ─── Shared UI Components ────────────────────────────────────────────────────

export function Badge({ type, label }) {
  return <span className={`ap-badge ap-badge-${type}`}>{label}</span>;
}

export function Avatar({ user, size = 40 }) {
  const initials = (user?.fullName || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const cls = user?.gender === "Female" ? "ap-avatar-f" : "ap-avatar-m";
  return (
    <div
      className={`ap-avatar ${cls}`}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}

export function Pagination({ page, totalPages, total, perPage, onPage }) {
  const from  = (page - 1) * perPage + 1;
  const to    = Math.min(page * perPage, total);
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <div className="ap-pagination">
      <span className="ap-pagination-info">
        Showing {from} to {to} of {total}
      </span>
      <div className="ap-pagination-btns">
        <button
          className="ap-pg-btn"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            className={`ap-pg-btn${page === p ? " ap-pg-active" : ""}`}
            onClick={() => onPage(p)}
          >
            {p}
          </button>
        ))}
        {totalPages > 5 && <span style={{ padding: "0 6px", color: "#9ca3af" }}>…</span>}
        <button
          className="ap-pg-btn"
          disabled={page === totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { reportsApi } from "./adminApi";
import { Ico } from "./icons";

function StatCard({ label, value, sub, color = "#3b82f6" }) {
  return (
    <div className="ap-qs-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="ap-qs-label">{label}</div>
      <div className="ap-qs-value" style={{ color }}>{typeof value === "number" ? value.toLocaleString("en-IN") : value}</div>
      {sub && <div className="ap-qs-sub">{sub}</div>}
    </div>
  );
}

const REPORT_TYPES = [
  { key: "users",         label: "Users Report",         desc: "All registered users — name, email, mobile, city, plan, joined date", icon: "👥", color: "#3b82f6" },
  { key: "memberships",   label: "Memberships Report",   desc: "All paid members — plan, amount, start/end dates, status",            icon: "💳", color: "#7c3aed" },
  { key: "interests",     label: "Interests Report",     desc: "All interest requests — sender, receiver, status, date",              icon: "💌", color: "#cc0000" },
  { key: "verifications", label: "Verifications Report", desc: "All verified users — Aadhaar eKYC verification details",              icon: "🛡", color: "#16a34a" },
];

export default function AdminReports() {
  const [summary,    setSummary]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [exporting,  setExporting]  = useState(null);

  useEffect(() => {
    reportsApi.getSummary()
      .then((res) => setSummary(res.summary))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleExport = async (type) => {
    setExporting(type);
    try {
      await reportsApi.export(type);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExporting(null);
    }
  };

  const s = summary;

  return (
    <div>
      {/* Header */}
      <div className="ap-page-header">
        <div>
          <h2>Reports</h2>
          <p>Download detailed CSV reports for all platform data</p>
        </div>
      </div>

      {/* Summary stat cards */}
      {loading ? (
        <div style={{ padding: "20px 0", color: "#9ca3af" }}>Loading summary…</div>
      ) : s && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>Platform Overview</div>
          <div className="ap-qs-grid" style={{ marginBottom: 24 }}>
            <StatCard label="Total Users"    value={s.users?.total        || 0} sub={`${s.users?.newToday || 0} new today`} color="#3b82f6" />
            <StatCard label="Verified Users" value={s.users?.verified     || 0} sub={`of ${s.users?.total || 0} total`}     color="#16a34a" />
            <StatCard label="Paid Members"   value={s.memberships?.total  || 0} sub={`Premium + Elite`}                     color="#7c3aed" />
            <StatCard label="Total Revenue"  value={`₹${(s.revenue?.total || 0).toLocaleString("en-IN")}`} sub={`₹${(s.revenue?.thisMonth || 0).toLocaleString("en-IN")} this month`} color="#f59e0b" />
          </div>
          <div className="ap-qs-grid" style={{ marginBottom: 32 }}>
            <StatCard label="Total Interests" value={s.interests?.total    || 0} sub={`${s.interests?.accepted || 0} accepted`} color="#cc0000" />
            <StatCard label="Pending"          value={s.interests?.pending  || 0} sub="Awaiting response"                        color="#f59e0b" />
            <StatCard label="Total Matches"    value={s.matches?.total      || 0} sub="Mutual connections"                       color="#0891b2" />
            <StatCard label="Blocked Users"    value={s.users?.blocked      || 0} sub="Deactivated accounts"                     color="#6b7280" />
          </div>
        </>
      )}

      {/* Export cards */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12 }}>Export Reports</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {REPORT_TYPES.map((r) => (
          <div key={r.key} className="ap-detail-card" style={{ borderTop: `3px solid ${r.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 28 }}>{r.icon}</div>
              <div>
                <div style={{ fontWeight: 600, color: "#111827", fontSize: 15 }}>{r.label}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5, marginBottom: 16 }}>{r.desc}</div>
            <button
              className="ap-btn-red"
              style={{ width: "100%", justifyContent: "center", background: r.color, opacity: exporting === r.key ? 0.6 : 1 }}
              onClick={() => handleExport(r.key)}
              disabled={exporting === r.key}
            >
              {Ico.download} {exporting === r.key ? "Exporting…" : "Download CSV"}
            </button>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div style={{ marginTop: 24, padding: "14px 18px", background: "#f0f9ff", borderRadius: 8, border: "1px solid #bae6fd", fontSize: 13, color: "#0369a1" }}>
        💡 Reports are generated in real-time from your live database. CSV files open in Excel, Google Sheets, or any spreadsheet app.
      </div>
    </div>
  );
}
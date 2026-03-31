import { useState, useEffect } from "react";
import { analyticsApi } from "./adminApi";

/* ── Mini SVG line chart ── */
function LineChart({ data, dataKey, color, width = 460, height = 160 }) {
  if (!data?.length) return null;
  const pad = { top: 10, right: 10, bottom: 28, left: 40 };
  const W   = width  - pad.left - pad.right;
  const H   = height - pad.top  - pad.bottom;
  const max = Math.max(...data.map((d) => d[dataKey])) || 1;
  const xs  = (i) => (i / (data.length - 1)) * W;
  const ys  = (v) => H - (v / max) * H;
  const pts = data.map((d, i) => `${xs(i)},${ys(d[dataKey])}`).join(" ");
  const tks = [0, Math.round(max / 2), max];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <g transform={`translate(${pad.left},${pad.top})`}>
        {tks.map((t) => (
          <g key={t}>
            <line x1={0} y1={ys(t)} x2={W} y2={ys(t)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={-6} y={ys(t) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
              {t >= 1000 ? `${(t/1000).toFixed(0)}k` : t}
            </text>
          </g>
        ))}
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle key={i} cx={xs(i)} cy={ys(d[dataKey])} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />
        ))}
        {data.map((d, i) => (
          <text key={i} x={xs(i)} y={H + 18} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.month}</text>
        ))}
      </g>
    </svg>
  );
}

/* ── Bar chart ── */
function BarChart({ data, dataKey, color, width = 460, height = 160 }) {
  if (!data?.length) return null;
  const pad  = { top: 10, right: 10, bottom: 28, left: 40 };
  const W    = width  - pad.left - pad.right;
  const H    = height - pad.top  - pad.bottom;
  const max  = Math.max(...data.map((d) => d[dataKey])) || 1;
  const barW = (W / data.length) * 0.6;
  const gap  = W / data.length;
  const ys   = (v) => H - (v / max) * H;
  const tks  = [0, Math.round(max / 2), max];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <g transform={`translate(${pad.left},${pad.top})`}>
        {tks.map((t) => (
          <g key={t}>
            <line x1={0} y1={ys(t)} x2={W} y2={ys(t)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={-6} y={ys(t) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
              {t >= 1000 ? `${(t/1000).toFixed(0)}k` : t}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = i * gap + gap / 2 - barW / 2;
          const y = ys(d[dataKey]);
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={H - y} fill={color} rx="3" opacity="0.85" />
              <text x={x + barW / 2} y={H + 18} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.month}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── Donut chart ── */
function DonutChart({ segments, size = 120 }) {
  const total  = segments.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size * 0.38, inner = size * 0.22;
  let angle = -Math.PI / 2;
  const paths = segments.map((seg) => {
    const a1  = angle;
    const a2  = angle + (seg.value / total) * Math.PI * 2;
    angle     = a2;
    const x1  = cx + r * Math.cos(a1); const y1 = cy + r * Math.sin(a1);
    const x2  = cx + r * Math.cos(a2); const y2 = cy + r * Math.sin(a2);
    const xi1 = cx + inner * Math.cos(a1); const yi1 = cy + inner * Math.sin(a1);
    const xi2 = cx + inner * Math.cos(a2); const yi2 = cy + inner * Math.sin(a2);
    const lg  = seg.value / total > 0.5 ? 1 : 0;
    return { ...seg, d: `M${xi1},${yi1} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} L${xi2},${yi2} A${inner},${inner} 0 ${lg},0 ${xi1},${yi1} Z` };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fill="#374151" fontWeight="600">{total.toLocaleString("en-IN")}</text>
    </svg>
  );
}

/* ── Metric card ── */
function MetricCard({ label, value, growth, color }) {
  const up  = growth >= 0;
  return (
    <div className="ap-qs-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="ap-qs-label">{label}</div>
      <div className="ap-qs-value" style={{ color }}>{typeof value === "number" ? value.toLocaleString("en-IN") : value}</div>
      {growth !== undefined && (
        <div className="ap-qs-sub" style={{ color: up ? "#16a34a" : "#dc2626" }}>
          {up ? "▲" : "▼"} {Math.abs(growth)}% vs last month
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   ADMIN ANALYTICS
═══════════════════════════════════ */
export default function AdminAnalytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    analyticsApi.get()
      .then((res) => { setData(res); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>Loading analytics…</div>;
  if (error)   return <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>{error}</div>;

  const { overview, demographics, monthlyData } = data;
  const d = demographics;

  const genderTotal = (d.gender.male + d.gender.female) || 1;
  const planTotal   = (d.membership.free + d.membership.premium + d.membership.elite) || 1;

  return (
    <div>
      {/* Header */}
      <div className="ap-page-header">
        <div><h2>Analytics</h2><p>Real-time platform performance insights</p></div>
      </div>

      {/* Overview metrics */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 10 }}>Key Metrics</div>
      <div className="ap-qs-grid" style={{ marginBottom: 28 }}>
        <MetricCard label="Total Users"      value={overview.totalUsers}    growth={overview.userGrowth}     color="#3b82f6" />
        <MetricCard label="Total Revenue"    value={`₹${overview.totalRevenue.toLocaleString("en-IN")}`} growth={overview.revenueGrowth} color="#7c3aed" />
        <MetricCard label="Total Interests"  value={overview.totalInterests} growth={overview.interestGrowth} color="#cc0000" />
        <MetricCard label="Acceptance Rate"  value={`${overview.acceptanceRate}%`} color="#16a34a" />
      </div>

      {/* Charts row */}
      <div className="ap-dash-charts" style={{ marginBottom: 28 }}>
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">User Registrations</div>
              <div className="ap-chart-subtitle">Last 12 months</div>
            </div>
          </div>
          <div className="ap-chart-wrap">
            {monthlyData?.some((d) => d.users > 0) ? (
              <LineChart data={monthlyData} dataKey="users" color="#3b82f6" />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#9ca3af", fontSize: 13 }}>No registration data yet</div>
            )}
          </div>
        </div>

        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Monthly Revenue (₹)</div>
              <div className="ap-chart-subtitle">Last 12 months</div>
            </div>
          </div>
          <div className="ap-chart-wrap">
            {monthlyData?.some((d) => d.revenue > 0) ? (
              <BarChart data={monthlyData} dataKey="revenue" color="#7c3aed" />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#9ca3af", fontSize: 13 }}>No revenue data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Demographics row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>

        {/* Gender split */}
        <div className="ap-detail-card">
          <div className="ap-detail-section-title">Gender Distribution</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 0" }}>
            <DonutChart segments={[
              { value: d.gender.male,   color: "#3b82f6", label: "Male"   },
              { value: d.gender.female, color: "#ec4899", label: "Female" },
            ]} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Male",   value: d.gender.male,   color: "#3b82f6" },
                { label: "Female", value: d.gender.female, color: "#ec4899" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{item.value.toLocaleString("en-IN")} ({Math.round((item.value / genderTotal) * 100)}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membership split */}
        <div className="ap-detail-card">
          <div className="ap-detail-section-title">Membership Plans</div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 0" }}>
            <DonutChart segments={[
              { value: d.membership.free,    color: "#9ca3af", label: "Free"    },
              { value: d.membership.premium, color: "#7c3aed", label: "Premium" },
              { value: d.membership.elite,   color: "#f59e0b", label: "Elite"   },
            ]} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Free",    value: d.membership.free,    color: "#9ca3af" },
                { label: "Premium", value: d.membership.premium, color: "#7c3aed" },
                { label: "Elite",   value: d.membership.elite,   color: "#f59e0b" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{item.value.toLocaleString("en-IN")} ({Math.round((item.value / planTotal) * 100)}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top cities */}
        <div className="ap-detail-card">
          <div className="ap-detail-section-title">Top Cities</div>
          {d.topCities.length === 0 && <div style={{ color: "#9ca3af", fontSize: 13, padding: "12px 0" }}>No city data yet</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 8 }}>
            {d.topCities.map((c, i) => {
              const maxCount = d.topCities[0]?.count || 1;
              const pct      = Math.round((c.count / maxCount) * 100);
              return (
                <div key={c.city}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 3 }}>
                    <span style={{ color: "#374151", fontWeight: 500 }}>{i + 1}. {c.city}</span>
                    <span style={{ color: "#6b7280" }}>{c.count.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ height: 5, background: "#f3f4f6", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#3b82f6", borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interests trend */}
      <div className="ap-chart-card">
        <div className="ap-chart-header">
          <div>
            <div className="ap-chart-title">Interest Requests Trend</div>
            <div className="ap-chart-subtitle">Last 12 months</div>
          </div>
        </div>
        <div className="ap-chart-wrap">
          {monthlyData?.some((d) => d.interests > 0) ? (
            <LineChart data={monthlyData} dataKey="interests" color="#cc0000" width={900} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 160, color: "#9ca3af", fontSize: 13 }}>No interest data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
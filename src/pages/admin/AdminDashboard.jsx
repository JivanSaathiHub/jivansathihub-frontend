import { useState, useEffect } from "react";
import { dashboardApi } from "./adminApi";
import { Ico } from "./icons";
import { Badge } from "./shared";
import rupeeImg from "../../assets/Container.png";

/* ── Rupee icon ─────────────────────────────────────────────────────────────── */
const RupeeIcon = () => (
  <img src={rupeeImg} width="26" height="26" alt="rupee" />
);
/* ── Heart icon ─────────────────────────────────────────────────────────────── */
const HeartFilledIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24"
    fill="#cc0000" stroke="#cc0000" strokeWidth="1.2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67
      l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78
      l1.06 1.06L12 21.23l7.78-7.78
      1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/* ── Line chart ─────────────────────────────────────────────────────────────── */
function LineChart({ data, keys, colors, width = 500, height = 180 }) {
  const padding = { top: 10, right: 10, bottom: 28, left: 36 };
  const W = width - padding.left - padding.right;
  const H = height - padding.top - padding.bottom;
  if (!data?.length) return null;

  const allValues = data.flatMap((d) => keys.map((k) => d[k]));
  const maxVal    = Math.max(...allValues) || 1;
  const xScale    = (i) => (i / (data.length - 1)) * W;
  const yScale    = (v) => H - (v / maxVal) * H;
  const polyline  = (key) => data.map((d, i) => `${xScale(i)},${yScale(d[key])}`).join(" ");
  const yTicks    = [0, Math.round(maxVal / 2), maxVal];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <g transform={`translate(${padding.left},${padding.top})`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={0} y1={yScale(t)} x2={W} y2={yScale(t)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={-6} y={yScale(t) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{t}</text>
          </g>
        ))}
        {keys.map((key, ki) => (
          <polyline key={key} points={polyline(key)} fill="none"
            stroke={colors[ki]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {keys.map((key, ki) =>
          data.map((d, i) => (
            <circle key={`${key}-${i}`} cx={xScale(i)} cy={yScale(d[key])} r="3.5"
              fill={colors[ki]} stroke="#fff" strokeWidth="1.5" />
          ))
        )}
        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={H + 18} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {d.day || d.month}
          </text>
        ))}
      </g>
    </svg>
  );
}

/* ── Bar chart ──────────────────────────────────────────────────────────────── */
function BarChart({ data, color = "#7c3aed", width = 500, height = 180 }) {
  const padding = { top: 10, right: 10, bottom: 28, left: 36 };
  const W = width - padding.left - padding.right;
  const H = height - padding.top - padding.bottom;
  if (!data?.length) return null;

  const maxVal = Math.max(...data.map((d) => d.subs)) || 1;
  const barW   = (W / data.length) * 0.55;
  const gap    = W / data.length;
  const yTicks = [0, Math.round(maxVal / 2), maxVal];
  const yScale = (v) => H - (v / maxVal) * H;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <g transform={`translate(${padding.left},${padding.top})`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={0} y1={yScale(t)} x2={W} y2={yScale(t)} stroke="#f3f4f6" strokeWidth="1" />
            <text x={-6} y={yScale(t) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{t}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = i * gap + gap / 2 - barW / 2;
          const y = yScale(d.subs);
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={H - y} fill={color} rx="4" opacity="0.85" />
              <text x={x + barW / 2} y={H + 18} textAnchor="middle" fontSize="10" fill="#9ca3af">
                {d.month}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ── Skeleton loader ────────────────────────────────────────────────────────── */
function Skeleton({ w = "100%", h = 20, r = 6 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard({ onTabChange }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    setLoading(true);
    dashboardApi.getAll(5)
      .then((res) => { setData(res); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div>
        <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
        <div className="ap-dash-stat-grid">
          {[1,2,3,4].map((i) => (
            <div className="ap-dash-stat-card" key={i}>
              <Skeleton w={48} h={48} r={10} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <Skeleton w="60%" h={12} />
                <Skeleton w="40%" h={22} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af" }}>
          Loading dashboard data…
        </div>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <div style={{ color: "#b91c1c", fontWeight: 600, marginBottom: 8 }}>Failed to load dashboard</div>
        <div style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>{error}</div>
        <button className="ap-btn-red" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const s = data?.stats || {};
  const m = data?.miniStats || {};

  /* ── Top stat cards ── */
  const topCards = [
    {
      label:   "Total Users",
      value:   (s.users?.total || 0).toLocaleString("en-IN"),
      icon:    Ico.usersBig,
      variant: "blue",
    },
    {
      label:   "Verified Users",
      value:   (s.users?.verified || 0).toLocaleString("en-IN"),
      icon:    Ico.userCheck,
      variant: "green",
    },
    {
      label:   "Active Matches",
      value:   (s.matches?.total || 0).toLocaleString("en-IN"),
      icon:    <HeartFilledIcon />,
      variant: "red",
    },
    {
      label:   "Revenue (₹)",
      value:   `₹${(s.revenue?.total || 0).toLocaleString("en-IN")}`,
      icon:    <RupeeIcon />,
      variant: "rupee",
    },
  ];

  return (
    <div>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* ── Top stat cards ── */}
      <div className="ap-dash-stat-grid">
        {topCards.map((c) => (
          <div className="ap-dash-stat-card" key={c.label}>
            <div className={`ap-dash-stat-icon ${c.variant}`}>{c.icon}</div>
            <div>
              <div className="ap-dash-stat-label">{c.label}</div>
              <div className="ap-dash-stat-value">{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Middle row ── */}
      <div className="ap-dash-mid">

        {/* Recent users */}
        <div className="ap-recent-card">
          <div className="ap-recent-header">
            <span className="ap-recent-title">Recent Users</span>
            <button className="ap-view-all-btn" onClick={() => onTabChange?.("users")}>
              View All {Ico.arrowRight}
            </button>
          </div>
          <div className="ap-recent-row-header">
            <span className="ap-col-label">User</span>
            <span className="ap-col-label">Status</span>
            <span className="ap-col-label">Date</span>
          </div>
          {(data?.recentUsers || []).length === 0 && (
            <div style={{ padding: "20px 0", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
              No users yet
            </div>
          )}
          {(data?.recentUsers || []).map((u) => (
            <div className="ap-recent-row" key={u._id}>
              <div>
                <div className="ap-recent-name">{u.fullName}</div>
                <div className="ap-recent-email">{u.email}</div>
              </div>
              <div>
                <Badge type={u.isVerified ? "verified" : "inactive"} label={u.isVerified ? "Verified" : "Unverified"} />
              </div>
              <div className="ap-recent-date">{u.time}</div>
            </div>
          ))}
        </div>

        {/* Right mini-cards */}
        <div className="ap-dash-right">
          <div className="ap-dash-right-card">
            <div className="ap-dash-right-icon blue">{Ico.usersBig}</div>
            <div>
              <div className="ap-dash-right-label">New Registrations</div>
              <div className="ap-dash-right-value blue">
                {(m.newRegistrations || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div className="ap-dash-right-card">
            <div className="ap-dash-right-icon green"><RupeeIcon /></div>
            <div>
              <div className="ap-dash-right-label">Active Subscriptions</div>
              <div className="ap-dash-right-value green">
                {(m.activeSubscriptions || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
          <div className="ap-dash-right-card">
            <div className="ap-dash-right-icon purple">{Ico.chat}</div>
            <div>
              <div className="ap-dash-right-label">Total Messages</div>
              <div className="ap-dash-right-value purple">
                {(m.totalMessages || 0).toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="ap-dash-charts">

        {/* Line chart */}
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">User Growth</div>
              <div className="ap-chart-subtitle">Last 7 days</div>
            </div>
            <div className="ap-chart-icon">{Ico.trendUp}</div>
          </div>
          <div className="ap-chart-wrap">
            {data?.userGrowthData?.length ? (
              <LineChart
                data={data.userGrowthData}
                keys={["newUsers", "verified"]}
                colors={["#cc0000", "#16a34a"]}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: "#9ca3af", fontSize: 13 }}>
                No data yet — register some users to see growth
              </div>
            )}
          </div>
          <div className="ap-chart-legend">
            <span className="ap-chart-legend-item">
              <span className="ap-chart-legend-dot" style={{ background: "#cc0000" }} /> New Users
            </span>
            <span className="ap-chart-legend-item">
              <span className="ap-chart-legend-dot" style={{ background: "#16a34a" }} /> Verified
            </span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="ap-chart-card">
          <div className="ap-chart-header">
            <div>
              <div className="ap-chart-title">Subscription Growth</div>
              <div className="ap-chart-subtitle">Last 6 months</div>
            </div>
            <div className="ap-chart-icon">{Ico.creditCard}</div>
          </div>
          <div className="ap-chart-wrap">
            {data?.subscriptionGrowthData?.some((d) => d.subs > 0) ? (
              <BarChart data={data.subscriptionGrowthData} color="#7c3aed" />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, color: "#9ca3af", fontSize: 13 }}>
                No paid subscriptions yet
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
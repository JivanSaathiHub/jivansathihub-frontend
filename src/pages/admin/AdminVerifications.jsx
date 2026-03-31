import { useState, useEffect, useCallback } from "react";
import { verificationsApi } from "./adminApi";
import { Ico } from "./icons";
import { Badge, Avatar, Pagination } from "./shared";

const LIMIT = 10;

/* ── Verification detail ── */
function VerifDetail({ verifId, onBack }) {
  const [verif,   setVerif]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    setLoading(true);
    verificationsApi.getById(verifId)
      .then((res) => { setVerif(res.verification); setError(""); })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [verifId]);

  if (loading) return (
    <div className="ap-detail-wrap">
      <button className="ap-verif-detail-back" onClick={onBack}>{Ico.arrowLeft} Back</button>
      <div style={{ padding: 60, textAlign: "center", color: "#9ca3af" }}>Loading…</div>
    </div>
  );

  if (error || !verif) return (
    <div className="ap-detail-wrap">
      <button className="ap-verif-detail-back" onClick={onBack}>{Ico.arrowLeft} Back</button>
      <div style={{ padding: 40, textAlign: "center", color: "#b91c1c" }}>{error || "Not found."}</div>
    </div>
  );

  return (
    <div className="ap-detail-wrap">
      <button className="ap-verif-detail-back" onClick={onBack}>
        {Ico.arrowLeft} Back to Verifications
      </button>

      <div className="ap-verif-detail-top">
        <div className="ap-verif-detail-user">
          <Avatar user={verif.user} size={56} />
          <div>
            <div className="ap-verif-detail-name">
              {verif.user.fullName}
              <Badge type="auto-verified" label="✓ Auto-Verified" />
            </div>
            <div className="ap-verif-detail-meta">
              <span className="ap-verif-detail-meta-item">{Ico.users} User ID: {verif.userId}</span>
              <span className="ap-verif-detail-meta-item">{Ico.doc} Aadhaar Verified</span>
              <span className="ap-verif-detail-meta-item">{Ico.calendar} {verif.verifiedAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-verified banner */}
      <div className="ap-verif-auto-banner">
        <div className="ap-verif-auto-icon">✓</div>
        <div>
          <div className="ap-verif-auto-title">✓ Automatically Verified via Aadhaar eKYC</div>
          <div className="ap-verif-auto-text">
            This user was instantly verified through UIDAI's official Aadhaar eKYC system.
            All details have been validated against the UIDAI database and authenticated via OTP.
          </div>
          <div className="ap-verif-auto-checks">
            {["OTP Verified", "UIDAI Validated", "Biometric Match", "Auto-Approved"].map((lbl) => (
              <span className="ap-verif-auto-check" key={lbl}>
                <span style={{ color: "#16a34a" }}>{Ico.check}</span> {lbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Two cards */}
      <div className="ap-verif-cards-grid">
        <div className="ap-verif-card">
          <div className="ap-verif-card-title">
            <span className="ap-verif-card-icon blue">{Ico.doc}</span>
            ID Document Details
          </div>
          <div className="ap-verif-field"><label>Document Type</label><p>Aadhaar Card</p></div>
          <div className="ap-verif-field"><label>Document Number</label><p>{verif.docNumber}</p></div>
          <div className="ap-verif-field"><label>Full Name (as per Aadhaar)</label><p>{verif.user.fullName}</p></div>
          <div className="ap-verif-field"><label>Father's Name</label><p>{verif.fathersName}</p></div>
          <div className="ap-verif-field-row">
            <div className="ap-verif-field"><label>Date of Birth</label><p>{verif.dob}</p></div>
            <div className="ap-verif-field"><label>Gender</label><p>{verif.gender}</p></div>
          </div>
        </div>

        <div className="ap-verif-card">
          <div className="ap-verif-card-title">
            <span className="ap-verif-card-icon purple">{Ico.users}</span>
            Personal Information
          </div>
          <div className="ap-verif-field"><label>Age</label><p>{verif.age} years</p></div>
          <div className="ap-verif-field"><label>Mobile Number</label><p>{verif.user.mobile}</p></div>
          <div className="ap-verif-field"><label>Email Address</label><p>{verif.user.email}</p></div>
          <div className="ap-verif-field"><label>Address</label><p>{verif.address}</p></div>
          <div className="ap-verif-field-row">
            <div className="ap-verif-field"><label>State</label><p>{verif.state}</p></div>
            <div className="ap-verif-field"><label>Pincode</label><p>{verif.pincode}</p></div>
          </div>
        </div>
      </div>

      {/* Verification process */}
      <div className="ap-verif-card">
        <div className="ap-verif-card-title">
          <span className="ap-verif-card-icon green">{Ico.shield}</span>
          Verification Process
        </div>
        <div className="ap-verif-field" style={{ marginBottom: 14 }}>
          <label>Verification Method</label><p>Aadhaar eKYC</p>
        </div>
        <div className="ap-verif-process-grid">
          {[
            ["OTP Verification", "Verified"],
            ["UIDAI Validation", "Validated"],
            ["Biometric Match",  "Matched"],
            ["Document Authenticity", "Verified"],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div className="ap-verif-process-label">{lbl}</div>
              <div className="ap-verif-process-item">
                <span style={{ color: "#16a34a" }}>{Ico.check}</span> {val}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Verifications list ── */
export default function AdminVerifications() {
  const [verifications, setVerifications] = useState([]);
  const [stats,         setStats]         = useState({});
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [page,          setPage]          = useState(1);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [selectedId,    setSelectedId]    = useState(null);

  /* ── Load stats once ── */
  useEffect(() => {
    verificationsApi.getStats()
      .then((res) => setStats(res.stats || {}))
      .catch(() => {});
  }, []);

  /* ── Load list ── */
  const load = useCallback(() => {
    setLoading(true);
    verificationsApi.getAll({ page, limit: LIMIT, search })
      .then((res) => {
        setVerifications(res.verifications || []);
        setTotal(res.total                 || 0);
        setTotalPages(res.totalPages       || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  if (selectedId) {
    return <VerifDetail verifId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div>
      <div className="ap-page-header">
        <div>
          <h2>ID Verifications</h2>
          <p>All users are automatically verified via Aadhaar eKYC</p>
        </div>
        <button className="ap-btn-red"
          onClick={() => verificationsApi.export().catch((e) => alert(e.message))}>
          {Ico.download} Export Report
        </button>
      </div>

      {/* Stat cards — real numbers */}
      <div className="ap-verif-stats">
        <div className="ap-verif-stat-card">
          <div className="ap-verif-stat-icon green">✓</div>
          <div>
            <div className="ap-verif-stat-label">Auto-Verified Users</div>
            <div className="ap-verif-stat-value">{(stats.autoVerified || 0).toLocaleString("en-IN")}</div>
            <div className="ap-verif-stat-sub">Via Aadhaar eKYC OTP</div>
          </div>
        </div>
        <div className="ap-verif-stat-card">
          <div className="ap-verif-stat-icon blue">🛡</div>
          <div>
            <div className="ap-verif-stat-label">Total Verifications</div>
            <div className="ap-verif-stat-value">{(stats.totalVerified || 0).toLocaleString("en-IN")}</div>
            <div className="ap-verif-stat-sub">All time</div>
          </div>
        </div>
        <div className="ap-verif-stat-card">
          <div className="ap-verif-stat-icon purple">📅</div>
          <div>
            <div className="ap-verif-stat-label">Today's Verifications</div>
            <div className="ap-verif-stat-value">{(stats.todayVerified || 0).toLocaleString("en-IN")}</div>
            <div className="ap-verif-stat-sub">New users verified</div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="ap-info-banner">
        <div className="ap-info-banner-title">🛡 Automatic Aadhaar eKYC Verification</div>
        <div className="ap-info-banner-text">
          All users are instantly verified through UIDAI's Aadhaar eKYC system using OTP verification.
          User details are automatically fetched and validated, ensuring 100% authenticity without manual intervention.
        </div>
        <div className="ap-info-banner-checks">
          {["Instant Verification", "OTP Based", "UIDAI Validated", "No Manual Review"].map((c) => (
            <span className="ap-info-banner-check" key={c}>
              <span style={{ color: "#16a34a" }}>{Ico.check}</span> {c}
            </span>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="ap-filter-bar">
        <div className="ap-search-wrap">
          <span className="ap-search-icon">{Ico.search}</span>
          <input
            className="ap-search"
            placeholder="Search by name, mobile…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select className="ap-select"><option>All ID Types</option><option>Aadhaar</option></select>
      </div>

      {/* List */}
      <div className="ap-verif-list">
        <div className="ap-verif-row-header">
          <span className="ap-col-label">User</span>
          <span className="ap-col-label">ID Details</span>
          <span className="ap-col-label">Contact</span>
          <span className="ap-col-label">Location</span>
          <span className="ap-col-label">Verified Date</span>
          <span className="ap-col-label">Status</span>
        </div>

        {loading && (
          <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Loading…</div>
        )}

        {!loading && verifications.length === 0 && (
          <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>
            {stats.autoVerified === 0 ? "No verified users yet." : "No results match your search."}
          </div>
        )}

        {!loading && verifications.map((v) => (
          <div key={v._id} className="ap-verif-user-row" onClick={() => setSelectedId(v._id)}>
            <div className="ap-user-info">
              <Avatar user={v.user} />
              <div>
                <div className="ap-user-name">
                  {v.user.fullName}
                  <span className="ap-verify-dot">{Ico.check}</span>
                </div>
                <div className="ap-user-id">ID: {v.userId}</div>
              </div>
            </div>
            <div className="ap-contact-info">
              <div className="ap-contact-row"><span className="ap-contact-icon">{Ico.doc}</span>Aadhaar</div>
              <div className="ap-contact-row" style={{ color: "#9ca3af", fontSize: 12 }}>{v.docNumber}</div>
            </div>
            <div className="ap-contact-info">
              <div className="ap-contact-row"><span className="ap-contact-icon">{Ico.phone}</span>{v.user.mobile}</div>
              <div className="ap-contact-row" style={{ color: "#9ca3af", fontSize: 12 }}>{v.dob}</div>
            </div>
            <div className="ap-contact-info">
              <div className="ap-contact-row">
                <span className="ap-contact-icon">{Ico.location}</span>
                <span style={{ fontSize: 12 }}>{v.address}</span>
              </div>
            </div>
            <div className="ap-contact-info">
              <div className="ap-contact-row">
                <span className="ap-contact-icon">{Ico.calendar}</span>
                <span style={{ fontSize: 12 }}>{v.verifiedAt}</span>
              </div>
            </div>
            <div><Badge type="auto-verified" label="✓ Auto-Verified" /></div>
          </div>
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} perPage={LIMIT} onPage={setPage} />
    </div>
  );
}
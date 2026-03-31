import { useState, useEffect } from "react";
import { profiles as dummyProfiles, profileImages } from "../../data/data";
import "./AllProfiles.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function AllProfiles({ onBack, onViewProfile }) {
  const { t }    = useTranslation();
  const { user } = useAuth();

  const [profiles,    setProfiles]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [total,       setTotal]       = useState(0);
  const [usingDummy,  setUsingDummy]  = useState(false);

  const LIMIT = 12;

  useEffect(() => {
    fetchProfiles(1);
  }, []);

  const fetchProfiles = async (pageNum) => {
    setLoading(true);
    try {
      if (user) {
        // Logged in — use real search API
        const res = await axios.get(`${API_BASE}/search`, {
          params: { page: pageNum, limit: LIMIT },
          withCredentials: true,
        });
        if (res.data?.profiles?.length) {
          setProfiles(res.data.profiles);
          setPage(res.data.page);
          setTotalPages(res.data.totalPages);
          setTotal(res.data.total);
          setUsingDummy(false);
        } else {
          useDummy();
        }
      } else {
        // Not logged in — use featured (public) endpoint
        const res = await axios.get(`${API_BASE}/search/featured`);
        if (res.data?.profiles?.length) {
          setProfiles(res.data.profiles.map((p) => ({
            ...p,
            primaryPhoto: p.primaryPhoto,
          })));
          setTotalPages(1);
          setTotal(res.data.count);
          setUsingDummy(false);
        } else {
          useDummy();
        }
      }
    } catch {
      useDummy();
    } finally {
      setLoading(false);
    }
  };

  const useDummy = () => {
    setProfiles(dummyProfiles.map((p) => ({
      ...p,
      _id:          p.id,
      fullName:     p.name,
      primaryPhoto: profileImages[p.id],
    })));
    setTotalPages(1);
    setTotal(dummyProfiles.length);
    setUsingDummy(true);
  };

  const handleBack = () => {
    if (onBack) onBack();
    setTimeout(() => {
      const el = document.getElementById("profiles");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handlePage = (next) => {
    fetchProfiles(next);
    window.scrollTo(0, 0);
  };

  const badgeClass = (badge) => {
    if (badge === "Premium")  return "badge-premium";
    if (badge === "New")      return "badge-new";
    if (badge === "Verified") return "badge-groom";
    return "badge-new";
  };

  return (
    <div className="ap-page">
      {/* ── Top bar ── */}
      <div className="ap-topbar">
        <div className="ap-topbar-inner">
          <button className="ap-back-btn" onClick={handleBack}>
            ← {t("profiles.back")}
          </button>
          {!usingDummy && (
            <span className="ap-count">
              {total} {t("profiles.found", { defaultValue: "profiles found" })}
            </span>
          )}
        </div>
      </div>

      <section className="ap-section">
        <div className="ap-header">
          <h2>{t("profiles.title")}</h2>
          <p>{t("profiles.subtitle")}</p>
        </div>

        {loading ? (
          <div className="ap-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="profile-card profile-card--skeleton">
                <div className="skeleton-photo" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--short" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="ap-grid">
              {profiles.map((p) => {
                const id    = p._id || p.id;
                const name  = p.fullName || p.name;
                const photo = p.primaryPhoto || profileImages[p.id];

                return (
                  <div key={id} className="profile-card">
                    {p.badge && (
                      <span className={`profile-badge ${badgeClass(p.badge)}`}>
                        {p.badge}
                      </span>
                    )}

                    <div className="profile-photo">
                      {photo ? (
                        <img
                          src={photo}
                          alt={name}
                          className="profile-img"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="photo-placeholder"
                        style={{ display: photo ? "none" : "flex" }}
                      >
                        <span>{name?.charAt(0)}</span>
                      </div>
                    </div>

                    <div className="profile-info">
                      <h4>{name}, {p.age}</h4>
                      <p>💼 {p.profession || p.job}</p>
                      <p>📍 {p.city}</p>
                    </div>

                    <button
                      className="view-profile-btn"
                      onClick={() => onViewProfile && onViewProfile(id)}
                    >
                      👁 {t("profiles.view")}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination (only when logged in + real data) ── */}
            {!usingDummy && totalPages > 1 && (
              <div className="ap-pagination">
                <button
                  className="ap-page-btn"
                  disabled={page <= 1}
                  onClick={() => handlePage(page - 1)}
                >
                  ← Prev
                </button>
                <span className="ap-page-info">
                  {page} / {totalPages}
                </span>
                <button
                  className="ap-page-btn"
                  disabled={page >= totalPages}
                  onClick={() => handlePage(page + 1)}
                >
                  Next →
                </button>
              </div>
            )}

            {/* ── Login nudge for guests ── */}
            {usingDummy && (
              <p className="ap-login-nudge">
                🔒 {t("profiles.loginToSeeAll", {
                  defaultValue: "Login to see all real registered profiles",
                })}
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}
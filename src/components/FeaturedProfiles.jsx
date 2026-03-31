import { useState, useEffect } from "react";
import { profiles as dummyProfiles, profileImages } from "../data/data";
import "./FeaturedProfiles.css";
import { useTranslation } from "react-i18next";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function FeaturedProfiles({ onViewProfile, onSearch }) {
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/search/featured`)
      .then((res) => {
        if (res.data?.profiles?.length) {
          setProfiles(res.data.profiles);
        } else {
          setProfiles(dummyProfiles.map((p) => ({
            ...p,
            _id:          p.id,
            fullName:     p.name,
            primaryPhoto: profileImages[p.id],
          })));
        }
      })
      .catch(() => {
        setProfiles(dummyProfiles.map((p) => ({
          ...p,
          _id:          p.id,
          fullName:     p.name,
          primaryPhoto: profileImages[p.id],
        })));
      })
      .finally(() => setLoading(false));
  }, []);

  const badgeClass = (badge) => {
    if (badge === "Premium")  return "badge-premium";
    if (badge === "New")      return "badge-new";
    if (badge === "Verified") return "badge-groom";
    return "badge-new";
  };

  /* ── Skeleton state ── */
  if (loading) {
    return (
      <section className="featured-section" id="profiles">
        <div className="section-header">
          <h2>{t("featured.title")}</h2>
          <p>{t("featured.subtitle")}</p>
        </div>
        <div className="profiles-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="profile-card profile-card--skeleton">
              <div className="skeleton-photo" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ── Loaded state ── */
  return (
    <section className="featured-section" id="profiles">
      <div className="section-header">
        <h2>{t("featured.title")}</h2>
        <p>{t("featured.subtitle")}</p>
      </div>

      <div className="profiles-grid">
        {profiles.map((p) => {
          const id    = p._id || p.id;
          const name  = p.fullName || p.name;
          const photo = p.primaryPhoto || profileImages[p.id];

          return (
            <div key={id} className="profile-card">
              {p.badge && (
                <span className={`profile-badge ${badgeClass(p.badge)}`}>
                  {t(`featured.badges.${p.badge.toLowerCase()}`, p.badge)}
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
                👁 {t("featured.viewProfile")}
              </button>
            </div>
          );
        })}
      </div>

      <div className="center-btn-wrap">
        <button
          className="btn-outline-red"
          onClick={() => onSearch && onSearch({})}
        >
          <span>{t("featured.viewAll")}</span>
        </button>
      </div>
    </section>
  );
}
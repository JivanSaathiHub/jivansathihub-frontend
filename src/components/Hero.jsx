import { useState } from "react";
import "./Hero.css";
import heroBg from "../assets/hero-bg.png";
import { useTranslation } from "react-i18next";

const LOCATIONS = [
  "",
  // States
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  // Union Territories
  "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir",
  // Major Cities
  "Mumbai", "Pune", "Nagpur", "Nashik",
  "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Surat",
  "Jaipur", "Lucknow", "Kanpur", "Agra", "Varanasi", "Patna",
  "Bhopal", "Indore", "Coimbatore", "Kochi", "Thiruvananthapuram",
  "Visakhapatnam", "Vijayawada", "Ludhiana", "Amritsar", "Jodhpur",
  "Udaipur", "Ranchi", "Bhubaneswar", "Guwahati", "Raipur", "Vadodara",
];

/* ── Wave helper ──
   Each WORD is an inline-block span — browser can break between words.
   Letters inside each word get staggered glow animation.
   Last word also gets "title-break" so mobile CSS forces it to new line.
── */
function WaveText({ text }) {
  const words = text.split(" ");
  let globalIndex = 0;

  return (
    <>
      {words.map((word, wi) => {
        const isLast = wi === words.length - 1;
        const letters = word.split("").map((char) => {
          const delay = globalIndex * 0.07;
          globalIndex++;
          return (
            <span
              key={globalIndex}
              className="wave-letter"
              style={{ animationDelay: `${delay}s` }}
            >
              {char}
            </span>
          );
        });
        if (!isLast) globalIndex++; // account for the space

        return (
          <span
            key={wi}
            className={isLast ? "wave-word title-break" : "wave-word"}
          >
            {letters}
          </span>
        );
      })}
    </>
  );
}

export default function Hero({ onSearch }) {
  const { t } = useTranslation();

  const [searchData, setSearch] = useState({
    lookingFor: "Bride", ageFrom: "18", ageTo: "60", religion: "", location: "",
  });
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => {
    const val = e.target.value;
    setSearch((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const validate = () => {
    const errs = {};
    const from = Number(searchData.ageFrom);
    const to   = Number(searchData.ageTo);

    if (!searchData.lookingFor) {
      errs.lookingFor = t("hero.errors.lookingFor");
    }
    if (!searchData.ageFrom) {
      errs.ageFrom = t("hero.errors.ageFromRequired");
    } else if (from < 18 || from > 59) {
      errs.ageFrom = t("hero.errors.ageFromRange");
    }
    if (!searchData.ageTo) {
      errs.ageTo = t("hero.errors.ageToRequired");
    } else if (to < 19 || to > 60) {
      errs.ageTo = t("hero.errors.ageToRange");
    }
    if (searchData.ageFrom && searchData.ageTo && from >= to) {
      errs.ageTo = t("hero.errors.ageCompare");
    }
    return errs;
  };

  const handleSearch = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0 && onSearch) {
      const genderMap = { Bride: "Female", Groom: "Male" };
      onSearch({
        ...searchData,
        lookingFor: genderMap[searchData.lookingFor] || searchData.lookingFor,
      });
    }
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1><WaveText text={t("hero.title")} /></h1>
        <p>{t("hero.subtitle")}</p>

        <div className="search-box">
          <div className="search-row">

            {/* Looking For */}
            <div className="search-field">
              <label>{t("hero.labels.lookingFor")}</label>
              <select
                value={searchData.lookingFor}
                onChange={update("lookingFor")}
                className={errors.lookingFor ? "field-err" : ""}
              >
                <option value="Bride">{t("hero.options.bride")}</option>
                <option value="Groom">{t("hero.options.groom")}</option>
              </select>
              {errors.lookingFor && <span className="hero-err">{errors.lookingFor}</span>}
            </div>

            {/* Age From */}
            <div className="search-field">
              <label>{t("hero.labels.ageFrom")}</label>
              <select
                value={searchData.ageFrom}
                onChange={update("ageFrom")}
                className={errors.ageFrom ? "field-err" : ""}
              >
                <option value="">{t("hero.selectAge")}</option>
                {Array.from({ length: 42 }, (_, i) => i + 18).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              {errors.ageFrom && <span className="hero-err">{errors.ageFrom}</span>}
            </div>

            {/* Age To */}
            <div className="search-field">
              <label>{t("hero.labels.ageTo")}</label>
              <select
                value={searchData.ageTo}
                onChange={update("ageTo")}
                className={errors.ageTo ? "field-err" : ""}
              >
                <option value="">{t("hero.selectAge")}</option>
                {Array.from({ length: 42 }, (_, i) => i + 18).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              {errors.ageTo && <span className="hero-err">{errors.ageTo}</span>}
            </div>

            {/* Religion */}
            <div className="search-field">
              <label>{t("hero.labels.religion")}</label>
              <select value={searchData.religion} onChange={update("religion")}>
                <option value="">{t("hero.options.any")}</option>
                <option value="Hindu">{t("hero.options.hindu")}</option>
                <option value="Muslim">{t("hero.options.muslim")}</option>
                <option value="Christian">{t("hero.options.christian")}</option>
                <option value="Sikh">{t("hero.options.sikh")}</option>
                <option value="Jain">{t("hero.options.jain")}</option>
              </select>
            </div>

          </div>

          {/* Location */}
          <div className="search-row2">
            <select
              className="search-location"
              value={searchData.location}
              onChange={update("location")}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc || t("hero.locationPlaceholder")}
                </option>
              ))}
            </select>
          </div>

          <button className="search-btn" onClick={handleSearch}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {t("hero.searchBtn")}
          </button>
        </div>
      </div>
    </section>
  );
}
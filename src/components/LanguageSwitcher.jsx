import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.css";

const LANGUAGES = [
  { code: "en", label: "EN", full: "English" },
  { code: "hi", label: "हि", full: "हिंदी"   },
  { code: "mr", label: "म",  full: "मराठी"   },
];

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current  = i18n.language?.slice(0, 2) || "en";

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("jsh_lang", code);
  };

  return (
    <div className="lang-switcher" title={t("lang.change")}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`lang-btn ${current === lang.code ? "active" : ""}`}
          onClick={() => handleChange(lang.code)}
          aria-label={lang.full}
          title={lang.full}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
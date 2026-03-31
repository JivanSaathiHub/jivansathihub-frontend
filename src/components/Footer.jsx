import "./Footer.css";
import logoIcon from "../assets/logo-icon.png";
import fbIcon from "../assets/a.png";
import igIcon from "../assets/a1.png";
import twIcon from "../assets/a2.png";
import ytIcon from "../assets/a3.png";
import { useFooterNav } from "../context/FooterNavContext";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const onNavigate = useFooterNav();
  const { t } = useTranslation();

  const go = (key) => () => {
    if (onNavigate) onNavigate(key);
  };

  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logoIcon} alt="JeevanSaathiHub logo" className="footer-logo-icon" />
            <span>JeevanSaathiHub</span>
          </div>
          <p>{t("footer.description")}</p>

          <div className="footer-socials">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" title={t("footer.social.facebook")}>
              <img src={fbIcon} alt="Facebook" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" title={t("footer.social.instagram")}>
              <img src={igIcon} alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title={t("footer.social.twitter")}>
              <img src={twIcon} alt="Twitter" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" title={t("footer.social.youtube")}>
              <img src={ytIcon} alt="YouTube" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h5>{t("footer.quickLinks")}</h5>
          <button className="footer-link-btn" onClick={go("home")}>{t("footer.links.home")}</button>
          <button className="footer-link-btn" onClick={go("search")}>{t("footer.links.searchProfiles")}</button>
          <button className="footer-link-btn" onClick={go("home")}>{t("footer.links.successStories")}</button>
          <button className="footer-link-btn" onClick={go("help")}>{t("footer.links.helpCenter")}</button>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <h5>{t("footer.legal")}</h5>
          <button className="footer-link-btn" onClick={go("about")}>{t("footer.links.aboutUs")}</button>
          <button className="footer-link-btn" onClick={go("privacy-policy")}>{t("footer.links.privacyPolicy")}</button>
          <button className="footer-link-btn" onClick={go("terms")}>{t("footer.links.terms")}</button>
          <button className="footer-link-btn" onClick={go("refund-policy")}>{t("footer.links.refundPolicy")}</button>
          <button className="footer-link-btn" onClick={go("cookie-policy")}>{t("footer.links.cookiePolicy")}</button>
        </div>

        {/* Contact Us */}
        <div className="footer-col">
          <h5>{t("footer.contactUs")}</h5>

          <div className="footer-contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <polyline points="2,4 12,13 22,4"/>
            </svg>
            <span>{t("footer.contact.email")}</span>
          </div>

          <div className="footer-contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.1 5.18 2 2 0 015.09 3h3a2 2 0 012 1.72c.13 1 .37 1.97.72 2.9a2 2 0 01-.45 2.11L9.09 11a16 16 0 006.91 6.91l1.27-1.27a2 2 0 012.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0122 16.92z"/>
            </svg>
            <span>{t("footer.contact.phone")}</span>
          </div>

          <div className="footer-contact-item">
            <svg className="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <span>{t("footer.contact.location")}</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          {t("footer.copyright")}{" "}
          <span className="footer-heart">❤</span>
        </p>
      </div>
    </footer>
  );
}
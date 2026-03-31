import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import API from "../../api/axios";
import "./HelpPage.css";

/* ════════════════════════════════════════
   SVG ICONS — thin-stroke, matches project
════════════════════════════════════════ */
const IcoChat = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IcoMail = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const IcoPhone = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 4.18
             2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81
             a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27
             a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IcoSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IcoUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IcoFilter = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IcoHeart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
             a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
             1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IcoStar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                     12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IcoShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IcoLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IcoImage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const IcoCreditCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const IcoBan = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
);

const IcoRefund = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-3.91"/>
  </svg>
);

const IcoSmartphone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const IcoGlobe = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10
             15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const IcoArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const IcoCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#22c55e"/>
    <polyline points="6 12 10 16 18 8"
      stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const IcoSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ════════════════════════════════════════
   FAQ CATEGORIES
════════════════════════════════════════ */
const FAQ_CATEGORIES = [
  {
    id: "account",
    icon: <IcoUser />,
    labelKey: "help.faq.categories.account",
    faqs: [
      { qKey: "help.faq.account.q1", aKey: "help.faq.account.a1" },
      { qKey: "help.faq.account.q2", aKey: "help.faq.account.a2" },
      { qKey: "help.faq.account.q3", aKey: "help.faq.account.a3" },
      { qKey: "help.faq.account.q4", aKey: "help.faq.account.a4" },
      { qKey: "help.faq.account.q5", aKey: "help.faq.account.a5" },
    ],
  },
  {
    id: "search",
    icon: <IcoFilter />,
    labelKey: "help.faq.categories.search",
    faqs: [
      { qKey: "help.faq.search.q1", aKey: "help.faq.search.a1" },
      { qKey: "help.faq.search.q2", aKey: "help.faq.search.a2" },
      { qKey: "help.faq.search.q3", aKey: "help.faq.search.a3" },
      { qKey: "help.faq.search.q4", aKey: "help.faq.search.a4" },
    ],
  },
  {
    id: "connect",
    icon: <IcoHeart />,
    labelKey: "help.faq.categories.connect",
    faqs: [
      { qKey: "help.faq.connect.q1", aKey: "help.faq.connect.a1" },
      { qKey: "help.faq.connect.q2", aKey: "help.faq.connect.a2" },
      { qKey: "help.faq.connect.q3", aKey: "help.faq.connect.a3" },
      { qKey: "help.faq.connect.q4", aKey: "help.faq.connect.a4" },
    ],
  },
  {
    id: "membership",
    icon: <IcoStar />,
    labelKey: "help.faq.categories.membership",
    faqs: [
      { qKey: "help.faq.membership.q1", aKey: "help.faq.membership.a1" },
      { qKey: "help.faq.membership.q2", aKey: "help.faq.membership.a2" },
      { qKey: "help.faq.membership.q3", aKey: "help.faq.membership.a3" },
      { qKey: "help.faq.membership.q4", aKey: "help.faq.membership.a4" },
      { qKey: "help.faq.membership.q5", aKey: "help.faq.membership.a5" },
    ],
  },
  {
    id: "safety",
    icon: <IcoShield />,
    labelKey: "help.faq.categories.safety",
    faqs: [
      { qKey: "help.faq.safety.q1", aKey: "help.faq.safety.a1" },
      { qKey: "help.faq.safety.q2", aKey: "help.faq.safety.a2" },
      { qKey: "help.faq.safety.q3", aKey: "help.faq.safety.a3" },
      { qKey: "help.faq.safety.q4", aKey: "help.faq.safety.a4" },
    ],
  },
];

/* ── Contact cards with SVG icons + wired actions ── */
const CONTACT_CARDS = [
  {
    icon:        <IcoChat />,
    titleKey:    "help.contact.chat.title",
    descKey:     "help.contact.chat.desc",
    detailKey:   "help.contact.chat.detail",
    actionKey:   "help.contact.chat.action",
    highlight:   true,
    onClick:     () => { alert("Live chat coming soon"); },
  },
  {
    icon:        <IcoMail />,
    titleKey:    "help.contact.email.title",
    descKey:     "help.contact.email.desc",
    detailKey:   "help.contact.email.detail",
    actionKey:   "help.contact.email.action",
    highlight:   false,
    onClick:     () => { window.location.href = "mailto:support@jeevansaathihub.com"; },
  },
  {
    icon:        <IcoPhone />,
    titleKey:    "help.contact.phone.title",
    descKey:     "help.contact.phone.desc",
    detailKey:   "help.contact.phone.detail",
    actionKey:   "help.contact.phone.action",
    highlight:   false,
    onClick:     () => { window.location.href = "tel:+918000000000"; },
  },
];

/* ── Quick links with SVG icons ── */
const QUICK_LINKS = [
  { icon: <IcoLock />,       labelKey: "help.quickLinks.resetPassword" },
  { icon: <IcoImage />,      labelKey: "help.quickLinks.uploadPhotos"  },
  { icon: <IcoCreditCard />, labelKey: "help.quickLinks.upgradePremium"},
  { icon: <IcoShield />,     labelKey: "help.quickLinks.verifyProfile" },
  { icon: <IcoBan />,        labelKey: "help.quickLinks.blockMember"   },
  { icon: <IcoRefund />,     labelKey: "help.quickLinks.requestRefund" },
  { icon: <IcoSmartphone />, labelKey: "help.quickLinks.downloadApp"   },
  { icon: <IcoGlobe />,      labelKey: "help.quickLinks.changeLanguage"},
];

/* ════════════════════════════════════════
   ACCORDION ITEM
════════════════════════════════════════ */
function AccordionItem({ faq, isOpen, onToggle }) {
  const { t } = useTranslation();
  return (
    <div className={`accordion-item ${isOpen ? "open" : ""}`}>
      <button className="accordion-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <span className="accordion-q">{t(faq.qKey)}</span>
        <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
      </button>
      <div className="accordion-body">
        <p>{t(faq.aKey)}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function HelpPage({ onRegister, onLogin, onBack, onHelp, onMenuClick }) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("account");
  const [openFaq,        setOpenFaq]        = useState(null);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [formData,       setFormData]       = useState({ name: "", email: "", subject: "", message: "" });
  const [formSent,       setFormSent]       = useState(false);
  const [formSending,    setFormSending]    = useState(false);
  const [formError,      setFormError]      = useState("");

  const currentCategory = FAQ_CATEGORIES.find((c) => c.id === activeCategory);
  const currentFaqs     = currentCategory?.faqs || [];

  /* Search across all FAQs */
  const filteredFaqs = searchQuery.trim()
    ? FAQ_CATEGORIES.flatMap((cat) =>
        cat.faqs
          .filter((f) => {
            const q = searchQuery.toLowerCase();
            return t(f.qKey).toLowerCase().includes(q) || t(f.aKey).toLowerCase().includes(q);
          })
          .map((f) => ({ ...f, catLabelKey: cat.labelKey, catIcon: cat.icon }))
      )
    : null;

  const handleToggle     = (idx) => setOpenFaq(openFaq === idx ? null : idx);
  const handleFormChange = (e)   => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSending(true);
    try {
      await API.post("/contact", formData);
      setFormSent(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setFormError("Something went wrong. Please try again or email us directly.");
    } finally {
      setFormSending(false);
    }
  };

  return (
    <div className="help-page">
      <Navbar
        onRegisterClick={onRegister}
        onLoginClick={onLogin}
        onHelpClick={onHelp}
        onHomeClick={onBack}
        onMenuClick={onMenuClick}
       onAboutClick={() => typeof onMenuClick === "function" && onMenuClick("about")}
      />

      {/* ── HERO ── */}
      <section className="help-hero">
        <div className="help-hero-inner">
          <div className="help-hero-badge">{t("help.hero.badge")}</div>
          <h1 className="help-hero-title">
            {t("help.hero.title1")}{" "}
            <span className="accent">{t("help.hero.titleAccent")}</span>{" "}
            {t("help.hero.title2")}
          </h1>
          <p className="help-hero-sub">{t("help.hero.subtitle")}</p>
          <div className="help-search-wrap">
            <span className="search-icon-svg"><IcoSearch /></span>
            <input
              className="help-search-input"
              type="text"
              placeholder={t("help.hero.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenFaq(null); }}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>
        </div>
        <div className="help-hero-shapes" aria-hidden="true">
          <span className="shape s1"/><span className="shape s2"/><span className="shape s3"/>
        </div>
      </section>

      {/* ── SEARCH RESULTS ── */}
      {filteredFaqs && (
        <section className="help-section help-search-results">
          <div className="help-container">
            <h2 className="section-title">
              {filteredFaqs.length > 0
                ? t("help.search.resultsFound", { count: filteredFaqs.length, query: searchQuery })
                : t("help.search.noResults",    { query: searchQuery })}
            </h2>
            {filteredFaqs.length === 0 && (
              <p className="no-results-hint">
                {t("help.search.tryDifferent")}{" "}
                <button className="inline-link" onClick={() => setSearchQuery("")}>
                  {t("help.search.browseAll")}
                </button>
              </p>
            )}
            <div className="accordion-list">
              {filteredFaqs.map((faq, i) => (
                <div key={i}>
                  <div className="faq-cat-tag">
                    <span className="faq-cat-icon">{faq.catIcon}</span>
                    {t(faq.catLabelKey)}
                  </div>
                  <AccordionItem
                    faq={faq}
                    isOpen={openFaq === `s-${i}`}
                    onToggle={() => handleToggle(`s-${i}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ CATEGORIES ── */}
      {!filteredFaqs && (
        <section className="help-section faq-section">
          <div className="help-container">
            <div className="section-header">
              <h2 className="section-title">{t("help.faq.title")}</h2>
              <p className="section-sub">{t("help.faq.subtitle")}</p>
            </div>
            <div className="faq-tabs" role="tablist">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`faq-tab ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
                >
                  <span className="tab-icon">{cat.icon}</span>
                  <span className="tab-label">{t(cat.labelKey)}</span>
                </button>
              ))}
            </div>
            <div className="accordion-list">
              {currentFaqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  faq={faq}
                  isOpen={openFaq === i}
                  onToggle={() => handleToggle(i)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── QUICK LINKS ── */}
      <section className="help-section quick-links-section">
        <div className="help-container">
          <div className="section-header">
            <h2 className="section-title">{t("help.quickLinks.title")}</h2>
          </div>
          <div className="quick-links-grid">
            {QUICK_LINKS.map((item, i) => (
              <button key={i} className="quick-link-card">
                <span className="ql-icon">{item.icon}</span>
                <span className="ql-label">{t(item.labelKey)}</span>
                <span className="ql-arrow"><IcoArrow /></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="help-section contact-section">
        <div className="help-container">
          <div className="section-header">
            <h2 className="section-title">{t("help.contact.title")}</h2>
            <p className="section-sub">{t("help.contact.subtitle")}</p>
          </div>
          <div className="contact-cards-grid">
            {CONTACT_CARDS.map((card, i) => (
              <div key={i} className={`contact-card ${card.highlight ? "highlighted" : ""}`}>
                <div className="contact-card-icon">{card.icon}</div>
                <h3 className="contact-card-title">{t(card.titleKey)}</h3>
                <p className="contact-card-desc">{t(card.descKey)}</p>
                <p className="contact-card-detail">{t(card.detailKey)}</p>
                <button
                  className={`contact-card-btn ${card.highlight ? "btn-solid" : "btn-outline"}`}
                  onClick={card.onClick}
                >
                  {t(card.actionKey)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section className="help-section form-section">
        <div className="help-container form-container">
          <div className="form-info">
            <h2 className="section-title">{t("help.form.title")}</h2>
            <p className="section-sub">{t("help.form.subtitle")}</p>
            <ul className="form-promises">
              <li><IcoCheck /> {t("help.form.promise1")}</li>
              <li><IcoCheck /> {t("help.form.promise2")}</li>
              <li><IcoCheck /> {t("help.form.promise3")}</li>
              <li><IcoCheck /> {t("help.form.promise4")}</li>
            </ul>
          </div>

          <div className="form-card">
            {formSent ? (
              <div className="form-success">
                <div className="success-icon-wrap">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                    stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3>{t("help.form.successTitle")}</h3>
                <p>{t("help.form.successMessage")}</p>
                <button className="btn-solid" onClick={() => setFormSent(false)}>
                  {t("help.form.sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hp-name">{t("help.form.nameLabel")} <span>*</span></label>
                    <input id="hp-name" name="name" type="text" required
                      placeholder={t("help.form.namePlaceholder")}
                      value={formData.name} onChange={handleFormChange}/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="hp-email">{t("help.form.emailLabel")} <span>*</span></label>
                    <input id="hp-email" name="email" type="email" required
                      placeholder={t("help.form.emailPlaceholder")}
                      value={formData.email} onChange={handleFormChange}/>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="hp-subject">{t("help.form.subjectLabel")} <span>*</span></label>
                  <select id="hp-subject" name="subject" required
                    value={formData.subject} onChange={handleFormChange}>
                    <option value="">{t("help.form.subjectPlaceholder")}</option>
                    <option value="account">{t("help.form.subjectAccount")}</option>
                    <option value="payment">{t("help.form.subjectPayment")}</option>
                    <option value="match">{t("help.form.subjectMatch")}</option>
                    <option value="safety">{t("help.form.subjectSafety")}</option>
                    <option value="other">{t("help.form.subjectOther")}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="hp-message">{t("help.form.messageLabel")} <span>*</span></label>
                  <textarea id="hp-message" name="message" rows={5} required
                    placeholder={t("help.form.messagePlaceholder")}
                    value={formData.message} onChange={handleFormChange}/>
                </div>
                <button type="submit" className="btn-solid form-submit" disabled={formSending}>
                  <IcoSend /> {formSending ? "Sending…" : t("help.form.submitButton")}
                </button>
                {formError && (
                  <p style={{ color: "#dc2626", fontSize: "14px", marginTop: "8px" }}>{formError}</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER — same as all other pages ── */}
      <Footer />
    </div>
  );
}
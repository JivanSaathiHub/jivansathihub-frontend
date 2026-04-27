import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import supportApi from "../../api/SupportApi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./SupportTickets.css";

export default function UserSupport({
  onBack,
  goLogin,
  goRegister,
  goHelp,
  onMenuClick,
  goAbout,
  onViewProfile,
  onPlanClick,
}) {
  // ✅ Use support namespace
  const { t } = useTranslation("support");

  /* ── Categories ───────────────── */
  const CATEGORIES = [
    t("categories.technical"),
    t("categories.payment"),
    t("categories.account"),
    t("categories.general"),
    t("categories.feature"),
  ];

  const [form, setForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "medium",
  });

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ── Load Tickets ───────────────── */
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await supportApi.getMyTickets();
      setTickets(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Submit Ticket ───────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await supportApi.create(form);

      setForm({
        subject: "",
        category: "",
        message: "",
        priority: "medium",
      });

      loadTickets();

      alert(t("success")); // ✅ correct translation
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Navbar ── */}
      <div className="ap-page">
        <Navbar
          onHomeClick={onBack}
          onLoginClick={goLogin}
          onRegisterClick={goRegister}
          onHelpClick={goHelp}
          onMenuClick={onMenuClick}
          onAboutClick={goAbout}
          onViewProfile={onViewProfile}
          onPlanClick={onPlanClick}
        />
      </div>

      <div className="us-container">

        {/* ── Form Section ── */}
        <div className="us-card">
          <h2 className="us-title">
            {t("createTicket")}
          </h2>

          <form onSubmit={handleSubmit} className="us-form">
            <input
              type="text"
              placeholder={t("subject")}
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              required
            />

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            >
              <option value="">{t("selectCategory")}</option>
              {CATEGORIES.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))} 
            </select>

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option value="high">{t("priority.high")}</option>
              <option value="medium">{t("priority.medium")}</option>
              <option value="low">{t("priority.low")}</option>
            </select>

            <textarea
              placeholder={t("message")}
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>

        {/* ── Ticket List ── */}
        <div className="us-card">
          <h2 className="us-title">
            {t("myTickets")}
          </h2>

          {loading && <p>{t("loading")}</p>}

          {!loading && tickets.length === 0 && (
            <p className="us-empty">
              {t("noTickets")}
            </p>
          )}

          {!loading &&
            tickets.map((ticket) => (
              <div key={ticket._id} className="us-ticket">

                <div className="us-ticket-top">
                  <strong>{ticket.subject}</strong>

                  <span className={`status ${ticket.status}`}>
                    {ticket.status || t("pending")}
                  </span>
                </div>

                <div className="us-ticket-meta">
                  <span>{ticket.category}</span>

                  <span className={`priority ${ticket.priority}`}>
                    {t(`priority.${ticket.priority}`)}
                  </span>
                </div>

                <p>{ticket.message}</p>

                <div className="us-date">
                  {new Date(ticket.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
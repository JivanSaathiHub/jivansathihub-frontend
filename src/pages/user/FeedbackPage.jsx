import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./FeedbackPage.css";

export default function Feedback() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    rating: 0,
    message: ""
  });

  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const maxChars = 250;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) return;

    setLoading(true);

    setTimeout(() => {
      console.log("Premium Feedback:", form);

      setLoading(false);
      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        category: "",
        rating: 0,
        message: ""
      });
    }, 1200);
  };

  const emojis = ["😡", "😕", "😐", "😊", "😍"];

  return (
    <section className="feedback-section">
      <div className="feedback-card">

        <h2>✨ {t("feedback.title")}</h2>
        <p className="subtitle">{t("feedback.subtitle")}</p>

        {submitted && (
          <div className="success-msg">
            🎉 {t("feedback.success")}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="input-group">
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
            />
            <label>{t("feedback.name")}</label>
          </div>

          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
            />
            <label>{t("feedback.email")}</label>
          </div>

          {/* Category */}
          <div className="category">
            <span>{t("feedback.selectType")}</span>

            {["bug", "suggestion", "experience"].map((cat) => (
              <button
                type="button"
                key={cat}
                className={form.category === cat ? "active" : ""}
                onClick={() => setForm({ ...form, category: cat })}
              >
                {t(`feedback.category.${cat}`)} {/* ✅ FIXED */}
              </button>
            ))}
          </div>

          {/* Emoji Rating */}
          <div className="emoji-rating">
            {emojis.map((emoji, index) => (
              <span
                key={index}
                className={(hover || form.rating) === index + 1 ? "active" : ""}
                onClick={() => setForm({ ...form, rating: index + 1 })}
                onMouseEnter={() => setHover(index + 1)}
                onMouseLeave={() => setHover(0)}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* Stars */}
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= (hover || form.rating) ? "active" : ""}
                onClick={() => setForm({ ...form, rating: star })}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>

          {/* Message */}
          <div className="input-group">
            <textarea
              name="message"
              maxLength={maxChars}
              required
              value={form.message}
              onChange={handleChange}
            />
            <label>{t("feedback.message")}</label>
            <small className="char-count">
              {form.message.length}/{maxChars}
            </small>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading
              ? t("feedback.submitting")
              : t("feedback.submit")}
          </button>

        </form>
      </div>
    </section>
  );
}
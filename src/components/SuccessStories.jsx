import { useState, useEffect, useRef } from "react";
import { io }   from "socket.io-client";
import { useTranslation } from "react-i18next";
import "./SuccessStories.css";

export default function SuccessStories() {
  const { t } = useTranslation();
  const [stories, setStories] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animDir, setAnimDir] = useState("");
  const socketRef = useRef(null);

  /* ── Fetch stories ── */
  const fetchStories = () => {
    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/stories`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStories(data.data);
          setCurrent(0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStories();

    /* ── Socket.io — listen for story updates ── */
    const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("stories_updated", ({ action, story, storyId }) => {
      if (action === "created") {
        if (story.status === "published") {
          setStories((prev) => [story, ...prev]);
          setCurrent(0);
        }
      } else if (action === "updated") {
        setStories((prev) => {
          const exists = prev.find((s) => s._id === story._id);
          if (story.status === "published") {
            return exists
              ? prev.map((s) => (s._id === story._id ? story : s))
              : [story, ...prev];
          } else {
            return prev.filter((s) => s._id !== story._id);
          }
        });
        setCurrent((c) => Math.max(0, c));
      } else if (action === "deleted") {
        setStories((prev) => prev.filter((s) => s._id !== storyId));
        setCurrent((c) => Math.max(0, c - 1));
      }
    });

    return () => socket.disconnect();
  }, []);

  const go = (dir) => {
    if (!stories.length) return;
    setAnimDir(dir);
    setTimeout(() => {
      setCurrent((c) =>
        dir === "left"
          ? c === 0 ? stories.length - 1 : c - 1
          : c === stories.length - 1 ? 0 : c + 1
      );
      setAnimDir("");
    }, 200);
  };

  const s = stories[current];

  return (
    <section className="stories-section" id="stories">
      <div className="section-header">
        <h2>{t("stories.title")}</h2>
        <p>{t("stories.subtitle")}</p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: 14 }}>
          Loading stories…
        </div>
      )}

      {!loading && stories.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af", fontSize: 14 }}>
          No stories published yet.
        </div>
      )}

      {!loading && stories.length > 0 && (
        <div className="story-slider-wrap">
          <button className="story-arrow story-arrow-left" onClick={() => go("left")} aria-label="Previous">
            &#8249;
          </button>

          <div
            className="story-card"
            style={{
              opacity:    animDir ? 0 : 1,
              transform:  animDir === "left"  ? "translateX(-16px)"
                        : animDir === "right" ? "translateX(16px)"
                        : "translateX(0)",
              transition: "opacity .2s ease, transform .2s ease",
            }}
          >
            <div className="story-photo">
              {s.image
                ? <img src={s.image} alt={s.coupleName} className="story-img" />
                : <div style={{ fontSize: 56, opacity: .5 }}>💑</div>
              }
            </div>
            <div className="story-text">
              <div className="story-quote-icon">❝❞</div>
              {s.story && <p className="story-quote">"{s.story}"</p>}
              <div className="story-author">
                <strong>{s.coupleName}</strong>
                {s.location     && <span className="story-city">{s.location}</span>}
                {s.marriageDate && <span className="story-married">Married {s.marriageDate}</span>}
              </div>
            </div>
          </div>

          <button className="story-arrow story-arrow-right" onClick={() => go("right")} aria-label="Next">
            &#8250;
          </button>

          {stories.length > 1 && (
            <div style={{
              width: "100%", display: "flex", justifyContent: "center",
              gap: 8, marginTop: 16, paddingLeft: 60, paddingRight: 60,
            }}>
              {stories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Story ${i + 1}`}
                  style={{
                    width: i === current ? 20 : 8,
                    height: 8, borderRadius: 99, border: "none", padding: 0, cursor: "pointer",
                    background: i === current ? "var(--red, #e11d48)" : "#fecdd3",
                    transition: "all .25s",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
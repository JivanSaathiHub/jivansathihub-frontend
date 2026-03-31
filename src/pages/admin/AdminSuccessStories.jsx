import { useState, useRef, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
/* No separate CSS import — all styles live in your global admin.css */

const apiFetch = (path, opts = {}) =>
  fetch(`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/stories${path}`, {
    credentials: "include",
    ...opts,
    headers: { ...opts.headers },
  });

/* ══════════════ ICONS ══════════════ */
const IcoHeart = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IcoCal = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IcoPin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IcoEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoPen = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IcoTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);
const IcoPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcoImgPh = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/* ══════════════ VIEW MODAL ══════════════ */
function ViewModal({ story, onClose }) {
  return (
    <div className="ss-modal-backdrop" onClick={onClose}>
      <div className="ss-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="ss-modal-header">
          <span className="ss-modal-title">Success Story</span>
          <button className="ss-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ss-modal-divider" />
        <div className="ss-modal-body">
          <div className="ss-view-img-box">
            {story.image
              ? <img src={story.image} alt={story.coupleName} className="ss-view-img" />
              : <IcoImgPh />
            }
          </div>
          <div className="ss-view-info">
            <div className="ss-view-couple-name">{story.coupleName}</div>
            <div className="ss-view-meta-list">
              {story.groomName && story.brideName && (
                <div className="ss-view-meta-item"><IcoHeart /><span>{story.groomName} &amp; {story.brideName}</span></div>
              )}
              {story.marriageDate && (
                <div className="ss-view-meta-item"><IcoCal /><span>Married on {story.marriageDate}</span></div>
              )}
              {story.location && (
                <div className="ss-view-meta-item"><IcoPin /><span>{story.location}</span></div>
              )}
            </div>
            {story.story && (
              <div className="ss-view-story-box">
                <p className="ss-view-story-text">{story.story}</p>
              </div>
            )}
          </div>
        </div>
        <div className="ss-modal-divider" />
        <div className="ss-modal-footer">
          <button className="ss-btn-close-full" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ ADD / EDIT MODAL ══════════════ */
function AddModal({ story, onClose, onSaved }) {
  const isEdit = !!story;
  const [form, setForm] = useState({
    coupleName:   story?.coupleName   || "",
    groomName:    story?.groomName    || "",
    brideName:    story?.brideName    || "",
    marriageDate: story?.marriageDate || "",
    location:     story?.location     || "",
    storyText:    story?.story        || "",
    status:       story?.status       || "published",
    imagePreview: story?.image        || null,
    imageFile:    null,
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const fileRef = useRef();
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImg = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    set("imageFile", f);
    const reader = new FileReader();
    reader.onload = (ev) => set("imagePreview", ev.target.result);
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    setError("");
    if (!form.coupleName.trim()) { setError("Couple name is required."); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append("coupleName",   form.coupleName.trim());
    fd.append("groomName",    form.groomName.trim());
    fd.append("brideName",    form.brideName.trim());
    fd.append("marriageDate", form.marriageDate.trim());
    fd.append("location",     form.location.trim());
    fd.append("story",        form.storyText.trim());
    fd.append("status",       form.status);
    if (form.imageFile) fd.append("image", form.imageFile);
    try {
      const res  = isEdit
        ? await apiFetch(`/${story._id}`, { method: "PUT",  body: fd })
        : await apiFetch("/",             { method: "POST", body: fd });
      const data = await res.json();
      if (!data.success) { setError(data.message || "Something went wrong."); return; }
      onSaved(data.data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ss-modal-backdrop" onClick={onClose}>
      <div className="ss-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="ss-modal-header">
          <span className="ss-modal-title">{isEdit ? "Edit Success Story" : "Add Success Story"}</span>
          <button className="ss-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ss-modal-divider" />
        <div className="ss-modal-body ss-modal-body-add">
          {error && <div className="ap-error">{error}</div>}

          <div className="ss-add-field">
            <label className="ss-add-label">Story Image</label>
            <div className="ss-img-upload-box" onClick={() => fileRef.current.click()}>
              {form.imagePreview
                ? <img src={form.imagePreview} alt="preview" className="ss-img-preview" />
                : (
                  <>
                    <IcoImgPh />
                    <p className="ss-img-upload-text">Click to upload couple photo</p>
                    <p className="ss-img-upload-sub">PNG, JPG, WebP — up to 5 MB</p>
                  </>
                )
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImg} />
          </div>

          <div className="ss-add-field">
            <label className="ss-add-label">Couple Name *</label>
            <input className="ss-add-input" placeholder="e.g., Rajesh & Priya"
              value={form.coupleName} onChange={(e) => set("coupleName", e.target.value)} />
          </div>

          <div className="ss-add-row-2">
            <div className="ss-add-field">
              <label className="ss-add-label">Groom Name</label>
              <input className="ss-add-input" placeholder="Groom's full name"
                value={form.groomName} onChange={(e) => set("groomName", e.target.value)} />
            </div>
            <div className="ss-add-field">
              <label className="ss-add-label">Bride Name</label>
              <input className="ss-add-input" placeholder="Bride's full name"
                value={form.brideName} onChange={(e) => set("brideName", e.target.value)} />
            </div>
          </div>

          <div className="ss-add-row-2">
            <div className="ss-add-field">
              <label className="ss-add-label">Marriage Date</label>
              <input className="ss-add-input" type="date"
                value={form.marriageDate} onChange={(e) => set("marriageDate", e.target.value)} />
            </div>
            <div className="ss-add-field">
              <label className="ss-add-label">Location</label>
              <input className="ss-add-input" placeholder="City, State"
                value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
          </div>

          <div className="ss-add-field">
            <label className="ss-add-label">Status</label>
            <select className="ss-add-input" value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="ss-add-field">
            <label className="ss-add-label">Their Story</label>
            <textarea className="ss-add-input ss-add-textarea" placeholder="Share their love story…"
              value={form.storyText} onChange={(e) => set("storyText", e.target.value)} />
          </div>
        </div>
        <div className="ss-modal-divider" />
        <div className="ss-modal-footer ss-modal-footer-add">
          <button className="ss-btn-cancel" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="ss-btn-add" onClick={submit} disabled={saving}>
            {saving ? "Saving…" : (isEdit ? "Save Changes" : "Add Story")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ DELETE MODAL ══════════════ */
function DeleteModal({ story, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const confirm = async () => {
    setDeleting(true);
    try {
      const res  = await apiFetch(`/${story._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) onDeleted(story._id);
    } catch { /* silent */ } finally { setDeleting(false); }
  };

  return (
    <div className="ss-modal-backdrop" onClick={onClose}>
      <div className="ss-modal-box ss-modal-box-sm" onClick={(e) => e.stopPropagation()}>
        <div className="ss-modal-header">
          <span className="ss-modal-title">Delete Story</span>
          <button className="ss-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="ss-modal-divider" />
        <div className="ss-delete-body">
          <div className="ss-delete-icon">🗑️</div>
          <p className="ss-delete-text">
            Are you sure you want to delete <strong>{story.coupleName}</strong>'s success story?{" "}
            This action cannot be undone.
          </p>
        </div>
        <div className="ss-modal-divider" />
        <div className="ss-modal-footer ss-modal-footer-add">
          <button className="ss-btn-cancel" onClick={onClose} disabled={deleting}>Cancel</button>
          <button className="ss-btn-delete" onClick={confirm} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AdminSuccessStories() {
  const [stories,     setStories]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [fetchError,  setFetchError]  = useState("");
  const [search,      setSearch]      = useState("");
  const [viewStory,   setViewStory]   = useState(null);
  const [editStory,   setEditStory]   = useState(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [deleteStory, setDeleteStory] = useState(null);

  const fetchStories = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res  = await apiFetch("?all=true");
      const data = await res.json();
      if (data.success) setStories(data.data);
      else setFetchError(data.message || "Failed to load stories.");
    } catch {
      setFetchError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();

    /* ── Socket.io — auto refresh admin panel ── */
    const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("stories_updated", ({ action, story, storyId }) => {
      if (action === "created") {
        setStories((prev) => [story, ...prev]);
      } else if (action === "updated") {
        setStories((prev) =>
          prev.map((s) => (s._id === story._id ? story : s))
        );
      } else if (action === "deleted") {
        setStories((prev) => prev.filter((s) => s._id !== storyId));
      }
    });

    return () => socket.disconnect();
  }, [fetchStories]);

  const filtered = stories.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.coupleName.toLowerCase().includes(q) || s.location?.toLowerCase().includes(q);
  });

  const handleSaved = (saved) => {
    setStories((prev) => {
      const exists = prev.find((s) => s._id === saved._id);
      return exists
        ? prev.map((s) => (s._id === saved._id ? saved : s))
        : [saved, ...prev];
    });
    setShowAdd(false);
    setEditStory(null);
  };

  const handleDeleted = (id) => {
    setStories((prev) => prev.filter((s) => s._id !== id));
    setDeleteStory(null);
  };

  // ── Only change: confirm before unpublishing ──────────────────
  const toggleStatus = async (s) => {
    if (s.status === "published") {
      const ok = window.confirm(`Are you sure you want to unpublish "${s.coupleName}"'s story?`);
      if (!ok) return;
    }
    const original = s.status;
    const next = original === "published" ? "draft" : "published";
    setStories((prev) => prev.map((x) => (x._id === s._id ? { ...x, status: next } : x)));
    try {
      const res  = await apiFetch(`/${s._id}/status`, { method: "PATCH" });
      const data = await res.json();
      if (!data.success)
        setStories((prev) => prev.map((x) => (x._id === s._id ? { ...x, status: original } : x)));
    } catch {
      setStories((prev) => prev.map((x) => (x._id === s._id ? { ...x, status: original } : x)));
    }
  };

  return (
    <div className="ap-content">
      <div className="ap-page-header">
        <div>
          <h2>Success Stories</h2>
          <p>Manage and showcase happy couples</p>
        </div>
        <button className="ap-btn-red" onClick={() => setShowAdd(true)}>
          <IcoPlus /> Add Success Story
        </button>
      </div>

      <div className="ss-search-wrap" style={{ marginBottom: 22 }}>
        <span className="ss-search-icon"><IcoSearch /></span>
        <input
          className="ss-search"
          placeholder="Search by couple name or location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="ap-loading">Loading stories…</div>}

      {!loading && fetchError && (
        <div className="ap-error">
          {fetchError}{" "}
          <button
            onClick={fetchStories}
            style={{ marginLeft: 10, fontWeight: 700, cursor: "pointer", background: "none", border: "none", color: "#b91c1c", textDecoration: "underline", fontFamily: "inherit" }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !fetchError && (
        <div className="ss-card-grid">
          {filtered.length === 0 && (
            <div className="ss-empty">No success stories found.</div>
          )}

          {filtered.map((s) => (
            <div key={s._id} className="ss-card">
              <div className="ss-card-img">
                {s.image ? <img src={s.image} alt={s.coupleName} /> : <IcoImgPh />}
                <span className={`ss-card-badge ${s.status === "published" ? "ss-badge-published" : "ss-badge-draft"}`}>
                  {s.status === "published" ? "Published" : "Draft"}
                </span>
              </div>

              <div className="ss-card-body">
                <div className="ss-card-name">{s.coupleName}</div>
                <div className="ss-card-meta">
                  {s.groomName && s.brideName && (
                    <div className="ss-card-meta-row"><IcoHeart />{s.groomName} &amp; {s.brideName}</div>
                  )}
                  {s.marriageDate && (
                    <div className="ss-card-meta-row"><IcoCal />{s.marriageDate}</div>
                  )}
                  {s.location && (
                    <div className="ss-card-meta-row"><IcoPin />{s.location}</div>
                  )}
                </div>
                {s.story && <div className="ss-card-story">{s.story}</div>}
              </div>

              <div className="ss-card-footer">
                <button className="ss-cb-view" onClick={() => setViewStory(s)}>
                  <IcoEye /><span>View</span>
                </button>
                <button className="ss-cb-edit" onClick={() => setEditStory(s)}>
                  <IcoPen /><span>Edit</span>
                </button>
                {s.status === "published"
                  ? <button className="ss-cb-unpublish" onClick={() => toggleStatus(s)}>Unpublish</button>
                  : <button className="ss-cb-publish"   onClick={() => toggleStatus(s)}>Publish</button>
                }
                <button className="ss-cb-delete" onClick={() => setDeleteStory(s)}><IcoTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewStory && !editStory && !showAdd && (
        <ViewModal story={viewStory} onClose={() => setViewStory(null)} />
      )}
      {(showAdd || editStory) && (
        <AddModal
          story={editStory || null}
          onClose={() => { setShowAdd(false); setEditStory(null); }}
          onSaved={handleSaved}
        />
      )}
      {deleteStory && (
        <DeleteModal
          story={deleteStory}
          onClose={() => setDeleteStory(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
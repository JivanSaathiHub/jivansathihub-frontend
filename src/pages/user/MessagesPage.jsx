import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSocketContext } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import {
  getConversations,
  getMessages,
  sendMessage,
  clearConversation,
} from "../../api";
import Navbar from "../../components/Navbar";
import "./MessagesPage.css";

/* ── Photo resolver ───────────────────────────────────────────────── */
const SERVER = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SERVER}${url}`;
}

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=fdecea&color=c0392b&size=200`;
}

/* ── Build room ID (same logic as backend) ── */
function buildRoomId(a, b) {
  return [String(a), String(b)].sort().join("_");
}

/* ══════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════ */
function IcoSearch() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function IcoPhone() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.56 1.22h3a2 2 0 0 1 2 1.72c.13 1 .37 1.97.72 2.9a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.91 6.91l1.27-1.27a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0 1 22 16.92z"/></svg>;
}
function IcoMoreVert() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>;
}
function IcoImage() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function IcoEmoji() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
}
function IcoSend() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}
function IcoBack() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}

/* ══════════════════════════════════════════════════════════
   EMOJI PICKER
══════════════════════════════════════════════════════════ */
const EMOJI_LIST = [
  "😀","😂","😍","🥰","😊","😎","🤩","😘",
  "🙏","👍","❤️","🔥","💯","🎉","✨","😭",
  "😅","🤔","😏","😇","🥳","😜","😴","🤗",
  "👏","💪","🙌","😆","🤣","😋","😌","🫶",
];

function EmojiPicker({ onSelect, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div className="msgp-emoji-picker" ref={ref}>
      {EMOJI_LIST.map((em) => (
        <button key={em} className="msgp-emoji-btn" onClick={() => onSelect(em)}>
          {em}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MORE DROPDOWN
══════════════════════════════════════════════════════════ */
function MoreDropdown({ isPinned, isMuted, isBlocked, onClose, onPin, onMute, onViewContact, onBlock, onClearChat, onReport }) {
  const { t } = useTranslation();
  const ITEMS = [
    { icon: "👤", labelKey: "messages.more.viewContact",                                           onClick: onViewContact },
    { icon: "📌", labelKey: isPinned  ? "messages.more.unpinChat"  : "messages.more.pinChat",      onClick: onPin        },
    { icon: "🔇", labelKey: isMuted   ? "messages.more.unmute"     : "messages.more.mute",         onClick: onMute       },
    { icon: "🚫", labelKey: isBlocked ? "messages.more.unblock"    : "messages.more.block",        onClick: onBlock, danger: !isBlocked },
    { icon: "🗑️", labelKey: "messages.more.clearChat",                                             onClick: onClearChat, danger: true },
    { icon: "⚠️", labelKey: "messages.more.report",                                                onClick: onReport, danger: true },
  ];
  return (
    <div className="msgp-more-dropdown">
      {ITEMS.map((item) => (
        <button
          key={item.labelKey}
          className={`msgp-more-item${item.danger ? " danger" : ""}`}
          onClick={() => { item.onClick(); onClose(); }}
        >
          <span className="msgp-more-item-icon">{item.icon}</span>
          <span className="msgp-more-item-label">{t(item.labelKey)}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Avatar ── */
function Avatar({ name, photo, size = 46, online = false }) {
  const [err, setErr] = useState(false);
  const initials = (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const src = photo && !err ? resolvePhoto(photo) : avatarUrl(name);
  return (
    <div className="msg-avatar-wrap" style={{ width: size, height: size }}>
      <div className="msg-avatar" style={{ width: size, height: size }}>
        <img src={src} alt={name} onError={() => setErr(true)} />
      </div>
      {online && <span className="msg-online-dot" />}
    </div>
  );
}

/* ── Filter Tabs ── */
function FilterTabs({ active, onChange, contacts }) {
  const { t } = useTranslation();
  const TABS = [
    { key: "all",         labelKey: "messages.tabs.all"         },
    { key: "unread",      labelKey: "messages.tabs.unread"      },
    { key: "favourites",  labelKey: "messages.tabs.favourites"  },
    { key: "connections", labelKey: "messages.tabs.connections" },
  ];
  const unreadCount = contacts.filter((c) => c.unread > 0).length;
  return (
    <div className="msgp-filter-tabs">
      {TABS.map((tab) => {
        const badge = tab.key === "unread" ? unreadCount : null;
        return (
          <button
            key={tab.key}
            className={`msgp-filter-tab ${active === tab.key ? "active" : ""}`}
            onClick={() => onChange(tab.key)}
          >
            {t(tab.labelKey)}
            {badge > 0 && <span className="tab-badge">{badge}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function MessagesPage({
  onBack, onLogin, onRegister, onHelp, onAboutClick, onMenuClick, onViewProfile,
}) {
  const { t }      = useTranslation();
  const { user }   = useAuth();
  const { socket } = useSocketContext();

  /* ── Conversation list (left sidebar) ── */
  const [contacts,   setContacts]   = useState([]);
  const [convoLoad,  setConvoLoad]  = useState(true);

  /* ── Active chat ── */
  const [activeId,   setActiveId]   = useState(null);   // partner's _id string
  const [messages,   setMessages]   = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);

  /* ── UI state ── */
  const [search,     setSearch]     = useState("");
  const [input,      setInput]      = useState("");
  const [activeTab,  setActiveTab]  = useState("all");
  const [showChat,   setShowChat]   = useState(false);
  const [showMore,   setShowMore]   = useState(false);
  const [pinnedIds,  setPinnedIds]  = useState([]);
  const [mutedIds,   setMutedIds]   = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [isTyping,   setIsTyping]   = useState(false);
  const [showEmoji,  setShowEmoji]  = useState(false);
  const [sending,    setSending]    = useState(false);

  const bottomRef   = useRef(null);
  const moreRef     = useRef(null);
  const imageRef    = useRef(null);
  const typingTimer = useRef(null);

  /* ── Derived ── */
  const activeContact = contacts.find((c) => c.partnerId === activeId);
  const isPinned      = pinnedIds.includes(activeId);
  const isMuted       = mutedIds.includes(activeId);
  const isBlocked     = blockedIds.includes(activeId);

  /* ── Fetch conversations ── */
  const fetchConversations = useCallback(async () => {
    setConvoLoad(true);
    try {
      const data = await getConversations();
      const list = (data.conversations || []).map((c) => ({
        partnerId: String(c.partner._id),
        name:      c.partner.fullName,
        photo:     c.partner.photos?.find((p) => p.isPrimary)?.url || c.partner.photos?.[0]?.url || null,
        lastMsg:   c.lastMsg,
        time:      c.time
          ? new Date(c.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
        unread:    c.unread || 0,
        online:    false,
        favourite: false,
        roomId:    c.roomId,
      }));
      setContacts(list);
      // Auto-select first conversation if none selected
      if (!activeId && list.length > 0) {
        setActiveId(list[0].partnerId);
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setConvoLoad(false);
    }
  }, [activeId]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  /* ── Fetch messages when active contact changes ── */
  useEffect(() => {
    if (!activeId) return;
    setMsgLoading(true);
    setMessages([]);
    getMessages(activeId)
      .then((data) => {
        const msgs = (data.messages || []).map((m) => ({
          id:    m._id,
          from:  String(m.sender._id) === String(user?._id) ? "me" : "them",
          text:  m.text  || null,
          image: m.image || null,
          time:  new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
        setMessages(msgs);
        // Mark as read — update contact badge
        setContacts((prev) =>
          prev.map((c) => (c.partnerId === activeId ? { ...c, unread: 0 } : c))
        );
      })
      .catch((err) => console.error("Failed to load messages:", err))
      .finally(() => setMsgLoading(false));
  }, [activeId, user?._id]);

  /* ── Socket: join room ── */
  useEffect(() => {
    if (!socket || !user?._id || !activeId) return;
    const room = buildRoomId(user._id, activeId);
    socket.emit("join_chat", { roomId: room });
    return () => socket.emit("leave_chat", { roomId: room });
  }, [socket, activeId, user?._id]);

  /* ── Socket: receive message ── */
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ roomId, message: msg }) => {
      const senderId = String(msg.sender?._id || msg.sender);
      const newMsg = {
        id:    msg._id || Date.now(),
        from:  senderId === String(user?._id) ? "me" : "them",
        text:  msg.text  || null,
        image: msg.image || null,
        time:  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      // Only append if this room is currently open
      const currentRoom = activeId ? buildRoomId(user._id, activeId) : null;
      if (roomId === currentRoom) {
        setMessages((prev) => [...prev, newMsg]);
      }
      // Update sidebar preview
      setContacts((prev) =>
        prev.map((c) => {
          if (c.roomId === roomId) {
            return {
              ...c,
              lastMsg: msg.text || "📷",
              time:    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              unread:  roomId === currentRoom ? 0 : c.unread + 1,
            };
          }
          return c;
        })
      );
    };

    const handleTyping = ({ userId: typingId, isTyping: typing }) => {
      if (String(typingId) !== String(activeId)) return;
      setIsTyping(typing);
      if (typing) {
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing",  handleTyping);
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing",  handleTyping);
    };
  }, [socket, activeId, user?._id]);

  /* ── Scroll to bottom on new message ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeId]);

  /* ── Close more dropdown on outside click ── */
  useEffect(() => {
    const h = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setShowMore(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── Send text message ── */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeId || sending) return;

    // Optimistic append
    const tempId = `temp_${Date.now()}`;
    const optimistic = {
      id:   tempId,
      from: "me",
      text,
      image: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setSending(true);

    // Emit typing stopped
    if (socket && user?._id) {
      const room = buildRoomId(user._id, activeId);
      socket.emit("typing", { roomId: room, isTyping: false });
    }

    try {
      const data = await sendMessage(activeId, text);
      // Replace temp with real message
      const real = data.message;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { id: real._id, from: "me", text: real.text, image: real.image || null, time: optimistic.time }
            : m
        )
      );
      setContacts((prev) =>
        prev.map((c) =>
          c.partnerId === activeId
            ? { ...c, lastMsg: text, time: optimistic.time, unread: 0 }
            : c
        )
      );
    } catch (err) {
      // Remove optimistic on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(text);
      alert(err?.response?.data?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  /* ── Typing indicator emit ── */
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (!socket || !user?._id || !activeId) return;
    const room = buildRoomId(user._id, activeId);
    socket.emit("typing", { roomId: room, isTyping: true });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("typing", { roomId: room, isTyping: false });
    }, 2000);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* ── Image message ── */
  const handleImagePick = () => imageRef.current?.click();

  const handleImageSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeId) return;

    // Convert to base64 for sending (or you can upload to server separately)
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const tempId = `temp_img_${Date.now()}`;
      const optimistic = {
        id: tempId, from: "me", text: null, image: base64,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        const data = await sendMessage(activeId, "", base64);
        const real = data.message;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? { id: real._id, from: "me", text: null, image: real.image || base64, time: optimistic.time }
              : m
          )
        );
        setContacts((prev) =>
          prev.map((c) =>
            c.partnerId === activeId
              ? { ...c, lastMsg: t("messages.photo"), time: optimistic.time }
              : c
          )
        );
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert("Failed to send image.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── More dropdown handlers ── */
  const handlePin         = () => setPinnedIds((p)  => p.includes(activeId) ? p.filter((id) => id !== activeId) : [...p, activeId]);
  const handleMute        = () => setMutedIds((p)   => p.includes(activeId) ? p.filter((id) => id !== activeId) : [...p, activeId]);
  const handleBlock       = () => setBlockedIds((p) => p.includes(activeId) ? p.filter((id) => id !== activeId) : [...p, activeId]);
  const handleViewContact = () => onViewProfile?.(activeId);
  const handleReport      = () => alert(t("messages.reportAlert", { name: activeContact?.name }));
  const handleCall        = () => alert(t("messages.callAlert",   { name: activeContact?.name }));

  const handleClearChat = async () => {
    setMessages([]);
    setContacts((prev) =>
      prev.map((c) => (c.partnerId === activeId ? { ...c, lastMsg: "", time: "" } : c))
    );
    try {
      await clearConversation(activeId);
    } catch {
      // best-effort
    }
  };

  const selectContact = (partnerId) => {
    setActiveId(partnerId);
    setContacts((prev) => prev.map((c) => (c.partnerId === partnerId ? { ...c, unread: 0 } : c)));
    setShowChat(true);
    setShowMore(false);
    setIsTyping(false);
    setShowEmoji(false);
  };

  /* ── Filter contacts ── */
  const filtered = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeTab === "unread")     return c.unread > 0;
    if (activeTab === "favourites") return c.favourite;
    return true;
  });

  return (
    <div className="site-wrapper">
      <input ref={imageRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelected} />

      <Navbar
        onHomeClick={onBack}
        onLoginClick={onLogin}
        onRegisterClick={onRegister}
        onHelpClick={onHelp}
        onAboutClick={onAboutClick}
        onMenuClick={onMenuClick}
      />

      <main className="msgp-main">
        <div className="msgp-container" data-showchat={showChat ? "1" : "0"}>

          {/* ── LEFT sidebar ── */}
          <div className="msgp-sidebar">
            <div className="msgp-search-wrap">
              <IcoSearch />
              <input
                className="msgp-search"
                placeholder={t("messages.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <FilterTabs active={activeTab} onChange={setActiveTab} contacts={contacts} />
            <div className="msgp-sidebar-divider" />

            <div className="msgp-contact-list">
              {convoLoad ? (
                <div style={{ padding: "24px 16px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                  Loading…
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: "24px 16px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                  {t("messages.noConversations")}
                </div>
              ) : (
                filtered.map((c) => (
                  <div
                    key={c.partnerId}
                    className={`msgp-contact ${c.partnerId === activeId ? "active" : ""}`}
                    onClick={() => selectContact(c.partnerId)}
                  >
                    <Avatar name={c.name} photo={c.photo} size={46} online={c.online} />
                    <div className="msgp-contact-info">
                      <div className="msgp-contact-top">
                        <span className="msgp-contact-name">
                          {pinnedIds.includes(c.partnerId) ? "📌 " : ""}{c.name}
                        </span>
                        <span className="msgp-contact-time">{c.time}</span>
                      </div>
                      <div className="msgp-contact-bottom">
                        <span className="msgp-contact-preview">{c.lastMsg}</span>
                        {c.unread > 0 && (
                          <span className="msgp-unread-badge">{c.unread}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── RIGHT chat window ── */}
          <div className="msgp-chat">

            {!activeId ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14 }}>
                Select a conversation to start chatting
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="msgp-chat-header">
                  <div className="msgp-chat-header-left">
                    <button className="msgp-back-btn" onClick={() => setShowChat(false)}>
                      <IcoBack />
                    </button>
                    <Avatar name={activeContact?.name || ""} photo={activeContact?.photo} size={42} online={activeContact?.online} />
                    <div className="msgp-chat-header-info">
                      <span className="msgp-chat-header-name">
                        {isPinned ? "📌 " : ""}{isMuted ? "🔇 " : ""}{activeContact?.name}
                      </span>
                      <span className="msgp-chat-header-status">
                        {isBlocked
                          ? <span style={{ color: "#dc2626" }}>{t("messages.blocked")}</span>
                          : isTyping
                            ? <em style={{ color: "#16a34a" }}>{t("messages.typing")}</em>
                            : activeContact?.online ? t("messages.online") : t("messages.offline")
                        }
                      </span>
                    </div>
                  </div>
                  <div className="msgp-chat-header-right">
                    <button className="msgp-icon-btn" onClick={handleCall}><IcoPhone /></button>
                    <button className="msgp-view-profile-btn" onClick={() => onViewProfile?.(activeId)}>
                      {t("messages.viewProfile")}
                    </button>
                    <div className="msgp-more-wrap" ref={moreRef}>
                      <button className="msgp-icon-btn" onClick={() => setShowMore((p) => !p)}>
                        <IcoMoreVert />
                      </button>
                      {showMore && (
                        <MoreDropdown
                          isPinned={isPinned} isMuted={isMuted} isBlocked={isBlocked}
                          onClose={() => setShowMore(false)}
                          onPin={handlePin} onMute={handleMute}
                          onViewContact={handleViewContact} onBlock={handleBlock}
                          onClearChat={handleClearChat} onReport={handleReport}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="msgp-messages">
                  {msgLoading ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 13 }}>
                      Loading messages…
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const showTime = i === 0 || messages[i - 1]?.time !== msg.time;
                      return (
                        <div key={msg.id}>
                          {showTime && <div className="msgp-time-label">{msg.time}</div>}
                          <div className={`msgp-bubble-row ${msg.from === "me" ? "me" : "them"}`}>
                            <div className={`msgp-bubble ${msg.from === "me" ? "msgp-bubble--me" : "msgp-bubble--them"}`}>
                              {msg.image
                                ? <img src={msg.image} alt="sent" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8, display: "block" }} />
                                : msg.text
                              }
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isTyping && (
                    <div className="msgp-bubble-row them">
                      <div className="msgp-bubble msgp-bubble--them" style={{ padding: "10px 16px" }}>
                        <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", animation: "typing-dot 1.2s 0s infinite" }} />
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", animation: "typing-dot 1.2s 0.2s infinite" }} />
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af", animation: "typing-dot 1.2s 0.4s infinite" }} />
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input bar */}
                <div className="msgp-input-bar" style={{ position: "relative" }}>
                  {showEmoji && (
                    <EmojiPicker onSelect={(em) => { setInput((p) => p + em); setShowEmoji(false); }} onClose={() => setShowEmoji(false)} />
                  )}
                  <div className="msgp-input-tools">
                    <button className="msgp-tool-btn" onClick={handleImagePick}><IcoImage /></button>
                    <button className="msgp-tool-btn" onClick={() => setShowEmoji((p) => !p)}><IcoEmoji /></button>
                  </div>
                  <input
                    className="msgp-input"
                    placeholder={isBlocked ? t("messages.inputBlockedPlaceholder") : t("messages.inputPlaceholder")}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKey}
                    disabled={isBlocked || sending}
                  />
                  <button
                    className="msgp-send-btn"
                    onClick={handleSend}
                    disabled={!input.trim() || isBlocked || sending}
                  >
                    <IcoSend />
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
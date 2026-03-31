import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  sendInterest,
  addToShortlist,
  removeFromShortlist,
  checkShortlist,
  getSentInterests,
  getReceivedInterests,
} from "../../api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./ProfileDetail.css";

const SERVER = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace("/api", "")
  : "http://localhost:5000";

function resolvePhoto(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${SERVER}${url}`;
}

const IcoInterest = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const IcoHeart    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoMsg      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IcoPhone    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.08 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcoMail     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IcoShield   = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, marginTop:2, filter:"drop-shadow(0 1px 3px rgba(0,0,0,0.15))" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IcoStar     = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IcoPerson   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IcoHome2    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IcoGlobe    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const IcoLoveCard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cc0000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcoCheck    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

function LoginRequiredModal({ onClose, onLogin, onRegister }) {
  const { t } = useTranslation();
  return (
    <div className="lr-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="lr-modal">
        <h2 className="lr-title">{t("profileDetail.loginModal.title")}</h2>
        <p className="lr-desc">{t("profileDetail.loginModal.desc")}</p>
        <div className="lr-actions">
          <button className="lr-btn-login"    onClick={onLogin}>{t("profileDetail.loginModal.loginBtn")}</button>
          <button className="lr-btn-register" onClick={onRegister}>{t("profileDetail.loginModal.registerBtn")}</button>
        </div>
        <button className="lr-btn-later" onClick={onClose}>{t("profileDetail.loginModal.laterBtn")}</button>
      </div>
    </div>
  );
}

function SendInterestModal({ profileName, onClose, onSend }) {
  const { t } = useTranslation();
  const [msg, setMsg] = useState("");
  const firstName = profileName?.split(" ")[0] || profileName;
  return (
    <div className="si-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="si-modal">
        <h2 className="si-title">{t("profileDetail.sendInterestModal.title", { name: profileName })}</h2>
        <p className="si-desc">{t("profileDetail.sendInterestModal.desc", { firstName })}</p>
        <textarea className="si-textarea" placeholder={t("profileDetail.sendInterestModal.placeholder")} value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} />
        <div className="si-actions">
          <button className="si-btn-send"   onClick={() => onSend(msg)}>{t("profileDetail.sendInterestModal.sendBtn")}</button>
          <button className="si-btn-cancel" onClick={onClose}>{t("profileDetail.sendInterestModal.cancelBtn")}</button>
        </div>
      </div>
    </div>
  );
}

function InterestSentModal({ profileName, onClose, onGoInterests }) {
  const { t } = useTranslation();
  return (
    <div className="si-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="si-modal" style={{ textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center" }}><IcoCheck /></div>
        </div>
        <h2 className="si-title">{t("profileDetail.interestSent.title")}</h2>
        <p className="si-desc">{t("profileDetail.interestSent.desc", { name: profileName })}</p>
        <div className="si-actions" style={{ flexDirection:"column", gap:8 }}>
          <button className="si-btn-send"   onClick={onGoInterests}>{t("profileDetail.interestSent.viewBtn")}</button>
          <button className="si-btn-cancel" onClick={onClose}>{t("profileDetail.interestSent.stayBtn")}</button>
        </div>
      </div>
    </div>
  );
}

function ShortlistModal({ profileName, onClose }) {
  const { t } = useTranslation();
  return (
    <div className="si-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="si-modal" style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:10 }}>❤️</div>
        <h2 className="si-title">{t("profileDetail.shortlistModal.title")}</h2>
        <p className="si-desc">{t("profileDetail.shortlistModal.desc", { name: profileName })}</p>
        <div className="si-actions"><button className="si-btn-send" onClick={onClose}>{t("profileDetail.shortlistModal.okBtn")}</button></div>
      </div>
    </div>
  );
}

function AlreadyShortlistedModal({ profileName, onClose, onGoShortlist }) {
  const { t } = useTranslation();
  return (
    <div className="si-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="si-modal" style={{ textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:10 }}>💛</div>
        <h2 className="si-title">{t("profileDetail.alreadyShortlisted.title")}</h2>
        <p className="si-desc">{t("profileDetail.alreadyShortlisted.desc", { name: profileName })}</p>
        <div className="si-actions" style={{ flexDirection:"column", gap:8 }}>
          <button className="si-btn-send"   onClick={onGoShortlist}>{t("profileDetail.alreadyShortlisted.viewBtn")}</button>
          <button className="si-btn-cancel" onClick={onClose}>{t("profileDetail.alreadyShortlisted.stayBtn")}</button>
        </div>
      </div>
    </div>
  );
}

function SendMessageModal({ profileName, onClose, onSend }) {
  const { t } = useTranslation();
  const [msg, setMsg] = useState("");
  const firstName = profileName?.split(" ")[0] || profileName;
  return (
    <div className="si-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="si-modal">
        <h2 className="si-title">{t("profileDetail.messageModal.title", { name: profileName })}</h2>
        <p className="si-desc">{t("profileDetail.messageModal.desc", { firstName })}</p>
        <textarea className="si-textarea" placeholder={t("profileDetail.messageModal.placeholder")} value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} />
        <div className="si-actions">
          <button className="si-btn-send"   onClick={() => onSend(msg)}>{t("profileDetail.messageModal.sendBtn")}</button>
          <button className="si-btn-cancel" onClick={onClose}>{t("profileDetail.messageModal.cancelBtn")}</button>
        </div>
      </div>
    </div>
  );
}

function MessageSentModal({ profileName, onClose, onGoMessages }) {
  const { t } = useTranslation();
  return (
    <div className="si-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="si-modal" style={{ textAlign:"center" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
        </div>
        <h2 className="si-title">{t("profileDetail.messageSent.title")}</h2>
        <p className="si-desc">{t("profileDetail.messageSent.desc", { name: profileName })}</p>
        <div className="si-actions" style={{ flexDirection:"column", gap:8 }}>
          <button className="si-btn-send"   onClick={onGoMessages}>{t("profileDetail.messageSent.viewBtn")}</button>
          <button className="si-btn-cancel" onClick={onClose}>{t("profileDetail.messageSent.stayBtn")}</button>
        </div>
      </div>
    </div>
  );
}

function ViewContactModal({ profile, onClose }) {
  const { t } = useTranslation();
  const canViewContact = profile?.membership?.plan === "premium" || profile?.membership?.plan === "elite";
  const phone = profile?.mobile || (canViewContact ? profile?.phone : null);
  const email = profile?.email;
  return (
    <div className="si-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="si-modal">
        <h2 className="si-title" style={{ marginBottom:6 }}>{t("profileDetail.contactModal.title")}</h2>
        <p className="si-desc" style={{ marginBottom:20 }}>{profile?.fullName}</p>
        {!canViewContact ? (
          <div style={{ textAlign:"center", padding:"20px 0", color:"#6b7280" }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🔒</div>
            <p style={{ fontSize:14 }}>{t("profileDetail.premium.upgradeNote")}</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:22 }}>
            {phone && (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#f9fafb", borderRadius:10, border:"1px solid #e5e7eb" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"#dcfce7", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><IcoPhone /></div>
                <div>
                  <div style={{ fontSize:11, color:"#9ca3af", fontWeight:500, marginBottom:2 }}>{t("profileDetail.contactModal.phone")}</div>
                  <div style={{ fontSize:16, fontWeight:700, color:"#111827" }}>{phone}</div>
                </div>
                <a href={`tel:${phone}`} style={{ marginLeft:"auto", padding:"6px 14px", background:"#cc0000", color:"#fff", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                  {t("profileDetail.contactModal.call")}
                </a>
              </div>
            )}
            {email && (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#f9fafb", borderRadius:10, border:"1px solid #e5e7eb" }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><IcoMail /></div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:11, color:"#9ca3af", fontWeight:500, marginBottom:2 }}>{t("profileDetail.contactModal.email")}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:"#111827", wordBreak:"break-all" }}>{email}</div>
                </div>
                <a href={`mailto:${email}`} style={{ marginLeft:"auto", padding:"6px 14px", background:"#2563eb", color:"#fff", borderRadius:8, fontSize:12, fontWeight:700, textDecoration:"none", whiteSpace:"nowrap" }}>
                  {t("profileDetail.contactModal.compose")}
                </a>
              </div>
            )}
          </div>
        )}
        <p style={{ fontSize:11, color:"#9ca3af", textAlign:"center", marginBottom:16 }}>{t("profileDetail.contactModal.note")}</p>
        <button className="si-btn-cancel" onClick={onClose} style={{ width:"100%" }}>{t("profileDetail.contactModal.close")}</button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="pd-layout" style={{ opacity: 0.6 }}>
      <aside className="pd-sidebar">
        <div style={{ width:"100%", height:320, background:"linear-gradient(90deg,#f0e8e8 25%,#e8dede 50%,#f0e8e8 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.5s infinite", borderRadius:12 }} />
        <div style={{ height:20, background:"#e8dede", borderRadius:6, margin:"16px 0 8px", animation:"shimmer 1.5s infinite" }} />
        <div style={{ height:14, background:"#e8dede", borderRadius:6, width:"60%", animation:"shimmer 1.5s infinite" }} />
      </aside>
      <main className="pd-content">
        {[1,2,3].map(i => (
          <div key={i} className="pd-card" style={{ marginBottom:16 }}>
            <div style={{ height:18, background:"#e8dede", borderRadius:6, width:"40%", marginBottom:16, animation:"shimmer 1.5s infinite" }} />
            <div style={{ height:14, background:"#f0e8e8", borderRadius:6, marginBottom:8, animation:"shimmer 1.5s infinite" }} />
            <div style={{ height:14, background:"#f0e8e8", borderRadius:6, width:"80%", animation:"shimmer 1.5s infinite" }} />
          </div>
        ))}
      </main>
    </div>
  );
}

export default function ProfileDetail({
  profileId, onBack, onSearch, onLogin, onRegister,
  onHelp, onAboutClick, onMenuClick,
  onGoInterests, onGoMessages, onGoShortlist,
}) {
  const { t } = useTranslation();
  const { isLoggedIn, user } = useAuth();

  const [profile,        setProfile]        = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [fetchError,     setFetchError]     = useState("");
  const [modal,          setModal]          = useState(null);
  const [activePhoto,    setActivePhoto]    = useState(null);
  const [interestStatus, setInterestStatus] = useState(null);
  const [shortlisted,    setShortlisted]    = useState(false);
  const [slLoading,      setSlLoading]      = useState(false);

  const abortRef = useRef(null);

  /* ── Fetch profile ── */
  useEffect(() => {
    if (!profileId) { setFetchError("No profile ID provided."); setLoading(false); return; }
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setFetchError("");
    setActivePhoto(null);
    setShortlisted(false);
    setInterestStatus(null);
    getProfile(profileId)
      .then((data) => {
        if (abortRef.current?.signal.aborted) return;
        const p = data?.user || data?.profile || data;
        if (!p || !p._id) throw new Error("Profile not found");
        setProfile(p);
      })
      .catch((err) => {
        if (abortRef.current?.signal.aborted) return;
        setFetchError(err?.response?.data?.message || err.message || "Profile not found.");
      })
      .finally(() => {
        if (!abortRef.current?.signal.aborted) setLoading(false);
      });
    return () => { abortRef.current?.abort(); };
  }, [profileId]);

  /* ── Check interest status in BOTH directions ── */
  useEffect(() => {
    if (!profile?._id || !isLoggedIn) return;

    Promise.all([
      getSentInterests().catch(() => ({ interests: [] })),
      getReceivedInterests().catch(() => ({ interests: [] })),
    ]).then(([sentData, receivedData]) => {
      const sent     = sentData?.interests     || [];
      const received = receivedData?.interests || [];

      // Check if current user sent an interest to this profile
      const sentMatch = sent.find(
        (i) => String(i.receiver?._id || i.receiver) === String(profile._id)
      );
      if (sentMatch) {
        setInterestStatus(sentMatch.status);
        return;
      }

      // Check if this profile sent an interest to current user AND it was accepted
      const receivedMatch = received.find(
        (i) =>
          String(i.sender?._id || i.sender) === String(profile._id) &&
          i.status === "accepted"
      );
      if (receivedMatch) {
        setInterestStatus("accepted");
        return;
      }

      setInterestStatus(null);
    });
  }, [profile?._id, isLoggedIn]);

  /* ── Check shortlist status ── */
  useEffect(() => {
    if (!profile?._id || !isLoggedIn) return;
    checkShortlist(profile._id)
      .then((data) => setShortlisted(data.isShortlisted || false))
      .catch(() => {});
  }, [profile?._id, isLoggedIn]);

  const navigate = useCallback((page) => {
    if (typeof onGoInterests === "function" && page === "interests") { onGoInterests(); return; }
    if (typeof onGoMessages  === "function" && page === "messages")  { onGoMessages();  return; }
    if (typeof onGoShortlist === "function" && page === "shortlist") { onGoShortlist(); return; }
    onMenuClick?.(page);
  }, [onGoInterests, onGoMessages, onGoShortlist, onMenuClick]);

  const closeModal   = () => setModal(null);
  const requireLogin = (then) => { if (!isLoggedIn) { setModal("login"); return; } then(); };
  const isOwnProfile = user && profile && String(user._id) === String(profile._id);

  const allPhotos    = profile?.photos || [];
  const primaryPhoto = resolvePhoto(
    profile?.photos?.find((ph) => ph.isPrimary)?.url || profile?.photos?.[0]?.url
  );
  const displayPhoto = activePhoto || primaryPhoto;
  const avatarUrl    = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=fdecea&color=c0392b&size=400`;

  const handleSendInterest = async (message) => {
    try {
      await sendInterest(profile._id, message);
      setInterestStatus("pending");
      setModal("interestSent");
    } catch (err) {
      const serverMsg = err?.response?.data?.message || "";
      if (serverMsg === "Interest already sent.") {
        setInterestStatus("pending");
        setModal(null);
      } else {
        setFetchError(serverMsg || "Failed to send interest.");
        setModal(null);
      }
    }
  };

  const handleShortlistToggle = async () => {
    if (slLoading) return;
    setSlLoading(true);
    try {
      if (shortlisted) {
        await removeFromShortlist(profile._id);
        setShortlisted(false);
      } else {
        await addToShortlist(profile._id);
        setShortlisted(true);
        setModal("shortlist");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      if (msg === "Already shortlisted.") { setShortlisted(true); setModal("alreadyShortlisted"); }
      else alert(msg || "Shortlist action failed.");
    } finally {
      setSlLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    try {
      const { sendMessage } = await import("../../api");
      await sendMessage(profile._id, message);
      setModal("messageSent");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send message.");
    }
  };

  /* ── Interest button label & style ── */
  const interestDisabled = interestStatus === "pending" || interestStatus === "accepted";
  const interestLabel = (() => {
    if (interestStatus === "accepted") return `✓ ${t("profileDetail.connected")}`;
    if (interestStatus === "pending")  return `⏳ ${t("profileDetail.interestSentLabel")}`;
    return t("profileDetail.sendInterest");
  })();

  if (loading) {
    return (
      <div className="pd-page">
        <Navbar onRegisterClick={onRegister} onLoginClick={onLogin} onHelpClick={onHelp} onHomeClick={onBack} onAboutClick={onAboutClick} onMenuClick={onMenuClick} />
        <div className="pd-backbar"><div className="pd-backbar-inner"><button className="pd-back-btn" onClick={onBack}>{t("profileDetail.backToSearch")}</button></div></div>
        <div className="pd-layout" style={{ padding: "2rem 1rem" }}><LoadingSkeleton /></div>
        <Footer />
      </div>
    );
  }

  if (fetchError || !profile) {
    return (
      <div className="pd-page">
        <Navbar onRegisterClick={onRegister} onLoginClick={onLogin} onHelpClick={onHelp} onHomeClick={onBack} onAboutClick={onAboutClick} onMenuClick={onMenuClick} />
        <div className="pd-not-found" style={{ textAlign:"center", padding:"80px 20px" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>😕</div>
          <h2 style={{ color:"#1a1a1a", marginBottom:8 }}>{t("profileDetail.notFound")}</h2>
          <p style={{ color:"#6b7280", marginBottom:24 }}>{fetchError || t("profileDetail.notFoundDesc")}</p>
          <button className="pd-back-btn" onClick={onBack}>{t("profileDetail.backToProfiles")}</button>
        </div>
        <Footer />
      </div>
    );
  }

  const p    = profile;
  const name = p.fullName || "—";
  const pref = p.partnerPreferences || {};

  return (
    <div className="pd-page">
      <Navbar onRegisterClick={onRegister} onLoginClick={onLogin} onHelpClick={onHelp} onHomeClick={onBack} onAboutClick={onAboutClick} onMenuClick={onMenuClick} />

      <div className="pd-backbar">
        <div className="pd-backbar-inner">
          <button className="pd-back-btn" onClick={onBack}>{t("profileDetail.backToSearch")}</button>
        </div>
      </div>

      <div className="pd-layout">
        <aside className="pd-sidebar">
          <div className="pd-sidebar-photo">
            <div className="pd-sidebar-badges">
              <span className="pd-badge-gender">{p.gender}</span>
              {p.isVerified && <span className="pd-badge-verified">{t("profileDetail.verified")}</span>}
              {p.membership?.plan !== "free" && (
                <span className="pd-badge-verified" style={{ background:"#f59e0b" }}>
                  {p.membership?.plan === "elite" ? "⭐ Elite" : "⚡ Premium"}
                </span>
              )}
            </div>
            <img
              src={displayPhoto || avatarUrl(name)}
              alt={name}
              className="pd-main-photo"
              onError={(e) => { e.target.src = avatarUrl(name); }}
            />
          </div>

          {allPhotos.length > 1 && (
            <div className="pd-thumbnails">
              {allPhotos.map((ph, i) => {
                const src = resolvePhoto(ph.url);
                const isActive =
                  activePhoto === src ||
                  (!activePhoto && ph.isPrimary) ||
                  (!activePhoto && i === 0 && !allPhotos.some((x) => x.isPrimary));
                return (
                  <img
                    key={ph._id || i}
                    src={src}
                    alt={`${name} ${i + 1}`}
                    className="pd-thumb"
                    onClick={() => setActivePhoto(src)}
                    style={{
                      cursor: "pointer",
                      outline: isActive ? "2.5px solid #cc0000" : "2px solid transparent",
                      outlineOffset: "2px",
                      borderRadius: 6,
                      objectFit: "cover",
                      transition: "outline 0.15s",
                    }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                );
              })}
            </div>
          )}

          <div className="pd-sidebar-info">
            <h2 className="pd-sidebar-name">{name}</h2>
            <p className="pd-sidebar-sub">
              {p.age} {t("interest.years_short")}
              {p.height ? ` | ${p.height}` : ""}
            </p>
            <ul className="pd-sidebar-details">
              {(p.city || p.state) && <li><span className="pd-si-icon">📍</span>{[p.city, p.state].filter(Boolean).join(", ")}</li>}
              {p.education         && <li><span className="pd-si-icon">🎓</span>{p.education}</li>}
              {p.profession        && <li><span className="pd-si-icon">💼</span>{p.profession}</li>}
              {p.religion          && <li><span className="pd-si-icon">🙏</span>{p.religion}</li>}
            </ul>
          </div>

          {!isOwnProfile && (
            <div className="pd-sidebar-actions">
              <button
                className="pd-action-primary"
                onClick={() => { if (interestDisabled) return; requireLogin(() => setModal("interest")); }}
                disabled={interestDisabled}
                style={
                  interestStatus === "accepted" ? { background: "#16a34a", cursor: "default" }
                  : interestStatus === "pending" ? { background: "#ca8a04", cursor: "default" }
                  : {}
                }
              >
                <IcoInterest />
                {interestLabel}
              </button>

              <button
                className="pd-action-outline"
                onClick={() => requireLogin(handleShortlistToggle)}
                disabled={slLoading}
                style={shortlisted ? { borderColor: "#cc0000", color: "#cc0000" } : {}}
              >
                <IcoHeart />
                {slLoading ? "…" : shortlisted ? `❤️ ${t("profileDetail.shortlisted")}` : t("profileDetail.addToShortlist")}
              </button>

              <button className="pd-action-ghost" onClick={() => requireLogin(() => setModal("message"))}>
                <IcoMsg /> {t("profileDetail.sendMessage")}
              </button>
            </div>
          )}

          {isOwnProfile && (
            <div className="pd-sidebar-actions">
              <button className="pd-action-outline" onClick={() => onMenuClick?.("edit-profile")}>
                ✏️ {t("profileDetail.editProfile")}
              </button>
            </div>
          )}
        </aside>

        <main className="pd-content">
          <div className="pd-card">
            <h3 className="pd-card-title"><span className="pd-card-icon"><IcoStar /></span>{t("profileDetail.aboutMe")}</h3>
            <p className="pd-about-text">{p.aboutMe || t("profileDetail.noAboutMe")}</p>
          </div>

          <div className="pd-card">
            <h3 className="pd-card-title"><span className="pd-card-icon"><IcoPerson /></span>{t("profileDetail.personalDetails")}</h3>
            <div className="pd-detail-grid">
              <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.age")}</span><span className="pd-detail-value">{p.age} {t("interest.years_short")}</span></div>
              {p.height        && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.height")}</span><span className="pd-detail-value">{p.height}</span></div>}
              {p.religion      && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.religion")}</span><span className="pd-detail-value">{p.religion}</span></div>}
              {p.caste         && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.community")}</span><span className="pd-detail-value">{p.caste}</span></div>}
              {p.motherTongue  && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.motherTongue")}</span><span className="pd-detail-value">{p.motherTongue}</span></div>}
              {p.maritalStatus && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.maritalStatus")}</span><span className="pd-detail-value">{p.maritalStatus}</span></div>}
              {(p.city || p.state) && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.location")}</span><span className="pd-detail-value">{[p.city, p.state].filter(Boolean).join(", ")}</span></div>}
              {p.profession    && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.profession")}</span><span className="pd-detail-value">{p.profession}</span></div>}
              {p.education     && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.education")}</span><span className="pd-detail-value">{p.education}</span></div>}
              {p.annualIncome  && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.annualIncome")}</span><span className="pd-detail-value">{p.annualIncome}</span></div>}
            </div>
          </div>

          {(p.familyType || p.familyValues || p.fatherOccupation || p.motherOccupation || p.siblings) && (
            <div className="pd-card">
              <h3 className="pd-card-title"><span className="pd-card-icon"><IcoHome2 /></span>{t("profileDetail.familyDetails")}</h3>
              <div className="pd-detail-grid">
                {p.fatherOccupation && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.fatherOccupation")}</span><span className="pd-detail-value">{p.fatherOccupation}</span></div>}
                {p.motherOccupation && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.motherOccupation")}</span><span className="pd-detail-value">{p.motherOccupation}</span></div>}
                {p.siblings         && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.siblings")}</span><span className="pd-detail-value">{p.siblings}</span></div>}
                {p.familyType       && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.familyType")}</span><span className="pd-detail-value">{p.familyType}</span></div>}
                {p.familyValues     && <div className="pd-detail-item pd-detail-full"><span className="pd-detail-label">{t("profileDetail.familyValues")}</span><span className="pd-detail-value">{p.familyValues}</span></div>}
              </div>
            </div>
          )}

          {(pref.ageFrom || pref.ageTo || pref.education?.length || pref.profession?.length) && (
            <div className="pd-card">
              <h3 className="pd-card-title"><span className="pd-card-icon"><IcoLoveCard /></span>{t("profileDetail.partnerPreferences")}</h3>
              <div className="pd-detail-grid">
                {(pref.ageFrom || pref.ageTo) && (
                  <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.ageRange")}</span><span className="pd-detail-value">{pref.ageFrom || "18"} – {pref.ageTo || "60"} {t("profileDetail.yrs")}</span></div>
                )}
                {pref.heightFrom && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.heightRange")}</span><span className="pd-detail-value">{pref.heightFrom} – {pref.heightTo || t("profileDetail.any")}</span></div>}
                {pref.education?.length > 0 && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.education")}</span><span className="pd-detail-value">{pref.education.join(", ")}</span></div>}
                {pref.profession?.length > 0 && <div className="pd-detail-item"><span className="pd-detail-label">{t("profileDetail.profession")}</span><span className="pd-detail-value">{pref.profession.join(", ")}</span></div>}
                {pref.location?.length > 0 && <div className="pd-detail-item pd-detail-full"><span className="pd-detail-label">{t("profileDetail.preferredLocation")}</span><span className="pd-detail-value">{pref.location.join(", ")}</span></div>}
              </div>
            </div>
          )}

          {!isOwnProfile && (
            <div className="pd-premium-cta">
              <div className="pd-premium-left">
                <IcoShield />
                <div>
                  <h4 className="pd-premium-title">{t("profileDetail.premium.title")}</h4>
                  <p className="pd-premium-desc">{t("profileDetail.premium.desc", { name })}</p>
                </div>
              </div>
              <div className="pd-premium-btns">
                <button className="pd-premium-btn-white"   onClick={() => requireLogin(() => setModal("contact"))}><IcoPhone /> {t("profileDetail.premium.viewContact")}</button>
                <button className="pd-premium-btn-outline" onClick={() => requireLogin(() => setModal("message"))}><IcoMail /> {t("profileDetail.premium.sendEmail")}</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {modal === "login"              && <LoginRequiredModal      onClose={closeModal} onLogin={() => { closeModal(); onLogin?.(); }} onRegister={() => { closeModal(); onRegister?.(); }} />}
      {modal === "interest"           && <SendInterestModal       profileName={name} onClose={closeModal} onSend={handleSendInterest} />}
      {modal === "interestSent"       && <InterestSentModal       profileName={name} onClose={closeModal} onGoInterests={() => { closeModal(); navigate("interests"); }} />}
      {modal === "shortlist"          && <ShortlistModal          profileName={name} onClose={closeModal} />}
      {modal === "alreadyShortlisted" && <AlreadyShortlistedModal profileName={name} onClose={closeModal} onGoShortlist={() => { closeModal(); navigate("shortlist"); }} />}
      {modal === "message"            && <SendMessageModal        profileName={name} onClose={closeModal} onSend={handleSendMessage} />}
      {modal === "messageSent"        && <MessageSentModal        profileName={name} onClose={closeModal} onGoMessages={() => { closeModal(); navigate("messages"); }} />}
      {modal === "contact"            && <ViewContactModal        profile={p} onClose={closeModal} />}
    </div>
  );
}
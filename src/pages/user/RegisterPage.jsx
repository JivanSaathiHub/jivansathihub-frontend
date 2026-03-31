import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../api";
import "./RegisterPage.css";

/* ─── Constants ──────────────────────────────────────────────── */
const RELIGIONS     = ["Hindu","Muslim","Christian","Sikh","Jain","Buddhist","Other"];
const STATES        = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Other"];
const MARITAL       = ["Never Married","Divorced","Widowed","Separated"];
const MOTHER_TONGUE = ["Hindi","Marathi","Gujarati","Punjabi","Tamil","Telugu","Kannada","Malayalam","Bengali","Odia","Urdu","Other"];
const HEIGHTS       = Array.from({ length: 36 }, (_, i) => {
  const totalIn = 54 + i;
  const ft = Math.floor(totalIn / 12), inc = totalIn % 12, cm = Math.round(totalIn * 2.54);
  return `${ft}'${inc}" (${cm} cm)`;
});
const WEIGHTS    = Array.from({ length: 71 }, (_, i) => `${40 + i} kg`);
const EDUCATIONS = ["10th","12th / Diploma","Bachelor's Degree","Master's Degree","PhD / Doctorate","MBBS / MD","CA / CS","LLB / LLM","B.Tech / B.E.","MBA","Other"];
const INCOMES    = ["Below ₹2 LPA","₹2–5 LPA","₹5–10 LPA","₹10–20 LPA","₹20–40 LPA","₹40–75 LPA","₹75 LPA+","Not Disclosed"];
const FAM_TYPE   = ["Joint Family","Nuclear Family","Extended Family"];
const FAM_VALUES = ["Traditional","Moderate","Liberal"];
const RESIDENTIAL= ["Own House","Rented","With Parents","Hostel / PG","Other"];
const LOOKING_FOR= ["Bride","Groom"];
const AGE_FROM   = Array.from({ length: 33 }, (_, i) => `${18 + i} yrs`);
const AGE_TO     = Array.from({ length: 33 }, (_, i) => `${18 + i} yrs`);

const OTP_API_BASE = "http://localhost:5000/api/otp";

const INITIAL = {
  profileFor:"Self", fullName:"", gender:"", dateOfBirth:"", maritalStatus:"",
  email:"", mobile:"", password:"", confirmPassword:"",
  emailVerified: false,
  height:"", weight:"", religion:"", caste:"", motherTongue:"",
  education:"", educationDetails:"", occupation:"", annualIncome:"",
  country:"India", state:"", city:"", residentialStatus:"",
  fatherName:"", fatherOccupation:"", motherName:"", motherOccupation:"",
  siblings:"", familyType:"", familyValues:"", aboutMe:"",
  lookingFor:"", ageFrom:"", ageTo:"", heightFrom:"", heightTo:"",
  preferredEducation:"", preferredProfession:"", preferredLocation:"",
  preferredReligion:"", hobbies:"",
  photos: [], termsAccepted: false,
};

/* ─── Validation ─────────────────────────────────────────────── */
function validate(step, f, t) {
  const e = {};
  if (step === 1) {
    if (!f.fullName.trim())  e.fullName      = t('registerPage.validation.required');
    if (!f.gender)           e.gender        = t('registerPage.validation.required');
    if (!f.dateOfBirth)      e.dateOfBirth   = t('registerPage.validation.required');
    else {
      const age = Math.floor((Date.now() - new Date(f.dateOfBirth)) / (365.25 * 864e5));
      if (age < 18) e.dateOfBirth = t('registerPage.validation.ageLimit');
    }
    if (!f.maritalStatus)    e.maritalStatus = t('registerPage.validation.required');
  }
  if (step === 2) {
    if (!f.email)  e.email = t('registerPage.validation.required');
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = t('registerPage.validation.invalidEmail');
    if (!f.mobile) e.mobile = t('registerPage.validation.required');
    else if (!/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = t('registerPage.validation.invalidMobile');
    if (!f.password) e.password = t('registerPage.validation.required');
    else if (f.password.length < 8) e.password = t('registerPage.validation.passwordShort');
    else if (!/\d/.test(f.password)) e.password = t('registerPage.validation.passwordShort');
    if (f.password !== f.confirmPassword) e.confirmPassword = t('registerPage.validation.passwordMismatch');
  }
  if (step === 3) {
    if (!f.height)       e.height       = t('registerPage.validation.required');
    if (!f.religion)     e.religion     = t('registerPage.validation.required');
    if (!f.motherTongue) e.motherTongue = t('registerPage.validation.required');
    if (!f.education)    e.education    = t('registerPage.validation.required');
    if (!f.occupation)   e.occupation   = t('registerPage.validation.required');
    if (!f.emailVerified) e.emailOtp    = t('registerPage.validation.required');
  }
  if (step === 4) {
    if (!f.country.trim()) e.country = t('registerPage.validation.required');
    if (!f.state)          e.state   = t('registerPage.validation.required');
    if (!f.city.trim())    e.city    = t('registerPage.validation.required');
  }
  if (step === 6) {
    if (!f.lookingFor)    e.lookingFor    = t('registerPage.validation.required');
    if (!f.termsAccepted) e.termsAccepted = t('registerPage.validation.terms');
  }
  return e;
}

/* ─── Primitives ─────────────────────────────────────────────── */
function F({ label, req, err, hint, children }) {
  return (
    <div className="rw-field">
      <label className="rw-label">{label}{req && <span className="rw-req"> *</span>}</label>
      {children}
      {hint && !err && <span className="rw-hint">{hint}</span>}
      {err  && <span className="rw-error">⚠ {err}</span>}
    </div>
  );
}
const Inp = ({ err, ...p }) => <input    className={`rw-input${err ? " rw-input--err" : ""}`} {...p} />;
const Sel = ({ err, children, ...p }) => <select   className={`rw-input${err ? " rw-input--err" : ""}`} {...p}>{children}</select>;
const Txt = ({ err, ...p }) => <textarea className={`rw-input rw-textarea${err ? " rw-input--err" : ""}`} {...p} />;

/* ══════════════════════════════════════════════════════════════
   6-BOX OTP INPUT
══════════════════════════════════════════════════════════════ */
function OtpBoxes({ value, onChange, disabled }) {
  const refs   = [useRef(),useRef(),useRef(),useRef(),useRef(),useRef()];
  const digits = (value||"").split("").concat(Array(6).fill("")).slice(0,6);
  const move = (i, dir) => refs[i + dir]?.current?.focus();
  const onKey = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) { onChange(digits.map((d,x)=>x===i?"":d).join("")); }
      else if (i>0)  { move(i,-1); onChange(digits.map((d,x)=>x===i-1?"":d).join("")); }
      return;
    }
    if (e.key==="ArrowLeft"  && i>0) { move(i,-1); return; }
    if (e.key==="ArrowRight" && i<5) { move(i, 1); return; }
  };
  const onCh = (i, e) => {
    const v = e.target.value.replace(/\D/g,"");
    if (!v) return;
    if (v.length > 1) {
      const p = v.slice(0,6);
      onChange(Array.from({length:6},(_,x)=>p[x]||"").join(""));
      refs[Math.min(p.length-1,5)].current?.focus();
      return;
    }
    onChange(digits.map((d,x)=>x===i?v:d).join(""));
    if (i<5) move(i,1);
  };
  return (
    <div className="rw-otp-boxes">
      {digits.map((d,i) => (
        <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={6}
          value={d} disabled={disabled}
          className={`rw-otp-box${d?" rw-otp-box--filled":""}`}
          onChange={e=>onCh(i,e)} onKeyDown={e=>onKey(i,e)}
          onFocus={e=>e.target.select()}
          autoComplete={i===0?"one-time-code":"off"} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EMAIL OTP PANEL
══════════════════════════════════════════════════════════════ */
const RESEND_SECS = 30;

function EmailOtpPanel({ email, fullName, verified, onVerified }) {
  const { t } = useTranslation();
  const [phase,    setPhase]   = useState(verified ? "done" : "idle");
  const [otp,      setOtp]     = useState("");
  const [otpErr,   setOtpErr]  = useState("");
  const [sending,  setSending] = useState(false);
  const [checking, setChecking]= useState(false);
  const [secs,     setSecs]    = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { if (verified) setPhase("done"); }, [verified]);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setSecs(RESEND_SECS);
    timerRef.current = setInterval(() =>
      setSecs(s => { if (s <= 1) { clearInterval(timerRef.current); return 0; } return s - 1; }), 1000);
  };

  const doSend = async () => {
    setSending(true); setOtpErr("");
    try {
      const res = await fetch(`${OTP_API_BASE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtp(""); setPhase("verify"); startTimer();
    } catch (err) {
      setOtpErr(err.message || "Could not send OTP. Please try again.");
    } finally { setSending(false); }
  };

  const doVerify = async () => {
    if (otp.length < 6) { setOtpErr("Please enter the complete 6-digit OTP."); return; }
    setChecking(true); setOtpErr("");
    try {
      const res = await fetch(`${OTP_API_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setPhase("done"); onVerified(true);
      clearInterval(timerRef.current);
    } catch (err) {
      setOtpErr(err.message || "Incorrect OTP. Please try again."); setOtp("");
    } finally { setChecking(false); }
  };

  const doReset = () => {
    setPhase("idle"); setOtp(""); setOtpErr("");
    onVerified(false); clearInterval(timerRef.current); setSecs(0);
  };

  const emailOk = /\S+@\S+\.\S+/.test(email);
  const masked  = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.min(b.length, 4)) + c)
    : "";

  if (phase === "done") return (
    <div className="otp-card otp-card--done">
      <div className="otp-done-tick">✓</div>
      <div className="otp-done-info">
        <span className="otp-done-title">{t('registerPage.otp.emailVerified')}</span>
        <span className="otp-done-sub">{masked}</span>
      </div>
      <button className="otp-change-btn" type="button" onClick={doReset}>{t('registerPage.otp.wrongEmail')}</button>
    </div>
  );

  if (phase === "idle") return (
    <div className="otp-card otp-card--idle">
      <span className="otp-card-icon">✉️</span>
      <div className="otp-idle-text">
        <p className="otp-idle-title">{t('registerPage.otp.verifyEmail')} <span className="rw-req">*</span></p>
        <p className="otp-idle-sub">
          {emailOk
            ? <>An OTP will be sent to <strong>{masked}</strong></>
            : "Please enter a valid email address in Step 2 first"}
        </p>
      </div>
      <button
        className={`otp-send-btn${sending?" otp-btn--spin":""}`}
        type="button" onClick={doSend} disabled={sending||!emailOk}
      >
        {sending ? <><span className="otp-spin"/>{t('registerPage.otp.sending')}</> : t('registerPage.otp.sendOtp')}
      </button>
    </div>
  );

  return (
    <div className="otp-card otp-card--verify">
      <div className="otp-verify-head">
        <span className="otp-pulse-dot"/>
        <div>
          <p className="otp-verify-title">OTP sent to <strong>{masked}</strong></p>
          <p className="otp-verify-sub">Enter the 6-digit code · Valid for 10 minutes · Check spam folder</p>
        </div>
      </div>
      <OtpBoxes value={otp} onChange={setOtp} disabled={checking}/>
      {otpErr && <p className="otp-field-err">⚠ {otpErr}</p>}
      <div className="otp-foot">
        <button
          className={`otp-verify-btn${checking?" otp-btn--spin":""}`}
          type="button" onClick={doVerify}
          disabled={checking||otp.replace(/\s/g,"").length<6}
        >
          {checking ? <><span className="otp-spin"/>{t('registerPage.otp.verifying')}</> : `${t('registerPage.otp.verifyOtp')} →`}
        </button>
        <div className="otp-links">
          {secs > 0
            ? <span className="otp-countdown">Resend in <strong>{secs}s</strong></span>
            : <button className="otp-txt-btn" type="button" onClick={doSend}>{t('registerPage.otp.resend')}</button>}
          <span className="otp-sep">·</span>
          <button className="otp-txt-btn otp-txt-btn--grey" type="button" onClick={doReset}>{t('registerPage.otp.wrongEmail')}</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════  STEP 1 */
function Step1({ f, e, u }) {
  const { t } = useTranslation();
  const maxDob = new Date(Date.now() - 18*365.25*864e5).toISOString().split("T")[0];
  return (
    <>
      <h3 className="rw-section-title">{t('registerPage.step1.title')}</h3>
      <div className="rw-grid-2">
        <F label={t('registerPage.step1.profileFor')} req>
          <Sel value={f.profileFor} onChange={u("profileFor")}>
            {["Self","Son","Daughter","Brother","Sister","Friend","Relative"].map(o=><option key={o}>{o}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step1.fullName')} req err={e.fullName}>
          <Inp type="text" placeholder={t('registerPage.step1.fullName')} value={f.fullName} onChange={u("fullName")} err={e.fullName}/>
        </F>
        <F label={t('registerPage.step1.gender')} req err={e.gender}>
          <Sel value={f.gender} onChange={u("gender")} err={e.gender}>
            <option value="">{t('registerPage.step1.selectGender')}</option>
            <option value="Male">Male (Groom)</option>
            <option value="Female">Female (Bride)</option>
            <option value="Other">Other</option>
          </Sel>
        </F>
        <F label={t('registerPage.step1.dob')} req err={e.dateOfBirth}>
          <Inp type="date" max={maxDob} value={f.dateOfBirth} onChange={u("dateOfBirth")} err={e.dateOfBirth}/>
        </F>
      </div>
      <div className="rw-grid-1">
        <F label={t('registerPage.step1.maritalStatus')} req err={e.maritalStatus}>
          <Sel value={f.maritalStatus} onChange={u("maritalStatus")} err={e.maritalStatus}>
            <option value="">{t('registerPage.step1.selectMarital')}</option>
            {MARITAL.map(m=><option key={m}>{m}</option>)}
          </Sel>
        </F>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════  STEP 2 */
function Step2({ f, e, u }) {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="rw-section-title">{t('registerPage.step2.title')}</h3>
      <div className="rw-grid-2">
        <F label={t('registerPage.step2.email')} req err={e.email}>
          <Inp type="email" placeholder="your@email.com" value={f.email} onChange={u("email")} err={e.email}/>
        </F>
        <F label={t('registerPage.step2.mobile')} req err={e.mobile}>
          <div className="rw-phone-wrap">
            <span className="rw-phone-code">+91</span>
            <Inp type="tel" placeholder="XXXXX XXXXX" maxLength={10}
              value={f.mobile} onChange={u("mobile")} err={e.mobile} style={{paddingLeft:48}}/>
          </div>
        </F>
        <F label={t('registerPage.step2.password')} req err={e.password}>
          <Inp type="password" placeholder="Minimum 8 characters" value={f.password} onChange={u("password")} err={e.password}/>
        </F>
        <F label={t('registerPage.step2.confirmPassword')} req err={e.confirmPassword}>
          <Inp type="password" placeholder="Re-enter password" value={f.confirmPassword} onChange={u("confirmPassword")} err={e.confirmPassword}/>
        </F>
      </div>
      <div className="rw-info-banner">
        <span className="rw-info-icon">✉</span>
        {t('registerPage.step2.emailHint')}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════  STEP 3 */
function Step3({ f, e, u, setForm }) {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="rw-section-title">{t('registerPage.step3.title')}</h3>
      <div className="rw-grid-2">
        <F label={t('registerPage.step3.height')} req err={e.height}>
          <Sel value={f.height} onChange={u("height")} err={e.height}>
            <option value="">Select height</option>
            {HEIGHTS.map(h=><option key={h}>{h}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step3.weight')}>
          <Sel value={f.weight} onChange={u("weight")}>
            <option value="">Enter weight</option>
            {WEIGHTS.map(w=><option key={w}>{w}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step3.religion')} req err={e.religion}>
          <Sel value={f.religion} onChange={u("religion")} err={e.religion}>
            <option value="">Select religion</option>
            {RELIGIONS.map(r=><option key={r}>{r}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step3.caste')}>
          <Inp type="text" placeholder="Enter community" value={f.caste} onChange={u("caste")}/>
        </F>
        <F label={t('registerPage.step3.motherTongue')} req err={e.motherTongue}>
          <Sel value={f.motherTongue} onChange={u("motherTongue")} err={e.motherTongue}>
            <option value="">Enter mother tongue</option>
            {MOTHER_TONGUE.map(m=><option key={m}>{m}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step3.education')} req err={e.education}>
          <Sel value={f.education} onChange={u("education")} err={e.education}>
            <option value="">Select qualification</option>
            {EDUCATIONS.map(x=><option key={x}>{x}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step3.educationDetails')}>
          <Inp type="text" placeholder="e.g., B.Tech in Computer Science" value={f.educationDetails} onChange={u("educationDetails")}/>
        </F>
        <F label={t('registerPage.step3.occupation')} req err={e.occupation}>
          <Inp type="text" placeholder="e.g., Software Engineer" value={f.occupation} onChange={u("occupation")} err={e.occupation}/>
        </F>
      </div>
      <div className="rw-grid-1">
        <F label={t('registerPage.step3.income')}>
          <Sel value={f.annualIncome} onChange={u("annualIncome")}>
            <option value="">Select income range</option>
            {INCOMES.map(i=><option key={i}>{i}</option>)}
          </Sel>
        </F>
      </div>

      <div className="rw-verify-divider">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1L7.5 4.5H11L8.3 6.8L9.5 10.5L6 8.2L2.5 10.5L3.7 6.8L1 4.5H4.5L6 1Z" fill="#cc0000"/>
        </svg>
        {t('registerPage.step3.verification')}
      </div>

      <div className="rw-verify-block">
        <div className="rw-verify-row">
          <span className={`rw-vnum${f.emailVerified?" rw-vnum--done":""}`}>{f.emailVerified?"✓":"1"}</span>
          <span className="rw-vlabel">{t('registerPage.step3.emailVerification')}</span>
          {f.emailVerified && <span className="rw-vchip">✓ {t('registerPage.otp.emailVerified')}</span>}
        </div>
        <EmailOtpPanel
          email={f.email}
          fullName={f.fullName}
          verified={f.emailVerified}
          onVerified={v => setForm(p=>({...p, emailVerified:v}))}
        />
        {e.emailOtp && !f.emailVerified && (
          <span className="rw-error" style={{marginTop:6,display:"block"}}>⚠ {e.emailOtp}</span>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════  STEP 4 */
function Step4({ f, e, u }) {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="rw-section-title">{t('registerPage.step4.title')}</h3>
      <div className="rw-grid-2">
        <F label={t('registerPage.step4.country')} req err={e.country}>
          <Inp type="text" placeholder="Enter country" value={f.country} onChange={u("country")} err={e.country}/>
        </F>
        <F label={t('registerPage.step4.state')} req err={e.state}>
          <Sel value={f.state} onChange={u("state")} err={e.state}>
            <option value="">Enter state</option>
            {STATES.map(s=><option key={s}>{s}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step4.city')} req err={e.city}>
          <Inp type="text" placeholder="Enter city" value={f.city} onChange={u("city")} err={e.city}/>
        </F>
        <F label={t('registerPage.step4.residentialStatus')}>
          <Sel value={f.residentialStatus} onChange={u("residentialStatus")}>
            <option value="">Select status</option>
            {RESIDENTIAL.map(r=><option key={r}>{r}</option>)}
          </Sel>
        </F>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════  STEP 5 */
function Step5({ f, e, u }) {
  const { t } = useTranslation();
  return (
    <>
      <h3 className="rw-section-title">{t('registerPage.step5.title')}</h3>
      <div className="rw-grid-2">
        <F label={t('registerPage.step5.fatherName')}>
          <Inp type="text" placeholder="Enter father's name" value={f.fatherName} onChange={u("fatherName")}/>
        </F>
        <F label={t('registerPage.step5.fatherOccupation')}>
          <Inp type="text" placeholder="Enter occupation" value={f.fatherOccupation} onChange={u("fatherOccupation")}/>
        </F>
        <F label={t('registerPage.step5.motherName')}>
          <Inp type="text" placeholder="Enter mother's name" value={f.motherName} onChange={u("motherName")}/>
        </F>
        <F label={t('registerPage.step5.motherOccupation')}>
          <Inp type="text" placeholder="Enter occupation" value={f.motherOccupation} onChange={u("motherOccupation")}/>
        </F>
        <F label={t('registerPage.step5.siblings')}>
          <Inp type="text" placeholder="e.g., 1 Brother, 1 Sister" value={f.siblings} onChange={u("siblings")}/>
        </F>
        <F label={t('registerPage.step5.familyType')}>
          <Sel value={f.familyType} onChange={u("familyType")}>
            <option value="">Select type</option>
            {FAM_TYPE.map(x=><option key={x}>{x}</option>)}
          </Sel>
        </F>
      </div>
      <div className="rw-grid-1">
        <F label={t('registerPage.step5.familyValues')}>
          <Sel value={f.familyValues} onChange={u("familyValues")}>
            <option value="">Select values</option>
            {FAM_VALUES.map(x=><option key={x}>{x}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step5.aboutMe')}>
          <Txt placeholder="Write a brief description about yourself…" value={f.aboutMe} onChange={u("aboutMe")} rows={4}/>
        </F>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════  STEP 6 */
function Step6({ f, e, u, setForm }) {
  const { t } = useTranslation();
  const fileRef = useRef();
  const handlePhotos = ev => {
    const prev = Array.from(ev.target.files).map(file=>({file,url:URL.createObjectURL(file)}));
    setForm(p=>({...p,photos:[...p.photos,...prev].slice(0,5)}));
  };
  const removePhoto = idx => setForm(p=>({...p,photos:p.photos.filter((_,i)=>i!==idx)}));

  return (
    <>
      <h3 className="rw-section-title">{t('registerPage.step6.title')}</h3>
      <div className="rw-grid-2">
        <F label={t('registerPage.step6.lookingFor')} req err={e.lookingFor}>
          <Sel value={f.lookingFor} onChange={u("lookingFor")} err={e.lookingFor}>
            <option value="">Select</option>
            {LOOKING_FOR.map(x=><option key={x}>{x}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step6.ageRange')}>
          <div className="rw-range-wrap">
            <Sel value={f.ageFrom} onChange={u("ageFrom")} style={{flex:1}}><option value="">From</option>{AGE_FROM.map(a=><option key={a}>{a}</option>)}</Sel>
            <span className="rw-range-sep">–</span>
            <Sel value={f.ageTo} onChange={u("ageTo")} style={{flex:1}}><option value="">To</option>{AGE_TO.map(a=><option key={a}>{a}</option>)}</Sel>
          </div>
        </F>
      </div>
      <div className="rw-grid-2">
        <F label={t('registerPage.step6.heightRange')}>
          <div className="rw-range-wrap">
            <Sel value={f.heightFrom} onChange={u("heightFrom")} style={{flex:1}}><option value="">From</option>{HEIGHTS.map(h=><option key={h}>{h}</option>)}</Sel>
            <span className="rw-range-sep">–</span>
            <Sel value={f.heightTo} onChange={u("heightTo")} style={{flex:1}}><option value="">To</option>{HEIGHTS.map(h=><option key={h}>{h}</option>)}</Sel>
          </div>
        </F>
        <F label={t('registerPage.step6.preferredEducation')}>
          <Inp type="text" placeholder="e.g., Bachelor's or higher" value={f.preferredEducation} onChange={u("preferredEducation")}/>
        </F>
      </div>
      <div className="rw-grid-2">
        <F label={t('registerPage.step6.preferredProfession')}>
          <Inp type="text" placeholder="e.g., IT Professional, Doctor" value={f.preferredProfession} onChange={u("preferredProfession")}/>
        </F>
        <F label={t('registerPage.step6.preferredLocation')}>
          <Inp type="text" placeholder="e.g., Mumbai, Bangalore" value={f.preferredLocation} onChange={u("preferredLocation")}/>
        </F>
      </div>
      <div className="rw-grid-1">
        <F label={t('registerPage.step6.preferredReligion')}>
          <Sel value={f.preferredReligion} onChange={u("preferredReligion")}>
            <option value="">No preference</option>
            {RELIGIONS.map(r=><option key={r}>{r}</option>)}
          </Sel>
        </F>
        <F label={t('registerPage.step6.hobbies')}>
          <Inp type="text" placeholder="e.g., Reading, Traveling, Cooking" value={f.hobbies} onChange={u("hobbies")}/>
        </F>
      </div>

      <div className="rw-photo-section">
        {f.photos.length > 0 ? (
          <div className="rw-photo-grid">
            {f.photos.map((p,i)=>(
              <div key={i} className="rw-photo-thumb">
                <img src={p.url} alt={`photo-${i}`}/>
                <button className="rw-photo-remove" onClick={()=>removePhoto(i)} type="button">✕</button>
              </div>
            ))}
            {f.photos.length < 5 && <button className="rw-photo-add-more" onClick={()=>fileRef.current?.click()} type="button">+ Add</button>}
          </div>
        ) : (
          <div className="rw-photo-empty" onClick={()=>fileRef.current?.click()}>
            <div className="rw-photo-cam">
              <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
                <path d="M11 2L8.5 6H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4.5L21 2H11Z" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="16" cy="15" r="5" stroke="#9ca3af" strokeWidth="2"/>
              </svg>
            </div>
            <p className="rw-photo-title">{t('registerPage.step6.uploadPhotos')}</p>
            <p className="rw-photo-sub">Add at least one photo to increase profile visibility by 10x</p>
            <button className="rw-photo-btn" type="button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{marginRight:6}}>
                <path d="M8 1v10M4 5l4-4 4 4M2 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              {t('registerPage.step6.choosePhotos')}
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={handlePhotos}/>
      </div>

      <div className={`rw-terms-banner${e.termsAccepted?" rw-terms-banner--err":""}`}
        onClick={()=>setForm(p=>({...p,termsAccepted:!p.termsAccepted}))}>
        <div className={`rw-terms-check${f.termsAccepted?" rw-terms-check--on":""}`}>{f.termsAccepted&&"✓"}</div>
        <span>{t('registerPage.step6.terms')}</span>
      </div>
      {e.termsAccepted && <span className="rw-error" style={{marginTop:4,display:"block"}}>⚠ {e.termsAccepted}</span>}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function RegisterPage({ onBack, onLogin, prefill, onSuccess }) {
  const { t } = useTranslation();

  const STEPS = [
    t('registerPage.steps.basic'),
    t('registerPage.steps.contact'),
    t('registerPage.steps.personal'),
    t('registerPage.steps.location'),
    t('registerPage.steps.family'),
    t('registerPage.steps.preferences'),
  ];

  const [step,     setStep]     = useState(1);
  const [form,     setForm]     = useState({
    ...INITIAL,
    gender:   prefill?.lookingFor==="Bride"?"Female":prefill?.lookingFor==="Groom"?"Male":"",
    religion: prefill?.religion||"",
    city:     prefill?.location||"",
  });
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState("");
  const [success,  setSuccess]  = useState(false);

  const update = field => ev => {
    setForm(p=>({...p,[field]:ev.target.value}));
    setErrors(p=>{const n={...p};delete n[field];return n;});
    if (apiError) setApiError("");
  };
  const scrollTop = () => document.querySelector(".rw-body")?.scrollTo(0,0);

  const handleNext = () => {
    const errs = validate(step, form, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setStep(s=>s+1); scrollTop();
  };
  const handleBack = () => { setErrors({}); setStep(s=>s-1); scrollTop(); };

  const handleSubmit = async () => {
    const errs = validate(step, form, t);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true); setApiError("");
    try {
      const fd = new FormData();
      const { photos, ...rest } = form;
      Object.entries(rest).forEach(([k,v])=>fd.append(k,v));
      photos.forEach((p,i)=>fd.append(`photo_${i}`,p.file));
      await registerUser(fd);
      setSuccess(true);
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="rw-overlay">
      <div className="rw-modal rw-modal--success">
        <div className="rw-success-content">
          <div className="rw-success-icon">🎉</div>
          <h2>{t('registerPage.successTitle')}</h2>
          <p>{t('registerPage.successMsg')}</p>
          <button className="rw-btn-primary" onClick={() => onSuccess?.()}>
            {t('registerPage.getStarted')} →
          </button>
        </div>
      </div>
    </div>
  );

  const SCREENS = [null, Step1, Step2, Step3, Step4, Step5, Step6];
  const Screen  = SCREENS[step];
  const isLast  = step === 6;
  const progress = ((step-1)/5)*100;

  return (
    <div className="rw-overlay">
      <div className="rw-modal">
        <div className="rw-header">
          <div className="rw-header-text">
            <h2>{t('registerPage.title')}</h2>
            <span className="rw-step-of">{t('registerPage.step', { step, total: 6 })}</span>
          </div>
          <button className="rw-close-btn" onClick={onBack} aria-label="Close">✕</button>
        </div>
        <div className="rw-progress-track">
          <div className="rw-progress-fill" style={{width:`${progress}%`}}/>
        </div>
        <div className="rw-steps-bar">
          {STEPS.map((label,i)=>{
            const n=i+1, active=n===step, done=n<step;
            return (
              <div key={n} className={`rw-step-item${active?" rw-step-item--active":done?" rw-step-item--done":""}`}>
                <div className="rw-step-circle">
                  {done?<svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>:n}
                </div>
                <span className="rw-step-label">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="rw-body">
          {apiError && <div className="rw-api-error">⚠ {apiError}</div>}
          <Screen f={form} e={errors} u={update} setForm={setForm}/>
        </div>
        <div className="rw-footer">
          <div className="rw-footer-left">
            {step>1
              ? <button className="rw-btn-ghost" onClick={handleBack}>← {t('registerPage.back')}</button>
              : <p className="rw-login-hint">{t('registerPage.haveAccount')}{" "}<button className="rw-link-btn" onClick={onLogin}>{t('registerPage.login')}</button></p>
            }
          </div>
          {isLast
            ? <button className="rw-btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading?<><span className="rw-btn-spinner"/> {t('registerPage.creatingAccount')}</> : `✓ ${t('registerPage.completeRegistration')}`}
              </button>
            : <button className="rw-btn-primary" onClick={handleNext}>
                {t('registerPage.next')} <span className="rw-btn-arrow">→</span>
              </button>
          }
        </div>
      </div>
    </div>
  );
}
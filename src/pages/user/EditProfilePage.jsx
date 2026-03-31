import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from '../../api';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import "./EditProfilePage.css";

function IcoSave() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
    </svg>
  );
}
function IcoChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

/* ── Sibling options: 0 to 5 brothers + 0 to 5 sisters combos ── */
const SIBLING_OPTIONS = ["No Siblings"];
for (let b = 0; b <= 5; b++) {
  for (let s = 0; s <= 5; s++) {
    if (b === 0 && s === 0) continue;
    const parts = [];
    if (b > 0) parts.push(`${b} Brother${b > 1 ? "s" : ""}`);
    if (s > 0) parts.push(`${s} Sister${s > 1 ? "s" : ""}`);
    SIBLING_OPTIONS.push(parts.join(", "));
  }
}

/* ── Full education options ── */
const EDUCATION_OPTIONS = [
  // School
  "10th / SSC",
  "12th / HSC / Diploma",
  // Undergraduate
  "B.A. (Bachelor of Arts)",
  "B.Sc. (Bachelor of Science)",
  "B.Com. (Bachelor of Commerce)",
  "B.Tech / B.E. (Engineering)",
  "B.Arch. (Architecture)",
  "B.Pharm. (Pharmacy)",
  "B.Sc. Nursing",
  "BBA (Business Administration)",
  "BCA (Computer Applications)",
  "B.Ed. (Education)",
  "LLB (Law)",
  "MBBS (Medicine)",
  "BDS (Dental Surgery)",
  "BAMS (Ayurvedic Medicine)",
  "BHMS (Homeopathy)",
  "B.Des. (Design)",
  "B.Sc. Agriculture",
  "B.Voc. (Vocational)",
  // Postgraduate
  "M.A. (Master of Arts)",
  "M.Sc. (Master of Science)",
  "M.Com. (Master of Commerce)",
  "M.Tech / M.E. (Engineering)",
  "M.Arch. (Architecture)",
  "MBA (Business Administration)",
  "MCA (Computer Applications)",
  "M.Ed. (Education)",
  "LLM (Master of Law)",
  "MD / MS (Medical)",
  "MDS (Dental Surgery)",
  "M.Pharm. (Pharmacy)",
  "M.Des. (Design)",
  // Professional / Certifications
  "CA (Chartered Accountant)",
  "CS (Company Secretary)",
  "CMA / ICWA",
  "CFA (Chartered Financial Analyst)",
  "CFP (Financial Planner)",
  "ACCA",
  // Doctorate
  "PhD / Doctorate",
  "Post Doctoral",
  // Other
  "ITI / Trade Certificate",
  "Polytechnic Diploma",
  "Other",
];

/* ── Field component updated to accept options as objects { value, label } ── */
function Field({ label, type = "text", value, onChange, placeholder, options, required }) {
  const { t } = useTranslation();
  
  // If options is an array of strings, convert to array of objects (value = string, label = string)
  const processedOptions = Array.isArray(options) && options.length > 0 && typeof options[0] === 'string'
    ? options.map(opt => ({ value: opt, label: opt }))
    : options;

  if (processedOptions) {
    return (
      <div className="ep-field">
        <label className="ep-label">{label}{required && <span className="ep-req">*</span>}</label>
        <div className="ep-select-wrap">
          <select className="ep-select" value={value} onChange={onChange}>
            <option value="">{t('editProfile.select')}</option>
            {processedOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="ep-select-icon"><IcoChevron /></span>
        </div>
      </div>
    );
  }
  
  if (type === "textarea") {
    return (
      <div className="ep-field ep-field--full">
        <label className="ep-label">{label}{required && <span className="ep-req">*</span>}</label>
        <textarea className="ep-textarea" value={value} onChange={onChange} placeholder={placeholder} rows={4} />
      </div>
    );
  }
  
  return (
    <div className="ep-field">
      <label className="ep-label">{label}{required && <span className="ep-req">*</span>}</label>
      <input className="ep-input" type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="ep-section">
      <h2 className="ep-section-title">{title}</h2>
      <div className="ep-grid">{children}</div>
    </div>
  );
}

export default function EditProfilePage({
  onBack, onLogin, onRegister, onHelp, onAboutClick, onMenuClick,
}) {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    fullName:         user?.fullName         || "",
    height:           user?.height           || "",
    weight:           user?.weight           || "",
    maritalStatus:    user?.maritalStatus     || "",
    motherTongue:     user?.motherTongue      || "",
    religion:         user?.religion          || "",
    caste:            user?.caste             || "",
    aboutMe:          user?.aboutMe           || "",
    city:             user?.city              || "",
    state:            user?.state             || "",
    country:          user?.country           || "India",
    profession:       user?.profession        || "",
    employer:         user?.employer          || "",
    annualIncome:     user?.annualIncome       || "",
    education:        user?.education         || "",
    familyType:       user?.familyType        || "",
    familyValues:     user?.familyValues      || "",
    siblings:         user?.siblings          || "",
    fatherOccupation: user?.fatherOccupation  || "",
    motherOccupation: user?.motherOccupation  || "",
    hobbies:          Array.isArray(user?.hobbies)
                        ? user.hobbies.join(", ")
                        : (user?.hobbies || ""),
  });

  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [apiError, setApiError] = useState("");

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setSaved(false);
    setApiError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setApiError("");
    try {
      await updateProfile({
        fullName:         form.fullName,
        height:           form.height,
        weight:           form.weight,
        maritalStatus:    form.maritalStatus,
        motherTongue:     form.motherTongue,
        religion:         form.religion,
        caste:            form.caste,
        aboutMe:          form.aboutMe,
        city:             form.city,
        state:            form.state,
        country:          form.country,
        profession:       form.profession,
        employer:         form.employer,
        annualIncome:     form.annualIncome,
        education:        form.education,
        familyType:       form.familyType,
        familyValues:     form.familyValues,
        siblings:         form.siblings,
        fatherOccupation: form.fatherOccupation,
        motherOccupation: form.motherOccupation,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => { onBack(); }, 1000);
    } catch (err) {
      setApiError(err.response?.data?.message || t('editProfile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  // Original English option values
  const heightOptions = [
    "4'7\" (140 cm)","4'8\" (142 cm)","4'9\" (145 cm)","4'10\" (147 cm)","4'11\" (150 cm)",
    "5'0\" (152 cm)","5'1\" (155 cm)","5'2\" (157 cm)","5'3\" (160 cm)","5'4\" (163 cm)",
    "5'5\" (165 cm)","5'6\" (168 cm)","5'7\" (170 cm)","5'8\" (173 cm)","5'9\" (175 cm)",
    "5'10\" (178 cm)","5'11\" (180 cm)",
    "6'0\" (183 cm)","6'1\" (185 cm)","6'2\" (188 cm)","6'3\" (191 cm)","6'4\" (193 cm)",
  ];
  const weightOptions = Array.from({length:71},(_,i)=>`${40+i} kg`);
  const maritalStatusOptions = ["Never Married","Divorced","Widowed","Separated"];
  const motherTongueOptions = ["Hindi","Tamil","Telugu","Kannada","Malayalam","Bengali","Marathi","Gujarati","Punjabi","Odia","Urdu","Assamese","Maithili","Santali","Kashmiri","Sindhi","Konkani","Manipuri","Dogri","Bodo","Other"];
  const religionOptions = ["Hindu","Muslim","Christian","Sikh","Jain","Buddhist","Parsi / Zoroastrian","Jewish","No Religion","Other"];
  const annualIncomeOptions = [
    "Below ₹1 Lakh","₹1–2 Lakhs","₹2–3 Lakhs","₹3–5 Lakhs",
    "₹5–7 Lakhs","₹7–10 Lakhs","₹10–15 Lakhs","₹15–20 Lakhs",
    "₹20–30 Lakhs","₹30–50 Lakhs","₹50–75 Lakhs","₹75 Lakhs – 1 Crore",
    "Above ₹1 Crore","Not Disclosed",
  ];
  const familyTypeOptions = ["Nuclear Family","Joint Family","Extended Family"];
  const familyValuesOptions = ["Traditional","Moderate","Liberal"];
  const fatherOccupationOptions = [
    "Business / Self Employed","Government Employee","Private Sector Employee",
    "Doctor","Engineer","Lawyer","Teacher / Professor","Farmer","Army / Defence",
    "Police","Banker","Accountant","Architect","Scientist","Politician",
    "Retired","Passed Away","Not Employed","Other",
  ];
  const motherOccupationOptions = [
    "Homemaker","Business / Self Employed","Government Employee","Private Sector Employee",
    "Doctor","Engineer","Lawyer","Teacher / Professor","Banker","Accountant",
    "Nurse","Army / Defence","Retired","Passed Away","Not Employed","Other",
  ];

  // Helper to create translated option objects { value, label }
  const getTranslatedOptions = (baseKey, originalArray, transformFunc = (str) => str.replace(/[^a-zA-Z0-9]/g, '_')) => {
    return originalArray.map(value => ({
      value,
      label: t(`${baseKey}.${transformFunc(value)}`, value)
    }));
  };

  // For sibling options, we keep them as plain strings (value = label) because they contain numbers.
  // If you want to translate "Brother/Sister", you'd need a more complex mapping.
  const siblingOptions = SIBLING_OPTIONS.map(opt => ({
    value: opt,
    label: opt === "No Siblings" ? t('editProfile.siblings.noSiblings') : opt
  }));

  return (
    <div className="site-wrapper">
      <Navbar
        onHomeClick={onBack}
        onLoginClick={onLogin}
        onRegisterClick={onRegister}
        onHelpClick={onHelp}
        onAboutClick={onAboutClick}
        onMenuClick={onMenuClick}
      />

      <main className="ep-main">
        <div className="ep-page">

          {/* Top bar */}
          <div className="ep-topbar">
            <div>
              <h1 className="ep-title">{t('editProfile.title')}</h1>
              <p className="ep-sub">{t('editProfile.subtitle')}</p>
            </div>
            <div className="ep-topbar-actions">
              <button className="ep-cancel-btn" onClick={onBack} disabled={saving}>{t('editProfile.cancel')}</button>
              <button className="ep-save-btn" onClick={handleSave} disabled={saving}>
                <IcoSave /> {saving ? t('editProfile.saving') : saved ? t('editProfile.saved') : t('editProfile.saveChanges')}
              </button>
            </div>
          </div>

          {/* API error */}
          {apiError && (
            <div style={{
              background: "#fff5f5", border: "1.5px solid #fca5a5",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              color: "#cc0000", fontWeight: 600, fontSize: 14,
            }}>
              ⚠ {apiError}
            </div>
          )}

          {/* About */}
          <Section title={t('editProfile.sections.about')}>
            <Field label={t('editProfile.fields.aboutMe')} type="textarea" value={form.aboutMe} onChange={set("aboutMe")} placeholder={t('editProfile.placeholders.aboutMe')} />
          </Section>

          {/* Basic */}
          <Section title={t('editProfile.sections.basic')}>
            <Field label={t('editProfile.fields.fullName')}      value={form.fullName}      onChange={set("fullName")}      placeholder={t('editProfile.placeholders.fullName')}        required />
            <Field label={t('editProfile.fields.height')}         value={form.height}        onChange={set("height")}        options={heightOptions} />
            <Field label={t('editProfile.fields.weight')}         value={form.weight}        onChange={set("weight")}        options={weightOptions} />
            <Field label={t('editProfile.fields.maritalStatus')} value={form.maritalStatus} onChange={set("maritalStatus")} options={getTranslatedOptions('editProfile.maritalStatus', maritalStatusOptions, s => s.replace(/ /g,'_'))} />
            <Field label={t('editProfile.fields.motherTongue')}  value={form.motherTongue}  onChange={set("motherTongue")}  options={getTranslatedOptions('editProfile.motherTongue', motherTongueOptions)} />
            <Field label={t('editProfile.fields.religion')}       value={form.religion}      onChange={set("religion")}      options={getTranslatedOptions('editProfile.religion', religionOptions, s => s.replace(/[^a-zA-Z]/g,'_'))} />
            <Field label={t('editProfile.fields.caste')} value={form.caste}      onChange={set("caste")}         placeholder={t('editProfile.placeholders.caste')} />
          </Section>

          {/* Location */}
          <Section title={t('editProfile.sections.location')}>
            <Field label={t('editProfile.fields.city')}    value={form.city}    onChange={set("city")}    placeholder={t('editProfile.placeholders.city')}    />
            <Field label={t('editProfile.fields.state')}   value={form.state}   onChange={set("state")}   placeholder={t('editProfile.placeholders.state')}   />
            <Field label={t('editProfile.fields.country')} value={form.country} onChange={set("country")} placeholder={t('editProfile.placeholders.country')} />
          </Section>

          {/* Professional */}
          <Section title={t('editProfile.sections.professional')}>
            <Field label={t('editProfile.fields.profession')}    value={form.profession}   onChange={set("profession")}   placeholder={t('editProfile.placeholders.profession')} />
            <Field label={t('editProfile.fields.employer')}       value={form.employer}     onChange={set("employer")}     placeholder={t('editProfile.placeholders.employer')}    />
            <Field label={t('editProfile.fields.annualIncome')} value={form.annualIncome} onChange={set("annualIncome")} options={getTranslatedOptions('editProfile.annualIncome', annualIncomeOptions, s => s.replace(/[^a-zA-Z0-9]/g,'_'))} />
          </Section>

          {/* Education */}
          <Section title={t('editProfile.sections.education')}>
            <Field label={t('editProfile.fields.education')} value={form.education} onChange={set("education")} options={getTranslatedOptions('editProfile.education', EDUCATION_OPTIONS, s => s.replace(/[^a-zA-Z0-9]/g,'_'))} />
          </Section>

          {/* Family */}
          <Section title={t('editProfile.sections.family')}>
            <Field label={t('editProfile.fields.familyType')}          value={form.familyType}       onChange={set("familyType")}       options={getTranslatedOptions('editProfile.familyType', familyTypeOptions, s => s.replace(/ /g,'_'))} />
            <Field label={t('editProfile.fields.familyValues')}         value={form.familyValues}     onChange={set("familyValues")}     options={getTranslatedOptions('editProfile.familyValues', familyValuesOptions)} />
            <Field label={t('editProfile.fields.siblings')}             value={form.siblings}         onChange={set("siblings")}         options={siblingOptions} />
            <Field label={t('editProfile.fields.fatherOccupation')}  value={form.fatherOccupation} onChange={set("fatherOccupation")} options={getTranslatedOptions('editProfile.fatherOccupation', fatherOccupationOptions, s => s.replace(/[^a-zA-Z]/g,'_'))} />
            <Field label={t('editProfile.fields.motherOccupation')}  value={form.motherOccupation} onChange={set("motherOccupation")} options={getTranslatedOptions('editProfile.motherOccupation', motherOccupationOptions, s => s.replace(/[^a-zA-Z]/g,'_'))} />
          </Section>

          {/* Bottom save */}
          <div className="ep-bottom-actions">
            <button className="ep-cancel-btn" onClick={onBack} disabled={saving}>{t('editProfile.cancel')}</button>
            <button className="ep-save-btn" onClick={handleSave} disabled={saving}>
              <IcoSave /> {saving ? t('editProfile.saving') : saved ? t('editProfile.saved') : t('editProfile.saveChanges')}
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
// import { useState } from "react";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import "./CheckoutPage.css";

// /* ── Plan pricing data ── */
// const PLAN_INFO = {
//   free:    { name: "Free",     price: 0,     gst: 0,   billing: "Free Forever" },
//   premium: { name: "Gold",     price: 2499,  gst: 450, billing: "Monthly Subscription" },
//   elite:   { name: "Platinum", price: 4999,  gst: 900, billing: "Monthly Subscription" },
// };

// /* ── SVG Icons ── */
// const IconCard = ({ active }) => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
//     stroke={active ? "#cc0000" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="1" y="4" width="22" height="16" rx="2"/>
//     <line x1="1" y1="10" x2="23" y2="10"/>
//   </svg>
// );
// const IconUPI = ({ active }) => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
//     stroke={active ? "#cc0000" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="5" y="2" width="14" height="20" rx="2"/>
//     <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3"/>
//   </svg>
// );
// const IconBank = ({ active }) => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
//     stroke={active ? "#cc0000" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <rect x="3" y="10" width="2" height="7"/><rect x="7" y="10" width="2" height="7"/>
//     <rect x="11" y="10" width="2" height="7"/><rect x="15" y="10" width="2" height="7"/>
//     <rect x="19" y="10" width="2" height="7"/>
//     <path d="M1 21h22"/><path d="M12 3L2 9h20L12 3z"/>
//   </svg>
// );
// const IconShield = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
//     stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
//   </svg>
// );
// const IconCheck = () => (
//   <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
//     stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
//     <polyline points="22 4 12 14.01 9 11.01"/>
//   </svg>
// );

// export default function CheckoutPage({ planKey, billing, onBack, onLogin, onRegister, onHelp, onSuccess, onAboutClick, onMenuClick }) {
//   const goLogin    = () => typeof onLogin    === "function" && onLogin();
//   const goRegister = () => typeof onRegister === "function" && onRegister();
//   const goHelp     = () => typeof onHelp     === "function" && onHelp();

//   const plan     = PLAN_INFO[planKey] || PLAN_INFO["premium"];
//   const total    = plan.price + plan.gst;
//   const billingLabel = billing === "quarterly" ? "Quarterly Subscription"
//                      : billing === "yearly"    ? "Yearly Subscription"
//                      : plan.billing;

//   const [method,      setMethod]      = useState("card");
//   const [cardNumber,  setCardNumber]  = useState("");
//   const [cardName,    setCardName]    = useState("");
//   const [expiry,      setExpiry]      = useState("");
//   const [cvv,         setCvv]         = useState("");
//   const [upiId,       setUpiId]       = useState("");
//   const [bankName,    setBankName]    = useState("");
//   const [agreed,      setAgreed]      = useState(false);
//   const [errors,      setErrors]      = useState({});
//   const [paying,      setPaying]      = useState(false);

//   const handleCardNumber = (e) => {
//     const val = e.target.value.replace(/\D/g, "").slice(0, 16);
//     setCardNumber(val.replace(/(.{4})/g, "$1 ").trim());
//   };

//   const handleExpiry = (e) => {
//     let val = e.target.value.replace(/\D/g, "").slice(0, 4);
//     if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
//     setExpiry(val);
//   };

//   const validate = () => {
//     const errs = {};
//     if (!agreed) { errs.agreed = "Please agree to the Terms & Conditions."; }
//     if (method === "card") {
//       if (cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter a valid 16-digit card number.";
//       if (!cardName.trim())                          errs.cardName   = "Enter cardholder name.";
//       if (expiry.length < 5)                         errs.expiry     = "Enter valid expiry date.";
//       if (cvv.length < 3)                            errs.cvv        = "Enter valid CVV.";
//     }
//     if (method === "upi") {
//       if (!upiId.includes("@"))                      errs.upiId      = "Enter a valid UPI ID (e.g. name@upi).";
//     }
//     if (method === "bank") {
//       if (!bankName.trim())                          errs.bankName   = "Please select your bank.";
//     }
//     return errs;
//   };

//   const handlePay = () => {
//     const errs = validate();
//     setErrors(errs);
//     if (Object.keys(errs).length > 0) return;
//     setPaying(true);
//     setTimeout(() => {
//       setPaying(false);
//       if (onSuccess) onSuccess();
//     }, 1800);
//   };

//   const payLabel = plan.price === 0 ? "Activate Free Plan" : `Pay ₹${total.toLocaleString("en-IN")}`;

//   return (
//     <div className="cp-page">
//       <Navbar
//         onHomeClick={onBack}
//         onAboutClick={onAboutClick}
//         onLoginClick={goLogin}
//         onRegisterClick={goRegister}
//         onHelpClick={goHelp}
//         onMenuClick={onMenuClick}
//       />

//       <div className="cp-backbar">
//         <div className="cp-backbar-inner">
//           <button className="cp-back-btn" onClick={onBack}>← Back to Membership Plans</button>
//         </div>
//       </div>

//       <div className="cp-layout">
//         <div className="cp-form-card">
//           <h2 className="cp-form-title">Complete Your Purchase</h2>

//           {plan.price > 0 && (
//             <>
//               <h3 className="cp-section-label">Select Payment Method</h3>
//               <div className="cp-methods">
//                 <button className={`cp-method-btn ${method === "card" ? "cp-method-active" : ""}`} onClick={() => { setMethod("card"); setErrors({}); }}>
//                   <IconCard active={method === "card"} /><span>Credit/Debit Card</span>
//                 </button>
//                 <button className={`cp-method-btn ${method === "upi" ? "cp-method-active" : ""}`} onClick={() => { setMethod("upi"); setErrors({}); }}>
//                   <IconUPI active={method === "upi"} /><span>UPI</span>
//                 </button>
//                 <button className={`cp-method-btn ${method === "bank" ? "cp-method-active" : ""}`} onClick={() => { setMethod("bank"); setErrors({}); }}>
//                   <IconBank active={method === "bank"} /><span>Net Banking</span>
//                 </button>
//               </div>

//               {method === "card" && (
//                 <div className="cp-fields">
//                   <div className="cp-field">
//                     <label className="cp-label">Card Number *</label>
//                     <input className={`cp-input ${errors.cardNumber ? "cp-input-err" : ""}`} placeholder="1234 5678 9012 3456" value={cardNumber} onChange={handleCardNumber} maxLength={19} />
//                     {errors.cardNumber && <span className="cp-err">{errors.cardNumber}</span>}
//                   </div>
//                   <div className="cp-field">
//                     <label className="cp-label">Cardholder Name *</label>
//                     <input className={`cp-input ${errors.cardName ? "cp-input-err" : ""}`} placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value)} />
//                     {errors.cardName && <span className="cp-err">{errors.cardName}</span>}
//                   </div>
//                   <div className="cp-field-row">
//                     <div className="cp-field">
//                       <label className="cp-label">Expiry Date *</label>
//                       <input className={`cp-input ${errors.expiry ? "cp-input-err" : ""}`} placeholder="MM/YY" value={expiry} onChange={handleExpiry} maxLength={5} />
//                       {errors.expiry && <span className="cp-err">{errors.expiry}</span>}
//                     </div>
//                     <div className="cp-field">
//                       <label className="cp-label">CVV *</label>
//                       <input className={`cp-input ${errors.cvv ? "cp-input-err" : ""}`} placeholder="123" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4} type="password" />
//                       {errors.cvv && <span className="cp-err">{errors.cvv}</span>}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {method === "upi" && (
//                 <div className="cp-fields">
//                   <div className="cp-field">
//                     <label className="cp-label">UPI ID *</label>
//                     <input className={`cp-input ${errors.upiId ? "cp-input-err" : ""}`} placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
//                     {errors.upiId && <span className="cp-err">{errors.upiId}</span>}
//                     <span className="cp-hint">Supported UPI apps: Google Pay, PhonePe, Paytm, etc.</span>
//                   </div>
//                 </div>
//               )}

//               {method === "bank" && (
//                 <div className="cp-fields">
//                   <div className="cp-field">
//                     <label className="cp-label">Select Your Bank *</label>
//                     <input className={`cp-input ${errors.bankName ? "cp-input-err" : ""}`} placeholder="" value={bankName} onChange={e => setBankName(e.target.value)} />
//                     {errors.bankName && <span className="cp-err">{errors.bankName}</span>}
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           <div className="cp-secure-notice">
//             <IconShield />
//             <span>Your payment information is secure and encrypted. We never store your card details.</span>
//           </div>

//           <label className="cp-tc-row">
//             <input type="checkbox" className="cp-checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
//             <span className="cp-tc-text">I agree to the Terms &amp; Conditions and authorize automatic renewal of my subscription unless cancelled.</span>
//           </label>
//           {errors.agreed && <span className="cp-err cp-err-block">{errors.agreed}</span>}

//           <button className={`cp-pay-btn ${paying ? "cp-pay-loading" : ""}`} onClick={handlePay} disabled={paying}>
//             {paying ? "Processing..." : payLabel}
//           </button>
//         </div>

//         <div className="cp-summary-card">
//           <h3 className="cp-summary-title">Order Summary</h3>
//           <div className="cp-plan-box">
//             <span className="cp-plan-label">Selected Plan</span>
//             <span className="cp-plan-name">{plan.name}</span>
//             <span className="cp-plan-billing">{billingLabel}</span>
//           </div>
//           {plan.price > 0 && (
//             <>
//               <div className="cp-summary-row"><span>Plan Price</span><span>₹{plan.price.toLocaleString("en-IN")}</span></div>
//               <div className="cp-summary-row"><span>GST (18%)</span><span>₹{plan.gst.toLocaleString("en-IN")}</span></div>
//               <div className="cp-summary-divider" />
//               <div className="cp-summary-total"><span>Total Amount</span><span className="cp-total-price">₹{total.toLocaleString("en-IN")}</span></div>
//             </>
//           )}
//           {plan.price === 0 && (
//             <div className="cp-summary-total"><span>Total Amount</span><span className="cp-total-price">Free</span></div>
//           )}
//           <ul className="cp-perks">
//             <li><IconCheck /><span>Instant activation</span></li>
//             <li><IconCheck /><span>7-day money-back guarantee</span></li>
//             <li><IconCheck /><span>Cancel anytime</span></li>
//             <li><IconCheck /><span>Secure payment processing</span></li>
//           </ul>
//           <p className="cp-legal">
//             By completing this purchase, you agree to our{" "}
//             <span className="cp-link">Terms of Service</span> and{" "}
//             <span className="cp-link">Privacy Policy</span>
//           </p>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }

// TODO: Uncomment full component above when ready to use
// export default function CheckoutPage() {
//   return <div>Checkout Coming Soon</div>;
// }
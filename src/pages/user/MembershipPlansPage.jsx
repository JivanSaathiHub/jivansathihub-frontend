// import { useState } from "react";
// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import "./MembershipPlansPage.css";

// /* ── Plan data per billing cycle ── */
// const PLANS = {
//   monthly: [
//     {
//       key: "free",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-dark">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//           </svg>
//         </div>
//       ),
//       name: "Free",
//       desc: "Basic features to get started",
//       price: "Free",
//       priceNote: null,
//       cta: "Get Started Free",
//       ctaStyle: "mpp-btn-outline",
//       popular: false,
//       included: [
//         "Create your profile",
//         "View limited profiles",
//         "Send up to 5 interests per day",
//         "Basic search filters",
//         "Limited chat messages",
//         "View contact details of interested members",
//       ],
//       excluded: [
//         "Cannot view phone numbers",
//         "Cannot view email addresses",
//         "Limited profile visibility",
//       ],
//     },
//     {
//       key: "premium",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-gold">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
//             <line x1="5" y1="20" x2="19" y2="20"/>
//           </svg>
//         </div>
//       ),
//       name: "Gold",
//       desc: "Most popular choice for serious seekers",
//       price: "₹2,499",
//       priceNote: "/month",
//       cta: "Choose Plan",
//       ctaStyle: "mpp-btn-red",
//       popular: true,
//       included: [
//         "Everything in Free",
//         "View unlimited profiles",
//         "Send unlimited interests",
//         "Advanced search filters",
//         "View phone numbers of 50 profiles",
//         "Unlimited chat messages",
//         "Profile highlighted in searches",
//         "See who viewed your profile",
//         "Priority customer support",
//       ],
//       excluded: [],
//     },
//     {
//       key: "elite",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-red">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
//           </svg>
//         </div>
//       ),
//       name: "Platinum",
//       desc: "Premium experience with dedicated support",
//       price: "₹4,999",
//       priceNote: "/month",
//       cta: "Choose Plan",
//       ctaStyle: "mpp-btn-outline",
//       popular: false,
//       included: [
//         "Everything in Gold",
//         "View unlimited phone numbers",
//         "View unlimited email addresses",
//         "Featured profile across platform",
//         "Dedicated relationship manager",
//         "Personalized match recommendations",
//         "Profile verification assistance",
//         "Horoscope matching",
//         "Background verification support",
//         "24/7 Priority support",
//       ],
//       excluded: [],
//     },
//   ],
//   quarterly: [
//     {
//       key: "free",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-dark">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//           </svg>
//         </div>
//       ),
//       name: "Free",
//       desc: "Basic features to get started",
//       price: "Free",
//       priceNote: null,
//       cta: "Get Started Free",
//       ctaStyle: "mpp-btn-outline",
//       popular: false,
//       included: [
//         "Create your profile",
//         "View limited profiles",
//         "Send up to 5 interests per day",
//         "Basic search filters",
//         "Limited chat messages",
//         "View contact details of interested members",
//       ],
//       excluded: [
//         "Cannot view phone numbers",
//         "Cannot view email addresses",
//         "Limited profile visibility",
//       ],
//     },
//     {
//       key: "premium",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-gold">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
//             <line x1="5" y1="20" x2="19" y2="20"/>
//           </svg>
//         </div>
//       ),
//       name: "Gold",
//       desc: "Most popular choice for serious seekers",
//       price: "₹5,999",
//       priceNote: "/quarter",
//       cta: "Choose Plan",
//       ctaStyle: "mpp-btn-red",
//       popular: true,
//       included: [
//         "Everything in Free",
//         "View unlimited profiles",
//         "Send unlimited interests",
//         "Advanced search filters",
//         "View phone numbers of 50 profiles",
//         "Unlimited chat messages",
//         "Profile highlighted in searches",
//         "See who viewed your profile",
//         "Priority customer support",
//       ],
//       excluded: [],
//     },
//     {
//       key: "elite",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-red">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
//           </svg>
//         </div>
//       ),
//       name: "Platinum",
//       desc: "Premium experience with dedicated support",
//       price: "₹11,999",
//       priceNote: "/quarter",
//       cta: "Choose Plan",
//       ctaStyle: "mpp-btn-outline",
//       popular: false,
//       included: [
//         "Everything in Gold",
//         "View unlimited phone numbers",
//         "View unlimited email addresses",
//         "Featured profile across platform",
//         "Dedicated relationship manager",
//         "Personalized match recommendations",
//         "Profile verification assistance",
//         "Horoscope matching",
//         "Background verification support",
//         "24/7 Priority support",
//       ],
//       excluded: [],
//     },
//   ],
//   yearly: [
//     {
//       key: "free",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-dark">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
//           </svg>
//         </div>
//       ),
//       name: "Free",
//       desc: "Basic features to get started",
//       price: "Free",
//       priceNote: null,
//       cta: "Get Started Free",
//       ctaStyle: "mpp-btn-outline",
//       popular: false,
//       included: [
//         "Create your profile",
//         "View limited profiles",
//         "Send up to 5 interests per day",
//         "Basic search filters",
//         "Limited chat messages",
//         "View contact details of interested members",
//       ],
//       excluded: [
//         "Cannot view phone numbers",
//         "Cannot view email addresses",
//         "Limited profile visibility",
//       ],
//     },
//     {
//       key: "premium",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-gold">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
//             <line x1="5" y1="20" x2="19" y2="20"/>
//           </svg>
//         </div>
//       ),
//       name: "Gold",
//       desc: "Most popular choice for serious seekers",
//       price: "₹19,999",
//       priceNote: "/year",
//       cta: "Choose Plan",
//       ctaStyle: "mpp-btn-red",
//       popular: true,
//       included: [
//         "Everything in Free",
//         "View unlimited profiles",
//         "Send unlimited interests",
//         "Advanced search filters",
//         "View phone numbers of 50 profiles",
//         "Unlimited chat messages",
//         "Profile highlighted in searches",
//         "See who viewed your profile",
//         "Priority customer support",
//       ],
//       excluded: [],
//     },
//     {
//       key: "elite",
//       icon: (
//         <div className="mpp-icon-circle mpp-icon-red">
//           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
//           </svg>
//         </div>
//       ),
//       name: "Platinum",
//       desc: "Premium experience with dedicated support",
//       price: "₹39,999",
//       priceNote: "/year",
//       cta: "Choose Plan",
//       ctaStyle: "mpp-btn-outline",
//       popular: false,
//       included: [
//         "Everything in Gold",
//         "View unlimited phone numbers",
//         "View unlimited email addresses",
//         "Featured profile across platform",
//         "Dedicated relationship manager",
//         "Personalized match recommendations",
//         "Profile verification assistance",
//         "Horoscope matching",
//         "Background verification support",
//         "24/7 Priority support",
//       ],
//       excluded: [],
//     },
//   ],
// };

// const FAQS = [
//   {
//     q: "Can I upgrade or downgrade my plan?",
//     a: "Yes, you can upgrade or downgrade your plan at any time. The changes will be reflected immediately, and billing will be adjusted accordingly.",
//   },
//   {
//     q: "What payment methods do you accept?",
//     a: "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.",
//   },
//   {
//     q: "Is there a refund policy?",
//     a: "Yes, we offer a 7-day money-back guarantee if you are not satisfied with our premium services.",
//   },
//   {
//     q: "How secure is my payment information?",
//     a: "All payments are processed through secure, encrypted payment gateways. We never store your payment information on our servers.",
//   },
// ];

// const IconCheck = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <polyline points="20 6 9 17 4 12"/>
//   </svg>
// );

// const IconX = () => (
//   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <line x1="18" y1="6" x2="6" y2="18"/>
//     <line x1="6" y1="6" x2="18" y2="18"/>
//   </svg>
// );

// export default function MembershipPlansPage({ selectedPlan, onBack, onLogin, onRegister, onHelp, onCheckout, onAboutClick, onMenuClick }) {
//   const goLogin    = () => typeof onLogin    === "function" && onLogin();
//   const goRegister = () => typeof onRegister === "function" && onRegister();
//   const goHelp     = () => typeof onHelp     === "function" && onHelp();
//   const [billing, setBilling] = useState("monthly");
//   const [chosen,  setChosen]  = useState(selectedPlan || null);
//   const [openFaq, setOpenFaq] = useState(null);

//   const plans = PLANS[billing];

//   return (
//     <div className="mpp-page">

//       <Navbar
//         onHomeClick={onBack}
//         onAboutClick={onAboutClick}
//         onLoginClick={goLogin}
//         onRegisterClick={goRegister}
//         onHelpClick={goHelp}
//         onMenuClick={onMenuClick}
//       />

//       {/* ── Back bar ── */}
//       <div className="mpp-backbar">
//         <div className="mpp-backbar-inner">
//           <button className="mpp-back-btn" onClick={onBack}>← Back to Home</button>
//         </div>
//       </div>

//       {/* Hero */}
//       <div className="mpp-hero">
//         <h2 className="mpp-hero-title">Choose Your Perfect Plan</h2>
//         <p className="mpp-hero-sub">
//           Unlock premium features and find your life partner faster<br />
//           with our membership plans
//         </p>
//       </div>

//       {/* Billing toggle */}
//       <div className="mpp-toggle-wrap">
//         <div className="mpp-toggle">
//           <button
//             className={`mpp-toggle-btn ${billing === "monthly"   ? "mpp-toggle-active" : ""}`}
//             onClick={() => setBilling("monthly")}
//           >Monthly</button>
//           <button
//             className={`mpp-toggle-btn ${billing === "quarterly" ? "mpp-toggle-active" : ""}`}
//             onClick={() => setBilling("quarterly")}
//           >Quarterly <span className="mpp-save-badge">Save 20%</span></button>
//           <button
//             className={`mpp-toggle-btn ${billing === "yearly"    ? "mpp-toggle-active" : ""}`}
//             onClick={() => setBilling("yearly")}
//           >Yearly <span className="mpp-save-badge">Save 33%</span></button>
//         </div>
//       </div>

//       {/* Plans grid */}
//       <div className="mpp-plans-grid">
//         {plans.map((plan) => {
//           const isChosen = chosen === plan.key;
//           return (
//             <div
//               key={plan.key}
//               className={`mpp-card ${plan.popular ? "mpp-card-popular" : ""} ${isChosen ? "mpp-card-chosen" : ""}`}
//             >
//               {plan.popular && !isChosen && (
//                 <div className="mpp-popular-badge">★ Most Popular</div>
//               )}
//               {isChosen && (
//                 <div className="mpp-chosen-badge">✓ Selected</div>
//               )}

//               <div className="mpp-card-inner">
//                 {plan.icon}
//                 <h3 className="mpp-plan-name">{plan.name}</h3>
//                 <p className="mpp-plan-desc">{plan.desc}</p>

//                 <div className="mpp-price-row">
//                   <span className="mpp-price">{plan.price}</span>
//                   {plan.priceNote && (
//                     <span className="mpp-price-note">{plan.priceNote}</span>
//                   )}
//                 </div>

//                 <button
//                   className={`mpp-cta-btn ${isChosen ? "mpp-btn-chosen" : plan.ctaStyle}`}
//                   onClick={() => {
//                     setChosen(plan.key);
//                     if (onCheckout) onCheckout(plan.key, billing);
//                   }}
//                 >
//                   {isChosen ? "✓ Plan Selected" : plan.cta}
//                 </button>

//                 <ul className="mpp-features">
//                   {plan.included.map((f, i) => (
//                     <li key={i} className="mpp-feat-yes">
//                       <span className="mpp-feat-icon"><IconCheck /></span>{f}
//                     </li>
//                   ))}
//                   {plan.excluded.map((f, i) => (
//                     <li key={i} className="mpp-feat-no">
//                       <span className="mpp-feat-icon"><IconX /></span>{f}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* FAQ */}
//       <div className="mpp-faq-wrap">
//         <div className="mpp-faq-header">
//           <span className="mpp-faq-badge">FAQ</span>
//           <h2 className="mpp-faq-title">Frequently Asked Questions</h2>
//           <p className="mpp-faq-sub">Everything you need to know about our membership plans</p>
//         </div>
//         <div className="mpp-faq-list">
//           {FAQS.map((faq, i) => (
//             <div
//               key={i}
//               className={`mpp-faq-item ${openFaq === i ? "mpp-faq-open" : ""}`}
//               onClick={() => setOpenFaq(openFaq === i ? null : i)}
//             >
//               <div className="mpp-faq-q">
//                 <span>{faq.q}</span>
//                 <span className="mpp-faq-icon">{openFaq === i ? "−" : "+"}</span>
//               </div>
//               <div className="mpp-faq-a-wrap">
//                 <div className="mpp-faq-a">{faq.a}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
// TODO: Uncomment full component above when ready to use
export default function MembershipPlansPage() {
  return <div>Membership Plans Coming Soon</div>;
}
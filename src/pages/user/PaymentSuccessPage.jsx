// import Navbar from "../../components/Navbar";
// import Footer from "../../components/Footer";
// import "./PaymentSuccessPage.css";

// const ORDER_ID = "ORD-" + Math.random().toString(36).toUpperCase().replace(".", "").slice(0, 9);

// const formatDate = (date) => {
//   const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
//   return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
// };

// const addMonth = (date) => {
//   const d = new Date(date);
//   d.setMonth(d.getMonth() + 1);
//   return d;
// };

// const PLAN_LABELS = {
//   free:    "Free Membership",
//   premium: "Premium Membership",
//   elite:   "Platinum Membership",
// };

// export default function PaymentSuccessPage({ planKey, onHome, onSearch, onLogin, onRegister, onHelp, onMenuClick }) {
//   const today    = new Date();
//   const validEnd = addMonth(today);
//   const planName = PLAN_LABELS[planKey] || "Premium Membership";

//   const handleDownload = () => {
//     const text = [
//       "JeevanSaathiHub — Invoice",
//       "─────────────────────────────",
//       `Order ID        : ${ORDER_ID}`,
//       `Plan            : ${planName}`,
//       `Transaction Date: ${formatDate(today)}`,
//       `Valid Until     : ${formatDate(validEnd)}`,
//       "─────────────────────────────",
//       "Thank you for your purchase!",
//     ].join("\n");
//     const blob = new Blob([text], { type: "text/plain" });
//     const url  = URL.createObjectURL(blob);
//     const a    = document.createElement("a");
//     a.href     = url;
//     a.download = `Invoice_${ORDER_ID}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="ps-page">
//       <Navbar
//         onHomeClick={onHome}
//         onLoginClick={onLogin}
//         onRegisterClick={onRegister}
//         onHelpClick={onHelp}
//         onMenuClick={onMenuClick}
//       />

//       <div className="ps-outer">
//         <div className="ps-card">

//           <div className="ps-icon-wrap">
//             <div className="ps-icon-circle">
//               <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
//                 stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
//                 <polyline points="22 4 12 14.01 9 11.01"/>
//               </svg>
//             </div>
//           </div>

//           <h1 className="ps-title">Payment Successful!</h1>
//           <p className="ps-sub">Your subscription has been activated successfully</p>

//           <div className="ps-details-box">
//             <div className="ps-details-grid">
//               <div className="ps-detail-cell">
//                 <span className="ps-detail-label">Order ID</span>
//                 <span className="ps-detail-value">{ORDER_ID}</span>
//               </div>
//               <div className="ps-detail-cell">
//                 <span className="ps-detail-label">Transaction Date</span>
//                 <span className="ps-detail-value">{formatDate(today)}</span>
//               </div>
//               <div className="ps-detail-cell">
//                 <span className="ps-detail-label">Plan</span>
//                 <span className="ps-detail-value">{planName}</span>
//               </div>
//               <div className="ps-detail-cell">
//                 <span className="ps-detail-label">Valid Until</span>
//                 <span className="ps-detail-value">{formatDate(validEnd)}</span>
//               </div>
//             </div>
//           </div>

//           <div className="ps-next">
//             <h3 className="ps-next-title">What's Next?</h3>
//             <ul className="ps-next-list">
//               <li><span className="ps-num">1</span><span>A confirmation email has been sent to your registered email address</span></li>
//               <li><span className="ps-num">2</span><span>Start browsing unlimited profiles and send interests</span></li>
//               <li><span className="ps-num">3</span><span>Contact our relationship managers for personalized assistance</span></li>
//             </ul>
//           </div>

//           <div className="ps-actions">
//             <button className="ps-btn-red" onClick={onSearch}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                 <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
//               </svg>
//               Start Searching Profiles
//             </button>
//             <button className="ps-btn-outline" onClick={onHome}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
//                 <polyline points="9 22 9 12 15 12 15 22"/>
//               </svg>
//               Go to Home
//             </button>
//           </div>

//           <div className="ps-divider" />

//           <button className="ps-download" onClick={handleDownload}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
//               <polyline points="7 10 12 15 17 10"/>
//               <line x1="12" y1="15" x2="12" y2="3"/>
//             </svg>
//             Download Invoice
//           </button>

//           <p className="ps-support">
//             Need help? Contact our support team at{" "}
//             <span className="ps-link">support@matrimony.com</span>{" "}
//             or call{" "}
//             <span className="ps-link">1800-123-4567</span>
//           </p>

//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { SocketProvider } from "./context/SocketContext";
import { FooterNavContext } from "./context/FooterNavContext";

import "./styles/global.css";

/* ── User Pages ── */
import HomePage            from "./pages/user/HomePage";
import AboutPage           from "./pages/user/AboutPage";
import RegisterPage        from "./pages/user/RegisterPage";
import LoginPage           from "./pages/user/LoginPage";
import HelpPage            from "./pages/user/HelpPage";
import SearchPage          from "./pages/user/SearchPage";
import ProfileDetail       from "./pages/user/ProfileDetail";
import MembershipPlansPage from "./pages/user/MembershipPlansPage";
import CheckoutPage        from "./pages/user/CheckoutPage";
import PaymentSuccessPage  from "./pages/user/PaymentSuccessPage";
import InterestsPage       from "./pages/user/InterestsPage";
import DashboardPage       from "./pages/user/DashboardPage";
import ProfilePage         from "./pages/user/ProfilePage";
import MatchesPage         from "./pages/user/MatchesPage";
import MessagesPage        from "./pages/user/MessagesPage";
import VerificationPage    from "./pages/user/VerificationPage";
import EditProfilePage     from "./pages/user/EditProfilePage";
import SettingsPage        from "./pages/user/SettingsPage";
import ShortlistPage       from "./pages/user/ShortlistPage";
import FeedbackPage        from "./pages/user/FeedbackPage";
import SupportTickets      from "./pages/user/SupportTickets";

/* ── Legal Pages ── */
import PrivacyPolicyPage      from "./pages/user/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/user/TermsAndConditionsPage";
import RefundPolicyPage       from "./pages/user/RefundPolicyPage";
import CookiePolicyPage       from "./pages/user/CookiePolicyPage";

/* ── Mandatory plan modal shown after login / register ── */
import PlanSelectModal from "./components/PlanSelectModal";

/* ── Admin ── */
import AdminLayout    from "./pages/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

/* ── Secret admin hash — only you know this URL ── */
/* Access via: http://localhost:3000/#/admin */
const ADMIN_SECRET_HASH = "#/admin";

function AppRoutes() {

  /* ── Check URL hash on first load for secret admin access ── */
  const [page, setPage] = useState(() => {
    if (window.location.hash === ADMIN_SECRET_HASH) return "admin-login";
    return "home";
  });

  const [prefill,             setPrefill]             = useState(null);
  const [searchData,          setSearchData]          = useState(null);
  const [profileId,           setProfileId]           = useState(null);
  const [planKey,             setPlanKey]             = useState(null);
  const [billing,             setBilling]             = useState("monthly");
  const [adminTab,            setAdminTab]            = useState("dashboard");
  const [showPlanModal,       setShowPlanModal]       = useState(false);
  const [interestsInitialTab, setInterestsInitialTab] = useState("pending");

  /* ── Also listen for hash changes while app is open ── */
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === ADMIN_SECRET_HASH) {
        setAdminTab("dashboard");
        setPage("admin-login");
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  /* ── Clear hash from URL bar once admin login loads ── */
  useEffect(() => {
    if (page === "admin-login" && window.location.hash === ADMIN_SECRET_HASH) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [page]);

  const scrollTop = () => window.scrollTo(0, 0);

  /* ───────── NAVIGATION HELPERS ───────── */

  const goHome        = () => { setPage("home");            scrollTop(); };
  const goAbout       = () => { setPage("about");           scrollTop(); };
  const goLogin       = () => { setPage("login");           scrollTop(); };
  const goHelp        = () => { setPage("help");            scrollTop(); };
  const goDashboard   = () => { setPage("dashboard");       scrollTop(); };
  const goMyProfile   = () => { setPage("myprofile");       scrollTop(); };
  const goVerify      = () => { setPage("verify");          scrollTop(); };
  const goMatches     = () => { setPage("matches");         scrollTop(); };
  const goMessages    = () => { setPage("messages");        scrollTop(); };
  const goEditProfile = () => { setPage("edit-profile");    scrollTop(); };
  const goSettings    = () => { setPage("settings");        scrollTop(); };
  const goShortlist   = () => { setPage("shortlist");       scrollTop(); };
  const goPrivacy     = () => { setPage("privacy-policy");  scrollTop(); };
  const goTerms       = () => { setPage("terms");           scrollTop(); };
  const goRefund      = () => { setPage("refund-policy");   scrollTop(); };
  const goCookie      = () => { setPage("cookie-policy");   scrollTop(); };
  const goAdminLogin  = () => { setPage("admin-login");     scrollTop(); };
  const goFeedback     = () => { setPage("feedback");        scrollTop(); };
  const goSupport      = () => { setPage("support");         scrollTop(); };

  const goInterests = (tab = "pending") => {
    setInterestsInitialTab(tab);
    setPage("interests");
    scrollTop();
  };

  const goAdmin = (tab = "dashboard") => {
    setAdminTab(tab);
    setPage("admin");
    scrollTop();
  };

  const goSearch = (data) => {
    setSearchData(data || null);
    setPage("search");
    scrollTop();
  };

  const goProfile = (id) => {
    setProfileId(id);
    setPage("profile");
    scrollTop();
  };

  const goPlans = (key) => {
    setPlanKey(key || null);
    setPage("plans");
    scrollTop();
  };

  const goCheckout = (key, bill) => {
    setPlanKey(key || null);
    setBilling(bill || "monthly");
    setPage("checkout");
    scrollTop();
  };

  const goSuccess = () => { setPage("success"); scrollTop(); };

  const goRegister = (homeData) => {
    setPrefill(homeData || null);
    setPage("register");
    scrollTop();
  };

  const goAfterAuth = () => { goDashboard(); setShowPlanModal(true); };

  const handlePlanSelected = (key) => {
    setPlanKey(key || null);
    setShowPlanModal(false);
  };

  

  /* ───────── USER MENU HANDLER ───────── */

  const handleMenuClick = (key) => {
    if (key === "about")        goAbout();
    if (key === "dashboard")    goDashboard();
    if (key === "profile")      goMyProfile();
    if (key === "edit-profile") goEditProfile();
    if (key === "verify")       goVerify();
    if (key === "interests")    goInterests("pending");
    if (key === "matches")      goMatches();
    if (key === "messages")     goMessages();
    if (key === "shortlist")    goShortlist();
    if (key === "settings")     goSettings();
    if (key === "admin")        goAdmin();
    if (key === "admin-login")  goAdminLogin();
    if (key === "feedback")     goFeedback();
    if (key === "support")      goSupport();
  };

  /* ───────── FOOTER NAV ───────── */

  const handleFooterNav = (key) => {
    if (key === "home")           goHome();
    if (key === "search")         goSearch(null);
    if (key === "plans")          goPlans(null);
    if (key === "help")           goHelp();
    if (key === "about")          goAbout();
    if (key === "privacy-policy") goPrivacy();
    if (key === "terms")          goTerms();
    if (key === "refund-policy")  goRefund();
    if (key === "cookie-policy")  goCookie();
    if (key === "feedback")       goFeedback();
    if (key === "support")        goSupport();
  };

  /* ───────── PAGE RESOLVER ───────── */

  let currentPage;

  switch (page) {

    case "about":
      currentPage = (
        <AboutPage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "login":
      currentPage = (
        <LoginPage
          onBack={goHome}
          onRegister={() => goRegister(null)}
          onHelp={goHelp}
          onMenuClick={handleMenuClick}
          onSuccess={goAfterAuth}
        />
      );
      break;

    case "register":
      currentPage = (
        <RegisterPage
          prefill={prefill}
          onBack={goHome}
          onLogin={goLogin}
          onHelp={goHelp}
          onMenuClick={handleMenuClick}
          onSuccess={goAfterAuth}
        />
      );
      break;

    case "help":
      currentPage = (
        <HelpPage
          onBack={goHome}
          onRegister={goRegister}
          onLogin={goLogin}
          onHelp={goHelp}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "search":
      currentPage = (
        <SearchPage
          prefill={searchData}
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onViewProfile={goProfile}
          onAboutClick={goAbout}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "profile":
      currentPage = (
        <ProfileDetail
          profileId={profileId}
          onBack={goHome}
          onSearch={goSearch}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onMenuClick={handleMenuClick}
          onGoInterests={() => goInterests("sent")}
          onGoMessages={goMessages}
          onGoShortlist={goShortlist}
        />
      );
      break;

    case "plans":
      currentPage = (
        <MembershipPlansPage
          selectedPlan={planKey}
          onBack={goHome}
          onCheckout={goCheckout}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "checkout":
      currentPage = (
        <CheckoutPage
          planKey={planKey}
          billing={billing}
          onBack={() => goPlans(planKey)}
          onSuccess={goSuccess}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "success":
      currentPage = (
        <PaymentSuccessPage
          planKey={planKey}
          onHome={goHome}
          onSearch={goSearch}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    /* ── INNER PAGES: onBack = logical back, onBack passed as goHome
         so Navbar Home/Search/Plans/Stories/About/Help all work correctly ── */

    case "interests":
      currentPage = (
        <InterestsPage
          initialTab={interestsInitialTab}
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onViewProfile={goProfile}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "dashboard":
      currentPage = (
        <DashboardPage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onViewProfile={goProfile}
          onSearch={goSearch}
          onPlanClick={goPlans}
          onMenuClick={handleMenuClick}
          onAdminLoginClick={goAdminLogin}
        />
      );
      break;

    case "myprofile":
      currentPage = (
        <ProfilePage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onVerifyClick={goVerify}
          onEditClick={goEditProfile}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "matches":
      currentPage = (
        <MatchesPage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onViewProfile={goProfile}
          onPlanClick={goPlans}
          onMessage={goMessages}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "messages":
      currentPage = (
        <MessagesPage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onViewProfile={goProfile}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "verify":
      currentPage = (
        <VerificationPage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onComplete={goDashboard}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "edit-profile":
      currentPage = (
        <EditProfilePage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "settings":
      currentPage = (
        <SettingsPage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "admin-login":
      currentPage = (
        <AdminLoginPage
          onSuccess={() => { setPage("admin"); scrollTop(); }}
          onBack={goHome}
        />
      );
      break;

    case "admin":
      currentPage = (
        <AdminLayout
          activeTab={adminTab}
          onTabChange={(tab) => { setAdminTab(tab); scrollTop(); }}
          onBack={goHome}
        />
      );
      break;

    case "shortlist":
      currentPage = (
        <ShortlistPage
          onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onViewProfile={goProfile}
          onMessage={goMessages}
          onSearch={goSearch}
          onMenuClick={handleMenuClick}
        />
      );
      break;
      case "feedback":
      currentPage = (
        <FeedbackPage
         onBack={goHome}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onAboutClick={goAbout}
          onViewProfile={goProfile}
          onMessage={goMessages}
          onSearch={goSearch}
          onMenuClick={handleMenuClick} />);
      break;
      
       case "support":
      currentPage = (
        <SupportTickets
         onBack={goHome}
          onLogin={goLogin}
          onHelp={goHelp}         
          onAboutClick={goAbout}
          onViewProfile={goProfile}
          onRegister={goRegister}
          onMessage={goMessages}
          onSearch={goSearch}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "terms":
      currentPage = (
        <TermsAndConditionsPage
          onBack={goHome}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "refund-policy":
      currentPage = (
        <RefundPolicyPage
          onBack={goHome}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "cookie-policy":
      currentPage = (
        <CookiePolicyPage
          onBack={goHome}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    default:
      currentPage = (
        <HomePage
          onRegister={goRegister}
          onLogin={goLogin}
          onHelp={goHelp}
          onSearch={goSearch}
          onViewProfile={goProfile}
          onPlanClick={goPlans}
          onAbout={goAbout}
          onDashboard={goDashboard}
          onMenuClick={handleMenuClick}
        />
      );
  }

  return (
    <FooterNavContext.Provider value={handleFooterNav}>
      {currentPage}
      {showPlanModal && <PlanSelectModal onSelect={handlePlanSelected} />}  
    </FooterNavContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AdminProvider>
    </AuthProvider>
  );
} 
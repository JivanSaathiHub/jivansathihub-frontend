import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { FooterNavContext } from "./context/FooterNavContext";
import "./styles/global.css";

/* ── Pages ── */
import HomePage            from "./pages/HomePage";
import AboutPage           from "./pages/AboutPage";
import RegisterPage        from "./pages/RegisterPage";
import LoginPage           from "./pages/LoginPage";
import HelpPage            from "./pages/HelpPage";
import SearchPage          from "./pages/SearchPage";
import ProfileDetail       from "./pages/ProfileDetail";
import MembershipPlansPage from "./pages/MembershipPlansPage";
import CheckoutPage        from "./pages/CheckoutPage";
import PaymentSuccessPage  from "./pages/PaymentSuccessPage";
import InterestsPage       from "./pages/InterestsPage";
import DashboardPage       from "./pages/DashboardPage";
import ProfilePage         from "./pages/ProfilePage";
import MatchesPage         from "./pages/MatchesPage";
import MessagesPage        from "./pages/MessagesPage";
import VerificationPage    from "./pages/VerificationPage";
import EditProfilePage     from "./pages/EditProfilePage";
import SettingsPage        from "./pages/SettingsPage";
import ShortlistPage       from "./pages/ShortlistPage";

/* ── Legal Pages ── */
import PrivacyPolicyPage      from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import RefundPolicyPage       from "./pages/RefundPolicyPage";
import CookiePolicyPage       from "./pages/CookiePolicyPage";

/* ── Mandatory plan modal shown after login / register ── */
import PlanSelectModal from "./components/PlanSelectModal";

/* ── Admin ── */
import AdminLayout from "./pages/admin/AdminLayout";

function AppRoutes() {

  const [page, setPage] = useState("home");

  const [prefill,             setPrefill]             = useState(null);
  const [searchData,          setSearchData]          = useState(null);
  const [profileId,           setProfileId]           = useState(null);
  const [planKey,             setPlanKey]             = useState(null);
  const [billing,             setBilling]             = useState("monthly");
  const [adminTab,            setAdminTab]            = useState("dashboard");
  const [showPlanModal,       setShowPlanModal]       = useState(false);
  const [interestsInitialTab, setInterestsInitialTab] = useState("pending");

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

  const goAfterAuth = () => {
    goDashboard();
    setShowPlanModal(true);
  };

  const handlePlanSelected = (key) => {
    setPlanKey(key || null);
    setShowPlanModal(false);
  };

  /* ───────── USER MENU HANDLER ───────── */

  const handleMenuClick = (key) => {
    if (key === "dashboard") goDashboard();
    if (key === "profile")   goMyProfile();
    if (key === "verify")    goVerify();
    if (key === "interests") goInterests("pending");
    if (key === "matches")   goMatches();
    if (key === "messages")  goMessages();
    if (key === "shortlist") goShortlist();
    if (key === "settings")  goSettings();
    if (key === "admin")     goAdmin();
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
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "search":
      currentPage = (
        <SearchPage
          prefill={searchData}
          onBack={goHome}
          onViewProfile={goProfile}
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

    case "interests":
      currentPage = (
        <InterestsPage
          initialTab={interestsInitialTab}
          onBack={goHome}
          onViewProfile={goProfile}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "dashboard":
      currentPage = (
        <DashboardPage
          onBack={goHome}
          onViewProfile={goProfile}
          onSearch={goSearch}
          onPlanClick={goPlans}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "myprofile":
      currentPage = (
        <ProfilePage
          onBack={goDashboard}
          onLogin={goLogin}
          onRegister={goRegister}
          onVerifyClick={goVerify}
          onEditClick={goEditProfile}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "matches":
      currentPage = (
        <MatchesPage
          onBack={goDashboard}
          onViewProfile={goProfile}
          onMessage={goMessages}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "messages":
      currentPage = (
        <MessagesPage
          onBack={goDashboard}
          onViewProfile={goProfile}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "verify":
      currentPage = (
        <VerificationPage
          onBack={goDashboard}
          onComplete={goDashboard}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "edit-profile":
      currentPage = (
        <EditProfilePage
          onBack={goMyProfile}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "settings":
      currentPage = (
        <SettingsPage
          onBack={goDashboard}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "admin":
      currentPage = (
        <AdminLayout
          activeTab={adminTab}
          onTabChange={(tab) => {
            setAdminTab(tab);
            scrollTop();
          }}
          onBack={goDashboard}
        />
      );
      break;

    case "shortlist":
      currentPage = (
        <ShortlistPage
          onBack={goDashboard}
          onViewProfile={goProfile}
          onMessage={goMessages}
          onSearch={goSearch}
          onLogin={goLogin}
          onRegister={goRegister}
          onHelp={goHelp}
          onMenuClick={handleMenuClick}
        />
      );
      break;

    case "privacy-policy":
      currentPage = (
        <PrivacyPolicyPage
          onBack={goHome}
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
          onMenuClick={handleMenuClick}
        />
      );
  }

  return (
    <FooterNavContext.Provider value={handleFooterNav}>
      {currentPage}
      {showPlanModal && (
        <PlanSelectModal onSelect={handlePlanSelected} />
      )}
    </FooterNavContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
    </AuthProvider>
  );
}
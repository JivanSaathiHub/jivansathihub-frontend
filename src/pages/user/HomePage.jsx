import Navbar           from "../../components/Navbar";
import Hero             from "../../components/Hero";
import RegisterSection  from "../../components/RegisterSection";
import FeaturedProfiles from "../../components/FeaturedProfiles";
import HowItWorks       from "../../components/HowItWorks";
import SuccessStories   from "../../components/SuccessStories";
import MembershipPlans  from "../../components/MembershipPlans";
import TrustSafety      from "../../components/TrustSafety";
import Footer           from "../../components/Footer";

export default function HomePage({ onRegister, onLogin, onHelp, onSearch, onViewProfile, onPlanClick, onAbout, onMenuClick, onDashboard }) {
  return (
    <div className="site-wrapper">
      <Navbar
        onRegisterClick={() => onRegister(null)}
        onLoginClick={onLogin}
        onHelpClick={onHelp}
        onAboutClick={onAbout}
        onMenuClick={onMenuClick}
      />
      <Hero onSearch={onSearch} />
      <RegisterSection onNavigate={onRegister} onDashboard={onDashboard} />
      <FeaturedProfiles
        onViewProfile={onViewProfile}
        onSearch={onSearch}
      />
      <HowItWorks />
      <SuccessStories />
      <MembershipPlans onPlanClick={onPlanClick} onHomeClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />
      <TrustSafety />
      <Footer />
    </div>
  );
}
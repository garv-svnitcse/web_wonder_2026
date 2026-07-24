import "./Login.css";
import ParticleBackground from "./ParticleBackground";
import BrandHeader from "./BrandHeader";
import AuthCard from "./AuthCard";
import TrustBadges from "./TrustBadges";
import AuthFooter from "./AuthFooter";
import Toast from "./Toast";
import useAuthForm from "./useAuthForm";

export default function Login() {
  const {
    activePanel,
    setActivePanel,
    switchPanel,
    toast,
    showToast,
    signin,
    signup,
  } = useAuthForm();

  return (
    <div className="loginPage">
      <ParticleBackground />
      <BrandHeader
        onThemeToggle={() =>
          showToast("Light mode is coming soon — Web Wonder loves the dark ✨")
        }
      />
      <AuthCard
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        switchPanel={switchPanel}
        signin={signin}
        signup={signup}
      />
      <TrustBadges />
      <AuthFooter />
      <Toast show={toast.show} message={toast.message} />
    </div>
  );
}

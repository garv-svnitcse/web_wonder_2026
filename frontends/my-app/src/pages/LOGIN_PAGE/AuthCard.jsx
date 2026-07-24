import SignInPanel from "./SignInPanel";
import SignUpPanel from "./SignUpPanel";

export default function AuthCard({
  activePanel,
  setActivePanel,
  switchPanel,
  signin,
  signup,
}) {
  return (
    <div className="stage">
      <div className="card">
        <div className="tabs">
          <button
            type="button"
            className={activePanel === "signin" ? "active" : ""}
            onClick={() => setActivePanel("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={activePanel === "signup" ? "active" : ""}
            onClick={() => setActivePanel("signup")}
          >
            Create Account
          </button>
        </div>

        <SignInPanel active={activePanel === "signin"} signin={signin} />

        <div className="divider">
          <button
            className="switch-btn"
            aria-label="Switch panel"
            onClick={switchPanel}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="14 4 8 12 14 20" />
            </svg>
          </button>
        </div>

        <SignUpPanel active={activePanel === "signup"} signup={signup} />
      </div>
    </div>
  );
}

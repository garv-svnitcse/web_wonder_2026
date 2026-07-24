import FormField from "./FormField";
import SocialAuthButtons from "./SocialAuthButtons";

const MailIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 6l10 7 10-7" />
  </svg>
);
const LockIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 018 0v3" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const MagicIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M15 3h6v6M10 14L21 3M21 14v6a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1h6" />
  </svg>
);

export default function SignInPanel({ active, signin }) {
  const emailState = signin.emailTouched
    ? signin.emailValid
      ? "ok"
      : "error"
    : null;

  return (
    <div className={`pane signin ${active ? "active" : ""}`}>
      <div className="pane-eyebrow">Welcome back</div>
      <h2>Sign in to Web Wonder</h2>
      <p className="sub">Continue your journey of discovery</p>

      <form onSubmit={signin.handleSubmit} noValidate>
        <FormField
          id="login-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<MailIcon />}
          value={signin.email}
          onChange={(e) => signin.setEmail(e.target.value)}
          onBlur={() => signin.setEmailTouched(true)}
          state={emailState}
          message={emailState === "error" ? "Enter a valid email address" : ""}
        />

        <FormField
          id="login-pass"
          label="Password"
          type={signin.showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          icon={<LockIcon />}
          value={signin.password}
          onChange={(e) => signin.setPassword(e.target.value)}
          trailing={
            <button
              type="button"
              className="icon-btn"
              onClick={() => signin.setShowPassword(!signin.showPassword)}
              aria-label="Show password"
            >
              <EyeIcon />
            </button>
          }
        />

        <div className="row-between">
          <label className="remember">
            <input
              type="checkbox"
              checked={signin.remember}
              onChange={(e) => signin.setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <a href="#" className="link-accent">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="btn-primary">
          Sign In <span className="arrow">→</span>
        </button>

        <button
          type="button"
          className="btn-ghost"
          onClick={signin.handleMagicLink}
        >
          <MagicIcon /> Email me a magic link instead
        </button>
      </form>

      <SocialAuthButtons />
    </div>
  );
}

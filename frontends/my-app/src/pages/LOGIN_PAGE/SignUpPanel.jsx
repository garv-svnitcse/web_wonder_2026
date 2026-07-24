import FormField from "./FormField";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import SocialAuthButtons from "./SocialAuthButtons";

const UserIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);
const AtIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M3 21c0-4.4 4-8 9-8s9 3.6 9 8" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
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
const CheckIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
  </svg>
);

export default function SignUpPanel({ active, signup }) {
  const emailState = signup.emailTouched
    ? signup.emailValid
      ? "ok"
      : "error"
    : null;
  const usernameState =
    signup.usernameValid === null
      ? null
      : signup.usernameValid
        ? "ok"
        : "error";
  const confirmState =
    signup.confirmValid === null ? null : signup.confirmValid ? "ok" : "error";

  return (
    <div className={`pane signup ${active ? "active" : ""}`}>
      <div className="pane-eyebrow">Get started</div>
      <h2>Create your account</h2>
      <p className="sub">Start wondering, exploring, discovering</p>

      <form onSubmit={signup.handleSubmit} noValidate>
        <FormField
          id="su-name"
          label="Full name"
          placeholder="Jordan Ray"
          autoComplete="name"
          icon={<UserIcon />}
          value={signup.name}
          onChange={(e) => signup.setName(e.target.value)}
        />

        <FormField
          id="su-username"
          label="Username"
          placeholder="jordanray"
          autoComplete="username"
          icon={<AtIcon />}
          value={signup.username}
          onChange={(e) => signup.setUsername(e.target.value)}
          state={usernameState}
          message={
            usernameState === "error"
              ? "3–20 characters: letters, numbers, underscores"
              : usernameState === "ok"
                ? "Username is available"
                : "Letters, numbers and underscores only"
          }
          trailing={
            usernameState === "ok" ? (
              <span className="check-ok">
                <CheckIcon />
              </span>
            ) : null
          }
        />

        <FormField
          id="su-email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<MailIcon />}
          value={signup.email}
          onChange={(e) => signup.setEmail(e.target.value)}
          onBlur={() => signup.setEmailTouched(true)}
          state={emailState}
          message={emailState === "error" ? "Enter a valid email address" : ""}
        />

        <FormField
          id="su-pass"
          label="Password"
          type={signup.showPassword ? "text" : "password"}
          placeholder="Create a strong password"
          autoComplete="new-password"
          icon={<LockIcon />}
          value={signup.password}
          onChange={(e) => signup.setPassword(e.target.value)}
          trailing={
            <button
              type="button"
              className="icon-btn"
              onClick={() => signup.setShowPassword(!signup.showPassword)}
              aria-label="Show password"
            >
              <EyeIcon />
            </button>
          }
        />

        <PasswordStrengthMeter score={signup.strengthScore} />

        <FormField
          id="su-confirm"
          label="Confirm password"
          type={signup.showConfirm ? "text" : "password"}
          placeholder="Confirm your password"
          autoComplete="new-password"
          icon={<LockIcon />}
          value={signup.confirmPassword}
          onChange={(e) => signup.setConfirmPassword(e.target.value)}
          state={confirmState}
          message={
            confirmState === "error"
              ? "Passwords do not match"
              : confirmState === "ok"
                ? "Passwords match"
                : ""
          }
          trailing={
            <button
              type="button"
              className="icon-btn"
              onClick={() => signup.setShowConfirm(!signup.showConfirm)}
              aria-label="Show password"
            >
              <EyeIcon />
            </button>
          }
        />

        <label className="terms-row">
          <input
            type="checkbox"
            checked={signup.agreed}
            onChange={(e) => signup.setAgreed(e.target.checked)}
          />
          <span>
            I agree to the{" "}
            <a href="#" className="link-accent">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="link-accent">
              Privacy Policy
            </a>
          </span>
        </label>

        <button
          type="submit"
          className="btn-primary"
          disabled={!signup.isValid}
        >
          Create Account <span className="arrow">→</span>
        </button>
      </form>

      <SocialAuthButtons />
    </div>
  );
}

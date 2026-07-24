import { useState, useMemo, useRef } from "react";
import { emailRegex, usernameRegex, scorePassword } from "./authValidators";

export default function useAuthForm() {
  const [activePanel, setActivePanel] = useState("signin");
  const switchPanel = () =>
    setActivePanel((p) => (p === "signin" ? "signup" : "signin"));

  const [toast, setToast] = useState({ show: false, message: "" });
  const toastTimer = useRef(null);
  const showToast = (message) => {
    setToast({ show: true, message });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast({ show: false, message: "" }),
      3200,
    );
  };

  // ----- Sign In -----
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinShowPass, setSigninShowPass] = useState(false);
  const [signinRemember, setSigninRemember] = useState(false);
  const [signinEmailTouched, setSigninEmailTouched] = useState(false);
  const signinEmailValid = emailRegex.test(signinEmail);

  const handleSignIn = (e) => {
    e.preventDefault();
    setSigninEmailTouched(true);
    if (!signinEmailValid) return;
    showToast("Welcome back — signing you in…");
  };

  const handleMagicLink = () => {
    setSigninEmailTouched(true);
    if (!signinEmailValid) {
      showToast("Enter your email first to get a magic link");
      return;
    }
    showToast("Magic link sent to your inbox ✨");
  };

  // ----- Sign Up -----
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signupEmailTouched, setSignupEmailTouched] = useState(false);

  const usernameValid =
    username.length === 0 ? null : usernameRegex.test(username);
  const signupEmailValid = emailRegex.test(signupEmail);
  const strengthScore = useMemo(() => scorePassword(password), [password]);
  const confirmValid =
    confirmPassword.length === 0 ? null : confirmPassword === password;

  const signupValid =
    name.trim().length > 1 &&
    usernameRegex.test(username) &&
    signupEmailValid &&
    password.length >= 8 &&
    confirmPassword === password &&
    confirmPassword.length > 0 &&
    agreed;

  const handleSignUp = (e) => {
    e.preventDefault();
    setSignupEmailTouched(true);
    if (!signupValid) return;
    showToast("Account created — welcome to Web Wonder!");
  };

  return {
    activePanel,
    setActivePanel,
    switchPanel,
    toast,
    showToast,
    signin: {
      email: signinEmail,
      setEmail: setSigninEmail,
      password: signinPassword,
      setPassword: setSigninPassword,
      showPassword: signinShowPass,
      setShowPassword: setSigninShowPass,
      remember: signinRemember,
      setRemember: setSigninRemember,
      emailValid: signinEmailValid,
      emailTouched: signinEmailTouched,
      setEmailTouched: setSigninEmailTouched,
      handleSubmit: handleSignIn,
      handleMagicLink,
    },
    signup: {
      name,
      setName,
      username,
      setUsername,
      usernameValid,
      email: signupEmail,
      setEmail: setSignupEmail,
      emailValid: signupEmailValid,
      emailTouched: signupEmailTouched,
      setEmailTouched: setSignupEmailTouched,
      password,
      setPassword,
      strengthScore,
      confirmPassword,
      setConfirmPassword,
      confirmValid,
      showPassword: showPass,
      setShowPassword: setShowPass,
      showConfirm,
      setShowConfirm,
      agreed,
      setAgreed,
      isValid: signupValid,
      handleSubmit: handleSignUp,
    },
  };
}

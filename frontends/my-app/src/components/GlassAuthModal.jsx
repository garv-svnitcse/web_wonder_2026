import { API_URL } from "../config/api";
import React, { useMemo, useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSignIn, useSignUp, useAuth } from '@clerk/clerk-react';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRules = [
  {
    label: 'Minimum 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    label: 'One uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: 'One lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    label: 'One number',
    test: (value) => /[0-9]/.test(value),
  },
  {
    label: 'One special character',
    test: (value) => /[!@#$%^&*()_+\-=]/.test(value),
  },
];

export default function GlassAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState('');
  const [isMfaRequired, setIsMfaRequired] = useState(false);

  const trimmedEmail = email.trim();
  const emailIsValid = emailPattern.test(trimmedEmail);
  const passwordValidations = useMemo(
    () =>
      passwordRules.map((rule) => ({
        label: rule.label,
        valid: rule.test(password),
      })),
    [password],
  );
  const passwordIsValid = passwordValidations.every((rule) => rule.valid);
  const validPasswordCount = passwordValidations.filter((rule) => rule.valid).length;
  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = ['#f87171', '#fb923c', '#fde047', '#bef264', '#4ade80'];
  const strengthIndex = Math.max(0, Math.min(4, validPasswordCount - 1));
  const strengthLabel = strengthLabels[strengthIndex];
  const strengthColor = strengthColors[strengthIndex];
  const canSubmit = emailIsValid && (isLogin ? password.length > 0 : passwordIsValid) && !loading;
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getToken().then((token) => {
        if (token) {
          localStorage.setItem('access_token', token);
          onAuthSuccess?.(token);
        }
      });
    }
  }, [isLoaded, isSignedIn, getToken, onAuthSuccess]);

  if (!isOpen) return null;
  if (isLoaded && isSignedIn) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!isSignInLoaded) return;
        const result = await signIn.create({
          identifier: email,
          password: password,
        });

        if (result.status === "complete") {
          await setSignInActive({ session: result.createdSessionId });
          const token = await getToken();
          localStorage.setItem('access_token', token);
          onAuthSuccess?.(token);
        } else if (result.status === "needs_second_factor") {
          const secondFactor = result.supportedSecondFactors?.find(
            (f) => f.strategy === 'email_code' || f.strategy === 'phone_code'
          );
          if (secondFactor) {
            await signIn.prepareSecondFactor(secondFactor);
          }
          setIsMfaRequired(true);
          setOtpRequired(true);
        } else {
          throw new Error(`Login state is ${result.status}. Contact administrator.`);
        }
      } else {
        if (!isSignUpLoaded) return;
        await signUp.create({
          emailAddress: email,
          password: password,
          firstName: name || 'Explorer',
        });

        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });

        setOtpRequired(true);
        setError('');
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        let completeSignIn;
        if (isMfaRequired) {
          completeSignIn = await signIn.attemptSecondFactor({
            code: otp,
          });
        } else {
          completeSignIn = await signIn.attemptFirstFactor({
            strategy: 'email_code',
            code: otp,
          });
        }
        if (completeSignIn.status === 'complete') {
          await setSignInActive({ session: completeSignIn.createdSessionId });
          const token = await getToken();
          localStorage.setItem('access_token', token);
          onAuthSuccess?.(token);
        } else {
          throw new Error(`Verification state is ${completeSignIn.status}`);
        }
      } else {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: otp,
        });
        if (completeSignUp.status === 'complete') {
          await setSignUpActive({ session: completeSignUp.createdSessionId });
          const token = await getToken();
          localStorage.setItem('access_token', token);

          // Sync user to backend database immediately
          try {
            await fetch(`${API_URL}/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
          } catch (syncErr) {
            console.error("Failed to sync user to database:", syncErr);
          }

          onAuthSuccess?.(token);
        } else {
          throw new Error(`Verification state is ${completeSignUp.status}`);
        }
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const emailCodeFactor = signIn.supportedFirstFactors.find(
          (f) => f.strategy === 'email_code'
        );
        if (!emailCodeFactor) {
          throw new Error("Email verification is not supported for this account.");
        }
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId: emailCodeFactor.emailAddressId,
        });
      } else {
        await signUp.prepareEmailAddressVerification({
          strategy: 'email_code',
        });
      }
      setError("A new verification code has been sent!");
    } catch (err) {
      setError(err.errors?.[0]?.message || err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      setError('');
      setLoading(true);
      if (isLogin) {
        if (!isSignInLoaded) return;
        await signIn.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: window.location.origin + '/sso-callback',
          redirectUrlComplete: window.location.pathname + window.location.search
        });
      } else {
        if (!isSignUpLoaded) return;
        await signUp.authenticateWithRedirect({
          strategy: provider,
          redirectUrl: window.location.origin + '/sso-callback',
          redirectUrlComplete: window.location.pathname + window.location.search
        });
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || err.message || "Social login failed");
      setLoading(false);
    }
  };

  if (otpRequired) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        fontFamily: 'Outfit, sans-serif',
        overflowY: 'auto',
        padding: '20px 10px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '40px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxSizing: 'border-box',
          color: '#ECE4D8',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h2 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '28px',
            color: '#D6A14B',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            {isMfaRequired ? '2FA Code Required' : 'Verify Identity'}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#BBBBBB',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            {isMfaRequired 
              ? 'Enter the 6-digit verification code from your authenticator app or email.'
              : <>A 6-digit verification code was sent to <strong style={{ color: '#ECE4D8' }}>{email}</strong></>}
          </p>

          {error && (
            <div style={{
              background: error.includes('sent') ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
              border: error.includes('sent') ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(231, 76, 60, 0.3)',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              color: error.includes('sent') ? '#2ECC71' : '#E74C3C',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="6-Digit Code"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                color: '#ECE4D8',
                fontSize: '24px',
                fontWeight: '700',
                letterSpacing: '8px',
                textAlign: 'center',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />

            <button
              type="submit"
              disabled={otp.length !== 6 || loading}
              style={{
                background: 'linear-gradient(135deg, #D6A14B, #AF7B28)',
                color: '#111111',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '10px',
                opacity: otp.length === 6 && !loading ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Verifying...' : 'Verify & Enter'}
            </button>
          </form>

          <div style={{ marginTop: '24px', fontSize: '13px', color: '#BBBBBB' }}>
            Didn't receive code?{' '}
            <span
              onClick={handleResendOtp}
              style={{
                color: '#D6A14B',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Resend Code
            </span>
          </div>

          <div style={{ marginTop: '18px' }}>
            <button
              type="button"
              onClick={() => {
                setOtpRequired(false);
                setOtp('');
                setError('');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setOtpRequired(false);
                setOtp('');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#aaaaaa',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
                transition: 'color 0.2s',
                padding: '10px 20px',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => { e.target.style.color = '#ECE4D8'; }}
              onMouseLeave={(e) => { e.target.style.color = '#aaaaaa'; }}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      fontFamily: 'Outfit, sans-serif',
      overflowY: 'auto',
      padding: '20px 10px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxSizing: 'border-box',
        color: '#ECE4D8',
        textAlign: 'center',
        position: 'relative'
      }}>
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '32px',
          color: '#D6A14B',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          {isLogin ? 'Access Portal' : 'Join Expedition'}
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#BBBBBB',
          marginBottom: '24px'
        }}>
          {isLogin ? 'Verify credentials to enter JurassiVerse' : 'Create an explorer account'}
        </p>

        {error && (
          <div style={{
            background: error.includes('successfully') ? 'rgba(46, 204, 113, 0.15)' : 'rgba(231, 76, 60, 0.15)',
            border: error.includes('successfully') ? '1px solid rgba(46, 204, 113, 0.3)' : '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: '12px',
            padding: '12px',
            fontSize: '13px',
            color: error.includes('successfully') ? '#2ECC71' : '#E74C3C',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Explorer Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px 18px',
                color: '#ECE4D8',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="email"
              placeholder="Explorer Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${email ? (emailIsValid ? 'rgba(52, 211, 153, 0.8)' : 'rgba(239, 68, 68, 0.75)') : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '12px',
                padding: '14px 18px',
                color: '#ECE4D8',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
            {email ? (
              <div style={{ color: emailIsValid ? '#34d399' : '#f87171', fontSize: '13px', textAlign: 'left' }}>
                {emailIsValid ? '✓ Valid Email' : '✗ Invalid Email Address'}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Security Key (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${password ? (isLogin || passwordIsValid ? 'rgba(52, 211, 153, 0.8)' : 'rgba(239, 68, 68, 0.75)') : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '12px',
                padding: '14px 18px',
                color: '#ECE4D8',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#d6a14b',
                cursor: 'pointer',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {!isLogin && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {passwordValidations.map((rule) => (
                    <div
                      key={rule.label}
                      style={{
                        color: rule.valid ? '#34d399' : '#94a3b8',
                        fontSize: '13px',
                        textAlign: 'left',
                      }}
                    >
                      {rule.valid ? '✓' : '✗'} {rule.label}
                    </div>
                  ))}
                </div>
                <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${((validPasswordCount / passwordRules.length) * 100).toFixed(0)}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: strengthColor,
                      transition: 'width 0.35s ease-in-out, background-color 0.35s ease-in-out',
                    }}
                  />
                </div>
                <div style={{ color: strengthColor, fontSize: '13px', textAlign: 'left' }}>
                  {strengthLabel}
                </div>
              </>
            )}
          </div>
          {canSubmit ? (
            <div style={{ color: '#34d399', fontSize: '13px', textAlign: 'left' }}>
              ✓ Ready to {isLogin ? 'Login' : 'Submit'}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              background: 'linear-gradient(135deg, #D6A14B, #AF7B28)',
              color: '#111111',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginTop: '10px',
              opacity: canSubmit ? 1 : 0.5,
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Authenticating...' : isLogin ? 'Enter' : 'Create Account'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 15px', color: '#bbbbbb', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => handleSocialLogin('oauth_google')}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: '#ece4d8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(214,161,75,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div style={{ marginTop: '24px', fontSize: '13px', color: '#BBBBBB' }}>
          {isLogin ? "New explorer?" : "Already registered?"}{' '}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              color: '#D6A14B',
              cursor: 'pointer',
              fontWeight: 600,
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Create Credentials' : 'Login Portal'}
          </span>
        </div>
        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={onClose}
            onTouchEnd={(e) => {
              e.preventDefault();
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#aaaaaa',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'none',
              transition: 'color 0.2s',
              padding: '10px 20px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => { e.target.style.color = '#ECE4D8'; }}
            onMouseLeave={(e) => { e.target.style.color = '#aaaaaa'; }}
          >
            Cancel & Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}

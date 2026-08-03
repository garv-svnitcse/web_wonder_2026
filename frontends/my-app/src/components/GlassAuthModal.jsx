import React, { useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { apiUrl } from '../config/api';

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
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Keep auth on the same configured backend origin as the rest of the app.
    // Calling `/api/...` directly only works while the Vite development proxy is
    // running and can otherwise return an empty HTML/response body.
    const url = apiUrl(isLogin ? '/auth/login' : '/auth/signup');
    
    const body = isLogin 
      ? { email, password } 
      : { email, password, name: name || 'Explorer' };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      // Error responses are not guaranteed to be JSON (for example, a reverse
      // proxy can return an empty 502 response). Parse defensively so users see
      // a useful authentication error instead of a JSON parsing exception.
      const responseText = await response.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          if (!response.ok) {
            throw new Error(`Authentication service returned ${response.status}. Please try again.`);
          }
          throw new Error('Authentication service returned an invalid response. Please try again.');
        }
      }

      if (!response.ok) {
        throw new Error(data.detail || data.message || `Authentication failed (${response.status})`);
      }

      if (isLogin) {
        if (!data.access_token) {
          throw new Error('Login could not be completed. Please try again.');
        }
        localStorage.setItem('access_token', data.access_token);
        onAuthSuccess?.(data.access_token);
        onClose();
      } else {
        // After signup, switch to login mode with message
        setIsLogin(true);
        setError('Account created successfully! Please log in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      fontFamily: 'Outfit, sans-serif'
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
        <div style={{ marginTop: '18px' }}>
          <span
            onClick={onClose}
            style={{
              color: '#aaaaaa',
              cursor: 'pointer',
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.color = '#ECE4D8'; }}
            onMouseLeave={(e) => { e.target.style.color = '#aaaaaa'; }}
          >
            Cancel & Return to Home
          </span>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function GlassAuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin 
      ? '/api/auth/login'
      : '/api/auth/signup';
    
    const body = isLogin 
      ? { email, password } 
      : { email, password, name: name || 'Explorer' };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      if (isLogin) {
        localStorage.setItem('access_token', data.access_token);
        onAuthSuccess(data.access_token);
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
          <input
            type="email"
            placeholder="Explorer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <input
            type="password"
            placeholder="Security Key (Password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #D6A14B, #AF7B28)',
              color: '#111111',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginTop: '10px',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
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

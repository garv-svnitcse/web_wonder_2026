import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Key, CheckCircle, AlertTriangle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Quick validation
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Backend expects matching JSON or form for login
        await login({
          username: formData.email, // backend routes/auth.py may accept email/username as OAuth2 form details
          password: formData.password
        });
        setSuccess('Authentication successful! Transporting to main frame...');
        setTimeout(() => navigate('/'), 1200);
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        setSuccess('Account created successfully! Auto-logging in...');
        setTimeout(() => navigate('/'), 1200);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Please verify your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glass-card" style={styles.card}>
        {/* Toggle tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              ...styles.tabBtn,
              color: isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: isLogin ? '2px solid var(--primary-light)' : '2px solid transparent',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              ...styles.tabBtn,
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: !isLogin ? '2px solid var(--primary-light)' : '2px solid transparent',
            }}
          >
            Join Expedition
          </button>
        </div>

        <h2 style={styles.title}>
          {isLogin ? 'Welcome Back, Explorer' : 'Create Expedition Profile'}
        </h2>
        <p style={styles.subtitle}>
          {isLogin ? 'Provide your credentials to access your discoveries.' : 'Establish your account to log findings and take part in activities.'}
        </p>

        {/* Notifications */}
        {error && (
          <div style={styles.errorBox}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div style={styles.successBox}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={styles.form}>
          {/* Username (Only for sign up) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="username">Explorer Username</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputIcon} />
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  placeholder="e.g. PaleontologistBob"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  style={styles.paddedInput}
                />
              </div>
            </div>
          )}

          {/* Email / Username field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              {isLogin ? 'Username or Email' : 'Email Address'}
            </label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type={isLogin ? 'text' : 'email'}
                id="email"
                name="email"
                required
                placeholder={isLogin ? "yourname@domain.com" : "explorer@domain.com"}
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                style={styles.paddedInput}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                style={styles.paddedInput}
              />
            </div>
          </div>

          {/* Confirm Password (Only for sign up) */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={styles.inputWrapper}>
                <Key size={18} style={styles.inputIcon} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  style={styles.paddedInput}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ ...styles.submitBtn, opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Decrypting...' : isLogin ? 'Access System' : 'Create Credentials'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1.5rem',
    minHeight: '75vh',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border-color)',
    marginBottom: '2rem',
  },
  tabBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '0.75rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all var(--transition-fast)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '2rem',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  paddedInput: {
    paddingLeft: '40px',
    width: '100%',
  },
  submitBtn: {
    marginTop: '1rem',
    padding: '0.85rem',
    fontWeight: '600',
    fontSize: '1rem',
  },
  errorBox: {
    backgroundColor: 'rgba(159, 12, 57, 0.15)',
    border: '1px solid rgba(159, 12, 57, 0.3)',
    color: '#fb7185',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  successBox: {
    backgroundColor: 'rgba(27, 94, 52, 0.15)',
    border: '1px solid rgba(27, 94, 52, 0.3)',
    color: '#34d399',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
};

export default Auth;

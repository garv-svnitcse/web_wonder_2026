import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Menu, X, LogOut, ShieldAlert, Award, MessageSquare, BookOpen, Clock, Mail } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/research', label: 'Encyclopedia', icon: <BookOpen size={18} /> },
    { to: '/timeline', label: 'Timeline', icon: <Clock size={18} /> },
    { to: '/quiz', label: 'Quiz Arena', icon: <Award size={18} /> },
    { to: '/community', label: 'Community', icon: <MessageSquare size={18} /> },
    { to: '/contact', label: 'Contact', icon: <Mail size={18} /> },
  ];

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        {/* Brand Logo */}
        <Link to="/" style={styles.logo} onClick={() => setMobileMenuOpen(false)}>
          <Compass size={28} color="var(--primary-light)" style={styles.logoIcon} />
          <span style={styles.logoText}>Jurassic <span style={{ color: 'var(--secondary)' }}>Time</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={styles.desktopMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                ...styles.link,
                color: isActive ? 'var(--secondary-light)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--secondary)' : '2px solid transparent',
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Auth status desktop */}
        <div style={styles.authDesktop}>
          {isAuthenticated ? (
            <div style={styles.userSection}>
              {isAdmin && (
                <Link to="/admin" style={styles.adminBadge} title="Admin Panel">
                  <ShieldAlert size={16} />
                  <span>Admin</span>
                </Link>
              )}
              <span style={styles.username}>{user?.username || 'Explorer'}</span>
              <button onClick={handleLogout} style={styles.logoutBtn} className="btn btn-outline">
                <LogOut size={16} />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <Link to="/auth" style={styles.loginBtn} className="btn btn-primary">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button style={styles.mobileMenuToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                ...styles.mobileLink,
                backgroundColor: isActive ? 'rgba(217, 119, 6, 0.1)' : 'transparent',
                color: isActive ? 'var(--secondary-light)' : 'var(--text-primary)',
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
          
          <div style={styles.mobileDivider} />

          {isAuthenticated ? (
            <div style={styles.mobileUserSection}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={styles.username}>{user?.username || 'Explorer'}</span>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={styles.mobileAdminLink}>
                    (Admin Panel)
                  </Link>
                )}
              </div>
              <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              style={styles.mobileLoginBtn}
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: 'rgba(11, 15, 18, 0.85)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    transition: 'transform var(--transition-normal)',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  desktopMenu: {
    display: 'none',
    alignItems: 'center',
    gap: '1.5rem',
    height: '100%',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '1.4rem 0.2rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color var(--transition-fast)',
  },
  authDesktop: {
    display: 'none',
    alignItems: 'center',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  username: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  adminBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    backgroundColor: 'rgba(159, 12, 57, 0.2)',
    color: '#f43f5e',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid rgba(159, 12, 57, 0.3)',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.8rem',
    fontSize: '0.85rem',
  },
  loginBtn: {
    padding: '0.5rem 1.2rem',
    fontSize: '0.9rem',
  },
  mobileMenuToggle: {
    display: 'block',
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  mobileMenu: {
    position: 'absolute',
    top: '70px',
    left: 0,
    right: 0,
    backgroundColor: 'var(--bg-surface)',
    borderBottom: '1px solid var(--border-color)',
    padding: '1rem 1.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    zIndex: 999,
  },
  mobileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
  },
  mobileDivider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '0.75rem 0',
  },
  mobileUserSection: {
    padding: '0.5rem 1rem',
  },
  mobileAdminLink: {
    fontSize: '0.85rem',
    color: 'var(--accent-light)',
    marginLeft: '0.5rem',
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    color: '#f43f5e',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  mobileLoginBtn: {
    display: 'block',
    textAlign: 'center',
    padding: '0.75rem',
    backgroundColor: 'var(--primary)',
    color: 'white',
    borderRadius: '8px',
    fontWeight: '600',
  },
  // Responsive desktop style inject dynamically via CSS or standard MQ
};

// Add standard Media Queries using stylesheet injection in component mount or index.css
const cssRule = `
@media (min-width: 768px) {
  nav button[style*="mobileMenuToggle"] {
    display: none !important;
  }
  div[style*="desktopMenu"] {
    display: flex !important;
  }
  div[style*="authDesktop"] {
    display: flex !important;
  }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cssRule));
  document.head.appendChild(style);
}

export default Navbar;

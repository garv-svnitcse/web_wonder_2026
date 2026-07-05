import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, AlertOctagon } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={styles.container} className="animate-fade-in">
      <div className="glass-card" style={styles.card}>
        <AlertOctagon size={64} color="var(--accent-light)" style={{ marginBottom: '1.5rem', animation: 'pulse 2s infinite' }} />
        <h1 style={styles.title} className="text-gradient">404 - Specimen Extinct</h1>
        <h3 style={styles.subtitle}>Lost In Deep Time</h3>
        <p style={styles.text}>
          The geological coordinates you requested do not exist in our historical logs. The page may have been eroded by time or is yet to be discovered.
        </p>
        <Link to="/" style={styles.btn} className="btn btn-primary">
          <Compass size={18} />
          <span>Return to base camp</span>
        </Link>
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; text-shadow: 0 0 15px rgba(225, 29, 72, 0.4); }
          100% { transform: scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: '0 1.5rem',
  },
  card: {
    maxWidth: '500px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '3rem 2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--secondary-light)',
    marginBottom: '1.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 1.5rem',
  },
};

export default NotFound;

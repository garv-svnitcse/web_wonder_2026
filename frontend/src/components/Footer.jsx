import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.grid}>
        {/* Brand Section */}
        <div style={styles.brandCol}>
          <div style={styles.logo}>
            <Compass size={24} color="var(--primary-light)" />
            <span style={styles.logoText}>Jurassic <span style={{ color: 'var(--secondary)' }}>Time</span></span>
          </div>
          <p style={styles.desc}>
            Step back 65 million years. Explore dinosaur species, examine fossil structures, participate in community discussions, and take educational quizzes. Built for paleontologists, students, and dinosaur enthusiasts alike.
          </p>
        </div>

        {/* Quick Links Section */}
        <div style={styles.linksCol}>
          <h4 style={styles.colTitle}>Navigation</h4>
          <div style={styles.linksGrid}>
            <Link to="/research" style={styles.link}>Dino Encyclopedia</Link>
            <Link to="/timeline" style={styles.link}>Interactive Timeline</Link>
            <Link to="/quiz" style={styles.link}>Trivia Arena</Link>
            <Link to="/community" style={styles.link}>Community Board</Link>
            <Link to="/contact" style={styles.link}>Get In Touch</Link>
          </div>
        </div>

        {/* Platform info */}
        <div style={styles.infoCol}>
          <h4 style={styles.colTitle}>Geologic Eras</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}><span style={{ color: '#fbbf24', marginRight: '0.5rem' }}>●</span> Triassic Period (252–201M)</li>
            <li style={styles.listItem}><span style={{ color: '#34d399', marginRight: '0.5rem' }}>●</span> Jurassic Period (201–145M)</li>
            <li style={styles.listItem}><span style={{ color: '#fb7185', marginRight: '0.5rem' }}>●</span> Cretaceous Period (145–66M)</li>
          </ul>
        </div>
      </div>

      <div style={styles.divider} />

      <div className="container" style={styles.bottom}>
        <p style={styles.copy}>
          &copy; {currentYear} Jurassic Time Project. All rights reserved. Prehistoric resources compiled under Creative Commons metadata.
        </p>
        <p style={styles.devNote}>
          Designed for Advanced Software Engineering.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'rgba(20, 27, 33, 0.95)',
    borderTop: '1px solid var(--border-color)',
    padding: '4rem 0 2rem',
    marginTop: 'auto',
    color: 'var(--text-secondary)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '3rem',
    marginBottom: '3rem',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  desc: {
    fontSize: '0.875rem',
    lineHeight: '1.6',
    maxWidth: '400px',
  },
  colTitle: {
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  linksCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  linksGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  link: {
    fontSize: '0.9rem',
    transition: 'color var(--transition-fast)',
    alignSelf: 'start',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    fontSize: '0.9rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    marginBottom: '1.5rem',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '0.8rem',
  },
  copy: {
    maxWidth: '600px',
  },
  devNote: {
    color: 'var(--text-muted)',
  },
};

export default Footer;

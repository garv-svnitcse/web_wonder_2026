import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Clock, Award, MessageSquare, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Hero Section */}
      <header style={styles.hero}>
        <div style={styles.heroBgOverlay} />
        <div className="container" style={styles.heroContent}>
          <div style={styles.badge}>
            <Compass size={16} />
            <span>Prehistoric Museum & Database Portal</span>
          </div>
          <h1 style={styles.heroTitle} className="text-gradient">
            Explore the <br />
            <span style={{ color: 'var(--secondary)' }}>Jurassic Frontier</span>
          </h1>
          <p style={styles.heroSub}>
            Step back 65 million years. Immerse yourself in a collaborative encyclopedia of dinosaur species, trace evolutionary events through an interactive timeline, quiz your knowledge, and publish your fossil finds.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/research" style={styles.btnPrimary} className="btn btn-primary">
              <span>Enter Encyclopedia</span>
              <BookOpen size={18} />
            </Link>
            <Link to="/timeline" style={styles.btnSecondary} className="btn btn-outline">
              <span>View Timeline</span>
              <Clock size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* Geologic Eras Section */}
      <section style={styles.erasSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>The Mesozoic Era</h2>
            <p style={styles.sectionSub}>The age of reptiles span three distinct geologic periods. Discover how Earth evolved.</p>
          </div>
          
          <div className="grid-cols-3">
            {/* Triassic Period */}
            <div className="glass-card" style={styles.eraCard}>
              <div className="era-badge era-triassic" style={{ marginBottom: '1rem' }}>Triassic Period</div>
              <h3 style={styles.eraCardTitle}>252 – 201 Million Years Ago</h3>
              <p style={styles.eraCardText}>
                The dawn of dinosaurs following the great Permian extinction. Mammal-like reptiles and early dinosaurs emerged on the supercontinent Pangaea under dry, hot desert climates.
              </p>
              <Link to="/research?era=triassic" style={styles.eraLink}>
                <span>Explore Triassic Species</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Jurassic Period */}
            <div className="glass-card" style={styles.eraCard}>
              <div className="era-badge era-jurassic" style={{ marginBottom: '1rem' }}>Jurassic Period</div>
              <h3 style={styles.eraCardTitle}>201 – 145 Million Years Ago</h3>
              <p style={styles.eraCardText}>
                The golden age of giant sauropods and lush conifers. Pangaea split into Laurasia and Gondwana, bringing warm, tropical climates that supported colossal land-dwelling creatures.
              </p>
              <Link to="/research?era=jurassic" style={styles.eraLink}>
                <span>Explore Jurassic Species</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Cretaceous Period */}
            <div className="glass-card" style={styles.eraCard}>
              <div className="era-badge era-cretaceous" style={{ marginBottom: '1rem' }}>Cretaceous Period</div>
              <h3 style={styles.eraCardTitle}>145 – 66 Million Years Ago</h3>
              <p style={styles.eraCardText}>
                The apex of dinosaur diversification. Tyrannosauroids, ceratopsians, and duckbilled dinosaurs thrived alongside early flowering plants before the asteroid impact event.
              </p>
              <Link to="/research?era=cretaceous" style={styles.eraLink}>
                <span>Explore Cretaceous Species</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section style={styles.featuresSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Portal Capabilities</h2>
            <p style={styles.sectionSub}>Everything you need to study, discuss, and learn about the ancient world.</p>
          </div>

          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>
              <div style={styles.featureIconBox}><BookOpen size={24} color="var(--primary-light)" /></div>
              <div>
                <h3 style={styles.featureItemTitle}>Encyclopedia (CRUD)</h3>
                <p style={styles.featureItemText}>Search and filter dinosaurs by period, region, and diet. Admins and authorized educators can manage the entry records directly.</p>
              </div>
            </div>
            
            <div style={styles.featureItem}>
              <div style={styles.featureIconBox}><Clock size={24} color="var(--primary-light)" /></div>
              <div>
                <h3 style={styles.featureItemTitle}>Interactive Timeline</h3>
                <p style={styles.featureItemText}>Scroll through millions of years of continental shifts, atmospheric developments, and fossil occurrences aligned by era.</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <div style={styles.featureIconBox}><Award size={24} color="var(--primary-light)" /></div>
              <div>
                <h3 style={styles.featureItemTitle}>Trivia Arena</h3>
                <p style={styles.featureItemText}>Put your knowledge to the test. Take quizzes on paleontology, maintain answer streaks, and claim your place on the global leaderboard.</p>
              </div>
            </div>

            <div style={styles.featureItem}>
              <div style={styles.featureIconBox}><MessageSquare size={24} color="var(--primary-light)" /></div>
              <div>
                <h3 style={styles.featureItemTitle}>Community Log</h3>
                <p style={styles.featureItemText}>Join discussions with fellow fossil hunters. Log your personal fossil findings, submit photos, and share excavation locations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  hero: {
    position: 'relative',
    padding: '8rem 0 6rem',
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    background: 'radial-gradient(circle at 80% 20%, rgba(46, 139, 87, 0.12) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(217, 119, 6, 0.08) 0%, transparent 50%)',
    borderBottom: '1px solid var(--border-color)',
    overflow: 'hidden',
  },
  heroBgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `radial-gradient(var(--border-color) 1px, transparent 0)`,
    backgroundSize: '24px 24px',
    opacity: 0.15,
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
  },
  heroTitle: {
    fontSize: '3.5rem',
    lineHeight: '1.1',
    fontWeight: '800',
    marginBottom: '1.5rem',
  },
  heroSub: {
    fontSize: '1.125rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '2.5rem',
  },
  heroBtns: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    gap: '0.75rem',
    padding: '0.9rem 1.8rem',
    fontSize: '1rem',
  },
  btnSecondary: {
    gap: '0.75rem',
    padding: '0.9rem 1.8rem',
    fontSize: '1rem',
  },
  erasSection: {
    padding: '6rem 0',
    borderBottom: '1px solid var(--border-color)',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  sectionSub: {
    fontSize: '1.05rem',
    color: 'var(--text-secondary)',
  },
  eraCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  eraCardTitle: {
    fontSize: '1.1rem',
    marginBottom: '1rem',
    color: 'var(--text-primary)',
  },
  eraCardText: {
    fontSize: '0.925rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    flexGrow: 1,
    marginBottom: '1.5rem',
  },
  eraLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--secondary-light)',
    marginTop: 'auto',
  },
  featuresSection: {
    padding: '6rem 0',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '3rem 2rem',
  },
  featureItem: {
    display: 'flex',
    gap: '1.5rem',
  },
  featureIconBox: {
    flexShrink: 0,
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    backgroundColor: 'rgba(46, 139, 87, 0.1)',
    border: '1px solid rgba(46, 139, 87, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureItemTitle: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  featureItemText: {
    fontSize: '0.925rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
};

export default Home;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { researchAPI } from '../services/api';
import { ArrowLeft, Compass, ShieldAlert, Cpu, Layers, Disc3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Local specimen database for fallback offline mode
const LOCAL_SPECIMENS = {
  'tyrannosaurus-rex': {
    name: 'Tyrannosaurus Rex',
    scientific_name: 'Tyrannosaurus rex',
    era: 'cretaceous',
    diet: 'carnivore',
    region: 'North America',
    length_meters: 12.3,
    weight_kg: 8000,
    discovery_year: 1902,
    discovered_by: 'Barnum Brown',
    description: 'Tyrannosaurus rex was one of the largest land carnivores of all time. It lived throughout what is now western North America, on what was then an island continent known as Laramidia. Tyrannosaurus had a much wider range than other tyrannosaurids. Fossils are found in a variety of rock formations dating to the Maastrichtian age of the upper Cretaceous Period, 68 to 66 million years ago.',
    habitat: 'Humid subtropical coastal plains and forested river valleys',
    bite_force_newtons: 57000,
    key_facts: [
      'Had teeth up to 30 centimeters (12 inches) long, including the root.',
      'Possessed excellent binocular vision, superior to modern birds of prey.',
      'Exhibited massive neck musculature to support its 1.5-meter long jaw skull.'
    ]
  },
  'triceratops-horridus': {
    name: 'Triceratops Horridus',
    scientific_name: 'Triceratops horridus',
    era: 'cretaceous',
    diet: 'herbivore',
    region: 'North America',
    length_meters: 9.0,
    weight_kg: 10000,
    discovery_year: 1887,
    discovered_by: 'Othniel Charles Marsh',
    description: 'Triceratops is a genus of herbivorous ceratopsid dinosaur that first appeared during the late Maastrichtian stage of the late Cretaceous period. Bearing a large bony frill, three horns on the skull, and a large four-legged body resembling that of a rhinoceros, Triceratops is one of the most recognizable of all dinosaurs and the most well-known ceratopsid.',
    habitat: 'Coastal plains and floodplains',
    bite_force_newtons: 0,
    key_facts: [
      'Possessed between 400 and 800 teeth arranged in dental batteries.',
      'The bony frill was likely used for thermoregulation and courtship display.',
      'Shared its environment with and was preyed upon by Tyrannosaurus rex.'
    ]
  },
  'stegosaurus-stenops': {
    name: 'Stegosaurus Stenops',
    scientific_name: 'Stegosaurus stenops',
    era: 'jurassic',
    diet: 'herbivore',
    region: 'North America / Europe',
    length_meters: 9.0,
    weight_kg: 5000,
    discovery_year: 1877,
    discovered_by: 'Othniel Charles Marsh',
    description: 'Stegosaurus is a genus of herbivorous thyreophoran dinosaur. They lived during the Late Jurassic period, between 155 and 150 million years ago, in what is now western North America. Due to its distinctive tail spikes and plates, Stegosaurus is one of the most recognizable kinds of dinosaurs.',
    habitat: 'Semi-arid environments with distinct wet and dry seasons',
    bite_force_newtons: 0,
    key_facts: [
      'The plates along its back were not attached to the skeleton, but to the skin.',
      'Possessed a brain roughly the size of a walnut.',
      'Defended itself using a spike-tipped tail known colloquially as a thagomizer.'
    ]
  }
};

const ResearchDetail = () => {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  
  const [specimen, setSpecimen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerMode, setViewerMode] = useState('mesh'); // mesh | skeleton | skin
  const [rotate, setRotate] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchSpecimen = async () => {
      setLoading(true);
      try {
        const data = await researchAPI.getBySlug(slug);
        setSpecimen(data);
        setUsingFallback(false);
      } catch (err) {
        console.warn(`Specimen dossier API failure. Pulling local cache for slug "${slug}".`, err);
        const local = LOCAL_SPECIMENS[slug] || Object.values(LOCAL_SPECIMENS)[0];
        setSpecimen(local);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecimen();
  }, [slug]);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" style={styles.spinner} />
        <p style={{ color: 'var(--text-secondary)' }}>Scanning fossilized matrix...</p>
      </div>
    );
  }

  if (!specimen) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Specimen Dossier Not Found</h2>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-secondary)' }}>This classification has not yet been logged in the archives.</p>
        <Link to="/research" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 6rem' }}>
      {/* Back button */}
      <Link to="/research" style={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Return to Catalog</span>
      </Link>

      {/* Grid container */}
      <div style={styles.mainGrid}>
        {/* Info panel */}
        <div style={styles.infoPanel}>
          <div style={styles.headerRow}>
            <span className={`era-badge era-${specimen.era}`}>{specimen.era} Period</span>
            <span style={styles.dietLabel}>{specimen.diet}</span>
          </div>

          <h1 style={styles.title}>{specimen.name}</h1>
          {specimen.scientific_name && (
            <p style={styles.scientificName}>Scientific classification: <i>{specimen.scientific_name}</i></p>
          )}

          <div style={styles.divider} />

          <p style={styles.description}>{specimen.description}</p>

          {/* Quick Metrics */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Discovered</span>
              <span style={styles.metricVal}>{specimen.discovery_year || 'Unknown'}</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Length</span>
              <span style={styles.metricVal}>{specimen.length_meters ? `${specimen.length_meters} m` : 'N/A'}</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Weight</span>
              <span style={styles.metricVal}>{specimen.weight_kg ? `${(specimen.weight_kg / 1000).toFixed(1)} tons` : 'N/A'}</span>
            </div>
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Origin Region</span>
              <span style={styles.metricVal}>{specimen.region || 'Unknown'}</span>
            </div>
          </div>

          {/* Habitat and facts */}
          {specimen.habitat && (
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>Habitat Environment</h3>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>{specimen.habitat}</p>
            </div>
          )}

          {specimen.key_facts && specimen.key_facts.length > 0 && (
            <div style={styles.infoSection}>
              <h3 style={styles.sectionTitle}>Key Structural Characteristics</h3>
              <ul style={styles.factsList}>
                {specimen.key_facts.map((fact, idx) => (
                  <li key={idx} style={styles.factItem}>{fact}</li>
                ))}
              </ul>
            </div>
          )}

          {usingFallback && (
            <div style={styles.sandboxBadge}>
              <Compass size={14} />
              <span>Viewing offline archive specimen dossier.</span>
            </div>
          )}
        </div>

        {/* 3D Viewer Panel */}
        <div style={styles.viewerPanel}>
          <div className="glass-card" style={styles.viewerCard}>
            <div style={styles.viewerHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={16} color="var(--primary-light)" />
                <span style={styles.viewerTitle}>3D Artifact Scan</span>
              </div>
              <button 
                onClick={() => setRotate(!rotate)} 
                style={{
                  ...styles.controlBtn,
                  color: rotate ? 'var(--secondary-light)' : 'var(--text-muted)'
                }}
                title="Toggle Auto Rotation"
              >
                <Disc3 size={16} className={rotate ? 'rotating' : ''} />
                <span>{rotate ? 'Spinning' : 'Static'}</span>
              </button>
            </div>

            {/* Virtual canvas area */}
            <div style={styles.canvasArea}>
              <div style={{
                ...styles.mockModel,
                animation: rotate ? 'rotateModel 15s linear infinite' : 'none'
              }}>
                {/* Clean inline SVG representations based on viewerMode */}
                {viewerMode === 'skeleton' ? (
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="rgba(241,245,249,0.7)" strokeWidth="1.5">
                    {/* Abstract dinosaur skull sketch */}
                    <path d="M20,50 Q40,30 80,30 Q90,30 90,45 Q90,60 70,60 L50,60 L40,80 Q30,85 20,75 Z" />
                    <circle cx="70" cy="42" r="4" fill="none" />
                    <line x1="30" y1="65" x2="80" y2="65" strokeDasharray="3,3" />
                  </svg>
                ) : viewerMode === 'skin' ? (
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="var(--primary)" stroke="var(--primary-light)" strokeWidth="1">
                    {/* Solid model outline */}
                    <path d="M20,50 C35,25 75,25 85,40 C95,55 85,70 65,70 L50,70 L35,85 C25,90 15,80 20,50 Z" />
                    <circle cx="70" cy="42" r="3" fill="#111" />
                  </svg>
                ) : (
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none" stroke="var(--secondary)" strokeWidth="1">
                    {/* Wireframe mesh model */}
                    <path d="M20,50 Q40,30 80,30 Q90,30 90,45 Q90,60 70,60 L50,60 L40,80 Q30,85 20,75 Z" />
                    {/* Wireframe grids */}
                    <line x1="20" y1="50" x2="90" y2="45" />
                    <line x1="50" y1="30" x2="40" y2="80" />
                    <line x1="40" y1="45" x2="70" y2="60" />
                    <path d="M30,40 L60,60 M60,30 L50,70" />
                  </svg>
                )}
              </div>

              {/* Grid backdrop */}
              <div style={styles.gridBackdrop} />
            </div>

            {/* Viewer controls */}
            <div style={styles.viewerControls}>
              <button 
                onClick={() => setViewerMode('mesh')}
                style={{
                  ...styles.modeBtn,
                  backgroundColor: viewerMode === 'mesh' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: viewerMode === 'mesh' ? 'var(--secondary-light)' : 'var(--text-secondary)'
                }}
              >
                <Cpu size={14} />
                <span>Wireframe</span>
              </button>
              <button 
                onClick={() => setViewerMode('skeleton')}
                style={{
                  ...styles.modeBtn,
                  backgroundColor: viewerMode === 'skeleton' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: viewerMode === 'skeleton' ? 'var(--secondary-light)' : 'var(--text-secondary)'
                }}
              >
                <Layers size={14} />
                <span>Skeletal</span>
              </button>
              <button 
                onClick={() => setViewerMode('skin')}
                style={{
                  ...styles.modeBtn,
                  backgroundColor: viewerMode === 'skin' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: viewerMode === 'skin' ? 'var(--secondary-light)' : 'var(--text-secondary)'
                }}
              >
                <Compass size={14} />
                <span>Biological</span>
              </button>
            </div>

            <p style={styles.viewerDesc}>
              Using rendering parameters. Standard loaders (GLTFLoader/ThreeJS) can target this structural container.
            </p>
          </div>
        </div>
      </div>

      {/* Embedded keyframe styles for spinning rotation */}
      <style>{`
        @keyframes rotateModel {
          0% { transform: rotateY(0deg) rotateX(10deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }
        .rotating {
          animation: spinControl 3s linear infinite;
        }
        @keyframes spinControl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(46, 139, 87, 0.1)',
    borderTop: '3px solid var(--primary-light)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
  },
  infoPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  dietLabel: {
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: '1.1',
    marginBottom: '0.5rem',
  },
  scientificName: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border-color)',
    margin: '1.5rem 0',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  metricItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    padding: '1rem',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '0.25rem',
  },
  metricVal: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  infoSection: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  factsList: {
    paddingLeft: '1.25rem',
    fontSize: '0.925rem',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  factItem: {
    lineHeight: '1.5',
  },
  sandboxBadge: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    alignSelf: 'start',
  },
  viewerPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  viewerCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    height: '420px',
  },
  viewerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  viewerTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  controlBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  canvasArea: {
    flexGrow: 1,
    position: 'relative',
    backgroundColor: '#050709',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '800px',
  },
  mockModel: {
    position: 'relative',
    zIndex: 2,
    transformStyle: 'preserve-3d',
    transform: 'rotateX(10deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
    backgroundSize: '15px 15px',
    backgroundPosition: 'center',
    pointerEvents: 'none',
  },
  viewerControls: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '6px',
    padding: '0.25rem',
    gap: '0.25rem',
    marginTop: '1rem',
  },
  modeBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.35rem',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  viewerDesc: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.75rem',
    textAlign: 'center',
  },
};

export default ResearchDetail;

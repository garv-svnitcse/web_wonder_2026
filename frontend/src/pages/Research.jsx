import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { researchAPI } from '../services/api';
import { Search, SlidersHorizontal, Plus, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Offline fallback dataset for premium experience immediately
const FALLBACK_DINOSAURS = [
  {
    name: 'Tyrannosaurus Rex',
    slug: 'tyrannosaurus-rex',
    era: 'cretaceous',
    diet: 'carnivore',
    region: 'North America',
    length_meters: 12.3,
    description: 'Perhaps the most famous predator in Earth\'s history, Tyrannosaurus had a massive skull balanced by a heavy tail and minute two-clawed forelimbs.',
  },
  {
    name: 'Triceratops Horridus',
    slug: 'triceratops-horridus',
    era: 'cretaceous',
    diet: 'herbivore',
    region: 'North America',
    length_meters: 9.0,
    description: 'Bearing a large bony frill and three formidable facial horns, Triceratops is one of the most recognizable of all prehistoric creatures.',
  },
  {
    name: 'Stegosaurus Stenops',
    slug: 'stegosaurus-stenops',
    era: 'jurassic',
    diet: 'herbivore',
    region: 'North America / Europe',
    length_meters: 9.0,
    description: 'Famous for the double row of plate-like osteoderms along its back and the spike-tipped tail, or thagomizer, used for active defense.',
  },
  {
    name: 'Velociraptor Mongoliensis',
    slug: 'velociraptor-mongoliensis',
    era: 'cretaceous',
    diet: 'carnivore',
    region: 'Asia',
    length_meters: 2.0,
    description: 'A bipedal, feathered carnivore with a long tail and an enlarged sickle-shaped claw on each hindfoot, which it used to dispatch prey.',
  },
  {
    name: 'Brachiosaurus Altithorax',
    slug: 'brachiosaurus-altithorax',
    era: 'jurassic',
    diet: 'herbivore',
    region: 'North America',
    length_meters: 26.0,
    description: 'A colossal sauropod dinosaur with disproportionately long forelimbs, giving it a giraffe-like posture to browse tree canopies high above ground.',
  },
  {
    name: 'Coelophysis Bauri',
    slug: 'coelophysis-bauri',
    era: 'triassic',
    diet: 'carnivore',
    region: 'North America',
    length_meters: 3.0,
    description: 'One of the earliest known dinosaur genera. Coelophysis was a slenderly-built bipedal carnivore, exceptionally built for quick pursuit.',
  }
];

const Research = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const eraParam = searchParams.get('era') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const [eraFilter, setEraFilter] = useState(eraParam);
  const [dietFilter, setDietFilter] = useState('all');
  
  const [dinosaurs, setDinosaurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    // Synchronize parameter changes from home dashboard clicks
    setEraFilter(eraParam);
  }, [eraParam]);

  useEffect(() => {
    const loadDinosaurs = async () => {
      setLoading(true);
      try {
        const data = await researchAPI.list({
          search: searchQuery,
          era: eraFilter !== 'all' ? eraFilter : undefined,
          diet: dietFilter !== 'all' ? dietFilter : undefined
        });
        setDinosaurs(data || []);
        setUsingFallback(false);
      } catch (error) {
        console.warn("Backend API not reachable or database unseeded. Deploying local archive fallback.", error);
        // Load fallback dataset
        setDinosaurs(FALLBACK_DINOSAURS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      loadDinosaurs();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, eraFilter, dietFilter]);

  const handleEraSelect = (era) => {
    setEraFilter(era);
    setSearchParams(era !== 'all' ? { era } : {});
  };

  // Local filtering when backend is down/unseeded and we use fallback
  const displayedDinos = usingFallback 
    ? dinosaurs.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              d.region.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEra = eraFilter === 'all' || d.era === eraFilter;
        const matchesDiet = dietFilter === 'all' || d.diet === dietFilter;
        return matchesSearch && matchesEra && matchesDiet;
      })
    : dinosaurs;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 6rem' }}>
      {/* Header section */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title} className="text-gradient">Specimen Encyclopedia</h1>
          <p style={styles.subtitle}>Browse dinosaur database sheets, classifications, and historical fossil logs.</p>
        </div>
        {isAuthenticated && (
          <Link to="/admin?action=new" style={styles.addBtn} className="btn btn-primary">
            <Plus size={18} />
            <span>Register Specimen</span>
          </Link>
        )}
      </div>

      {/* Filter panel */}
      <div className="glass-card" style={styles.filterCard}>
        <div style={styles.searchWrapper}>
          <Search size={18} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search specimen by name, region, characteristics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filtersRow}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}><SlidersHorizontal size={14} /> Period:</span>
            <div style={styles.filterButtons}>
              {['all', 'triassic', 'jurassic', 'cretaceous'].map((era) => (
                <button
                  key={era}
                  onClick={() => handleEraSelect(era)}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: eraFilter === era ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                    borderColor: eraFilter === era ? 'var(--primary-light)' : 'var(--border-color)',
                  }}
                >
                  {era.charAt(0).toUpperCase() + era.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Diet:</span>
            <div style={styles.filterButtons}>
              {['all', 'carnivore', 'herbivore', 'omnivore'].map((diet) => (
                <button
                  key={diet}
                  onClick={() => setDietFilter(diet)}
                  style={{
                    ...styles.filterBtn,
                    backgroundColor: dietFilter === diet ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.03)',
                    borderColor: dietFilter === diet ? 'var(--secondary-light)' : 'var(--border-color)',
                  }}
                >
                  {diet.charAt(0).toUpperCase() + diet.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Database status banner if using fallbacks */}
      {usingFallback && (
        <div style={styles.infoBanner}>
          <Compass size={18} />
          <span>Showing local sandbox specimen archive. The local database server is offline or empty.</span>
        </div>
      )}

      {/* Grid rendering */}
      {loading ? (
        <div style={styles.loaderContainer}>
          <div className="spinner" style={styles.spinner} />
          <p>Analyzing fossil layers...</p>
        </div>
      ) : displayedDinos.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyText}>No fossil records found matching these parameters in the archives.</p>
        </div>
      ) : (
        <div className="grid-cols-3">
          {displayedDinos.map((dino) => (
            <div key={dino.slug || dino.name} className="glass-card" style={styles.dinoCard}>
              <div style={styles.cardHeader}>
                <span className={`era-badge era-${dino.era}`}>{dino.era}</span>
                <span style={styles.dietBadge}>{dino.diet}</span>
              </div>
              <h3 style={styles.dinoName}>{dino.name}</h3>
              <p style={styles.dinoRegion}>Region: {dino.region || 'Unknown'}</p>
              <p style={styles.dinoDesc}>{dino.description}</p>
              <div style={styles.cardFooter}>
                <span style={styles.dinoSize}>Size: {dino.length_meters || '?'}m</span>
                <Link to={`/research/${dino.slug}`} style={styles.dossierBtn} className="btn btn-outline">
                  View Dossier
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  filterCard: {
    marginBottom: '2rem',
    padding: '1.5rem',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
  },
  searchInput: {
    paddingLeft: '40px',
    width: '100%',
  },
  filtersRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    minWidth: '80px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  filterButtons: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: 'var(--text-primary)',
    padding: '0.35rem 0.85rem',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  infoBanner: {
    backgroundColor: 'rgba(217, 119, 6, 0.08)',
    border: '1px solid rgba(217, 119, 6, 0.2)',
    color: 'var(--secondary-light)',
    padding: '0.75rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    gap: '1rem',
    color: 'var(--text-secondary)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(46, 139, 87, 0.1)',
    borderTop: '3px solid var(--primary-light)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '4rem 0',
    backgroundColor: 'var(--bg-surface)',
    border: '1px dashed var(--border-color)',
    borderRadius: '12px',
  },
  emptyText: {
    color: 'var(--text-secondary)',
  },
  dinoCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  dietBadge: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  dinoName: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  dinoRegion: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
  },
  dinoDesc: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
    flexGrow: 1,
    marginBottom: '1.5rem',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1rem',
  },
  dinoSize: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  dossierBtn: {
    padding: '0.35rem 0.75rem',
    fontSize: '0.8rem',
  },
};
export default Research;

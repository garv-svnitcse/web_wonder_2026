import React, { useState, useEffect } from 'react';
import { timelineAPI } from '../services/api';
import { Clock, Landmark, Compass, Award } from 'lucide-react';

const FALLBACK_EVENTS = [
  {
    id: 1,
    year_range: '252 Million Years Ago',
    title: 'The Great Permian Extinction',
    era: 'triassic',
    description: 'Earth\'s most severe extinction event kills 96% of marine species and 70% of terrestrial vertebrates, clearing the ecological stage for the rise of dinosaurs.',
  },
  {
    id: 2,
    year_range: '230 Million Years Ago',
    title: 'Appearance of First Dinosaurs',
    era: 'triassic',
    description: 'Early lightweight dinosaurs like Coelophysis and Herrerasaurus evolve in southern Pangaea, coexisting with large archosaurs.',
  },
  {
    id: 3,
    year_range: '201 Million Years Ago',
    title: 'Triassic-Jurassic Boundary Extinction',
    era: 'triassic',
    description: 'Massive volcanic eruptions rift Pangaea, triggering climate changes that eliminate non-dinosaur competitors, allowing dinosaurs to dominate.',
  },
  {
    id: 4,
    year_range: '180 Million Years Ago',
    title: 'Breakup of Pangaea',
    era: 'jurassic',
    description: 'The supercontinent begins splitting into Laurasia in the north and Gondwana in the south, creating new shorelines and humid tropical climates.',
  },
  {
    id: 5,
    year_range: '155 Million Years Ago',
    title: 'Age of the Giants (Golden Jurassic)',
    era: 'jurassic',
    description: 'Gigantic long-necked sauropods (Brachiosaurus) and heavily armored stegosaurs roam dense tropical evergreen forests.',
  },
  {
    id: 6,
    year_range: '125 Million Years Ago',
    title: 'Rise of Flowering Plants (Angiosperms)',
    era: 'cretaceous',
    description: 'Early angiosperms emerge and diversify rapidly, changing terrestrial food chains and driving insect co-evolution.',
  },
  {
    id: 7,
    year_range: '75 Million Years Ago',
    title: 'Dinosaur Specialization Peak',
    era: 'cretaceous',
    description: 'Tyrannosaurs, Ceratopsians (Triceratops), and Hadrosaurs expand across distinct isolated landmasses with high regional diversity.',
  },
  {
    id: 8,
    year_range: '66 Million Years Ago',
    title: 'Chicxulub Asteroid Impact',
    era: 'cretaceous',
    description: 'A 10km asteroid strikes the Yucatan Peninsula, ending the Mesozoic Era. All non-avian dinosaurs and 75% of global species go extinct.',
  }
];

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEra, setFilterEra] = useState('all');
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await timelineAPI.getEvents();
        setEvents(data || []);
        setUsingFallback(false);
      } catch (err) {
        console.warn("Timeline API unavailable. Using fallback timeline configuration.", err);
        setEvents(FALLBACK_EVENTS);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = filterEra === 'all' 
    ? events 
    : events.filter(e => e.era === filterEra);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title} className="text-gradient">Evolutionary Timeline</h1>
        <p style={styles.subtitle}>Scroll through the key events of the Mesozoic Era, tracking the rise and fall of dinosaurs.</p>
      </div>

      {/* Filter Options */}
      <div style={styles.filterBar}>
        {['all', 'triassic', 'jurassic', 'cretaceous'].map(era => (
          <button
            key={era}
            onClick={() => setFilterEra(era)}
            style={{
              ...styles.filterBtn,
              backgroundColor: filterEra === era ? 'var(--primary)' : 'rgba(255, 255, 255, 0.02)',
              borderColor: filterEra === era ? 'var(--primary-light)' : 'var(--border-color)',
            }}
          >
            {era.charAt(0).toUpperCase() + era.slice(1)} Period
          </button>
        ))}
      </div>

      {usingFallback && (
        <div style={styles.infoBanner}>
          <Compass size={18} />
          <span>Viewing cached geological timeline sequence.</span>
        </div>
      )}

      {loading ? (
        <div style={styles.loader}>
          <div className="spinner" style={styles.spinner} />
          <p>Unearthing fossil layers...</p>
        </div>
      ) : (
        <div style={styles.timelineWrapper}>
          {/* Vertical axis line */}
          <div style={styles.timelineAxis} />

          {/* Timeline points */}
          {filteredEvents.map((evt, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={evt.id} style={{
                ...styles.timelineNode,
                flexDirection: isLeft ? 'row' : 'row-reverse'
              }}>
                {/* Content card */}
                <div style={styles.timelineContentWrapper}>
                  <div className="glass-card" style={styles.eventCard}>
                    <div style={styles.cardHeader}>
                      <span className={`era-badge era-${evt.era}`}>{evt.era}</span>
                      <span style={styles.dateLabel}>{evt.year_range}</span>
                    </div>
                    <h3 style={styles.eventTitle}>{evt.title}</h3>
                    <p style={styles.eventText}>{evt.description}</p>
                  </div>
                </div>

                {/* Node circle on axis */}
                <div style={styles.axisDot}>
                  <div style={{
                    ...styles.innerAxisDot,
                    backgroundColor: evt.era === 'triassic' ? '#fbbf24' : evt.era === 'jurassic' ? '#34d399' : '#fb7185'
                  }} />
                </div>

                {/* Empty block for layout balancing on desktop */}
                <div style={styles.desktopSpacer} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '800',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.05rem',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    padding: '0.5rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  infoBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    padding: '0.75rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
    maxWidth: '600px',
    margin: '0 auto 3rem',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
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
  timelineWrapper: {
    position: 'relative',
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 0',
  },
  timelineAxis: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: '2px',
    backgroundColor: 'var(--border-color)',
    transform: 'translateX(-50%)',
  },
  timelineNode: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '3rem',
    position: 'relative',
  },
  timelineContentWrapper: {
    width: '45%',
  },
  eventCard: {
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  dateLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  eventTitle: {
    fontSize: '1.2rem',
    color: 'var(--text-primary)',
    marginBottom: '0.75rem',
  },
  eventText: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
  },
  axisDot: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-base)',
    border: '2px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  innerAxisDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  desktopSpacer: {
    width: '45%',
  },
};

// Handle mobile responsiveness stylesheet injection for timeline layout collapse
const cssResponsiveTimeline = `
@media (max-width: 768px) {
  div[style*="timelineAxis"] {
    left: 20px !important;
  }
  div[style*="timelineNode"] {
    flex-direction: row-reverse !important;
    align-items: flex-start !important;
  }
  div[style*="timelineContentWrapper"] {
    width: calc(100% - 40px) !important;
    padding-left: 20px;
  }
  div[style*="axisDot"] {
    left: 20px !important;
  }
  div[style*="desktopSpacer"] {
    display: none !important;
  }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cssResponsiveTimeline));
  document.head.appendChild(style);
}

export default Timeline;

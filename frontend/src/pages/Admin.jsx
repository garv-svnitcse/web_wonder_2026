import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { communityAPI, researchAPI } from '../services/api';
import { Check, Trash, Plus, ShieldAlert, FileText, Compass, AlertCircle } from 'lucide-react';

const FALLBACK_PENDING_DISCOVERIES = [
  {
    id: 101,
    title: 'Theropod Tooth (cf. Albertosaurus)',
    finder: 'FossilChaser_00',
    location: 'Alberta, Canada (Horseshoe Canyon)',
    details: 'Recovered a blade-like serrated tooth. Length measures 4.5cm. Serrations align cleanly with tyrannosaurid albertosaurine denticles.',
    status: 'pending'
  },
  {
    id: 102,
    title: 'Sauropod Vertebra Fragment',
    finder: 'GeoBob',
    location: 'Colorado, USA (Morrison Formation)',
    details: 'Heavily weathered neural arch fragment found in sandstone float. Likely from a Diplodocus or Camarasaurus based on bone texture and weight.',
    status: 'pending'
  }
];

const Admin = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // New Dinosaur form state
  const [dinoForm, setDinoForm] = useState({
    name: '',
    scientific_name: '',
    era: 'jurassic',
    diet: 'herbivore',
    region: '',
    length_meters: '',
    weight_kg: '',
    description: '',
    habitat: '',
    key_fact: ''
  });
  
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPendingDiscoveries = async () => {
      setLoading(true);
      try {
        const data = await communityAPI.getPendingDiscoveries();
        setPending(data || []);
        setUsingFallback(false);
      } catch (err) {
        console.warn("Moderation API desk offline. Loading cached sandbox queues.", err);
        setPending(FALLBACK_PENDING_DISCOVERIES);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingDiscoveries();
  }, []);

  const handleApprove = async (id) => {
    try {
      if (!usingFallback) {
        await communityAPI.approveDiscovery(id);
      }
      setPending(prev => prev.filter(item => item.id !== id));
      setMessage(`Fossil finding record #${id} approved successfully!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not approve discovery on backend.");
    }
  };

  const handleReject = (id) => {
    setPending(prev => prev.filter(item => item.id !== id));
    setMessage(`Discovery record #${id} dismissed.`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDinoSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    if (!dinoForm.name || !dinoForm.description) {
      setErrorMessage("Specimen designation name and description are mandatory.");
      return;
    }

    try {
      const slug = dinoForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const dataPayload = {
        ...dinoForm,
        slug,
        length_meters: parseFloat(dinoForm.length_meters) || 0,
        weight_kg: parseFloat(dinoForm.weight_kg) || 0,
        key_facts: dinoForm.key_fact ? [dinoForm.key_fact] : []
      };

      if (!usingFallback) {
        await researchAPI.create(dataPayload);
      }

      setMessage(`New Specimen "${dinoForm.name}" registered successfully under slug "${slug}"!`);
      setDinoForm({
        name: '',
        scientific_name: '',
        era: 'jurassic',
        diet: 'herbivore',
        region: '',
        length_meters: '',
        weight_kg: '',
        description: '',
        habitat: '',
        key_fact: ''
      });
      setTimeout(() => navigate('/research'), 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.detail || "Could not save species to database.");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setDinoForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <div className="spinner" style={styles.spinner} />
        <p style={{ color: 'var(--text-secondary)' }}>Mounting secure admin terminal...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 6rem' }}>
      
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldAlert size={28} color="var(--accent-light)" />
          <h1 style={styles.title} className="text-gradient">Curation Moderation Panel</h1>
        </div>
        <p style={styles.subtitle}>Validate fossil discovery submittals and catalog new dinosaur species.</p>
      </div>

      {message && (
        <div style={styles.successBanner}>
          <Check size={18} />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div style={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {usingFallback && (
        <div style={styles.infoBanner}>
          <Compass size={18} />
          <span>Vetting mock entries locally. Database write commands will bypass standard backend authentication.</span>
        </div>
      )}

      <div style={styles.grid}>
        {/* Submissions list */}
        <div style={styles.submissionsCol}>
          <h2 style={styles.sectionTitle}>Discovery Verification Queue</h2>
          {pending.length === 0 ? (
            <div style={styles.emptyCard}>
              <p>All discovery logs are validated. Verification queue is empty.</p>
            </div>
          ) : (
            <div style={styles.pendingList}>
              {pending.map(item => (
                <div key={item.id} className="glass-card" style={styles.pendingCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.meta}>Logged by: @{item.finder}</span>
                    <span style={styles.meta}>{item.location}</span>
                  </div>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.details}>{item.details}</p>
                  
                  <div style={styles.cardActions}>
                    <button onClick={() => handleApprove(item.id)} style={styles.approveBtn} className="btn btn-primary">
                      <Check size={16} />
                      <span>Approve</span>
                    </button>
                    <button onClick={() => handleReject(item.id)} style={styles.rejectBtn} className="btn btn-outline">
                      <Trash size={16} />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Specimen creation form */}
        <div style={styles.formCol}>
          <div className="glass-card" style={styles.formCard}>
            <h2 style={{ ...styles.sectionTitle, marginBottom: '1.5rem' }}>
              <Plus size={18} color="var(--primary-light)" style={{ marginRight: '0.5rem' }} />
              Register Species Specimen
            </h2>
            
            <form onSubmit={handleDinoSubmit}>
              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Specimen Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Brachiosaurus"
                    value={dinoForm.name}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Scientific Classification</label>
                  <input
                    type="text"
                    name="scientific_name"
                    placeholder="e.g. Brachiosaurus altithorax"
                    value={dinoForm.scientific_name}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Geological Period</label>
                  <select
                    name="era"
                    value={dinoForm.era}
                    onChange={handleFormChange}
                    className="form-input"
                    style={{ background: 'var(--bg-surface-elevated)' }}
                  >
                    <option value="triassic">Triassic Period</option>
                    <option value="jurassic">Jurassic Period</option>
                    <option value="cretaceous">Cretaceous Period</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Diet Adaptation</label>
                  <select
                    name="diet"
                    value={dinoForm.diet}
                    onChange={handleFormChange}
                    className="form-input"
                    style={{ background: 'var(--bg-surface-elevated)' }}
                  >
                    <option value="herbivore">Herbivorous</option>
                    <option value="carnivore">Carnivorous</option>
                    <option value="omnivore">Omnivorous</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Length (meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="length_meters"
                    placeholder="e.g. 26.0"
                    value={dinoForm.length_meters}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight_kg"
                    placeholder="e.g. 56000"
                    value={dinoForm.weight_kg}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Discovery Origin Region</label>
                <input
                  type="text"
                  name="region"
                  placeholder="e.g. Colorado, North America"
                  value={dinoForm.region}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Environmental Habitat</label>
                <input
                  type="text"
                  name="habitat"
                  placeholder="e.g. Tall conifer gallery forests and river banks"
                  value={dinoForm.habitat}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specimen Dossier Summary</label>
                <textarea
                  name="description"
                  required
                  rows="4"
                  placeholder="Enter detailed paleontological description..."
                  value={dinoForm.description}
                  onChange={handleFormChange}
                  className="form-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Structural Fact</label>
                <input
                  type="text"
                  name="key_fact"
                  placeholder="e.g. Disproportionately long forelimbs compared to hindlimbs."
                  value={dinoForm.key_fact}
                  onChange={handleFormChange}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Create Specimen Entry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
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
  header: {
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
  successBanner: {
    backgroundColor: 'rgba(27, 94, 52, 0.15)',
    border: '1px solid rgba(27, 94, 52, 0.3)',
    color: '#34d399',
    padding: '0.75rem 1.2rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  errorBanner: {
    backgroundColor: 'rgba(159, 12, 57, 0.15)',
    border: '1px solid rgba(159, 12, 57, 0.3)',
    color: '#fb7185',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
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
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '4.5fr 5.5fr',
    gap: '3rem',
  },
  submissionsCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: 'var(--bg-surface)',
    border: '1px dashed var(--border-color)',
    borderRadius: '12px',
    padding: '2.5rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  pendingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  pendingCard: {
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '0.5rem',
  },
  meta: {
    fontWeight: '500',
  },
  itemTitle: {
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  details: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
  },
  cardActions: {
    display: 'flex',
    gap: '1rem',
  },
  approveBtn: {
    padding: '0.45rem 1rem',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  rejectBtn: {
    padding: '0.45rem 1rem',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    padding: '2rem',
  },
  formRow: {
    display: 'flex',
    gap: '1rem',
  },
};

const cssResponsiveAdmin = `
@media (max-width: 768px) {
  div[style*="grid"] {
    grid-template-columns: 1fr !important;
    gap: 3rem !important;
  }
  div[style*="formRow"] {
    flex-direction: column !important;
    gap: 0 !important;
  }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cssResponsiveAdmin));
  document.head.appendChild(style);
}

export default Admin;

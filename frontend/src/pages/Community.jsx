import React, { useState, useEffect } from 'react';
import { communityAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, MapPin, Compass, Image, Send, CheckCircle, Eye, ShieldAlert } from 'lucide-react';

const FALLBACK_DISCUSSIONS = [
  {
    id: 1,
    title: 'Tips for distinguishing Theropod fossil teeth?',
    author: 'RexFinder99',
    timestamp: '2 hours ago',
    content: 'Hey everyone, I am currently cataloging teeth specimens from a Cretaceous matrix sample. What are your key morphological metrics to separate standard dromaeosaurid tooth forms from tyrannosaurid hatchling teeth?',
    replies: 5
  },
  {
    id: 2,
    title: 'Exploring the Morrison Formation next month',
    author: 'DrGrant_Dino',
    timestamp: 'Yesterday',
    content: 'Our team is preparing for a geological survey expedition in Utah. We will be logging dinosaur occurrence clusters and checking outcrop structures. Anyone interested in reading our field diary logs?',
    replies: 12
  }
];

const FALLBACK_DISCOVERIES = [
  {
    id: 1,
    title: 'Theropod Claws (Dromaeosauridae)',
    finder: 'Sattler_Bio',
    location: 'Montana, USA (Hell Creek Formation)',
    details: 'Discovered a partial digit claw measuring roughly 6cm. The curvature and articular structure point strongly to a mid-sized velociraptorine dromaeosaurid.',
    status: 'approved',
    imagePlaceholder: '🦖'
  },
  {
    id: 2,
    title: 'Hadrosaurid Jaw Section',
    finder: 'DinoKid_90',
    location: 'Alberta, Canada (Dinosaur Park Formation)',
    details: 'Uncovered a fragmentary dentary bone showing remnants of nested tooth batteries. Specimen has been transported to the regional preservation facility.',
    status: 'approved',
    imagePlaceholder: '🦴'
  }
];

const Community = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState('forum'); // forum | discoveries
  const [discussions, setDiscussions] = useState([]);
  const [discoveries, setDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Forms state
  const [forumForm, setForumForm] = useState({ title: '', content: '' });
  const [discoveryForm, setDiscoveryForm] = useState({ title: '', location: '', details: '' });
  const [actionMessage, setActionMessage] = useState('');
  
  useEffect(() => {
    const loadCommunityData = async () => {
      setLoading(true);
      try {
        const posts = await communityAPI.getPosts();
        // Assume backend returns both or just general list
        setDiscussions(posts.discussions || FALLBACK_DISCUSSIONS);
        setDiscoveries(posts.discoveries || FALLBACK_DISCOVERIES);
        setUsingFallback(false);
      } catch (err) {
        console.warn("Community channels offline. Using fallback database registries.", err);
        setDiscussions(FALLBACK_DISCUSSIONS);
        setDiscoveries(FALLBACK_DISCOVERIES);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };
    loadCommunityData();
  }, []);

  const handlePostForum = async (e) => {
    e.preventDefault();
    if (!forumForm.title || !forumForm.content) return;
    
    try {
      const newPost = {
        title: forumForm.title,
        content: forumForm.content,
        author: 'You',
        timestamp: 'Just now',
        replies: 0
      };

      if (!usingFallback) {
        await communityAPI.createPost(newPost);
      }
      
      setDiscussions(prev => [newPost, ...prev]);
      setForumForm({ title: '', content: '' });
      setActionMessage('Your discussion thread has been launched!');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostDiscovery = async (e) => {
    e.preventDefault();
    if (!discoveryForm.title || !discoveryForm.location || !discoveryForm.details) return;

    try {
      const newDiscovery = {
        id: Date.now(),
        title: discoveryForm.title,
        finder: 'You',
        location: discoveryForm.location,
        details: discoveryForm.details,
        status: isAdmin ? 'approved' : 'pending', // Admins bypass validation flow
        imagePlaceholder: '🦴'
      };

      if (!usingFallback) {
        await communityAPI.submitDiscovery(newDiscovery);
      }

      if (isAdmin || usingFallback) {
        setDiscoveries(prev => [newDiscovery, ...prev]);
      }

      setDiscoveryForm({ title: '', location: '', details: '' });
      setActionMessage(
        isAdmin 
          ? 'Discovery published directly to the database.' 
          : 'Discovery logged successfully! It is queued in the Admin moderation log for scientific review.'
      );
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={styles.loader}>
        <div className="spinner" style={styles.spinner} />
        <p style={{ color: 'var(--text-secondary)' }}>Retrieving communication boards...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem 6rem' }}>
      
      {usingFallback && (
        <div style={styles.infoBanner}>
          <Compass size={18} />
          <span>Running locally on mock data. Post and discovery submissions will be stored in active memory.</span>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => { setActiveTab('forum'); setActionMessage(''); }}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === 'forum' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'forum' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <MessageSquare size={16} />
          <span>Forum Discussions</span>
        </button>
        <button 
          onClick={() => { setActiveTab('discoveries'); setActionMessage(''); }}
          style={{
            ...styles.tabBtn,
            backgroundColor: activeTab === 'discoveries' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'discoveries' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <MapPin size={16} />
          <span>Fossil Discovery Logs</span>
        </button>
      </div>

      {actionMessage && (
        <div style={styles.successBanner}>
          <CheckCircle size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      <div style={styles.contentGrid}>
        {/* Left side list rendering */}
        <div style={styles.listCol}>
          {activeTab === 'forum' ? (
            /* Forum Discussions List */
            <div style={styles.listContainer}>
              <h2 style={styles.sectionTitle}>Recent Discussions</h2>
              {discussions.map(post => (
                <div key={post.id || post.title} className="glass-card" style={styles.forumCard}>
                  <div style={styles.cardHeader}>
                    <span style={styles.author}>Logged by: @{post.author}</span>
                    <span style={styles.time}>{post.timestamp}</span>
                  </div>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <p style={styles.postText}>{post.content}</p>
                  <div style={styles.cardFooter}>
                    <span style={styles.repliesCount}>{post.replies} responses</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Discoveries Logs List */
            <div style={styles.listContainer}>
              <h2 style={styles.sectionTitle}>Published Field Discoveries</h2>
              {discoveries.map(disc => (
                <div key={disc.id} className="glass-card" style={styles.discoveryCard}>
                  <div style={styles.discoveryVisual}>
                    <span style={styles.dinoEmoji}>{disc.imagePlaceholder}</span>
                  </div>
                  <div style={styles.discoveryContent}>
                    <div style={styles.cardHeader}>
                      <span style={styles.author}>Submitted by: @{disc.finder}</span>
                      <span className="era-badge era-jurassic" style={styles.verifiedBadge}>Approved Specimen</span>
                    </div>
                    <h3 style={styles.discoveryTitle}>{disc.title}</h3>
                    <p style={styles.discoveryLoc}><MapPin size={12} /> {disc.location}</p>
                    <p style={styles.discoveryDetails}>{disc.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side form submission */}
        <div style={styles.formCol}>
          <div className="glass-card" style={styles.formCard}>
            {activeTab === 'forum' ? (
              /* Forum Post Submission */
              <form onSubmit={handlePostForum}>
                <h3 style={styles.formTitle}>Initiate Discussion</h3>
                <p style={styles.formSub}>Engage with other explorers on paleontology and fossil finds.</p>
                
                {isAuthenticated ? (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="title">Thread Topic</label>
                      <input
                        type="text"
                        id="title"
                        required
                        placeholder="e.g. Identification question regarding Morrison shale..."
                        value={forumForm.title}
                        onChange={(e) => setForumForm(prev => ({ ...prev, title: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="content">Topic Explanation / Details</label>
                      <textarea
                        id="content"
                        required
                        rows="5"
                        placeholder="Provide details about your query or study points..."
                        value={forumForm.content}
                        onChange={(e) => setForumForm(prev => ({ ...prev, content: e.target.value }))}
                        className="form-input"
                        style={styles.textarea}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={styles.submitBtn}>
                      <Send size={16} />
                      <span>Transmit Post</span>
                    </button>
                  </>
                ) : (
                  <div style={styles.authLock}>
                    <p>You must authenticate to write discussion topics.</p>
                  </div>
                )}
              </form>
            ) : (
              /* Discovery Submission */
              <form onSubmit={handlePostDiscovery}>
                <h3 style={styles.formTitle}>Submit Field Finding</h3>
                <p style={styles.formSub}>Log discovered specimens. Submissions are vetted by administrators before publication.</p>
                
                {isAuthenticated ? (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="discTitle">Specimen Target Classification</label>
                      <input
                        type="text"
                        id="discTitle"
                        required
                        placeholder="e.g. Partial Theropod Metatarsal Bone"
                        value={discoveryForm.title}
                        onChange={(e) => setDiscoveryForm(prev => ({ ...prev, title: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="discLoc">Discovery GPS Coordinates / Formation Location</label>
                      <input
                        type="text"
                        id="discLoc"
                        required
                        placeholder="e.g. Wyoming, USA (Morrison Formation)"
                        value={discoveryForm.location}
                        onChange={(e) => setDiscoveryForm(prev => ({ ...prev, location: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="discDetails">Matrix Characteristics and Specimen Details</label>
                      <textarea
                        id="discDetails"
                        required
                        rows="4"
                        placeholder="Detail dimensions, coloration, matrix rock, preservation conditions..."
                        value={discoveryForm.details}
                        onChange={(e) => setDiscoveryForm(prev => ({ ...prev, details: e.target.value }))}
                        className="form-input"
                        style={styles.textarea}
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary" style={styles.submitBtn}>
                      <Image size={16} />
                      <span>File Discovery Report</span>
                    </button>
                  </>
                ) : (
                  <div style={styles.authLock}>
                    <p>You must authenticate to log excavation specimens.</p>
                  </div>
                )}
              </form>
            )}
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
  tabsContainer: {
    display: 'inline-flex',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '0.35rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    marginBottom: '3rem',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.25rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  successBanner: {
    backgroundColor: 'rgba(27, 94, 52, 0.15)',
    border: '1px solid rgba(27, 94, 52, 0.3)',
    color: '#34d399',
    padding: '0.75rem 1.2rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '6.5fr 3.5fr',
    gap: '3rem',
  },
  listCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  forumCard: {
    padding: '1.5rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '0.75rem',
  },
  author: {
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  postTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.75rem',
    color: 'var(--text-primary)',
  },
  postText: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
    marginBottom: '1rem',
  },
  repliesCount: {
    fontSize: '0.8rem',
    color: 'var(--primary-light)',
    fontWeight: '500',
  },
  discoveryCard: {
    display: 'flex',
    padding: '1.5rem',
    gap: '1.5rem',
    alignItems: 'flex-start',
  },
  discoveryVisual: {
    flexShrink: 0,
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    backgroundColor: '#0c1115',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dinoEmoji: {
    fontSize: '2rem',
  },
  discoveryContent: {
    flexGrow: 1,
  },
  discoveryTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.25rem',
  },
  discoveryLoc: {
    fontSize: '0.8rem',
    color: 'var(--secondary-light)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginBottom: '0.75rem',
  },
  discoveryDetails: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: 'var(--text-secondary)',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(46, 139, 87, 0.1)',
    color: '#34d399',
    fontSize: '0.7rem',
    border: '1px solid rgba(46, 139, 87, 0.2)',
  },
  formCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  formCard: {
    padding: '1.5rem',
    position: 'sticky',
    top: '100px',
  },
  formTitle: {
    fontSize: '1.25rem',
    marginBottom: '0.25rem',
  },
  formSub: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
    lineHeight: '1.4',
  },
  textarea: {
    resize: 'none',
  },
  submitBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  authLock: {
    textAlign: 'center',
    padding: '2rem 1rem',
    backgroundColor: 'rgba(0,0,0,0.1)',
    border: '1px dashed var(--border-color)',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
};

// Handle responsive layout queries collapse
const cssResponsiveCommunity = `
@media (max-width: 768px) {
  div[style*="contentGrid"] {
    grid-template-columns: 1fr !important;
    gap: 3rem !important;
  }
  div[style*="formCard"] {
    position: static !important;
  }
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(cssResponsiveCommunity));
  document.head.appendChild(style);
}

export default Community;

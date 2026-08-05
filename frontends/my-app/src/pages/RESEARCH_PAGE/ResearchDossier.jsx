import { API_URL } from "../../config/api";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import GlassAuthModal from "../../components/GlassAuthModal";
import {
  FaArrowLeft,
  FaEye,
  FaComment,
  FaBookmark,
  FaCalendar,
} from "react-icons/fa";
import { database } from "./researchData";
import ParticleBackground from "./ParticleBackground";
import "./Research.css";

export default function ResearchDossier() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const getStoredToken = () => {
    const val = localStorage.getItem('access_token');
    if (!val) return '';
    const clean = val.trim();
    const parts = clean.split('.');
    if (parts.length !== 3) {
      return '';
    }
    return clean;
  };
  const [token, setToken] = useState(getStoredToken());
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    async function loadDossier() {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/research/${encodeURIComponent(slug)}`);
        if (response.ok) {
          const data = await response.json();
          if (active) {
            setItem(data);
            if (data.comments) {
              setComments(data.comments);
            }
          }
        } else {
          const fallback = database.find((d) => d.slug === slug || d.title === slug);
          if (active) {
            setItem(fallback);
          }
        }
      } catch (err) {
        console.warn("Failed to load dossier from backend:", err);
        const fallback = database.find((d) => d.slug === slug || d.title === slug);
        if (active) {
          setItem(fallback);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadDossier();
    return () => {
      active = false;
    };
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!item?.title || !author.trim() || !commentText.trim()) return;
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/research/${encodeURIComponent(item.title)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: item.title,
          author: author.trim(),
          text: commentText.trim(),
        }),
      });
      if (response.ok) {
        setCommentText("");
        const res = await fetch(`${API_URL}/research/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.comments) {
            setComments(data.comments);
          }
        }
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: "#050705", minHeight: "100vh" }}>
        <Navbar isLoggedIn={!!token} />
        <section
          className="research"
          style={{ position: "relative", overflow: "hidden", paddingTop: "140px" }}
        >
          <ParticleBackground />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              padding: "150px 20px",
            }}
          >
            <h2 style={{ color: "#ECE4D8", fontFamily: "Cinzel, serif" }}>
              Retrieving Dossier...
            </h2>
          </div>
        </section>
        <Footer />
        {!token && (
          <GlassAuthModal
            isOpen={true}
            onClose={() => navigate('/research')}
            onAuthSuccess={(newToken) => setToken(newToken)}
          />
        )}
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ background: "#050705", minHeight: "100vh" }}>
        <Navbar isLoggedIn={!!token} />
        <section
          className="research"
          style={{ position: "relative", overflow: "hidden", paddingTop: "140px" }}
        >
          <ParticleBackground />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              padding: "150px 20px",
            }}
          >
            <h2 style={{ color: "#ECE4D8", fontFamily: "Cinzel, serif" }}>
              Dossier Not Found
            </h2>
            <Link
              to="/research"
              className="researchButton"
              style={{
                display: "inline-flex",
                width: "auto",
                padding: "16px 32px",
                marginTop: "24px",
              }}
            >
              <FaArrowLeft /> Back to Research Hub
            </Link>
          </div>
        </section>
        <Footer />
        {!token && (
          <GlassAuthModal
            isOpen={true}
            onClose={() => navigate('/research')}
            onAuthSuccess={(newToken) => setToken(newToken)}
          />
        )}
      </div>
    );
  }

  const statusClass =
    item.status?.toLowerCase() === "approved" ? "rcBadge-approved" : "rcBadge-pending";

  return (
    <div style={{ background: "#050705", minHeight: "100vh" }}>
      <Navbar isLoggedIn={!!token} />
      <section
        className="research"
        style={{ position: "relative", overflow: "hidden", paddingTop: "140px" }}
      >
        <ParticleBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="dossierWrap">
            <Link to="/research" className="dossierBack">
              <FaArrowLeft /> Back to Research Hub
            </Link>

            <div className="dossierHero">
              <img src={item.image} alt={item.title} />
              <div className="dossierHeroOverlay">
                <span className={`rcBadge ${statusClass}`}>
                  {item.status?.toUpperCase()}
                </span>
                <span className="rcEraBadge">{item.era}</span>
              </div>
            </div>

            <div className="dossierBody">
              <h1 className="dossierTitle">{item.title}</h1>

              <div className="dossierMetaRow">
                <div className="dossierScientistInline">
                  <img src={item.scientist?.avatar} alt={item.scientist?.name} />
                  <div>
                    <p className="rcScientistName">{item.scientist?.name}</p>
                    <p className="rcScientistRole">{item.scientist?.role}</p>
                  </div>
                </div>

                <div className="dossierStatsInline">
                  <span>
                    <FaCalendar /> {item.date}
                  </span>
                  <span>
                    <FaEye /> {item.views}
                  </span>
                  <span>
                    <FaComment /> {comments.length || item.comments}
                  </span>
                  <FaBookmark className="rcBookmark" />
                </div>
              </div>

              <div className="dossierQuickFacts">
                <div>
                  <h5>Diet</h5>
                  <p>{item.diet}</p>
                </div>
                <div>
                  <h5>Threat Level</h5>
                  <p>{item.threat}</p>
                </div>
                <div>
                  <h5>Era</h5>
                  <p>{item.era}</p>
                </div>
              </div>

              <div className="dossierContent">
                <h3>Abstract</h3>
                <p>{item.fullContent}</p>
              </div>

              {/* Dossier Discussion / Comments Section */}
              <div className="dossierCommentsSection">
                <h3 className="commentsHeading">
                  Dossier Discussion <span>{comments.length}</span>
                </h3>

                <div className="commentsList">
                  {comments.length === 0 ? (
                    <p className="noComments">No observations recorded on this dossier yet. Be the first to share your findings!</p>
                  ) : (
                    comments.map((comment) => (
                      <div className="commentItem" key={comment._id}>
                        <div className="commentHeader">
                          <div className="commentMeta">
                            <img
                              src={`https://i.pravatar.cc/100?u=${encodeURIComponent(comment.author)}`}
                              alt={comment.author}
                              className="commentAvatar"
                            />
                            <div>
                              <p className="commentAuthor">{comment.author}</p>
                              <span className="commentDate">
                                {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="commentText">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {item.status?.toLowerCase() === "approved" ? (
                  <form onSubmit={handleCommentSubmit} className="addCommentForm">
                    <h4>Record Observation</h4>
                    <div className="formGroup">
                      <label htmlFor="author-input">Scientist Name / Explorer Name</label>
                      <input
                        id="author-input"
                        type="text"
                        required
                        className="formInput"
                        placeholder="Enter your name..."
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor="comment-text-input">Observations & Notes</label>
                      <textarea
                        id="comment-text-input"
                        rows={4}
                        required
                        className="formTextarea"
                        placeholder="Write your research notes, observations, or feedback here..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                    </div>
                    <button type="submit" disabled={submitting} className="submitCommentBtn">
                      {submitting ? "Publishing Note..." : "Publish Observation"}
                    </button>
                  </form>
                ) : (
                  <div className="commentLockedMessage" style={{ padding: '20px', background: 'rgba(236, 228, 216, 0.05)', borderRadius: '8px', border: '1px dashed rgba(236, 228, 216, 0.2)', textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: '#ECE4D8', opacity: 0.7, fontSize: '0.95rem', margin: 0 }}>
                      Observations and discussions are locked until this research dossier has been fully approved by the archive council.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      {!token && (
        <GlassAuthModal
          isOpen={true}
          onClose={() => navigate('/research')}
          onAuthSuccess={(newToken) => setToken(newToken)}
        />
      )}
    </div>
  );
}

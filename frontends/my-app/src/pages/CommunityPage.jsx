import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import GlassAuthModal from "../components/GlassAuthModal";
import {
  FaArrowUp,
  FaArrowDown,
  FaComment,
  FaShareAlt,
  FaPlus,
  FaSearch,
  FaTimes,
  FaCheck,
  FaFire,
  FaClock,
  FaTags,
  FaReply,
  FaWifi
} from "react-icons/fa";
import "./CommunityPage.css";

export default function CommunityPage() {
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sorting & Search
  const [sortBy, setSortBy] = useState("popular"); // 'popular' | 'latest'
  const [searchQuery, setSearchQuery] = useState("");

  // WebSocket Live Connection State
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef(null);

  // Create Post Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    author: "",
    author_role: "Field Explorer"
  });
  const [submittingPost, setSubmittingPost] = useState(false);

  // Active Expanded Comment Post ID
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState(null);
  const [postCommentsMap, setPostCommentsMap] = useState({});
  const [commentInputMap, setCommentInputMap] = useState({});
  const [replyingToMap, setReplyingToMap] = useState({}); // { [postId]: { commentId, author } }
  const [submittingCommentId, setSubmittingCommentId] = useState(null);

  // Copy share toast notification
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // -------------------------------------------------------------------
  // FETCH POSTS
  // -------------------------------------------------------------------
  const fetchPosts = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      let url = `/api/community/posts?sort=${sortBy}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.warn("Failed to fetch community posts:", err);
      setError("Unable to load community posts from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [sortBy, token]);

  // -------------------------------------------------------------------
  // WEBSOCKET REAL-TIME CONNECTION
  // -------------------------------------------------------------------
  useEffect(() => {
    if (!token) return;
    let ws;
    let reconnectTimer;

    function connectWebSocket() {
      try {
        ws = new WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/community/ws`);
        wsRef.current = ws;

        ws.onopen = () => {
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleWsMessage(message);
          } catch (e) {
            console.warn("WebSocket parse error:", e);
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          reconnectTimer = setTimeout(connectWebSocket, 4000);
        };

        ws.onerror = () => {
          setWsConnected(false);
        };
      } catch (err) {
        console.warn("WebSocket initialization error:", err);
      }
    }

    connectWebSocket();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  // Handle Live WebSocket Events
  const handleWsMessage = (msg) => {
    if (!msg || !msg.type) return;

    if (msg.type === "NEW_POST" || msg.type === "New post") {
      setPosts((prev) => {
        if (prev.some((p) => p.id === msg.post.id)) return prev;
        return [msg.post, ...prev];
      });
      showToast(`📢 New post by ${msg.post.author || "an explorer"}!`);
    } else if (msg.type === "VOTE_POST" || msg.type === "Vote post") {
      setPosts((prev) =>
        prev.map((p) => (p.id === msg.post_id ? { ...p, votes: msg.votes } : p))
      );
    } else if (msg.type === "NEW_COMMENT" || msg.type === "New comment") {
      // Update comment count on post card
      setPosts((prev) =>
        prev.map((p) =>
          p.id === msg.post_id ? { ...p, comment_count: msg.comment_count } : p
        )
      );

      // Insert new comment/reply into tree if drawer is open
      setPostCommentsMap((prevMap) => {
        const currentThread = prevMap[msg.post_id];
        if (!currentThread) return prevMap;

        const newComment = msg.comment;
        // Check if comment is parent or reply
        if (!newComment.parent_id) {
          if (currentThread.some((c) => c.id === newComment.id)) return prevMap;
          return { ...prevMap, [msg.post_id]: [...currentThread, newComment] };
        } else {
          // Helper to recursively insert reply
          const insertReply = (nodes) => {
            return nodes.map((node) => {
              if (node.id === newComment.parent_id) {
                if ((node.replies || []).some((r) => r.id === newComment.id)) return node;
                return { ...node, replies: [...(node.replies || []), newComment] };
              }
              if (node.replies && node.replies.length > 0) {
                return { ...node, replies: insertReply(node.replies) };
              }
              return node;
            });
          };
          return { ...prevMap, [msg.post_id]: insertReply(currentThread) };
        }
      });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  // Upvote / Downvote Post
  const handleVote = async (postId, direction) => {
    // Optimistic local update
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId ? { ...p, votes: (p.votes || p.vote || 0) + direction } : p
      )
    );

    try {
      await fetch(`/api/community/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
    } catch (err) {
      console.warn("Failed to vote:", err);
    }
  };

  // Toggle Comment Drawer & Load Comments
  const handleToggleComments = async (postId) => {
    if (expandedCommentsPostId === postId) {
      setExpandedCommentsPostId(null);
      return;
    }

    setExpandedCommentsPostId(postId);
    if (!postCommentsMap[postId]) {
      try {
        const res = await fetch(`/api/community/posts/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setPostCommentsMap((prev) => ({
            ...prev,
            [postId]: data.comments_list || data.comment_list || [],
          }));
        }
      } catch (err) {
        console.warn("Failed to fetch post comments:", err);
      }
    }
  };

  // Set Reply Context for a Specific Comment
  const handleStartReply = (postId, commentId, author) => {
    setReplyingToMap((prev) => ({
      ...prev,
      [postId]: { commentId, author },
    }));
  };

  const handleCancelReply = (postId) => {
    setReplyingToMap((prev) => ({
      ...prev,
      [postId]: null,
    }));
  };

  // Submit Comment / Reply
  const handleAddComment = async (postId) => {
    const text = commentInputMap[postId] || "";
    if (!text.trim()) return;

    const replyContext = replyingToMap[postId];

    setSubmittingCommentId(postId);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text.trim(),
          author: "Explorer",
          parent_id: replyContext ? replyContext.commentId : null,
          reply_to: replyContext ? replyContext.author : null,
          reply_to_author: replyContext ? replyContext.author : null,
        }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        
        // Local state update helper
        setPostCommentsMap((prevMap) => {
          const currentThread = prevMap[postId] || [];
          if (!replyContext) {
            return { ...prevMap, [postId]: [...currentThread, addedComment] };
          } else {
            const insertReply = (nodes) => {
              return nodes.map((node) => {
                if (node.id === replyContext.commentId) {
                  return { ...node, replies: [...(node.replies || []), addedComment] };
                }
                if (node.replies && node.replies.length > 0) {
                  return { ...node, replies: insertReply(node.replies) };
                }
                return node;
              });
            };
            return { ...prevMap, [postId]: insertReply(currentThread) };
          }
        });

        setCommentInputMap((prev) => ({ ...prev, [postId]: "" }));
        setReplyingToMap((prev) => ({ ...prev, [postId]: null }));
        showToast(replyContext ? `Reply to @${replyContext.author} sent!` : "Comment published!");
      }
    } catch (err) {
      alert("Failed to submit comment.");
    } finally {
      setSubmittingCommentId(null);
    }
  };

  // Submit New Community Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("Please fill in both the title and post content.");
      return;
    }

    setSubmittingPost(true);
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewPost({
          title: "",
          content: "",
          flair: "Fossil Finds",
          author: "",
          author_role: "Field Explorer"
        });
        showToast("Post published to Public Community!");
      } else {
        const errData = await res.json();
        alert(errData.detail || "Failed to create post.");
      }
    } catch (err) {
      alert("Network error. Unable to connect to server.");
    } finally {
      setSubmittingPost(false);
    }
  };

  // Recursive Comment Node Component
  const renderCommentTree = (comment, postId, depth = 0) => {
    return (
      <div key={comment.id} className={`commentItem ${depth > 0 ? "commentReplyNode" : ""}`}>
        <div className="commentAuthorRow">
          <div className="cAuthorBox">
            <span className="cAuthor">{comment.author || "Explorer"}</span>
            {(comment.reply_to_author || comment.reply_to) && (
              <span className="replyTag">replying to @{comment.reply_to_author || comment.reply_to}</span>
            )}
          </div>
          <span className="cTime">{comment.createdAt}</span>
        </div>
        <p className="cText">{comment.content}</p>

        <div className="commentActions">
          <button
            className="replyActionBtn"
            onClick={() => handleStartReply(postId, comment.id, comment.author)}
          >
            <FaReply /> Reply
          </button>
        </div>

        {/* RECURSIVE SUB-REPLIES */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="nestedRepliesContainer">
            {comment.replies.map((reply) => renderCommentTree(reply, postId, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Navbar isLoggedIn={!!token} />
      <div className="communityPage">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="communityToast">
            <FaCheck className="toastIcon" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* HERO SECTION */}
        <section className="commHero">
          <div className="commHeroContent">
            <div className="heroTopBadgeRow">
              <span className="commBadge">PUBLIC EXPEDITION FORUM</span>
              <span className={`wsLiveBadge ${wsConnected ? "online" : "offline"}`}>
                <FaWifi /> {wsConnected ? "LIVE SYNC CONNECTED" : "RECONNECTING..."}
              </span>
            </div>

            <h1 className="commTitle">
              JURASSIC <span>COMMUNITY</span>
            </h1>
            <p className="commSub">
              Connect with researchers, fossil hunters, and prehistoric life enthusiasts.
              Share breakthrough finds, debate theories, and discuss paleontology in real-time.
            </p>

            <button
              className="createPostBtn"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlus /> CREATE A POST
            </button>
          </div>
        </section>

        {/* CONTROLS BAR: SEARCH & SORT */}
        <div className="commControlsWrapper">
          <div className="commSearchAndSort">
            <form onSubmit={handleSearchSubmit} className="commSearchForm">
              <FaSearch className="commSearchIcon" />
              <input
                type="text"
                placeholder="Search topics, species, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="sortToggle">
              <button
                className={`sortBtn ${sortBy === "popular" ? "active" : ""}`}
                onClick={() => setSortBy("popular")}
              >
                <FaFire /> Top Voted
              </button>
              <button
                className={`sortBtn ${sortBy === "latest" ? "active" : ""}`}
                onClick={() => setSortBy("latest")}
              >
                <FaClock /> Latest
              </button>
            </div>
          </div>
        </div>

        {/* FEED SECTION */}
        <main className="commFeedContainer">
          {loading ? (
            <div className="commLoading">
              <div className="spinner"></div>
              <p>Scanning Jurassic Live Feed...</p>
            </div>
          ) : error ? (
            <div className="commError">{error}</div>
          ) : posts.length === 0 ? (
            <div className="commEmpty">
              <h3>No posts found</h3>
              <p>Be the first explorer to initiate a discussion on this topic!</p>
              <button
                className="createPostBtn"
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> Create First Post
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <article key={post.id} id={`post-${post.id}`} className="redditCard">
                {/* VOTE SIDEBAR */}
                <div className="voteSidebar">
                  <button
                    className="voteBtn upvote"
                    onClick={() => handleVote(post.id, 1)}
                    title="Upvote"
                  >
                    <FaArrowUp />
                  </button>
                  <span className="voteCount">{post.votes}</span>
                  <button
                    className="voteBtn downvote"
                    onClick={() => handleVote(post.id, -1)}
                    title="Downvote"
                  >
                    <FaArrowDown />
                  </button>
                </div>

                {/* POST MAIN CONTENT */}
                <div className="postMain">
                  <div className="postHeader">
                    <div className="authorBadge">
                      <div className="authorAvatar">
                        {post.author ? post.author.charAt(0).toUpperCase() : "E"}
                      </div>
                      <div>
                        <span className="authorName">{post.author || "Explorer"}</span>
                        <span className="authorRole">{post.author_role || "Prehistoric Explorer"}</span>
                      </div>
                    </div>

                    <div className="postHeaderRight">
                      <span className="postTime">{post.createdAt}</span>
                    </div>
                  </div>

                  <h2 className="postTitle">{post.title}</h2>
                  <p className="postBody">{post.content}</p>

                  {/* POST ACTIONS BAR */}
                  <div className="postFooter">
                    <button
                      className={`actionBtn ${expandedCommentsPostId === post.id ? "active" : ""}`}
                      onClick={() => handleToggleComments(post.id)}
                    >
                      <FaComment /> {post.comment_count} Comments
                    </button>
                  </div>

                  {/* EXPANDABLE COMMENTS & REPLIES SECTION */}
                  {expandedCommentsPostId === post.id && (
                    <div className="commentsDrawer">
                      <h4 className="commentsTitle">Threaded Discussion</h4>

                      {/* REPLY TARGET BANNER */}
                      {replyingToMap[post.id] && (
                        <div className="replyContextBanner">
                          <span>Replying to <strong>@{replyingToMap[post.id].author}</strong></span>
                          <button
                            className="cancelReplyBtn"
                            onClick={() => handleCancelReply(post.id)}
                          >
                            <FaTimes /> Cancel Reply
                          </button>
                        </div>
                      )}

                      {/* ADD COMMENT / REPLY INPUT */}
                      <div className="addCommentBox">
                        <input
                          type="text"
                          placeholder={
                            replyingToMap[post.id]
                              ? `Write reply to @${replyingToMap[post.id].author}...`
                              : "Join the discussion..."
                          }
                          value={commentInputMap[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputMap({
                              ...commentInputMap,
                              [post.id]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(post.id);
                          }}
                        />
                        <button
                          className="submitCommentBtn"
                          disabled={submittingCommentId === post.id}
                          onClick={() => handleAddComment(post.id)}
                        >
                          {submittingCommentId === post.id
                            ? "Posting..."
                            : replyingToMap[post.id]
                            ? "Send Reply"
                            : "Comment"}
                        </button>
                      </div>

                      {/* THREADED COMMENTS LIST */}
                      <div className="commentsList">
                        {!postCommentsMap[post.id] || postCommentsMap[post.id].length === 0 ? (
                          <p className="noComments">No comments yet. Be the first to reply!</p>
                        ) : (
                          postCommentsMap[post.id].map((c) => renderCommentTree(c, post.id))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </main>

        {/* CREATE POST MODAL */}
        {showCreateModal && (
          <div className="commModalOverlay">
            <div className="commModalCard">
              <div className="commModalHeader">
                <h2>New Community Post</h2>
                <button
                  className="closeModalBtn"
                  onClick={() => setShowCreateModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="commModalForm">
                <div className="formGroup">
                  <label>Post Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Discovered Spinosaurus Neural Spine in Morocco"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    required
                  />
                </div>

                <div className="formGroup">
                  <label>Post Body Content *</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your discovery, hypothesis, or discussion prompt..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Author Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Alan Grant"
                      value={newPost.author}
                      onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                    />
                  </div>

                  <div className="formGroup">
                    <label>Author Role / Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Paleontologist"
                      value={newPost.author_role}
                      onChange={(e) => setNewPost({ ...newPost, author_role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modalActions">
                  <button
                    type="button"
                    className="cancelBtn"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="submitPostBtn"
                    disabled={submittingPost}
                  >
                    {submittingPost ? "Publishing..." : "Publish Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {!token && (
        <GlassAuthModal
          isOpen={true}
          onClose={() => navigate('/community')}
          onAuthSuccess={(newToken) => setToken(newToken)}
        />
      )}
    </>
  );
}

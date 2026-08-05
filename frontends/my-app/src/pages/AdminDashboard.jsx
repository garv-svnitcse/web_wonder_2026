import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bone, BookOpen, ClipboardList, FileText, LayoutDashboard,
  Menu, MessageSquare, Plus, Search, Trash2, Users, X, ChevronRight, Edit3
} from "lucide-react";
import "./AdminDashboard.css";
import GlassAuthModal from "../components/GlassAuthModal";

const emptyDinosaur = {
  name: "", scientific_name: "", slug: "", period: "Cretaceous", diet: "Herbivore",
  threat: "Low", description: "", image: "", video: "", habitat: "", million_years_ago: "",
  length_m: "", weight_tons: "", speed_kmph: "", height_m: "", bite_force_psi: "",
  class_kingdom: "Animalia", class_phylum: "Chordata", class_class: "Reptilia",
  class_order: "", class_family: "", class_genus: "", class_species: "",
  fossil_summary: "", fossil_discovery_year: "", fossil_discovery_location: "", fossil_discovered_by: "",
  dna_status: "", dna_summary: "",
  behaviour_hunting_style: "", behaviour_social_behavior: "", behaviour_intelligence: "",
  behaviour_prey: "", behaviour_predators: ""
};

const fallback = {
  counts: { dinosaurs: 0, research: 0, pendingResearch: 0, communityPosts: 0, users: 0, communityComments: 0 },
  dinosaurs: [], research: [], posts: [], research_comments: [], community_comments: []
};

function tokenHeaders(json = false) {
  const token = localStorage.getItem("access_token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

function Stat({ icon: Icon, label, value, tone, note }) {
  return <article className={`admin-stat ${tone}`}><span className="stat-icon"><Icon size={21} /></span><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [section, setSection] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  // Detailed Full Lists States (Fetched via backend GET endpoints)
  const [dinosaurs, setDinosaurs] = useState([]);
  const [research, setResearch] = useState([]);
  const [researchComments, setResearchComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [communityComments, setCommunityComments] = useState([]);

  // Dinosaur Form States (Dinosaurs can still be added/edited)
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyDinosaur);
  const [saving, setSaving] = useState(false);
  const [editingDinoId, setEditingDinoId] = useState(null);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview", { headers: tokenHeaders() });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setToken(null);
          localStorage.removeItem("access_token");
        }
        throw new Error(res.status === 401 || res.status === 403 ? "Sign in with an administrator account to manage the archive." : "The dashboard could not reach the backend.");
      }
      const resultData = await res.json();
      setData(resultData);
      setMessage("");
    } catch (err) {
      setData(fallback);
      setMessage(err.message);
    } finally { setLoading(false); }
  };

  const fetchDinosaurs = async () => {
    try {
      const res = await fetch("/api/admin/dinosaurs", { headers: tokenHeaders() });
      if (res.ok) setDinosaurs(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchResearchData = async () => {
    try {
      const [resPapers, resComments] = await Promise.all([
        fetch("/api/admin/research", { headers: tokenHeaders() }),
        fetch("/api/admin/research-comments", { headers: tokenHeaders() })
      ]);
      if (resPapers.ok) setResearch(await resPapers.json());
      if (resComments.ok) setResearchComments(await resComments.json());
    } catch (err) { console.error(err); }
  };

  const fetchCommunityData = async () => {
    try {
      const [resPosts, resComments] = await Promise.all([
        fetch("/api/admin/community/posts", { headers: tokenHeaders() }),
        fetch("/api/admin/community-comments", { headers: tokenHeaders() })
      ]);
      if (resPosts.ok) setPosts(await resPosts.json());
      if (resComments.ok) setCommunityComments(await resComments.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (token) {
      fetchOverview();
    } else {
      setLoading(false);
      setMessage("Sign in with an administrator account to manage the archive.");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      if (section === "dinosaurs") fetchDinosaurs();
      else if (section === "research") fetchResearchData();
      else if (section === "community") fetchCommunityData();
    }
  }, [section, token]);

  const handleAuthSuccess = (newToken) => {
    setToken(newToken);
    setMessage("");
  };

  const navigation = [
    ["dashboard", LayoutDashboard, "Dashboard"],
    ["dinosaurs", Bone, "Dinosaurs"],
    ["research", FileText, "Research review"],
    ["community", MessageSquare, "Community"],
    ["users", Users, "Users"],
  ];

  // Dinosaur Save Handlers
  const changeDino = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  
  const handleAddDino = () => {
    setEditingDinoId(null);
    setForm(emptyDinosaur);
    setFormOpen(true);
  };

  const handleEditDino = (dino) => {
    setEditingDinoId(dino.id);
    const filledForm = {};
    Object.keys(emptyDinosaur).forEach(key => {
      filledForm[key] = (dino[key] !== undefined && dino[key] !== null) ? dino[key] : emptyDinosaur[key];
    });
    setForm(filledForm);
    setFormOpen(true);
  };

  const saveDinosaur = async (event) => {
    event.preventDefault();
    setSaving(true);
    const numericKeys = ["million_years_ago", "length_m", "weight_tons", "speed_kmph", "height_m", "bite_force_psi"];
    const payload = Object.fromEntries(
      Object.entries(form).map(([key, value]) => {
        if (numericKeys.includes(key)) {
          return [key, (value === "" || value === null) ? null : Number(value)];
        }
        return [key, value === null ? "" : String(value)];
      })
    );

    const isEdit = !!editingDinoId;
    const url = isEdit ? `/api/admin/dinosaurs/${editingDinoId}` : "/api/admin/dinosaurs";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, { method, headers: tokenHeaders(true), body: JSON.stringify(payload) });
      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(responseData.detail || "Could not save dinosaur.");
      setFormOpen(false);
      setForm(emptyDinosaur);
      setMessage(`${responseData.name} was successfully ${isEdit ? "updated" : "added"} in the public archives.`);
      fetchOverview();
      fetchDinosaurs();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeDinosaur = async (dinosaur) => {
    if (!window.confirm(`Remove ${dinosaur.name} from the database?`)) return;
    try {
      const response = await fetch(`/api/admin/dinosaurs/${dinosaur.id}`, { method: "DELETE", headers: tokenHeaders() });
      if (!response.ok) throw new Error("Could not remove this dinosaur.");
      setMessage(`${dinosaur.name} was removed from the database.`);
      fetchOverview();
      fetchDinosaurs();
    } catch (err) { setMessage(err.message); }
  };

  // Research Handlers (Delete/Remove only)
  const removeResearch = async (research) => {
    if (!window.confirm(`Are you sure you want to delete research "${research.title}"?`)) return;
    try {
      const response = await fetch(`/api/admin/research/${research.id}`, {
        method: "DELETE",
        headers: tokenHeaders()
      });
      if (!response.ok) throw new Error("Could not remove research post.");
      setMessage("Research post deleted successfully.");
      fetchOverview();
      fetchResearchData();
    } catch (err) { setMessage(err.message); }
  };

  const removeResearchComment = async (comment) => {
    if (!window.confirm(`Delete comment from ${comment.author}?`)) return;
    try {
      const response = await fetch(`/api/admin/research-comments/${comment.id}`, {
        method: "DELETE",
        headers: tokenHeaders()
      });
      if (!response.ok) throw new Error("Could not delete comment.");
      setMessage("Research comment deleted.");
      fetchOverview();
      fetchResearchData();
    } catch (err) { setMessage(err.message); }
  };

  // Community Handlers (Delete/Remove only)
  const removePost = async (post) => {
    if (!window.confirm(`Delete post "${post.title}"?`)) return;
    try {
      const response = await fetch(`/api/admin/community/posts/${post.id}`, {
        method: "DELETE",
        headers: tokenHeaders()
      });
      if (!response.ok) throw new Error("Could not remove community post.");
      setMessage("Community post deleted.");
      fetchOverview();
      fetchCommunityData();
    } catch (err) { setMessage(err.message); }
  };

  const removeCommunityComment = async (comment) => {
    if (!window.confirm(`Delete comment by ${comment.author}?`)) return;
    try {
      const response = await fetch(`/api/admin/community/comments/${comment.id}`, {
        method: "DELETE",
        headers: tokenHeaders()
      });
      if (!response.ok) throw new Error("Could not delete comment.");
      setMessage("Community comment deleted.");
      fetchOverview();
      fetchCommunityData();
    } catch (err) { setMessage(err.message); }
  };

  const heading = {
    dashboard: ["Archive overview", "Monitor the discoveries and activity across JurassiVerse."],
    dinosaurs: ["Dinosaur catalog", "Create the records that appear in the public research database."],
    research: ["Research review & comments", "Moderate and remove research submissions and reader comments."],
    community: ["Community threads & posts", "Moderate and remove public forum discussions and comment feeds."],
    users: ["Explorer accounts", "Registered JurassiVerse members."]
  }[section];

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <Link className="admin-brand" to="/"><span>JV</span><div><b>JURASSIVERSE</b><small>ADMIN ARCHIVE</small></div></Link>
        <nav>{navigation.map(([id, Icon, label]) => <button key={id} className={section === id ? "active" : ""} onClick={() => { setSection(id); setMobileOpen(false); }}><Icon size={19}/>{label}</button>)}</nav>
        <Link className="return-site" to="/"><ChevronRight size={17}/> Return to website</Link>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={22}/></button><div className="admin-search"><Search size={17}/><span>Archive management</span></div><div className="admin-user"><span>AD</span><div><b>Administrator</b><small>Archive curator</small></div></div></header>
        <div className="admin-content">
          <div className="page-heading"><div><p className="eyebrow">JURASSIVERSE CONTROL ROOM</p><h1>{heading[0]}</h1><p>{heading[1]}</p></div>{section === "dinosaurs" && <button className="primary-button" onClick={handleAddDino}><Plus size={18}/> Add dinosaur</button>}</div>
          {message && <div className="admin-message"><span>{message}</span><button onClick={() => setMessage("")}><X size={17}/></button></div>}
          {loading ? <div className="admin-loading">Loading archive records…</div> : <>
            {section === "dashboard" && <Dashboard data={data} setSection={setSection} />}
            {section === "dinosaurs" && <Dinosaurs rows={dinosaurs} onRemove={removeDinosaur} onEdit={handleEditDino} />}
            {section === "research" && <ResearchSection rows={research} comments={researchComments} onRemove={removeResearch} onRemoveComment={removeResearchComment} />}
            {section === "community" && <CommunitySection rows={posts} comments={communityComments} onRemove={removePost} onRemoveComment={removeCommunityComment} />}
            {section === "users" && <UsersPanel count={data.counts.users} />}
          </>}
        </div>
      </main>
      
      {/* Dynamic Dinosaur Form Modal */}
      {formOpen && <DinosaurForm form={form} change={changeDino} save={saveDinosaur} saving={saving} close={() => setFormOpen(false)} isEditing={!!editingDinoId} />}
      
      {/* Glassmorphic Auth Modal for Login */}
      {!token && (
        <GlassAuthModal
          isOpen={true}
          onClose={() => navigate("/admin")}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}

function Dashboard({ data, setSection }) {
  const c = data.counts;
  return <>
    <section className="stats-grid"><Stat icon={Bone} label="Cataloged dinosaurs" value={c.dinosaurs} note="Live database records" tone="green"/><Stat icon={BookOpen} label="Research papers" value={c.research} note={`${c.pendingResearch} awaiting review`} tone="gold"/><Stat icon={MessageSquare} label="Community posts" value={c.communityPosts} note={`${c.communityComments} explorer comments`} tone="orange"/><Stat icon={Users} label="Registered users" value={c.users} note="JurassiVerse explorers" tone="blue"/></section>
    <section className="quick-actions"><div><p className="eyebrow">QUICK ACTIONS</p><h2>Keep the archive current</h2></div><button onClick={() => setSection("dinosaurs")}><Plus size={18}/> Manage catalog</button><button onClick={() => setSection("research")}><ClipboardList size={18}/> Review research</button></section>
    <div className="admin-columns"><DataCard title="Latest dinosaurs" action="View catalog" onAction={() => setSection("dinosaurs")}><Dinosaurs rows={data.dinosaurs} compact /></DataCard><DataCard title="Latest research" action="Review queue" onAction={() => setSection("research")}><ResearchList rows={data.research} compact /></DataCard></div>
  </>
}

function DataCard({ title, action, onAction, children }) { return <section className="data-card"><div className="card-heading"><h2>{title}</h2><button onClick={onAction}>{action}</button></div>{children}</section> }

function Dinosaurs({ rows, compact, onRemove, onEdit }) {
  return (
    <div className="records-table">
      <div className="record-head">
        <span>Name</span>
        <span>Period</span>
        <span>Diet</span>
        {!compact && <span>Actions</span>}
      </div>
      {rows.length ? rows.map(row => (
        <div className="record-row" key={row.id || row.slug}>
          <span>
            <i className="dino-dot"><Bone size={14}/></i>
            <b>{row.name}</b>
            <small>{row.scientific_name || "Unclassified"}</small>
          </span>
          <span>{row.period}</span>
          <span><em>{row.diet}</em></span>
          {!compact && (
            <span>
              <button className="edit-record" onClick={() => onEdit(row)} aria-label={`Edit ${row.name}`}><Edit3 size={16}/></button>
              <button className="delete-record" onClick={() => onRemove(row)} aria-label={`Remove ${row.name}`}><Trash2 size={16}/></button>
            </span>
          )}
        </div>
      )) : <div className="empty-row">No dinosaur records are available yet.</div>}
    </div>
  );
}

function ResearchList({ rows, compact, onRemove }) {
  return (
    <div className="records-table">
      <div className="record-head">
        <span>Submission</span>
        <span>Researcher</span>
        <span>Status</span>
        {!compact && <span>Actions</span>}
      </div>
      {rows.length ? rows.map(row => (
        <div className="record-row" key={row.id || row.title}>
          <span>
            <b>{row.title}</b>
            <small>{row.species || "Species not specified"}</small>
          </span>
          <span>{row.researcher}</span>
          <span><em className={`status ${row.status}`}>{row.status}</em></span>
          {!compact && (
            <span>
              <button className="delete-record" onClick={() => onRemove(row)} aria-label={`Delete ${row.title}`}><Trash2 size={16}/></button>
            </span>
          )}
        </div>
      )) : <div className="empty-row">No research submissions are available.</div>}
    </div>
  );
}

function ResearchSection({ rows, comments, onRemove, onRemoveComment }) {
  return (
    <>
      <div className="records-card">
        <ResearchList rows={rows} onRemove={onRemove} />
      </div>

      <h2 className="comment-section-heading">Research Comments Moderation</h2>
      <div className="comments-table">
        <div className="record-head" style={{ gridTemplateColumns: "1.2fr 1fr 2fr 0.3fr" }}>
          <span>Research Article</span>
          <span>Author</span>
          <span>Comment Text</span>
          <span>Action</span>
        </div>
        {comments && comments.length ? comments.map(comment => (
          <div className="record-row" key={comment.id} style={{ gridTemplateColumns: "1.2fr 1fr 2fr 0.3fr" }}>
            <span><b>{comment.research_title}</b></span>
            <span>{comment.author}</span>
            <span>{comment.text}</span>
            <button className="delete-record" onClick={() => onRemoveComment(comment)} aria-label="Delete comment"><Trash2 size={16}/></button>
          </div>
        )) : <div className="empty-row">No research comments to display.</div>}
      </div>
    </>
  );
}

function CommunitySection({ rows, comments, onRemove, onRemoveComment }) {
  return (
    <>
      <div className="records-card">
        <div className="records-table">
          <div className="record-head">
            <span>Thread / Title</span>
            <span>Author</span>
            <span>Votes</span>
            <span>Actions</span>
          </div>
          {rows.length ? rows.map(row => (
            <div className="record-row" key={row.id}>
              <span>
                <b>{row.title}</b>
                <small>{row.content ? row.content.substring(0, 80) + "..." : "No text content"}</small>
              </span>
              <span>{row.author}</span>
              <span><em>{row.votes} votes</em></span>
              <span>
                <button className="delete-record" onClick={() => onRemove(row)} aria-label={`Delete ${row.title}`}><Trash2 size={16}/></button>
              </span>
            </div>
          )) : <div className="empty-row">No community posts are available.</div>}
        </div>
      </div>

      <h2 className="comment-section-heading">Community Comments Moderation</h2>
      <div className="comments-table">
        <div className="record-head" style={{ gridTemplateColumns: "1fr 2.5fr 0.3fr" }}>
          <span>Comment Author</span>
          <span>Content Text</span>
          <span>Action</span>
        </div>
        {comments && comments.length ? comments.map(comment => (
          <div className="record-row" key={comment.id} style={{ gridTemplateColumns: "1fr 2.5fr 0.3fr" }}>
            <span><b>{comment.author}</b></span>
            <span>{comment.content}</span>
            <button className="delete-record" onClick={() => onRemoveComment(comment)} aria-label="Delete comment"><Trash2 size={16}/></button>
          </div>
        )) : <div className="empty-row">No community comments available.</div>}
      </div>
    </>
  );
}

function UsersPanel({ count }) {
  return <section className="users-panel"><span><Users size={30}/></span><div><p>REGISTERED EXPLORERS</p><strong>{count}</strong><h2>Member management is tied to your authentication backend.</h2><p>User accounts are displayed here as they are created through the current sign-up flow.</p></div></section>
}

function DinosaurForm({ form, change, save, saving, close, isEditing }) {
  return (
    <div className="modal-backdrop">
      <form className="dino-form" onSubmit={save} style={{ width: "min(840px, 95%)" }}>
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{isEditing ? "EDIT RECORD IN ARCHIVE" : "PUBLIC DATABASE ENTRY"}</p>
            <h2>{isEditing ? "Edit Dinosaur Details" : "Add Dinosaur Record"}</h2>
          </div>
          <button type="button" onClick={close}><X size={20}/></button>
        </div>

        <div className="form-sections-container">
          
          <h3 className="field-section-title">1. Basic Identification</h3>
          <div className="field-grid">
            <label>Display Name *
              <input required type="text" name="name" value={form.name} onChange={change} placeholder="e.g. Tyrannosaurus Rex" />
            </label>
            <label>Scientific Name
              <input type="text" name="scientific_name" value={form.scientific_name} onChange={change} placeholder="e.g. Tyrannosaurus rex" />
            </label>
            <label>Slug (auto-generated if empty)
              <input type="text" name="slug" value={form.slug} onChange={change} placeholder="e.g. tyrannosaurus-rex" />
            </label>
            <label>Geological Era / Period *
              <input required type="text" name="period" value={form.period} onChange={change} placeholder="e.g. Late Cretaceous" />
            </label>
            <label>Dietary Category *
              <select name="diet" value={form.diet} onChange={change}>
                <option value="Herbivore">Herbivore</option>
                <option value="Carnivore">Carnivore</option>
                <option value="Omnivore">Omnivore</option>
              </select>
            </label>
            <label>Threat Level
              <select name="threat" value={form.threat} onChange={change}>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </label>
            <label>Habitat / Discovery Continent
              <input type="text" name="habitat" value={form.habitat} onChange={change} placeholder="e.g. North America" />
            </label>
            <label>Million Years Ago
              <input type="number" name="million_years_ago" value={form.million_years_ago} onChange={change} placeholder="e.g. 66" step="any" />
            </label>
          </div>

          <h3 className="field-section-title">2. Physical Dimensions & Metrics</h3>
          <div className="field-grid">
            <label>Length (meters)
              <input type="number" name="length_m" value={form.length_m} onChange={change} placeholder="e.g. 12.3" step="any" />
            </label>
            <label>Weight (tons)
              <input type="number" name="weight_tons" value={form.weight_tons} onChange={change} placeholder="e.g. 8.4" step="any" />
            </label>
            <label>Height (meters)
              <input type="number" name="height_m" value={form.height_m} onChange={change} placeholder="e.g. 4.0" step="any" />
            </label>
            <label>Speed (km/h)
              <input type="number" name="speed_kmph" value={form.speed_kmph} onChange={change} placeholder="e.g. 27" step="any" />
            </label>
            <label className="span-two">Bite Force (PSI)
              <input type="number" name="bite_force_psi" value={form.bite_force_psi} onChange={change} placeholder="e.g. 12800" step="any" />
            </label>
          </div>

          <h3 className="field-section-title">3. Scientific Classification (Taxonomy)</h3>
          <div className="field-grid">
            <label>Kingdom
              <input type="text" name="class_kingdom" value={form.class_kingdom} onChange={change} />
            </label>
            <label>Phylum
              <input type="text" name="class_phylum" value={form.class_phylum} onChange={change} />
            </label>
            <label>Class
              <input type="text" name="class_class" value={form.class_class} onChange={change} />
            </label>
            <label>Order
              <input type="text" name="class_order" value={form.class_order} onChange={change} placeholder="e.g. Saurischia" />
            </label>
            <label>Family
              <input type="text" name="class_family" value={form.class_family} onChange={change} placeholder="e.g. Tyrannosauridae" />
            </label>
            <label>Genus
              <input type="text" name="class_genus" value={form.class_genus} onChange={change} placeholder="e.g. Tyrannosaurus" />
            </label>
            <label className="span-two">Species
              <input type="text" name="class_species" value={form.class_species} onChange={change} placeholder="e.g. rex" />
            </label>
          </div>

          <h3 className="field-section-title">4. Discovery & Fossil Evidence</h3>
          <div className="field-grid">
            <label>Year of Discovery
              <input type="text" name="fossil_discovery_year" value={form.fossil_discovery_year} onChange={change} placeholder="e.g. 1902" />
            </label>
            <label>Excavation Location
              <input type="text" name="fossil_discovery_location" value={form.fossil_discovery_location} onChange={change} placeholder="e.g. Hell Creek, Montana" />
            </label>
            <label className="span-two">Discovered By
              <input type="text" name="fossil_discovered_by" value={form.fossil_discovered_by} onChange={change} placeholder="e.g. Barnum Brown" />
            </label>
            <label className="span-two">Fossil Discovery Summary
              <textarea name="fossil_summary" value={form.fossil_summary} onChange={change} placeholder="Description of the excavated fossils and cataloging details..." rows="3" />
            </label>
          </div>

          <h3 className="field-section-title">5. DNA Lab Genomics & Behavior</h3>
          <div className="field-grid">
            <label>DNA Sequence Integrity Status
              <input type="text" name="dna_status" value={form.dna_status} onChange={change} placeholder="e.g. 98.7% Sequenced" />
            </label>
            <label className="span-two">Genomics Summary Note
              <textarea name="dna_summary" value={form.dna_summary} onChange={change} placeholder="Details about protein retrieval, genetic completeness, etc..." rows="2" />
            </label>
            <label>Hunting / Foraging Style
              <input type="text" name="behaviour_hunting_style" value={form.behaviour_hunting_style} onChange={change} placeholder="e.g. Pack hunter / browser" />
            </label>
            <label>Social Behavior
              <input type="text" name="behaviour_social_behavior" value={form.behaviour_social_behavior} onChange={change} placeholder="e.g. Solitary, highly territorial" />
            </label>
            <label className="span-two">Cognitive Intelligence Rating Description
              <input type="text" name="behaviour_intelligence" value={form.behaviour_intelligence} onChange={change} placeholder="e.g. High tactical agility" />
            </label>
            <label className="span-two">Target Prey (comma-separated values)
              <input type="text" name="behaviour_prey" value={form.behaviour_prey} onChange={change} placeholder="e.g. Hadrosaurs, Ceratopsians" />
            </label>
            <label className="span-two">Competitors & Predators (comma-separated values)
              <input type="text" name="behaviour_predators" value={form.behaviour_predators} onChange={change} placeholder="e.g. T-Rex, Raptors" />
            </label>
          </div>

          <h3 className="field-section-title">6. Media & Overview</h3>
          <div className="field-grid">
            <label>Image URL / Source Path
              <input type="text" name="image" value={form.image} onChange={change} placeholder="e.g. /src/assets/Dinosaurs_Images/trex.png" />
            </label>
            <label>YouTube Video URL (Embed format)
              <input type="text" name="video" value={form.video} onChange={change} placeholder="e.g. https://www.youtube.com/embed/aYV3DkMvW0E" />
            </label>
            <label className="span-two">Brief Overview Description
              <textarea name="description" value={form.description} onChange={change} placeholder="Apex predator description, behavioral quirks, and lore..." rows="3" />
            </label>
          </div>

        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={close}>Cancel</button>
          <button disabled={saving} className="primary-button">{saving ? "Saving…" : (isEditing ? "Save changes" : "Add dinosaur")}</button>
        </div>
      </form>
    </div>
  );
}

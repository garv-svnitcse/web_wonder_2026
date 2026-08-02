import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bone, BookOpen, ClipboardList, FileText, LayoutDashboard,
  Menu, MessageSquare, Plus, Search, Trash2, Users, X, ChevronRight,
} from "lucide-react";
import "./AdminDashboard.css";

const API = "http://127.0.0.1:5001";
const emptyDinosaur = {
  name: "", scientific_name: "", slug: "", period: "Cretaceous", diet: "Herbivore",
  threat: "Low", description: "", image: "", video: "", habitat: "", million_years_ago: "",
  length_m: "", weight_tons: "", speed_kmph: "",
};

const fallback = {
  counts: { dinosaurs: 0, research: 0, pendingResearch: 0, communityPosts: 0, users: 0, communityComments: 0 },
  dinosaurs: [], research: [], posts: [],
};

function tokenHeaders(json = false) {
  const token = localStorage.getItem("access_token");
  return { ...(json ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function Stat({ icon: Icon, label, value, tone, note }) {
  return <article className={`admin-stat ${tone}`}><span className="stat-icon"><Icon size={21} /></span><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>;
}

export default function AdminDashboard() {
  const [section, setSection] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyDinosaur);
  const [saving, setSaving] = useState(false);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/overview`, { headers: tokenHeaders() });
      if (!res.ok) throw new Error(res.status === 401 || res.status === 403 ? "Sign in with an administrator account to manage the archive." : "The dashboard could not reach the backend.");
      setData(await res.json());
      setMessage("");
    } catch (err) {
      setData(fallback);
      setMessage(err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOverview(); }, []);
  const visibleDinosaurs = useMemo(() => data.dinosaurs || [], [data]);
  const navigation = [
    ["dashboard", LayoutDashboard, "Dashboard"], ["dinosaurs", Bone, "Dinosaurs"],
    ["research", FileText, "Research review"], ["community", MessageSquare, "Community"], ["users", Users, "Users"],
  ];

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const saveDinosaur = async (event) => {
    event.preventDefault(); setSaving(true);
    const numericKeys = ["million_years_ago", "length_m", "weight_tons", "speed_kmph"];
    const payload = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, numericKeys.includes(key) ? (value === "" ? null : Number(value)) : value]));
    try {
      const response = await fetch(`${API}/admin/dinosaurs`, { method: "POST", headers: tokenHeaders(true), body: JSON.stringify(payload) });
      const responseData = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(responseData.detail || "Could not save dinosaur.");
      setFormOpen(false); setForm(emptyDinosaur); setMessage(`${responseData.name} was added to the public dinosaur database.`); fetchOverview();
    } catch (err) { setMessage(err.message); } finally { setSaving(false); }
  };
  const removeDinosaur = async (dinosaur) => {
    if (!window.confirm(`Remove ${dinosaur.name} from the database?`)) return;
    try {
      const response = await fetch(`${API}/admin/dinosaurs/${dinosaur.id}`, { method: "DELETE", headers: tokenHeaders() });
      if (!response.ok) throw new Error("Could not remove this dinosaur.");
      setMessage(`${dinosaur.name} was removed.`); fetchOverview();
    } catch (err) { setMessage(err.message); }
  };

  const heading = { dashboard: ["Archive overview", "Monitor the discoveries and activity across JurassiVerse."], dinosaurs: ["Dinosaur catalog", "Create the records that appear in the public research database."], research: ["Research review", "New submissions and their publication status."], community: ["Community activity", "A read-only view of conversations currently visible to explorers."], users: ["Explorer accounts", "Registered JurassiVerse members."] }[section];

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${mobileOpen ? "is-open" : ""}`}>
      <Link className="admin-brand" to="/"><span>JV</span><div><b>JURASSIVERSE</b><small>ADMIN ARCHIVE</small></div></Link>
      <nav>{navigation.map(([id, Icon, label]) => <button key={id} className={section === id ? "active" : ""} onClick={() => { setSection(id); setMobileOpen(false); }}><Icon size={19}/>{label}</button>)}</nav>
      <Link className="return-site" to="/"><ChevronRight size={17}/> Return to website</Link>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={22}/></button><div className="admin-search"><Search size={17}/><span>Archive management</span></div><div className="admin-user"><span>AD</span><div><b>Administrator</b><small>Archive curator</small></div></div></header>
      <div className="admin-content">
        <div className="page-heading"><div><p className="eyebrow">JURASSIVERSE CONTROL ROOM</p><h1>{heading[0]}</h1><p>{heading[1]}</p></div>{section === "dinosaurs" && <button className="primary-button" onClick={() => setFormOpen(true)}><Plus size={18}/> Add dinosaur</button>}</div>
        {message && <div className="admin-message"><span>{message}</span><button onClick={() => setMessage("")}><X size={17}/></button></div>}
        {loading ? <div className="admin-loading">Loading archive records…</div> : <>
          {section === "dashboard" && <Dashboard data={data} setSection={setSection} />}
          {section === "dinosaurs" && <Dinosaurs rows={visibleDinosaurs} onRemove={removeDinosaur} />}
          {section === "research" && <Research rows={data.research} />}
          {section === "community" && <Community rows={data.posts} count={data.counts.communityComments} />}
          {section === "users" && <UsersPanel count={data.counts.users} />}
        </>}
      </div>
    </main>
    {formOpen && <DinosaurForm form={form} change={change} save={saveDinosaur} saving={saving} close={() => setFormOpen(false)} />}
  </div>;
}

function Dashboard({ data, setSection }) { const c = data.counts; return <>
  <section className="stats-grid"><Stat icon={Bone} label="Cataloged dinosaurs" value={c.dinosaurs} note="Live database records" tone="green"/><Stat icon={BookOpen} label="Research papers" value={c.research} note={`${c.pendingResearch} awaiting review`} tone="gold"/><Stat icon={MessageSquare} label="Community posts" value={c.communityPosts} note={`${c.communityComments} explorer comments`} tone="orange"/><Stat icon={Users} label="Registered users" value={c.users} note="JurassiVerse explorers" tone="blue"/></section>
  <section className="quick-actions"><div><p className="eyebrow">QUICK ACTIONS</p><h2>Keep the archive current</h2></div><button onClick={() => setSection("dinosaurs")}><Plus size={18}/> Add dinosaur</button><button onClick={() => setSection("research")}><ClipboardList size={18}/> Review research</button></section>
  <div className="admin-columns"><DataCard title="Latest dinosaurs" action="View catalog" onAction={() => setSection("dinosaurs")}><Dinosaurs rows={data.dinosaurs} compact /></DataCard><DataCard title="Latest research" action="Review queue" onAction={() => setSection("research")}><Research rows={data.research} compact /></DataCard></div>
</> }
function DataCard({ title, action, onAction, children }) { return <section className="data-card"><div className="card-heading"><h2>{title}</h2><button onClick={onAction}>{action}</button></div>{children}</section> }
function Dinosaurs({ rows, compact, onRemove }) { return <div className="records-table"><div className="record-head"><span>Name</span><span>Period</span><span>Diet</span>{!compact && <span>Action</span>}</div>{rows.length ? rows.map(row => <div className="record-row" key={row.id || row.slug}><span><i className="dino-dot"><Bone size={14}/></i><b>{row.name}</b><small>{row.scientific_name}</small></span><span>{row.period}</span><span><em>{row.diet}</em></span>{!compact && <button className="delete-record" onClick={() => onRemove(row)} aria-label={`Remove ${row.name}`}><Trash2 size={16}/></button>}</div>) : <div className="empty-row">No dinosaur records are available yet.</div>}</div> }
function Research({ rows }) { return <div className="records-table"><div className="record-head research-head"><span>Submission</span><span>Researcher</span><span>Status</span></div>{rows.length ? rows.map(row => <div className="record-row research-row" key={row.id || row.title}><span><b>{row.title}</b><small>{row.species || "Species not specified"}</small></span><span>{row.researcher}</span><span><em className={`status ${row.status}`}>{row.status}</em></span></div>) : <div className="empty-row">No research submissions are available.</div>}</div> }
function Community({ rows, count }) { return <section className="data-card"><div className="community-summary"><span><MessageSquare size={20}/></span><div><p>{count} comments across the archive</p><h2>Latest community posts</h2></div></div><div className="community-list">{rows.length ? rows.map(row => <div key={row.id}><div><b>{row.title}</b><small>by {row.author}</small></div><em>{row.votes} votes</em></div>) : <div className="empty-row">No community posts are available.</div>}</div></section> }
function UsersPanel({ count }) { return <section className="users-panel"><span><Users size={30}/></span><div><p>REGISTERED EXPLORERS</p><strong>{count}</strong><h2>Member management is tied to your authentication backend.</h2><p>User accounts are displayed here as they are created through the current sign-up flow.</p></div></section> }
function DinosaurForm({ form, change, save, saving, close }) { const fields = [["name", "Display name *"], ["scientific_name", "Scientific name"], ["period", "Period / era *"], ["diet", "Diet *"], ["habitat", "Habitat"], ["million_years_ago", "Million years ago", "number"], ["length_m", "Length (metres)", "number"], ["weight_tons", "Weight (tons)", "number"], ["speed_kmph", "Speed (km/h)", "number"], ["image", "Image URL", "url"], ["video", "Video URL", "url"]]; return <div className="modal-backdrop"><form className="dino-form" onSubmit={save}><div className="modal-heading"><div><p className="eyebrow">PUBLIC DATABASE ENTRY</p><h2>Add dinosaur</h2></div><button type="button" onClick={close}><X size={20}/></button></div><div className="field-grid">{fields.map(([name, label, type]) => <label key={name}>{label}<input required={["name", "period", "diet"].includes(name)} type={type || "text"} name={name} value={form[name]} onChange={change}/></label>)}<label className="span-two">Threat level<select name="threat" value={form.threat} onChange={change}><option>Low</option><option>Moderate</option><option>High</option></select></label><label className="span-two">Description<textarea name="description" value={form.description} onChange={change} rows="3"/></label></div><div className="form-actions"><button type="button" className="secondary-button" onClick={close}>Cancel</button><button disabled={saving} className="primary-button">{saving ? "Saving…" : "Save dinosaur"}</button></div></form></div> }

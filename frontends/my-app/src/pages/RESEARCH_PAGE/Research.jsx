import ParticleBackground from "./ParticleBackground";
import ResearchHero from "./ResearchHero";
import ResearchStats from "./ResearchStats";
import ResearchSearchBar from "./ResearchSearchBar";
import ResearchCard from "./ResearchCard";
import SubmitResearchForm from "./SubmitResearchForm";
import FeaturedResearcher from "./FeaturedResearcher";
import ActivityTicker from "./ActivityTicker";
import ResearchTimeline from "./ResearchTimeline";
import TrendingTags from "./TrendingTags";
import ContributorLeaderboard from "./ContributorLeaderboard";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import GlassAuthModal from "../../components/GlassAuthModal";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "./researchData";

import "./Research.css";

export default function Research() {
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [era, setEra] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(3);
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let active = true;
    async function loadPreview() {
      try {
        const response = await fetch(`http://localhost:5001/research/preview?limit=${visibleCount}`);
        if (response.ok) {
          const data = await response.json();
          if (active && Array.isArray(data) && data.length > 0) {
            setResearchData(data);
          } else {
            setResearchData(database);
          }
        } else {
          setResearchData(database);
        }
      } catch (err) {
        console.warn("Failed to fetch research preview, using fallback database:", err);
        setResearchData(database);
      } finally {
        setLoading(false);
      }
    }
    loadPreview();
    return () => {
      active = false;
    };
  }, [visibleCount]);

  const filtered = researchData.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status
      ? item.status?.toLowerCase() === status.toLowerCase()
      : true;
    const matchesEra = era
      ? item.era?.toLowerCase().includes(era.toLowerCase())
      : true;
    return matchesSearch && matchesStatus && matchesEra;
  });

  const visibleItems = filtered.slice(0, visibleCount);

  return (
    <>
      <Navbar isLoggedIn={!!token} />
      <section
        className="research"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <ParticleBackground />

        <div style={{ position: "relative", zIndex: 1 }}>
          <ResearchHero />
          <ResearchStats />
          <FeaturedResearcher />
          <ActivityTicker />
          <ResearchTimeline />
          <TrendingTags onTagClick={(tag) => setSearch(tag)} />
          <ContributorLeaderboard />

          <div className="researchHeading">
            <span>CLASSIFIED DATABASE</span>
            <h2>Research Archives</h2>
            <p>
              Browse the Jurassic Journey fossil database and discover
              scientific records from prehistoric Earth.
            </p>
          </div>

          <ResearchSearchBar
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            era={era}
            setEra={setEra}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          <div className="researchGrid">
            {visibleItems.map((item) => (
              <ResearchCard key={item.title || item.slug} item={item} />
            ))}
          </div>

          {filtered.length >= visibleCount && (
            <div className="rhLoadMoreWrap">
              <button
                className="rhLoadMoreBtn"
                onClick={() => setVisibleCount((prev) => prev + 3)}
              >
                Load More
              </button>
            </div>
          )}

          <SubmitResearchForm />
        </div>
      </section>
      <Footer />
      {!token && (
        <GlassAuthModal
          isOpen={true}
          onClose={() => navigate('/')}
          onAuthSuccess={(newToken) => setToken(newToken)}
        />
      )}
    </>
  );
}

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
import ResearchFooter from "./ResearchFooter";
import { useState } from "react";
import { database } from "./researchData";

import "./Research.css";

export default function Research() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [era, setEra] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(3);

  const filtered = database.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status ? item.status === status : true;
    const matchesEra = era ? item.era.includes(era) : true;
    return matchesSearch && matchesStatus && matchesEra;
  });

  const visibleItems = filtered.slice(0, visibleCount);

  return (
    <>
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
              <ResearchCard key={item.slug} item={item} />
            ))}
          </div>

          {visibleCount < filtered.length && (
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
      <ResearchFooter />
    </>
  );
}

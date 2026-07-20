import { FaQuoteLeft, FaAward, FaFlask, FaBookOpen } from "react-icons/fa";
import { useState, useEffect } from "react";

const fallbackResearcher = {
  name: "Dr. Amelia Hart",
  role: "Lead Paleobiologist",
  avatar: "https://i.pravatar.cc/300?img=47",
  quote:
    "Every fossil tells a story millions of years in the making. Our job is simply to listen.",
  stats: [
    { icon: <FaFlask />, value: "42", label: "Published Studies" },
    { icon: <FaAward />, value: "8", label: "Awards Won" },
    { icon: <FaBookOpen />, value: "1.2K", label: "Citations" },
  ],
};

export default function FeaturedResearcher() {
  const [researcher, setResearcher] = useState(fallbackResearcher);

  useEffect(() => {
    let active = true;
    async function fetchLeading() {
      try {
        const response = await fetch("http://localhost:5001/research/leading");
        if (response.ok) {
          const data = await response.json();
          if (active) {
            const formattedCitations = data.citations_count >= 1000
              ? (data.citations_count / 1000).toFixed(1) + "K"
              : data.citations_count.toString();

            setResearcher({
              name: data.name,
              role: data.role,
              avatar: data.avatar,
              quote: data.quote,
              stats: [
                { icon: <FaFlask />, value: data.published_studies.toString(), label: "Published Studies" },
                { icon: <FaAward />, value: data.awards_won.toString(), label: "Awards Won" },
                { icon: <FaBookOpen />, value: formattedCitations, label: "Citations" },
              ],
            });
          }
        }
      } catch (err) {
        console.warn("Failed to fetch leading researcher, using fallback:", err);
      }
    }
    fetchLeading();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="featuredResearcher">
      <div className="frImageSide">
        <img src={researcher.avatar} alt={researcher.name} />
        <div className="frImageGlow" />
      </div>

      <div className="frContent">
        <span className="frTag">Leading Researcher</span>
        <h2>{researcher.name}</h2>
        <p className="frRole">{researcher.role}</p>

        <div className="frQuote">
          <FaQuoteLeft />
          <p>{researcher.quote}</p>
        </div>

        <div className="frStats">
          {researcher.stats.map((stat, i) => (
            <div className="frStatItem" key={i}>
              <div className="frStatIcon">{stat.icon}</div>
              <div>
                <h4>{stat.value}</h4>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

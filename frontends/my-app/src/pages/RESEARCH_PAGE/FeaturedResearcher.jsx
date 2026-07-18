import { FaQuoteLeft, FaAward, FaFlask, FaBookOpen } from "react-icons/fa";

export default function FeaturedResearcher() {
  const researcher = {
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

  return (
    <div className="featuredResearcher">
      <div className="frImageSide">
        <img src={researcher.avatar} alt={researcher.name} />
        <div className="frImageGlow" />
      </div>

      <div className="frContent">
        <span className="frTag">Researcher of the Month</span>
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

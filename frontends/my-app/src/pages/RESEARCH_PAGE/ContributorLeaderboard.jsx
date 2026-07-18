import { FaTrophy, FaMedal } from "react-icons/fa";

const contributors = [
  {
    rank: 1,
    name: "Dr. Amelia Hart",
    role: "Paleobiologist",
    papers: 42,
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    rank: 2,
    name: "Dr. Sophia Lee",
    role: "Geology Specialist",
    papers: 38,
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    rank: 3,
    name: "Dr. Noah Bennett",
    role: "Evolutionary Biologist",
    papers: 31,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    rank: 4,
    name: "Dr. Ethan Cole",
    role: "Paleoenvironmentalist",
    papers: 27,
    avatar: "https://i.pravatar.cc/150?img=53",
  },
  {
    rank: 5,
    name: "Dr. Lucas Wright",
    role: "Anatomy Researcher",
    papers: 22,
    avatar: "https://i.pravatar.cc/150?img=45",
  },
];

const rankColors = {
  1: "#ffd700",
  2: "#c0c0c0",
  3: "#cd7f32",
};

export default function ContributorLeaderboard() {
  return (
    <div className="leaderboardWidget">
      <div className="lbHeading">
        <FaTrophy className="lbTrophyIcon" />
        <div>
          <span className="lbTag">Top Contributors</span>
          <h2>Research Leaderboard</h2>
        </div>
      </div>

      <div className="lbList">
        {contributors.map((c) => (
          <div className="lbItem" key={c.rank}>
            <div
              className="lbRank"
              style={{ color: rankColors[c.rank] || "#5dffa0" }}
            >
              {c.rank <= 3 ? <FaMedal /> : `#${c.rank}`}
            </div>

            <img src={c.avatar} alt={c.name} className="lbAvatar" />

            <div className="lbInfo">
              <p className="lbName">{c.name}</p>
              <p className="lbRole">{c.role}</p>
            </div>

            <div className="lbPapers">
              <span>{c.papers}</span>
              <p>papers</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

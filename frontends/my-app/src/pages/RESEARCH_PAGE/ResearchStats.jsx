import { useEffect, useState } from "react";
import { FaMicroscope, FaClock, FaCheckCircle, FaUsers } from "react-icons/fa";

const DEFAULT_STATS = {
  totalResearch: "128",
  pending: "36",
  approved: "72",
  researchers: "20"
};

export default function ResearchStats() {
  const [data, setData] = useState(DEFAULT_STATS);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/research/stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error("HTTP error " + res.status);
        }
        return res.json();
      })
      .then((statsData) => {
        setData({
          totalResearch: statsData["total research"] ?? DEFAULT_STATS.totalResearch,
          pending: statsData["research pending"] ?? DEFAULT_STATS.pending,
          approved: statsData["research approved"] ?? DEFAULT_STATS.approved,
          researchers: statsData["researchers"] ?? DEFAULT_STATS.researchers
        });
      })
      .catch((err) => {
        console.warn("Failed to fetch research stats, using fallback static data:", err);
        setData(DEFAULT_STATS);
      });
  }, []);

  const statsList = [
    { icon: <FaMicroscope />, value: data.totalResearch, label: "Total Research" },
    { icon: <FaClock />, value: data.pending, label: "Pending Review" },
    { icon: <FaCheckCircle />, value: data.approved, label: "Approved" },
    { icon: <FaUsers />, value: data.researchers, label: "Researchers" },
  ];

  return (
    <div className="rhStats">
      {statsList.map((stat, index) => (
        <div className="rhStatCard" key={index}>
          <div className="rhStatIcon">{stat.icon}</div>
          <div>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

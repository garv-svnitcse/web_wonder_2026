import { FaMicroscope, FaClock, FaCheckCircle, FaUsers } from "react-icons/fa";

const stats = [
  { icon: <FaMicroscope />, value: "128", label: "Total Research" },
  { icon: <FaClock />, value: "36", label: "Pending Review" },
  { icon: <FaCheckCircle />, value: "72", label: "Approved" },
  { icon: <FaUsers />, value: "20", label: "Researchers" },
];

export default function ResearchStats() {
  return (
    <div className="rhStats">
      {stats.map((stat, index) => (
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

import { FaFlask, FaDna, FaBone, FaGlobeAmericas } from "react-icons/fa";

const milestones = [
  {
    year: "2023",
    title: "Project Jurassic Journey Founded",
    description:
      "Initial excavation team assembled to explore Late Cretaceous fossil beds.",
    icon: <FaGlobeAmericas />,
  },
  {
    year: "2024",
    title: "First DNA Fragment Recovered",
    description:
      "Breakthrough amber-preserved specimens yielded first viable genetic material.",
    icon: <FaDna />,
  },
  {
    year: "2025",
    title: "128 Research Papers Published",
    description:
      "Global collaboration expanded research output across 20 institutions.",
    icon: <FaFlask />,
  },
  {
    year: "2026",
    title: "Triceratops Growth Study Completed",
    description:
      "Comprehensive bone-ring analysis redefined understanding of species lifespan.",
    icon: <FaBone />,
  },
];

export default function ResearchTimeline() {
  return (
    <div className="researchTimeline">
      <div className="rtHeading">
        <span>OUR JOURNEY</span>
        <h2>Research Timeline</h2>
      </div>

      <div className="rtLine">
        {milestones.map((item, i) => (
          <div
            className={`rtItem ${i % 2 === 0 ? "rtLeft" : "rtRight"}`}
            key={i}
          >
            <div className="rtIcon">{item.icon}</div>
            <div className="rtCard">
              <span className="rtYear">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

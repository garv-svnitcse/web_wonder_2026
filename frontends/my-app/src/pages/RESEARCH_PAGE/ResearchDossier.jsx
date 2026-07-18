import { useParams, Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaComment,
  FaBookmark,
  FaCalendar,
} from "react-icons/fa";
import { database } from "./researchData";
import ParticleBackground from "./ParticleBackground";
import "./Research.css";

export default function ResearchDossier() {
  const { slug } = useParams();
  const item = database.find((d) => d.slug === slug);

  if (!item) {
    return (
      <section
        className="research"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <ParticleBackground />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "150px 20px",
          }}
        >
          <h2 style={{ color: "#ECE4D8", fontFamily: "Cinzel, serif" }}>
            Dossier Not Found
          </h2>
          <Link
            to="/research"
            className="researchButton"
            style={{
              display: "inline-flex",
              width: "auto",
              padding: "16px 32px",
              marginTop: "24px",
            }}
          >
            <FaArrowLeft /> Back to Research Hub
          </Link>
        </div>
      </section>
    );
  }

  const statusClass =
    item.status === "Approved" ? "rcBadge-approved" : "rcBadge-pending";

  return (
    <section
      className="research"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <ParticleBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="dossierWrap">
          <Link to="/research" className="dossierBack">
            <FaArrowLeft /> Back to Research Hub
          </Link>

          <div className="dossierHero">
            <img src={item.image} alt={item.title} />
            <div className="dossierHeroOverlay">
              <span className={`rcBadge ${statusClass}`}>
                {item.status?.toUpperCase()}
              </span>
              <span className="rcEraBadge">{item.era}</span>
            </div>
          </div>

          <div className="dossierBody">
            <h1 className="dossierTitle">{item.title}</h1>

            <div className="dossierMetaRow">
              <div className="dossierScientistInline">
                <img src={item.scientist?.avatar} alt={item.scientist?.name} />
                <div>
                  <p className="rcScientistName">{item.scientist?.name}</p>
                  <p className="rcScientistRole">{item.scientist?.role}</p>
                </div>
              </div>

              <div className="dossierStatsInline">
                <span>
                  <FaCalendar /> {item.date}
                </span>
                <span>
                  <FaEye /> {item.views}
                </span>
                <span>
                  <FaComment /> {item.comments}
                </span>
                <FaBookmark className="rcBookmark" />
              </div>
            </div>

            <div className="dossierQuickFacts">
              <div>
                <h5>Diet</h5>
                <p>{item.diet}</p>
              </div>
              <div>
                <h5>Threat Level</h5>
                <p>{item.threat}</p>
              </div>
              <div>
                <h5>Era</h5>
                <p>{item.era}</p>
              </div>
            </div>

            <div className="dossierContent">
              <h3>Abstract</h3>
              <p>{item.fullContent}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

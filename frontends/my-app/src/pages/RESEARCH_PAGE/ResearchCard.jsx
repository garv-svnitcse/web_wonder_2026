import { FaEye, FaComment, FaBookmark, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ResearchCard({ item }) {
  const statusClass =
    item.status === "Approved" ? "rcBadge-approved" : "rcBadge-pending";

  return (
    <div className="researchCard">
      <div className="rcImageWrap">
        <img src={item.image} alt={item.title} />
        <span className={`rcBadge ${statusClass}`}>
          {item.status?.toUpperCase()}
        </span>
        <span className="rcEraBadge">{item.era}</span>
      </div>

      <div className="researchContent">
        <h3 className="rcTitle">{item.title}</h3>
        <p className="rcDescription">{item.description}</p>

        <div className="rcScientist">
          <img
            src={item.scientist?.avatar}
            alt={item.scientist?.name}
            className="rcAvatar"
          />
          <div>
            <p className="rcScientistName">{item.scientist?.name}</p>
            <p className="rcScientistRole">{item.scientist?.role}</p>
          </div>
        </div>

        <div className="rcMetaRow">
          <span className="rcDate">{item.date}</span>
          <div className="rcStats">
            <span>
              <FaEye /> {item.views}
            </span>
            <span>
              <FaComment /> {item.comments}
            </span>
            <FaBookmark className="rcBookmark" />
          </div>
        </div>

        {item.lastComment && (
          <div className="rcCommentPreview">
            <span className="rcCommentAuthor">{item.lastComment.author}:</span>
            <span className="rcCommentText">"{item.lastComment.text}"</span>
          </div>
        )}
        
        <Link to={`/research/${item.slug}`} className="researchButton">
          OPEN DOSSIER
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}

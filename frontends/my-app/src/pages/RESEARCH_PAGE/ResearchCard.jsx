import { API_URL } from "../../config/api";
import { FaEye, FaComment, FaBookmark, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const getImageUrl = (url) => {
  if (!url) return "/images/fossil.jpg";
  if (url.includes("drive.google.com/file/d/")) {
    const parts = url.split("drive.google.com/file/d/");
    if (parts.length > 1) {
      const id = parts[1].split("/")[0].split("?")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
  }
  return url;
};

export default function ResearchCard({ item }) {
  const statusClass =
    item.status?.toLowerCase() === "approved" ? "rcBadge-approved" : "rcBadge-pending";

  const slug = item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "";
  const displayImage = getImageUrl(item.image);

  // Avatar Pravatar mapping
  let displayAvatar = item.scientist?.avatar || "";
  if (displayAvatar.startsWith("/researchers/")) {
    const nameLower = item.scientist?.name?.toLowerCase() || "";
    if (nameLower.includes("amelia")) {
      displayAvatar = "https://i.pravatar.cc/150?img=47";
    } else if (nameLower.includes("sophia")) {
      displayAvatar = "https://i.pravatar.cc/150?img=32";
    } else if (nameLower.includes("noah")) {
      displayAvatar = "https://i.pravatar.cc/150?img=12";
    } else if (nameLower.includes("ethan")) {
      displayAvatar = "https://i.pravatar.cc/150?img=53";
    } else if (nameLower.includes("kevin")) {
      displayAvatar = "https://i.pravatar.cc/150?img=11";
    } else if (nameLower.includes("olivia")) {
      displayAvatar = "https://i.pravatar.cc/150?img=45";
    } else {
      displayAvatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(item.scientist?.name || "Explorer")}`;
    }
  } else if (!displayAvatar) {
    displayAvatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(item.scientist?.name || "Explorer")}`;
  }

  const handleOpenDossier = async () => {
    try {
      await fetch(`${API_URL}/research/view?title=${encodeURIComponent(item.title)}`, {
        method: "PUT",
      });
    } catch (err) {
      console.warn("Failed to increment views:", err);
    }
  };

  return (
    <div className="researchCard">
      <div className="rcImageWrap">
        <img src={displayImage} alt={item.title} />
        <span className={`rcBadge ${statusClass}`}>
          {item.status?.toUpperCase()}
        </span>
        <span className="rcEraBadge">{item.era}</span>
      </div>

      <div className="researchContent">
        <h3 className="rcTitle">{item.title}</h3>
        {item.description && (
          <p className="rcDescription">
            {Array.isArray(item.description) ? item.description.join(" ") : item.description}
          </p>
        )}

        <div className="rcScientist">
          <img
            src={displayAvatar}
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
        
        <Link to={`/research/${encodeURIComponent(item.title || slug)}`} className="researchButton" onClick={handleOpenDossier}>
          OPEN DOSSIER
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}

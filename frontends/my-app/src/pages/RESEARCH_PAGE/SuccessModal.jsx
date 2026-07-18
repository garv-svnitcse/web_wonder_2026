import { FaCheckCircle, FaTimes } from "react-icons/fa";

export default function SuccessModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="successModalOverlay" onClick={onClose}>
      <div className="successModalBox" onClick={(e) => e.stopPropagation()}>
        <button className="successModalClose" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="successIconWrap">
          <div className="successIconGlow" />
          <FaCheckCircle className="successIcon" />
        </div>

        <h2>Research Submitted!</h2>
        <p>
          Your research has been sent for review. Our team will verify your
          findings and notify you once approved.
        </p>

        <button className="successModalBtn" onClick={onClose}>
          Continue Exploring
        </button>
      </div>
    </div>
  );
}

export default function TrustBadges() {
  return (
    <div className="trust">
      <div className="trust-item">
        <span className="ic">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z" />
          </svg>
        </span>
        <div>
          <b>Secure &amp; encrypted</b>Your data is protected
        </div>
      </div>
      <div className="trust-item">
        <span className="ic">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 018 0v3" />
          </svg>
        </span>
        <div>
          <b>Privacy first</b>We never sell your data
        </div>
      </div>
      <div className="trust-item">
        <span className="ic">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
          </svg>
        </span>
        <div>
          <b>AI powered</b>Built for curious minds
        </div>
      </div>
    </div>
  );
}

export default function BrandHeader({ onThemeToggle }) {
  return (
    <>
      <div className="topbar">
        <div className="brand">
          <svg viewBox="0 0 40 40" width="34" height="34" fill="none">
            <circle cx="20" cy="20" r="3" fill="#34d399" />
            <circle cx="20" cy="6" r="2.2" fill="#22d3ee" />
            <circle cx="34" cy="14" r="2.2" fill="#34d399" />
            <circle cx="34" cy="26" r="2.2" fill="#22d3ee" />
            <circle cx="20" cy="34" r="2.2" fill="#34d399" />
            <circle cx="6" cy="26" r="2.2" fill="#22d3ee" />
            <circle cx="6" cy="14" r="2.2" fill="#34d399" />
            <g stroke="#34d399" strokeWidth="1" opacity="0.55">
              <line x1="20" y1="20" x2="20" y2="6" />
              <line x1="20" y1="20" x2="34" y2="14" />
              <line x1="20" y1="20" x2="34" y2="26" />
              <line x1="20" y1="20" x2="20" y2="34" />
              <line x1="20" y1="20" x2="6" y2="26" />
              <line x1="20" y1="20" x2="6" y2="14" />
            </g>
          </svg>
          <div className="brand-name">
            Web<span>Wonder</span>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="chip-btn" aria-label="Language">
            🌐 English
          </button>
          <button
            className="chip-btn"
            aria-label="Toggle theme"
            onClick={onThemeToggle}
          >
            ☀
          </button>
        </div>
      </div>

      <div className="hero">
        <div className="hero-mark">
          <svg viewBox="0 0 100 100" width="76" height="76">
            <circle cx="50" cy="50" r="4" fill="#34d399" />
            <g stroke="url(#g1)" strokeWidth="1.2" opacity="0.7">
              <line x1="50" y1="50" x2="50" y2="14" />
              <line x1="50" y1="50" x2="80" y2="32" />
              <line x1="50" y1="50" x2="80" y2="68" />
              <line x1="50" y1="50" x2="50" y2="86" />
              <line x1="50" y1="50" x2="20" y2="68" />
              <line x1="50" y1="50" x2="20" y2="32" />
            </g>
            <circle cx="50" cy="14" r="3" fill="#22d3ee" />
            <circle cx="80" cy="32" r="3" fill="#34d399" />
            <circle cx="80" cy="68" r="3" fill="#22d3ee" />
            <circle cx="50" cy="86" r="3" fill="#34d399" />
            <circle cx="20" cy="68" r="3" fill="#22d3ee" />
            <circle cx="20" cy="32" r="3" fill="#34d399" />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#34d399" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1>
          Web<span>Wonder</span>
        </h1>
        <p>Where curiosity connects.</p>
        <div className="hero-rule"></div>
      </div>
    </>
  );
}

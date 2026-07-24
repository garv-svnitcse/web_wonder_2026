const LABELS = ["Weak", "Fair", "Good", "Strong"];
const COLORS = ["#f87171", "#fbbf24", "#34d399", "#22d3ee"];

export default function PasswordStrengthMeter({ score }) {
  const label = score < 0 ? "—" : LABELS[score];
  const color = score < 0 ? "var(--muted)" : COLORS[score];

  return (
    <div className="strength">
      <div className="strength-top">
        <span>Password strength</span>
        <span className="strength-label" style={{ color }}>
          {label}
        </span>
      </div>
      <div className="strength-bars">
        {[0, 1, 2, 3].map((i) => (
          <i
            key={i}
            style={{
              background: i <= score ? COLORS[score] : "rgba(255,255,255,0.07)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

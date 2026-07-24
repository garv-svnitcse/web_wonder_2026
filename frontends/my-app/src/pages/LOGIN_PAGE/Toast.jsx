export default function Toast({ show, message }) {
  return (
    <div className={`toast ${show ? "show" : ""}`}>
      <span className="dot"></span>
      <span>{message}</span>
    </div>
  );
}

export default function AuthFooter() {
  return (
    <footer className="authFooter">
      <div className="row1">
        Need help?{" "}
        <a href="#" className="link-accent">
          Contact support
        </a>
      </div>
      <div>© 2026 Web Wonder. All rights reserved.</div>
      <div className="badge">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4z" />
        </svg>
        Protected by enterprise-grade security
      </div>
    </footer>
  );
}

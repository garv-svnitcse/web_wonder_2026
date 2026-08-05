import { FaTwitter, FaInstagram, FaYoutube, FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ResearchFooter() {
  return (
    <footer className="rhFooter">
      <div className="rhFooterTop">
        <div className="rhFooterBrand">
          <div className="rhFooterLogo">
            <span className="rhFooterLogoIcon">🦕</span>
            <h3>JURRASIVERSE</h3>
          </div>
          <p>Exploring the past. Understanding our future.</p>
        </div>

        <div className="rhFooterCol">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/dinosaur">Explore Dinosaurs</Link>
          <Link to="/timeline">Timeline</Link>
        </div>

        <div className="rhFooterCol">
          <h4>Community</h4>
          <Link to="/research">Research</Link>
          <Link to="/community">Community Feed</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>

        <div className="rhFooterCol">
          <h4>Support</h4>
          <Link to="/help">Help Center</Link>
          <Link to="/guidelines">Guidelines</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="rhFooterCol">
          <h4>Stay Connected</h4>
          <div className="rhFooterSocials">
            <a href="#">
              <FaTwitter />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaYoutube />
            </a>
            <a href="#">
              <FaDiscord />
            </a>
          </div>
        </div>
      </div>

      <div className="rhFooterBottom">
        <p>© 2026 Jurrasiverse. All rights reserved.</p>
      </div>
    </footer>
  );
}

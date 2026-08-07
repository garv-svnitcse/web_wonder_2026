import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    FaInstagram,
    FaGithub,
    FaLinkedin,
    FaYoutube,
    FaDiscord,
    FaArrowUp
} from "react-icons/fa";

import "./Footer.css";

export default function Footer() {

    const scrollTop = () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };

    return (

        <footer className="footer">

            <div className="footerBackground">

                <video

                    autoPlay

                    muted

                    loop

                    playsInline

                    className="footerVideo"

                >

                    <source

                        src="/videos/footer.mp4"

                        type="video/mp4"

                    />

                </video>

                <div className="footerOverlay"></div>

            </div>

            <div className="footerContent">

                <motion.div

                    className="footerTop"

                    initial={{

                        opacity: 0,

                        y: 60

                    }}

                    whileInView={{

                        opacity: 1,

                        y: 0

                    }}

                    viewport={{

                        once: true

                    }}

                    transition={{

                        duration: .8

                    }}

                >

                    <div className="footerLogo">

                        <h2>

                            🦖 JURASSIC JOURNEY

                        </h2>

                        <p>

                            Explore Earth's greatest prehistoric adventure.

                            Travel through millions of years,

                            discover legendary dinosaurs,

                            unlock DNA archives

                            and become part of the expedition.

                        </p>

                        <div className="footerIcons">

                            <a href="https://www.instagram.com/">

                                <FaInstagram />

                            </a>

                            <a href="https://github.com/garv-svnitcse/web_wonder_2026">

                                <FaGithub />

                            </a>

                            <a href="https://www.linkedin.com/in/">

                                <FaLinkedin />

                            </a>

                            <a href="https://www.youtube.com/">

                                <FaYoutube />

                            </a>

                            <a href="https://www.discord.com/">

                                <FaDiscord />

                            </a>

                        </div>

                    </div>

                    <div className="footerLinks">

                        <h3>

                            Explore

                        </h3>

                        <ul>

                            <li>

                                <Link to="/">

                                    Home

                                </Link>

                            </li>

                            <li>

                                <Link to="/timeline">

                                    Timeline

                                </Link>

                            </li>

                            <li>

                                <Link to="/research">

                                    Research

                                </Link>

                            </li>

                            <li>

                                <Link to="/testimonials">

                                    Testimonials

                                </Link>

                            </li>

                            <li>

                                <Link to="/quiz">

                                    Quiz

                                </Link>

                            </li>

                        </ul>

                    </div>

                    <div className="footerLinks">

                        <h3>

                            Resources

                        </h3>

                        <ul>

                            <li>

                                <Link to="/community">

                                    Community

                                </Link>

                            </li>

                            <li>

                                <Link to="/about">

                                    About

                                </Link>

                            </li>

                            <li>

                                <Link to="/contact">

                                    Contact

                                </Link>

                            </li>

                            <li>

                                <Link to="/privacy">

                                    Privacy

                                </Link>

                            </li>

                            <li>

                                <Link to="/terms">

                                    Terms

                                </Link>

                            </li>

                        </ul>

                    </div>
                    <div className="footerNewsletter">

                        <h3>

                            Expedition Updates

                        </h3>

                        <p>

                            Receive the latest discoveries, new species,
                            timeline updates, and explorer testimonials.

                        </p>

                        <div className="newsletterBox">

                            <input

                                type="email"

                                placeholder="Enter your email"

                            />

                            <button>

                                Join

                            </button>

                        </div>

                    </div>

                </motion.div>

                <div className="footerBottom">

                    <p>

                        © 2026 Jurassic Journey • Built for Web Wonder Competition

                    </p>

                    <button

                        className="scrollTop"

                        onClick={scrollTop}

                    >

                        <FaArrowUp />

                    </button>

                </div>

            </div>

        </footer>

    );

}
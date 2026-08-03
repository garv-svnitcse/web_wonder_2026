import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import GlassAuthModal from "../GlassAuthModal";

import {
    FaBars,
    FaTimes,
    FaHome,
    FaFlask,
    FaUsers,
    FaQuestionCircle,
    FaCommentAlt,
    FaFilm
} from "react-icons/fa";

import { GiDinosaurBones, GiDna2 } from "react-icons/gi";
import { MdTimeline } from "react-icons/md";

import "./Navbar.css";

const navItems = [

    {
        title: "Home",
        icon: <FaHome />,
        path: "/"
    },

    {
        title: "Dinosaurs",
        icon: <GiDinosaurBones />,
        path: "/research-database"
    },

    {
        title: "Timeline",
        icon: <MdTimeline />,
        path: "/timeline"
    },

    {
        title: "Cinema",
        icon: <FaFilm />,
        path: "/cinema"
    },

    {
        title: "Testimonials",
        icon: <FaCommentAlt />,
        path: "/testimonials"
    },

    {
        title: "Research",
        icon: <FaFlask />,
        path: "/research"
    },

    {
        title: "Quiz",
        icon: <FaQuestionCircle />,
        path: "/quiz"
    },

    {
        title: "Community",
        icon: <FaUsers />,
        path: "/community"
    }

];

export default function Navbar({ isLoggedIn: propIsLoggedIn }) {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    const [visible, setVisible] = useState(true);

    const getStoredToken = () => {
        const val = localStorage.getItem('access_token');
        if (!val) return '';
        const clean = val.trim();
        const parts = clean.split('.');
        if (parts.length !== 3) {
            return '';
        }
        return clean;
    };

    const [isLoggedIn, setIsLoggedIn] = useState(!!getStoredToken());

    useEffect(() => {
        setIsLoggedIn(propIsLoggedIn !== undefined ? propIsLoggedIn : !!getStoredToken());
    }, [propIsLoggedIn]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
        navigate('/');
        window.location.reload();
    };

    const handleBeginExpedition = () => {
        navigate('/quiz');
    };

    useEffect(() => {

        const handleScroll = () => {

            const currentScrollY = window.scrollY;

            if (currentScrollY > 50) {

                setVisible(false);

            } else {

                setVisible(true);

            }

            setScrolled(currentScrollY > 20);

        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    useEffect(() => {
        if (!open) return undefined;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    return (

        <>
            <motion.header

                initial={{

                    y: -120,

                    opacity: 0

                }}

                animate={{

                    y: 0,

                    opacity: 1

                }}

                transition={{

                    duration: 1

                }}

                className={`navbar ${scrolled ? "navbarScrolled" : ""} ${visible ? "" : "navbar-hidden"}`}

            >

                <div className="navbarGlass">

                    <div className="logoSection">

                        <div className="logoCircle">

                            🦖

                        </div>

                        <div className="logoText">

                            <h2>

                                JURASSIC

                            </h2>

                            <h1>

                                JOURNEY

                            </h1>

                            <p>

                                PREHISTORIC EXPEDITION

                            </p>

                        </div>

                    </div>

                    <nav className="desktopNavigation">

                        {

                            navItems.map(item => (

                                <NavLink

                                    key={item.title}

                                    to={item.path}

                                    className={({ isActive }) =>

                                        isActive

                                            ?

                                            "active"

                                            :

                                            ""

                                    }

                                >

                                    <span className="navIcon">

                                        {item.icon}

                                    </span>

                                    <span>

                                        {item.title}

                                    </span>

                                </NavLink>

                            ))

                        }

                    </nav>

                    <div className="navbarButtons">

                        {isLoggedIn ? (
                            <button
                                className="expeditionButton"
                                onClick={handleLogout}
                                style={{
                                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                                    color: '#ffffff'
                                }}
                            >
                                LOGOUT
                            </button>
                        ) : (
                            <button
                                className="expeditionButton"
                                onClick={handleBeginExpedition}
                            >
                                BEGIN EXPEDITION
                            </button>
                        )}

                        <button

                            className="mobileMenu"

                            onClick={() => setOpen(true)}

                            aria-label="Open navigation menu"

                            aria-expanded={open}

                        >

                            <FaBars />

                        </button>

                    </div>
                    {createPortal(<AnimatePresence>

                        {

                            open && (

                                <>

                                    <motion.div

                                        className="mobileOverlay"

                                        initial={{ opacity: 0 }}

                                        animate={{ opacity: 1 }}

                                        exit={{ opacity: 0 }}

                                        onClick={() => setOpen(false)}

                                    />

                                    <motion.aside

                                        className="mobileSidebar"

                                        initial={{

                                            x: "100%"

                                        }}

                                        animate={{

                                            x: 0

                                        }}

                                        exit={{

                                            x: "100%"

                                        }}

                                        transition={{

                                            duration: .45,

                                            ease: "easeInOut"

                                        }}

                                    >

                                        <div className="mobileTop">

                                            <div className="mobileLogo">

                                                <div className="logoCircle">

                                                    🦖

                                                </div>

                                                <div className="logoText">

                                                    <h2>

                                                        JURASSIC

                                                    </h2>

                                                    <h1>

                                                        JOURNEY

                                                    </h1>

                                                </div>

                                            </div>

                                            <button

                                                className="closeButton"

                                                onClick={() => setOpen(false)}

                                                aria-label="Close navigation menu"

                                            >

                                                <FaTimes />

                                            </button>

                                        </div>

                                        <nav className="mobileNavigation">

                                            {

                                                navItems.map(item => (

                                                    <NavLink

                                                        key={item.title}

                                                        to={item.path}

                                                        onClick={() => setOpen(false)}

                                                        className={({ isActive }) =>

                                                            isActive

                                                                ?

                                                                "active"

                                                                :

                                                                ""

                                                        }

                                                    >

                                                        <span>

                                                            {item.icon}

                                                        </span>

                                                        <p>

                                                            {item.title}

                                                        </p>

                                                    </NavLink>

                                                ))

                                            }

                                        </nav>

                                        <div className="mobileBottom">

                                            {isLoggedIn ? (
                                                <button
                                                    className="mobileCTA"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        handleLogout();
                                                    }}
                                                    style={{
                                                        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                                                        color: '#ffffff'
                                                    }}
                                                >
                                                    LOGOUT
                                                </button>
                                            ) : (
                                                <button
                                                    className="mobileCTA"
                                                    onClick={() => {
                                                        setOpen(false);
                                                        handleBeginExpedition();
                                                    }}
                                                >
                                                    BEGIN EXPEDITION
                                                </button>
                                            )}

                                        </div>

                                    </motion.aside>

                                </>

                            )

                        }

                    </AnimatePresence>, document.body)}

                </div>

            </motion.header>



            <AnimatePresence>
                {!visible && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="navbar-toggle-btn"
                        onClick={() => setVisible(true)}
                        title="Show Menu"
                    >
                        <FaBars />
                    </motion.button>
                )}
            </AnimatePresence>

        </>

    );

}

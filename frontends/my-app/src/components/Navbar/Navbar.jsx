import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
    FaBars,
    FaTimes,
    FaSearch,
    FaVolumeUp,
    FaVolumeMute,
    FaHome,
    FaFlask,
    FaUsers,
    FaQuestionCircle
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
        path: "/research"
    },

    {
        title: "Timeline",
        icon: <MdTimeline />,
        path: "/timeline"
    },

    {
        title: "DNA Lab",
        icon: <GiDna2 />,
        path: "/dna"
    },

    {
        title: "Research",
        icon: <FaFlask />,
        path: "/community"
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

export default function Navbar() {

    const [open, setOpen] = useState(false);

    const [sound, setSound] = useState(true);

    const [scrolled, setScrolled] = useState(false);

    const [visible, setVisible] = useState(true);

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

                        <button

                            className="circleButton"

                        >

                            <FaSearch />

                        </button>

                        <button

                            className="circleButton"

                            onClick={() => setSound(!sound)}

                        >

                            {

                                sound

                                    ?

                                    <FaVolumeUp />

                                    :

                                    <FaVolumeMute />

                            }

                        </button>

                        <button

                            className="expeditionButton"

                        >

                            BEGIN EXPEDITION

                        </button>

                        <button

                            className="mobileMenu"

                            onClick={() => setOpen(true)}

                        >

                            <FaBars />

                        </button>

                    </div>
                    <AnimatePresence>

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

                                            <button

                                                className="mobileCTA"

                                                onClick={() => setOpen(false)}

                                            >

                                                BEGIN EXPEDITION

                                            </button>

                                        </div>

                                    </motion.aside>

                                </>

                            )

                        }

                    </AnimatePresence>

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
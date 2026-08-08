import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import "./Hero.css";

export default function Hero() {

    const heroRef = useRef(null);

    const [offset, setOffset] = useState(0);
    const [introModalOpen, setIntroModalOpen] = useState(false);

    useEffect(() => {

        const handleScroll = () => {

            setOffset(window.scrollY);

        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);

    }, []);

    return (

        <section

            ref={heroRef}

            className="hero"

        >

            <div

                className="heroBackground"

                style={{

                    transform: `scale(1.1) translateY(${offset * .18}px)`

                }}

            >

                <div className="heroGradient"></div>

                <div className="heroFog heroFogOne"></div>

                <div className="heroFog heroFogTwo"></div>

                <div className="heroNoise"></div>

                <div className="heroGlow"></div>

                <div className="heroVignette"></div>

            </div>

            <div className="heroContainer">

                <motion.div

                    className="heroContent"

                    initial={{

                        opacity: 0,

                        y: 80

                    }}

                    animate={{

                        opacity: 1,

                        y: 0

                    }}

                    transition={{

                        duration: 1.4

                    }}

                >

                    <motion.span

                        className="heroTag"

                        initial={{

                            opacity: 0

                        }}

                        animate={{

                            opacity: 1

                        }}

                        transition={{

                            delay: .5

                        }}

                    >

                        WELCOME EXPLORER

                    </motion.span>

                    <motion.h1

                        className="heroTitle"

                        initial={{

                            opacity: 0,

                            y: 60

                        }}

                        animate={{

                            opacity: 1,

                            y: 0

                        }}

                        transition={{

                            duration: 1,

                            delay: .3

                        }}

                    >

                        JURASSIC

                        <br />

                        JOURNEY

                    </motion.h1>

                    <motion.p

                        className="heroDescription"

                        initial={{

                            opacity: 0

                        }}

                        animate={{

                            opacity: 1

                        }}

                        transition={{

                            delay: .9

                        }}

                    >

                        Millions of years ago giant creatures ruled the Earth.

                        Begin your expedition through prehistoric forests,

                        discover legendary dinosaurs,

                        explore research archives,

                        travel across ancient timelines,

                        and unlock the secrets hidden inside the DNA Laboratory.

                    </motion.p>

                    <div className="heroButtons">

                        <motion.button

                            whileHover={{

                                scale: 1.05

                            }}

                            whileTap={{

                                scale: .95

                            }}

                            className="primaryHeroButton"

                        >

                            BEGIN EXPEDITION

                            <FaArrowRight />

                        </motion.button>

                        <motion.button

                            whileHover={{

                                scale: 1.05

                            }}

                            whileTap={{

                                scale: .95

                            }}

                            className="secondaryHeroButton"
                            onClick={() => setIntroModalOpen(true)}

                        >

                            WATCH INTRO

                        </motion.button>

                    </div>
                    <motion.div

                        className="heroStats"

                        initial={{
                            opacity: 0,
                            y: 60
                        }}

                        animate={{
                            opacity: 1,
                            y: 0
                        }}

                        transition={{
                            delay: 1.3,
                            duration: 1
                        }}

                    >

                        <div className="stat">

                            <h2>

                                252M+

                            </h2>

                            <span>

                                YEARS OF HISTORY

                            </span>

                        </div>

                        <div className="stat">

                            <h2>

                                1200+

                            </h2>

                            <span>

                                DISCOVERED SPECIES

                            </span>

                        </div>

                        <div className="stat">

                            <h2>

                                65M

                            </h2>

                            <span>

                                YEARS SINCE EXTINCTION

                            </span>

                        </div>

                    </motion.div>

                </motion.div>

                {/* RIGHT SIDE */}

                <motion.div

                    className="heroRight"

                    initial={{
                        opacity: 0,
                        x: 100
                    }}

                    animate={{
                        opacity: 1,
                        x: 0
                    }}

                    transition={{
                        duration: 1.2,
                        delay: .6
                    }}

                >

                    <div className="dinosaurSilhouette">

                        <div className="shadowCircle"></div>

                        <img

                            src="https://drive.google.com/thumbnail?sz=w1000&id=1uj1mK3w49HfUngjBUlvSw48xq5wgBJ16"

                            alt="Tyrannosaurus Rex"

                        />

                    </div>

                </motion.div>

            </div>

            {/* SCROLL INDICATOR */}

            <motion.div

                className="scrollIndicator"

                animate={{

                    y: [0, 18, 0]

                }}

                transition={{

                    repeat: Infinity,

                    duration: 2

                }}

            >

                <span>

                    SCROLL

                </span>

                <div className="mouse">

                    <div className="wheel"></div>

                </div>

            </motion.div>

            {/* FLOATING PARTICLES */}

            <div className="particles">

                {

                    [...Array(25)].map((_, index) => (

                        <span

                            key={index}

                            className="particle"

                            style={{

                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 10}s`,
                                animationDuration: `${8 + Math.random() * 10}s`

                            }}

                        ></span>

                    ))

                }

            </div>

            <div className="heroBottomFade"></div>

            {introModalOpen && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.85)",
                    backdropFilter: "blur(12px)",
                    padding: "20px"
                }}>
                    <div style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "900px",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid rgba(214,161,75,0.4)",
                        background: "#08110B",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.9)"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "16px 24px",
                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(214,161,75,0.08)"
                        }}>
                            <h3 style={{ color: "#D6A14B", fontFamily: "Cinzel, serif", margin: 0, fontSize: "16px", letterSpacing: "2px" }}>
                                Jurassic Journey Intro Documentary
                            </h3>
                            <button
                                onClick={() => setIntroModalOpen(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#D6A14B",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    padding: "4px 8px"
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000" }}>
                            <iframe
                                src="https://www.youtube.com/embed/fFKEedgHd9U?autoplay=1&rel=0&modestbranding=1&enablejsapi=1"
                                title="Jurassic Journey Intro Documentary"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                            />
                        </div>
                    </div>
                </div>
            )}

        </section>

    );

}
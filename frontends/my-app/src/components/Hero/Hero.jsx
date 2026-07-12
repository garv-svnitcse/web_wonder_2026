import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import "./Hero.css";

export default function Hero() {

    const heroRef = useRef(null);

    const [offset, setOffset] = useState(0);

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

                            src="/src/images/trex-silhouette.png"

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

            {/* BOTTOM FADE */}

            <div className="heroBottomFade"></div>

        </section>

    );

}
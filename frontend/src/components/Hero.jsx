import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import "../styles/Hero.css";

export default function Hero() {

    return(

        <section className="hero">

            {/* Background */}

            <div className="heroBackground"></div>

            <div className="heroOverlay"></div>

            <div className="heroFog"></div>

            <div className="heroGradient"></div>

            {/* Left */}

            <motion.div

                className="heroLeft"

                initial={{
                    opacity:0,
                    x:-80
                }}

                animate={{
                    opacity:1,
                    x:0
                }}

                transition={{
                    duration:1
                }}

            >

                <span>

                    PREHISTORIC EXPERIENCE

                </span>

                <h1>

                    JURASSIC
                    <br/>
                    JOURNEY

                </h1>

                <p>

                    Enter a forgotten world where colossal creatures once ruled
                    the Earth. Explore research, fossils, timelines and
                    interactive experiences inspired by millions of years of
                    evolution.

                </p>

                <div className="heroButtons">

                    <button className="primary">

                        BEGIN EXPEDITION

                        <FaArrowRight/>

                    </button>

                    <button className="secondary">

                        WATCH INTRO

                    </button>

                </div>

            </motion.div>

            {/* Right */}

            <motion.div

                className="heroRight"

                initial={{
                    opacity:0,
                    x:80
                }}

                animate={{
                    opacity:1,
                    x:0
                }}

                transition={{
                    duration:1,
                    delay:.3
                }}

            >

                <div className="floatingCard">

                    <span>

                        FEATURED SPECIES

                    </span>

                    <h2>

                        TYRANNOSAURUS
                        <br/>
                        REX

                    </h2>

                    <p>

                        Late Cretaceous

                    </p>

                </div>

            </motion.div>

            {/* Bottom */}

            <div className="heroBottom">

                <div>

                    <h3>

                        250+

                    </h3>

                    <span>

                        Fossils

                    </span>

                </div>

                <div>

                    <h3>

                        180+

                    </h3>

                    <span>

                        Dinosaurs

                    </span>

                </div>

                <div>

                    <h3>

                        65 M

                    </h3>

                    <span>

                        Years Ago

                    </span>

                </div>

            </div>

        </section>

    )

}
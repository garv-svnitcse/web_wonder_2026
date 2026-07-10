import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaDna,
    FaFlask,
    FaBrain,
    FaArrowRight
} from "react-icons/fa";

import "./DNALab.css";

const dinosaurs = [

    "Tyrannosaurus Rex",

    "Spinosaurus",

    "Velociraptor",

    "Triceratops",

    "Brachiosaurus",

    "Ankylosaurus",

    "Parasaurolophus",

    "Carnotaurus"

];

export default function DNALab() {

    const [selected, setSelected] = useState(dinosaurs[0]);

    return (

        <section className="dnaLab">

            <div className="dnaHeading">

                <span>

                    GENETIC ENGINEERING

                </span>

                <h2>

                    DNA Laboratory

                </h2>

                <p>

                    Extract prehistoric DNA and generate detailed reports
                    from the world's most advanced dinosaur database.

                </p>

            </div>

            <div className="dnaContainer">

                <div className="dnaLeft">

                    <motion.div

                        className="dnaTerminal"

                        initial={{

                            opacity: 0,

                            x: -80

                        }}

                        whileInView={{

                            opacity: 1,

                            x: 0

                        }}

                        viewport={{

                            once: true

                        }}

                        transition={{

                            duration: .8

                        }}

                    >

                        <div className="terminalTop">

                            <div className="terminalLights">

                                <span></span>

                                <span></span>

                                <span></span>

                            </div>

                            <p>

                                GENOME ANALYSIS TERMINAL

                            </p>

                        </div>

                        <div className="terminalBody">

                            <label>

                                Select Species

                            </label>

                            <select

                                value={selected}

                                onChange={(e) => setSelected(e.target.value)}

                            >

                                {

                                    dinosaurs.map((d, index) => (

                                        <option

                                            key={index}

                                        >

                                            {d}

                                        </option>

                                    ))

                                }

                            </select>

                            <button>

                                <FaDna />

                                ANALYZE DNA

                            </button>
                        </div>

                    </motion.div>

                </div>

                <motion.div

                    className="dnaRight"

                    initial={{

                        opacity: 0,

                        x: 80

                    }}

                    whileInView={{

                        opacity: 1,

                        x: 0

                    }}

                    viewport={{

                        once: true

                    }}

                    transition={{

                        duration: .8,

                        delay: .2

                    }}

                >

                    <div className="analysisCard">

                        <div className="analysisHeader">

                            <FaFlask />

                            <h3>

                                Genome Report

                            </h3>

                        </div>

                        <div className="analysisGrid">

                            <div>

                                <h4>

                                    Species

                                </h4>

                                <p>

                                    {selected}

                                </p>

                            </div>

                            <div>

                                <h4>

                                    DNA Integrity

                                </h4>

                                <p>

                                    98.7%

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Threat Level

                                </h4>

                                <p>

                                    EXTREME

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Genome Status

                                </h4>

                                <p>

                                    Stable

                                </p>

                            </div>

                        </div>

                        <div className="brainCard">

                            <FaBrain />

                            <div>

                                <h4>

                                    AI Observation

                                </h4>

                                <p>

                                    This genome shows exceptional preservation and can
                                    be reconstructed with minimal genetic loss.

                                </p>

                            </div>

                        </div>

                        <button

                            className="dnaButton"

                        >

                            Generate Full Report

                            <FaArrowRight />

                        </button>

                    </div>

                </motion.div>

            </div>

        </section>

    );

}
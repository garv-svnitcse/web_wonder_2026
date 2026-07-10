import { motion } from "framer-motion";
import "./Timeline.css";

const eras = [

    {

        period: "TRIASSIC",

        years: "252 - 201 Million Years Ago",

        video: "/videos/triassic.mp4",

        color: "#B96A3A",

        description:
            "The first dinosaurs emerged as the supercontinent Pangaea dominated the Earth."

    },

    {

        period: "JURASSIC",

        years: "201 - 145 Million Years Ago",

        video: "/videos/jurassic.mp4",

        color: "#4C8A4F",

        description:
            "Gigantic sauropods flourished while lush forests spread across the planet."

    },

    {

        period: "CRETACEOUS",

        years: "145 - 66 Million Years Ago",

        video: "/videos/cretaceous.mp4",

        color: "#D6A14B",

        description:
            "The age of Tyrannosaurus Rex, Triceratops and flowering plants before extinction."

    }

];

export default function Timeline() {

    return (

        <section className="timeline">

            <div className="timelineHeading">

                <span>

                    JOURNEY THROUGH TIME

                </span>

                <h2>

                    The Age Of Dinosaurs

                </h2>

                <p>

                    Travel through millions of years as prehistoric life evolved across three incredible eras.

                </p>

            </div>

            <div className="timelineWrapper">

                {

                    eras.map((era, index) => (

                        <motion.div

                            key={index}

                            className="timelineCard"

                            initial={{

                                opacity: 0,

                                y: 80

                            }}

                            whileInView={{

                                opacity: 1,

                                y: 0

                            }}

                            viewport={{

                                once: true

                            }}

                            transition={{

                                duration: .8,

                                delay: index * .2

                            }}

                        >

                            <video

                                className="timelineVideo"

                                autoPlay

                                muted

                                loop

                                playsInline

                            >

                                <source

                                    src={era.video}

                                    type="video/mp4"

                                />

                            </video>

                            <div

                                className="timelineOverlay"

                                style={{

                                    background: `linear-gradient(to right, ${era.color}22, rgba(8,17,11,.95))`

                                }}

                            ></div>

                            <div className="timelineContent">

                                <span>

                                    {era.years}

                                </span>

                                <h2>

                                    {era.period}

                                </h2>

                                <p>

                                    {era.description}

                                </p>
                                <div className="timelineLine">

                                    <div
                                        className="timelineDot"
                                        style={{
                                            background: era.color
                                        }}
                                    ></div>

                                </div>

                                <div className="timelineFacts">

                                    <div className="fact">

                                        <h4>

                                            Climate

                                        </h4>

                                        <p>

                                            Warm & Humid

                                        </p>

                                    </div>

                                    <div className="fact">

                                        <h4>

                                            Dominant Species

                                        </h4>

                                        <p>

                                            Dinosaurs

                                        </p>

                                    </div>

                                    <div className="fact">

                                        <h4>

                                            Major Event

                                        </h4>

                                        <p>

                                            Evolution Peak

                                        </p>

                                    </div>

                                </div>

                                <button

                                    className="timelineButton"

                                >

                                    Explore Era

                                </button>

                            </div>

                        </motion.div>

                    ))

                }

            </div>

        </section>

    );

}
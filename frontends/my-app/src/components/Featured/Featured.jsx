import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import "./Featured.css";

const dinosaurs = [

    {

        name: "TYRANNOSAURUS REX",

        era: "Late Cretaceous",

        image: "/images/trex.webp",

        video: "/videos/trex.mp4",

        length: "12.3 m",

        weight: "8.4 Tons",

        speed: "27 km/h",

        diet: "Carnivore"

    },

    {

        name: "SPINOSAURUS",

        era: "Late Cretaceous",

        image: "/images/spino.webp",

        video: "/videos/spino.mp4",

        length: "15 m",

        weight: "7.5 Tons",

        speed: "24 km/h",

        diet: "Piscivore"

    },

    {

        name: "VELOCIRAPTOR",

        era: "Late Cretaceous",

        image: "/images/raptor.webp",

        video: "/videos/raptor.mp4",

        length: "2 m",

        weight: "15 kg",

        speed: "40 km/h",

        diet: "Carnivore"

    }

];

export default function Featured() {

    return (

        <section className="featured">

            <div className="featuredHeading">

                <span>

                    LEGENDARY CREATURES

                </span>

                <h2>

                    Meet The Giants

                </h2>

                <p>

                    Explore Earth's greatest predators and herbivores through cinematic showcases.

                </p>

            </div>

            <div className="featuredWrapper">

                {

                    dinosaurs.map((dinosaur, index) => (

                        <motion.div

                            className="featuredCard"

                            key={index}

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

                                delay: index * .15

                            }}

                        >

                            <video

                                className="featuredVideo"

                                autoPlay

                                muted

                                loop

                                playsInline

                            >

                                <source

                                    src={dinosaur.video}

                                    type="video/mp4"

                                />

                            </video>

                            <div className="featuredOverlay"></div>

                            <div className="featuredContent">

                                <span>

                                    {dinosaur.era}

                                </span>

                                <h2>

                                    {dinosaur.name}

                                </h2>
                                <div className="featuredStats">

                                    <div className="statBox">

                                        <h4>

                                            LENGTH

                                        </h4>

                                        <p>

                                            {dinosaur.length}

                                        </p>

                                    </div>

                                    <div className="statBox">

                                        <h4>

                                            WEIGHT

                                        </h4>

                                        <p>

                                            {dinosaur.weight}

                                        </p>

                                    </div>

                                    <div className="statBox">

                                        <h4>

                                            SPEED

                                        </h4>

                                        <p>

                                            {dinosaur.speed}

                                        </p>

                                    </div>

                                    <div className="statBox">

                                        <h4>

                                            DIET

                                        </h4>

                                        <p>

                                            {dinosaur.diet}

                                        </p>

                                    </div>

                                </div>

                                <button

                                    className="featuredButton"

                                >

                                    VIEW DOSSIER

                                    <FaArrowRight />

                                </button>

                            </div>

                        </motion.div>

                    ))

                }

            </div>

        </section>

    );

}
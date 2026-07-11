import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./Expedition.css";

const cards = [
    {
        title: "DINOSAURS",
        subtitle: "Meet The Giants",
        video: "/videos/trex.mp4",
        description:
            "Encounter the most iconic predators and herbivores that once ruled the Earth.",
        link: "/research",
    },
    {
        title: "TIMELINE",
        subtitle: "Journey Through Time",
        video: "/videos/timeline.mp4",
        description:
            "Travel across the Triassic, Jurassic and Cretaceous periods.",
        link: "/timeline",
    },
    {
        title: "DNA LAB",
        subtitle: "Genetic Research",
        video: "/videos/dna.mp4",
        description:
            "Explore prehistoric genetics through an interactive DNA laboratory.",
        link: "/dna",
    },
    {
        title: "RESEARCH",
        subtitle: "Scientific Archives",
        video: "/videos/research.mp4",
        description:
            "Browse fossils, species reports and classified prehistoric discoveries.",
        link: "/community",
    },
];

export default function Expedition() {
    return (
        <section className="expedition">

            <div className="sectionHeading">

                <span>BEGIN YOUR ADVENTURE</span>

                <h2>Choose Your Expedition</h2>

                <p>
                    Every journey reveals a different side of the prehistoric world.
                    Explore immersive experiences inspired by Jurassic landscapes.
                </p>

            </div>

            <div className="expeditionGrid">

                {cards.map((card, index) => (

                    <motion.div
                        key={index}
                        className="expeditionCard"
                        initial={{
                            opacity: 0,
                            y: 70,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            duration: 0.8,
                            delay: index * 0.15,
                        }}
                        whileHover={{
                            y: -12,
                        }}
                    >

                        <video
                            className="cardVideo"
                            autoPlay
                            muted
                            loop
                            playsInline
                        >
                            <source
                                src={card.video}
                                type="video/mp4"
                            />
                        </video>

                        <div className="cardOverlay"></div>

                        <div className="cardContent">

                            <span>{card.subtitle}</span>

                            <h3>{card.title}</h3>

                            <p>{card.description}</p>
                            <Link
                                to={card.link}
                                className="exploreButton"
                            >
                                <span>

                                    EXPLORE NOW

                                </span>

                                <FaArrowRight />

                            </Link>

                        </div>

                    </motion.div>

                ))}

            </div>

            <motion.div

                className="expeditionBottom"

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

                    duration: 1

                }}

            >

                <p>

                    "The prehistoric world awaits. Every expedition uncovers a
                    forgotten chapter of Earth's greatest creatures."

                </p>

            </motion.div>

        </section>

    );

}
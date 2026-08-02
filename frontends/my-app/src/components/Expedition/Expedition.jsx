import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

import "./Expedition.css";

const cards = [
    {
        title: "DINOSAURS",
        subtitle: "Meet The Giants",
        video: "https://drive.google.com/file/d/1_SZwe3JtLw-RngwDZTGnKYcWsJiLQ90h/view?usp=sharing",
        description:
            "Encounter the most iconic predators and herbivores that once ruled the Earth.",
        link: "/research-database",
    },
    {
        title: "TIMELINE",
        subtitle: "Journey Through Time",
        video: "https://drive.google.com/file/d/1GVmN9hgUHKk-b7QUEVv4eCg10omSfqm3/view?usp=sharing",
        description:
            "Travel across the Triassic, Jurassic and Cretaceous periods.",
        link: "/timeline",
    },
    {
        title: "TESTIMONIALS",
        subtitle: "Explorer Feedback",
        video: "/videos/dna.mp4",
        description:
            "Read reviews and reflections from our distinguished paleontology experts, engineers, and design directors.",
        link: "/testimonials",
    },
    {
        title: "RESEARCH",
        subtitle: "Scientific Archives",
        video: "https://drive.google.com/file/d/1dyZl2lBo_1Vmd6GeXf-YDDAEKQ_7ExRr/view?usp=sharing",
        description:
            "Browse fossils, species reports and classified prehistoric discoveries.",
        link: "/research",
    },
];

function getDirectVideoUrl(url) {
    if (!url) return url;
    if (url.includes("1_SZwe3JtLw-RngwDZTGnKYcWsJiLQ90h")) {
        return "/videos/trex.mp4";
    }
    if (url.includes("1GVmN9hgUHKk-b7QUEVv4eCg10omSfqm3")) {
        return "/videos/timeline.mp4";
    }
    if (url.includes("1dyZl2lBo_1Vmd6GeXf-YDDAEKQ_7ExRr")) {
        return "/videos/research.mp4";
    }
    if (url.includes("drive.google.com/file/d/")) {
        try {
            const fileId = url.split("/file/d/")[1].split("/")[0];
            return `https://docs.google.com/uc?export=download&id=${fileId}`;
        } catch (e) {
            console.error("Error parsing Google Drive video link", e);
        }
    }
    return url;
}

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
                            src={getDirectVideoUrl(card.video)}
                            autoPlay
                            muted
                            loop
                            playsInline
                        />

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
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

import "./Featured.css";

const STATIC_DINOSAURS = [
    {
        name: "TYRANNOSAURUS REX",
        era: "Late Cretaceous",
        image: "/images/trex.webp",
        video: "/videos/trex.mp4",
        length: "12.3 m",
        weight: "8.4 Tons",
        speed: "27 km/h",
        diet: "Carnivore",
        slug: "tyrannosaurus-rex"
    },
    {
        name: "SPINOSAURUS",
        era: "Late Cretaceous",
        image: "/images/spino.webp",
        video: "/videos/spino.mp4",
        length: "15 m",
        weight: "7.5 Tons",
        speed: "24 km/h",
        diet: "Piscivore",
        slug: "spinosaurus"
    },
    {
        name: "VELOCIRAPTOR",
        era: "Late Cretaceous",
        image: "/images/raptor.webp",
        video: "/videos/raptor.mp4",
        length: "2 m",
        weight: "15 kg",
        speed: "40 km/h",
        diet: "Carnivore",
        slug: "velociraptor"
    }
];

export default function Featured() {
    const [dinosaurs, setDinosaurs] = useState(STATIC_DINOSAURS);

    useEffect(() => {
        fetch("/api/timeline/preview")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("HTTP error " + res.status);
                }
                return res.json();
            })
            .then((data) => {
                if (data && Array.isArray(data) && data.length > 0) {
                    setDinosaurs(data);
                }
            })
            .catch((err) => {
                console.warn("Backend timeline preview endpoint unavailable, using static fallback:", err);
            });
    }, []);

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
                    dinosaurs.map((dinosaur, index) => {
                        const nameKey = dinosaur.slug === 'tyrannosaurus-rex' ? 'trex' : 
                                        dinosaur.slug === 'spinosaurus' ? 'spino' : 
                                        dinosaur.slug === 'velociraptor' ? 'raptor' : 
                                        dinosaur.slug || '';
                        const videoSrc = `/videos/${nameKey}.mp4`;

                        const eraText = dinosaur.period || dinosaur.era || 'N/A';
                        const nameText = dinosaur.name?.toUpperCase();
                        const lengthText = dinosaur.length || (dinosaur.physical_stats?.length_m ? `${dinosaur.physical_stats.length_m} m` : "N/A");
                        
                        let weightText = "N/A";
                        if (dinosaur.weight) {
                            weightText = dinosaur.weight;
                        } else if (dinosaur.physical_stats?.weight_tons) {
                            const tons = dinosaur.physical_stats.weight_tons;
                            weightText = tons < 1 ? `${Math.round(tons * 1000)} kg` : `${tons} Tons`;
                        }
                        
                        const speedText = dinosaur.speed || (dinosaur.physical_stats?.speed_kmph ? `${dinosaur.physical_stats.speed_kmph} km/h` : "N/A");

                        return (
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
                                        src={videoSrc}
                                        type="video/mp4"
                                    />
                                </video>

                            <div className="featuredOverlay"></div>

                            <div className="featuredContent">

                                <span>

                                    {eraText}

                                </span>

                                <h2>

                                    {nameText}

                                </h2>
                                <div className="featuredStats">

                                    <div className="statBox">

                                        <h4>

                                            LENGTH

                                        </h4>

                                        <p>

                                            {lengthText}

                                        </p>

                                    </div>

                                    <div className="statBox">

                                        <h4>

                                            WEIGHT

                                        </h4>

                                        <p>

                                            {weightText}

                                        </p>

                                    </div>

                                    <div className="statBox">

                                        <h4>

                                            SPEED

                                        </h4>

                                        <p>

                                            {speedText}

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
                    );
                })
                }

            </div>

        </section>

    );

}
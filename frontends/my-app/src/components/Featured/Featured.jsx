import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

function getDirectVideoUrl(url, slug) {
    if (url) {
        if (url.includes("1wKL-X0mRTPOl2KpwLwZtIqs8MCpb9piw") || url.includes("1_SZwe3JtLw-RngwDZTGnKYcWsJiLQ90h")) {
            return "/videos/trex_featured.mp4";
        }
        if (url.includes("1qOqYwyZIyjOFbyez0BeO6YgBwJ94d1Fg")) {
            return "/videos/triceratops.mp4";
        }
        if (url.includes("1WBkdBiooeQjnyrHgKR_YH4letQBKM-GV")) {
            return "/videos/velociraptor.mp4";
        }
        if (url.includes("1GVmN9hgUHKk-b7QUEVv4eCg10omSfqm3")) {
            return "/videos/timeline.mp4";
        }
        if (url.includes("1dyZl2lBo_1Vmd6GeXf-YDDAEKQ_7ExRr")) {
            return "/videos/research.mp4";
        }
    }

    const nameKey = slug === 'tyrannosaurus-rex' ? 'trex_featured' :
        slug === 'triceratops' || slug === 'triceratops-horridus' ? 'triceratops' :
            slug === 'velociraptor' || slug === 'velociraptor-mongoliensis' ? 'velociraptor' :
                slug === 'spinosaurus' || slug === 'spinosaurus-aegyptiacus' ? 'spino' :
                    slug || '';

    if (['trex_featured', 'triceratops', 'velociraptor'].includes(nameKey)) {
        return `/videos/${nameKey}.mp4`;
    }

    if (url && (url.startsWith("http") || url.startsWith("/"))) {
        return url;
    }

    return `/videos/${nameKey}.mp4`;
}

export default function Featured() {
    const navigate = useNavigate();
    const [dinosaurs, setDinosaurs] = useState(STATIC_DINOSAURS);

    useEffect(() => {
        fetch("http://127.0.0.1:5002/timeline/preview")
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
                        const videoSrc = getDirectVideoUrl(dinosaur.video, dinosaur.slug);

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
                                    src={videoSrc}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />

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
                                        onClick={() => navigate(`/dinosaur/${dinosaur.slug}`)}

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
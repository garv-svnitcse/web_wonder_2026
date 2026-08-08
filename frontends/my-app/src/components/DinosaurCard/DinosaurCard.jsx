import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ruler, Weight, Gauge } from "lucide-react";
import "./DinosaurCard.css";

import trexImg from "../../assets/Dinosaurs_Images/Tyrannosaurus rex.png";
import triceratopsImg from "../../assets/Dinosaurs_Images/Triceratops.png";
import velociraptorImg from "../../assets/Dinosaurs_Images/Velociraptor.png";
import spinosaurusImg from "../../assets/Dinosaurs_Images/Spinosaurus.png";
import brachiosaurusImg from "../../assets/Dinosaurs_Images/Brachiosaurus.png";
import stegosaurusImg from "../../assets/Dinosaurs_Images/Stegosaurus.png";
import ankylosaurusImg from "../../assets/Dinosaurs_Images/Ankylosaurus.png";
import allosaurusImg from "../../assets/Dinosaurs_Images/Allosaurus.png";
import parasaurolophusImg from "../../assets/Dinosaurs_Images/Parasaurolophus.png";
import carnotaurusImg from "../../assets/Dinosaurs_Images/Carnotaurus.png";

const LOCAL_IMAGES = {
    "tyrannosaurus-rex": trexImg,
    "triceratops-horridus": triceratopsImg,
    "velociraptor-mongoliensis": velociraptorImg,
    "spinosaurus-aegyptiacus": spinosaurusImg,
    "brachiosaurus-altithorax": brachiosaurusImg,
    "stegosaurus-stenops": stegosaurusImg,
    "ankylosaurus-magniventris": ankylosaurusImg,
    "allosaurus-fragilis": allosaurusImg,
    "parasaurolophus-walkeri": parasaurolophusImg,
    "carnotaurus": carnotaurusImg
};

const getCardImageUrl = (dino) => {
    if (!dino) return "";

    const rawUrl = dino.thumbnail || dino.image || "";
    if (rawUrl) {
        if (rawUrl.includes("drive.google.com/file/d/")) {
            const parts = rawUrl.split("drive.google.com/file/d/");
            if (parts.length > 1) {
                const id = parts[1].split("/")[0].split("?")[0];
                return `https://lh3.googleusercontent.com/d/${id}=w1000`;
            }
        }
        if (rawUrl.includes("drive.google.com/thumbnail?id=")) {
            const parts = rawUrl.split("id=");
            if (parts.length > 1) {
                const id = parts[1].split("&")[0];
                return `https://lh3.googleusercontent.com/d/${id}=w1000`;
            }
        }
        if (rawUrl.includes("drive.google.com/thumbnail?sz=")) {
            const match = rawUrl.match(/id=([^&]+)/);
            if (match && match[1]) {
                return `https://lh3.googleusercontent.com/d/${match[1]}=w1000`;
            }
        }
        return rawUrl;
    }

    const slug = dino.slug || "";
    if (LOCAL_IMAGES[slug]) {
        return LOCAL_IMAGES[slug];
    }
    for (const key of Object.keys(LOCAL_IMAGES)) {
        if (slug.includes(key) || key.includes(slug)) {
            return LOCAL_IMAGES[key];
        }
    }
    return "/images/trex.webp";
};

export default function DinosaurCard({ dinosaur }) {
    const navigate = useNavigate();

    function openDinosaur() {
        if (dinosaur?.slug) {
            navigate(`/dinosaur/${dinosaur.slug}`);
        }
    }

    if (!dinosaur) return null;

    const eraText = dinosaur.period || dinosaur.era || "LATE JURASSIC";
    const dietText = dinosaur.diet || "HERBIVORE";
    const threatText = dinosaur.threat || dinosaur.danger || "LOW";

    const lengthVal = dinosaur.length || (dinosaur.length_m != null ? `${dinosaur.length_m} m` : "25.0 m");
    const weightVal = dinosaur.weight || (dinosaur.weight_tons != null ? `${dinosaur.weight_tons} Tons` : "50.0 Tons");
    const speedVal = dinosaur.speed || (dinosaur.speed_kmph != null ? `${dinosaur.speed_kmph} km/h` : "12 km/h");
    const sciName = dinosaur.scientificName || dinosaur.scientific_name || (dinosaur.name ? `${dinosaur.name} altithorax` : "");

    return (
        <motion.div
            className="dinosaurCard"
            onClick={openDinosaur}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            {/* Top Image Banner & Badges */}
            <div className="cardPosterWrapper">
                <div className="cardBadges">
                    <span className="badge era">{eraText}</span>
                    <div className="cardBadgesRight">
                        <span className={`badge diet ${dietText.toLowerCase()}`}>{dietText}</span>
                        <span className={`badge threat ${threatText.toLowerCase()}`}>{threatText}</span>
                    </div>
                </div>

                <img
                    src={getCardImageUrl(dinosaur)}
                    alt={dinosaur.name}
                    className="dinoCardImage"
                />
                <div className="posterGradientFade" />
            </div>

            {/* Main Content Area */}
            <div className="cardBody">
                <h2 className="dinoCardTitle">{dinosaur.name}</h2>
                {sciName && <p className="dinoCardSub">{sciName}</p>}

                <p className="cardDescription">{dinosaur.description}</p>

                {/* Bottom Vector Icon Metrics Grid */}
                <div className="statsGrid">
                    <div className="statItem">
                        <Ruler className="statIcon" size={20} />
                        <div>
                            <span className="statLabel">LENGTH</span>
                            <span className="statValue">{lengthVal}</span>
                        </div>
                    </div>

                    <div className="statItem">
                        <Weight className="statIcon" size={20} />
                        <div>
                            <span className="statLabel">WEIGHT</span>
                            <span className="statValue">{weightVal}</span>
                        </div>
                    </div>

                    <div className="statItem">
                        <Gauge className="statIcon" size={20} />
                        <div>
                            <span className="statLabel">SPEED</span>
                            <span className="statValue">{speedVal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
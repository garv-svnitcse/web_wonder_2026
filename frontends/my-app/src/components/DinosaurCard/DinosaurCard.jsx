import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

    // 1. Prioritize backend-provided image (parse Drive link if needed)
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

    // 2. Fallback to whitelisted compiled local images
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

        navigate(`/dinosaur/${dinosaur.slug}`);

    }

    return (

        <motion.div

            className="dinosaurCard"

            whileHover={{

                y: -12

            }}

            transition={{

                duration: .35

            }}

        >

            <div className="cardBadges">
                {dinosaur.era && (
                    <span className="badge era">
                        {dinosaur.era}
                    </span>
                )}

                <div className="cardBadgesRight">
                    {dinosaur.diet && (
                        <span className="badge diet">
                            {dinosaur.diet}
                        </span>
                    )}

                    {(dinosaur.threat || dinosaur.danger) && (
                        <span className="badge danger">
                            {dinosaur.threat || dinosaur.danger}
                        </span>
                    )}
                </div>
            </div>

            <img
                src={getCardImageUrl(dinosaur)}
                alt={dinosaur.name}
            />

            <div className="cardOverlay">

                <h2>

                    {dinosaur.name}

                </h2>

                <h4>

                    {dinosaur.scientificName}

                </h4>

                <p className="cardDescription">

                    {dinosaur.description}

                </p>

                <div className="statsRow">

                    <div className="stat">

                        <span>

                            LENGTH

                        </span>

                        <h3>

                            {dinosaur.length}

                        </h3>

                    </div>

                    <div className="stat">

                        <span>

                            WEIGHT

                        </span>

                        <h3>

                            {dinosaur.weight}

                        </h3>

                    </div>

                    <div className="stat">

                        <span>

                            SPEED

                        </span>

                        <h3>

                            {dinosaur.speed}

                        </h3>

                    </div>

                </div>

                <button

                    className="exploreButton"

                    onClick={openDinosaur}

                >

                    Explore Species

                </button>

            </div>

        </motion.div>

    );

}

// backend returns this format
// {
//     "_id": "...",
//     "slug": "trex",
//     "name": "Tyrannosaurus Rex",
//     "scientificName": "Tyrannosaurus rex",
//     "thumbnail": "/uploads/trex.webp",
//     "era": "Late Cretaceous",
//     "diet": "Carnivore",
//     "danger": "Extreme",
//     "description": "One of the largest predators...",
//     "length": "12.3 m",
//     "weight": "8.4 Tons",
//     "speed": "27 km/h"
// }
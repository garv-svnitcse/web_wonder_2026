import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./DinosaurCard.css";

const LOCAL_IMAGES = {
    "tyrannosaurus-rex": "/src/assets/Dinosaurs_Images/Tyrannosaurus rex.png",
    "triceratops-horridus": "/src/assets/Dinosaurs_Images/Triceratops.png",
    "velociraptor-mongoliensis": "/src/assets/Dinosaurs_Images/Velociraptor.png",
    "spinosaurus-aegyptiacus": "/src/assets/Dinosaurs_Images/Spinosaurus.png",
    "brachiosaurus-altithorax": "/src/assets/Dinosaurs_Images/Brachiosaurus.png",
    "stegosaurus-stenops": "/src/assets/Dinosaurs_Images/Stegosaurus.png",
    "diplodocus-carnegii": "/src/assets/Dinosaurs_Images/Diplodocus.png",
    "ankylosaurus-magniventris": "/src/assets/Dinosaurs_Images/Ankylosaurus.png",
    "allosaurus-fragilis": "/src/assets/Dinosaurs_Images/Allosaurus.png",
    "parasaurolophus-walkeri": "/src/assets/Dinosaurs_Images/Parasaurolophus.png"
};

const getCardImageUrl = (dino) => {
    if (!dino) return "";
    const slug = dino.slug || "";
    if (LOCAL_IMAGES[slug]) {
        return LOCAL_IMAGES[slug];
    }
    for (const key of Object.keys(LOCAL_IMAGES)) {
        if (slug.includes(key) || key.includes(slug)) {
            return LOCAL_IMAGES[key];
        }
    }
    const rawUrl = dino.thumbnail || dino.image || "";
    if (rawUrl.includes("drive.google.com/file/d/")) {
        const parts = rawUrl.split("drive.google.com/file/d/");
        if (parts.length > 1) {
            const id = parts[1].split("/")[0].split("?")[0];
            return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
        }
    }
    return rawUrl || "/images/trex.webp";
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

            <img

                src={getCardImageUrl(dinosaur)}

                alt={dinosaur.name}

            />

            <div className="cardOverlay">

                <div className="cardBadges">

                    <span className="badge era">

                        {dinosaur.era}

                    </span>

                    <span className="badge diet">

                        {dinosaur.diet}

                    </span>

                    <span className="badge danger">

                        {dinosaur.threat}

                    </span>

                </div>

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
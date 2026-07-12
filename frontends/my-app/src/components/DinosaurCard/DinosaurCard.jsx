import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./DinosaurCard.css";

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

                src={dinosaur.thumbnail}

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
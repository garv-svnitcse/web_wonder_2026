import { motion } from "framer-motion";
import {
    FaSearch,
    FaArrowRight
} from "react-icons/fa";
import { useState } from "react";

import "./Research.css";

const database = [

    {

        name: "Tyrannosaurus Rex",

        era: "Late Cretaceous",

        diet: "Carnivore",

        threat: "Extreme",

        image: "/images/trex.webp"

    },

    {

        name: "Spinosaurus",

        era: "Late Cretaceous",

        diet: "Piscivore",

        threat: "Extreme",

        image: "/images/spino.webp"

    },

    {

        name: "Velociraptor",

        era: "Late Cretaceous",

        diet: "Carnivore",

        threat: "High",

        image: "/images/raptor.webp"

    },

    {

        name: "Triceratops",

        era: "Late Cretaceous",

        diet: "Herbivore",

        threat: "Medium",

        image: "/images/triceratops.webp"

    }

];

export default function Research() {

    const [search, setSearch] = useState("");

    const filtered = database.filter(item =>

        item.name.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <section className="research">

            <div className="researchHeading">

                <span>

                    CLASSIFIED DATABASE

                </span>

                <h2>

                    Research Archives

                </h2>

                <p>

                    Browse the Jurassic Journey fossil database and discover
                    scientific records from prehistoric Earth.

                </p>

            </div>

            <div className="searchBar">

                <FaSearch />

                <input

                    type="text"

                    placeholder="Search dinosaur..."

                    value={search}

                    onChange={(e) => setSearch(e.target.value)}

                />

            </div>

            <div className="researchGrid">

                {

                    filtered.map((dinosaur, index) => (

                        <motion.div

                            key={index}

                            className="researchCard"

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

                                duration: .7,

                                delay: index * .1

                            }}

                        >

                            <img

                                src={dinosaur.image}

                                alt={dinosaur.name}

                            />

                            <div className="researchContent">

                                <span>

                                    {dinosaur.era}

                                </span>

                                <h3>

                                    {dinosaur.name}

                                </h3>
                                <div className="researchMeta">

                                    <div>

                                        <h5>

                                            Diet

                                        </h5>

                                        <p>

                                            {dinosaur.diet}

                                        </p>

                                    </div>

                                    <div>

                                        <h5>

                                            Threat

                                        </h5>

                                        <p>

                                            {dinosaur.threat}

                                        </p>

                                    </div>

                                </div>

                                <button

                                    className="researchButton"

                                >

                                    OPEN DOSSIER

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
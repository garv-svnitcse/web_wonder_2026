import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FaCube,
    FaPlay,
    FaChevronDown,
    FaArrowLeft,
    FaShareAlt,
    FaHeart
} from "react-icons/fa";

import "../styles/Dinosaur.css";

const fallback = {

    slug: "trex",

    name: "Tyrannosaurus Rex",

    scientificName: "Tyrannosaurus rex",

    era: "Late Cretaceous",

    period: "6866 Million Years Ago",

    diet: "Carnivore",

    weight: "8.4 Tons",

    length: "12.3 m",

    height: "4 m",

    speed: "27 km/h",

    biteForce: "35,000 N",

    danger: "Extreme",

    population: "Extinct",

    description:
        "The Tyrannosaurus Rex was one of the most powerful terrestrial predators ever discovered. Massive jaws, incredible bite force and keen senses made it the apex predator of Late Cretaceous North America.",

    video: "/videos/trex.mp4",

    heroImage: "/images/trex.webp",

    gallery: [

        "/images/trex1.webp",

        "/images/trex2.webp",

        "/images/trex3.webp"

    ],

    stats: [

        {

            title: "Length",

            value: "12.3 m"

        },

        {

            title: "Weight",

            value: "8.4 Tons"

        },

        {

            title: "Speed",

            value: "27 km/h"

        },

        {

            title: "Bite Force",

            value: "35,000 N"

        },

        {

            title: "Diet",

            value: "Carnivore"

        },

        {

            title: "Threat",

            value: "Extreme"

        }

    ]

};

export default function Dinosaur() {

    const { slug } = useParams();

    const [dinosaur, setDinosaur] = useState(fallback);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {

        async function loadDinosaur() {

            try {

                /*
                backend

                Example:

                const res = await axios.get(
                    `/api/dinosaur/${slug}`
                );

                setDinosaur(res.data);
                */

                setTimeout(() => {

                    setDinosaur({

                        ...fallback,

                        slug: slug || "trex"

                    });

                    setLoading(false);

                }, 700);

            }

            catch {

                setLoading(false);

            }

        }

        loadDinosaur();

    }, [slug]);

    if (loading) {

        return (

            <div className="dinoLoading">

                <div className="loaderCircle"></div>

                <h2>

                    Loading Fossil Archive...

                </h2>

            </div>

        );

    }

    return (

        <div className="dinosaurPage">

            {/* ====================================== */}
            {/* HERO */}
            {/* ====================================== */}

            <section className="dinoHero">

                <video

                    autoPlay

                    muted

                    loop

                    playsInline

                    className="heroVideo"

                >

                    <source

                        src={dinosaur.video}

                        type="video/mp4"

                    />

                </video>

                <div className="heroOverlay"></div>

                <nav className="heroNav">

                    <button

                        onClick={() => navigate(-1)}

                    >

                        <FaArrowLeft />

                        Back

                    </button>

                    <div>

                        <button>

                            <FaHeart />

                        </button>

                        <button>

                            <FaShareAlt />

                        </button>

                    </div>

                </nav>

                <div className="heroContent">

                    <motion.p

                        initial={{

                            opacity: 0,

                            y: 40

                        }}

                        animate={{

                            opacity: 1,

                            y: 0

                        }}

                        transition={{

                            duration: .8

                        }}

                    >

                        {dinosaur.era}

                    </motion.p>

                    <motion.h1

                        initial={{
                            marginTop: 50,
                            opacity: 0,

                            y: 60

                        }}

                        animate={{

                            opacity: 1,

                            y: 0

                        }}

                        transition={{

                            delay: .2,

                            duration: 1

                        }}

                    >

                        {dinosaur.name}

                    </motion.h1>

                    <motion.h3

                        initial={{

                            opacity: 0

                        }}

                        animate={{

                            opacity: 1

                        }}

                        transition={{

                            delay: .6

                        }}

                    >

                        {dinosaur.scientificName}

                    </motion.h3>

                    <motion.p

                        className="heroDescription"

                        initial={{

                            opacity: 0,

                            y: 30

                        }}

                        animate={{

                            opacity: 1,

                            y: 0

                        }}

                        transition={{

                            delay: .8

                        }}

                    >

                        {dinosaur.description}

                    </motion.p>

                    <div className="heroButtons">
                        <motion.button

                            className="primaryButton"

                            initial={{

                                opacity: 0,

                                y: 30

                            }}

                            animate={{

                                opacity: 1,

                                y: 0

                            }}

                            transition={{

                                delay: 1

                            }}

                            onClick={() => {

                                window.location.href = `/viewer/${dinosaur.slug}`;

                            }}

                        >

                            <FaCube />

                            View In 3D

                        </motion.button>

                        <motion.button

                            className="secondaryButton"

                            initial={{

                                opacity: 0,

                                y: 30

                            }}

                            animate={{

                                opacity: 1,

                                y: 0

                            }}

                            transition={{

                                delay: 1.15

                            }}

                        >

                            <FaPlay />

                            Watch Documentary

                        </motion.button>

                    </div>

                    <motion.div

                        className="quickStats"

                        initial={{

                            opacity: 0,

                            y: 60

                        }}

                        whileInView={{

                            opacity: 1,

                            y: 0

                        }}

                        transition={{

                            duration: .8,

                            delay: 1.2

                        }}

                    >

                        {

                            dinosaur.stats.map((item, index) => (

                                <div

                                    className="quickCard"

                                    key={index}

                                >

                                    <h4>

                                        {item.title}

                                    </h4>

                                    <h2>

                                        {item.value}

                                    </h2>

                                </div>

                            ))

                        }

                    </motion.div>

                </div>

                <motion.div

                    className="scrollIndicator"

                    animate={{

                        y: [0, 10, 0]

                    }}

                    transition={{

                        repeat: Infinity,

                        duration: 2

                    }}

                >

                    <FaChevronDown />

                </motion.div>

            </section>

            {/* ====================================== */}
            {/* DNA SECTION */}
            {/* ====================================== */}

            <section className="dnaSection">

                <div className="sectionTitle">

                    <span>

                        GENETIC ANALYSIS

                    </span>

                    <h2>

                        DNA Profile

                    </h2>

                    <p>

                        Artificial Intelligence reconstructed this genome using
                        fossil evidence, preserved DNA fragments and evolutionary
                        modelling.

                    </p>

                </div>

                <div className="dnaGrid">

                    <motion.div

                        className="dnaCard"

                        initial={{

                            opacity: 0,

                            x: -80

                        }}

                        whileInView={{

                            opacity: 1,

                            x: 0

                        }}

                        viewport={{

                            once: true

                        }}

                    >

                        <h3>

                            Genome Integrity

                        </h3>

                        <div className="progress">

                            <div

                                className="progressFill"

                                style={{

                                    width: "98%"

                                }}

                            />

                        </div>

                        <h1>

                            98%

                        </h1>

                        <p>

                            Exceptionally preserved fossil DNA allowed
                            researchers to reconstruct almost the complete
                            genetic sequence.

                        </p>

                    </motion.div>

                    <motion.div

                        className="dnaCard"

                        initial={{

                            opacity: 0,

                            x: 80

                        }}

                        whileInView={{

                            opacity: 1,

                            x: 0

                        }}

                        viewport={{

                            once: true

                        }}

                    >

                        <h3>

                            AI Behaviour Prediction

                        </h3>

                        <ul>

                            <li>

                                Aggression : Extreme

                            </li>

                            <li>

                                Intelligence : High

                            </li>

                            <li>

                                Pack Behaviour : Rare

                            </li>

                            <li>

                                Hunting Success : 96%

                            </li>

                            <li>

                                Extinction Probability : 100%

                            </li>

                        </ul>

                    </motion.div>

                </div>

            </section>
            {/* ====================================== */}
            {/* TIMELINE */}
            {/* ====================================== */}

            <section className="timelineSection">

                <div className="sectionTitle">

                    <span>

                        EVOLUTION

                    </span>

                    <h2>

                        Evolution Timeline

                    </h2>

                    <p>

                        Follow the complete history of {dinosaur.name} from its
                        emergence to its extinction.

                    </p>

                </div>

                <div className="timelineContainer">

                    <motion.div

                        className="timelineItem"

                        initial={{

                            opacity: 0,

                            x: -80

                        }}

                        whileInView={{

                            opacity: 1,

                            x: 0

                        }}

                        viewport={{

                            once: true

                        }}

                    >

                    </motion.div>

                    <motion.div

                        className="timelineItem"

                        initial={{

                            opacity: 0,

                            x: 80

                        }}

                        whileInView={{

                            opacity: 1,

                            x: 0

                        }}

                        viewport={{

                            once: true

                        }}

                    >

                        <div className="timelineDot"></div>

                        <div className="timelineContent">

                            <h3>

                                68 Million Years Ago

                            </h3>

                            <p>

                                Becomes one of the largest apex predators
                                in Earth's history.

                            </p>

                        </div>

                    </motion.div>

                    <motion.div

                        className="timelineItem"

                        initial={{

                            opacity: 0,

                            x: -80

                        }}

                        whileInView={{

                            opacity: 1,

                            x: 0

                        }}

                        viewport={{

                            once: true

                        }}

                    >

                        <div className="timelineDot"></div>

                        <div className="timelineContent">

                            <h3>

                                66 Million Years Ago

                            </h3>

                            <p>

                                Chicxulub asteroid impact triggers the
                                Cretaceous–Paleogene mass extinction.

                            </p>

                        </div>

                    </motion.div>

                </div>

            </section>

            {/* ====================================== */}
            {/* HABITAT */}
            {/* ====================================== */}

            <section className="habitatSection">

                <div className="sectionTitle">

                    <span>

                        HABITAT

                    </span>

                    <h2>

                        Natural Environment

                    </h2>

                </div>

                <div className="habitatGrid">

                    <motion.div

                        className="mapCard"

                        initial={{

                            opacity: 0,

                            scale: .9

                        }}

                        whileInView={{

                            opacity: 1,

                            scale: 1

                        }}

                        viewport={{

                            once: true

                        }}

                    >

                        <img

                            src="/images/world-map.png"

                            alt="Habitat"

                        />

                        <div className="mapMarker">

                            North America

                        </div>

                    </motion.div>

                    <motion.div

                        className="habitatInfo"

                        initial={{

                            opacity: 0,

                            x: 80

                        }}

                        whileInView={{

                            opacity: 1,

                            x: 0

                        }}

                        viewport={{

                            once: true

                        }}

                    >

                        <h3>

                            Habitat Details

                        </h3>

                        <p>

                            Warm forests, river systems and flood plains
                            formed the ideal environment for this species.

                        </p>

                        <div className="infoGrid">

                            <div>

                                <h4>

                                    Climate

                                </h4>

                                <p>

                                    Tropical

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Continent

                                </h4>

                                <p>

                                    North America

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Temperature

                                </h4>

                                <p>

                                    24°C

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Terrain

                                </h4>

                                <p>

                                    Rivers & Forests

                                </p>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </section>

            {/* ====================================== */}
            {/* GALLERY */}
            {/* ====================================== */}

            <section className="gallerySection">

                <div className="sectionTitle">

                    <span>

                        GALLERY

                    </span>

                    <h2>

                        Fossils & Reconstructions

                    </h2>

                </div>

                <div className="galleryGrid">

                    {

                        dinosaur.gallery.map((image, index) => (

                            <motion.div

                                key={index}

                                className="galleryCard"

                                initial={{

                                    opacity: 0,

                                    y: 60

                                }}

                                whileInView={{

                                    opacity: 1,

                                    y: 0

                                }}

                                whileHover={{

                                    scale: 1.05

                                }}

                                viewport={{

                                    once: true

                                }}

                            >

                                <img

                                    src={image}

                                    alt={dinosaur.name}

                                />

                            </motion.div>

                        ))

                    }

                </div>

            </section>
            {/* ====================================== */}
            {/* AI RESEARCH REPORT */}
            {/* ====================================== */}

            <section className="reportSection">

                <div className="sectionTitle">

                    <span>

                        AI ANALYSIS

                    </span>

                    <h2>

                        Research Report

                    </h2>

                    <p>

                        Jurassic Journey AI analyzed fossil records, DNA
                        fragments and geological evidence to reconstruct
                        the most accurate profile of this species.

                    </p>

                </div>

                <div className="reportGrid">

                    <motion.div

                        className="reportCard"

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

                    >

                        <h3>

                            AI Observation

                        </h3>

                        <p>

                            {dinosaur.description}

                        </p>

                        <div className="reportBars">

                            <div>

                                <span>

                                    Aggression

                                </span>

                                <div className="bar">

                                    <div

                                        style={{

                                            width: "96%"

                                        }}

                                    />

                                </div>

                            </div>

                            <div>

                                <span>

                                    Intelligence

                                </span>

                                <div className="bar">

                                    <div

                                        style={{

                                            width: "82%"

                                        }}

                                    />

                                </div>

                            </div>

                            <div>

                                <span>

                                    Hunting Ability

                                </span>

                                <div className="bar">

                                    <div

                                        style={{

                                            width: "97%"

                                        }}

                                    />

                                </div>

                            </div>

                            <div>

                                <span>

                                    Adaptability

                                </span>

                                <div className="bar">

                                    <div

                                        style={{

                                            width: "78%"

                                        }}

                                    />

                                </div>

                            </div>

                        </div>

                    </motion.div>

                    <motion.div

                        className="reportCard"

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

                            delay: .2

                        }}

                    >

                        <h3>

                            Classification

                        </h3>

                        <div className="classificationGrid">

                            <div>

                                <h4>

                                    Era

                                </h4>

                                <p>

                                    {dinosaur.era}

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Period

                                </h4>

                                <p>

                                    {dinosaur.period}

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Diet

                                </h4>

                                <p>

                                    {dinosaur.diet}

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Threat

                                </h4>

                                <p>

                                    {dinosaur.danger}

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Population

                                </h4>

                                <p>

                                    {dinosaur.population}

                                </p>

                            </div>

                            <div>

                                <h4>

                                    Scientific Name

                                </h4>

                                <p>

                                    {dinosaur.scientificName}

                                </p>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </section>

            {/* ====================================== */}
            {/* RELATED DINOSAURS */}
            {/* ====================================== */}

            <section className="relatedSection">

                <div className="sectionTitle">

                    <span>

                        DISCOVER MORE

                    </span>

                    <h2>

                        Related Dinosaurs

                    </h2>

                </div>

                <div className="relatedGrid">

                    {

                        [

                            {

                                slug: "spinosaurus",

                                name: "Spinosaurus",

                                image: "/images/spino.webp"

                            },

                            {

                                slug: "velociraptor",

                                name: "Velociraptor",

                                image: "/images/raptor.webp"

                            },

                            {

                                slug: "triceratops",

                                name: "Triceratops",

                                image: "/images/triceratops.webp"

                            }

                        ].map((item, index) => (

                            <motion.div

                                key={index}

                                className="relatedCard"

                                whileHover={{

                                    y: -12

                                }}

                            >

                                <img

                                    src={item.image}

                                    alt={item.name}

                                />

                                <div className="relatedOverlay">

                                    <h3>

                                        {item.name}

                                    </h3>

                                    <button

                                        onClick={() => {

                                            window.location.href = `/dinosaur/${item.slug}`;

                                        }}

                                    >

                                        Explore

                                    </button>

                                </div>

                            </motion.div>

                        ))

                    }

                </div>

            </section>

            {/* ====================================== */}
            {/* NEXT EXPEDITION */}
            {/* ====================================== */}

            <section className="nextSection">

                <motion.div

                    className="nextCard"

                    initial={{

                        opacity: 0,

                        scale: .95

                    }}

                    whileInView={{

                        opacity: 1,

                        scale: 1

                    }}

                    viewport={{

                        once: true

                    }}

                >

                    <span>

                        NEXT EXPEDITION

                    </span>

                    <h2>

                        Continue Exploring

                    </h2>

                    <p>

                        Discover another prehistoric giant and compare
                        its evolution, DNA profile and fossil records.

                    </p>

                    <div className="nextButtons">

                        <button

                            onClick={() => {

                                window.location.href = "/research";

                            }}

                        >

                            Research Archive

                        </button>

                        <button

                            className="gold"

                            onClick={() => {

                                window.location.href = `/viewer/${dinosaur.slug}`;

                            }}

                        >

                            Open 3D Viewer

                        </button>

                    </div>

                </motion.div>

            </section>

        </div>

    );

}
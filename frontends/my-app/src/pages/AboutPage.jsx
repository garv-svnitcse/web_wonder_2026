import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaDna,
    FaGlobeAmericas,
    FaMicroscope,
    FaAward,
    FaCompass,
    FaShieldAlt,
    FaLayerGroup,
    FaCalendarAlt,
    FaQuoteLeft,
    FaArrowRight,
    FaAtom,
    FaGraduationCap
} from "react-icons/fa";
import { GiDinosaurRex, GiFossil, GiFootprint, GiVolcano, GiSpottedMushroom } from "react-icons/gi";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./AboutPage.css";

export default function AboutPage() {
    const isLoggedIn = !!localStorage.getItem("access_token");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const stats = [
        { label: "Mesozoic Epochs Covered", value: "250M+", icon: <FaCalendarAlt /> },
        { label: "Cataloged Species", value: "150+", icon: <GiDinosaurRex /> },
        { label: "Expeditions Launched", value: "50,000+", icon: <FaCompass /> },
        { label: "Scientific Accuracy", value: "99.8%", icon: <FaMicroscope /> }
    ];

    const pillars = [
        {
            icon: <GiDinosaurRex />,
            title: "Interactive 3D Vault",
            description: "Explore photorealistic 3D dinosaur reconstructions with real-time anatomical controls and scale comparisons."
        },
        {
            icon: <FaDna />,
            title: "Genomic Dossiers",
            description: "Deep dive into simulated DNA strands, diet breakdown, habitat environmental maps, and fossil classification."
        },
        {
            icon: <GiVolcano />,
            title: "Mesozoic Cinema",
            description: "Step into climate-driven simulation environments with cinematic spatial soundscapes from Triassic to Cretaceous."
        },
        {
            icon: <FaGraduationCap />,
            title: "Educational Expeditions",
            description: "Interactive quizzes and survival challenges engineered to educate aspiring paleontologists and enthusiasts."
        }
    ];

    const team = [
        {
            name: "Dr. Elena Rostova",
            role: "Chief Paleontologist & Expedition Lead",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            bio: "Specializing in Late Cretaceous theropods with 15+ years of excavation experience in the Hell Creek Formation."
        },
        {
            name: "Marcus Thorne",
            role: "Lead 3D Creature Animator & WebGL Architect",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            bio: "Pioneering real-time skeletal shaders and muscle deformation algorithms for web-based prehistoric simulation."
        },
        {
            name: "Dr. Aris Vance",
            role: "Paleo-Climatologist & Bio-Geographer",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            bio: "Reconstructing ancient atmospheric dynamics, Pangaea continental shifts, and plant megaflora ecosystems."
        },
        {
            name: "Sofia Chen",
            role: "Interactive Experience & Educational Lead",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
            bio: "Designing immersive gamified learning tracks that make complex fossil records engaging for global audiences."
        }
    ];

    const values = [
        {
            title: "Scientific Fidelity",
            desc: "Every model and dossier is benchmarked against real peer-reviewed fossil discoveries and cladistic data.",
            icon: <FaMicroscope />
        },
        {
            title: "Immersive Technology",
            desc: "Leveraging WebGL, interactive shaders, and spatial audio to transport users 200 million years into the past.",
            icon: <FaAtom />
        },
        {
            title: "Open Knowledge",
            desc: "Democratizing access to high-definition paleontological archives for students, educators, and curious minds.",
            icon: <FaGlobeAmericas />
        }
    ];

    return (
        <div className="aboutPageContainer">
            <Navbar isLoggedIn={isLoggedIn} />

            {/* HERO SECTION */}
            <section className="aboutHeroSection">
                <div className="aboutHeroGlow" />
                <motion.div
                    className="aboutHeroContent"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="aboutBadge">
                        <GiFossil className="badgeIcon" />
                        <span>RECOVERING PREHISTORIC TRUTHS</span>
                    </div>
                    <h1 className="aboutHeroTitle">
                        ABOUT <span className="highlightText">JURASSIC JOURNEY</span>
                    </h1>
                    <p className="aboutHeroSubtitle">
                        Bridging paleontology, cutting-edge 3D WebGL technology, and scientific storytelling to revive Earth's lost megafauna for digital explorers worldwide.
                    </p>
                </motion.div>
            </section>

            {/* MISSION & VISION */}
            <section className="aboutMissionSection">
                <div className="aboutSectionInner">
                    <motion.div
                        className="missionCard"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="cardHeader">
                            <FaCompass className="cardIcon" />
                            <h2>Our Expedition Mission</h2>
                        </div>
                        <p>
                            Jurassic Journey was founded with a singular ambition: to transform static fossil cataloging into an interactive living ecosystem. We harness modern web technologies to recreate extinct species with anatomical precision, allowing users to inspect ancient skeletal structures, learn dietary habits, and analyze prehistoric climates.
                        </p>
                    </motion.div>

                    <motion.div
                        className="missionCard visionCard"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="cardHeader">
                            <FaGlobeAmericas className="cardIcon" />
                            <h2>Our Vision for 2026</h2>
                        </div>
                        <p>
                            We aim to construct the world’s most comprehensive open-access digital Mesozoic vault. By combining interactive 3D simulations, fossil research dossiers, community expeditions, and immersive cinema, Jurassic Journey serves as a hub for next-generation fossil exploration and paleontology education.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="aboutStatsSection">
                <div className="aboutSectionInner statsGrid">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            className="statBox"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <div className="statIcon">{stat.icon}</div>
                            <div className="statValue">{stat.value}</div>
                            <div className="statLabel">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* PLATFORM PILLARS */}
            <section className="aboutPillarsSection">
                <div className="aboutSectionInner">
                    <div className="sectionHeading">
                        <span className="subHeading">PLATFORM EXCELLENCE</span>
                        <h2>Engineered For Discovery</h2>
                        <p>Explore what makes Jurassic Journey a revolutionary digital expedition platform.</p>
                    </div>

                    <div className="pillarsGrid">
                        {pillars.map((pillar, idx) => (
                            <motion.div
                                key={idx}
                                className="pillarCard"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                            >
                                <div className="pillarIcon">{pillar.icon}</div>
                                <h3>{pillar.title}</h3>
                                <p>{pillar.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="aboutValuesSection">
                <div className="aboutSectionInner">
                    <div className="sectionHeading">
                        <span className="subHeading">OUR GUIDING PRINCIPLES</span>
                        <h2>Core Philosophy</h2>
                    </div>

                    <div className="valuesGrid">
                        {values.map((val, idx) => (
                            <motion.div
                                key={idx}
                                className="valueCard"
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                            >
                                <div className="valIcon">{val.icon}</div>
                                <h3>{val.title}</h3>
                                <p>{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="aboutTeamSection">
                <div className="aboutSectionInner">
                    <div className="sectionHeading">
                        <span className="subHeading">EXPEDITION LEADERSHIP</span>
                        <h2>Meet The Paleontologists & Engineers</h2>
                        <p>Driven by a shared passion for prehistoric life and digital innovation.</p>
                    </div>

                    <div className="teamGrid">
                        {team.map((member, idx) => (
                            <motion.div
                                key={idx}
                                className="teamCard"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                            >
                                <div className="teamImageWrapper">
                                    <img src={member.image} alt={member.name} className="teamImage" />
                                    <div className="teamImageOverlay" />
                                </div>
                                <div className="teamInfo">
                                    <h3>{member.name}</h3>
                                    <span className="teamRole">{member.role}</span>
                                    <p className="teamBio">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QUOTE SECTION */}
            <section className="aboutQuoteSection">
                <div className="aboutSectionInner">
                    <motion.div
                        className="quoteCard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <FaQuoteLeft className="quoteIcon" />
                        <blockquote className="quoteText">
                            "Fossils are not mere rocks of ancient bone—they are time capsules carrying the secrets of evolutionary endurance. Our mission is to open those capsules for everyone."
                        </blockquote>
                        <cite className="quoteAuthor">— Jurassic Journey Scientific Board</cite>
                    </motion.div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="aboutCtaSection">
                <div className="aboutSectionInner ctaContent">
                    <h2>Ready to Embark on Your Expedition?</h2>
                    <p>Discover cataloged species, explore Mesozoic timelines, and test your paleontology knowledge today.</p>
                    <div className="ctaButtons">
                        <Link to="/research-database" className="primaryCta">
                            Explore Dinosaurs <FaArrowRight />
                        </Link>
                        <Link to="/quiz" className="secondaryCta">
                            Take Expedition Quiz
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

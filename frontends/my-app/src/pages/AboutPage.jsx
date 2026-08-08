import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowRight,
    FaCompass,
    FaGlobeAmericas,
    FaMicroscope,
    FaAtom,
    FaGraduationCap,
    FaQuoteLeft,
    FaCalendarAlt,
    FaDna
} from "react-icons/fa";
import { GiDinosaurRex, GiFossil, GiVolcano } from "react-icons/gi";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./AboutPage.css";

export default function AboutPage() {
    const isLoggedIn = !!localStorage.getItem("access_token");
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);

        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const stats = [
        { label: "YEARS OF HISTORY", value: "252M+", icon: <FaCalendarAlt /> },
        { label: "CATALOGED SPECIES", value: "150+", icon: <GiDinosaurRex /> },
        { label: "EXPEDITIONS LAUNCHED", value: "50K+", icon: <FaCompass /> },
        { label: "SCIENTIFIC ACCURACY", value: "99.8%", icon: <FaMicroscope /> }
    ];

    const pillars = [
        {
            icon: <GiDinosaurRex />,
            title: "3D CREATURE VAULT",
            description: "Photorealistic 3D dinosaur reconstructions with interactive anatomical inspection, bone density maps, and scale comparisons."
        },
        {
            icon: <FaDna />,
            title: "GENOMIC DOSSIERS",
            description: "Deep dive into simulated DNA strands, dietary breakdowns, geographic distributions, and verified fossil records."
        },
        {
            icon: <GiVolcano />,
            title: "MESOZOIC CINEMA",
            description: "Climate-driven simulation environments with spatial audio and environmental dynamics spanning Triassic to Cretaceous eras."
        },
        {
            icon: <FaGraduationCap />,
            title: "EDUCATIONAL EXPEDITIONS",
            description: "Interactive quizzes and survival challenges engineered to educate aspiring paleontologists and prehistoric enthusiasts."
        }
    ];

    const team = [
        {
            name: "DR. ELENA ROSTOVA",
            role: "Chief Paleontologist & Expedition Lead",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            bio: "Specializing in Late Cretaceous theropods with 15+ years of excavation experience in the Hell Creek Formation."
        },
        {
            name: "MARCUS THORNE",
            role: "Lead 3D Creature Animator & WebGL Architect",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            bio: "Pioneering real-time skeletal shaders and muscle deformation algorithms for web-based prehistoric simulation."
        },
        {
            name: "DR. ARIS VANCE",
            role: "Paleo-Climatologist & Bio-Geographer",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            bio: "Reconstructing ancient atmospheric dynamics, Pangaea continental shifts, and plant megaflora ecosystems."
        },
        {
            name: "SOFIA CHEN",
            role: "Interactive Experience & Educational Lead",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
            bio: "Designing immersive gamified learning tracks that make complex fossil records engaging for global audiences."
        }
    ];

    const values = [
        {
            title: "SCIENTIFIC RIGOR",
            desc: "Every dinosaur model and dossier is benchmarked against real peer-reviewed fossil discoveries and cladistic research.",
            icon: <FaMicroscope />
        },
        {
            title: "IMMERSIVE TECHNOLOGY",
            desc: "Leveraging WebGL, interactive shaders, and spatial audio to transport users 200 million years into Earth's past.",
            icon: <FaAtom />
        },
        {
            title: "UNIVERSAL ACCESS",
            desc: "Democratizing access to high-definition paleontological archives for students, educators, and curious minds globally.",
            icon: <FaGlobeAmericas />
        }
    ];

    return (
        <div className="aboutPage">
            <Navbar isLoggedIn={isLoggedIn} />

            {/* HERO SECTION - HOME CONSISTENT */}
            <section className="aboutHero">
                <div
                    className="aboutHeroBackground"
                    style={{
                        transform: `scale(1.1) translateY(${offset * 0.18}px)`
                    }}
                >
                    <div className="aboutHeroGradient" />
                    <div className="aboutHeroFog aboutHeroFogOne" />
                    <div className="aboutHeroFog aboutHeroFogTwo" />
                    <div className="aboutHeroNoise" />
                    <div className="aboutHeroGlow" />
                    <div className="aboutHeroVignette" />
                </div>

                <div className="aboutHeroContainer">
                    <motion.div
                        className="aboutHeroContent"
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.span
                            className="aboutHeroTag"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            PREHISTORIC EXPEDITION ARCHIVE
                        </motion.span>

                        <motion.h1
                            className="aboutHeroTitle"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                        >
                            ABOUT <span className="goldHighlight">JURASSIC JOURNEY</span>
                        </motion.h1>

                        <motion.p
                            className="aboutHeroDescription"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Jurassic Journey is an interactive digital expedition bridging paleontology, 3D WebGL simulation, and scientific storytelling to revive Earth’s lost megafauna for explorers worldwide.
                        </motion.p>

                        <motion.div
                            className="aboutHeroStats"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                        >
                            {stats.map((stat, idx) => (
                                <div className="statItem" key={idx}>
                                    <h2>{stat.value}</h2>
                                    <span>{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* FLOATING PARTICLES */}
                <div className="particles">
                    {[...Array(20)].map((_, index) => (
                        <span
                            key={index}
                            className="particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 8}s`,
                                animationDuration: `${8 + Math.random() * 8}s`
                            }}
                        />
                    ))}
                </div>

                <div className="aboutHeroBottomFade" />
            </section>

            {/* MISSION & VISION */}
            <section className="aboutSection missionSection">
                <div className="aboutContainer">
                    <div className="aboutHeading">
                        <span>OUR EXPEDITION PURPOSE</span>
                        <h2>RECOVERING PREHISTORIC TRUTHS</h2>
                        <p>Discover the vision driving our global digital paleontology ecosystem.</p>
                    </div>

                    <div className="missionGrid">
                        <motion.div
                            className="missionCard"
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="cardIconHeader">
                                <FaCompass className="goldIcon" />
                                <h3>OUR MISSION</h3>
                            </div>
                            <p>
                                Jurassic Journey was founded to transform static museum cataloging into an interactive living ecosystem. We combine modern WebGL technology with peer-reviewed fossil data to recreate extinct species with anatomical precision, enabling explorers to inspect skeletal structures, analyze diets, and experience Mesozoic habitats.
                            </p>
                        </motion.div>

                        <motion.div
                            className="missionCard"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="cardIconHeader">
                                <FaGlobeAmericas className="goldIcon" />
                                <h3>OUR VISION</h3>
                            </div>
                            <p>
                                We aim to construct the world's most comprehensive open-access Mesozoic research vault. By pairing interactive 3D simulations with research dossiers, community expeditions, and immersive cinema, Jurassic Journey empowers students, educators, and dinosaur enthusiasts across the globe.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* PLATFORM PILLARS */}
            <section className="aboutSection pillarsSection">
                <div className="aboutContainer">
                    <div className="aboutHeading">
                        <span>PLATFORM PILLARS</span>
                        <h2>ENGINEERED FOR DISCOVERY</h2>
                        <p>Four core technologies power the Jurassic Journey expedition platform.</p>
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
                                <div className="pillarIconWrapper">{pillar.icon}</div>
                                <h3>{pillar.title}</h3>
                                <p>{pillar.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="aboutSection valuesSection">
                <div className="aboutContainer">
                    <div className="aboutHeading">
                        <span>OUR GUIDING PRINCIPLES</span>
                        <h2>CORE PHILOSOPHY</h2>
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
                                <div className="valIconWrapper">{val.icon}</div>
                                <h3>{val.title}</h3>
                                <p>{val.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION */}
            <section className="aboutSection teamSection">
                <div className="aboutContainer">
                    <div className="aboutHeading">
                        <span>EXPEDITION LEADERSHIP</span>
                        <h2>MEET THE CREW</h2>
                        <p>Driven by a shared passion for prehistoric life, paleontology, and digital innovation.</p>
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
            <section className="aboutSection quoteSection">
                <div className="aboutContainer">
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
                        <cite className="quoteAuthor">— JURASSIC JOURNEY SCIENTIFIC BOARD</cite>
                    </motion.div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="aboutSection ctaSection">
                <div className="aboutContainer ctaContainer">
                    <div className="aboutHeading">
                        <span>START YOUR EXPEDITION</span>
                        <h2>READY TO EXPLORE THE MESOZOIC ERA?</h2>
                        <p>Discover cataloged species, explore Mesozoic timelines, and test your paleontology knowledge today.</p>
                    </div>

                    <div className="ctaButtons">
                        <Link to="/research-database" className="primaryButton">
                            EXPLORE DINOSAURS <FaArrowRight />
                        </Link>
                        <Link to="/quiz" className="secondaryButton">
                            TEST YOUR KNOWLEDGE
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

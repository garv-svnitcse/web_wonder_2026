import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaThermometerHalf,
    FaLeaf,
    FaTree,
    FaSeedling,
    FaArrowRight,
    FaGlobeAmericas
} from "react-icons/fa";
import { GiDinosaurRex, GiFossil, GiMeteorImpact } from "react-icons/gi";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import fossilFern from "../assets/fossil_fern.png";
import fossilFootprint from "../assets/fossil_footprint.png";
import fossilAmmonite from "../assets/fossil_ammonite.png";
import "./TimelinePage.css";

const eras = [
    {
        id: "triassic",
        period: "TRIASSIC PERIOD",
        years: "252 - 201",
        label: "MILLION YEARS AGO",
        fossil: fossilFern,
        color: "#B96A3A",
        description: "The Triassic Period marks the beginning of the age of dinosaurs. The first dinosaurs and mammals appeared during this time as the supercontinent Pangaea began to break apart.",
        details: [
            { label: "Climate", value: "Hot & Dry", icon: <FaThermometerHalf /> },
            { label: "Life", value: "First Dinosaurs", icon: <GiDinosaurRex /> },
            { label: "Vegetation", value: "Conifer Forests", icon: <FaTree /> }
        ],
        coordinates: {
            dotX: 250,
            medallionY: 220,
            cardTop: 240,
            cardLeft: 380,
            lineEnd: { x: 380, y: 275 }
        }
    },
    {
        id: "jurassic",
        period: "JURASSIC PERIOD",
        years: "201 - 145",
        label: "MILLION YEARS AGO",
        fossil: fossilFootprint,
        color: "#4C8A4F",
        description: "The Jurassic Period is known for the dominance of massive dinosaurs. Gigantic sauropods like Brachiosaurus flourished while lush, warm forests spread across the planet.",
        details: [
            { label: "Climate", value: "Warm & Humid", icon: <FaGlobeAmericas /> },
            { label: "Life", value: "Dinosaurs Thrive", icon: <GiDinosaurRex /> },
            { label: "Vegetation", value: "Lush Forests", icon: <FaLeaf /> }
        ],
        coordinates: {
            dotX: 850,
            medallionY: 220,
            cardTop: 240,
            cardLeft: 980,
            lineEnd: { x: 980, y: 275 }
        }
    },
    {
        id: "cretaceous",
        period: "CRETACEOUS PERIOD",
        years: "145 - 66",
        label: "MILLION YEARS AGO",
        fossil: fossilAmmonite,
        color: "#1d4ed8", // premium blue
        description: "The Cretaceous is the final and longest period of the Mesozoic Era. It was characterized by the appearance of flowering plants and ended with a catastrophic mass extinction.",
        details: [
            { label: "Climate", value: "Warm", icon: <FaThermometerHalf /> },
            { label: "Life", value: "Flowering Plants", icon: <FaSeedling /> },
            { label: "Event", value: "Mass Extinction", icon: <GiMeteorImpact /> }
        ],
        coordinates: {
            dotX: 1450,
            medallionY: 220,
            cardTop: 240,
            cardLeft: 1580,
            lineEnd: { x: 1580, y: 275 }
        }
    }
];

const ticks = [
    { label: "250", x: 100 },
    { label: "240", x: 200 },
    { label: "230", x: 300 },
    { label: "220", x: 400 },
    { label: "210", x: 500 },
    { label: "200", x: 600 },
    { label: "190", x: 700 },
    { label: "180", x: 800 },
    { label: "170", x: 900 },
    { label: "160", x: 1000 },
    { label: "140", x: 1100 },
    { label: "130", x: 1200 },
    { label: "120", x: 1300 },
    { label: "110", x: 1400 },
    { label: "100", x: 1500 },
    { label: "90", x: 1600 },
    { label: "80", x: 1700 },
    { label: "70", x: 1800 },
    { label: "PRESENT DAY", x: 1900 }
];

export default function TimelinePage() {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Mouse drag to scroll handler
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeft(scrollContainerRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // scroll speed multiplier
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    // Center scroll on load
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 200; // Scroll slightly to center the view
        }
    }, []);

    const handleExplore = (eraId) => {
        // Map era id to the format expected by the ResearchDatabase era selector
        // Triassic -> Triassic, Jurassic -> Jurassic, Cretaceous -> Cretaceous
        const capitalized = eraId.charAt(0).toUpperCase() + eraId.slice(1);
        navigate(`/research-database?era=${capitalized}`);
    };

    return (
        <div className="timeline-page-container">
            <Navbar />

            <main className="timeline-page-content">
                {/* Heading Area */}
                <div className="timeline-header-section">
                    <span className="timeline-section-subtitle">JURASSIC JOURNEY</span>
                    <h1 className="timeline-section-title">TIMELINE</h1>
                    <p className="timeline-section-desc">Journey through Earth's ancient eras</p>

                </div>

                {/* Horizontal Drag/Scroll Canvas Container */}
                <div
                    className={`timeline-scroll-viewport ${isDragging ? "active-dragging" : ""}`}
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    <div className="timeline-canvas">

                        {/* SVG Connecting Lines Canvas */}
                        <svg className="timeline-svg-connections" width="2050" height="680">
                            {/* SVG filters for glowing effects */}
                            <defs>
                                <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Dotted Vertical Connectors (Axis to Medallions) */}
                            {eras.map((era) => (
                                <line
                                    key={`dotted-${era.id}`}
                                    x1={era.coordinates.dotX}
                                    y1={580}
                                    x2={era.coordinates.dotX}
                                    y2={era.coordinates.medallionY}
                                    stroke={era.color}
                                    strokeWidth="2"
                                    strokeDasharray="4 6"
                                    opacity="0.6"
                                />
                            ))}

                            {/* Solid Angled Connectors (Medallions to Cards) */}
                            {eras.map((era) => {
                                // Line starts at right edge of medallion (medallion center + 60px)
                                const startX = era.coordinates.dotX + 60;
                                const startY = era.coordinates.medallionY;
                                const endX = era.coordinates.lineEnd.x;
                                const endY = era.coordinates.lineEnd.y;

                                return (
                                    <line
                                        key={`solid-${era.id}`}
                                        x1={startX}
                                        y1={startY}
                                        x2={endX}
                                        y2={endY}
                                        stroke={era.color}
                                        strokeWidth="2"
                                        opacity="0.85"
                                        filter={`url(#glow-${era.id === "triassic" ? "orange" : era.id === "jurassic" ? "green" : "blue"})`}
                                    />
                                );
                            })}
                        </svg>

                        {/* Era Medallions & Cards */}
                        {eras.map((era) => {
                            const medallionSize = 120;
                            const medTop = era.coordinates.medallionY - medallionSize / 2;
                            const medLeft = era.coordinates.dotX - medallionSize / 2;

                            return (
                                <div key={era.id} className="timeline-era-group">

                                    {/* Circular Fossil Medallion */}
                                    <motion.div
                                        className="timeline-medallion"
                                        style={{
                                            top: `${medTop}px`,
                                            left: `${medLeft}px`,
                                            borderColor: era.color,
                                            boxShadow: `0 0 20px ${era.color}44, inset 0 0 15px ${era.color}33`
                                        }}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="medallion-inner">
                                            <img
                                                src={era.fossil}
                                                alt={`${era.period} Fossil`}
                                                className="fossil-image"
                                                draggable="false"
                                            />
                                        </div>
                                        {/* Colored pulsing center circle indicator */}
                                        <div
                                            className="medallion-pulse"
                                            style={{ backgroundColor: era.color }}
                                        ></div>
                                    </motion.div>

                                    {/* Floating Details Card */}
                                    <motion.div
                                        className="timeline-era-card"
                                        style={{
                                            top: `${era.coordinates.cardTop}px`,
                                            left: `${era.coordinates.cardLeft}px`,
                                            borderColor: `${era.color}22`
                                        }}
                                        whileHover={{
                                            y: -5,
                                            borderColor: `${era.color}88`,
                                            boxShadow: `0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px ${era.color}22`
                                        }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div className="card-header">
                                            <span className="card-header-icon" style={{ color: era.color }}>
                                                {era.id === "triassic" ? <FaLeaf /> : era.id === "jurassic" ? <GiDinosaurRex /> : <GiFossil />}
                                            </span>
                                            <h3 className="card-title" style={{ color: era.color }}>
                                                {era.period}
                                            </h3>
                                        </div>

                                        <p className="card-description">
                                            {era.description}
                                        </p>

                                        {/* Climate, Life, Vegetation Facts */}
                                        <div className="card-facts-grid">
                                            {era.details.map((detail, idx) => (
                                                <div key={idx} className="card-fact-item">
                                                    <span className="fact-icon" style={{ color: era.color }}>
                                                        {detail.icon}
                                                    </span>
                                                    <div className="fact-text">
                                                        <span className="fact-label">{detail.label}</span>
                                                        <span className="fact-val">{detail.value}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Explore Button */}
                                        <button
                                            className="card-explore-btn"
                                            style={{ borderColor: `${era.color}44`, "--hover-color": era.color }}
                                            onClick={() => handleExplore(era.id)}
                                        >
                                            <span>EXPLORE MORE</span>
                                            <FaArrowRight className="btn-arrow" />
                                        </button>
                                    </motion.div>
                                </div>
                            );
                        })}

                        {/* Bottom Timeline Axis Ruler & Colored Span Bars */}
                        <div className="timeline-ruler-system" style={{ top: "580px" }}>
                            {/* Horizontal main axis line */}
                            <div className="timeline-axis-line"></div>

                            {/* Colored era bars on top of the main axis line */}
                            {/* Triassic bar (250 to 201 MYA) -> tick 250 (100px) to tick 200 (600px) */}
                            <div
                                className="timeline-span-bar"
                                style={{
                                    left: "100px",
                                    width: "500px",
                                    backgroundColor: eras[0].color,
                                    boxShadow: `0 0 10px ${eras[0].color}`
                                }}
                            ></div>

                            {/* Jurassic bar (201 to 145 MYA) -> tick 200 (600px) to midway 160/140 (1050px) */}
                            <div
                                className="timeline-span-bar"
                                style={{
                                    left: "600px",
                                    width: "450px",
                                    backgroundColor: eras[1].color,
                                    boxShadow: `0 0 10px ${eras[1].color}`
                                }}
                            ></div>

                            {/* Cretaceous bar (145 to 66 MYA) -> midway 160/140 (1050px) to tick 70 (1800px) + ~40px (1840px) */}
                            <div
                                className="timeline-span-bar"
                                style={{
                                    left: "1050px",
                                    width: "790px",
                                    backgroundColor: eras[2].color,
                                    boxShadow: `0 0 10px ${eras[2].color}`
                                }}
                            ></div>

                            {/* Active connection dots on the line */}
                            {eras.map((era) => (
                                <div
                                    key={`axis-dot-${era.id}`}
                                    className="axis-connection-dot"
                                    style={{
                                        left: `${era.coordinates.dotX}px`,
                                        backgroundColor: era.color,
                                        boxShadow: `0 0 15px ${era.color}, 0 0 30px ${era.color}`
                                    }}
                                ></div>
                            ))}

                            {/* Period Info Labels right above the ticks */}
                            {eras.map((era) => (
                                <div
                                    key={`axis-label-${era.id}`}
                                    className="axis-period-label"
                                    style={{
                                        left: `${era.coordinates.dotX}px`,
                                        color: era.color
                                    }}
                                >
                                    <div className="label-years">{era.years}</div>
                                    <div className="label-subtitle">{era.label}</div>
                                </div>
                            ))}

                            {/* Ticks and Ticks Labels (Years) */}
                            {ticks.map((tick, idx) => (
                                <div
                                    key={idx}
                                    className="ruler-tick-group"
                                    style={{ left: `${tick.x}px` }}
                                >
                                    <div className="ruler-tick-mark"></div>
                                    <span className="ruler-tick-label">{tick.label}</span>
                                </div>
                            ))}

                            {/* X-Axis Legend */}
                            <div className="timeline-axis-legend">
                                Million Years Ago (MYA)
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

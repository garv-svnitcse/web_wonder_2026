import { API_URL } from "../config/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import DinosaurCard from "../components/DinosaurCard/DinosaurCard";
import Navbar from "../components/Navbar/Navbar";
import GlassAuthModal from "../components/GlassAuthModal";
import "../styles/ResearchDatabase.css";

export default function ResearchDatabase() {
    const location = useLocation();
    const navigate = useNavigate();

    const getStoredToken = () => {
        const val = localStorage.getItem('access_token');
        if (!val) return '';
        const clean = val.trim();
        const parts = clean.split('.');
        if (parts.length !== 3) {
            return '';
        }
        return clean;
    };

    const [token, setToken] = useState(getStoredToken());

    const [dinosaurs, setDinosaurs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [era, setEra] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const eraParam = params.get("era");
        if (eraParam) {
            return eraParam.charAt(0).toUpperCase() + eraParam.slice(1).toLowerCase();
        }
        return "";
    });

    const [diet, setDiet] = useState("");

    const [sort, setSort] = useState("name");

    // Listen to location changes to update era filter state
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const eraParam = params.get("era");
        if (eraParam) {
            const formatted = eraParam.charAt(0).toUpperCase() + eraParam.slice(1).toLowerCase();
            setEra(formatted);
        }
    }, [location.search]);

    useEffect(() => {
        let active = true;

        async function loadDinosaurs() {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_URL}/dinosaurs?search=${search}&era=${era}&diet=${diet}&sort=${sort}`
                );
                const data = await response.json();
                if (active) {
                    if (Array.isArray(data)) {
                        setDinosaurs(data);
                    } else {
                        console.warn("Invalid data received from API:", data);
                        setDinosaurs([]);
                    }
                }
            } catch (err) {
                console.log(err);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadDinosaurs();

        return () => {
            active = false;
        };
    }, [search, era, diet, sort]);

    return (
        <div className="databasePage">
            <Navbar isLoggedIn={!!token} />
            <section className="databaseHero">
                <motion.h1
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >
                    Jurassic Research Database
                </motion.h1>

                <motion.p
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    transition={{
                        delay: 0.2,
                    }}
                >
                    Search thousands of prehistoric species reconstructed using fossil
                    evidence, AI models and DNA simulations.
                </motion.p>
            </section>

            {/* ================= SEARCH ================= */}

            <section className="searchSection">
                <div className="searchBar">
                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search dinosaur..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filters">
                    <div className="filterTitle">
                        <FaFilter />
                        Filters
                    </div>

                    <select className="filterSelect filterEra" value={era} onChange={(e) => setEra(e.target.value)}>
                        <option value="">All Eras</option>
                        <option>Triassic</option>
                        <option>Jurassic</option>
                        <option>Cretaceous</option>
                    </select>

                    <select className="filterSelect filterDiet" value={diet} onChange={(e) => setDiet(e.target.value)}>
                        <option value="">All Diets</option>
                        <option>Carnivore</option>
                        <option>Herbivore</option>
                        <option>Omnivore</option>
                    </select>

                    <select className="filterSelect filterSort" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="name">Alphabetical</option>
                        <option value="era">Era</option>
                        <option value="danger">Danger</option>
                    </select>
                </div>
            </section>

            {/* ================= RESULTS ================= */}

            <section className="resultsSection">
                {loading ? (
                    <div className="loadingGrid">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="skeletonCard">
                                <div className="skeletonImage"></div>
                                <div className="skeletonText"></div>
                                <div className="skeletonText short"></div>
                            </div>
                        ))}
                    </div>
                ) : dinosaurs.length === 0 ? (
                    <div className="noResults">
                        <h2>No Dinosaurs Found</h2>
                        <p>Try changing your search keyword or filters.</p>
                    </div>
                ) : (
                    <>
                        <div className="resultsHeader">
                            <h3>{dinosaurs.length} Species Found</h3>
                        </div>

                        <div className="databaseGrid">
                            {dinosaurs.map((dinosaur) => (
                                <motion.div
                                    key={dinosaur.id || dinosaur._id}
                                    initial={{
                                        opacity: 0,
                                        y: 40,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                    }}
                                >
                                    <DinosaurCard dinosaur={dinosaur} />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* ================= FOOTER ================= */}

            <section className="databaseFooter">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="footerCard"
                >
                    <span>AI DATABASE</span>
                    <h2>Every Fossil Has A Story</h2>
                    <p>
                        Browse prehistoric life reconstructed using fossil evidence,
                        artificial intelligence and modern paleontology.
                    </p>
                </motion.div>
            </section>
        </div>
    );
}

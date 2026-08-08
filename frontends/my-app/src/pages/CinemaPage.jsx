import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaStar,
    FaClock,
    FaCalendarAlt,
    FaFilm,
    FaSearch,
    FaPlay,
    FaInfoCircle,
    FaTimes,
    FaGlobe,
    FaChevronRight,
    FaVolumeMute,
    FaVolumeUp,
    FaLightbulb,
    FaBookOpen,
    FaHistory
} from "react-icons/fa";
import { GiDinosaurRex } from "react-icons/gi";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import heroBanner from "../assets/dino_cinema_hero.png";
import "./CinemaPage.css";

// Import local high-quality dinosaur images as posters
import tyrannosaurusImg from "../assets/Dinosaurs_Images/Tyrannosaurus rex.png";
import triceratopsImg from "../assets/Dinosaurs_Images/Triceratops.png";
import brachiosaurusImg from "../assets/Dinosaurs_Images/Brachiosaurus.png";
import stegosaurusImg from "../assets/Dinosaurs_Images/Stegosaurus.png";
import allosaurusImg from "../assets/Dinosaurs_Images/Allosaurus.png";
import parasaurolophusImg from "../assets/Dinosaurs_Images/Parasaurolophus.png";
import ankylosaurusImg from "../assets/Dinosaurs_Images/Ankylosaurus.png";
import carnotaurusImg from "../assets/Dinosaurs_Images/Carnotaurus.png";
import spinosaurusImg from "../assets/Dinosaurs_Images/Spinosaurus.png";
import velociraptorImg from "../assets/Dinosaurs_Images/Velociraptor.png";

// Collection of all local dinosaur images to serve as varied dynamic fallbacks
const localDinoPosters = [
    tyrannosaurusImg,
    triceratopsImg,
    brachiosaurusImg,
    stegosaurusImg,
    allosaurusImg,
    parasaurolophusImg,
    ankylosaurusImg,
    carnotaurusImg,
    spinosaurusImg,
    velociraptorImg
];

// Helper to select a unique local dinosaur image based on text index/hash
const getDinoFallbackPoster = (title, index) => {
    const titleHash = title ? title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const idx = (index + titleHash) % localDinoPosters.length;
    return localDinoPosters[idx];
};

// Curated high-quality database of dinosaur-themed films and media
const curatedMovies = [
    {
        id: "m1",
        title: "Jurassic Park",
        year: 1993,
        duration: "127 min",
        director: "Steven Spielberg",
        rating: 8.2,
        category: "classics",
        description: "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
        poster: tyrannosaurusImg,
        videoUrl: "https://www.youtube.com/embed/QWBKeehUdfY?autoplay=1&rel=0",
        cast: "Sam Neill, Laura Dern, Jeff Goldblum, Richard Attenborough",
        dinosaurs: [
            { name: "Tyrannosaurus Rex", slug: "tyrannosaurus-rex" },
            { name: "Velociraptor", slug: "velociraptor" },
            { name: "Triceratops", slug: "triceratops" },
            { name: "Brachiosaurus", slug: "brachiosaurus" }
        ],
        trivia: [
            "The iconic roar of the T. Rex was a composite of a baby elephant, a tiger, and an alligator.",
            "The movie was so successful that it generated a massive surge of interest in paleontology, leading to a record number of students enrolling in the field.",
            "The animatronic T. Rex was extremely dangerous. It weighed 9,000 pounds and would occasionally shudder or turn on when it got wet from rain."
        ]
    },
    {
        id: "m2",
        title: "Prehistoric Planet",
        year: 2022,
        duration: "5 Episodes",
        director: "Jon Favreau, Mike Gunton",
        rating: 8.5,
        category: "documentaries",
        description: "Travel back 66 million years to when majestic dinosaurs and extraordinary creatures roamed the lands, seas, and skies, depicted with state-of-the-art CGI and narrated by Sir David Attenborough.",
        poster: triceratopsImg,
        videoUrl: "https://www.youtube.com/embed/wLd8k2g_yD0?autoplay=1&rel=0",
        cast: "David Attenborough (Narrator)",
        dinosaurs: [
            { name: "Tyrannosaurus Rex", slug: "tyrannosaurus-rex" },
            { name: "Triceratops", slug: "triceratops" }
        ],
        trivia: [
            "The series features the most scientifically accurate depictions of dinosaurs ever created for television.",
            "Sir David Attenborough's narration was recorded in his home studio during the COVID-19 pandemic lockdowns.",
            "It showcases dinosaurs in behaviors rarely shown before, such as swimming T-Rexes and displaying mating rituals."
        ]
    },
    {
        id: "m3",
        title: "Jurassic World",
        year: 2015,
        duration: "124 min",
        director: "Colin Trevorrow",
        rating: 7.0,
        category: "classics",
        description: "A new theme park, built on the original site of Jurassic Park, creates a genetically modified hybrid dinosaur, the Indominus Rex, which escapes containment and forces the park into a struggle for survival.",
        poster: spinosaurusImg,
        videoUrl: "https://www.youtube.com/embed/RFinNxS5KN4?autoplay=1&rel=0",
        cast: "Chris Pratt, Bryce Dallas Howard, Irrfan Khan, Vincent D'Onofrio",
        dinosaurs: [
            { name: "Tyrannosaurus Rex", slug: "tyrannosaurus-rex" },
            { name: "Velociraptor", slug: "velociraptor" },
            { name: "Ankylosaurus", slug: "ankylosaurus" }
        ],
        trivia: [
            "Chris Pratt's character, Owen Grady, was trained by real animal behaviorists to interact convincingly with velociraptors.",
            "Jurassic World became the first film in history to generate over $500 million globally in a single opening weekend."
        ]
    },
    {
        id: "m4",
        title: "The Land Before Time",
        year: 1988,
        duration: "69 min",
        director: "Don Bluth",
        rating: 7.4,
        category: "animations",
        description: "An orphaned brontosaurus named Littlefoot sets off in search of the legendary Great Valley, a land of lush vegetation where dinosaurs can thrive and co-exist in peace. Along the way, he meets four other young dinosaurs.",
        poster: brachiosaurusImg,
        videoUrl: "https://www.youtube.com/embed/cM4L40uJk8M?autoplay=1&rel=0",
        cast: "Gabriel Damon, Candace Hutson, Judith Barsi, Will Ryan",
        dinosaurs: [
            { name: "Brachiosaurus", slug: "brachiosaurus" },
            { name: "Triceratops", slug: "triceratops" },
            { name: "Stegosaurus", slug: "stegosaurus" }
        ],
        trivia: [
            "Steven Spielberg and George Lucas served as executive producers for this animated classic.",
            "The character of Littlefoot was originally named 'Thunder', but was changed to sound more friendly.",
            "Over 10 minutes of footage was cut from the film to make it less scary for young children."
        ]
    },
    {
        id: "m5",
        title: "Walking with Dinosaurs",
        year: 1999,
        duration: "6 Episodes",
        director: "Tim Haines",
        rating: 8.4,
        category: "documentaries",
        description: "The ground-breaking BBC documentary series that uses state-of-the-art computer effects and animatronics to recreate the Mesozoic Era, presenting dinosaurs as if they were filmed in their natural habitats.",
        poster: stegosaurusImg,
        videoUrl: "https://www.youtube.com/embed/d6101p4j64s?autoplay=1&rel=0",
        cast: "Kenneth Branagh (Narrator)",
        dinosaurs: [
            { name: "Tyrannosaurus Rex", slug: "tyrannosaurus-rex" },
            { name: "Diplodocus", slug: "brachiosaurus" },
            { name: "Stegosaurus", slug: "stegosaurus" },
            { name: "Allosaurus", slug: "velociraptor" }
        ],
        trivia: [
            "At the time of its release, it was recognized by the Guinness World Records as the most expensive documentary series per minute ever made.",
            "The creators used paleontologists as consultants for every single episode to ensure the anatomy and behavior was as accurate as 1999 science allowed.",
            "The series spawned multiple sequels, spin-offs, and an arena spectacular show."
        ]
    },
    {
        id: "m6",
        title: "Disney's Dinosaur",
        year: 2000,
        duration: "82 min",
        director: "Ralph Zondag, Eric Leighton",
        rating: 6.5,
        category: "animations",
        description: "An iguanodon raised by a family of lemurs joins an arduous trek to a sanctuary grounds after a devastating meteor shower destroys their island paradise.",
        poster: carnotaurusImg,
        videoUrl: "https://www.youtube.com/embed/37i45M1gK8E?autoplay=1&rel=0",
        cast: "D.B. Sweeney, Alfre Woodard, Ossie Davis, Samuel E. Wright",
        dinosaurs: [
            { name: "Carnotaurus", slug: "carnotaurus" },
            { name: "Brachiosaurus", slug: "brachiosaurus" }
        ],
        trivia: [
            "The film blended computer-animated prehistoric animals with live-action background scenery filmed in Hawaii and Venezuela.",
            "At the time of release, it was the most expensive computer-animated feature film ever produced."
        ]
    },
    {
        id: "m7",
        title: "The Lost World",
        year: 1925,
        duration: "106 min",
        director: "Harry O. Hoyt",
        rating: 7.0,
        category: "vintage",
        description: "The classic silent film based on Arthur Conan Doyle's novel. A crew of explorers led by Professor Challenger discover a remote plateau in South America where prehistoric creatures still roam.",
        poster: allosaurusImg,
        videoUrl: "https://www.youtube.com/embed/T0053C2H3rM?autoplay=1&rel=0",
        isArchive: true,
        cast: "Bessie Love, Lewis Stone, Wallace Beery",
        dinosaurs: [
            { name: "Allosaurus", slug: "velociraptor" },
            { name: "Brachiosaurus", slug: "brachiosaurus" },
            { name: "Triceratops", slug: "triceratops" }
        ],
        trivia: [
            "This is the first feature-length film to utilize stop-motion animation as its primary visual effect, created by the legendary Willis O'Brien (who later did King Kong).",
            "In 1998, the film was selected for preservation in the United States National Film Registry by the Library of Congress as being culturally, historically, or aesthetically significant.",
            "Author Arthur Conan Doyle actually appeared in the prologue of the film."
        ]
    },
    {
        id: "m8",
        title: "Gertie the Dinosaur",
        year: 1914,
        duration: "12 min",
        director: "Winsor McCay",
        rating: 7.3,
        category: "vintage",
        description: "Winsor McCay's historic short film, widely regarded as the first keyframe animated film and the first cartoon to feature a dinosaur with a distinct personality.",
        poster: parasaurolophusImg,
        videoUrl: "https://www.youtube.com/embed/TGXC8gXOPoU?autoplay=1&rel=0",
        isArchive: true,
        cast: "Winsor McCay",
        dinosaurs: [
            { name: "Brachiosaurus", slug: "brachiosaurus" }
        ],
        trivia: [
            "Winsor McCay drew every single one of the 10,000 frames by hand himself, including backgrounds, on translucent paper.",
            "McCay originally used the film as part of a vaudeville act where he would stand in front of the screen and interact with Gertie, 'throwing' her a cardboard apple.",
            "It is the earliest animated film to be preserved in the U.S. National Film Registry."
        ]
    }
];

export default function CinemaPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [activeMovie, setActiveMovie] = useState(null);
    const [modalTab, setModalTab] = useState("overview");
    const [isMuted, setIsMuted] = useState(true);

    // API state
    const [apiResults, setApiResults] = useState([]);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [searchedGlobal, setSearchedGlobal] = useState(false);

    // Wikipedia category members feed
    const [wikiFeedMovies, setWikiFeedMovies] = useState([]);
    const [wikiFeedLoading, setWikiFeedLoading] = useState(false);

    // Fetch live Category Members of "Films about dinosaurs" from Wikipedia API (Free, No Key)
    const fetchWikipediaCategoryMovies = async () => {
        setWikiFeedLoading(true);
        try {
            // Fetch category members
            const catUrl = "https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Films_about_dinosaurs&cmlimit=8&format=json&origin=*";
            const catRes = await fetch(catUrl);
            const catData = await catRes.json();
            const members = catData?.query?.categorymembers || [];

            if (members.length === 0) return;

            // Fetch detail details for these pages
            const titles = members.map(m => m.title);
            const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts&exintro&explaintext&titles=${encodeURIComponent(titles.join("|"))}&format=json&pithumbsize=400&origin=*`;
            const detailsRes = await fetch(detailsUrl);
            const detailsData = await detailsRes.json();
            const pages = detailsData?.query?.pages || {};

            const mappedFeed = Object.values(pages)
                .filter(page => page.title && !page.title.startsWith("Category:"))
                .map((page, idx) => {
                    const cleanTitle = page.title.replace(/\s*\(.*?\)\s*/g, ""); // clean "(film)" etc.
                    return {
                        id: `wiki-feed-${page.pageid}`,
                        title: cleanTitle,
                        wikiTitle: page.title,
                        director: "Wikipedia Contributor",
                        year: "Wiki Article",
                        duration: "Study",
                        rating: "Free",
                        description: page.extract ? page.extract.substring(0, 160) + "..." : "Dynamic study resource fetched via free Wikipedia API.",
                        fullDescription: page.extract || "No summary available.",
                        poster: page.thumbnail?.source || getDinoFallbackPoster(cleanTitle, idx),
                        videoUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
                        isWiki: true,
                        dinosaurs: [{ name: "Species Index", slug: "research-database" }],
                        trivia: ["This entry was fetched dynamically from Wikipedia's Category:Films_about_dinosaurs."]
                    };
                });

            setWikiFeedMovies(mappedFeed);
        } catch (err) {
            console.error("Wikipedia Category API error: ", err);
        } finally {
            setWikiFeedLoading(false);
        }
    };

    // Dynamic Filtered Local Movies
    const filteredMovies = curatedMovies.filter(movie => {
        const matchesCategory = selectedCategory === "all" || movie.category === selectedCategory;
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Fetch from Internet Archive API (Free, no-key public API)
    const fetchGlobalArchive = async (query) => {
        if (!query || query.trim().length < 2) return;
        setApiLoading(true);
        setApiError("");
        setSearchedGlobal(true);

        try {
            // Search Archive.org for subject dinosaur AND mediatype movies
            const archiveUrl = `https://archive.org/advancedsearch.php?q=title:(${encodeURIComponent(query)}+dinosaur)+AND+mediatype:(movies)&fl[]=identifier,title,description,year,downloads,creator&rows=6&output=json`;
            const response = await fetch(archiveUrl);

            if (!response.ok) {
                throw new Error("Unable to fetch data from Internet Archive");
            }

            const data = await response.json();
            const docs = data?.response?.docs || [];

            const mappedResults = docs.map(doc => ({
                id: doc.identifier,
                title: doc.title || "Untitled Dinosaur Film",
                year: doc.year || "N/A",
                director: doc.creator || "Unknown Creator",
                description: doc.description || "No synopsis available from the archive database.",
                downloads: doc.downloads || 0,
                videoUrl: `https://archive.org/embed/${doc.identifier}`,
                category: "global",
                poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=400&auto=format&fit=crop",
                isArchive: true,
                dinosaurs: [{ name: "Prehistoric Species", slug: "research-database" }]
            }));

            setApiResults(mappedResults);
        } catch (err) {
            console.error("Archive API Error: ", err);
            // Fallback to Wikipedia Movie Search if Archive.org fails or is offline
            await fetchWikipediaSearch(query);
        } finally {
            setApiLoading(false);
        }
    };

    // Wikipedia Search fallback (CORS free, no-key)
    const fetchWikipediaSearch = async (query) => {
        try {
            const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=dinosaur+movie+${encodeURIComponent(query)}&format=json&origin=*`;
            const response = await fetch(wikiUrl);
            if (!response.ok) throw new Error("Wikipedia request failed");

            const data = await response.json();
            const results = data?.query?.search || [];

            const mappedResults = results.slice(0, 4).map(item => ({
                id: `wiki-${item.pageid}`,
                title: item.title,
                year: "N/A",
                director: "Wikipedia Article",
                description: item.snippet.replace(/<\/?[^>]+(>|$)/g, ""), // clean html
                category: "wiki",
                poster: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=400&auto=format&fit=crop",
                isWiki: true,
                wikiTitle: item.title,
                dinosaurs: [{ name: "Learn More", slug: "research-database" }]
            }));
            setApiResults(mappedResults);
        } catch (err) {
            setApiError("Prehistoric archive servers are currently offline. Please explore our local selection!");
        }
    };

    // Debounce search input for API trigger
    useEffect(() => {
        if (!searchTerm || searchTerm.trim().length < 3) {
            setApiResults([]);
            setSearchedGlobal(false);
            return;
        }

        const delayDebounce = setTimeout(() => {
            fetchGlobalArchive(searchTerm);
        }, 800);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // Load category feed on mount
    useEffect(() => {
        fetchWikipediaCategoryMovies();
    }, []);

    const handleDinoClick = (slug) => {
        setActiveMovie(null);
        navigate(`/dinosaur/${slug}`);
    };

    // Featured Movie (Static Spotlight)
    const featuredMovie = curatedMovies[1]; // Prehistoric Planet

    return (
        <div className="cinema-page-container">
            <Navbar />

            <main className="cinema-page-content">
                <div className="cinema-ambient-glow"></div>
                <div className="cinema-ambient-glow-secondary"></div>

                {/* Hero Spotlight Section */}
                <motion.section
                    className="cinema-hero-section"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div
                        className="cinema-hero-bg"
                        style={{ backgroundImage: `url(${heroBanner})` }}
                    />
                    <div className="cinema-hero-overlay" />

                    <div className="cinema-hero-content">
                        <div className="cinema-featured-badge">
                            <GiDinosaurRex /> Featured Spotlight
                        </div>
                        <h1 className="cinema-hero-title">{featuredMovie.title}</h1>

                        <div className="cinema-hero-meta">
                            <span><FaCalendarAlt /> {featuredMovie.year}</span>
                            <span><FaClock /> {featuredMovie.duration}</span>
                            <span><FaStar className="cinema-rating-star" /> {featuredMovie.rating} / 10</span>
                        </div>

                        <p className="cinema-hero-desc">
                            {featuredMovie.description}
                        </p>

                        <div className="cinema-hero-buttons">
                            <button
                                className="cinema-btn-primary"
                                onClick={() => {
                                    setActiveMovie(featuredMovie);
                                    setModalTab("overview");
                                }}
                            >
                                <FaPlay /> ENTER THEATER
                            </button>
                            <button
                                className="cinema-btn-secondary"
                                onClick={() => {
                                    setActiveMovie(featuredMovie);
                                    setModalTab("trivia");
                                }}
                            >
                                <FaInfoCircle /> VIEW TRIVIA
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* Search & Dynamic Filter Section */}
                <section className="cinema-search-section">
                    <div className="cinema-search-container">
                        <div className="cinema-search-header">
                            <div className="cinema-search-info">
                                <h3>Prehistoric Screenings</h3>
                                <p>Discover blockbusters, animation features, and scientific archives</p>
                            </div>
                            <div className="cinema-search-bar">
                                <FaSearch className="cinema-search-icon" />
                                <input
                                    type="text"
                                    className="cinema-search-input"
                                    placeholder="Search movies, directors, or dinosaurs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="cinema-filters">
                            <button
                                className={`cinema-filter-btn ${selectedCategory === "all" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("all")}
                            >
                                <FaFilm /> All Screenings
                            </button>
                            <button
                                className={`cinema-filter-btn ${selectedCategory === "classics" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("classics")}
                            >
                                <GiDinosaurRex /> Blockbuster Classics
                            </button>
                            <button
                                className={`cinema-filter-btn ${selectedCategory === "documentaries" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("documentaries")}
                            >
                                <FaBookOpen /> Documentaries
                            </button>
                            <button
                                className={`cinema-filter-btn ${selectedCategory === "animations" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("animations")}
                            >
                                <FaLightbulb /> Animations
                            </button>
                            <button
                                className={`cinema-filter-btn ${selectedCategory === "vintage" ? "active" : ""}`}
                                onClick={() => setSelectedCategory("vintage")}
                            >
                                <FaHistory /> Vintage Archives
                            </button>
                        </div>
                    </div>
                </section>

                {/* Primary Movies Grid */}
                <section className="cinema-movies-section">
                    <div className="cinema-section-heading">
                        <h2>
                            <FaFilm /> {selectedCategory === "all" ? "Curated Prehistoric Cinema" : `${selectedCategory.toUpperCase()} Selection`}
                        </h2>
                        <span style={{ fontSize: "13px", color: "#888888" }}>
                            Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="cinema-movies-grid">
                        {filteredMovies.map((movie, index) => (
                            <motion.div
                                className="cinema-movie-card"
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                onClick={() => {
                                    setActiveMovie(movie);
                                    setModalTab("overview");
                                }}
                            >
                                <div className="cinema-card-poster-wrapper">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="cinema-card-poster"
                                        loading="lazy"
                                    />
                                    <div className="cinema-card-glow" />
                                    <div className="cinema-card-overlay" />
                                    {movie.isArchive && (
                                        <div className="cinema-badge">FREE ARCHIVE</div>
                                    )}
                                    <div className="cinema-play-hover-btn">
                                        <FaPlay />
                                    </div>
                                </div>

                                <div className="cinema-card-details">
                                    <div className="cinema-card-info-top">
                                        <h3 className="cinema-card-title">{movie.title}</h3>
                                        <div className="cinema-card-meta">
                                            <span className="cinema-card-meta-item">
                                                <FaCalendarAlt /> {movie.year}
                                            </span>
                                            <span className="cinema-card-meta-item">
                                                <FaClock /> {movie.duration}
                                            </span>
                                            <span className="cinema-card-meta-item" style={{ color: "#D6A14B" }}>
                                                <FaStar /> {movie.rating}
                                            </span>
                                        </div>
                                        <p className="cinema-card-desc">{movie.description}</p>
                                    </div>

                                    <div className="cinema-card-footer">
                                        <span className="cinema-card-director">
                                            Dir: <strong>{movie.director}</strong>
                                        </span>
                                        <button className="cinema-card-more-btn">
                                            Details <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredMovies.length === 0 && (
                        <div className="cinema-api-status">
                            No films match your current local filters. Try searching globally!
                        </div>
                    )}
                </section>

                {/* Dynamic Wikipedia Live Feed (Category: Films about dinosaurs) */}
                {wikiFeedMovies.length > 0 && !searchTerm && (
                    <section className="cinema-movies-section" style={{ borderTop: "1px solid rgba(214, 161, 75, 0.15)", paddingTop: "40px", marginTop: "20px" }}>
                        <div className="cinema-section-heading">
                            <h2>
                                <FaFilm style={{ color: "#D6A14B" }} /> Trending Dinosaur Movies
                            </h2>
                            <div className="cinema-api-badge" style={{ background: "rgba(214, 161, 75, 0.15)", border: "1px solid #D6A14B", color: "#D6A14B" }}>
                                Live Feed
                            </div>
                        </div>

                        {wikiFeedLoading ? (
                            <div className="cinema-api-status">
                                <div className="cinema-spinner" />
                                <span>Querying Wikipedia database...</span>
                            </div>
                        ) : (
                            <div className="cinema-movies-grid">
                                {wikiFeedMovies.map((movie, index) => (
                                    <motion.div
                                        className="cinema-movie-card"
                                        key={movie.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        onClick={() => {
                                            setActiveMovie(movie);
                                            setModalTab("overview");
                                        }}
                                    >
                                        <div className="cinema-card-poster-wrapper">
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="cinema-card-poster"
                                                loading="lazy"
                                            />
                                            <div className="cinema-card-glow" />
                                            <div className="cinema-card-overlay" />
                                            <div className="cinema-badge" style={{ backgroundColor: "#D6A14B", borderColor: "#C1903E", color: "#ffffff" }}>
                                                PLAYABLE TRAILER
                                            </div>
                                            <div className="cinema-play-hover-btn" style={{ background: "#D6A14B", boxShadow: "0 0 25px rgba(214, 161, 75, 0.6)", opacity: 1, transform: "translate(-50%, -50%) scale(1)" }}>
                                                <FaPlay style={{ color: "#ffffff" }} />
                                            </div>
                                        </div>

                                        <div className="cinema-card-details">
                                            <div className="cinema-card-info-top">
                                                <h3 className="cinema-card-title">{movie.title}</h3>
                                                <div className="cinema-card-meta">
                                                    <span className="cinema-card-meta-item">
                                                        <FaGlobe /> {movie.year}
                                                    </span>
                                                    <span className="cinema-card-meta-item">
                                                        <FaClock /> {movie.duration}
                                                    </span>
                                                    <span className="cinema-card-meta-item" style={{ color: "#D6A14B" }}>
                                                        <FaStar /> {movie.rating}
                                                    </span>
                                                </div>
                                                <p className="cinema-card-desc">{movie.description}</p>
                                            </div>

                                            <div className="cinema-card-footer">
                                                <span className="cinema-card-director">
                                                    Source: <strong>Wikipedia</strong>
                                                </span>
                                                <button className="cinema-card-more-btn" style={{ color: "#D6A14B" }}>
                                                    Play Trailer <FaChevronRight />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Dynamic Global Discovery Section (API Integration) */}
                <AnimatePresence>
                    {searchedGlobal && (
                        <motion.section
                            className="cinema-api-section"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="cinema-api-card">
                                <div className="cinema-api-header">
                                    <h3 className="cinema-api-title">
                                        <FaGlobe style={{ color: "#D6A14B" }} /> Global Prehistoric Archives
                                    </h3>
                                    <div className="cinema-api-badge">Live API Search</div>
                                </div>

                                {apiLoading && (
                                    <div className="cinema-api-status">
                                        <div className="cinema-spinner" />
                                        <span>Exhuming global files...</span>
                                    </div>
                                )}

                                {apiError && (
                                    <div className="cinema-api-status" style={{ color: "#e74c3c" }}>
                                        {apiError}
                                    </div>
                                )}

                                {!apiLoading && !apiError && apiResults.length === 0 && (
                                    <div className="cinema-api-status">
                                        No matching films found in the global archives. Try searching "Jurassic", "Dinosaur", or "Prehistoric".
                                    </div>
                                )}

                                {!apiLoading && !apiError && apiResults.length > 0 && (
                                    <div className="cinema-api-grid">
                                        {apiResults.map(item => (
                                            <div
                                                className="cinema-api-item"
                                                key={item.id}
                                                onClick={() => {
                                                    // Map API Item into standard Modal format
                                                    setActiveMovie({
                                                        title: item.title,
                                                        year: item.year,
                                                        duration: item.downloads ? `${item.downloads} downloads` : "N/A",
                                                        director: item.director,
                                                        rating: "Archive",
                                                        description: item.description,
                                                        poster: item.poster,
                                                        videoUrl: item.videoUrl || `https://en.wikipedia.org/wiki/${item.wikiTitle}`,
                                                        isArchive: item.isArchive,
                                                        isWiki: item.isWiki,
                                                        cast: item.director,
                                                        dinosaurs: item.dinosaurs,
                                                        trivia: ["This item was dynamically retrieved using a public open API."]
                                                    });
                                                    setModalTab("overview");
                                                }}
                                            >
                                                <div>
                                                    <h4 className="cinema-api-item-title">{item.title}</h4>
                                                    <p className="cinema-api-item-desc">{item.description}</p>
                                                </div>
                                                <div className="cinema-api-item-footer">
                                                    <span>Year: {item.year}</span>
                                                    <span className="cinema-api-item-source">
                                                        {item.isArchive ? "Internet Archive" : "Wikipedia"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>

            {/* Immersive Theater Overlay Modal */}
            <AnimatePresence>
                {activeMovie && (
                    <motion.div
                        className="cinema-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="cinema-modal-container"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 180 }}
                        >
                            <button
                                className="cinema-modal-close-btn"
                                onClick={() => setActiveMovie(null)}
                                aria-label="Close Cinema Screen"
                            >
                                <FaTimes />
                            </button>

                            <div className="cinema-projector-beam" />

                             {/* Cinema Screen (Video Player Viewport) */}
                            <div className="cinema-video-screen">
                                <iframe
                                    className="cinema-iframe"
                                    src={activeMovie.isWiki ? `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(activeMovie.title + ' trailer')}&autoplay=1` : activeMovie.videoUrl}
                                    title={`${activeMovie.title} Trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>

                            {/* Detailed Information Panels */}
                            <div className="cinema-modal-details">
                                <div className="cinema-modal-header">
                                    <div className="cinema-modal-title-area">
                                        <h2 className="cinema-modal-title">{activeMovie.title}</h2>
                                        <div className="cinema-modal-meta-grid">
                                            <span className="cinema-modal-meta-tag">Dir: {activeMovie.director}</span>
                                            <span className="cinema-modal-meta-tag">Released: {activeMovie.year}</span>
                                            <span className="cinema-modal-meta-tag">Length: {activeMovie.duration}</span>
                                        </div>
                                    </div>

                                    <div className="cinema-modal-rating-badge">
                                        <FaStar />
                                        <span>{activeMovie.rating === "Archive" ? "Public Domain" : `${activeMovie.rating} / 10`}</span>
                                    </div>
                                </div>

                                <div className="cinema-modal-tabs">
                                    <button
                                        className={`cinema-modal-tab-btn ${modalTab === "overview" ? "active" : ""}`}
                                        onClick={() => setModalTab("overview")}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        className={`cinema-modal-tab-btn ${modalTab === "species" ? "active" : ""}`}
                                        onClick={() => setModalTab("species")}
                                    >
                                        Featured Dinosaurs
                                    </button>
                                    <button
                                        className={`cinema-modal-tab-btn ${modalTab === "trivia" ? "active" : ""}`}
                                        onClick={() => setModalTab("trivia")}
                                    >
                                        Production Trivia
                                    </button>
                                </div>

                                <div className="cinema-modal-tab-content">
                                    {modalTab === "overview" && (
                                        <div>
                                            <p style={{ marginBottom: "15px" }}>{activeMovie.description}</p>
                                            <p><strong>Cast & Crew:</strong> {activeMovie.cast}</p>
                                        </div>
                                    )}

                                    {modalTab === "species" && (
                                        <div>
                                            <p style={{ marginBottom: "12px" }}>The following species are featured in this production. Click their tag to study their full genetic research dossier:</p>
                                            <div className="cinema-featured-dinos">
                                                {activeMovie.dinosaurs.map(dino => (
                                                    <div
                                                        key={dino.slug}
                                                        className="cinema-dino-tag"
                                                        onClick={() => handleDinoClick(dino.slug)}
                                                    >
                                                        <GiDinosaurRex className="cinema-dino-tag-icon" />
                                                        <span>{dino.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {modalTab === "trivia" && (
                                        <div className="cinema-trivia-list">
                                            {activeMovie.trivia.map((triv, idx) => (
                                                <div className="cinema-trivia-item" key={idx}>
                                                    <FaLightbulb className="cinema-trivia-icon" />
                                                    <p>{triv}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

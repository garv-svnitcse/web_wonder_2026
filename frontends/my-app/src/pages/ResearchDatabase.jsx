import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import DinosaurCard from "../components/DinosaurCard/DinosaurCard";
import "../styles/ResearchDatabase.css";

export default function ResearchDatabase() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [dinosaurs, setDinosaurs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [era, setEra] = useState(searchParams.get("era") || "");

    const [diet, setDiet] = useState("");

    const [sort, setSort] = useState("name");

    useEffect(() => {

        loadDinosaurs();

    }, [search, era, diet, sort]);

    async function loadDinosaurs() {

        setLoading(true);

        try {

            /*
                Replace this URL with your backend.

                Example:

                http://localhost:5000/api/dinosaurs

            */

            const response = await fetch(

                `http://127.0.0.1:5000/dinosaurs?search=${search}&era=${era}&diet=${diet}&sort=${sort}`

            );

            const data = await response.json();
            if (Array.isArray(data)) {
                setDinosaurs(data);
            } else {
                console.warn("Invalid data received from API:", data);
                setDinosaurs([]);
            }

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="databasePage">

            <section className="databaseHero">

                <motion.h1

                    initial={{

                        opacity: 0,

                        y: 40

                    }}

                    animate={{

                        opacity: 1,

                        y: 0

                    }}

                >

                    Jurassic Research Database

                </motion.h1>

                <motion.p

                    initial={{

                        opacity: 0

                    }}

                    animate={{

                        opacity: 1

                    }}

                    transition={{

                        delay: .2

                    }}

                >

                    Search thousands of prehistoric species reconstructed using
                    fossil evidence, AI models and DNA simulations.

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

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                    />

                </div>

                <div className="filters">

                    <div className="filterTitle">

                        <FaFilter />

                        Filters

                    </div>

                    <select

                        value={era}

                        onChange={(e) => {
                            const newEra = e.target.value;
                            setEra(newEra);
                            if (newEra) {
                                setSearchParams({ era: newEra });
                            } else {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.delete("era");
                                setSearchParams(newParams);
                            }
                        }}

                    >

                        <option value="">

                            All Eras

                        </option>

                        <option>

                            Triassic

                        </option>

                        <option>

                            Jurassic

                        </option>

                        <option>

                            Cretaceous

                        </option>

                    </select>

                    <select

                        value={diet}

                        onChange={(e) => setDiet(e.target.value)}

                    >

                        <option value="">

                            All Diets

                        </option>

                        <option>

                            Carnivore

                        </option>

                        <option>

                            Herbivore

                        </option>

                        <option>

                            Omnivore

                        </option>

                    </select>

                    <select

                        value={sort}

                        onChange={(e) => setSort(e.target.value)}

                    >

                        <option value="name">

                            Alphabetical

                        </option>

                        <option value="era">

                            Era

                        </option>

                        <option value="danger">

                            Danger

                        </option>

                    </select>

                </div>

            </section>

            {/* ================= RESULTS ================= */}

            <section className="resultsSection">
                {

                    loading ?

                        (

                            <div className="loadingGrid">

                                {

                                    [...Array(8)].map((_, index) => (

                                        <div

                                            key={index}

                                            className="skeletonCard"

                                        >

                                            <div className="skeletonImage"></div>

                                            <div className="skeletonText"></div>

                                            <div className="skeletonText short"></div>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                        :

                        dinosaurs.length === 0 ?

                            (

                                <div className="noResults">

                                    <h2>

                                        No Dinosaurs Found

                                    </h2>

                                    <p>

                                        Try changing your search keyword or filters.

                                    </p>

                                </div>

                            )

                            :

                            (

                                <>

                                    <div className="resultsHeader">

                                        <h3>

                                            {

                                                dinosaurs.length

                                            } Species Found

                                        </h3>

                                    </div>

                                    <div className="databaseGrid">

                                        {

                                            dinosaurs.map((dinosaur) => (

                                                <motion.div

                                                    key={dinosaur.id || dinosaur._id}

                                                    initial={{

                                                        opacity: 0,

                                                        y: 40

                                                    }}

                                                    whileInView={{

                                                        opacity: 1,

                                                        y: 0

                                                    }}

                                                    viewport={{

                                                        once: true

                                                    }}

                                                    transition={{

                                                        duration: .5

                                                    }}

                                                >

                                                    <DinosaurCard

                                                        dinosaur={dinosaur}

                                                    />

                                                </motion.div>

                                            ))

                                        }

                                    </div>

                                </>

                            )

                }

            </section>

            {/* ================= FOOTER ================= */}

            <section className="databaseFooter">

                <motion.div

                    initial={{

                        opacity: 0,

                        y: 40

                    }}

                    whileInView={{

                        opacity: 1,

                        y: 0

                    }}

                    viewport={{

                        once: true

                    }}

                    className="footerCard"

                >

                    <span>

                        AI DATABASE

                    </span>

                    <h2>

                        Every Fossil Has A Story

                    </h2>

                    <p>

                        Browse prehistoric life reconstructed using fossil

                        evidence, artificial intelligence and modern

                        paleontology.

                    </p>

                </motion.div>

            </section>

        </div>

    );

}

// backend returns the following - 
// [
//     {
//         "_id":"6874e4...",

//         "slug":"trex",

//         "name":"Tyrannosaurus Rex",

//         "thumbnail":"http://localhost:5000/uploads/trex.jpg",

//         "era":"Late Cretaceous",

//         "diet":"Carnivore",

//         "danger":"Extreme"
//     }
// ]
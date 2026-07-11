import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import "../styles/ResearchPreview.css";

const articles = [
  {
    title: "The Rise of the Tyrant King",
    category: "Paleontology",
    description:
      "Explore how Tyrannosaurus Rex evolved into one of the greatest predators in Earth's history."
  },

  {
    title: "Life During the Jurassic",
    category: "Research",
    description:
      "Discover the climate, forests and ecosystems that dominated the Jurassic period."
  },

  {
    title: "New Fossil Discoveries",
    category: "Breaking Research",
    description:
      "Scientists continue uncovering fossils that rewrite everything we thought we knew."
  }
];

export default function ResearchPreview() {

    return (

        <section className="researchPreview">

            <motion.div

                className="researchHeader"

                initial={{opacity:0,y:60}}

                whileInView={{opacity:1,y:0}}

                viewport={{once:true}}

                transition={{duration:.8}}

            >

                <span>

                    LATEST DISCOVERIES

                </span>

                <h2>

                    CURRENT RESEARCH

                </h2>

                <p>

                    Stay updated with the newest discoveries and
                    groundbreaking paleontological research from
                    around the world.

                </p>

            </motion.div>

            <div className="researchGrid">

                {articles.map((article,index)=>(

                    <motion.div

                        key={index}

                        className="researchCard"

                        initial={{
                            opacity:0,
                            y:70
                        }}

                        whileInView={{
                            opacity:1,
                            y:0
                        }}

                        viewport={{
                            once:true
                        }}

                        transition={{
                            delay:index*.2
                        }}

                    >

                        <span className="category">

                            {article.category}

                        </span>

                        <h3>

                            {article.title}

                        </h3>

                        <p>

                            {article.description}

                        </p>

                        <Link to="/research">

                            Read More

                            <FaArrowRight/>

                        </Link>

                    </motion.div>

                ))}

            </div>

        </section>

    )

}
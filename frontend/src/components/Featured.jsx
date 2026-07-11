import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

import "../styles/Featured.css";

import trex from "../assets/trex.jpg";
import spino from "../assets/spino.jpg";
import raptor from "../assets/raptor.jpg";
import triceratops from "../assets/triceratops.jpg";

const dinosaurs = [
  {
    id: 1,
    title: "TYRANNOSAURUS REX",
    subtitle: "King of Predators",
    image: trex,
    description:
      "The undisputed apex predator of the Late Cretaceous. Massive jaws, immense power and one of the most iconic creatures to ever roam Earth."
  },

  {
    id: 2,
    title: "SPINOSAURUS",
    subtitle: "River Hunter",
    image: spino,
    description:
      "Larger than T-Rex and perfectly adapted for both land and water. One of the most mysterious dinosaurs ever discovered."
  },

  {
    id: 3,
    title: "VELOCIRAPTOR",
    subtitle: "Master Hunter",
    image: raptor,
    description:
      "Fast, intelligent and deadly. Velociraptors hunted with precision and remarkable coordination."
  },

  {
    id: 4,
    title: "TRICERATOPS",
    subtitle: "Forest Giant",
    image: triceratops,
    description:
      "An enormous herbivore equipped with three horns and a powerful frill used for defense and display."
  }
];

export default function Featured() {

  return (

    <section className="featured">

      <motion.div

        className="featuredHeading"

        initial={{opacity:0,y:60}}

        whileInView={{opacity:1,y:0}}

        viewport={{once:true}}

        transition={{duration:.8}}

      >

        <span>

          DISCOVER

        </span>

        <h2>

          LEGENDARY DINOSAURS

        </h2>

        <p>

          Explore the most iconic creatures that ruled the prehistoric world.

        </p>

      </motion.div>

      <div className="featuredGrid">

        {dinosaurs.map((dinosaur,index)=>(

          <motion.div

            key={dinosaur.id}

            className="dinoCard"

            initial={{
              opacity:0,
              y:80
            }}

            whileInView={{
              opacity:1,
              y:0
            }}

            viewport={{
              once:true
            }}

            transition={{
              duration:.8,
              delay:index*.15
            }}

          >

            <div className="imageWrapper">

              <img

                src={dinosaur.image}

                alt={dinosaur.title}

              />

              <div className="imageOverlay"></div>

            </div>

            <div className="cardContent">

              <h3>

                {dinosaur.title}

              </h3>

              <h4>

                {dinosaur.subtitle}

              </h4>

              <p>

                {dinosaur.description}

              </p>

              <button>

                DISCOVER

                <FaArrowRight />

              </button>

            </div>

          </motion.div>

        ))}

      </div>

    </section>

  );

}
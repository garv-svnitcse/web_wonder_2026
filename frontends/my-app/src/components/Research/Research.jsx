import ParticleBackground from "./ParticleBackground";
import { motion } from "framer-motion";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./Research.css";

const database = [
  {
    name: "Tyrannosaurus Rex",
    era: "Late Cretaceous",
    diet: "Carnivore",
    threat: "Extreme",
    image:
      "https://drive.google.com/file/d/1bQQS3i2u3Y80cUHXp6LomVr1H3bdclKp/view?usp=sharing",
    slug: "tyrannosaurus-rex",
  },
  {
    name: "Spinosaurus",
    era: "Late Cretaceous",
    diet: "Piscivore",
    threat: "Extreme",
    image:
      "https://drive.google.com/file/d/1Szlqa0S_vwA-1JESTsVHlQvjVTBVurKV/view?usp=sharing",
    slug: "spinosaurus-aegyptiacus",
  },
  {
    name: "Velociraptor",
    era: "Late Cretaceous",
    diet: "Carnivore",
    threat: "High",
    image:
      "https://drive.google.com/file/d/1XJ_RZRZuyB5swHla3PxZfpg6Ebh8Ojri/view?usp=sharing",
    slug: "velociraptor-mongoliensis",
  },
  {
    name: "Triceratops",
    era: "Late Cretaceous",
    diet: "Herbivore",
    threat: "Medium",
    image:
      "https://drive.google.com/file/d/1WRSzIvYLGCm1SVcOjobylpVIDL0avd2w/view?usp=sharing",
    slug: "triceratops-horridus",
  },
];
const getDirectDriveLink = (url) => {
  if (!url) return "";
  if (url.includes("drive.google.com/file/d/")) {
    const parts = url.split("drive.google.com/file/d/");
    if (parts.length > 1) {
      const id = parts[1].split("/")[0];
      return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    }
  }
  return url;
};

export default function Research() {
  const [search, setSearch] = useState("");

  const filtered = database.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section
      className="research"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <ParticleBackground />
      <div className="researchHeading">
        <span>CLASSIFIED DATABASE</span>
        <h2>Research Archives</h2>
        <p>
          Browse the Jurassic Journey fossil database and discover scientific
          records from prehistoric Earth.
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
        {filtered.map((dinosaur, index) => (
          <motion.div
            key={dinosaur.slug}
            className="researchCard"
            initial={
              search
                ? false
                : {
                    opacity: 0,
                    y: 60,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={
              search
                ? { duration: 0 }
                : {
                    duration: 0.7,
                    delay: index * 0.1,
                  }
            }
          >
            <img src={getDirectDriveLink(dinosaur.image)} alt={dinosaur.name} />
            <div className="researchContent">
              <span>{dinosaur.era}</span>
              <h3>{dinosaur.name}</h3>
              <div className="researchMeta">
                <div>
                  <h5>Diet</h5>
                  <p>{dinosaur.diet}</p>
                </div>
                <div>
                  <h5>Threat</h5>
                  <p>{dinosaur.threat}</p>
                </div>
              </div>

              <Link
                to={`/research/${dinosaur.slug}`}
                className="researchButton"
              >
                OPEN DOSSIER
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

import "../styles/CommunityCTA.css";

export default function CommunityCTA(){

    return(

        <section className="communitySection">

            <div className="communityOverlay"></div>

            <motion.div

                className="communityContent"

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
                    duration:.8
                }}

            >

                <span>

                    JOIN THE EXPEDITION

                </span>

                <h2>

                    EXPLORE THE
                    <br/>
                    LOST WORLD
                    <br/>
                    TOGETHER

                </h2>

                <p>

                    Connect with dinosaur enthusiasts, researchers,
                    students and explorers from around the globe.
                    Share discoveries, discuss fossils and participate
                    in exciting community events.

                </p>

                <Link to="/community">

                    <FaUsers/>

                    JOIN COMMUNITY

                </Link>

            </motion.div>

        </section>

    )

}
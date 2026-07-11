import { motion } from "framer-motion";
import "../styles/TimelinePreview.css";

const eras = [

    {
        year: "252 MYA",
        title: "TRIASSIC",
        desc: "The beginning of the dinosaurs. Small predators and the first gigantic reptiles emerged."
    },

    {
        year: "201 MYA",
        title: "JURASSIC",
        desc: "Massive herbivores dominated lush forests while enormous predators hunted across the continents."
    },

    {
        year: "145 MYA",
        title: "CRETACEOUS",
        desc: "The final age of dinosaurs before the asteroid impact changed Earth's history forever."
    }

];

export default function TimelinePreview(){

    return(

        <section className="timelinePreview">

            <motion.div

                className="timelineHeader"

                initial={{opacity:0,y:60}}

                whileInView={{opacity:1,y:0}}

                viewport={{once:true}}

                transition={{duration:.8}}

            >

                <span>TIME TRAVEL</span>

                <h2>

                    PREHISTORIC ERAS

                </h2>

                <p>

                    Explore millions of years of prehistoric evolution.

                </p>

            </motion.div>

            <div className="timeline">

                {eras.map((era,index)=>(

                    <motion.div

                        key={index}

                        className="era"

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
                            delay:index*.2
                        }}

                    >

                        <div className="dot"></div>

                        <div className="line"></div>

                        <div className="eraCard">

                            <span>

                                {era.year}

                            </span>

                            <h3>

                                {era.title}

                            </h3>

                            <p>

                                {era.desc}

                            </p>

                        </div>

                    </motion.div>

                ))}

            </div>

        </section>

    )

}
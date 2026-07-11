import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import "../styles/QuizCTA.css";

export default function QuizCTA() {

    return(

        <section className="quizSection">

            <motion.div

                className="quizCard"

                initial={{
                    opacity:0,
                    scale:.9
                }}

                whileInView={{
                    opacity:1,
                    scale:1
                }}

                viewport={{
                    once:true
                }}

                transition={{
                    duration:.8
                }}

            >

                <span>

                    TEST YOUR KNOWLEDGE

                </span>

                <h2>

                    THINK YOU CAN
                    <br/>
                    SURVIVE THE
                    <br/>
                    MESOZOIC?

                </h2>

                <p>

                    Challenge yourself with interactive quizzes covering
                    dinosaurs, prehistoric ecosystems, fossils and Earth's
                    greatest extinction event.

                </p>

                <Link to="/quiz">

                    Start Quiz

                    <FaArrowRight/>

                </Link>

            </motion.div>

        </section>

    )

}
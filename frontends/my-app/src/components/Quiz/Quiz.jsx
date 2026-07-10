import { useState } from "react";
import { motion } from "framer-motion";
import {
    FaCheck,
    FaTimes,
    FaArrowRight
} from "react-icons/fa";

import "./Quiz.css";

const questions = [

    {

        question: "Which dinosaur is known as the King of Dinosaurs?",

        options: [
            "Tyrannosaurus Rex",
            "Velociraptor",
            "Spinosaurus",
            "Triceratops"
        ],

        answer: 0

    },

    {

        question: "Which period came first?",

        options: [
            "Jurassic",
            "Cretaceous",
            "Triassic",
            "Ice Age"
        ],

        answer: 2

    },

    {

        question: "Which dinosaur had a massive sail on its back?",

        options: [
            "Brachiosaurus",
            "Ankylosaurus",
            "Spinosaurus",
            "Stegosaurus"
        ],

        answer: 2

    }

];

export default function Quiz() {

    const [current, setCurrent] = useState(0);

    const [score, setScore] = useState(0);

    const [selected, setSelected] = useState(null);

    const [finished, setFinished] = useState(false);

    const handleAnswer = (index) => {

        if (selected !== null) return;

        setSelected(index);

        if (index === questions[current].answer) {

            setScore(prev => prev + 1);

        }

        setTimeout(() => {

            if (current === questions.length - 1) {

                setFinished(true);

            } else {

                setCurrent(prev => prev + 1);

                setSelected(null);

            }

        }, 1200);

    };

    return (

        <section className="quiz">

            <div className="quizHeading">

                <span>

                    CHALLENGE YOURSELF

                </span>

                <h2>

                    Jurassic Knowledge Test

                </h2>

                <p>

                    Answer questions about dinosaurs, evolution and prehistoric Earth.

                </p>

            </div>

            <motion.div

                className="quizContainer"

                initial={{

                    opacity: 0,

                    y: 80

                }}

                whileInView={{

                    opacity: 1,

                    y: 0

                }}

                viewport={{

                    once: true

                }}

                transition={{

                    duration: .8

                }}

            >

                {

                    finished ?

                        (

                            <div className="quizResult">

                                <h2>

                                    Mission Complete

                                </h2>

                                <p>

                                    Final Score

                                </p>

                                <h1>

                                    {score} / {questions.length}

                                </h1>

                                <button

                                    onClick={() => {

                                        setCurrent(0);

                                        setScore(0);

                                        setSelected(null);

                                        setFinished(false);

                                    }}

                                >

                                    Restart Expedition

                                    <FaArrowRight />

                                </button>

                            </div>

                        )

                        :

                        (

                            <>

                                <div className="questionTop">

                                    <p>

                                        QUESTION {current + 1}

                                    </p>

                                    <div className="progressBar">

                                        <div

                                            className="progress"

                                            style={{

                                                width: `${((current + 1) / questions.length) * 100}%`

                                            }}

                                        ></div>

                                    </div>

                                </div>

                                <h3>

                                    {questions[current].question}

                                </h3>

                                <div className="options">
                                    {

                                        questions[current].options.map((option, index) => (

                                            <button

                                                key={index}

                                                className={

                                                    selected === null

                                                        ?

                                                        "option"

                                                        :

                                                        index === questions[current].answer

                                                            ?

                                                            "option correct"

                                                            :

                                                            index === selected

                                                                ?

                                                                "option wrong"

                                                                :

                                                                "option"

                                                }

                                                onClick={() => handleAnswer(index)}

                                            >

                                                <span>

                                                    {option}

                                                </span>

                                                {

                                                    selected !== null &&

                                                    index === questions[current].answer

                                                    &&

                                                    <FaCheck />

                                                }

                                                {

                                                    selected === index &&

                                                    index !== questions[current].answer

                                                    &&

                                                    <FaTimes />

                                                }

                                            </button>

                                        ))

                                    }

                                </div>

                            </>

                        )

                }

            </motion.div>

        </section>

    );

}
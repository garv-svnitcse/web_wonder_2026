import { motion } from "framer-motion";
import {
    FaHeart,
    FaComment,
    FaShare,
    FaArrowRight
} from "react-icons/fa";

import "./Community.css";

const posts = [

    {

        title: "New Tyrannosaurus Fossil Discovered",

        author: "Dr. Alan Grant",

        likes: 1284,

        comments: 215,

        image: "/images/post1.webp"

    },

    {

        title: "DNA Lab Successfully Reconstructs Genome",

        author: "Dr. Ellie Sattler",

        likes: 945,

        comments: 163,

        image: "/images/post2.webp"

    },

    {

        title: "Jurassic Timeline Updated",

        author: "Research Division",

        likes: 786,

        comments: 98,

        image: "/images/post3.webp"

    }

];

export default function Community() {

    return (

        <section className="community">

            <div className="communityHeading">

                <span>

                    GLOBAL COMMUNITY

                </span>

                <h2>

                    Expedition Updates

                </h2>

                <p>

                    Discover the latest discoveries, fossil reports and prehistoric breakthroughs from explorers around the world.

                </p>

            </div>

            <div className="communityGrid">

                {

                    posts.map((post, index) => (

                        <motion.div

                            key={index}

                            className="communityCard"

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

                                duration: .8,

                                delay: index * .15

                            }}

                        >

                            <img

                                src={post.image}

                                alt={post.title}

                            />

                            <div className="communityContent">

                                <h3>

                                    {post.title}

                                </h3>

                                <p>

                                    {post.author}

                                </p>

                                <div className="communityStats">
                                    <div className="stat">

                                        <FaHeart />

                                        <span>

                                            {post.likes}

                                        </span>

                                    </div>

                                    <div className="stat">

                                        <FaComment />

                                        <span>

                                            {post.comments}

                                        </span>

                                    </div>

                                    <div className="stat">

                                        <FaShare />

                                        <span>

                                            Share

                                        </span>

                                    </div>

                                </div>

                                <button

                                    className="communityButton"

                                >

                                    READ ARTICLE

                                    <FaArrowRight />

                                </button>

                            </div>

                        </motion.div>

                    ))

                }

            </div>

        </section>

    );

}
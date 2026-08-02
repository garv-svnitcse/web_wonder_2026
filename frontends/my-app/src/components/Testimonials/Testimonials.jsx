import { motion } from "framer-motion";
import { FaQuoteLeft, FaStar, FaUser } from "react-icons/fa";
import "./Testimonials.css";

const testimonials = [
    {
        name: "Smit Pandit",
        role: "Lead Paleontologist & Researcher",
        quote: "Jurassic Journey has completely transformed how I visualize prehistoric life. The interactive 3D viewer is unmatched in detail, and the research database search is lightning fast.",
        rating: 5,
        avatarColor: "#D6A14B",
    },
    {
        name: "Darshil Prajapati",
        role: "Full-Stack System Architect",
        quote: "As a developer, the seamless integration of MongoDB and the robust, responsive UI design on this app is inspiring. The timeline animations are incredibly smooth and performant!",
        rating: 5,
        avatarColor: "#4C8A4F",
    },
    {
        name: "Sugandh Gupta",
        role: "Prehistoric Biology Educator",
        quote: "The dinosaur trivia quiz has become a favorite in my classroom. The dynamic difficulty levels and instant answer checking keep my students engaged and eager to learn.",
        rating: 5,
        avatarColor: "#1d4ed8",
    },
    {
        name: "Garv Agarwal",
        role: "Creative Director & UX Architect",
        quote: "A masterclass in modern web design. The glassmorphic badges, premium micro-animations, and ambient backdrops combine to create a truly immersive Mesozoic experience.",
        rating: 5,
        avatarColor: "#ff5f57",
    }
];

export default function Testimonials() {
    return (
        <section className="testimonialsSection">
            <div className="testimonialsHeading">
                <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    EXPLORER LOGS
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                >
                    Testimonials
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Read reviews and reflections from our distinguished paleontology experts, 
                    engineers, educators, and creative visionaries.
                </motion.p>
            </div>

            <div className="testimonialsGrid">
                {testimonials.map((t, idx) => (
                    <motion.div
                        key={idx}
                        className="testimonialCard"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                    >
                        <div className="cardQuotes">
                            <FaQuoteLeft />
                        </div>
                        <p className="testimonialQuote">"{t.quote}"</p>
                        <div className="cardSeparator" />
                        <div className="testimonialMeta">
                            <div className="testimonialAvatar" style={{ backgroundColor: t.avatarColor }}>
                                <FaUser />
                            </div>
                            <div className="testimonialInfo">
                                <h3>{t.name}</h3>
                                <p>{t.role}</p>
                                <div className="stars">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

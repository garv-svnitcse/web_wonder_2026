import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaSpinner, FaEnvelope, FaUser, FaCommentAlt, FaCompass, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { API_URL } from "../config/api";
import "./ContactPage.css";

export default function ContactPage() {
    const isLoggedIn = !!localStorage.getItem("access_token");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        feedback: ""
    });

    const [status, setStatus] = useState({
        submitting: false,
        success: false,
        error: null
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.feedback.trim()) {
            setStatus({ submitting: false, success: false, error: "Please fill in all fields before submitting." });
            return;
        }

        setStatus({ submitting: true, success: false, error: null });

        try {
            const response = await fetch(`${API_URL}/contact/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: "Explorer Feedback / Contact",
                    message: formData.feedback.trim()
                })
            });

            const data = await response.json();

            if (response.ok && !data.error) {
                setStatus({ submitting: false, success: true, error: null });
                setFormData({ name: "", email: "", feedback: "" });
            } else {
                setStatus({ submitting: false, success: false, error: data.error || "Failed to send message to admin. Please try again." });
            }
        } catch (err) {
            console.error("Contact form error:", err);
            setStatus({ submitting: false, success: false, error: "Network error occurred. Please check your connection." });
        }
    };

    return (
        <div className="contactPage">
            <Navbar isLoggedIn={isLoggedIn} />

            <section className="contactHero">
                <div className="contactHeroGlow" />
                <motion.div
                    className="contactHeroContent"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="contactBadge">LET'S TALK</span>
                    <h1 className="contactHeroTitle">
                        EXPEDITION <span className="goldHighlight">HQ CONTACT</span>
                    </h1>
                    <p className="contactHeroSubtitle">
                        Have feedback, questions, or new paleontological discoveries to share? Send us your message and our team will get back to you.
                    </p>
                </motion.div>
            </section>

            <section className="contactFormSection">
                <div className="contactContainer">
                    <motion.div
                        className="contactCard"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="contactHeader">
                            <FaCompass className="headerIcon" />
                            <h2>LET'S TALK</h2>
                            <p>We value your thoughts, feedback, and expedition inquiries.</p>
                        </div>

                        {status.success && (
                            <motion.div
                                className="statusBanner successBanner"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <FaCheckCircle className="bannerIcon" />
                                <div>
                                    <h4>Feedback Sent Successfully!</h4>
                                    <p>Your message has been emailed directly to our expedition admin team.</p>
                                </div>
                            </motion.div>
                        )}

                        {status.error && (
                            <motion.div
                                className="statusBanner errorBanner"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <FaExclamationTriangle className="bannerIcon" />
                                <div>
                                    <h4>Submission Issue</h4>
                                    <p>{status.error}</p>
                                </div>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="contactForm">
                            <div className="formGroup">
                                <label htmlFor="name">
                                    <FaUser className="inputIcon" /> FULL NAME
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={status.submitting}
                                    required
                                />
                            </div>

                            <div className="formGroup">
                                <label htmlFor="email">
                                    <FaEnvelope className="inputIcon" /> EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={status.submitting}
                                    required
                                />
                            </div>

                            <div className="formGroup">
                                <label htmlFor="feedback">
                                    <FaCommentAlt className="inputIcon" /> YOUR FEEDBACK
                                </label>
                                <textarea
                                    id="feedback"
                                    name="feedback"
                                    rows="5"
                                    placeholder="Share your feedback, thoughts, or questions with the Jurassic Journey team..."
                                    value={formData.feedback}
                                    onChange={handleChange}
                                    disabled={status.submitting}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`submitButton ${status.submitting ? "submitting" : ""}`}
                                disabled={status.submitting}
                            >
                                {status.submitting ? (
                                    <>
                                        SUBMITTING... <FaSpinner className="spinIcon" />
                                    </>
                                ) : (
                                    <>
                                        SEND MESSAGE <FaPaperPlane />
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

import React from "react";
import Testimonials from "../components/Testimonials/Testimonials";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export default function TestimonialsPage() {
    const isLoggedIn = !!localStorage.getItem('access_token');

    return (
        <div style={{ background: "#07100B", minHeight: "100vh" }}>
            <Navbar isLoggedIn={isLoggedIn} />
            <Testimonials />
            <Footer />
        </div>
    );
}

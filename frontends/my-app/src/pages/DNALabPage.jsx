import React from "react";
import DNALab from "../components/DNALab/DNALab";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

export default function DNALabPage() {
    // Check if user is logged in to pass the session status to the Navbar
    const isLoggedIn = !!localStorage.getItem('access_token');

    return (
        <div style={{ background: "#07100B", minHeight: "100vh" }}>
            <Navbar isLoggedIn={isLoggedIn} />
            <DNALab />
            <Footer />
        </div>
    );
}

import { useEffect, useState } from "react";
import "../styles/Home.css";

import Loading from "../components/Loading/Loading";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Expedition from "../components/Expedition/Expedition";
import Featured from "../components/Featured/Featured";
import Timeline from "../components/Timeline/Timeline";
import Testimonials from "../components/Testimonials/Testimonials";
import Footer from "../components/Footer/Footer";
import GlassAuthModal from "../components/GlassAuthModal";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <Navbar />

            <main className="home">
                <Hero onBeginExpedition={() => setIsAuthModalOpen(true)} />
                <Expedition />
                <Featured />
                <Timeline />
                <Testimonials />
            </main>

            <Footer />

            <GlassAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}

import { useEffect, useState } from "react";

import "../styles/Home.css";

import Loading from "../components/Loading/Loading";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Expedition from "../components/Expedition/Expedition";
import Featured from "../components/Featured/Featured";
import Timeline from "../components/Timeline/Timeline";
import Testimonials from "../components/Testimonials/Testimonials";
import Research from "../components/Research/Research";
import Quiz from "../components/Quiz/Quiz";
import Community from "../components/Community/Community";
import Footer from "../components/Footer/Footer";

export default function Home() {

    const [loading, setLoading] = useState(true);

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

                <Hero />

                <Expedition />

                <Featured />

                <Timeline />

                <Testimonials />

            </main>

            <Footer />

        </>

    );

}
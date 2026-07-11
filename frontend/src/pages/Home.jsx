import Hero from "../components/Hero";
import Expedition from "../components/Expedition";
import FeaturedDinosaur from "../components/FeaturedDinosaur";
import TimelinePreview from "../components/TimelinePreview";
import ResearchPreview from "../components/ResearchPreview";
import QuizCTA from "../components/QuizCTA";
import CommunityCTA from "../components/CommunityCTA";
import Footer from "../components/Footer";

import "../styles/Home.css";

export default function Home(){

    return(

        <main className="home">

            <Hero/>

            <Expedition/>

            <FeaturedDinosaur/>

            <TimelinePreview/>

            <ResearchPreview/>

            <QuizCTA/>

            <CommunityCTA/>

            <Footer/>

        </main>

    )

}
import Hero from "../components/Hero";
import Featured from "../components/Featured";
import TimelinePreview from "../components/TimelinePreview";
import ResearchPreview from "../components/ResearchPreview";
import QuizCTA from "../components/QuizCTA";
import CommunityCTA from "../components/CommunityCTA";

import "../styles/Home.css";

export default function Home(){

    return(

        <main className="home">

            <Hero/>

            <Featured/>

            <TimelinePreview/>

            <ResearchPreview/>

            <QuizCTA/>

            <CommunityCTA/>

        </main>

    )

}
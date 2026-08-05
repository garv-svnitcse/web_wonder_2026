import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

import Home from "./pages/Home";
import ResearchDatabase from "./pages/ResearchDatabase";
import Dinosaur from "./pages/Dinosaur";
import Viewer from "./pages/Viewer";
import QuizPage from "./pages/QuizPage";
import TimelinePage from "./pages/TimelinePage";
import Research from "./pages/RESEARCH_PAGE/Research";
import ResearchDossier from "./pages/RESEARCH_PAGE/ResearchDossier";
// import Login from "./pages/LOGIN_PAGE/Login";
import CommunityPage from "./pages/CommunityPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import AdminDashboard from "./pages/AdminDashboard";
import CinemaPage from "./pages/CinemaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/cinema" element={<CinemaPage />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research-database" element={<ResearchDatabase />} />
        <Route path="/research/:slug" element={<ResearchDossier />} />
        <Route path="/dinosaur/:slug" element={<Dinosaur />} />
        <Route path="/viewer/:slug" element={<Viewer />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

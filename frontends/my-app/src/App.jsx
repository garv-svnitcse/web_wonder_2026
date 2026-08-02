import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import DNALabPage from "./pages/DNALabPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/research" element={<Research />} />
        <Route path="/research-database" element={<ResearchDatabase />} />
        <Route path="/research/:slug" element={<ResearchDossier />} />
        <Route path="/dinosaur/:slug" element={<Dinosaur />} />
        <Route path="/viewer/:slug" element={<Viewer />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/dna" element={<DNALabPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

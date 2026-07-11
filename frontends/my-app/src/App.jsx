import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ResearchDetail from "./pages/ResearchDetail";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Research from "./components/Research/Research";
import Timeline from "./components/Timeline/Timeline";
import DNALab from "./components/DNALab/DNALab";
import Quiz from "./components/Quiz/Quiz";
import Community from "./components/Community/Community";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
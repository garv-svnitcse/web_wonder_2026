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

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/research" element={
          <>
            <Navbar />
            <main style={{ paddingTop: "120px" }}>
              <Research />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/research/:slug" element={
          <>
            <Navbar />
            <ResearchDetail />
            <Footer />
          </>
        } />
        
        <Route path="/timeline" element={
          <>
            <Navbar />
            <main style={{ paddingTop: "120px" }}>
              <Timeline />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/dna" element={
          <>
            <Navbar />
            <main style={{ paddingTop: "120px" }}>
              <DNALab />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/quiz" element={
          <>
            <Navbar />
            <main style={{ paddingTop: "120px" }}>
              <Quiz />
            </main>
            <Footer />
          </>
        } />
        
        <Route path="/community" element={
          <>
            <Navbar />
            <main style={{ paddingTop: "120px" }}>
              <Community />
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ResearchDatabase from "./pages/ResearchDatabase";
import Dinosaur from "./pages/Dinosaur";
// import Viewer from "./pages/Viewer";   // your 3D page

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route

                    path="/"

                    element={<Home />}

                />

                <Route

                    path="/research"

                    element={<ResearchDatabase />}

                />

                <Route

                    path="/dinosaur/:slug"

                    element={<Dinosaur />}

                />

                {/* <Route

                    path="/viewer/:slug"

                    element={<Viewer />}

                /> */}

            </Routes>

        </BrowserRouter>

    );

}

export default App;
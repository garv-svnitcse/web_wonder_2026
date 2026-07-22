import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ResearchDatabase from "./pages/ResearchDatabase";
import Dinosaur from "./pages/Dinosaur";
import Viewer from "./pages/Viewer";
import QuizPage from "./pages/QuizPage";
import TimelinePage from "./pages/TimelinePage";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route

                    path="/"

                    element={<Home />}

                />

                <Route

                    path="/timeline"

                    element={<TimelinePage />}

                />

                <Route

                    path="/research"

                    element={<ResearchDatabase />}

                />

                <Route

                    path="/dinosaur/:slug"

                    element={<Dinosaur />}

                />

                <Route

                    path="/viewer/:slug"

                    element={<Viewer />}

                />

                <Route

                    path="/quiz"

                    element={<QuizPage />}

                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;
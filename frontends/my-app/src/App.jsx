import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ResearchDetail from "./pages/ResearchDetail";

function App(){

return(

<BrowserRouter>

<Routes>

<Route

path="/"

element={<Home/>}

/>

<Route

path="/research/:slug"

element={<ResearchDetail/>}

/>

</Routes>

</BrowserRouter>

)

}

export default App;
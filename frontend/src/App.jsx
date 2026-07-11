import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Auth from './pages/Auth';
import Research from './pages/Research';
import ResearchDetail from './pages/ResearchDetail';
import Timeline from './pages/Timeline';
import Quiz from './pages/Quiz';
import Community from './pages/Community';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/research" element={<Research />} />
              <Route path="/research/:slug" element={<ResearchDetail />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/community" element={<Community />} />
              <Route path="/contact" element={<Contact />} />

              {/* Gated Protected Admin Routes */}
              <Route path="/admin" element={<Admin />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

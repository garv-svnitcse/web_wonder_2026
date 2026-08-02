import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const t = localStorage.getItem('access_token');
if (t) {
  const parts = t.trim().split('.');
  if (parts.length !== 3) {
    localStorage.removeItem('access_token');
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

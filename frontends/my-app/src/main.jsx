import { API_URL } from "./config/api";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";

// Clerk Publishable Key - loaded from Vite's env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_dGVzdC1jbGVyay1hcHAuY2xlcmsuYWNjb3VudHMuZGV2JA";

function SyncClerkToken() {
  const { getToken, isSignedIn, signOut } = useAuth();

  useEffect(() => {
    async function syncToken() {
      if (isSignedIn) {
        const ONE_HOUR = 3600 * 1000;
        const loginTime = localStorage.getItem('session_start_time');
        const now = Date.now();
        
        if (!loginTime) {
          localStorage.setItem('session_start_time', now.toString());
        } else if (now - parseInt(loginTime, 10) > ONE_HOUR) {
          console.warn("Session expired after 1 hour.");
          localStorage.removeItem('access_token');
          localStorage.removeItem('session_start_time');
          try {
            if (signOut) await signOut();
          } catch (e) {
            console.error("SignOut failed:", e);
          }
          window.location.href = "/";
          return;
        }

        try {
          const token = await getToken();
          if (token) {
            localStorage.setItem('access_token', token);
            fetch(`${API_URL}/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }).catch(err => console.warn("Failed to auto-sync user profile:", err));
          }
        } catch (err) {
          console.error("Failed to sync Clerk token:", err);
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('session_start_time');
      }
    }
    
    syncToken();
    
    // Refresh token every 30 seconds to make sure it's valid
    const interval = setInterval(syncToken, 30000);
    return () => clearInterval(interval);
  }, [isSignedIn, getToken, signOut]);

  return null;
}

// Clean invalid tokens from local storage
const t = localStorage.getItem('access_token');
if (t && !t.startsWith("mock_")) {
  const parts = t.trim().split('.');
  if (parts.length !== 3) {
    localStorage.removeItem('access_token');
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SyncClerkToken />
      <App />
    </ClerkProvider>
  </StrictMode>,
);

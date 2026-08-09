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
    if (!isSignedIn) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('last_activity_time');
      return undefined;
    }

    const ONE_HOUR = 3600 * 1000;

    // Extend 1-hour session window on user activity
    const updateActivity = () => {
      localStorage.setItem('last_activity_time', Date.now().toString());
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, updateActivity, { passive: true }));

    if (!localStorage.getItem('last_activity_time')) {
      updateActivity();
    }

    async function syncToken() {
      const lastActivity = localStorage.getItem('last_activity_time');
      const now = Date.now();

      if (lastActivity && now - parseInt(lastActivity, 10) > ONE_HOUR) {
        console.warn("Session expired after 1 hour of inactivity.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('last_activity_time');
        events.forEach((event) => window.removeEventListener(event, updateActivity));
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
          }).catch((err) => console.warn("Failed to auto-sync user profile:", err));
        }
      } catch (err) {
        console.error("Failed to sync Clerk token:", err);
      }
    }

    syncToken();
    const interval = setInterval(syncToken, 30000);

    return () => {
      clearInterval(interval);
      events.forEach((event) => window.removeEventListener(event, updateActivity));
    };
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

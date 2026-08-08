import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCompass } from "react-icons/fa";
import { useUser } from "@clerk/clerk-react";
import "./GreetingToast.css";

export default function GreetingToast() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState(null);

  const triggerGreeting = (type, displayName) => {
    const fallbackName = displayName || user?.firstName || user?.fullName || (user?.emailAddresses?.[0]?.emailAddress ? user.emailAddresses[0].emailAddress.split('@')[0] : "Explorer");
    
    if (type === "signup") {
      setGreeting({
        title: "WELCOME TO JURASSIVERSE!",
        message: `Greetings, ${fallbackName}! Your explorer credentials have been created successfully.`,
        icon: "🦕",
        badge: "EXPEDITION REGISTERED"
      });
    } else {
      setGreeting({
        title: "WELCOME BACK, EXPLORER!",
        message: `Glad to see you back, ${fallbackName}! Your expedition session is now active.`,
        icon: "🦖",
        badge: "AUTHENTICATED"
      });
    }
  };

  useEffect(() => {
    // Check if there is a pending greeting in sessionStorage
    const pending = sessionStorage.getItem("pending_greeting");
    if (pending) {
      try {
        const data = JSON.parse(pending);
        sessionStorage.removeItem("pending_greeting");
        triggerGreeting(data.type, data.name);
      } catch (e) {
        console.error("Failed to parse pending greeting:", e);
      }
    }

    // Listen for custom login/signup greeting events
    const handleAuthEvent = (event) => {
      const { type, name } = event.detail || {};
      triggerGreeting(type || "login", name);
    };

    window.addEventListener("auth_greeting_event", handleAuthEvent);
    return () => {
      window.removeEventListener("auth_greeting_event", handleAuthEvent);
    };
  }, [user]);

  useEffect(() => {
    if (!greeting) return;
    const timer = setTimeout(() => {
      setGreeting(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [greeting]);

  if (!greeting) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="greetingToastContainer"
        initial={{ opacity: 0, x: 60, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, y: 10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
      >
        <div className="greetingToastCard">
          <div className="greetingToastIcon">
            <span>{greeting.icon}</span>
          </div>
          <div className="greetingToastContent">
            <div className="greetingToastBadge">
              <FaCompass size={10} />
              <span>{greeting.badge}</span>
            </div>
            <h4>{greeting.title}</h4>
            <p>{greeting.message}</p>
          </div>
          <button
            className="greetingToastClose"
            onClick={() => setGreeting(null)}
            aria-label="Close greeting notification"
          >
            <FaTimes />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

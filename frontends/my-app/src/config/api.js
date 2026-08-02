const configuredApiUrl = import.meta.env.VITE_API_URL || "/api";

export const API_URL = configuredApiUrl.replace(/\/$/, "");

export function apiUrl(path = "") {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function websocketUrl(path = "") {
  if (API_URL.startsWith("http")) return `${API_URL.replace(/^http/, "ws")}${path.startsWith("/") ? path : `/${path}`}`;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

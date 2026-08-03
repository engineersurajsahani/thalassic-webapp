import axios from "axios";

// Determine base API URL (reads from env, defaults to localhost:4000 for our NestJS server)
const API_URL =
  (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim()) ||
  "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to set a cookie
export function setCookie(name: string, value: string, days = 7) {
  if (typeof window === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Helper to get a cookie
export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper to erase cookie
export function deleteCookie(name: string) {
  setCookie(name, "", -1);
}

// Attach interceptor to include authorization header
api.interceptors.request.use(
  (config) => {
    let token = getCookie("auth_token");
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/agent-admin")) {
        token = getCookie("auth_token_agent-admin") || token;
      } else if (pathname.startsWith("/agent")) {
        token = getCookie("auth_token_agent") || token;
      } else if (pathname.startsWith("/company-admin")) {
        token = getCookie("auth_token_company-admin") || token;
      } else if (pathname.startsWith("/master")) {
        token = getCookie("auth_token_master") || token;
      } else if (pathname.startsWith("/seafarer") || pathname.startsWith("/seafearer")) {
        token = getCookie("auth_token_seafarer") || token;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

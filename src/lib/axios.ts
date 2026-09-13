import axios from "axios";

// ISSUE-030: Validate environment variables at build time
// Throw an error in development if NEXT_PUBLIC_API_URL is not set
const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url.trim() === '') {
    if (typeof window !== 'undefined') {
      // In browser, warn but use default
      console.warn('NEXT_PUBLIC_API_URL is not configured. Using default: http://localhost:4000/api');
      return 'http://localhost:4000/api';
    }
    // In build server-side, throw error
    throw new Error(
      'NEXT_PUBLIC_API_URL environment variable is required. ' +
      'Please set it in your .env.local file (e.g., NEXT_PUBLIC_API_URL=http://localhost:4000/api)'
    );
  }
  return url.trim();
};

// ISSUE-016, ISSUE-017: Single canonical token resolution
function resolveAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie('auth_token') || getCookie('token');
}

// Determine base API URL
const API_URL = getApiUrl();

// ISSUE-001: Axios instance configured for future httpOnly cookie support
// When backend sets httpOnly cookies, the browser handles them automatically.
// For now, tokens are passed via Authorization header (existing behavior).
// TODO: Migrate to cookie-based auth with httpOnly, Secure, SameSite flags set by backend.
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // With httpOnly cookies, credentials should be 'include' to send cookies
  // Currently using Bearer token auth, so cookies are not sent automatically
  withCredentials: false,
});

// Helper to set a cookie
// ISSUE-001: This function is kept for legacy support but should be replaced by backend Set-Cookie headers
// NOTE: Cannot set httpOnly from frontend - this is a known security limitation
export function setCookie(name: string, value: string, days = 7) {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  // Added SameSite=Lax for CSRF protection (ISSUE-002)
  // TODO: Migrate to backend-set httpOnly cookies
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Helper to get a cookie
export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Helper to erase cookie
export function deleteCookie(name: string) {
  setCookie(name, '', -1);
}

// Attach interceptor to include authorization header
// ISSUE-016: Uses shared resolveAuthToken() function instead of duplicating route logic
api.interceptors.request.use(
  (config) => {
    const token = resolveAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

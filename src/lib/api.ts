const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchAPI<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Get token from localStorage if in client environment
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || 'mock-master-token'}`,
    ...options.headers,
  });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

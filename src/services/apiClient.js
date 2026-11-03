// Thin API client. While VITE_USE_MOCK !== 'false', service modules resolve with local mock data.
// To connect the future Node/Express/MongoDB backend, set VITE_API_URL and VITE_USE_MOCK=false.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

export const mockDelay = (data, ms = 600) => new Promise((resolve) => setTimeout(() => resolve(data), ms));

export async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('smilecare:token');
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${JSON.parse(token)}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

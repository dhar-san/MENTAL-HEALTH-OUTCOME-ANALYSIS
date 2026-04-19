/**
 * API client - Axios instance with auth token
 */
import axios from 'axios';

const DEFAULT_PRODUCTION_API_URL =
  'https://mental-health-outcome-analysis-backend-3.onrender.com';

const configuredApiUrl = process.env.REACT_APP_API_URL?.trim();
const isLocalhost =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

// Local dev: use Create React App proxy (package.json "proxy") -> baseURL '/api'
// Production: prefer REACT_APP_API_URL; fall back to the deployed Render API if missing.
const apiBase = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/$/, '')}/api`
  : isLocalhost
    ? '/api'
    : `${DEFAULT_PRODUCTION_API_URL}/api`;

if (!configuredApiUrl && !isLocalhost) {
  console.warn(
    `REACT_APP_API_URL is not set. Falling back to ${DEFAULT_PRODUCTION_API_URL}.`
  );
}

const api = axios.create({
  baseURL: apiBase,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.replace('/login');
    }
    return Promise.reject(err);
  }
);

export default api;

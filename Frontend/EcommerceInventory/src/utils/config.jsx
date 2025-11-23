const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:8000').replace(/\/+$/, '');
const API_URL = `${API_BASE}/api/`;

export default { API_BASE, API_URL };
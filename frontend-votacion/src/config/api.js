// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Debug: Mostrar la URL que se está usando
console.log('🔗 API_BASE_URL:', API_BASE_URL);
console.log('🔗 VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);

export const API_ENDPOINTS = {
  VOTES: `${API_BASE_URL}/api/votes`,
  RESULTS: `${API_BASE_URL}/api/results/all`,
  RESET: `${API_BASE_URL}/api/results/reset`,
  STATS: `${API_BASE_URL}/api/votes/stats`
};

export default API_BASE_URL;

// Configuration for the application
// When deployed on Vercel, VITE_BACKEND_URL should be set to the Render/Railway backend URL
// In local development, it falls back to empty string, which makes it use the Vite proxy
export const API_URL = import.meta.env.VITE_BACKEND_URL || '';

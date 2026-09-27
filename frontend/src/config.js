// Centralized API Configuration for Local Dev & Production Deployment (Netlify/Vercel)
export const NODE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const RAG_API_URL = import.meta.env.VITE_RAG_URL || 'http://localhost:8000';

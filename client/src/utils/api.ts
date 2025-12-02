// Prefer VITE_API_URL; fallback to localhost with VITE_API_PORT or 4000
export const API_BASE = (import.meta as any).env.VITE_API_URL || `http://localhost:${(import.meta as any).env.VITE_API_PORT || 4000}`;

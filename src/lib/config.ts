export const config = {
  apiUrl: window.__APP_CONFIG__?.apiUrl ?? import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
};

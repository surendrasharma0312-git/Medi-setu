import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE_PATH lets the app be served from a sub-path, e.g. "/medisetu/" on a
// GitHub Pages project site. It defaults to "/" for local development.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
  };
});

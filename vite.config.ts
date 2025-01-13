// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  base: './',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 5000,
  },
  resolve: {
    alias: {
      '@': '/src', // Optional: Simplify imports
    },
  },
  esbuild: {
    // You can add specific esbuild options here if needed
  },
});

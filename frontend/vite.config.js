import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Allows access from any IP address
    proxy: {
      '/api': 'http://localhost:4000', // Proxy API requests to backend
    },
  },
  preview: {
    allowedHosts: ['resourcify-syw7.onrender.com'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist',
  },
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server:{
//     port:3000,
//     host: '0.0.0.0', 
//   }
//   })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     host: '0.0.0.0',
//   },
//   build: {
//     target: 'esnext', // modern build targeting the latest JavaScript
//     minify: 'esbuild', // Using esbuild for faster minification
//     outDir: 'dist', // Set output directory for production build
//   },
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Allows access from any IP address
  },
  preview: {
    allowedHosts: ['resourcify-syw7.onrender.com'], // Add the host that is being blocked
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist',
  },
})

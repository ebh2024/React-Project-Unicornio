import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true, // This is for Vite's dev server, not for outgoing requests
    proxy: {
      '/crudapi': { // New local proxy path
        target: 'https://crudcrud.com/api/e83a4b9f4f64490ea8f94aff8dc413dd', // Target now includes the API key
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/crudapi/, ''), // Remove /crudapi, the rest is appended to target
        secure: false,
      },
    },
  },
})

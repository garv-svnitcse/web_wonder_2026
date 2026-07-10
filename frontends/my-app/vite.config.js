import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/timeline': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/research': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/quiz': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/community': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/contact': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})

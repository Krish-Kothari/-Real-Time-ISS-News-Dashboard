import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/iss-now': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/iss-now/, '/iss-now'),
        logLevel: 'debug',
      },
      '/api/astros': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/astros/, '/astros'),
        logLevel: 'debug',
      },
      '/api/iss-passes': {
        target: 'http://api.open-notify.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/iss-passes/, '/iss-passes'),
        logLevel: 'debug',
      },
      '/api/ai-api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        logLevel: 'debug',
      },
    },
  },
})

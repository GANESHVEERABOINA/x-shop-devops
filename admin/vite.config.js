import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Keep /api stable in browser code. The Vite proxy is for local development;
// production requests are routed by the shared Nginx gateway.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // The production gateway serves the admin UI beneath /admin/.
    // Local `npm run dev` continues to serve at http://localhost:5174/.
    base: mode === 'production' ? '/admin/' : '/',
    plugins: [react()],
    server: {
      host: true,
      port: 5174,
      proxy: {
        '/api': {
          target: env.XSHOP_API_PROXY_TARGET || 'http://127.0.0.1:4000',
          changeOrigin: true,
        },
      },
    },
  }
})

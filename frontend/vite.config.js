import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Browser code always calls the same-origin /api path. This proxy exists only
// for the local Vite development server; production routing is handled by Nginx.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.XSHOP_API_PROXY_TARGET || 'http://127.0.0.1:4000',
          changeOrigin: true,
        },
      },
    },
  }
})

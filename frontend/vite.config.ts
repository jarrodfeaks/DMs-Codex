import { defineConfig, loadEnv } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd(), '..'), '');

  return {
    plugins: [react()],
    server: {
      port: Number(env.FRONTEND_PORT) || 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: `http://localhost:${env.PORT || 5000}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    }
  }
})

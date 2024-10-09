import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.FRONTEND_PORT) || 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT || 8080}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})

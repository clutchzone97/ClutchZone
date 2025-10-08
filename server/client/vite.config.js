import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:10000', // Corrected backend port
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'build', // Corrected to match server expectation
    sourcemap: true
  }
})
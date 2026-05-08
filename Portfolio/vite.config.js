import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/resume': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})

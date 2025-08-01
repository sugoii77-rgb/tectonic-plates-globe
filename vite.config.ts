import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './app',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './app/index.html',  // 명시적 entry point 추가
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', 'react-globe.gl']
        }
      }
    }
  },
  base: '/tectonic-plates-globe/'
})

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
      input: '../public/index.html',  // public/index.html을 entry point로 사용
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

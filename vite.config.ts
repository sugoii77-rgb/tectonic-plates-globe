import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tectonic-plates-globe/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', 'react-globe.gl']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['three', 'react-globe.gl', 'd3-scale-chromatic'],
    exclude: []
  },
  define: {
    global: 'globalThis',
  }
})

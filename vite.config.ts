import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    VitePWA({ registerType: 'autoUpdate' })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('src/lazy/')) {
            return id.split('/').pop()?.split('.')[0] || id
          }
          if (id.includes('src/networks/')) {
            return id.split('/').pop()?.split('.')[0] || id
          }
        }
      }
    }
  }
})

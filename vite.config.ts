import { defineConfig } from 'vite'
import path from 'node:path'

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, 'index.html'),
        catalog: path.resolve(__dirname, 'catalog.html'),
        services: path.resolve(__dirname, 'services.html'),
        portfolio: path.resolve(__dirname, 'portfolio.html'),
        about: path.resolve(__dirname, 'about.html'),
        contacts: path.resolve(__dirname, 'contacts.html'),
        reviews: path.resolve(__dirname, 'reviews.html'),
        privacy: path.resolve(__dirname, 'privacy.html'),
      },
    },
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
})

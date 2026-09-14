import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve el site bajo /<repo>/: la base es OBLIGATORIA para que
// los assets (JS/CSS) resuelvan bien en la URL publicada.
// Ajusta BASE_PATH en .env o deja el default del repo.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/enviroment-ubuntu-installer/',
  build: {
    outDir: 'dist'
  }
})

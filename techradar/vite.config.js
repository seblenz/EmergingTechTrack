import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This base path must match the GitHub Pages URL path.
  // The repo is "EmergingTechTrack", so GitHub Pages serves at
  // https://<username>.github.io/EmergingTechTrack/
  base: '/EmergingTechTrack/',
})

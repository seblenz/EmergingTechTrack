import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This base path is required for GitHub Pages deployment.
  // GitHub Pages serves your site at https://<username>.github.io/techradar/
  // so all asset URLs need to be prefixed with /techradar/
  base: '/techradar/',
})

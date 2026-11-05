import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      "/magnit-api": {
        target: "https://magnit.ru",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/magnit-api/, "/webgate"),
      },
    },
  },
})

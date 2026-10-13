import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { localApi } from './server/dev-api.js'

export default defineConfig(({ mode }) => ({
  plugins: [react(), localApi(loadEnv(mode, process.cwd(), ''))],
  resolve: {
    alias: {
      "components": path.resolve(__dirname, "./src/components"),
      "pages": path.resolve(__dirname, "./src/pages"),
      "utils": path.resolve(__dirname, "./src/utils"),
      "styles": path.resolve(__dirname, "./src/styles"),
      "assets": path.resolve(__dirname, "./public/assets")
    },
  },
}))

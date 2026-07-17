import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'gameNQueens',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
      },
    }),
  ],
  define: {
    __API_URL__: JSON.stringify(process.env.API_URL || 'http://localhost:5016'),
  },
  build: { modulePreload: false, target: 'esnext', minify: false, cssCodeSplit: false },
  server: { port: 5007, strictPort: true },
  preview: { port: 5007, strictPort: true },
})

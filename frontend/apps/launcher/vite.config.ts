import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'launcher',
      remotes: {
        gameSudoku: 'http://localhost:5001/assets/remoteEntry.js',
        gameNumerox: 'http://localhost:5002/assets/remoteEntry.js',
        gameNumeroxLetters: 'http://localhost:5003/assets/remoteEntry.js',
        gameLogicPuzzles: 'http://localhost:5004/assets/remoteEntry.js',
        gameCrosswords: 'http://localhost:5005/assets/remoteEntry.js',
        gameTango: 'http://localhost:5006/assets/remoteEntry.js',
        gameNQueens: 'http://localhost:5007/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: { port: 8091 },
})

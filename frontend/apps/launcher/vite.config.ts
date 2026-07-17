import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      federation({
        name: 'launcher',
        remotes: {
          gameSudoku: `${env.VITE_SUDOKU_URL || 'http://localhost:5001'}/assets/remoteEntry.js`,
          gameNumerox: `${env.VITE_NUMEROX_URL || 'http://localhost:5002'}/assets/remoteEntry.js`,
          gameNumeroxLetters: `${env.VITE_NUMEROX_LETTERS_URL || 'http://localhost:5003'}/assets/remoteEntry.js`,
          gameLogicPuzzles: `${env.VITE_LOGIC_PUZZLES_URL || 'http://localhost:5004'}/assets/remoteEntry.js`,
          gameCrosswords: `${env.VITE_CROSSWORDS_URL || 'http://localhost:5005'}/assets/remoteEntry.js`,
          gameTango: `${env.VITE_TANGO_URL || 'http://localhost:5006'}/assets/remoteEntry.js`,
          gameNQueens: `${env.VITE_N_QUEENS_URL || 'http://localhost:5007'}/assets/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.3.1' },
          'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
          'react-router-dom': { singleton: true, requiredVersion: '^6.30.4' },
        },
      }),
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
    },
    server: { port: 8091, strictPort: true },
    preview: { port: 8091, strictPort: true },
  }
})

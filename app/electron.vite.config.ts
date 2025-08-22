import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [],
  },
  preload: {
    plugins: []
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      }
    },
    plugins: [react()]
  },
})

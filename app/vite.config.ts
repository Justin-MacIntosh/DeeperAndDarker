import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps:{
    esbuildOptions:{
      plugins:[
        esbuildCommonjs(['fractional'])
      ]
    }
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true } // Change
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
})

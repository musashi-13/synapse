import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [

    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact({
      babel: {
        plugins: [jotaiDebugLabel, jotaiReactRefresh],
      },
    }),
    tailwindcss(),
  ],

  test: {
    globals: true,
    environment: 'jsdom',
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
import path from 'node:path'

import { defineConfig } from 'vitest/config'

module.exports = defineConfig({
  exclude: ['**/dist/**', '**/node_modules/**'],
  test: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

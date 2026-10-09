import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.APP_PORT) || 3000

  return {
    plugins: [
      vue(),
      tailwindcss(),
    ],
    define: {
      DELCOM_BASEURL: JSON.stringify(env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1')
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: port
    },
    preview: {
      port: port
    },
    test: {
      globals: true,
      environment: 'jsdom',
      fileParallelism: false,
      setupFiles: './src/setupTests.js',
      include: ['src/**/*.test.js'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        include: ['src/**/*.{js,vue}'],
        exclude: [
          'src/main.js',
          'src/setupTests.js',
          'src/test-utils.js',
          '**/*.test.*',
          'node_modules/**',
          '.docs/**',
        ],
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100
        }
      }
    }
  }
})
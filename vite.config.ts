// Documento generado el 2026-07-04-2030
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import { writeFileSync, appendFileSync, readFileSync } from 'node:fs'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

function getBuildHash(): string {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return `nogit-${Date.now().toString(36).slice(-6)}`
  }
}

function getLastTicket(): string {
  try {
    const text = readFileSync('./changelog.txt', 'utf-8')
    const match = text.match(/^\d{4}-\d{2}-\d{2}.*?·\s*(#\d+)/m)
    return match?.[1] ?? ''
  } catch {
    return ''
  }
}

const buildHash  = getBuildHash()
const lastTicket = getLastTicket()

export default defineConfig({
  base: '/bbrtg/',
  define: {
    __BUILD_HASH__:   JSON.stringify(buildHash),
    __APP_VERSION__:  JSON.stringify('0.1.0'),
    __BUILD_DATE__:   JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ')),
    __BUILD_TICKET__: JSON.stringify(lastTicket),
  },
  plugins: [
    {
      name: 'dev-log',
      apply: 'serve',
      configureServer(server) {
        const logPath = './dev.log.txt'
        writeFileSync(logPath, `=== Dev Log ${new Date().toISOString()} ===\n`)
        server.middlewares.use((req, res, next) => {
          if ((req.url === '/__log' || req.url?.endsWith('/__log')) && req.method === 'POST') {
            let body = ''
            req.on('data', (chunk: Buffer) => { body += chunk.toString() })
            req.on('end', () => {
              try {
                const { tag, msg } = JSON.parse(body) as { tag: string; msg: string }
                const time = new Date().toLocaleTimeString('es-ES', { hour12: false })
                appendFileSync(logPath, `[${time}] ${tag} ${msg}\n`)
              } catch { /* ignorar */ }
              res.statusCode = 204
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end()
            })
            return
          }
          next()
        })
      },
    },
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'pwa-192x192.svg', 'pwa-512x512.svg'],
      manifest: {
        name: 'BB Rise to Glory',
        short_name: 'BBRTG',
        description: 'Generador de fichas para Blood Bowl: Rise to Glory',
        theme_color: '#1c1917',
        background_color: '#1c1917',
        display: 'standalone',
        scope: '/bbrtg/',
        start_url: '/bbrtg/',
        icons: [
          { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  build: {
    outDir: 'docs',
  },
})

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'pwa-icon.svg',
        'og-image-placeholder.svg',
        'pwa-screenshot-placeholder.svg',
      ],
      manifest: {
        name: 'Техдозор',
        short_name: 'Техдозор',
        description:
          'PWA для плановых обходов оборудования: маршруты, чек-листы, показания, фотофиксация и офлайн-режим.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        lang: 'ru',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        categories: ['business', 'productivity', 'utilities'],
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
        screenshots: [
          {
            src: 'pwa-screenshot-placeholder.svg',
            sizes: '390x844',
            type: 'image/svg+xml',
            form_factor: 'narrow',
            label: 'Заглушка экрана мобильного обходчика',
          },
        ],
        shortcuts: [
          {
            name: 'Фотофиксация',
            short_name: 'Фото',
            description: 'Быстро открыть экран фотофиксации дефекта.',
            url: '/?shortcut=photo',
            icons: [
              {
                src: 'pwa-icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
              },
            ],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})

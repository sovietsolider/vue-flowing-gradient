// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [],
  alias: {
    '@': join(currentDir, 'src'),
  },
  app: {
    head: {
      title: 'GradFlow - WebGL Gradient Backgrounds',
      meta: [
        {
          name: 'description',
          content:
            'Create stunning animated gradient backgrounds with WebGL. Open-source Vue component with 60fps performance, customizable colors, noise effects, image export, and realtime controls. Perfect for modern web applications.',
        },
      ],
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': join(currentDir, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        css: {
          charset: false,
        },
      },
    },
  },
})


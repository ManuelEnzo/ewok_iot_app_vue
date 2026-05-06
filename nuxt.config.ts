// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',

  nitro: {
    preset: 'netlify',
    devProxy: {
      '/api/v1': {
        target: (process.env.API_TARGET ?? 'http://localhost:5147') + '/api/v1',
        changeOrigin: true,
        secure: false,
        headers: {
          // Bypass ngrok browser interstitial (ERR_NGROK_6024)
          'ngrok-skip-browser-warning': 'true',
        },
      },
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['leaflet/dist/leaflet.css', '~/assets/main.css'],

  typescript: {
    strict: true,
  },

  imports: {
    dirs: ['store'],
  },

  runtimeConfig: {
    public: {
      // In dev il proxy Nitro gestisce /api/v1, quindi apiBase è vuoto.
      // In produzione imposta NUXT_PUBLIC_API_BASE con l'URL completo del backend.
      apiBase: process.env.NODE_ENV === 'production'
        ? (process.env.NUXT_PUBLIC_API_BASE ?? '')
        : '',
    },
  },

  compatibilityDate: '2024-11-01',
})

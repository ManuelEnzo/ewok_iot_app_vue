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
      // In dev: rimane '' → le chiamate /api/v1/* vengono catturate dal devProxy Nitro.
      // In produzione: impostare NUXT_PUBLIC_API_BASE su Netlify (build env vars).
      // Nuxt sovrascrive automaticamente apiBase con il valore di NUXT_PUBLIC_API_BASE.
      apiBase: '',
    },
  },

  compatibilityDate: '2024-11-01',
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src/',

  nitro: {
    preset: 'netlify',
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  css: ['leaflet/dist/leaflet.css', '~/assets/main.css'],

  typescript: {
    strict: true,
  },

  compatibilityDate: '2024-11-01',
})

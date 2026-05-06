/**
 * Catch-all proxy per /api/v1/*
 *
 * Gira come server Nitro in dev e come Netlify Function in produzione.
 * Aggiunge l'header ngrok-skip-browser-warning per evitare ERR_NGROK_6024.
 *
 * Env var richiesta: API_TARGET=https://aging-closure-flame.ngrok-free.dev
 */
export default defineEventHandler(async (event) => {
  const target = process.env.API_TARGET ?? 'http://localhost:5147'
  const url    = getRequestURL(event)
  const dest   = `${target}${url.pathname}${url.search}`

  return proxyRequest(event, dest, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    fetchOptions: {
      // Ignora errori SSL per certificati self-signed
      // @ts-ignore
      rejectUnauthorized: false,
    },
  })
})

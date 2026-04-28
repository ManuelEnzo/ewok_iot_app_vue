// POST /api/mock/checkout
// Mock: simulates payment processing and returns a generated API key
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.email || !body?.plan) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // Simulate processing delay
  await new Promise(r => setTimeout(r, 500))

  const apiKey = `ewk_live_${generateKey()}`

  return {
    success: true,
    apiKey,
    plan: body.plan,
    email: body.email,
    createdAt: new Date().toISOString(),
  }
})

function generateKey (): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

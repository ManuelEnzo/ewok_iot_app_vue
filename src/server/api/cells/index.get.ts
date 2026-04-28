// GET /api/cells
// Returns all IoT cells. Requires Authorization: Bearer <apikey>
import { MOCK_CELLS } from '../_data/cells'

export default defineEventHandler((event) => {
  requireApiKey(event)
  return { data: MOCK_CELLS, count: MOCK_CELLS.length }
})

function requireApiKey (event: Parameters<typeof defineEventHandler>[0] extends (e: infer E) => unknown ? E : never) {
  const auth = getHeader(event, 'authorization') ?? ''
  if (!auth.startsWith('Bearer ewk_')) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or missing API key' })
  }
}

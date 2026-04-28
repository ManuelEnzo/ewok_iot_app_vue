// GET /api/cells/:id
import { MOCK_CELLS } from '../../_data/cells'

export default defineEventHandler((event) => {
  requireApiKey(event)
  const id   = getRouterParam(event, 'id')
  const cell = MOCK_CELLS.find(c => c.id === id)
  if (!cell) throw createError({ statusCode: 404, statusMessage: 'Cell not found' })
  return { data: cell }
})

function requireApiKey (event: Parameters<typeof defineEventHandler>[0] extends (e: infer E) => unknown ? E : never) {
  const auth = getHeader(event, 'authorization') ?? ''
  if (!auth.startsWith('Bearer ewk_')) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or missing API key' })
  }
}

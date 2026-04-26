import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IoTCell, AreaGroup } from '@/models/iot'
import { IoTDataService } from '@/services/IoTDataService'

export const useIoTStore = defineStore('iot', () => {
  const cells       = ref<IoTCell[]>([])
  const areaGroups  = ref<AreaGroup[]>([])
  const isLoading   = ref(false)
  const lastSync    = ref<string | null>(null)
  const selectedCellId = ref<string | null>(null)
  let   refreshTimer: ReturnType<typeof setInterval> | null = null

  // ── computed ────────────────────────────────────────────────────────────────

  const activeCells = computed(() => cells.value.filter(c => c.status !== 'inactive'))

  const selectedCell = computed(() =>
    selectedCellId.value
      ? cells.value.find(c => c.id === selectedCellId.value) ?? null
      : null
  )

  const globalStats = computed(() => {
    const active = activeCells.value
    if (!active.length) return null
    const readings = active.map(c => c.lastReading).filter((r): r is import('@/models/iot').IoTReading => r !== null)
    const avg = (key: keyof import('@/models/iot').IoTReading) =>
      parseFloat((readings.reduce((s, r) => s + Number(r![key]), 0) / readings.length).toFixed(1))
    return {
      avgTemperature: avg('Temperature'),
      avgHumidity:    avg('Humidity'),
      avgCO2:         avg('CO2'),
      avgPM25:        avg('PM25'),
      avgIAQ:         avg('IndoorAirQuality'),
      totalCells:     cells.value.length,
      activeCells:    active.length,
    }
  })

  // ── actions ─────────────────────────────────────────────────────────────────

  function initialize () {
    isLoading.value = true
    cells.value      = IoTDataService.getCells()
    areaGroups.value = IoTDataService.getAreaGroups(cells.value)
    lastSync.value   = new Date().toISOString()
    isLoading.value  = false
  }

  function refreshAll () {
    cells.value = cells.value.map(cell => IoTDataService.refreshCellReading(cell))
    areaGroups.value = IoTDataService.getAreaGroups(cells.value)
    lastSync.value = new Date().toISOString()
  }

  function selectCell (id: string | null) {
    selectedCellId.value = id
  }

  function startLiveUpdates (intervalMs = 8000) {
    if (refreshTimer) clearInterval(refreshTimer)
    refreshTimer = setInterval(refreshAll, intervalMs)
  }

  function stopLiveUpdates () {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  return {
    cells,
    areaGroups,
    isLoading,
    lastSync,
    selectedCellId,
    selectedCell,
    activeCells,
    globalStats,
    initialize,
    refreshAll,
    selectCell,
    startLiveUpdates,
    stopLiveUpdates,
  }
})

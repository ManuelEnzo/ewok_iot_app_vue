import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IoTCell, AreaGroup, IoTReading, CellStatus } from '@/models/iot'
import { IoTDataService } from '@/services/IoTDataService'
import type { UnitLatestDto } from '@/models/api'

// ── Coordinate esatte per ogni UNIT ───────────────────────────────────────────
// Chiave = valore esatto del campo "unit" restituito dall'API (es. "UNIT04").
// Aggiungere qui ogni nuova UNIT con la sua posizione GPS precisa.
const UNIT_COORDS: Record<string, { lat: number; lng: number; name: string; area: string; technology: IoTCell['technology'] }> = {
  'UNIT01': { lat: 45.5047, lng: 12.6447, name: 'Jesolo Centro',      area: 'Jesolo',     technology: 'WiFi'      },
  'UNIT02': { lat: 45.5040, lng: 12.6420, name: 'Jesolo Sud',         area: 'Jesolo',     technology: 'WiFi'      },
  'UNIT03': { lat: 45.8887, lng: 12.2983, name: 'Conegliano Centro',  area: 'Conegliano', technology: 'WiFi+LoRa' },
  'UNIT04': { lat: 46.1370, lng: 12.2170, name: 'Gavaz Belluno',      area: 'Gavaz',      technology: 'LoRa P2P'  },
  'UNIT05': { lat: 45.5080, lng: 12.6600, name: 'Jesolo Lungomare',   area: 'Jesolo',     technology: 'WiFi'      },
  'UNIT07': { lat: 45.5000, lng: 12.6300, name: 'Jesolo Entroterra',  area: 'Jesolo',     technology: 'LoRa P2P'  },
}

// Fallback per UNIT sconosciute: coordinate basate sull'area testuale
const AREA_COORDS: Record<string, { lat: number; lng: number }> = {
  'jesolo':     { lat: 45.5047, lng: 12.6447 },
  'conegliano': { lat: 45.8887, lng: 12.2983 },
  'mestre':     { lat: 45.4920, lng: 12.2387 },
  'gavaz':      { lat: 46.1370, lng: 12.2170 },
  'venezia':    { lat: 45.4408, lng: 12.3155 },
  'treviso':    { lat: 45.6669, lng: 12.2429 },
  'padova':     { lat: 45.4064, lng: 11.8768 },
}
const DEFAULT_COORDS = { lat: 45.5047, lng: 12.3155 }

function deriveCoords (unit?: string | null, area?: string | null): { lat: number; lng: number } {
  if (unit && UNIT_COORDS[unit]) return UNIT_COORDS[unit]
  if (!area) return DEFAULT_COORDS
  const key = Object.keys(AREA_COORDS).find(k => area.toLowerCase().includes(k))
  return key ? AREA_COORDS[key] : DEFAULT_COORDS
}

/**
 * Una cella è considerata INATTIVA (rosso) se l'ultima misurazione
 * non è di oggi. Altrimenti: ACTIVE o WARNING in base all'IAQ interpretata.
 */
function deriveStatus (markerDate?: string | null, iaqInterpreted?: string | null): CellStatus {
  if (!markerDate) return 'inactive'

  const readingDay = new Date(markerDate).toDateString()
  const today      = new Date().toDateString()
  if (readingDay !== today) return 'inactive'

  // Scala IAQ dell'API: 1-10, interpretata come stringa
  const q = (iaqInterpreted ?? '').toLowerCase()
  if (q.includes('very good') || q.includes('excellent') || q.includes('good')) return 'active'
  if (q.includes('moderate')  || q.includes('fair'))                            return 'warning'
  if (q.includes('poor')      || q.includes('bad'))                             return 'warning'
  return 'active' // dato presente oggi ma interpretazione sconosciuta
}

function mapUnitLatestToCell (dto: UnitLatestDto): IoTCell {
  const unitKey  = dto.unit ?? ''
  const unitMeta = UNIT_COORDS[unitKey]
  const coords   = deriveCoords(dto.unit, dto.area)

  const reading: IoTReading = {
    id:                           unitKey,
    Unit:                         unitKey,
    SensorType:                   dto.sensorType   ?? '',
    MarkerDate:                   dto.markerDate   ?? new Date().toISOString(),
    Area:                         dto.area         ?? '',
    Sector:                       dto.sector       ?? '',
    Temperature:                  dto.temperature  ?? 0,
    Humidity:                     dto.humidity     ?? 0,
    IndoorAirQuality:             dto.indoorAirQuality ?? 0,
    IndoorAirQualityInterpreted:  dto.indoorAirQualityInterpreted ?? '',
    IndoorAirQualityRelative:     0,
    CO2:                          dto.cO2  ?? 0,
    TVOC:                         0,
    Ethanol:                      0,
    OutdoorMode:                  false,
    OutdoorAirQualityIndex:       0,
    OutdoorAirQualityInterpreted: '',
    OutdoorfastAirQualityIndex:   0,
    NO2:                          0,
    O3:                           0,
    TemperatureCheck:             false,
    HumidityCheck:                false,
    RelativePressure:             0,
    CalculatedAltitude:           0,
    DewPoint:                     0,
    SignalPower:                  dto.signalPower  ?? 0,
    PM25:                         dto.pM25 ?? 0,
    PM10:                         dto.pM10 ?? 0,
    UVAData:                      0,
    BatteryVoltage:               0,
    BatteryPercent:               dto.batteryPercent ?? 0,
  }

  return {
    id:          unitKey || String(Math.random()),
    name:        unitMeta?.name ?? `${dto.area ?? 'Sensore'} ${dto.sector ?? ''}`.trim(),
    // Usa l'area dal registro UNIT (es. "Jesolo"), non il codice numerico dell'API ("001")
    area:        unitMeta?.area ?? dto.area ?? 'Sconosciuta',
    sector:      dto.sector ?? '',
    lat:         coords.lat,
    lng:         coords.lng,
    status:      deriveStatus(dto.markerDate, dto.indoorAirQualityInterpreted),
    technology:  unitMeta?.technology ?? 'WiFi',
    lastReading: reading,
    lastUpdated: dto.markerDate ?? new Date().toISOString(),
  }
}

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
      totalCells:     active.length,
      activeCells:    active.length,
    }
  })

  // ── actions ─────────────────────────────────────────────────────────────────

  async function initialize () {
    isLoading.value = true
    try {
      const api  = useEwokApi()
      const data = await api.publicApi.getLatestPerUnit()
      const valid = (data ?? []).filter(d => !!d.unit)
      if (valid.length > 0) {
        cells.value = valid.map(mapUnitLatestToCell)
      } else {
        cells.value = IoTDataService.getCells()
      }
    } catch {
      // Backend non raggiungibile → fallback mock
      cells.value = IoTDataService.getCells()
    }
    areaGroups.value = IoTDataService.getAreaGroups(cells.value)
    lastSync.value   = new Date().toISOString()
    isLoading.value  = false
  }

  async function refreshAll () {
    try {
      const api  = useEwokApi()
      const data = await api.publicApi.getLatestPerUnit()
      const valid = (data ?? []).filter(d => !!d.unit)
      if (valid.length > 0) {
        cells.value      = valid.map(mapUnitLatestToCell)
        areaGroups.value = IoTDataService.getAreaGroups(cells.value)
        lastSync.value   = new Date().toISOString()
        return
      }
    } catch { /* silent: mantieni i dati precedenti */ }
    // Fallback: simula aggiornamento sui dati correnti
    cells.value      = cells.value.map(cell => IoTDataService.refreshCellReading(cell))
    areaGroups.value = IoTDataService.getAreaGroups(cells.value)
    lastSync.value   = new Date().toISOString()
  }

  function selectCell (id: string | null) {
    selectedCellId.value = id
  }

  function startLiveUpdates (intervalMs = 8000) {
    if (refreshTimer) clearInterval(refreshTimer)
    refreshTimer = setInterval(() => { refreshAll() }, intervalMs)
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

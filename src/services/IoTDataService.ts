import type { IoTReading, IoTCell, AreaGroup, AirQualityInfo, AirQualityLevel } from '@/models/iot'

// ─── helpers ──────────────────────────────────────────────────────────────────

const rnd  = (min: number, max: number, decimals = 1) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals))

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

function isoNow (): string {
  return new Date().toISOString()
}

// ─── air quality mapping ───────────────────────────────────────────────────────

export function getAirQualityInfo (iaq: number): AirQualityInfo {
  const levels: { max: number; info: AirQualityInfo }[] = [
    { max: 50,  info: { level: 'Excellent',  label: 'Eccellente',     color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', description: 'Aria pura, condizioni ideali' } },
    { max: 100, info: { level: 'Good',       label: 'Buona',          color: 'text-green-400',   bgColor: 'bg-green-400/10',   description: 'Buona qualità dell\'aria' } },
    { max: 150, info: { level: 'Moderate',   label: 'Moderata',       color: 'text-yellow-400',  bgColor: 'bg-yellow-400/10',  description: 'Qualità accettabile' } },
    { max: 200, info: { level: 'Poor',       label: 'Scarsa',         color: 'text-orange-400',  bgColor: 'bg-orange-400/10',  description: 'Possibili effetti per persone sensibili' } },
    { max: 300, info: { level: 'Very Poor',  label: 'Molto scarsa',   color: 'text-red-400',     bgColor: 'bg-red-400/10',     description: 'Effetti negativi sulla salute' } },
    { max: 500, info: { level: 'Hazardous',  label: 'Pericolosa',     color: 'text-rose-600',    bgColor: 'bg-rose-600/10',    description: 'Condizioni pericolose' } },
  ]
  for (const { max, info } of levels) {
    if (iaq <= max) return info
  }
  return levels[levels.length - 1].info
}

// ─── generate realistic reading ───────────────────────────────────────────────

function generateReading (cellId: string, area: string, sector: string): IoTReading {
  const temp   = rnd(14, 32)
  const hum    = rnd(35, 80)
  const co2    = rnd(400, 1800, 0)
  const tvoc   = rnd(0, 500, 0)
  const iaq    = rnd(30, 250, 0)
  const pm25   = rnd(1, 55, 1)
  const pm10   = rnd(pm25, pm25 + 40, 1)
  const dewPt  = parseFloat((temp - (100 - hum) / 5).toFixed(1))
  const info   = getAirQualityInfo(iaq)

  return {
    id:                            cellId,
    Unit:                          `EWOK-${cellId}`,
    SensorType:                    pick(['BME680', 'SCD41', 'SEN55']),
    MarkerDate:                    isoNow(),
    Area:                          area,
    Sector:                        sector,
    Temperature:                   temp,
    Humidity:                      hum,
    IndoorAirQuality:              iaq,
    IndoorAirQualityInterpreted:   info.label,
    IndoorAirQualityRelative:      parseFloat((iaq / 500 * 100).toFixed(1)),
    CO2:                           co2,
    TVOC:                          tvoc,
    Ethanol:                       rnd(0, 50, 0),
    OutdoorMode:                   Math.random() > 0.5,
    OutdoorAirQualityIndex:        rnd(1, 5, 1),
    OutdoorAirQualityInterpreted:  pick(['Buona', 'Moderata', 'Scarsa']),
    OutdoorfastAirQualityIndex:    rnd(1, 5, 1),
    NO2:                           rnd(10, 120, 1),
    O3:                            rnd(20, 180, 1),
    TemperatureCheck:              temp >= 10 && temp <= 40,
    HumidityCheck:                 hum >= 20 && hum <= 85,
    RelativePressure:              rnd(990, 1030, 1),
    CalculatedAltitude:            rnd(0, 400, 0),
    DewPoint:                      dewPt,
    SignalPower:                   rnd(-90, -40, 0),
    PM25:                          pm25,
    PM10:                          pm10,
    UVAData:                       rnd(0, 12, 2),
    BatteryVoltage:                rnd(3.2, 4.2, 2),
    BatteryPercent:                rnd(15, 100, 0),
  }
}

// ─── cell definitions ─────────────────────────────────────────────────────────

const CELL_DEFS: { id: string; name: string; area: string; sector: string; lat: number; lng: number; tech: IoTCell['technology'] }[] = [
  { id: 'JES-01', name: 'Jesolo Centro',     area: 'Jesolo',    sector: 'Centro Storico', lat: 45.5047, lng: 12.6447, tech: 'WiFi' },
  { id: 'JES-02', name: 'Jesolo Lungomare',  area: 'Jesolo',    sector: 'Lungomare',      lat: 45.5080, lng: 12.6600, tech: 'WiFi' },
  { id: 'JES-03', name: 'Jesolo Entroterra', area: 'Jesolo',    sector: 'Entroterra',     lat: 45.5000, lng: 12.6300, tech: 'LoRa P2P' },
  { id: 'CGN-01', name: 'Conegliano Centro', area: 'Conegliano', sector: 'Centro',        lat: 45.8887, lng: 12.2983, tech: 'WiFi+LoRa' },
  { id: 'MES-01', name: 'Mestre Stazione',   area: 'Mestre',    sector: 'Zona Stazione',  lat: 45.4920, lng: 12.2387, tech: 'WiFi' },
  { id: 'GAV-01', name: 'Gavaz Belluno',     area: 'Gavaz',     sector: 'Montagna',       lat: 46.1370, lng: 12.2170, tech: 'LoRa P2P' },
]

// ─── build initial cells ──────────────────────────────────────────────────────

function buildCells (): IoTCell[] {
  return CELL_DEFS.map(def => ({
    id:          def.id,
    name:        def.name,
    area:        def.area,
    sector:      def.sector,
    lat:         def.lat,
    lng:         def.lng,
    status:      'active' as const,
    technology:  def.tech,
    lastReading: generateReading(def.id, def.area, def.sector),
    lastUpdated: isoNow(),
  }))
}

// ─── public API ───────────────────────────────────────────────────────────────

export const IoTDataService = {
  getCells (): IoTCell[] {
    return buildCells()
  },

  getAreaGroups (cells: IoTCell[]): AreaGroup[] {
    const map = new Map<string, IoTCell[]>()
    for (const cell of cells) {
      const list = map.get(cell.area) ?? []
      list.push(cell)
      map.set(cell.area, list)
    }

    const areaCoords: Record<string, { lat: number; lng: number; province: string }> = {
      Jesolo:     { lat: 45.5047, lng: 12.6447, province: 'Venezia' },
      Conegliano: { lat: 45.8887, lng: 12.2983, province: 'Treviso' },
      Mestre:     { lat: 45.4920, lng: 12.2387, province: 'Venezia' },
      Gavaz:      { lat: 46.1370, lng: 12.2170, province: 'Belluno' },
    }

    return Array.from(map.entries()).map(([name, areaCells]) => ({
      id:       name.toLowerCase(),
      name,
      province: areaCoords[name]?.province ?? 'Veneto',
      cells:    areaCells,
      lat:      areaCoords[name]?.lat ?? 45.5,
      lng:      areaCoords[name]?.lng ?? 12.0,
    }))
  },

  refreshCellReading (cell: IoTCell): IoTCell {
    const prev  = cell.lastReading
    const fresh = generateReading(cell.id, cell.area, cell.sector)

    // small realistic drift from previous values
    if (prev) {
      fresh.Temperature = parseFloat(((prev.Temperature + fresh.Temperature) / 2 + rnd(-0.5, 0.5)).toFixed(1))
      fresh.CO2         = Math.round((prev.CO2 + fresh.CO2) / 2 + rnd(-20, 20))
      fresh.Humidity    = parseFloat(((prev.Humidity + fresh.Humidity) / 2 + rnd(-1, 1)).toFixed(1))
    }

    return {
      ...cell,
      lastReading: fresh,
      lastUpdated: isoNow(),
      status:      fresh.BatteryPercent < 10 ? 'warning' : 'active',
    }
  },

  getAirQualityInfo,

  formatAQLevel (level: AirQualityLevel): string {
    const map: Record<AirQualityLevel, string> = {
      Excellent: 'Eccellente',
      Good:      'Buona',
      Moderate:  'Moderata',
      Poor:      'Scarsa',
      'Very Poor': 'Molto scarsa',
      Hazardous: 'Pericolosa',
    }
    return map[level]
  },
}

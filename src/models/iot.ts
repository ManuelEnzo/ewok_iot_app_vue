export interface IoTReading {
  id: string
  Unit: string
  SensorType: string
  MarkerDate: string
  Area: string
  Sector: string
  Temperature: number
  Humidity: number
  IndoorAirQuality: number
  IndoorAirQualityInterpreted: string
  IndoorAirQualityRelative: number
  CO2: number
  TVOC: number
  Ethanol: number
  OutdoorMode: boolean
  OutdoorAirQualityIndex: number
  OutdoorAirQualityInterpreted: string
  OutdoorfastAirQualityIndex: number
  NO2: number
  O3: number
  TemperatureCheck: boolean
  HumidityCheck: boolean
  RelativePressure: number
  CalculatedAltitude: number
  DewPoint: number
  SignalPower: number
  PM25: number
  PM10: number
  UVAData: number
  BatteryVoltage: number
  BatteryPercent: number
}

export type CellStatus = 'active' | 'inactive' | 'warning'

export interface IoTCell {
  id: string
  name: string
  area: string
  sector: string
  lat: number
  lng: number
  status: CellStatus
  technology: 'WiFi' | 'LoRa P2P' | 'WiFi+LoRa'
  lastReading: IoTReading | null
  lastUpdated: string
}

export interface AreaGroup {
  id: string
  name: string
  province: string
  cells: IoTCell[]
  lat: number
  lng: number
}

export type AirQualityLevel = 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Hazardous'

export interface AirQualityInfo {
  level: AirQualityLevel
  label: string
  color: string
  bgColor: string
  description: string
}

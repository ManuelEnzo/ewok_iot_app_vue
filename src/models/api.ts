// ─── Auth ──────────────────────────────────────────────────────────────────

export interface AuthResponseDto {
  accessToken: string | null
  refreshToken: string | null
  expiresAt: string
  email: string | null
  role: string | null
  firstName: string | null
  lastName: string | null
}

export interface LoginRequestDto {
  email: string
  password: string
}

export interface RegisterRequestDto {
  email: string
  password: string
  firstName?: string | null
  lastName?: string | null
  role?: string | null
}

export interface RefreshTokenRequestDto {
  refreshToken: string | null
}

// ─── Sensor Data ───────────────────────────────────────────────────────────

export interface SensorDataDto {
  id: number
  unit?: string | null
  sensorType?: string | null
  markerDate?: string | null
  area?: string | null
  sector?: string | null
  temperature?: number | null
  humidity?: number | null
  indoorAirQuality?: number | null
  indoorAirQualityInterpreted?: string | null
  indoorAirQualityRelative?: number | null
  cO2?: number | null
  tvoc?: number | null
  ethanol?: number | null
  outdoorMode?: string | null
  outdoorAirQualityIndex?: number | null
  outdoorAirQualityInterpreted?: string | null
  outdoorfastAirQualityIndex?: number | null
  nO2?: number | null
  o3?: number | null
  temperatureCheck?: number | null
  humidityCheck?: number | null
  relativePressure?: number | null
  calculatedAltitude?: number | null
  dewPoint?: number | null
  signalPower?: number | null
  pM25?: number | null
  pM10?: number | null
  uvaData?: number | null
  batteryVoltage?: number | null
  batteryPercent?: number | null
}

export interface SensorDataDtoPagedResponseDto {
  items?: SensorDataDto[] | null
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface SensorAggregatesDto {
  avgTemperature?: number | null
  avgHumidity?: number | null
  avgCO2?: number | null
  avgPM10?: number | null
  avgPM25?: number | null
  avgIndoorAirQuality?: number | null
  recordCount: number
}

export interface CreateSensorDataDto {
  unit?: string | null
  sensorType?: string | null
  markerDate?: string | null
  area?: string | null
  sector?: string | null
  temperature?: number | null
  humidity?: number | null
  indoorAirQuality?: number | null
  indoorAirQualityInterpreted?: string | null
  indoorAirQualityRelative?: number | null
  cO2?: number | null
  tvoc?: number | null
  ethanol?: number | null
  outdoorMode?: string | null
  outdoorAirQualityIndex?: number | null
  outdoorAirQualityInterpreted?: string | null
  outdoorfastAirQualityIndex?: number | null
  nO2?: number | null
  o3?: number | null
  temperatureCheck?: number | null
  humidityCheck?: number | null
  relativePressure?: number | null
  calculatedAltitude?: number | null
  dewPoint?: number | null
  signalPower?: number | null
  pM25?: number | null
  pM10?: number | null
  uvaData?: number | null
  batteryVoltage?: number | null
  batteryPercent?: number | null
}

// ─── Subscription ──────────────────────────────────────────────────────────

export interface SubscriptionPlanDto {
  tier?: string | null
  name?: string | null
  emoji?: string | null
  priceMonthly: number
  monthlyRequestLimit?: number | null
  maxApiKeys?: number | null
  maxStations?: number | null
  historyDays?: number | null
  hasWebhooks: boolean
  hasAdvancedDashboard: boolean
  hasSla: boolean
  hasPrioritySupport: boolean
  maxPageSize: number
  includesAllStations: boolean
}

export interface UserSubscriptionDto {
  tier?: string | null
  name?: string | null
  emoji?: string | null
  priceMonthly: number
  expiresAt?: string | null
  isActive: boolean
  monthlyRequestLimit?: number | null
  monthlyRequestsUsed: number
  maxApiKeys?: number | null
  maxStations?: number | null
  historyDays?: number | null
  hasWebhooks: boolean
  hasAdvancedDashboard: boolean
  hasSla: boolean
  hasPrioritySupport: boolean
  maxPageSize: number
  includesAllStations: boolean
}

export interface UpgradeSubscriptionRequestDto {
  tier: string
  months?: number
}

// ─── Public (no auth) ────────────────────────────────────────────────────

export interface UnitLatestDto {
  unit?: string | null
  sensorType?: string | null
  area?: string | null
  sector?: string | null
  markerDate?: string | null
  temperature?: number | null
  humidity?: number | null
  cO2?: number | null
  indoorAirQuality?: number | null
  indoorAirQualityInterpreted?: string | null
  pM25?: number | null
  pM10?: number | null
  batteryPercent?: number | null
  signalPower?: number | null
}

// ─── Common ────────────────────────────────────────────────────────────────

export interface ProblemDetails {
  type?: string | null
  title?: string | null
  status?: number | null
  detail?: string | null
  instance?: string | null
}

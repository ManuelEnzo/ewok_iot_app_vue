import type {
  AuthResponseDto,
  SensorDataDto,
  SensorDataDtoPagedResponseDto,
  SensorAggregatesDto,
  SubscriptionPlanDto,
  UserSubscriptionDto,
  LoginRequestDto,
  RegisterRequestDto,
  RefreshTokenRequestDto,
  UpgradeSubscriptionRequestDto,
  UnitLatestDto,
} from '@/models/api'

export function useEwokApi () {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const authStore = useAuthStore()

  async function apiFetch<T> (path: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    const headers: Record<string, string> = {}
    if (authStore.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.accessToken}`
    }
    return $fetch(`${apiBase}${path}`, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string> ?? {}) },
    }) as Promise<T>
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const auth = {
    register: (body: RegisterRequestDto) =>
      $fetch<AuthResponseDto>(`${apiBase}/api/v1/auth/register`, { method: 'POST', body }),
    login: (body: LoginRequestDto) =>
      $fetch<AuthResponseDto>(`${apiBase}/api/v1/auth/login`, { method: 'POST', body }),
    refresh: (body: RefreshTokenRequestDto) =>
      $fetch<AuthResponseDto>(`${apiBase}/api/v1/auth/refresh`, { method: 'POST', body }),
    logout: (body: RefreshTokenRequestDto) =>
      $fetch<void>(`${apiBase}/api/v1/auth/logout`, { method: 'POST', body }),
  }

  // ── Sensor Data ───────────────────────────────────────────────────────────
  const sensorData = {
    getAll: (page = 1, pageSize = 20) =>
      apiFetch<SensorDataDtoPagedResponseDto>(`/api/v1/sensor-data?page=${page}&pageSize=${pageSize}`),

    getLatest: () =>
      apiFetch<SensorDataDto[]>('/api/v1/sensor-data/latest'),

    getById: (id: number) =>
      apiFetch<SensorDataDto>(`/api/v1/sensor-data/${id}`),

    getByArea: (area: string, page = 1, pageSize = 20) =>
      apiFetch<SensorDataDtoPagedResponseDto>(
        `/api/v1/sensor-data/by-area/${encodeURIComponent(area)}?page=${page}&pageSize=${pageSize}`,
      ),

    getByDateRange: (from?: string, to?: string, area?: string) => {
      const params = new URLSearchParams()
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      if (area) params.set('area', area)
      return apiFetch<SensorDataDto[]>(`/api/v1/sensor-data/by-date-range?${params}`)
    },

    getAggregates: (area?: string, from?: string, to?: string) => {
      const params = new URLSearchParams()
      if (area) params.set('area', area)
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      return apiFetch<SensorAggregatesDto>(`/api/v1/sensor-data/aggregates?${params}`)
    },
  }

  // ── Public (no auth required) ──────────────────────────────────────────
  const publicApi = {
    getLatestPerUnit: () =>
      $fetch<UnitLatestDto[]>(`${apiBase}/api/v1/public/latest-per-unit`),

    getPlans: () =>
      $fetch<SubscriptionPlanDto[]>(`${apiBase}/api/v1/public/plans`),
  }

  // ── Subscription ──────────────────────────────────────────────────────────
  const subscription = {
    getPlans: () =>
      apiFetch<SubscriptionPlanDto[]>('/api/v1/subscription/plans'),

    getMySubscription: () =>
      apiFetch<UserSubscriptionDto>('/api/v1/subscription/me'),

    upgrade: (body: UpgradeSubscriptionRequestDto) =>
      apiFetch<void>('/api/v1/subscription/upgrade', { method: 'POST', body }),
  }

  return { auth, publicApi, sensorData, subscription }
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from '@/models/api'

const STORAGE_KEY = 'ewok_auth'

interface StoredAuth {
  accessToken: string
  refreshToken: string
  expiresAt: string
  email: string
  role: string | null
  firstName: string | null
  lastName: string | null
}

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const accessToken  = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const expiresAt    = ref<string | null>(null)
  const email        = ref<string | null>(null)
  const role         = ref<string | null>(null)
  const firstName    = ref<string | null>(null)
  const lastName     = ref<string | null>(null)
  const isLoading    = ref(false)
  const error        = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const displayName     = computed(() =>
    firstName.value
      ? `${firstName.value} ${lastName.value ?? ''}`.trim()
      : email.value ?? '',
  )

  // ── Internal helpers ──────────────────────────────────────────────────────

  function _setAuth (data: AuthResponseDto) {
    accessToken.value  = data.accessToken
    refreshToken.value = data.refreshToken
    expiresAt.value    = data.expiresAt
    email.value        = data.email
    role.value         = data.role
    firstName.value    = data.firstName
    lastName.value     = data.lastName

    if (import.meta.client) {
      const stored: StoredAuth = {
        accessToken:  data.accessToken!,
        refreshToken: data.refreshToken!,
        expiresAt:    data.expiresAt,
        email:        data.email!,
        role:         data.role,
        firstName:    data.firstName,
        lastName:     data.lastName,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    }
  }

  function _clearAuth () {
    accessToken.value  = null
    refreshToken.value = null
    expiresAt.value    = null
    email.value        = null
    role.value         = null
    firstName.value    = null
    lastName.value     = null
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  // ── Public actions ────────────────────────────────────────────────────────

  function restoreFromStorage () {
    if (!import.meta.client) return
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const stored: StoredAuth = JSON.parse(raw)
      if (stored.expiresAt && new Date(stored.expiresAt) < new Date()) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      accessToken.value  = stored.accessToken
      refreshToken.value = stored.refreshToken
      expiresAt.value    = stored.expiresAt
      email.value        = stored.email
      role.value         = stored.role
      firstName.value    = stored.firstName
      lastName.value     = stored.lastName
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  async function login (credentials: LoginRequestDto) {
    isLoading.value = true
    error.value     = null
    try {
      const data = await $fetch<AuthResponseDto>(`${apiBase}/api/v1/auth/login`, {
        method: 'POST',
        body:   credentials,
      })
      _setAuth(data)
      return data
    } catch (err: unknown) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail
      error.value = detail ?? 'Credenziali non valide. Riprova.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function register (payload: RegisterRequestDto) {
    isLoading.value = true
    error.value     = null
    try {
      const data = await $fetch<AuthResponseDto>(`${apiBase}/api/v1/auth/register`, {
        method: 'POST',
        body:   payload,
      })
      _setAuth(data)
      return data
    } catch (err: unknown) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail
      error.value = detail ?? 'Registrazione fallita. Verifica i dati e riprova.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout () {
    try {
      if (refreshToken.value) {
        await $fetch(`${apiBase}/api/v1/auth/logout`, {
          method: 'POST',
          body:   { refreshToken: refreshToken.value },
        })
      }
    } finally {
      _clearAuth()
    }
  }

  async function refreshAccessToken () {
    if (!refreshToken.value) return
    try {
      const data = await $fetch<AuthResponseDto>(`${apiBase}/api/v1/auth/refresh`, {
        method: 'POST',
        body:   { refreshToken: refreshToken.value },
      })
      _setAuth(data)
    } catch {
      _clearAuth()
    }
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
    email,
    role,
    firstName,
    lastName,
    isLoading,
    error,
    isAuthenticated,
    displayName,
    restoreFromStorage,
    login,
    register,
    logout,
    refreshAccessToken,
  }
})

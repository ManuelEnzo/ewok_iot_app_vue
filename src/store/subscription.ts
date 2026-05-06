import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserSubscriptionDto, SubscriptionPlanDto } from '@/models/api'

export const useSubscriptionStore = defineStore('subscription', () => {
  const mySubscription = ref<UserSubscriptionDto | null>(null)
  const plans          = ref<SubscriptionPlanDto[]>([])
  const isLoading      = ref(false)
  const error          = ref<string | null>(null)

  async function fetchMySubscription () {
    const api = useEwokApi()
    isLoading.value = true
    error.value     = null
    try {
      mySubscription.value = await api.subscription.getMySubscription()
    } catch (err: unknown) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail
      error.value = detail ?? 'Impossibile caricare i dati dell\'abbonamento.'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPlans () {
    const api = useEwokApi()
    isLoading.value = true
    error.value     = null
    try {
      plans.value = await api.subscription.getPlans()
    } catch (err: unknown) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail
      error.value = detail ?? 'Impossibile caricare i piani.'
    } finally {
      isLoading.value = false
    }
  }

  async function upgrade (tier: string, months = 1) {
    const api = useEwokApi()
    isLoading.value = true
    error.value     = null
    try {
      await api.subscription.upgrade({ tier, months })
      await fetchMySubscription()
    } catch (err: unknown) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail
      error.value = detail ?? 'Upgrade abbonamento fallito.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    mySubscription,
    plans,
    isLoading,
    error,
    fetchMySubscription,
    fetchPlans,
    upgrade,
  }
})

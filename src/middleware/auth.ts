export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  authStore.restoreFromStorage()

  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})

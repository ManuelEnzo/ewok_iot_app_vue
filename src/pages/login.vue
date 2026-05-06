<template>
  <div class="min-h-screen bg-deep-900 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span class="text-white font-bold text-2xl tracking-tight">Ewok<span class="text-brand-400">IoT</span></span>
        </NuxtLink>
      </div>

      <!-- Card -->
      <div class="rounded-2xl bg-slate-900/80 border border-white/10 p-8 shadow-2xl">

        <!-- Tabs -->
        <div class="flex rounded-xl bg-white/5 p-1 mb-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            :class="activeTab === tab.id
              ? 'bg-brand-600 text-white shadow'
              : 'text-slate-400 hover:text-white'"
            @click="activeTab = tab.id"
          >{{ tab.label }}</button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin">
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="mario@esempio.it"
                autocomplete="email"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
              <input
                v-model="loginForm.password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
          </div>

          <p v-if="authStore.error" class="text-red-400 text-xs mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            {{ authStore.error }}
          </p>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg v-if="authStore.isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ authStore.isLoading ? 'Accesso in corso…' : 'Accedi' }}
          </button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister">
          <div class="space-y-4 mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-400 text-xs font-medium mb-1.5">Nome</label>
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  placeholder="Mario"
                  autocomplete="given-name"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
              <div>
                <label class="block text-slate-400 text-xs font-medium mb-1.5">Cognome</label>
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  placeholder="Rossi"
                  autocomplete="family-name"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                placeholder="mario@esempio.it"
                autocomplete="email"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
              <input
                v-model="registerForm.password"
                type="password"
                placeholder="min. 8 caratteri"
                autocomplete="new-password"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
          </div>

          <p v-if="authStore.error" class="text-red-400 text-xs mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            {{ authStore.error }}
          </p>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg v-if="authStore.isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ authStore.isLoading ? 'Creazione account…' : 'Crea account' }}
          </button>
        </form>

        <!-- Footer link -->
        <p class="text-center text-slate-600 text-xs mt-6">
          <span v-if="activeTab === 'login'">Non hai un account?
            <button class="text-brand-400 hover:text-brand-300 underline" @click="activeTab = 'register'">Registrati</button>
          </span>
          <span v-else>Hai già un account?
            <button class="text-brand-400 hover:text-brand-300 underline" @click="activeTab = 'login'">Accedi</button>
          </span>
        </p>
      </div>

      <p class="text-center text-slate-600 text-xs mt-4">
        <NuxtLink to="/" class="hover:text-slate-400 transition-colors">← Torna alla homepage</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const authStore = useAuthStore()
const router    = useRouter()
const route     = useRoute()

// Redirect if already authenticated
if (import.meta.client) {
  authStore.restoreFromStorage()
}
if (authStore.isAuthenticated) {
  router.replace('/portal')
}

const tabs: { id: 'login' | 'register'; label: string }[] = [
  { id: 'login',    label: 'Accedi' },
  { id: 'register', label: 'Registrati' },
]
const activeTab = ref<'login' | 'register'>('login')

const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ firstName: '', lastName: '', email: '', password: '' })

const redirectTo = computed(() => (route.query.redirect as string) || '/portal')

async function handleLogin () {
  if (!loginForm.value.email || !loginForm.value.password) return
  await authStore.login({ email: loginForm.value.email, password: loginForm.value.password })
  if (authStore.isAuthenticated) {
    router.push(redirectTo.value)
  }
}

async function handleRegister () {
  if (!registerForm.value.email || registerForm.value.password.length < 8) return
  await authStore.register({
    email:     registerForm.value.email,
    password:  registerForm.value.password,
    firstName: registerForm.value.firstName || null,
    lastName:  registerForm.value.lastName  || null,
  })
  if (authStore.isAuthenticated) {
    router.push(redirectTo.value)
  }
}
</script>

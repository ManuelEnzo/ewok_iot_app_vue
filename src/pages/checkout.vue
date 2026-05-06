<template>
  <div class="min-h-screen bg-deep-900 flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">

      <!-- Back link -->
      <NuxtLink to="/#prezzi" class="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Torna ai prezzi
      </NuxtLink>

      <!-- Step indicator -->
      <div class="flex items-center gap-3 mb-8">
        <div
          v-for="(s, i) in steps"
          :key="s.id"
          class="flex items-center gap-2"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            :class="currentStep > i + 1
              ? 'bg-brand-600 text-white'
              : currentStep === i + 1
                ? 'bg-brand-600 text-white ring-2 ring-brand-500/30'
                : 'bg-white/5 text-slate-500'"
          >
            <svg v-if="currentStep > i + 1" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span
            class="text-xs font-medium transition-colors"
            :class="currentStep >= i + 1 ? 'text-white' : 'text-slate-600'"
          >{{ s.label }}</span>
          <svg
            v-if="i < steps.length - 1"
            class="w-4 h-4 text-slate-700 ml-1"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <!-- Card -->
      <div class="rounded-2xl bg-slate-900/80 border border-white/10 p-8 shadow-2xl">

        <!-- Plan summary (always visible) -->
        <div class="p-4 rounded-xl bg-white/3 border border-white/8 mb-8">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ currentPlan?.icon }}</span>
              <span class="text-white font-bold text-sm">Piano {{ currentPlan?.name }}</span>
            </div>
            <span class="text-brand-400 font-bold">€{{ currentPlan?.price }}/mese</span>
          </div>
          <ul class="space-y-1">
            <li
              v-for="feat in currentPlan?.features.filter(f => f.included).slice(0, 3)"
              :key="feat.text"
              class="flex items-center gap-2 text-xs text-slate-500"
            >
              <svg class="w-3 h-3 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {{ feat.text }}
            </li>
          </ul>
        </div>

        <!-- ── STEP 1: Account ──────────────────────────────────────────── -->
        <div v-if="currentStep === 1">
          <h2 class="text-white font-bold text-lg mb-1">Il tuo account</h2>
          <p class="text-slate-500 text-xs mb-6">Crea un account o accedi per continuare.</p>

          <!-- Auth tabs -->
          <div class="flex rounded-xl bg-white/5 p-1 mb-6">
            <button
              v-for="tab in authTabs"
              :key="tab.id"
              class="flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              :class="authTab === tab.id
                ? 'bg-brand-600 text-white shadow'
                : 'text-slate-400 hover:text-white'"
              @click="authTab = tab.id; authStore.error = null"
            >{{ tab.label }}</button>
          </div>

          <!-- Login -->
          <form v-if="authTab === 'login'" @submit.prevent="handleAuthStep">
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
            <p v-if="authStore.error" class="text-red-400 text-xs mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">{{ authStore.error }}</p>
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg v-if="authStore.isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ authStore.isLoading ? 'Accesso…' : 'Accedi e continua →' }}
            </button>
          </form>

          <!-- Register -->
          <form v-else @submit.prevent="handleAuthStep">
            <div class="space-y-4 mb-6">
              <div class="grid grid-cols-2 gap-3">
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
            <p v-if="authStore.error" class="text-red-400 text-xs mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">{{ authStore.error }}</p>
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg v-if="authStore.isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ authStore.isLoading ? 'Creazione account…' : 'Crea account e continua →' }}
            </button>
          </form>
        </div>

        <!-- ── STEP 2: Payment ─────────────────────────────────────────── -->
        <div v-if="currentStep === 2">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
              <span class="text-brand-400 text-xs font-bold">{{ userInitials }}</span>
            </div>
            <div>
              <p class="text-white text-sm font-semibold">{{ authStore.displayName }}</p>
              <p class="text-slate-500 text-xs">{{ authStore.email }}</p>
            </div>
            <button
              class="ml-auto text-slate-600 hover:text-slate-400 text-xs underline"
              @click="currentStep = 1"
            >Cambia</button>
          </div>

          <h2 class="text-white font-bold text-lg mb-1">Pagamento</h2>
          <p class="text-slate-500 text-xs mb-6">Inserisci i dati della carta per attivare il piano.</p>

          <form @submit.prevent="handlePayment">
            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-slate-400 text-xs font-medium mb-1.5">Numero carta</label>
                <input
                  v-model="payForm.card"
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  maxlength="19"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-mono"
                  @input="formatCard"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-slate-400 text-xs font-medium mb-1.5">Scadenza</label>
                  <input
                    v-model="payForm.expiry"
                    type="text"
                    placeholder="MM/AA"
                    maxlength="5"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-mono"
                  />
                </div>
                <div>
                  <label class="block text-slate-400 text-xs font-medium mb-1.5">CVV</label>
                  <input
                    v-model="payForm.cvv"
                    type="text"
                    placeholder="123"
                    maxlength="3"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <p v-if="payError" class="text-red-400 text-xs mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">{{ payError }}</p>

            <button
              type="submit"
              :disabled="payLoading"
              class="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2"
            >
              <svg v-if="payLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ payLoading ? 'Elaborazione…' : `Paga €${currentPlan?.price} e accedi al portale` }}
            </button>
          </form>
        </div>

        <p class="text-center text-slate-600 text-xs mt-6">
          🔒 Pagamento sicuro simulato · Nessun dato reale richiesto
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const route      = useRoute()
const router     = useRouter()
const authStore  = useAuthStore()
const subStore   = useSubscriptionStore()

// ── Plans ─────────────────────────────────────────────────────────────────────
const plans = {
  starter: {
    id: 'starter', icon: '🌱', name: 'Starter', price: '29',
    features: [
      { text: '5.000 richieste API / mese', included: true },
      { text: '1 API key',                  included: true },
      { text: 'Accesso a 2 stazioni',       included: true },
      { text: 'Dati in tempo reale',        included: true },
    ],
  },
  pro: {
    id: 'pro', icon: '🚀', name: 'Pro', price: '99',
    features: [
      { text: '100.000 richieste API / mese', included: true },
      { text: '3 API key',                    included: true },
      { text: 'Tutte le stazioni',            included: true },
      { text: 'Storico 90 giorni',            included: true },
    ],
  },
  enterprise: {
    id: 'enterprise', icon: '🏢', name: 'Enterprise', price: '299',
    features: [
      { text: 'API key illimitate',   included: true },
      { text: 'Richieste illimitate', included: true },
      { text: 'SLA 99.9%',            included: true },
      { text: 'Supporto dedicato',    included: true },
    ],
  },
}

const planId      = computed(() => (route.query.plan as string) || 'pro')
const currentPlan = computed(() => plans[planId.value as keyof typeof plans] ?? plans.pro)

// ── Steps ─────────────────────────────────────────────────────────────────────
const steps = [
  { id: 1, label: 'Account'   },
  { id: 2, label: 'Pagamento' },
]
const currentStep = ref(1)

// ── Auth step ─────────────────────────────────────────────────────────────────
const authTabs: { id: 'register' | 'login'; label: string }[] = [
  { id: 'register', label: 'Nuovo account' },
  { id: 'login',    label: 'Accedi'         },
]
const authTab      = ref<'register' | 'login'>('register')
const loginForm    = ref({ email: '', password: '' })
const registerForm = ref({ firstName: '', lastName: '', email: '', password: '' })

const userInitials = computed(() => {
  const f = authStore.firstName?.[0] ?? ''
  const l = authStore.lastName?.[0]  ?? ''
  return (f + l).toUpperCase() || (authStore.email?.[0]?.toUpperCase() ?? 'U')
})

async function handleAuthStep () {
  if (authTab.value === 'login') {
    if (!loginForm.value.email || !loginForm.value.password) return
    await authStore.login({ email: loginForm.value.email, password: loginForm.value.password })
  } else {
    if (!registerForm.value.email || registerForm.value.password.length < 8) return
    await authStore.register({
      email:     registerForm.value.email,
      password:  registerForm.value.password,
      firstName: registerForm.value.firstName || null,
      lastName:  registerForm.value.lastName  || null,
    })
  }
  if (authStore.isAuthenticated) {
    currentStep.value = 2
  }
}

// ── Payment step ──────────────────────────────────────────────────────────────
const payForm    = ref({ card: '', expiry: '', cvv: '' })
const payLoading = ref(false)
const payError   = ref('')

function formatCard (e: Event) {
  const input = e.target as HTMLInputElement
  payForm.value.card = input.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
}

async function handlePayment () {
  payError.value = ''
  if (payForm.value.card.length < 19 || !payForm.value.expiry || !payForm.value.cvv) {
    payError.value = 'Compila tutti i campi della carta correttamente.'
    return
  }
  payLoading.value = true
  try {
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 1500))
    // Upgrade subscription via real API
    await subStore.upgrade(planId.value, 1)
    router.push('/portal')
  } catch {
    payError.value = subStore.error ?? 'Pagamento fallito. Riprova.'
  } finally {
    payLoading.value = false
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(() => {
  authStore.restoreFromStorage()
  if (authStore.isAuthenticated) {
    currentStep.value = 2
  }
})
</script>

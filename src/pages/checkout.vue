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

      <!-- Card -->
      <div class="rounded-2xl bg-slate-900/80 border border-white/10 p-8 shadow-2xl">

        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">{{ currentPlan?.icon }}</span>
            <h1 class="text-white text-2xl font-black">Piano {{ currentPlan?.name }}</h1>
          </div>
          <p class="text-slate-400 text-sm">Completa il pagamento per ricevere la tua API key.</p>
        </div>

        <!-- Plan summary -->
        <div class="p-4 rounded-xl bg-white/3 border border-white/8 mb-8">
          <div class="flex justify-between items-center mb-3">
            <span class="text-slate-300 text-sm font-medium">{{ currentPlan?.name }}</span>
            <span class="text-white font-bold">€{{ currentPlan?.price }}/mese</span>
          </div>
          <ul class="space-y-1.5">
            <li v-for="feat in currentPlan?.features.filter(f => f.included).slice(0, 4)"
                :key="feat.text"
                class="flex items-center gap-2 text-xs text-slate-400">
              <svg class="w-3 h-3 text-brand-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {{ feat.text }}
            </li>
          </ul>
        </div>

        <!-- Payment form (mock) -->
        <form @submit.prevent="handlePayment">
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-1.5">Nome e Cognome</label>
              <input v-model="form.name" type="text" placeholder="Mario Rossi"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors" />
            </div>
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-1.5">Email</label>
              <input v-model="form.email" type="email" placeholder="mario@esempio.it"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors" />
            </div>
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-1.5">Numero carta</label>
              <input v-model="form.card" type="text" placeholder="4242 4242 4242 4242" maxlength="19"
                     class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-mono"
                     @input="formatCard" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-400 text-xs font-medium mb-1.5">Scadenza</label>
                <input v-model="form.expiry" type="text" placeholder="MM/AA" maxlength="5"
                       class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-mono" />
              </div>
              <div>
                <label class="block text-slate-400 text-xs font-medium mb-1.5">CVV</label>
                <input v-model="form.cvv" type="text" placeholder="123" maxlength="3"
                       class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-colors font-mono" />
              </div>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-red-400 text-xs mb-4">{{ error }}</p>

          <!-- Submit -->
          <button type="submit" :disabled="loading"
                  class="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-brand-500/30 flex items-center justify-center gap-2">
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ loading ? 'Elaborazione…' : `Paga €${currentPlan?.price}` }}
          </button>
        </form>

        <p class="text-center text-slate-600 text-xs mt-4">
          🔒 Pagamento sicuro simulato · Nessun dato reale richiesto
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const route  = useRoute()
const router = useRouter()

const plans = {
  starter: {
    id: 'starter', icon: '🌱', name: 'Starter', price: '29',
    features: [
      { text: '5.000 richieste API / mese',  included: true  },
      { text: '1 API key',                   included: true  },
      { text: 'Accesso a 2 stazioni',        included: true  },
      { text: 'Dati in tempo reale',         included: true  },
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
      { text: 'API key illimitate',     included: true },
      { text: 'Richieste illimitate',   included: true },
      { text: 'SLA 99.9%',              included: true },
      { text: 'Supporto dedicato',      included: true },
    ],
  },
}

const planId     = computed(() => (route.query.plan as string) || 'pro')
const currentPlan = computed(() => plans[planId.value as keyof typeof plans] ?? plans.pro)

const form = ref({ name: '', email: '', card: '', expiry: '', cvv: '' })
const loading = ref(false)
const error   = ref('')

function formatCard (e: Event) {
  const input = e.target as HTMLInputElement
  form.value.card = input.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim()
}

async function handlePayment () {
  error.value = ''
  if (!form.value.name || !form.value.email || form.value.card.length < 19) {
    error.value = 'Compila tutti i campi correttamente.'
    return
  }
  loading.value = true
  // Mock: simulate API call
  await new Promise(r => setTimeout(r, 1800))
  const result = await $fetch('/api/mock/checkout', {
    method: 'POST',
    body: { plan: planId.value, email: form.value.email, name: form.value.name },
  })
  loading.value = false
  router.push(`/dashboard?key=${(result as { apiKey: string }).apiKey}&plan=${planId.value}`)
}
</script>

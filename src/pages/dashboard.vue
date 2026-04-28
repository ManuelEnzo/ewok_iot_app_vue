<template>
  <div class="min-h-screen bg-deep-900 py-20 px-4">
    <div class="max-w-4xl mx-auto">

      <!-- Header -->
      <div class="flex items-center justify-between mb-10">
        <div>
          <NuxtLink to="/" class="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-3 transition-colors">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </NuxtLink>
          <h1 class="text-white text-3xl font-black">Dashboard API</h1>
          <p class="text-slate-400 text-sm mt-1">Gestisci la tua API key e monitora l'utilizzo.</p>
        </div>
        <span class="px-3 py-1.5 rounded-full text-xs font-bold uppercase border"
              :class="planBadge.class">
          Piano {{ planLabel }}
        </span>
      </div>

      <!-- Success banner -->
      <div v-if="isNewAccount" class="mb-8 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-start gap-4">
        <div class="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p class="text-brand-300 font-semibold text-sm">Pagamento completato con successo!</p>
          <p class="text-slate-400 text-xs mt-0.5">La tua API key è stata generata. Conservala in un posto sicuro.</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-8">

        <!-- API Key card -->
        <div class="md:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-white font-semibold">La tua API Key</h2>
            <span class="flex items-center gap-1.5 text-xs text-emerald-400">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Attiva
            </span>
          </div>

          <div class="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-sm mb-4">
            <span class="flex-1 text-slate-300 truncate select-all">
              {{ keyVisible ? apiKey : maskedKey }}
            </span>
            <button @click="keyVisible = !keyVisible"
                    class="text-slate-500 hover:text-white transition-colors flex-shrink-0" title="Mostra/Nascondi">
              <svg v-if="!keyVisible" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
            <button @click="copyKey"
                    class="text-slate-500 hover:text-white transition-colors flex-shrink-0" :title="copied ? 'Copiato!' : 'Copia'">
              <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

          <button @click="regenerateKey"
                  class="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rigenera API key (la precedente verrà invalidata)
          </button>
        </div>

        <!-- Stats cards -->
        <div v-for="stat in stats" :key="stat.label"
             class="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
          <p class="text-slate-400 text-xs mb-1">{{ stat.label }}</p>
          <p class="text-white text-2xl font-black font-mono">{{ stat.value }}</p>
          <p class="text-slate-600 text-xs mt-1">{{ stat.sub }}</p>
        </div>
      </div>

      <!-- API docs quick ref -->
      <div class="p-6 rounded-2xl bg-slate-900/80 border border-white/10">
        <h2 class="text-white font-semibold mb-4">Utilizzo API</h2>

        <div class="space-y-4">
          <div v-for="endpoint in endpoints" :key="endpoint.path">
            <div class="flex items-center gap-3 mb-2">
              <span class="px-2 py-0.5 rounded text-xs font-bold font-mono"
                    :class="endpoint.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-tech-500/10 text-tech-400'">
                {{ endpoint.method }}
              </span>
              <code class="text-slate-300 text-sm">{{ endpoint.path }}</code>
              <span class="text-slate-500 text-xs">— {{ endpoint.desc }}</span>
            </div>
            <div class="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-400 overflow-x-auto">
              <span class="text-slate-600">curl </span>
              <span class="text-slate-300">https://api.ewok-iot.it{{ endpoint.path }}</span>
              <span class="text-brand-400"> \<br/>  -H </span>
              <span class="text-yellow-500">"Authorization: Bearer {{ keyVisible ? apiKey : '••••••••••••' }}"</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute()

const apiKey      = ref((route.query.key as string) || 'ewk_live_mock1234567890abcdef')
const planId      = ref((route.query.plan as string) || 'pro')
const isNewAccount = computed(() => !!route.query.key)
const keyVisible  = ref(false)
const copied      = ref(false)

const maskedKey = computed(() =>
  apiKey.value.slice(0, 8) + '••••••••••••••••' + apiKey.value.slice(-4)
)

const planLabel = computed(() =>
  ({ starter: 'Starter', pro: 'Pro', enterprise: 'Enterprise' })[planId.value] ?? 'Pro'
)

const planBadge = computed(() => ({
  starter:    { class: 'bg-slate-500/10 border-slate-500/30 text-slate-400' },
  pro:        { class: 'bg-brand-500/10 border-brand-500/30 text-brand-400' },
  enterprise: { class: 'bg-tech-500/10 border-tech-500/30 text-tech-400' },
}[planId.value] ?? { class: 'bg-brand-500/10 border-brand-500/30 text-brand-400' }))

const stats = [
  { label: 'Richieste questo mese', value: '1.247',  sub: 'di 5.000 incluse nel piano' },
  { label: 'Ultima chiamata API',   value: 'adesso', sub: 'GET /api/cells' },
  { label: 'Stazioni accessibili',  value: '6',      sub: 'in Veneto' },
  { label: 'Key generata il',       value: new Date().toLocaleDateString('it-IT'), sub: 'scade tra 30 giorni' },
]

const endpoints = [
  { method: 'GET', path: '/api/cells',          desc: 'Lista tutte le celle IoT'           },
  { method: 'GET', path: '/api/cells/:id',       desc: 'Dati di una cella specifica'        },
  { method: 'GET', path: '/api/cells/:id/readings', desc: 'Storico letture di una cella'   },
]

function copyKey () {
  navigator.clipboard.writeText(apiKey.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function regenerateKey () {
  if (!confirm('Sei sicuro? La chiave attuale verrà invalidata immediatamente.')) return
  apiKey.value = 'ewk_live_' + Math.random().toString(36).slice(2, 18)
}
</script>

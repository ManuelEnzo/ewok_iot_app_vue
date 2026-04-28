<template>
  <section id="prezzi" class="py-24 bg-gradient-to-b from-slate-950 to-deep-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-16">
        <span class="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
          API Access
        </span>
        <h2 class="text-4xl sm:text-5xl font-black text-white mb-4">
          Accedi ai Dati.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-tech-400">Scegli il tuo Piano.</span>
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Dopo il pagamento riceverai una <strong class="text-slate-300">API key personale</strong> per
          integrare i dati ambientali EwokIoT nelle tue applicazioni.
        </p>
      </div>

      <!-- Plans grid -->
      <div class="grid md:grid-cols-3 gap-8 items-stretch">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="relative flex flex-col rounded-2xl border transition-all duration-300"
          :class="plan.featured
            ? 'bg-gradient-to-b from-brand-900/40 to-brand-950/40 border-brand-500/40 shadow-2xl shadow-brand-500/10 scale-105'
            : 'bg-white/3 border-white/10 hover:border-white/20'"
        >
          <!-- Popular badge -->
          <div v-if="plan.featured" class="absolute -top-4 left-1/2 -translate-x-1/2">
            <span class="px-4 py-1 rounded-full bg-brand-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              Più Popolare
            </span>
          </div>

          <div class="p-8 flex flex-col flex-1">
            <!-- Plan name + icon -->
            <div class="flex items-center gap-3 mb-2">
              <span class="text-2xl">{{ plan.icon }}</span>
              <h3 class="text-white font-bold text-xl">{{ plan.name }}</h3>
            </div>
            <p class="text-slate-400 text-sm mb-6">{{ plan.description }}</p>

            <!-- Price -->
            <div class="mb-8">
              <div class="flex items-end gap-1">
                <span class="text-slate-400 text-lg">€</span>
                <span class="text-5xl font-black text-white">{{ plan.price }}</span>
                <span class="text-slate-400 text-sm mb-1">/{{ plan.period }}</span>
              </div>
              <p class="text-slate-500 text-xs mt-1">{{ plan.billing }}</p>
            </div>

            <!-- Features -->
            <ul class="space-y-3 mb-8 flex-1">
              <li v-for="feat in plan.features" :key="feat.text"
                  class="flex items-start gap-3 text-sm"
                  :class="feat.included ? 'text-slate-300' : 'text-slate-600'">
                <svg v-if="feat.included" class="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {{ feat.text }}
              </li>
            </ul>

            <!-- CTA -->
            <NuxtLink
              :to="`/checkout?plan=${plan.id}`"
              class="block w-full text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200"
              :class="plan.featured
                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg hover:shadow-brand-500/30'
                : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white'"
            >
              {{ plan.cta }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Bottom note -->
      <p class="text-center text-slate-500 text-sm mt-12">
        Tutti i piani includono una <strong class="text-slate-400">API key univoca</strong> generata automaticamente dopo il pagamento.
        Nessun rinnovo automatico senza consenso.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const plans = [
  {
    id: 'starter',
    icon: '🌱',
    name: 'Starter',
    description: 'Per sviluppatori e piccoli progetti personali.',
    price: '29',
    period: 'mese',
    billing: 'Fatturato mensilmente',
    featured: false,
    cta: 'Inizia ora',
    features: [
      { text: '5.000 richieste API / mese',          included: true  },
      { text: '1 API key',                            included: true  },
      { text: 'Accesso a 2 stazioni',                 included: true  },
      { text: 'Dati in tempo reale',                  included: true  },
      { text: 'Storico 7 giorni',                     included: true  },
      { text: 'Storico 90 giorni',                    included: false },
      { text: 'Webhook personalizzati',               included: false },
      { text: 'Supporto prioritario',                 included: false },
    ],
  },
  {
    id: 'pro',
    icon: '🚀',
    name: 'Pro',
    description: 'Per aziende e applicazioni in produzione.',
    price: '99',
    period: 'mese',
    billing: 'Fatturato mensilmente',
    featured: true,
    cta: 'Attiva Pro',
    features: [
      { text: '100.000 richieste API / mese',         included: true  },
      { text: '3 API key',                            included: true  },
      { text: 'Accesso a tutte le stazioni',          included: true  },
      { text: 'Dati in tempo reale',                  included: true  },
      { text: 'Storico 90 giorni',                    included: true  },
      { text: 'Webhook personalizzati',               included: true  },
      { text: 'Dashboard analitica avanzata',         included: true  },
      { text: 'Supporto prioritario',                 included: false },
    ],
  },
  {
    id: 'enterprise',
    icon: '🏢',
    name: 'Enterprise',
    description: 'Per enti pubblici e grandi integrazioni.',
    price: '299',
    period: 'mese',
    billing: 'Fatturato annualmente (sconto 20%)',
    featured: false,
    cta: 'Contattaci',
    features: [
      { text: 'Richieste API illimitate',             included: true  },
      { text: 'API key illimitate',                   included: true  },
      { text: 'Accesso a tutte le stazioni',          included: true  },
      { text: 'Dati in tempo reale',                  included: true  },
      { text: 'Storico illimitato',                   included: true  },
      { text: 'Webhook personalizzati',               included: true  },
      { text: 'SLA garantito 99.9%',                  included: true  },
      { text: 'Supporto prioritario dedicato',        included: true  },
    ],
  },
]
</script>

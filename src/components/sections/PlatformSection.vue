<template>
  <section id="piattaforma" class="py-24 bg-deep-900" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-16 transition-all duration-700"
           :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
        <span class="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
          La Piattaforma
        </span>
        <h2 class="text-4xl sm:text-5xl font-black text-white mb-4">
          Dati Ambientali.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-tech-400">Decisioni Intelligenti.</span>
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          EwokIoT fornisce infrastruttura IoT chiavi in mano per enti pubblici, aziende e consorzi
          che vogliono misurare la qualità dell'ambiente con precisione scientifica.
        </p>
      </div>

      <!-- Feature grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        <div
          v-for="(feature, idx) in features"
          :key="feature.title"
          class="p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-300 group"
          :style="{ transitionDelay: `${idx * 80}ms` }"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
               :class="feature.iconBg">
            {{ feature.icon }}
          </div>
          <h3 class="text-white font-semibold text-lg mb-2 group-hover:text-brand-300 transition-colors">
            {{ feature.title }}
          </h3>
          <p class="text-slate-400 text-sm leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>

      <!-- Value proposition -->
      <div class="grid lg:grid-cols-2 gap-12 items-center">

        <div class="transition-all duration-700 delay-200"
             :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'">
          <h3 class="text-3xl font-black text-white mb-6">
            Perché scegliere <span class="text-brand-400">EwokIoT</span>?
          </h3>
          <ul class="space-y-4">
            <li v-for="point in valuePoints" :key="point.title"
                class="flex gap-4 p-4 rounded-xl hover:bg-white/3 transition-colors">
              <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 class="text-white font-medium mb-1">{{ point.title }}</h4>
                <p class="text-slate-400 text-sm">{{ point.desc }}</p>
              </div>
            </li>
          </ul>
        </div>

        <!-- Clients/use cases -->
        <div class="transition-all duration-700 delay-300"
             :class="isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'">
          <div class="p-6 rounded-2xl bg-slate-900/60 border border-white/8 backdrop-blur-sm">
            <h4 class="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Ideale per</h4>
            <div class="space-y-3">
              <div v-for="client in clientTypes" :key="client.type"
                   class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                <div class="text-2xl">{{ client.icon }}</div>
                <div>
                  <div class="text-white font-medium text-sm">{{ client.type }}</div>
                  <div class="text-slate-400 text-xs">{{ client.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const { isVisible, target: sectionRef } = useIntersectionObserver(0.1)

const features = [
  {
    icon: '📡', iconBg: 'bg-tech-600/20',
    title: 'Connettività Multi-Standard',
    desc:  'WiFi e LoRa P2P per copertura in aree urbane e remote. Architettura ridondante e fail-safe.',
  },
  {
    icon: '🌡️', iconBg: 'bg-brand-600/20',
    title: '30+ Parametri Ambientali',
    desc:  'Temperatura, CO₂, TVOC, PM2.5/PM10, NO₂, O₃, UV, pressione, punto di rugiada e molto altro.',
  },
  {
    icon: '⚡', iconBg: 'bg-yellow-600/20',
    title: 'Dati in Tempo Reale',
    desc:  'Aggiornamento continuo con latenza minima. Dashboard live con grafici e alert automatici.',
  },
  {
    icon: '🗺️', iconBg: 'bg-purple-600/20',
    title: 'Mappa Interattiva',
    desc:  'Visualizzazione geografica di tutte le celle attive con stato in tempo reale e dettaglio per area.',
  },
  {
    icon: '🔋', iconBg: 'bg-emerald-600/20',
    title: 'Monitoraggio Batteria',
    desc:  'Stato energetico di ogni sensore, tensione e percentuale. Alert automatici per sostituzione.',
  },
  {
    icon: '📊', iconBg: 'bg-orange-600/20',
    title: 'Reportistica Avanzata',
    desc:  'Export dati, medie orarie/giornaliere/mensili, indici aggregati e comparativa tra aree.',
  },
]

const valuePoints = [
  { title: 'Installazione chiavi in mano',  desc: 'Dalla progettazione al deployment: nessuna competenza tecnica richiesta.' },
  { title: 'Dashboard white-label',         desc: 'Personalizzabile con il brand del cliente per rivendita e PA.' },
  { title: 'API REST aperte',               desc: 'Integrazione con sistemi esistenti, SCADA, BMS e piattaforme cloud.' },

]

const clientTypes = [
  { icon: '🏛️', type: 'Pubblica Amministrazione', desc: 'Comuni, Province, ARPA – monitoraggio qualità aria cittadina' },
  { icon: '🏭', type: 'Industria e Logistica',    desc: 'Capannoni, magazzini – sicurezza e compliance ambientale' },
  { icon: '🏨', type: 'Turismo & Ospitalità',     desc: 'Hotel, resort – valorizzare la qualità ambientale percepita' },
  { icon: '🌳', type: 'Parchi & Aree Protette',  desc: 'Monitoraggio ecosistemi naturali e zone montane' },
]
</script>

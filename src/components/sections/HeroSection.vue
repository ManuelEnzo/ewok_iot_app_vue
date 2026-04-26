<template>
  <section class="relative min-h-screen flex flex-col justify-center overflow-hidden bg-deep-900">

    <!-- Animated grid background -->
    <div class="absolute inset-0 opacity-20" aria-hidden="true">
      <div class="absolute inset-0"
           style="background-image: linear-gradient(rgba(44,138,66,0.15) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(44,138,66,0.15) 1px, transparent 1px);
                  background-size: 60px 60px;">
      </div>
    </div>

    <!-- Glow blobs -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none animate-float"></div>
    <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-tech-700/10 rounded-full blur-3xl pointer-events-none" style="animation: float 8s ease-in-out infinite 2s;"></div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
      <div class="grid lg:grid-cols-2 gap-16 items-center">

        <!-- Left: Text -->
        <div class="animate-fade-in">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow"></span>
            <span class="text-brand-400 text-xs font-semibold uppercase tracking-wider">IoT Environmental Monitoring</span>
          </div>

          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6">
            Monitora<br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">l'Ambiente</span><br/>
            in Tempo Reale
          </h1>

          <p class="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-xl mb-8">
            EwokIoT distribuisce reti di sensori intelligenti sul territorio veneto.
            Qualità dell'aria, inquinanti, microclima — tutti i dati disponibili
            <strong class="text-slate-300">24/7</strong> da un'unica piattaforma.
          </p>

          <!-- Stats pills -->
          <div class="flex flex-wrap gap-4 mb-10">
            <div v-for="stat in stats" :key="stat.label"
                 class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span class="text-2xl font-black text-white">{{ stat.value }}</span>
              <span class="text-slate-400 text-sm">{{ stat.label }}</span>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-4">
            <button
               class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-lg hover:shadow-brand-500/30 transition-all duration-200 group"
               @click="scrollToSection('mappa')">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Vedi Mappa Live
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
               class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold transition-all duration-200"
               @click="scrollToSection('piattaforma')">
              Scopri la Piattaforma
            </button>
          </div>
        </div>

        <!-- Right: Live preview card -->
        <div class="animate-slide-up">
          <div class="relative">

            <!-- Main card -->
            <div class="rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md p-6 shadow-2xl">
              <div class="flex items-center justify-between mb-5">
                <div>
                  <h3 class="text-white font-semibold text-sm">Dashboard Live</h3>
                  <p class="text-slate-400 text-xs mt-0.5">Jesolo – Centro, VE</p>
                </div>
                <LiveIndicator :last-sync="store.lastSync" />
              </div>

              <!-- Mini metrics grid -->
              <div class="grid grid-cols-2 gap-3 mb-5">
                <MetricWidget
                  v-for="metric in heroMetrics"
                  :key="metric.label"
                  v-bind="metric"
                />
              </div>

              <!-- Air quality bar -->
              <div class="p-3 rounded-xl border"
                   :class="currentAQInfo.bgColor + ' border-white/5'">
                <div class="flex items-center justify-between">
                  <span class="text-slate-400 text-xs">Qualità Aria Indoor</span>
                  <span class="font-semibold text-sm" :class="currentAQInfo.color">{{ currentAQInfo.label }}</span>
                </div>
                <div class="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                       :style="{ width: aqBarWidth }"></div>
                </div>
              </div>
            </div>

            <!-- Floating mini badges -->
            <div class="absolute -top-4 -right-4 px-3 py-2 rounded-xl bg-tech-600/20 border border-tech-500/30 backdrop-blur-sm">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-tech-400 animate-pulse"></span>
                <span class="text-tech-300 text-xs font-medium">WiFi + LoRa P2P</span>
              </div>
            </div>
            <div class="absolute -bottom-4 -left-4 px-3 py-2 rounded-xl bg-brand-600/20 border border-brand-500/30 backdrop-blur-sm">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
                <span class="text-brand-300 text-xs font-medium">6 celle attive</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span class="text-slate-500 text-xs">Scorri</span>
      <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIoTStore } from '@/store/iot'
import { IoTDataService } from '@/services/IoTDataService'
import LiveIndicator from '@/components/ui/LiveIndicator.vue'
import MetricWidget  from '@/components/ui/MetricWidget.vue'

const store = useIoTStore()

function scrollToSection (id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const firstCell = computed(() => store.cells[0] ?? null)
const reading   = computed(() => firstCell.value?.lastReading ?? null)

const heroMetrics = computed(() => {
  const r = reading.value
  if (!r) return []
  return [
    { label: 'Temperatura', value: r.Temperature, unit: '°C', icon: '🌡️' },
    { label: 'Umidità',     value: r.Humidity,    unit: '%',  icon: '💧' },
    { label: 'CO₂',         value: r.CO2,         unit: 'ppm', icon: '🌫️', decimals: 0 },
    { label: 'PM2.5',       value: r.PM25,        unit: 'µg/m³', icon: '🔬' },
  ]
})

const currentAQInfo = computed(() => {
  const iaq = reading.value?.IndoorAirQuality ?? 75
  return IoTDataService.getAirQualityInfo(iaq)
})

const aqBarWidth = computed(() => {
  const iaq = reading.value?.IndoorAirQuality ?? 75
  return `${Math.max(5, 100 - (iaq / 500) * 100)}%`
})

const stats = [
  { value: '6',   label: 'Celle attive' },
  { value: '30+', label: 'Parametri' },
  { value: '24/7', label: 'Monitoraggio' },
]
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useIoTStore } from '@/store/iot'
import LiveIndicator from '@/components/ui/LiveIndicator.vue'
import MetricWidget from '@/components/ui/MetricWidget.vue'

// Mapping dei colori AQI spostato correttamente nello script setup
const AQI_COLORS: Record<string, string> = {
  'Good': 'text-green-500',
  'Moderate': 'text-yellow-500',
  'Unhealthy for Sensitive Groups': 'text-orange-400',
  'Unhealthy': 'text-red-500',
  'Very Unhealthy': 'text-purple-500',
  'Hazardous': 'text-gray-700',
}

const store = useIoTStore()

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const firstCell = computed(() => store.cells[0] ?? null)
const reading = computed(() => firstCell.value?.lastReading ?? null)

const heroMetrics = computed(() => {
  const r = reading.value
  if (!r) return []
  return [
    { label: 'Temperatura', value: r.Temperature, unit: '°C', icon: '🌡️' },
    { label: 'Umidità', value: r.Humidity, unit: '%', icon: '💧' },
    { label: 'CO₂', value: r.CO2, unit: 'ppm', icon: '🌫️', decimals: 0 },
    { label: 'PM2.5', value: r.PM25, unit: 'µg/m³', icon: '🔬' },
  ]
})

const currentAQLabel = computed(() => reading.value?.IndoorAirQualityInterpreted ?? '-')
const currentAQColor = computed(() => {
  const key = reading.value?.IndoorAirQualityInterpreted
  return key && AQI_COLORS[key] ? AQI_COLORS[key] : 'text-slate-300'
})

const stats = [
  { value: '6', label: 'Celle attive' },
  { value: '30+', label: 'Parametri' },
  { value: '24/7', label: 'Monitoraggio' },
]
</script>

<template>
  <section class="relative min-h-screen flex flex-col justify-center overflow-hidden bg-slate-950 text-white">

    <!-- Background decorativo -->
    <div class="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(44,138,66,0.15) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(44,138,66,0.15) 1px, transparent 1px);
                  background-size: 60px 60px;">
      </div>
    </div>

    <!-- Glow Effects -->
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse">
    </div>
    <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-700/10 rounded-full blur-[100px] pointer-events-none">
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">

        <!-- Left: Testi e CTA -->
        <div class="space-y-8">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Monitoraggio Ambientale Real-time
          </div>

          <h1 class="text-5xl lg:text-6xl font-bold leading-tight">
            Rendi visibile l'aria <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
              che respiri.
            </span>
          </h1>

          <p class="text-slate-400 text-lg max-w-lg">
            Sistema avanzato di monitoraggio IoT per la qualità dell'aria. Dati precisi,
            analisi istantanea e integrazione LoRaP2P per una copertura totale.
          </p>

          <div class="flex flex-wrap gap-4">
            <button
              class="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-lg shadow-emerald-900/20">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Vedi Mappa Live
            </button>
            <button @click="scrollToSection('piattaforma')"
              class="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all">
              Scopri di più
            </button>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
            <div v-for="stat in stats" :key="stat.label">
              <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
              <div class="text-sm text-slate-500">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- Right: Live Preview Card -->
        <div class="relative lg:ml-auto">
          <div
            class="relative z-10 w-full max-w-md rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h3 class="text-white font-bold text-lg">Dashboard Live</h3>
                <p class="text-slate-400 text-sm">Jesolo – Centro, VE</p>
              </div>
              <LiveIndicator :last-sync="store.lastSync" />
            </div>

            <!-- Metrics Grid -->
            <div class="grid grid-cols-2 gap-4 mb-8">
              <MetricWidget v-for="metric in heroMetrics" :key="metric.label" v-bind="metric" />
            </div>

            <!-- AQI Indicator -->
            <div class="p-4 rounded-2xl bg-white/5 border border-white/5">
              <div class="flex items-center justify-between">
                <span class="text-slate-400 text-sm font-medium">IAQ Index</span>
                <span class="font-bold px-3 py-1 rounded-lg bg-white/5" :class="currentAQColor">
                  {{ currentAQLabel }}
                </span>
              </div>
            </div>

            <!-- Floating Badges -->
            <div
              class="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 backdrop-blur-md shadow-xl">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span class="text-blue-300 text-xs font-bold uppercase tracking-wider">LoRaP2P</span>
              </div>
            </div>
          </div>

          <!-- Decorative Glow behind card -->
          <div class="absolute inset-0 bg-emerald-500/20 blur-[80px] -z-10 rounded-full"></div>
        </div>

      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
      <span class="text-[10px] uppercase tracking-widest font-bold">Scorri</span>
      <svg class="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7-7-7" />
      </svg>
    </div>

  </section>
</template>

<style scoped>
@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>
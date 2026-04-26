<template>
  <section id="dashboard" class="py-24 bg-slate-950" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div class="transition-all duration-700" :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
          <span class="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Dashboard Preview
          </span>
          <h2 class="text-4xl sm:text-5xl font-black text-white">
            Tutti i Dati, <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Una Sola Vista</span>
          </h2>
        </div>
        <LiveIndicator :last-sync="store.lastSync" />
      </div>

      <!-- Global stats bar -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10" v-if="store.globalStats">
        <div v-for="gs in globalStatCards" :key="gs.label"
             class="p-4 rounded-2xl bg-white/3 border border-white/8 flex flex-col gap-1 transition-all duration-700"
             :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
          <span class="text-slate-400 text-xs uppercase tracking-wider">{{ gs.label }}</span>
          <span class="text-white font-black text-3xl font-mono">{{ gs.value }}</span>
          <span class="text-slate-500 text-xs">{{ gs.desc }}</span>
        </div>
      </div>

      <!-- Area cards -->
      <div class="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div
          v-for="(group, idx) in store.areaGroups"
          :key="group.id"
          class="rounded-2xl bg-slate-900/70 border border-white/8 overflow-hidden hover:border-brand-500/30 hover:shadow-2xl transition-all duration-300"
          :style="{ transitionDelay: `${idx * 80}ms` }"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <!-- Card header -->
          <div class="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <div class="text-white font-semibold text-sm">{{ group.name }}</div>
              <div class="text-slate-500 text-xs mt-0.5">{{ group.province }} · {{ group.cells.length }} celle</div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <div class="flex gap-1">
                <span
                  v-for="cell in group.cells" :key="cell.id"
                  class="w-2 h-2 rounded-full"
                  :class="cell.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'"
                  :title="cell.name"
                ></span>
              </div>
            </div>
          </div>

          <!-- Metrics for first cell of area -->
          <div v-if="group.cells[0]?.lastReading as IoTReading | null" class="p-5">
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div v-for="m in getCellMetrics(group.cells[0])" :key="m.label"
                   class="p-2.5 rounded-xl bg-white/3">
                <div class="text-slate-500 text-xs mb-1">{{ m.label }}</div>
                <div class="text-white font-bold font-mono text-lg leading-none">
                  {{ m.value }}<span class="text-slate-400 text-xs ml-1">{{ m.unit }}</span>
                </div>
              </div>
            </div>

            <!-- IAQ bar -->
            <div class="p-3 rounded-xl border"
                 :class="getAQInfo(group.cells[0]).bgColor + ' border-white/5'">
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="text-slate-400">Qualità aria</span>
                <span class="font-semibold" :class="getAQInfo(group.cells[0]).color">
                  {{ getAQInfo(group.cells[0]).label }}
                </span>
              </div>
              <MetricBar
                label=""
                :value="group.cells[0].lastReading!.IndoorAirQuality"
                :max="500"
                unit="IAQ"
                color-scheme="brand"
              />
            </div>

            <!-- Battery -->
            <div class="mt-3 flex items-center justify-between text-xs">
              <span class="text-slate-500">Batteria</span>
              <div class="flex items-center gap-1.5">
                <div class="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div class="h-full rounded-full bg-emerald-400 transition-all"
                       :style="{ width: group.cells[0].lastReading!.BatteryPercent + '%' }"></div>
                </div>
                <span class="text-slate-400 font-mono">{{ group.cells[0].lastReading!.BatteryPercent.toFixed(0) }}%</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useIoTStore } from '@/store/iot'
import { IoTDataService } from '@/services/IoTDataService'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'
import type { IoTCell, IoTReading } from '@/models/iot'
import LiveIndicator from '@/components/ui/LiveIndicator.vue'
import MetricBar     from '@/components/ui/MetricBar.vue'

const store = useIoTStore()
const { isVisible, target: sectionRef } = useIntersectionObserver(0.05)

const globalStatCards = computed(() => {
  const gs = store.globalStats
  if (!gs) return []
  return [
    { label: 'Temperatura media', value: `${gs.avgTemperature}°`,  desc: 'su tutte le celle attive' },
    { label: 'CO₂ media',         value: `${gs.avgCO2}`,           desc: 'ppm' },
    { label: 'PM2.5 medio',       value: `${gs.avgPM25}`,          desc: 'µg/m³' },
    { label: 'Celle attive',      value: `${gs.activeCells}/${gs.totalCells}`, desc: 'in questo momento' },
  ]
})

function getCellMetrics (cell: IoTCell) {
  const r = cell.lastReading
  if (!r) return []
  return [
    { label: 'Temperatura', value: r.Temperature.toFixed(1), unit: '°C' },
    { label: 'Umidità',     value: r.Humidity.toFixed(1),    unit: '%' },
    { label: 'CO₂',         value: r.CO2.toFixed(0),         unit: 'ppm' },
    { label: 'PM2.5',       value: r.PM25.toFixed(1),        unit: 'µg/m³' },
  ]
}

function getAQInfo (cell: IoTCell) {
  return IoTDataService.getAirQualityInfo(cell.lastReading?.IndoorAirQuality ?? 100)
}
</script>

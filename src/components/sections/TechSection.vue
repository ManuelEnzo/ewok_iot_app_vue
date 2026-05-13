<template>
  <section id="tecnologie" class="py-24 bg-deep-900" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-16 transition-all duration-700"
           :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
        <span class="inline-block px-3 py-1 rounded-full bg-tech-500/10 border border-tech-500/20 text-tech-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Stack Tecnologico
        </span>
        <h2 class="text-4xl sm:text-5xl font-black text-white mb-4">
          Tecnologie <span class="text-transparent bg-clip-text bg-gradient-to-r from-tech-400 to-brand-400">Collaudate</span>
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Ogni componente della piattaforma è selezionato per massima affidabilità,
          sicurezza e scalabilità in ambienti industriali e urbani.
        </p>
      </div>

      <!-- Connectivity protocols -->
      <div class="grid md:grid-cols-2 gap-8 mb-20">
        <div
          v-for="(proto, idx) in protocols"
          :key="proto.name"
          class="p-8 rounded-2xl border transition-all duration-500"
          :class="[proto.borderClass, isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
          :style="{ transitionDelay: `${idx * 150}ms` }"
        >
          <div class="flex items-center gap-4 mb-5">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                 :class="proto.iconBg">
              {{ proto.icon }}
            </div>
            <div>
              <h3 class="text-white font-bold text-xl">{{ proto.name }}</h3>
              <p class="text-slate-400 text-sm">{{ proto.subtitle }}</p>
            </div>
          </div>
          <p class="text-slate-400 leading-relaxed mb-5">{{ proto.desc }}</p>
          <ul class="space-y-2">
            <li v-for="spec in proto.specs" :key="spec"
                class="flex items-center gap-2 text-sm text-slate-300">
              <svg class="w-4 h-4 flex-shrink-0" :class="proto.checkColor"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {{ spec }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Sensor types -->
      <div class="mb-16">
        <h3 class="text-center text-white font-bold text-2xl mb-8">Sensori Impiegati</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="sensor in sensors" :key="sensor.name"
               class="p-5 rounded-xl bg-white/3 border border-white/8 hover:border-brand-500/20 transition-all duration-300 flex gap-4 items-start">
            <div class="text-2xl mt-0.5">{{ sensor.icon }}</div>
            <div>
              <div class="text-white font-semibold text-sm mb-1">{{ sensor.name }}</div>
              <div class="text-slate-400 text-xs leading-relaxed">{{ sensor.measures }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data model preview -->
      <div class="p-6 rounded-2xl bg-slate-900/60 border border-white/8 backdrop-blur-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <svg class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4 8 4m0 0c4.418 0 8-1.79 8-4" />
            </svg>
          </div>
          <div>
            <h4 class="text-white font-semibold text-sm">Schema Dati – Ogni Lettura</h4>
            <p class="text-slate-500 text-xs">Struttura JSON inviata da ogni cella IoT</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <pre class="text-xs text-slate-300 font-mono leading-relaxed bg-deep-900/60 p-4 rounded-xl border border-white/5">{{ dataSchemaPreview }}</pre>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const { isVisible, target: sectionRef } = useIntersectionObserver(0.1)

const protocols = [
  {
    name:       'WiFi 802.11 b/g/n',
    subtitle:   'Connettività urbana ad alta velocità',
    icon:       '📶',
    iconBg:     'bg-tech-600/20',
    borderClass:'bg-tech-900/10 border-tech-500/20',
    checkColor: 'text-tech-400',
    desc:       'Ideale per aree urbane densificate, edifici industriali e zone con infrastruttura di rete esistente. Garantisce alta larghezza di banda per trasmissione dati ad alta frequenza.',
    specs: [
      'Frequenza 2.4 GHz / 5 GHz',
      'Portata fino a 100m indoor',
      'OTA firmware update',
      'Crittografia WPA3',
      'Integrazione con router LTE',
    ],
  },
  {
    name:       'LoRa P2P',
    subtitle:   'Connettività a lungo raggio low-power',
    icon:       '📡',
    iconBg:     'bg-brand-600/20',
    borderClass:'bg-brand-900/10 border-brand-500/20',
    checkColor: 'text-brand-400',
    desc:       'Perfetto per aree remote, montagna e zone senza copertura WiFi. Consumi minimi per deployment a batteria con autonomia pluriannuale. Topologia point-to-point o mesh.',
    specs: [
      'Portata fino a 5 km in campo aperto',
      'Consumi < 50mA in trasmissione',
      'Frequenza 868 MHz (EU band)',
      'Crittografia AES-128',
      'Autonomia batteria 3-5 anni',
    ],
  },
]

const sensors = [
  { icon: '🌡️', name: 'BME680 / BME688',  measures: 'Temperatura, umidità, pressione, gas VOC (TVOC, Etanolo)' },
  { icon: '💨', name: 'SCD41 / SCD40',    measures: 'CO₂ fotoascoustico a infrarosso, temperatura, umidità compensata' },
  { icon: '🔬', name: 'SEN55 / SPS30',    measures: 'PM1.0, PM2.5, PM4.0, PM10, NOx Index, VOC Index' },
  { icon: '☣️', name: 'MiCS-6814 / NO2',  measures: 'NO₂, NH₃, CO, CH₄ – rilevazione gas tossici' },
  { icon: '🌞', name: 'UV Sensor VEML',   measures: 'Indice UV-A, UV-B, Lux ambientale' },
  { icon: '🔋', name: 'BMS / INA219',     measures: 'Tensione batteria, corrente, % residua – power management' },
]

const dataSchemaPreview = `{
  "id": "JES-01",
  "Unit": "EWOK-JES-01",
  "SensorType": "SEN55",
  "MarkerDate": "2026-04-26T14:32:10.000Z",
  "Area": "Jesolo",
  "Sector": "Lungomare",
  "Temperature": 22.4,
  "Humidity": 61.2,
  "IndoorAirQuality": 87,
  "IndoorAirQualityInterpreted": "Buona",
  "CO2": 612,
  "TVOC": 124,
  "PM25": 8.3,
  "PM10": 14.1,
  "NO2": 42.1,
  "O3": 38.5,
  "BatteryPercent": 92,
  "SignalPower": -68
}`
</script>

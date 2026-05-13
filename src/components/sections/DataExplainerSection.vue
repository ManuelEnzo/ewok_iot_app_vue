<template>
  <section class="py-24 bg-gradient-to-b from-slate-950 to-deep-900" ref="sectionRef">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-16 transition-all duration-700"
           :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'">
        <span class="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Glossario Scientifico
        </span>
        <h2 class="text-4xl sm:text-5xl font-black text-white mb-4">
          Cosa <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-brand-400">Monitoriamo</span>
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Ogni parametro ha un impatto diretto sulla salute, sulla produttività e sulla qualità della vita.
          Conoscere i dati significa poter intervenire.
        </p>
      </div>

      <!-- Parameters grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="(param, idx) in parameters"
          :key="param.name"
          class="p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-purple-500/20 hover:bg-purple-500/3 transition-all duration-300"
          :style="{ transitionDelay: `${idx * 60}ms` }"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="text-2xl">{{ param.icon }}</div>
            <div>
              <div class="text-white font-semibold text-sm">{{ param.name }}</div>
              <div class="text-slate-500 text-xs font-mono">{{ param.unit }}</div>
            </div>
            <div class="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold"
                 :class="param.riskColor">{{ param.risk }}</div>
          </div>
          <p class="text-slate-400 text-xs leading-relaxed">{{ param.desc }}</p>
          <div class="mt-3 pt-3 border-t border-white/5 text-xs text-slate-500">
            <span class="text-slate-400 font-medium">Soglia attenzione:</span> {{ param.threshold }}
          </div>
        </div>
      </div>

      <!-- Air quality scale -->
      <div class="mt-16 p-6 rounded-2xl bg-slate-900/60 border border-white/8">
        <h3 class="text-white font-bold text-lg mb-2 text-center">Scala Qualità Aria Interna (IAQ)</h3>
        <p class="text-slate-400 text-xs text-center mb-6 max-w-2xl mx-auto">
          L’indice IAQ classifica la qualità dell’aria interna su una scala da “Eccellente” a “Pericolosa”. Più il valore è basso, migliore è la qualità dell’aria. Segui la legenda per interpretare i dati rilevati dai sensori.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <div v-for="level in aqScale" :key="level.label"
               class="flex flex-col items-center text-center p-4 rounded-xl border min-w-[120px] max-w-[160px] transition-all hover:scale-105 shadow-sm"
               :class="level.bgClass + ' ' + level.borderClass">
            <div class="text-3xl mb-2">{{ level.icon }}</div>
            <div class="font-bold text-sm mb-1" :class="level.textClass">{{ level.label }}</div>
            <div class="text-slate-400 text-xs font-mono mb-1">{{ level.range }}</div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const { isVisible, target: sectionRef } = useIntersectionObserver(0.05)

const parameters = [
  {
    icon: '🌡️', name: 'Temperatura', unit: '°C',
    risk: 'Base', riskColor: 'bg-slate-700 text-slate-300',
    desc: 'Indicatore fondamentale del comfort termico. Influenza la percezione dello spazio, la produttività e la proliferazione di agenti patogeni.',
    threshold: '18–26°C zona comfort',
  },
  {
    icon: '💧', name: 'Umidità', unit: '%RH',
    risk: 'Medio', riskColor: 'bg-yellow-900/50 text-yellow-400',
    desc: 'L\'umidità relativa eccessiva favorisce muffe e acari. Troppo bassa causa secchezza delle vie respiratorie e disturbi oculari.',
    threshold: '40–60% zona ottimale',
  },
  {
    icon: '🌫️', name: 'CO₂', unit: 'ppm',
    risk: 'Alto', riskColor: 'bg-orange-900/50 text-orange-400',
    desc: 'Indicatore principale di ricambio d\'aria. Valori elevati causano stanchezza, riduzione della concentrazione e cefalea.',
    threshold: '> 1000 ppm qualità scarsa',
  },
  {
    icon: '☁️', name: 'TVOC', unit: 'ppb',
    risk: 'Alto', riskColor: 'bg-orange-900/50 text-orange-400',
    desc: 'Composti organici volatili: vernici, solventi, prodotti di pulizia, arredi. Irritanti e potenzialmente cancerogeni a lungo termine.',
    threshold: '> 400 ppb livello attenzione',
  },
  {
    icon: '🔬', name: 'PM2.5', unit: 'µg/m³',
    risk: 'Critico', riskColor: 'bg-red-900/50 text-red-400',
    desc: 'Particolato fine: si deposita negli alveoli polmonari, aumentando il rischio di malattie cardiovascolari e respiratorie.',
    threshold: 'OMS: 15 µg/m³ media ann.',
  },
  {
    icon: '🌪️', name: 'PM10', unit: 'µg/m³',
    risk: 'Critico', riskColor: 'bg-red-900/50 text-red-400',
    desc: 'Particolato grossolano: pollini, polveri, spore. Irritante per occhi, naso e gola. Indice di qualità aria urbana.',
    threshold: 'OMS: 45 µg/m³ media ann.',
  },
  {
    icon: '⚗️', name: 'NO₂', unit: 'µg/m³',
    risk: 'Alto', riskColor: 'bg-orange-900/50 text-orange-400',
    desc: 'Biossido di azoto: prodotto da traffico e combustioni. Irrita il sistema respiratorio e può aggravare l\'asma.',
    threshold: 'OMS: 25 µg/m³ media 24h',
  },
  {
    icon: '☀️', name: 'Ozono (O₃)', unit: 'µg/m³',
    risk: 'Medio', riskColor: 'bg-yellow-900/50 text-yellow-400',
    desc: 'Ozono troposferico: si forma da reazioni fotochimiche. Irrita le vie respiratorie, peggiora nei mesi estivi.',
    threshold: 'OMS: 100 µg/m³ media 8h',
  },
  {
    icon: '🌊', name: 'Pressione', unit: 'hPa',
    risk: 'Base', riskColor: 'bg-slate-700 text-slate-300',
    desc: 'La pressione atmosferica è correlata a condizioni meteo, quota e variazioni climatiche. Utile per calcolo dell\'altitudine.',
    threshold: 'Standard: 1013.25 hPa',
  },
  {
    icon: '💦', name: 'Punto di Rugiada', unit: '°C',
    risk: 'Medio', riskColor: 'bg-yellow-900/50 text-yellow-400',
    desc: 'Temperatura a cui il vapore acqueo condensa. Indica rischio condensa su superfici, fondamentale per edifici e musei.',
    threshold: 'Sotto 12°C: rischio minimo',
  },
  {
    icon: '☢️', name: 'UV-A', unit: 'W/m²',
    risk: 'Medio', riskColor: 'bg-yellow-900/50 text-yellow-400',
    desc: 'Radiazione ultravioletta a onda lunga. Rilevante per outdoor, agricoltura, valutazione esposizione lavoratori esterni.',
    threshold: 'Indice UV > 6: protezione necessaria',
  },
  {
    icon: '🔋', name: 'Batteria', unit: '%',
    risk: 'Operativo', riskColor: 'bg-brand-900/50 text-brand-400',
    desc: 'Monitoraggio dell\'autonomia energetica di ogni cella. Alert automatici per pianificazione manutenzione preventiva.',
    threshold: '< 15%: intervento richiesto',
  },
]

const aqScale = [
  { icon: '😊', label: 'Eccellente', range: '0–50', bgClass: 'bg-emerald-900/20', borderClass: 'border-emerald-500/20', textClass: 'text-emerald-400' },
  { icon: '🙂', label: 'Buona',      range: '51–100', bgClass: 'bg-green-900/20', borderClass: 'border-green-500/20', textClass: 'text-green-400' },
  { icon: '😐', label: 'Moderata',   range: '101–150', bgClass: 'bg-yellow-900/20', borderClass: 'border-yellow-500/20', textClass: 'text-yellow-400' },
  { icon: '😷', label: 'Scarsa',     range: '151–200', bgClass: 'bg-orange-900/20', borderClass: 'border-orange-500/20', textClass: 'text-orange-400' },
  { icon: '🤢', label: 'Pessima',    range: '201–300', bgClass: 'bg-red-900/20', borderClass: 'border-red-500/20', textClass: 'text-red-400' },
  { icon: '☠️', label: 'Pericolosa', range: '301+', bgClass: 'bg-rose-900/30', borderClass: 'border-rose-600/30', textClass: 'text-rose-500' },
]
</script>

<template>
  <section id="contatti" class="py-24 bg-deep-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- CTA band -->
      <div class="relative rounded-3xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-brand-700 to-tech-700 opacity-90"></div>
        <div class="absolute inset-0"
             style="background-image: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)">
        </div>

        <div class="relative px-8 sm:px-16 py-16 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
            <span class="w-2 h-2 rounded-full bg-white animate-pulse-slow"></span>
            <span class="text-white/80 text-xs font-semibold uppercase tracking-wider">Parla con noi</span>
          </div>
          <h2 class="text-4xl sm:text-5xl font-black text-white mb-5">
            Pronti a Monitorare il<br/>Tuo Territorio?
          </h2>
          <p class="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Contattaci per una demo gratuita, un preventivo personalizzato
            o per scoprire come EwokIoT si integra nella tua infrastruttura.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@ewokiot.it"
               class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-brand-700 font-bold text-base hover:bg-brand-50 transition-all shadow-xl hover:shadow-2xl">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Richiedi una Demo
            </a>
            <a href="tel:+390000000000"
               class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Chiamaci
            </a>
          </div>
        </div>
      </div>

      <!-- Trust indicators -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
        <div v-for="trust in trustPoints" :key="trust.label"
             class="flex flex-col items-center text-center p-4 rounded-xl bg-white/3 border border-white/8">
          <div class="text-2xl mb-2">{{ trust.icon }}</div>
          <div class="text-white font-semibold text-sm mb-1">{{ trust.label }}</div>
          <div class="text-slate-500 text-xs">{{ trust.desc }}</div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const trustPoints = [
  { icon: '🇮🇹', label: 'Made in Italy',     desc: 'Progettato e supportato in Italia' },
  { icon: '🔐', label: 'GDPR Compliant',     desc: 'Dati ospitati in EU' },
  { icon: '📞', label: 'Supporto 24/7',      desc: 'Assistenza tecnica inclusa' },
  { icon: '⚙️', label: 'Installazione Rapida', desc: 'Operativo in 48 ore' },
]
</script>

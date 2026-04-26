<template>
  <footer class="bg-deep-900 border-t border-white/5 pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-white font-bold text-xl">Ewok<span class="text-brand-400">IoT</span></span>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed max-w-sm">
            Piattaforma IoT professionale per il monitoraggio ambientale distribuito.
            Dati in tempo reale, analisi avanzate e reportistica per enti pubblici e aziende.
          </p>
          <div class="flex gap-3 mt-6">
            <a href="mailto:info@ewokiot.it"
               class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@ewokiot.it
            </a>
          </div>
        </div>

        <!-- Piattaforma -->
        <div>
          <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Piattaforma</h4>
          <ul class="space-y-2">
            <li v-for="link in platformLinks" :key="link.id">
              <button
                class="text-slate-400 hover:text-white text-sm transition-colors"
                @click="scrollTo(link.id)"
              >{{ link.label }}</button>
            </li>
          </ul>
        </div>

        <!-- Aree -->
        <div>
          <h4 class="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Aree Monitorate</h4>
          <ul class="space-y-2">
            <li v-for="area in areas" :key="area">
              <span class="text-slate-400 text-sm flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                {{ area }}
              </span>
            </li>
          </ul>
        </div>

      </div>

      <div class="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-slate-500 text-sm">© {{ year }} EwokIoT Srl. Tutti i diritti riservati.</p>
        <div class="flex items-center gap-6">
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Cookie Policy</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Note Legali</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const platformLinks = [
  { id: 'piattaforma', label: 'Come funziona' },
  { id: 'mappa',       label: 'Mappa Live' },
  { id: 'dashboard',   label: 'Dashboard' },
  { id: 'tecnologie',  label: 'Tecnologie' },
  { id: 'contatti',    label: 'Contattaci' },
]

function scrollTo (id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const areas = ['Jesolo (VE)', 'Conegliano (TV)', 'Mestre (VE)', 'Gavaz – Belluno (BL)']
</script>

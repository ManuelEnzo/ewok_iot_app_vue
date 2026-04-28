<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-deep-900/95 backdrop-blur-md border-b border-white/5 shadow-2xl' : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 lg:h-20">

        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group" @click.prevent="scrollTo('top')">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span class="text-white font-bold text-xl tracking-tight">
            Ewok<span class="text-brand-400">IoT</span>
          </span>
        </a>

        <!-- Nav desktop -->
        <nav class="hidden md:flex items-center gap-1">
          <button
            v-for="item in navItems"
            :key="item.id"
            class="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            @click="scrollTo(item.id)"
          >{{ item.label }}</button>
        </nav>

        <!-- CTA -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
            <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow"></span>
            <span class="text-brand-400 text-xs font-medium">{{ activeCellCount }} celle attive</span>
          </div>
          <NuxtLink
            to="/dashboard"
            class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all duration-200"
          >Dashboard</NuxtLink>
          <button
            class="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-brand-500/25"
            @click="scrollTo('prezzi')"
          >Inizia</button>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useIoTStore } from '@/store/iot'

const store = useIoTStore()
const scrolled = ref(false)

const activeCellCount = computed(() => store.activeCells.length)

const navItems = [
  { id: 'piattaforma', label: 'Piattaforma' },
  { id: 'mappa',       label: 'Mappa Live' },
  { id: 'dashboard',   label: 'Dashboard' },
  { id: 'tecnologie',  label: 'Tecnologie' },
  { id: 'prezzi',      label: 'Prezzi' },
  { id: 'contatti',    label: 'Contatti' },
]

function scrollTo (id: string) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll () { scrolled.value = window.scrollY > 30 }

onMounted  (() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

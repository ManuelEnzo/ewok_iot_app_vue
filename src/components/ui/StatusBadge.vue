<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
    :class="badgeClasses"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand'
  dot?:     boolean
}>(), {
  variant: 'neutral',
  dot:     false,
})

const badgeClasses = computed(() => {
  const map: Record<string, string> = {
    success: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20',
    warning: 'bg-yellow-400/10  text-yellow-400  border border-yellow-400/20',
    error:   'bg-red-400/10     text-red-400     border border-red-400/20',
    info:    'bg-tech-400/10    text-tech-300     border border-tech-400/20',
    neutral: 'bg-white/5       text-slate-400    border border-white/10',
    brand:   'bg-brand-500/10  text-brand-400   border border-brand-500/20',
  }
  return map[props.variant]
})

const dotClass = computed(() => {
  const map: Record<string, string> = {
    success: 'bg-emerald-400 animate-pulse',
    warning: 'bg-yellow-400  animate-pulse',
    error:   'bg-red-400     animate-pulse',
    info:    'bg-tech-400',
    neutral: 'bg-slate-400',
    brand:   'bg-brand-400   animate-pulse',
  }
  return map[props.variant]
})
</script>

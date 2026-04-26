<template>
  <div
    class="rounded-2xl border transition-all duration-300"
    :class="[variantClasses, hoverEffect ? 'hover:scale-[1.02] hover:shadow-2xl cursor-pointer' : '']"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?:     'default' | 'glass' | 'dark' | 'highlight'
  hoverEffect?: boolean
}>(), {
  variant:     'default',
  hoverEffect: false,
})

const variantClasses = computed(() => {
  const map: Record<string, string> = {
    default:   'bg-slate-900/60 border-white/8 backdrop-blur-sm',
    glass:     'bg-white/3 border-white/10 backdrop-blur-md',
    dark:      'bg-deep-900 border-white/5',
    highlight: 'bg-brand-900/30 border-brand-500/30 backdrop-blur-sm',
  }
  return map[props.variant]
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center justify-between text-xs text-slate-400 mb-0.5">
      <span>{{ label }}</span>
      <span class="font-mono text-slate-300">{{ displayValue }}</span>
    </div>
    <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="barColor"
        :style="{ width: `${clampedPercent}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label:        string
  value:        number
  max:          number
  unit?:        string
  colorScheme?: 'brand' | 'blue' | 'red' | 'yellow' | 'purple'
}>()

const clampedPercent = computed(() =>
  Math.min(100, Math.max(0, (props.value / props.max) * 100))
)

const displayValue = computed(() =>
  `${props.value}${props.unit ? ' ' + props.unit : ''}`
)

const barColor = computed(() => {
  const map: Record<string, string> = {
    brand:  'bg-gradient-to-r from-brand-500 to-brand-400',
    blue:   'bg-gradient-to-r from-tech-600  to-tech-400',
    red:    'bg-gradient-to-r from-red-600   to-red-400',
    yellow: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
    purple: 'bg-gradient-to-r from-purple-600 to-purple-400',
  }
  return map[props.colorScheme ?? 'brand']
})
</script>

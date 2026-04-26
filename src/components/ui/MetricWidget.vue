<template>
  <div
    class="flex flex-col gap-1 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors"
  >
    <div class="flex items-center gap-2 mb-1">
      <span class="text-lg">{{ icon }}</span>
      <span class="text-slate-400 text-xs font-medium uppercase tracking-wider">{{ label }}</span>
    </div>
    <div class="flex items-end gap-1.5">
      <span class="text-white font-bold text-2xl leading-none font-mono">{{ formattedValue }}</span>
      <span v-if="unit" class="text-slate-400 text-sm mb-0.5">{{ unit }}</span>
    </div>
    <div v-if="trend !== undefined" class="flex items-center gap-1 mt-1">
      <svg
        class="w-3 h-3 transition-transform"
        :class="trend >= 0 ? 'text-emerald-400 rotate-0' : 'text-red-400 rotate-180'"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      <span class="text-xs" :class="trend >= 0 ? 'text-emerald-400' : 'text-red-400'">
        {{ Math.abs(trend).toFixed(1) }}{{ unit }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label:   string
  value:   number
  unit?:   string
  icon?:   string
  trend?:  number
  decimals?: number
}>()

const formattedValue = computed(() =>
  props.value.toFixed(props.decimals ?? 1)
)
</script>

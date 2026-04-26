<template>
  <div class="flex items-center gap-2 text-xs text-slate-500">
    <div class="flex items-center gap-1">
      <span class="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-slow"></span>
      <span>Live</span>
    </div>
    <span>·</span>
    <span>Aggiornamento {{ timeAgo }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ lastSync: string | null }>()

const timeAgo = computed(() => {
  if (!props.lastSync) return '—'
  const diff = Math.floor((Date.now() - new Date(props.lastSync).getTime()) / 1000)
  if (diff < 5)  return 'ora'
  if (diff < 60) return `${diff}s fa`
  return `${Math.floor(diff / 60)}m fa`
})
</script>

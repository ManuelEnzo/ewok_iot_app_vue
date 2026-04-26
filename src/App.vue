<template>
  <div class="min-h-screen bg-deep-900 text-white antialiased">
    <TheHeader />
    <RouterView />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView }  from 'vue-router'
import TheHeader       from '@/components/layout/TheHeader.vue'
import TheFooter       from '@/components/layout/TheFooter.vue'
import { useIoTStore } from '@/store/iot'

const store = useIoTStore()

onMounted(() => {
  store.initialize()
  store.startLiveUpdates(8000)
})

onUnmounted(() => {
  store.stopLiveUpdates()
})
</script>

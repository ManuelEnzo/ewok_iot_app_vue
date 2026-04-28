<template>
  <main>
    <HeroSection />
    <PlatformSection />
    <MapSection />
    <DashboardSection />
    <DataExplainerSection />
    <TechSection />
    <PricingSection />
    <ContactSection />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useIoTStore } from '@/store/iot'
import HeroSection          from '@/components/sections/HeroSection.vue'
import PlatformSection      from '@/components/sections/PlatformSection.vue'
import MapSection           from '@/components/sections/MapSection.vue'
import DashboardSection     from '@/components/sections/DashboardSection.vue'
import DataExplainerSection from '@/components/sections/DataExplainerSection.vue'
import TechSection          from '@/components/sections/TechSection.vue'
import PricingSection       from '@/components/sections/PricingSection.vue'
import ContactSection       from '@/components/sections/ContactSection.vue'

const store = useIoTStore()

onMounted(() => {
  store.initialize()
  store.startLiveUpdates(8000)
})

onUnmounted(() => {
  store.stopLiveUpdates()
})
</script>

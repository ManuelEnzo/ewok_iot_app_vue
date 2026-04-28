<template>
  <section id="mappa" class="py-24 bg-gradient-to-b from-deep-900 to-slate-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-12">
        <span class="inline-block px-3 py-1 rounded-full bg-tech-500/10 border border-tech-500/20 text-tech-400 text-xs font-semibold uppercase tracking-wider mb-4">
          Rete Distribuita
        </span>
        <h2 class="text-4xl sm:text-5xl font-black text-white mb-4">
          Mappa delle <span class="text-transparent bg-clip-text bg-gradient-to-r from-tech-400 to-brand-400">Celle IoT</span>
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          6 stazioni di monitoraggio distribuite in Veneto. Clicca su ogni marcatore
          per visualizzare i dati ambientali in tempo reale.
        </p>
      </div>

      <!-- Map + panel layout -->
      <div class="grid lg:grid-cols-3 gap-6">

        <!-- Map container -->
        <div class="lg:col-span-2">
          <div class="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style="height: 520px;">
            <div ref="mapContainer" class="w-full h-full"></div>

            <!-- Map overlay loading -->
            <Transition name="fade">
              <div v-if="!mapReady" class="absolute inset-0 bg-deep-900 flex items-center justify-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin"></div>
                  <span class="text-slate-400 text-sm">Caricamento mappa…</span>
                </div>
              </div>
            </Transition>

            <!-- Legend overlay -->
            <div class="absolute bottom-4 left-4 p-3 rounded-xl bg-deep-900/90 backdrop-blur-sm border border-white/10 text-xs">
              <div class="text-slate-400 font-medium mb-2 uppercase tracking-wider">Legenda</div>
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span class="text-slate-300">Cella attiva</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span class="text-slate-300">Attenzione</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-red-400"></span>
                  <span class="text-slate-300">Offline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Side panel -->
        <div class="flex flex-col gap-4">

          <div class="p-4 rounded-2xl bg-slate-900/60 border border-white/8 backdrop-blur-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-semibold text-sm">Celle Attive</h3>
              <LiveIndicator :last-sync="store.lastSync" />
            </div>

            <div class="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              <button
                v-for="cell in store.cells"
                :key="cell.id"
                class="w-full text-left p-3 rounded-xl border transition-all duration-200"
                :class="selectedCellId === cell.id
                  ? 'bg-brand-500/10 border-brand-500/30'
                  : 'bg-white/3 border-white/5 hover:bg-white/5 hover:border-white/15'"
                @click="selectCell(cell)"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-white text-sm font-medium">{{ cell.name }}</span>
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="cell.status === 'active' ? 'bg-emerald-400' : cell.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'"
                  ></span>
                </div>
                <div class="flex items-center gap-3 text-xs text-slate-400">
                  <span>{{ cell.technology }}</span>
                  <span>·</span>
                  <span v-if="cell.lastReading">{{ cell.lastReading.Temperature.toFixed(1) }}°C</span>
                  <span v-if="cell.lastReading">CO₂ {{ cell.lastReading.CO2.toFixed(0) }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Selected cell detail -->
          <Transition name="slide-fade">
            <div v-if="selectedCell"
                 class="p-4 rounded-2xl bg-brand-900/20 border border-brand-500/20 backdrop-blur-sm">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-white font-semibold text-sm">{{ selectedCell.name }}</h4>
                <button @click="selectedCellId = null" class="text-slate-500 hover:text-white text-lg leading-none">×</button>
              </div>
              <div v-if="selectedCell.lastReading" class="grid grid-cols-2 gap-2 text-xs">
                <div v-for="m in detailMetrics" :key="m.label"
                     class="flex flex-col p-2 rounded-lg bg-white/3">
                  <span class="text-slate-500">{{ m.label }}</span>
                  <span class="text-white font-mono font-semibold mt-0.5">{{ m.value }}</span>
                </div>
              </div>
            </div>
          </Transition>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import type * as LeafletType from 'leaflet'
import { useIoTStore } from '@/store/iot'
import { IoTDataService } from '@/services/IoTDataService'
import type { IoTCell } from '@/models/iot'
import LiveIndicator from '@/components/ui/LiveIndicator.vue'

const store          = useIoTStore()
const mapContainer   = ref<HTMLDivElement | null>(null)
const mapReady       = ref(false)
const selectedCellId = ref<string | null>(null)

let L: typeof LeafletType | null     = null
let leafletMap: LeafletType.Map | null = null
const markerMap = new Map<string, LeafletType.Marker>()

const selectedCell = computed(() =>
  selectedCellId.value
    ? store.cells.find(c => c.id === selectedCellId.value) ?? null
    : null
)

const detailMetrics = computed(() => {
  const r = selectedCell.value?.lastReading
  if (!r) return []
  return [
    { label: 'Temperatura',  value: `${r.Temperature.toFixed(1)} °C` },
    { label: 'Umidità',      value: `${r.Humidity.toFixed(1)} %` },
    { label: 'CO₂',          value: `${r.CO2.toFixed(0)} ppm` },
    { label: 'TVOC',         value: `${r.TVOC.toFixed(0)} ppb` },
    { label: 'PM2.5',        value: `${r.PM25.toFixed(1)} µg/m³` },
    { label: 'PM10',         value: `${r.PM10.toFixed(1)} µg/m³` },
    { label: 'Pressione',    value: `${r.RelativePressure.toFixed(1)} hPa` },
    { label: 'Qualità aria', value: r.IndoorAirQualityInterpreted },
  ]
})

function cellColor (cell: IoTCell): string {
  if (cell.status === 'inactive') return '#f87171'
  if (cell.status === 'warning')  return '#facc15'
  return '#34d399'
}

function buildPopupHtml (cell: IoTCell): string {
  const r    = cell.lastReading
  const aqI  = r ? IoTDataService.getAirQualityInfo(r.IndoorAirQuality) : null
  return `
    <div style="font-family:Inter,sans-serif;min-width:200px;color:#e2e8f0">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <strong style="font-size:13px;color:#fff">${cell.name}</strong>
        <span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600;
          background:${cell.status === 'active' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)'};
          color:${cell.status === 'active' ? '#34d399' : '#f87171'}">
          ${cell.status === 'active' ? '● Attiva' : '● Offline'}
        </span>
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:8px">${cell.technology} · ${cell.sector}</div>
      ${r ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px">
          <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:6px">
            <div style="color:#64748b;font-size:10px">Temperatura</div>
            <div style="color:#fff;font-weight:700;font-family:monospace">${r.Temperature.toFixed(1)}°C</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:6px">
            <div style="color:#64748b;font-size:10px">CO₂</div>
            <div style="color:#fff;font-weight:700;font-family:monospace">${r.CO2.toFixed(0)} ppm</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:6px">
            <div style="color:#64748b;font-size:10px">PM2.5</div>
            <div style="color:#fff;font-weight:700;font-family:monospace">${r.PM25.toFixed(1)} µg/m³</div>
          </div>
          <div style="background:rgba(255,255,255,0.05);border-radius:6px;padding:6px">
            <div style="color:#64748b;font-size:10px">Umidità</div>
            <div style="color:#fff;font-weight:700;font-family:monospace">${r.Humidity.toFixed(1)}%</div>
          </div>
        </div>
        ${aqI ? `<div style="padding:6px 10px;border-radius:6px;background:rgba(255,255,255,0.03);font-size:11px">
          Qualità aria: <strong style="color:${aqI.color.replace('text-','')}">${aqI.label}</strong>
        </div>` : ''}
      ` : '<div style="font-size:12px;color:#64748b">Nessun dato disponibile</div>'}
    </div>
  `
}

function createCellMarker (cell: IoTCell): LeafletType.Marker {
  if (!L) throw new Error('Leaflet not loaded')
  const color  = cellColor(cell)
  const icon   = L.divIcon({
    className: '',
    html: `<div style="
      width:16px;height:16px;border-radius:50%;
      background:${color};
      box-shadow:0 0 0 4px ${color}33, 0 0 12px ${color}66;
      border:2px solid rgba(255,255,255,0.3)
    "></div>`,
    iconSize:   [16, 16],
    iconAnchor: [8, 8],
  })

  const marker = L.marker([cell.lat, cell.lng], { icon })
  marker.bindPopup(buildPopupHtml(cell), {
    className:   'ewok-popup',
    maxWidth:    260,
    closeButton: true,
  })

  marker.on('click', () => {
    selectedCellId.value = cell.id
    store.selectCell(cell.id)
  })

  return marker
}

async function initMap () {
  if (!mapContainer.value) return

  L = await import('leaflet')

  // Fix default icon paths broken by bundlers
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  leafletMap = L.map(mapContainer.value, {
    center:         [45.65, 12.3],
    zoom:           9,
    zoomControl:    true,
    attributionControl: true,
  })

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { attribution: '© OpenStreetMap © CARTO', maxZoom: 19 }
  ).addTo(leafletMap)

  store.cells.forEach(cell => {
    const marker = createCellMarker(cell)
    marker.addTo(leafletMap!)
    markerMap.set(cell.id, marker)
  })

  setTimeout(() => { mapReady.value = true }, 400)
}

function updateMarkers () {
  if (!L) return
  const _L = L as typeof LeafletType
  store.cells.forEach(cell => {
    const marker = markerMap.get(cell.id)
    if (!marker) return
    const color = cellColor(cell)
    const icon  = _L.divIcon({
      className: '',
      html: `<div style="
        width:16px;height:16px;border-radius:50%;
        background:${color};
        box-shadow:0 0 0 4px ${color}33, 0 0 12px ${color}66;
        border:2px solid rgba(255,255,255,0.3)
      "></div>`,
      iconSize:   [16, 16],
      iconAnchor: [8, 8],
    })
    marker.setIcon(icon)
    marker.setPopupContent(buildPopupHtml(cell))
  })
}

function selectCell (cell: IoTCell) {
  selectedCellId.value = cell.id
  store.selectCell(cell.id)
  const marker = markerMap.get(cell.id)
  if (marker && leafletMap) {
    leafletMap.setView([cell.lat, cell.lng], 13, { animate: true })
    marker.openPopup()
  }
}

watch(() => store.cells, updateMarkers, { deep: false })

onMounted  (async () => { await nextTick(); initMap() })
onUnmounted(() => { leafletMap?.remove(); leafletMap = null })
</script>

<style>
.ewok-popup .leaflet-popup-content-wrapper {
  background: #0d1117;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  padding: 0;
}
.ewok-popup .leaflet-popup-content {
  margin: 14px 16px;
}
.ewok-popup .leaflet-popup-tip {
  background: #0d1117;
}
.ewok-popup .leaflet-popup-close-button {
  color: #64748b !important;
  font-size: 18px !important;
  top: 8px !important;
  right: 10px !important;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
</style>

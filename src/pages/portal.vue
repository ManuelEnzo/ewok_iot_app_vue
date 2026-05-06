<template>
  <div class="min-h-screen bg-deep-900">

    <!-- Portal Header -->
    <header class="bg-deep-900/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span class="text-white font-bold text-lg">Ewok<span class="text-brand-400">IoT</span></span>
          </NuxtLink>

          <!-- User info + logout -->
          <div class="flex items-center gap-4">
            <div v-if="subStore.mySubscription" class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
              <span class="text-sm">{{ subStore.mySubscription.emoji }}</span>
              <span class="text-brand-400 text-xs font-semibold">{{ subStore.mySubscription.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center">
                <span class="text-brand-400 text-xs font-bold">{{ userInitials }}</span>
              </div>
              <span class="hidden sm:block text-slate-300 text-sm font-medium">{{ authStore.displayName }}</span>
            </div>
            <button
              class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all"
              @click="handleLogout"
            >Esci</button>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Welcome banner -->
      <div class="mb-8">
        <h1 class="text-white text-3xl font-black mb-1">
          Bentornato, <span class="text-brand-400">{{ authStore.firstName ?? authStore.email }}</span> 👋
        </h1>
        <p class="text-slate-400 text-sm">Il tuo pannello di controllo EwokIoT API.</p>
      </div>

      <!-- Subscription required notice -->
      <div
        v-if="!subStore.isLoading && subStore.mySubscription && !subStore.mySubscription.isActive"
        class="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4"
      >
        <svg class="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p class="text-amber-300 font-semibold text-sm">Abbonamento non attivo</p>
          <p class="text-amber-400/80 text-xs mt-0.5">Attiva un piano per sbloccare l'accesso alle API e generare la tua chiave.</p>
          <NuxtLink
            to="/#prezzi"
            class="inline-block mt-3 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-deep-900 text-xs font-bold transition-colors"
          >Scegli un piano</NuxtLink>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-8 border-b border-white/5">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-5 py-3 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px"
          :class="activeTab === tab.id
            ? 'border-brand-500 text-brand-400'
            : 'border-transparent text-slate-500 hover:text-slate-300'"
          @click="activeTab = tab.id"
        >
          <span class="mr-2">{{ tab.icon }}</span>{{ tab.label }}
        </button>
      </div>

      <!-- ── TAB: Panoramica ─────────────────────────────────────────────── -->
      <div v-if="activeTab === 'overview'">

        <!-- Loading state -->
        <div v-if="subStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div v-for="i in 4" :key="i" class="h-28 rounded-2xl bg-white/3 animate-pulse" />
        </div>

        <!-- Subscription stats -->
        <div v-else-if="subStore.mySubscription" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-5">
            <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Piano attivo</p>
            <p class="text-white text-2xl font-black">{{ subStore.mySubscription.emoji }} {{ subStore.mySubscription.name }}</p>
            <p class="text-slate-500 text-xs mt-1">€{{ subStore.mySubscription.priceMonthly }}/mese</p>
          </div>
          <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-5">
            <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Richieste questo mese</p>
            <p class="text-white text-2xl font-black">{{ subStore.mySubscription.monthlyRequestsUsed.toLocaleString('it') }}</p>
            <p class="text-slate-500 text-xs mt-1">
              su {{ subStore.mySubscription.monthlyRequestLimit?.toLocaleString('it') ?? '∞' }} disponibili
            </p>
          </div>
          <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-5">
            <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Scadenza</p>
            <p class="text-white text-2xl font-black">{{ formatDate(subStore.mySubscription.expiresAt) }}</p>
            <p class="text-slate-500 text-xs mt-1">
              <span :class="subStore.mySubscription.isActive ? 'text-brand-400' : 'text-red-400'">
                {{ subStore.mySubscription.isActive ? 'Attivo' : 'Scaduto' }}
              </span>
            </p>
          </div>
          <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-5">
            <p class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Storico dati</p>
            <p class="text-white text-2xl font-black">{{ subStore.mySubscription.historyDays ?? '—' }} <span class="text-base font-medium text-slate-400">giorni</span></p>
            <p class="text-slate-500 text-xs mt-1">accesso ai dati storici</p>
          </div>
        </div>

        <!-- Features grid -->
        <div v-if="subStore.mySubscription" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-6">
            <h3 class="text-white font-bold text-sm mb-4">Funzionalità incluse</h3>
            <ul class="space-y-2.5">
              <li v-for="feat in planFeatures" :key="feat.label" class="flex items-center justify-between">
                <span class="text-slate-400 text-sm">{{ feat.label }}</span>
                <span v-if="typeof feat.value === 'boolean'">
                  <svg v-if="feat.value" class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                <span v-else class="text-white text-sm font-semibold">{{ feat.value }}</span>
              </li>
            </ul>
          </div>

          <!-- Usage bar -->
          <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-6">
            <h3 class="text-white font-bold text-sm mb-4">Utilizzo API questo mese</h3>
            <div class="mb-3">
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-slate-400">{{ subStore.mySubscription.monthlyRequestsUsed.toLocaleString('it') }} usate</span>
                <span class="text-slate-400">{{ subStore.mySubscription.monthlyRequestLimit?.toLocaleString('it') ?? '∞' }} totali</span>
              </div>
              <div class="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :class="usagePercent > 80 ? 'bg-amber-500' : 'bg-brand-500'"
                  :style="{ width: `${Math.min(usagePercent, 100)}%` }"
                />
              </div>
              <p class="text-slate-600 text-xs mt-1.5">{{ usagePercent.toFixed(1) }}% utilizzato</p>
            </div>
            <NuxtLink
              to="/#prezzi"
              class="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors mt-2"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Upgrade piano
            </NuxtLink>
          </div>
        </div>

        <!-- No subscription -->
        <div v-else-if="!subStore.isLoading" class="text-center py-16">
          <p class="text-slate-500 text-sm">Nessun abbonamento trovato.</p>
          <NuxtLink to="/#prezzi" class="inline-block mt-4 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors">
            Scegli un piano
          </NuxtLink>
        </div>
      </div>

      <!-- ── TAB: API Key ────────────────────────────────────────────────── -->
      <div v-if="activeTab === 'apikey'">
        <div class="max-w-2xl">

          <!-- Locked state -->
          <div
            v-if="subStore.mySubscription && !subStore.mySubscription.isActive"
            class="rounded-2xl bg-slate-900/60 border border-white/8 p-10 text-center"
          >
            <svg class="w-12 h-12 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p class="text-slate-400 font-semibold mb-2">Abbonamento richiesto</p>
            <p class="text-slate-600 text-sm mb-6">Attiva un piano per generare e usare la tua API key.</p>
            <NuxtLink
              to="/#prezzi"
              class="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors inline-block"
            >Scegli un piano →</NuxtLink>
          </div>

          <!-- Active key -->
          <template v-else>
            <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-6 mb-4">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center">
                  <svg class="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-white font-bold text-base">La tua API Key</h2>
                  <p class="text-slate-500 text-xs">Usa questo token come Bearer nel header Authorization.</p>
                </div>
              </div>

              <!-- Token display -->
              <div class="relative group mb-4">
                <div
                  class="w-full bg-deep-800 border border-white/8 rounded-xl px-4 py-3 text-sm font-mono text-slate-300 overflow-hidden"
                  style="word-break: break-all;"
                >
                  <span v-if="showToken">{{ authStore.accessToken }}</span>
                  <span v-else class="tracking-widest text-slate-600">{{ maskedToken }}</span>
                </div>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    :title="showToken ? 'Nascondi' : 'Mostra'"
                    @click="showToken = !showToken"
                  >
                    <svg v-if="!showToken" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                  <button
                    class="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    title="Copia"
                    @click="copyToken"
                  >
                    <svg v-if="!copied" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <svg v-else class="w-4 h-4 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Meta info -->
              <div class="flex flex-wrap gap-3 text-xs">
                <span class="flex items-center gap-1.5 text-slate-500">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Scade: {{ formatDate(authStore.expiresAt) }}
                </span>
                <span class="flex items-center gap-1.5 text-slate-500">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ authStore.email }}
                </span>
              </div>

              <!-- Refresh token button -->
              <button
                class="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 hover:text-white text-xs font-medium transition-all"
                :disabled="authStore.isLoading"
                @click="handleRefreshToken"
              >
                <svg class="w-3.5 h-3.5" :class="authStore.isLoading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rinnova token
              </button>
            </div>

            <!-- Usage instructions -->
            <div class="rounded-2xl bg-slate-900/60 border border-white/8 p-6">
              <h3 class="text-white font-bold text-sm mb-4">Come usare l'API Key</h3>
              <p class="text-slate-400 text-xs mb-4">Includi il token nel header <code class="text-brand-400 bg-brand-500/10 px-1 py-0.5 rounded">Authorization</code> di ogni richiesta HTTP:</p>

              <div class="space-y-3">
                <!-- cURL example -->
                <div>
                  <p class="text-slate-500 text-xs font-medium mb-1.5">cURL</p>
                  <div class="relative">
                    <pre class="bg-deep-800 border border-white/8 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">curl -H "Authorization: Bearer &lt;TUA_API_KEY&gt;" \
  {{ apiBase }}/api/v1/sensor-data/latest</pre>
                    <button
                      class="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all"
                      @click="copyCurl"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- JS example -->
                <div>
                  <p class="text-slate-500 text-xs font-medium mb-1.5">JavaScript / TypeScript</p>
                  <pre class="bg-deep-800 border border-white/8 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">const res = await fetch('{{ apiBase }}/api/v1/sensor-data/latest', {
  headers: { Authorization: 'Bearer &lt;TUA_API_KEY&gt;' },
})
const data = await res.json()</pre>
                </div>
              </div>

              <!-- Endpoint list -->
              <div class="mt-6">
                <p class="text-slate-500 text-xs font-medium mb-3">Endpoint disponibili</p>
                <div class="space-y-1.5">
                  <div v-for="ep in endpoints" :key="ep.path" class="flex items-center gap-3 text-xs">
                    <span
                      class="px-2 py-0.5 rounded font-mono font-bold text-[10px]"
                      :class="ep.method === 'GET' ? 'bg-tech-500/15 text-tech-400' : 'bg-brand-500/15 text-brand-400'"
                    >{{ ep.method }}</span>
                    <span class="text-slate-400 font-mono">{{ ep.path }}</span>
                    <span class="text-slate-600 hidden sm:block">{{ ep.desc }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ── TAB: Dati sensori ───────────────────────────────────────────── -->
      <div v-if="activeTab === 'data'">

        <!-- Filters -->
        <div class="flex flex-wrap gap-3 mb-6">
          <select
            v-model="dataFilter.area"
            class="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-slate-300 text-sm focus:outline-none focus:border-brand-500/50 transition-colors"
          >
            <option value="">Tutte le aree</option>
            <option v-for="area in availableAreas" :key="area" :value="area">{{ area }}</option>
          </select>
          <button
            class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            :disabled="dataLoading"
            @click="loadSensorData"
          >
            <svg class="w-4 h-4" :class="dataLoading ? 'animate-spin' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Aggiorna
          </button>
        </div>

        <!-- Error -->
        <div
          v-if="dataError"
          class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >{{ dataError }}</div>

        <!-- Loading skeleton -->
        <div v-if="dataLoading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 rounded-xl bg-white/3 animate-pulse" />
        </div>

        <!-- Table -->
        <div v-else-if="sensorRows.length" class="rounded-2xl bg-slate-900/60 border border-white/8 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-white/5">
                  <th class="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Area / Settore</th>
                  <th class="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Temp.</th>
                  <th class="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Umidità</th>
                  <th class="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">CO₂</th>
                  <th class="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">PM2.5</th>
                  <th class="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">IAQ</th>
                  <th class="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="row in sensorRows"
                  :key="row.id"
                  class="border-b border-white/3 hover:bg-white/2 transition-colors"
                >
                  <td class="px-4 py-3">
                    <span class="text-white font-medium">{{ row.area ?? '—' }}</span>
                    <span class="text-slate-500 text-xs ml-1">{{ row.sector ?? '' }}</span>
                  </td>
                  <td class="px-4 py-3 text-slate-300">{{ row.temperature != null ? `${row.temperature.toFixed(1)} °C` : '—' }}</td>
                  <td class="px-4 py-3 text-slate-300">{{ row.humidity    != null ? `${row.humidity.toFixed(1)} %`   : '—' }}</td>
                  <td class="px-4 py-3 text-slate-300">{{ row.cO2         != null ? `${row.cO2.toFixed(0)} ppm`      : '—' }}</td>
                  <td class="px-4 py-3 text-slate-300">{{ row.pM25        != null ? `${row.pM25.toFixed(1)} µg/m³`   : '—' }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="iaqClass(row.indoorAirQuality)"
                    >{{ row.indoorAirQualityInterpreted ?? (row.indoorAirQuality?.toFixed(0) ?? '—') }}</span>
                  </td>
                  <td class="px-4 py-3 text-slate-500 text-xs font-mono">{{ formatDateTime(row.markerDate) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p class="text-slate-500 text-xs">Pagina {{ currentPage }} di {{ totalPages }} · {{ totalCount.toLocaleString('it') }} record</p>
            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs disabled:opacity-40 transition-all"
                :disabled="currentPage <= 1"
                @click="changePage(currentPage - 1)"
              >← Prec.</button>
              <button
                class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs disabled:opacity-40 transition-all"
                :disabled="currentPage >= totalPages"
                @click="changePage(currentPage + 1)"
              >Succ. →</button>
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-16">
          <p class="text-slate-500 text-sm">Nessun dato disponibile.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { SensorDataDto } from '@/models/api'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const subStore  = useSubscriptionStore()
const router    = useRouter()
const config    = useRuntimeConfig()
const apiBase   = config.public.apiBase as string
const api       = useEwokApi()

// ── User initials ────────────────────────────────────────────────────────────
const userInitials = computed(() => {
  const f = authStore.firstName?.[0] ?? ''
  const l = authStore.lastName?.[0]  ?? ''
  return (f + l).toUpperCase() || (authStore.email?.[0]?.toUpperCase() ?? 'U')
})

// ── Tabs ─────────────────────────────────────────────────────────────────────
const tabs: { id: 'overview' | 'apikey' | 'data'; icon: string; label: string }[] = [
  { id: 'overview', icon: '📊', label: 'Panoramica' },
  { id: 'apikey',   icon: '🔑', label: 'API Key'    },
  { id: 'data',     icon: '📡', label: 'Dati live'  },
]
const activeTab = ref<'overview' | 'apikey' | 'data'>('overview')

// ── Logout ───────────────────────────────────────────────────────────────────
async function handleLogout () {
  await authStore.logout()
  router.push('/')
}

// ── Subscription ─────────────────────────────────────────────────────────────
const usagePercent = computed(() => {
  const sub = subStore.mySubscription
  if (!sub || !sub.monthlyRequestLimit) return 0
  return (sub.monthlyRequestsUsed / sub.monthlyRequestLimit) * 100
})

const planFeatures = computed(() => {
  const sub = subStore.mySubscription
  if (!sub) return []
  return [
    { label: 'Stazioni massime',         value: sub.maxStations         ?? '∞' },
    { label: 'API key massime',          value: sub.maxApiKeys          ?? '∞' },
    { label: 'Page size massima',        value: sub.maxPageSize                },
    { label: 'Tutte le stazioni',        value: sub.includesAllStations        },
    { label: 'Webhook',                  value: sub.hasWebhooks                },
    { label: 'Dashboard avanzata',       value: sub.hasAdvancedDashboard       },
    { label: 'SLA garantito',            value: sub.hasSla                     },
    { label: 'Supporto prioritario',     value: sub.hasPrioritySupport         },
  ]
})

// ── API Key ───────────────────────────────────────────────────────────────────
const showToken = ref(false)
const copied    = ref(false)

const maskedToken = computed(() => {
  const t = authStore.accessToken ?? ''
  if (t.length <= 20) return '•'.repeat(t.length)
  return t.slice(0, 10) + '•'.repeat(Math.min(t.length - 20, 40)) + t.slice(-10)
})

async function copyToken () {
  if (!authStore.accessToken) return
  await navigator.clipboard.writeText(authStore.accessToken)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

async function copyCurl () {
  const snippet = `curl -H "Authorization: Bearer ${authStore.accessToken}" \\\n  ${apiBase}/api/v1/sensor-data/latest`
  await navigator.clipboard.writeText(snippet)
}

async function handleRefreshToken () {
  await authStore.refreshAccessToken()
}

const endpoints = [
  { method: 'GET',  path: '/api/v1/sensor-data/latest',       desc: 'Ultima lettura per ogni sensore' },
  { method: 'GET',  path: '/api/v1/sensor-data',              desc: 'Lista paginata letture'           },
  { method: 'GET',  path: '/api/v1/sensor-data/by-area/{area}', desc: 'Dati per area geografica'      },
  { method: 'GET',  path: '/api/v1/sensor-data/by-date-range', desc: 'Dati per intervallo di date'    },
  { method: 'GET',  path: '/api/v1/sensor-data/aggregates',   desc: 'Aggregati (avg temp, CO₂…)'      },
  { method: 'POST', path: '/api/v1/sensor-data',              desc: 'Crea nuova lettura sensore'       },
  { method: 'GET',  path: '/api/v1/subscription/me',          desc: 'Info abbonamento corrente'        },
]

// ── Sensor data tab ───────────────────────────────────────────────────────────
const sensorRows   = ref<SensorDataDto[]>([])
const dataLoading  = ref(false)
const dataError    = ref<string | null>(null)
const currentPage  = ref(1)
const totalPages   = ref(1)
const totalCount   = ref(0)
const dataFilter   = ref({ area: '' })

const availableAreas = computed(() => {
  const set = new Set(sensorRows.value.map(r => r.area).filter(Boolean))
  return [...set] as string[]
})

async function loadSensorData () {
  dataLoading.value = true
  dataError.value   = null
  try {
    if (dataFilter.value.area) {
      const res = await api.sensorData.getByArea(dataFilter.value.area, currentPage.value)
      sensorRows.value = res.items ?? []
      totalPages.value = res.totalPages
      totalCount.value = res.totalCount
    } else {
      const res = await api.sensorData.getAll(currentPage.value)
      sensorRows.value = res.items ?? []
      totalPages.value = res.totalPages
      totalCount.value = res.totalCount
    }
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status
    if (status === 402) {
      dataError.value = 'Questa funzione richiede un abbonamento attivo.'
    } else {
      dataError.value = 'Impossibile caricare i dati. Verifica la tua connessione.'
    }
  } finally {
    dataLoading.value = false
  }
}

function changePage (page: number) {
  currentPage.value = page
  loadSensorData()
}

function iaqClass (val?: number | null): string {
  if (val == null) return 'bg-slate-700/40 text-slate-400'
  if (val <= 50)  return 'bg-brand-500/20 text-brand-400'
  if (val <= 100) return 'bg-tech-500/20 text-tech-400'
  if (val <= 150) return 'bg-amber-500/20 text-amber-400'
  return 'bg-red-500/20 text-red-400'
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function formatDate (val?: string | null): string {
  if (!val) return '—'
  return new Date(val).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatDateTime (val?: string | null): string {
  if (!val) return '—'
  return new Date(val).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// ── Init ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
  authStore.restoreFromStorage()
  await subStore.fetchMySubscription()
})
</script>

<script setup lang="ts">
// Documento generado el 2026-07-04-2230
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { RACES } from '@/data/races'
import { FEATS } from '@/data/feats'
import { ATTR_DEFS } from '@/data/config'

const ui   = useUiStore()
const char = useCharacterStore()

const selectedId = ref(char.character?.raza ?? '')

function featName(id: string) { return FEATS.find(f => f.id === id)?.name ?? id }

function siguiente() {
  if (!selectedId.value || !char.character) return
  char.character.raza = selectedId.value
  ui.next()
}
</script>

<template>
  <div class="flex flex-col h-full">

    <!-- Cabecera -->
    <div class="px-6 py-4 border-b border-stone-800">
      <h2 class="text-amber-400 font-bold text-lg">Elige tu raza</h2>
      <p class="text-stone-500 text-sm mt-1">La raza define tus máximos naturales y tu dote racial gratuita.</p>
    </div>

    <!-- Grid de razas -->
    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          v-for="raza in RACES" :key="raza.id"
          @click="selectedId = raza.id"
          class="rounded-lg border p-3 text-left transition-all"
          :class="selectedId === raza.id
            ? 'border-amber-500 bg-stone-800'
            : 'border-stone-700 bg-stone-900 hover:border-stone-500'"
        >
          <div class="font-semibold text-stone-100 mb-1">{{ raza.name }}</div>
          <div class="text-xs text-stone-400 mb-2">Dote: {{ featName(raza.startingFeatId) }}</div>

          <!-- Máximos en mini-tabla -->
          <div class="grid grid-cols-3 gap-x-2 text-xs">
            <template v-for="a in ATTR_DEFS" :key="a.key">
              <span class="text-stone-500 truncate">{{ a.name.slice(0,3) }}.</span>
              <span class="text-stone-300 font-mono col-span-2">
                {{ raza.maxima[a.key] }}
                <span v-if="(raza.minima[a.key] ?? 0) > 0" class="text-amber-600/80 ml-1">(mín {{ raza.minima[a.key] }})</span>
              </span>
            </template>
          </div>
        </button>
      </div>
    </div>

    <!-- Barra de navegación -->
    <div class="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950">
      <button @click="ui.back()" class="btn-ghost">← Atrás</button>
      <button @click="siguiente" :disabled="!selectedId"
        class="btn-primary" :class="!selectedId ? 'opacity-50 cursor-not-allowed' : ''">
        Siguiente →
      </button>
    </div>

  </div>
</template>

<style scoped>
@reference "../style.css";
.btn-primary { @apply bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded px-5 py-2 text-sm transition-colors; }
.btn-ghost   { @apply border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 rounded px-5 py-2 text-sm transition-colors; }
</style>

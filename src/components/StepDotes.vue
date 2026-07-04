<script setup lang="ts">
// Documento generado el 2026-07-04-2230
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { FEATS } from '@/data/feats'
import { checkPrereq } from '@/rules/helpers'
import type { CharState } from '@/rules/types'

const ui   = useUiStore()
const char = useCharacterStore()

const selectedId = ref(char.wizardDraft.featElegida)
const search     = ref('')

// Estado inicial solo con la dote racial (para comprobar prereqs de la dote libre)
const initState = computed((): CharState | null => {
  if (!char.raza) return null
  return {
    nivel: 1,
    attrs:  char.wizardDraft.attrs,
    skills: char.wizardDraft.skills,
    feats:  [char.raza.startingFeatId],
    god:    char.wizardDraft.god,
  }
})

const raceFeatId = computed(() => char.raza?.startingFeatId ?? '')

// Dotes disponibles: prereqs cumplidos con el estado inicial, excluye la racial
const available = computed(() => {
  if (!initState.value) return []
  const state = initState.value
  return FEATS.filter(f => {
    if (f.id === raceFeatId.value) return false // ya la tiene
    return f.prereqs.every(p => checkPrereq(p, state))
  })
})

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return available.value.filter(f =>
    !q || f.name.toLowerCase().includes(q) || f.chain.toLowerCase().includes(q) || f.effect.toLowerCase().includes(q)
  )
})

const selected = computed(() => FEATS.find(f => f.id === selectedId.value) ?? null)

function siguiente() {
  if (!selectedId.value) return
  char.setWizardFeat(selectedId.value)
  ui.next()
}
</script>

<template>
  <div class="flex flex-col h-full">

    <div class="px-6 py-4 border-b border-stone-800">
      <h2 class="text-amber-400 font-bold text-lg">Dote inicial libre</h2>
      <p class="text-stone-500 text-sm mt-1">
        Elige tu primera dote. Tu raza ya incluye
        <span class="text-stone-300">{{ char.raza?.name }}</span>
        con <span class="text-stone-300">{{ FEATS.find(f => f.id === raceFeatId)?.name ?? raceFeatId }}</span>.
      </p>
    </div>

    <div class="flex flex-1 min-h-0">

      <!-- Lista de dotes -->
      <div class="flex flex-col w-72 border-r border-stone-800 flex-shrink-0">
        <div class="p-3 border-b border-stone-800">
          <input v-model="search" placeholder="Buscar…"
            class="w-full bg-stone-800 border border-stone-700 rounded px-3 py-1.5 text-stone-100 text-sm focus:border-amber-500 focus:outline-none" />
        </div>
        <div class="flex-1 overflow-y-auto">
          <button
            v-for="feat in filtered" :key="feat.id"
            @click="selectedId = feat.id"
            class="w-full text-left px-4 py-2.5 border-b border-stone-800/50 transition-colors"
            :class="selectedId === feat.id
              ? 'bg-amber-900/30 text-amber-400'
              : 'text-stone-300 hover:bg-stone-800'"
          >
            <div class="text-sm font-medium">{{ feat.name }}</div>
            <div class="text-xs text-stone-500">{{ feat.chain }}</div>
          </button>
          <p v-if="filtered.length === 0" class="p-4 text-stone-600 text-sm italic">Sin resultados</p>
        </div>
      </div>

      <!-- Detalle de la dote seleccionada -->
      <div class="flex-1 overflow-y-auto p-6">
        <template v-if="selected">
          <h3 class="text-amber-400 font-bold text-lg mb-1">{{ selected.name }}</h3>
          <p class="text-stone-500 text-xs mb-4">{{ selected.chain }} · Tier {{ selected.tier }}</p>
          <div class="space-y-3 text-sm">
            <div>
              <span class="text-stone-500 font-semibold">Uso: </span>
              <span class="text-stone-300">{{ selected.use }}</span>
            </div>
            <div>
              <span class="text-stone-500 font-semibold">Efecto: </span>
              <span class="text-stone-300">{{ selected.effect }}</span>
            </div>
            <div v-if="selected.limit">
              <span class="text-stone-500 font-semibold">Límite: </span>
              <span class="text-stone-400 text-xs">{{ selected.limit }}</span>
            </div>
            <div v-if="selected.prereqs.length > 0" class="text-xs text-stone-600">
              Prereqs: {{ selected.prereqs.length }} condición(es) — todas cumplidas ✓
            </div>
          </div>
        </template>
        <p v-else class="text-stone-600 italic text-sm">Selecciona una dote para ver su descripción.</p>
      </div>

    </div>

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

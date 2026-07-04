<script setup lang="ts">
// Documento generado el 2026-07-04-2230
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { ATTR_DEFS, INITIAL_ATTRS } from '@/data/config'
import { getMaxAttrBase } from '@/rules/helpers'
import type { AttrKey, Attrs } from '@/rules/types'

const ui   = useUiStore()
const char = useCharacterStore()

// Pool y asignaciones
const pool        = ref<number[]>([...INITIAL_ATTRS].sort((a, b) => b - a))
const assignments = ref<Record<AttrKey, number | null>>({
  mov: null, fue: null, agi: null, tec: null, res: null, men: null,
})
const selectedPoolIdx = ref(-1)

// Inicializar desde el borrador del wizard si ya había datos
if (char.wizardDraft.attrs) {
  const vals = Object.values(char.wizardDraft.attrs) as number[]
  if (vals.every(v => v > 0) && vals.length === 6) {
    for (const a of ATTR_DEFS) {
      assignments.value[a.key] = char.wizardDraft.attrs[a.key]
    }
    pool.value = []
  }
}

const raza    = computed(() => char.raza)
const allDone = computed(() => ATTR_DEFS.every(a => assignments.value[a.key] !== null))

function maxFor(key: AttrKey) {
  if (!raza.value) return 9
  return getMaxAttrBase(1, raza.value, key)
}
function minFor(key: AttrKey) {
  return raza.value?.minima[key] ?? 0
}

function pickFromPool(i: number) {
  selectedPoolIdx.value = i === selectedPoolIdx.value ? -1 : i
}

function assignOrUnassign(key: AttrKey) {
  if (selectedPoolIdx.value >= 0) {
    // Asignar chip seleccionado al slot
    const val = pool.value[selectedPoolIdx.value]!
    const prev = assignments.value[key]
    if (prev !== null) {
      pool.value.push(prev)
      pool.value.sort((a, b) => b - a)
    }
    assignments.value[key] = val
    pool.value.splice(selectedPoolIdx.value, 1)
    selectedPoolIdx.value = -1
  } else if (assignments.value[key] !== null) {
    // Desasignar: devolver al pool
    pool.value.push(assignments.value[key]!)
    pool.value.sort((a, b) => b - a)
    assignments.value[key] = null
  }
}

function siguiente() {
  if (!allDone.value) return
  const attrs = Object.fromEntries(
    ATTR_DEFS.map(a => [a.key, assignments.value[a.key]!])
  ) as Attrs
  char.setWizardAttrs(attrs)
  ui.next()
}

function reset() {
  pool.value = [...INITIAL_ATTRS].sort((a, b) => b - a)
  for (const a of ATTR_DEFS) assignments.value[a.key] = null
  selectedPoolIdx.value = -1
}
</script>

<template>
  <div class="flex flex-col h-full">

    <div class="px-6 py-4 border-b border-stone-800">
      <h2 class="text-amber-400 font-bold text-lg">Reparte tus atributos</h2>
      <p class="text-stone-500 text-sm mt-1">
        Asigna los valores disponibles a los 6 atributos. Haz clic en un valor y luego en un atributo.
      </p>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">

      <!-- Pool de valores disponibles -->
      <div>
        <p class="text-stone-500 text-xs uppercase tracking-wide mb-2">Valores disponibles</p>
        <div class="flex gap-2 flex-wrap">
          <template v-if="pool.length === 0">
            <span class="text-stone-700 text-sm italic">Todos asignados</span>
          </template>
          <button
            v-for="(v, i) in pool" :key="i"
            @click="pickFromPool(i)"
            class="w-10 h-10 rounded font-bold text-lg transition-all"
            :class="selectedPoolIdx === i
              ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300'
              : 'bg-stone-700 text-stone-100 hover:bg-stone-600'"
          >{{ v }}</button>
        </div>
      </div>

      <!-- Filas de atributos -->
      <div class="space-y-1">
        <div v-for="a in ATTR_DEFS" :key="a.key"
          class="flex items-center gap-4 py-2 border-b border-stone-800/60">

          <span class="w-28 text-stone-300 text-sm">{{ a.name }}</span>

          <!-- Slot de valor -->
          <button
            @click="assignOrUnassign(a.key)"
            class="w-12 h-10 rounded border text-lg font-bold transition-all"
            :class="assignments[a.key] !== null
              ? 'border-amber-500/70 text-amber-400 bg-stone-800 hover:border-red-500/70'
              : selectedPoolIdx >= 0
                ? 'border-stone-500 border-dashed text-stone-600 bg-stone-900 hover:border-amber-400'
                : 'border-stone-700 text-stone-700 bg-stone-950 cursor-default'"
            :title="assignments[a.key] !== null ? 'Clic para devolver al pool' : 'Selecciona un valor del pool primero'"
          >{{ assignments[a.key] ?? '—' }}</button>

          <!-- Hints -->
          <div class="text-xs text-stone-600 flex gap-3">
            <span v-if="minFor(a.key) > 0" class="text-amber-800">mín {{ minFor(a.key) }}</span>
            <span>máx {{ maxFor(a.key) }}</span>
          </div>

          <!-- Advertencia si viola mínimo racial -->
          <span v-if="assignments[a.key] !== null && assignments[a.key]! < minFor(a.key)"
            class="text-red-400 text-xs">⚠ mínimo racial</span>
        </div>
      </div>

    </div>

    <!-- Barra de navegación -->
    <div class="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950">
      <div class="flex gap-2">
        <button @click="ui.back()" class="btn-ghost">← Atrás</button>
        <button @click="reset" class="btn-ghost text-xs">↺ Reiniciar</button>
      </div>
      <button @click="siguiente" :disabled="!allDone"
        class="btn-primary" :class="!allDone ? 'opacity-50 cursor-not-allowed' : ''">
        Siguiente →
      </button>
    </div>

  </div>
</template>

<style scoped>
@reference "../style.css";
.btn-primary { @apply bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded px-5 py-2 text-sm transition-colors; }
.btn-ghost   { @apply border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 rounded px-4 py-2 text-sm transition-colors; }
</style>

<script setup lang="ts">
// Documento generado el 2026-07-05-0914
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { ATTR_DEFS, INITIAL_ATTRS } from '@/data/config'
import { getMaxAttrBase } from '@/rules/helpers'
import { remainingPool, isValidAssignment } from '@/rules/pool'
import type { AttrKey, Attrs } from '@/rules/types'

const ui   = useUiStore()
const char = useCharacterStore()

// Asignaciones: null = sin asignar. En el borrador del store, 0 = sin asignar.
const assignments = ref<Record<AttrKey, number | null>>({
  mov: null, fue: null, agi: null, tec: null, res: null, men: null,
})

// Restaurar del borrador (asignaciones parciales incluidas), solo si es coherente
{
  const draft = ATTR_DEFS.map(a => char.wizardDraft.attrs[a.key] || null)
  if (isValidAssignment(INITIAL_ATTRS, draft)) {
    ATTR_DEFS.forEach((a, i) => { assignments.value[a.key] = draft[i] ?? null })
  }
}

/**
 * El pool disponible se DERIVA de lo asignado (diferencia multiconjunto).
 * Nunca se muta a mano: al reasignar un slot ocupado, el valor anterior
 * vuelve al pool automáticamente y no puede perderse ni duplicarse.
 */
const pool = computed(() =>
  remainingPool(INITIAL_ATTRS, ATTR_DEFS.map(a => assignments.value[a.key]))
)
const selectedPoolIdx = ref(-1)

const raza    = computed(() => char.raza)
const allDone = computed(() => ATTR_DEFS.every(a => assignments.value[a.key] !== null))

function maxFor(key: AttrKey) {
  if (!raza.value) return 9
  return getMaxAttrBase(1, raza.value, key)
}
function minFor(key: AttrKey) {
  return raza.value?.minima[key] ?? 0
}

/** Cada cambio se persiste en el borrador del wizard (0 = sin asignar) */
function persistDraft() {
  const attrs = Object.fromEntries(
    ATTR_DEFS.map(a => [a.key, assignments.value[a.key] ?? 0])
  ) as Attrs
  char.setWizardAttrs(attrs)
}

function pickFromPool(i: number) {
  selectedPoolIdx.value = i === selectedPoolIdx.value ? -1 : i
}

function assignOrUnassign(key: AttrKey) {
  if (selectedPoolIdx.value >= 0) {
    const val = pool.value[selectedPoolIdx.value]
    if (val === undefined) { selectedPoolIdx.value = -1; return }
    assignments.value[key] = val
    selectedPoolIdx.value = -1
  } else if (assignments.value[key] !== null) {
    assignments.value[key] = null
  }
  persistDraft()
}

function siguiente() {
  if (!allDone.value) return
  persistDraft()
  ui.next()
}

function reset() {
  for (const a of ATTR_DEFS) assignments.value[a.key] = null
  selectedPoolIdx.value = -1
  persistDraft()
}
</script>

<template>
  <div class="flex flex-col h-full">

    <div class="px-6 py-4 border-b border-stone-800">
      <h2 class="text-amber-400 font-bold text-lg">Reparte tus atributos</h2>
      <p class="text-stone-500 text-sm mt-1">
        Asigna los valores disponibles a los 6 atributos. Haz clic en un valor y luego en un atributo.
        Pasa el ratón por el nombre de cada atributo para ver qué hace.
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

          <span
            class="w-28 text-stone-300 text-sm underline decoration-dotted decoration-stone-600 underline-offset-4 cursor-help"
            :title="a.desc"
          >{{ a.name }}</span>

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

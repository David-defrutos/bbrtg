<script setup lang="ts">
// Documento generado el 2026-07-04-2230
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { SKILL_DEFS, ATTR_DEFS, INITIAL_SKILLS } from '@/data/config'
import type { SkillKey, Skills } from '@/rules/types'

const ui   = useUiStore()
const char = useCharacterStore()

const pool        = ref<number[]>([...INITIAL_SKILLS].sort((a, b) => b - a))
const assignments = ref<Record<SkillKey, number | null>>({
  correr: null, placar: null, evasion: null, balon: null, aguantar: null, voluntad: null,
})
const selectedPoolIdx = ref(-1)

// Inicializar desde borrador si ya había datos
if (char.wizardDraft.skills) {
  const vals = Object.values(char.wizardDraft.skills) as number[]
  if (vals.length === 6) {
    for (const s of SKILL_DEFS) {
      assignments.value[s.key] = char.wizardDraft.skills[s.key]
    }
    pool.value = []
  }
}

const allDone = computed(() => SKILL_DEFS.every(s => assignments.value[s.key] !== null))

// Nombre del atributo emparejado para mostrar hint
function attrName(skillKey: SkillKey) {
  const attrKey = SKILL_DEFS.find(s => s.key === skillKey)?.attr
  return ATTR_DEFS.find(a => a.key === attrKey)?.name ?? ''
}

function pickFromPool(i: number) {
  selectedPoolIdx.value = i === selectedPoolIdx.value ? -1 : i
}

function assignOrUnassign(key: SkillKey) {
  if (selectedPoolIdx.value >= 0) {
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
    pool.value.push(assignments.value[key]!)
    pool.value.sort((a, b) => b - a)
    assignments.value[key] = null
  }
}

function siguiente() {
  if (!allDone.value) return
  const skills = Object.fromEntries(
    SKILL_DEFS.map(s => [s.key, assignments.value[s.key]!])
  ) as Skills
  char.setWizardSkills(skills)
  ui.next()
}

function reset() {
  pool.value = [...INITIAL_SKILLS].sort((a, b) => b - a)
  for (const s of SKILL_DEFS) assignments.value[s.key] = null
  selectedPoolIdx.value = -1
}
</script>

<template>
  <div class="flex flex-col h-full">

    <div class="px-6 py-4 border-b border-stone-800">
      <h2 class="text-amber-400 font-bold text-lg">Reparte tus habilidades</h2>
      <p class="text-stone-500 text-sm mt-1">
        Cada habilidad está emparejada con un atributo (se usan juntos en las tiradas).
      </p>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-6">

      <!-- Pool -->
      <div>
        <p class="text-stone-500 text-xs uppercase tracking-wide mb-2">Valores disponibles</p>
        <div class="flex gap-2 flex-wrap">
          <span v-if="pool.length === 0" class="text-stone-700 text-sm italic">Todos asignados</span>
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

      <!-- Filas de habilidades -->
      <div class="space-y-1">
        <div v-for="s in SKILL_DEFS" :key="s.key"
          class="flex items-center gap-4 py-2 border-b border-stone-800/60">

          <span class="w-28 text-stone-300 text-sm">{{ s.name }}</span>

          <button
            @click="assignOrUnassign(s.key)"
            class="w-12 h-10 rounded border text-lg font-bold transition-all"
            :class="assignments[s.key] !== null
              ? 'border-amber-500/70 text-amber-400 bg-stone-800 hover:border-red-500/70'
              : selectedPoolIdx >= 0
                ? 'border-stone-500 border-dashed text-stone-600 bg-stone-900 hover:border-amber-400'
                : 'border-stone-700 text-stone-700 bg-stone-950 cursor-default'"
          >{{ assignments[s.key] ?? '—' }}</button>

          <span class="text-xs text-stone-600">({{ attrName(s.key) }})</span>
        </div>
      </div>

    </div>

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

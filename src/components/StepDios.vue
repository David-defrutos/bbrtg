<script setup lang="ts">
// Documento generado el 2026-07-04-2230
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { GODS } from '@/data/gods'
import { ATTR_DEFS, SKILL_DEFS } from '@/data/config'

const ui   = useUiStore()
const char = useCharacterStore()

const selectedId = ref<string | null>(char.wizardDraft.god)

function attrName(key: string) { return ATTR_DEFS.find(a => a.key === key)?.name ?? key }
function skillName(key: string) { return SKILL_DEFS.find(s => s.key === key)?.name ?? key }

function elegir() {
  char.setWizardGod(selectedId.value)
  char.commitLevel1()
  ui.goTo('plan')
}

function omitir() {
  char.setWizardGod(null)
  char.commitLevel1()
  ui.goTo('plan')
}
</script>

<template>
  <div class="flex flex-col h-full">

    <div class="px-6 py-4 border-b border-stone-800">
      <h2 class="text-amber-400 font-bold text-lg">Patrono divino</h2>
      <p class="text-stone-500 text-sm mt-1">
        Elige un dios. Esto es opcional — puedes empezar sin patrono y elegir más adelante en el plan.
      </p>
    </div>

    <div class="flex-1 overflow-y-auto p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="god in GODS" :key="god.id"
          @click="selectedId = selectedId === god.id ? null : god.id"
          class="rounded-lg border p-4 text-left transition-all"
          :class="selectedId === god.id
            ? 'border-amber-500 bg-stone-800'
            : 'border-stone-700 bg-stone-900 hover:border-stone-500'"
        >
          <div class="font-semibold text-stone-100 mb-1">{{ god.name }}</div>
          <div class="text-xs text-stone-500 space-y-0.5">
            <div>
              <span class="text-stone-600">Rezar: </span>
              <span class="text-stone-400">{{ attrName(god.rezarAttrs[0]) }} · {{ attrName(god.rezarAttrs[1]) }} · {{ skillName(god.rezarSkill) }}</span>
            </div>
            <div>
              <span class="text-stone-600">Dominios: </span>
              <span class="text-stone-400">{{ god.domains.join(', ') }}</span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950">
      <button @click="ui.back()" class="btn-ghost">← Atrás</button>
      <div class="flex gap-2">
        <button @click="omitir" class="btn-ghost">Omitir por ahora</button>
        <button @click="elegir" :disabled="!selectedId"
          class="btn-primary" :class="!selectedId ? 'opacity-50 cursor-not-allowed' : ''">
          Confirmar →
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
@reference "../style.css";
.btn-primary { @apply bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded px-5 py-2 text-sm transition-colors; }
.btn-ghost   { @apply border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 rounded px-5 py-2 text-sm transition-colors; }
</style>

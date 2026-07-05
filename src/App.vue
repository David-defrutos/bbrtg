<script setup lang="ts">
// Documento generado el 2026-07-05-1655
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import StepInicio    from '@/components/StepInicio.vue'
import StepRaza      from '@/components/StepRaza.vue'
import StepAtributos from '@/components/StepAtributos.vue'
import StepHabilidades from '@/components/StepHabilidades.vue'
import StepDotes     from '@/components/StepDotes.vue'
import StepDios      from '@/components/StepDios.vue'
import StepPlan      from '@/components/StepPlan.vue'
import StepFicha     from '@/components/StepFicha.vue'

const ui   = useUiStore()
const char = useCharacterStore()

// El paso se persiste; si quedó apuntando a un paso sin personaje detrás
// (p. ej. localStorage borrado a medias), vuelve a inicio en vez de romper.
if (!char.character && ui.step !== 'inicio') ui.goTo('inicio')

const STEP_LABELS: Record<string, string> = {
  raza: 'Raza', atributos: 'Atributos', habilidades: 'Habilidades',
  dotes: 'Dotes', dios: 'Dios', plan: 'Plan',
}

const inWizard = computed(() =>
  ['raza','atributos','habilidades','dotes','dios'].includes(ui.step)
)

function toggleTheme() {
  const el = document.documentElement
  el.dataset['theme'] = el.dataset['theme'] === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div class="flex flex-col min-h-screen">

    <!-- ── Cabecera ──────────────────────────────────────────────────────── -->
    <header class="flex items-center gap-3 px-4 h-12 bg-stone-900 border-b border-stone-800 flex-shrink-0">
      <button @click="ui.goTo('inicio')" class="text-amber-400 font-bold tracking-wide text-sm hover:text-amber-300">
        BBRTG
      </button>

      <!-- Breadcrumbs del asistente -->
      <nav v-if="inWizard" class="flex items-center gap-1 text-xs text-stone-500">
        <template v-for="s in ui.WIZARD_STEPS.slice(0, 5)" :key="s">
          <span class="mx-1 text-stone-700">›</span>
          <span :class="ui.step === s ? 'text-amber-400 font-semibold' : 'hover:text-stone-300 cursor-pointer'"
            @click="ui.step === s ? null : undefined">
            {{ STEP_LABELS[s] }}
          </span>
        </template>
      </nav>

      <!-- Nombre del personaje en el plan -->
      <span v-if="ui.step === 'plan' && char.character" class="text-stone-400 text-sm ml-2">
        {{ char.character.nombre }}
        <span class="text-stone-600 mx-1">·</span>
        <span class="text-stone-500">{{ char.raza?.name }}</span>
        <span class="text-stone-600 mx-1">·</span>
        <span class="text-stone-500">Nv.{{ char.character.nivelActual }}</span>
      </span>

      <div class="ml-auto flex items-center gap-3">
        <!-- Errores globales -->
        <span v-if="char.validation && !char.validation.ok" class="text-red-400 text-xs">
          ⚠ {{ char.validation.errors.length }} error{{ char.validation.errors.length > 1 ? 'es' : '' }}
        </span>
        <!-- Tema -->
        <button @click="toggleTheme" class="text-stone-600 hover:text-stone-400 text-lg" title="Cambiar tema">☀</button>
      </div>
    </header>

    <!-- ── Contenido del paso actual ────────────────────────────────────── -->
    <main class="flex-1 min-h-0 overflow-hidden">
      <StepInicio     v-if="ui.step === 'inicio'"      />
      <StepRaza       v-else-if="ui.step === 'raza'"   />
      <StepAtributos  v-else-if="ui.step === 'atributos'" />
      <StepHabilidades v-else-if="ui.step === 'habilidades'" />
      <StepDotes      v-else-if="ui.step === 'dotes'"  />
      <StepDios       v-else-if="ui.step === 'dios'"   />
      <StepPlan       v-else-if="ui.step === 'plan'"   />
      <StepFicha      v-else-if="ui.step === 'ficha'"  />
      <div v-else class="p-8 text-stone-500">Paso desconocido: {{ ui.step }}</div>
    </main>

    <!-- ── Toast de deshacer (última operación destructiva) ─────────────── -->
    <div
      v-if="char.undoBuffer"
      class="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-stone-700
             bg-stone-900 px-4 py-2.5 shadow-lg shadow-black/40"
    >
      <span class="text-stone-400 text-sm">{{ char.undoBuffer.label }}</span>
      <button
        class="text-amber-400 hover:text-amber-300 text-sm font-semibold transition-colors"
        @click="char.undo()"
      >↶ Deshacer</button>
      <button
        class="text-stone-600 hover:text-stone-400 text-sm transition-colors"
        title="Descartar (no se podrá deshacer)"
        @click="char.clearUndo()"
      >✕</button>
    </div>

  </div>
</template>

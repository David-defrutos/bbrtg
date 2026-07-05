<script setup lang="ts">
// Documento generado el 2026-07-05-1655
import { ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'

const ui   = useUiStore()
const char = useCharacterStore()

const nombre = ref(char.character?.nombre ?? '')
const importError = ref('')
const importWarnings = ref<string[]>([])

function crear() {
  if (!nombre.value.trim()) return
  char.initCharacter(nombre.value.trim(), '')
  ui.goTo('raza')
}

/**
 * «Nuevo personaje» borra el guardado. Confirmación + copia JSON automática
 * (el buffer de deshacer no sobrevive a un F5) antes de destruir nada.
 */
function nuevoPersonaje() {
  if (!char.character) return
  if (!window.confirm(
    `¿Borrar a «${char.character.nombre}» con todo su plan para empezar de cero?\n` +
    'Se descargará una copia JSON y podrás deshacer desde el aviso inferior.'
  )) return
  char.triggerDownload()
  char.reset()
}

function onImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    importError.value = ''
    importWarnings.value = []
    try {
      const warnings = char.importJSON(ev.target?.result as string)
      if (warnings.length > 0) {
        // Señalar antes de continuar: el usuario decide si el personaje le vale
        importWarnings.value = warnings
      } else {
        ui.goTo('plan')
      }
    } catch (err) {
      importError.value = err instanceof Error ? err.message : 'JSON inválido o formato no reconocido.'
    }
  }
  reader.readAsText(file)
}

function continuarConAvisos() {
  importWarnings.value = []
  ui.goTo('plan')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-full p-8">
    <div class="w-full max-w-md space-y-6">

      <div class="text-center">
        <h1 class="text-3xl font-bold text-amber-400 tracking-wide">Blood Bowl</h1>
        <p class="text-stone-400 mt-1">Rise to Glory — Generador de fichas v0.30</p>
      </div>

      <!-- Continuar personaje guardado -->
      <div v-if="char.character" class="rounded-lg border border-stone-700 bg-stone-900 p-4">
        <p class="text-stone-300 text-sm mb-3">
          Personaje guardado: <span class="text-amber-400 font-semibold">{{ char.character.nombre }}</span>
          <span class="text-stone-500 ml-2">({{ char.raza?.name }}, Nv.{{ char.character.nivelActual }})</span>
        </p>
        <div class="flex gap-2">
          <button @click="ui.goTo('plan')" class="btn-primary flex-1">Continuar</button>
          <button @click="nuevoPersonaje"
            title="Borrar el personaje guardado (con confirmación y copia JSON)"
            class="btn-ghost">Nuevo personaje</button>
        </div>
      </div>

      <!-- Crear nuevo personaje -->
      <div v-if="!char.character" class="space-y-4">
        <div>
          <label class="block text-stone-400 text-sm mb-1">Nombre del personaje</label>
          <input
            v-model="nombre"
            @keyup.enter="crear"
            placeholder="Nombre…"
            class="w-full bg-stone-800 border border-stone-700 rounded px-3 py-2 text-stone-100
                   focus:border-amber-500 focus:outline-none"
          />
        </div>
        <button @click="crear" :disabled="!nombre.trim()"
          class="btn-primary w-full" :class="!nombre.trim() ? 'opacity-50 cursor-not-allowed' : ''">
          Crear personaje →
        </button>
      </div>

      <!-- Importar JSON -->
      <div class="border-t border-stone-800 pt-4">
        <p class="text-stone-500 text-xs mb-2">O importa un personaje existente:</p>
        <label class="cursor-pointer inline-flex items-center gap-2 text-stone-400 hover:text-stone-200 text-sm">
          <span class="btn-ghost text-xs">Importar .bbrtg.json</span>
          <input type="file" accept=".json,.bbrtg.json" @change="onImport" class="sr-only" />
        </label>
        <p v-if="importError" class="text-red-400 text-xs mt-2">{{ importError }}</p>

        <!-- Avisos de importación: personaje utilizable pero sospechoso -->
        <div v-if="importWarnings.length > 0"
          class="mt-3 rounded border border-amber-800/60 bg-amber-950/30 p-3 space-y-2">
          <p class="text-amber-500 text-xs font-semibold">Importado con avisos:</p>
          <ul class="space-y-1">
            <li v-for="(w, i) in importWarnings" :key="i" class="text-amber-600/90 text-xs">· {{ w }}</li>
          </ul>
          <button @click="continuarConAvisos" class="btn-primary w-full text-xs">Continuar de todos modos →</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@reference "../style.css";
.btn-primary {
  @apply bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded px-4 py-2 text-sm transition-colors;
}
.btn-ghost {
  @apply border border-stone-700 hover:border-stone-500 text-stone-400 hover:text-stone-200 rounded px-4 py-2 text-sm transition-colors;
}
</style>

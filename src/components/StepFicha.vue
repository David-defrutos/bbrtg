<script setup lang="ts">
// Documento generado el 2026-07-05-1040
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { buildSheetHTML } from '@/export/sheet'

const ui   = useUiStore()
const char = useCharacterStore()

// La ficha de mesa se pliega al nivelActual (cursor "jugar aquí" del plan)
const html = computed((): string | null => {
  if (!char.character || !char.raza) return null
  if (!char.character.plan.find(e => e.nivel === 1)) return null
  return buildSheetHTML(char.character, char.raza)
})

function imprimir() {
  const frame = document.getElementById('ficha-frame') as HTMLIFrameElement | null
  frame?.contentWindow?.print()
}
</script>

<template>
  <div class="flex flex-col h-full">

    <div class="flex items-center justify-between px-4 py-2 border-b border-stone-800 bg-stone-950 flex-shrink-0">
      <div class="text-sm">
        <span class="text-amber-400 font-bold">Ficha — {{ char.character?.nombre }}</span>
        <span class="text-stone-500 ml-2">nivel {{ char.character?.nivelActual }}</span>
        <span class="text-stone-600 text-xs ml-2">(el nivel se cambia con «Jugar aquí» en el plan)</span>
      </div>
      <div class="flex gap-2">
        <button @click="ui.goTo('plan')" class="btn-sm">← Volver al plan</button>
        <button @click="char.triggerSheetDownload()" class="btn-sm">↓ Descargar HTML</button>
        <button @click="imprimir" class="btn-primary-sm">🖨 Imprimir / PDF</button>
      </div>
    </div>

    <iframe
      v-if="html"
      id="ficha-frame"
      :srcdoc="html"
      class="flex-1 w-full border-0 bg-white"
      title="Ficha de personaje"
    />
    <p v-else class="p-8 text-stone-500 italic">
      No hay personaje con nivel 1 completado; termina el asistente de creación primero.
    </p>

  </div>
</template>

<style scoped>
@reference "../style.css";
.btn-sm {
  @apply bg-stone-800 border border-stone-700 hover:border-stone-500 text-stone-400
         hover:text-stone-200 rounded px-3 py-1.5 text-xs transition-colors;
}
.btn-primary-sm {
  @apply bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded px-3 py-1.5 text-xs transition-colors;
}
</style>

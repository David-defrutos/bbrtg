<script setup lang="ts">
// Documento generado el 2026-07-04-2230
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { FEATS } from '@/data/feats'
import { GODS } from '@/data/gods'
import { ATTR_DEFS, SKILL_DEFS } from '@/data/config'
import { LEVEL_CALENDAR, ATTR_DICE_TABLE, SKILL_TABLE } from '@/data/tables'
import { checkPrereq } from '@/rules/helpers'
import type { AttrKey, SkillKey, LevelNDelta, CharState } from '@/rules/types'

const ui   = useUiStore()
const char = useCharacterStore()

// Todos los estados niveles 1..30, indexado por nivel (índice 0 = placeholder null)
const allStates = computed((): (CharState | null)[] => {
  const arr: (CharState | null)[] = [null]
  for (let n = 1; n <= 30; n++) {
    arr.push(char.stateAt(n))
  }
  return arr
})

const panelState = computed((): CharState | null =>
  allStates.value[ui.nivelVista] ?? null
)

const errorsAt = computed(() => {
  const map = new Map<number, string[]>()
  const v = char.validation
  if (!v) return map
  for (const e of v.errors) {
    if (!map.has(e.nivel)) map.set(e.nivel, [])
    map.get(e.nivel)!.push(e.message)
  }
  return map
})

function reward(n: number) {
  return LEVEL_CALENDAR[n - 1]!
}

function getDelta(n: number): LevelNDelta | undefined {
  return char.character?.plan.find(
    (e): e is LevelNDelta => e.nivel === n && e.nivel !== 1
  )
}

function onSkillChange(n: number, val: string) {
  if (!val) { char.removeLevelEntry(n); return }
  const ex = getDelta(n)
  char.setLevelDelta({
    nivel: n,
    skillSubida: val as SkillKey,
    attrSubida:  ex?.attrSubida,
    featGanada:  ex?.featGanada,
    god:         ex?.god,
  })
}

function onAttrChange(n: number, val: string) {
  const ex = getDelta(n)
  if (!ex) return
  char.setLevelDelta({ ...ex, attrSubida: (val as AttrKey) || undefined })
}

function onFeatChange(n: number, val: string) {
  const ex = getDelta(n)
  if (!ex) return
  char.setLevelDelta({ ...ex, featGanada: val || undefined })
}

function onGodChange(n: number, val: string) {
  const ex = getDelta(n)
  if (!ex) return
  char.setLevelDelta({ ...ex, god: val || undefined })
}

function availableFeats(n: number) {
  const prev = allStates.value[n - 1]
  const cur  = getDelta(n)?.featGanada
  return FEATS.filter(f => {
    if (prev && prev.feats.includes(f.id) && f.id !== cur) return false
    if (!prev) return true
    return f.prereqs.every(p => checkPrereq(p, prev))
  })
}

function needsGodChoice(n: number): boolean {
  const prev = allStates.value[n - 1] ?? null
  return prev !== null && prev.god === null
}

function attrDice(val: number): number {
  return ATTR_DICE_TABLE.find(r => val >= r.minAttr && val <= r.maxAttr)?.dice ?? 1
}

function skillMeta(val: number) {
  return SKILL_TABLE.find(r => r.skill === val)
}

function godName(id: string) {
  return GODS.find(g => g.id === id)?.name ?? id
}
function featName(id: string) {
  return FEATS.find(f => f.id === id)?.name ?? id
}
function featChain(id: string) {
  return FEATS.find(f => f.id === id)?.chain ?? ''
}
</script>

<template>
  <div class="flex h-full overflow-hidden">

    <!-- ── Tabla de planificación (izquierda) ────────────────────────── -->
    <div class="flex flex-col flex-1 min-w-0 border-r border-stone-800">

      <!-- Cabecera -->
      <div class="px-4 py-2 border-b border-stone-800 bg-stone-950 flex items-center justify-between flex-shrink-0">
        <h2 class="text-amber-400 font-bold text-sm">Planificación — {{ char.character?.nombre }}</h2>
        <button @click="char.triggerDownload()" class="btn-sm">↓ Exportar JSON</button>
      </div>

      <!-- Banner de validación -->
      <div v-if="char.validation && !char.validation.ok"
        class="px-4 py-1.5 bg-red-950/60 border-b border-red-900/60 text-red-400 text-xs flex-shrink-0">
        ⚠ {{ char.validation.errors.length }} error(es) en el plan
      </div>
      <div v-else-if="char.validation?.ok"
        class="px-4 py-1.5 bg-green-950/40 border-b border-green-900/40 text-green-500 text-xs flex-shrink-0">
        ✓ Plan válido
      </div>

      <!-- Cabecera de columnas -->
      <div class="plan-grid px-3 py-1 border-b border-stone-800 bg-stone-900 flex-shrink-0">
        <span class="col-lv text-stone-600 text-xs font-semibold uppercase tracking-wide">Nv.</span>
        <span class="text-stone-600 text-xs font-semibold uppercase tracking-wide">Habilidad</span>
        <span class="text-stone-600 text-xs font-semibold uppercase tracking-wide">Atributo</span>
        <span class="text-stone-600 text-xs font-semibold uppercase tracking-wide">Dote</span>
        <span class="text-stone-600 text-xs font-semibold uppercase tracking-wide">Dios</span>
        <span></span>
      </div>

      <!-- Filas (scroll) -->
      <div class="flex-1 overflow-auto">
        <div class="min-w-max">

          <!-- Nivel 1: solo lectura -->
          <div
            class="plan-grid px-3 py-2 border-b border-stone-800/60 cursor-pointer transition-colors"
            :class="ui.nivelVista === 1 ? 'bg-stone-800/40' : 'hover:bg-stone-900/60'"
            @click="ui.setNivelVista(1)"
          >
            <span class="col-lv flex items-center gap-1">
              <span v-if="char.character?.nivelActual === 1" class="text-amber-400 text-xs leading-none">▶</span>
              <span class="font-mono text-sm" :class="char.character?.nivelActual === 1 ? 'text-amber-400' : 'text-stone-400'">1</span>
            </span>
            <span class="text-stone-500 text-xs italic">Creación</span>
            <span></span>
            <span></span>
            <span></span>
            <span v-if="errorsAt.get(1)?.length" class="text-red-400 text-xs" :title="errorsAt.get(1)?.join('\n')">⚠</span>
            <span v-else></span>
          </div>

          <!-- Niveles 2..30 -->
          <div
            v-for="n in 29" :key="n + 1"
            class="plan-grid px-3 py-1.5 border-b border-stone-800/40 transition-colors"
            :class="ui.nivelVista === n + 1 ? 'bg-stone-800/40' : 'hover:bg-stone-900/40'"
          >
            <!-- Número de nivel -->
            <button
              class="col-lv flex items-center gap-1 hover:text-amber-400 transition-colors"
              @click="ui.setNivelVista(n + 1)"
            >
              <span v-if="char.character?.nivelActual === n + 1" class="text-amber-400 text-xs leading-none">▶</span>
              <span class="font-mono text-sm"
                :class="char.character?.nivelActual === n + 1 ? 'text-amber-400' : 'text-stone-500'">{{ n + 1 }}</span>
            </button>

            <!-- Habilidad (siempre) -->
            <select
              :value="getDelta(n + 1)?.skillSubida ?? ''"
              @change="e => onSkillChange(n + 1, (e.target as HTMLSelectElement).value)"
              class="sel"
            >
              <option value="">—</option>
              <option v-for="s in SKILL_DEFS" :key="s.key" :value="s.key">{{ s.name }}</option>
            </select>

            <!-- Atributo (solo en niveles gainAttr) -->
            <select
              v-if="reward(n + 1).gainAttr"
              :value="getDelta(n + 1)?.attrSubida ?? ''"
              :disabled="!getDelta(n + 1)"
              @change="e => onAttrChange(n + 1, (e.target as HTMLSelectElement).value)"
              class="sel"
              :class="!getDelta(n + 1) ? 'opacity-40' : ''"
            >
              <option value="">—</option>
              <option v-for="a in ATTR_DEFS" :key="a.key" :value="a.key">{{ a.name }}</option>
            </select>
            <span v-else class="text-stone-800 text-center text-xs">·</span>

            <!-- Dote (solo en niveles gainFeat) -->
            <select
              v-if="reward(n + 1).gainFeat"
              :value="getDelta(n + 1)?.featGanada ?? ''"
              :disabled="!getDelta(n + 1)"
              @change="e => onFeatChange(n + 1, (e.target as HTMLSelectElement).value)"
              class="sel"
              :class="[!getDelta(n + 1) ? 'opacity-40' : '', reward(n + 1).legendary ? 'border-amber-700/50' : '']"
            >
              <option value="">—{{ reward(n + 1).legendary ? ' (legendaria)' : '' }}</option>
              <option v-for="f in availableFeats(n + 1)" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
            <span v-else class="text-stone-800 text-center text-xs">·</span>

            <!-- Dios (si aún no tiene patrono) -->
            <select
              v-if="needsGodChoice(n + 1)"
              :value="getDelta(n + 1)?.god ?? ''"
              :disabled="!getDelta(n + 1)"
              @change="e => onGodChange(n + 1, (e.target as HTMLSelectElement).value)"
              class="sel"
              :class="!getDelta(n + 1) ? 'opacity-40' : ''"
            >
              <option value="">—</option>
              <option v-for="g in GODS" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
            <span v-else class="text-stone-800 text-center text-xs">·</span>

            <!-- Error -->
            <span
              v-if="errorsAt.get(n + 1)?.length"
              class="text-red-400 text-xs flex items-center justify-center cursor-help"
              :title="errorsAt.get(n + 1)?.join('\n')"
            >⚠</span>
            <span v-else></span>
          </div>

        </div>
      </div>

    </div>

    <!-- ── Panel de estadísticas (derecha) ───────────────────────────── -->
    <div class="w-72 flex-shrink-0 flex flex-col overflow-hidden border-l border-stone-800">

      <!-- Cabecera del panel -->
      <div class="px-4 py-3 border-b border-stone-800 bg-stone-950 flex items-center justify-between flex-shrink-0">
        <div>
          <span class="text-amber-400 font-bold">Nivel {{ ui.nivelVista }}</span>
          <span v-if="char.character?.nivelActual === ui.nivelVista" class="text-xs text-amber-700 ml-2">jugando</span>
        </div>
        <button
          v-if="char.character?.nivelActual !== ui.nivelVista"
          @click="char.setNivelActual(ui.nivelVista)"
          class="text-xs text-stone-600 hover:text-amber-400 transition-colors"
        >▶ Jugar aquí</button>
      </div>

      <div class="flex-1 overflow-y-auto">
        <template v-if="panelState">
          <div class="p-4 space-y-4">

            <!-- Atributos -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-2">Atributos</p>
              <div class="space-y-1">
                <div v-for="a in ATTR_DEFS" :key="a.key" class="flex justify-between items-center text-sm">
                  <span class="text-stone-400">{{ a.name }}</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-stone-200 w-5 text-right">{{ panelState.attrs[a.key] }}</span>
                    <span class="text-stone-600 text-xs w-8">{{ attrDice(panelState.attrs[a.key]) }}d10</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Habilidades -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-2">Habilidades</p>
              <div class="space-y-1">
                <div v-for="s in SKILL_DEFS" :key="s.key" class="flex justify-between items-center text-sm">
                  <span class="text-stone-400 text-xs">{{ s.name }}</span>
                  <div class="flex items-center gap-1 text-xs">
                    <span class="font-mono text-stone-200 w-4 text-right">{{ panelState.skills[s.key] }}</span>
                    <template v-if="skillMeta(panelState.skills[s.key]) as any">
                      <span class="text-stone-600">≥{{ skillMeta(panelState.skills[s.key])!.threshold }}</span>
                      <span v-if="skillMeta(panelState.skills[s.key])!.rerolls > 0" class="text-stone-700">
                        +{{ skillMeta(panelState.skills[s.key])!.rerolls }}r
                      </span>
                      <span v-if="skillMeta(panelState.skills[s.key])!.auxDie" class="text-stone-700">
                        +d{{ skillMeta(panelState.skills[s.key])!.auxDie }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dotes -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-2">Dotes ({{ panelState.feats.length }})</p>
              <div class="space-y-1.5">
                <div v-for="fid in panelState.feats" :key="fid">
                  <span class="text-stone-300 text-xs">{{ featName(fid) }}</span>
                  <span class="text-stone-600 text-xs ml-1">· {{ featChain(fid) }}</span>
                </div>
              </div>
            </div>

            <!-- Patrono -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-1">Patrono divino</p>
              <p class="text-sm" :class="panelState.god ? 'text-stone-300' : 'text-stone-700 italic'">
                {{ panelState.god ? godName(panelState.god) : 'Sin patrono' }}
              </p>
            </div>

          </div>
        </template>
        <p v-else class="p-4 text-stone-600 text-sm italic">Sin datos para este nivel.</p>
      </div>

      <!-- Pie del panel: acciones globales -->
      <div class="border-t border-stone-800 p-3 flex-shrink-0 space-y-2">
        <div class="flex gap-2">
          <button @click="char.triggerDownload()" class="btn-sm flex-1">↓ Exportar</button>
          <button @click="char.reset()" class="btn-sm text-red-500 hover:text-red-400">Reiniciar</button>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
@reference "../style.css";
.plan-grid {
  display: grid;
  grid-template-columns: 2.5rem 1fr 1fr 1.4fr 1fr 1.5rem;
  align-items: center;
  gap: 0.25rem;
}
.col-lv {
  /* nada extra, solo para legibilidad */
}
.sel {
  @apply bg-stone-900 border border-stone-700 rounded text-stone-300 text-xs px-1 py-1
         focus:border-amber-500 focus:outline-none w-full min-w-0 truncate;
}
.btn-sm {
  @apply bg-stone-800 border border-stone-700 hover:border-stone-500 text-stone-400
         hover:text-stone-200 rounded px-3 py-1.5 text-xs transition-colors;
}
</style>

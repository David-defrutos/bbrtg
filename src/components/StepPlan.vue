<script setup lang="ts">
// Documento generado el 2026-07-05-1655
import { computed, ref } from 'vue'
import { useUiStore } from '@/stores/ui'
import { useCharacterStore } from '@/stores/character'
import { FEATS } from '@/data/feats'
import { GODS } from '@/data/gods'
import { ATTR_DEFS, SKILL_DEFS } from '@/data/config'
import { LEVEL_CALENDAR, LEVEL_CAPS, ATTR_DICE_TABLE, SKILL_TABLE, DIFFICULTY_TABLE } from '@/data/tables'
import { EQUIPMENT, EQUIPMENT_TYPE_LABELS } from '@/data/equipment'
import { checkPrereq, effectiveAttrs } from '@/rules/helpers'
import { buildProbabilityTable } from '@/rules/probability'
import { fmtPct } from '@/export/sheet'
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

// ── Atributo efectivo (base + objetos) y probabilidades en vivo ──────────

const panelEff = computed(() =>
  panelState.value ? effectiveAttrs(panelState.value.attrs, char.character?.equipo) : null
)

const showProbs = ref(false)
const probRows = computed(() => {
  if (!panelState.value || !panelEff.value) return []
  return buildProbabilityTable({ ...panelState.value, attrs: panelEff.value.attrs })
})

// ── Equipo ────────────────────────────────────────────────────────────────

const equipoAddId = ref('')
function addEquipoSel() {
  if (!equipoAddId.value) return
  char.addEquipo(equipoAddId.value)
  equipoAddId.value = ''
}
function equipoItem(id: string) {
  return EQUIPMENT.find(e => e.id === id)
}

// ── Replanificación y edición del nivel 1 ─────────────────────────────────

function hasEntriesFrom(n: number): boolean {
  return char.character?.plan.some(e => e.nivel >= n) ?? false
}

function replanearDesde(n: number) {
  if (!window.confirm(`¿Descartar el plan desde el nivel ${n} (incluido)?`)) return
  char.replanFrom(n)
  ui.setNivelVista(Math.max(1, n - 1))
}

function editarCreacion() {
  char.beginEditLevel1()
  ui.goTo('atributos')
}

/**
 * Reiniciar = borrar el personaje entero. Confirmación + copia JSON automática
 * (el buffer de deshacer no sobrevive a un F5) antes de destruir nada.
 */
function reiniciar() {
  if (!char.character) return
  if (!window.confirm(
    `¿Reiniciar y borrar a «${char.character.nombre}» con todo su plan?\n` +
    'Se descargará una copia JSON y podrás deshacer desde el aviso inferior.'
  )) return
  char.triggerDownload()
  char.reset()
  ui.goTo('inicio')
}

/** Banda de máximos que EMPIEZA en el nivel n (separador visual del plan) */
function bandAt(n: number) {
  return LEVEL_CAPS.find(b => b.minLevel === n)
}

// ── Importar JSON sin pasar por inicio (sustituye al personaje; deshacible) ──

const importError    = ref('')
const importWarnings = ref<string[]>([])

function onImportFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file  = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ev => {
    importError.value = ''
    importWarnings.value = []
    try {
      importWarnings.value = char.importJSON(ev.target?.result as string)
    } catch (err) {
      importError.value = err instanceof Error ? err.message : 'JSON inválido o formato no reconocido.'
    }
    input.value = '' // permite reimportar el mismo fichero
  }
  reader.readAsText(file)
}

/** Aviso en los selects apagados: el delta del nivel nace al elegir habilidad */
function lockedTitle(n: number): string | undefined {
  return getDelta(n) ? undefined : 'Elige primero la habilidad del nivel ' + n
}

/**
 * Badge de la subida de atributo: '+1d10' si añade dado, '=' si no
 * (pasar de par a impar no aumenta los dados, manual §7.3).
 */
function attrDieBadge(n: number): string | null {
  const d = getDelta(n)
  if (!d?.attrSubida) return null
  const prev = allStates.value[n - 1]
  if (!prev) return null
  const before = prev.attrs[d.attrSubida]
  return attrDice(before + 1) > attrDice(before) ? '+1d10' : '='
}

/** Banner de validación: detalle expandible de cada error del plan */
const showErrorDetail = ref(false)

/** Etiqueta legible del campo donde está el error */
function errorFieldLabel(field: string): string {
  if (field.startsWith('attrs'))       return 'Atributos'
  if (field.startsWith('skills'))      return 'Habilidades'
  if (field === 'attrSubida')          return 'Atributo'
  if (field === 'featGanada' || field === 'featElegida') return 'Dote'
  if (field === 'god')                 return 'Dios'
  return 'Plan'
}

function jumpToLevel(nivel: number) {
  if (nivel >= 1) ui.setNivelVista(nivel)
}

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
        <div class="flex gap-2">
          <button @click="ui.goTo('ficha')" class="btn-sm"
            :title="'Ver e imprimir la ficha al nivel actual (' + char.character?.nivelActual + ')'">
            🖨 Ficha
          </button>
          <button @click="char.triggerSheetDownload()" class="btn-sm"
            :title="'Descargar la ficha HTML al nivel actual (' + char.character?.nivelActual + ')'">
            ↓ HTML
          </button>
          <button @click="char.triggerDownload()" class="btn-sm" title="JSON crudo para depuración e importación">↓ JSON</button>
          <label class="btn-sm cursor-pointer" title="Importar un personaje desde JSON (sustituye al actual; se puede deshacer)">
            ↑ JSON
            <input type="file" accept=".json,.bbrtg.json" @change="onImportFile" class="sr-only" />
          </label>
        </div>
      </div>

      <!-- Resultado de la importación -->
      <div v-if="importError"
        class="px-4 py-1.5 bg-red-950/60 border-b border-red-900/60 text-red-400 text-xs flex items-center justify-between flex-shrink-0">
        <span>✕ Importación rechazada: {{ importError }}</span>
        <button class="text-red-600 hover:text-red-400" @click="importError = ''">✕</button>
      </div>
      <div v-else-if="importWarnings.length > 0"
        class="px-4 py-1.5 bg-amber-950/40 border-b border-amber-900/40 text-xs flex-shrink-0">
        <div class="flex items-center justify-between">
          <span class="text-amber-500 font-semibold">Importado con avisos:</span>
          <button class="text-amber-700 hover:text-amber-500" @click="importWarnings = []">✕</button>
        </div>
        <ul>
          <li v-for="(w, i) in importWarnings" :key="i" class="text-amber-600/90">· {{ w }}</li>
        </ul>
      </div>

      <!-- Banner de validación con detalle de cada error -->
      <div v-if="char.validation && !char.validation.ok"
        class="bg-red-950/60 border-b border-red-900/60 flex-shrink-0">
        <button
          class="w-full text-left px-4 py-1.5 text-red-400 text-xs flex items-center justify-between hover:bg-red-950/80 transition-colors"
          @click="showErrorDetail = !showErrorDetail"
        >
          <span>⚠ {{ char.validation.errors.length }} error(es) en el plan</span>
          <span class="text-red-600">{{ showErrorDetail ? '▲ ocultar detalle' : '▼ ver detalle' }}</span>
        </button>
        <ul v-if="showErrorDetail" class="px-4 pb-2 space-y-1 max-h-40 overflow-y-auto">
          <li v-for="(err, i) in char.validation.errors" :key="i"
            class="text-xs flex items-baseline gap-2">
            <button
              class="text-red-300 font-mono flex-shrink-0 hover:text-amber-400 underline decoration-dotted"
              :title="'Ver el nivel ' + err.nivel + ' en el panel'"
              @click="jumpToLevel(err.nivel)"
            >{{ err.nivel >= 1 ? 'Nv ' + err.nivel : 'Plan' }}</button>
            <span class="text-red-500/80 flex-shrink-0">[{{ errorFieldLabel(err.field) }}]</span>
            <span class="text-red-400/90">{{ err.message }}</span>
          </li>
        </ul>
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
        <span></span>
      </div>

      <!-- Filas (scroll) -->
      <div class="flex-1 overflow-auto">
        <div class="min-w-max">

          <!-- Separador de la primera banda de máximos -->
          <div v-if="bandAt(1)" class="band-sep">
            <span class="text-amber-600/90 font-semibold uppercase tracking-wide">
              Niveles {{ bandAt(1)!.minLevel }}–{{ bandAt(1)!.maxLevel }}
            </span>
            <span class="text-stone-600">
              atributo ≤ {{ bandAt(1)!.maxAttrNatural }} · habilidad ≤ {{ bandAt(1)!.maxSkill }}
            </span>
          </div>

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
            <button
              class="text-stone-700 hover:text-amber-400 text-xs transition-colors"
              title="Editar la creación (nivel 1) sin perder el resto del plan"
              @click.stop="editarCreacion"
            >✎</button>
          </div>

          <!-- Niveles 2..30 -->
          <template v-for="n in 29" :key="n + 1">

            <!-- Separador al empezar una banda de máximos nueva -->
            <div v-if="bandAt(n + 1)" class="band-sep">
              <span class="text-amber-600/90 font-semibold uppercase tracking-wide">
                Niveles {{ bandAt(n + 1)!.minLevel }}–{{ bandAt(n + 1)!.maxLevel }}
              </span>
              <span class="text-stone-600">
                atributo ≤ {{ bandAt(n + 1)!.maxAttrNatural }} · habilidad ≤ {{ bandAt(n + 1)!.maxSkill }}
              </span>
            </div>

          <div
            class="plan-grid px-3 py-1.5 border-b border-stone-800/40 transition-colors"
            :class="ui.nivelVista === n + 1 ? 'bg-stone-800/40' : 'hover:bg-stone-900/40'"
          >
            <!-- Número de nivel + badges de recompensa del calendario -->
            <button
              class="col-lv flex items-center gap-1 hover:text-amber-400 transition-colors"
              @click="ui.setNivelVista(n + 1)"
            >
              <span v-if="char.character?.nivelActual === n + 1" class="text-amber-400 text-xs leading-none">▶</span>
              <span class="font-mono text-sm"
                :class="char.character?.nivelActual === n + 1 ? 'text-amber-400' : 'text-stone-500'">{{ n + 1 }}</span>
              <span v-if="reward(n + 1).gainAttr" class="badge bg-green-950 text-green-500"
                title="Este nivel otorga +1 atributo">A</span>
              <span v-if="reward(n + 1).gainFeat && !reward(n + 1).legendary" class="badge bg-amber-950 text-amber-500"
                title="Este nivel otorga una dote">D</span>
              <span v-if="reward(n + 1).legendary" class="badge bg-amber-900/60 text-amber-300"
                title="Este nivel otorga una dote LEGENDARIA">★</span>
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
            <div v-if="reward(n + 1).gainAttr" class="flex items-center gap-1 min-w-0" :title="lockedTitle(n + 1)">
              <select
                :value="getDelta(n + 1)?.attrSubida ?? ''"
                :disabled="!getDelta(n + 1)"
                :title="lockedTitle(n + 1)"
                @change="e => onAttrChange(n + 1, (e.target as HTMLSelectElement).value)"
                class="sel"
                :class="!getDelta(n + 1) ? 'opacity-40' : ''"
              >
                <option value="">—</option>
                <option v-for="a in ATTR_DEFS" :key="a.key" :value="a.key">{{ a.name }}</option>
              </select>
              <span
                v-if="attrDieBadge(n + 1)"
                class="text-xs font-mono flex-shrink-0 cursor-help"
                :class="attrDieBadge(n + 1) === '=' ? 'text-stone-600' : 'text-green-600'"
                :title="attrDieBadge(n + 1) === '='
                  ? 'Esta subida no añade dado (par → impar); cuenta para máximos, prereqs y Movimiento'
                  : 'Esta subida añade 1d10 a las tiradas del atributo'"
              >{{ attrDieBadge(n + 1) }}</span>
            </div>
            <span v-else class="text-stone-800 text-center text-xs">·</span>

            <!-- Dote (solo en niveles gainFeat) -->
            <select
              v-if="reward(n + 1).gainFeat"
              :value="getDelta(n + 1)?.featGanada ?? ''"
              :disabled="!getDelta(n + 1)"
              :title="lockedTitle(n + 1)"
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
              :title="lockedTitle(n + 1)"
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

            <!-- Replanear desde aquí -->
            <button
              v-if="hasEntriesFrom(n + 1)"
              class="text-stone-700 hover:text-red-400 text-xs transition-colors"
              :title="'Replanear: descartar el plan desde el nivel ' + (n + 1) + ' (incluido)'"
              @click.stop="replanearDesde(n + 1)"
            >✂</button>
            <span v-else></span>
          </div>

          </template>

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

            <!-- Atributos (efectivo = base + objetos; los dados salen del efectivo) -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-2">
                Atributos<span v-if="panelEff?.modified" class="text-amber-700 normal-case tracking-normal"> · efectivo (base)</span>
              </p>
              <div class="space-y-1">
                <div v-for="a in ATTR_DEFS" :key="a.key" class="flex justify-between items-center text-sm">
                  <span class="text-stone-400 cursor-help" :title="a.desc">{{ a.name }}</span>
                  <div class="flex items-center gap-2">
                    <span class="font-mono w-10 text-right"
                      :class="panelEff!.overCap.includes(a.key) ? 'text-red-400' : 'text-stone-200'">
                      {{ panelEff!.attrs[a.key] }}<span
                        v-if="panelEff!.attrs[a.key] !== panelState.attrs[a.key]"
                        class="text-stone-600 text-xs"> ({{ panelState.attrs[a.key] }})</span>
                    </span>
                    <span class="text-stone-600 text-xs w-8">{{ attrDice(panelEff!.attrs[a.key]) }}d10</span>
                  </div>
                </div>
              </div>
              <p v-if="panelEff && panelEff.overCap.length > 0" class="text-red-400 text-xs mt-1">
                ⚠ Atributo efectivo por encima del máximo absoluto (20)
              </p>
            </div>

            <!-- Habilidades -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-2">Habilidades</p>
              <div class="space-y-1">
                <div v-for="s in SKILL_DEFS" :key="s.key" class="flex justify-between items-center text-sm">
                  <span class="text-stone-400 text-xs cursor-help" :title="s.desc">{{ s.name }}</span>
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

            <!-- Equipo (del personaje, no del plan) -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-2">
                Equipo ({{ char.character?.equipo?.length ?? 0 }})
              </p>
              <div class="space-y-1 mb-2">
                <div v-for="(id, i) in char.character?.equipo ?? []" :key="i"
                  class="flex items-start justify-between gap-1 text-xs">
                  <span class="text-stone-300 cursor-help"
                    :title="equipoItem(id) ? `${EQUIPMENT_TYPE_LABELS[equipoItem(id)!.type]} · ${equipoItem(id)!.use} — ${equipoItem(id)!.effect}` : 'Objeto desconocido'">
                    {{ equipoItem(id)?.name ?? id }}
                    <span v-if="equipoItem(id)?.attrBonus" class="text-amber-600">↑</span>
                  </span>
                  <button class="text-stone-700 hover:text-red-400 flex-shrink-0"
                    title="Quitar" @click="char.removeEquipo(i)">✕</button>
                </div>
                <p v-if="!char.character?.equipo?.length" class="text-stone-700 text-xs italic">Sin equipo</p>
              </div>
              <div class="flex gap-1">
                <select v-model="equipoAddId" class="sel flex-1">
                  <option value="">Añadir objeto…</option>
                  <optgroup v-for="(label, type) in EQUIPMENT_TYPE_LABELS" :key="type" :label="label">
                    <option v-for="e in EQUIPMENT.filter(x => x.type === type)" :key="e.id" :value="e.id">
                      {{ e.name }}{{ e.cost !== null ? ` (${e.cost})` : '' }}
                    </option>
                  </optgroup>
                </select>
                <button class="btn-sm" :disabled="!equipoAddId" @click="addEquipoSel">+</button>
              </div>
            </div>

            <!-- Probabilidades en vivo -->
            <div>
              <button
                class="w-full text-left text-stone-600 text-xs uppercase tracking-wide mb-2 hover:text-amber-400 transition-colors"
                @click="showProbs = !showProbs"
              >
                Probabilidades {{ showProbs ? '▲' : '▼' }}
              </button>
              <div v-if="showProbs" class="overflow-x-auto -mx-1">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="text-stone-600">
                      <th class="text-left font-normal pb-1">Acción</th>
                      <th v-for="d in DIFFICULTY_TABLE" :key="d.id"
                        class="text-right font-normal pb-1 cursor-help px-0.5"
                        :title="`${d.name} (${d.successes}${d.id === 'imposible' ? '+' : ''} éxitos)`"
                      >{{ d.successes }}{{ d.id === 'imposible' ? '+' : '' }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="r in probRows" :key="r.action.id" class="border-t border-stone-800/40">
                      <td class="text-stone-400 py-0.5 cursor-help whitespace-nowrap"
                        :title="`${r.spec.dice}d10 ≥${r.spec.threshold}${r.spec.rerolls ? ' ' + r.spec.rerolls + 'r' : ''}${r.spec.auxDie ? ' +d' + r.spec.auxDie : ''}`"
                      >{{ r.action.name }}</td>
                      <td v-for="(p, i) in r.probs" :key="i"
                        class="text-right font-mono px-0.5"
                        :class="p >= 0.7 ? 'text-green-500' : p >= 0.35 ? 'text-stone-300' : p >= 0.1 ? 'text-stone-500' : 'text-stone-700'"
                      >{{ fmtPct(p) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Notas (del personaje, no del plan; salen en la ficha impresa) -->
            <div>
              <p class="text-stone-600 text-xs uppercase tracking-wide mb-2">Notas</p>
              <textarea
                :value="char.character?.notas ?? ''"
                @input="e => char.setNotas((e.target as HTMLTextAreaElement).value)"
                rows="4"
                placeholder="Lesiones, trasfondo, recordatorios… (aparecen en la ficha impresa)"
                class="w-full bg-stone-900 border border-stone-700 rounded text-stone-300 text-xs px-2 py-1.5
                       placeholder:text-stone-700 focus:border-amber-500 focus:outline-none resize-y"
              ></textarea>
            </div>

          </div>
        </template>
        <p v-else class="p-4 text-stone-600 text-sm italic">Sin datos para este nivel.</p>
      </div>

      <!-- Pie del panel: acciones globales -->
      <div class="border-t border-stone-800 p-3 flex-shrink-0 space-y-2">
        <div class="flex gap-2">
          <button @click="char.triggerSheetDownload()" class="btn-sm flex-1"
            :title="'Ficha completa imprimible al nivel actual (' + char.character?.nivelActual + ')'">↓ Ficha</button>
          <button @click="char.triggerDownload()" class="btn-sm flex-1" title="JSON crudo (depuración/importación)">↓ JSON</button>
          <button @click="reiniciar"
            title="Borrar el personaje y todo su plan (con confirmación y copia JSON)"
            class="btn-sm text-red-500 hover:text-red-400">Reiniciar</button>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
@reference "../style.css";
.plan-grid {
  display: grid;
  grid-template-columns: 4.25rem 1fr 1.25fr 1.4fr 1fr 1.25rem 1.25rem;
  align-items: center;
  gap: 0.25rem;
}
.col-lv {
  /* nada extra, solo para legibilidad */
}
.band-sep {
  @apply flex items-baseline gap-2 px-3 py-1 bg-stone-900/80 border-b border-stone-800 text-[11px] flex-shrink-0;
}
.badge {
  @apply text-[9px] font-bold rounded px-1 leading-tight flex-shrink-0 cursor-help;
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

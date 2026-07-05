// Documento generado el 2026-07-05-1655
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character, Level1Delta, LevelNDelta, Attrs, Skills, CharState } from '@/rules/types'
import { SCHEMA_VERSION, RULES_VERSION } from '@/data/config'
import { RACES } from '@/data/races'
import { fold, replanDesde } from '@/rules/engine'
import { validatePlan } from '@/rules/validate'
import { parseCharacterJSON } from '@/rules/parseCharacter'
import { buildSheetHTML } from '@/export/sheet'

// 0 = "sin asignar": el jugador parte sin valores puestos y reparte él el pool
function defaultAttrs(): Attrs {
  return { mov: 0, fue: 0, agi: 0, tec: 0, res: 0, men: 0 }
}
function defaultSkills(): Skills {
  return { correr: 0, placar: 0, evasion: 0, balon: 0, aguantar: 0, voluntad: 0 }
}

export const useCharacterStore = defineStore('character', () => {
  const character = ref<Character | null>(null)

  /**
   * Buffer de deshacer (1 paso, solo en memoria): copia del personaje previo
   * a la última operación destructiva (reinicio o replaneo). No se persiste:
   * sobrevive a la sesión, no a un F5.
   */
  const undoBuffer = ref<{ character: Character; label: string } | null>(null)

  function snapshot(label: string) {
    if (!character.value) return
    undoBuffer.value = {
      character: JSON.parse(JSON.stringify(character.value)) as Character,
      label,
    }
  }

  /** Restaura el personaje previo a la última operación destructiva */
  function undo() {
    if (!undoBuffer.value) return
    character.value = undoBuffer.value.character
    undoBuffer.value = null
  }

  function clearUndo() { undoBuffer.value = null }

  /** Estado acumulado durante el asistente de creación (no se persiste) */
  const wizardDraft = ref({
    attrs:       defaultAttrs(),
    skills:      defaultSkills(),
    featElegida: '' as string,
    god:         null as string | null,
  })

  const raza = computed(() => {
    if (!character.value) return null
    return RACES.find(r => r.id === character.value!.raza) ?? null
  })

  /** Estado del PJ a cualquier nivel del plan. null si el plan está vacío. */
  function stateAt(n: number): CharState | null {
    if (!character.value || !raza.value) return null
    if (!character.value.plan.find(e => e.nivel === 1)) return null
    return fold(character.value.plan, n, raza.value)
  }

  const currentState = computed(() => {
    if (!character.value) return null
    return stateAt(character.value.nivelActual)
  })

  const validation = computed(() => {
    if (!character.value || !raza.value) return null
    if (!character.value.plan.find(e => e.nivel === 1)) return null
    return validatePlan(character.value.plan, raza.value)
  })

  // ── Acciones del asistente ─────────────────────────────────────────────────

  function initCharacter(nombre: string, razaId: string) {
    character.value = {
      schemaVersion: SCHEMA_VERSION,
      rulesVersion:  RULES_VERSION,
      nombre,
      raza: razaId,
      plan: [],
      nivelActual: 1,
      notas: '',
    }
    wizardDraft.value = {
      attrs:       defaultAttrs(),
      skills:      defaultSkills(),
      featElegida: '',
      god:         null,
    }
  }

  function setWizardAttrs(attrs: Attrs)        { wizardDraft.value.attrs  = attrs }
  function setWizardSkills(skills: Skills)     { wizardDraft.value.skills = skills }
  function setWizardFeat(featId: string)       { wizardDraft.value.featElegida = featId }
  function setWizardGod(godId: string | null)  { wizardDraft.value.god = godId }

  /**
   * Siembra el borrador del asistente con el nivel 1 ya cometido, para editar
   * la creación sin perder el resto del plan (commitLevel1 reemplaza solo la
   * entrada de nivel 1; la validación señalará lo que deje de ser legal).
   */
  function beginEditLevel1() {
    if (!character.value) return
    const l1 = character.value.plan.find(e => e.nivel === 1) as Level1Delta | undefined
    if (!l1) return
    wizardDraft.value = {
      attrs:       { ...l1.attrs },
      skills:      { ...l1.skills },
      featElegida: l1.featElegida,
      god:         l1.god,
    }
  }

  /** Convierte el borrador del asistente en el Level1Delta definitivo del plan. */
  function commitLevel1() {
    if (!character.value) return
    const l1: Level1Delta = {
      nivel: 1,
      attrs:        wizardDraft.value.attrs,
      skills:       wizardDraft.value.skills,
      featElegida:  wizardDraft.value.featElegida,
      god:          wizardDraft.value.god,
    }
    character.value = {
      ...character.value,
      plan: [l1, ...character.value.plan.filter(e => e.nivel !== 1)],
    }
  }

  // ── Acciones del plan ──────────────────────────────────────────────────────

  function setLevelDelta(delta: LevelNDelta) {
    if (!character.value) return
    const plan = character.value.plan.filter(e => e.nivel !== delta.nivel)
    character.value = {
      ...character.value,
      plan: [...plan, delta].sort((a, b) => a.nivel - b.nivel),
    }
  }

  function removeLevelEntry(nivel: number) {
    if (!character.value) return
    character.value = {
      ...character.value,
      plan: character.value.plan.filter(e => e.nivel !== nivel),
    }
  }

  /** Descarta las entradas del plan de nivel >= n para replanear */
  function replanFrom(n: number) {
    if (!character.value) return
    snapshot(`replaneo desde nivel ${n}`)
    character.value = {
      ...character.value,
      plan: replanDesde(character.value.plan, n),
      nivelActual: Math.min(character.value.nivelActual, Math.max(1, n - 1)),
    }
  }

  // ── Equipo (no es parte del plan: el atributo efectivo es derivado) ────────

  function addEquipo(id: string) {
    if (!character.value || !id) return
    character.value = {
      ...character.value,
      equipo: [...(character.value.equipo ?? []), id],
    }
  }

  function removeEquipo(index: number) {
    if (!character.value) return
    const equipo = [...(character.value.equipo ?? [])]
    equipo.splice(index, 1)
    character.value = { ...character.value, equipo }
  }

  function setNivelActual(n: number) {
    if (!character.value) return
    character.value = { ...character.value, nivelActual: Math.max(1, Math.min(30, n)) }
  }

  function setNotas(notas: string) {
    if (!character.value) return
    character.value = { ...character.value, notas }
  }

  // ── Import / export ───────────────────────────────────────────────────────

  function exportJSON(): string {
    return JSON.stringify(character.value, null, 2)
  }

  /**
   * Importa un personaje validando estructura y versiones.
   * Lanza Error con mensaje legible si es inutilizable; devuelve los avisos.
   * Si sustituye a un personaje existente, deja copia en el buffer de deshacer.
   */
  function importJSON(json: string): string[] {
    const { character: parsed, warnings } = parseCharacterJSON(json)
    if (character.value) snapshot(`importación (sustituyó a «${character.value.nombre}»)`)
    character.value = parsed
    return warnings
  }

  function download(content: string, mime: string, filename: string) {
    const blob = new Blob([content], { type: mime })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /** Exporta el JSON crudo (depuración / import) */
  function triggerDownload() {
    if (!character.value) return
    download(exportJSON(), 'application/json', `${character.value.nombre || 'personaje'}.bbrtg.json`)
  }

  /** Exporta la ficha completa imprimible (HTML) al nivelActual */
  function triggerSheetDownload() {
    if (!character.value || !raza.value) return
    if (!character.value.plan.find(e => e.nivel === 1)) return
    const html = buildSheetHTML(character.value, raza.value)
    download(html, 'text/html', `${character.value.nombre || 'personaje'}.ficha.html`)
  }

  function reset() {
    if (!character.value) return
    snapshot(`reinicio de «${character.value.nombre}»`)
    character.value = null
  }

  return {
    character, wizardDraft, raza,
    currentState, validation, undoBuffer,
    stateAt,
    initCharacter, setWizardAttrs, setWizardSkills, setWizardFeat, setWizardGod,
    beginEditLevel1, commitLevel1,
    setLevelDelta, removeLevelEntry, replanFrom, addEquipo, removeEquipo,
    setNivelActual, setNotas,
    exportJSON, importJSON, triggerDownload, triggerSheetDownload, reset,
    undo, clearUndo,
  }
}, {
  // wizardDraft también: un F5 a mitad de la creación no pierde el reparto
  persist: { pick: ['character', 'wizardDraft'] },
})

// Documento generado el 2026-07-04-2230
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Character, Level1Delta, LevelNDelta, Attrs, Skills, CharState } from '@/rules/types'
import { SCHEMA_VERSION, RULES_VERSION } from '@/data/config'
import { RACES } from '@/data/races'
import { fold } from '@/rules/engine'
import { validatePlan } from '@/rules/validate'

function defaultAttrs(): Attrs {
  return { mov: 5, fue: 4, agi: 3, tec: 3, res: 2, men: 2 }
}
function defaultSkills(): Skills {
  return { correr: 3, placar: 2, evasion: 1, balon: 2, aguantar: 1, voluntad: 1 }
}

export const useCharacterStore = defineStore('character', () => {
  const character = ref<Character | null>(null)

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

  function importJSON(json: string) {
    character.value = JSON.parse(json) as Character
  }

  function triggerDownload() {
    if (!character.value) return
    const blob = new Blob([exportJSON()], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), {
      href: url,
      download: `${character.value.nombre || 'personaje'}.bbrtg.json`,
    })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function reset() { character.value = null }

  return {
    character, wizardDraft, raza,
    currentState, validation,
    stateAt,
    initCharacter, setWizardAttrs, setWizardSkills, setWizardFeat, setWizardGod, commitLevel1,
    setLevelDelta, removeLevelEntry, setNivelActual, setNotas,
    exportJSON, importJSON, triggerDownload, reset,
  }
}, {
  persist: { pick: ['character'] },
})

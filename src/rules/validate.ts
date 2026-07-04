// Documento generado el 2026-07-04-2045

import type {
  PlanEntry, Level1Delta, LevelNDelta,
  ValidationError, ValidationResult,
  CharState, AttrKey, SkillKey,
} from './types'
import type { RaceData } from '@/data/races'
import { FEATS } from '@/data/feats'
import { INITIAL_ATTRS, INITIAL_SKILLS } from '@/data/config'
import { fold } from './engine'
import { getMaxAttrBase, getMaxSkill, getCalendarEntry, unmetPrereqs } from './helpers'

// ---------------------------------------------------------------------------
// Utilidades internas
// ---------------------------------------------------------------------------

function sortedNums(obj: Record<string, number>): number[] {
  return Object.values(obj).sort((a, b) => a - b)
}

function numsEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

// ---------------------------------------------------------------------------
// Punto de entrada público
// ---------------------------------------------------------------------------

/**
 * Valida el plan completo contra las reglas y la raza dada.
 * Regla de oro: señala y describe cada error, nunca clamp en silencio.
 */
export function validatePlan(plan: PlanEntry[], raza: RaceData): ValidationResult {
  const errors: ValidationError[] = []
  const sorted = [...plan].sort((a, b) => a.nivel - b.nivel)

  const l1 = sorted.find(e => e.nivel === 1) as Level1Delta | undefined
  if (!l1) {
    errors.push({ nivel: 0, field: 'plan', message: 'El plan no contiene entrada de nivel 1.' })
    return { ok: false, errors }
  }

  _validateLevel1(l1, raza, errors)

  for (const entry of sorted) {
    if (entry.nivel === 1) continue
    const d = entry as LevelNDelta

    // Estado justo antes de este nivel
    const stateBefore = fold(sorted, d.nivel - 1, raza)

    // Los gains de atributo, habilidad y dios del propio nivel se aplican antes
    // de comprobar el prereq de la dote (el jugador "sube al nivel" con esos valores)
    const stateForFeat: CharState = {
      nivel:  d.nivel,
      attrs:  d.attrSubida
        ? { ...stateBefore.attrs, [d.attrSubida]: stateBefore.attrs[d.attrSubida] + 1 }
        : { ...stateBefore.attrs },
      skills: { ...stateBefore.skills, [d.skillSubida]: stateBefore.skills[d.skillSubida] + 1 },
      feats:  stateBefore.feats,
      god:    d.god !== undefined ? d.god : stateBefore.god,
    }

    _validateLevelN(d, stateForFeat, stateBefore, raza, errors)
  }

  return { ok: errors.length === 0, errors }
}

// ---------------------------------------------------------------------------
// Validación nivel 1
// ---------------------------------------------------------------------------

function _validateLevel1(l1: Level1Delta, raza: RaceData, errors: ValidationError[]): void {
  const n = 1

  // ── Distribución de atributos ─────────────────────────────────────────────
  const sortedIA = [...INITIAL_ATTRS].sort((a, b) => a - b)
  if (!numsEqual(sortedNums(l1.attrs), sortedIA)) {
    errors.push({
      nivel: n, field: 'attrs',
      message: `Distribución de atributos incorrecta. Se esperan los valores [${sortedIA.join(', ')}].`,
    })
  }

  // ── Distribución de habilidades ───────────────────────────────────────────
  const sortedIS = [...INITIAL_SKILLS].sort((a, b) => a - b)
  if (!numsEqual(sortedNums(l1.skills), sortedIS)) {
    errors.push({
      nivel: n, field: 'skills',
      message: `Distribución de habilidades incorrecta. Se esperan los valores [${sortedIS.join(', ')}].`,
    })
  }

  // ── Mínimos raciales ──────────────────────────────────────────────────────
  for (const [key, min] of Object.entries(raza.minima) as [AttrKey, number][]) {
    if ((l1.attrs[key] ?? 0) < min) {
      errors.push({
        nivel: n, field: `attrs.${key}`,
        message: `${key} (${l1.attrs[key]}) está por debajo del mínimo racial de ${raza.name} (${min}).`,
      })
    }
  }

  // ── Máximos de atributo en nivel 1 ────────────────────────────────────────
  for (const key of Object.keys(l1.attrs) as AttrKey[]) {
    const max = getMaxAttrBase(n, raza, key)
    if (l1.attrs[key] > max) {
      errors.push({
        nivel: n, field: `attrs.${key}`,
        message: `${key} (${l1.attrs[key]}) supera el máximo aplicable en nivel 1 (${max}).`,
      })
    }
  }

  // ── Máximos de habilidad en nivel 1 ──────────────────────────────────────
  const maxSk = getMaxSkill(n)
  for (const key of Object.keys(l1.skills) as SkillKey[]) {
    if (l1.skills[key] > maxSk) {
      errors.push({
        nivel: n, field: `skills.${key}`,
        message: `${key} (${l1.skills[key]}) supera el máximo de habilidad en nivel 1 (${maxSk}).`,
      })
    }
  }

  // ── Dote inicial libre ────────────────────────────────────────────────────
  const feat = FEATS.find(f => f.id === l1.featElegida)
  if (!feat) {
    errors.push({
      nivel: n, field: 'featElegida',
      message: `La dote "${l1.featElegida}" no existe en el catálogo.`,
    })
  } else {
    // Estado con solo la dote racial (sin la dote libre todavía)
    const initState: CharState = {
      nivel: n, attrs: l1.attrs, skills: l1.skills,
      feats: [raza.startingFeatId], god: l1.god,
    }
    const unmet = unmetPrereqs(feat.prereqs, initState)
    if (unmet.length > 0) {
      errors.push({
        nivel: n, field: 'featElegida',
        message: `La dote "${feat.name}" tiene prerequisitos no cumplidos en el reparto inicial.`,
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Validación niveles 2..30
// ---------------------------------------------------------------------------

function _validateLevelN(
  d: LevelNDelta,
  stateForFeat: CharState,
  stateBefore: CharState,
  raza: RaceData,
  errors: ValidationError[],
): void {
  const n   = d.nivel
  const cal = getCalendarEntry(n)

  // ── Atributo ──────────────────────────────────────────────────────────────

  if (d.attrSubida !== undefined) {
    if (!cal?.gainAttr) {
      errors.push({
        nivel: n, field: 'attrSubida',
        message: `El nivel ${n} no otorga subida de atributo según el calendario.`,
      })
    }
    const newVal = stateForFeat.attrs[d.attrSubida]
    const max    = getMaxAttrBase(n, raza, d.attrSubida)
    if (newVal > max) {
      errors.push({
        nivel: n, field: `attrs.${d.attrSubida}`,
        message: `${d.attrSubida} (${newVal}) supera el máximo aplicable en nivel ${n} (${max}).`,
      })
    }
  }

  // ── Habilidad ─────────────────────────────────────────────────────────────

  const newSkVal = stateForFeat.skills[d.skillSubida]
  const maxSk    = getMaxSkill(n)
  if (newSkVal > maxSk) {
    errors.push({
      nivel: n, field: `skills.${d.skillSubida}`,
      message: `${d.skillSubida} (${newSkVal}) supera el máximo de habilidad en nivel ${n} (${maxSk}).`,
    })
  }

  // ── Dote ──────────────────────────────────────────────────────────────────

  if (d.featGanada !== undefined) {
    if (!cal?.gainFeat) {
      errors.push({
        nivel: n, field: 'featGanada',
        message: `El nivel ${n} no otorga dote según el calendario.`,
      })
    }
    const feat = FEATS.find(f => f.id === d.featGanada)
    if (!feat) {
      errors.push({
        nivel: n, field: 'featGanada',
        message: `La dote "${d.featGanada}" no existe en el catálogo.`,
      })
    } else {
      const unmet = unmetPrereqs(feat.prereqs, stateForFeat)
      if (unmet.length > 0) {
        errors.push({
          nivel: n, field: 'featGanada',
          message: `La dote "${feat.name}" tiene prerequisitos no cumplidos en nivel ${n}.`,
        })
      }
    }
  }

  // ── Dios (solo se puede elegir una vez) ───────────────────────────────────

  if (d.god !== undefined && stateBefore.god !== null && d.god !== stateBefore.god) {
    errors.push({
      nivel: n, field: 'god',
      message: `Ya hay un dios elegido (${stateBefore.god}). El dios no puede cambiarse.`,
    })
  }
}

// Documento generado el 2026-07-04-2045

import type { AttrKey, Attrs, SkillKey, CharState } from './types'
import type { RaceData } from '@/data/races'
import type { FeatData, FeatPrereq, FeatPrereqCond } from '@/data/feats'
import { FEATS } from '@/data/feats'
import { GODS } from '@/data/gods'
import { EQUIPMENT } from '@/data/equipment'
import { ATTR_DEFS, SKILL_DEFS, MAX_ATTR_ABSOLUTE } from '@/data/config'
import { LEVEL_CAPS, LEVEL_CALENDAR } from '@/data/tables'
import type { LevelCap, LevelReward } from '@/data/tables'

// ---------------------------------------------------------------------------
// Bandas de nivel
// ---------------------------------------------------------------------------

export function getLevelCap(nivel: number): LevelCap {
  for (const cap of LEVEL_CAPS) {
    if (nivel >= cap.minLevel && nivel <= cap.maxLevel) return cap
  }
  // Nivel fuera de rango: usa la última banda definida
  return LEVEL_CAPS[LEVEL_CAPS.length - 1] as LevelCap
}

export function getMaxAttrNatural(nivel: number): number {
  return getLevelCap(nivel).maxAttrNatural
}

export function getMaxSkill(nivel: number): number {
  return getLevelCap(nivel).maxSkill
}

/**
 * Máximo de atributo base a un nivel para una raza concreta.
 * = mín(máximo racial natural, máximo de banda de nivel)
 * Los objetos y dones divinos pueden superar este valor hasta MAX_ATTR_ABSOLUTE.
 */
export function getMaxAttrBase(nivel: number, raza: RaceData, key: AttrKey): number {
  return Math.min(raza.maxima[key], getMaxAttrNatural(nivel))
}

// ---------------------------------------------------------------------------
// Atributo efectivo (base + objetos)
// ---------------------------------------------------------------------------

export interface EffectiveAttrs {
  /** base + bonos de objetos, sin recorte (regla de oro: señalar, no clampar) */
  attrs: Attrs
  /** atributos cuyo efectivo supera el máximo absoluto (equipo ilegal) */
  overCap: AttrKey[]
  /** ¿algún objeto modifica algún atributo? */
  modified: boolean
}

/**
 * Atributo EFECTIVO = base + bonos de objetos equipados (manual §4.3, §25.25).
 * Puede superar máximos raciales y por nivel, pero no el absoluto (20).
 * No se recorta: si supera 20 se señala en `overCap` para que la UI lo marque.
 * Los prerequisitos de dotes se validan siempre contra el atributo BASE
 * (el equipo es retirable; el plan no puede depender de él).
 */
export function effectiveAttrs(base: Attrs, equipoIds: string[] | undefined): EffectiveAttrs {
  const attrs: Attrs = { ...base }
  let modified = false
  for (const id of equipoIds ?? []) {
    const item = EQUIPMENT.find(e => e.id === id)
    if (!item?.attrBonus) continue
    for (const [key, bonus] of Object.entries(item.attrBonus) as [AttrKey, number][]) {
      attrs[key] += bonus
      modified = true
    }
  }
  const overCap = (Object.keys(attrs) as AttrKey[]).filter(k => attrs[k] > MAX_ATTR_ABSOLUTE)
  return { attrs, overCap, modified }
}

// ---------------------------------------------------------------------------
// Calendario
// ---------------------------------------------------------------------------

export function getCalendarEntry(nivel: number): LevelReward | undefined {
  return LEVEL_CALENDAR.find(e => e.level === nivel)
}

/**
 * Total de dotes esperadas al nivel n:
 *   1 racial + 1 inicial libre + N dotes ganadas en el calendario de niveles 2..n
 */
export function expectedFeatCount(nivel: number): number {
  const fromCalendar = LEVEL_CALENDAR
    .filter(e => e.level >= 2 && e.level <= nivel && e.gainFeat)
    .length
  return 2 + fromCalendar
}

// ---------------------------------------------------------------------------
// Prerequisitos
// ---------------------------------------------------------------------------

function checkSingleCond(cond: FeatPrereqCond, state: CharState): boolean {
  switch (cond.type) {
    case 'attr':
      return (state.attrs[cond.key as AttrKey] ?? 0) >= (cond.min ?? 0)
    case 'skill':
      return (state.skills[cond.key as SkillKey] ?? 0) >= (cond.min ?? 0)
    case 'feat':
      return state.feats.includes(cond.key!)
    case 'venerar_dios':
      return state.god !== null
    case 'dios_concreto':
      return state.god === cond.key
    case 'faccion':
    case 'reputacion':
    case 'narrativo':
      // No validables mecánicamente; se asumen cumplidos
      return true
    default:
      return true
  }
}

/** Devuelve true si se cumple el prerequisito (condición simple o grupo OR) */
export function checkPrereq(prereq: FeatPrereq, state: CharState): boolean {
  return Array.isArray(prereq)
    ? prereq.some(c => checkSingleCond(c, state))
    : checkSingleCond(prereq, state)
}

/** Devuelve los prereqs del array que NO se cumplen */
export function unmetPrereqs(prereqs: FeatPrereq[], state: CharState): FeatPrereq[] {
  return prereqs.filter(p => !checkPrereq(p, state))
}

// ---------------------------------------------------------------------------
// Presentación y planificación de prerequisitos
// ---------------------------------------------------------------------------

function describeSingleCond(cond: FeatPrereqCond): string {
  switch (cond.type) {
    case 'attr':
      return `${ATTR_DEFS.find(a => a.key === cond.key)?.name ?? cond.key} ${cond.min}`
    case 'skill':
      return `${SKILL_DEFS.find(s => s.key === cond.key)?.name ?? cond.key} ${cond.min}`
    case 'feat':
      return `dote ${FEATS.find(f => f.id === cond.key)?.name ?? cond.key}`
    case 'venerar_dios':
      return 'venerar a un dios'
    case 'dios_concreto':
      return `venerar a ${GODS.find(g => g.id === cond.key)?.name ?? cond.key}`
    case 'faccion':     return 'requisito de facción'
    case 'reputacion':  return 'requisito de reputación'
    case 'narrativo':   return 'requisito narrativo'
    default:            return cond.type
  }
}

/** Texto legible de un prerequisito (los grupos OR se unen con " o ") */
export function describePrereq(prereq: FeatPrereq): string {
  return Array.isArray(prereq)
    ? prereq.map(describeSingleCond).join(' o ')
    : describeSingleCond(prereq)
}

/** Niveles en los que se gana una dote: nivel 1 (inicial libre) + calendario */
export function featSlotLevels(): number[] {
  return [1, ...LEVEL_CALENDAR.filter(e => e.level >= 2 && e.gainFeat).map(e => e.level)]
}

/** Nivel mínimo al que UNA condición es alcanzable para una raza (por bandas de máximos) */
function minLevelForCond(cond: FeatPrereqCond, raza: RaceData): number {
  if (cond.type === 'attr') {
    for (const cap of LEVEL_CAPS) {
      if (Math.min(raza.maxima[cond.key as AttrKey], cap.maxAttrNatural) >= (cond.min ?? 0)) {
        return cap.minLevel
      }
    }
    return Infinity
  }
  if (cond.type === 'skill') {
    for (const cap of LEVEL_CAPS) {
      if (cap.maxSkill >= (cond.min ?? 0)) return cap.minLevel
    }
    return Infinity
  }
  // dote requerida, dios, narrativos…: no imponen banda de nivel por sí mismos
  return 1
}

/**
 * Nivel mínimo al que los prereqs de atributo/habilidad de una dote son
 * alcanzables para una raza. Ignora los prereqs de tipo dote (se asume que ya
 * se tiene la anterior de la cadena). Devuelve Infinity si algún prereq es
 * inalcanzable para esa raza (p. ej. pide más atributo que su máximo racial).
 */
export function minLevelForFeatConds(feat: FeatData, raza: RaceData): number {
  let lvl = 1
  for (const p of feat.prereqs) {
    const conds = Array.isArray(p) ? p : [p]
    // Grupo OR: basta la condición más asequible; condición simple: ella misma
    lvl = Math.max(lvl, Math.min(...conds.map(c => minLevelForCond(c, raza))))
  }
  return lvl
}

// Documento generado el 2026-07-04-2045

import type { AttrKey, SkillKey, CharState } from './types'
import type { RaceData } from '@/data/races'
import type { FeatPrereq, FeatPrereqCond } from '@/data/feats'
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

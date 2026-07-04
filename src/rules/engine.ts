// Documento generado el 2026-07-04-2045

import type { PlanEntry, Level1Delta, LevelNDelta, CharState } from './types'
import type { RaceData } from '@/data/races'

/**
 * Pliega el plan hasta el nivel n y devuelve el estado completo a ese nivel.
 * Operación central del motor: determinista y sin efectos secundarios.
 *
 * Si el plan no contiene entradas para todos los niveles 1..n, el estado
 * resultante refleja únicamente las decisiones que ya están en el plan.
 * El campo `nivel` siempre vale n, sea cual sea el último nivel planificado.
 */
export function fold(plan: PlanEntry[], n: number, raza: RaceData): CharState {
  const sorted = [...plan].sort((a, b) => a.nivel - b.nivel)

  const l1 = sorted.find(e => e.nivel === 1) as Level1Delta | undefined
  if (!l1) {
    throw new Error('fold: el plan no contiene entrada de nivel 1')
  }

  let state: CharState = {
    nivel: 1,
    attrs:  { ...l1.attrs },
    skills: { ...l1.skills },
    // La dote racial es derivable (no se guarda en la ficha); se inyecta aquí
    feats: [raza.startingFeatId, l1.featElegida].filter(Boolean),
    god:   l1.god,
  }

  if (n <= 1) return state

  for (const entry of sorted) {
    if (entry.nivel === 1 || entry.nivel > n) continue
    const d = entry as LevelNDelta

    const newAttrs = { ...state.attrs }
    if (d.attrSubida !== undefined) {
      newAttrs[d.attrSubida] = newAttrs[d.attrSubida] + 1
    }

    const newSkills = { ...state.skills }
    newSkills[d.skillSubida] = newSkills[d.skillSubida] + 1

    state = {
      nivel:  d.nivel,
      attrs:  newAttrs,
      skills: newSkills,
      feats:  d.featGanada ? [...state.feats, d.featGanada] : state.feats,
      god:    d.god !== undefined ? d.god : state.god,
    }
  }

  // Garantiza que el nivel del estado refleja n, aunque el plan no llegue hasta ahí
  state.nivel = n
  return state
}

/**
 * Descarta todas las entradas del plan con nivel >= n.
 * Llamar con n=1 vacía el plan por completo.
 */
export function replanDesde(plan: PlanEntry[], n: number): PlanEntry[] {
  return plan.filter(e => e.nivel < n)
}

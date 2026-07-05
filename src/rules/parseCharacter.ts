// Documento generado el 2026-07-05-1040

/**
 * Validación de personajes importados (JSON).
 *
 * Errores duros (throw): JSON ilegible, estructura imposible de usar,
 * schemaVersion incompatible o raza desconocida — con ellos la app rompería.
 * Avisos (warnings): cosas sospechosas pero utilizables — regla de oro:
 * señalar, nunca arreglar en silencio (la validación del plan marcará el resto).
 */

import type { Character, PlanEntry } from './types'
import { SCHEMA_VERSION, RULES_VERSION } from '@/data/config'
import { RACES } from '@/data/races'
import { EQUIPMENT } from '@/data/equipment'

export interface ParsedCharacter {
  character: Character
  warnings: string[]
}

export function parseCharacterJSON(json: string): ParsedCharacter {
  let raw: unknown
  try {
    raw = JSON.parse(json)
  } catch {
    throw new Error('El fichero no es JSON válido.')
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('El JSON no tiene la forma de un personaje (se esperaba un objeto).')
  }
  const c = raw as Record<string, unknown>
  const warnings: string[] = []

  // ── Errores duros ─────────────────────────────────────────────────────────

  if (typeof c['schemaVersion'] !== 'number') {
    throw new Error('Falta schemaVersion: no parece un personaje de esta aplicación.')
  }
  if (c['schemaVersion'] !== SCHEMA_VERSION) {
    throw new Error(
      `schemaVersion ${c['schemaVersion']} incompatible (la app usa ${SCHEMA_VERSION}). ` +
      'Edita el JSON a mano para adaptarlo (no hay migraciones automáticas).'
    )
  }
  if (typeof c['raza'] !== 'string' || !RACES.some(r => r.id === c['raza'])) {
    throw new Error(`Raza desconocida: "${String(c['raza'])}". Razas válidas: ${RACES.map(r => r.id).join(', ')}.`)
  }
  if (!Array.isArray(c['plan'])) {
    throw new Error('El personaje no tiene plan (se esperaba un array).')
  }

  const plan = c['plan'] as PlanEntry[]
  const niveles = plan.map(e => (e as { nivel?: unknown }).nivel)
  if (niveles.some(n => typeof n !== 'number' || n < 1 || n > 30)) {
    throw new Error('El plan contiene entradas sin nivel válido (1..30).')
  }
  const seen = new Set<number>()
  for (const n of niveles as number[]) {
    if (seen.has(n)) throw new Error(`El plan contiene dos entradas para el nivel ${n}.`)
    seen.add(n)
  }

  // ── Avisos ────────────────────────────────────────────────────────────────

  if (c['rulesVersion'] !== RULES_VERSION) {
    warnings.push(
      `Personaje de reglas v${String(c['rulesVersion'] ?? '?')} (la app usa v${RULES_VERSION}): ` +
      'revisa el plan; la validación marcará lo que ya no sea legal.'
    )
  }
  if (plan.length > 0 && !plan.some(e => e.nivel === 1)) {
    warnings.push('El plan no tiene entrada de nivel 1: la ficha no podrá calcularse hasta rehacer la creación.')
  }
  if (typeof c['nombre'] !== 'string' || !c['nombre']) {
    warnings.push('El personaje no tiene nombre.')
  }
  if (typeof c['nivelActual'] !== 'number' || c['nivelActual'] < 1 || c['nivelActual'] > 30) {
    warnings.push(`nivelActual raro (${String(c['nivelActual'])}): se esperaba 1..30.`)
  }
  if (c['equipo'] !== undefined) {
    if (!Array.isArray(c['equipo'])) {
      warnings.push('El campo equipo no es una lista; se ignorará al mostrar.')
    } else {
      for (const id of c['equipo'] as unknown[]) {
        if (typeof id !== 'string' || !EQUIPMENT.some(e => e.id === id)) {
          warnings.push(`Objeto de equipo desconocido: "${String(id)}".`)
        }
      }
    }
  }

  return { character: raw as Character, warnings }
}

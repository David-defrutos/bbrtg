// Documento generado el 2026-07-04-2030
import type { AttrKey, SkillKey } from '@/rules/types'

export const SCHEMA_VERSION = 1
export const RULES_VERSION  = '0.30'

/** Distribución inicial de atributos (nivel 1): 5, 4, 3, 3, 2, 2 */
export const INITIAL_ATTRS: number[] = [5, 4, 3, 3, 2, 2]

/** Distribución inicial de habilidades (nivel 1): 3, 2, 2, 1, 1, 1 */
export const INITIAL_SKILLS: number[] = [3, 2, 2, 1, 1, 1]

/** Máximo absoluto de atributo (incluye objetos, dones, mutaciones) */
export const MAX_ATTR_ABSOLUTE = 20

export interface AttrDef {
  key: AttrKey
  name: string
  skill: SkillKey
}

export interface SkillDef {
  key: SkillKey
  name: string
  attr: AttrKey
}

/** Definiciones de los 6 atributos en orden canónico */
export const ATTR_DEFS: AttrDef[] = [
  { key: 'mov', name: 'Movimiento',   skill: 'correr'   },
  { key: 'fue', name: 'Fuerza',       skill: 'placar'   },
  { key: 'agi', name: 'Agilidad',     skill: 'evasion'  },
  { key: 'tec', name: 'Técnica',      skill: 'balon'    },
  { key: 'res', name: 'Resistencia',  skill: 'aguantar' },
  { key: 'men', name: 'Mente',        skill: 'voluntad' },
]

/** Definiciones de las 6 habilidades en orden canónico */
export const SKILL_DEFS: SkillDef[] = [
  { key: 'correr',   name: 'Correr',         attr: 'mov' },
  { key: 'placar',   name: 'Placar',         attr: 'fue' },
  { key: 'evasion',  name: 'Evasión',        attr: 'agi' },
  { key: 'balon',    name: 'Juego de balón', attr: 'tec' },
  { key: 'aguantar', name: 'Aguantar',       attr: 'res' },
  { key: 'voluntad', name: 'Voluntad',       attr: 'men' },
]

/** Mapa rápido AttrKey → SkillKey */
export const ATTR_TO_SKILL: Record<AttrKey, SkillKey> = Object.fromEntries(
  ATTR_DEFS.map(d => [d.key, d.skill])
) as Record<AttrKey, SkillKey>

/** Mapa rápido SkillKey → AttrKey */
export const SKILL_TO_ATTR: Record<SkillKey, AttrKey> = Object.fromEntries(
  SKILL_DEFS.map(d => [d.key, d.attr])
) as Record<SkillKey, AttrKey>

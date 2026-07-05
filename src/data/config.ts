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
  /** Qué hace mecánicamente (ayuda contextual en la UI) */
  desc: string
}

export interface SkillDef {
  key: SkillKey
  name: string
  attr: AttrKey
  /** Qué hace y a qué atributo va ligada (ayuda contextual en la UI) */
  desc: string
}

/** Definiciones de los 6 atributos en orden canónico */
export const ATTR_DEFS: AttrDef[] = [
  { key: 'mov', name: 'Movimiento',   skill: 'correr',
    desc: 'Tus puntos de movimiento en el campo y los d10 que tiras al Esprintar (con Correr). A más valor, más dados.' },
  { key: 'fue', name: 'Fuerza',       skill: 'placar',
    desc: 'Potencia física: los d10 que tiras al Placar y al Retener a un rival (con Placar).' },
  { key: 'agi', name: 'Agilidad',     skill: 'evasion',
    desc: 'Reflejos y equilibrio: los d10 que tiras al Esquivar y al escapar de Retener (con Evasión).' },
  { key: 'tec', name: 'Técnica',      skill: 'balon',
    desc: 'Destreza fina: los d10 del juego de balón (coger, lanzar, robar…) y de colocar trampas (con Juego de balón).' },
  { key: 'res', name: 'Resistencia',  skill: 'aguantar',
    desc: 'Dureza: los d10 que tiras para Aguantar golpes y no acabar aturdido o KO (con Aguantar).' },
  { key: 'men', name: 'Mente',        skill: 'voluntad',
    desc: 'Temple y fe: los d10 de las tiradas de voluntad, de rezar a tu dios y de iniciativa (con Voluntad).' },
]

/** Definiciones de las 6 habilidades en orden canónico */
export const SKILL_DEFS: SkillDef[] = [
  { key: 'correr',   name: 'Correr',         attr: 'mov',
    desc: 'Esprintar y acciones de carrera. Ligada a Movimiento. Su nivel fija el umbral de éxito, las repeticiones y el dado auxiliar.' },
  { key: 'placar',   name: 'Placar',         attr: 'fue',
    desc: 'Placajes y Retener rivales. Ligada a Fuerza. Su nivel fija umbral, repeticiones y dado auxiliar.' },
  { key: 'evasion',  name: 'Evasión',        attr: 'agi',
    desc: 'Esquivar y escapar de Retener. Ligada a Agilidad. Su nivel fija umbral, repeticiones y dado auxiliar.' },
  { key: 'balon',    name: 'Juego de balón', attr: 'tec',
    desc: 'Coger, lanzar, recibir, interceptar y robar el balón. Ligada a Técnica. Su nivel fija umbral, repeticiones y dado auxiliar.' },
  { key: 'aguantar', name: 'Aguantar',       attr: 'res',
    desc: 'Encajar golpes y mantenerte en pie. Ligada a Resistencia. Su nivel fija umbral, repeticiones y dado auxiliar.' },
  { key: 'voluntad', name: 'Voluntad',       attr: 'men',
    desc: 'Rezar, iniciativa y pruebas de temple. Ligada a Mente. Su nivel fija umbral, repeticiones y dado auxiliar.' },
]

/** Mapa rápido AttrKey → SkillKey */
export const ATTR_TO_SKILL: Record<AttrKey, SkillKey> = Object.fromEntries(
  ATTR_DEFS.map(d => [d.key, d.skill])
) as Record<AttrKey, SkillKey>

/** Mapa rápido SkillKey → AttrKey */
export const SKILL_TO_ATTR: Record<SkillKey, AttrKey> = Object.fromEntries(
  SKILL_DEFS.map(d => [d.key, d.attr])
) as Record<SkillKey, AttrKey>

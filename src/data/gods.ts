// Documento generado el 2026-07-04-2030
import type { AttrKey, SkillKey } from '@/rules/types'

/** Dominios disponibles en el sistema de dones */
export type GodDomain = 'furia' | 'proteger' | 'curar' | 'destino' | 'mover' | 'balon'

export interface GodData {
  id: string
  name: string
  /** Los dos atributos con los que se puede rezar (se usa el mayor) */
  rezarAttrs: [AttrKey, AttrKey]
  /** Habilidad que se suma al rezar */
  rezarSkill: SkillKey
  /** Dominios de dones disponibles para este dios */
  domains: GodDomain[]
}

export const GODS: GodData[] = [
  {
    id: 'khorne',
    name: 'Khorne',
    rezarAttrs: ['fue', 'res'],
    rezarSkill: 'placar',
    domains: ['furia', 'proteger'],
  },
  {
    id: 'nurgle',
    name: 'Nurgle',
    rezarAttrs: ['res', 'men'],
    rezarSkill: 'aguantar',
    domains: ['curar', 'proteger'],
  },
  {
    id: 'tzeentch',
    name: 'Tzeentch',
    rezarAttrs: ['men', 'tec'],
    rezarSkill: 'voluntad',
    domains: ['destino', 'mover'],
  },
  {
    id: 'slaanesh',
    name: 'Slaanesh',
    rezarAttrs: ['agi', 'tec'],
    rezarSkill: 'evasion',
    domains: ['mover', 'furia'],
  },
  {
    id: 'sigmar',
    name: 'Sigmar',
    rezarAttrs: ['fue', 'men'],
    rezarSkill: 'voluntad',
    domains: ['proteger', 'furia'],
  },
  {
    id: 'shallya',
    name: 'Shallya',
    rezarAttrs: ['men', 'res'],
    rezarSkill: 'voluntad',
    domains: ['curar', 'proteger'],
  },
  {
    id: 'ranald',
    name: 'Ranald',
    rezarAttrs: ['tec', 'agi'],
    rezarSkill: 'balon',
    domains: ['destino', 'balon'],
  },
  {
    id: 'taal-rhya',
    name: 'Taal/Rhya',
    rezarAttrs: ['mov', 'res'],
    rezarSkill: 'correr',
    domains: ['curar', 'mover'],
  },
]

// Documento generado el 2026-07-05-0914
import type { AttrKey, SkillKey } from '@/rules/types'

/**
 * Acciones de la tabla «Probabilidad por acción» de la ficha.
 * Orden alfabético, con el prefijo "Balón:" en las de juego de balón.
 */
export interface ActionDef {
  id: string
  name: string
  attr: AttrKey
  skill: SkillKey
  /**
   * true → es la tirada de rezar: si el personaje venera a un dios se usa el
   * mejor de sus dos rezarAttrs + su rezarSkill; sin dios, attr/skill de aquí.
   */
  prayer?: boolean
}

export const ACTIONS: ActionDef[] = [
  { id: 'aguantar-golpe',    name: 'Aguantar golpe',     attr: 'res', skill: 'aguantar' },
  { id: 'balon-coger',       name: 'Balón: coger',       attr: 'tec', skill: 'balon' },
  { id: 'balon-interceptar', name: 'Balón: interceptar', attr: 'tec', skill: 'balon' },
  { id: 'balon-lanzar',      name: 'Balón: lanzar',      attr: 'tec', skill: 'balon' },
  { id: 'balon-recepcion',   name: 'Balón: recepción',   attr: 'tec', skill: 'balon' },
  { id: 'balon-robar',       name: 'Balón: robar',       attr: 'tec', skill: 'balon' },
  { id: 'esprintar',         name: 'Esprintar',          attr: 'mov', skill: 'correr' },
  { id: 'esquivar',          name: 'Esquivar',           attr: 'agi', skill: 'evasion' },
  { id: 'placar',            name: 'Placar',             attr: 'fue', skill: 'placar' },
  { id: 'rezar',             name: 'Rezar / voluntad',   attr: 'men', skill: 'voluntad', prayer: true },
]

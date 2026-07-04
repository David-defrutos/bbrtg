// Documento generado el 2026-07-04-2030

/** Claves de los 6 atributos */
export type AttrKey = 'mov' | 'fue' | 'agi' | 'tec' | 'res' | 'men'

/** Claves de las 6 habilidades */
export type SkillKey = 'correr' | 'placar' | 'evasion' | 'balon' | 'aguantar' | 'voluntad'

export type Attrs  = Record<AttrKey,  number>
export type Skills = Record<SkillKey, number>

// ---------------------------------------------------------------------------
// Plan del personaje
// ---------------------------------------------------------------------------

/** Reparto inicial en nivel 1 */
export interface Level1Delta {
  nivel: 1
  attrs: Attrs
  skills: Skills
  featElegida: string          // id de la dote inicial libre
  god: string | null           // null si no se elige dios aún
  equipoInicial?: string       // texto libre
  consumibleInicial?: string
  objetoNarrativo?: string
}

/** Delta de nivel 2..30: solo lo que cambia ese nivel */
export interface LevelNDelta {
  nivel: number
  skillSubida: SkillKey
  attrSubida?: AttrKey         // presente si el calendario lo indica
  featGanada?: string          // presente si el calendario lo indica
  god?: string                 // aparece como máximo una vez en todo el plan
}

export type PlanEntry = Level1Delta | LevelNDelta

/** Ficha completa de un PJ */
export interface Character {
  schemaVersion: number        // para detectar fichas obsoletas al cambiar versión
  rulesVersion: string         // p. ej. "0.30"
  nombre: string
  raza: string
  plan: PlanEntry[]            // plan[0] es siempre Level1Delta; plan[i].nivel === i+1
  nivelActual: number          // cursor 1..30 (nivel al que se juega de verdad)
  notas: string
}

// ---------------------------------------------------------------------------
// Estado calculado
// ---------------------------------------------------------------------------

/** Estado completo de un PJ a un nivel dado — resultado de fold(plan, N) */
export interface CharState {
  nivel: number
  attrs: Attrs
  skills: Skills
  /** IDs de dotes: incluye la racial más todas las ganadas hasta este nivel */
  feats: string[]
  god: string | null
}

// ---------------------------------------------------------------------------
// Validación
// ---------------------------------------------------------------------------

export interface ValidationError {
  nivel: number
  field: string
  message: string
}

export interface ValidationResult {
  ok: boolean
  errors: ValidationError[]
}

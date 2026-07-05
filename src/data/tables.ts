// Documento generado el 2026-07-04-2030

// ---------------------------------------------------------------------------
// Tabla atributo → número de dados d10
// ---------------------------------------------------------------------------

export interface AttrDiceRow {
  minAttr: number
  maxAttr: number
  dice: number
}

export const ATTR_DICE_TABLE: AttrDiceRow[] = [
  { minAttr:  1, maxAttr:  2, dice:  1 },
  { minAttr:  3, maxAttr:  4, dice:  2 },
  { minAttr:  5, maxAttr:  6, dice:  3 },
  { minAttr:  7, maxAttr:  8, dice:  4 },
  { minAttr:  9, maxAttr: 10, dice:  5 },
  { minAttr: 11, maxAttr: 12, dice:  6 },
  { minAttr: 13, maxAttr: 14, dice:  7 },
  { minAttr: 15, maxAttr: 16, dice:  8 },
  { minAttr: 17, maxAttr: 18, dice:  9 },
  { minAttr: 19, maxAttr: 20, dice: 10 },
]

// ---------------------------------------------------------------------------
// Tabla habilidad 0..10 → umbral / repeticiones / dado auxiliar
// ---------------------------------------------------------------------------

export interface SkillRow {
  skill: number
  /** Dado de d10 necesita sacar >= threshold para contar como éxito */
  threshold: number
  /** Dados fallidos que se pueden repetir */
  rerolls: number
  /** Lados del dado auxiliar (3=d3, 4=d4…) o null si no hay */
  auxDie: number | null
}

export const SKILL_TABLE: SkillRow[] = [
  { skill:  0, threshold: 10, rerolls: 0, auxDie: null },
  { skill:  1, threshold:  9, rerolls: 0, auxDie: null },
  { skill:  2, threshold:  9, rerolls: 1, auxDie: null },
  { skill:  3, threshold:  8, rerolls: 1, auxDie: null },
  { skill:  4, threshold:  8, rerolls: 1, auxDie: 3    },
  { skill:  5, threshold:  8, rerolls: 1, auxDie: 4    },
  { skill:  6, threshold:  8, rerolls: 1, auxDie: 5    },
  { skill:  7, threshold:  7, rerolls: 1, auxDie: 5    },
  { skill:  8, threshold:  7, rerolls: 1, auxDie: 6    },
  { skill:  9, threshold:  7, rerolls: 2, auxDie: 6    },
  { skill: 10, threshold:  7, rerolls: 2, auxDie: 8    },
]

// ---------------------------------------------------------------------------
// Tabla de dificultades (manual §4.6): éxitos necesarios por dificultad
// ---------------------------------------------------------------------------

export interface DifficultyRow {
  id: string
  name: string
  /** Nº de éxitos necesarios para superar la tirada */
  successes: number
}

export const DIFFICULTY_TABLE: DifficultyRow[] = [
  { id: 'facil',       name: 'Fácil',       successes: 1 },
  { id: 'normal',      name: 'Normal',      successes: 2 },
  { id: 'dificil',     name: 'Difícil',     successes: 3 },
  { id: 'muy-dificil', name: 'Muy difícil', successes: 4 },
  { id: 'legendaria',  name: 'Legendaria',  successes: 5 },
  { id: 'imposible',   name: 'Imposible',   successes: 6 },
]

// ---------------------------------------------------------------------------
// Bandas de máximos por nivel
// ---------------------------------------------------------------------------

export interface LevelCap {
  minLevel: number
  maxLevel: number
  /** Máximo de atributo base (sin objetos, dones ni mutaciones) */
  maxAttrNatural: number
  maxSkill: number
}

export const LEVEL_CAPS: LevelCap[] = [
  { minLevel:  1, maxLevel:  5, maxAttrNatural:  6, maxSkill:  4 },
  { minLevel:  6, maxLevel: 10, maxAttrNatural:  8, maxSkill:  6 },
  { minLevel: 11, maxLevel: 15, maxAttrNatural: 10, maxSkill:  8 },
  { minLevel: 16, maxLevel: 20, maxAttrNatural: 11, maxSkill:  8 },
  { minLevel: 21, maxLevel: 30, maxAttrNatural: 12, maxSkill: 10 },
]

// ---------------------------------------------------------------------------
// Calendario de recompensas — tabla explícita, 1 entrada por nivel 1..30
// Cambiar el calendario = solo editar esta tabla
// ---------------------------------------------------------------------------

export interface LevelReward {
  level: number
  /** ¿Este nivel otorga +1 atributo? */
  gainAttr: boolean
  /** ¿Este nivel otorga +1 dote? */
  gainFeat: boolean
  /** ¿La dote ganada es legendaria? */
  legendary: boolean
}

export const LEVEL_CALENDAR: LevelReward[] = [
  { level:  1, gainAttr: false, gainFeat: false, legendary: false },
  { level:  2, gainAttr: true,  gainFeat: false, legendary: false },
  { level:  3, gainAttr: false, gainFeat: false, legendary: false },
  { level:  4, gainAttr: true,  gainFeat: false, legendary: false },
  { level:  5, gainAttr: false, gainFeat: true,  legendary: false },
  { level:  6, gainAttr: true,  gainFeat: false, legendary: false },
  { level:  7, gainAttr: false, gainFeat: false, legendary: false },
  { level:  8, gainAttr: true,  gainFeat: false, legendary: false },
  { level:  9, gainAttr: false, gainFeat: false, legendary: false },
  { level: 10, gainAttr: true,  gainFeat: true,  legendary: false },
  { level: 11, gainAttr: false, gainFeat: false, legendary: false },
  { level: 12, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 13, gainAttr: false, gainFeat: false, legendary: false },
  { level: 14, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 15, gainAttr: false, gainFeat: true,  legendary: false },
  { level: 16, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 17, gainAttr: false, gainFeat: false, legendary: false },
  { level: 18, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 19, gainAttr: false, gainFeat: false, legendary: false },
  { level: 20, gainAttr: true,  gainFeat: true,  legendary: false },
  { level: 21, gainAttr: false, gainFeat: false, legendary: false },
  { level: 22, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 23, gainAttr: false, gainFeat: false, legendary: false },
  { level: 24, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 25, gainAttr: false, gainFeat: true,  legendary: false },
  { level: 26, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 27, gainAttr: false, gainFeat: false, legendary: false },
  { level: 28, gainAttr: true,  gainFeat: false, legendary: false },
  { level: 29, gainAttr: false, gainFeat: false, legendary: false },
  { level: 30, gainAttr: true,  gainFeat: true,  legendary: true  },
]

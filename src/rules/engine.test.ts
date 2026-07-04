// Documento generado el 2026-07-04-2045

import { describe, it, expect } from 'vitest'
import type { Level1Delta, LevelNDelta, PlanEntry, Character } from './types'
import { fold, replanDesde } from './engine'
import { validatePlan } from './validate'
import { expectedFeatCount } from './helpers'
import { RACES } from '@/data/races'
import { LEVEL_CALENDAR } from '@/data/tables'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const HUMANO = RACES.find(r => r.id === 'humano')!
const ORCO   = RACES.find(r => r.id === 'orco')!

// Plan válido de Humano hasta nivel 5.
// Atributos iniciales suman el reparto [5,4,3,3,2,2] repartido en 6 slots.
// Habilidades iniciales suman [3,2,2,1,1,1].
// Dote inicial: pase-seguro (prereq: balon>=2 → balon=2 ✓).
const L1: Level1Delta = {
  nivel: 1,
  attrs:  { mov: 5, fue: 4, agi: 3, tec: 3, res: 2, men: 2 },
  skills: { correr: 3, placar: 2, evasion: 1, balon: 2, aguantar: 1, voluntad: 1 },
  featElegida: 'pase-seguro',
  god: null,
}
// Nivel 2: gainAttr=true → attrSubida requerida
const L2: LevelNDelta = { nivel: 2, skillSubida: 'correr',  attrSubida: 'mov' }
// Nivel 3: sin gainAttr, sin gainFeat
const L3: LevelNDelta = { nivel: 3, skillSubida: 'placar' }
// Nivel 4: gainAttr=true
const L4: LevelNDelta = { nivel: 4, skillSubida: 'evasion', attrSubida: 'fue' }
// Nivel 5: gainFeat=true → marcaje-firme (prereq: placar>=2 → placar=3 ✓)
const L5: LevelNDelta = { nivel: 5, skillSubida: 'balon',   featGanada: 'marcaje-firme' }

const PLAN: PlanEntry[] = [L1, L2, L3, L4, L5]

// ---------------------------------------------------------------------------
// fold
// ---------------------------------------------------------------------------

describe('fold', () => {
  it('nivel 1 devuelve estado inicial con dote racial incluida', () => {
    const s = fold([L1], 1, HUMANO)
    expect(s.nivel).toBe(1)
    expect(s.attrs).toEqual(L1.attrs)
    expect(s.skills).toEqual(L1.skills)
    expect(s.feats).toContain('trabajo-en-equipo') // dote racial Humano
    expect(s.feats).toContain('pase-seguro')        // dote inicial libre
    expect(s.god).toBeNull()
  })

  it('acumula correctamente attrs y skills nivel a nivel', () => {
    const s2 = fold(PLAN, 2, HUMANO)
    expect(s2.attrs.mov).toBe(6)     // 5 + 1 en L2
    expect(s2.skills.correr).toBe(4) // 3 + 1 en L2

    const s4 = fold(PLAN, 4, HUMANO)
    expect(s4.attrs.fue).toBe(5)      // 4 + 1 en L4
    expect(s4.skills.evasion).toBe(2) // 1 + 1 en L4

    // attrs anteriores sin tocar
    expect(s4.attrs.agi).toBe(3)
    expect(s4.attrs.tec).toBe(3)
  })

  it('añade la dote cuando el calendario lo indica (nivel 5)', () => {
    const s5 = fold(PLAN, 5, HUMANO)
    expect(s5.feats).toContain('marcaje-firme')
    expect(s5.feats).toHaveLength(3) // racial + libre + dote nivel 5
  })

  it('es determinista: llamadas repetidas producen el mismo resultado', () => {
    expect(fold(PLAN, 5, HUMANO)).toEqual(fold(PLAN, 5, HUMANO))
  })

  it('plan desordenado produce el mismo resultado que el plan en orden', () => {
    const shuffled: PlanEntry[] = [L5, L2, L4, L1, L3]
    expect(fold(shuffled, 5, HUMANO)).toEqual(fold(PLAN, 5, HUMANO))
  })

  it('n mayor que el último nivel planificado devuelve nivel=n con estado del último nivel', () => {
    const s = fold(PLAN, 20, HUMANO)
    expect(s.nivel).toBe(20)
    // Values from the last planned entry (nivel 5)
    expect(s.attrs.mov).toBe(6)
    expect(s.skills.balon).toBe(3)
  })

  it('el dios se propaga a partir del nivel donde se elige', () => {
    const planConDios: PlanEntry[] = [
      L1,
      { nivel: 2, skillSubida: 'correr', attrSubida: 'mov', god: 'sigmar' } as LevelNDelta,
      L3,
    ]
    expect(fold(planConDios, 1, HUMANO).god).toBeNull()
    expect(fold(planConDios, 2, HUMANO).god).toBe('sigmar')
    expect(fold(planConDios, 3, HUMANO).god).toBe('sigmar')
  })

  it('attrs del nivel 1 no se modifican en niveles donde no hay attrSubida', () => {
    const s3 = fold(PLAN, 3, HUMANO)
    // Solo L2 tuvo attrSubida ('mov'), nivel 3 no tiene
    expect(s3.attrs.fue).toBe(4) // sin cambios hasta nivel 4
    expect(s3.attrs.agi).toBe(3)
  })
})

// ---------------------------------------------------------------------------
// replanDesde
// ---------------------------------------------------------------------------

describe('replanDesde', () => {
  it('descarta entradas desde el nivel indicado en adelante', () => {
    const result = replanDesde(PLAN, 4)
    expect(result.map(e => e.nivel)).toEqual([1, 2, 3])
  })

  it('replanDesde(plan, 1) devuelve array vacío', () => {
    expect(replanDesde(PLAN, 1)).toHaveLength(0)
  })

  it('replanDesde(plan, n>max) devuelve el plan completo intacto', () => {
    expect(replanDesde(PLAN, 99)).toEqual(PLAN)
  })

  it('replanDesde(plan, 5) elimina exactamente el nivel 5', () => {
    const result = replanDesde(PLAN, 5)
    expect(result.map(e => e.nivel)).toEqual([1, 2, 3, 4])
  })
})

// ---------------------------------------------------------------------------
// expectedFeatCount
// ---------------------------------------------------------------------------

describe('expectedFeatCount', () => {
  it('en nivel 1 son 2 dotes (racial + libre)', () => {
    expect(expectedFeatCount(1)).toBe(2)
  })

  it('en nivel 5 son 3 dotes (nivel 5 tiene gainFeat=true)', () => {
    expect(expectedFeatCount(5)).toBe(3)
  })

  it('aumenta solo en niveles con gainFeat=true según el calendario', () => {
    const gainFeatLevels = new Set(LEVEL_CALENDAR.filter(e => e.gainFeat).map(e => e.level))
    for (let n = 2; n <= 30; n++) {
      const prev = expectedFeatCount(n - 1)
      const curr = expectedFeatCount(n)
      if (gainFeatLevels.has(n)) {
        expect(curr).toBe(prev + 1)
      } else {
        expect(curr).toBe(prev)
      }
    }
  })
})

// ---------------------------------------------------------------------------
// validatePlan — plan válido
// ---------------------------------------------------------------------------

describe('validatePlan: plan válido', () => {
  it('plan válido devuelve ok=true sin errores', () => {
    const result = validatePlan(PLAN, HUMANO)
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('ningún atributo base supera su máximo aplicable en el plan válido', () => {
    const result = validatePlan(PLAN, HUMANO)
    expect(result.errors.filter(e => e.field.startsWith('attrs.'))).toHaveLength(0)
  })

  it('el nº de dotes en el estado cuadra con el calendario al nivel 5', () => {
    const state = fold(PLAN, 5, HUMANO)
    expect(state.feats).toHaveLength(expectedFeatCount(5))
  })
})

// ---------------------------------------------------------------------------
// validatePlan — distribuciones iniciales
// ---------------------------------------------------------------------------

describe('validatePlan: distribución inicial', () => {
  it('atributos con suma incorrecta producen error en nivel 1', () => {
    const bad: Level1Delta = {
      ...L1,
      attrs: { mov: 6, fue: 4, agi: 3, tec: 3, res: 2, men: 2 }, // suma diferente a [5,4,3,3,2,2]
    }
    const result = validatePlan([bad], HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.nivel === 1 && e.field === 'attrs')).toBe(true)
  })

  it('habilidades con suma incorrecta producen error en nivel 1', () => {
    const bad: Level1Delta = {
      ...L1,
      skills: { correr: 4, placar: 2, evasion: 1, balon: 2, aguantar: 1, voluntad: 1 }, // suma != [3,2,2,1,1,1]
    }
    const result = validatePlan([bad], HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.nivel === 1 && e.field === 'skills')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// validatePlan — mínimos raciales
// ---------------------------------------------------------------------------

describe('validatePlan: mínimos raciales', () => {
    it('fue por debajo del mínimo racial del Orco produce error', () => {
    // Orco necesita fue>=4; fue=2 viola el mínimo
    const badOrco: Level1Delta = {
      ...L1,
      // distribución válida: sorted = [2,2,3,3,4,5], pero fue=2 viola minima.fue=4
      attrs: { mov: 5, fue: 2, agi: 3, tec: 3, res: 4, men: 2 },
    }
    const result = validatePlan([badOrco], ORCO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.field === 'attrs.fue')).toBe(true)
  })

  it('Humano no tiene mínimos raciales y no produce ese tipo de error', () => {
    const result = validatePlan([L1], HUMANO)
    expect(result.errors.filter(e => e.field.startsWith('attrs.'))).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// validatePlan — invariante de cap de atributo
// ---------------------------------------------------------------------------

describe('validatePlan: cap de atributo', () => {
  it('atributo base que supera el máximo de banda produce error', () => {
    // L2 sube mov a 6 (cap nivel 1-5 = 6 → ok).
    // l4Bad sube mov a 7 en nivel 4 (aún en banda 1-5, cap=6 → error).
    const l4Bad: LevelNDelta = { nivel: 4, skillSubida: 'evasion', attrSubida: 'mov' }
    const result = validatePlan([L1, L2, L3, l4Bad], HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.field === 'attrs.mov' && e.nivel === 4)).toBe(true)
  })

  it('atributo subido en nivel sin gainAttr produce error', () => {
    // Nivel 3 tiene gainAttr=false
    const l3Bad: LevelNDelta = { nivel: 3, skillSubida: 'placar', attrSubida: 'fue' }
    const result = validatePlan([L1, L2, l3Bad], HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.field === 'attrSubida' && e.nivel === 3)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// validatePlan — dotes
// ---------------------------------------------------------------------------

describe('validatePlan: dotes', () => {
  it('dote ganada en nivel sin gainFeat produce error', () => {
    // Nivel 3 tiene gainFeat=false
    const l3Feat: LevelNDelta = { nivel: 3, skillSubida: 'placar', featGanada: 'marcaje-firme' }
    const result = validatePlan([L1, L2, l3Feat], HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.field === 'featGanada' && e.nivel === 3)).toBe(true)
  })

  it('prerequisito de dote no cumplido produce error', () => {
    // rompemuros requiere: golpe-de-linea, fue>=9, placar>=7 — imposible en nivel 5
    const l5Bad: LevelNDelta = { nivel: 5, skillSubida: 'balon', featGanada: 'rompemuros' }
    const result = validatePlan([L1, L2, L3, L4, l5Bad], HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.field === 'featGanada' && e.nivel === 5)).toBe(true)
  })

  it('dote con id inexistente produce error', () => {
    const l5Bad: LevelNDelta = { nivel: 5, skillSubida: 'balon', featGanada: 'no-existe' }
    const result = validatePlan([L1, L2, L3, L4, l5Bad], HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.field === 'featGanada')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// validatePlan — dios
// ---------------------------------------------------------------------------

describe('validatePlan: dios', () => {
  it('cambiar de dios produce error', () => {
    const planConDosDioses: PlanEntry[] = [
      L1,
      { nivel: 2, skillSubida: 'correr', attrSubida: 'mov', god: 'khorne' } as LevelNDelta,
      { nivel: 3, skillSubida: 'placar', god: 'sigmar' } as LevelNDelta, // cambio → error
    ]
    const result = validatePlan(planConDosDioses, HUMANO)
    expect(result.ok).toBe(false)
    expect(result.errors.some(e => e.field === 'god')).toBe(true)
  })

  it('repetir el mismo dios en dos niveles no produce error', () => {
    // No es habitual, pero tampoco está prohibido (es idempotente)
    const planConDosDioses: PlanEntry[] = [
      L1,
      { nivel: 2, skillSubida: 'correr', attrSubida: 'mov', god: 'khorne' } as LevelNDelta,
      { nivel: 3, skillSubida: 'placar', god: 'khorne' } as LevelNDelta,
    ]
    const result = validatePlan(planConDosDioses, HUMANO)
    // No debería producir error en el campo 'god'
    expect(result.errors.filter(e => e.field === 'god')).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// Round-trip export/import
// ---------------------------------------------------------------------------

describe('round-trip JSON', () => {
  it('export→import produce el mismo estado de fold', () => {
    const character: Character = {
      schemaVersion: 1,
      rulesVersion:  '0.30',
      nombre:        'Test',
      raza:          'humano',
      plan:          PLAN,
      nivelActual:   5,
      notas:         '',
    }
    const rt = JSON.parse(JSON.stringify(character)) as Character
    expect(fold(rt.plan, rt.nivelActual, HUMANO))
      .toEqual(fold(character.plan, character.nivelActual, HUMANO))
  })

  it('export→import + validate produce el mismo resultado', () => {
    const plan = PLAN
    const rt   = JSON.parse(JSON.stringify(plan)) as PlanEntry[]
    expect(validatePlan(rt, HUMANO)).toEqual(validatePlan(plan, HUMANO))
  })
})

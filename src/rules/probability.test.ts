// Documento generado el 2026-07-05-0914

import { describe, it, expect } from 'vitest'
import {
  successDistribution, probAtLeast, buildProbabilityTable,
  diceForAttr, rowForSkill,
} from './probability'
import type { RollSpec } from './probability'
import { SKILL_TABLE, DIFFICULTY_TABLE } from '@/data/tables'
import { ACTIONS } from '@/data/actions'
import type { CharState } from './types'

// ---------------------------------------------------------------------------
// Oráculo independiente: enumeración exhaustiva de caras de dado.
// Implementa la MISMA política de juego que el motor, pero recorriendo
// explícitamente cada combinación de caras (sin fórmulas de convolución
// binomial), para detectar errores silenciosos en el cálculo cerrado.
// ---------------------------------------------------------------------------

const OCAP = 12

function zeros(): number[] { return new Array<number>(OCAP + 1).fill(0) }

function shift1(d: number[]): number[] {
  const out = zeros()
  for (let k = 0; k <= OCAP; k++) if (d[k]) out[Math.min(k + 1, OCAP)]! += d[k]!
  return out
}

function oracleAuxProb(v: number, T: number, A: number): number {
  let fav = 0
  for (let a = 1; a <= A; a++) if (v + a >= T) fav++
  return fav / A
}

function oracleDist(spec: RollSpec): number[] {
  const { dice: n, threshold: T, rerolls: R, auxDie: A } = spec
  const prReroll = (11 - T) / 10
  const total = zeros()
  const add = (w: number, d: number[]) => { for (let k = 0; k <= OCAP; k++) total[k]! += w * d[k]! }

  // Fase 3: dado auxiliar sobre el mejor fallo disponible
  function applyAux(w: number, dist: number[], candidates: number[]) {
    if (A === null || candidates.length === 0) { add(w, dist); return }
    const target = Math.max(...candidates)
    for (let a = 1; a <= A; a++) {
      add(w / A, target + a >= T ? shift1(dist) : dist)
    }
  }

  // Fase 2: repeticiones (una vez cada fallo repetido, un 10 repetido NO explota)
  function enumRerolls(j: number, count: number, w: number, dist: number[], failedRerolls: number[], kept: number[]) {
    if (j === count) { applyAux(w, dist, [...kept, ...failedRerolls]); return }
    for (let face = 1; face <= 10; face++) {
      if (face >= T) enumRerolls(j + 1, count, w / 10, shift1(dist), failedRerolls, kept)
      else enumRerolls(j + 1, count, w / 10, dist, [...failedRerolls, face], kept)
    }
  }

  // Política de rescate sobre los fallos concretos
  function rescue(w: number, dist: number[], fails: number[]) {
    if (fails.length === 0) { add(w, dist); return }
    if (A === null) {
      enumRerolls(0, Math.min(fails.length, R), w, dist, [], [])
      return
    }
    const vmax = Math.max(...fails)
    if (fails.length > R) {
      // Se repiten los R más bajos; el mejor fallo se conserva para el aux
      enumRerolls(0, R, w, dist, [], [vmax])
    } else if (oracleAuxProb(vmax, T, A) >= prReroll) {
      // Conservar el mejor fallo para el aux; repetir el resto
      enumRerolls(0, fails.length - 1, w, dist, [], [vmax])
    } else {
      // Repetir todo; el aux irá al mejor fallo de las repeticiones
      enumRerolls(0, fails.length, w, dist, [], [])
    }
  }

  // Un d10 con su cadena de explosiones: el fallo terminal de una cadena es
  // un dado fallido normal (repetible / candidato al aux) → entra en `fails`
  function rollDie(w: number, dist: number[], fails: number[], depth: number,
                   cont: (w: number, dist: number[], fails: number[]) => void) {
    for (let face = 1; face <= 10; face++) {
      if (face < T) cont(w / 10, dist, [...fails, face])
      else if (face < 10 || depth === 0) cont(w / 10, shift1(dist), fails)
      else rollDie(w / 10, shift1(dist), fails, depth - 1, cont)
    }
  }

  // Fase 1: tirada inicial con explosión de 10s naturales
  function enumDice(i: number, w: number, dist: number[], fails: number[]) {
    if (i === n) { rescue(w, dist, fails); return }
    rollDie(w, dist, fails, 5, (w2, d2, f2) => enumDice(i + 1, w2, d2, f2))
  }

  const d0 = zeros(); d0[0] = 1
  enumDice(0, 1, d0, [])
  return total
}

// ---------------------------------------------------------------------------
// Valores exactos calculados a mano
// ---------------------------------------------------------------------------

describe('successDistribution: valores exactos a mano', () => {
  it('1d10, habilidad 0 (≥10, sin extras): P(≥1)=0.1, P(≥2)=0.01', () => {
    const d = successDistribution({ dice: 1, threshold: 10, rerolls: 0, auxDie: null })
    expect(probAtLeast(d, 1)).toBeCloseTo(0.1, 10)
    expect(probAtLeast(d, 2)).toBeCloseTo(0.01, 10) // 10 y la cadena vuelve a sacar 10
  })

  it('1d10, habilidad 1 (≥9): P(≥1)=0.2, P(≥2)=0.02', () => {
    const d = successDistribution({ dice: 1, threshold: 9, rerolls: 0, auxDie: null })
    expect(probAtLeast(d, 1)).toBeCloseTo(0.2, 10)
    expect(probAtLeast(d, 2)).toBeCloseTo(0.1 * 0.2, 10) // 10 natural y cadena ≥9
  })

  it('1d10, habilidad 2 (≥9, 1 reroll): P(≥1) = 0.2 + 0.8·0.2 = 0.36', () => {
    const d = successDistribution({ dice: 1, threshold: 9, rerolls: 1, auxDie: null })
    expect(probAtLeast(d, 1)).toBeCloseTo(0.36, 10)
  })

  it('el fallo terminal de una explosión puede repetirse: 1d10 hab.2, P(≥2)=0.036', () => {
    // 10 natural (0.1) y después: cadena ≥9 (0.2) O cadena falla (0.8) y la
    // repetición saca ≥9 (0.2) → 0.1 · (0.2 + 0.8·0.2) = 0.036
    const d = successDistribution({ dice: 1, threshold: 9, rerolls: 1, auxDie: null })
    expect(probAtLeast(d, 2)).toBeCloseTo(0.036, 10)
  })

  it('1d10, habilidad 4 (≥8, 1 reroll, aux d3): P(≥1) = 0.7 con juego óptimo', () => {
    // Fallo v uniforme 1..7. v=7 → aux convierte seguro (mejor que repetir);
    // v=6 → 2/3; v=5 → 1/3; v≤4 → repetir (0.3) y aux al fallo fresco (2/7).
    // P(rescate) = (4·0.5 + 1/3 + 2/3 + 1)/7 = 4/7 → P(≥1) = 0.3 + 0.7·4/7 = 0.7
    const d = successDistribution({ dice: 1, threshold: 8, rerolls: 1, auxDie: 3 })
    expect(probAtLeast(d, 1)).toBeCloseTo(0.7, 10)
  })
})

// ---------------------------------------------------------------------------
// Invariantes
// ---------------------------------------------------------------------------

describe('successDistribution: invariantes', () => {
  const specs: RollSpec[] = []
  for (const dice of [1, 2, 3, 5, 10]) {
    for (const row of SKILL_TABLE) {
      specs.push({ dice, threshold: row.threshold, rerolls: row.rerolls, auxDie: row.auxDie })
    }
  }

  it('toda distribución suma 1', () => {
    for (const spec of specs) {
      const sum = successDistribution(spec).reduce((s, v) => s + v, 0)
      expect(sum).toBeCloseTo(1, 9)
    }
  })

  it('P(≥k) es decreciente en la dificultad', () => {
    for (const spec of specs) {
      const d = successDistribution(spec)
      for (let k = 1; k <= 6; k++) {
        expect(probAtLeast(d, k)).toBeLessThanOrEqual(probAtLeast(d, k - 1) + 1e-12)
      }
    }
  })

  it('más dados nunca reduce P(≥k)', () => {
    for (const row of SKILL_TABLE) {
      for (let dice = 1; dice < 6; dice++) {
        const a = successDistribution({ dice, threshold: row.threshold, rerolls: row.rerolls, auxDie: row.auxDie })
        const b = successDistribution({ dice: dice + 1, threshold: row.threshold, rerolls: row.rerolls, auxDie: row.auxDie })
        for (let k = 1; k <= 6; k++) {
          expect(probAtLeast(b, k)).toBeGreaterThanOrEqual(probAtLeast(a, k) - 1e-12)
        }
      }
    }
  })

  it('los rerolls y el dado auxiliar nunca perjudican', () => {
    for (const dice of [1, 3, 5]) {
      const base    = successDistribution({ dice, threshold: 8, rerolls: 0, auxDie: null })
      const reroll  = successDistribution({ dice, threshold: 8, rerolls: 1, auxDie: null })
      const auxAlso = successDistribution({ dice, threshold: 8, rerolls: 1, auxDie: 4 })
      for (let k = 1; k <= 6; k++) {
        expect(probAtLeast(reroll, k)).toBeGreaterThanOrEqual(probAtLeast(base, k) - 1e-12)
        expect(probAtLeast(auxAlso, k)).toBeGreaterThanOrEqual(probAtLeast(reroll, k) - 1e-12)
      }
    }
  })

  it('la explosión permite más éxitos que dados (Imposible 6+ con 2d10)', () => {
    const d = successDistribution({ dice: 2, threshold: 7, rerolls: 2, auxDie: 8 })
    expect(probAtLeast(d, 6)).toBeGreaterThan(0)
  })
})

// ---------------------------------------------------------------------------
// Motor vs oráculo por enumeración exhaustiva
// ---------------------------------------------------------------------------

describe('successDistribution coincide con el oráculo de enumeración', () => {
  // 3d10 solo sin dado auxiliar: la enumeración con aux es combinatoriamente cara
  const cases: Array<[number, number]> = []
  for (const skill of [0, 1, 2, 3, 4, 7, 10]) cases.push([1, skill], [2, skill])
  for (const skill of [0, 1, 2, 3]) cases.push([3, skill])

  for (const [dice, skill] of cases) {
    it(`dice=${dice}, habilidad=${skill}`, () => {
      const row = SKILL_TABLE.find(r => r.skill === skill)!
      const spec: RollSpec = { dice, threshold: row.threshold, rerolls: row.rerolls, auxDie: row.auxDie }
      const engine = successDistribution(spec)
      const oracle = oracleDist(spec)
      for (let k = 0; k <= 6; k++) {
        // Tolerancia por truncar la cadena de explosiones a 5 niveles en el oráculo
        expect(probAtLeast(engine, k)).toBeCloseTo(probAtLeast(oracle, k), 4)
      }
    }, 20000)
  }
})

// ---------------------------------------------------------------------------
// Tabla por acción
// ---------------------------------------------------------------------------

function mkState(over: Partial<CharState> = {}): CharState {
  return {
    nivel: 1,
    attrs:  { mov: 5, fue: 4, agi: 3, tec: 3, res: 2, men: 2 },
    skills: { correr: 3, placar: 2, evasion: 1, balon: 2, aguantar: 1, voluntad: 1 },
    feats: [], god: null,
    ...over,
  }
}

describe('buildProbabilityTable', () => {
  it('una fila por acción y una probabilidad por dificultad', () => {
    const rows = buildProbabilityTable(mkState())
    expect(rows).toHaveLength(ACTIONS.length)
    for (const r of rows) {
      expect(r.probs).toHaveLength(DIFFICULTY_TABLE.length)
      for (const p of r.probs) {
        expect(p).toBeGreaterThanOrEqual(0)
        expect(p).toBeLessThanOrEqual(1)
      }
    }
  })

  it('sin dios, Rezar usa Mente · Voluntad', () => {
    const row = buildProbabilityTable(mkState()).find(r => r.action.id === 'rezar')!
    expect(row.attrKey).toBe('men')
    expect(row.skillKey).toBe('voluntad')
  })

  it('con dios, Rezar usa el mejor rezarAttr del dios y su rezarSkill', () => {
    // Khorne reza con Fue/Res + Placar; con fue=4 > res=2 debe elegir fue
    const row = buildProbabilityTable(mkState({ god: 'khorne' })).find(r => r.action.id === 'rezar')!
    expect(row.attrKey).toBe('fue')
    expect(row.skillKey).toBe('placar')
    expect(row.spec.dice).toBe(diceForAttr(4))
    expect(row.spec.threshold).toBe(rowForSkill(2).threshold)
  })

  it('cada acción usa el atributo y habilidad reales del personaje', () => {
    const state = mkState()
    for (const r of buildProbabilityTable(state)) {
      if (r.action.prayer) continue
      expect(r.attrValue).toBe(state.attrs[r.action.attr])
      expect(r.skillValue).toBe(state.skills[r.action.skill])
    }
  })
})

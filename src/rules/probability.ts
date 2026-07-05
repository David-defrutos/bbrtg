// Documento generado el 2026-07-05-0914

/**
 * Motor de probabilidades de la tirada básica (manual v0.30 §4.3–4.6).
 *
 * Mecánica implementada (confirmada con el autor del manual):
 *  - Se tiran N d10 (N según atributo, ATTR_DICE_TABLE). Cada dado con valor
 *    >= umbral (según habilidad, SKILL_TABLE) es 1 éxito.
 *  - Un 10 NATURAL explota: cuenta su éxito y añade 1 d10 extra, que puede
 *    volver a explotar (cadena ilimitada).
 *  - Los d10 extra de una explosión que fallan son dados fallidos NORMALES
 *    (confirmado por el autor): pueden repetirse y, por coherencia, también
 *    recibir el dado auxiliar.
 *  - Repeticiones: hasta R dados FALLIDOS (del pool o de una cadena) se
 *    repiten una vez cada uno; un 10 obtenido en la repetición cuenta éxito
 *    pero NO explota.
 *  - Dado auxiliar: se tira una vez y se suma a UN dado fallido a elección;
 *    si alcanza el umbral, ese dado pasa a ser 1 éxito (no explota).
 *
 * Política de juego modelada (juego óptimo razonable, documentada porque el
 * manual deja la elección al jugador):
 *  - Si hay más fallos que repeticiones, se repiten los fallos MÁS BAJOS y se
 *    conserva el mejor fallo como objetivo del dado auxiliar.
 *  - Si todos los fallos podrían repetirse, el mejor fallo se conserva sin
 *    repetir cuando el auxiliar lo convierte con probabilidad >= que la de
 *    éxito de una repetición; si no, se repite todo.
 *  - El auxiliar se aplica al fallo de mayor valor disponible tras las
 *    repeticiones (incluidas las repeticiones falladas).
 *
 * Todo el cálculo es exacto (convolución de distribuciones), sin simulación.
 */

import { ATTR_DICE_TABLE, SKILL_TABLE, DIFFICULTY_TABLE } from '@/data/tables'
import type { SkillRow } from '@/data/tables'
import { ACTIONS } from '@/data/actions'
import type { ActionDef } from '@/data/actions'
import { GODS } from '@/data/gods'
import type { AttrKey, SkillKey, CharState } from './types'

// ---------------------------------------------------------------------------
// Lecturas de tablas
// ---------------------------------------------------------------------------

/** Nº de d10 que corresponde a un valor de atributo (tabla atributo→dados) */
export function diceForAttr(attrValue: number): number {
  const row = ATTR_DICE_TABLE.find(r => attrValue >= r.minAttr && attrValue <= r.maxAttr)
  if (row) return row.dice
  // Fuera de tabla: extremo más cercano (nunca 0 dados)
  const first = ATTR_DICE_TABLE[0]!
  const last  = ATTR_DICE_TABLE[ATTR_DICE_TABLE.length - 1]!
  return attrValue < first.minAttr ? first.dice : last.dice
}

/** Fila de la tabla de habilidad para un nivel dado (fuera de rango: extremo) */
export function rowForSkill(skillValue: number): SkillRow {
  const row = SKILL_TABLE.find(r => r.skill === skillValue)
  if (row) return row
  const sorted = [...SKILL_TABLE].sort((a, b) => a.skill - b.skill)
  return skillValue < sorted[0]!.skill ? sorted[0]! : sorted[sorted.length - 1]!
}

// ---------------------------------------------------------------------------
// Distribución de éxitos
// ---------------------------------------------------------------------------

export interface RollSpec {
  /** Nº de d10 del pool */
  dice: number
  /** Éxito con valor >= threshold */
  threshold: number
  /** Dados fallidos que pueden repetirse (una vez, sin explosión) */
  rerolls: number
  /** Lados del dado auxiliar, o null si no hay */
  auxDie: number | null
}

/** Nº máximo de éxitos representado individualmente; el último índice acumula "CAP o más" */
const CAP = 12

function delta0(): number[] {
  const d = new Array<number>(CAP + 1).fill(0)
  d[0] = 1
  return d
}

/** Convolución de dos distribuciones truncadas en CAP (bucket CAP = "CAP o más") */
function convolve(a: number[], b: number[]): number[] {
  const out = new Array<number>(CAP + 1).fill(0)
  for (let i = 0; i < a.length; i++) {
    if (a[i] === 0) continue
    for (let j = 0; j < b.length; j++) {
      out[Math.min(i + j, CAP)]! += a[i]! * b[j]!
    }
  }
  return out
}

/** P(k) de una Binomial(n, p) */
function binomPmf(n: number, k: number, p: number): number {
  let coef = 1
  for (let i = 0; i < k; i++) coef = (coef * (n - i)) / (i + 1)
  return coef * Math.pow(p, k) * Math.pow(1 - p, n - k)
}

/** Desplaza una distribución +1 éxito con probabilidad q (Bernoulli convuelta) */
function addBernoulli(dist: number[], q: number): number[] {
  if (q === 0) return dist
  const out = new Array<number>(CAP + 1).fill(0)
  for (let k = 0; k <= CAP; k++) {
    if (dist[k] === 0) continue
    out[k]! += dist[k]! * (1 - q)
    out[Math.min(k + 1, CAP)]! += dist[k]! * q
  }
  return out
}

/**
 * Distribución conjunta de UN dado del pool con explosión en cadena:
 * (éxitos j, ¿deja un dado fallido en mesa?).
 * La cadena de un dado termina en un resultado no-10: o éxito (sin fallo) o
 * fallo (1 dado fallido, repetible / candidato al auxiliar).
 *  - con fallo:  j=0 → pFail (fallo inicial); j>=1 → p10^j · pFail
 *  - sin fallo:  j>=1 → p10^(j-1) · pPlain
 */
function dieJointDist(threshold: number): { noFail: number[]; oneFail: number[] } {
  const pFail  = (threshold - 1) / 10
  const pPlain = (10 - threshold) / 10 // éxito sin explotar: threshold..9
  const p10    = 1 / 10
  const noFail  = new Array<number>(CAP + 1).fill(0)
  const oneFail = new Array<number>(CAP + 1).fill(0)
  oneFail[0] = pFail
  for (let j = 1; j <= CAP; j++) {
    noFail[j]  = Math.pow(p10, j - 1) * pPlain
    oneFail[j] = Math.pow(p10, j) * pFail
  }
  // Masa residual de cadenas más largas que CAP: al bucket CAP (sin fallo)
  const sum = noFail.reduce((s, v) => s + v, 0) + oneFail.reduce((s, v) => s + v, 0)
  noFail[CAP]! += Math.max(0, 1 - sum)
  return { noFail, oneFail }
}

/** P(el aux convierta un fallo concreto de valor v): aux ~ U(1..A), v + aux >= T */
function singleAuxProb(v: number, threshold: number, auxDie: number): number {
  const need = threshold - v
  return Math.max(0, Math.min(auxDie, auxDie - need + 1)) / auxDie
}

/**
 * P(convertir con el aux el mejor fallo disponible), siendo los candidatos:
 * un fallo conservado de valor vKept (0 = ninguno) y jFresh fallos "frescos"
 * (valores U(1..T-1) iid, p. ej. repeticiones falladas).
 */
function auxBestTargetProb(vKept: number, jFresh: number, threshold: number, auxDie: number): number {
  const m1 = threshold - 1
  if (m1 <= 0 || (vKept <= 0 && jFresh <= 0)) return 0
  // M = max(vKept, frescos); CDF_M(m) = (m >= vKept) ? (m/m1)^jFresh : 0
  const cdf = (m: number): number => (m < vKept ? 0 : Math.pow(m / m1, jFresh))
  let p = 0
  for (let m = Math.max(1, vKept); m <= m1; m++) {
    p += (cdf(m) - cdf(m - 1)) * singleAuxProb(m, threshold, auxDie)
  }
  return p
}

/** P(max de k fallos originales = v), fallos ~ U(1..T-1) iid */
function pMaxOfFails(v: number, k: number, threshold: number): number {
  const m1 = threshold - 1
  return (Math.pow(v, k) - Math.pow(v - 1, k)) / Math.pow(m1, k)
}

/**
 * Distribución exacta de éxitos de la tirada completa.
 * Devuelve [P(0), P(1), …, P(CAP o más)]; suma 1.
 */
export function successDistribution(spec: RollSpec): number[] {
  const { dice: n, threshold, rerolls, auxDie } = spec
  if (n <= 0) return delta0()

  const pReroll = (11 - threshold) / 10 // repetición: éxito con threshold..10, sin explotar
  const m1      = threshold - 1
  const { noFail, oneFail } = dieJointDist(threshold)

  // dp[f] = distribución de éxitos base cuando quedan f dados fallidos en mesa
  // (fallos del pool + fallos terminales de cadenas de explosión). La masa de
  // P(F=f) va incluida en dp[f].
  let dp: number[][] = [delta0()]
  for (let i = 1; i <= n; i++) {
    const next: number[][] = Array.from({ length: i + 1 }, () => new Array<number>(CAP + 1).fill(0))
    for (let f = 0; f < dp.length; f++) {
      for (let s = 0; s <= CAP; s++) {
        const w = dp[f]![s]!
        if (w === 0) continue
        for (let j = 0; j <= CAP; j++) {
          if (noFail[j])  next[f]![Math.min(s + j, CAP)]!     += w * noFail[j]!
          if (oneFail[j]) next[f + 1]![Math.min(s + j, CAP)]! += w * oneFail[j]!
        }
      }
    }
    dp = next
  }

  const total = new Array<number>(CAP + 1).fill(0)
  const acc = (weight: number, dist: number[]) => {
    if (weight === 0) return
    for (let k = 0; k <= CAP; k++) total[k]! += weight * dist[k]!
  }

  for (let f = 0; f < dp.length; f++) {
    const base = dp[f]!

    if (f === 0) { acc(1, base); continue }

    if (auxDie === null) {
      // Solo repeticiones: extra ~ Binomial(min(f,R), pReroll)
      const r = Math.min(f, rerolls)
      for (let s = 0; s <= r; s++) {
        const dist = new Array<number>(CAP + 1).fill(0)
        dist[Math.min(s, CAP)] = 1
        acc(binomPmf(r, s, pReroll), convolve(base, dist))
      }
      continue
    }

    if (f > rerolls) {
      // Se repiten los R fallos más bajos; el mejor fallo (max de f) se conserva
      // como objetivo del aux junto a las repeticiones falladas.
      for (let v = 1; v <= m1; v++) {
        const pV = pMaxOfFails(v, f, threshold)
        for (let s = 0; s <= rerolls; s++) {
          const pS = binomPmf(rerolls, s, pReroll)
          const q  = auxBestTargetProb(v, rerolls - s, threshold, auxDie)
          let extra = delta0()
          extra[0] = 0; extra[Math.min(s, CAP)] = 1
          extra = addBernoulli(extra, q)
          acc(pV * pS, convolve(base, extra))
        }
      }
      continue
    }

    // f <= R: decisión según el mejor fallo v
    for (let v = 1; v <= m1; v++) {
      const pV = pMaxOfFails(v, f, threshold)
      if (pV === 0) continue

      if (singleAuxProb(v, threshold, auxDie) >= pReroll) {
        // Conservar v para el aux; repetir los otros f-1 fallos
        for (let s = 0; s <= f - 1; s++) {
          const pS = binomPmf(f - 1, s, pReroll)
          const q  = auxBestTargetProb(v, f - 1 - s, threshold, auxDie)
          let extra = delta0()
          extra[0] = 0; extra[Math.min(s, CAP)] = 1
          extra = addBernoulli(extra, q)
          acc(pV * pS, convolve(base, extra))
        }
      } else {
        // Repetir todos los fallos; el aux va al mejor fallo de las repeticiones
        for (let s = 0; s <= f; s++) {
          const pS = binomPmf(f, s, pReroll)
          const q  = auxBestTargetProb(0, f - s, threshold, auxDie)
          let extra = delta0()
          extra[0] = 0; extra[Math.min(s, CAP)] = 1
          extra = addBernoulli(extra, q)
          acc(pV * pS, convolve(base, extra))
        }
      }
    }
  }
  return total
}

/** P(éxitos >= k) sobre una distribución devuelta por successDistribution */
export function probAtLeast(dist: number[], k: number): number {
  let p = 0
  for (let i = Math.min(k, CAP); i < dist.length; i++) p += dist[i]!
  return Math.min(1, Math.max(0, p))
}

// ---------------------------------------------------------------------------
// Tabla de probabilidad por acción × dificultad para un personaje
// ---------------------------------------------------------------------------

export interface ActionProbRow {
  action: ActionDef
  /** Atributo/habilidad realmente usados (rezar puede redirigir al dios) */
  attrKey: AttrKey
  skillKey: SkillKey
  attrValue: number
  skillValue: number
  spec: RollSpec
  /** P(superar) por dificultad, en el orden de DIFFICULTY_TABLE */
  probs: number[]
}

/** Resuelve atributo y habilidad de una acción para un estado (rezar → dios) */
function resolveActionAttrSkill(action: ActionDef, state: CharState): { attr: AttrKey; skill: SkillKey } {
  if (action.prayer && state.god) {
    const god = GODS.find(g => g.id === state.god)
    if (god) {
      const [a1, a2] = god.rezarAttrs
      const attr = state.attrs[a1] >= state.attrs[a2] ? a1 : a2
      return { attr, skill: god.rezarSkill }
    }
  }
  return { attr: action.attr, skill: action.skill }
}

/**
 * Tabla completa de probabilidades del personaje: una fila por acción del
 * catálogo ACTIONS, una columna por dificultad de DIFFICULTY_TABLE.
 */
export function buildProbabilityTable(state: CharState): ActionProbRow[] {
  return ACTIONS.map(action => {
    const { attr, skill } = resolveActionAttrSkill(action, state)
    const attrValue  = state.attrs[attr]
    const skillValue = state.skills[skill]
    const row = rowForSkill(skillValue)
    const spec: RollSpec = {
      dice: diceForAttr(attrValue),
      threshold: row.threshold,
      rerolls: row.rerolls,
      auxDie: row.auxDie,
    }
    const dist = successDistribution(spec)
    return {
      action, attrKey: attr, skillKey: skill, attrValue, skillValue, spec,
      probs: DIFFICULTY_TABLE.map(d => probAtLeast(dist, d.successes)),
    }
  })
}

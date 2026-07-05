// Documento generado el 2026-07-05-0914

import { describe, it, expect } from 'vitest'
import { remainingPool, isValidAssignment } from './pool'
import { INITIAL_ATTRS, INITIAL_SKILLS } from '@/data/config'

describe('remainingPool (bug #1: el pool nunca se corrompe)', () => {
  it('sin asignaciones devuelve el pool inicial completo ordenado desc', () => {
    expect(remainingPool(INITIAL_ATTRS, [null, null, null, null, null, null]))
      .toEqual([5, 4, 3, 3, 2, 2])
  })

  it('cada valor asignado consume exactamente UNA ocurrencia', () => {
    // Asignados un 3 y un 2: el pool conserva el otro 3 y el otro 2
    expect(remainingPool(INITIAL_ATTRS, [3, 2, null, null, null, null]))
      .toEqual([5, 4, 3, 2])
  })

  it('regresión: reasignar un 4 sobre un slot que tenía el 5 devuelve el 5 al pool', () => {
    // Escenario del bug: mov=5 asignado; el jugador reasigna el 4 a mov.
    // Antes: el 5 se duplicaba y el 4 desaparecía. Ahora el pool se deriva.
    const afterSwap = remainingPool(INITIAL_ATTRS, [4, null, null, null, null, null])
    expect(afterSwap).toEqual([5, 3, 3, 2, 2])
    expect(afterSwap.filter(v => v === 5)).toHaveLength(1)
    expect(afterSwap.filter(v => v === 4)).toHaveLength(0) // está asignado, no en el pool
  })

  it('invariante multiconjunto: pool + asignados = inicial, en cualquier estado', () => {
    // Simula una secuencia de asignaciones/desasignaciones arbitraria
    const assigned: (number | null)[] = [null, null, null, null, null, null]
    const steps: Array<[number, number | null]> = [
      [0, 5], [1, 4], [0, 4], // reasignación conflictiva (el caso del bug)
      [2, 3], [3, 3], [2, null], [4, 2], [5, 2], [2, 3], [0, 5],
    ]
    for (const [slot, val] of steps) {
      // El componente solo puede asignar valores presentes en el pool derivado
      const pool = remainingPool(INITIAL_ATTRS, assigned)
      if (val !== null && !pool.includes(val)) continue
      assigned[slot] = val
      const nowPool = remainingPool(INITIAL_ATTRS, assigned)
      const together = [...nowPool, ...assigned.filter((v): v is number => v !== null)]
        .sort((a, b) => b - a)
      expect(together).toEqual([...INITIAL_ATTRS].sort((a, b) => b - a))
    }
  })

  it('funciona igual con el pool de habilidades', () => {
    expect(remainingPool(INITIAL_SKILLS, [3, 1, 1, null, null, null]))
      .toEqual([2, 2, 1])
  })
})

describe('isValidAssignment', () => {
  it('acepta asignaciones parciales legales', () => {
    expect(isValidAssignment(INITIAL_ATTRS, [5, 4, null, null, null, null])).toBe(true)
    expect(isValidAssignment(INITIAL_ATTRS, [null, null, null, null, null, null])).toBe(true)
    expect(isValidAssignment(INITIAL_ATTRS, [5, 4, 3, 3, 2, 2])).toBe(true)
  })

  it('rechaza valores que no existen en el inicial', () => {
    expect(isValidAssignment(INITIAL_ATTRS, [6, null, null, null, null, null])).toBe(false)
  })

  it('rechaza más ocurrencias de un valor que las del inicial', () => {
    expect(isValidAssignment(INITIAL_ATTRS, [5, 5, null, null, null, null])).toBe(false)
    expect(isValidAssignment(INITIAL_ATTRS, [3, 3, 3, null, null, null])).toBe(false)
  })
})

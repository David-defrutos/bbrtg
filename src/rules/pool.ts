// Documento generado el 2026-07-05-0914

/**
 * Reparto de un pool de valores (chip-select del asistente).
 *
 * El pool disponible NUNCA se muta a mano: se deriva como diferencia
 * multiconjunto entre la distribución inicial y lo ya asignado. Así es
 * imposible que un valor "desaparezca" o se duplique al reasignar.
 */

/**
 * Diferencia multiconjunto: valores de `initial` que quedan libres una vez
 * descontados los `assigned` (null = slot sin asignar). Orden descendente.
 * Cada valor asignado consume exactamente UNA ocurrencia del inicial.
 */
export function remainingPool(initial: number[], assigned: (number | null)[]): number[] {
  const pool = [...initial]
  for (const val of assigned) {
    if (val === null) continue
    const idx = pool.indexOf(val)
    if (idx >= 0) pool.splice(idx, 1)
  }
  return pool.sort((a, b) => b - a)
}

/**
 * ¿Es `assigned` (ignorando nulls) un sub-multiconjunto de `initial`?
 * Si no lo es, el borrador está corrupto y no debe restaurarse.
 */
export function isValidAssignment(initial: number[], assigned: (number | null)[]): boolean {
  const pool = [...initial]
  for (const val of assigned) {
    if (val === null) continue
    const idx = pool.indexOf(val)
    if (idx < 0) return false
    pool.splice(idx, 1)
  }
  return true
}

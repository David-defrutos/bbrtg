// Documento generado el 2026-07-05-1040

import { describe, it, expect } from 'vitest'
import { parseCharacterJSON } from './parseCharacter'
import { effectiveAttrs } from './helpers'
import { SCHEMA_VERSION, RULES_VERSION, MAX_ATTR_ABSOLUTE } from '@/data/config'
import type { Attrs, Character, Level1Delta } from './types'

const L1: Level1Delta = {
  nivel: 1,
  attrs:  { mov: 5, fue: 4, agi: 3, tec: 3, res: 2, men: 2 },
  skills: { correr: 3, placar: 2, evasion: 1, balon: 2, aguantar: 1, voluntad: 1 },
  featElegida: 'pase-seguro',
  god: null,
}

function validChar(over: Partial<Character> = {}): Character {
  return {
    schemaVersion: SCHEMA_VERSION,
    rulesVersion: RULES_VERSION,
    nombre: 'Test',
    raza: 'humano',
    plan: [L1],
    nivelActual: 1,
    notas: '',
    ...over,
  }
}

describe('parseCharacterJSON: errores duros', () => {
  it('rechaza JSON ilegible', () => {
    expect(() => parseCharacterJSON('{no es json')).toThrow(/JSON válido/)
  })

  it('rechaza formas que no son un objeto', () => {
    expect(() => parseCharacterJSON('[1,2]')).toThrow(/objeto/)
    expect(() => parseCharacterJSON('"hola"')).toThrow(/objeto/)
  })

  it('rechaza schemaVersion ausente o incompatible', () => {
    expect(() => parseCharacterJSON(JSON.stringify({ raza: 'humano', plan: [] })))
      .toThrow(/schemaVersion/)
    expect(() => parseCharacterJSON(JSON.stringify(validChar({ schemaVersion: 99 }))))
      .toThrow(/incompatible/)
  })

  it('rechaza raza desconocida', () => {
    expect(() => parseCharacterJSON(JSON.stringify(validChar({ raza: 'gnomo' }))))
      .toThrow(/Raza desconocida/)
  })

  it('rechaza plan con niveles inválidos o duplicados', () => {
    const badNivel = validChar({ plan: [{ ...L1, nivel: 99 as 1 }] })
    expect(() => parseCharacterJSON(JSON.stringify(badNivel))).toThrow(/nivel válido/)

    const dup = validChar({ plan: [L1, { nivel: 1 } as unknown as Level1Delta] })
    expect(() => parseCharacterJSON(JSON.stringify(dup))).toThrow(/dos entradas/)
  })
})

describe('parseCharacterJSON: avisos (señalar, no arreglar)', () => {
  it('un personaje válido pasa sin avisos', () => {
    const { character, warnings } = parseCharacterJSON(JSON.stringify(validChar()))
    expect(warnings).toHaveLength(0)
    expect(character.nombre).toBe('Test')
  })

  it('rulesVersion distinta produce aviso, no error', () => {
    const { warnings } = parseCharacterJSON(JSON.stringify(validChar({ rulesVersion: '0.29' })))
    expect(warnings.some(w => w.includes('0.29'))).toBe(true)
  })

  it('nivelActual fuera de 1..30 produce aviso y NO se recorta', () => {
    const { character, warnings } = parseCharacterJSON(JSON.stringify(validChar({ nivelActual: 99 })))
    expect(warnings.some(w => w.includes('nivelActual'))).toBe(true)
    expect(character.nivelActual).toBe(99) // regla de oro: nunca clampar en silencio
  })

  it('equipo con id desconocido produce aviso', () => {
    const { warnings } = parseCharacterJSON(JSON.stringify(validChar({ equipo: ['no-existe'] })))
    expect(warnings.some(w => w.includes('no-existe'))).toBe(true)
  })

  it('equipo válido no produce aviso', () => {
    const { warnings } = parseCharacterJSON(JSON.stringify(validChar({ equipo: ['guantelete-de-fuerza'] })))
    expect(warnings).toHaveLength(0)
  })
})

describe('effectiveAttrs', () => {
  const base: Attrs = { mov: 5, fue: 12, agi: 3, tec: 3, res: 2, men: 2 }

  it('sin equipo devuelve la base intacta y modified=false', () => {
    const eff = effectiveAttrs(base, undefined)
    expect(eff.attrs).toEqual(base)
    expect(eff.modified).toBe(false)
    expect(eff.overCap).toHaveLength(0)
  })

  it('objetos sin attrBonus no modifican nada', () => {
    const eff = effectiveAttrs(base, ['coderas-de-hierro', 'pocion-menor'])
    expect(eff.attrs).toEqual(base)
    expect(eff.modified).toBe(false)
  })

  it('el guantelete sube Fuerza efectiva por encima del máximo racial (§4.3)', () => {
    // Ejemplo literal del manual: Orco Fue 12 + guantelete = 13 = 7d10
    const eff = effectiveAttrs(base, ['guantelete-de-fuerza'])
    expect(eff.attrs.fue).toBe(13)
    expect(eff.modified).toBe(true)
    expect(eff.overCap).toHaveLength(0)
  })

  it('los bonos se acumulan y no mutan la base', () => {
    const eff = effectiveAttrs(base, ['guantelete-de-fuerza', 'guantelete-de-fuerza', 'botas-de-viento'])
    expect(eff.attrs.fue).toBe(14)
    expect(eff.attrs.mov).toBe(6)
    expect(base.fue).toBe(12) // sin mutación
  })

  it('superar el máximo absoluto se SEÑALA, no se recorta', () => {
    const alto: Attrs = { ...base, fue: MAX_ATTR_ABSOLUTE }
    const eff = effectiveAttrs(alto, ['guantelete-de-fuerza'])
    expect(eff.attrs.fue).toBe(MAX_ATTR_ABSOLUTE + 1) // nunca clampar en silencio
    expect(eff.overCap).toContain('fue')
  })

  it('ids desconocidos se ignoran sin romper', () => {
    const eff = effectiveAttrs(base, ['no-existe'])
    expect(eff.attrs).toEqual(base)
  })
})

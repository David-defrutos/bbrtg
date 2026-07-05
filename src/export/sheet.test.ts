// Documento generado el 2026-07-05-0914

import { describe, it, expect } from 'vitest'
import { buildSheetHTML, fmtPct } from './sheet'
import type { Character, Level1Delta, LevelNDelta } from '@/rules/types'
import { RACES } from '@/data/races'
import { FEATS } from '@/data/feats'
import { ACTIONS } from '@/data/actions'
import { DIFFICULTY_TABLE } from '@/data/tables'

const HUMANO = RACES.find(r => r.id === 'humano')!

const L1: Level1Delta = {
  nivel: 1,
  attrs:  { mov: 5, fue: 4, agi: 3, tec: 3, res: 2, men: 2 },
  skills: { correr: 3, placar: 2, evasion: 1, balon: 2, aguantar: 1, voluntad: 1 },
  featElegida: 'pase-seguro',
  god: null,
}

const CHAR: Character = {
  schemaVersion: 1,
  rulesVersion: '0.30',
  nombre: 'Grimjaw <el> "Rápido"',
  raza: 'humano',
  plan: [
    L1,
    { nivel: 2, skillSubida: 'correr', attrSubida: 'mov', god: 'sigmar' } as LevelNDelta,
    { nivel: 5, skillSubida: 'balon', featGanada: 'marcaje-firme' } as LevelNDelta,
  ],
  nivelActual: 5,
  equipo: ['guantelete-de-fuerza', 'coderas-de-hierro'],
  notas: 'Lesión antigua en la rodilla',
}

describe('buildSheetHTML', () => {
  const html = buildSheetHTML(CHAR, HUMANO)

  it('escapa el nombre y contiene identidad, raza y nivel actual', () => {
    expect(html).toContain('Grimjaw &lt;el&gt; &quot;Rápido&quot;')
    expect(html).not.toContain('<el>')
    expect(html).toContain('Humano')
    expect(html).toContain('Nv. 5')
  })

  it('contiene todas las secciones de la plantilla', () => {
    for (const section of [
      'Atributos', 'Habilidades', 'Tablas de referencia', 'Probabilidad por acción',
      'Dotes', 'Dios y favor', 'Equipo y objetos', 'Historial de partidos', 'Notas',
    ]) {
      expect(html).toContain(`<h2>${section}</h2>`)
    }
  })

  it('la tabla de probabilidades tiene las 10 acciones y las 6 dificultades', () => {
    for (const a of ACTIONS) expect(html).toContain(a.name.replace(/&/g, '&amp;'))
    for (const d of DIFFICULTY_TABLE) expect(html).toContain(d.name)
  })

  it('incluye las dotes plegadas al nivel actual (racial + libre + nivel 5)', () => {
    expect(html).toContain(FEATS.find(f => f.id === HUMANO.startingFeatId)!.name)
    expect(html).toContain('Pase Seguro')
    expect(html).toContain('Marcaje Firme')
  })

  it('refleja el dios elegido en el plan y sus datos de rezo', () => {
    expect(html).toContain('Sigmar')
    expect(html).toContain('Atributos de rezo')
  })

  it('incluye las notas del personaje', () => {
    expect(html).toContain('Lesión antigua en la rodilla')
  })

  it('lista el equipo del catálogo con su efecto', () => {
    expect(html).toContain('Guantelete de Fuerza +1')
    expect(html).toContain('Coderas de hierro')
    expect(html).toContain('+1d3 a Placar')
  })

  it('el atributo efectivo (base + objetos) aparece con su base entre paréntesis', () => {
    // Fue base 4 (nivel 5 del plan) + guantelete = 5 efectivo, con base visible
    expect(html).toMatch(/base <b class="num">4<\/b>/)
  })
})

describe('fmtPct', () => {
  it('formatea extremos y decimales', () => {
    expect(fmtPct(0)).toBe('0%')
    expect(fmtPct(1)).toBe('100%')
    expect(fmtPct(0.9999)).toBe('100%')
    expect(fmtPct(0.5)).toBe('50%')
    expect(fmtPct(0.0123)).toBe('1.2%')
    expect(fmtPct(0.0004)).toBe('0%')
  })
})

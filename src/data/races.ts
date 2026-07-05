// Documento generado el 2026-07-04-2030
import type { Attrs } from '@/rules/types'

export interface RaceData {
  id: string
  name: string
  /** Mínimos raciales (0 para humano, 2 para el resto: un mínimo 4 y un mínimo 3) */
  minima: Partial<Attrs>
  /** Máximos raciales naturales — todos suman 54 */
  maxima: Attrs
  /** ID de la dote gratuita que recibe esta raza al crear personaje */
  startingFeatId: string
  /** Rasgos distintivos (ayuda contextual en la UI) */
  desc: string
}

export const RACES: RaceData[] = [
  {
    id: 'humano',
    name: 'Humano',
    minima: {},
    maxima: { mov: 9, fue: 9, agi: 9, tec: 9, res: 9, men: 9 },
    startingFeatId: 'trabajo-en-equipo',
    desc: 'El todoterreno: sin mínimos raciales y máximos de 9 en todo. Sirve para cualquier rol y brilla jugando en equipo.',
  },
  {
    id: 'orco',
    name: 'Orco',
    minima: { fue: 4, res: 3 },
    maxima: { mov: 7, fue: 12, agi: 7, tec: 7, res: 12, men: 9 },
    startingFeatId: 'placaje-pesado',
    desc: 'Músculo puro: Fuerza y Resistencia hasta 12 para dominar el choque, a cambio de poca movilidad y manos torpes.',
  },
  {
    id: 'enano',
    name: 'Enano',
    minima: { res: 4, fue: 3 },
    maxima: { mov: 6, fue: 10, agi: 7, tec: 8, res: 12, men: 11 },
    startingFeatId: 'no-me-muevo',
    desc: 'Un ancla con barba: Resistencia 12 y Mente 11, imposible de mover de su casilla… y de que llegue rápido a ninguna parte (Mov 6).',
  },
  {
    id: 'skaven',
    name: 'Skaven',
    minima: { mov: 4, agi: 3 },
    maxima: { mov: 12, fue: 6, agi: 12, tec: 10, res: 6, men: 8 },
    startingFeatId: 'escurridizo',
    desc: 'Velocidad y sigilo: Movimiento y Agilidad hasta 12, pero frágil (Fue/Res 6). Corre, esquiva y que no te pillen.',
  },
  {
    id: 'elfo',
    name: 'Elfo',
    minima: { tec: 4, agi: 3 },
    maxima: { mov: 9, fue: 6, agi: 12, tec: 12, res: 6, men: 9 },
    startingFeatId: 'manos-finas',
    desc: 'El maestro del balón: Técnica y Agilidad hasta 12 para pases y recepciones imposibles. Endeble en el cuerpo a cuerpo.',
  },
  {
    id: 'goblin',
    name: 'Goblin',
    minima: { agi: 4, tec: 3 },
    maxima: { mov: 10, fue: 5, agi: 12, tec: 11, res: 5, men: 11 },
    startingFeatId: 'trampero',
    desc: 'Pequeño, listo y sucio: Agilidad 12, Técnica y Mente 11 para trampas y trucos. Que no te toquen (Fue/Res 5).',
  },
  {
    id: 'hombre-bestia',
    name: 'Hombre bestia',
    minima: { fue: 4, mov: 3 },
    maxima: { mov: 10, fue: 12, agi: 8, tec: 6, res: 11, men: 7 },
    startingFeatId: 'cornada',
    desc: 'Cargador nato: Fuerza 12 con Movimiento 10 para embestir a través del campo. Poca cabeza (Men 7) y peor técnica.',
  },
  {
    id: 'no-muerto',
    name: 'No muerto',
    minima: { res: 4, men: 3 },
    maxima: { mov: 6, fue: 10, agi: 6, tec: 8, res: 12, men: 12 },
    startingFeatId: 'no-siente-dolor',
    desc: 'No siente dolor ni prisa: Resistencia y Mente hasta 12, aguanta lo que le echen. Lento y rígido (Mov/Agi 6).',
  },
]

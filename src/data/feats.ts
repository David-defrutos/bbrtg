// Documento generado el 2026-07-04-2030

export type PrereqType =
  | 'attr'           // requiere AttrKey >= min
  | 'skill'          // requiere SkillKey >= min
  | 'feat'           // requiere otra dote (key = featId)
  | 'venerar_dios'   // requiere venerar cualquier dios
  | 'dios_concreto'  // requiere venerar un dios específico (key = godId)
  | 'faccion'
  | 'reputacion'
  | 'narrativo'

/** Condición individual de prerequisito */
export interface FeatPrereqCond {
  type: PrereqType
  /** AttrKey para 'attr', SkillKey para 'skill', featId para 'feat', godId para 'dios_concreto' */
  key?: string
  /** Valor mínimo para 'attr' y 'skill' */
  min?: number
}

/**
 * Un elemento del array prereqs es:
 *   FeatPrereqCond         → condición simple que DEBE cumplirse (AND con el resto)
 *   FeatPrereqCond[]       → grupo OR — basta con que se cumpla UNO
 */
export type FeatPrereq = FeatPrereqCond | FeatPrereqCond[]

export interface FeatData {
  id: string
  name: string
  chain: string       // p. ej. "Placaje pesado"
  tier: number        // posición en la cadena
  type: string        // texto descriptivo, p. ej. "General / Placaje"
  prereqs: FeatPrereq[]
  use: string         // cuándo se activa (texto que se muestra)
  effect: string      // qué hace (texto que se muestra, no ejecutable)
  cost?: string
  duration?: string
  limit?: string
}

// ---------------------------------------------------------------------------
// Catálogo de dotes — Fase 2 (v0.30)
// ---------------------------------------------------------------------------

export const FEATS: FeatData[] = [

  // ── 1. Apoyo ──────────────────────────────────────────────────────────────

  {
    id: 'trabajo-en-equipo',
    name: 'Trabajo en Equipo',
    chain: 'Apoyo', tier: 1,
    type: 'General / Apoyo',
    prereqs: [],
    use: 'Cuando das apoyo',
    effect: 'Puedes dar apoyo aunque estés marcado. Tu apoyo da +1d3.',
    limit: 'Solo cuando apoyas a otro personaje. No mejora los apoyos que tú recibes.',
  },
  {
    id: 'apoyo-coordinado',
    name: 'Apoyo Coordinado',
    chain: 'Apoyo', tier: 2,
    type: 'General / Apoyo',
    prereqs: [
      { type: 'feat', key: 'trabajo-en-equipo' },
      [{ type: 'attr', key: 'men', min: 5 }, { type: 'skill', key: 'voluntad', min: 3 }],
    ],
    use: 'Cuando das apoyo',
    effect: 'Puedes dar apoyo aunque estés marcado. Tu apoyo da +1d6.',
    limit: 'Solo cuando apoyas a otro personaje.',
  },
  {
    id: 'formacion-cerrada',
    name: 'Formación Cerrada',
    chain: 'Apoyo', tier: 3,
    type: 'General / Apoyo',
    prereqs: [
      { type: 'feat', key: 'apoyo-coordinado' },
      [{ type: 'attr', key: 'men', min: 7 }, { type: 'skill', key: 'voluntad', min: 5 }],
    ],
    use: 'Cuando das apoyo',
    effect: 'Apoyo marcado con +1d6. Puedes apoyar a un aliado a 2 casillas si hay línea clara entre ambos.',
    limit: 'La línea no atraviesa rivales ni obstáculos. Cuenta para el máximo de 2 apoyos.',
  },
  {
    id: 'capitan-de-campo',
    name: 'Capitán de Campo',
    chain: 'Apoyo', tier: 4,
    type: 'General / Apoyo',
    prereqs: [
      { type: 'feat', key: 'formacion-cerrada' },
      [{ type: 'attr', key: 'men', min: 9 }, { type: 'skill', key: 'voluntad', min: 7 }],
    ],
    use: 'Cuando das apoyo, o como reacción de juego para apoyar a distancia',
    effect: 'Apoyo marcado con +1d6, hasta 2 casillas con línea clara. Como reacción de juego, apoya a un aliado a hasta 3 casillas que pueda verte u oírte.',
    limit: 'El apoyo a distancia consume reacción de juego. Cuenta para el máximo de apoyos.',
  },

  // ── 2. Placaje pesado ─────────────────────────────────────────────────────

  {
    id: 'placaje-pesado',
    name: 'Placaje Pesado',
    chain: 'Placaje pesado', tier: 1,
    type: 'General / Placaje',
    prereqs: [{ type: 'attr', key: 'fue', min: 4 }],
    use: 'Antes de tirar un placaje',
    effect: '+1d3 a Fuerza + Placar en ese placaje.',
    cost: '3 puntos de Movimiento',
    limit: 'Se declara antes de tirar. Forma parte de la acción de placar.',
  },
  {
    id: 'placaje-demoledor',
    name: 'Placaje Demoledor',
    chain: 'Placaje pesado', tier: 2,
    type: 'General / Placaje',
    prereqs: [
      { type: 'feat', key: 'placaje-pesado' },
      { type: 'attr', key: 'fue', min: 5 },
      { type: 'skill', key: 'placar', min: 3 },
    ],
    use: 'Antes de tirar un placaje',
    effect: '+1d6 a Fuerza + Placar en ese placaje.',
    cost: '3 puntos de Movimiento',
    limit: 'Se declara antes de tirar. Forma parte de la acción de placar.',
  },
  {
    id: 'golpe-de-linea',
    name: 'Golpe de Línea',
    chain: 'Placaje pesado', tier: 3,
    type: 'General / Placaje',
    prereqs: [
      { type: 'feat', key: 'placaje-demoledor' },
      { type: 'attr', key: 'fue', min: 7 },
      { type: 'skill', key: 'placar', min: 5 },
    ],
    use: 'Antes de tirar un placaje',
    effect: '+1d6 al placaje. Si consigues Empuja o superior, eliges a qué casilla libre adyacente al defensor lo empujas.',
    cost: '3 puntos de Movimiento',
    limit: 'Se declara antes de tirar. Forma parte de la acción de placar.',
  },
  {
    id: 'rompemuros',
    name: 'Rompemuros',
    chain: 'Placaje pesado', tier: 4,
    type: 'General / Placaje',
    prereqs: [
      { type: 'feat', key: 'golpe-de-linea' },
      { type: 'attr', key: 'fue', min: 9 },
      { type: 'skill', key: 'placar', min: 7 },
    ],
    use: 'Antes de tirar un placaje',
    effect: '+1d6 al placaje, empuje dirigido. El defensor solo puede recibir 1 apoyo defensivo como máximo.',
    cost: '4 puntos de Movimiento',
    limit: 'Se declara antes de tirar. Forma parte de la acción de placar.',
  },

  // ── 3. Defensa posicional ─────────────────────────────────────────────────

  {
    id: 'no-me-muevo',
    name: 'No Me Muevo',
    chain: 'Defensa posicional', tier: 1,
    type: 'General / Defensa',
    prereqs: [{ type: 'attr', key: 'res', min: 4 }],
    use: 'Reacción de juego, cuando te empujarían',
    effect: 'Anulas tu desplazamiento, empujas al atacante 1 casilla y puedes seguirle a la casilla que ocupaba.',
    limit: 'Consume reacción de juego. Si el atacante consigue Derriba, caes en tu casilla.',
  },
  {
    id: 'anclado',
    name: 'Anclado',
    chain: 'Defensa posicional', tier: 2,
    type: 'General / Defensa',
    prereqs: [
      { type: 'feat', key: 'no-me-muevo' },
      { type: 'attr', key: 'res', min: 5 },
      { type: 'skill', key: 'aguantar', min: 3 },
    ],
    use: 'Reacción de juego, cuando te empujarían',
    effect: 'Elige: plantarte (como No Me Muevo) o contra-placaje a -3 dados. Además, no puedes ser empujado fuera del campo si existe casilla alternativa.',
    limit: 'Consume reacción de juego.',
  },
  {
    id: 'piedra-viva',
    name: 'Piedra Viva',
    chain: 'Defensa posicional', tier: 3,
    type: 'General / Defensa',
    prereqs: [
      { type: 'feat', key: 'anclado' },
      { type: 'attr', key: 'res', min: 7 },
      { type: 'skill', key: 'aguantar', min: 5 },
    ],
    use: 'Reacción de juego, cuando te empujarían',
    effect: 'Elige: plantarte o contra-placaje a -2 dados. No puedes ser empujado fuera si existe casilla alternativa.',
    limit: 'Consume reacción de juego.',
  },
  {
    id: 'bastion',
    name: 'Bastión',
    chain: 'Defensa posicional', tier: 4,
    type: 'General / Defensa',
    prereqs: [
      { type: 'feat', key: 'piedra-viva' },
      { type: 'attr', key: 'res', min: 9 },
      { type: 'skill', key: 'aguantar', min: 7 },
    ],
    use: 'Reacción de juego, cuando te empujarían',
    effect: 'Elige: plantarte o contra-placaje a -1 dado. No puedes ser empujado fuera si existe casilla alternativa. Hasta tu próxima activación, los aliados adyacentes reducen en 1 los empujones que reciban.',
    limit: 'Consume reacción de juego.',
  },

  // ── 4. Evasión ────────────────────────────────────────────────────────────

  {
    id: 'escurridizo',
    name: 'Escurridizo',
    chain: 'Evasión', tier: 1,
    type: 'General / Evasión',
    prereqs: [{ type: 'attr', key: 'agi', min: 3 }],
    use: 'Reacción de juego, antes de tirar para escapar de Retener',
    effect: '+1d3 a Agilidad + Evasión para escapar de Retener.',
    limit: 'Consume reacción de juego. Solo contra Retener.',
  },
  {
    id: 'escapista',
    name: 'Escapista',
    chain: 'Evasión', tier: 2,
    type: 'General / Evasión',
    prereqs: [
      { type: 'feat', key: 'escurridizo' },
      { type: 'attr', key: 'agi', min: 5 },
      { type: 'skill', key: 'evasion', min: 3 },
    ],
    use: 'Reacción de juego, antes de tirar para escapar de Retener',
    effect: '+1d6 a Agilidad + Evasión para escapar de Retener.',
    limit: 'Consume reacción de juego. Solo contra Retener.',
  },
  {
    id: 'sombra-rapida',
    name: 'Sombra Rápida',
    chain: 'Evasión', tier: 3,
    type: 'General / Evasión',
    prereqs: [
      { type: 'feat', key: 'escapista' },
      { type: 'attr', key: 'agi', min: 7 },
      { type: 'skill', key: 'evasion', min: 5 },
    ],
    use: 'Reacción de juego, antes de tirar para escapar de Retener',
    effect: '+1d6 a Agilidad + Evasión para escapar de Retener. Si escapas, ganas +1 Movimiento esta activación.',
    limit: 'Consume reacción de juego. Solo contra Retener.',
  },
  {
    id: 'imposible-de-sujetar',
    name: 'Imposible de Sujetar',
    chain: 'Evasión', tier: 4,
    type: 'General / Evasión',
    prereqs: [
      { type: 'feat', key: 'sombra-rapida' },
      { type: 'attr', key: 'agi', min: 9 },
      { type: 'skill', key: 'evasion', min: 7 },
    ],
    use: 'Reacción de juego, cuando un rival intenta Retenerte',
    effect: 'El intento de Retener falla automáticamente. Ganas +1 Movimiento esta activación.',
    limit: 'Consume reacción de juego. Solo afecta a un intento de Retener.',
  },

  // ── 5. Retener ────────────────────────────────────────────────────────────

  {
    id: 'marcaje-firme',
    name: 'Marcaje Firme',
    chain: 'Retener', tier: 1,
    type: 'General / Retener',
    prereqs: [{ type: 'skill', key: 'placar', min: 2 }],
    use: 'Reacción de juego, antes de tirar para Retener',
    effect: '+1d3 a Fuerza + Placar para Retener.',
    limit: 'Usa la misma reacción de juego que Retener; no consume una adicional.',
  },
  {
    id: 'marcaje-cerrado',
    name: 'Marcaje Cerrado',
    chain: 'Retener', tier: 2,
    type: 'General / Retener',
    prereqs: [
      { type: 'feat', key: 'marcaje-firme' },
      [{ type: 'attr', key: 'fue', min: 5 }, { type: 'skill', key: 'placar', min: 3 }],
    ],
    use: 'Reacción de juego, antes de tirar para Retener',
    effect: '+1d6 a Fuerza + Placar para Retener.',
    limit: 'Usa la misma reacción de juego que Retener; no consume una adicional.',
  },
  {
    id: 'defensa-pegajosa',
    name: 'Defensa Pegajosa',
    chain: 'Retener', tier: 3,
    type: 'General / Retener',
    prereqs: [
      { type: 'feat', key: 'marcaje-cerrado' },
      [{ type: 'attr', key: 'fue', min: 7 }, { type: 'skill', key: 'placar', min: 5 }],
    ],
    use: 'Reacción de juego, antes de tirar para Retener',
    effect: '+1d6 para Retener. Si retienes con éxito, el rival pierde también su acción si todavía no la había usado.',
    limit: 'Usa la misma reacción de juego que Retener; no consume una adicional.',
  },
  {
    id: 'candado-defensivo',
    name: 'Candado Defensivo',
    chain: 'Retener', tier: 4,
    type: 'General / Retener',
    prereqs: [
      { type: 'feat', key: 'defensa-pegajosa' },
      [{ type: 'attr', key: 'fue', min: 9 }, { type: 'skill', key: 'placar', min: 7 }],
    ],
    use: 'Reacción de juego, cuando un rival intenta salir de tu zona',
    effect: 'El rival queda Retenido automáticamente, pierde todo su Movimiento restante y no puede Esprintar, Robar, Recoger ni Pasar.',
    limit: 'Usa la misma reacción de juego que Retener. No causa caída ni daño.',
  },

  // ── 6. Sprint ─────────────────────────────────────────────────────────────

  {
    id: 'sprint-controlado',
    name: 'Sprint Controlado',
    chain: 'Sprint', tier: 1,
    type: 'General / Sprint',
    prereqs: [{ type: 'skill', key: 'correr', min: 2 }],
    use: 'Antes de tirar Esprintar',
    effect: 'Si fallas la tirada de Esprintar, ganas +1 Movimiento igualmente.',
    limit: 'Se declara antes de tirar. Forma parte de la acción de Esprintar.',
  },
  {
    id: 'zancada-larga',
    name: 'Zancada Larga',
    chain: 'Sprint', tier: 2,
    type: 'General / Sprint',
    prereqs: [
      { type: 'feat', key: 'sprint-controlado' },
      { type: 'attr', key: 'mov', min: 5 },
      { type: 'skill', key: 'correr', min: 3 },
    ],
    use: 'Antes de tirar Esprintar',
    effect: 'Si fallas Esprintar, ganas +2 Movimiento igualmente.',
    limit: 'Se declara antes de tirar. Forma parte de la acción de Esprintar.',
  },
  {
    id: 'carrera-explosiva',
    name: 'Carrera Explosiva',
    chain: 'Sprint', tier: 3,
    type: 'General / Sprint',
    prereqs: [
      { type: 'feat', key: 'zancada-larga' },
      { type: 'attr', key: 'mov', min: 7 },
      { type: 'skill', key: 'correr', min: 5 },
    ],
    use: 'Al Esprintar',
    effect: 'Si superas, ganas +1 Movimiento adicional. Si fallas, ganas +2 Movimiento igualmente.',
    limit: 'No permite superar el máximo de +6 Movimiento extra salvo regla especial.',
  },
  {
    id: 'relampago',
    name: 'Relámpago',
    chain: 'Sprint', tier: 4,
    type: 'General / Sprint',
    prereqs: [
      { type: 'feat', key: 'carrera-explosiva' },
      { type: 'attr', key: 'mov', min: 9 },
      { type: 'skill', key: 'correr', min: 7 },
    ],
    use: 'Al Esprintar',
    effect: 'Puedes declarar hasta +8 Movimiento al Esprintar. Si superas, los ganas. Si fallas, ganas +3 Movimiento.',
    limit: 'No evita Retener.',
  },

  // ── 7. Recibir / recoger balón ────────────────────────────────────────────

  {
    id: 'manos-finas',
    name: 'Manos Finas',
    chain: 'Recibir/recoger', tier: 1,
    type: 'General / Balón',
    prereqs: [{ type: 'attr', key: 'tec', min: 4 }],
    use: 'Reacción de balón, antes de tirar para recibir o recoger',
    effect: '+1d3 a Técnica + Juego de balón para recibir o recoger.',
    limit: 'Consume reacción de balón antes de tirar. Para recoger en activación propia, gasta acción de recoger y la reacción de balón.',
  },
  {
    id: 'manos-seguras',
    name: 'Manos Seguras',
    chain: 'Recibir/recoger', tier: 2,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'manos-finas' },
      { type: 'attr', key: 'tec', min: 5 },
      { type: 'skill', key: 'balon', min: 3 },
    ],
    use: 'Reacción de balón, antes de recibir o recoger',
    effect: '+1d6 a Técnica + Juego de balón para recibir o recoger.',
    limit: 'Consume reacción de balón antes de tirar.',
  },
  {
    id: 'control-de-balon',
    name: 'Control de Balón',
    chain: 'Recibir/recoger', tier: 3,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'manos-seguras' },
      { type: 'attr', key: 'tec', min: 7 },
      { type: 'skill', key: 'balon', min: 5 },
    ],
    use: 'Reacción de balón, al recibir o recoger',
    effect: '+1d6 para recibir o recoger. Si fallas, puedes elegir la dirección del rebote entre dos resultados de 1d8.',
    limit: 'Consume reacción de balón. El control del rebote forma parte de esa misma reacción.',
  },
  {
    id: 'iman-de-balon',
    name: 'Imán de Balón',
    chain: 'Recibir/recoger', tier: 4,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'control-de-balon' },
      { type: 'attr', key: 'tec', min: 9 },
      { type: 'skill', key: 'balon', min: 7 },
    ],
    use: 'Reacción de balón, al recibir o recoger, o cuando el balón rebota o queda suelto a 2 casillas',
    effect: '+1d6 para recibir o recoger; control del rebote entre dos 1d8. Si el balón queda suelto a 2 casillas, puedes moverte 1 hacia él e intentar recibirlo.',
    limit: 'Consume reacción de balón. No permite atravesar miniaturas ni salir del campo.',
  },

  // ── 8. Pase ───────────────────────────────────────────────────────────────

  {
    id: 'pase-seguro',
    name: 'Pase Seguro',
    chain: 'Pase', tier: 1,
    type: 'General / Balón',
    prereqs: [{ type: 'skill', key: 'balon', min: 2 }],
    use: 'Antes de tirar un pase',
    effect: '+1d3 a Técnica + Juego de balón para pasar.',
    limit: 'Forma parte de la acción de pasar.',
  },
  {
    id: 'pase-preciso',
    name: 'Pase Preciso',
    chain: 'Pase', tier: 2,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'pase-seguro' },
      { type: 'attr', key: 'tec', min: 5 },
      { type: 'skill', key: 'balon', min: 3 },
    ],
    use: 'Antes de tirar un pase',
    effect: '+1d6 a Técnica + Juego de balón para pasar.',
    limit: 'Forma parte de la acción de pasar.',
  },
  {
    id: 'pase-en-ventana',
    name: 'Pase en Ventana',
    chain: 'Pase', tier: 3,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'pase-preciso' },
      { type: 'attr', key: 'tec', min: 7 },
      { type: 'skill', key: 'balon', min: 5 },
    ],
    use: 'Antes de tirar un pase',
    effect: '+1d6 para pasar. Ignoras el primer +1 de dificultad por presión o trayectoria complicada.',
    limit: 'No reduce la dificultad base por distancia. Forma parte de la acción de pasar.',
  },
  {
    id: 'maestro-pasador',
    name: 'Maestro Pasador',
    chain: 'Pase', tier: 4,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'pase-en-ventana' },
      { type: 'attr', key: 'tec', min: 9 },
      { type: 'skill', key: 'balon', min: 7 },
    ],
    use: 'Antes de tirar un pase',
    effect: '+1d6 para pasar, ignoras +1 de dificultad por presión/trayectoria, y si fallas reduces el desvío en 1 casilla (mínimo 1).',
    limit: 'Se declara antes de tirar. Forma parte de la acción de pasar.',
  },

  // ── 9. Robar balón ────────────────────────────────────────────────────────

  {
    id: 'manos-rapidas',
    name: 'Manos Rápidas',
    chain: 'Robar balón', tier: 1,
    type: 'General / Balón',
    prereqs: [{ type: 'skill', key: 'balon', min: 2 }],
    use: 'Antes de tirar para Robar balón',
    effect: '+1d3 a Técnica + Juego de balón para Robar balón.',
    limit: 'Forma parte de la acción de Robar balón.',
  },
  {
    id: 'carterista',
    name: 'Carterista',
    chain: 'Robar balón', tier: 2,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'manos-rapidas' },
      { type: 'attr', key: 'tec', min: 5 },
      { type: 'skill', key: 'balon', min: 3 },
    ],
    use: 'Antes de tirar para Robar balón',
    effect: '+1d6 a Técnica + Juego de balón para Robar balón.',
    limit: 'Forma parte de la acción de Robar balón.',
  },
  {
    id: 'robo-limpio',
    name: 'Robo Limpio',
    chain: 'Robar balón', tier: 3,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'carterista' },
      { type: 'attr', key: 'tec', min: 7 },
      { type: 'skill', key: 'balon', min: 5 },
    ],
    use: 'Antes de tirar para Robar balón',
    effect: '+1d6 para robar. Si el resultado es balón suelto, puedes elegir la dirección del rebote (1 casilla, dirección a tu elección).',
    limit: 'El control del rebote solo aplica si el resultado fue balón suelto, no robo directo.',
  },
  {
    id: 'maestro-ladron',
    name: 'Maestro Ladrón',
    chain: 'Robar balón', tier: 4,
    type: 'General / Balón',
    prereqs: [
      { type: 'feat', key: 'robo-limpio' },
      { type: 'attr', key: 'tec', min: 9 },
      { type: 'skill', key: 'balon', min: 7 },
    ],
    use: 'Antes de tirar para Robar balón',
    effect: '+1d6 para robar. Si el resultado es balón suelto, elige la dirección o convierte el resultado en robo directo.',
    limit: 'No concede movimiento gratis por resultado +3.',
  },

  // ── 10. Trampas ───────────────────────────────────────────────────────────

  {
    id: 'trampero',
    name: 'Trampero',
    chain: 'Trampas', tier: 1,
    type: 'General / Trampas',
    prereqs: [{ type: 'attr', key: 'tec', min: 3 }],
    use: 'Fase previa, al colocar trampas',
    effect: '+1d3 en la tirada para colocar trampas.',
    limit: 'Se declara antes de tirar.',
  },
  {
    id: 'trampero-experto',
    name: 'Trampero Experto',
    chain: 'Trampas', tier: 2,
    type: 'General / Trampas',
    prereqs: [
      { type: 'feat', key: 'trampero' },
      { type: 'attr', key: 'tec', min: 5 },
      { type: 'skill', key: 'voluntad', min: 3 },
    ],
    use: 'Fase previa, al colocar trampas',
    effect: '+1d6 en la tirada para colocar trampas.',
    limit: 'Se declara antes de tirar.',
  },
  {
    id: 'trampa-paciente',
    name: 'Trampa Paciente',
    chain: 'Trampas', tier: 3,
    type: 'General / Trampas',
    prereqs: [
      { type: 'feat', key: 'trampero-experto' },
      { type: 'attr', key: 'tec', min: 7 },
      { type: 'skill', key: 'voluntad', min: 5 },
    ],
    use: 'Fase previa al colocar trampas; y durante el partido con tus trampas',
    effect: '+1d6 para colocar trampas. Puedes activar tus trampas también cuando una miniatura sale de su casilla, no solo cuando entra.',
    limit: 'Cada trampa se consume al activarse. Una misma miniatura solo puede verse afectada una vez por la misma trampa.',
  },
  {
    id: 'maestro-trampero',
    name: 'Maestro Trampero',
    chain: 'Trampas', tier: 4,
    type: 'General / Trampas',
    prereqs: [
      { type: 'feat', key: 'trampa-paciente' },
      { type: 'attr', key: 'tec', min: 9 },
      { type: 'skill', key: 'voluntad', min: 7 },
    ],
    use: 'Fase previa al colocar trampas; y durante el partido con tus trampas',
    effect: '+1d6 para colocar trampas, activación en salida. Al activar una trampa propia, queda desarmada en lugar de consumirse; puedes rearmarla como acción adyacente.',
    limit: 'El rearmado no funciona con trampas de intercambio ni de balón especial salvo permiso del máster.',
  },

  // ── 11. Carga ─────────────────────────────────────────────────────────────

  {
    id: 'cornada',
    name: 'Cornada',
    chain: 'Carga', tier: 1,
    type: 'General / Carga',
    prereqs: [{ type: 'attr', key: 'fue', min: 4 }],
    use: 'Al placar tras moverte al menos 3 casillas hacia el objetivo',
    effect: '+1d3 al placaje.',
    limit: 'Se declara antes de tirar.',
  },
  {
    id: 'carga-salvaje',
    name: 'Carga Salvaje',
    chain: 'Carga', tier: 2,
    type: 'General / Carga',
    prereqs: [
      { type: 'feat', key: 'cornada' },
      { type: 'attr', key: 'fue', min: 5 },
      { type: 'attr', key: 'mov', min: 5 },
    ],
    use: 'Al placar tras moverte al menos 3 casillas hacia el objetivo',
    effect: '+1d6 al placaje de carga.',
    limit: 'Se declara antes de tirar.',
  },
  {
    id: 'embestida',
    name: 'Embestida',
    chain: 'Carga', tier: 3,
    type: 'General / Carga',
    prereqs: [
      { type: 'feat', key: 'carga-salvaje' },
      { type: 'attr', key: 'fue', min: 7 },
      { type: 'attr', key: 'mov', min: 7 },
    ],
    use: 'Al placar tras moverte al menos 3 casillas hacia el objetivo',
    effect: '+1d6 al placaje de carga. Si consigues Empuja o superior, eliges a qué casilla libre adyacente empujas al defensor.',
    limit: 'Se declara antes de tirar.',
  },
  {
    id: 'carga-imparable',
    name: 'Carga Imparable',
    chain: 'Carga', tier: 4,
    type: 'General / Carga',
    prereqs: [
      { type: 'feat', key: 'embestida' },
      { type: 'attr', key: 'fue', min: 9 },
      { type: 'attr', key: 'mov', min: 9 },
    ],
    use: 'Al placar tras moverte al menos 4 casillas hacia el objetivo',
    effect: '+1d6 al placaje, empuje dirigido. Si consigues Derriba, puedes moverte 1 casilla después del placaje.',
    limit: 'Se declara antes de tirar. El movimiento posterior no permite placar otra vez salvo regla especial.',
  },

  // ── 12. Resistencia ───────────────────────────────────────────────────────

  {
    id: 'no-siente-dolor',
    name: 'No Siente Dolor',
    chain: 'Resistencia', tier: 1,
    type: 'General / Resistencia',
    prereqs: [{ type: 'attr', key: 'res', min: 4 }],
    use: 'Reacción de juego, cuando fueras a quedar Aturdido o KO',
    effect: 'Si fueras a quedar Aturdido, quedas Caído. Si fueras a quedar KO, quedas Aturdido.',
    limit: 'Consume reacción de juego.',
  },
  {
    id: 'aguante-antinatural',
    name: 'Aguante Antinatural',
    chain: 'Resistencia', tier: 2,
    type: 'General / Resistencia',
    prereqs: [
      { type: 'feat', key: 'no-siente-dolor' },
      { type: 'attr', key: 'res', min: 5 },
      { type: 'skill', key: 'aguantar', min: 3 },
    ],
    use: 'Reacción de juego, cuando fueras a quedar Aturdido, KO o Lesionado',
    effect: 'Aturdido→Caído, KO→Aturdido, Lesionado→KO.',
    limit: 'Consume reacción de juego.',
  },
  {
    id: 'cuerpo-inquebrantable',
    name: 'Cuerpo Inquebrantable',
    chain: 'Resistencia', tier: 3,
    type: 'General / Resistencia',
    prereqs: [
      { type: 'feat', key: 'aguante-antinatural' },
      { type: 'attr', key: 'res', min: 7 },
      { type: 'skill', key: 'aguantar', min: 5 },
    ],
    use: 'Reacción de juego, cuando fueras a sufrir un estado por daño',
    effect: 'Reduces el estado recibido en 1 grado: Golpeado→ninguno, Aturdido→Caído, KO→Aturdido, Lesionado→KO, Herida grave→Lesionado.',
    limit: 'Consume reacción de juego. No puede reducir Herida grave por debajo de Lesionado.',
  },
  {
    id: 'no-puede-morir',
    name: 'No Puede Morir',
    chain: 'Resistencia', tier: 4,
    type: 'General / Resistencia',
    prereqs: [
      { type: 'feat', key: 'cuerpo-inquebrantable' },
      { type: 'attr', key: 'res', min: 9 },
      { type: 'skill', key: 'aguantar', min: 7 },
    ],
    use: 'Reacción de juego, cuando fueras a sufrir un estado por daño',
    effect: 'Reduces el estado en 1 grado y, además, si fueras a sufrir Herida grave la conviertes en KO.',
    limit: 'Consume reacción de juego. Tras convertir una Herida grave, quedas Golpeado hasta el final de tu próxima activación aunque el KO se recupere.',
  },

  // ── 13. Iniciativa ────────────────────────────────────────────────────────

  {
    id: 'esperar-el-momento',
    name: 'Esperar el Momento',
    chain: 'Iniciativa', tier: 1,
    type: 'General / Iniciativa',
    prereqs: [
      [{ type: 'attr', key: 'men', min: 3 }, { type: 'skill', key: 'voluntad', min: 2 }],
    ],
    use: 'Reacción de juego, cuando vaya a empezar tu activación',
    effect: 'Reduce tu iniciativa actual en cualquier cantidad (mínimo 1). No actúas ahora; actuarás cuando llegue tu nueva iniciativa.',
    duration: 'La iniciativa reducida se mantiene hasta que se vuelva a tirar iniciativa.',
    limit: 'Consume reacción de juego. Solo una vez por cada tirada de iniciativa. No permite actuar dos veces en el mismo turno.',
  },

  // ── 14. Soporte ───────────────────────────────────────────────────────────

  {
    id: 'protector',
    name: 'Protector',
    chain: 'Soporte', tier: 1,
    type: 'General / Soporte',
    prereqs: [{ type: 'skill', key: 'aguantar', min: 2 }],
    use: 'Reacción de juego, cuando un aliado adyacente fuera a recibir daño',
    effect: 'Recibes tú el daño en su lugar, con el mismo nivel que iba a recibir el aliado.',
    limit: 'Consume reacción de juego. Debes estar en pie y adyacente. No puedes usarla si tú también eras objetivo del mismo efecto.',
  },
  {
    id: 'medico-de-campo',
    name: 'Médico de Campo',
    chain: 'Soporte', tier: 1,
    type: 'General / Soporte',
    prereqs: [
      [{ type: 'skill', key: 'voluntad', min: 2 }, { type: 'skill', key: 'aguantar', min: 2 }],
    ],
    use: 'Acción, estando adyacente a una miniatura Aturdida o KO',
    effect: 'Si la miniatura está Aturdida, pasa a Caído automáticamente. Si está KO, tira Mente+Voluntad dificultad 2; si superas, pasa a Aturdida.',
    limit: 'No funciona sobre Lesionado ni Herida grave.',
  },
  {
    id: 'chapuza-duradera',
    name: 'Chapuza Duradera',
    chain: 'Soporte', tier: 2,
    type: 'General / Trampas / Soporte',
    prereqs: [{ type: 'feat', key: 'trampero' }],
    use: 'Al descanso (entre partes)',
    effect: 'Tus trampas no activadas se conservan automáticamente para la segunda parte.',
    limit: 'Solo afecta a trampas que colocaste tú. No recupera trampas ya activadas o destruidas.',
  },

  // ── 15. Tramposo ──────────────────────────────────────────────────────────

  {
    id: 'tramposo',
    name: 'Tramposo',
    chain: 'Tramposo', tier: 1,
    type: 'General / Juego sucio',
    prereqs: [
      [{ type: 'attr', key: 'tec', min: 3 }, { type: 'skill', key: 'voluntad', min: 2 }],
    ],
    use: 'Cuando el árbitro te expulsa',
    effect: 'Anulas esa expulsión y sigues en el campo. Sin tirada.',
    limit: '1 expulsión anulada por partido.',
  },
  {
    id: 'cara-dura',
    name: 'Cara Dura',
    chain: 'Tramposo', tier: 2,
    type: 'General / Juego sucio',
    prereqs: [
      { type: 'feat', key: 'tramposo' },
      [{ type: 'attr', key: 'tec', min: 5 }, { type: 'skill', key: 'voluntad', min: 3 }],
    ],
    use: 'Cuando el árbitro te expulsa',
    effect: 'Anulas esa expulsión y sigues en el campo. Sin tirada.',
    limit: 'Hasta 2 expulsiones anuladas por partido.',
  },
  {
    id: 'amigo-del-arbitro',
    name: 'Amigo del Árbitro',
    chain: 'Tramposo', tier: 3,
    type: 'General / Juego sucio',
    prereqs: [
      { type: 'feat', key: 'cara-dura' },
      [{ type: 'attr', key: 'tec', min: 7 }, { type: 'skill', key: 'voluntad', min: 5 }],
    ],
    use: 'Cuando el árbitro te expulsa',
    effect: 'Anulas esa expulsión y sigues en el campo. Sin tirada.',
    limit: 'Hasta 3 expulsiones anuladas por partido.',
  },
  {
    id: 'intocable',
    name: 'Intocable',
    chain: 'Tramposo', tier: 4,
    type: 'General / Juego sucio',
    prereqs: [
      { type: 'feat', key: 'amigo-del-arbitro' },
      [{ type: 'attr', key: 'tec', min: 9 }, { type: 'skill', key: 'voluntad', min: 7 }],
    ],
    use: 'Cuando el árbitro te expulsa',
    effect: 'Anulas esa expulsión y sigues en el campo. Sin tirada.',
    limit: 'Hasta 4 expulsiones anuladas por partido.',
  },

  // ── 16. Devoción (divinas) ────────────────────────────────────────────────

  {
    id: 'devoto',
    name: 'Devoto',
    chain: 'Devoción', tier: 1,
    type: 'Divina / Devoción',
    prereqs: [{ type: 'venerar_dios' }],
    use: 'Fase previa, al rezar',
    effect: '+1d3 a la tirada de rezar.',
    limit: 'Se declara antes de tirar.',
  },
  {
    id: 'devoto-consagrado',
    name: 'Devoto Consagrado',
    chain: 'Devoción', tier: 2,
    type: 'Divina / Devoción',
    prereqs: [
      { type: 'feat', key: 'devoto' },
      { type: 'skill', key: 'voluntad', min: 3 },
    ],
    use: 'Fase previa, al rezar',
    effect: '+1d6 a la tirada de rezar.',
    limit: 'Se declara antes de tirar.',
  },
  {
    id: 'elegido-menor',
    name: 'Elegido Menor',
    chain: 'Devoción', tier: 3,
    type: 'Divina / Devoción',
    prereqs: [
      { type: 'feat', key: 'devoto-consagrado' },
      { type: 'skill', key: 'voluntad', min: 5 },
    ],
    use: 'Al inicio del partido',
    effect: 'Ganas 1 punto de favor divino adicional de tu dios.',
    limit: 'Solo si has rezado durante la fase previa.',
  },
  {
    id: 'campeon-divino',
    name: 'Campeón Divino',
    chain: 'Devoción', tier: 4,
    type: 'Divina / Devoción',
    prereqs: [
      { type: 'feat', key: 'elegido-menor' },
      { type: 'skill', key: 'voluntad', min: 7 },
    ],
    use: 'Al inicio del partido',
    effect: 'Ganas 2 puntos de favor divino adicional de tu dios.',
    limit: 'Solo si has rezado. El favor de esta dote no se acumula con el de Elegido Menor.',
  },
  {
    id: 'favor-guardado',
    name: 'Favor Guardado',
    chain: 'Devoción', tier: 2,
    type: 'Divina / Favor',
    prereqs: [
      { type: 'feat', key: 'devoto' },
      { type: 'skill', key: 'voluntad', min: 2 },
    ],
    use: 'Postpartido',
    effect: 'Puedes conservar hasta 1 punto de favor divino no usado para el siguiente partido.',
    limit: 'Solo puedes conservar favor del dios o panteón que veneras. Se pierde si cambias de dios. No permite conservar más de 1 salvo regla especial.',
  },

  // ── 17. Politeísmo (divinas) ──────────────────────────────────────────────

  {
    id: 'politeista',
    name: 'Politeísta',
    chain: 'Politeísmo', tier: 1,
    type: 'Divina avanzada / Politeísmo',
    prereqs: [
      { type: 'feat', key: 'devoto' },
      [{ type: 'attr', key: 'men', min: 5 }, { type: 'skill', key: 'voluntad', min: 3 }],
    ],
    use: 'Al elegir esta dote',
    effect: 'Puedes venerar a 2 dioses. El favor divino es común para ambos; puedes gastar favor en dones de cualquiera de los dos.',
    limit: 'No puedes usar dones de los dos dioses en la misma activación. No conserva favor al final del partido.',
  },
  {
    id: 'sincretista',
    name: 'Sincretista',
    chain: 'Politeísmo', tier: 2,
    type: 'Divina avanzada / Politeísmo',
    prereqs: [
      { type: 'feat', key: 'politeista' },
      [{ type: 'attr', key: 'men', min: 7 }, { type: 'skill', key: 'voluntad', min: 5 }],
    ],
    use: 'Fase previa, al rezar',
    effect: 'Al rezar, puedes usar la tirada de rezar de cualquiera de tus dos dioses y generar favor común.',
    limit: 'Debes elegir qué tirada usas antes de tirar. No sumas ambas tiradas. Solo una tirada de rezar.',
  },
  {
    id: 'panteon-personal',
    name: 'Panteón Personal',
    chain: 'Politeísmo', tier: 3,
    type: 'Divina avanzada / Politeísmo',
    prereqs: [
      { type: 'feat', key: 'sincretista' },
      [{ type: 'attr', key: 'men', min: 9 }, { type: 'skill', key: 'voluntad', min: 7 }],
    ],
    use: 'Al elegir esta dote',
    effect: 'Puedes venerar a 3 dioses. El favor sigue siendo común; puedes usar dones de cualquiera de los tres.',
    limit: 'No puedes usar dones de más de un dios en la misma activación. El tercer dios debe justificarse narrativamente. No conserva favor.',
  },
]

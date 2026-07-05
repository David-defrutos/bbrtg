// Documento generado el 2026-07-05-1040
import type { Attrs } from '@/rules/types'

/**
 * Catálogo de equipo, recursos y objetos (manual v0.30 §18.7–18.12).
 *
 * Frontera honesta: el efecto en tirada es TEXTO que se muestra; el único
 * dato ejecutable es `attrBonus` (objetos que suben atributo EFECTIVO, §4.3 y
 * §25.25: pueden superar máximos raciales y por nivel hasta el absoluto 20).
 */

export type EquipmentType =
  | 'consumible-menor'  // §18.7 — se gasta al usarlo
  | 'consumible-util'   // §18.8
  | 'consumible-fuerte' // §18.9
  | 'equipo-comun'      // §18.10 — 1 uso por partido, no se gasta
  | 'equipo-bueno'      // §18.11
  | 'raro'              // §18.12 — objetos raros y mágicos (ejemplos abiertos)

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  'consumible-menor':  'Consumible menor',
  'consumible-util':   'Consumible útil',
  'consumible-fuerte': 'Consumible fuerte',
  'equipo-comun':      'Equipo común',
  'equipo-bueno':      'Equipo bueno',
  'raro':              'Raro / mágico',
}

export interface EquipmentData {
  id: string
  name: string
  type: EquipmentType
  /** Coste orientativo en monedas (§18.6); los raros son "7+ o recompensa" */
  cost: number | null
  /** Cuándo se usa (texto que se muestra) */
  use: string
  /** Qué hace (texto que se muestra, no ejecutable) */
  effect: string
  /** Bonus a atributo EFECTIVO — único efecto mecánico que aplica el motor */
  attrBonus?: Partial<Attrs>
}

export const EQUIPMENT: EquipmentData[] = [

  // ── Recursos menores (§18.7) ────────────────────────────────────────────
  { id: 'pocion-menor', name: 'Poción menor', type: 'consumible-menor', cost: 1,
    use: 'Acción', effect: 'Aturdido → Caído' },
  { id: 'unguento-rapido', name: 'Ungüento rápido', type: 'consumible-menor', cost: 1,
    use: 'Acción', effect: 'Elimina Golpeado' },
  { id: 'bebida-energetica', name: 'Bebida energética', type: 'consumible-menor', cost: 1,
    use: 'Acción', effect: '+2 Movimiento esta activación' },
  { id: 'polvos-pegajosos', name: 'Polvos pegajosos', type: 'consumible-menor', cost: 1,
    use: 'Reacción de balón', effect: '+1d3 a recibir o recoger' },
  { id: 'tonico-de-valor', name: 'Tónico de valor', type: 'consumible-menor', cost: 1,
    use: 'Reacción de juego', effect: '+1d3 a Voluntad' },
  { id: 'piedra-suerte-falsa', name: 'Piedra de la suerte falsa', type: 'consumible-menor', cost: 1,
    use: 'Reacción', effect: 'Repite 1 dado fallido; si vuelve a fallar quedas Golpeado' },
  { id: 'clavos-de-bota', name: 'Clavos de bota', type: 'consumible-menor', cost: 1,
    use: 'Antes de Esprintar', effect: '+1d3 a Correr' },
  { id: 'venda-gruesa', name: 'Venda gruesa', type: 'consumible-menor', cost: 1,
    use: 'Reacción de juego', effect: 'Si fueras a quedar Golpeado, ignoras Golpeado' },

  // ── Recursos útiles (§18.8) ─────────────────────────────────────────────
  { id: 'pocion-reanimacion', name: 'Poción de reanimación', type: 'consumible-util', cost: 2,
    use: 'Acción', effect: 'KO → Aturdido' },
  { id: 'aceite-deslizante', name: 'Aceite deslizante', type: 'consumible-util', cost: 2,
    use: 'Reacción de juego', effect: '+1d3 a escapar de Retener' },
  { id: 'guantes-resinados', name: 'Guantes resinados', type: 'consumible-util', cost: 2,
    use: 'Reacción de balón', effect: '+1d4 a recibir o recoger' },
  { id: 'talisman-menor', name: 'Talismán menor', type: 'consumible-util', cost: 2,
    use: 'Reacción', effect: '+1d3 a una tirada cualquiera' },
  { id: 'sales-de-guerra', name: 'Sales de guerra', type: 'consumible-util', cost: 2,
    use: 'Acción', effect: 'Elimina Golpeado y +1d3 al próximo Placar' },
  { id: 'cuerda-oculta', name: 'Cuerda oculta', type: 'consumible-util', cost: 2,
    use: 'Reacción de juego', effect: '+1d3 a Retener' },
  { id: 'placa-de-refuerzo', name: 'Placa de refuerzo', type: 'consumible-util', cost: 2,
    use: 'Reacción de juego', effect: 'Reduce un empujón en 1' },
  { id: 'silbato-distraccion', name: 'Silbato de distracción', type: 'consumible-util', cost: 2,
    use: 'Reacción de balón', effect: 'Un rival adyacente pierde 1 dado al recibir' },

  // ── Recursos fuertes (§18.9) ────────────────────────────────────────────
  { id: 'pocion-fuerte', name: 'Poción fuerte', type: 'consumible-fuerte', cost: 3,
    use: 'Acción', effect: 'Lesionado → KO' },
  { id: 'elixir-de-carrera', name: 'Elixir de carrera', type: 'consumible-fuerte', cost: 3,
    use: 'Acción', effect: '+3 Movimiento esta activación' },
  { id: 'amuleto-de-aguante', name: 'Amuleto de aguante', type: 'consumible-fuerte', cost: 3,
    use: 'Reacción de juego', effect: 'Aturdido → Caído' },
  { id: 'bomba-de-humo', name: 'Bomba de humo', type: 'consumible-fuerte', cost: 3,
    use: 'Acción', effect: 'Hasta tu próxima activación no pueden Retenerte salvo adyacentes al inicio' },
  { id: 'iman-de-balon-menor', name: 'Imán de balón menor', type: 'consumible-fuerte', cost: 3,
    use: 'Reacción de balón', effect: 'Si el balón rebota a 2 casillas, puedes moverlo 1 casilla hacia ti' },
  { id: 'brebaje-de-furia', name: 'Brebaje de furia', type: 'consumible-fuerte', cost: 3,
    use: 'Antes de placar', effect: '+1d4 a Placar; después quedas Golpeado' },
  { id: 'llave-de-trampero', name: 'Llave de trampero', type: 'consumible-fuerte', cost: 3,
    use: 'Al activar trampa', effect: 'Aumenta en +1 el nivel efectivo de una trampa' },
  { id: 'sello-divino-menor', name: 'Sello divino menor', type: 'consumible-fuerte', cost: 3,
    use: 'Fase previa', effect: '+1 favor divino si rezaste con al menos 1 éxito' },

  // ── Equipo común (§18.10) — 1 uso por partido ───────────────────────────
  { id: 'botas-reforzadas', name: 'Botas reforzadas', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: '+1d3 a Correr para Esprintar' },
  { id: 'guantes-de-agarre', name: 'Guantes de agarre', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: '+1d3 a recibir o recoger' },
  { id: 'hombreras-pesadas', name: 'Hombreras pesadas', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: '+1d3 a Aguantar contra placaje' },
  { id: 'coderas-de-hierro', name: 'Coderas de hierro', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: '+1d3 a Placar' },
  { id: 'rodilleras-flexibles', name: 'Rodilleras flexibles', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: '+1d3 a Evasión' },
  { id: 'amuleto-barato', name: 'Amuleto barato', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: '+1d3 a Voluntad' },
  { id: 'protector-de-balon', name: 'Protector de balón', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: '+1d3 a Aguantar para no soltar balón' },
  { id: 'vendas-de-campo', name: 'Vendas de campo', type: 'equipo-comun', cost: 2,
    use: '1 vez por partido', effect: 'Pasas de Golpeado a normal al inicio de tu activación' },

  // ── Equipo bueno (§18.11) — 1 uso por partido ───────────────────────────
  { id: 'botas-de-carrera', name: 'Botas de carrera', type: 'equipo-bueno', cost: 4,
    use: '1 vez por partido', effect: '+1d4 a Correr' },
  { id: 'guantes-de-receptor', name: 'Guantes de receptor', type: 'equipo-bueno', cost: 4,
    use: '1 vez por partido', effect: '+1d4 a recibir o recoger' },
  { id: 'coraza-reforzada', name: 'Coraza reforzada', type: 'equipo-bueno', cost: 4,
    use: '1 vez por partido', effect: '+1d4 a Aguantar contra placaje' },
  { id: 'brazal-de-golpeo', name: 'Brazal de golpeo', type: 'equipo-bueno', cost: 4,
    use: '1 vez por partido', effect: '+1d4 a Placar' },
  { id: 'capa-ligera', name: 'Capa ligera', type: 'equipo-bueno', cost: 4,
    use: '1 vez por partido', effect: '+1d4 a Evasión' },
  { id: 'medallon-bendecido', name: 'Medallón bendecido', type: 'equipo-bueno', cost: 4,
    use: '1 vez por partido', effect: '+1d4 a Voluntad' },
  { id: 'cinturon-de-equilibrio', name: 'Cinturón de equilibrio', type: 'equipo-bueno', cost: 4,
    use: 'Al caer por terreno difícil', effect: 'Puedes repetir la tirada' },
  { id: 'bolsa-de-resina', name: 'Bolsa de resina', type: 'equipo-bueno', cost: 4,
    use: 'Al fallar recibir o recoger', effect: 'El balón no rebota y queda en tu casilla' },

  // ── Objetos raros y mágicos (§18.12) — ejemplos abiertos ────────────────
  { id: 'guantelete-de-fuerza', name: 'Guantelete de Fuerza +1', type: 'raro', cost: null,
    use: 'Pasivo', effect: '+1 Fuerza efectiva', attrBonus: { fue: 1 } },
  { id: 'botas-de-viento', name: 'Botas de Viento +1', type: 'raro', cost: null,
    use: 'Pasivo', effect: '+1 Movimiento efectivo', attrBonus: { mov: 1 } },
  { id: 'mascara-de-terror', name: 'Máscara de Terror', type: 'raro', cost: null,
    use: 'En tirada', effect: '+1d3 a Retener o Voluntad intimidante' },
  { id: 'capa-de-sombra', name: 'Capa de Sombra', type: 'raro', cost: null,
    use: 'En tirada', effect: '+1d3 a escapar de Retener' },
  { id: 'guantes-imantados', name: 'Guantes Imantados', type: 'raro', cost: null,
    use: 'En tirada / 1 vez por partido', effect: '+1d3 a recoger balón; 1 vez/partido atrae balón 1 casilla' },
  { id: 'amuleto-de-ranald', name: 'Amuleto de Ranald', type: 'raro', cost: null,
    use: '1 vez por partido', effect: 'Modifica un rebote en 1 dirección' },
  { id: 'collar-de-nurgle', name: 'Collar de Nurgle', type: 'raro', cost: null,
    use: '1 vez por partido', effect: 'No Siente Dolor aunque no tengas la dote' },
  { id: 'martillo-de-entrenamiento', name: 'Martillo de Entrenamiento', type: 'raro', cost: null,
    use: 'En tirada', effect: '+1d3 a Placaje Pesado o Cornada' },
]

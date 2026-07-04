<!-- Documento generado el 2026-07-04-2016 -->

# CLAUDE.md — Generador de personajes "Blood Bowl: Rise to Glory"

Instrucciones permanentes del proyecto. Léelas al empezar cada sesión.

## Qué es esto

Un **generador de fichas de personaje** para un juego de rol propio, **Blood Bowl: Rise to Glory**, en playtest activo. El juego cambia con frecuencia entre versiones. Es una herramienta para uso personal en mesa: sin backend, desplegable en GitHub Pages.

Esta carpeta nació como clon de otro proyecto (un generador de D&D). Ese dominio ya se ha eliminado; queda solo la fontanería (stack, CI, deploy, configs). **No reintroduzcas conceptos de D&D** (clases, subclases, conjuros, multiclase): no existen en este juego.

## Fuente de verdad

El **manual de reglas manda** sobre cualquier otra cosa. Está en `docs/`. Léelo antes de decidir nada que dependa de las reglas. Cuando el manual cambie de versión, lo único que debería cambiar en el proyecto son los ficheros de datos, nunca la lógica. Ante cualquier ambigüedad del manual, **pregunta antes de decidir por tu cuenta**.

## Alcance

**Dentro:** crear un PJ de nivel 1 y planificar su crecimiento hasta nivel 30; ver la ficha a cualquier nivel del plan; validar la construcción; export/import JSON; ficha imprimible.

**Fuera (no lo construyas):** estado de partido (touchdowns, favor divino en juego, usos por partido, iniciativa, activaciones); gestión de equipo de varios PJ (el nivel es **individual**, no del equipo — esto diverge del manual v0.30, es decisión consciente); cambiar de dios tras elegirlo; cascadas de invalidación de dotes divinas; secundarios (PNJ ligeros).

## Principio rector: nada hardcodeado

Toda regla o valor de juego vive en **datos declarativos** (`src/data/`), no en código. Un rebalanceo de playtest debe tocar solo datos. Esto incluye lo profundo, no solo los catálogos:

- La lista de atributos y habilidades y su emparejamiento 1:1.
- Los arrays iniciales de creación.
- El calendario de recompensas por nivel (qué ganas en cada nivel).
- Las bandas de máximos por nivel.
- Las tablas de conversión (atributo→dados; nivel de habilidad→umbral/repetición/dado auxiliar).
- Los catálogos: razas, dotes, dioses, equipo.

El motor **no debe "saber"** que un nivel par da atributo ni que las dotes llegan en múltiplos de 5. Lee esa configuración de los datos y la aplica. Si en la próxima versión añado un atributo o cambio el calendario, no debe tocarse una línea de lógica.

**Frontera honesta:** el *efecto mecánico* de una dote (qué hace en una tirada real) es **texto que se muestra**, no dato ejecutable — esto es una ficha, no un motor de partido. Los **prerequisitos** de la dote sí son dato que el motor valida. Prereqs = datos comprobables; efectos = datos que solo se muestran.

## Arquitectura: 3 capas separadas

1. **`src/data/`** — datos declarativos: catálogos y tablas. La capa que cambia cada playtest.
2. **`src/rules/`** — motor: funciones **puras**, sin estado, que leen los datos y calculan derivados y validaciones. Testeable en aislamiento.
3. **`src/components/` + `src/stores/`** — UI y estado. La UI solo presenta y recoge decisiones; no sabe cuánto vale nada.

Regla de diseño: si cambiar "la dote X pide Fuerza 5 en vez de 4" obliga a tocar un componente Vue o el motor, la arquitectura ha fallado.

## Modelo de la ficha (1 PJ)

```
Personaje
  schemaVersion, rulesVersion   // detectar personajes obsoletos al cambiar de version
  nombre, raza
  plan[]                        // ruta de crecimiento (ver progresion)
  nivelActual                   // cursor: nivel al que se juega de verdad
  notas
```

- La **dote de raza es fija por raza** y derivable: no se guarda en la ficha.
- El **atributo efectivo** (base + objetos) es **derivado**, nunca campo. Los objetos pueden superar máximos raciales y por nivel hasta el absoluto (20); los valores base no.

## Modelo de progresión

El plan **no es un historial, es una ruta trazada por adelantado** (el jugador planifica hasta 30, ve cómo queda, y juega desde 1 por esa ruta).

- **`plan[]`**: decisiones nivel a nivel, 1..30. Cada entrada de nivel > 1 guarda solo el **delta** de ese nivel.
- **`nivelActual`**: cursor. La **ficha de mesa** = plegar hasta `nivelActual`; la **vista de planificación** = plegar hasta 30.
- **`fold(plan, N)`**: pliega 1..N y devuelve el estado completo a nivel N. Operación central.
- **`replanDesde(N)`**: descarta entradas de nivel ≥ N para replanear. Rehacer entero = `replanDesde(1)`.

Todo es **monótono creciente**: atributos y habilidades solo suben; el dios se elige una vez y no cambia. Por eso los prerequisitos se validan contra el **estado actual**, sin rastreo temporal. El dios es un delta que aparece una sola vez en cualquier nivel; al elegirlo se abren sus dotes divinas como opción, sujetas a sus prereqs.

## Validación (invariantes, léelos del manual)

- Reparto inicial exacto de atributos y habilidades.
- Mínimos raciales cumplidos.
- Cada atributo base ≤ mín(máximo racial natural, máximo por nivel). Solo objetos/dones lo superan, hasta 20.
- Cada habilidad ≤ máximo de habilidad por nivel (sin tope racial).
- Nº de dotes correcto según el calendario (raza + inicial libre + múltiplos de 5 alcanzados).
- Prerequisitos de cada dote cumplidos con el estado actual.

**Regla de oro del replay: validar y señalar, nunca clampar en silencio.** Si un plan viejo deja de ser legal contra reglas nuevas, marca el primer paso que se rompe y di por qué. No recortes valores calladamente. Es una herramienta de playtest: quiero ver qué se rompió.

## Ficha imprimible

**HTML + print CSS**, no PDF. El layout va a cambiar durante el playtest; con print CSS es inmediato.

## Tests

Testea **invariantes del motor, no valores concretos de reglas** (esos cambian cada semana y volverían los tests una fricción). Ejemplos válidos: "ningún atributo base supera su máximo aplicable", "el nº de dotes cuadra con el calendario", "export→import produce el mismo personaje", "`fold` es determinista", "un prereq incumplido se marca". Round-trip export/import desde el principio.

## Convenciones de proyecto

- **TypeScript strict.** El build de verdad es `npm run build` (= `vue-tsc -b && vite build`); el modo `-b` pilla locales sin usar y problemas de project references que `--noEmit` se salta.
- **Nunca escribas ni modifiques código sin un "adelante" explícito.** "continuar" / "sigue" valen para reanudar una tarea ya autorizada. Diagnóstico y preguntas no necesitan autorización.
- **`changelog.txt`** en la raíz: una entrada por cambio resuelto. Formato: línea separadora, `AAAA-MM-DD HH:MM · #N — Título`, y cuerpo con causa, arreglo, ficheros tocados y nº de tests.
- Tras un build correcto, **recomienda mensaje de commit**: una sola línea imperativa < 72 car., prefijo `fix:`/`feat:`/`refactor:`/`test:`/`chore:`, nº de ticket al final `(#N)` si aplica, seguido de descripción, **todo en una línea continua sin saltos** (para pegar en CMD). En bloque de código.
- **Cabecera** en cada documento generado: `Documento generado el AAAA-MM-DD-HHMI` (comentario en .md/.ts/.ps1). Hora de Madrid (GMT+2).
- **Modo oscuro por defecto**, con `data-theme="dark/light"` en `<html>`. No uses el prefijo `dark:` de Tailwind; overrides de modo claro con `html[data-theme="light"]`.
- **Tailwind sin paso de compilación**: solo clases utilitarias base.
- **Sin scripts de migración ni lógica de retrocompatibilidad**: si hace falta, se edita el JSON del personaje a mano.

## Cómo trabajar

No generes todo de golpe. Ve por fases y confirma la base antes de avanzar: (1) estructura de `src/` y **tipos** de catálogos, tablas y ficha/plan → espera visto bueno; (2) datos + tablas; (3) motor (`fold`, `replanDesde`, validación) con tests; (4) UI del asistente; (5) ficha imprimible. Pregunta ante cualquier ambigüedad del manual.

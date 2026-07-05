// Documento generado el 2026-07-05-0914

/**
 * Generador de la ficha de personaje completa en HTML imprimible.
 *
 * Sigue la estructura de secciones de docs/ficha-personaje-plantilla.html:
 * identidad, atributos, habilidades, tablas de referencia, probabilidad por
 * acción × dificultad (calculada para ESTE personaje), dotes, dios/favor,
 * equipo, historial de partidos y notas. HTML autocontenido + print CSS.
 */

import type { Character, CharState, Level1Delta, LevelNDelta } from '@/rules/types'
import type { RaceData } from '@/data/races'
import { fold } from '@/rules/engine'
import { buildProbabilityTable, diceForAttr, rowForSkill } from '@/rules/probability'
import { effectiveAttrs } from '@/rules/helpers'
import { ATTR_DEFS, SKILL_DEFS } from '@/data/config'
import { ATTR_DICE_TABLE, SKILL_TABLE, DIFFICULTY_TABLE } from '@/data/tables'
import { FEATS } from '@/data/feats'
import { GODS } from '@/data/gods'
import { EQUIPMENT, EQUIPMENT_TYPE_LABELS } from '@/data/equipment'

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Formato de probabilidad: entero por defecto, 1 decimal por debajo del 10 % */
export function fmtPct(p: number): string {
  const pct = p * 100
  if (pct < 0.05) return '0%'
  if (pct > 99.95) return '100%'
  if (pct < 9.95) return `${pct.toFixed(1)}%`
  return `${Math.round(pct)}%`
}

/** Nivel al que se ganó cada dote del estado (racial y elegida → nivel 1) */
function featLevels(character: Character, raza: RaceData, state: CharState): Map<string, number> {
  const map = new Map<string, number>()
  map.set(raza.startingFeatId, 1)
  const l1 = character.plan.find(e => e.nivel === 1) as Level1Delta | undefined
  if (l1?.featElegida) map.set(l1.featElegida, 1)
  for (const entry of character.plan) {
    if (entry.nivel === 1) continue
    const d = entry as LevelNDelta
    if (d.featGanada && d.nivel <= state.nivel) map.set(d.featGanada, d.nivel)
  }
  return map
}

// ---------------------------------------------------------------------------
// Generador
// ---------------------------------------------------------------------------

export function buildSheetHTML(character: Character, raza: RaceData): string {
  const state = fold(character.plan, character.nivelActual, raza)
  // Atributo efectivo = base + objetos; dados y probabilidades salen del efectivo (§4.3)
  const eff = effectiveAttrs(state.attrs, character.equipo)
  const probRows = buildProbabilityTable({ ...state, attrs: eff.attrs })
  const god = state.god ? GODS.find(g => g.id === state.god) ?? null : null
  const lvlByFeat = featLevels(character, raza, state)
  const l1 = character.plan.find(e => e.nivel === 1) as Level1Delta | undefined

  const attrTiles = ATTR_DEFS.map(a => {
    const base = state.attrs[a.key]
    const efec = eff.attrs[a.key]
    const over = eff.overCap.includes(a.key)
    return `
    <div class="tile"><div class="name">${esc(a.name)}</div>
      <div class="val num">${efec !== base ? efec : base}</div>
      <div class="aux">${efec !== base ? `base <b class="num">${base}</b> · ` : ''}dados <b class="num">${diceForAttr(efec)}</b> d10${over ? ' <b style="color:#a33">⚠ &gt;20</b>' : ''}</div></div>`
  }).join('')

  const skillTiles = SKILL_DEFS.map(s => {
    const row = rowForSkill(state.skills[s.key])
    const attrName = ATTR_DEFS.find(a => a.key === s.attr)?.name.slice(0, 3) ?? ''
    return `
    <div class="tile"><div class="name">${esc(s.name)} (${esc(attrName)})</div>
      <div class="val num">${state.skills[s.key]}</div>
      <div class="aux num">≥${row.threshold} · ${row.rerolls}r · ${row.auxDie ? 'd' + row.auxDie : '—'}</div></div>`
  }).join('')

  const diceRefRows = ATTR_DICE_TABLE.map(r =>
    `<tr><td>${r.minAttr} – ${r.maxAttr}</td><td class="center num">${r.dice}d10</td></tr>`).join('')

  const skillRefRows = SKILL_TABLE.map(r =>
    `<tr><td class="num">${r.skill}</td><td class="center num">≥${r.threshold}</td>
     <td class="center num">${r.rerolls || '—'}</td><td class="center num">${r.auxDie ? 'd' + r.auxDie : '—'}</td></tr>`).join('')

  const diffHead = DIFFICULTY_TABLE.map(d =>
    `<th class="center">${esc(d.name)} (${d.successes}${d.id === 'imposible' ? '+' : ''})</th>`).join('')

  const probTableRows = probRows.map(r => {
    const attrName  = ATTR_DEFS.find(a => a.key === r.attrKey)?.name.slice(0, 3) ?? r.attrKey
    const skillName = SKILL_DEFS.find(s => s.key === r.skillKey)?.name ?? r.skillKey
    const cells = r.probs.map(p => `<td class="center num">${fmtPct(p)}</td>`).join('')
    return `<tr><td>${esc(r.action.name)}</td>
      <td class="num">${esc(attrName)} ${r.attrValue} · ${esc(skillName)} ${r.skillValue}
        <span class="dim">(${r.spec.dice}d10 ≥${r.spec.threshold}${r.spec.rerolls ? ' ' + r.spec.rerolls + 'r' : ''}${r.spec.auxDie ? ' +d' + r.spec.auxDie : ''})</span></td>${cells}</tr>`
  }).join('')

  const featRows = state.feats.map(fid => {
    const f = FEATS.find(x => x.id === fid)
    const lvl = lvlByFeat.get(fid)
    return `<tr><td>${esc(f?.name ?? fid)}${fid === raza.startingFeatId ? ' <span class="dim">(racial)</span>' : ''}</td>
      <td>${esc(f?.chain ?? '')}${f ? ` <span class="dim">t${f.tier}</span>` : ''}</td>
      <td class="center num">${lvl ?? ''}</td>
      <td class="dim">${esc(f?.effect ?? '')}</td></tr>`
  }).join('')
  const featBlankRows = Array.from({ length: Math.max(0, 8 - state.feats.length) },
    () => `<tr><td class="line"></td><td class="line"></td><td class="line"></td><td class="line"></td></tr>`).join('')

  const rezarAttrs = god
    ? god.rezarAttrs.map(k => `${ATTR_DEFS.find(a => a.key === k)?.name ?? k} (${state.attrs[k]})`).join(' / ')
    : ''
  const rezarSkill = god
    ? `${SKILL_DEFS.find(s => s.key === god.rezarSkill)?.name ?? god.rezarSkill} (${state.skills[god.rezarSkill]})`
    : ''

  const equipoItems: string[] = []
  for (const id of character.equipo ?? []) {
    const item = EQUIPMENT.find(e => e.id === id)
    equipoItems.push(item
      ? `<tr><td>${esc(item.name)} <span class="dim">(${esc(EQUIPMENT_TYPE_LABELS[item.type])})</span></td><td class="dim">${esc(item.effect)}</td></tr>`
      : `<tr><td>${esc(id)} <span class="dim">(desconocido)</span></td><td class="line"></td></tr>`)
  }
  for (const x of [l1?.equipoInicial, l1?.consumibleInicial, l1?.objetoNarrativo]) {
    if (x) equipoItems.push(`<tr><td>${esc(x)}</td><td class="line"></td></tr>`)
  }
  const equipoRows = equipoItems.join('')
  const equipoBlank = Array.from({ length: Math.max(1, 5 - equipoItems.length) },
    () => `<tr><td class="line"></td><td class="line"></td></tr>`).join('')

  const historialRows = Array.from({ length: 6 }, () =>
    `<tr><td class="line"></td><td class="line"></td><td class="line"></td><td class="line"></td>
     <td class="line"></td><td class="line"></td><td class="line"></td><td class="line"></td></tr>`).join('')

  const donesRows = Array.from({ length: 3 }, () =>
    `<tr><td class="line"></td><td class="line"></td></tr>`).join('')

  return `<!doctype html>
<html lang="es" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BBRTG — ${esc(character.nombre)} (Nv. ${state.nivel})</title>
<style>
  :root{
    --bg:#ffffff; --surf:#ffffff; --surf2:#f4f2ec;
    --line:rgba(20,18,10,.22); --line-strong:rgba(20,18,10,.50);
    --chalk:#141208; --mut:#55503f; --amber:#8a5a15;
  }
  html[data-theme="dark"]{
    --bg:#0d0d0b; --surf:#18170f; --surf2:#211f16;
    --line:rgba(244,238,222,.14); --line-strong:rgba(244,238,222,.30);
    --chalk:#f4eede; --mut:#9a9587; --amber:#d9932e;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:var(--bg);color:var(--chalk)}
  body{font-family:"Segoe UI",system-ui,sans-serif;padding:24px 0 60px;
    display:flex;flex-direction:column;align-items:center;gap:20px}
  .num{font-family:"Consolas","Cascadia Code",monospace}
  .dim{color:var(--mut);font-size:.9em}
  .toolbar{width:794px;max-width:94vw;display:flex;justify-content:space-between;align-items:center;padding:8px 4px}
  .toolbar span{color:var(--mut);font-size:12px}
  .toolbar button{background:var(--amber);color:#fff;border:0;border-radius:3px;
    padding:8px 16px;cursor:pointer;text-transform:uppercase;font-size:12px;font-weight:600}
  .page{width:794px;max-width:94vw;background:var(--surf);border:1px solid var(--line-strong);
    padding:26px 30px 30px;position:relative}
  .page::before{content:"";position:absolute;top:0;left:0;right:0;height:5px;
    background:repeating-linear-gradient(90deg,var(--amber) 0 22px,transparent 22px 30px);opacity:.55}
  .scoreboard{display:flex;justify-content:space-between;align-items:flex-end;
    border-bottom:2px solid var(--amber);padding-bottom:10px;margin-bottom:16px}
  .brand{font-size:26px;font-weight:800;letter-spacing:.03em;color:var(--amber);line-height:1}
  .brand small{display:block;font-size:11px;font-weight:500;letter-spacing:.14em;color:var(--mut);margin-top:3px;text-transform:uppercase}
  .rules-ver{font-size:11px;color:var(--mut);text-align:right}
  .rules-ver .num{color:var(--chalk);font-size:13px}
  .id-grid{display:grid;grid-template-columns:2.3fr 1fr 1fr 1fr;gap:10px;margin-bottom:16px}
  .field{display:flex;flex-direction:column;gap:3px}
  .field label{font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut)}
  .field .fv, .field input{background:var(--surf2);border:1px solid var(--line);color:var(--chalk);
    font-size:13.5px;padding:6px 8px;border-radius:2px;width:100%;min-height:29px;font-family:inherit}
  .section-title{display:flex;align-items:center;gap:10px;margin:20px 0 10px}
  .section-title h2{font-size:14px;letter-spacing:.06em;text-transform:uppercase}
  .section-title .rule{flex:1;height:1px;background:var(--line-strong)}
  .section-title .tag{font-size:10px;color:var(--amber);letter-spacing:.08em;text-transform:uppercase}
  .tiles{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
  .tile{background:var(--surf2);border:1px solid var(--line);border-radius:3px;padding:8px 6px 9px;text-align:center}
  .tile .name{font-size:9.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);
    height:22px;display:flex;align-items:center;justify-content:center}
  .tile .val{width:44px;height:44px;margin:2px auto 6px;display:flex;align-items:center;justify-content:center;
    background:var(--bg);border:1px solid var(--line-strong);color:var(--amber);font-size:22px;font-weight:800;border-radius:3px}
  .tile .aux{font-size:9.5px;color:var(--mut);line-height:1.5}
  table{width:100%;border-collapse:collapse;font-size:11.5px}
  thead th{text-align:left;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;
    color:var(--mut);border-bottom:1px solid var(--line-strong);padding:5px 6px;font-weight:500}
  tbody td{padding:5px 6px;border-bottom:1px solid var(--line);vertical-align:top}
  td.center, th.center{text-align:center}
  td.line{height:22px}
  .ref-tables{display:grid;grid-template-columns:1fr 1.55fr;gap:16px}
  .ref-tables .num{color:var(--amber)}
  .split{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .callout{background:var(--surf2);border:1px solid var(--line);border-radius:3px;
    padding:8px 10px;font-size:10.5px;color:var(--mut);line-height:1.5;margin-top:8px}
  .notes{width:100%;min-height:70px;background:var(--surf2);border:1px solid var(--line);
    color:var(--chalk);font-size:12px;padding:8px;border-radius:2px;white-space:pre-wrap}
  .page-footer{display:flex;justify-content:space-between;margin-top:18px;padding-top:8px;
    border-top:1px solid var(--line);font-size:9px;color:var(--mut)}
  @media print{
    html[data-theme="dark"]{
      --bg:#ffffff; --surf:#ffffff; --surf2:#f4f2ec;
      --line:rgba(20,18,10,.25); --line-strong:rgba(20,18,10,.55);
      --chalk:#141208; --mut:#55503f; --amber:#8a5a15;
    }
    body{padding:0;gap:0}
    .toolbar{display:none}
    .page{border:0;width:auto;max-width:none;padding:12mm 12mm 14mm;page-break-after:always}
    .page:last-child{page-break-after:auto}
    @page{size:A4;margin:0}
  }
</style>
</head>
<body>

<div class="toolbar">
  <span>BBRTG · Ficha de ${esc(character.nombre)} · nivel ${state.nivel} · reglas v${esc(character.rulesVersion)}</span>
  <div style="display:flex;gap:8px">
    <button onclick="var h=document.documentElement;h.setAttribute('data-theme',h.getAttribute('data-theme')==='light'?'dark':'light')">Tema</button>
    <button onclick="window.print()">Imprimir / Guardar PDF</button>
  </div>
</div>

<!-- ============================= PÁGINA 1 ============================= -->
<div class="page">
  <div class="scoreboard">
    <div class="brand">BBRTG<small>Blood Bowl: Rise to Glory — ficha de personaje</small></div>
    <div class="rules-ver">Reglas<br><span class="num">v${esc(character.rulesVersion)}</span></div>
  </div>

  <div class="id-grid">
    <div class="field"><label>Nombre del personaje</label><div class="fv">${esc(character.nombre)}</div></div>
    <div class="field"><label>Raza</label><div class="fv">${esc(raza.name)}</div></div>
    <div class="field"><label>Nivel</label><div class="fv num">${state.nivel}</div></div>
    <div class="field"><label>Jugador (persona)</label><input type="text"></div>
    <div class="field"><label>Equipo</label><input type="text"></div>
    <div class="field"><label>Dios</label><div class="fv">${god ? esc(god.name) : '—'}</div></div>
    <div class="field"><label>Nº de dorsal</label><input type="text"></div>
  </div>

  <div class="section-title"><h2>Atributos</h2><div class="rule"></div><span class="tag">máx. natural según nivel</span></div>
  <div class="tiles">${attrTiles}</div>

  <div class="section-title"><h2>Habilidades</h2><div class="rule"></div><span class="tag">umbral · repeticiones · dado aux.</span></div>
  <div class="tiles">${skillTiles}</div>

  <div class="section-title"><h2>Tablas de referencia</h2><div class="rule"></div></div>
  <div class="ref-tables">
    <table>
      <thead><tr><th>Atributo</th><th class="center">Dados</th></tr></thead>
      <tbody>${diceRefRows}</tbody>
    </table>
    <table>
      <thead><tr><th>Habilidad</th><th class="center">Umbral</th><th class="center">Rerolls</th><th class="center">Dado aux.</th></tr></thead>
      <tbody>${skillRefRows}</tbody>
    </table>
  </div>

  <div class="section-title"><h2>Probabilidad por acción</h2><div class="rule"></div><span class="tag">calculada para este personaje</span></div>
  <table>
    <thead><tr><th style="width:17%">Acción</th><th style="width:24%">Atributo · Habilidad</th>${diffHead}</tr></thead>
    <tbody>${probTableRows}</tbody>
  </table>
  <div class="callout">Probabilidad de alcanzar los éxitos que exige cada dificultad con los atributos y habilidades
    reales de este personaje a nivel ${state.nivel}. Incluye la explosión de los 10 naturales (en cadena), las
    repeticiones de dados fallidos (sin explotar) y el dado auxiliar sumado al mejor dado fallido.</div>

  <div class="page-footer"><span>BBRTG — Rise to Glory</span><span>Página 1 / 2 — Atributos, habilidades y tiradas</span></div>
</div>

<!-- ============================= PÁGINA 2 ============================= -->
<div class="page">
  <div class="scoreboard">
    <div class="brand" style="font-size:18px">DOTES · DIOS · EQUIPO<small>continuación de la ficha</small></div>
    <div class="rules-ver">Nombre<br><span class="num">${esc(character.nombre)}</span></div>
  </div>

  <div class="section-title"><h2>Dotes</h2><div class="rule"></div><span class="tag">racial + elegidas</span></div>
  <table>
    <thead><tr><th style="width:24%">Dote</th><th style="width:20%">Cadena</th><th style="width:8%" class="center">Nivel</th><th>Efecto (resumen)</th></tr></thead>
    <tbody>${featRows}${featBlankRows}</tbody>
  </table>

  <div class="split">
    <div>
      <div class="section-title"><h2>Dios y favor</h2><div class="rule"></div></div>
      <div class="id-grid" style="grid-template-columns:1fr 1fr">
        <div class="field"><label>Dios venerado</label><div class="fv">${god ? esc(god.name) : '—'}</div></div>
        <div class="field"><label>Favor actual</label><input type="text"></div>
        <div class="field"><label>Atributos de rezo</label><div class="fv">${esc(rezarAttrs) || '—'}</div></div>
        <div class="field"><label>Habilidad de rezo</label><div class="fv">${esc(rezarSkill) || '—'}</div></div>
      </div>
      <table style="margin-top:8px">
        <thead><tr><th>Dones recibidos</th><th style="width:26%" class="center">Nivel</th></tr></thead>
        <tbody>${donesRows}</tbody>
      </table>
    </div>
    <div>
      <div class="section-title"><h2>Equipo y objetos</h2><div class="rule"></div></div>
      <table>
        <thead><tr><th>Objeto</th><th style="width:34%">Efecto / notas</th></tr></thead>
        <tbody>${equipoRows}${equipoBlank}</tbody>
      </table>
    </div>
  </div>

  <div class="section-title"><h2>Historial de partidos</h2><div class="rule"></div></div>
  <table>
    <thead><tr>
      <th style="width:9%">Fecha</th><th style="width:20%">Rival</th><th style="width:10%" class="center">Resultado</th>
      <th style="width:8%" class="center">TDs</th><th style="width:8%" class="center">Bajas caus.</th>
      <th style="width:8%" class="center">Bajas sufr.</th><th style="width:8%" class="center">MVP</th><th>Notas</th>
    </tr></thead>
    <tbody>${historialRows}</tbody>
  </table>

  <div class="section-title"><h2>Notas</h2><div class="rule"></div></div>
  <div class="notes">${esc(character.notas) || '&nbsp;'}</div>

  <div class="page-footer"><span>BBRTG — Rise to Glory</span><span>Página 2 / 2 — Dotes, dios, equipo e historial</span></div>
</div>

</body>
</html>`
}

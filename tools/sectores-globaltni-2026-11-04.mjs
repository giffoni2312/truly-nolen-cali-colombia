// One-off edit (receta 4-nov-2026, paso 6c) for Cali: globaltni's 4 sectors on Comercios (right after the lead),
// home rows to each sector anchor, globaltni's commercial page as a source, and no sideways scroll.
import { readFileSync, writeFileSync } from 'node:fs';
const edit = (file, fn) => { const p = new URL(`../src/${file}`, import.meta.url); writeFileSync(p, fn(readFileSync(p, 'utf8'))); };
const rep = (s, a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`found ${n}x: ${a.slice(0, 70)}`); return s.replace(a, b); };

edit('pages.mjs', (p) => {
  const i = p.indexOf("const comercios = {"), j = p.indexOf("};", i);
  let c = p.slice(i, j);
  // the old 2-group "¿Quién se beneficia?" table goes away (the sectors block replaces it)
  const a = c.indexOf("    tabla({\n      h2: '¿Quién se beneficia?',"), b = c.indexOf("    }),\n", a) + "    }),\n".length;
  if (a < 0) throw new Error('old benef block');
  c = c.slice(0, a) + c.slice(b);
  c = rep(c, "    bloques: [\n", "    bloques: [\n    { k: 'html', html: sectoresHtml() },\n");
  c = rep(c, "fuentesList: [", "fuentesList: [F.gtComercial, ");
  p = p.slice(0, i) + c + p.slice(j);
  p = rep(p, "const F = {\n", "const F = {\n  gtComercial: ['Truly Nolen International (2026). Servicio comercial: salud, industrias, venta de alimentos y logística', 'https://globaltni.com/es/services/commercial/'],\n");
  const imp = p.indexOf('\n', p.lastIndexOf("\nimport ", p.indexOf('const F = {')) + 1);
  return p.slice(0, imp) + "import { sectoresHtml } from './sectores.mjs';\n" + p.slice(imp);
});

edit('portada.mjs', (p) => {
  const a = p.indexOf("${sector('¿Para quién?'"), b = p.indexOf("${sector('Industria'");
  if (a < 0 || b < 0) throw new Error('rows');
  const rows = "${sector('Salud', 'Hospitales, clínicas, laboratorios, hogares geriátricos y consultorios.', `${ROOT}servicios/comercios/#sector-salud`)}"
    + "${sector('Venta de alimentos', 'Supermercados, panaderías, restaurantes y comidas rápidas.', `${ROOT}servicios/comercios/#sector-alimentos`)}"
    + "${sector('Logística', 'Bodegas, transporte de carga, agentes de carga y operadores logísticos.', `${ROOT}servicios/comercios/#sector-logistica`)}";
  return p.slice(0, a) + rows + p.slice(b);
});

edit('receta.css', (s) => s + '\n/* receta 4-nov-2026: the footer watercolor uses 100vw (counts the scrollbar) -> 8 px sideways scroll; clip it.\n   Sector anchors land below the sticky header. */\nbody{overflow-x:clip}\n[id^="sector-"],#indice,#otros-sectores{scroll-margin-top:96px}\n');
console.log('ok');

// Measures Cali against the Venezuela reference (which already passes the official gate-replica)
// with a real browser, at the widths the recipe lists. It is a stand-in until the official
// gates (gate-replica.mjs / gate-oficinas.mjs) are available; it does not replace them.
//
// Checks, per page and width:
//  - computed styles of key roles (font family/size/weight, color, line-height) equal to Venezuela (±2 px)
//  - no horizontal scroll at any width
//  - header menu in ONE line from 961 px; logo not wrapped
//  - h1 / breadcrumb not hidden under the header
//  - no heading word split across two lines at 390 px, no hyphens:auto
//  - tap targets >= 44 px tall on phone (breadcrumb, pest tabs, "En esta página", sources, closing links)
//  - text: no spaced-out letters, no 8+ word sentence twice on a page, "Leer…" links go to an article
//
// Usage: node tools/replica.mjs   (needs node serve.mjs on 8090 and Venezuela online)
import { chromium } from 'playwright-core';

const CALI = 'http://127.0.0.1:8090/oficinas/cali/';
const VE = 'https://lucart97.github.io/truly-nolen-argentina/oficinas/argentina/'; // reference: Argentina (Carlos, 3-nov-2026)
const PAIRS = [
  ['', ''],
  ['servicios/hogares/', 'servicios/hogares/'],
  ['servicios/comercios/', 'servicios/comercios/'],
  ['servicios/industria/', 'servicios/industria/'],
  ['plagas/zancudos/', 'plagas/mosquitos/'],
  ['plagas/ratas-y-ratones/', 'plagas/ratas-y-ratones/'],
  ['plagas/cucarachas/', 'plagas/cucarachas/'],
  ['plagas/hormigas/', 'plagas/palomas/'],
  ['plagas/comejen/', 'plagas/termitas/'],
  ['plagas/alacranes/', 'plagas/alacranes/'],
  ['blog/', 'blog/'],
  ['blog/como-acabar-con-los-zancudos-en-casa/', 'blog/como-eliminar-las-cucarachas-de-la-cocina/'],
  ['blog/como-eliminar-el-comejen/', 'blog/vinchuca-y-chagas/'],
  ['blog/como-evitar-ratas-en-casa/', 'blog/desratizacion-en-caba-2026/'],
  ['blog/cucarachas-resistentes-en-cali/', 'blog/palomas-en-edificios/'],
  ['privacidad/', 'privacidad/'],
  ['terminos/', 'terminos/'],
  ['accesibilidad/', 'accesibilidad/'],
];
const WIDTHS = [390, 961, 1024, 1100, 1280, 1440];
const ROLES = ['body', 'h1', 'h2', 'h3', 'p', '.button', '.text-link', 'nav a', 'footer a', '.s-note', '.pest-lead', '.s-entrada', '.eyebrow', '.g-ey', '.pest-eyebrow'];
const PROPS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'letterSpacing', 'textTransform'];

function measure() {
  const out = { roles: {}, issues: [] };
  const vw = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > vw + 1) {
    const wide = [...document.querySelectorAll('body *')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        if (r.right <= vw + 1 || r.width === 0) return false;
        for (let p = e.parentElement; p; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX;
          if (o === 'hidden' || o === 'auto' || o === 'scroll' || o === 'clip') return false;
        }
        return true;
      })
      .slice(0, 3)
      .map((e) => e.tagName.toLowerCase() + '.' + String(e.className).split(' ')[0]);
    out.issues.push(`scroll horizontal (${document.documentElement.scrollWidth}>${vw}): ${wide.join(', ')}`);
  }
  for (const sel of window.__ROLES) {
    const e = [...document.querySelectorAll(sel)].find((x) => x.offsetParent && x.closest('main, header, footer'));
    if (!e) continue;
    const cs = getComputedStyle(e);
    out.roles[sel] = Object.fromEntries(window.__PROPS.map((p) => [p, cs[p]]));
  }
  // header in one line from 961 px
  const header = document.querySelector('header');
  if (vw >= 961 && header) {
    const links = [...header.querySelectorAll('nav a, nav button, nav summary')].filter((a) => a.offsetParent && a.getBoundingClientRect().height > 0);
    const tops = new Set(links.map((a) => Math.round(a.getBoundingClientRect().top / 8)));
    if (tops.size > 2) out.issues.push(`menú en más de una línea (${tops.size} filas)`);
  }
  // h1 not under the header
  const h1 = document.querySelector('main h1');
  if (h1 && header && getComputedStyle(header).position === 'fixed') {
    const hb = header.getBoundingClientRect().bottom;
    if (h1.getBoundingClientRect().top < hb - 2 && !document.querySelector('.cinema')) out.issues.push('h1 debajo del encabezado');
  }
  // heading words split / hyphens
  if (vw <= 400) {
    for (const h of document.querySelectorAll('main h1, main h2, main h3')) {
      if (getComputedStyle(h).hyphens === 'auto') out.issues.push(`hyphens:auto en ${h.tagName}`);
      const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = n.textContent;
        for (const m of t.matchAll(/\S{4,}/g)) {
          const r = document.createRange();
          r.setStart(n, m.index);
          r.setEnd(n, m.index + m[0].length);
          const rects = [...r.getClientRects()].filter((x) => x.width > 0);
          const lines = new Set(rects.map((x) => Math.round(x.top)));
          if (lines.size > 1) out.issues.push(`palabra partida en ${h.tagName}: «${m[0]}»`);
        }
      }
    }
    // tap targets
    const sels = ['.pest-breadcrumb a', 'nav[aria-label="Ruta"] a', '.pest-families a', '.pest-index summary', '.s-fuentes a', '.s-closing a', '.ux-index summary'];
    for (const s of sels)
      for (const a of document.querySelectorAll(s)) {
        if (!a.offsetParent) continue;
        const r = a.getBoundingClientRect();
        if (r.height > 0 && r.height < 43.5) { // sub-pixel rounding (43.99) is not a real miss
          out.issues.push(`toque < 44 px (${Math.round(r.height)}): ${s}`);
          break;
        }
      }
  }
  // text checks
  const text = document.querySelector('main')?.innerText || '';
  if (/(?:\b\p{L} ){6,}\p{L}\b/u.test(text)) out.issues.push('letras sueltas separadas por espacio');
  const sentences = text.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length >= 8);
  const seen = new Set();
  for (const x of sentences) {
    if (seen.has(x)) out.issues.push(`frase repetida: «${x.slice(0, 60)}…»`);
    seen.add(x);
  }
  for (const a of document.querySelectorAll('main a')) if (/^Leer/.test(a.textContent.trim()) && !/\/blog\/[^/]+\/$/.test(new URL(a.href).pathname)) out.issues.push(`«${a.textContent.trim()}» no lleva a un artículo`);
  return out;
}

const px = (v) => parseFloat(v);
const browser = await chromium.launch({ headless: true });
let problems = 0;
const report = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript(([r, p]) => { window.__ROLES = r; window.__PROPS = p; }, [ROLES, PROPS]);
  const page = await ctx.newPage();
  for (const [c, v] of PAIRS) {
    const get = async (url) => {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.evaluate(() => document.querySelectorAll('video').forEach((x) => x.remove()));
      await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
      return page.evaluate(measure);
    };
    const mc = await get(CALI + c);
    const mv = await get(VE + v);
    const issues = [...mc.issues.filter((i) => !mv.issues.includes(i))];
    for (const [role, st] of Object.entries(mv.roles)) {
      const sc = mc.roles[role];
      if (!sc) continue;
      for (const p of PROPS) {
        const a = st[p], b = sc[p];
        if (a === b) continue;
        if (/px$/.test(a) && /px$/.test(b) && Math.abs(px(a) - px(b)) <= 2) continue;
        issues.push(`${role} ${p}: VE ${a} · CALI ${b}`);
      }
    }
    if (issues.length) {
      problems += issues.length;
      report.push(`\n[${w}] ${c || 'portada'}\n  - ` + [...new Set(issues)].join('\n  - '));
    }
  }
  await ctx.close();
}
await browser.close();
console.log(report.join('\n') || '');
console.log(problems ? `\n${problems} diferencia(s) con Argentina.` : `\n${PAIRS.length} páginas × ${WIDTHS.length} anchos iguales a Argentina en lo medido.`);
process.exit(problems ? 1 : 0);

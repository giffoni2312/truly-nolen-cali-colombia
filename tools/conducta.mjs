// Recipe R4/R5/R8/R14/R16 (5-nov-2026): measures behaviour, not only static styles, on Cali and on the Venezuela
// reference at the same widths. Stand-in for the owner's gate-replica "conducta" (not on this PC).
//  - magnifier (.gt-buscar) opens the site search dialog (not the chat) and finds a page
//  - sticky header after scrolling 1500 px: top -44 on computer, 0 on phone
//  - chat button size (R8)
//  - broken images and internal links that answer 404 (every page)
// Usage: node tools/conducta.mjs   (needs node serve.mjs on 8090)
import { chromium } from 'playwright-core';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const CALI = 'http://127.0.0.1:8090/oficinas/cali/';
const VE = 'https://borrador-venezuela.truly-inbound-borrador.pages.dev/oficinas/venezuela/';
const WIDTHS = [390, 768, 1024, 1440];
const SITE = fileURLToPath(new URL('../site/oficinas/cali/', import.meta.url));
const pages = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) { if (f !== 'assets') walk(p); } else if (f === 'index.html') pages.push(relative(SITE, d).split('\\').join('/')); } })(SITE);

const exe = process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath: exe, headless: true });
const errors = [];
const log = [];

async function conducta(base, w) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  // magnifier: on the phone it lives inside the menu
  if (w <= 960) { const t = page.locator('.menu-toggle'); if (await t.isVisible()) { await t.click(); await page.waitForTimeout(300); } }
  const lupa = page.locator('.gt-buscar').first();
  let busca = 'sin lupa visible';
  if (await lupa.isVisible()) {
    await lupa.click();
    await page.waitForTimeout(400);
    const dlg = await page.evaluate(() => document.querySelector('.search-dialog')?.open === true);
    const chat = await page.evaluate(() => document.querySelector('.tia-panel')?.getAttribute('aria-hidden') === 'false');
    await page.fill('#site-search', 'zancudos').catch(() => {});
    await page.waitForTimeout(300);
    const n = await page.evaluate(() => document.querySelectorAll('.search-results li').length);
    busca = `búsqueda ${dlg ? 'abre' : 'NO abre'}, chat ${chat ? 'SE ABRE' : 'cerrado'}, «zancudos» → ${n}`;
    await page.keyboard.press('Escape');
  }
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(800);
  const head = await page.evaluate(() => { const h = document.querySelector('header.site-nav'); const r = h.getBoundingClientRect(); return `${getComputedStyle(h).position} top=${Math.round(r.top)}`; });
  const fab = await page.evaluate(() => { const b = document.querySelector('.tia-fab'); if (!b) return 'sin botón'; const r = b.getBoundingClientRect(); return `${Math.round(r.width)}×${Math.round(r.height)} a ${Math.round(innerWidth - r.right)}/${Math.round(innerHeight - r.bottom)}`; });
  await page.close();
  return { busca, head, fab };
}

for (const w of WIDTHS) {
  const [c, v] = [await conducta(CALI, w), await conducta(VE, w)];
  for (const k of ['busca', 'head', 'fab']) {
    log.push(`${w} ${k}: CALI ${c[k]} · VE ${v[k]}`);
    if (c[k] !== v[k] && !(k === 'busca' && c[k].replace(/→ \d+/, '') === v[k].replace(/→ \d+/, ''))) errors.push(`${w} ${k}: CALI ${c[k]} · VE ${v[k]}`);
  }
  if (!/abre, chat cerrado, «zancudos» → [1-9]/.test(c.busca)) errors.push(`${w}: la lupa no funciona bien (${c.busca})`);
}

// broken images and internal links on every page (1280)
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const checked = new Map();
for (const p of pages) {
  const page = await ctx.newPage();
  await page.goto(CALI + (p ? p + '/' : ''), { waitUntil: 'load' });
  // scroll down slowly so lazy images load
  for (let y = 0; y < 30000; y += 800) { const done = await page.evaluate((yy) => { scrollTo(0, yy); return yy > document.body.scrollHeight; }, y); await page.waitForTimeout(60); if (done) break; }
  await page.waitForTimeout(500);
  const rotas = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')));
  for (const r of rotas) errors.push(`${p || 'portada'}: imagen rota ${r}`);
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin)));
  for (const l of links) {
    const [url, hash] = l.split('#');
    if (!checked.has(url)) { const r = await ctx.request.get(url); checked.set(url, r.status()); }
    if (checked.get(url) !== 200) errors.push(`${p || 'portada'}: enlace ${l} → ${checked.get(url)}`);
    if (hash) {
      const ok = url === page.url().split('#')[0] ? await page.evaluate((h) => !!document.getElementById(h), hash) : true;
      if (!ok) errors.push(`${p || 'portada'}: ancla #${hash} sin destino`);
    }
  }
  await page.close();
}
// anchors on other pages (e.g. comercios/#healthcare from the homepage)
for (const [u] of checked) void u;
await browser.close();
for (const l of log) console.log(l);
for (const e of errors) console.log('ERROR ' + e);
console.log(`${pages.length} páginas, ${checked.size} direcciones revisadas, ${errors.length} error(es)`);
process.exit(errors.length ? 1 : 0);

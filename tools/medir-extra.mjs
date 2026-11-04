// Extra checks from recipe rounds 5-9 (3-nov-2026) not covered by tools/medir.mjs.
// Usage: node tools/medir-extra.mjs
import { pathToFileURL } from 'node:url';
const PW = process.env.PW_CORE || 'C:/Users/carlos/Desktop/truly-cali/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(PW).href);
const BASE = process.env.BASE || 'http://localhost:8090/oficinas/cali/';
const PAGES = ['', 'servicios/hogares/', 'servicios/comercios/', 'servicios/industria/', 'plagas/zancudos/', 'plagas/ratas-y-ratones/', 'plagas/cucarachas/', 'plagas/hormigas/', 'plagas/comejen/', 'plagas/alacranes/', 'blog/', 'blog/como-acabar-con-los-zancudos-en-casa/', 'blog/como-eliminar-el-comejen/', 'blog/como-evitar-ratas-en-casa/', 'blog/cucarachas-resistentes-en-cali/', 'privacidad/', 'terminos/', 'accesibilidad/'];
const browser = await chromium.launch();
const problems = [];
for (const w of [390, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p + '?m=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    const r = await page.evaluate(async (w) => {
      const out = [];
      const vis = (e) => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
      // Forbidden yellow rgb(255,224,0)
      const bad = [...document.querySelectorAll('body *')].filter((e) => { const s = getComputedStyle(e); return [s.color, s.backgroundColor, s.borderTopColor].includes('rgb(255, 224, 0)') && vis(e); });
      if (bad.length) out.push(`${bad.length} elementos con rgb(255,224,0): ${bad[0].className}`);
      // Reading progress bar hidden in offices
      const prog = document.querySelector('.machote-reading-progress');
      if (prog && getComputedStyle(prog).display !== 'none') out.push('barra de progreso de lectura visible');
      // Loose letters (>= 6 single letters separated by spaces)
      const txt = document.querySelector('main').innerText;
      const loose = txt.match(/(?:\b\p{L} ){6,}/u);
      if (loose) out.push(`letras sueltas: «${loose[0]}»`);
      // Repeated sentences of >= 8 words inside main
      const sent = txt.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 8);
      const seen = new Map(); for (const s of sent) seen.set(s, (seen.get(s) || 0) + 1);
      const dup = [...seen].filter(([, n]) => n > 1);
      if (dup.length) out.push(`frase repetida: «${dup[0][0].slice(0, 60)}»`);
      // "Leer..." links must go to an article
      for (const a of document.querySelectorAll('main a')) if (/^Leer/.test(a.textContent.trim()) && !/\/blog\/[^/]+\/$/.test(new URL(a.href).pathname)) out.push(`«${a.textContent.trim()}» no lleva a un artículo`);
      // Hero text <= 41 % of width (desktop, home)
      const ht = document.querySelector('#inicio .hero-text');
      if (ht && w >= 961) { const b = ht.getBoundingClientRect(); if (b.right > innerWidth * 0.41 + 2) out.push(`texto del hero llega al ${Math.round(b.right / innerWidth * 100)} %`); }
      // Mobile bar yellow
      if (w < 761) { const h = document.querySelector('.site-header') || document.querySelector('header'); const bg = getComputedStyle(h).backgroundColor; if (!/255, 216, 0|255, 217, 0/.test(bg) && !document.querySelector('#inicio')) out.push(`barra del celular ${bg}`); }
      // Footer gray
      const f = document.querySelector('footer'); if (f) { const bg = getComputedStyle(f).backgroundColor; if (bg !== 'rgb(242, 242, 242)') out.push(`pie ${bg}`); }
      // Assistant bubble covering link/button text (mobile): scroll each section's end into view
      if (w < 500) {
        const fab = document.querySelector('.tia-fab, [aria-controls="tia-panel"]');
        if (fab) for (const sec of document.querySelectorAll('main section')) {
          sec.scrollIntoView({ block: 'end' }); await new Promise((r) => setTimeout(r, 30));
          const fb = fab.getBoundingClientRect();
          for (const a of sec.querySelectorAll('a, button, summary')) {
            if (!vis(a) || !a.textContent.trim()) continue;
            const rng = document.createRange(); rng.selectNodeContents(a);
            for (const rr of rng.getClientRects()) if (rr.width > 2 && rr.right > fb.left + 4 && rr.left < fb.right - 4 && rr.bottom > fb.top + 4 && rr.top < fb.bottom - 4) { out.push(`el chat tapa «${a.textContent.trim().slice(0, 30)}»`); break; }
          }
        }
      }
      return [...new Set(out)];
    }, w);
    if (r.length) problems.push(`${w} ${p || 'portada'}: ${r.join('; ')}`);
  }
  await ctx.close();
}
await browser.close();
console.log(problems.join('\n') || 'sin problemas');
console.log(`\n${PAGES.length} páginas × 2 anchos, ${problems.length} con algo para revisar.`);

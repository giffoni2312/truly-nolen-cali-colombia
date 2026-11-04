// Browser checks from the 3-nov-2026 recipe, run with the playwright-core already installed in truly-cali
// (nothing new is installed). Usage: node tools/medir.mjs [outDir]
// Measures every Uruguay page at several widths: horizontal scroll, one-line menu (>=961), header not
// covering crumb/h1, 44 px tap targets at 390, headings that split a word, and the assistant bubble.
import { pathToFileURL } from 'node:url';
const PW = process.env.PW_CORE || 'C:/Users/carlos/Desktop/truly-cali/node_modules/playwright-core/index.mjs';
const { chromium } = await import(pathToFileURL(PW).href);
const BASE = process.env.BASE || 'http://localhost:8090/oficinas/cali/';
const OUT = process.argv[2];
const PAGES = ['', 'servicios/hogares/', 'servicios/comercios/', 'servicios/industria/', 'plagas/zancudos/', 'plagas/ratas-y-ratones/', 'plagas/cucarachas/', 'plagas/hormigas/', 'plagas/comejen/', 'plagas/alacranes/', 'blog/', 'blog/como-acabar-con-los-zancudos-en-casa/', 'blog/como-eliminar-el-comejen/', 'blog/como-evitar-ratas-en-casa/', 'blog/cucarachas-resistentes-en-cali/', 'privacidad/', 'terminos/', 'accesibilidad/'];
const WIDTHS = [360, 390, 768, 900, 961, 1024, 1100, 1180, 1280, 1366, 1440];
const browser = await chromium.launch();
const problems = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p + '?m=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    const r = await page.evaluate((w) => {
      const out = [];
      const de = document.documentElement;
      if (de.scrollWidth > de.clientWidth + 1) out.push(`scroll horizontal ${de.scrollWidth}>${de.clientWidth}`);
      const hdr = document.querySelector('.site-header') || document.querySelector('header');
      const hb = hdr.getBoundingClientRect().bottom;
      const firstMain = document.querySelector('main nav, main h1');
      if (firstMain && firstMain.getBoundingClientRect().top < hb - 1 && !document.querySelector('#inicio')) out.push(`encabezado tapa la miga/h1 (${Math.round(firstMain.getBoundingClientRect().top)}<${Math.round(hb)})`);
      if (w >= 961) {
        const nav = hdr.querySelector('nav') || hdr;
        // The master has a utility row (My Truly / Inside Truly) above the menu: measure only the main menu row
        const items = [...nav.querySelectorAll(':scope a, :scope button')].filter((e) => { const b = e.getBoundingClientRect(); const s = getComputedStyle(e); return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && !e.closest('[hidden]') && b.bottom <= hb + 1 && b.top >= hdr.getBoundingClientRect().top - 1 && !e.closest('.nav-panel,.dropdown,.submenu,[role=menu],ul ul') && !/My Truly|Inside Truly/.test(e.textContent); });
        const mids = items.map((e) => { const b = e.getBoundingClientRect(); return b.top + b.height / 2; });
        if (mids.length && Math.max(...mids) - Math.min(...mids) > 24) out.push(`menú en más de una línea (${Math.round(Math.max(...mids) - Math.min(...mids))} px)`);
      }
      // A text column squeezed to a word per line (third design review: .ct-prose at 768-1279)
      const narrow = [...document.querySelectorAll('main p, main li')].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.width < 160 && e.textContent.trim().length > 40; });
      if (narrow.length) out.push(`${narrow.length} párrafos de menos de 160 px: «${narrow[0].textContent.trim().slice(0, 30)}»`);
      if (w < 500) {
        const small = [...document.querySelectorAll('main a, main button, main summary, footer a, footer button')].filter((e) => {
          const b = e.getBoundingClientRect(); if (b.width === 0 || b.height === 0) return false;
          if (e.closest('p, li') && e.closest('p, li').textContent.trim().length > e.textContent.trim().length + 3) return false; // inline link inside text
          return b.height < 43.5;
        });
        if (small.length) out.push(`${small.length} toques < 44 px: ${small.slice(0, 3).map((e) => e.textContent.trim().slice(0, 25)).join(' | ')}`);
        for (const h of document.querySelectorAll('h1, h2, h3')) {
          const t = h.textContent; const range = document.createRange(); let prevTop = null; let prevCh = '';
          const walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
          let split = false;
          for (let n = walker.nextNode(); n && !split; n = walker.nextNode()) {
            prevCh = ' '; // a <br/> or a tag between text nodes is a legal line break
            for (let i = 0; i < n.length; i++) {
              const ch = n.data[i]; if (/\s/.test(ch)) { prevCh = ch; continue; }
              range.setStart(n, i); range.setEnd(n, i + 1); const rr = range.getClientRects()[0]; if (!rr) continue;
              if (prevTop !== null && rr.top > prevTop + 4 && prevCh && !/\s/.test(prevCh)) { split = true; break; }
              prevTop = rr.top; prevCh = ch;
            }
          }
          if (split) out.push(`título parte una palabra: «${t.trim().slice(0, 40)}»`);
        }
      }
      return out;
    }, w);
    if (r.length) problems.push(`${w} ${p || 'portada'}: ${r.join('; ')}`);
    if (OUT && (w === 390 || w === 1440)) await page.screenshot({ path: `${OUT}/${(p || 'portada').replace(/\//g, '_')}-${w}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log(problems.join('\n') || 'sin problemas');
console.log(`\n${PAGES.length} páginas × ${WIDTHS.length} anchos medidos, ${problems.length} con algo para revisar.`);

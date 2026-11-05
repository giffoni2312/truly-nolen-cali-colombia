// Recipe step 8 (5-nov-2026): collects REAL Unsplash candidates (free licence filter) for Cali's spaces
// (operation, house, commerce, industry). Only candidates: Carlos chooses; nothing is placed on the site.
// Output: respaldos/2026-11-05-candidatas-unsplash/ (jpg 1600 px + candidatas.json with author, page and licence).
// Usage: node tools/candidatas-unsplash.mjs
import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = new URL('../respaldos/2026-11-05-candidatas-unsplash/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const BUSQUEDAS = {
  operacion: ['cali-colombia-street', 'cali-colombia'],
  casa: ['cali-colombia-house', 'colombia-house'],
  comercio: ['cali-colombia-restaurant', 'colombia-bakery', 'colombia-market'],
  industria: ['colombia-warehouse', 'colombia-factory'],
};
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const ctx = await browser.newContext({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36', locale: 'es-CO', viewport: { width: 1400, height: 1000 } });
const out = [];
for (const [espacio, terms] of Object.entries(BUSQUEDAS)) {
  const ids = new Set();
  for (const t of terms) {
    const page = await ctx.newPage();
    await page.goto(`https://unsplash.com/es/s/fotos/${t}?orientation=landscape&license=free`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
    let found = [];
    for (let k = 0; k < 3 && !found.length; k++) {
      await page.waitForTimeout(3500);
      found = await page.evaluate(() => [...document.querySelectorAll('a[href*="/es/fotos/"], a[href*="/photos/"]')].map((a) => a.getAttribute('href')).filter((h) => /\/(es\/fotos|photos)\/[^/]+$/.test(h))).catch(() => []);
    }
    if (!found.length) console.log('sin resultados (o bloqueado):', t, page.url());
    for (const h of found) ids.add(h.split('/').pop());
    await page.close();
  }
  console.log(espacio, ids.size, 'encontradas');
  let n = 0;
  for (const slug of ids) {
    if (n >= 6) break;
    const page = await ctx.newPage();
    await page.goto(`https://unsplash.com/es/fotos/${slug}`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(1200);
    const info = await page.evaluate(() => {
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent); } catch { return null; } }).find((x) => x && (x.contentUrl || x['@type'] === 'ImageObject'));
      const plus = /Unsplash\+/.test(document.body.innerText.slice(0, 4000));
      return ld ? { autor: ld.creator?.name || ld.author?.name, licencia: ld.license, imagen: ld.contentUrl, titulo: ld.name || ld.caption || '', plus } : null;
    });
    await page.close();
    if (!info || !info.imagen || info.plus || !/unsplash\.com\/(license|es\/licencia)/.test(info.licencia || '')) continue;
    const id = info.imagen.match(/photo-[^?]+/)?.[0];
    if (!id) continue;
    const url = `https://images.unsplash.com/${id}?w=1600&q=85&fm=jpg`;
    const r = await ctx.request.get(url);
    if (r.status() !== 200) continue;
    const file = `cali-${espacio}-${slug.split('-').pop()}.jpg`;
    writeFileSync(new URL(file, OUT), await r.body());
    out.push({ espacio, archivo: file, autor: info.autor, pagina: `https://unsplash.com/es/fotos/${slug}`, licencia: info.licencia, descripcion: info.titulo });
    n++;
  }
}
await browser.close();
writeFileSync(new URL('candidatas.json', OUT), JSON.stringify(out, null, 2));
console.log(out.length, 'candidatas guardadas');

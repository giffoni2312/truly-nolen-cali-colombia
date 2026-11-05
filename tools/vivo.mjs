// Live check after publishing (GitHub Pages): every Cali page answers 200, its title is Cali's, no console errors,
// no broken images and no internal link answering 404. Usage: node tools/vivo.mjs
import { chromium } from 'playwright-core';

const BASE = 'https://giffoni2312.github.io/truly-nolen-cali-colombia/oficinas/cali/';
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const queue = [BASE], seen = new Set(), status = new Map(), errors = [];
while (queue.length) {
  const url = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);
  const page = await ctx.newPage();
  const consola = [];
  page.on('console', (m) => { if (m.type() === 'error') consola.push(m.text()); });
  page.on('pageerror', (e) => consola.push(String(e)));
  const r = await page.goto(url, { waitUntil: 'load' }).catch((e) => null);
  if (!r || r.status() !== 200) { errors.push(`${url} → ${r ? r.status() : 'sin respuesta'}`); await page.close(); continue; }
  for (let y = 0; y < 30000; y += 800) { const done = await page.evaluate((yy) => { scrollTo(0, yy); return yy > document.body.scrollHeight; }, y); await page.waitForTimeout(60); if (done) break; }
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => ({
    title: document.title,
    rotas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')),
    links: [...document.querySelectorAll('a[href]')].map((a) => a.href.split('#')[0]).filter((h) => h.includes('/truly-nolen-cali-colombia/')),
  }));
  if (!/Cali/.test(info.title)) errors.push(`${url}: título sin Cali «${info.title}»`);
  for (const i of info.rotas) errors.push(`${url}: imagen rota ${i}`);
  for (const c of consola) errors.push(`${url}: consola ${c.slice(0, 160)}`);
  for (const l of info.links) {
    if (!status.has(l)) status.set(l, (await ctx.request.get(l)).status());
    if (status.get(l) !== 200) errors.push(`${url}: enlace ${l} → ${status.get(l)}`);
    if (l.startsWith(BASE) && !seen.has(l)) queue.push(l);
  }
  await page.close();
}
await browser.close();
for (const e of [...new Set(errors)]) console.log('ERROR ' + e);
console.log(`${seen.size} páginas en vivo, ${status.size} enlaces, ${new Set(errors).size} error(es)`);
process.exit(errors.length ? 1 : 0);

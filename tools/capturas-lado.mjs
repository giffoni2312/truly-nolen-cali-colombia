// Side-by-side full-page captures, Cali vs the Venezuela reference (recipe R15): capturas/lado-<page>-<width>.png
// Usage: node tools/capturas-lado.mjs [page ...]   (needs node serve.mjs on 8090)
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const CALI = 'http://127.0.0.1:8090/oficinas/cali/';
const VE = 'https://borrador-venezuela.truly-inbound-borrador.pages.dev/oficinas/venezuela/';
const MAP = { 'plagas/cucarachas': 'plagas/cucarachas-y-chiripas', 'plagas/hormigas': 'plagas/hormigas-y-bachacos', 'blog/como-evitar-ratas-en-casa': 'blog/como-eliminar-el-comejen' };
const list = process.argv.slice(2).length ? process.argv.slice(2) : ['', 'servicios/hogares', 'servicios/comercios', 'servicios/industria', 'plagas/zancudos', 'blog'];
const WIDTHS = (process.env.ANCHOS || '1440,390').split(',').map(Number);
const OUT = new URL('../capturas/5nov/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
for (const p of list) for (const w of WIDTHS) {
  const shots = [];
  for (const base of [CALI + (p ? p + '/' : ''), VE + ((MAP[p] ?? p) ? (MAP[p] ?? p) + '/' : '')]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.querySelectorAll('video').forEach((v) => v.pause()));
    for (let y = 0; y < 40000; y += 700) { const done = await page.evaluate((yy) => { scrollTo(0, yy); return yy > document.body.scrollHeight; }, y); await page.waitForTimeout(80); if (done) break; }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(600);
    shots.push(await page.screenshot({ fullPage: true, type: 'jpeg', quality: 55 }));
    await page.close();
  }
  // stitch side by side in a page
  const page = await browser.newPage({ viewport: { width: w * 2 + 20, height: 900 } });
  const b64 = shots.map((s) => 'data:image/jpeg;base64,' + s.toString('base64'));
  await page.setContent(`<body style="margin:0;display:flex;gap:20px;background:#c00;align-items:flex-start"><img src="${b64[0]}" style="width:${w}px"><img src="${b64[1]}" style="width:${w}px"></body>`);
  await page.waitForTimeout(300);
  const name = `lado-${(p || 'portada').replace(/\//g, '-')}-${w}.jpg`;
  await page.screenshot({ path: new URL(name, OUT).pathname.replace(/^\/([A-Z]:)/, '$1'), fullPage: true, type: 'jpeg', quality: 50 });
  await page.close();
  console.log('capturas/5nov/' + name);
}
await browser.close();

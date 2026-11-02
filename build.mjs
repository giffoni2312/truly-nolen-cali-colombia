// Builds the Cali site from the Venezuela reference pages: same shell (head, menu, footer, chat),
// same section markup, Cali content. Output: ./site (serve with `node serve.mjs`).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, PORTADA } from './src/pages.mjs';
import { ID, NAME } from './src/helpers.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REF = join(HERE, 'referencia', 'site');
const OUT = join(HERE, 'site');
const ASSETS_SRC = join(HERE, 'assets');
const ASSETS_OUT = join(OUT, 'oficinas', ID, 'assets');

// 1. Shared design files (CSS, JS, chat, emblem, "world" videos) are copied as they are.
for (const p of ['oficinas', 'machotes', 'landing', 'tn-emblema.png', 'index.html']) rmSync(join(OUT, p), { recursive: true, force: true });
for (const p of ['machotes/assets', 'landing', 'oficinas/assets', 'tn-emblema.png']) {
  cpSync(join(REF, p), join(OUT, p), { recursive: true });
}
rmSync(join(OUT, 'machotes', 'assets', 'index.html'), { force: true });
// Leftover folders from the first mirror attempt are not part of the design.
for (const f of readdirSync(join(OUT, 'machotes', 'assets'))) if (statSync(join(OUT, 'machotes', 'assets', f)).isDirectory()) rmSync(join(OUT, 'machotes', 'assets', f), { recursive: true, force: true });

// 2. Cali images and videos.
mkdirSync(ASSETS_OUT, { recursive: true });
for (const f of readdirSync(ASSETS_SRC)) cpSync(join(ASSETS_SRC, f), join(ASSETS_OUT, f));
// Temporary images (Venezuela copies) only while the Cali one does not exist yet.
const PROV = join(HERE, 'provisionales');
const faltan = existsSync(PROV) ? readdirSync(PROV).filter((f) => !existsSync(join(ASSETS_SRC, f))) : [];
for (const f of faltan) cpSync(join(PROV, f), join(ASSETS_OUT, f));
if (faltan.length) console.log('AVISO: imágenes provisionales (falta la de Cali): ' + faltan.join(', '));
const ver = (f) => {
  const p = join(ASSETS_OUT, f);
  return existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 12) : 'falta';
};

// 3. Shell replacements: everything outside <main> that names Venezuela.
const FOOTER_ALT = 'Torre de Cali y los cerros de Cali, Colombia. Ilustración';
const FOOTER_CAP = 'Cali · Torre de Cali';
function shell(html) {
  return html
    .replace(/\/oficinas\/venezuela\/assets\/venezuela-desktop\.webp\?v=[0-9a-f]+/g, `/oficinas/${ID}/assets/${ID}-desktop.webp?v=${ver(`${ID}-desktop.webp`)}`)
    .replace(/\/oficinas\/venezuela\/assets\/venezuela-desktop\.mp4\?v=[0-9a-f]+/g, `/oficinas/${ID}/assets/${ID}-desktop.mp4?v=${ver(`${ID}-desktop.mp4`)}`)
    .replace(/\/oficinas\/venezuela\/assets\/venezuela-movil\.mp4\?v=[0-9a-f]+/g, `/oficinas/${ID}/assets/${ID}-movil.mp4?v=${ver(`${ID}-movil.mp4`)}`)
    .replaceAll('venezuela-social.jpg', `${ID}-social.jpg`)
    .replaceAll('footer-venezuela.webp', `footer-${ID}.webp`)
    .replaceAll('Camino de la Felicidad, Falcón, Venezuela. Ilustración', FOOTER_ALT)
    .replaceAll('Venezuela · Camino de la Felicidad, Falcón', FOOTER_CAP)
    .replaceAll('Carrito amarillo de Truly Nolen en el Camino de la Felicidad, Venezuela', 'Carrito amarillo de Truly Nolen frente a la Torre de Cali')
    .replaceAll('/oficinas/venezuela/', `/oficinas/${ID}/`)
    .replaceAll('plagas/cucarachas-y-chiripas/', 'plagas/cucarachas/')
    .replaceAll('plagas/hormigas-y-bachacos/', 'plagas/hormigas/')
    .replaceAll('>Cucarachas y chiripas<', '>Cucarachas<')
    .replaceAll('>Hormigas y bachacos<', '>Hormigas<')
    .replaceAll('oficina-venezuela', `oficina-${ID}`)
    .replaceAll('data-machote="venezuela"', `data-machote="${ID}"`)
    .replaceAll('data-oficina="venezuela"', `data-oficina="${ID}"`)
    .replaceAll('es_VE', 'es_CO')
    .replaceAll('"@type": "Country", "name": "Venezuela"', '"@type": "City", "name": "Santiago de Cali"')
    .replaceAll('Venezuela', NAME);
}

function setHead(html, title, desc) {
  const t = title.replace(/&/g, '&amp;');
  const d = desc.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*"/g, `$1${t}"`)
    .replace(/(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*"/g, `$1${d}"`);
}

// 4. Pages.
let count = 0;
for (const [out, page] of Object.entries({ '': PORTADA, ...PAGES })) {
  const refFile = join(REF, 'oficinas', 'venezuela', page.ref, 'index.html');
  const html = readFileSync(refFile, 'utf8');
  const i = html.indexOf('<main');
  const j = html.indexOf('</main>') + '</main>'.length;
  let main = html.slice(i, j);
  if (page.main) {
    main = `<main id="contenido">${page.main}</main>`;
  } else {
    for (const [a, b] of page.replace) {
      if (!main.includes(a)) throw new Error(`[${out || 'portada'}] no encontré el texto a cambiar: ${a.slice(0, 80)}`);
      main = main.replaceAll(a, b);
    }
  }
  let full = shell(html.slice(0, i)) + main + shell(html.slice(j));
  full = shell(full); // the reference main may still carry asset paths
  full = setHead(full, page.title, page.desc);
  const file = join(OUT, 'oficinas', ID, out, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, full);
  count++;
}

// 5. Entry page at the site root that sends to the office.
writeFileSync(join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/oficinas/${ID}/"><title>Truly Nolen ${NAME}</title><a href="/oficinas/${ID}/">Truly Nolen ${NAME}</a>`);
console.log(`Listo: ${count} páginas en site/oficinas/${ID}/`);

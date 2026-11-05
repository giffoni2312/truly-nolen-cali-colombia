// Builds the Cali site from the Venezuela reference pages: same shell (head, menu, footer, chat),
// same section markup, Cali content. Output: ./site (serve with `node serve.mjs`).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, PORTADA } from './src/pages.mjs';
import { ID, NAME } from './src/helpers.mjs';
import { corporativas } from './src/corporativas.mjs';

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

// 2b. Real brand files (TEPS seal, real car), only if they are in ./assets-marca. Never redrawn.
const CORP = corporativas(HERE);
const MARCA = join(HERE, 'assets-marca');
if (existsSync(MARCA)) for (const f of readdirSync(MARCA)) cpSync(join(MARCA, f), join(OUT, 'oficinas', 'assets', f));
if (!CORP.sello || !CORP.carro) console.log('AVISO: faltan archivos de marca en assets-marca/: ' + [!CORP.sello && 'teps-sello.webp', !CORP.carro && 'carro-truly.png'].filter(Boolean).join(', '));

// 3. Shell replacements: everything outside <main> that names Venezuela.
const FOOTER_ALT = 'Torre de Cali y los cerros de Cali, Colombia. Ilustración';
const FOOTER_CAP = 'Cali · Torre de Cali';
export const OFICINA_PIE_OLD = '<p data-preview-office>Cali</p><p>Carrera 25 # 5 Oeste – 167, Barrio Cristales</p><a href="tel:+573167419018" style="white-space:nowrap">+57 316 741 9018</a><a href="/oficinas/cali/#contacto" data-abrir-chat>Escribir a Truly AI</a>';
const RECETA_CSS = readFileSync(new URL('./src/receta.css', import.meta.url), 'utf8');
// Cali has an office (recipe, annex F): address and phone in the footer "Hablemos" column, next to Truly AI.
const OFICINA_HABLEMOS = '<a href="/oficinas/cali/#contacto" data-abrir-chat>Escribir a Truly AI</a><a href="tel:+573167419018" style="white-space:nowrap">+57 316 741 9018</a><span class="pie-oficina">Carrera 25 # 5 Oeste – 167, Barrio Cristales, Cali</span></nav>';
// Search index (recipe R4: the magnifier opens the site search, like globaltni.com). Built from Cali's own pages.
function indiceBusqueda() {
  const cat = (k) => k.startsWith('servicios/') ? 'Servicios' : k.startsWith('plagas/') ? 'Guía de plagas' : k.startsWith('blog/') ? 'Blog' : null;
  const items = Object.entries(PAGES).filter(([k]) => cat(k)).map(([k, p]) => {
    const t = { 'servicios/hogares': 'Hogares', 'servicios/comercios': 'Comercios', 'servicios/industria': 'Industria' }[k] || p.title.split(' | ')[0].replace(/^Guía de /, '').replace(/ en Cali$/, '');
    return [t, k.startsWith('blog/') ? p.desc : '', `/oficinas/${ID}/${k}/`, cat(k)];
  });
  for (const [t, a] of [['Cobertura', 'cobertura'], ['Nosotros', 'nosotros'], ['Preguntas frecuentes', 'preguntas'], ['Contacto', 'contacto']]) items.push([t, '', `/oficinas/${ID}/#${a}`, 'Inicio']);
  return JSON.stringify({ items, textos: { uno: '1 resultado', varios: '{n} resultados', cero: 'Sin resultados. Pruebe con otra palabra.' } });
}
function shell(html) {
  html = html.replace(/<script type="application\/json" id="gt-buscar-indice">[\s\S]*?<\/script>/, () => `<script type="application/json" id="gt-buscar-indice">${indiceBusqueda()}</script>`);
  html = html.replace('<a href="/oficinas/venezuela/#contacto" data-abrir-chat>Escribir a Truly AI</a></nav>', OFICINA_HABLEMOS);
  // Recipe "vuelta 9": the real car replaces the drawn one (figures band, chat, Truly AI box) when the file exists.
  if (CORP.carro) html = html.replaceAll('/oficinas/assets/truly-carrito-asistente.svg', '/oficinas/assets/carro-truly.png');
  html = html.replace('Conoce el servicio para comercios →', 'Conoce el servicio para comercios&nbsp;→');
  // Recipe: one "Conversemos" per page; the footer link becomes "Volver arriba" (shown on the phone only).
  html = html.replace(/<a class="text-link" href="\/oficinas\/(?:venezuela|cali)\/#contacto">Conversemos<\/a><\/div><div class="footer-columns">/g,
    '<a class="text-link footer-top" href="#contenido">Volver arriba ↑</a></div><div class="footer-columns">');
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
    .replaceAll('Venezuela', NAME)
    // Cali has an office (recipe, annex F): its address and phone go in the footer too.
    .replace('<p data-preview-office>Cali</p><a href="/oficinas/cali/#contacto" data-abrir-chat>Escribir a Truly AI</a>', OFICINA_PIE_OLD);
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
  if (false) {
    // (5-nov-2026) The Venezuela reference already carries the master index and corporate sections in its <main>.
    const prog = main.match(/<section id="servicios" class="section g g-programa">[\s\S]*?<\/section>/);
    if (!prog) throw new Error('[portada] no encontré la sección del programa');
    main = main.replace(prog[0], CORP.programa);
    const neg = main.indexOf('<section id="negocio"');
    const fin = main.indexOf('</section>', neg) + '</section>'.length;
    if (neg < 0) throw new Error('[portada] no encontré la sección de comercios');
    main = main.slice(0, fin) + CORP.despuesDeComercial + main.slice(fin);
  }
  let full = shell(html.slice(0, i)) + main + shell(html.slice(j));
  full = full.replace('</head>', '<style>' + RECETA_CSS + '</style></head>');
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

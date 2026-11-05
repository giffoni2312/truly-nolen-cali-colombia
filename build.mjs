// Builds the Cali site from the Venezuela reference pages: same shell (head, menu, footer, chat),
// same section markup, Cali content. Output: ./site (serve with `node serve.mjs`).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, PORTADA } from './src/pages.mjs';
import { ID, NAME } from './src/helpers.mjs';
import { corporativas } from './src/corporativas.mjs';
import { ORTOGRAFIA, corregir } from './src/ortografia.mjs';
const USADOS = new Set();

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
    .replace('<p data-preview-office>Cali</p><a href="/oficinas/cali/#contacto" data-abrir-chat>Escribir a Truly AI</a>', OFICINA_PIE_OLD)
    // The chat context comes from Venezuela, which has no office. Cali has one (verified in investigacion-cali.md):
    // Truly AI must not deny it, and it may share only these published details.
    .replace(/<script id="tia-contexto" type="text\/plain">[\s\S]*?<\/script>/, () => `<script id="tia-contexto" type="text/plain">${CHAT_CONTEXTO}</script>`);
}
const CHAT_CONTEXTO = 'Truly Nolen Cali public website of the local Truly Nolen office in Cali, Colombia. Verified office contact details, the only ones you may share: address Carrera 25 # 5 Oeste – 167, Barrio Cristales, Cali; phone +57 316 741 9018. Never invent other phones, emails, schedules, coverage areas, prices or guarantees. Help visitors describe their pest situation (homes, businesses or industry): what they see, where, since when, type of space, children or pets. Explain the general Truly Nolen approach (listen, evaluate, propose, follow up) and what information helps. For service requests explain that the Cali office will review the request and confirm whether and how it can be attended. My Truly opens the separate VIP portal; Inside Truly opens the internal portal. No access to customer account data. Do not claim the chat stores no data. Language: Colombian Spanish from Cali, warm and professional, always usted, never tú or voseo.';

// Each page's own URL and structured data (revisión 5-nov): two articles were built on the comején article template and
// kept its canonical, og:url, BlogPosting, FAQPage and breadcrumb, so Google would read them as copies of it.
const SITE_URL = `https://trulyinbound.ai/oficinas/${ID}/`;
const sinEtiquetas = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function fixSeo(html, out, page) {
  const url = SITE_URL + (out ? `${out}/` : '');
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`).replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
  const main = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
  const headline = sinEtiquetas(page.title.split(' | ')[0]);
  const img = (main.match(/<img[^>]*src="([^"]+)"/) || [])[1];
  const faq = [...main.matchAll(/<details class="ux-answer"[^>]*><summary><h3>([\s\S]*?)<\/h3><\/summary><article>([\s\S]*?)<\/article><\/details>/g)]
    .map(([, q, a]) => ({ '@type': 'Question', name: sinEtiquetas(q), acceptedAnswer: { '@type': 'Answer', text: sinEtiquetas(a) } }));
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (all, json) => {
    let d; try { d = JSON.parse(json); } catch { return all; }
    if (d['@type'] === 'BlogPosting') {
      Object.assign(d, { headline, description: page.desc, url, mainEntityOfPage: url });
      if (img) d.image = new URL(img, SITE_URL).href;
    } else if (d['@type'] === 'FAQPage') {
      if (!faq.length) return '';
      d.mainEntity = faq;
    } else if (d['@type'] === 'BreadcrumbList' && out && page.ref && page.ref !== out) {
      const last = d.itemListElement[d.itemListElement.length - 1];
      Object.assign(last, { name: headline, item: url });
    } else return all;
    return `<script type="application/ld+json">${JSON.stringify(d)}</script>`;
  });
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
  // Site icon: without it the browser asks for /favicon.ico at the github.io root (404 in the console).
  if (!full.includes('rel="icon"')) full = full.replace('</head>', '<link rel="icon" href="/tn-emblema.png" type="image/png"/></head>');
  full = shell(full); // the reference main may still carry asset paths
  full = setHead(full, page.title, page.desc);
  full = corregir(full, USADOS); // spelling fixes (src/ortografia.mjs)
  full = fixSeo(full, out, page);
  // globaltni's copies (R17) carry exact-width rules for 1440/1024/768/390 that overflowed at 1280, 961 and 360
  // (Venezuela too). Same cap as Bogotá and Uruguay: 0 boxes moved at the measured widths, no side scroll elsewhere.
  if (out === 'servicios/hogares' || out === 'servicios/comercios')
    full = full.replace('</body>', readFileSync(new URL('./src/copia-sin-desborde.html', import.meta.url), 'utf8') + '\n</body>');
  const file = join(OUT, 'oficinas', ID, out, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, full);
  count++;
}

// 5. Entry page at the site root that sends to the office.
writeFileSync(join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/oficinas/${ID}/"><title>Truly Nolen ${NAME}</title><a href="/oficinas/${ID}/">Truly Nolen ${NAME}</a>`);
const sinUso = ORTOGRAFIA.filter(([a]) => !USADOS.has(a)).map(([a]) => a);
if (sinUso.length) console.log("AVISO: correcciones que ya no encuentran su texto: " + sinUso.join(" | "));
console.log(`Listo: ${count} páginas en site/oficinas/${ID}/`);

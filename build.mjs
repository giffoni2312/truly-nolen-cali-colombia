// Builds the Cali site on top of the Argentina reference (Carlos, 3-nov-2026: "igual en todo" to
// https://lucart97.github.io/truly-nolen-argentina/oficinas/argentina/): same head, styles, menu, footer and chat,
// same section markup, Cali content. The car film (hero video) is the Cali one and is not touched.
// Output: ./site (serve with `node serve.mjs`).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, PORTADA } from './src/pages.mjs';
import { ID, NAME, PLAGAS } from './src/helpers.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const AR = join(HERE, 'referencia', 'argentina');
const VE = join(HERE, 'referencia', 'site');
const OUT = join(HERE, 'site');
const ASSETS_SRC = join(HERE, 'assets');
const ASSETS_OUT = join(OUT, 'oficinas', ID, 'assets');
const readAR = (rel) => readFileSync(join(AR, rel), 'utf8').replaceAll('/truly-nolen-argentina', '');

// 1. Shared design files from the Argentina reference (CSS, JS, chat, fonts, emblem, TEPS seal, real car, world videos).
for (const p of ['oficinas', 'machotes', 'landing', 'tn-emblema.png', 'index.html']) rmSync(join(OUT, p), { recursive: true, force: true });
for (const p of ['machotes/assets', 'landing', 'oficinas/assets', 'tn-emblema.png']) cpSync(join(AR, p), join(OUT, p), { recursive: true });
// Text files carry the GitHub Pages prefix of the Argentina repo: remove it (publicar.mjs adds Cali's own).
(function strip(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) strip(p);
    else if (/\.(css|js|html)$/.test(f)) writeFileSync(p, readFileSync(p, 'utf8').replaceAll('/truly-nolen-argentina', ''));
  }
})(OUT);
// The Cali car film keeps its own scripts (not touched until the videos are redone).
for (const f of ['video-movil.js', 'escenas.js']) cpSync(join(VE, 'oficinas', 'assets', f), join(OUT, 'oficinas', 'assets', f));

// 2. Cali images and videos.
mkdirSync(ASSETS_OUT, { recursive: true });
for (const f of readdirSync(ASSETS_SRC)) cpSync(join(ASSETS_SRC, f), join(ASSETS_OUT, f));
const ver = (f) => {
  const p = join(ASSETS_OUT, f);
  return existsSync(p) ? createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 12) : 'falta';
};

// 3. Shell: Argentina head, menu, footer and chat with Cali data.
const TEL = '+57 316 741 9018';
const DIR = 'Carrera 25 # 5 Oeste – 167, Barrio Cristales';
const plagasNav = PLAGAS.map((p) => `<a href="/oficinas/${ID}/plagas/${p.slug}/">${p.nombre}</a>`).join('\n');
const CONTEXTO = `Truly Nolen Cali public website of the local Truly Nolen office in Cali, Colombia. Verified office contact details, the only ones you may share: office: ${DIR}, Cali; phone: ${TEL}. The office publishes no e-mail, no WhatsApp number of its own and no opening hours on this site: never invent them. The WhatsApp +1 520 214 5675 is Truly AI's own channel, not the office's. Never invent other contacts, coverage areas, technicians' availability, prices or guarantees: for those, explain that the office confirms them. Help visitors describe their pest situation (homes, businesses or industry): what they see, where, since when, type of space, children or pets. Explain the general Truly Nolen approach (Three Zone protocol: red interior, yellow perimeter, green exterior; listen, evaluate, propose, follow up) and what information helps. My Truly opens the separate VIP portal; Inside Truly opens the internal portal. No access to customer account data. Do not claim the chat stores no data. Language: Colombian Spanish from Cali, warm and professional, always tú, never usted and never voseo.`;
const TEXTOS = { nombre: 'Truly AI', enLinea: 'En línea ahora', escribiendo: 'Truly AI está escribiendo…', saludo: `¡Hola! Soy Truly AI, de Truly Nolen ${NAME}. Cuéntame qué necesitas proteger y te oriento en el siguiente paso.`, campo: 'Escríbele a Truly AI…', enviar: 'Enviar', abrir: 'Abrir el chat con Truly AI', cerrar: 'Cerrar el chat', nueva: 'Conversación nueva', invita: '¿Hablamos?', invitaSub: 'Truly AI te responde al instante', descartar: 'Descartar invitación', atajos: ['Vi una plaga en mi casa', 'Necesito un servicio para mi empresa', '¿Atienden en mi zona?'], wa: 'Seguir por WhatsApp', caido: 'No pude conectarme. Intenta enviar tu mensaje de nuevo en unos instantes.', trabado: 'No pude conectarme. Intenta enviar tu mensaje de nuevo en unos instantes.', noLeidos: 'Respuesta nueva' };
const LD = JSON.stringify({ '@context': 'https://schema.org', '@type': 'LocalBusiness', name: `Truly Nolen ${NAME}`, url: `https://giffoni2312.github.io/truly-nolen-cali-colombia/oficinas/${ID}/`, logo: 'https://giffoni2312.github.io/truly-nolen-cali-colombia/tn-emblema.png', telephone: TEL, address: { '@type': 'PostalAddress', streetAddress: 'Carrera 25 # 5 Oeste – 167', addressLocality: 'Santiago de Cali', addressRegion: 'Valle del Cauca', addressCountry: 'CO' } });

function must(html, a, b, label) {
  if (!html.includes(a)) throw new Error(`[${label}] no encontré en la plantilla de Argentina: ${a.slice(0, 90)}`);
  return html.split(a).join(b);
}
function shell(html, label) {
  let h = html;
  // Menu and footer pest lists.
  h = h.replace(/(Ver guía de plagas<\/a>\s*)[\s\S]*?(\s*<a href="[^"]*#consulta">No sé qué plaga es<\/a>)/g, `$1${plagasNav}$2`);
  h = h.replace(/(<h2>Guía de plagas<\/h2>\s*)[\s\S]*?(\s*<a href="[^"]*#consulta">Consultar por otra plaga<\/a>)/g, `$1${plagasNav}$2`);
  // Footer: slogan in "tú", Cali office (no e-mail: the office does not publish one), Cali watercolor.
  h = h.split('<p>Su satisfacción<br/>es nuestra meta.</p><a class="text-link" href="/oficinas/argentina/#contacto">Contáctenos</a>').join('<p>Tu satisfacción<br/>es nuestra meta.</p><a class="text-link" href="/oficinas/argentina/#contacto">Contáctanos</a>');
  h = h.replace(/<div class="footer-office">[\s\S]*?<\/div><\/div>/, `<div class="footer-office"><h2>Hablemos</h2><p>${DIR}</p>\n<a href="/oficinas/argentina/#contacto" data-abrir-chat>Escribir en el chat</a>\n<span class="g-tels"><a class="text-link" href="tel:+573167419018">${TEL}</a></span>\n<span class="g-otros"><a class="text-link" href="https://wa.me/15202145675" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></span>\n</div></div>`);
  h = h.replace(/<figure class="footer-place">[\s\S]*?<\/figure>/, `<figure class="footer-place"><img src="/oficinas/argentina/assets/footer-${ID}-gris.webp?v=${ver(`footer-${ID}-gris.webp`)}" alt="Acuarela de la Torre de Cali y los cerros de Cali con el carrito de Truly Nolen" width="1774" height="877" loading="lazy" decoding="async"/><figcaption>Cali · Torre de Cali</figcaption></figure>`);
  // Car film scripts: the Cali ones (video not touched).
  h = h.replace(/<script defer src="\/oficinas\/argentina\/assets\/escenas-ar\.js[^"]*"><\/script>/, label === 'portada' ? `<script defer src="/oficinas/assets/video-movil.js?v=${ver('../../assets/video-movil.js')}"></script>\n<script defer src="/oficinas/assets/escenas.js"></script>` : '');
  // Chat in "tú", with the Cali office context.
  h = h.replace('Truly AI le responde al instante', 'Truly AI te responde al instante').replace('Converse aquí', 'Conversa aquí').replace('Active JavaScript para conversar con Truly AI.', 'Activa JavaScript para conversar con Truly AI.');
  h = h.replace(/<script id="tia-textos" type="application\/json">[\s\S]*?<\/script>/, `<script id="tia-textos" type="application/json">${JSON.stringify(TEXTOS)}</script>`);
  h = h.replace(/<script id="tia-contexto" type="text\/plain">[\s\S]*?<\/script>/, `<script id="tia-contexto" type="text/plain">${CONTEXTO}</script>`);
  h = h.replace('<button type="button" class="tia-atajo">Necesito proteger mi negocio</button>', '<button type="button" class="tia-atajo">Necesito proteger mi negocio</button>');
  // Head metadata.
  h = h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${LD}</script>`);
  h = h.replace(/https:\/\/trulyinbound\.ai\/oficinas\/argentina\/[^"]*/g, `https://giffoni2312.github.io/truly-nolen-cali-colombia/oficinas/${ID}/`);
  h = h.replace(/https:\/\/lucart97\.github\.io\/oficinas\/argentina\/assets\/argentina-social\.jpg/g, `https://giffoni2312.github.io/truly-nolen-cali-colombia/oficinas/${ID}/assets/${ID}-social.jpg`);
  h = h.replace(/<meta property="og:image:alt" content="[^"]*"\/>/, '<meta property="og:image:alt" content="El carro de Truly Nolen con orejas de ratón frente a la Torre de Cali"/>');
  h = h.replaceAll('es_AR', 'es_CO');
  // Everything else that names Argentina in the shell.
  h = h.replaceAll('/oficinas/argentina/', `/oficinas/${ID}/`)
    .replaceAll('data-machote="argentina"', `data-machote="${ID}"`)
    .replaceAll('data-oficina="argentina"', `data-oficina="${ID}"`)
    .replaceAll('oficina-argentina', `oficina-${ID}`)
    .replaceAll('Truly Nolen Argentina', `Truly Nolen ${NAME}`)
    .replaceAll('Truly Nolen · Argentina', `Truly Nolen · ${NAME}`)
    .replaceAll('>Argentina<', `>${NAME}<`);
  return h;
}

function setHead(html, title, desc) {
  const t = title.replace(/&/g, '&amp;');
  const d = desc.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta (?:name|property)="(?:og:|twitter:)?title" content=")[^"]*"/g, `$1${t}"`)
    .replace(/(<meta (?:name|property)="(?:og:|twitter:)?description" content=")[^"]*"/g, `$1${d}"`)
    .replace(/(<meta name="description" content=")[^"]*"/, `$1${d}"`);
}

// Argentina page that gives the shell (head, styles, menu, footer) for each Cali page type.
const AR_SHELL = (out) => {
  if (out === '') return '';
  if (out.startsWith('servicios/')) return out;
  if (out.startsWith('plagas/')) return 'plagas/cucarachas';
  if (out === 'blog') return 'blog';
  if (out.startsWith('blog/')) return 'blog/como-eliminar-las-cucarachas-de-la-cocina';
  return out; // legal pages
};

// The Cali car film (picture + video), taken from the current hero; it is not redone here.
const veHome = readFileSync(join(VE, 'oficinas', 'venezuela', 'index.html'), 'utf8');
const FILM = (veHome.match(/<div class="film">[\s\S]*?<\/div>/) || [])[0]
  .replace(/\/oficinas\/venezuela\/assets\/venezuela-desktop\.webp\?v=[0-9a-f]+/g, `/oficinas/${ID}/assets/${ID}-desktop.webp?v=${ver(`${ID}-desktop.webp`)}`)
  .replace(/\/oficinas\/venezuela\/assets\/venezuela-desktop\.mp4\?v=[0-9a-f]+/g, `/oficinas/${ID}/assets/${ID}-desktop.mp4?v=${ver(`${ID}-desktop.mp4`)}`)
  .replace(/\/oficinas\/venezuela\/assets\/venezuela-movil\.mp4\?v=[0-9a-f]+/g, `/oficinas/${ID}/assets/${ID}-movil.mp4?v=${ver(`${ID}-movil.mp4`)}`);
if (!FILM || /venezuela/.test(FILM)) throw new Error('No pude armar el bloque del video de Cali');

// 4. Pages.
let count = 0;
for (const [out, page] of Object.entries({ '': PORTADA, ...PAGES })) {
  const label = out || 'portada';
  const ref = readAR(join('oficinas', 'argentina', AR_SHELL(out), 'index.html'));
  const i = ref.indexOf('<main');
  const j = ref.indexOf('</main>') + '</main>'.length;
  // Inline styles that Argentina keeps inside <main> (e.g. the "Lo esencial" box of the articles).
  const refMain = ref.slice(i, j);
  const estilos = [...refMain.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map((m) => m[0]).join('');
  let main = out === '' ? page.mainFn(FILM) : `<main id="contenido">${page.main}</main>`;
  if (estilos) main = main.replace('<main id="contenido">', `<main id="contenido">${estilos}`);
  let full = shell(ref.slice(0, i), label) + main + shell(ref.slice(j), label);
  full = setHead(full, page.title, page.desc);
  if (/argentina/i.test(full.replace(/La visión llega a Argentina|>Argentina ↗<|trulynolenargentina\.com\.ar/g, ''))) {
    const k = full.replace(/La visión llega a Argentina|>Argentina ↗<|trulynolenargentina\.com\.ar/g, '').search(/argentina/i);
    throw new Error(`[${label}] quedó «Argentina» en la página: …${full.slice(Math.max(0, k - 80), k + 40)}…`);
  }
  if (!full.includes('Tu satisfacción<br/>es nuestra meta.') || !full.includes('footer-cali-gris.webp')) throw new Error(`[${label}] el pie no quedó con los datos de Cali`);
  const file = join(OUT, 'oficinas', ID, out, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, full);
  count++;
}

// 5. Entry page at the site root that sends to the office.
writeFileSync(join(OUT, 'index.html'), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/oficinas/${ID}/"><title>Truly Nolen ${NAME}</title><a href="/oficinas/${ID}/">Truly Nolen ${NAME}</a>`);
console.log(`Listo: ${count} páginas en site/oficinas/${ID}/ (base: Argentina)`);

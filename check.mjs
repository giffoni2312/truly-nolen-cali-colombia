// Checks the Cali site against the Argentina reference (Carlos, 3-nov-2026: "igual en todo"):
// same components in the same order on every page, same menu and footer skeleton, no Argentina or Venezuela
// leftovers, no broken internal links or files, one h1 per page, "tú" voice, homepage index and corporate sections.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SITE = join(HERE, 'site');
const REF = join(HERE, 'referencia', 'argentina', 'oficinas', 'argentina');
const CALI = join(SITE, 'oficinas', 'cali');
// Cali page -> Argentina page of the same type.
const REF_SLUG = {
  'plagas/zancudos': 'plagas/mosquitos', 'plagas/comejen': 'plagas/termitas', 'plagas/hormigas': 'plagas/palomas',
  'blog/como-acabar-con-los-zancudos-en-casa': 'blog/como-eliminar-las-cucarachas-de-la-cocina',
  'blog/como-eliminar-el-comejen': 'blog/vinchuca-y-chagas',
  'blog/como-evitar-ratas-en-casa': 'blog/desratizacion-en-caba-2026',
  'blog/cucarachas-resistentes-en-cali': 'blog/palomas-en-edificios',
};
const readRef = (rel) => readFileSync(join(REF, rel, 'index.html'), 'utf8').replaceAll('/truly-nolen-argentina', '');

const errors = [];
const warn = [];
const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (f !== 'assets') walk(p); } else if (f === 'index.html') pages.push(p);
  }
})(CALI);

// Allowed mentions of Argentina: the corporate timeline and the link to its office site in the network section.
const PERMITIDO = /La visión llega a Argentina|>Argentina ↗<|www\.trulynolenargentina\.com\.ar/g;
const VETADAS = /argentin|Estomba|plagas\/(mosquitos|termitas|palomas)\/|venezuel|caracas|chiripa|bachaco|\bve-plaga|\bve-blog/i;
const USTED = /\b(usted|ustedes|cuéntenos|escríbale|escríbanos|contáctenos|díganos|elija|conozca|explore|converse|cuéntele|lo prefiere|le responde|le contesta)\b/i;
const VOSEO = /\b(querés|podés|contanos|tenés|sabés)\b/i;

// Component sequence of <main>. More content blocks of the same kind (Cali has more data) count as the same structure.
const sections = (h) => {
  const m = h.slice(h.indexOf('<main'), h.indexOf('</main>'));
  const seq = [...m.matchAll(/<(section|article|aside|nav)[^>]*class="([^"]+)"/g)].map((x) => x[2]).filter((c) => !/^(blog-card|g-sector)/.test(c));
  return seq.join(' | ')
    .replace(/(wrap s-section s-flow \| s-prose)( \| wrap s-section s-flow \| s-prose)+/g, '$1')
    .replace(/(pest-copy)( \| pest-copy)+/g, '$1')
    .replace(/(species-section \| pest-figure)( \| species-section \| pest-figure)+/g, '$1');
};
// Menu and footer skeleton: tags and classes only (texts and links are each office's).
const skel = (s) => s.replace(/<a [^>]*href="mailto:[^"]*"[^>]*>[\s\S]*?<\/a>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/>[^<]*</g, '><').replace(/\s(href|src|alt|width|height|aria-label|data-[a-z-]+|loading|decoding)="[^"]*"/g, '').replace(/(<a>(<\/a>)?)+/g, '<a>');
const shellParts = (h) => ({
  nav: skel((h.match(/<header class="site-nav">[\s\S]*?<\/header>/) || [''])[0]),
  foot: skel((h.match(/<footer[\s\S]*?<\/footer>/) || [''])[0]),
});

for (const file of pages) {
  const rel = relative(CALI, file).replace(/\\/g, '/').replace(/\/?index\.html$/, '');
  const h = readFileSync(file, 'utf8');
  const label = rel || 'portada';
  const visible = h.replace(/<script(?! id="tia-textos)[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(PERMITIDO, '');

  const hit = visible.match(VETADAS);
  if (hit) errors.push(`${label}: resto de otro país «${hit[0]}» → …${visible.slice(Math.max(0, hit.index - 60), hit.index + 40).replace(/\s+/g, ' ')}…`);
  const text = visible.replace(/<[^>]+>/g, ' ');
  const hitTxt = text.match(/palomas?\b|obelisco|\bCABA\b|Buenos Aires/i); // "termitas" is fine: UC IPM quotes use it
  if (hitTxt && !hit) errors.push(`${label}: resto de otro país en el texto «${hitTxt[0]}»`);
  const u = text.match(USTED);
  if (u) errors.push(`${label}: trato de usted «${u[0]}» (Cali va en tú)`);
  const vo = text.match(VOSEO);
  if (vo) errors.push(`${label}: voseo «${vo[0]}»`);
  if (/NO local office|Calin Spanish/.test(h)) errors.push(`${label}: el chat dice que Cali no tiene oficina`);

  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${label}: tiene ${h1} h1`);

  for (const [, url] of h.matchAll(/(?:href|src|poster|data-src|data-src-movil|srcset)="(\/[^"#\s]*)/g)) {
    const path = url.split('?')[0];
    let target = join(SITE, decodeURIComponent(path));
    if (path.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target)) errors.push(`${label}: enlace o archivo roto ${url}`);
  }
  for (const id of new Set([...h.matchAll(/(?<!\[)href="#([^"]+)"/g)].map((x) => x[1]))) {
    if (!h.includes(`id="${id}"`)) errors.push(`${label}: ancla #${id} sin destino`);
  }

  const refRel = REF_SLUG[rel] || rel;
  if (!existsSync(join(REF, refRel, 'index.html'))) { errors.push(`${label}: no tiene página equivalente en Argentina`); continue; }
  const r = readRef(refRel);
  if (sections(r) !== sections(h)) errors.push(`${label}: la estructura no es igual a Argentina\n     ARGENTINA: ${sections(r)}\n     CALI:      ${sections(h)}`);
  const a = shellParts(r), b = shellParts(h);
  if (a.nav !== b.nav) errors.push(`${label}: el menú no tiene la misma estructura que Argentina`);
  if (a.foot !== b.foot) errors.push(`${label}: el pie no tiene la misma estructura que Argentina`);
  const styles = (s) => (s.match(/<style[^>]*>/g) || []).length;
  if (styles(r) !== styles(h)) errors.push(`${label}: bloques de estilo AR=${styles(r)} CALI=${styles(h)}`);

  if (label === 'portada') {
    const cards = [...(h.match(/class="service-index">([\s\S]*?)<\/div><\/section>/) || ['', ''])[1].matchAll(/<strong>([^<]+)<\/strong>/g)].map((x) => x[1]).join(',');
    if (cards !== 'TEPS,Comercial,Residencial,Sanitización') errors.push(`portada: el índice no tiene las 4 tarjetas del master en orden (tiene: ${cards})`);
    if (/id="franquicias"|class="franchise/.test(h)) errors.push('portada: tiene la sección de franquicias (una oficina no la lleva)');
    for (const f of ['teps-sello.webp', 'carro-truly.png']) if (!h.includes(`/oficinas/assets/${f}`)) errors.push(`portada: falta ${f}`);
  }
  if (h.includes('truly-carrito-asistente.svg')) errors.push(`${label}: usa el carrito dibujado (la receta pide el carro real)`);
}

// Every Argentina page type has its Cali twin.
for (const r of [...new Set(Object.values(REF_SLUG))]) if (!Object.entries(REF_SLUG).some(([c, v]) => v === r && existsSync(join(CALI, c, 'index.html')))) errors.push(`falta la página de Cali equivalente a ${r}`);

console.log(`Páginas revisadas: ${pages.length}`);
for (const w of warn) console.log('AVISO  ' + w);
for (const e of errors) console.log('ERROR  ' + e);
console.log(errors.length ? `\n${errors.length} error(es)` : '\nSin errores');
process.exit(errors.length ? 1 : 0);

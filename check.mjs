// Checks the Cali site against the Venezuela reference: same section order, same buttons and menu,
// no Venezuela leftovers, no broken internal links or missing files, one h1 per page, "tú" voice.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SITE = join(HERE, 'site');
const REF = join(HERE, 'referencia', 'site', 'oficinas', 'venezuela');
const CALI = join(SITE, 'oficinas', 'cali');
const REF_SLUG = { 'plagas/cucarachas': 'plagas/cucarachas-y-chiripas', 'plagas/hormigas': 'plagas/hormigas-y-bachacos' };

const errors = [];
const warn = [];
const pages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html') pages.push(p);
  }
})(CALI);

const VETADAS = /venezuel|caracas|falc[oó]n|la guaira|chiripa|bachaco|bodeg[oó]n|abastos|\bquinta\b|tobos?\b|pipotes?|materos?\b|galp[oó]n|\bve-plaga|\bve-blog|coro\b|zulia|camino de la felicidad/i;
const USTED = /\b(usted|cuéntenos|escríbale|indique|contáctenos)\b/i;
const VOSEO = /\b(querés|podés|contanos|tenés|sabés)\b/i;

const sections = (h) => {
  const m = h.slice(h.indexOf('<main'), h.indexOf('</main>'));
  return [...m.matchAll(/<(section|article)[^>]*class="([^"]+)"/g)].map((x) => x[2]).join(' | ').replace(/(\| blog-card)(?: \| blog-card)+/g, '$1'); // a longer post list is the same structure
};
const shellParts = (h) => {
  const nav = (h.match(/<header class="site-nav">[\s\S]*?<\/header>/) || [''])[0];
  const foot = (h.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  const strip = (s) => s.replace(/<[^>]+>/g, '|').replace(/\|+/g, '|');
  return { nav: strip(nav), foot: strip(foot).replace(/\|(Venezuela|Cali) · [^|]*\|/g, '|LUGAR|') };
};

for (const file of pages) {
  const rel = relative(CALI, file).replace(/\\/g, '/').replace(/\/?index\.html$/, '');
  const h = readFileSync(file, 'utf8');
  const visible = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const label = rel || 'portada';

  // Venezuela leftovers (visible text, attributes and paths).
  const hit = visible.match(VETADAS);
  if (hit) errors.push(`${label}: resto de Venezuela «${hit[0]}» → …${visible.slice(Math.max(0, hit.index - 60), hit.index + 40).replace(/\s+/g, ' ')}…`);
  const text = visible.replace(/<[^>]+>/g, ' ');
  const u = text.match(USTED);
  if (u) errors.push(`${label}: trato de usted «${u[0]}» (el sitio va en tú, como Venezuela)`);
  const vo = text.match(VOSEO);
  if (vo) errors.push(`${label}: voseo «${vo[0]}»`);

  // One h1.
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${label}: tiene ${h1} h1`);

  // Internal links and files.
  for (const [, url] of h.matchAll(/(?:href|src|poster|data-src|data-src-movil)="(\/[^"#]*)/g)) {
    const path = url.split('?')[0];
    let target = join(SITE, decodeURIComponent(path));
    if (path.endsWith('/')) target = join(target, 'index.html');
    if (!existsSync(target)) errors.push(`${label}: enlace o archivo roto ${url}`);
  }
  const refH = existsSync(join(REF, REF_SLUG[rel] || rel, 'index.html')) ? readFileSync(join(REF, REF_SLUG[rel] || rel, 'index.html'), 'utf8') : '';
  for (const id of new Set([...h.matchAll(/(?<!\[)href="#([^"]+)"/g)].map((x) => x[1]))) {
    if (h.includes(`id="${id}"`)) continue;
    if (refH && !refH.includes(`id="${id}"`)) warn.push(`${label}: ancla #${id} sin destino (igual que en Venezuela)`);
    else errors.push(`${label}: ancla #${id} sin destino`);
  }

  // Same structure as Venezuela.
  const refRel = REF_SLUG[rel] || rel;
  const blogMap = rel.startsWith('blog/') && rel !== 'blog';
  const refFile = join(REF, refRel, 'index.html');
  if (existsSync(refFile)) {
    const r = readFileSync(refFile, 'utf8');
    // Recipe "vuelta 8/9": the homepage adds sanitization -> TEPS -> network -> history after the commercial section
    // (master globaltni.com/es, without the franchise section). Venezuela does not have them yet.
    const esperado = label === 'portada' ? sections(r).replace('section g g-comercial |', 'section g g-comercial | section g g-sanit | section g g-teps | section g g-red | section g g-historia |') : sections(r);
    if (label === 'portada') {
      if (/franquicia|franchise/i.test(h.slice(h.indexOf('<main'), h.indexOf('</main>')))) errors.push('portada: tiene la sección de franquicias (una oficina no la lleva)');
      const cards = [...(h.match(/g-prog-4">([\s\S]*?)<\/div><\/section>/) || ['', ''])[1].matchAll(/<h3>([^<]+)<\/h3>/g)].map((x) => x[1]).join(',');
      if (cards !== 'TEPS,Comercial,Residencial,Sanitización') errors.push(`portada: el índice no tiene las 4 tarjetas del master en orden (tiene: ${cards})`);
    }
    if (esperado !== sections(h)) errors.push(`${label}: el orden de secciones no es igual a Venezuela\n     ESPERADO: ${esperado}\n     CALI: ${sections(h)}`);
    const a = shellParts(r), b = shellParts(h);
    const norm = (s) => s.replace(/Venezuela/g, 'X').replace(/Cali/g, 'X').replace(/Cucarachas y chiripas/g, 'Cucarachas').replace(/Hormigas y bachacos/g, 'Hormigas').replace(/\|Carrera 25 # 5 Oeste – 167, Barrio Cristales\|\+57 316 741 9018/, ''); // the Cali office line is intentional (Venezuela has no office)
    if (norm(a.nav) !== norm(b.nav)) errors.push(`${label}: el menú no es igual a Venezuela`);
    if (norm(a.foot) !== norm(b.foot)) errors.push(`${label}: el pie no es igual a Venezuela`);
    const btn = (s) => (s.match(/class="(button|text-link|g-link|g-mas|service-action)[^"]*"/g) || []).length;
    if (btn(r) !== btn(h)) warn.push(`${label}: botones VE=${btn(r)} CALI=${btn(h)}`);
  } else if (!blogMap) {
    errors.push(`${label}: no tiene página equivalente en Venezuela`);
  }
}

// Every Venezuela page has its Cali twin.
const refPages = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (f !== 'assets') walk(p); } else if (f === 'index.html') refPages.push(relative(REF, d).replace(/\\/g, '/'));
  }
})(REF);
const inv = Object.fromEntries(Object.entries(REF_SLUG).map(([k, v]) => [v, k]));
for (const r of refPages) {
  const c = inv[r] || r;
  if (!existsSync(join(CALI, c, 'index.html'))) errors.push(`falta la página de Cali equivalente a ${r || 'portada'}`);
}

console.log(`Páginas revisadas: ${pages.length} (Venezuela: ${refPages.length})`);
for (const w of warn) console.log('AVISO  ' + w);
for (const e of errors) console.log('ERROR  ' + e);
console.log(errors.length ? `\n${errors.length} error(es)` : '\nSin errores');
process.exit(errors.length ? 1 : 0);

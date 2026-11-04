// Recipe step 12 (voice): joins all visible <main> text of the Cali pages into one corpus for the AI-tell meter
// and the independent voice judge. Usage: node tools/corpus-voz.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'site/oficinas/cali';
const OUT = 'receta/oficinas/cali/voz-humana';
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name === 'index.html' ? [join(d, e.name)] : []));

let out = '# Corpus de Truly Nolen Cali (texto visible de <main>, sin listas de fuentes)\n';
for (const f of walk(ROOT).sort()) {
  const h = readFileSync(f, 'utf8');
  let m = h.slice(h.indexOf('<main'), h.indexOf('</main>'));
  m = m.replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, ' ').replace(/<section[^>]*s-fuentes[\s\S]*?<\/section>/g, ' ');
  m = m.replace(/<\/(p|li|h1|h2|h3|summary|figcaption|div)>/g, '\n').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/[ \t]+/g, ' ')
    .split('\n').map((s) => s.trim()).filter((s) => s.length > 2).join('\n');
  const page = f.split(/[\\/]/).slice(3, -1).join('/') || 'portada';
  out += `\n\n## ${page}\n\n${m}`;
}
mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'corpus.md'), out);
console.log('palabras', out.split(/\s+/).length);

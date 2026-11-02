// Copies ./site to ./docs for GitHub Pages, prefixing absolute paths with the repo name
// (Pages serves the project under /truly-nolen-cali-colombia/).
import { cpSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SRC = join(HERE, 'site');
const OUT = join(HERE, 'docs');
const BASE = '/truly-nolen-cali-colombia';

rmSync(OUT, { recursive: true, force: true });
cpSync(SRC, OUT, { recursive: true });
// Helper pages used only to move images into Gemini are not published.
for (const f of ['galeria/enviar.html', 'galeria/ver.html', 'galeria/carro-base.png']) rmSync(join(OUT, f), { force: true });

let n = 0;
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(html|css)$/.test(f)) continue;
    let s = readFileSync(p, 'utf8');
    const before = s;
    s = s
      .replace(/((?:href|src|poster|data-src|data-src-movil|data-[a-z-]+|srcset|content|action)=")\/(?!\/)/g, `$1${BASE}/`)
      .replace(/(srcset="[^"]*?,\s*)\/(?!\/)/g, `$1${BASE}/`)
      .replace(/url\(\s*(["']?)\/(?!\/)/g, `url($1${BASE}/`)
      .replace(/url=\//g, `url=${BASE}/`);
    if (s !== before) { writeFileSync(p, s); n++; }
  }
})(OUT);
writeFileSync(join(OUT, '.nojekyll'), '');
console.log(`docs/ listo: ${n} archivos con rutas ajustadas a ${BASE}/`);

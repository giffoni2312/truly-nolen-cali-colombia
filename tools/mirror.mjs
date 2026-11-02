// Mirrors the Venezuela reference site into ./referencia/site so it can be used as a template.
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const BASE = 'https://borrador-venezuela.truly-inbound-borrador.pages.dev';
const OUT = new URL('../referencia/site/', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const ALLOWED = [/^\/oficinas\/venezuela\//, /^\/oficinas\/assets\//, /^\/machotes\/assets\//, /^\/landing\//, /^\/tn-emblema\.png$/];

const queue = ['/oficinas/venezuela/'];
const seen = new Set();

function localPath(p) {
  const clean = p.split('?')[0].split('#')[0];
  return join(OUT, clean.endsWith('/') ? clean + 'index.html' : clean);
}

function extractRefs(text, from) {
  const refs = new Set();
  const patterns = [/(?:href|src|poster|data-src)="([^"]+)"/g, /url\(["']?([^"')]+)["']?\)/g, /["'](\/(?:oficinas|machotes|landing)\/[^"'\s]+)["']/g, /srcset="([^"]+)"/g];
  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      for (const part of m[1].split(',')) {
        const u = part.trim().split(/\s+/)[0];
        if (!u || u.length > 300 || u.startsWith('data:') || u.startsWith('mailto:') || u.startsWith('tel:')) continue;
        try {
          const abs = new URL(u, BASE + from);
          if (abs.origin === BASE) refs.add(abs.pathname + abs.search);
        } catch {}
      }
    }
  }
  return refs;
}

while (queue.length) {
  const p = queue.shift();
  const key = p.split('#')[0];
  if (seen.has(key)) continue;
  seen.add(key);
  const path = key.split('?')[0];
  if (!ALLOWED.some((re) => re.test(path))) continue;
  const cached = localPath(key);
  if (existsSync(cached) && /.(mp4|webp|png|jpg|woff2?)$/.test(path)) { console.log('cache', key); continue; }
  const res = await fetch(BASE + key);
  if (!res.ok) { console.log('FAIL', res.status, key); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const file = localPath(key);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, buf);
  const type = res.headers.get('content-type') || '';
  if (/html|css|javascript|json|svg/.test(type)) {
    for (const r of extractRefs(buf.toString('utf8'), path)) queue.push(r);
  }
  console.log('ok', buf.length, key);
}
console.log('total', seen.size);

// Recipe R3 (5-nov-2026): always "usted". Lists every "tú"/voseo form left in the visible text of the built site.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../site/oficinas/cali/', import.meta.url));
const TU = /(?<![\p{L}])(tú|tu|tus|te|ti|contigo|puedes|necesitas|quieres|tienes|sabes|vives|vendes|abres|cierras|manipulas|notas|recibes|encuentras|haces|ves|has|escríbele|escríbenos|cuéntanos|cuéntame|cuéntasela|avísanos|pídele|pregúntale|indícanos|revisa|tapa|lava|bota|guarda|sella|sacude|mira|busca|haz|pon|deja|mantén|cierra|limpia|evita|recoge|vacía|cambia|saca|tenlo|ten|usa|úsalo|elige|describe|comparte|indica|conoce|reconoce|entiende|explora|consulta|llama|escribe|agenda|aprende|lee|descubre|encuentra|compartas|vuelvas|querés|podés|contanos|tenés|sabés|para ti)(?![\p{L}])/giu;
// Third-person uses of the same words ("se guarda", "la autoridad revisa", "sin tapa", "Si encuentra" de usted).
const TERCERA = /([Ss]e (guarda|usa|encuentra)|(?:^|\s)[Ss]e (?:guarda|usa|encuentra)|autoridad revisa|equipo revisa|(sin|con) tapa|su consulta|Si encuentra|Lo que deja|control cambia|los describe)/i;
const out = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (f !== 'assets') walk(p); continue; }
    if (f !== 'index.html') continue;
    const h = readFileSync(p, 'utf8');
    const text = h
      .replace(/<script(?![^>]*gt-buscar-indice)[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<section[^>]*s-fuentes[\s\S]*?<\/section>/g, ' ') // source titles are quoted as published
      .replace(/<[^>]+?(?:alt|aria-label|placeholder|title|content)="([^"]*)"[^>]*>/g, ' $1 ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ');
    const page = relative(ROOT, d).split('\\').join('/') || 'portada';
    for (const m of text.matchAll(TU)) if (!TERCERA.test(text.slice(Math.max(0, m.index - 14), m.index + m[0].length + 12))) out.push(`${page}: «${m[0]}» …${text.slice(Math.max(0, m.index - 50), m.index + 40)}…`);
  }
})(ROOT);
for (const l of out) console.log(l);
console.log(out.length + ' forma(s) de tú');
process.exit(out.length ? 1 : 0);

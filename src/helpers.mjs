// Page builders that reproduce the markup (classes and order) of the Venezuela reference pages,
// which follow the globaltni.com master: prose sections, no tables in services, pests or articles.
import { cierreCompleto } from './portada.mjs';
export const ID = 'cali';
export const NAME = 'Cali';
export const ROOT = `/oficinas/${ID}/`;
export const WA = 'https://wa.me/15202145675';
export const A = (file) => `${ROOT}assets/${file}`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const plain = (h) => String(h).replace(/<br\s*\/?>/g, ' ').replace(/\s+/g, ' ').trim();
const strip = (h) => plain(h).replace(/<[^>]+>/g, '');

// The 6 pests, in the same order as the reference site.
export const PLAGAS = [
  { slug: 'zancudos', nombre: 'Zancudos', sub: 'Guía de zancudos', img: 'cali-plaga-zancudo-foto.webp' },
  { slug: 'ratas-y-ratones', nombre: 'Ratas y ratones', sub: 'Guía de roedores', img: 'cali-plaga-rata-truly.webp' },
  { slug: 'cucarachas', nombre: 'Cucarachas', sub: 'Guía de cucarachas', img: 'cali-plaga-cucaracha-americana-foto.webp' },
  { slug: 'hormigas', nombre: 'Hormigas', sub: 'Guía de hormigas', img: 'cali-plaga-hormiga-foto.webp' },
  { slug: 'comejen', nombre: 'Comején', sub: 'Guía de comején', img: 'cali-plaga-comejen-foto.webp' },
  { slug: 'alacranes', nombre: 'Alacranes', sub: 'Guía de alacranes', img: 'cali-plaga-alacran-foto.webp' },
];
const SERV = { hogares: 'Hogares', comercios: 'Comercios', industria: 'Industria' };

// ---------- Content blocks (data only; each page type renders them its own way) ----------
// rows: [tema, texto, lista?]
export const tabla = ({ h2, rows, intro, nota }) => ({ k: 'tabla', h2, rows, intro, nota });
// items: [cifra, texto, fuente]
export const dato = ({ h2, items }) => ({ k: 'dato', h2, items });
// det: [interior, perímetro, patio] as "a · b · c"
export const zonas = ({ det }) => ({ k: 'zonas', det });
// resumenes: { slug: texto }; cuales: subset of slugs
export const plagasGrid = ({ h2, resumenes, nota, cuales }) => ({ k: 'plagas', h2, resumenes, nota, cuales });

const rowsHtml = (rows) =>
  rows
    .map(([t, p, lista]) => `<p><strong>${t}.</strong> ${p}</p>${lista ? `<ul>${lista.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}`)
    .join('');
const datoHtml = (items) => items.map(([b, p, s]) => `<p><strong>${b}</strong> ${p} <small class="s-fuente">${s}</small></p>`).join('');
const enlaces = (items) => `<ul class="s-enlaces">${items.map(([href, t]) => `<li><a href="${href}">${t}</a></li>`).join('')}</ul>`;
const pestLinks = (slugs) => enlaces(PLAGAS.filter((p) => slugs.includes(p.slug)).map((p) => [`${ROOT}plagas/${p.slug}/`, p.nombre]));
const servLinks = (keys) => enlaces(keys.map((k) => [`${ROOT}servicios/${k}/`, SERV[k]]));

// ---------- Shared sections ----------
export const FAQ_GENERAL = [
  ['¿Cómo comienza el servicio?', 'El equipo revisa tu consulta, confirma si podemos atenderte y coordina la evaluación que corresponda.'],
  ['¿Puedo solicitar atención para mi negocio?', 'Sí. El tipo de actividad, los horarios y las condiciones del espacio ayudan a definir el programa.'],
  ['¿Qué debo preparar antes de la visita?', 'Te indicaremos las medidas que aplican al servicio y las precauciones para personas y mascotas.'],
  ['¿Cómo consulto la cobertura?', 'Indica tu comuna o corregimiento, tu barrio y el tipo de espacio. Te confirmaremos si podemos atenderte y cómo coordinar la atención.'],
  ['¿La evaluación tiene costo?', 'Pregúntale al equipo antes de coordinar la visita. El costo y las condiciones dependen de la ubicación y del servicio que necesites.'],
  ['¿Una visita es suficiente?', 'El equipo define el alcance y el seguimiento después de evaluar tu situación. Las visitas y condiciones se explican en la propuesta.'],
];

const answers = (items) =>
  items.map(([q, a]) => `<details class="ux-answer"><summary><h3>${q}</h3></summary><article><p>${a}</p></article></details>`).join('');

// items: [texto, url]
export const fuentes = (items) =>
  `<section class="wrap s-section s-fuentes"><h2>De dónde sale esta información</h2><p class="s-note">Cada dato de esta página viene de una fuente pública que puedes revisar.</p><ol>${items
    .map(([t, u]) => `<li><a href="${attr(u)}" target="_blank" rel="noopener noreferrer">${t}</a></li>`)
    .join('')}</ol></section>`;

// Closing of internal pages (services, pests, articles, legal).
export const closing = () =>
  `<section id="contacto" class="s-closing"><div class="wrap"><h2>¿Qué necesitas proteger?</h2><p>Cuéntanos qué viste y dónde. Truly AI te contesta aquí o por WhatsApp y te orienta en el siguiente paso.</p><div class="s-closing-actions"><a class="button button-dark" href="#contacto" data-abrir-chat>Escribir en el chat</a><a class="text-link" href="${WA}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a><a class="text-link" href="tel:+573167419018">+57 316 741 9018</a><a class="text-link" href="${ROOT}#consulta">Consultar cobertura →</a></div></div></section>`;

// Closing of the blog index: the full homepage closing, like the Argentina reference.
export const cierreBlog = (comunas) => cierreCompleto(comunas);

const intro = (crumbs, h1, extra = '') =>
  `<section class="wrap s-intro"><nav aria-label="Ruta"><a href="${ROOT}">Inicio</a>${crumbs
    .map((c) => `<span aria-hidden="true">/</span>${Array.isArray(c) ? `<a href="${c[0]}">${c[1]}</a>` : c}`)
    .join('')}</nav><h1>${h1}</h1>${extra}</section>`;

// Three-zone block (homepage and Hogares), same markup as the Argentina reference.
export const zonasSection = (det, conLink = false) =>
  `<section id="residencial" class="section g g-zonas"><div class="g-zonas-grid"><figure class="g-zonas-fig"><img src="${A('cali-casa-zonas.webp')}" alt="Casa moderna en Cali vista desde arriba, con los Farallones al fondo: el interior en rojo, el perímetro en amarillo y el jardín en verde" loading="lazy"/></figure><div><header class="g-cab"><p class="g-ey">Protocolo de las Tres Zonas</p><h2>Cada rincón<br/>cuenta.</h2><p class="g-intro">En cada visita revisamos tres zonas: adentro, el perímetro y el jardín.</p></header><ul class="g-zonas-lista"><li class="g-z-rojo"><h3>Interior</h3><p>${det[0]}</p></li><li class="g-z-amarillo"><h3>Perímetro</h3><p>${det[1]}</p></li><li class="g-z-verde"><h3>Patio y jardín</h3><p>${det[2]}</p></li></ul>${conLink ? `<a class="g-link" href="${ROOT}servicios/hogares/">Conoce el servicio para hogares<span aria-hidden="true">→</span></a>` : ''}</div></div></section>`;

// ---------- Service page ----------
// lead: { h2, text, para, incluye, sigue, nota, img, alt }
export const servicePage = ({ nombre, crumb, lead, bloques, preguntas, fuentesList }) => {
  const flow = (h2, inner) => `<section class="wrap s-section s-flow"><h2>${plain(h2)}</h2><article class="s-prose">${inner}</article></section>`;
  const parts = bloques.map((b) => {
    if (b.k === 'tabla') return flow(b.h2, `${b.intro ? `<p>${b.intro}</p>` : ''}${rowsHtml(b.rows)}${b.nota ? `<p>${b.nota}</p>` : ''}`);
    if (b.k === 'dato') return flow(b.h2, datoHtml(b.items));
    if (b.k === 'zonas') return zonasSection(b.det.map((d) => d.replace(/ · /g, '. ')));
    if (b.k === 'plagas') {
      const sel = PLAGAS.filter((p) => !b.cuales || b.cuales.includes(p.slug));
      if (b.cuales) return flow(b.h2, pestLinks(b.cuales));
      return (
        flow(b.h2, sel.map((p) => `<p><strong>${p.nombre}.</strong> ${b.resumenes[p.slug]}</p>`).join('') + (b.nota ? `<p>${b.nota}</p>` : '')) +
        flow('Conoce cada plaga en su guía.', pestLinks(sel.map((p) => p.slug)))
      );
    }
    if (b.k === 'html') return b.html;
    throw new Error('bloque desconocido ' + b.k);
  });
  return [
    intro(['Servicios', crumb || nombre], nombre),
    `<section class="wrap s-section s-lead-pair"><article class="s-prose"><h2>${plain(lead.h2)}</h2></article><article class="s-prose"><p>${lead.text}</p><p><strong>¿Para quién?</strong> ${lead.para}</p><p><strong>¿Qué incluye?</strong> ${lead.incluye}</p><p><strong>¿Cómo sigue?</strong> ${lead.sigue}</p><p class="s-note">${lead.nota}</p></article><figure class="s-figure"><img src="${A(lead.img)}" alt="${attr(lead.alt)}"/></figure><a class="button s-service-action" href="#contacto" data-abrir-chat>Consultar por este servicio →</a></section>`,
    ...parts,
    fuentes(fuentesList),
    closing(),
  ].join('');
};

// ---------- Pest page ----------
export const pestPage = ({ slug, lead, bloques, serv, fuentesList }) => {
  const p = PLAGAS.find((x) => x.slug === slug);
  const secs = bloques.map((b) => {
    if (b.k === 'tabla') {
      const body = rowsHtml(b.rows); // same as Argentina: <p><strong>Tema.</strong> texto</p>
      return { h2: plain(b.h2), body: `${b.intro ? `<p>${b.intro}</p>` : ''}${body}${b.nota ? `<p>${b.nota}</p>` : ''}` };
    }
    if (b.k === 'dato') return { h2: plain(b.h2), body: datoHtml(b.items) };
    if (b.k === 'especies') return { h2: plain(b.h2), especies: b };
    throw new Error('bloque desconocido ' + b.k);
  });
  secs.push({ h2: plain(serv.h2), body: servLinks(serv.cuales || ['hogares', 'comercios']) });
  const families = PLAGAS.map((x) => `<a href="${ROOT}plagas/${x.slug}/"${x.slug === slug ? ' aria-current="page"' : ''}>${x.nombre}</a>`).join('');
  const index = secs.map((s, i) => `<li><a href="#guia-${i + 1}">${strip(s.h2)}</a></li>`).join('');
  const content = secs.map((s, i) => s.especies
    ? `<section class="pest-copy pest-group" id="guia-${i + 1}"><h2 id="guia-${i + 1}-title">${s.h2}</h2></section>${s.especies.items.map(([n, t, img, alt]) => `<section class="species-section"><div class="species-specimen"><figure class="pest-figure"><img src="${A(img)}" alt="${attr(alt)}" loading="lazy"/></figure></div><div class="species-description"><h3>${n}</h3><p>${t}</p></div></section>`).join('')}${s.especies.nota ? `<section class="pest-copy"><p class="s-note">${s.especies.nota}</p></section>` : ''}`
    : `<section class="pest-copy" id="guia-${i + 1}"><h2 id="guia-${i + 1}-title">${s.h2}</h2>${s.body}</section>`).join('');
  return [
    `<div class="wrap pest-wrap"><nav class="pest-breadcrumb" aria-label="Ruta"><a href="${ROOT}">Inicio</a><span aria-hidden="true">/</span><span>Guía de plagas</span><span aria-hidden="true">/</span><span>${p.nombre}</span></nav>`,
    `<header class="pest-masthead"><div><p class="pest-eyebrow">Guía de plagas</p><h1>${p.nombre}</h1><p class="pest-lead">${lead}</p><div class="pest-hero-actions"><a class="button" href="#contacto" data-abrir-chat>Consultar por esta plaga →</a><a class="text-link" href="#guia-1">Explorar esta guía ↓</a></div></div><figure class="pest-figure pest-hero-figure"><img src="${A(p.img)}" alt="${attr(p.nombre)}"/></figure></header>`,
    `<nav class="pest-families" aria-label="Guía de plagas">${families}</nav>`,
    `<div class="pest-layout"><aside class="pest-sidebar"><details class="pest-index" id="reading-index"><summary>En esta página <span aria-hidden="true">+</span></summary><ol>${index}</ol></details></aside><div class="pest-content">${content}</div></div></div>`,
    fuentes(fuentesList),
    closing(),
  ].join('');
};

// ---------- Blog ----------
export const articlePage = ({ b, fechaISO, fechaTxt, lectura, alt, cuerpo, preguntas, fuentesList, otro, otros = [], esencial = [], crumbBlog }) => {
  let n = 0;
  const heads = [];
  const body = cuerpo.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => {
    n++;
    heads.push(t);
    return `<h2 id="art-${n}">${t}</h2>`;
  });
  return [
    intro([[crumbBlog, 'Blog'], b.tema], b.titulo, `<figure class="s-figure"><img src="${A(b.img)}" alt="${attr(alt)}"/><figcaption>${alt}</figcaption></figure>`),
    `<section class="wrap s-section s-prose"><p class="s-note">Truly Nolen ${NAME} · <time datetime="${fechaISO}">${fechaTxt}</time> · ${lectura} min de lectura</p><p class="s-entrada">${b.resumen}</p></section>`,
    `<nav class="wrap s-index ux-index" aria-label="En este artículo"><details><summary>En este artículo</summary><ul>${heads.map((t, i) => `<li><a href="#art-${i + 1}">${strip(t)}</a></li>`).join('')}</ul></details></nav>`,
    `<section class="wrap s-section s-article"><div class="article-body">${esencial.length ? `<aside class="blog-esencial" aria-label="Lo esencial"><p class="blog-esencial-tit">Lo esencial</p><ul>${esencial.map((x) => `<li>${x}</li>`).join('')}</ul></aside>` : ''}${body}<h2 class="sin-num">Preguntas frecuentes</h2><div class="s-prose">${answers(preguntas)}</div></div></section>`,
    fuentes(fuentesList),
    `<section class="wrap closeout-blog-next"><div><p class="closeout-blog-eyebrow">Seguir leyendo</p><h2>${otro.titulo}</h2><a class="text-link" href="${ROOT}blog/${otro.slug}/">Leer el artículo →</a>${otros.length ? `<ul class="s-enlaces closeout-otros">${otros.map((o) => `<li><a href="${ROOT}blog/${o.slug}/">${o.titulo}</a></li>`).join('')}</ul>` : ''}</div><a class="text-link" href="${ROOT}blog/">Ver todos los artículos →</a></section>`,
    closing(),
  ].join('');
};

// ---------- Legal ----------
export const legalPage = (h1, texto) => [intro([h1], h1), `<section class="wrap s-section s-prose"><p>${texto}</p></section>`, closing()].join('');

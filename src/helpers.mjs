// Page builders that reproduce the markup (classes and order) of the Venezuela reference pages,
// which follow the globaltni.com master: prose sections, no tables in services, pests or articles.
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
  ['¿Cómo comienza el servicio?', 'El equipo revisa su consulta, confirma si podemos atenderle y coordina la evaluación que corresponda.'],
  ['¿Puedo solicitar atención para mi negocio?', 'Sí. El tipo de actividad, los horarios y las condiciones del espacio ayudan a definir el programa.'],
  ['¿Qué debo preparar antes de la visita?', 'Le indicaremos las medidas que aplican al servicio y las precauciones para personas y mascotas.'],
  ['¿Cómo consulto la cobertura?', 'Indique su comuna o corregimiento, su barrio y el tipo de espacio. Le confirmaremos si podemos atenderle y cómo coordinar la atención.'],
  ['¿La evaluación tiene costo?', 'Pregúntele al equipo antes de coordinar la visita. El costo y las condiciones dependen de la ubicación y del servicio que necesite.'],
  ['¿Una visita es suficiente?', 'El equipo define el alcance y el seguimiento después de evaluar su situación. Las visitas y condiciones se explican en la propuesta.'],
];

const answers = (items) =>
  items.map(([q, a], i) => `<details class="ux-answer"${i ? "" : " open"}><summary><h3>${q}</h3></summary><article><p>${a}</p></article></details>`).join('');

// items: [texto, url]
export const fuentes = (items) =>
  `<section class="wrap s-section s-fuentes"><h2>De dónde sale esta información.</h2><p class="s-note">Cada dato de esta página viene de una fuente pública que puede revisar.</p><ol>${items
    .map(([t, u]) => `<li><a href="${attr(u)}" target="_blank" rel="noopener noreferrer">${t}</a></li>`)
    .join('')}</ol></section>`;

// Closing of internal pages (services, pests, articles, legal).
export const closing = () =>
  `<section id="contacto" class="s-closing"><div class="wrap"><h2>Cuéntenos qué necesita proteger.</h2><p>Todo empieza por contarnos qué vio. Escríbale a Truly AI aquí mismo o por WhatsApp: le orienta en el siguiente paso.</p><div class="s-closing-actions"><a class="button button-dark" href="#contacto" data-abrir-chat>Escribir en el chat</a><a class="text-link" href="${WA}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a><a class="text-link" href="${ROOT}#consulta">Consultar cobertura →</a></div></div></section>`;

// Closing of the blog index (same as the reference: channels, no form).
export const cierreBlog = () =>
  `<section id="contacto" class="section local-consult g-cierre"><div><span id="consulta"></span><span id="cobertura"></span><p class="eyebrow">Truly Nolen · ${NAME}</p><h2>Cuéntenos qué necesita proteger.</h2><p>Todo empieza por contarnos qué vio. Escríbale a Truly AI aquí mismo o por WhatsApp: le orienta en el siguiente paso.</p><div class="contact-channels" style="display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px;align-self:end"><a class="button" href="#contacto" data-abrir-chat>Escribir en el chat</a><a class="text-link" href="${WA}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></div></div></section>`;

const intro = (crumbs, h1, extra = '') =>
  `<section class="wrap s-intro"><nav aria-label="Ruta"><a href="${ROOT}">Inicio</a>${crumbs
    .map((c) => `<span aria-hidden="true">/</span>${Array.isArray(c) ? `<a href="${c[0]}">${c[1]}</a>` : c}`)
    .join('')}</nav><h1>${h1}</h1>${extra}</section>`;

// ---------- Service page ----------
// lead: { h2, text, para, incluye, sigue, nota, img, alt }
export const servicePage = ({ nombre, lead, bloques, preguntas, fuentesList }) => {
  const flow = (h2, inner) => `<section class="wrap s-section s-flow"><h2>${plain(h2)}</h2><article class="s-prose">${inner}</article></section>`;
  const parts = bloques.map((b) => {
    if (b.k === 'tabla') return flow(b.h2, `${b.intro ? `<p>${b.intro}</p>` : ''}${rowsHtml(b.rows)}${b.nota ? `<p>${b.nota}</p>` : ''}`);
    if (b.k === 'dato') return flow(b.h2, datoHtml(b.items));
    if (b.k === 'zonas')
      return flow(
        'Cada rincón cuenta.',
        `<p>Su casa tiene tres áreas que se complementan. La inspección define qué hace falta en cada una.</p><p class="s-zona s-zona-rojo"><strong>Interior.</strong> Donde vive y guarda la comida. ${b.det[0]}</p><p class="s-zona s-zona-amarillo"><strong>Perímetro.</strong> Por donde entran. ${b.det[1]}</p><p class="s-zona s-zona-verde"><strong>Patio y áreas verdes.</strong> El entorno que hay que entender. ${b.det[2]}</p>`
      );
    if (b.k === 'plagas') {
      const sel = PLAGAS.filter((p) => !b.cuales || b.cuales.includes(p.slug));
      if (b.cuales) return flow(b.h2, pestLinks(b.cuales));
      return (
        flow(b.h2, sel.map((p) => `<p><strong>${p.nombre}.</strong> ${b.resumenes[p.slug]}</p>`).join('') + (b.nota ? `<p>${b.nota}</p>` : '')) +
        flow('Conozca cada plaga en su guía.', pestLinks(sel.map((p) => p.slug)))
      );
    }
    if (b.k === 'html') return b.html;
    throw new Error('bloque desconocido ' + b.k);
  });
  return [
    intro(['Servicios', nombre], nombre),
    `<section class="wrap s-section s-lead-pair"><article class="s-prose"><h2>${plain(lead.h2)}</h2></article><article class="s-prose"><p>${lead.text}</p><p><strong>¿Para quién?</strong> ${lead.para}</p><p><strong>¿Qué incluye?</strong> ${lead.incluye}</p><p><strong>¿Cómo sigue?</strong> ${lead.sigue}</p><p class="s-note">${lead.nota}</p></article><figure class="s-figure"><img src="${A(lead.img)}" alt="${attr(lead.alt)}"/></figure><a class="button s-service-action" href="#contacto">Conversemos →</a></section>`,
    ...parts,
    `<section class="wrap s-section s-preguntas"><h2>Lo que más nos preguntan.</h2><div class="s-prose">${answers(preguntas)}</div></section>`,
    fuentes(fuentesList),
    closing(),
  ].join('');
};

// ---------- Pest page ----------
export const pestPage = ({ slug, lead, bloques, serv, fuentesList }) => {
  const p = PLAGAS.find((x) => x.slug === slug);
  const secs = bloques.map((b) => {
    if (b.k === 'tabla') {
      const conLista = b.rows.some((r) => r[2]);
      const body = conLista ? rowsHtml(b.rows) : b.rows.map(([t, x]) => `<h3>${t}</h3><p>${x}</p>`).join('');
      return { h2: plain(b.h2), body: `${b.intro ? `<p>${b.intro}</p>` : ''}${body}${b.nota ? `<p>${b.nota}</p>` : ''}` };
    }
    if (b.k === 'dato') return { h2: plain(b.h2), body: datoHtml(b.items) };
    throw new Error('bloque desconocido ' + b.k);
  });
  secs.push({ h2: plain(serv.h2), body: servLinks(serv.cuales || ['hogares', 'comercios']) });
  const families = PLAGAS.map((x) => `<a href="${ROOT}plagas/${x.slug}/"${x.slug === slug ? ' aria-current="page"' : ''}>${x.nombre}</a>`).join('');
  const index = secs.map((s, i) => `<li><a href="#guia-${i + 1}">${strip(s.h2)}</a></li>`).join('');
  const content = secs.map((s, i) => `<section class="pest-copy" id="guia-${i + 1}"><h2 id="guia-${i + 1}-title">${s.h2}</h2>${s.body}</section>`).join('');
  return [
    `<div class="wrap pest-wrap"><nav class="pest-breadcrumb" aria-label="Ruta"><a href="${ROOT}">Inicio</a><span aria-hidden="true">/</span><span>Guía de plagas</span><span aria-hidden="true">/</span><span>${p.nombre}</span></nav>`,
    `<header class="pest-masthead"><div><p class="pest-eyebrow">Guía de plagas</p><h1>${p.nombre}</h1><p class="pest-lead">${lead}</p><div class="pest-hero-actions"><a class="button" href="#contacto">Conversemos →</a><a class="text-link" href="#guia-1">Explorar esta guía ↓</a></div></div><figure class="pest-figure pest-hero-figure"><img src="${A(p.img)}" alt="${attr(p.nombre)}"/></figure></header>`,
    `<nav class="pest-families" aria-label="Guía de plagas">${families}</nav>`,
    `<div class="pest-layout"><aside class="pest-sidebar"><details class="pest-index" id="reading-index"><summary>En esta página <span>−</span></summary><ol>${index}</ol></details></aside><div class="pest-content">${content}</div></div></div>`,
    fuentes(fuentesList),
    closing(),
  ].join('');
};

// ---------- Blog ----------
export const articlePage = ({ b, fechaTxt, lectura, alt, cuerpo, preguntas, fuentesList, otro, crumbBlog }) => {
  let n = 0;
  const heads = [];
  const body = cuerpo.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => {
    n++;
    heads.push(t);
    return `<h2 id="art-${n}">${t}</h2>`;
  });
  return [
    intro([[crumbBlog, 'Blog'], b.tema], b.titulo, `<figure class="s-figure"><img src="${A(b.img)}" alt="${attr(alt)}"/><figcaption>${alt}</figcaption></figure>`),
    `<section class="wrap s-section s-prose"><p class="s-note">Truly Nolen ${NAME} · ${fechaTxt} · ${lectura} min de lectura</p><p class="s-entrada">${b.resumen}</p></section>`,
    `<nav class="wrap s-index ux-index" aria-label="En este artículo"><details><summary>En este artículo</summary><ul>${heads.map((t, i) => `<li><a href="#art-${i + 1}">${strip(t)}</a></li>`).join('')}</ul></details></nav>`,
    `<section class="wrap s-section s-article"><div class="article-body">${body}<h2 class="sin-num">Preguntas frecuentes</h2><div class="s-prose">${answers(preguntas)}</div></div></section>`,
    fuentes(fuentesList),
    `<section class="wrap closeout-blog-next"><div><p class="closeout-blog-eyebrow">Seguir leyendo</p><h2>${otro.titulo}</h2><a class="text-link" href="${ROOT}blog/${otro.slug}/">Leer el artículo →</a></div><a class="text-link" href="${ROOT}blog/">Ver todos los artículos →</a></section>`,
    closing(),
  ].join('');
};

// ---------- Legal ----------
export const legalPage = (h1, texto) => [intro([h1], h1), `<section class="wrap s-section s-prose"><p>${texto}</p></section>`, closing()].join('');

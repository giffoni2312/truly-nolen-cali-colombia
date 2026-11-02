// Section renderers that reproduce the exact markup (classes and order) of the Venezuela reference pages.
export const ID = 'cali';
export const NAME = 'Cali';
export const ROOT = `/oficinas/${ID}/`;
export const WA = 'https://wa.me/15202145675';
export const A = (file) => `${ROOT}assets/${file}`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');

// The 6 pests, in the same order as the reference site.
export const PLAGAS = [
  { slug: 'zancudos', nombre: 'Zancudos', sub: 'Guía de zancudos', img: 'cali-plaga-zancudo-foto.webp' },
  { slug: 'ratas-y-ratones', nombre: 'Ratas y ratones', sub: 'Guía de roedores', img: 'cali-plaga-rata-noruega-foto.webp' },
  { slug: 'cucarachas', nombre: 'Cucarachas', sub: 'Guía de cucarachas', img: 'cali-plaga-cucaracha-americana-foto.webp' },
  { slug: 'hormigas', nombre: 'Hormigas', sub: 'Guía de hormigas', img: 'cali-plaga-hormiga-foto.webp' },
  { slug: 'comejen', nombre: 'Comején', sub: 'Guía de comején', img: 'cali-plaga-comejen-foto.webp' },
  { slug: 'alacranes', nombre: 'Alacranes', sub: 'Guía de alacranes', img: 'cali-plaga-alacran-foto.webp' },
];

export const detailHero = ({ eyebrow, h1, text, img, alt }) =>
  `<section class="section detail-hero"><a class="text-link" href="${ROOT}">← Volver al inicio</a><div class="story"><div><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p>${text}</p><a class="button" href="#contacto">Conversemos</a></div><img src="${A(img)}" alt="${attr(alt)}"/></div></section>`;

// rows: [tema, significa, lista?]
export const tabla = ({ ey, h2, rows, nota }) => {
  const conLista = rows.some((r) => r[2]);
  const head = `<thead><tr><th scope="col" aria-label="Número"></th><th scope="col">Tema</th><th scope="col">Qué significa</th>${conLista ? '<th scope="col">Qué revisamos</th>' : ''}</tr></thead>`;
  const body = rows
    .map((r, i) => {
      const lista = conLista ? `<td data-col="Qué revisamos">${r[2] ? `<ul class="g-lista">${r[2].map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}</td>` : '';
      return `<tr><td class="g-t-n">${String(i + 1).padStart(2, '0')}</td><th scope="row">${r[0]}</th><td data-col="Qué significa">${r[1]}</td>${lista}</tr>`;
    })
    .join('');
  return `<section class="section g g-bloque"><header class="g-cab"><p class="g-ey">${ey}</p><h2>${h2}</h2></header><div class="g-tabla-marco"><table class="g-tabla">${head}<tbody>${body}</tbody></table></div>${nota ? `<p class="g-nota">${nota}</p>` : ''}</section>`;
};

// items: [cifra, texto, fuente]
export const dato = ({ ey, h2, items }) =>
  `<section class="section g g-dato"><header class="g-cab"><p class="g-ey">${ey}</p><h2>${h2}</h2></header><div class="g-dato-fila">${items
    .map(([b, p, s]) => `<article><b>${b}</b><p>${p}</p><small>${s}</small></article>`)
    .join('')}</div></section>`;

export const esperar = ({ ey, h2, cols, nota }) =>
  `<section class="section g g-esperar"><header class="g-cab"><p class="g-ey">${ey}</p><h2>${h2}</h2></header><div class="g-cols g-cols-3">${cols
    .map(([h, p], i) => `<article><span class="g-n">${String(i + 1).padStart(2, '0')}</span><h3>${h}</h3><p>${p}</p></article>`)
    .join('')}</div><p class="g-nota">${nota}</p></section>`;

export const zonas = ({ alt, det }) =>
  `<section class="section g g-zonas"><div class="g-zonas-grid"><figure class="g-zonas-fig"><img src="${A('cali-casa-zonas.webp')}" alt="${attr(alt)}" loading="lazy"/></figure><div><header class="g-cab"><p class="g-ey">Tres zonas para revisar</p><h2>Cada rincón<br/>cuenta.</h2><p class="g-intro">Tu casa tiene tres áreas que se complementan. La inspección define qué hace falta en cada una.</p></header><ul class="g-zonas-lista"><li class="g-z-rojo"><h3>Interior</h3><p>Donde vives y guardas la comida.</p><p class="g-z-det">${det[0]}</p></li><li class="g-z-amarillo"><h3>Perímetro</h3><p>Por donde entran.</p><p class="g-z-det">${det[1]}</p></li><li class="g-z-verde"><h3>Patio y áreas verdes</h3><p>El entorno que hay que entender.</p><p class="g-z-det">${det[2]}</p></li></ul></div></div></section>`;

// resumenes: { slug: texto }
export const plagasGrid = ({ ey, h2, resumenes, nota, cuales }) =>
  `<section class="section g g-plagas"><header class="g-cab"><p class="g-ey">${ey}</p><h2>${h2}</h2></header><div class="g-plagas-grid"${cuales ? '' : ' style="--n:6"'}>${PLAGAS.filter((p) => !cuales || cuales.includes(p.slug)).map(
    (p) =>
      `<article><a class="g-pl-fig" href="${ROOT}plagas/${p.slug}/"><img src="${A(p.img)}" alt="" loading="lazy"/></a><h3>${p.nombre}</h3><p class="g-pl-sub">${p.sub}</p><p>${resumenes[p.slug]}</p><a class="g-mas" href="${ROOT}plagas/${p.slug}/">Ver la guía<span aria-hidden="true">→</span></a></article>`
  ).join('')}</div>${nota ? `<p class="g-plagas-nota">${nota}</p>` : ''}</section>`;

const SERV = {
  hogares: ['01', 'Hogares', 'Para tu casa, tu apartamento o tu finca.', 'cali-casa-cocina.webp'],
  comercios: ['02', 'Comercios', 'Atención a las necesidades de tu equipo y tus clientes.', 'cali-comercio.webp'],
  industria: ['03', 'Industria', 'Un programa que parte de conocer tu operación.', 'cali-industria.webp'],
};
export const services = ({ ey = 'Servicios', h2, cuales = ['hogares', 'comercios'] }) =>
  `<section class="section services"><div class="section-heading"><p class="eyebrow">${ey}</p><h2>${h2}</h2></div><div class="service-grid">${cuales
    .map((k) => {
      const [n, t, p, img] = SERV[k];
      return `<a class="service" href="${ROOT}servicios/${k}/"><img src="${A(img)}" alt="" loading="lazy"/><div><span>${n}</span><h3>${t}</h3><p>${p}</p><span class="service-action">Ver servicio</span></div></a>`;
    })
    .join('')}</div></section>`;

// items: [pregunta, respuesta]
export const faq = ({ ey = 'Preguntas frecuentes', h2 = 'Lo que más nos preguntan.', items, id }) =>
  `<section${id ? ` id="${id}"` : ''} class="section faq"><div><p class="eyebrow">${ey}</p><h2>${h2}</h2></div><div>${items
    .map(([q, a]) => `<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`)
    .join('')}</div></section>`;

export const FAQ_GENERAL = [
  ['¿Cómo comienza el servicio?', 'El equipo revisa tu consulta, confirma si podemos atenderte y coordina la evaluación que corresponda.'],
  ['¿Puedo solicitar atención para mi negocio?', 'Sí. El tipo de actividad, los horarios y las condiciones del espacio ayudan a definir el programa.'],
  ['¿Qué debo preparar antes de la visita?', 'Te indicaremos las medidas que aplican al servicio y las precauciones para personas y mascotas.'],
  ['¿Cómo consulto la cobertura?', 'Indica tu comuna o corregimiento, tu barrio y el tipo de espacio. Te confirmaremos si podemos atenderte y cómo coordinar la atención.'],
  ['¿La evaluación tiene costo?', 'Pregúntale al equipo antes de coordinar la visita. El costo y las condiciones dependen de la ubicación y del servicio que necesites.'],
  ['¿Una visita es suficiente?', 'El equipo define el alcance y el seguimiento después de evaluar tu situación. Las visitas y condiciones se explican en la propuesta.'],
];

// items: [texto, url]
export const fuentes = (items) =>
  `<section class="section detail-sources"><div><p class="eyebrow">Fuentes</p><h2>De dónde sale esta información.</h2><p class="nota">Cada dato de esta página viene de una fuente pública que puedes revisar.</p></div><ol>${items
    .map(([t, u]) => `<li><a href="${attr(u)}" target="_blank" rel="noopener noreferrer">${t}</a></li>`)
    .join('')}</ol></section>`;

// starts: [label, prompt]
export const cierre = (starts) => {
  const entry = starts
    ? `<div class="marco-entry"><div class="marco-entry-heading"><img src="/oficinas/assets/truly-carrito-asistente.svg" alt="" width="72" height="48" loading="lazy"/><div><h3>Truly AI</h3><p>Asistente virtual · ${NAME}</p></div></div><p class="marco-entry-label">¿Por dónde empezamos?</p><div class="marco-starts">${starts
        .map(([l, p]) => `<a href="#contacto" data-abrir-chat data-chat-prompt="${attr(p)}">${l}<span aria-hidden="true">→</span></a>`)
        .join('')}</div><p class="marco-entry-note">Conversa aquí con Truly AI. Si lo prefieres, puedes seguir por WhatsApp.</p></div>`
    : '';
  return `<section id="contacto" class="section local-consult g-cierre"><div><span id="consulta"></span><span id="cobertura"></span><p class="eyebrow">Truly Nolen · ${NAME}</p><h2>Cuéntanos qué necesitas proteger.</h2><p>Todo empieza con contarnos qué viste. Escríbele a Truly AI aquí mismo o por WhatsApp y te orienta en el siguiente paso.</p><div class="contact-channels" style="display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px;align-self:end"><a class="button" href="#contacto" data-abrir-chat>Escribir en el chat</a><a class="text-link" href="${WA}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></div></div>${entry}</section>`;
};

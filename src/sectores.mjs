// globaltni's 4 commercial sectors for Cali (receta 4-nov-2026, paso 6c), with globaltni's own ct-* design:
// yellow "Encuentra tu sector" bar, Salud on black, Venta de alimentos on grey, Logística with the yellow line,
// "Volver a los sectores ↑", "Cada industria merece atención." and "Más formas de proteger tu mundo.".
// Texts from https://globaltni.com/es/services/commercial/ (official Spanish), in Cali's "tú".
// CSS: ct-globaltni.css (rules copied from globaltni with the browser) + ct-ajustes.css (sizes measured on globaltni).
import { readFileSync, existsSync } from 'node:fs';
import { ROOT, A } from './helpers.mjs';

const G = 'https://globaltni.com/es';
const EXT = 'target="_blank" rel="noopener noreferrer"';
const CSS = readFileSync(new URL('./ct-globaltni.css', import.meta.url), 'utf8') + readFileSync(new URL('./ct-ajustes.css', import.meta.url), 'utf8');
const arrow = '<span aria-hidden="true">→</span>';

// Photos per sector: [file in oficinas/cali/assets, caption]. Only files that exist are shown (Carlos chooses them).
const FOTOS = {
  'sector-salud': [['cali-sector-salud.jpg', 'Inspección en una clínica.']],
  'sector-industria': [['cali-sector-industria.jpg', 'Inspección en una planta.']],
  'sector-alimentos': [['cali-sector-alimentos.jpg', 'Inspección en un supermercado.']],
  'sector-logistica': [['cali-sector-logistica.jpg', 'Inspección en un muelle de carga.']],
};
const assetExists = (f) => existsSync(new URL(`../assets/${f}`, import.meta.url));

const SECTORES = [
  {
    id: 'sector-salud', clase: 'ct-healthcare', nombre: 'Salud', h2: 'El cuidado empieza con la prevención.',
    textos: [
      'Quienes dirigen hogares geriátricos, servicios de urgencias y centros de rehabilitación física o mental tienen que mantener la higiene más alta mientras atienden a personas vulnerables.',
      'El Truly Elite Protection System (TEPS) se pensó para instalaciones de salud, donde el servicio va más allá del control: prevenir y reducir el riesgo de plagas y de contaminación química.',
      'Cada servicio se puede auditar y deja la documentación que piden las normas del sector y los protocolos más exigentes.',
    ],
    enlace: [`${G}/services/teps/`, 'Conoce el programa TEPS', true],
    benef: ['Laboratorios de diagnóstico', 'Hospitales y clínicas', 'Hogares geriátricos y de larga estancia', 'Servicios de urgencias', 'Centros de rehabilitación', 'Consultorios médicos', 'Centros de atención y tratamiento de pacientes', 'Bodegas de insumos médicos'],
  },
  {
    id: 'sector-industria', clase: 'ct-industrial', nombre: 'Industrias', h2: 'Protección en cada operación.',
    textos: [
      'En plantas, laboratorios y bodegas, TEPS suma prevención y baja la posibilidad de que aparezcan plagas o contaminación química en la producción.',
      'Es un servicio auditable de principio a fin: los registros quedan listos para lo que exija cada cliente.',
    ],
    enlace: [`${ROOT}servicios/industria/`, 'Mira el servicio para industrias', false],
    benef: ['Plantas de procesamiento de alimentos', 'Almacenamiento y distribución de alimentos', 'Empaque y reempaque de alimentos', 'Proveedores de la industria de alimentos', 'Laboratorios farmacéuticos', 'Catering', 'Hoteles', 'Hospitales', 'Cadenas de comidas rápidas', 'Supermercados', 'Archivo de documentos', 'Otras industrias'],
  },
  {
    id: 'sector-alimentos', clase: 'ct-food-processing', nombre: 'Venta de alimentos', h2: 'Cuidar donde se encuentran personas y alimentos.',
    textos: [
      'Los locales que venden alimentos son de los más exigentes al planear la higiene y el manejo de plagas: tienen que entregar productos seguros en un lugar limpio y sin plagas.',
      'Para supermercados, panaderías y restaurantes, TEPS va más allá de una aplicación puntual y se enfoca en anticiparse a la plaga.',
      'Las visitas quedan registradas y te sirven para una inspección sanitaria o para la auditoría de tu propia cadena.',
    ],
    benef: ['Supermercados', 'Hipermercados', 'Centros de distribución', 'Locales de comidas rápidas', 'Restaurantes', 'Panaderías y pastelerías'],
  },
  {
    id: 'sector-logistica', clase: 'ct-logistics', nombre: 'Logística', h2: 'Los productos viajan. La protección los acompaña.',
    textos: [
      'Para toda empresa que mueve mercancía a diario: si exportas, importas o trasladas productos de un lugar a otro, Truly Nolen International trabaja para que la carga no se contamine con plagas.',
      'En bodegas, terminales y flotas, TEPS pone la prevención antes que la reacción.',
      'Cada intervención deja constancia escrita, con el detalle que piden tus clientes y los estándares del sector.',
    ],
    benef: ['Empresas de transporte', 'Agentes de carga', 'Transportadores', 'Operadores logísticos', 'Parques logísticos', 'Logística de abastecimiento', 'Logística de producto', 'Logística de ventas'],
  },
];

export function sectoresHtml() {
  const nav = SECTORES.map((s) => `<a href="#${s.id}">${s.nombre}<span aria-hidden="true">↓</span></a>`).join('');
  const sector = (s) => {
    const fotos = (FOTOS[s.id] || []).filter(([f]) => assetExists(f));
    const docu = `<div class="ct-documentary">${fotos.map(([f, cap]) => `<figure><img alt="${cap}" loading="lazy" src="${A(f)}"/><figcaption>${cap}</figcaption></figure>`).join('')}</div>`;
    const link = s.enlace ? `<a class="ct-link" href="${s.enlace[0]}"${s.enlace[2] ? ` ${EXT}` : ''}>${s.enlace[1]}${arrow}</a>` : '';
    return `<section aria-labelledby="${s.id}-title" class="ct-sector ${s.clase}" id="${s.id}"><div class="ct-wrap">`
      + `<header class="ct-sector-heading"><p class="ct-kicker">${s.nombre}</p><h2 id="${s.id}-title">${s.h2}</h2></header>`
      + `<div class="ct-sector-layout">${docu}<div class="ct-prose">${s.textos.map((t) => `<p>${t}</p>`).join('')}${link}</div>`
      + `<aside aria-labelledby="${s.id}-title ${s.id}-facilities" class="ct-facilities"><h3 id="${s.id}-facilities">¿Quién se beneficia con este programa?</h3><ul>${s.benef.map((b) => `<li>${b}</li>`).join('')}</ul>`
      + `<a class="ct-link" href="#contacto">Conversemos${arrow}</a></aside></div>`
      + `<a class="ct-back" href="#indice">Volver a los sectores <span aria-hidden="true">↑</span></a></div></section>`;
  };
  const mas = [[`${ROOT}servicios/hogares/`, 'Servicio para hogares', false], [`${G}/services/sanitization/`, 'Sanitización', true], [`${G}/services/teps/`, 'Programa TEPS', true]]
    .map(([h, t, e]) => `<a class="ct-link" href="${h}"${e ? ` ${EXT}` : ''}>${t}${arrow}</a>`).join('');
  return `<style id="ct-globaltni">${CSS}</style><div class="ct-commercial">`
    + `<nav aria-label="Encuentra tu sector" class="ct-sector-nav" id="indice"><div class="ct-wrap"><span>Encuentra tu sector</span><div>${nav}</div></div></nav>`
    + SECTORES.map(sector).join('')
    + `<section class="ct-other ct-wrap" id="otros-sectores"><h2>Cada industria merece atención.</h2><div><p>Si tu actividad no está en estos sectores, no te preocupes: Truly Nolen International también atiende turismo, educación, manufactura, catering y mucho más. Cuéntanos qué haces y te orientamos.</p><a class="ct-link" href="#contacto">Cuéntanos qué haces${arrow}</a></div></section>`
    + `<section class="ct-related ct-wrap"><h2>Más formas de proteger tu mundo.</h2><div>${mas}</div></section>`
    + '</div>';
}

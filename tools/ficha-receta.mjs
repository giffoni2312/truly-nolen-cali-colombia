// Recipe step 9 (Anexo C): writes receta/oficinas/cali.json from the data the site already uses.
// Nothing new is invented: missing items are written down as pending.
import { writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PLAGAS, WA } from '../src/helpers.mjs';

const A = 'site/oficinas/cali/assets';
const sha = (f) => (existsSync(f) ? createHash('sha256').update(readFileSync(f)).digest('hex') : null);
const blog = readdirSync('site/oficinas/cali/blog', { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const ficha = {
  id: 'cali', title: 'Cali', country: 'Colombia', language: 'es', base: 'colombia',
  landmark: 'Torre de Cali', localArea: 'Cali, Valle del Cauca',
  chatIdioma: 'Colombian Spanish with tú (cuéntanos, tienes, puedes), warm and professional; never vos, never usted.',
  tratoVetado: ['usted', 'Usted', 'vos', 'querés', 'tenés', 'contanos', 'Cuéntenos', 'Escríbanos'],
  contacto: {
    oficina: 'Carrera 25 # 5 Oeste – 167, Barrio Cristales, Cali, Colombia, 760043',
    telefono: '+57 316 741 9018', fuente: 'http://globaltni.com/en/offices/',
    whatsappTrulyAI: WA, horario: null,
  },
  pelicula: {
    videoStatus: 'pendiente',
    nota: 'Video actual en 1280x720. Falta el 4K (3840x2160) con color en 3 pasos, el vertical que ruede y los bigotes al 70 %.',
    video: { file: `${A}/cali-desktop.mp4`, sha256: sha(`${A}/cali-desktop.mp4`), width: 1280, height: 720, duration: 10 },
    movil: { file: `${A}/cali-movil.mp4`, sha256: sha(`${A}/cali-movil.mp4`), width: 1280, height: 720 },
    poster: `${A}/cali-desktop.webp`,
  },
  footer: { estado: 'listo', file: `${A}/footer-cali.webp`, sha256: sha(`${A}/footer-cali.webp`) },
  casaZonas: { file: `${A}/cali-casa-zonas.webp` },
  paginas: { servicios: ['hogares', 'comercios', 'industria'], plagas: PLAGAS.map((p) => p.slug) },
  blog: { publicados: blog },
  seo: { url: 'https://giffoni2312.github.io/truly-nolen-cali-colombia/oficinas/cali/', indexar: false, imagen: `${A}/cali-social.jpg` },
  pendientes: ['Candados oficiales (capa-oficinas)', 'Video 4K y vertical', 'Fotos con Midjourney', 'Horario y WhatsApp propios de la oficina (no publicados)'],
};
writeFileSync('receta/oficinas/cali.json', JSON.stringify(ficha, null, 2) + '\n');
console.log('ok cali.json');

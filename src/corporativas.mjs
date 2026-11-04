// Corporate sections of the master (globaltni.com/es) for the Cali homepage, recipe "vuelta 8/9":
// 4-card index (TEPS, Comercial, Residencial, Sanitización) and, after the commercial section,
// sanitization -> TEPS -> international network -> history. No franchise section (an office does not sell franchises).
// Texts come from globaltni.com/es, adapted to "tú". Brand images (TEPS seal, real car) are used only if the
// real files exist in ./assets-marca; they are never redrawn.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const G = 'https://globaltni.com/es';
const EXT = 'target="_blank" rel="noopener noreferrer"';

export function corporativas(root) {
  const sello = existsSync(join(root, 'assets-marca', 'teps-sello.webp'));
  const carro = existsSync(join(root, 'assets-marca', 'carro-truly.png'));

  const ico = (d) => `<span class="g-prog-ico"><svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg></span>`;
  const tepsIco = sello
    ? '<span class="g-prog-ico g-prog-sello"><img src="/oficinas/assets/teps-sello.webp" alt="" width="900" height="900"/></span>'
    : ico('<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>');

  const programa = `<section id="servicios" class="section g g-programa"><header class="g-cab"><p class="g-ey">Truly Nolen · Cali</p><h2>Un programa para tu espacio.</h2><p class="g-intro">De la inspección de una vivienda a los registros de una instalación auditada. Elige el servicio que necesitas conocer.</p></header><div class="g-prog-fila g-prog-4">`
    + `<a class="g-prog g-prog-1" href="#teps">${tepsIco}<small class="g-prog-ey">Monitoreo y control auditado</small><h3>TEPS</h3><p>Estándares globales, seguimiento y reportes.</p><span class="g-flecha" aria-hidden="true">↓</span></a>`
    + `<a class="g-prog" href="#negocio">${ico('<path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15"/><path d="M12 21V11h7a1 1 0 0 1 1 1v9"/><path d="M3 21h18"/><path d="M7 9h2M7 13h2M7 17h2M15 15h2M15 18h2"/>')}<small class="g-prog-ey">Programas según tu sector</small><h3>Comercial</h3><p>Programas según tu sector y tu actividad.</p><span class="g-flecha" aria-hidden="true">↓</span></a>`
    + `<a class="g-prog" href="#hogar">${ico('<path d="M4 11.5 12 4.5l8 7"/><path d="M6 10.5V20h12v-9.5"/><path d="M10 20v-5h4v5"/>')}<small class="g-prog-ey">Tu casa en tres zonas</small><h3>Residencial</h3><p>Inspección y cuidado en tres zonas.</p><span class="g-flecha" aria-hidden="true">↓</span></a>`
    + `<a class="g-prog" href="#sanitizacion">${ico('<rect height="11" rx="2" width="7" x="9" y="10"/><path d="M11 10V6h3"/><path d="M8 5H6M8 7.5H5.5M8 10H6"/>')}<small class="g-prog-ey">Virus, hongos y bacterias</small><h3>Sanitización</h3><p>Control microbiano en interiores.</p><span class="g-flecha" aria-hidden="true">↓</span></a>`
    + `</div></section>`;

  const sanitizacion = `<section id="sanitizacion" class="section g g-sanit"><div class="g-sanit-in"><div><header class="g-cab"><p class="g-ey">Virus, hongos y bacterias</p><h2>Sanitización de ambientes interiores.</h2><p class="g-intro">La sanitización reúne estrategias para prevenir y controlar la contaminación por virus, hongos y bacterias, según el tipo de ambiente interior.</p></header><a class="button g-boton-borde" href="${G}/services/sanitization/" ${EXT}>Conoce el servicio de sanitización <span aria-hidden="true">→</span></a><p class="g-nota-corp">Es un servicio de Truly Nolen International. Escríbele a Truly AI para saber si se presta en tu espacio en Cali.</p></div><aside class="g-sanit-caja"><h3>Un protocolo según el ambiente.</h3><p>Entrevista e identificación del entorno. Selección de producto, aplicación y tiempo de contacto. Medidas de prevención y control para cada instalación.</p></aside></div></section>`;

  const paso = (n, h, s, p) => `<article><span class="g-num">${n}</span><h3>${h}</h3><strong>${s}</strong><p>${p}</p></article>`;
  const prog = (h, p) => `<details><summary>${h}<span aria-hidden="true">+</span></summary><p>${p}</p></details>`;
  const teps = `<section id="teps" class="section g g-teps"><div class="g-teps-top${sello ? ' g-teps-con-sello' : ''}">${sello ? '<img class="g-teps-sello" src="/oficinas/assets/teps-sello.webp" alt="Sello TEPS, Truly Elite Protection System" width="900" height="900"/>' : ''}<header class="g-cab"><p class="g-ey">Truly Elite Protection System</p><h2>TEPS: un programa con seguimiento.</h2></header><div class="g-teps-desc"><p class="g-intro">Inspección, plan de control, registro de cada visita y revisión de tendencias. Un programa de manejo integrado de plagas con trazabilidad y estándares auditados.</p><a class="button" href="${G}/services/teps/" ${EXT}>Explora el sistema TEPS <span aria-hidden="true">→</span></a></div></div>`
    + `<div class="g-cols g-cols-4">`
    + paso('01', 'Inspeccionar', 'Evaluamos la instalación y su entorno', 'Identificamos actividad de plagas, puntos de acceso, condiciones favorables y prácticas operativas para determinar las necesidades del programa.')
    + paso('02', 'Desarrollar el programa', 'Un plan específico para la instalación', 'El entorno, la estacionalidad, la actividad observada, las prácticas de operación y las plagas identificadas determinan el programa.')
    + paso('03', 'Registrar cada visita', 'El trabajo queda documentado', 'Después de cada servicio, el técnico registra las actividades realizadas y los hallazgos identificados en la instalación.')
    + paso('04', 'Revisar las tendencias', 'Informes mensuales y recomendaciones', 'Los datos registrados sobre la actividad de plagas permiten analizar tendencias y dar seguimiento a las acciones.')
    + `</div><div class="g-teps-prog"><p class="g-teps-prog-t">Formación, supervisión y respuesta durante el programa</p>`
    + prog('Capacitación personalizada', 'Formación para clientes y empleados, con el respaldo del equipo técnico internacional.')
    + prog('Centro de formación virtual', 'Capacitación a distancia para profundizar en los conocimientos del programa y sus protocolos.')
    + prog('Supervisión de calidad', 'Informe de auditoría y lista de verificación específica para el tipo de establecimiento, con un indicador de rendimiento.')
    + prog('Educación para el cliente', 'Formación sobre manejo integrado de plagas, biología, ecología, aspectos regulatorios y soporte de auditoría.')
    + prog('Protocolos específicos', 'Programas personalizados para las necesidades de cada cliente, especialmente instalaciones auditadas.')
    + prog('Respuesta y seguimiento', 'Se definen umbrales de acción con la administración. Si se superan, se aplica un protocolo de escalamiento hasta establecer el control.')
    + `</div></section>`;

  const of = (p, u) => `<a href="${u}" ${EXT}>${p} <span aria-hidden="true">↗</span></a>`;
  const red = `<section id="oficinas" class="section g g-red"><div class="g-red-in"><div><header class="g-cab"><p class="g-ey">Directorio internacional</p><h2>Una red internacional.<br/>Atención en tu localidad.</h2><p class="g-intro">En Cali te atiende la oficina de Barrio Cristales. Si estás en otro país, busca tu localidad en el directorio internacional: la oficina de tu zona te ayuda a conocer el servicio y el programa adecuado para tu espacio.</p></header><a class="button" href="${G}/offices/" ${EXT}>Abrir el directorio de oficinas <span aria-hidden="true">→</span></a><a class="text-link g-red-link" href="#contacto">Usa el formulario de contacto <span aria-hidden="true">→</span></a></div>`
    + `<div class="g-red-dir"><h3>Conecta con una oficina local.</h3><p>Accesos a sitios locales del directorio internacional.</p><div class="g-red-reg"><div><h4>Américas</h4>${of('Argentina', 'http://www.trulynolenargentina.com.ar')}${of('Brasil', 'https://www.trulynolen.com.br')}</div><div><h4>Europa</h4>${of('España', 'https://www.trulyespana.com/')}${of('Francia', 'https://www.trulynolen.fr/')}</div><div><h4>Asia</h4>${of('India', 'https://trulynolenindia.com/')}${of('Filipinas', 'https://www.trulynolen.com.ph/')}</div></div><a class="text-link" href="${G}/offices/" ${EXT}>Ver todos los países y contactos <span aria-hidden="true">→</span></a><div class="g-red-num"><div><b>65+</b><span>países</span></div><div><b>300+</b><span>oficinas</span></div><div><b>6</b><span>continentes</span></div></div></div></div></section>`;

  const historia = `<section id="historia" class="section g g-historia"><div class="g-hist-in"><div><header class="g-cab"><p class="g-ey">Más de 80 años de experiencia</p><h2>Prevenir las plagas.<br/>Una idea desde 1938.</h2></header><p class="g-intro">En 1938, Truly Wheatfield Nolen propuso proteger los edificios sellando las entradas de los roedores. La prevención estaba en el origen.</p><p class="g-intro">Hoy, esa visión se expresa en formación, métodos de control y protocolos diseñados para reducir el impacto en el entorno.</p><a class="text-link" href="${G}/company/story/" ${EXT}>Nuestra historia hasta ahora <span aria-hidden="true">→</span></a><a class="text-link" href="${G}/company/team/" ${EXT}>Conoce a nuestro equipo <span aria-hidden="true">→</span></a></div><div class="g-hist-vis">${carro ? `<a class="g-hist-carro" href="${G}/company/story/" ${EXT} aria-label="Explora nuestra historia"><img src="/oficinas/assets/carro-truly.png" alt="El automóvil amarillo con orejas de ratón de Truly Nolen" width="600" height="386" loading="lazy"/></a>` : ''}<div class="g-hist-linea"><div><b>1938</b><p>Una idea centrada en la prevención.</p></div><div><b>1987</b><p>La visión llega a Argentina.</p></div><div><b>1989</b><p>Nace Truly Nolen International.</p></div></div></div></div></section>`;

  const css = `<style id="cali-corporativas">
.g-prog-4{grid-template-columns:repeat(4,1fr)}
.g-prog-ey{display:block;margin:0 44px 10px 0;font-size:13px;font-weight:600;color:#646b65}
.g-prog-sello img{width:100%;height:100%;object-fit:contain}
.g-sanit-in,.g-red-in,.g-hist-in{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
.g-sanit-caja,.g-red-dir{background:#f6f6f3;border:1px solid var(--line);border-radius:6px;padding:32px}
.g-sanit-caja h3,.g-red-dir h3{font-size:24px;font-weight:600;margin:0 0 12px}
.g-sanit-caja p,.g-red-dir>p{margin:0;color:#646b65;font-size:16px;line-height:1.65}
.g-boton-borde{background:transparent!important;border:1.5px solid var(--ink)!important;color:var(--ink)!important}
.g-nota-corp{margin:18px 0 0;font-size:14px;color:#646b65;max-width:52ch}
.g-teps{background:var(--surface)}
.g-teps-top{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;margin-bottom:34px}
.g-teps-top .g-cab{margin:0}
.g-teps-con-sello{grid-template-columns:auto 1fr 1fr}.g-teps-sello{width:120px;height:120px}
.g-teps-desc .g-intro{margin:0 0 20px}
.g-num{font-size:14px;font-weight:700;color:var(--ink);background:var(--yellow);border-radius:999px;padding:4px 10px}
.g-teps .g-cols strong{display:block;font-size:16px;margin:0 0 8px}
.g-teps-prog{margin-top:34px;border-top:1px solid var(--line)}
.g-teps-prog-t{font-weight:600;margin:22px 0 8px}
.g-teps-prog details{border-bottom:1px solid var(--line)}
.g-teps-prog summary{display:flex;justify-content:space-between;align-items:center;min-height:48px;cursor:pointer;font-size:18px;font-weight:600;list-style:none}
.g-teps-prog summary::-webkit-details-marker{display:none}
.g-teps-prog details[open] summary span{transform:rotate(45deg)}
.g-teps-prog details p{margin:0 0 18px;color:#646b65;font-size:16px;line-height:1.65;max-width:70ch}
.g-red .button,.g-sanit .button{margin-top:4px}
.g-red-link,.g-historia .text-link,.g-red-dir>.text-link{display:flex!important;width:fit-content;gap:6px;align-items:center;min-height:44px;margin-top:10px}
.g-red-reg{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:22px 0}
.g-red-reg h4{margin:0 0 8px;font-size:14px;color:#646b65;font-weight:600}
.g-red-reg a{display:flex;align-items:center;min-height:44px;color:var(--ink)}
.g-red-num{display:grid;grid-template-columns:repeat(3,1fr);margin-top:24px;border-top:1px solid var(--line);padding-top:20px}
.g-red-num b{display:block;font-size:34px;font-weight:500;letter-spacing:-.03em}
.g-red-num span{color:#646b65;font-size:15px}
.g-historia .g-intro{margin:0 0 14px}
.g-hist-carro img{display:block;width:100%;max-width:420px;height:auto;margin:0 auto 24px}
.g-hist-linea{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
.g-hist-linea>div{padding:18px 18px 0 0}
.g-hist-linea b{font-size:28px;font-weight:600}
.g-hist-linea p{margin:6px 0 0;color:#646b65;font-size:15px;line-height:1.5}
@media (max-width:1100px){.g-prog-4{grid-template-columns:repeat(2,1fr)}.g-prog-4 .g-prog:nth-child(3){border-left:0}.g-prog-4 .g-prog:nth-child(n+3){border-top:1px solid var(--line)}.g-teps-con-sello{grid-template-columns:auto 1fr}.g-teps-desc{grid-column:1/-1}}
@media (max-width:760px){.g-prog-4{grid-template-columns:1fr}.g-sanit-in,.g-red-in,.g-hist-in{grid-template-columns:1fr;gap:32px}.g-teps-top{grid-template-columns:1fr;gap:20px}.g-teps-sello{width:88px;height:88px}.g-red-reg{grid-template-columns:1fr 1fr}.g-sanit-caja,.g-red-dir{padding:22px}.g-hist-linea{grid-template-columns:1fr}.g-red-num b{font-size:28px}}
</style>`;

  return { programa, despuesDeComercial: sanitizacion + teps + red + historia, css, sello, carro };
}

// One-off (5-nov-2026, recipe R3 "siempre de usted"): moves Cali's own texts from "tú" to "usted".
// Each pair must be found (at least once), so a typo stops the script instead of silently skipping a sentence.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = (p) => fileURLToPath(new URL(`../src/${p}`, import.meta.url));
const PAIRS = {
  'pages.mjs': [
    ['Revisa zapatos y ropa, y tapa las rejillas con malla.', 'Revise zapatos y ropa, y tape las rejillas con malla.'],
    ['Te contamos qué lavar, tapar y botar cada semana', 'Le contamos qué lavar, tapar y botar cada semana'],
    ['qué tipo tienes y dónde está la colonia. Te contamos sus señales', 'qué tipo tiene y dónde está la colonia. Le contamos sus señales'],
    ['en casa y en tu negocio', 'en casa y en su negocio'],
    ['basura. Te contamos por qué', 'basura. Le contamos por qué'],
    ['común. Te contamos qué significa', 'común. Le contamos qué significa'],
    ['conocer tu operación.', 'conocer su operación.'],
    ['cómo funciona tu operación', 'cómo funciona su operación'],
    ['recibes una propuesta con el alcance y las condiciones para tu operación.', 'recibe una propuesta con el alcance y las condiciones para su operación.'],
    ["['Tu operación', 'Indica qué produces o almacenas", "['Su operación', 'Indique qué produce o almacena"],
    ["['Tus auditorías', 'Cuéntanos si necesitas registros para la autoridad sanitaria o para tus clientes.']", "['Sus auditorías', 'Cuéntenos si necesita registros para la autoridad sanitaria o para sus clientes.']"],
    ['Describe las señales, dónde las ves y desde cuándo.', 'Describa las señales, dónde las ve y desde cuándo.'],
    ['lo que pida tu operación', 'lo que pida su operación'],
    ['de lo que crees.', 'de lo que cree.'],
    ["ey: 'En tu casa o negocio'", "ey: 'En su casa o negocio'"],
    ['Quítales comida', 'Quíteles comida'],
    ["'Saca la basura en el horario de recolección.'", "'Saque la basura en el horario de recolección.'"],
    ["h2: 'Cierra el paso<br/>donde estén.'", "h2: 'Cierre el paso<br/>donde estén.'"],
    ['madera de tu casa.', 'madera de su casa.'],
    ["'Revisemos tu<br/>madera.'", "'Revisemos su<br/>madera.'"],
    ['<br/>no miras.', '<br/>no mira.'],
    ["h2: 'Cierra el paso.'", "h2: 'Cierre el paso.'"],
    ['No te pongas remedios caseros: ve al médico.', 'No se ponga remedios caseros: vaya al médico.'],
    ['Si puedes hacerlo sin riesgo, llévalo en un frasco', 'Si puede hacerlo sin riesgo, llévelo en un frasco'],
    ['<strong>Lava y cepilla</strong>', '<strong>Lave y cepille</strong>'],
    ['<strong>Tapa bien</strong>', '<strong>Tape bien</strong>'],
    ['<strong>Voltea</strong> los objetos que no estés usando', '<strong>Voltee</strong> los objetos que no esté usando'],
    ['<strong>Bota</strong> llantas', '<strong>Bote</strong> llantas'],
    ['Si aun con la rutina sigues viendo muchos zancudos, puede haber un criadero que no has encontrado', 'Si aun con la rutina sigue viendo muchos zancudos, puede haber un criadero que no ha encontrado'],
    ['por WhatsApp. Cuéntale qué ves y dónde, y te orienta', 'por WhatsApp. Cuéntele qué ve y dónde, y le orienta'],
    ['<p>Escríbele a Truly AI, el asistente', '<p>Escríbale a Truly AI, el asistente'],
    ['¿Cómo eliminar el comején de tu casa? Primero hay que saber qué tipo tienes', '¿Cómo eliminar el comején de su casa? Primero hay que saber qué tipo tiene'],
    ['saber cuál tienes, antes', 'saber cuál tiene, antes'],
    ['No las barras antes de fotografiarlas', 'No las barra antes de fotografiarlas'],
    ['que tu casa esté infestada', 'que su casa esté infestada'],
    ['comprados por tu cuenta', 'comprados por su cuenta'],
    ['Truly AI te ayuda a dar el primer paso hoy mismo', 'Truly AI le ayuda a dar el primer paso hoy mismo'],
    ['Fotografía las señales y anota dónde están', 'Fotografíe las señales y anote dónde están'],
    ['Con eso ya puedes escribirle a Truly AI', 'Con eso ya puede escribirle a Truly AI'],
    ['Te orienta en el siguiente paso. Si quieres repasar las señales, entra a la', 'Le orienta en el siguiente paso. Si quiere repasar las señales, entre a la'],
    ['Antes de gastar en ellos, escríbele a Truly AI y te orienta', 'Antes de gastar en ellos, escríbale a Truly AI y le orienta'],
    ['Si los ves, fotografíalos, anota por dónde salieron y escríbele a Truly AI.', 'Si los ve, fotografíelos, anote por dónde salieron y escríbale a Truly AI.'],
    ['<strong>Saca la basura</strong>', '<strong>Saque la basura</strong>'],
    ['<strong>Guarda la comida</strong>', '<strong>Guarde la comida</strong>'],
    ['<strong>No dejes restos</strong>', '<strong>No deje restos</strong>'],
    ['Truly AI te orienta en el siguiente paso</h2>', 'Truly AI le orienta en el siguiente paso</h2>'],
    ['donde viste las señales ya puedes escribirle', 'donde vio las señales ya puede escribirle'],
    ['Puede ser. Busca excrementos y roeduras cerca, fotografíalos y escríbele a Truly AI.', 'Puede ser. Busque excrementos y roeduras cerca, fotografíelos y escríbale a Truly AI.'],
    ['Qué significa para tu casa o tu negocio', 'Qué significa para su casa o su negocio'],
    ['Truly AI te ayuda a empezar', 'Truly AI le ayuda a empezar'],
    ['Anota si son pequeñas o grandes y dónde las ves. Con ese dato, escríbele a Truly AI por el chat o por WhatsApp. Si quieres repasar los datos, entra a la', 'Anote si son pequeñas o grandes y dónde las ve. Con ese dato, escríbale a Truly AI por el chat o por WhatsApp. Si quiere repasar los datos, entre a la'],
    ['Anota el tamaño y dónde la viste, y escríbele a Truly AI.', 'Anote el tamaño y dónde la vio, y escríbale a Truly AI.'],
    ['Lo que escribas en el chat de este sitio o por WhatsApp lo recibe y responde Truly AI, el asistente de Truly Nolen International. Úsalo para tu consulta sobre control de plagas y no compartas datos sensibles', 'Lo que escriba en el chat de este sitio o por WhatsApp lo recibe y responde Truly AI, el asistente de Truly Nolen International. Úselo para su consulta sobre control de plagas y no comparta datos sensibles'],
    ['Puedes recorrer este sitio con el teclado, ampliar el texto y usar la preferencia de movimiento reducido de tu dispositivo. Si tu dispositivo pide reducir el movimiento, se muestra una imagen fija. Si encuentras una dificultad de acceso, cuéntasela a Truly AI en el chat.', 'Puede recorrer este sitio con el teclado, ampliar el texto y usar la preferencia de movimiento reducido de su dispositivo. Si su dispositivo pide reducir el movimiento, se muestra una imagen fija. Si encuentra una dificultad de acceso, cuénteselo a Truly AI en el chat.'],
    ['desc: \'Control de plagas para plantas de alimentos, bodegas y centros logísticos en Cali y municipios vecinos. Escríbele a Truly AI.\'', 'desc: \'Control de plagas para plantas de alimentos, bodegas y centros logísticos en Cali y municipios vecinos. Escríbale a Truly AI.\''],
  ],
  'helpers.mjs': [
    ['El equipo revisa tu consulta, confirma si podemos atenderte y coordina la evaluación que corresponda.', 'El equipo revisa su consulta, confirma si podemos atenderle y coordina la evaluación que corresponda.'],
    ['Te indicaremos las medidas que aplican al servicio', 'Le indicaremos las medidas que aplican al servicio'],
    ['Indica tu comuna o corregimiento, tu barrio y el tipo de espacio. Te confirmaremos si podemos atenderte y cómo coordinar la atención.', 'Indique su comuna o corregimiento, su barrio y el tipo de espacio. Le confirmaremos si podemos atenderle y cómo coordinar la atención.'],
    ['Pregúntale al equipo antes de coordinar la visita. El costo y las condiciones dependen de la ubicación y del servicio que necesites.', 'Pregúntele al equipo antes de coordinar la visita. El costo y las condiciones dependen de la ubicación y del servicio que necesite.'],
    ['después de evaluar tu situación.', 'después de evaluar su situación.'],
    ['una fuente pública que puedes revisar.', 'una fuente pública que puede revisar.'],
    ['Cuéntanos qué necesitas proteger.</h2><p>Todo empieza por contarnos qué viste. Escríbele a Truly AI aquí mismo o por WhatsApp y te orienta en el siguiente paso.', 'Cuéntenos qué necesita proteger.</h2><p>Todo empieza con contarnos qué vio. Escríbale a Truly AI aquí mismo o por WhatsApp y le orienta en el siguiente paso.'],
    ['<p>Tu casa tiene tres áreas que se complementan.', '<p>Su casa tiene tres áreas que se complementan.'],
    ['Donde vives y guardas la comida.', 'Donde vive y guarda la comida.'],
    ['Conoce cada plaga en su guía.', 'Conozca cada plaga en su guía.'],
  ],
};
for (const [name, pairs] of Object.entries(PAIRS)) {
  let s = readFileSync(file(name), 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) throw new Error(`[${name}] no encontré: ${a.slice(0, 80)}`);
    s = s.split(a).join(b);
  }
  writeFileSync(file(name), s);
  console.log(`${name}: ${pairs.length} cambios`);
}

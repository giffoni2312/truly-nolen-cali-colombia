// Spelling and style fixes applied to every built page (5-nov-2026, Carlos: «todo en español, cero palabras en otro
// idioma, ortografía perfecta»). Most come from the globaltni.com/es copies (Hogares, Comercios, portada), which have
// translation mistakes. Each pair is [wrong, right]; build.mjs reports any pair that no longer matches anything.
export const ORTOGRAFIA = [
  // accents and spelling
  ['atención medica a largo plazo', 'atención médica a largo plazo'],
  ['Envasado y re envasado de alimentos', 'Envasado y reenvasado de alimentos'],
  // RAE: avoid «y/o»; «o» already includes both
  ['normas regulatorias de la industria y / o los requisitos', 'normas regulatorias de la industria o los requisitos'],
  // stray periods and slashes in lists
  ['>Centros de asistencia prolongada.</li>', '>Centros de asistencia prolongada</li>'],
  ['>Almacenamiento y distribución de alimentos.</li>', '>Almacenamiento y distribución de alimentos</li>'],
  ['Instalaciones de atención / tratamiento de pacientes', 'Instalaciones de atención y tratamiento de pacientes'],
  ['Suministros médicos / Almacenes', 'Suministros médicos y almacenes'],
  ['Campos de Logística', 'Campos de la logística'],
  ['cuanto al servicio comercial de control de plagas</p>', 'cuanto al servicio comercial de control de plagas.</p>'],
  // grammar
  ['que van más allá de solamente control.', 'que van más allá del control.'],
  ['que van más allá de solamente el control.', 'que van más allá del control.'],
  ['La inspección y el tratamiento se realizará en toda la casa.', 'La inspección y el tratamiento se realizarán en toda la casa.'],
  ['ofrece un Programa de Protocolo de 3 zonas.', 'ofrece un programa de protocolo de tres zonas.'],
  ['La zona roja (Interior de la casa)', 'La zona roja (interior de la casa)'],
  ['La zona verde (Las áreas verdes, como césped, macizos de flores).', 'La zona verde (las áreas verdes, como el césped y los macizos de flores).'],
  ['¿Interesado? Haga clic', '¿Le interesa? Haga clic'],
  // words in another language -> Spanish (DLE)
  ['>Catering</li>', '>Servicios de comida</li>'],
  ['fabricación, catering y mucho más', 'fabricación, servicios de comida y mucho más'],
  ['fabricación y catering, entre muchos otros sectores', 'fabricación y servicios de comida, entre muchos otros sectores'],
  ['Servicio premium', 'Servicio prémium'],
  ['Closets y muebles.', 'Clósets y muebles.'],
  ['marcos, closets o muebles', 'marcos, clósets o muebles'],
  // one wording across the site («empezar por» + action)
  ['Todo empieza con contarnos qué vio.', 'Todo empieza por contarnos qué vio.'],
];

export function corregir(html, usados) {
  for (const [a, b] of ORTOGRAFIA) {
    if (html.includes(a)) { html = html.split(a).join(b); usados.add(a); }
  }
  return html;
}

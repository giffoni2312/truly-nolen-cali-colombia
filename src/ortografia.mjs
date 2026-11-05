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
  // words in another language -> Spanish (DLE)
  ['>Catering</li>', '>Servicios de comida</li>'],
  ['fabricación, catering y mucho más', 'fabricación, servicios de comida y mucho más'],
  ['fabricación y catering, entre muchos otros sectores', 'fabricación y servicios de comida, entre muchos otros sectores'],
  ['Servicio premium', 'Servicio prémium'],
  ['Closets y muebles.', 'Clósets y muebles.'],
  ['marcos, closets o muebles', 'marcos, clósets o muebles'],
  // one wording across the site («empezar por» + action)
  ['Todo empieza con contarnos qué vio.', 'Todo empieza por contarnos qué vio.'],
  // who guides whom: with «usted», «Escríbale a Truly AI … y le orienta» reads as if the visitor guides Truly AI (juez de voz, 5-nov)
  ['Escríbale a Truly AI aquí mismo o por WhatsApp y le orienta en el siguiente paso.', 'Escriba aquí mismo o por WhatsApp y Truly AI le orienta en el siguiente paso.'],
  ['Escríbale a Truly AI aquí mismo o por WhatsApp: le orienta en el siguiente paso.', 'Escriba aquí mismo o por WhatsApp y Truly AI le orienta en el siguiente paso.'],
];

// ---------- Decisiones comunes a Bogotá, Cali y Uruguay (5-nov-2026): same wording on the three sites ----------
export const DECISIONES_5NOV = [
  // system name, no English
  ['Truly Elite Protection System (TEPS) se desarrolló', 'El sistema TEPS se desarrolló'],
  ['Truly Elite Protection System (TEPS) fue desarrollado', 'El sistema TEPS fue desarrollado'],
  // «corporación» for «empresa» is a calque (coordinador, 5-nov)
  ['fue desarrollado para corporaciones que requieren', 'fue desarrollado para empresas que requieren'],
  ['Truly Elite Protection System (TEPS) ofrece prevención', 'El sistema TEPS ofrece prevención'],
  ['>Truly Elite Protection System</span>', '>Sistema TEPS</span>'],
  ['Nuestro sistema de protección Truly Elite (TEPS)', 'Nuestro sistema TEPS'],
  ['Nuestro sistema de protección Truly Elite', 'Nuestro sistema TEPS'],
  ['Contactar a TNI', 'Contactar a Truly Nolen'],
  ['alt="Un entorno del archivo de servicios de TNI."', 'alt="Archivo de servicios de Truly Nolen."'],
  ['Diagrama oficial de TNI:', 'Diagrama oficial de Truly Nolen:'],
  // Hogares
  ['TNI ofrece un Programa de Protocolo de 3 zonas.', 'Truly Nolen ofrece el protocolo de las tres zonas.'],
  ['<p>– La zona roja (Interior de la casa)</p>', '<p>Zona roja: el interior de la casa.</p>'],
  ['<p>– La zona amarilla (perímetro inmediato de la casa)</p>', '<p>Zona amarilla: el perímetro inmediato de la casa.</p>'],
  ['<p>– La zona verde (Las áreas verdes, como césped, macizos de flores).</p>', '<p>Zona verde: las áreas verdes, como el césped y los jardines.</p>'],
  ['En cada una de estas áreas, Truly Nolen International implementará los protocolos correctos. Esto proporcionará al cliente una solución única a sus problemas de plagas.', 'En cada una de estas áreas, Truly Nolen aplicará el protocolo que corresponde. Así usted tendrá una solución completa para sus problemas de plagas.'],
  ['¿Interesado? Haga clic en el enlace de abajo para contactarnos y recibir más información.', '¿Le interesa? Escríbanos con el botón de abajo y le damos más información.'],
  ['alt="Material de Truly Nolen International"', 'alt="Diagrama de una casa con el interior en rojo, el perímetro en amarillo y las áreas verdes en verde"'],
  // Comercios
  ['física o mental, enfrentan', 'física o mental enfrentan'],
  ['de última generación, como:</p>', 'de última generación.</p>'],
  ['de última generación, tales como:</p>', 'de última generación.</p>'],
  ['¿Quién se beneficia con este programa?', '¿Quién se beneficia de este programa?'],
  ['cumple con toda la documentación y registros requeridos', 'cumple con toda la documentación y todos los registros requeridos'],
  ['Servicios de alimentación y hospitalidad', 'Servicios de alimentación y hotelería'],
  ['Cualquier corporación que se involucre en la logística del traslado diario de bienes y servicios.', 'Atendemos a cualquier empresa que participe en el transporte diario de mercancías.'],
  ['Truly Nolen International está aquí para asegurarse de que no tenga', 'Truly Nolen International se encarga de que no tenga'],
  ['>Centros de atención de emergencias</li>', '>Centros de atención de urgencias</li>'],
  // Portada
  ['<span class="section-tag">Una red internacional</span>', '<span class="section-tag">Oficinas en el mundo</span>'],
  ['programa de Manejo Integrado de Plagas', 'programa de manejo integrado de plagas'],
  ['soporte de auditoría', 'apoyo en auditorías'],
  ['el servicio y el programa adecuado para', 'el servicio y el programa adecuados para'],
  ['las medidas que aplican al servicio', 'las medidas que se aplican al servicio'],
  // the upper band says «65 países»; the lower band said «65+»: one figure on the page
  ['<strong>65+</strong><span>países</span>', '<strong>65</strong><span>países</span>'],
  // Comercios: no sentence twice on the page (receta 6c, ajuste del coordinador 5-nov); runs after the generic pairs above
  ['<p data-source-paragraph="1-2">Nuestro sistema TEPS está diseñado para clientes que requieren sistemas de prevención de plagas de última generación.</p>', '<p data-source-paragraph="1-2">Por eso, el sistema TEPS es la opción para plantas que necesitan prevención de plagas de última generación.</p>'],
  ['<p data-source-paragraph="2-3">Nuestro sistema TEPS está diseñado para clientes que requieren un sistema de prevención de plagas de última generación.</p>', '<p data-source-paragraph="2-3">El sistema TEPS está pensado para empresas de alimentos que necesitan la prevención más exigente.</p>'],
  ['<p data-source-paragraph="3-3">Nuestro sistema TEPS está diseñado para clientes que requieren un sistema de prevención de plagas de última generación.</p>', '<p data-source-paragraph="3-3">Con el sistema TEPS, su operación logística cuenta con prevención de plagas de última generación.</p>'],
  ['<h3 id="healthcare-facilities">¿Quién se beneficia de este programa?</h3>', '<h3 id="healthcare-facilities">¿Quién se beneficia en el sector salud?</h3>'],
  ['<h3 id="industrial-facilities">¿Quién se beneficia de este programa?</h3>', '<h3 id="industrial-facilities">¿Quién se beneficia en la industria?</h3>'],
  ['<h3 id="food-processing-facilities">¿Quién se beneficia de este programa?</h3>', '<h3 id="food-processing-facilities">¿Quién se beneficia en el comercio de alimentos?</h3>'],
  ['<h3 id="logistics-facilities">¿Quién se beneficia de este programa?</h3>', '<h3 id="logistics-facilities">¿Quién se beneficia en la logística?</h3>'],
];
ORTOGRAFIA.push(...DECISIONES_5NOV);

export function corregir(html, usados) {
  for (const [a, b] of ORTOGRAFIA) {
    if (html.includes(a)) { html = html.split(a).join(b); usados.add(a); }
  }
  return html;
}

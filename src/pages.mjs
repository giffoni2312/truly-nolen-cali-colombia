// Cali content. Every figure comes from investigacion-cali.md (source + year on the page).
import { A, ROOT, PLAGAS, detailHero, tabla, dato, esperar, zonas, plagasGrid, services, faq, FAQ_GENERAL, fuentes, cierre } from './helpers.mjs';

// ---------- Sources ----------
const F = {
  emergencia: ['El País Cali (2024). Alcaldía de Cali declara emergencia sanitaria por avance del dengue', 'https://www.elpais.com.co/cali/alcaldia-de-cali-declara-emergencia-sanitaria-por-avance-del-dengue-1136.html'],
  dengue2024: ['Alcaldía de Santiago de Cali (16 de octubre de 2024). Cali continúa reduciendo los casos de dengue', 'https://www.cali.gov.co/educacion/publicaciones/183271/cali-continua-reduciendo-los-casos-de-dengue-al-tiempo-que-intensifica-las-acciones-de-control-vectorial/'],
  dengue2025: ['Alcaldía de Santiago de Cali (5 de diciembre de 2025). Cali se protege del dengue y las enfermedades vectoriales', 'https://www.cali.gov.co/publicaciones/190460/cali-se-protege-del-dengue-y-las-enfermedades-vectoriales-para-cerrar-el-ano-con-salud/'],
  criaderos: ['Alcaldía de Santiago de Cali (7 de mayo de 2025). Conoce cómo prevenir los criaderos de mosquitos en tu hogar', 'https://www.cali.gov.co/salud/publicaciones/186717/conoce-como-prevenir-los-criaderos-de-mosquitos-en-tu-hogar-durante-las-lluvias-constantes/'],
  depositos: ['Alcaldía de Santiago de Cali (2025). Resultados y acciones clave que hacen de Cali una ciudad segura frente al dengue', 'https://www.cali.gov.co/salud/publicaciones/186881/resultados-y-acciones-clave-que-hacen-de-cali-una-ciudad-segura-frente-al-dengue/'],
  oms: ['Organización Mundial de la Salud. Dengue y dengue grave', 'https://www.who.int/es/news-room/fact-sheets/detail/dengue-and-severe-dengue'],
  lepto: ['Instituto Nacional de Salud (2025). Informe de evento Leptospirosis, Colombia 2024', 'https://www.ins.gov.co/buscador-eventos/Informesdeevento/LEPTOSPIROSIS%20INFORME%20DE%20EVENTO%202024.pdf'],
  roedores2023: ['El País Cali (2023). Preocupación por proliferación de roedores en parque y zonas comerciales de Cali', 'https://www.elpais.com.co/cali/preocupacion-por-proliferacion-de-roedores-en-parque-y-zonas-comerciales-de-cali-2537.html'],
  roedores2026: ['El Espectador (2026). Videos de ratas en sector gastronómico del sur de Cali obligan intervención sanitaria', 'https://www.elespectador.com/colombia/videos-de-ratas-en-sector-gastronomico-del-sur-de-cali-obligan-intervencion-sanitaria/'],
  ley9: ['Congreso de Colombia. Ley 9 de 1979, Código Sanitario Nacional', 'https://normas.cra.gov.co/gestor/docs/ley_0009_1979.htm'],
  res2674: ['Ministerio de Salud y Protección Social. Resolución 2674 de 2013', 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-2674-de-2013.pdf'],
  dec1843: ['Presidencia de la República. Decreto 1843 de 1991, uso y manejo de plaguicidas', 'https://normas.cra.gov.co/gestor/docs/decreto_1843_1991.htm'],
  fumigacion: ['Secretaría de Salud Pública de Cali. Acerca de la fumigación para los establecimientos comerciales y viviendas', 'https://www.cali.gov.co/salud/publicaciones/163146/acerca-de-la-fumigacion-para-los-establecimientos-comerciales-y-viviendas/'],
  cucaDelta: ['Revista Cubana de Medicina Tropical (2009). Resistencia a la deltametrina en cepas de Blattella germanica de Cali, Colombia (resumen)', 'https://www.epistemonikos.org/pt/documents/911f8203b274f5f97bf75c07a03e01a82b0887d8'],
  hormigas2005: ['Olaya-Másmela, Chacón de Ulloa y Payán (2005). Hormigas en centros de salud del Valle del Cauca. Revista Colombiana de Entomología 31(2)', 'https://revistacolombianaentomologia.univalle.edu.co/index.php/SOCOLEN/article/view/9442'],
  hormigasUrbanas: ['Chacón de Ulloa y col. (2006). Hormigas urbanas del Valle del Cauca, Colombia', 'https://raccefyn.co/index.php/raccefyn/article/download/2270/3668/27425'],
  termitasCali: ['Abadía, Galvis, Arcila y Chacón de Ulloa (2011). Heterotermes convexinotatus en Colombia. ICUP', 'https://icup.org.uk/conferences/2011/posters/heterotermes-convexinotatus-isoptera-rhinotermitidae-in-colombia-distribution-and-impact/'],
  ucipm: ['Universidad de California, UC IPM (2025). Termitas (guía en español, referencia general)', 'https://ipm.ucanr.edu/home-and-landscape/spanish/termitas/'],
  alacranes: ['Contexto Ganadero (2018). Con el incremento de las lluvias y el fuerte calor salen los escorpiones', 'https://www.contextoganadero.com/ganaderia-sostenible/con-el-incremento-de-las-lluvias-y-el-fuerte-calor-salen-los-escorpiones'],
  alacranArg: ['Ministerio de Salud de Argentina. Prevención ante escorpiones o alacranes (referencia general)', 'https://www.argentina.gob.ar/noticias/prevencion-ante-la-exposicion-escorpiones-o-alacranes'],
  comunas: ['Alcaldía de Santiago de Cali (2019). Así están distribuidas las localidades de Cali Distrito Especial', 'https://www.cali.gov.co/gobierno/publicaciones/148815/asi-estan-distribuidas-las-localidades-de-cali-distrito-especial/'],
  fotoZancudo: ['Foto del zancudo: Departamento de Agricultura de EE. UU., dominio público (Wikimedia Commons)', 'https://commons.wikimedia.org/wiki/File:Aedes_aegypti_biting_human.jpg'],
  fotoRata: ['Foto de la rata: Salix, CC BY-SA 3.0 (Wikimedia Commons)', 'https://commons.wikimedia.org/wiki/File:Rattus_norvegicus-Rochefort.JPG'],
  fotoCucaracha: ['Foto de la cucaracha americana: Insects Unlocked, CC0 (Wikimedia Commons)', 'https://commons.wikimedia.org/wiki/File:Periplaneta_americana_-_American_cockroach_(25859665686)_(cropped).jpg'],
  fotoComejen: ['Foto del comején de madera seca: Davidmoradelpozo, CC BY-SA 3.0 (Wikimedia Commons)', 'https://commons.wikimedia.org/wiki/File:Colonia_de_Cryptotermes_Brevis_Walker.jpg'],
  fotoAlacran: ['Foto del alacrán (Tityus columbianus): Manuel Ortiz, CC0 (Wikimedia Commons)', 'https://commons.wikimedia.org/wiki/File:Tityus_columbianus.jpg'],
  fotoHormiga: ['Foto de la hormiga loca: Judy Gallagher, CC BY 2.0 (Wikimedia Commons)', 'https://commons.wikimedia.org/wiki/File:Longhorn_Crazy_Ant_-_Paratrechina_longicornis,_Dagny_Johnson_State_Park,_Key_Largo,_Florida.jpg'],
  galerias: ['Alcaldía de Santiago de Cali (2021). Las plazas de mercado de Cali están vivas', 'https://www.cali.gov.co/serviciospublicos/publicaciones/164455/las-plazas-de-mercado-de-cali-estan-vivas/'],
};

// ---------- Shared summaries ----------
const RESUMEN = {
  zancudos: 'El zancudo Aedes aegypti transmite el dengue, y en 2024 Cali declaró emergencia sanitaria por su avance.',
  'ratas-y-ratones': 'Su orina transmite la leptospirosis. En 2024 Colombia notificó 9.681 casos, según el Instituto Nacional de Salud.',
  cucarachas: 'La cucaracha alemana, pequeña y de cocina, y la americana, la más grande. En Cali ya se encontraron cepas resistentes a un insecticida.',
  hormigas: 'En hospitales de Cali, la hormiga loca y la hormiga fantasma fueron las más comunes, y llevaban bacterias.',
  comejen: 'En Cali las especies más frecuentes son la de madera seca y una subterránea que sube por tubitos de barro.',
  alacranes: 'Aparecen más con las lluvias y el calor. Revisa zapatos y ropa, y tapa los sifones con malla.',
};

const BLOG = {
  zancudos: {
    slug: 'como-acabar-con-los-zancudos-en-casa',
    tema: 'Zancudos',
    titulo: 'Cómo acabar con los zancudos en casa: guía para Cali',
    resumen: 'Para acabar con los zancudos en casa hay que quitarles el agua donde se crían. Te contamos qué lavar, tapar y botar cada semana, según la Alcaldía de Cali.',
    img: 'cali-blog-como-acabar-con-los-zancudos-en-casa.webp',
  },
  comejen: {
    slug: 'como-eliminar-el-comejen',
    tema: 'Comején',
    titulo: 'Cómo eliminar el comején: señales y qué hacer',
    resumen: 'El comején no se elimina fumigando a ciegas: primero hay que saber qué tipo tienes y dónde está la colonia. Te contamos sus señales y cómo evitar que vuelva.',
    img: 'cali-blog-como-eliminar-el-comejen.webp',
  },
};
const FECHA = '<time datetime="2026-11-02">2 de noviembre de 2026</time>';
const FECHA_TXT = '2 de noviembre de 2026';

const blogCard = (b, cls = 'blog-card') =>
  `<article class="${cls}"><a href="${ROOT}blog/${b.slug}/" tabindex="-1" aria-hidden="true"><img src="${A(b.img)}" alt="" loading="lazy"/></a><div><p class="eyebrow">${b.tema} · ${FECHA}</p><h2><a href="${ROOT}blog/${b.slug}/">${b.titulo}</a></h2><p>${b.resumen}</p><a class="text-link" href="${ROOT}blog/${b.slug}/">Leer guía →</a></div></article>`;

// ---------- Portada (same markup as the reference, only Cali text) ----------
const COMUNAS = [...Array.from({ length: 22 }, (_, i) => `Comuna ${i + 1}`), 'Corregimiento Golondrinas', 'Corregimiento Montebello', 'Corregimiento La Elvira', 'Corregimiento La Paz', 'Corregimiento La Castilla', 'Corregimiento El Saladito', 'Corregimiento Felidia', 'Corregimiento La Leonera', 'Corregimiento Navarro', 'Corregimiento El Hormiguero', 'Corregimiento Pance', 'Corregimiento La Buitrera', 'Corregimiento Pichindé', 'Corregimiento Los Andes', 'Corregimiento Villacarmelo', 'Municipio vecino (Jamundí, Yumbo, Palmira, Candelaria)'];
const SELECT_VE = '<select name="n1" required><option value="">Elegir</option><option>Amazonas</option><option>Anzoátegui</option><option>Apure</option><option>Aragua</option><option>Barinas</option><option>Bolívar</option><option>Carabobo</option><option>Cojedes</option><option>Delta Amacuro</option><option>Distrito Capital</option><option>Falcón</option><option>Guárico</option><option>La Guaira</option><option>Lara</option><option>Mérida</option><option>Miranda</option><option>Monagas</option><option>Nueva Esparta</option><option>Portuguesa</option><option>Sucre</option><option>Táchira</option><option>Trujillo</option><option>Yaracuy</option><option>Zulia</option><option>Dependencias Federales</option></select>';

const VE_RESUMEN = {
  zancudos: 'El zancudo Aedes aegypti es el principal transmisor del dengue, y se cría en el agua que guardamos en casa.',
  'ratas-y-ratones': 'Ratón doméstico, rata negra y rata noruega: las tres se capturaron en un estudio de campo en La Guaira (2010-2011).',
  cucarachas: 'La chiripa, pequeña y de cocina, y la cucaracha americana, la más grande.',
  hormigas: 'En Venezuela llamamos bachacos a las hormigas cortadoras de hojas, que causan daños severos en cultivos como la yuca.',
  comejen: 'En Venezuela le decimos comején a las termitas.',
  alacranes: 'La mayoría de los accidentes por alacrán en Venezuela son por especies del género Tityus, y en Caracas pican sobre todo de día.',
};
const VE_IMG = {
  zancudos: 've-plaga-zancudo-foto.webp',
  'ratas-y-ratones': 've-plaga-rata-noruega-foto.webp',
  cucarachas: 've-plaga-cucaracha-americana-foto.webp',
  hormigas: 've-plaga-hormiga-cortadora-foto.webp',
  comejen: 've-plaga-comejen-foto.webp',
  alacranes: 've-plaga-alacran-tityus-foto.webp',
};

export const PORTADA = {
  ref: '',
  title: 'Truly Nolen Cali | Control de plagas',
  desc: 'Control de plagas en Cali para hogares, comercios e industrias. Escríbele a Truly AI y te orientamos en el siguiente paso.',
  replace: [
    ['Para tu casa, tu apartamento o tu quinta.', 'Para tu casa, tu apartamento o tu finca.'],
    ['alt="Casa moderna en Caracas vista desde arriba: el interior en rojo, el perímetro en amarillo y el jardín en verde"', 'alt="Casa moderna en Cali vista desde arriba, con los Farallones al fondo: el interior en rojo, el perímetro en amarillo y el jardín en verde"'],
    ['venezuela-casa-zonas.webp', 'cali-casa-zonas.webp'],
    ['ve-comercio-panaderia-mj-6af3bdde-2.webp', 'cali-comercio-panaderia.webp'],
    ['Panaderías, restaurantes, bodegones, abastos, farmacias, consultorios y oficinas.', 'Panaderías, restaurantes, tiendas de barrio, puestos de galería, droguerías, consultorios y oficinas.'],
    ['Las que más vemos en Venezuela.', 'Las que más vemos en Cali.'],
    ...PLAGAS.flatMap((p) => [[VE_RESUMEN[p.slug], RESUMEN[p.slug]], [VE_IMG[p.slug], p.img]]),
    ['ve-blog-como-eliminar-el-comejen.webp', BLOG.zancudos.img],
    ['Del blog · 29 de octubre de 2026', `Del blog · ${FECHA_TXT}`],
    ['blog/como-eliminar-el-comejen/', `blog/${BLOG.zancudos.slug}/`],
    ['Cómo eliminar el comején: señales y qué hacer', BLOG.zancudos.titulo],
    ['El comején no se elimina fumigando a ciegas: primero hay que saber qué tipo tienes y dónde está la colonia. Te contamos sus señales y cómo evitar que vuelva.', BLOG.zancudos.resumen],
    ['Indica tu estado, municipio y el tipo de espacio.', 'Indica tu comuna o corregimiento, tu barrio y el tipo de espacio.'],
    ['data-n1="Estado" data-n2="Municipio"', 'data-n1="Comuna o corregimiento" data-n2="Barrio"'],
    ['Comparte tu estado y municipio para revisar si podemos atenderte y coordinar el siguiente paso.', 'Comparte tu comuna o corregimiento y tu barrio para revisar si podemos atenderte y coordinar el siguiente paso.'],
    ['<label>Estado<select', '<label>Comuna o corregimiento<select'],
    [SELECT_VE, `<select name="n1" required><option value="">Elegir</option>${COMUNAS.map((c) => `<option>${c}</option>`).join('')}</select>`],
    ['<label>Municipio<input name="n2" autocomplete="address-level2"/>', '<label>Barrio<input name="n2" autocomplete="address-level3"/>'],
    ['maxlength="4" pattern="[0-9]{4}"', 'maxlength="6" pattern="[0-9]{6}"'],
    ['Quiero saber si atienden en mi zona. Mi estado y municipio: ', 'Quiero saber si atienden en mi zona. Mi comuna y mi barrio: '],
  ],
};

// ---------- Services ----------
const hogares = {
  ref: 'servicios/hogares',
  title: 'Control de plagas para hogares en Cali | Truly Nolen Cali',
  desc: 'Revisamos tu casa o apartamento en Cali por dentro y por fuera: cocina, baños, perímetro y patio. Escríbele a Truly AI.',
  main: [
    detailHero({ eyebrow: 'Servicio residencial · Cali', h1: 'Revisamos tu casa<br/>por dentro y por fuera.', text: 'Desde la cocina hasta el patio. Revisamos tu casa o apartamento para encontrar dónde está la actividad de plagas y qué la favorece, cuidando a tu familia y a tus mascotas.', img: 'cali-casa-cocina.webp', alt: 'Hogares' }),
    esperar({
      ey: 'Qué puedes esperar',
      h2: 'Protección para tu hogar.',
      cols: [
        ['¿Para quién?', 'Casas, apartamentos, unidades residenciales y fincas con actividad de plagas o que quieren prevenirla.'],
        ['¿Qué incluye?', 'Revisión del interior, el perímetro y las zonas verdes. Medidas de control según lo que se encuentre, e indicaciones para preparar a tu familia y a tus mascotas.'],
        ['¿Cómo sigue?', 'Recomendaciones para que no vuelvan a entrar y visitas de seguimiento según el programa acordado.'],
      ],
      nota: 'Antes de empezar recibes una propuesta con el alcance y las condiciones para tu casa.',
    }),
    zonas({
      alt: 'Casa moderna en Cali vista desde arriba, con los Farallones al fondo: el interior en rojo, el perímetro en amarillo y el jardín en verde',
      det: [
        'Debajo del lavaplatos y detrás de la nevera · Baños, sifones y filtraciones · Dónde y a qué hora has visto actividad.',
        'Puertas, ventanas y rejas · Grietas y pasos de tuberías · Lo que está guardado junto a las paredes.',
        'Matas, materas y jardín · Tanques, baldes y cualquier recipiente con agua · Escombros, leña y hojarasca acumulados.',
      ],
    }),
    plagasGrid({ ey: 'Lo que hay que saber en Cali', h2: 'Las plagas que más<br/>vemos en casa.', resumenes: RESUMEN, nota: '<strong>Dónde empieza la revisión.</strong> Cocina, baños, tanques de agua, cielo raso y patios: ahí se buscan las señales y lo que favorece a cada plaga.' }),
    tabla({
      ey: 'Antes de conversar',
      h2: 'Qué conviene contarnos.',
      rows: [
        ['Tu espacio', 'Indica si es una casa, un apartamento o una finca y qué ambientes requieren atención.'],
        ['Tu rutina', 'Cuéntanos qué horarios te quedan cómodos para una visita.'],
        ['Lo que observas', 'Describe las señales y desde cuándo las notas. Puedes mencionar si hay niños o mascotas.'],
      ],
    }),
    faq({
      items: [
        ['¿Qué pasa si hay niños o mascotas en casa?', 'Avísanos antes de la visita. El equipo te indica qué precauciones tomar y cuánto tiempo deben mantenerse alejados del área tratada.'],
        ['¿Tengo que salir de la casa?', 'Depende del tratamiento. La norma colombiana pide que, al aplicar, se evacúen las personas, los animales y los alimentos del área (Decreto 1843 de 1991, artículo 115). Te lo decimos antes de la visita.'],
        ['¿Con una visita basta?', 'Depende de la plaga y de lo que se encuentre. El seguimiento se acuerda en la propuesta.'],
        ['¿Cómo sé si atienden en mi zona?', 'Escríbele a Truly AI con tu comuna o corregimiento y tu barrio. Te confirma si podemos atenderte y cómo seguir.'],
      ],
    }),
    fuentes([F.dengue2024, F.lepto, F.dec1843]),
    cierre([
      ['Hay zancudos en la casa', 'Tengo muchos zancudos en la casa y quiero saber de dónde vienen.'],
      ['Hay ratas o ratones', 'Creo que hay ratas o ratones en mi casa. ¿Qué hago?'],
      ['Vi cucarachas en la cocina', 'Vi cucarachas pequeñas en la cocina. ¿Cómo empiezo?'],
    ]),
  ].join(''),
};

const comercios = {
  ref: 'servicios/comercios',
  title: 'Control de plagas para comercios en Cali | Truly Nolen Cali',
  desc: 'Control de plagas para restaurantes, panaderías, tiendas y oficinas en Cali, con el plan que pide la Resolución 2674 de 2013.',
  main: [
    detailHero({ eyebrow: 'Servicio para comercios · Cali', h1: 'Tu negocio abierto,<br/>sin plagas a la vista.', text: 'Restaurantes, panaderías, tiendas y oficinas. Revisamos las áreas de trabajo y de almacenamiento, y coordinamos los horarios para no frenar tu operación.', img: 'cali-comercio.webp', alt: 'Comercios' }),
    tabla({
      ey: 'Qué puedes esperar',
      h2: 'Control para tu negocio.',
      rows: [
        ['¿Para quién?', 'Panaderías, restaurantes, tiendas de barrio, puestos de galería, droguerías, consultorios y oficinas.'],
        ['¿Qué incluye?', 'Inspección de las áreas de trabajo y de almacenamiento, control según la actividad y coordinación de horarios y accesos con el encargado.'],
        ['¿Cómo sigue?', 'Registro de hallazgos y recomendaciones. Si tienes varias sedes, se acuerda el alcance de cada una.'],
      ],
      nota: 'Antes de empezar recibes una propuesta con el alcance y las condiciones para tu negocio.',
    }),
    tabla({
      ey: 'Lo que pide la norma',
      h2: 'Si vendes alimentos,<br/>necesitas un plan.',
      rows: [
        ['Plan de saneamiento', 'La Resolución 2674 de 2013 (artículo 26) pide a quien fabrique, almacene o venda alimentos un plan de saneamiento escrito y a disposición de la autoridad sanitaria.', ['Limpieza y desinfección.', 'Desechos sólidos.', 'Control de plagas.', 'Agua potable.']],
        ['Control de plagas', 'El numeral 3 del mismo artículo pide un programa de control específico con «el concepto de control integral», con énfasis en las medidas preventivas.'],
        ['Residuos', 'En restaurantes, los residuos se disponen de modo que no den refugio ni alimento a las plagas (artículo 33, numeral 5).'],
      ],
    }),
    tabla({
      ey: 'En Cali',
      h2: 'Quién fumiga<br/>y quién vigila.',
      rows: [
        ['Desde 2018', 'La Secretaría de Salud Pública de Cali dejó de fumigar comercios y viviendas porque vigila a las empresas aplicadoras: «no se puede ser juez y parte».'],
        ['Empresa vigilada', 'Por eso el control lo hace una empresa privada que la Secretaría inspecciona y a la que le da un concepto sanitario.'],
        ['Personal con carné', 'El Decreto 1843 de 1991 pide que los operarios tengan el carné de aplicadores de plaguicidas (artículo 111).'],
      ],
    }),
    dato({
      ey: 'Un dato que pesa',
      h2: 'Lo que pasó en<br/>la calle Novena.',
      items: [['2026', 'denuncias por ratas cerca de restaurantes de la calle Novena, en el sur de Cali, llevaron a una intervención sanitaria con cebos autorizados.', 'El Espectador (2026)']],
    }),
    tabla({
      ey: 'Dónde miramos',
      h2: 'Los puntos que más<br/>se revisan.',
      rows: [
        ['Cocina y producción', 'Donde se preparan y se manipulan alimentos.', ['Debajo de mesones y equipos.', 'Sifones y trampas de grasa.']],
        ['Bodega', 'Donde se guarda la mercancía y la materia prima.', ['Estibas y cajas.', 'Entradas de proveedores.']],
        ['Basuras', 'Donde se acumulan los residuos antes de la recolección.', ['Canecas tapadas.', 'Horario de sacar la basura.']],
      ],
    }),
    plagasGrid({ ey: 'Guía de plagas', h2: 'Las plagas que más<br/>afectan a un negocio.', resumenes: RESUMEN, cuales: ['ratas-y-ratones', 'cucarachas', 'hormigas'] }),
    tabla({
      ey: 'Antes de conversar',
      h2: 'Qué conviene contarnos.',
      rows: [
        ['Tu actividad', 'Indica qué tipo de negocio tienes y si manipulas alimentos.'],
        ['Tus horarios', 'Cuéntanos a qué hora abres y cierras, y cuándo se puede trabajar sin clientes.'],
        ['Lo que observas', 'Describe las señales, dónde las ves y desde cuándo.'],
      ],
    }),
    faq({
      items: [
        ['¿Pueden trabajar cuando el local está cerrado?', 'Sí. Los horarios se coordinan con el encargado para no interrumpir la atención. Además, la norma pide suspender la manipulación de alimentos durante la aplicación (Decreto 1843 de 1991, artículo 115).'],
        ['¿Qué información debo preparar?', 'El tipo de actividad, las áreas del local, los horarios y lo que has observado. Si tienes un plan de saneamiento, tenlo a mano.'],
        ['¿Y si tengo varias sedes?', 'Se acuerda el alcance de cada una en la propuesta.'],
      ],
    }),
    fuentes([F.res2674, F.fumigacion, F.dec1843, F.roedores2026, F.galerias]),
    cierre([
      ['Tengo una panadería o restaurante', 'Tengo una panadería o un restaurante en Cali y necesito control de plagas.'],
      ['Tengo varias sedes', 'Tengo varios locales en Cali. ¿Cómo funciona el servicio para varias sedes?'],
      ['Quiero saber qué incluye', '¿Qué incluye el servicio de control de plagas para comercios?'],
    ]),
  ].join(''),
};

const industria = {
  ref: 'servicios/industria',
  title: 'Control de plagas para industrias en Cali | Truly Nolen Cali',
  desc: 'Control de plagas para plantas de alimentos, bodegas y centros logísticos en Cali y municipios vecinos. Escríbele a Truly AI.',
  main: [
    detailHero({ eyebrow: 'Servicio industrial · Cali', h1: 'Un programa que parte<br/>de conocer tu operación.', text: 'Plantas de alimentos, bodegas y centros logísticos en Cali y sus municipios vecinos. Primero entendemos cómo funciona tu operación y después definimos el programa.', img: 'cali-industria.webp', alt: 'Industria' }),
    tabla({
      ey: 'Qué puedes esperar',
      h2: 'Control para tu planta.',
      rows: [
        ['¿Para quién?', 'Plantas de alimentos y bebidas, laboratorios, bodegas, centros de distribución y operadores logísticos.'],
        ['¿Qué incluye?', 'Inspección de las áreas de producción, almacenamiento y perímetro, control según los riesgos de la operación y registros de cada visita.'],
        ['¿Cómo sigue?', 'Informe de hallazgos, recomendaciones y visitas de seguimiento según el programa acordado.'],
      ],
      nota: 'Antes de empezar recibes una propuesta con el alcance y las condiciones para tu operación.',
    }),
    tabla({
      ey: 'Lo que pide la norma',
      h2: 'Registros que<br/>la autoridad revisa.',
      rows: [
        ['Plan de saneamiento', 'Las plantas de alimentos deben tener el plan escrito, con un programa de control de plagas, a disposición de la autoridad sanitaria (Resolución 2674 de 2013, artículo 26).'],
        ['Productos registrados', 'Solo se usan plaguicidas registrados y permitidos por el Ministerio de Salud (Decreto 1843 de 1991, artículo 114).'],
        ['Protección contra plagas', 'Los establecimientos, los equipos, los alimentos y las materias primas deben protegerse contra las plagas (Ley 9 de 1979, artículo 259).'],
      ],
    }),
    tabla({
      ey: 'Dónde miramos',
      h2: 'De la recepción<br/>al despacho.',
      rows: [
        ['Recepción', 'Por donde entra la materia prima.', ['Muelles y puertas.', 'Estibas y empaques.']],
        ['Producción y bodega', 'Donde se procesa y se guarda.', ['Equipos y desagües.', 'Producto almacenado.']],
        ['Perímetro', 'El entorno de la planta.', ['Zonas verdes y canales.', 'Basuras y escombros.']],
      ],
    }),
    plagasGrid({ ey: 'Guía de plagas', h2: 'Plagas que vigilamos<br/>en la industria.', resumenes: RESUMEN, cuales: ['ratas-y-ratones', 'cucarachas'] }),
    tabla({
      ey: 'Antes de conversar',
      h2: 'Qué conviene contarnos.',
      rows: [
        ['Tu operación', 'Indica qué produces o almacenas y en qué municipio está la planta.'],
        ['Tus auditorías', 'Cuéntanos si necesitas registros para la autoridad sanitaria o para tus clientes.'],
        ['Lo que observas', 'Describe las señales, dónde las ves y desde cuándo.'],
      ],
    }),
    faq({ items: [['¿Cómo se define el programa?', 'Con una visita de evaluación. Según lo que se encuentre y lo que pida tu operación, se propone la frecuencia, los puntos de control y los registros.']] }),
    fuentes([F.res2674, F.dec1843, F.ley9]),
    cierre([
      ['Tengo una planta de alimentos', 'Tengo una planta de alimentos en Cali y necesito un programa de control de plagas.'],
      ['Necesito registros para auditorías', 'Necesito registros de control de plagas para una auditoría.'],
      ['Tengo una bodega', 'Tengo una bodega o centro de distribución y quiero una evaluación.'],
    ]),
  ].join(''),
};

// ---------- Pests ----------
const FAQ_PLAGA = faq({ id: 'preguntas', ey: '04 / Preguntas frecuentes', items: FAQ_GENERAL });
const plaga = (slug, { title, desc, hero, secciones, serv, fuentesList, starts }) => {
  const p = PLAGAS.find((x) => x.slug === slug);
  return {
    ref: `plagas/${{ cucarachas: 'cucarachas-y-chiripas', hormigas: 'hormigas-y-bachacos' }[slug] || slug}`,
    title,
    desc,
    main: [
      detailHero({ eyebrow: `${p.sub} · Cali`, h1: hero.h1, text: RESUMEN[slug], img: p.img, alt: p.nombre }),
      ...secciones,
      services(serv),
      FAQ_PLAGA,
      fuentes(fuentesList),
      cierre(starts),
    ].join(''),
  };
};

const zancudos = plaga('zancudos', {
  title: 'Zancudos y dengue en Cali | Truly Nolen Cali',
  desc: 'El zancudo Aedes aegypti transmite el dengue en Cali. Dónde se cría, qué hacer cada semana y cifras de la Alcaldía.',
  hero: { h1: 'El criadero está más cerca<br/>de lo que crees.' },
  secciones: [
    tabla({
      ey: 'Dónde se cría',
      h2: 'Donde se guarda agua.',
      rows: [
        ['Agua de la casa', 'Se cría en tanques, baldes, floreros y cualquier recipiente que acumule agua.'],
        ['Lo que encontró la Alcaldía', 'En mayo de 2025 se revisaron 12.924 depósitos de agua en Cali y 562 tenían larvas.'],
        ['El dengue', 'Lo transmite el mosquito Aedes aegypti, el que nombran los boletines de la Secretaría de Salud de Cali.'],
      ],
    }),
    dato({
      ey: 'En Cali',
      h2: 'Lo que reportó<br/>la Alcaldía.',
      items: [
        ['34.463', 'casos de dengue en Cali en 2024, hasta el 16 de octubre.', 'Alcaldía de Cali (2024)'],
        ['11 jun', 'de 2024: Cali declaró emergencia sanitaria por el avance del dengue.', 'El País Cali (2024)'],
        ['3.088', 'casos de dengue en 2025, hasta la semana epidemiológica 46.', 'Alcaldía de Cali (2025)'],
      ],
    }),
    tabla({
      ey: 'Rutina de cada semana',
      h2: 'Lava, tapa<br/>y bota.',
      rows: [
        ['Lavar y cepillar', 'La Alcaldía pide lavar y cepillar tanques, cubetas y floreros al menos dos veces a la semana.', ['Tanques y albercas.', 'Floreros y bebederos.']],
        ['Tapar y voltear', 'Tapar bien los recipientes con agua y voltear lo que no se use.', ['Baldes y tanques tapados.', 'Platos de las materas con arena.']],
        ['Botar inservibles', 'Llantas, botellas y latas pueden convertirse en criaderos.', ['Llantas, botellas y latas.', 'Juguetes en el patio.']],
      ],
    }),
  ],
  serv: { h2: 'Revisemos dónde<br/>se está criando.' },
  fuentesList: [F.dengue2024, F.emergencia, F.dengue2025, F.criaderos, F.depositos, F.oms, F.fotoZancudo],
  starts: [
    ['Tengo muchos zancudos', 'Tengo muchos zancudos en casa y quiero saber de dónde vienen.'],
    ['Guardo agua en tanques', 'Guardo agua en tanques y baldes. ¿Cómo evito que se críe el zancudo?'],
    ['Es en mi negocio', 'Hay zancudos en mi negocio y quiero una evaluación.'],
  ],
});

const ratas = plaga('ratas-y-ratones', {
  title: 'Ratas y ratones en Cali | Truly Nolen Cali',
  desc: 'Ratas y ratones en Cali: leptospirosis, focos en zonas comerciales y lo que pide la norma para las basuras.',
  hero: { h1: 'Donde hay comida y basura,<br/>llegan las ratas.' },
  secciones: [
    tabla({
      ey: 'Por qué importa',
      h2: 'Un riesgo para<br/>la salud.',
      rows: [
        ['Leptospirosis', 'El Instituto Nacional de Salud señala a los roedores, sobre todo las ratas, como los principales reservorios de la leptospirosis.'],
        ['En Colombia', 'En 2024 se notificaron 9.681 casos de leptospirosis en el país.'],
        ['En Cali', 'El mismo informe ubica a Cali entre las entidades con mayor aumento de casos confirmados entre 2021 y 2024.'],
      ],
    }),
    tabla({
      ey: 'En Cali',
      h2: 'Dónde se han<br/>visto focos.',
      rows: [
        ['Zonas comerciales', 'En 2023 los sectores más afectados fueron el Parque del Perro y la Carrera 66, según El País Cali.'],
        ['Calle Novena', 'En 2026 hubo denuncias por ratas cerca de restaurantes de la calle Novena, en el sur de Cali.'],
        ['La causa', 'La Secretaría de Salud asoció esos focos, en gran medida, al mal manejo de los residuos sólidos.'],
      ],
    }),
    tabla({
      ey: 'En tu casa o negocio',
      h2: 'Quítales comida<br/>y refugio.',
      rows: [
        ['Basuras', 'La Ley 9 de 1979 pide guardar las basuras en recipientes que impidan la proliferación de insectos y roedores (artículo 28).', ['Canecas tapadas.', 'Sacar la basura en el horario de recolección.']],
        ['Restos de comida', 'No dejar comida al alcance, ni dentro ni fuera de la casa.', ['Alacenas cerradas.', 'Comida de mascotas guardada.']],
        ['Señales', 'Lo que conviene revisar y fotografiar.', ['Excrementos y roeduras.', 'Madrigueras en zonas verdes.']],
      ],
    }),
  ],
  serv: { h2: 'Cierra el paso<br/>donde estén.', cuales: ['hogares', 'comercios', 'industria'] },
  fuentesList: [F.lepto, F.roedores2023, F.roedores2026, F.ley9, F.fotoRata],
  starts: [
    ['Escucho ruidos en el techo', 'Escucho ruidos en el techo o en el cielo raso y creo que son ratas.'],
    ['Vi excremento', 'Encontré excremento de ratón en la cocina. ¿Qué hago?'],
    ['Es en mi negocio o bodega', 'Hay ratas en mi negocio o en mi bodega y necesito una evaluación.'],
  ],
});

const cucarachas = plaga('cucarachas', {
  title: 'Cucarachas en Cali | Truly Nolen Cali',
  desc: 'La cucaracha alemana y la americana en Cali: dónde se esconden, por qué los insecticidas caseros fallan y qué pide la norma.',
  hero: { h1: 'Salen de noche,<br/>se esconden de día.' },
  secciones: [
    tabla({
      ey: 'Las dos que más vemos',
      h2: 'Pequeña o grande,<br/>no son iguales.',
      rows: [
        ['Cucaracha alemana', 'La pequeña de cocina (<em>Blattella germanica</em>). Vive cerca de la comida, el calor y la humedad.'],
        ['Cucaracha americana', 'La más grande (<em>Periplaneta americana</em>). Universidad del Valle estudió sus poblaciones en Cali, Popayán y Buenaventura.'],
        ['Por qué importa saberlo', 'Cada una se esconde en sitios distintos, y el control cambia según cuál sea.'],
      ],
    }),
    tabla({
      ey: 'En Cali',
      h2: 'Cuando el insecticida<br/>ya no sirve.',
      rows: [
        ['Resistencia', 'Un estudio de 2009 encontró en Cali las primeras cepas de cucaracha alemana resistentes a la deltametrina, un insecticida común.'],
        ['Dónde', 'Las cepas más resistentes salieron de un club deportivo y de una plaza de mercado.'],
        ['Qué significa', 'Echar más del mismo producto no resuelve el problema: hay que encontrar dónde se esconden y cambiar el método.'],
      ],
    }),
    dato({
      ey: 'Un dato que pesa',
      h2: 'Lo que encontraron<br/>en Cali.',
      items: [['2009', 'primera evidencia de cucarachas alemanas resistentes a la deltametrina en Cali.', 'Revista Cubana de Medicina Tropical (2009)']],
    }),
    tabla({
      ey: 'Dónde buscar',
      h2: 'Los escondites<br/>de siempre.',
      rows: [
        ['Cocina', 'Calor, comida y humedad.', ['Detrás de la nevera y la estufa.', 'Debajo del lavaplatos.']],
        ['Baños y desagües', 'Por donde suben las grandes.', ['Sifones y rejillas.', 'Cajas de inspección.']],
        ['Negocios de alimentos', 'La norma pide un programa de control de plagas (Resolución 2674 de 2013, artículo 26).', ['Bodegas y mesones.', 'Canecas de basura.']],
      ],
    }),
  ],
  serv: { h2: 'Revisemos dónde<br/>se esconden.' },
  fuentesList: [F.cucaDelta, F.res2674, F.fotoCucaracha],
  starts: [
    ['Vi cucarachas en la cocina', 'Vi cucarachas pequeñas en la cocina. ¿Cómo empiezo?'],
    ['Vi una cucaracha grande', 'Vi una cucaracha grande que salió del sifón. ¿Qué hago?'],
    ['Es en mi negocio', 'Hay cucarachas en mi negocio y quiero una evaluación.'],
  ],
});

const hormigas = plaga('hormigas', {
  title: 'Hormigas en Cali | Truly Nolen Cali',
  desc: 'La hormiga loca y la hormiga fantasma en Cali: qué dicen los estudios de la Universidad del Valle y dónde revisar.',
  hero: { h1: 'Una fila en la cocina<br/>es solo la punta.' },
  secciones: [
    tabla({
      ey: 'Las que más vemos',
      h2: 'Hormigas de ciudad.',
      rows: [
        ['Hormiga loca', '<em>Paratrechina longicornis</em>. Se mueve rápido y sin rumbo fijo.'],
        ['Hormiga fantasma', '<em>Tapinoma melanocephalum</em>. Muy pequeña, de patas claras, casi transparente.'],
        ['En hospitales de Cali', 'Un estudio de la Universidad del Valle (2005) en centros de salud de Cartago, Tuluá, Cali y Buenaventura encontró que estas dos eran las más frecuentes.'],
      ],
    }),
    tabla({
      ey: 'Por qué importa',
      h2: 'No solo molestan.',
      rows: [
        ['Llevan bacterias', 'En ese estudio se aislaron 14 tipos de bacterias de las hormigas, entre ellas <em>Staphylococcus aureus</em> y <em>E. coli</em>.', ['Cocinas y alacenas.', 'Comida destapada.']],
        ['Hormiga faraón', '<em>Monomorium pharaonis</em> también apareció entre las especies que llevaban bacterias.', ['Grietas y enchufes.', 'Zonas húmedas.']],
        ['El nido', 'La fila lleva al nido: ahí está la solución, no en matar las que se ven.', ['Bordes de pisos y muros.', 'Matas y materas.']],
      ],
    }),
  ],
  serv: { h2: 'Revisemos de dónde<br/>vienen.' },
  fuentesList: [F.hormigas2005, F.hormigasUrbanas, F.res2674, F.fotoHormiga],
  starts: [
    ['Tengo hormigas en la cocina', 'Tengo hormigas en la cocina y no sé de dónde salen.'],
    ['Las hormigas dañan mis matas', 'Hay hormigas en el jardín que están dañando mis matas.'],
    ['Es en mi negocio', 'Hay hormigas en mi negocio y quiero una evaluación.'],
  ],
});

const comejen = plaga('comejen', {
  title: 'Comején en Cali | Truly Nolen Cali',
  desc: 'Comején en Cali: las dos especies más frecuentes, sus señales y cómo proteger la madera de tu casa.',
  hero: { h1: 'Cuando se ve,<br/>ya lleva tiempo.' },
  secciones: [
    tabla({
      ey: 'Las especies de Cali',
      h2: 'Dos tipos,<br/>dos tratamientos.',
      rows: [
        ['De madera seca', '<em>Cryptotermes brevis</em>. Vive dentro de muebles, puertas y marcos.'],
        ['Subterráneo', '<em>Heterotermes convexinotatus</em>. Vive en la tierra y sube a la madera.'],
        ['En Cali', 'Un estudio presentado en 2011 encontró que estas dos son las especies más frecuentes en la ciudad.'],
      ],
    }),
    tabla({
      ey: 'Señales',
      h2: 'Lo que deja<br/>a su paso.',
      rows: [
        ['Tubitos de barro', 'El daño del subterráneo se nota por los túneles finos de barro que recorren paredes y techos.', ['Paredes y cielo raso.', 'Donde la madera toca el muro.']],
        ['Madera hueca', 'Por dentro la madera queda en galerías, aunque por fuera se vea bien.', ['Marcos y guardaescobas.', 'Closets y muebles.']],
        ['Insectos con alas', 'Salen para formar colonias nuevas. Ver alas no siempre significa que la casa esté infestada.', ['Alas cerca de ventanas.', 'Bombillos encendidos.']],
      ],
    }),
    tabla({
      ey: 'Qué hacer',
      h2: 'Primero se ubica<br/>la colonia.',
      rows: [
        ['Inspección', 'La guía de la Universidad de California (UC IPM) pide una inspección cuidadosa para ubicar daños y colonias antes de tratar.'],
        ['Madera lejos de la tierra', 'Quitar la madera que toca el suelo, los restos enterrados y el exceso de humedad.'],
        ['Productos', 'Los inmunizantes de madera son de los pocos productos que la norma colombiana permite en categorías toxicológicas altas, por eso los aplica personal capacitado (Decreto 1843 de 1991, artículo 114).'],
      ],
    }),
  ],
  serv: { h2: 'Revisemos tu<br/>madera.', cuales: ['hogares', 'industria'] },
  fuentesList: [F.termitasCali, F.ucipm, F.dec1843, F.fotoComejen],
  starts: [
    ['Encontré bolitas finas', 'Encontré bolitas finas cerca de un mueble de madera. ¿Es comején?'],
    ['Vi tubitos de barro', 'Vi tubitos de barro en la pared. ¿Qué hago?'],
    ['Tengo muebles dañados', 'Tengo muebles y marcos de madera dañados y quiero una evaluación.'],
  ],
});

const alacranes = plaga('alacranes', {
  title: 'Alacranes en Cali | Truly Nolen Cali',
  desc: 'Alacranes en Cali y el Valle del Cauca: cuándo aparecen, cómo prevenirlos en casa y qué hacer ante una picadura.',
  hero: { h1: 'Se esconden donde<br/>no miras.' },
  secciones: [
    tabla({
      ey: 'Lo que hay que saber',
      h2: 'Alacrán o escorpión,<br/>es el mismo.',
      rows: [
        ['En el Valle', 'En el Valle del Cauca hay escorpiones de importancia médica, según Contexto Ganadero (2018).'],
        ['Cuándo salen', 'Aparecen más con el aumento de las lluvias y el calor.'],
        ['Dónde se esconden', 'Escombros, leña, material de construcción y rincones oscuros.'],
      ],
    }),
    dato({
      ey: 'Un dato que tranquiliza',
      h2: 'La mayoría de<br/>las picaduras.',
      items: [['85 %', 'de las picaduras de escorpión solo causa dolor e inflamación. Aun así, siempre hay que consultar al médico.', 'Contexto Ganadero (2018)']],
    }),
    tabla({
      ey: 'En casa',
      h2: 'Cierra el paso.',
      rows: [
        ['Ropa y zapatos', 'Revisarlos antes de ponértelos.', ['Zapatos sacudidos.', 'Ropa colgada, no en el piso.']],
        ['Sifones y rejillas', 'Taparlos con malla en el baño, la cocina y el lavadero.', ['Rejillas con malla.', 'Burletes en las puertas.']],
        ['Patio', 'No acumular escombros, leña ni material de construcción.', ['Escombros retirados.', 'Leña lejos de la casa.']],
      ],
    }),
    tabla({
      ey: 'Si hay una picadura',
      h2: 'Qué hacer.',
      rows: [
        ['Hielo', 'Poner hielo en la zona de la picadura.'],
        ['Sin remedios caseros', 'No aplicar remedios caseros: ir al médico.'],
        ['El alacrán', 'Si se puede hacer sin riesgo, llevarlo en un frasco para identificarlo.'],
      ],
    }),
  ],
  serv: { h2: 'Revisemos por dónde<br/>pueden entrar.' },
  fuentesList: [F.alacranes, F.alacranArg, F.fotoAlacran],
  starts: [
    ['Encontré un alacrán', 'Encontré un alacrán en mi casa. ¿Qué hago?'],
    ['Vivo cerca de la ladera', 'Vivo cerca de la ladera en Cali y quiero prevenir los alacranes.'],
    ['Hay niños en casa', 'Hay niños en casa y vi un alacrán. ¿Cómo los protejo?'],
  ],
});

// ---------- Blog ----------
const blogIndex = {
  ref: 'blog',
  title: 'Blog de control de plagas en Cali | Truly Nolen Cali',
  desc: 'Guías sobre las plagas de Cali, con cada dato respaldado por su fuente.',
  main: [
    `<section class="section blog-head"><a class="text-link" href="${ROOT}">← Volver al inicio</a><p class="eyebrow">Blog · Cali</p><h1>Blog de control de plagas</h1><p>Guías sobre las plagas de aquí, con cada dato respaldado por su fuente.</p></section>`,
    `<section class="section blog-lista"><div class="blog-grid">${blogCard(BLOG.zancudos, 'blog-card blog-featured')}${blogCard(BLOG.comejen)}</div></section>`,
    cierre(null),
  ].join(''),
};

const articulo = (b, { alt, cuerpo, preguntas, fuentesList, otro, lectura }) => ({
  ref: `blog/${b.slug}`,
  title: `${b.titulo} | Truly Nolen Cali`,
  desc: b.resumen,
  main: [
    `<article class="section blog-articulo"><nav class="blog-migas" aria-label="Ruta"><a href="${ROOT}">Inicio</a> · <a href="${ROOT}blog/">Blog</a> · <span>${b.tema}</span></nav><p class="eyebrow">${b.tema}</p><h1>${b.titulo}</h1><p class="blog-entrada">${b.resumen}</p><p class="blog-meta">Truly Nolen Cali · ${FECHA_TXT} · ${lectura} min de lectura</p><img class="blog-portada" src="${A(b.img)}" alt="${alt}"/><div class="blog-cuerpo">${cuerpo}</div></article>`,
    faq({ ey: b.tema, h2: 'Preguntas frecuentes', items: preguntas }),
    fuentes(fuentesList),
    `<section class="section"><div class="section-heading"><p class="eyebrow">Blog</p><h2>Artículos relacionados</h2></div><div class="blog-grid">${blogCard(otro)}</div></section>`,
    cierre(null),
  ].join(''),
});

const postZancudos = articulo(BLOG.zancudos, {
  lectura: 5,
  alt: 'Zancudo Aedes aegypti posado sobre la piel',
  otro: BLOG.comejen,
  cuerpo: `<p>¿Cómo acabar con los zancudos en casa? Quitándoles el agua donde se crían. El zancudo que transmite el dengue, el <em>Aedes aegypti</em>, pone sus huevos en el agua que guardamos: tanques, baldes, floreros, llantas y platos de materas. Si esa agua desaparece, el zancudo no tiene dónde nacer.</p>
<h2>En Cali el dengue no es un tema lejano</h2>
<p>El 11 de junio de 2024 la Alcaldía de Cali declaró la emergencia sanitaria por el avance del dengue. Ese día, según El País Cali, ya había «más de 20.000 contagiados» y cuatro personas habían muerto.</p>
<p>Hasta el 16 de octubre de 2024 la Alcaldía contaba 34.463 casos de dengue en la ciudad. En 2025 la cifra bajó mucho: 3.088 casos hasta la semana epidemiológica 46, según el reporte del 5 de diciembre de 2025. Bajó, pero no desapareció, y el zancudo sigue criándose en las casas.</p>
<h2>El agua de la casa es el criadero</h2>
<p>En mayo de 2025 los equipos de la Alcaldía revisaron 12.924 depósitos de agua en Cali y 562 tenían larvas. Es decir, el criadero no está lejos: está en el patio, en el lavadero o en la terraza.</p>
<h2>La rutina de cada semana, según la Alcaldía de Cali</h2>
<p>La Secretaría de Salud Pública de Cali publicó estas recomendaciones en mayo de 2025, durante la temporada de lluvias:</p>
<ul><li><strong>Lava y cepilla</strong> tanques, cubetas y floreros al menos dos veces a la semana. Cepillar importa: los huevos quedan pegados a las paredes del recipiente.</li><li><strong>Tapa bien</strong> los recipientes que almacenan agua.</li><li><strong>Voltea</strong> los objetos que no estés usando y puedan acumular agua, como baldes o juguetes.</li><li><strong>Bota</strong> llantas, botellas, latas y otros inservibles que puedan convertirse en criaderos.</li></ul>
<p>En diciembre de 2025 la Alcaldía agregó otras medidas: poner arena en los platos de las materas, usar toldillo, poner mallas en puertas y ventanas, y aplicarse repelente.</p>
<h2>Cuándo pedir ayuda</h2>
<p>Si aun con la rutina sigues viendo muchos zancudos, puede haber un criadero que no has encontrado: una canal del techo tapada, un tanque sin tapa o agua acumulada en un rincón del patio. Ahí sirve una revisión con ojos de experto.</p>
<p>Escríbele a Truly AI, el asistente de Truly Nolen International, por el chat del sitio o por WhatsApp. Cuéntale qué ves y dónde, y te orienta en el siguiente paso. Si quieres repasar los datos, entra a la <a href="${ROOT}plagas/zancudos/">guía de zancudos</a>.</p>`,
  preguntas: [
    ['¿Cada cuánto debo lavar los tanques?', 'La Alcaldía de Cali recomienda lavar y cepillar tanques, cubetas y floreros al menos dos veces a la semana.'],
    ['¿Basta con tapar el tanque?', 'Ayuda, pero no basta. También hay que voltear lo que no se usa, botar inservibles y revisar materas y canales. Los huevos quedan pegados a las paredes, por eso hay que cepillar.'],
    ['¿Cuántos casos de dengue hubo en Cali?', 'Según la Alcaldía, 34.463 casos en 2024 hasta el 16 de octubre, y 3.088 en 2025 hasta la semana epidemiológica 46.'],
  ],
  fuentesList: [F.emergencia, F.dengue2024, F.dengue2025, F.depositos, F.criaderos, F.oms],
});

const postComejen = articulo(BLOG.comejen, {
  lectura: 5,
  alt: 'Comején sobre madera dañada, rodeado de las bolitas finas de su excremento',
  otro: BLOG.zancudos,
  cuerpo: `<p>¿Cómo eliminar el comején de tu casa? Primero hay que saber qué tipo tienes y dónde está la colonia, y después tratar ese punto. La guía de la Universidad de California (UC IPM) advierte que los pesticidas caseros contra las termitas «generalmente no son efectivos».</p>
<h2>En Cali hay dos tipos de comején y no se tratan igual</h2>
<p>Un estudio presentado en 2011 en la Conferencia Internacional de Plagas Urbanas (ICUP), con investigadores de la Universidad del Valle, encontró que las especies más frecuentes en Cali son <em>Cryptotermes brevis</em> y <em>Heterotermes convexinotatus</em>.</p>
<ul><li><strong>Comején de madera seca</strong> (<em>Cryptotermes brevis</em>): vive dentro de la madera, en muebles, puertas y marcos.</li><li><strong>Comején subterráneo</strong> (<em>Heterotermes convexinotatus</em>): vive en la tierra y sube a la madera por túneles de barro.</li></ul>
<p>UC IPM lo resume así: «El manejo de cada especie de termitas es diferente». Por eso el primer paso es saber cuál tienes, antes de comprar cualquier producto.</p>
<h2>Las señales del comején</h2>
<ul><li><strong>Tubitos de barro</strong> en paredes y techos: según el estudio de 2011, así se nota el daño del comején subterráneo en Cali.</li><li><strong>Bolitas finas</strong> cerca de la madera: son el excremento del comején de madera seca. No las barras antes de fotografiarlas, porque ayudan a identificarlo.</li><li><strong>Insectos con alas</strong> cerca de ventanas y bombillos. UC IPM aclara que ver enjambres de termitas voladoras «no siempre significa» que tu casa esté infestada.</li></ul>
<h2>Cómo eliminar el comején: primero se ubica la colonia</h2>
<p>La guía de UC IPM dice que hace falta «una inspección cuidadosa» para ubicar los daños y las colonias y aprovechar mejor los tratamientos localizados. Si el comején ya entró a la casa, propone:</p>
<ol><li>Destruir los tubos de barro que el comején subterráneo haya construido entre el suelo y la madera.</li><li>Quitar la madera infestada y eliminar el exceso de humedad.</li></ol>
<p>En Colombia, los inmunizantes de madera son de los pocos productos que la norma permite en categorías toxicológicas altas (Decreto 1843 de 1991, artículo 114). Por eso no es un trabajo para hacer con productos comprados por tu cuenta.</p>
<h2>La madera que toca el suelo es la puerta del comején subterráneo</h2>
<p>Para que no vuelva, UC IPM recomienda mantener la madera lejos de la tierra y seca: usar bases de concreto para lo que toque el suelo, retirar madera vieja y restos enterrados cerca de la casa, y reparar grietas y filtraciones.</p>
<h2>Truly AI te ayuda a dar el primer paso hoy mismo</h2>
<p>Fotografía las señales y anota dónde están: puertas, marcos, closets o muebles. Con eso ya puedes escribirle a Truly AI, el asistente de Truly Nolen International, por el chat del sitio o por WhatsApp. Te orienta en el siguiente paso. Si quieres repasar las señales, entra a la <a href="${ROOT}plagas/comejen/">guía de comején</a>.</p>`,
  preguntas: [
    ['¿Cómo eliminar el comején con remedios caseros?', 'La guía de termitas de la Universidad de California (UC IPM, 2025) dice que los pesticidas caseros contra las termitas «generalmente no son efectivos». Antes de gastar en ellos, escríbele a Truly AI y te orienta en el siguiente paso.'],
    ['¿Qué son los tubitos de barro en la pared?', 'Son los túneles del comején subterráneo. Un estudio de 2011 sobre Cali los describe como la señal de su daño en paredes y techos.'],
    ['¿Ver comején con alas significa que mi casa está infestada?', 'No siempre, según UC IPM. Si los ves, fotografíalos, anota por dónde salieron y escríbele a Truly AI.'],
  ],
  fuentesList: [F.termitasCali, F.ucipm, F.dec1843],
});

// ---------- Legal ----------
const legal = (slug, h1, texto) => ({
  ref: slug,
  title: `${h1} | Truly Nolen Cali`,
  desc: `${h1} del sitio de Truly Nolen Cali.`,
  main: `<section class="section legal-content"><p class="eyebrow">Truly Nolen · Cali</p><h1>${h1}</h1><p>${texto}</p><a class="button" href="${ROOT}">← Volver al sitio</a></section>`,
});

export const PAGES = {
  'servicios/hogares': hogares,
  'servicios/comercios': comercios,
  'servicios/industria': industria,
  'plagas/zancudos': zancudos,
  'plagas/ratas-y-ratones': ratas,
  'plagas/cucarachas': cucarachas,
  'plagas/hormigas': hormigas,
  'plagas/comejen': comejen,
  'plagas/alacranes': alacranes,
  blog: blogIndex,
  [`blog/${BLOG.zancudos.slug}`]: postZancudos,
  [`blog/${BLOG.comejen.slug}`]: postComejen,
  privacidad: legal('privacidad', 'Privacidad', 'Lo que escribas en el chat de este sitio o por WhatsApp lo recibe y responde Truly AI, el asistente de Truly Nolen International. Úsalo para tu consulta sobre control de plagas y no compartas datos sensibles, como claves, datos bancarios o información médica.'),
  terminos: legal('terminos', 'Términos de uso', 'La información de este sitio es general. Los servicios, la cobertura, los precios y las condiciones se confirman directamente con Truly Nolen antes de cualquier visita o servicio, y no constituyen una oferta.'),
  accesibilidad: legal('accesibilidad', 'Accesibilidad', 'Puedes recorrer este sitio con el teclado, ampliar el texto y usar la preferencia de movimiento reducido de tu dispositivo. Si tu dispositivo pide reducir el movimiento, se muestra una imagen fija. Si encuentras una dificultad de acceso, cuéntasela a Truly AI en el chat.'),
};

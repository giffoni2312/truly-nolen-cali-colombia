# Cali con la receta del 5-nov-2026 — qué se hizo

Respaldo previo: `respaldos/2026-11-05-antes-receta-5nov/` (src, build, check, publicar, assets, site) y la referencia
vieja de Venezuela en `referencia/site-2026-11-04/`.

## Cómo se hizo
La referencia de Venezuela (borrador vivo) ya es la réplica de globaltni.com/es de la receta del 5-nov (R1–R19, de usted).
Se volvió a bajar con `node tools/mirror.mjs` y Cali se rearmó encima con su contenido propio.

## Lo que quedó
- **Encabezado, franja gris, lupa y desplegables (R4, R5, R18):** los de la referencia. La lupa abre «¿Qué está buscando?»
  y busca en las páginas de Cali (`build.mjs` arma el índice `#gt-buscar-indice` con las páginas de Cali). Sin selector de idioma ni franquicias.
- **Portada:** la de la referencia con lo de Cali (`src/pages.mjs`, `PORTADA.replace`): filas de sectores a su ancla en
  Comercios (Salud → `#healthcare`, Comercio de alimentos → `#food-processing`, Logística → `#logistics`; Industria a su
  página), foto comercial propia de Cali, plagas y blog de Cali, cobertura por comuna/barrio y la dirección de la oficina en el cierre.
- **Zonas (R10):** diagrama oficial de TNI (`zonas-truly-oficial.jpg`). **Pie (R11):** ilustración de globaltni con su lema y «Volver al inicio»;
  la columna «Hablemos» lleva el teléfono y la dirección de la oficina de Cali. **Cifras (R12), carrito del chat (R8), hero de celular (R6), letras (R7):** de la referencia.
- **Hogares y Comercios (R17):** son las páginas de globaltni tal cual (marca `<!--gt-pagina:…-->`), con los enlaces llevados a Cali.
  El contenido propio que tenían (tabla de la Resolución 2674, «Quién fumiga y quién vigila», zonas detalladas) ya no sale; sigue en
  `src/pages.mjs` (objetos `hogares` y `comercios`, sin usar) y en el respaldo.
- **Blog:** índice con el diseño nuevo de la referencia (lista tipo diario), los 4 artículos de Cali.
- **Trato (R3):** todo el sitio pasó de tú a usted (`tools/pasar-a-usted-2026-11-05.mjs`, 65 frases). Tarjeta de voz actualizada
  (`receta/oficinas/cali/voz-humana/voz-card.md`; la de tú quedó como `voz-card-tu-hasta-2026-11-04.md`). Corpus nuevo armado.
- **CSS propio (`src/receta.css`):** se quitaron las reglas generales con `!important` del 4-nov (pisaban la réplica, R19). Quedan solo
  el marco de las fotos recortadas de plagas y el estilo de la línea de la oficina.

## Comprobado (local)
- `node build.mjs`: 18 páginas. `node check.mjs`: sin errores (1 aviso: el blog de Cali tiene 4 artículos y Venezuela 2).
- `node tools/trato.mjs`: 0 formas de tú en las 18 páginas.
- `node tools/replica.mjs` (navegador, 390/768/961/1024/1100/1280/1440): 18 páginas × 7 anchos iguales a Venezuela en lo medido
  (estilos, sin desborde horizontal, menú en una línea, títulos sin partir, toques ≥44 px).
- `node tools/conducta.mjs` (390/768/1024/1440, Cali y Venezuela): la lupa abre la búsqueda y no el chat («zancudos» → 2 resultados);
  encabezado pegado al bajar 1500 px: top −44 en computadora y 0 en celular, igual que Venezuela; botón del chat 112×108 a 16/12
  (celular 88×89 a 10/10), igual; 0 imágenes rotas y 0 enlaces o anclas rotas en las 18 páginas.
- Capturas lado a lado Cali | Venezuela en `capturas/5nov/` (portada, hogares, comercios, industria, zancudos, blog; 1440 y 390).

## Falta
- **Juez de voz humana y ojo de diseño independientes:** los tiene que correr otro agente (el que hizo el cambio no se juzga). Corpus listo en
  `receta/oficinas/cali/voz-humana/corpus.md`; el veredicto va en `receta/oficinas/cali/voz-humana/veredicto-5nov.md`
  (no en `docs/`: `publicar.mjs` borra y publica esa carpeta).
- **Fotos de espacios (paso 8):** Carlos elige. Candidatas reales de Unsplash (licencia gratis) en `respaldos/2026-11-05-candidatas-unsplash/`
  con `candidatas.json` (autor, página, licencia). No se puso ninguna. La foto comercial de la portada sigue siendo la de Cali con el
  técnico de camisa amarilla (uniforme viejo).
- **Video del carro con la receta v4 (5b):** necesita Midjourney y los insumos de Pablo (reference-frame.png, beetle-recorte.png, etc.). No está en este PC.
- **Candados oficiales:** `gate-replica`, `comparar-identico.mjs` (R19, 0 diferencias elemento por elemento), `candado-oficinas.sh`, `gate-fotos`:
  no están en este PC. Lo medido aquí es un reemplazo, no los sustituye.

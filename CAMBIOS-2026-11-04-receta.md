# Cali con la receta del 4-nov-2026 — qué se corrigió (PUBLICADO, commit 3214902, rama borrador)

Respaldo previo: `respaldos/2026-11-04-antes-receta-4nov/`. Mismo trabajo que Bogotá (`Desktop/truly-colombia`), en «tú».

## Errores que tenía (frente a la receta nueva)
1. Las filas de «Comercio e industria» de la portada iban 2 de 3 a la MISMA página (Alimentos y comercio / Salud).
2. Comercios no tenía los 4 sectores de globaltni; «¿Quién se beneficia?» solo traía 2 grupos.
3. Faltaba la fuente de globaltni (servicio comercial).
4. Desborde lateral de 8 px por la acuarela del pie (100vw).
5. El texto arriba de las filas no coincidía con los sectores.

## Lo que se corrigió
- `src/sectores.mjs` (nuevo): los 4 sectores con el diseño de globaltni (ct-*), justo después de la entrada de Comercios:
  barra «Encuentra tu sector», Salud en negro, Venta de alimentos en gris, Logística con línea amarilla, «Volver a los sectores ↑»,
  «Cada industria merece atención» y «Más formas de proteger tu mundo». Fotos por sector en `FOTOS`
  (`assets/cali-sector-*.jpg`, salen solo si existen: columna vacía hasta que Carlos elija).
- `src/ct-globaltni.css` y `src/ct-ajustes.css`: copiados de Bogotá (reglas de globaltni + tamaños medidos 390/1024/1280).
- `src/pages.mjs`: bloque `{ k: 'html', html: sectoresHtml() }` en Comercios, fuera la tabla vieja «¿Quién se beneficia?»,
  fuente `F.gtComercial`; en PORTADA las filas Salud / Venta de alimentos / Logística / Industria (cada una a su ancla) y el
  texto «salud, venta de alimentos, logística e industria». OJO: la portada sale de la referencia de Venezuela + PORTADA.replace
  (`src/portada.mjs` NO se usa).
- `src/receta.css`: `body{overflow-x:clip}` y margen de las anclas bajo el menú.
- `check.mjs`: acepta el bloque de sectores en Comercios y revisa que estén los 4 en orden justo después de la entrada.

## Comprobado
`node check.mjs`: sin errores (los avisos de botones ya estaban). Navegador 1280 y 390: 18 páginas sin desborde, un solo h1,
sin frases repetidas; cada fila de la portada baja a su sector. En vivo: sectores y filas OK.

## Falta (igual que Bogotá)
Fotos de sectores y técnico con uniforme nuevo (Carlos elige), ojo de diseño final, video del carro, gates del dueño.

// Builds site/galeria/index.html: numbered candidate photos (Wikimedia Commons) with license and author,
// so the owner can choose. Usage: node tools/galeria.mjs
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(HERE, 'site', 'galeria');
const UA = { 'User-Agent': 'TrulyCaliBorrador/1.0 (giffoni@beautonomous.ai)' };

const GRUPOS = [
  ['Zancudo (Aedes aegypti)', ['Aedes aegypti.jpg', 'Aedes aegypti biting human.jpg', 'Aedes aegypti on leaf.jpg', 'Aedes aegypti feeding.jpg']],
  ['Rata (Rattus norvegicus)', ['Brown rat (Rattus norvegicus) Drenthe 2.jpg', 'Rattus norvegicus 74 Sunbury Street Geebung P1012741.jpg', 'Rattus norvegicus-Rochefort.JPG']],
  ['Cucaracha alemana (Blattella germanica)', ['German cockroach (Blattella germanica) probably (43118262090).jpg', 'Blattella germanica 1236168.jpg', 'Cuca molla alemanya blattella germanica 2014-06-16 18-57.JPG']],
  ['Cucaracha americana (Periplaneta americana)', ['Periplaneta americana - American cockroach (25859665686) (cropped).jpg', 'Periplaneta americana (41751987960).jpg', 'Cockroach July 2013-1.jpg']],
  ['Hormiga loca y hormiga fantasma', ['Longhorn Crazy Ant - Paratrechina longicornis, Dagny Johnson State Park, Key Largo, Florida.jpg', 'Longhorn Crazy Ant.jpg', 'Tapinoma melanocephalum (10.3897-zookeys.978.55767) Figure 17.jpg']],
  ['Comején (termitas)', ['Colonia de Cryptotermes Brevis Walker.jpg', 'Heterotermes alates.jpg', 'Workers & Soldiers.jpg', 'Heterotermes aureus (Arizona, USA).jpg']],
  ['Alacrán de Colombia (Tityus)', ['Tityus columbianus.jpg', 'Tityus columbianus 38748285.jpg', 'Tityus columbianus 40822889.jpg', 'Tityus columbianus 248214899.jpg']],
  ['Lugares de Cali (para la portada)', ['Av Colombia - Oeste de Cali.jpg', 'Cali downtown- skyline.jpg', 'Avenida Colombia Kolombio-Avenuo 05.JPG', 'Avenida Colombia Kolombio-Avenuo 08.JPG', 'Avenida Colombia Kolombio-Avenuo 15.JPG', 'Avenida Colombia Kolombio-Avenuo 28.JPG', 'Avenida Colombia Kolombio-Avenuo 30.JPG', 'Avenida Colombia Kolombio-Avenuo 13.JPG', 'Cristo Rey en Cali, Colombia.jpg', 'Monumento a Cristo Rey (Cali).JPG', 'Bandera grande de Cali en la entrada sur de la cuidad.jpg', 'Santiago de Cali.jpg', 'Panorámica nocturna de Cali 2023.jpg', 'Cali.jpg', 'Farallones de Cali Naturaleza.jpg', 'Panorámica - Cali - Valle del Cauca - Colombia.jpg']],
];

const clean = (v) => (v?.value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
mkdirSync(join(OUT, 'img'), { recursive: true });
let n = 0;
let html = '';
for (const [grupo, files] of GRUPOS) {
  const titles = files.map((f) => 'File:' + f).join('|');
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=900&format=json`;
  const data = await (await fetch(api, { headers: UA })).json();
  const byTitle = Object.fromEntries(Object.values(data.query.pages).map((p) => [p.title, p]));
  const norm = Object.fromEntries((data.query.normalized || []).map((x) => [x.from, x.to]));
  html += `<h2>${grupo}</h2><div class="grid">`;
  for (const f of files) {
    const p = byTitle[norm['File:' + f] || 'File:' + f];
    if (!p || !p.imageinfo) { console.log('No encontrada:', f); continue; }
    n++;
    const i = p.imageinfo[0];
    const m = i.extmetadata || {};
    const local = `img/${String(n).padStart(2, '0')}.jpg`;
    if (!existsSync(join(OUT, local))) {
      const buf = Buffer.from(await (await fetch(i.thumburl, { headers: UA })).arrayBuffer());
      writeFileSync(join(OUT, local), buf);
    }
    html += `<figure><img src="${local}" loading="lazy"><figcaption><b>${n}</b> · ${i.width}×${i.height} · ${clean(m.LicenseShortName)}<br><small>${clean(m.Artist).slice(0, 70)} · <a href="${i.descriptionurl}" target="_blank">ver original</a></small></figcaption></figure>`;
  }
  html += '</div>';
}
writeFileSync(join(OUT, 'index.html'), `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Galería Cali</title><style>body{font:15px system-ui;margin:0;padding:16px 24px;background:#f7f6f1;color:#1b222b}h1{margin:0 0 4px}h2{margin:32px 0 12px;border-bottom:3px solid #ffd400;padding-bottom:6px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}figure{margin:0;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px #0002}img{width:100%;height:240px;object-fit:cover;display:block}figcaption{padding:10px 12px}b{background:#ffd400;padding:2px 8px;border-radius:6px;font-size:17px}small{color:#666}</style><h1>Fotos reales para Truly Nolen Cali</h1><p>Todas de Wikimedia Commons con licencia libre (se da crédito al autor). Dime los números que te gustan.</p>${html}</html>`);
console.log(`Galería lista: ${n} fotos`);

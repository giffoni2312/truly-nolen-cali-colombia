// Downloads the chosen pest photos from Wikimedia Commons (1600 px) to tools/out/plagas/.
import { mkdirSync, writeFileSync } from 'node:fs';
const UA = { 'User-Agent': 'TrulyCaliBorrador/1.0 (giffoni@beautonomous.ai)' };
const CHOSEN = {
  zancudo: 'Aedes aegypti biting human.jpg',
  rata: 'Rattus norvegicus-Rochefort.JPG',
  cucaracha: 'Periplaneta americana - American cockroach (25859665686) (cropped).jpg',
  comejen: 'Colonia de Cryptotermes Brevis Walker.jpg',
  alacran: 'Tityus columbianus.jpg',
};
mkdirSync('tools/out/plagas', { recursive: true });
for (const [k, f] of Object.entries(CHOSEN)) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:' + f)}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1600&format=json`;
  const p = Object.values((await (await fetch(api, { headers: UA })).json()).query.pages)[0];
  const i = p.imageinfo[0], m = i.extmetadata;
  const clean = (v) => (v?.value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  writeFileSync(`tools/out/plagas/${k}.jpg`, Buffer.from(await (await fetch(i.thumburl, { headers: UA })).arrayBuffer()));
  console.log(`${k} | ${clean(m.Artist).slice(0, 60)} | ${clean(m.LicenseShortName)} | ${i.descriptionurl}`);
}

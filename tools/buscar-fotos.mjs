// Searches Wikimedia Commons for free-licensed photos and lists candidates (title, size, license, author, thumb url).
// Usage: node tools/buscar-fotos.mjs "search terms" [limit]
const [q, limit = '12'] = process.argv.slice(2);
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = { 'User-Agent': 'TrulyCaliBorrador/1.0 (giffoni@beautonomous.ai)' };

const url = `${API}?action=query&generator=search&gsrnamespace=6&gsrlimit=${limit}&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=900&format=json`;
const data = await (await fetch(url, { headers: UA })).json();
const pages = Object.values(data.query?.pages || {}).sort((a, b) => a.index - b.index);
const out = pages.map((p) => {
  const i = p.imageinfo[0];
  const m = i.extmetadata || {};
  const clean = (v) => (v?.value || '').replace(/<[^>]+>/g, '').trim();
  return { title: p.title.replace(/^File:/, ''), w: i.width, h: i.height, lic: clean(m.LicenseShortName), autor: clean(m.Artist).slice(0, 60), thumb: i.thumburl, page: i.descriptionurl };
});
console.log(JSON.stringify(out, null, 1));

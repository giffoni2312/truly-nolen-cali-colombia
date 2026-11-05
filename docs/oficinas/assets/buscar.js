// Buscador de la oficina, como el de globaltni.com (4-nov-2026): la lupa abre «¿Qué está buscando?» y filtra las páginas
// de la oficina (servicios, plagas, blog y secciones de la portada). El índice lo arma el generador en #gt-buscar-indice.
(() => {
  const datos = document.getElementById('gt-buscar-indice');
  const dialogo = document.querySelector('.search-dialog');
  if (!datos || !dialogo) return;
  const { items, textos } = JSON.parse(datos.textContent);
  const campo = dialogo.querySelector('#site-search');
  const lista = dialogo.querySelector('.search-results');
  const cuenta = dialogo.querySelector('.search-count');
  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const pintar = () => {
    const q = norm(campo.value.trim()); const terms = q.split(/\s+/).filter(Boolean);
    const filas = items.map((it, i) => {
      const titulo = norm(it[0]), todo = norm(it[0] + ' ' + it[1] + ' ' + it[3]);
      if (!terms.every(x => todo.includes(x))) return null;
      const rango = !q ? 0 : titulo === q ? 100 : titulo.startsWith(q) ? 80 : titulo.includes(q) ? 60 : norm(it[3]).includes(q) ? 40 : 10;
      return { it, i, rango };
    }).filter(Boolean).sort((a, b) => b.rango - a.rango || a.i - b.i);
    lista.replaceChildren();
    for (const { it: [titulo, , url, cat] } of filas) {
      const li = document.createElement('li'), a = document.createElement('a'), sp = document.createElement('span'), sm = document.createElement('small');
      sp.textContent = titulo; sm.textContent = cat + ' →'; a.href = url; a.append(sp, sm); li.append(a); lista.append(li);
    }
    cuenta.textContent = !q ? '' : filas.length === 1 ? textos.uno : filas.length ? textos.varios.replace('{n}', filas.length) : textos.cero;
  };
  document.querySelectorAll('.gt-buscar').forEach(b => b.addEventListener('click', () => {
    const menu = document.querySelector('.country-menu-toggle[aria-expanded="true"]'); if (menu) menu.click();
    if (typeof dialogo.showModal === 'function') dialogo.showModal(); else dialogo.setAttribute('open', '');
    pintar(); campo.focus();
  }));
  dialogo.querySelector('.search-close').addEventListener('click', () => dialogo.close());
  dialogo.addEventListener('click', ev => { if (ev.target === dialogo) dialogo.close(); });
  lista.addEventListener('click', ev => { if (ev.target.closest('a')) dialogo.close(); });
  campo.addEventListener('input', pintar);
})();

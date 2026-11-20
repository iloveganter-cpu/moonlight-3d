  // ---------- каталог: панель разделов слева + выезжающая шторка, товары Тильды справа
  function mlCatalog(){
    const rec2 = D.querySelector('.t-rec[data-record-type="2861"]');
    if (!rec2 || rec2.querySelector('.ml-cat')) return;
    const cat = rec2.querySelector('.t-catalog');
    const parts = cat && [...cat.querySelectorAll('.t-catalog__parts-above-item')];
    if (!cat || !parts.length) return false;   // каталог ещё не загрузился
    // разделы и подразделы — из меню шапки (первое вхождение каждого раздела)
    const groups = [], seen = new Set();
    const nice = t => t === t.toUpperCase() ? t.charAt(0) + t.slice(1).toLowerCase() : t;
    D.querySelectorAll('.t3113 li.t-menu-base__list-item').forEach(li => {
      const a = li.querySelector('.t-menu__link-item');
      const subs = [...li.querySelectorAll('a.t-menusub__link-item')];
      if (!a || !subs.length) return;
      const name = nice(a.textContent.trim()); if (!name || seen.has(name)) return; seen.add(name);
      groups.push({name, subs: subs.map(s => ({t: s.textContent.trim(), h: s.getAttribute('href') || '#'}))});
    });
    // бренды — из логотипов слайдера T738
    const brands = [...D.querySelectorAll('.t738__item')].map(it => {
      const a = it.querySelector('a'), i = it.querySelector('img'); const src = i && (i.getAttribute('data-original') || i.src);
      return src && !/empty\//.test(src) ? {h: a ? a.getAttribute('href') : '', src, alt: (i.alt || '').trim()} : null; }).filter(Boolean);
    const ICONS = [
      '<path d="M12 2v5M6 10h12M6 10l-2 5h5l-3-5m12 0l2 5h-5l3-5M12 7l-2 3h4l-2-3M9 15h6l-1 4h-4z"/>',            // люстра
      '<path d="M2 6h20M5 6v3m14-3v3M7 6l2 7m8-7l-2 7M8 13h3l-1 4h-1zm5 0h3l-1 4h-1z"/>',                             // шинопровод
      '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',         // лампа
      '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9.5" cy="12" r="1"/><circle cx="14.5" cy="12" r="1"/>', // розетка
      '<path d="M12 2v20M2 12h20M12 7l1.5 3.5L17 12l-3.5 1.5L12 17l-1.5-3.5L7 12l3.5-1.5z"/>'                          // звезда
    ];
    const ico = i => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[i] || ICONS[4]}</svg>`;
    const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
    const items = groups.map((g, i) => ({name: g.name, icon: Math.min(i, 3), n: g.subs.length + ' разделов', body:
      `<div class="ml-sh-links">${g.subs.map(s => `<a href="${esc(s.h)}">${esc(s.t)}<i aria-hidden="true">→</i></a>`).join('')}</div>`}));
    if (brands.length) items.push({name: 'Бренды', icon: 4, n: brands.length + ' брендов', body:
      `<div class="ml-sh-brands">${brands.map(b => `<a ${b.h ? `href="${esc(b.h)}" target="_blank" rel="noopener"` : ''}><img src="${esc(b.src)}" alt="${esc(b.alt || 'Бренд')}" loading="lazy"></a>`).join('')}</div>`});
    const WA = 'https://wa.me/996998899675?text=' + encodeURIComponent('Здравствуйте! Помогите подобрать светильник');

    const box = D.createElement('div'); box.className = 'ml-cat';
    box.innerHTML = `<button type="button" class="ml-cat-open" aria-expanded="false">${ico(4)}<span>Каталог товаров</span><b aria-hidden="true">☰</b></button>
      <aside class="ml-cat-side" aria-label="Разделы каталога"><div class="ml-cat-panel">
        <div class="ml-cat-hd"><span>Каталог</span><button type="button" class="ml-cat-x" aria-label="Закрыть">✕</button></div>
        <ul class="ml-cat-list">${items.map((it, i) => `<li><button type="button" class="ml-cat-row" data-i="${i}" aria-expanded="false">${ico(it.icon)}<span>${esc(it.name)}<small>${it.n}</small></span><i aria-hidden="true">›</i></button>
          <div class="ml-cat-acc">${it.body}</div></li>`).join('')}</ul>
        <a class="ml-cat-help" href="${WA}" target="_blank" rel="noopener"><b>Не нашли нужное?</b>Подберём свет под ваш проект — напишите в WhatsApp</a>
      </div>
      <div class="ml-sh" role="region" aria-live="polite"><div class="ml-sh-in"></div></div></aside>
      <div class="ml-cat-main"><div class="ml-cat-top"><div class="ml-cat-ttl">Товары</div><div class="ml-chips" role="tablist" aria-label="Фильтр товаров"></div></div></div>
      <div class="ml-cat-dim"></div>`;
    const main = box.querySelector('.ml-cat-main'), sh = box.querySelector('.ml-sh'), shIn = sh.firstChild, side = box.querySelector('.ml-cat-side');
    cat.before(box); main.appendChild(cat);
    // чипсы-фильтры вместо больших плиток категорий Тильды
    const chips = box.querySelector('.ml-chips');
    parts.forEach((p, i) => {
      const b = D.createElement('button'); b.type = 'button'; b.role = 'tab'; b.textContent = p.textContent.trim().replace(/\s+/g, ' ');
      if (/active/.test(p.className) || (i === 0 && !parts.some(x => /active/.test(x.className)))) b.classList.add('on');
      b.onclick = () => { (p.querySelector('a,button') || p).click(); chips.querySelectorAll('.on').forEach(x => x.classList.remove('on')); b.classList.add('on');
        b.scrollIntoView({block:'nearest', inline:'center', behavior: RM ? 'auto' : 'smooth'}); };
      chips.appendChild(b);
    });
    const above = cat.querySelector('.t-catalog-parts-above__container'); if (above) above.style.display = 'none';
    // шторка (ПК: по наведению/клику) и аккордеон (телефон, внутри выезжающей панели)
    const rows = [...box.querySelectorAll('.ml-cat-row')];
    const wide = () => innerWidth > 980;
    let cur = -1, tOpen = 0, tClose = 0;
    function show(i){
      clearTimeout(tClose); if (i === cur) return; cur = i;
      rows.forEach((r, k) => { r.classList.toggle('on', k === i); r.setAttribute('aria-expanded', k === i); });
      const it = items[i];
      shIn.innerHTML = `<div class="ml-sh-hd"><span>${ico(it.icon)}</span><div><b>${esc(it.name)}</b><small>${it.n}</small></div></div>${it.body}`;
      sh.classList.remove('in'); void sh.offsetWidth; sh.classList.add('open', 'in');
    }
    function hide(){ cur = -1; sh.classList.remove('open', 'in'); rows.forEach(r => { r.classList.remove('on'); r.setAttribute('aria-expanded', 'false'); }); }
    rows.forEach((r, i) => {
      r.addEventListener('pointerenter', e => { if (!wide() || e.pointerType !== 'mouse') return; clearTimeout(tOpen); tOpen = setTimeout(() => show(i), cur < 0 ? 60 : 140); });
      r.addEventListener('click', () => {
        if (wide()){ cur === i ? hide() : show(i); return; }
        const li = r.parentNode, open = !li.classList.contains('open');
        box.querySelectorAll('.ml-cat-list li.open').forEach(x => { x.classList.remove('open'); x.firstElementChild.setAttribute('aria-expanded', 'false'); });
        if (open){ li.classList.add('open'); r.setAttribute('aria-expanded', 'true'); }
      });
    });
    side.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse'){ clearTimeout(tOpen); tClose = setTimeout(hide, 260); } });
    side.addEventListener('pointerenter', () => clearTimeout(tClose));
    D.addEventListener('keydown', e => { if (e.key === 'Escape'){ hide(); drawer(false); } });
    // телефон: панель выезжает слева
    const openBtn = box.querySelector('.ml-cat-open');
    function drawer(on){ box.classList.toggle('drawer', on); openBtn.setAttribute('aria-expanded', on); D.documentElement.classList.toggle('ml-noscroll', on); }
    openBtn.onclick = () => drawer(true);
    box.querySelector('.ml-cat-x').onclick = () => drawer(false);
    box.querySelector('.ml-cat-dim').onclick = () => drawer(false);
    addEventListener('resize', () => { if (wide()) drawer(false); else hide(); });
    return true;
  }
  if (mlCatalog() === false){ let tries = 0; const iv = setInterval(() => { if (mlCatalog() !== false || ++tries > 40) clearInterval(iv); }, 400); }

/* Студия Moonlight — панель настроек оформления для мастера. Открывается на сайте по адресу …?studio, закрывается кнопкой «Выйти».
   Всё, что меняется здесь, — черновик в этом браузере. На сайт для всех попадает только после «Скопировать для HEAD» → вставить в Тильду → опубликовать. */
(() => {
  if (window.__mlStudioUI) return; window.__mlStudioUI = 1;
  const S = window.mlStudioApi; if (!S) return;
  const D = document, root = D.documentElement;
  const BUNDLE = ([...D.scripts].find(s => /\/rooms\.js/.test(s.src)) || {}).src || 'https://iloveganter-cpu.github.io/moonlight-3d/rooms/rooms.js?v=3';
  const css0 = getComputedStyle(root);
  const DEF_C = {graphite: '#2F3438', light: '#F4F5F6', night: '#25292D', nightDeep: '#1C1F23', moon: '#BCD0E6', moonDay: '#7895B5', moonDeep: '#5F7896',
    morningBg: '#EEF2F7', morningDark: '#2A3139', morningAccent: '#7895B5', eveningBg: '#F5EDE2', eveningDark: '#36322E', eveningAccent: '#7895B5'};
  // цвета по времени суток: мастер выбирает время — сайт сразу переключается на него, и видны только его цвета
  const TOD_ORDER = ['morning', 'day', 'evening', 'night'];
  const TOD_COLORS = {
    morning: {name: 'Утро', ic: '🌅', when: 'с 6:00 до 11:00', f: [
      {k: 'colors.morningBg', t: 'Фон страницы', h: 'фон всего сайта и шапки'},
      {k: 'colors.morningDark', t: 'Тёмные кнопки и плашки'},
      {k: 'colors.morningAccent', t: 'Акцент', h: 'ссылки, рамки, звезда-курсор, свечение кнопок'}]},
    day: {name: 'День', ic: '☀', when: 'с 11:00 до 17:00', f: [
      {k: 'colors.light', t: 'Фон страницы', h: 'фон всего сайта и шапки'},
      {k: 'colors.graphite', t: 'Текст и тёмные кнопки', h: 'основной цвет текста; он же утром и вечером'},
      {k: 'colors.moonDay', t: 'Акцент', h: 'ссылки, рамки, звезда-курсор, свечение кнопок'},
      {k: 'colors.moonDeep', t: 'Акцент мелкого текста', h: 'подписи и тонкие контуры'}]},
    evening: {name: 'Вечер', ic: '🌇', when: 'с 17:00 до 22:00', f: [
      {k: 'colors.eveningBg', t: 'Фон страницы', h: 'фон всего сайта и шапки'},
      {k: 'colors.eveningDark', t: 'Тёмные кнопки и плашки'},
      {k: 'colors.eveningAccent', t: 'Акцент', h: 'ссылки, рамки, звезда-курсор, свечение кнопок'}]},
    night: {name: 'Ночь', ic: '☾', when: 'с 22:00 до 6:00', f: [
      {k: 'colors.night', t: 'Фон страницы', h: 'фон всего сайта и шапки'},
      {k: 'colors.nightDeep', t: 'Тёмные блоки', h: 'подвал, каталог, живые комнаты'},
      {k: 'colors.moon', t: 'Лунный акцент', h: 'ссылки, рамки, звезда-курсор, свечение; и в тёмных местах днём (фонарик)'}]},
  };
  // цвета «как в HEAD сейчас» — стартовая точка
  const headC = {}; Object.entries(S.COLORS).forEach(([k, v]) => { const x = (S.head.colors && S.head.colors[k]) || css0.getPropertyValue(v).trim(); headC[k] = /^#[0-9a-f]{3,8}$/i.test(x) ? x.toUpperCase() : DEF_C[k]; });
  let st = Object.assign({}, S.cfg); st.colors = Object.assign({}, headC, S.cfg.colors || {});
  const hist = [];
  const save = () => { S.ls.set('ml-studio-draft', JSON.stringify(st)); };
  const push = () => { hist.push(JSON.stringify(st)); if (hist.length > 60) hist.shift(); };
  let reloadNeeded = false;
  // quiet — идёт жест (ползунок, палитра): без перерисовки панели и без записи в историю, сайт обновляется раз в кадр
  let raf = 0;
  const applySoon = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; S.apply(st); }); };
  function set(k, v, quiet){ if (!quiet) push(); const old = st[k]; if (v === '' || v === undefined) delete st[k]; else st[k] = v;
    if ((k === 'cursor' || k === 'flash') && old !== v) reloadNeeded = true;
    save(); if (quiet) applySoon(); else { S.apply(st); sync(); } }
  // ---------- цвет: HEX ↔ HSV
  const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) || 0); };
  const rgb2hex = a => '#' + a.map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('').toUpperCase();
  function rgb2hsv([r, g, b]){ r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0; if (d){ h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return [h, mx ? d / mx : 0, mx]; }
  function hsv2rgb(h, s, v){ const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => x * 255); }
  const hsl2hex = (h, s, l) => { const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return rgb2hex([f(0), f(8), f(4)].map(x => x * 255)); };
  const hex2hsl = hx => { const [r, g, b] = hex2rgb(hx).map(x => x / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
    if (!d) return [0, 0, l]; const s = d / (1 - Math.abs(2 * l - 1)); let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return [h, s, l]; };
  // родственные оттенки: светлее/темнее того же цвета и соседние тона
  function tones(hx){ const [h, s, l] = hex2hsl(hx), out = [];
    [.14, .24, .36, .5, .64, .76, .88].forEach(L => out.push(hsl2hex(h, s, L)));
    [-40, -20, 20, 40].forEach(d => out.push(hsl2hex((h + d + 360) % 360, s, l)));
    [Math.max(0, s - .3), Math.min(1, s + .3)].forEach(S2 => out.push(hsl2hex(h, S2, l)));
    return out.filter((x, i, a) => a.indexOf(x) === i && x !== hx.toUpperCase()); }
  let openPk = null, pkHsv = null;

  // ---------- описание всех настроек
  const T = [
    {id: 'look', name: 'Пресеты', ic: '✦'},
    {id: 'color', name: 'Цвета', ic: '◐'},
    {id: 'type', name: 'Шрифты', ic: 'Аа'},
    {id: 'shape', name: 'Формы', ic: '▢'},
    {id: 'motion', name: 'Анимации', ic: '➶'},
    {id: 'fx', name: 'Эффекты', ic: '☾'},
    {id: 'blocks', name: 'Блоки', ic: '☰'},
    {id: 'done', name: 'Готово', ic: '✓'},
  ];
  const FONT_OPTS = [['', 'Как сейчас'], ['brand', 'Фирменный (Avenir Next)'], ...S.FONTS.map(f => [f, f])];
  const F = {
    color: [
      {k: 'colors.graphite', t: 'Графит', h: 'основной тёмный: текст днём, тёмные кнопки'},
      {k: 'colors.light', t: 'Фон днём'},
      {k: 'colors.night', t: 'Фон ночью'},
      {k: 'colors.nightDeep', t: 'Тёмные блоки ночью', h: 'подвал, комнаты, каталог'},
      {k: 'colors.moon', t: 'Акцент на тёмном', h: 'ссылки, рамки, звезда, свечение'},
      {k: 'colors.moonDay', t: 'Акцент днём'},
      {k: 'colors.moonDeep', t: 'Тёмный акцент', h: 'мелкий текст и контуры на светлом'},
    ],
    type: [
      {k: 'font', t: 'Шрифт текста', type: 'font'},
      {k: 'headFont', t: 'Шрифт заголовков', type: 'font'},
      {k: 'headSize', t: 'Размер заголовков', type: 'seg', o: [['', 'Как есть'], ['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL']]},
      {k: 'headWeight', t: 'Толщина заголовков', type: 'seg', o: [['', 'Как есть'], [300, 'Тонкий'], [400, 'Обычный'], [600, 'Плотный'], [700, 'Жирный']]},
      {k: 'headCase', t: 'Регистр заголовков', type: 'seg', o: [['', 'Как есть'], ['upper', 'ЗАГЛАВНЫЕ'], ['none', 'Обычные']]},
      {k: 'headSpacing', t: 'Разрядка заголовков', type: 'range', min: -0.02, max: 0.3, step: 0.01, u: 'em'},
      {k: 'headAlign', t: 'Заголовки', type: 'seg', o: [['', 'Как есть'], ['left', '⇤ Слева'], ['center', '↔ Центр'], ['right', 'Справа ⇥']]},
      {k: 'textAlign', t: 'Описания блоков', type: 'seg', o: [['', 'Как есть'], ['left', '⇤ Слева'], ['center', '↔ Центр'], ['justify', '☰ По ширине']]},
    ],
    shape: [
      {k: 'radiusCard', t: 'Скругление карточек', type: 'range', min: 0, max: 40, step: 1, u: 'px'},
      {k: 'radiusBtn', t: 'Скругление кнопок', type: 'range', min: 0, max: 40, step: 1, u: 'px'},
      {k: 'btnStyle', t: 'Кнопки', type: 'seg', o: [['', 'Как есть'], ['outline', 'Контур'], ['glass', 'Стекло'], ['moon', 'Лунные']]},
      {k: 'shadow', t: 'Тени карточек', type: 'range', min: 0, max: 2, step: 0.1, u: '×'},
      {k: 'gap', t: 'Расстояние между карточками', type: 'range', min: 4, max: 40, step: 1, u: 'px'},
      {k: 'spacing', t: 'Воздух между блоками', type: 'range', min: 0.4, max: 1.8, step: 0.05, u: '×'},
    ],
    motion: [
      {k: 'anim', t: 'Как появляются блоки', type: 'seg', o: [['', 'Как есть'], ['fade', 'Проявление'], ['up', 'Снизу'], ['down', 'Сверху'], ['left', 'Слева'], ['right', 'Справа'], ['zoom', 'Приближение'], ['blur', 'Из тумана'], ['flip', 'Разворот']]},
      {k: 'dur', t: 'Длительность', type: 'range', min: 0.2, max: 2.5, step: 0.05, u: 'с'},
      {k: 'stagger', t: 'Каскад карточек', type: 'range', min: 0, max: 300, step: 10, u: 'мс', h: 'задержка между соседними карточками'},
      {k: 'dist', t: 'Дальность сдвига', type: 'range', min: 0, max: 160, step: 2, u: 'px'},
      {k: 'ease', t: 'Характер движения', type: 'seg', o: [['', 'Мягкий'], ['spring', 'Пружина'], ['sharp', 'Резкий'], ['slow', 'Плавный']]},
      {k: 'hover', t: 'Наведение на карточку', type: 'seg', o: [['', 'Как есть'], ['lift', 'Подъём'], ['glow', 'Свечение'], ['zoom', 'Зум фото'], ['tilt', 'Наклон'], ['none', 'Без эффекта']]},
      {k: '_replay', t: '', type: 'btn', label: '▶ Проиграть появление ещё раз'},
    ],
    fx: [
      {k: 'cursor', t: 'Курсор', type: 'seg', o: [['', 'Звезда'], ['spot', 'Точка'], ['glow', 'Огонёк'], ['off', 'Обычный']], h: 'применится после перезагрузки'},
      {k: 'flash', t: 'Фонарик на первом экране', type: 'seg', o: [['', 'Вкл'], [false, 'Выкл (обложка)']], h: 'применится после перезагрузки'},
      {k: 'marquee', t: 'Бегущая строка брендов', type: 'range', min: 10, max: 120, step: 2, u: 'с', h: 'время одного круга: меньше — быстрее'},
      {k: 'glow', t: 'Сияние логотипа', type: 'range', min: 0, max: 2.5, step: 0.1, u: '×'},
      {k: 'grain', t: 'Плёночное зерно', type: 'range', min: 0, max: 1, step: 0.05, u: ''},
    ],
  };
  const PRESETS = [
    {n: 'Как сейчас', d: 'всё как в HEAD', c: {}},
    {n: 'Строгий', d: 'чёткие углы, ровное проявление', c: {radiusCard: 4, radiusBtn: 3, btnStyle: 'outline', anim: 'fade', dur: .6, stagger: 40, hover: 'lift', headCase: 'upper', headSpacing: .18, headWeight: 300, shadow: .3, spacing: .9}},
    {n: 'Мягкий', d: 'круглые формы, пружинка', c: {font: 'Manrope', headFont: 'Manrope', headCase: 'none', headWeight: 600, headSpacing: 0, radiusCard: 28, radiusBtn: 40, anim: 'up', dur: .9, stagger: 90, dist: 36, ease: 'spring', hover: 'lift', shadow: 1.2, gap: 20}},
    {n: 'Театр', d: 'крупные заголовки с засечками, медленный выход', c: {headFont: 'Cormorant Garamond', headWeight: 500, headCase: 'none', headSize: 'xl', headSpacing: .02, headAlign: 'center', anim: 'zoom', dur: 1.4, stagger: 140, ease: 'slow', hover: 'glow', grain: .35, glow: 1.6, spacing: 1.25}},
    {n: 'Галерея', d: 'много воздуха, фото приближаются', c: {font: 'Jost', headFont: 'Playfair Display', headCase: 'none', headWeight: 400, headSize: 'l', anim: 'blur', dur: 1.1, stagger: 110, hover: 'zoom', radiusCard: 0, radiusBtn: 0, shadow: 0, gap: 28, spacing: 1.4}},
    {n: 'Лунная ночь', d: 'холодное сияние, стеклянные кнопки', c: {colors: {moon: '#9FC3FF', night: '#1B2130', nightDeep: '#141925'}, btnStyle: 'glass', hover: 'glow', glow: 2, anim: 'flip', dur: 1, stagger: 70, grain: .2}},
    {n: 'Тёплый вечер', d: 'медный акцент, мягкий шрифт', c: {colors: {moon: '#E9B98A', moonDay: '#B07A4A', moonDeep: '#8A5A33', night: '#2B2622', nightDeep: '#211C19'}, font: 'Comfortaa', headFont: 'Comfortaa', headCase: 'none', headWeight: 600, radiusCard: 22, radiusBtn: 30, anim: 'up', ease: 'soft', hover: 'tilt'}},
  ];

  // ---------- оболочка панели (Shadow DOM — стили сайта её не трогают)
  const host = D.createElement('div'); host.className = 'mls-host'; host.style.cssText = 'position:fixed;z-index:2147483600;right:16px;top:16px;bottom:16px;width:min(380px,calc(100vw - 32px));pointer-events:none';
  const sh = host.attachShadow({mode: 'open'});
  sh.innerHTML = `<style>
:host{all:initial;cursor:auto}
*{box-sizing:border-box;cursor:auto}
button,input,select,label{cursor:pointer}
input[type=text]{cursor:text}
.p{pointer-events:auto;position:absolute;inset:0;display:flex;flex-direction:column;background:rgba(24,27,31,.92);-webkit-backdrop-filter:blur(18px) saturate(1.2);backdrop-filter:blur(18px) saturate(1.2);color:#EEF1F4;border:1px solid rgba(188,208,230,.22);border-radius:20px;box-shadow:0 30px 80px -20px rgba(0,0,0,.6);font:13px/1.4 'Nunito Sans','Avenir Next',Arial,sans-serif;overflow:hidden;transition:transform .35s cubic-bezier(.22,.61,.36,1),opacity .3s}
.p.min{transform:translateX(calc(100% + 24px));opacity:0;pointer-events:none}
.fab{pointer-events:auto;position:absolute;right:0;bottom:0;width:54px;height:54px;border-radius:50%;border:1px solid rgba(188,208,230,.4);background:#1C1F23;color:#BCD0E6;font-size:22px;display:none;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(0,0,0,.4)}
.min~.fab{display:flex}
header{display:flex;align-items:center;gap:8px;padding:14px 14px 10px}
header b{font-size:15px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;flex:1}
header b i{font-style:normal;color:#BCD0E6}
.ib{width:30px;height:30px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#DDE3EA;font-size:14px;display:flex;align-items:center;justify-content:center;padding:0}
.ib:hover{border-color:#BCD0E6;color:#fff}
nav{display:flex;gap:4px;padding:0 10px 10px;overflow-x:auto;scrollbar-width:none}
nav button{flex:0 0 auto;border:0;background:transparent;color:#AAB2BC;padding:7px 10px;border-radius:10px;font:600 12px/1 inherit;display:flex;gap:6px;align-items:center}
nav button span{font-size:13px;color:#BCD0E6}
nav button.on{background:rgba(188,208,230,.16);color:#fff}
main{flex:1;overflow:auto;padding:4px 14px 14px;scrollbar-width:thin;scrollbar-color:rgba(188,208,230,.3) transparent}
.f{padding:11px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.f>label,.f>.l{display:flex;justify-content:space-between;align-items:baseline;gap:8px;font-weight:600;margin-bottom:7px;color:#E6EAEE}
.f small{display:block;color:#8E97A1;font-weight:400;margin:-3px 0 7px;font-size:11.5px}
.f .v{color:#BCD0E6;font-variant-numeric:tabular-nums;font-weight:600}
.f .x{border:0;background:none;color:#7D8690;font-size:11px;padding:0;margin-left:6px}
.f .x:hover{color:#fff}
input[type=range]{width:100%;accent-color:#BCD0E6}
.seg{display:flex;flex-wrap:wrap;gap:5px}
.seg button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#C9D0D8;border-radius:9px;padding:6px 9px;font:600 12px/1 inherit}
.seg button.on{background:#BCD0E6;color:#1C1F23;border-color:#BCD0E6}
.seg button:hover:not(.on){border-color:rgba(188,208,230,.6)}
select{width:100%;background:#1C1F23;color:#EEF1F4;border:1px solid rgba(255,255,255,.14);border-radius:9px;padding:8px;font:13px inherit}
.col{display:flex;gap:8px;align-items:center}
.todpick{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:6px}
.todpick button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:9px 4px 8px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#C9D0D8;font:600 12px/1 inherit}
.todpick button span{font-size:17px;line-height:1}
.todpick button i{display:flex;gap:2px}
.todpick button s{width:10px;height:10px;border-radius:3px;background:var(--c);border:1px solid rgba(255,255,255,.25)}
.todpick button.on{border-color:#BCD0E6;background:rgba(188,208,230,.16);color:#fff;box-shadow:0 0 0 1px #BCD0E6}
.todpick button:hover:not(.on){border-color:rgba(188,208,230,.5)}
.sw{width:46px;height:34px;flex:0 0 auto;border-radius:9px;border:1px solid rgba(255,255,255,.22);background:var(--c);padding:0;box-shadow:inset 0 0 0 2px rgba(0,0,0,.25)}
.sw.on,.sw:hover{border-color:#BCD0E6;box-shadow:0 0 0 2px rgba(188,208,230,.35),inset 0 0 0 2px rgba(0,0,0,.25)}
.pk{margin-top:10px;padding:10px;border-radius:12px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.08)}
.sv{position:relative;height:150px;border-radius:9px;cursor:crosshair;touch-action:none;background:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl(var(--h) 100% 50%))}
.sv i,.hue i{position:absolute;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.5),0 2px 6px rgba(0,0,0,.5);pointer-events:none}
.hue{position:relative;height:14px;margin-top:12px;border-radius:7px;cursor:ew-resize;touch-action:none;background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)}
.hue i{top:50%}
.tl{margin:10px 0 5px;color:#8E97A1;font-size:11px;letter-spacing:.04em}
.tones{display:flex;flex-wrap:wrap;gap:5px}
.tones button{width:24px;height:24px;border-radius:7px;border:1px solid rgba(255,255,255,.18);background:var(--c);padding:0}
.tones button:hover{transform:scale(1.15);border-color:#fff}
.tones small{color:#6E7780;font-size:11px}
.sv,.hue,.sv *{cursor:crosshair}
.col input[type=text]{flex:1;background:#1C1F23;color:#EEF1F4;border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:7px 9px;font:13px/1 ui-monospace,monospace;text-transform:uppercase}
.pr{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:6px}
.pr button{text-align:left;border:1px solid rgba(255,255,255,.1);background:linear-gradient(160deg,rgba(255,255,255,.05),rgba(255,255,255,.01));color:#EEF1F4;border-radius:14px;padding:12px;font:600 13px/1.25 inherit;min-height:74px}
.pr button small{display:block;font-weight:400;color:#8E97A1;font-size:11.5px;margin-top:4px}
.pr button:hover{border-color:#BCD0E6}
.big{width:100%;border:0;border-radius:12px;padding:12px;background:#BCD0E6;color:#1C1F23;font:700 13px/1 inherit;margin-top:10px}
.big.sec{background:rgba(255,255,255,.06);color:#EEF1F4;border:1px solid rgba(255,255,255,.12)}
.big:hover{filter:brightness(1.08)}
.note{background:rgba(188,208,230,.08);border:1px solid rgba(188,208,230,.2);border-radius:12px;padding:10px 12px;color:#C9D3DE;margin:10px 0;font-size:12.5px}
.note b{color:#fff}
.warn{background:rgba(255,180,107,.1);border-color:rgba(255,180,107,.35)}
textarea{width:100%;height:180px;background:#14171A;color:#CFE0F2;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px;font:11px/1.45 ui-monospace,monospace;resize:vertical}
.bl{display:flex;align-items:center;gap:6px;padding:7px 8px;border:1px solid rgba(255,255,255,.08);border-radius:10px;margin-bottom:5px;background:rgba(255,255,255,.02)}
.bl.off{opacity:.45}
.bl .n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bl .n small{display:block;color:#7D8690;font-size:11px;margin:0}
.bl .ib{width:26px;height:26px;font-size:12px}
footer{display:flex;gap:6px;padding:10px 14px 14px;border-top:1px solid rgba(255,255,255,.06);align-items:center;flex-wrap:wrap}
footer .tod{display:flex;gap:3px;flex:1}
footer .tod button{flex:1;border:1px solid rgba(255,255,255,.1);background:none;color:#AAB2BC;border-radius:8px;padding:6px 0;font:600 11px/1 inherit}
footer .tod button.on{background:rgba(188,208,230,.18);color:#fff;border-color:rgba(188,208,230,.5)}
.toast{position:absolute;left:50%;bottom:74px;transform:translateX(-50%) translateY(10px);background:#BCD0E6;color:#1C1F23;padding:8px 14px;border-radius:20px;font-weight:700;opacity:0;transition:.25s;pointer-events:none;white-space:nowrap}
.toast.on{opacity:1;transform:translateX(-50%)}
.phone{pointer-events:auto;position:fixed;right:calc(min(380px,100vw - 32px) + 32px);top:50%;transform:translateY(-50%);width:390px;height:min(820px,calc(100vh - 40px));border-radius:36px;border:10px solid #0E1012;box-shadow:0 30px 80px rgba(0,0,0,.55);overflow:hidden;background:#000;display:none}
.phone.on{display:block}
.phone iframe{width:100%;height:100%;border:0;display:block}
@media (max-width:900px){.phone{display:none!important}}
</style>
<div class="p">
  <header><b>Студия <i>✦</i></b>
    <button class="ib" data-a="undo" title="Отменить последнее">↶</button>
    <button class="ib" data-a="dice" title="Случайный вид">🎲</button>
    <button class="ib" data-a="phone" title="Показать на телефоне">📱</button>
    <button class="ib" data-a="min" title="Свернуть">—</button></header>
  <nav></nav>
  <main></main>
  <footer><div class="tod"></div><button class="ib" data-a="exit" title="Выйти из студии" style="width:auto;padding:0 10px;font-size:12px">Выйти</button></footer>
  <div class="toast"></div>
</div>
<button class="fab" data-a="max" title="Открыть студию">✦</button>
<div class="phone"><iframe title="Как на телефоне"></iframe></div>`;
  D.body.appendChild(host);
  const $ = s => sh.querySelector(s), P = $('.p'), nav = $('nav'), main = $('main');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const toast = t => { const e = $('.toast'); e.textContent = t; e.classList.add('on'); clearTimeout(e.t); e.t = setTimeout(() => e.classList.remove('on'), 1800); };
  const get = k => k.startsWith('colors.') ? st.colors[k.slice(7)] : st[k];
  const put = (k, v, quiet) => { if (!k.startsWith('colors.')) return set(k, v, quiet);
    if (!quiet) push(); st.colors[k.slice(7)] = v; save(); if (quiet) applySoon(); else { S.apply(st); sync(); } };
  let tab = S.ls.get('ml-studio-tab') || 'look';

  nav.innerHTML = T.map(t => `<button data-t="${t.id}"><span>${t.ic}</span>${t.name}</button>`).join('');
  nav.onclick = e => { const b = e.target.closest('button'); if (!b) return; tab = b.dataset.t; S.ls.set('ml-studio-tab', tab); render(); };

  function picker(k, c){
    if (!pkHsv || pkHsv.k !== k) pkHsv = {k, hsv: rgb2hsv(hex2rgb(c))};
    const [h, s, v] = pkHsv.hsv;
    return `<div class="pk" data-pk="${k}">
      <div class="sv" style="--h:${h.toFixed(1)}"><i style="left:${s * 100}%;top:${(1 - v) * 100}%"></i></div>
      <div class="hue"><i style="left:${h / 3.6}%"></i></div>
      <div class="tl">Оттенки этого цвета</div>
      <div class="tones">${tones(c).map(t => `<button data-tone="${t}" style="--c:${t}" title="${t}"></button>`).join('')}</div>
      <div class="tl">Пробовали</div><div class="tones recent">${(recent[k] || []).map(t => `<button data-tone="${t}" style="--c:${t}" title="${t}"></button>`).join('') || '<small>пока пусто</small>'}</div>
    </div>`;
  }
  const recent = {};
  const remember = (k, c) => { const r = recent[k] = (recent[k] || []).filter(x => x !== c); r.unshift(c); r.length = Math.min(r.length, 10); };
  // живое обновление открытой палитры без перерисовки
  function pkPaint(k, c){
    const f = main.querySelector(`[data-sw="${k}"]`); if (f) f.style.setProperty('--c', c);
    const t = main.querySelector(`input[type=text][data-k="${k}"]`); if (t && sh.activeElement !== t) t.value = c;
    const pk = main.querySelector(`[data-pk="${k}"]`); if (!pk || !pkHsv) return;
    const [h, s, v] = pkHsv.hsv; const sv = pk.querySelector('.sv'); sv.style.setProperty('--h', h.toFixed(1));
    sv.firstElementChild.style.left = s * 100 + '%'; sv.firstElementChild.style.top = (1 - v) * 100 + '%';
    pk.querySelector('.hue i').style.left = h / 3.6 + '%';
  }
  main.addEventListener('pointerdown', e => {
    const zone = e.target.closest('.sv,.hue'); if (!zone) return;
    const pk = zone.closest('.pk'), k = pk.dataset.pk; e.preventDefault(); zone.setPointerCapture(e.pointerId); push();
    const move = ev => { const r = zone.getBoundingClientRect(), x = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)), y = Math.max(0, Math.min(1, (ev.clientY - r.top) / r.height));
      const hsv = pkHsv.hsv; if (zone.classList.contains('sv')){ hsv[1] = x; hsv[2] = 1 - y; } else hsv[0] = x * 360;
      const c = rgb2hex(hsv2rgb(hsv[0], hsv[1], hsv[2])); put(k, c, true); pkPaint(k, c); };
    move(e);
    const up = () => { zone.removeEventListener('pointermove', move); zone.removeEventListener('pointerup', up); zone.removeEventListener('pointercancel', up);
      remember(k, get(k)); const y = main.scrollTop; render(); main.scrollTop = y; };
    zone.addEventListener('pointermove', move); zone.addEventListener('pointerup', up); zone.addEventListener('pointercancel', up);
  });
  function field(f){
    const v = get(f.k), has = v !== undefined && v !== null && v !== '';
    const reset = has && !f.k.startsWith('colors.') && f.type !== 'btn' ? `<button class="x" data-reset="${f.k}">сбросить</button>` : '';
    if (f.k.startsWith('colors.')){ const c = v || '#000000', dflt = headC[f.k.slice(7)];
      return `<div class="f"><label>${f.t}${c.toUpperCase() !== dflt ? `<button class="x" data-cdef="${f.k}">как было</button>` : ''}</label>${f.h ? `<small>${f.h}</small>` : ''}
        <div class="col"><button class="sw${openPk === f.k ? ' on' : ''}" data-sw="${f.k}" style="--c:${esc(c)}" title="Открыть палитру"></button><input type="text" data-k="${f.k}" value="${esc(c)}" maxlength="7" spellcheck="false"></div>${openPk === f.k ? picker(f.k, c) : ''}</div>`; }
    if (f.type === 'btn') return `<div class="f"><button class="big sec" data-a="${f.k}">${f.label}</button></div>`;
    if (f.type === 'font') return `<div class="f"><label>${f.t}${reset}</label><select data-k="${f.k}">${FONT_OPTS.map(([val, n]) => `<option value="${esc(val)}"${String(v || '') === val ? ' selected' : ''} style="font-family:'${esc(val)}'">${esc(n)}</option>`).join('')}</select></div>`;
    if (f.type === 'seg') return `<div class="f"><div class="l">${f.t}${reset}</div>${f.h ? `<small>${f.h}</small>` : ''}<div class="seg" data-k="${f.k}">${f.o.map(([val, n]) => `<button data-v='${JSON.stringify(val)}' class="${(has ? v === val : val === '') ? 'on' : ''}">${n}</button>`).join('')}</div></div>`;
    if (f.type === 'range'){ const mid = has ? v : (f.min + f.max) / 2;
      return `<div class="f"><label>${f.t}<span><span class="v">${has ? (+v).toString().replace('.', ',') + ' ' + f.u : 'как есть'}</span>${reset}</span></label>${f.h ? `<small>${f.h}</small>` : ''}<input type="range" data-k="${f.k}" min="${f.min}" max="${f.max}" step="${f.step}" value="${mid}"></div>`; }
    return '';
  }

  // ---------- блоки страницы: примерка порядка
  const recName = (r, g) => { const t = r.getAttribute('data-record-type'); const own = r.querySelector('[id^="ml-"]');
    if (g && g.els.some(e => e.id === 'ml-flash')) return ['Первый экран: фонарик', 'на месте обложки Тильды'];
    if (own) return [{'ml-rooms': 'Живые комнаты', 'ml-cat': 'Каталог раздела'}[own.id] || 'Свой код (' + own.id + ')', ''];
    const names = {'123': own ? ({'ml-rooms': 'Живые комнаты', 'ml-cat': 'Каталог раздела'}[own.id] || 'Свой код ' + own.id) : 'HTML-код', '183': 'Обложка', '2861': 'Каталог', '738': 'Логотипы брендов', '1331': '3D-модели', '3113': 'Шапка', '706': 'Корзина', '985': 'Поиск'};
    const txt = (r.querySelector('.t-section__title,.t-title,.t-name,h1,h2,.t-text') || {}).textContent || '';
    return [names[t] || 'Блок T' + t, txt.trim().replace(/\s+/g, ' ').slice(0, 48)]; };
  const vis = g => g.els.some(e => e.offsetHeight > 0 || e.classList.contains('mls-hide'));
  // все группы страницы в текущем порядке (видимые и служебные), порядок примерки — поверх
  function ordered(){ const gs = S.groups(), b = (st.blocks || {})[location.pathname] || {}; const ord = (b.order || []).filter(id => gs.some(g => g.id === id));
    gs.forEach(g => { if (!ord.includes(g.id)) ord.push(g.id); }); return ord.map(id => gs.find(g => g.id === id)); }
  function blocksUI(){
    const b = (st.blocks || {})[location.pathname] || {}, hid = new Set(b.hidden || []);
    const list = ordered().filter(vis);
    return `<div class="note">Примерка: двигайте блоки этой страницы и прячьте лишние. Это видно <b>только вам</b>. Понравилось — повторите тот же порядок в редакторе Тильды (там блоки двигаются стрелками ↑↓ справа от блока).</div>
      ${list.map((g, i) => { const [n, s] = recName(g.rec, g); return `<div class="bl${hid.has(g.id) ? ' off' : ''}" data-id="${g.id}"><span style="color:#7D8690;width:18px">${i + 1}</span><div class="n">${esc(n)}<small>${esc(s) || '&nbsp;'}</small></div>
        <button class="ib" data-b="up" title="Выше">↑</button><button class="ib" data-b="down" title="Ниже">↓</button><button class="ib" data-b="eye" title="Скрыть/показать">${hid.has(g.id) ? '◌' : '👁'}</button><button class="ib" data-b="go" title="Показать на странице">⌖</button></div>`; }).join('')}
      <button class="big sec" data-a="blocks-reset">Вернуть порядок как в Тильде</button>`;
  }
  function moveBlock(id, act){
    const p = location.pathname; st.blocks = st.blocks || {}; const b = st.blocks[p] = st.blocks[p] || {};
    const all = ordered(), ord = all.map(g => g.id), visIds = all.filter(vis).map(g => g.id);
    if (act === 'go'){ const g = all.find(x => x.id === id), el = g && (g.els.find(e => e.offsetHeight > 0) || g.rec); if (el){ el.scrollIntoView({behavior: 'smooth', block: 'start'}); el.style.outline = '2px solid #BCD0E6'; setTimeout(() => el.style.outline = '', 1400); } return; }
    push();
    const vi = visIds.indexOf(id), other = act === 'up' ? visIds[vi - 1] : act === 'down' ? visIds[vi + 1] : null;
    if (other){ ord.splice(ord.indexOf(id), 1); const c = ord.indexOf(other); ord.splice(act === 'up' ? c : c + 1, 0, id); }
    if (act === 'eye'){ const h = new Set(b.hidden || []); h.has(id) ? h.delete(id) : h.add(id); b.hidden = [...h]; }
    b.order = ord; save(); S.apply(st); render();
  }

  // ---------- итог: код для HEAD
  function exportCode(){
    const c = st.colors, line = (k, v, h) => `  ${(k + ':').padEnd(18)} ${v}; /* ${h} */`;
    const rest = Object.assign({}, st); delete rest.colors; delete rest.blocks; Object.keys(rest).forEach(k => (rest[k] === '' || rest[k] == null) && delete rest[k]);
    const date = new Date().toLocaleDateString('ru-RU');
    return `<!-- ФИРМЕННЫЕ ЦВЕТА САЙТА MOONLIGHT (собрано в Студии ${date}).
     Удобнее всего менять в Студии: откройте сайт с ?studio в конце адреса.
     После правки здесь: «Сохранить», потом «Опубликовать все страницы». -->
<style>
:root{
${TOD_ORDER.map(m => `  /* ${TOD_COLORS[m].name.toUpperCase()} */\n` + TOD_COLORS[m].f.map(f => line(S.COLORS[f.k.slice(7)], c[f.k.slice(7)], f.t.toLowerCase() + (f.h ? ': ' + f.h : ''))).join('\n')).join('\n')}
  --mlc-font: 'Avenir Next','Avenir','Nunito Sans',Arial,sans-serif; /* шрифт всего сайта */
}
</style>
<!-- Настройки Студии: шрифты, формы, анимации, эффекты. Менять через Студию. -->
<script>window.mlStudio=${JSON.stringify(rest, null, 1).replace(/\n\s*/g, ' ')};</script>
<!-- Оформление сайта (комнаты, каталог, день/ночь, фонарик, курсор). Не трогать. -->
<script defer src="${BUNDLE}"></script>`;
  }
  function doneUI(){
    const changed = JSON.stringify(Object.assign({}, st, {blocks: undefined})) !== JSON.stringify(Object.assign({}, S.head, {colors: Object.assign({}, headC, S.head.colors || {}), blocks: undefined}));
    const bl = st.blocks && st.blocks[location.pathname] && ((st.blocks[location.pathname].order || []).length || (st.blocks[location.pathname].hidden || []).length);
    return `<div class="note"><b>Как закрепить вид для всех посетителей:</b><br>1. Нажмите «Скопировать для HEAD».<br>2. Тильда → Настройки сайта → Вставка кода → «HTML-код для вставки внутрь HEAD» → «Редактировать код».<br>3. Выделите всё старое (Ctrl+A), вставьте (Ctrl+V), «Сохранить».<br>4. На странице проекта — «Опубликовать все страницы».</div>
      ${changed ? '' : '<div class="note">Пока всё как на сайте — менять нечего.</div>'}
      ${bl ? '<div class="note warn">Порядок блоков в код не попадает — его повторяют в редакторе Тильды (вкладка «Блоки»).</div>' : ''}
      <button class="big" data-a="copy">Скопировать для HEAD</button>
      <textarea readonly>${esc(exportCode())}</textarea>
      <button class="big sec" data-a="reset-all">Сбросить черновик — вернуть как на сайте</button>`;
  }

  const curTod = () => TOD_COLORS[root.dataset.tod] ? root.dataset.tod : 'day';
  function setTod(k){ const mb = D.querySelector('.ml-tod-menu button[data-m="' + k + '"]'); if (mb) mb.click(); else { S.ls.set('ml-tod', k); root.dataset.tod = k; }
    const ifr = $('.phone iframe'); if (ifr && ifr.src) try { ifr.contentDocument.documentElement.dataset.tod = k; } catch (x){} }
  function colorUI(){
    const m = curTod(), M = TOD_COLORS[m];
    return `<div class="tl" style="margin-top:4px">1. Какое время суток красим?</div>
      <div class="todpick">${TOD_ORDER.map(k => { const t = TOD_COLORS[k]; return `<button data-ctod="${k}" class="${k === m ? 'on' : ''}"><span>${t.ic}</span><b>${t.name}</b><i>${t.f.map(f => `<s style="--c:${esc(get(f.k))}"></s>`).join('')}</i></button>`; }).join('')}</div>
      <div class="tl">2. Цвета: ${M.name.toLowerCase()} <span style="color:#6E7780">· ${M.when}</span></div>
      <div class="note" style="margin-top:4px">Сайт сейчас показан как <b>${M.name.toLowerCase()}</b>. Нажмите на квадратик цвета и ведите по палитре — видно сразу.</div>
      ${M.f.map(field).join('')}
      <button class="big sec" data-a="ctod-reset">Вернуть цвета «${M.name}» как были</button>`;
  }
  function render(){
    nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    if (tab === 'look') main.innerHTML = `<div class="note">Двигайте, нажимайте, пробуйте — сайт меняется сразу, но <b>только у вас</b>. Кнопка ↶ отменяет шаг, 🎲 — случайный вид. Когда понравится — вкладка «Готово».</div>
      ${reloadNeeded ? '<div class="note warn">Курсор или фонарик поменяются после перезагрузки страницы. <button class="x" data-a="reload" style="color:#FFB46B">Перезагрузить</button></div>' : ''}
      <div class="pr">${PRESETS.map((p, i) => `<button data-p="${i}">${p.n}<small>${p.d}</small></button>`).join('')}</div>`;
    else if (tab === 'color') main.innerHTML = colorUI();
    else if (tab === 'blocks') main.innerHTML = blocksUI();
    else if (tab === 'done') main.innerHTML = doneUI();
    else main.innerHTML = (reloadNeeded && tab === 'fx' ? '<div class="note warn">Нужна перезагрузка, чтобы увидеть курсор/фонарик. <button class="x" data-a="reload" style="color:#FFB46B">Перезагрузить</button></div>' : '') + F[tab].map(field).join('');
  }
  function sync(){ const y = main.scrollTop; render(); main.scrollTop = y; }

  // ползунок: пока тянут — меняется только подпись и сайт; отпустили — шаг в историю и перерисовка (появится «сбросить»)
  let gesture = false;
  main.addEventListener('input', e => { const el = e.target, k = el.dataset.k; if (!k) return;
    if (el.type === 'range'){ if (!gesture){ push(); gesture = true; }
      const f = Object.values(F).flat().find(x => x.k === k), lab = el.closest('.f').querySelector('.v');
      if (lab && f) lab.textContent = (+el.value).toString().replace('.', ',') + ' ' + f.u;
      set(k, +el.value, true); return; }
    if (el.type === 'text'){ let v = el.value.trim(); if (v && v[0] !== '#') v = '#' + v;
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)){ v = v.toUpperCase(); if (!gesture){ push(); gesture = true; } if (pkHsv && pkHsv.k === k) pkHsv.hsv = rgb2hsv(hex2rgb(v)); put(k, v, true); pkPaint(k, v); } } });
  main.addEventListener('change', e => { const el = e.target;
    if (el.tagName === 'SELECT'){ set(el.dataset.k, el.value); return; }
    if (gesture){ gesture = false; if (el.dataset.k && el.dataset.k.startsWith('colors.')) remember(el.dataset.k, get(el.dataset.k)); sync(); } });
  main.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.type === 'text') e.target.blur(); });
  sh.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const seg = b.closest('.seg'); if (seg){ set(seg.dataset.k, JSON.parse(b.dataset.v)); return; }
    if (b.dataset.ctod){ setTod(b.dataset.ctod); openPk = null; pkHsv = null; sync(); return; }
    if (b.dataset.sw){ openPk = openPk === b.dataset.sw ? null : b.dataset.sw; pkHsv = null; sync(); return; }
    if (b.dataset.tone){ const k = b.closest('.pk').dataset.pk; pkHsv = {k, hsv: rgb2hsv(hex2rgb(b.dataset.tone))}; remember(k, b.dataset.tone); put(k, b.dataset.tone); return; }
    if (b.dataset.reset){ set(b.dataset.reset, ''); return; }
    if (b.dataset.cdef){ pkHsv = null; put(b.dataset.cdef, headC[b.dataset.cdef.slice(7)]); return; }
    if (b.dataset.p != null){ push(); const p = PRESETS[+b.dataset.p]; const cur = st.cursor, fl = st.flash;
      st = Object.assign({cursor: cur, flash: fl}, JSON.parse(JSON.stringify(p.c)), {blocks: st.blocks}); st.colors = Object.assign({}, headC, p.c.colors || {});
      Object.keys(st).forEach(k => st[k] === undefined && delete st[k]); save(); S.apply(st); toast('Пресет «' + p.n + '»'); replay(); return; }
    if (b.dataset.b){ moveBlock(b.closest('.bl').dataset.id, b.dataset.b); return; }
    const a = b.dataset.a;
    if (a === 'min'){ P.classList.add('min'); S.ls.set('ml-studio-min', '1'); }
    if (a === 'max'){ P.classList.remove('min'); S.ls.set('ml-studio-min', null); }
    if (a === 'undo'){ const h = hist.pop(); if (!h) return toast('Отменять нечего'); st = JSON.parse(h); save(); S.apply(st); render(); toast('Отменено'); }
    if (a === 'dice') dice();
    if (a === 'phone') phone();
    if (a === '_replay') replay();
    if (a === 'reload') location.reload();
    if (a === 'ctod-reset'){ push(); TOD_COLORS[curTod()].f.forEach(f => { const k = f.k.slice(7); st.colors[k] = headC[k]; }); openPk = null; pkHsv = null; save(); S.apply(st); sync(); toast('Цвета вернулись'); }
    if (a === 'blocks-reset'){ push(); if (st.blocks) delete st.blocks[location.pathname]; save(); S.apply(st); render(); }
    if (a === 'copy'){ const txt = exportCode(); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Скопировано — вставьте в HEAD Тильды'), () => { const t = main.querySelector('textarea'); t.select(); D.execCommand('copy'); toast('Скопировано'); }); }
    if (a === 'reset-all'){ push(); st = Object.assign({}, S.head); st.colors = Object.assign({}, headC); save(); S.apply(st); render(); toast('Как на сайте'); }
    if (a === 'exit'){ S.ls.set('ml-studio-on', null); const u = new URL(location.href); u.searchParams.delete('studio'); location.href = u.toString(); }
  });
  function replay(){ const c = window.mlStudioCfg; S.apply(Object.assign({}, c, {anim: 'none'})); setTimeout(() => { S.apply(st); }, 60); }
  const pick = a => a[Math.floor(Math.random() * a.length)], rnd = (a, b, s) => Math.round((a + Math.random() * (b - a)) / s) * s;
  function dice(){ push();
    const hue = Math.floor(Math.random() * 360), sat = 30 + Math.random() * 50;
    const hsl = (h, s, l) => { s /= 100; l /= 100; const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return '#' + [f(0), f(8), f(4)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase(); };
    st = Object.assign({}, {cursor: st.cursor, flash: st.flash, blocks: st.blocks}, {
      colors: Object.assign({}, headC, Math.random() < .7 ? {moon: hsl(hue, sat, 78), moonDay: hsl(hue, sat * .8, 55), moonDeep: hsl(hue, sat * .7, 40)} : {}),
      font: pick(['', ...S.FONTS.slice(0, 11)]), headFont: pick(['', ...S.FONTS]), headCase: pick(['upper', 'none']), headWeight: pick([300, 400, 600, 700]), headSize: pick(['m', 'l', 'xl']),
      headSpacing: rnd(-.01, .22, .01), radiusCard: rnd(0, 32, 2), radiusBtn: rnd(0, 40, 2), btnStyle: pick(['', 'outline', 'glass', 'moon']), shadow: rnd(0, 1.6, .1),
      anim: pick(['fade', 'up', 'zoom', 'blur', 'flip', 'left']), dur: rnd(.5, 1.5, .05), stagger: rnd(40, 180, 10), ease: pick(['', 'spring', 'slow']), hover: pick(['lift', 'glow', 'zoom', 'tilt']),
      spacing: rnd(.8, 1.4, .05), grain: Math.random() < .3 ? rnd(.1, .5, .05) : undefined});
    Object.keys(st).forEach(k => (st[k] === undefined || st[k] === '') && delete st[k]);
    save(); S.apply(st); render(); replay(); toast('🎲 Новый вид');
  }
  function phone(){ const ph = $('.phone'), on = ph.classList.toggle('on');
    if (on){ const u = new URL(location.href); u.searchParams.delete('studio'); u.searchParams.set('studio-frame', '1'); ph.querySelector('iframe').src = u.toString(); } }
  // время суток
  const TODS = [['morning', 'Утро'], ['day', 'День'], ['evening', 'Вечер'], ['night', 'Ночь']];
  const tod = $('.tod'); tod.innerHTML = TODS.map(([k, n]) => `<button data-tod="${k}">${n}</button>`).join('');
  const todSync = () => tod.querySelectorAll('button').forEach(b => b.classList.toggle('on', root.dataset.tod === b.dataset.tod));
  tod.onclick = e => { const b = e.target.closest('button'); if (!b) return; setTod(b.dataset.tod); todSync();
    const ifr = $('.phone iframe'); if (ifr && ifr.src) try { ifr.contentDocument.documentElement.dataset.tod = b.dataset.tod; } catch (x){} };
  let lastTod = root.dataset.tod;
  new MutationObserver(() => { todSync(); if (root.dataset.tod === lastTod) return; lastTod = root.dataset.tod; if (tab === 'color' && !gesture){ openPk = null; pkHsv = null; sync(); } }).observe(root, {attributes: true, attributeFilter: ['data-tod']}); todSync();
  if (S.ls.get('ml-studio-min') === '1') P.classList.add('min');
  D.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !/INPUT|TEXTAREA/.test((e.composedPath()[0] || {}).tagName || '')){ const h = hist.pop(); if (h){ e.preventDefault(); st = JSON.parse(h); save(); S.apply(st); render(); toast('Отменено'); } } });
  render();
})();

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
  const cfg0 = window.mlStudioCfg || S.cfg; let st = Object.assign({}, cfg0); st.colors = Object.assign({}, headC, cfg0.colors || {});
  const hist = [];
  const save = () => { S.ls.set('ml-studio-draft', JSON.stringify(st)); };
  const push = () => { hist.push(JSON.stringify(st)); if (hist.length > 60) hist.shift(); };
  let reloadNeeded = false;
  // quiet — идёт жест (ползунок, палитра): без перерисовки панели и без записи в историю, сайт обновляется раз в кадр
  let raf = 0;
  const applySoon = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; S.apply(live()); }); };
  function set(k, v, quiet){ if (!quiet) push(); const old = st[k]; if (v === '' || v === undefined) delete st[k]; else st[k] = v;
    if (old !== v && needReload(k, old, v)) reloadNeeded = true;
    save(); if (quiet) applySoon(); else { S.apply(live()); sync(); if (MOTION_KEYS.includes(k)) replaySoon(); } }
  // курсор-конструктор и анимации меняются сразу; перезагрузка нужна только для фонарика и старых курсоров (спот, огонёк)
  const legacy = x => x === 'spot' || x === 'glow';
  function needReload(k, old, v){
    if (k === 'flash') return true;
    if (k !== 'cursor') return false;
    if (legacy(old) || legacy(v)) return true;
    return !window.mlCursorShapes && v !== 'off';   // конструктор не запущен (на сайте был выключен) — запустится после перезагрузки
  }
  let rpT = 0; const replaySoon = () => { clearTimeout(rpT); rpT = setTimeout(replay, 250); };
  // ---------- цвет: HEX ↔ HSV
  const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) || 0); };
  const rgb2hex = a => '#' + a.map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('').toUpperCase();
  function rgb2hsv([r, g, b]){ r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0; if (d){ h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return [h, mx ? d / mx : 0, mx]; }
  function hsv2rgb(h, s, v){ const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => x * 255); }
  const hsl2hex = (h, s, l) => { h = ((h % 360) + 360) % 360; s = Math.max(0, Math.min(1, s)); l = Math.max(0, Math.min(1, l));
    const k = n => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return rgb2hex([f(0), f(8), f(4)].map(x => x * 255)); };
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
    {id: 'cursor', name: 'Курсор', ic: '➹'},
    {id: 'motion', name: 'Анимации', ic: '➶'},
    {id: 'fx', name: 'Эффекты', ic: '☾'},
    {id: 'text', name: 'Тексты', ic: '✎'},
    {id: 'blocks', name: 'Блоки', ic: '☰'},
    {id: 'done', name: 'Готово', ic: '✓'},
  ];
  const FONT_OPTS = [['', 'Как сейчас'], ['brand', 'Фирменный (Avenir Next)'], ...S.FONTS.map(f => [f, f])];
  // формы курсора (те же, что в самом курсоре)
  const SHAPES = window.mlCursorShapes || {star: 'M0,-12 C1,-3 3,-1 12,0 C3,1 1,3 0,12 C-1,3 -3,1 -12,0 C-3,-1 -1,-3 0,-12Z'};
  const SHAPE_N = [['star', 'Звезда бренда'], ['star8', 'Звезда 8 лучей'], ['crescent', 'Полумесяц'], ['bulb', 'Лампочка'], ['dot', 'Точка'], ['ring', 'Кольцо'], ['diamond', 'Ромб'], ['plus', 'Крестик']];
  const CUR_PRESETS = [
    {n: 'Фирменный', d: 'звезда, точки, кольцо', c: {}},
    {n: 'Лампочка', d: 'тёплый свет за курсором', c: {curShape: 'bulb', curColor: 'warm', curTrail: 'light', curBtn: 'fill', curClick: 'ripple', curSpin: 'still', curLag: .2}},
    {n: 'Полумесяц', d: 'комета, магнит', c: {curShape: 'crescent', curTrail: 'comet', curBtn: 'magnet', curSpin: 'still', curHalo: 1.4}},
    {n: 'Волшебный', d: 'искры и звёзды', c: {curShape: 'star8', curTrail: 'sparks', curClick: 'stars', curHalo: 1.6, curSize: 1.1}},
    {n: 'Минимал', d: 'точка без следа', c: {curShape: 'dot', curColor: 'mono', curTrail: 'none', curBtn: 'fill', curClick: 'ripple', curHalo: 0, curLag: .3, curLink: 'none'}},
    {n: 'Кольцо', d: 'мягко догоняет', c: {curShape: 'ring', curSize: 1.3, curLag: .55, curTrail: 'none', curBtn: 'fill', curClick: 'ripple', curSpin: 'still'}},
  ];
  const CUR_KEYS = ['curShape', 'curSize', 'curColor', 'curHex', 'curHalo', 'curLag', 'curSpin', 'curLink', 'curTrail', 'curTrailLen', 'curBtn', 'curPull', 'curClick'];
  const F = {
    type: [
      {type: 'h', t: 'Текст'},
      {k: 'font', t: 'Шрифт текста', type: 'font', h: 'описания, меню, кнопки, карточки'},
      {k: 'textAlign', t: 'Описания блоков', type: 'seg', o: [['', 'Как есть'], ['left', '⇤ Слева'], ['center', '↔ Центр'], ['justify', '☰ По ширине']]},
      {type: 'h', t: 'Заголовки'},
      {k: 'headFont', t: 'Шрифт заголовков', type: 'font'},
      {k: 'headSize', t: 'Размер', type: 'seg', o: [['', 'Как есть'], ['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL']]},
      {k: 'headWeight', t: 'Толщина', type: 'seg', o: [['', 'Как есть'], [300, 'Тонкий'], [400, 'Обычный'], [600, 'Плотный'], [700, 'Жирный']]},
      {k: 'headCase', t: 'Регистр', type: 'seg', o: [['', 'Как есть'], ['upper', 'ЗАГЛАВНЫЕ'], ['none', 'Обычные']]},
      {k: 'headSpacing', t: 'Разрядка (расстояние между буквами)', type: 'range', min: -0.02, max: 0.3, step: 0.01, u: 'em'},
      {k: 'headAlign', t: 'Выравнивание', type: 'seg', o: [['', 'Как есть'], ['left', '⇤ Слева'], ['center', '↔ Центр'], ['right', 'Справа ⇥']]},
    ],
    shape: [
      {type: 'h', t: 'Карточки товаров'},
      {k: 'radiusCard', t: 'Скругление углов', type: 'range', min: 0, max: 40, step: 1, u: 'px', h: '0 — острые углы'},
      {k: 'shadow', t: 'Тень', type: 'range', min: 0, max: 2, step: 0.1, u: '×', h: '0 — плоские, больше — «парят» над страницей'},
      {k: 'cardBorder', t: 'Рамка в цвет акцента', type: 'range', min: 0, max: 3, step: 0.5, u: 'px', def: 0, h: '0 — без рамки'},
      {k: 'gap', t: 'Расстояние между карточками', type: 'range', min: 4, max: 40, step: 1, u: 'px'},
      {type: 'h', t: 'Кнопки'},
      {k: 'radiusBtn', t: 'Скругление углов', type: 'range', min: 0, max: 40, step: 1, u: 'px', h: '40 — «таблетка»'},
      {k: 'btnStyle', t: 'Вид', type: 'seg', o: [['', 'Как есть'], ['outline', 'Контур'], ['glass', 'Стекло'], ['moon', 'В цвет акцента']]},
      {k: 'btnCase', t: 'Надписи', type: 'seg', o: [['', 'Как есть'], ['upper', 'ЗАГЛАВНЫЕ'], ['none', 'Обычные']]},
      {type: 'h', t: 'Страница'},
      {k: 'spacing', t: 'Воздух между блоками', type: 'range', min: 0.4, max: 1.8, step: 0.05, u: '×', def: 1, h: 'меньше 1 — плотнее, больше — просторнее'},
    ],
    cursor: [
      {type: 'note', t: 'Двигайте мышью <b>по сайту слева</b> — курсор меняется сразу. Над этой панелью — обычная стрелка.'},
      {k: 'cursor', t: 'Какой курсор', type: 'seg', o: [['', 'Конструктор'], ['off', 'Обычная стрелка'], ['spot', 'Трековый спот'], ['glow', 'Огонёк (старый)']], h: 'всё, что ниже, — для «Конструктора»; спот и огонёк включаются после перезагрузки'},
      {type: 'cpresets', t: 'Готовые курсоры — нажмите и попробуйте', show: s => !s.cursor},
      {type: 'h', t: 'Форма', show: s => !s.cursor},
      {k: 'curShape', t: '', type: 'tiles', show: s => !s.cursor},
      {k: 'curSize', t: 'Размер', type: 'range', min: 0.6, max: 2.2, step: 0.05, u: '×', def: 1, show: s => !s.cursor},
      {type: 'h', t: 'Цвет и свечение', show: s => !s.cursor},
      {k: 'curColor', t: 'Цвет', type: 'seg', o: [['', 'Лунный'], ['warm', 'Тёплый свет'], ['mono', 'Белый / графит'], ['custom', 'Свой цвет']], h: 'лунный и белый сами темнеют на светлом фоне', show: s => !s.cursor},
      {k: 'curHex', t: 'Свой цвет курсора', type: 'color', def: '#BCD0E6', show: s => !s.cursor && s.curColor === 'custom'},
      {k: 'curHalo', t: 'Сияние вокруг', type: 'range', min: 0, max: 2.5, step: 0.1, u: '×', def: 1, show: s => !s.cursor},
      {type: 'h', t: 'Движение', show: s => !s.cursor},
      {k: 'curLag', t: 'Плавность', type: 'range', min: 0, max: 0.9, step: 0.05, u: '', def: 0, h: '0 — точно за мышью; больше — догоняет мягко, с инерцией', show: s => !s.cursor},
      {k: 'curSpin', t: 'Вращение', type: 'seg', o: [['', 'От скорости'], ['still', 'Спокойно'], ['spin', 'Всё время']], show: s => !s.cursor},
      {k: 'curLink', t: 'Над ссылкой', type: 'seg', o: [['', 'Растёт и поворачивается'], ['none', 'Не меняется']], show: s => !s.cursor},
      {type: 'h', t: 'След', show: s => !s.cursor},
      {k: 'curTrail', t: 'Что остаётся за курсором', type: 'seg', o: [['', 'Точки'], ['sparks', 'Искры'], ['comet', 'Комета'], ['light', 'Пятно света'], ['none', 'Ничего']], show: s => !s.cursor},
      {k: 'curTrailLen', t: 'Длина следа', type: 'range', min: 0.3, max: 2.5, step: 0.1, u: '×', def: 1, show: s => !s.cursor && s.curTrail !== 'none'},
      {type: 'h', t: 'Над кнопкой', show: s => !s.cursor},
      {k: 'curBtn', t: 'Что происходит', type: 'seg', o: [['', 'Кольцо обнимает'], ['fill', 'Светлый круг'], ['magnet', 'Магнит'], ['none', 'Ничего']], show: s => !s.cursor},
      {k: 'curPull', t: 'Кнопка тянется к курсору', type: 'range', min: 0, max: 2, step: 0.1, u: '×', def: 1, h: '0 — стоит на месте', show: s => !s.cursor},
      {type: 'h', t: 'Клик', show: s => !s.cursor},
      {k: 'curClick', t: 'При нажатии', type: 'seg', o: [['', 'Вспышка точек'], ['ripple', 'Волна'], ['stars', 'Звёзды'], ['none', 'Ничего']], show: s => !s.cursor},
    ],
    motion: [
      {type: 'h', t: 'Появление блоков при прокрутке'},
      {k: 'anim', t: 'Как появляются', type: 'seg', o: [['', 'Как есть'], ['fade', 'Проявление'], ['up', 'Снизу'], ['down', 'Сверху'], ['left', 'Слева'], ['right', 'Справа'], ['zoom', 'Приближение'], ['blur', 'Из тумана'], ['flip', 'Разворот']]},
      {k: 'dur', t: 'Длительность', type: 'range', min: 0.2, max: 2.5, step: 0.05, u: 'с', def: .8, show: s => s.anim && s.anim !== 'none'},
      {k: 'stagger', t: 'Карточки по очереди', type: 'range', min: 0, max: 300, step: 10, u: 'мс', def: 80, h: 'пауза между соседними карточками; 0 — все сразу', show: s => s.anim && s.anim !== 'none'},
      {k: 'dist', t: 'Дальность сдвига', type: 'range', min: 0, max: 160, step: 2, u: 'px', def: 40, show: s => /up|down|left|right/.test(s.anim || '')},
      {k: 'ease', t: 'Характер движения', type: 'seg', o: [['', 'Мягкий'], ['spring', 'Пружина'], ['sharp', 'Резкий'], ['slow', 'Плавный']]},
      {type: 'h', t: 'Заголовки'},
      {k: 'headAnim', t: 'Как появляются заголовки', type: 'seg', o: [['', 'Сразу'], ['words', 'По словам'], ['letters', 'По буквам'], ['mask', 'Выезжают из-под края'], ['line', 'Рисуется линия'], ['light', 'Пробегает луч']]},
      {type: 'h', t: 'Фотографии'},
      {k: 'imgReveal', t: 'Как появляются фото', type: 'seg', o: [['', 'Сразу'], ['curtain', 'Шторка снизу'], ['side', 'Шторка сбоку'], ['zoom', 'Приближение'], ['fade', 'Из тумана']]},
      {type: 'h', t: 'Наведение мышью'},
      {k: 'hover', t: 'На карточку', type: 'seg', o: [['', 'Как есть'], ['lift', 'Подъём'], ['glow', 'Свечение'], ['zoom', 'Зум фото'], ['tilt', 'Наклон'], ['none', 'Без эффекта']]},
      {k: 'btnHover', t: 'На кнопку', type: 'seg', o: [['', 'Как есть'], ['shine', 'Блик'], ['fill', 'Заливка'], ['lift', 'Подъём'], ['pulse', 'Пульс']]},
      {k: 'linkHover', t: 'На ссылку и пункт меню', type: 'seg', o: [['', 'Как есть'], ['underline', 'Подчёркивание'], ['glow', 'Свечение']]},
      {type: 'h', t: 'Переход на другую страницу'},
      {k: 'pageFade', t: 'Смена страниц', type: 'seg', o: [['', 'Сразу'], [true, 'Плавное затемнение']]},
      {k: '_replay', t: '', type: 'btn', label: '▶ Проиграть появление ещё раз'},
    ],
    fx: [
      {type: 'h', t: 'Прокрутка'},
      {k: 'progress', t: 'Полоса «сколько прочитано» сверху', type: 'seg', o: [['', 'Нет'], ['thin', 'Тонкая'], ['thick', 'Толще']]},
      {k: 'topBtn', t: 'Кнопка «Наверх»', type: 'seg', o: [['', 'Нет'], [true, 'Есть']], h: 'появляется справа внизу, когда пролистали больше экрана'},
      {k: 'hdrHide', t: 'Шапка сайта', type: 'seg', o: [['', 'Всегда видна'], [true, 'Прячется при прокрутке вниз']], h: 'возвращается, как только листают вверх'},
      {type: 'h', t: 'Атмосфера'},
      {k: 'sky', t: 'Звёзды на тёмных блоках', type: 'range', min: 0, max: 1, step: 0.05, u: '', def: 0, h: 'тихо мерцают в цвет акцента; 0 — выкл'},
      {k: 'grain', t: 'Плёночное зерно', type: 'range', min: 0, max: 1, step: 0.05, u: '', def: 0, h: 'лёгкий шум поверх всего, как на фото'},
      {k: 'glow', t: 'Сияние логотипа', type: 'range', min: 0, max: 2.5, step: 0.1, u: '×', def: 1},
      {k: 'selection', t: 'Выделение текста и полоса прокрутки', type: 'seg', o: [['', 'Обычные'], [true, 'В цвет акцента']]},
      {type: 'h', t: 'Фирменные штуки'},
      {k: 'flash', t: 'Фонарик на первом экране', type: 'seg', o: [['', 'Вкл'], [false, 'Выкл (обложка)']], h: 'применится после перезагрузки'},
      {k: 'marquee', t: 'Бегущая строка брендов', type: 'range', min: 10, max: 120, step: 2, u: 'с', h: 'время одного круга: меньше — быстрее'},
    ],
  };
  // ---------- готовые палитры (24.11): задаём 6 ключевых цветов, остальное выводим —
  // утро чуть холоднее, вечер теплее, акцент мелкого текста темнее; контраст подтягивается сам, чтобы всё читалось
  const PAL_GROUPS = [
    ['Холодные', [
      ['Лунная', 'фирменная Moonlight', null],
      ['Сапфир', 'глубокий синий', ['#F3F5FA', '#232A3B', '#1D2333', '#151A27', '#A9C2FF', '#3F63C4']],
      ['Индиго', 'синий с фиолетом', ['#F2F3F8', '#1E2140', '#1A1C36', '#121328', '#B4B8FF', '#4B50C8']],
      ['Морская волна', 'петроль и бирюза', ['#F1F5F6', '#1F2D33', '#1A262B', '#121B1F', '#8FC8D8', '#2C7A8F']],
      ['Северное сияние', 'мятная бирюза', ['#F2F6F6', '#23302F', '#1E2A2A', '#162020', '#9FE3D6', '#2F8F83']],
      ['Лаванда', 'мягкий сиреневый', ['#F6F4F8', '#2E2A36', '#27232F', '#1D1A24', '#CDB8F0', '#7A5BB0']]]],
    ['Тёплые', [
      ['Янтарь', 'прежний фирменный', ['#F6F3EE', '#2F3438', '#25292D', '#1C1F23', '#EFAC3E', '#B97A16']],
      ['Шампань', 'светлое золото', ['#F7F4EC', '#2F2B24', '#26231D', '#1C1A15', '#E6CF94', '#9C7A2E']],
      ['Медь', 'тёплый металл', ['#F6F1EC', '#33291F', '#2B2622', '#211C19', '#E9B98A', '#B07A4A']],
      ['Терракота', 'обожжённая глина', ['#F7F2EE', '#3A2C27', '#2E2420', '#221A17', '#F0A58A', '#B4593B']],
      ['Пыльная роза', 'нежный розовый', ['#F8F3F3', '#3A2B2E', '#2E2326', '#22191C', '#F2B8C6', '#B05A73']],
      ['Бордо', 'винный, торжественный', ['#F6F1F1', '#301E22', '#2A1A1E', '#1E1215', '#E89AA8', '#9E2F45']]]],
    ['Природные', [
      ['Шалфей', 'приглушённая зелень', ['#F3F5F0', '#2C3328', '#252B22', '#1B2018', '#C3D9A8', '#5E7F3E']],
      ['Изумруд', 'сочный зелёный', ['#F1F6F3', '#1F2E27', '#1A2721', '#121C17', '#8EDDB4', '#23845A']],
      ['Олива', 'тёплая хаки', ['#F5F4EC', '#33321F', '#2A291C', '#1F1E14', '#D6D08A', '#7A7330']],
      ['Песок', 'бежевый, лён', ['#F5F0E8', '#3B342B', '#2D2822', '#221E19', '#E2CBA7', '#8F6F45']],
      ['Камень', 'тёплый серый', ['#F4F3F1', '#34312E', '#2A2826', '#1F1D1C', '#D6CFC6', '#7D7368']]]],
    ['Смелые', [
      ['Монохром', 'чёрное и белое', ['#F5F5F5', '#222222', '#1E1E1E', '#141414', '#E6E6E6', '#5E5E5E']],
      ['Неон', 'электрик на чёрном', ['#F4F4F6', '#16161A', '#121216', '#0B0B0E', '#7DF9FF', '#0077B6']],
      ['Коралл', 'яркий и тёплый', ['#FAF4F1', '#2C2A2A', '#232121', '#191717', '#FF9E80', '#D4532F']],
      ['Фуксия', 'дерзкий розовый', ['#F8F3F6', '#2D2229', '#251C22', '#1A1318', '#FF9AD5', '#C2287E']],
      ['Лайм', 'свежий жёлто-зелёный', ['#F4F6EE', '#24281C', '#1E2217', '#151810', '#D4F27A', '#5E8A12']]]]];
  const lin = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const lum = h => { const [r, g, b] = hex2rgb(h); return .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b); };
  const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const mixHex = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * t)); };
  // двигаем цвет к to (чёрному/белому) маленькими шагами, пока не наберёт контраст с фоном
  const fit = (c, bg, need, to) => { let x = c; for (let i = 0; i < 40 && contrast(x, bg) < need; i++) x = mixHex(x, to, .06); return x; };
  function palette(k){
    if (!k) return Object.assign({}, DEF_C);
    let [light, graphite, night, nightDeep, moon, moonDay] = k;
    graphite = fit(graphite, light, 9, '#000000');
    moonDay = fit(moonDay, light, 3.2, '#000000');
    const moonDeep = fit(mixHex(moonDay, graphite, .2), light, 4.8, '#000000');
    moon = fit(moon, night, 7, '#FFFFFF');
    const morningBg = mixHex(light, '#DCE6F5', .35), eveningBg = mixHex(light, '#F3DCC2', .45);
    return {light, graphite, night, nightDeep, moon, moonDay, moonDeep,
      morningBg, morningDark: mixHex(graphite, '#1C2A3A', .25), morningAccent: fit(moonDay, morningBg, 3.2, '#000000'),
      eveningBg, eveningDark: mixHex(graphite, '#3A2A1C', .25), eveningAccent: fit(moonDay, eveningBg, 3.2, '#000000')};
  }
  const PALS = PAL_GROUPS.flatMap(([g, ps]) => ps.map(([n, d, k]) => ({g, n, d, c: palette(k)})));
  // ---------- палитра из одного цвета и из фото (24.11)
  // accent — любой цвет; tint — насколько фон и тёмные блоки отдают его оттенком; bgHue — свой оттенок фона (тёплый/холодный)
  function genKeys(accent, o){
    o = o || {}; const [h, s0] = hex2hsl(accent), s = Math.max(.25, s0), t = o.tint == null ? 1 : o.tint, bh = o.bgHue == null ? h : o.bgHue;
    const ss = o.sat == null ? 1 : o.sat;
    return [hsl2hex(bh, .16 * t, o.bgL || .957), hsl2hex(h, .16 * t, .19), hsl2hex(h, .17 * t, o.nightL || .155), hsl2hex(h, .19 * t, (o.nightL || .155) - .045),
      hsl2hex(h, Math.min(.85, s * .9 * ss), .8), hsl2hex(h, Math.min(.8, s * .85 * ss), .45)];
  }
  // «похожие»: оттенки рядом и разный характер фона
  function variants(accent){
    const [h] = hex2hsl(accent);
    return [
      ['Как есть', 'ровно этот акцент', genKeys(accent)],
      ['Спокойнее', 'приглушённый, почти серый фон', genKeys(accent, {tint: .35, sat: .7})],
      ['Насыщеннее', 'ярче акцент и сильнее оттенок', genKeys(accent, {tint: 1.8, sat: 1.25})],
      ['Тёплый фон', 'акцент на сливочном', genKeys(accent, {bgHue: 38, tint: 1.3})],
      ['Холодный фон', 'акцент на голубоватом', genKeys(accent, {bgHue: 212, tint: 1.3})],
      ['Глубокая ночь', 'ночь почти чёрная', genKeys(accent, {nightL: .11})],
      ['Соседний тон ←', 'на 25° левее по кругу', genKeys(hsl2hex(h - 25, ...hex2hsl(accent).slice(1)))],
      ['Соседний тон →', 'на 25° правее по кругу', genKeys(hsl2hex(h + 25, ...hex2hsl(accent).slice(1)))],
      ['Противоположный', 'контрастная пара', genKeys(hsl2hex(h + 180, ...hex2hsl(accent).slice(1)), {tint: .6})]
    ].map(([n, d, k]) => ({n, d, c: palette(k)}));
  }
  // главные цвета картинки: уменьшаем до 72px, k-средних по 8 кластерам
  function photoColors(img){
    const W = 72, cv = D.createElement('canvas'), r = Math.min(1, W / Math.max(img.width, img.height)); cv.width = Math.max(1, Math.round(img.width * r)); cv.height = Math.max(1, Math.round(img.height * r));
    const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0, cv.width, cv.height);
    const px = []; const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) px.push([d[i], d[i + 1], d[i + 2]]);
    if (!px.length) return [];
    let C = Array.from({length: 8}, (_, i) => px[Math.floor((i + .5) * px.length / 8)].slice());
    for (let it = 0; it < 10; it++){
      const sum = C.map(() => [0, 0, 0, 0]);
      px.forEach(p => { let bi = 0, bd = 1e9; C.forEach((c, i) => { const dd = (c[0] - p[0]) ** 2 + (c[1] - p[1]) ** 2 + (c[2] - p[2]) ** 2; if (dd < bd){ bd = dd; bi = i; } }); const s = sum[bi]; s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++; });
      C = sum.map((s, i) => s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3], s[3]] : C[i]);
    }
    return C.filter(c => c[3]).map(c => ({hex: rgb2hex(c.slice(0, 3)), n: c[3] / px.length})).sort((a, b) => b.n - a.n);
  }
  function photoPalettes(cols){
    if (!cols.length) return [];
    const hs = cols.map(c => Object.assign({}, c, {hsl: hex2hsl(c.hex)}));
    const top = hs[0], bgHue = top.hsl[1] > .06 ? top.hsl[0] : null;
    // акценты: насыщенные и заметные, разные по тону
    const cand = hs.filter(c => c.hsl[1] > .18 && c.hsl[2] > .18 && c.hsl[2] < .85).sort((a, b) => b.hsl[1] * Math.sqrt(b.n) - a.hsl[1] * Math.sqrt(a.n));
    const acc = []; cand.forEach(c => { if (acc.length < 3 && acc.every(a => Math.min(Math.abs(a.hsl[0] - c.hsl[0]), 360 - Math.abs(a.hsl[0] - c.hsl[0])) > 28)) acc.push(c); });
    if (!acc.length) acc.push(hs.slice().sort((a, b) => b.hsl[1] - a.hsl[1])[0]);
    const out = acc.map((a, i) => ({n: i ? 'Из фото · ' + (i + 1) : 'Из фото', d: 'акцент ' + a.hex, c: palette(genKeys(a.hex, {bgHue, tint: bgHue == null ? .5 : 1.2}))}));
    out.push({n: 'Из фото · мягкая', d: 'акцент приглушён', c: palette(genKeys(acc[0].hex, {bgHue, tint: .5, sat: .6}))});
    return out;
  }
  let gen = null; // {kind:'one'|'photo', base, cols, list}
  const palOn = p => Object.keys(p.c).every(k => String(st.colors[k] || '').toUpperCase() === p.c[k].toUpperCase());
  const MOTION_KEYS =['anim', 'dur', 'stagger', 'dist', 'ease', 'headAnim', 'imgReveal'];
  const PRESETS = [
    {n: 'Базовый', d: 'фирменный вид Moonlight: лунный акцент, звезда, фонарик', base: true, c: {}},
    {n: 'Как сейчас', d: 'всё как на сайте сейчас', c: {}},
    {n: 'Строгий', d: 'чёткие углы, линии под заголовками, крестик', c: {radiusCard: 4, radiusBtn: 3, btnStyle: 'outline', btnCase: 'upper', anim: 'fade', dur: .6, stagger: 40, hover: 'lift', headCase: 'upper', headSpacing: .18, headWeight: 300, shadow: .3, spacing: .9,
      headAnim: 'line', imgReveal: 'side', btnHover: 'fill', linkHover: 'underline', progress: 'thin', curShape: 'plus', curTrail: 'none', curSpin: 'still', curClick: 'ripple'}},
    {n: 'Мягкий', d: 'круглые формы, пружинка, точка-курсор', c: {font: 'Manrope', headFont: 'Manrope', headCase: 'none', headWeight: 600, headSpacing: 0, radiusCard: 28, radiusBtn: 40, anim: 'up', dur: .9, stagger: 90, dist: 36, ease: 'spring', hover: 'lift', shadow: 1.2, gap: 20,
      headAnim: 'words', imgReveal: 'zoom', btnHover: 'lift', topBtn: true, curShape: 'dot', curLag: .35, curTrail: 'light', curBtn: 'fill', curClick: 'ripple'}},
    {n: 'Театр', d: 'крупные заголовки с засечками, звёзды, медленный выход', c: {headFont: 'Cormorant Garamond', headWeight: 500, headCase: 'none', headSize: 'xl', headSpacing: .02, headAlign: 'center', anim: 'zoom', dur: 1.4, stagger: 140, ease: 'slow', hover: 'glow', grain: .35, glow: 1.6, spacing: 1.25,
      headAnim: 'mask', imgReveal: 'curtain', sky: .6, pageFade: true, curShape: 'star8', curTrail: 'sparks', curClick: 'stars'}},
    {n: 'Галерея', d: 'много воздуха, фото из тумана, кольцо-курсор', c: {font: 'Jost', headFont: 'Playfair Display', headCase: 'none', headWeight: 400, headSize: 'l', anim: 'blur', dur: 1.1, stagger: 110, hover: 'zoom', radiusCard: 0, radiusBtn: 0, shadow: 0, gap: 28, spacing: 1.4,
      headAnim: 'letters', imgReveal: 'fade', linkHover: 'underline', pageFade: true, hdrHide: true, curShape: 'ring', curSize: 1.3, curLag: .55, curTrail: 'none', curBtn: 'fill', curClick: 'ripple', curSpin: 'still'}},
    {n: 'Лунная ночь', d: 'холодное сияние, полумесяц, звёздное небо', c: {colors: {moon: '#9FC3FF', night: '#1B2130', nightDeep: '#141925'}, btnStyle: 'glass', hover: 'glow', glow: 2, anim: 'flip', dur: 1, stagger: 70, grain: .2,
      headAnim: 'light', btnHover: 'shine', sky: .8, selection: true, curShape: 'crescent', curTrail: 'comet', curBtn: 'magnet', curHalo: 1.5}},
    {n: 'Тёплый вечер', d: 'медный акцент, лампочка с тёплым светом', c: {colors: {moon: '#E9B98A', moonDay: '#B07A4A', moonDeep: '#8A5A33', night: '#2B2622', nightDeep: '#211C19'}, font: 'Comfortaa', headFont: 'Comfortaa', headCase: 'none', headWeight: 600, radiusCard: 22, radiusBtn: 30, anim: 'up', ease: 'soft', hover: 'tilt',
      headAnim: 'words', btnHover: 'pulse', curShape: 'bulb', curColor: 'warm', curTrail: 'light', curBtn: 'fill', curSpin: 'still'}},
    {n: 'Тихий', d: 'спокойно, без лишних эффектов', c: {anim: 'fade', dur: .5, stagger: 30, hover: 'lift', shadow: .5, curShape: 'dot', curColor: 'mono', curTrail: 'none', curBtn: 'none', curClick: 'none', curPull: 0, curHalo: 0, curLink: 'none', glow: .4}},
    {n: 'Праздник', d: 'искры, звёзды, всё блестит', c: {anim: 'zoom', ease: 'spring', dur: .9, stagger: 90, headAnim: 'letters', imgReveal: 'zoom', btnHover: 'shine', hover: 'glow', sky: 1, glow: 2.2, curShape: 'star8', curTrail: 'sparks', curClick: 'stars', curHalo: 2, curSize: 1.15}},
  ];
  // все поля одним списком (поиск, «что изменено», подписи значений)
  // у каждого поля запоминаем раздел (подзаголовок над ним): «Кнопки · Вид», а не просто «Вид»
  const withSec = fs => { let sec = ''; return fs.map(f => { if (f.type === 'h') sec = f.t; return Object.assign({sec}, f); }); };
  const ALL = [...Object.entries(F).flatMap(([tb, fs]) => withSec(fs).filter(f => f.k && f.type !== 'btn').map(f => Object.assign({tab: tb}, f))),
    ...TOD_ORDER.flatMap(m => TOD_COLORS[m].f.map(f => Object.assign({tab: 'color', type: 'color', grp: TOD_COLORS[m].name, tod: m}, f)))];
  const TABN = Object.fromEntries(T.map(t => [t.id, t.name]));
  // подпись значения по-человечески
  function valName(f, v){
    if (v === undefined || v === null || v === '') return f.type === 'text' ? 'как было' : 'как есть';
    if (f.o){ const o = f.o.find(x => x[0] === v); if (o) return o[1]; }
    if (f.type === 'tiles'){ const o = SHAPE_N.find(x => x[0] === v); if (o) return o[1]; }
    if (f.type === 'range') return String(v).replace('.', ',') + (f.u ? ' ' + f.u : '');
    if (f.type === 'text') return '«' + (String(v).length > 44 ? String(v).slice(0, 42) + '…' : v) + '»';
    return String(v);
  }
  // что отличается от того, что сейчас на сайте (HEAD)
  function changes(){
    const out = [];
    ALL.forEach(f => { const a = get(f.k), b = f.k.startsWith('colors.') ? headC[f.k.slice(7)] : S.head[f.k];
      const norm = x => x === undefined || x === null || x === '' ? '' : String(x).toUpperCase();
      if (norm(a) !== norm(b)) out.push(f); });
    Object.keys(st.texts || {}).forEach(k => { if (st.texts[k] !== ((S.head.texts || {})[k])) out.push({tab: 'text', k: 'texts.' + k, t: txtLabel(k), type: 'text'}); });
    Object.keys(S.head.texts || {}).forEach(k => { if (!(st.texts || {})[k]) out.push({tab: 'text', k: 'texts.' + k, t: txtLabel(k), type: 'text'}); });
    return out;
  }

  // ---------- оболочка панели (Shadow DOM — стили сайта её не трогают)
  const host = D.createElement('div'); host.className = 'mls-host'; host.style.cssText = 'position:fixed;z-index:2147483600;right:16px;top:16px;bottom:16px;width:min(400px,calc(100vw - 32px));pointer-events:none';
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
header{display:flex;align-items:center;gap:5px;padding:14px 14px 10px}
header b{font-size:15px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;flex:1}
header b i{font-style:normal;color:#BCD0E6}
.ib{width:30px;height:30px;border-radius:9px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#DDE3EA;font-size:14px;display:flex;align-items:center;justify-content:center;padding:0}
.ib:hover{border-color:#BCD0E6;color:#fff}
.srch{margin:0 14px 8px;position:relative}
.srch input{width:100%;background:rgba(0,0,0,.28);color:#EEF1F4;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:8px 30px 8px 32px;font:13px/1.2 inherit;outline:none}
.srch input:focus{border-color:#BCD0E6}
.srch:before{content:"⌕";position:absolute;left:11px;top:50%;transform:translateY(-52%);color:#8E97A1;font-size:16px}
.srch button{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none;color:#8E97A1;font-size:14px;padding:4px}
nav{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;padding:0 10px 10px}
nav button{position:relative;border:0;background:transparent;color:#AAB2BC;padding:7px 2px 6px;border-radius:10px;font:600 11px/1.1 inherit;display:flex;flex-direction:column;gap:3px;align-items:center}
nav button span{font-size:14px;color:#BCD0E6;line-height:1}
nav button.on{background:rgba(188,208,230,.16);color:#fff}
nav button:hover:not(.on){background:rgba(255,255,255,.05)}
nav button.ch:after{content:"";position:absolute;top:5px;right:calc(50% - 15px);width:6px;height:6px;border-radius:50%;background:#FFB46B;box-shadow:0 0 6px #FFB46B}
.hh{margin:16px 0 0;padding-top:4px;color:#BCD0E6;font:700 11px/1.2 inherit;letter-spacing:.12em;text-transform:uppercase}
.hh+.f{padding-top:6px}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tiles button{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 2px 8px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#C9D0D8;font:600 10.5px/1.15 inherit;text-align:center}
.tiles button svg{width:26px;height:26px;overflow:visible}
.tiles button svg path{fill:#fff;stroke:#BCD0E6;stroke-width:1.2;filter:drop-shadow(0 0 4px #BCD0E6)}
.tiles button.ring svg path{fill:none;stroke:#fff;stroke-width:2.2}
.tiles button.on{border-color:#BCD0E6;background:rgba(188,208,230,.16);color:#fff;box-shadow:0 0 0 1px #BCD0E6}
.tiles button:hover:not(.on){border-color:rgba(188,208,230,.5)}
.cpr{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.cpr button{text-align:left;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#EEF1F4;border-radius:11px;padding:8px 9px;font:600 12px/1.2 inherit}
.cpr button small{display:block;font-weight:400;color:#8E97A1;font-size:10.5px;margin-top:2px}
.cpr button:hover{border-color:#BCD0E6}
.flashf{animation:flashf 1.6s ease}
@keyframes flashf{0%,40%{background:rgba(188,208,230,.22);box-shadow:0 0 0 2px #BCD0E6}100%{background:transparent;box-shadow:none}}
.f{border-radius:10px}
.sgrp{margin:12px 0 2px;color:#8E97A1;font-size:11px;letter-spacing:.06em}
.chg{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);margin-bottom:5px}
.chg .n{flex:1;min-width:0}
.chg .n small{display:block;color:#8E97A1;font-size:11px}
.chg .n b{color:#BCD0E6;font-weight:600}
.chg i{width:14px;height:14px;border-radius:4px;background:var(--c);display:inline-block;vertical-align:-2px;border:1px solid rgba(255,255,255,.3);margin-right:4px}
.chg button{border:0;background:none;color:#8E97A1;font:600 11px inherit;padding:2px 4px}
.chg button:hover{color:#fff}
.saves{display:flex;gap:6px;margin-top:8px}
.saves input{flex:1;background:#1C1F23;color:#EEF1F4;border:1px solid rgba(255,255,255,.14);border-radius:9px;padding:8px 9px;font:13px inherit}
.saves button{border:0;border-radius:9px;padding:0 12px;background:#BCD0E6;color:#1C1F23;font:700 12px inherit}
.sv-l{display:flex;align-items:center;gap:6px;padding:7px 9px;border-radius:10px;border:1px solid rgba(255,255,255,.08);margin-top:5px}
.sv-l .n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sv-l .n small{color:#7D8690;font-size:11px;margin-left:6px}
.sv-l button{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);color:#DDE3EA;border-radius:8px;padding:5px 8px;font:600 11px inherit}
.sv-l button:hover{border-color:#BCD0E6;color:#fff}
.ib.on{background:#BCD0E6;color:#1C1F23;border-color:#BCD0E6}
.help ol{margin:6px 0 0;padding-left:18px}
.help li{margin:3px 0}
.help .k{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 4px;border-radius:6px;border:1px solid rgba(255,255,255,.2);font-size:11px;margin-right:4px;color:#fff}
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
.aud{width:100%;border-collapse:separate;border-spacing:3px;margin:8px 0;font-size:12px}
.aud th{font-weight:600;color:#C9D0D8;text-align:left;padding:3px 4px}
.aud td{text-align:center;padding:5px 2px;border-radius:7px;background:rgba(255,255,255,.04)}
.aud td.ok{color:#8FE0B0}.aud td.bad{color:#FFB0A0;background:rgba(255,120,100,.12)}
.aud-spin{display:inline-block;width:12px;height:12px;border-radius:50%;border:2px solid rgba(188,208,230,.3);border-top-color:#BCD0E6;animation:audS .8s linear infinite;vertical-align:-2px;margin-right:4px}
@keyframes audS{to{transform:rotate(360deg)}}
.own{margin:4px 0 6px}
.own-r{display:flex;gap:6px;align-items:center}
.own-c{position:relative;width:38px;height:38px;flex:none;border-radius:50%;overflow:hidden;border:1px solid rgba(255,255,255,.25)}
.own-c input{position:absolute;inset:-8px;width:60px;height:60px;opacity:0;cursor:pointer}
.own-c span{position:absolute;inset:0;background:var(--c);pointer-events:none}
.own-r input[type=text]{width:92px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#EEF1F4;font:600 13px/1 ui-monospace,monospace;padding:0 10px}
.own-r .mini{flex:1;height:36px;border-radius:10px;border:1px solid rgba(188,208,230,.4);background:rgba(188,208,230,.12);color:#EEF1F4;font:600 12px/1 inherit}
.own-ph{margin-top:8px!important}
.own-sw{display:flex;height:22px;border-radius:8px;overflow:hidden;margin:10px 0 6px;border:1px solid rgba(255,255,255,.18)}
.own-sw s{background:var(--c);display:block}
.own-img{display:block;max-width:100%;max-height:120px;border-radius:10px;margin:6px 0}
main.drop{outline:2px dashed #BCD0E6;outline-offset:-6px}
.pals{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0 4px}
.pals .pgh{grid-column:1/-1;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8E97A1;margin:6px 0 0}
.pals button{display:flex;flex-direction:column;align-items:flex-start;gap:3px;padding:7px 7px 8px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#EEF1F4;font:600 12px/1.15 inherit;text-align:left}
.pals button i{display:block;width:100%;height:18px;border-radius:7px;border:1px solid rgba(255,255,255,.18);margin-bottom:3px}
.pals button small{font-weight:400;font-size:10.5px;color:#8E97A1;line-height:1.2}
.pals button.on{border-color:#BCD0E6;box-shadow:0 0 0 1px #BCD0E6;background:rgba(188,208,230,.12)}
.pals button:hover:not(.on){border-color:rgba(188,208,230,.5)}
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
.phone{pointer-events:auto;position:fixed;right:calc(min(400px,100vw - 32px) + 32px);top:50%;transform:translateY(-50%);width:390px;height:min(820px,calc(100vh - 40px));border-radius:36px;border:10px solid #0E1012;box-shadow:0 30px 80px rgba(0,0,0,.55);overflow:hidden;background:#000;display:none}
.phone.on{display:block}
.phone iframe{width:100%;height:100%;border:0;display:block}
@media (max-width:900px){.phone{display:none!important}}
</style>
<div class="p">
  <header><b>Студия <i>✦</i></b>
    <button class="ib" data-a="undo" title="Отменить последнее (Ctrl+Z)">↶</button>
    <button class="ib" data-a="cmp" title="Удерживайте — покажу, как на сайте сейчас">◑</button>
    <button class="ib" data-a="pick" title="Что это? Нажмите, потом кликните по любому месту сайта — открою его настройки">🎯</button>
    <button class="ib" data-a="phone" title="Показать на телефоне">📱</button>
    <button class="ib" data-a="help" title="Как пользоваться">?</button>
    <button class="ib" data-a="min" title="Свернуть">—</button></header>
  <div class="srch"><input type="text" placeholder="Найти настройку: курсор, кнопки, звёзды…" spellcheck="false"><button data-a="sclear" title="Очистить" hidden>✕</button></div>
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
  const get = k => k.startsWith('colors.') ? st.colors[k.slice(7)] : k.startsWith('texts.') ? (st.texts || {})[k.slice(6)] : st[k];
  const put = (k, v, quiet) => { if (!k.startsWith('colors.')) return set(k, v, quiet);
    if (!quiet) push(); st.colors[k.slice(7)] = v; save(); if (quiet) applySoon(); else { S.apply(live()); sync(); } };
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
    if (f.show && !f.show(st)) return '';
    if (f.type === 'h') return `<div class="hh">${f.t}</div>`;
    if (f.type === 'note') return `<div class="note">${f.t}</div>`;
    if (f.type === 'cpresets') return `<div class="f"><div class="l">${f.t}</div><div class="cpr">${CUR_PRESETS.map((p, i) => `<button data-cp="${i}">${p.n}<small>${p.d}</small></button>`).join('')}</div></div>`;
    const v = get(f.k), has = v !== undefined && v !== null && v !== '';
    if (f.type === 'tiles') return `<div class="f" data-f="${f.k}"><div class="tiles" data-k="${f.k}">${SHAPE_N.map(([val, n]) => `<button data-tile="${val}" class="${(v || 'star') === val ? 'on' : ''}${val === 'ring' ? ' ring' : ''}" title="${n}"><svg viewBox="-13 -13 26 26"><path d="${SHAPES[val] || ''}" stroke-linejoin="round"/></svg>${n}</button>`).join('')}</div></div>`;
    if (f.type === 'color' && !f.k.startsWith('colors.')){ const c = v || f.def;
      return `<div class="f" data-f="${f.k}"><label>${f.t}${has ? `<button class="x" data-reset="${f.k}">сбросить</button>` : ''}</label>${f.h ? `<small>${f.h}</small>` : ''}
        <div class="col"><button class="sw${openPk === f.k ? ' on' : ''}" data-sw="${f.k}" style="--c:${esc(c)}" title="Открыть палитру"></button><input type="text" data-k="${f.k}" value="${esc(c)}" maxlength="7" spellcheck="false"></div>${openPk === f.k ? picker(f.k, c) : ''}</div>`; }
    const reset = has && !f.k.startsWith('colors.') && f.type !== 'btn' ? `<button class="x" data-reset="${f.k}">сбросить</button>` : '';
    if (f.k.startsWith('colors.')){ const c = v || '#000000', dflt = headC[f.k.slice(7)];
      return `<div class="f" data-f="${f.k}"><label>${f.t}${c.toUpperCase() !== dflt ? `<button class="x" data-cdef="${f.k}">как было</button>` : ''}</label>${f.h ? `<small>${f.h}</small>` : ''}
        <div class="col"><button class="sw${openPk === f.k ? ' on' : ''}" data-sw="${f.k}" style="--c:${esc(c)}" title="Открыть палитру"></button><input type="text" data-k="${f.k}" value="${esc(c)}" maxlength="7" spellcheck="false"></div>${openPk === f.k ? picker(f.k, c) : ''}</div>`; }
    if (f.type === 'btn') return `<div class="f"><button class="big sec" data-a="${f.k}">${f.label}</button></div>`;
    if (f.type === 'font') return `<div class="f" data-f="${f.k}"><label>${f.t}${reset}</label><select data-k="${f.k}">${FONT_OPTS.map(([val, n]) => `<option value="${esc(val)}"${String(v || '') === val ? ' selected' : ''} style="font-family:'${esc(val)}'">${esc(n)}</option>`).join('')}</select></div>`;
    if (f.type === 'seg') return `<div class="f" data-f="${f.k}"><div class="l">${f.t}${reset}</div>${f.h ? `<small>${f.h}</small>` : ''}<div class="seg" data-k="${f.k}">${f.o.map(([val, n]) => `<button data-v='${JSON.stringify(val)}' class="${(has ? v === val : val === '') ? 'on' : ''}">${n}</button>`).join('')}</div></div>`;
    if (f.type === 'range'){ const mid = has ? v : f.def != null ? f.def : (f.min + f.max) / 2;
      return `<div class="f" data-f="${f.k}"><label>${f.t}<span><span class="v">${has ? (+v).toString().replace('.', ',') + ' ' + f.u : 'как есть'}</span>${reset}</span></label>${f.h ? `<small>${f.h}</small>` : ''}<input type="range" data-k="${f.k}" min="${f.min}" max="${f.max}" step="${f.step}" value="${mid}"></div>`; }
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
    b.order = ord; save(); S.apply(live()); render();
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
<!-- Настройки Студии: шрифты, формы, анимации, эффекты, тексты. Менять через Студию. -->
<script>window.mlStudio=${JSON.stringify(rest, null, 1).replace(/\n\s*/g, ' ').replace(/</g, '\\u003c')};</script>
<!-- Оформление сайта (комнаты, каталог, день/ночь, фонарик, курсор). Не трогать. -->
<script defer src="${BUNDLE}"></script>`;
  }
  const curTod = () => TOD_COLORS[root.dataset.tod] ? root.dataset.tod : 'day';
  function setTod(k){ const mb = D.querySelector('.ml-tod-menu button[data-m="' + k + '"]'); if (mb) mb.click(); else { S.ls.set('ml-tod', k); root.dataset.tod = k; }
    const ifr = $('.phone iframe'); if (ifr && ifr.src) try { ifr.contentDocument.documentElement.dataset.tod = k; } catch (x){} }
  function colorUI(){
    const m = curTod(), M = TOD_COLORS[m];
    let g0 = '';
    const pals = PALS.map((p, i) => { const h = p.g !== g0 ? `<div class="pgh">${p.g}</div>` : ''; g0 = p.g; const c = p.c;
      return h + `<button data-pal="${i}" class="${palOn(p) ? 'on' : ''}" title="${esc(p.d)}"><i style="background:linear-gradient(90deg,${c.light} 0 25%,${c.moonDay} 25% 50%,${c.night} 50% 75%,${c.moon} 75%)"></i><b>${p.n}</b><small>${p.d}</small></button>`; }).join('');
    return `<div class="tl" style="margin-top:4px">Готовые палитры</div>
      <div class="note" style="margin-top:4px">Одним нажатием красит весь сайт — утро, день, вечер и ночь, корзину, поиск, каталог, карточки, курсор. Форму, шрифты и эффекты не трогает. Потом любой цвет можно подправить ниже.</div>
      <div class="pals">${pals}</div>
      ${ownUI()}
      <div class="tl">1. Какое время суток красим?</div>
      <div class="todpick">${TOD_ORDER.map(k => { const t = TOD_COLORS[k]; return `<button data-ctod="${k}" class="${k === m ? 'on' : ''}"><span>${t.ic}</span><b>${t.name}</b><i>${t.f.map(f => `<s style="--c:${esc(get(f.k))}"></s>`).join('')}</i></button>`; }).join('')}</div>
      <div class="tl">2. Цвета: ${M.name.toLowerCase()} <span style="color:#6E7780">· ${M.when}</span></div>
      <div class="note" style="margin-top:4px">Сайт сейчас показан как <b>${M.name.toLowerCase()}</b>. Нажмите на квадратик цвета и ведите по палитре — видно сразу.</div>
      ${M.f.map(field).join('')}
      <button class="big sec" data-a="ctod-reset">Вернуть цвета «${M.name}» как были</button>`;
  }
  function ownUI(){
    const base = gen && gen.kind === 'one' ? gen.base : (st.colors.moonDay || '#7895B5');
    const cards = gen ? gen.list.map((p, i) => { const c = p.c; return `<button data-gen="${i}" class="${palOn(p) ? 'on' : ''}" title="${esc(p.d)}"><i style="background:linear-gradient(90deg,${c.light} 0 25%,${c.moonDay} 25% 50%,${c.night} 50% 75%,${c.moon} 75%)"></i><b>${esc(p.n)}</b><small>${esc(p.d)}</small></button>`; }).join('') : '';
    return `<div class="tl">Своя палитра</div>
      <div class="own">
        <div class="own-r"><label class="own-c" title="Выбрать цвет"><input type="color" data-own="pick" value="${esc(base.slice(0, 7).toLowerCase())}"><span style="--c:${esc(base)}"></span></label>
          <input type="text" data-own="hex" value="${esc(base)}" maxlength="7" spellcheck="false" placeholder="#7895B5"><button class="mini" data-a="own-go">Подобрать от цвета</button></div>
        <button class="big sec own-ph" data-a="own-photo">🖼 Палитра из фото или логотипа</button>
        <input type="file" accept="image/*" data-own="file" hidden>
        <div class="note" style="margin-top:6px">Цвет: выберите кружком или впишите HEX — покажу 9 вариантов. Фото: интерьер, ткань, логотип клиента — можно и перетащить картинку сюда, и вставить Ctrl+V.</div>
        ${gen && gen.kind === 'photo' ? `<div class="own-sw">${gen.cols.slice(0, 8).map(c => `<s style="--c:${c.hex};flex:${Math.max(.4, c.n * 10)}" title="${c.hex}"></s>`).join('')}</div>` : ''}
        ${gen && gen.kind === 'photo' && gen.img ? `<img class="own-img" src="${gen.img}" alt="">` : ''}
        ${cards ? `<div class="pals">${cards}</div>` : ''}
      </div>`;
  }
  function genFrom(kind, v){
    if (kind === 'one'){ v = String(v || '').trim(); if (!/^#?[0-9a-f]{6}$/i.test(v)) return toast('Нужен цвет вида #7895B5'); v = (v[0] === '#' ? v : '#' + v).toUpperCase(); gen = {kind, base: v, list: variants(v)}; sync(); return; }
    const f = v; if (!f || !/^image\//.test(f.type)) return toast('Нужна картинка: jpg, png, webp, svg');
    const rd = new FileReader(); rd.onload = () => { const im = new Image(); im.onload = () => {
      const cols = photoColors(im); if (!cols.length) return toast('Не получилось прочитать цвета');
      let thumb = ''; try { const cv = D.createElement('canvas'), r = 220 / Math.max(im.width, im.height); cv.width = im.width * r; cv.height = im.height * r; cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); thumb = cv.toDataURL('image/jpeg', .8); } catch (e){}
      gen = {kind: 'photo', cols, img: thumb, list: photoPalettes(cols)}; sync(); toast('Нашёл цвета — выберите вариант'); };
      im.onerror = () => toast('Картинка не открылась'); im.src = rd.result; }; rd.readAsDataURL(f);
  }
  // ---------- проверка перед экспортом (24.11): главная, каталог, окно товара, корзина, поиск × утро/день/вечер/ночь
  // ищем текст, который плохо читается (контраст < 3), и остатки фирменных голубых, если выбрана другая палитра
  let audit = null; // {run, step, res:[{t,m,n}], list:[...]}
  const BLUES = ['#BCD0E6', '#7895B5', '#5F7896', '#C9D6E4', '#D8DEE4', '#EEF1F4', '#DDE2E8'];
  const rgbOf = s => { const m = String(s).match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?/); return m ? [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]] : null; };
  const lumA = c => .2126 * lin(c[0]) + .7152 * lin(c[1]) + .0722 * lin(c[2]);
  const crA = (a, b) => { const x = lumA(a), y = lumA(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const inv = (c, a) => c.map((v, i) => i < 3 ? v + a * (255 - 2 * v) : v);
  function auditDoc(doc, scope, label, tod){
    const W = doc.defaultView, out = [], seen = new Set();
    const blues = JSON.stringify(Object.values(st.colors).map(x => String(x).toUpperCase()).sort()) === JSON.stringify(Object.values(DEF_C).map(x => x.toUpperCase()).sort()) ? [] :
      BLUES.filter(b => !Object.values(st.colors).some(c => String(c).toUpperCase() === b)).map(b => hex2rgb(b).join(','));
    const csC = new Map(), cs = el => { let c = csC.get(el); if (!c){ c = W.getComputedStyle(el); csC.set(el, c); } return c; };
    const roots = [...doc.querySelectorAll(scope)];
    roots.forEach(root => root.querySelectorAll('*').forEach(el => {
      if (out.length > 60 || el.closest('.mls-host,script,style,svg,noscript,iframe,canvas')) return;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
      const c = cs(el); if (c.display === 'none' || c.visibility !== 'visible') return;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
      const fg0 = rgbOf(c.color);
      // «чужой» голубой
      if (blues.length){ const hit = ['color', 'backgroundColor', 'borderTopColor'].find(p => { const v = rgbOf(c[p]); return v && v[3] > .3 && blues.includes(v.slice(0, 3).map(Math.round).join(',')) && (p !== 'color' || own) && (p !== 'borderTopColor' || parseFloat(c.borderTopWidth) > 0); });
        if (hit){ const k = 'b' + hit + (el.className || el.tagName); if (!seen.has(k)){ seen.add(k); out.push({kind: 'blue', el, txt: (el.textContent || '').trim().slice(0, 50) || '(' + el.tagName.toLowerCase() + ')', prop: hit, fg: rgb2hex(rgbOf(c[hit]).slice(0, 3)), where: label, tod}); } } }
      if (!own || !fg0 || fg0[3] < .35) return;
      // фон и фильтры по цепочке родителей
      let op = 1, bg = null, bgAt = -1; const chain = [];
      for (let p = el; p && p.nodeType === 1; p = p.parentElement){
        const pc = cs(p); chain.push(p); op *= +pc.opacity;
        if (!bg){ if (pc.backgroundImage && pc.backgroundImage !== 'none'){ const g = pc.backgroundImage.match(/rgba?\([^)]+\)/); if (/url\(/.test(pc.backgroundImage) || !g) return; bg = rgbOf(g[0]); bgAt = chain.length - 1; }
          else { const b = rgbOf(pc.backgroundColor); if (b && b[3] >= .6){ bg = b; bgAt = chain.length - 1; } } }
      }
      if (op < .5) return;
      if (!bg){ bg = [255, 255, 255, 1]; bgAt = chain.length; }
      let fg = fg0, bb = bg;
      chain.forEach((p, i) => { const f = cs(p).filter, m = f && f.match(/invert\(([\d.]+)\)/); if (!m) return; const a = +m[1]; fg = inv(fg, a); if (i >= bgAt) bb = inv(bb, a); });
      if (fg[3] < 1) fg = fg.map((v, i) => i < 3 ? v * fg[3] + bb[i] * (1 - fg[3]) : 1);
      const ratio = crA(fg, bb);
      if (ratio >= 3) return;
      const txt = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 50), k = txt + '|' + Math.round(ratio * 10);
      if (seen.has(k)) return; seen.add(k);
      out.push({kind: 'read', el, txt, ratio, fg: rgb2hex(fg.slice(0, 3)), bg: rgb2hex(bb.slice(0, 3)), where: label, tod});
    }));
    return out;
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const noAnim = doc => { const s = doc.createElement('style'); s.className = 'mls-audit'; s.textContent = '*,*::before,*::after{transition:none!important;animation-duration:0s!important;animation-delay:0s!important}'; doc.head.appendChild(s); return () => s.remove(); };
  async function overTods(doc, scope, label, res, list){
    const html = doc.documentElement, was = html.dataset.tod, off = noAnim(doc);
    for (const m of TOD_ORDER){ html.dataset.tod = m; await wait(120);
      const a = auditDoc(doc, scope, label, m); res.push({t: label, m, read: a.filter(x => x.kind === 'read').length, blue: a.filter(x => x.kind === 'blue').length}); list.push(...a);
      audit.step = label + ' · ' + TOD_COLORS[m].name; toast('Проверяю: ' + audit.step); }
    html.dataset.tod = was; off();
  }
  function frameDoc(path){
    return new Promise(res => { const f = D.createElement('iframe'); f.style.cssText = 'position:fixed;left:-3000px;top:0;width:1280px;height:900px;border:0;visibility:hidden';
      const u = new URL(path, location.href); u.searchParams.set('studio-frame', '1'); f.src = u.toString();
      let done = false; const fin = ok => { if (done) return; done = true; res(ok ? f : null); };
      f.onload = () => setTimeout(() => fin(true), 3500); setTimeout(() => fin(false), 20000); D.body.appendChild(f); });
  }
  async function runAudit(){
    if (audit && audit.run) return;
    audit = {run: true, res: [], list: [], step: ''}; sync();
    const res = audit.res, list = audit.list, isHome = location.pathname === '/', isCat = /^\/catalog/.test(location.pathname);
    try {
      await overTods(D, 'body', isHome ? 'Главная' : 'Эта страница', res, list);
      if (window.tcart__openCart){ window.tcart__openCart(); await wait(700); await overTods(D, '.t706', 'Корзина', res, list); try { window.tcart__closeCart(); } catch (e){ const cb = D.querySelector('.t706__close,.t706__sidebar-close'); if (cb) cb.click(); } await wait(300); }
      if (window.mlSearchOpen){ window.mlSearchOpen('люстра'); for (let i = 0; i < 40 && !D.querySelector('.ml-sr-grid,.ml-sr-empty'); i++) await wait(250); await overTods(D, '.ml-sr', 'Поиск', res, list);
        const x = D.querySelector('.ml-sr-x'); if (x) x.click(); }
      for (const [path, label] of [[isHome ? null : '/', 'Главная'], [isCat ? null : '/catalog', 'Каталог']]){
        if (!path) continue; audit.step = label + ' (загружаю)'; toast('Открываю: ' + label);
        const f = await frameDoc(path); if (!f){ res.push({t: label, m: '', err: 1}); continue; }
        const d = f.contentDocument; await overTods(d, 'body', label, res, list);
        if (label === 'Каталог'){ const c = d.querySelector('.mk-card:not(.ml-hc-tile)'); if (c){ c.click(); await wait(800); if (d.querySelector('.mk-pop:not([hidden])')) await overTods(d, '.mk-pop', 'Окно товара', res, list); } }
        f.remove();
      }
    } catch (e){ audit.err = String(e && e.message || e); }
    audit.run = false; audit.at = new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    const n = list.length; toast(n ? 'Проверка: нашлось ' + n : 'Проверка: всё в порядке ✓'); sync();
  }
  function auditUI(){
    if (!audit) return `<div class="note">Пройду главную, каталог, окно товара, корзину и поиск в каждом времени суток: где текст плохо читается и не остались ли старые голубые цвета при другой палитре. Около минуты; сайт в это время будет мигать.</div><button class="big sec" data-a="audit">Проверить сайт</button>`;
    if (audit.run) return `<div class="note"><span class="aud-spin"></span> Проверяю… ${esc(audit.step || '')}</div>`;
    const by = {}; audit.res.forEach(r => { (by[r.t] = by[r.t] || {})[r.m] = r; });
    const cell = r => !r ? '<td>—</td>' : r.err ? '<td class="bad">не открылась</td>' : (r.read + r.blue) ? `<td class="bad">${r.read ? r.read + ' ◐' : ''}${r.read && r.blue ? ' ' : ''}${r.blue ? r.blue + ' ●' : ''}</td>` : '<td class="ok">✓</td>';
    const tbl = `<table class="aud"><tr><th></th>${TOD_ORDER.map(m => `<th>${TOD_COLORS[m].ic}</th>`).join('')}</tr>${Object.entries(by).map(([t, ms]) => `<tr><th>${esc(t)}</th>${ms[''] && ms[''].err ? `<td colspan="4" class="bad">не открылась</td>` : TOD_ORDER.map(m => cell(ms[m])).join('')}</tr>`).join('')}</table>`;
    const items = audit.list.slice(0, 40).map((x, i) => `<div class="chg"><div class="n">${x.kind === 'read' ? `<i style="--c:${x.bg};color:${x.fg};display:inline-flex;align-items:center;justify-content:center;font:700 9px/1 sans-serif">Аа</i>` : `<i style="--c:${x.fg}"></i>`}${esc(x.txt || '(без текста)')}
      <small>${esc(x.where)} · ${TOD_COLORS[x.tod].name.toLowerCase()} → ${x.kind === 'read' ? 'плохо читается, контраст ' + x.ratio.toFixed(1) + ' (нужно от 3)' : 'старый голубой ' + x.fg}</small></div>
      ${x.el && x.el.ownerDocument === D ? `<button data-aud="${i}">показать</button>` : ''}</div>`).join('');
    return `<div class="note">${audit.list.length ? `Нашлось ${audit.list.length}: ◐ — плохо читается, ● — остался старый голубой. Обычно хватает подправить цвет этого времени суток во вкладке «Цвета».` : '<b>Всё в порядке ✓</b> Текст читается, чужих цветов нет.'}${audit.err ? ' Ошибка: ' + esc(audit.err) : ''}</div>${tbl}${items}
      <button class="big sec" data-a="audit">Проверить ещё раз${audit.at ? ' · было в ' + audit.at : ''}</button>`;
  }
  function showAudit(x){
    if (!x || !x.el) return; setTod(x.tod);
    if (x.where === 'Корзина' && window.tcart__openCart) window.tcart__openCart();
    if (x.where === 'Поиск' && window.mlSearchOpen) window.mlSearchOpen('люстра');
    setTimeout(() => { if (!x.el.isConnected) return toast('Этот элемент уже перерисован — проверьте ещё раз'); x.el.scrollIntoView({block: 'center', behavior: 'smooth'});
      const o = x.el.style.outline, oo = x.el.style.outlineOffset; x.el.style.outline = '3px solid #FF5A5A'; x.el.style.outlineOffset = '3px'; setTimeout(() => { x.el.style.outline = o; x.el.style.outlineOffset = oo; }, 2600); }, 500);
  }
  function doneUI(){
    const ch = changes();
    const bl = st.blocks && st.blocks[location.pathname] && ((st.blocks[location.pathname].order || []).length || (st.blocks[location.pathname].hidden || []).length);
    const row = f => { const v = get(f.k), col = f.type === 'color';
      return `<div class="chg"><div class="n">${col ? `<i style="--c:${esc(v)}"></i>` : ''}${esc((f.sec && f.t ? f.sec + ' · ' : '') + (f.t || 'Форма курсора'))}<small>${esc(TABN[f.tab])}${f.grp ? ' · ' + esc(f.grp) : ''} → <b>${esc(col ? v : valName(f, v))}</b></small></div>
        <button data-goto="${f.k}" title="Открыть эту настройку">открыть</button>${f.k.startsWith('colors.') ? `<button data-cdef="${f.k}">вернуть</button>` : `<button data-reset="${f.k}">вернуть</button>`}</div>`; };
    return `<div class="note"><b>Как закрепить вид для всех посетителей:</b><br>1. Нажмите «Скопировать для HEAD».<br>2. Тильда → Настройки сайта → Вставка кода → «HTML-код для вставки внутрь HEAD» → «Редактировать код».<br>3. Выделите всё старое (Ctrl+A), вставьте (Ctrl+V), «Сохранить».<br>4. На странице проекта — «Опубликовать все страницы».</div>
      <div class="tl">Проверка перед экспортом</div>
      ${auditUI()}
      <div class="tl">Что вы поменяли (${ch.length})</div>
      ${ch.length ? ch.map(row).join('') : '<div class="note">Пока всё как на сайте — менять нечего.</div>'}
      ${bl ? '<div class="note warn">Порядок блоков в код не попадает — его повторяют в редакторе Тильды (вкладка «Блоки»).</div>' : ''}
      <button class="big" data-a="copy">Скопировать для HEAD</button>
      <textarea readonly>${esc(exportCode())}</textarea>
      <button class="big sec" data-a="reset-all">Сбросить черновик — вернуть как на сайте</button>`;
  }
  // ---------- мои варианты: сохранить и сравнить несколько видов
  const saves = () => { try { return JSON.parse(S.ls.get('ml-studio-saves') || '[]'); } catch (e){ return []; } };
  const savesPut = a => S.ls.set('ml-studio-saves', JSON.stringify(a));
  const HELP = `<div class="note help"><b>Как пользоваться Студией</b><ol>
    <li>Выберите пресет ниже — или идите по вкладкам. Всё видно на сайте сразу и <b>только вам</b>.</li>
    <li><span class="k">🎯</span> нажмите и кликните по любому месту сайта — откроется его настройка.</li>
    <li><span class="k">◑</span> удерживайте — покажу, как сайт выглядит сейчас у всех. Отпустите — снова ваш вариант.</li>
    <li><span class="k">✎</span> вкладка «Тексты» — надписи комнат, фонарика, каталога можно поправить прямо на сайте.</li>
    <li><span class="k">↶</span> отмена шага, <span class="k">📱</span> как на телефоне. Оранжевая точка на вкладке — там что-то изменено.</li>
    <li>Понравилось — сохраните вариант (внизу) или вкладка <b>«Готово»</b>: код для Тильды.</li></ol>
    <button class="x" data-a="help-off">понятно, скрыть</button></div>`;
  let query = '';
  function searchUI(){
    const q = query.toLowerCase(), hit = f => [f.t, f.h, f.grp, ...(f.o || []).map(o => o[1]), ...(f.type === 'tiles' ? SHAPE_N.map(x => x[1]) : []), TABN[f.tab]].some(x => x && String(x).toLowerCase().includes(q));
    const found = ALL.filter(hit); if (!found.length) return `<div class="note">Ничего не нашлось по «${esc(query)}». Попробуйте другое слово: «цвет», «кнопки», «звёзды», «шапка».</div>`;
    let last = '', out = '';
    found.forEach(f => { const g = TABN[f.tab] + (f.grp ? ' · ' + f.grp : '') + (f.sec ? ' · ' + f.sec : ''); if (g !== last){ out += `<div class="sgrp">${esc(g)}</div>`; last = g; }
      out += f.tod && f.tod !== curTod() ? `<div class="f"><div class="l">${esc(f.t)}</div><button class="big sec" data-ctod="${f.tod}" style="margin-top:0">Показать «${esc(f.grp)}» и настроить</button></div>` : field(Object.assign({}, f, {show: null, t: f.t || 'Форма курсора'})); });
    return out;
  }
  function lookUI(){
    const sv = saves();
    return `${S.ls.get('ml-studio-help-off') ? '' : HELP}
      ${reloadNeeded ? '<div class="note warn">Курсор или фонарик поменяются после перезагрузки страницы. <button class="x" data-a="reload" style="color:#FFB46B">Перезагрузить</button></div>' : ''}
      <div class="tl">Готовые образы — нажмите, чтобы примерить</div>
      <div class="pr">${PRESETS.map((p, i) => `<button data-p="${i}">${p.n}<small>${p.d}</small></button>`).join('')}</div>
      <div class="hh">Мои варианты</div>
      <small style="display:block;color:#8E97A1;font-size:11.5px;margin-top:4px">Сохраните то, что получилось, и переключайтесь между вариантами, чтобы сравнить.</small>
      <div class="saves"><input type="text" placeholder="Название, например «Зима»" maxlength="40"><button data-a="save">Сохранить</button></div>
      ${sv.map((x, i) => `<div class="sv-l"><div class="n">${esc(x.n)}<small>${esc(x.d || '')}</small></div><button data-sva="${i}">Примерить</button><button data-svd="${i}" title="Удалить">✕</button></div>`).join('')}`;
  }
  // оранжевая точка на вкладках, где что-то изменено
  function dots(){ const ch = new Set(changes().map(f => f.tab)); if (st.blocks && st.blocks[location.pathname]) ch.add('blocks');
    nav.querySelectorAll('button').forEach(b => b.classList.toggle('ch', ch.has(b.dataset.t))); }
  function render(){
    nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', !query && b.dataset.t === tab));
    $('.srch button').hidden = !query;
    if (query) main.innerHTML = searchUI();
    else if (tab === 'look') main.innerHTML = lookUI();
    else if (tab === 'color') main.innerHTML = colorUI();
    else if (tab === 'blocks') main.innerHTML = blocksUI();
    else if (tab === 'text') main.innerHTML = textUI();
    else if (tab === 'done') main.innerHTML = doneUI();
    else main.innerHTML = (reloadNeeded && (tab === 'fx' || tab === 'cursor') ? '<div class="note warn">Нужна перезагрузка, чтобы увидеть курсор/фонарик. <button class="x" data-a="reload" style="color:#FFB46B">Перезагрузить</button></div>' : '') + F[tab].map(field).join('');
    dots();
  }
  // открыть настройку: вкладка + прокрутка + подсветка
  function goto(k){ const f = ALL.find(x => x.k === k) || (k.startsWith('texts.') ? {k, tab: 'text'} : null); if (!f) return;
    query = ''; $('.srch input').value = ''; tab = f.tab; S.ls.set('ml-studio-tab', tab);
    if (f.tod && f.tod !== curTod()) setTod(f.tod);
    if (P.classList.contains('min')){ P.classList.remove('min'); S.ls.set('ml-studio-min', null); }
    render(); const el = main.querySelector(`[data-f="${k}"]`);
    if (el){ el.scrollIntoView({block: 'center'}); el.classList.remove('flashf'); void el.offsetWidth; el.classList.add('flashf'); } }
  function sync(){ const y = main.scrollTop; render(); main.scrollTop = y; }

  // ползунок: пока тянут — меняется только подпись и сайт; отпустили — шаг в историю и перерисовка (появится «сбросить»)
  let gesture = false;
  main.addEventListener('input', e => { const el = e.target, k = el.dataset.k; if (!k) return;
    if (el.type === 'range'){ if (!gesture){ push(); gesture = true; }
      const f = ALL.find(x => x.k === k), lab = el.closest('.f').querySelector('.v');
      if (lab && f) lab.textContent = (+el.value).toString().replace('.', ',') + ' ' + f.u;
      set(k, +el.value, true); return; }
    if (el.type === 'text'){ let v = el.value.trim(); if (v && v[0] !== '#') v = '#' + v;
      if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)){ v = v.toUpperCase(); if (!gesture){ push(); gesture = true; } if (pkHsv && pkHsv.k === k) pkHsv.hsv = rgb2hsv(hex2rgb(v)); put(k, v, true); pkPaint(k, v); } } });
  main.addEventListener('change', e => { const o = e.target.dataset && e.target.dataset.own;
    if (o === 'pick' || o === 'hex'){ genFrom('one', e.target.value); return; }
    if (o === 'file'){ genFrom('photo', e.target.files[0]); e.target.value = ''; return; } });
  main.addEventListener('dragover', e => { if (tab === 'color' && e.dataTransfer && [...e.dataTransfer.items].some(i => i.kind === 'file')){ e.preventDefault(); main.classList.add('drop'); } });
  main.addEventListener('dragleave', () => main.classList.remove('drop'));
  main.addEventListener('drop', e => { main.classList.remove('drop'); const f = e.dataTransfer && e.dataTransfer.files[0]; if (!f || tab !== 'color') return; e.preventDefault(); genFrom('photo', f); });
  D.addEventListener('paste', e => { if (tab !== 'color' || P.classList.contains('min')) return; const it = [...((e.clipboardData || {}).items || [])].find(i => /^image\//.test(i.type)); if (!it) return; e.preventDefault(); genFrom('photo', it.getAsFile()); });
  main.addEventListener('change', e => { const el = e.target;
    if (el.tagName === 'SELECT'){ set(el.dataset.k, el.value); return; }
    if (gesture){ gesture = false; const k = el.dataset.k; if (k && (k.startsWith('colors.') || k === 'curHex')) remember(k, get(k)); sync(); if (MOTION_KEYS.includes(k)) replaySoon(); } });
  main.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.type === 'text') e.target.blur(); });
  sh.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const seg = b.closest('.seg'); if (seg){ set(seg.dataset.k, JSON.parse(b.dataset.v)); return; }
    if (b.dataset.tile){ set('curShape', b.dataset.tile === 'star' ? '' : b.dataset.tile); return; }
    if (b.dataset.cp != null){ push(); const cp = CUR_PRESETS[+b.dataset.cp]; CUR_KEYS.forEach(k => delete st[k]); Object.assign(st, cp.c); save(); S.apply(live()); sync(); toast('Курсор «' + cp.n + '» — подвигайте мышью по сайту'); return; }
    if (b.dataset.goto){ goto(b.dataset.goto); return; }
    if (b.dataset.reset && b.dataset.reset.startsWith('texts.')){ push(); putText(b.dataset.reset.slice(6), ''); sync(); return; }
    if (b.dataset.treset){ push(); putText(b.dataset.treset, ''); sync(); return; }
    if (b.dataset.tshow){ const el = [...D.querySelectorAll('[data-mlt="' + b.dataset.tshow + '"]')].find(e => !e.closest('.mls-host') && e.offsetHeight > 0);
      if (!el) return toast('Этот текст сейчас скрыт или на другой странице'); el.scrollIntoView({behavior: 'smooth', block: 'center'});
      const o = el.style.outline; el.style.outline = '2px solid #BCD0E6'; el.style.outlineOffset = '4px'; setTimeout(() => { el.style.outline = o; }, 1600); return; }
    if (b.dataset.sva != null){ const x = saves()[+b.dataset.sva]; if (!x) return; push(); const keepT = st.texts; st = JSON.parse(JSON.stringify(x.st)); st.texts = keepT; st.colors = Object.assign({}, headC, st.colors || {}); save(); S.apply(live()); sync(); replay(); toast('Вариант «' + x.n + '»'); return; }
    if (b.dataset.svd != null){ const a = saves(); a.splice(+b.dataset.svd, 1); savesPut(a); sync(); return; }
    if (b.dataset.aud != null){ showAudit(audit && audit.list[+b.dataset.aud]); return; }
    if (b.dataset.gen != null && gen){ const p = gen.list[+b.dataset.gen]; push(); st.colors = Object.assign({}, st.colors, p.c); openPk = null; pkHsv = null; save(); S.apply(live()); sync(); toast('Палитра «' + p.n + '»'); return; }
    if (b.dataset.pal != null){ const p = PALS[+b.dataset.pal]; push(); st.colors = Object.assign({}, st.colors, p.c); openPk = null; pkHsv = null; save(); S.apply(live()); sync(); toast('Палитра «' + p.n + '» — загляните в ночь и корзину'); return; }
    if (b.dataset.ctod){ setTod(b.dataset.ctod); openPk = null; pkHsv = null; sync(); return; }
    if (b.dataset.sw){ openPk = openPk === b.dataset.sw ? null : b.dataset.sw; pkHsv = null; sync(); return; }
    if (b.dataset.tone){ const k = b.closest('.pk').dataset.pk; pkHsv = {k, hsv: rgb2hsv(hex2rgb(b.dataset.tone))}; remember(k, b.dataset.tone); put(k, b.dataset.tone); return; }
    if (b.dataset.reset){ set(b.dataset.reset, ''); return; }
    if (b.dataset.cdef){ pkHsv = null; put(b.dataset.cdef, headC[b.dataset.cdef.slice(7)]); return; }
    if (b.dataset.p != null){ push(); const p = PRESETS[+b.dataset.p]; const cur = st.cursor, fl = st.flash;
      // «Базовый» — заводской вид: исходные цвета (не из HEAD), никаких настроек, курсор-звезда и фонарик по умолчанию
      if (p.base){ if (st.cursor !== undefined || st.flash !== undefined) reloadNeeded = true; st = {blocks: st.blocks, texts: st.texts, colors: Object.assign({}, DEF_C)}; }
      else { st = Object.assign({cursor: cur, flash: fl}, JSON.parse(JSON.stringify(p.c)), {blocks: st.blocks, texts: st.texts}); st.colors = Object.assign({}, headC, p.c.colors || {}); }
      Object.keys(st).forEach(k => st[k] === undefined && delete st[k]); save(); S.apply(live()); sync(); toast('Пресет «' + p.n + '»'); replay(); return; }
    if (b.dataset.b){ moveBlock(b.closest('.bl').dataset.id, b.dataset.b); return; }
    const a = b.dataset.a;
    if (a === 'audit') runAudit();
    if (a === 'own-go') genFrom('one', (main.querySelector('[data-own="hex"]') || {}).value);
    if (a === 'own-photo') main.querySelector('[data-own="file"]').click();
    if (a === 'save'){ const inp = main.querySelector('.saves input'), n = (inp.value || '').trim() || 'Вариант ' + (saves().length + 1);
      const arr = saves().filter(x => x.n !== n); arr.unshift({n, d: new Date().toLocaleDateString('ru-RU'), st: Object.assign({}, st, {blocks: undefined, texts: undefined})}); savesPut(arr.slice(0, 20)); sync(); toast('Сохранено: ' + n); }
    if (a === 'pick') pickMode(!picking);
    if (a === 'edit'){ editMode(!editing); sync(); }
    if (a === 'help'){ S.ls.set('ml-studio-help-off', null); query = ''; sIn.value = ''; tab = 'look'; render(); main.scrollTop = 0; }
    if (a === 'help-off'){ S.ls.set('ml-studio-help-off', '1'); sync(); }
    if (a === 'sclear'){ sIn.value = ''; query = ''; render(); }
    if (a === 'min'){ P.classList.add('min'); S.ls.set('ml-studio-min', '1'); }
    if (a === 'max'){ P.classList.remove('min'); S.ls.set('ml-studio-min', null); }
    if (a === 'undo'){ const h = hist.pop(); if (!h) return toast('Отменять нечего'); st = JSON.parse(h); save(); S.apply(live()); render(); toast('Отменено'); }
    if (a === 'phone') phone();
    if (a === '_replay') replay();
    if (a === 'reload') location.reload();
    if (a === 'ctod-reset'){ push(); TOD_COLORS[curTod()].f.forEach(f => { const k = f.k.slice(7); st.colors[k] = headC[k]; }); openPk = null; pkHsv = null; save(); S.apply(live()); sync(); toast('Цвета вернулись'); }
    if (a === 'blocks-reset'){ push(); if (st.blocks) delete st.blocks[location.pathname]; save(); S.apply(live()); render(); }
    if (a === 'copy'){ const txt = exportCode(); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => toast('Скопировано — вставьте в HEAD Тильды'), () => { const t = main.querySelector('textarea'); t.select(); D.execCommand('copy'); toast('Скопировано'); }); }
    if (a === 'reset-all'){ push(); st = Object.assign({}, S.head); st.colors = Object.assign({}, headC); save(); S.apply(live()); render(); toast('Как на сайте'); }
    if (a === 'exit'){ S.ls.set('ml-studio-on', null); const u = new URL(location.href); u.searchParams.delete('studio'); location.href = u.toString(); }
  });
  function replay(){ if (S.replay) S.replay(); }
  function phone(){ const ph = $('.phone'), on = ph.classList.toggle('on');
    if (on){ const u = new URL(location.href); u.searchParams.delete('studio'); u.searchParams.set('studio-frame', '1'); ph.querySelector('iframe').src = u.toString(); } }
  // ---------- ТЕКСТЫ наших блоков (метки data-mlt на сайте)
  const TXT = {
    'hero.eye': ['Надпись над заголовком', 'первый экран, со звёздочкой'],
    'fl.eye': ['Фонарик — надпись сверху', 'маленькими буквами над заголовком'],
    'fl.title1': ['Фонарик — заголовок, начало', 'обычным цветом'],
    'fl.title2': ['Фонарик — заголовок, окончание', 'цветом акцента, с новой строки'],
    'fl.text': ['Фонарик — описание', ''],
    'cat.title': ['Каталог — заголовок панели', 'на телефоне'],
    'cat.help1': ['«Не нашли нужное?» — заголовок', 'в каталоге слева и в плитке разделов'],
    'cat.help2': ['«Не нашли нужное?» — текст', 'в каталоге слева'],
    'cat.wa': ['«Не нашли нужное?» — подпись плитки', 'в плитках «Все разделы»'],
    'rooms.title': ['Живые комнаты — заголовок', ''],
    'rooms.text': ['Живые комнаты — описание', 'под заголовком'],
    'rooms.cta': ['Живые комнаты — кнопка', 'ведёт в WhatsApp'],
    'models.title': ['3D-модели — заголовок', ''],
    'logo.slogan': ['Подпись под логотипом', 'в шапке и в подвале'],
    'tod.text': ['Меню «время суток» — пояснение', 'открывается кнопкой времени в шапке'],
  };
  const txtLabel = k => (TXT[k] || [k])[0];
  // исходный текст (как в коде) — запомнен самим сайтом
  const origText = k => { const el = [...D.querySelectorAll('[data-mlt="' + k + '"]')].find(e => e.dataset.mltO != null); return el ? el.dataset.mltO : null; };
  const pageKeys = () => { const ks = []; D.querySelectorAll('[data-mlt]').forEach(e => { if (!e.closest('.mls-host') && !ks.includes(e.dataset.mlt)) ks.push(e.dataset.mlt); }); return ks; };
  let editing = false;
  const live = () => editing && st.headAnim ? Object.assign({}, st, {headAnim: ''}) : st;
  const edCss = D.createElement('style'); edCss.textContent = `html.mls-editing [data-mlt]{outline:1.5px dashed color-mix(in srgb,var(--ml-amber,#BCD0E6) 85%,transparent)!important;outline-offset:3px;border-radius:3px;cursor:text!important;min-width:1em}
html.mls-editing [data-mlt]:hover{background:color-mix(in srgb,var(--ml-amber,#BCD0E6) 14%,transparent)!important}
html.mls-editing [data-mlt]:focus{outline-style:solid!important;outline-width:2px!important}`;
  D.head.appendChild(edCss);
  function editMode(on){
    editing = on; root.classList.toggle('mls-editing', on);
    D.querySelectorAll('[data-mlt]').forEach(el => { if (el.closest('.mls-host')) return; if (on) el.contentEditable = 'plaintext-only'; else el.removeAttribute('contenteditable'); });
    S.apply(live(), true); if (!on) replay();
    toast(on ? 'Кликните по тексту с пунктиром и печатайте' : 'Правка на сайте выключена');
  }
  // новые блоки (каталог, окна) появились, пока включена правка
  new MutationObserver(() => { if (editing) D.querySelectorAll('[data-mlt]:not([contenteditable])').forEach(el => { if (!el.closest('.mls-host')) el.contentEditable = 'plaintext-only'; }); }).observe(D.body, {childList: true, subtree: true});
  function putText(key, v, from){
    st.texts = st.texts || {}; const o = origText(key);
    if (v === o || v === '') delete st.texts[key]; else st.texts[key] = v;
    if (!Object.keys(st.texts).length) delete st.texts;
    save();
    D.querySelectorAll('[data-mlt="' + key + '"]').forEach(el => { if (el !== from && !el.closest('.mls-host') && el.textContent !== (v || o)) el.textContent = v || o; });
    window.mlStudioCfg = live();
  }
  let typed = null;
  D.addEventListener('input', e => { const el = e.target; if (!editing || !el.dataset || el.dataset.mlt == null) return;
    if (typed !== el){ push(); typed = el; }
    putText(el.dataset.mlt, el.textContent, el);
    const ta = main.querySelector(`textarea[data-t="${el.dataset.mlt}"]`); if (ta) ta.value = el.textContent; }, true);
  D.addEventListener('focusout', e => { if (editing && e.target.dataset && e.target.dataset.mlt != null){ typed = null; sync(); } }, true);
  D.addEventListener('keydown', e => { if (editing && e.key === 'Enter' && e.target.dataset && e.target.dataset.mlt != null){ e.preventDefault(); e.target.blur(); } }, true);
  // в режиме правки ссылки с текстом не открываются
  D.addEventListener('click', e => { if (editing && e.target.closest && e.target.closest('[data-mlt]') && !e.target.closest('.mls-host')) e.preventDefault(); }, true);
  function textUI(){
    const ks = pageKeys(); Object.keys(st.texts || {}).forEach(k => { if (!ks.includes(k)) ks.push(k); });
    return `<div class="note">Здесь — тексты блоков, которые <b>не правятся в редакторе Тильды</b> (комнаты, фонарик, каталог, подписи). Остальные тексты сайта меняйте в Тильде как обычно.</div>
      <button class="big${editing ? '' : ' sec'}" data-a="edit">${editing ? '✓ Правка на сайте включена — нажмите, чтобы выключить' : '✎ Править прямо на сайте'}</button>
      <small style="display:block;color:#8E97A1;font-size:11.5px;margin:6px 0 4px">${editing ? 'Тексты с пунктиром можно кликнуть и печатать. Enter — готово.' : 'Или меняйте в полях ниже — на сайте видно сразу.'}</small>
      ${ks.map(k => { const o = origText(k), v = (st.texts || {})[k], cur = v != null ? v : (o || ''), [n, h] = TXT[k] || [k, ''];
        return `<div class="f" data-f="texts.${k}"><label>${esc(n)}${v != null && o != null ? `<button class="x" data-treset="${k}">вернуть как было</button>` : ''}</label>${h || o == null ? `<small>${esc(h || '')}${o == null ? (h ? ' · ' : '') + 'на другой странице' : ''}</small>` : ''}
        <textarea data-t="${k}" rows="${Math.min(5, Math.ceil(cur.length / 42) || 1)}" style="height:auto;font:13px/1.4 inherit;color:#EEF1F4;background:#1C1F23">${esc(cur)}</textarea>
        <span style="display:flex;gap:10px;margin-top:4px"><button class="x" data-tshow="${k}" style="margin:0">⌖ показать на сайте</button></span></div>`; }).join('') || '<div class="note">На этой странице наших текстов нет.</div>'}`;
  }
  main.addEventListener('input', e => { const ta = e.target; if (ta.tagName !== 'TEXTAREA' || !ta.dataset.t) return;
    if (typed !== ta){ push(); typed = ta; } putText(ta.dataset.t, ta.value.replace(/\n+/g, ' '));
    // ссылка «вернуть как было» — без перерисовки панели (иначе пропадёт фокус)
    const lab = ta.closest('.f').querySelector('label'), has = (st.texts || {})[ta.dataset.t] != null, rb = lab.querySelector('[data-treset]');
    if (has && !rb) lab.insertAdjacentHTML('beforeend', `<button class="x" data-treset="${ta.dataset.t}">вернуть как было</button>`); if (!has && rb) rb.remove(); });
  main.addEventListener('focusout', e => { if (e.target.tagName === 'TEXTAREA' && e.target.dataset.t) typed = null; });
  // ---------- поиск настроек
  const sIn = $('.srch input');
  sIn.addEventListener('input', () => { query = sIn.value.trim(); render(); main.scrollTop = 0; });
  sIn.addEventListener('keydown', e => { if (e.key === 'Escape'){ sIn.value = ''; query = ''; render(); } });
  // ---------- ◑ сравнить: пока держат — сайт как сейчас у всех
  const cmpB = $('[data-a="cmp"]');
  const cmpOn = e => { e.preventDefault(); cmpB.classList.add('on'); S.apply(Object.assign({}, S.head, {colors: Object.assign({}, headC)})); toast('Так сайт выглядит сейчас у всех'); };
  const cmpOff = () => { if (!cmpB.classList.contains('on')) return; cmpB.classList.remove('on'); S.apply(live()); };
  cmpB.addEventListener('pointerdown', cmpOn); cmpB.addEventListener('pointerup', cmpOff); cmpB.addEventListener('pointerleave', cmpOff); cmpB.addEventListener('pointercancel', cmpOff);
  // ---------- 🎯 «Что это?»: клик по сайту открывает нужную настройку
  const HEADSEL = '.t-section__title,.t-title,.ml-hd h2,.mk-hd b,.t183__title,.ml-cat h1,.ml-cat h2,h1,h2,h3';
  const WHAT = [
    ['.ml-hlogo,.ml-bw .ml-logo,.t-menu-base__imglogo', 'glow', 'Логотип'],
    ['.ml-marq-box', 'marquee', 'Бегущая строка брендов'],
    ['.ml-fl,#ml-flash', 'flash', 'Фонарик'],
    ['.mls-top', 'topBtn', 'Кнопка «Наверх»'],
    ['.mls-prog', 'progress', 'Полоса прокрутки'],
    ['.t-btn,.t-submit,.ml-btn,.t-store__card__btn,.mk-card button,button', 'radiusBtn', 'Кнопка'],
    ['.mk-card,.t-card,.t-store__card,.t-catalog__card,.t-item', 'radiusCard', 'Карточка'],
    [HEADSEL, 'headFont', 'Заголовок'],
    ['img,.t-bgimg', 'imgReveal', 'Фотография'],
    ['.t-menu__link-item,.t-menu-base__link-item,.t-text a,.t-descr a', 'linkHover', 'Ссылка'],
    ['[data-record-type="3113"]', 'hdrHide', 'Шапка'],
    ['.t-descr,.t-text,p,li', 'font', 'Текст'],
  ];
  let picking = false; const pickB = $('[data-a="pick"]');
  const hl = D.createElement('div'); hl.style.cssText = 'position:fixed;pointer-events:none;z-index:2147483590;border:2px solid #BCD0E6;border-radius:8px;box-shadow:0 0 0 4000px rgba(10,12,15,.25),0 0 18px #BCD0E6;transition:all .12s;display:none';
  const hlT = D.createElement('div'); hlT.style.cssText = 'position:absolute;left:-2px;top:-26px;background:#BCD0E6;color:#1C1F23;font:700 12px/1 Nunito Sans,Arial,sans-serif;padding:5px 8px;border-radius:6px;white-space:nowrap';
  hl.appendChild(hlT); D.body.appendChild(hl);
  function whatIs(el){ if (!el || !el.closest || el.closest('.mls-host')) return null;
    const tx = el.closest('[data-mlt]'); if (tx) return {el: tx, k: 'texts.' + tx.dataset.mlt, n: 'Текст «' + txtLabel(tx.dataset.mlt) + '»'};
    for (const [sel, k, n] of WHAT){ const m = el.closest(sel); if (m) return {el: m, k, n}; }
    const rec = el.closest('.t-rec'); return rec ? {el: rec, k: null, n: 'Фон блока'} : null; }
  function pickMode(on){ picking = on; pickB.classList.toggle('on', on); hl.style.display = 'none'; root.style.cursor = '';
    if (on) toast('Кликните по любому месту сайта'); }
  D.addEventListener('pointermove', e => { if (!picking) return; const w = whatIs(e.target); if (!w){ hl.style.display = 'none'; return; }
    const r = w.el.getBoundingClientRect(); Object.assign(hl.style, {display: 'block', left: r.left - 3 + 'px', top: r.top - 3 + 'px', width: r.width + 6 + 'px', height: r.height + 6 + 'px'});
    hlT.textContent = w.n + ' → ' + (w.k ? (w.k.startsWith('texts.') ? 'Тексты' : TABN[(ALL.find(x => x.k === w.k) || {}).tab]) : 'Цвета'); hlT.style.top = r.top < 30 ? 'auto' : '-26px'; hlT.style.bottom = r.top < 30 ? '-26px' : 'auto'; }, true);
  D.addEventListener('click', e => { if (!picking) return; const w = whatIs(e.target); if (!w) return;
    e.preventDefault(); e.stopPropagation(); pickMode(false);
    if (w.k) goto(w.k); else { query = ''; sIn.value = ''; tab = 'color'; render(); toast('Цвет фона — выберите время суток и «Фон»'); } }, true);
  D.addEventListener('keydown', e => { if (picking && e.key === 'Escape') pickMode(false); });
  // время суток
  const TODS = [['morning', 'Утро'], ['day', 'День'], ['evening', 'Вечер'], ['night', 'Ночь']];
  const tod = $('.tod'); tod.innerHTML = TODS.map(([k, n]) => `<button data-tod="${k}">${n}</button>`).join('');
  const todSync = () => tod.querySelectorAll('button').forEach(b => b.classList.toggle('on', root.dataset.tod === b.dataset.tod));
  tod.onclick = e => { const b = e.target.closest('button'); if (!b) return; setTod(b.dataset.tod); todSync();
    const ifr = $('.phone iframe'); if (ifr && ifr.src) try { ifr.contentDocument.documentElement.dataset.tod = b.dataset.tod; } catch (x){} };
  let lastTod = root.dataset.tod;
  new MutationObserver(() => { todSync(); if (root.dataset.tod === lastTod) return; lastTod = root.dataset.tod; if (tab === 'color' && !gesture){ openPk = null; pkHsv = null; sync(); } }).observe(root, {attributes: true, attributeFilter: ['data-tod']}); todSync();
  if (S.ls.get('ml-studio-min') === '1') P.classList.add('min');
  D.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !/INPUT|TEXTAREA/.test((e.composedPath()[0] || {}).tagName || '') && !(e.composedPath()[0] || {}).isContentEditable){ const h = hist.pop(); if (h){ e.preventDefault(); st = JSON.parse(h); save(); S.apply(live()); render(); toast('Отменено'); } } });
  render();
})();

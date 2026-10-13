/* Moonlight: планировщик освещения — интерфейс. Нужен engine.js (window.MLPEngine).
   Встраивается в Тильду (T123): <div id="ml-planner"></div> + загрузчик. */
(function () {
  'use strict';
  var M = window.MLPEngine, root = document.getElementById('ml-planner');
  // папка, откуда загружен planner.js (там же planner3d.js); ?v= сохраняем для обхода кэша
  var SRC = (document.currentScript && document.currentScript.src) || '', BASE = SRC.replace(/[^\/]*$/, ''), VER = (SRC.match(/\?.*$/) || [''])[0];
  if (!M || !root || root.dataset.ready) return;
  root.dataset.ready = '1';
  root.className = 'mlp';

  var WA = '996500037733', LMW = 90;
  var ROOMS = [['Гостиная', 150], ['Спальня', 150], ['Кухня', 150], ['Детская', 200], ['Кабинет', 300], ['Ванная, санузел', 50], ['Прихожая, коридор', 50], ['Гардеробная', 75], ['Офис', 400], ['Торговый зал', 300], ['Своё значение', 0]];
  var REFL = [['Очень светлая', [0.8, 0.8, 0.3]], ['Светлая', [0.7, 0.5, 0.3]], ['Средняя', [0.5, 0.3, 0.1]], ['Тёмная', [0.3, 0.1, 0.1]]];
  var KZ = [['Чистое помещение', 1.25], ['Обычное помещение', 1.4], ['Кухня, пыль, пар', 1.7]];
  var COLORS = ['#111', '#1565c0', '#2e7d32', '#c62828', '#6a1b9a', '#ef6c00'];
  var SHAPES = [['rect', 'Прямоугольник'], ['L', 'Г-образная'], ['U', 'П-образная'], ['custom', 'Свой контур']];

  var st = {
    shape: 'rect', a: 5, b: 4, ca: 2, cb: 1.5, poly: null,
    H: 2.7, wp: 0.8, room: 0, E: 150, refl: 1, kz: 1, hours: 5, tariff: 1.64, iso: true,
    groups: [], gid: 0
  };
  var res = null;

  // ---------- Стили ----------
  var css = '' +
    '.mlp{--ink:#000;--mute:#666;--line:#e4e4e4;--soft:#f4f4f4;font-family:var(--t-text-font,Arial),Arial,sans-serif;color:var(--ink);max-width:1240px;margin:0 auto;padding:24px 16px 40px;box-sizing:border-box;line-height:1.4}' +
    '.mlp *{box-sizing:border-box}' +
    '.mlp h2{font-size:28px;font-weight:600;margin:0 0 6px}' +
    '.mlp .sub{color:var(--mute);font-size:15px;margin:0 0 20px}' +
    '.mlp .beta{display:inline-block;font-size:12px;font-weight:600;background:#ffd5d3;border-radius:4px;padding:2px 8px;vertical-align:middle;margin-left:8px}' +
    '.mlp .wrap{display:grid;grid-template-columns:minmax(0,370px) minmax(0,1fr);gap:24px;align-items:start}' +
    '.mlp .side{display:flex;flex-direction:column;gap:16px}' +
    '.mlp .card{border:1px solid var(--line);border-radius:8px;padding:16px}' +
    '.mlp .card h3{font-size:16px;font-weight:600;margin:0 0 12px;display:flex;justify-content:space-between;align-items:center}' +
    '.mlp .row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:10px}' +
    '.mlp .row.three{grid-template-columns:repeat(3,minmax(0,1fr))}.mlp .row.one{grid-template-columns:minmax(0,1fr)}' +
    '.mlp label{display:block;font-size:12px;color:var(--mute);margin-bottom:4px}' +
    '.mlp input,.mlp select{width:100%;height:38px;border:1px solid #ccc;border-radius:6px;padding:0 8px;font:inherit;font-size:14px;color:var(--ink);background:#fff}' +
    '.mlp input:focus,.mlp select:focus{outline:2px solid #000;outline-offset:-1px}' +
    '.mlp .seg{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #ccc;border-radius:6px;overflow:hidden;margin-bottom:10px}' +
    '.mlp .seg button{height:34px;border:0;border-left:1px solid #ccc;background:#fff;font:inherit;font-size:12px;cursor:pointer;color:var(--ink);padding:0 4px}' +
    '.mlp .seg button:first-child{border-left:0}.mlp .seg button.on{background:#000;color:#fff}' +
    '.mlp .grp{border:1px solid var(--line);border-left:4px solid #000;border-radius:6px;padding:10px;margin-bottom:10px}' +
    '.mlp .grp-h{display:flex;align-items:center;gap:8px;margin-bottom:8px}' +
    '.mlp .tag{width:22px;height:22px;border-radius:50%;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none}' +
    '.mlp .sw{position:relative;display:inline-block;width:34px;height:20px;margin:0;flex:none;cursor:pointer}.mlp .sw input{opacity:0;width:0;height:0;position:absolute}' +
    '.mlp .sw span{position:absolute;inset:0;background:#ccc;border-radius:10px;transition:.15s}.mlp .sw span:before{content:"";position:absolute;left:2px;top:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.15s}' +
    '.mlp .sw input:checked+span{background:#000}.mlp .sw input:checked+span:before{transform:translateX(14px)}' +
    '.mlp .x{border:0;background:none;font-size:20px;line-height:1;cursor:pointer;color:#999;padding:0 4px}' +
    '.mlp .btn{display:inline-flex;align-items:center;justify-content:center;height:42px;padding:0 18px;border:0;border-radius:6px;background:#000;color:#fff;font:inherit;font-size:14px;cursor:pointer;text-decoration:none}' +
    '.mlp .btn.ghost{background:#fff;color:#000;border:1px solid #000}.mlp .btn.wa{background:#25d366;color:#fff}' +
    '.mlp .btn[disabled]{opacity:.5;cursor:wait}.mlp .btn.small{height:32px;font-size:13px;padding:0 12px}' +
    '.mlp .plan{position:relative;background:var(--soft);border-radius:8px;padding:12px}' +
    '.mlp canvas{display:block;width:100%;touch-action:none;cursor:default;border-radius:6px;background:#fff}' +
    '.mlp .legend{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mute);margin-top:10px;flex-wrap:wrap}' +
    '.mlp .bar{flex:1;min-width:160px;height:10px;border-radius:5px}' +
    '.mlp .ticks{display:flex;justify-content:space-between;font-size:11px;color:var(--mute);margin:2px 0 0}' +
    '.mlp .views{display:inline-flex;border:1px solid #ccc;border-radius:6px;overflow:hidden;margin-bottom:10px;background:#fff}' +
    '.mlp .views button{height:32px;padding:0 18px;border:0;background:#fff;font:inherit;font-size:13px;cursor:pointer;color:#000}.mlp .views button.on{background:#000;color:#fff}' +
    '.mlp .v3d{position:relative;width:100%;border-radius:6px;background:#eee;overflow:hidden}.mlp .v3d[hidden]{display:none}' +
    '.mlp .v3d-msg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#666;font-size:14px;text-align:center;padding:16px}' +
    '.mlp .seg.two{grid-template-columns:1fr 1fr;margin:0;min-width:260px}.mlp [hidden]{display:none!important}' +
    '.mlp .tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px;font-size:13px}' +
    '.mlp .tools label{display:inline-flex;align-items:center;gap:6px;margin:0;color:var(--ink);font-size:13px}.mlp .tools input{width:auto;height:auto}' +
    '.mlp .hint{font-size:12px;color:var(--mute);margin-top:6px}' +
    '.mlp .sum{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:16px}' +
    '.mlp .sum div{background:var(--soft);border-radius:8px;padding:12px}' +
    '.mlp .sum b{display:block;font-size:24px;font-weight:600;line-height:1.1}.mlp .sum span{font-size:12px;color:var(--mute)}' +
    '.mlp .hint.note{color:#8a5a00;background:#fff3e0;border-radius:6px;padding:6px 8px}.mlp .rec{margin-top:10px;padding:12px 14px;border-radius:8px;background:#e3f2fd;font-size:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}.mlp .rec[hidden]{display:none}.mlp .rec span{flex:1;min-width:200px}' +
    '.mlp .verdict{margin-top:12px;padding:12px 14px;border-radius:8px;font-size:14px}' +
    '.mlp .verdict.good{background:#e8f5e9}.mlp .verdict.warn{background:#fff3e0}.mlp .verdict.bad{background:#ffebee}' +
    '.mlp .acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}' +
    '.mlp .note{font-size:12px;color:var(--mute);margin-top:12px}' +
    '.mlp .tbar{background:#fff;border:1px solid var(--line);border-radius:6px;padding:10px 12px;margin-bottom:10px;font-size:14px}.mlp .tbar .tools{margin-top:8px}' +
    '.mlp .tlen{display:inline-flex;align-items:center;gap:6px}.mlp .tools .tlen input{width:110px;height:32px}' +
    '@media (max-width:900px){.mlp .wrap{grid-template-columns:minmax(0,1fr)}.mlp .main{order:-1}.mlp .sum{grid-template-columns:repeat(2,minmax(0,1fr))}}' +
    '@media (max-width:480px){.mlp h2{font-size:23px}.mlp .row.m1{grid-template-columns:minmax(0,1fr)}.mlp .seg button{font-size:11px}.mlp .sum b{font-size:20px}}';

  // ---------- Разметка ----------
  function opts(list, sel, fmtFn) { return list.map(function (r, k) { return '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + (fmtFn ? fmtFn(r) : r[0]) + '</option>'; }).join(''); }
  root.innerHTML = '<style>' + css + '</style>' +
    '<h2>Планировщик освещения<span class="beta">бета</span></h2>' +
    '<p class="sub">Нарисуйте комнату, расставьте светильники — карта покажет, где светло, а где темно.</p>' +
    '<div class="wrap"><div class="side">' +
      '<div class="card"><h3>Помещение</h3>' +
        '<div class="seg" id="mlp-shape">' + SHAPES.map(function (s) { return '<button type="button" data-shape="' + s[0] + '">' + s[1] + '</button>'; }).join('') + '</div>' +
        '<div class="row" id="mlp-dims"></div>' +
        '<div class="tools" style="margin:0 0 4px"><button type="button" class="btn small ghost" id="mlp-trace">Обвести по своему плану</button>' +
          '<input type="file" id="mlp-file" accept="image/*,.pdf,application/pdf" hidden></div>' +
        '<div class="hint" style="margin:0 0 12px">Фото или скан плана (БТИ, от застройщика, от дизайнера) — картинка или PDF.</div>' +
        '<div class="row three"><div><label>Потолок, м</label><input data-k="H" type="number" step="0.05" min="1.8"></div>' +
          '<div><label>Рабочая пов., м</label><input data-k="wp" type="number" step="0.05" min="0" max="1.2"></div>' +
          '<div><label>Норма, лк</label><input data-k="E" type="number" step="10" min="10"></div></div>' +
        '<div class="row m1"><div><label>Тип помещения</label><select data-k="room">' + opts(ROOMS, 0, function (r) { return r[0] + (r[1] ? ' — ' + r[1] + ' лк' : ''); }) + '</select></div>' +
          '<div><label>Отделка</label><select data-k="refl">' + opts(REFL, 1) + '</select></div></div>' +
        '<div class="row one"><div><label>Условия</label><select data-k="kz">' + opts(KZ, 1) + '</select></div></div>' +
      '</div>' +
      '<div class="card"><h3>Светильники <button type="button" class="btn small ghost" id="mlp-add">+ Добавить</button></h3><div id="mlp-groups"></div>' +
        '<div class="hint">Мощность, число ламп и световой поток — в характеристиках товара. Если указан поток в люменах, выбирайте «лм» — так точнее.</div></div>' +
      '<div class="card"><h3>Электричество</h3><div class="row"><div><label>Часов в день</label><input data-k="hours" type="number" step="0.5" min="0" max="24"></div>' +
        '<div><label>Тариф, сом/кВт·ч</label><input data-k="tariff" type="number" step="0.01" min="0"></div></div></div>' +
    '</div><div class="main">' +
      '<div class="plan"><div class="views"><button type="button" data-view="plan" class="on">План</button><button type="button" data-view="3d">3D</button></div>' +
        '<div class="tbar" id="mlp-tbar" hidden><div id="mlp-tstep"></div><div class="tools">' +
          '<span class="tlen" id="mlp-tlenrow"><input id="mlp-tlen" type="number" min="0.3" step="0.01" inputmode="decimal" placeholder="Длина"> м</span>' +
          '<button type="button" class="btn small" id="mlp-tdone">Готово</button>' +
          '<button type="button" class="btn small ghost" id="mlp-tundo" title="Ctrl+Z">Отменить</button>' +
          '<button type="button" class="btn small ghost" id="mlp-tredo" title="Ctrl+Y">Вернуть</button>' +
          '<button type="button" class="btn small ghost" id="mlp-treset">Заново</button>' +
          '<button type="button" class="btn small ghost" id="mlp-tquit">Выйти</button>' +
          '<label><input type="checkbox" id="mlp-tortho" checked> Прямые углы</label></div>' +
          '<div class="hint">Колесо мыши или два пальца — масштаб, перетаскивание — сдвиг. Точки можно двигать, двойной щелчок — удалить. Файл никуда не отправляется — всё в вашем браузере.</div>' +
          '<div class="hint note" id="mlp-tmsg" hidden></div></div>' +
        '<canvas id="mlp-cv" aria-label="План комнаты с картой освещённости"></canvas>' +
        '<div id="mlp-3d" class="v3d" hidden><div class="v3d-msg" id="mlp-3dmsg">Загружаем 3D…</div></div>' +
        '<div class="legend" id="mlp-legend"><span>лк</span><div style="flex:1;min-width:160px"><div class="bar" id="mlp-bar"></div><div class="ticks" id="mlp-ticks"></div></div></div>' +
        '<div class="tools" id="mlp-tools2d"><button type="button" class="btn small ghost" id="mlp-undo" title="Ctrl+Z" disabled>Отменить</button>' +
          '<button type="button" class="btn small ghost" id="mlp-redo" title="Ctrl+Y" disabled>Вернуть</button>' +
          '<button type="button" class="btn small ghost" id="mlp-auto">Расставить автоматически</button>' +
          '<label><input type="checkbox" id="mlp-iso" checked> Линии равной освещённости</label>' +
          '<label id="mlp-bgrow" hidden><input type="checkbox" id="mlp-bgshow" checked> План-подложка</label></div>' +
        '<div class="tools" id="mlp-tools3d" hidden><div class="seg two"><button type="button" data-m3="real" class="on">Как будет выглядеть</button><button type="button" data-m3="map">Карта люксов</button></div>' +
          '<button type="button" class="btn small ghost" id="mlp-cam">Сбросить вид</button></div>' +
        '<div class="hint" id="mlp-hint2d">Светильники и углы комнаты можно перетаскивать. Чтобы добавить угол — потяните за «+» на стене; убрать — двойной щелчок или двойное касание угла.</div>' +
        '<div class="hint" id="mlp-hint3d" hidden>Вращайте мышью или пальцем, колесо или два пальца — приближение. Ближние стены и потолок скрываются, чтобы было видно комнату. Яркость поверхностей — из расчёта; двигать светильники — на вкладке «План».</div>' +
      '</div>' +
      '<div class="sum" id="mlp-sum"></div><div class="verdict" id="mlp-verdict"></div><div class="rec" id="mlp-rec" hidden></div>' +
      '<div class="acts"><button type="button" class="btn" id="mlp-pdf">Скачать расчёт в PDF</button><a class="btn wa" id="mlp-wa" target="_blank" rel="noopener">Обсудить с консультантом в WhatsApp</a></div>' +
      '<p class="note">Ориентировочный расчёт по типовым кривым света с учётом отражения от стен и потолка, статистика без полосы 0,5 м у стен. Не заменяет проект в DIALux — для него обратитесь к нам.</p>' +
    '</div></div>';

  function $(id) { return document.getElementById(id); }
  function num(v) { v = parseFloat(String(v).replace(',', '.')); return isFinite(v) ? v : 0; }
  function plural(n, a, b, c) { var m = n % 10, h = n % 100; return m === 1 && h !== 11 ? a : (m >= 2 && m <= 4 && (h < 12 || h > 14) ? b : c); }
  function fmt(v, d) { return (+v).toLocaleString('ru-RU', { maximumFractionDigits: d || 0 }); }
  // История для «Отменить / Вернуть»: снимок после каждого изменения, key — для сравнения
  function Hist(get, set) {
    var a = [], i = -1;
    return {
      rec: function () { var s = get(); if (i >= 0 && a[i].key === s.key) return; a = a.slice(0, i + 1); a.push(s); if (a.length > 150) a.shift(); i = a.length - 1; },
      undo: function () { if (i <= 0) return false; set(a[--i]); return true; },
      redo: function () { if (i >= a.length - 1) return false; set(a[++i]); return true; },
      can: function () { return [i > 0, i < a.length - 1]; }
    };
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- Комната ----------
  function makePoly() {
    if (st.shape === 'L') return M.lshape(st.a, st.b, st.ca, st.cb);
    if (st.shape === 'U') return M.ushape(st.a, st.b, st.ca, st.cb);
    if (st.shape === 'custom' && st.poly) return st.poly;
    return M.rect(st.a, st.b);
  }
  function renderDims() {
    var f = function (k, l) { return '<div><label>' + l + '</label><input data-k="' + k + '" type="number" step="0.1" min="0.5" value="' + st[k] + '"></div>'; };
    var h = '';
    if (st.shape === 'custom') h = '<div style="grid-column:1/-1" class="hint" style="margin:0">Тяните углы и «+» на стенах прямо на плане. Площадь: <b id="mlp-area"></b></div>';
    else {
      h = f('a', 'Длина, м') + f('b', 'Ширина, м');
      if (st.shape === 'L') h += f('ca', 'Вырез по длине, м') + f('cb', 'Вырез по ширине, м');
      if (st.shape === 'U') h += f('ca', 'Ширина ниши, м') + f('cb', 'Глубина ниши, м');
    }
    $('mlp-dims').innerHTML = h;
    root.querySelectorAll('#mlp-shape button').forEach(function (b) { b.classList.toggle('on', b.dataset.shape === st.shape); });
  }
  function setShape(s) {
    if (s === 'custom') st.poly = makePoly().map(function (p) { return p.slice(); });
    st.shape = s; if (s !== 'custom') st.poly = makePoly();
    renderDims(); relayoutAll();
  }

  // ---------- Светильники ----------
  var DEF = {
    pendant: { count: 1, mode: 'w', watts: 7, lm: 600, lamps: 5, drop: 0.6, beam: 36 },
    ceiling: { count: 1, mode: 'w', watts: 40, lm: 3600, lamps: 1, drop: 0, beam: 36 },
    spot: { count: 6, mode: 'w', watts: 7, lm: 600, lamps: 1, drop: 0, beam: 36 },
    wall: { count: 2, mode: 'w', watts: 6, lm: 500, lamps: 1, drop: 0, beam: 36, mountH: 1.8 }
  };
  // Световая отдача, лм/Вт. Встроенный LED в декоративных светильниках теряет часть света на рассеивателях.
  var LAMPS = [['LED-лампа', 90], ['Встроенный LED', 70], ['Лампа накаливания', 12], ['Галогенная', 16]];
  var DEF_LAMP = { pendant: 0, ceiling: 1, spot: 0, wall: 0 };
  function addGroup(type) {
    var d = DEF[type], g = { id: ++st.gid, type: type, pos: [], eff: DEF_LAMP[type], on: true };
    for (var k in d) g[k] = d[k];
    if (g.mountH == null) g.mountH = 1.8;
    st.groups.push(g); relayout(g);
  }
  function effOf(g) { return LAMPS[g.eff || 0][1]; }
  function lumFlux(g) { return g.lamps * (g.mode === 'w' ? g.watts * effOf(g) : g.lm); }
  function lumWatts(g) { return g.lamps * (g.mode === 'w' ? g.watts : g.lm / effOf(g)); }
  // бра не может висеть выше потолка
  function lumZ(g) { return M.TYPES[g.type].mount === 'wall' ? Math.min(g.mountH, st.H - 0.05) : st.H - g.drop; }
  function colorOf(g) { return COLORS[(st.groups.indexOf(g)) % COLORS.length]; }
  function letterOf(g) { return String.fromCharCode(65 + st.groups.indexOf(g)); }
  // Люстры и плафоны — основной свет, встают по центру сами по себе; споты обходят уже стоящие потолочные светильники
  function isMain(g) { return g.type === 'pendant' || g.type === 'ceiling'; }
  function fixedFor(g) {
    var fixed = [];
    if (!isMain(g)) st.groups.forEach(function (o) { if (o !== g && M.TYPES[o.type].mount !== 'wall') fixed = fixed.concat(o.pos); });
    return fixed;
  }
  // Симметричная схема по зонам комнаты; если ровно столько светильников симметрично не встаёт —
  // ставим ближайшее симметричное количество (больше) и пишем об этом в карточке группы
  function relayout(g) {
    var n = Math.max(0, Math.round(g.count)), poly = makePoly(); g.note = '';
    if (M.TYPES[g.type].mount === 'wall' || n === 0) { g.pos = M.layout(poly, n, M.TYPES[g.type].mount); return; }
    var sym = M.symLayout(poly, n, { fixed: fixedFor(g) });
    if (!sym) { g.pos = M.layout(poly, n, 'ceiling', { fixed: fixedFor(g) }); g.note = 'Стены не под прямым углом — расставлено равномерно по площади.'; return; }
    g.pos = sym.pts;
    if (sym.n !== n) {
      var around = sym.options.filter(function (k) { return Math.abs(k - n) <= Math.max(3, n * 0.5); });
      g.note = 'Ровно ' + n + ' симметрично не встаёт — поставлено ' + sym.n + '. Аккуратные варианты: ' + around.join(', ') + '.';
      g.count = sym.n;
    }
  }
  // Стрелки в поле «Сколько шт.» — сразу к следующему симметричному варианту
  function stepCount(g, dir) {
    var sym = M.symLayout(makePoly(), Math.max(1, g.count), { fixed: fixedFor(g) });
    if (!sym || !sym.options) return g.count + dir;
    var o = sym.options.filter(function (k) { return dir > 0 ? k > g.count : k < g.count; });
    return o.length ? (dir > 0 ? o[0] : o[o.length - 1]) : (dir > 0 ? g.count + 1 : Math.max(0, g.count - 1));
  }
  function relayoutAll() {
    st.groups.forEach(function (g) { g.pos = []; });
    st.groups.filter(isMain).concat(st.groups.filter(function (g) { return !isMain(g); })).forEach(relayout);
    renderGroups(); // количество могло подстроиться под симметрию — обновляем поля и заметки
    update();
  }

  function renderGroups() {
    $('mlp-groups').innerHTML = st.groups.map(function (g, i) {
      var t = M.TYPES[g.type], c = colorOf(g), wall = t.mount === 'wall';
      return '<div class="grp" data-g="' + g.id + '" style="border-left-color:' + c + '">' +
        '<div class="grp-h"><span class="tag" style="background:' + c + '">' + letterOf(g) + '</span>' +
        '<select data-f="type">' + Object.keys(M.TYPES).map(function (k) { return '<option value="' + k + '"' + (k === g.type ? ' selected' : '') + '>' + M.TYPES[k].name + '</option>'; }).join('') + '</select>' +
        '<label class="sw" title="Включить / выключить группу — чтобы увидеть вклад каждой"><input type="checkbox" data-f="on"' + (g.on !== false ? ' checked' : '') + '><span></span></label>' +
        '<button type="button" class="x" data-del title="Убрать">×</button></div>' +
        '<div class="row three"><div><label>Сколько шт.</label><input data-f="count" type="number" min="0" max="60" step="1" value="' + g.count + '"></div>' +
        '<div><label>Ламп в одном</label><input data-f="lamps" type="number" min="1" step="1" value="' + g.lamps + '"></div>' +
        '<div><label>Единицы</label><select data-f="mode"><option value="w"' + (g.mode === 'w' ? ' selected' : '') + '>Вт</option><option value="lm"' + (g.mode === 'lm' ? ' selected' : '') + '>лм</option></select></div></div>' +
        '<div class="row"><div><label>' + (g.mode === 'w' ? 'Вт на лампу' : 'лм на лампу') + '</label><input data-f="' + (g.mode === 'w' ? 'watts' : 'lm') + '" type="number" min="0" step="' + (g.mode === 'w' ? 0.5 : 10) + '" value="' + (g.mode === 'w' ? g.watts : g.lm) + '"></div>' +
        '<div><label>Источник света</label><select data-f="eff">' + LAMPS.map(function (l, k) { return '<option value="' + k + '"' + (k === (g.eff || 0) ? ' selected' : '') + '>' + l[0] + '</option>'; }).join('') + '</select></div></div>' +
        '<div class="row">' + (wall ? '<div><label>Высота, м</label><input data-f="mountH" type="number" min="0.5" step="0.05" value="' + g.mountH + '"></div>'
              : '<div><label>Свес, м</label><input data-f="drop" type="number" min="0" step="0.05" value="' + g.drop + '"></div>') +
        (g.type === 'spot' ? '<div><label>Угол луча, °</label><input data-f="beam" type="number" min="8" max="150" step="1" value="' + g.beam + '"></div>' : '<div></div>') + '</div>' +
        (g.type === 'pendant' || g.type === 'wall' ? '<div class="hint">В карточке часто указана <b>максимальная</b> мощность патрона («5×40 Вт E14») — это не мощность лампы. LED-лампа E14 обычно 5–7 Вт, E27 — 8–12 Вт.</div>' : '') +
        '<div class="hint note" data-note' + (g.note ? '' : ' hidden') + '>' + esc(g.note || '') + '</div>' +
        '<div class="hint" data-info></div></div>';
    }).join('') || '<div class="hint">Добавьте светильник.</div>';
    updateGroupInfo();
  }
  function updateGroupInfo() {
    st.groups.forEach(function (g) {
      var el = root.querySelector('.grp[data-g="' + g.id + '"] [data-info]');
      if (el) el.textContent = 'Один светильник: ' + fmt(lumFlux(g)) + ' лм, ' + fmt(lumWatts(g), 1) + ' Вт';
    });
  }

  // ---------- Расчёт и сводка ----------
  function lumsAll(withOff) {
    var out = [];
    st.groups.forEach(function (g) {
      if (g.on === false && !withOff) return;
      g.pos.forEach(function (p) { out.push({ x: p[0], y: p[1], z: lumZ(g), flux: lumFlux(g), type: g.type, beam: g.beam, g: g, off: g.on === false }); });
    });
    return out;
  }
  function update(fast) {
    var poly = makePoly();
    res = M.compute({ poly: poly, H: st.H, wp: st.wp, refl: REFL[st.refl][1], kz: KZ[st.kz][1] }, lumsAll(), { fast: !!fast });
    if ($('mlp-area')) $('mlp-area').textContent = fmt(res.area, 1) + ' м²';
    $('mlp-bgrow').hidden = !(st.bg && st.shape === 'custom');
    // Предупреждения о том, что не попало в расчёт
    var warn = [], W = 0;
    if (st.H <= st.wp + 0.1) warn.push('Высота потолка меньше рабочей поверхности — проверьте размеры.');
    st.groups.forEach(function (g) {
      var inRoom = g.pos.filter(function (p) { return M.inside(p[0], p[1], poly); }).length, out = g.pos.length - inRoom;
      if (out) warn.push(out + ' ' + plural(out, 'светильник', 'светильника', 'светильников') + ' группы ' + letterOf(g) + ' за пределами комнаты (красные) — не учтены.');
      if (lumZ(g) <= st.wp + 0.05) { warn.push('Группа ' + letterOf(g) + ' висит ниже рабочей поверхности (уменьшите свес) — не учтена.'); return; }
      if (M.TYPES[g.type].mount === 'wall' && g.mountH > st.H - 0.05) warn.push('Бра группы ' + letterOf(g) + ' выше потолка — посчитаны под потолком.');
      if (g.on !== false) W += inRoom * lumWatts(g);
    });
    var offG = st.groups.filter(function (g) { return g.on === false && g.pos.length; }).map(letterOf);
    var kwh = W / 1000 * st.hours * 365, cost = kwh * st.tariff;
    res.W = W; res.kwh = kwh; res.cost = cost;
    $('mlp-sum').innerHTML =
      '<div><b>' + fmt(res.avg) + ' лк</b><span>средняя (норма ' + fmt(st.E) + ')</span></div>' +
      '<div><b>' + fmt(res.min) + ' лк</b><span>минимум · равномерность ' + fmt(res.u0, 2) + '</span></div>' +
      '<div><b>' + fmt(W) + ' Вт</b><span>' + fmt(res.area ? W / res.area : 0, 1) + ' Вт/м² · ' + fmt(res.area, 1) + ' м²</span></div>' +
      '<div><b>' + fmt(cost) + ' сом</b><span>в год · ' + fmt(kwh) + ' кВт·ч</span></div>';
    var v = $('mlp-verdict'), cls, txt;
    if (!res.active) { cls = 'bad'; txt = 'Добавьте светильники — сейчас в комнате нет света.'; }
    else if (res.avg < st.E * 0.9) { cls = 'bad'; txt = 'Темновато: не хватает примерно ' + fmt((1 - res.avg / st.E) * 100) + ' % света. Добавьте светильник или выберите мощнее.'; }
    else if (res.u0 < 0.4) { cls = 'warn'; txt = 'Света в среднем хватает, но есть тёмные зоны (равномерность ' + fmt(res.u0, 2) + '). Добавьте светильник туда, где карта синяя, или раздвиньте их.'; }
    else if (res.avg > st.E * 1.8) { cls = 'warn'; txt = 'Света с большим запасом — можно взять модели слабее или поставить диммер.'; }
    else { cls = 'good'; txt = 'Норма выполнена: света достаточно и он распределён ровно.'; }
    if (warn.length) { txt = warn.join(' ') + ' ' + txt; if (cls === 'good') cls = 'warn'; }
    if (offG.length) txt = 'Выключено: ' + offG.join(', ') + ' — показан свет только включённых групп. ' + txt;
    v.className = 'verdict ' + cls; v.textContent = txt;
    $('mlp-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(waText());
    legend(); draw();
    if (view3d && !fast) refresh3d();
    if (!fast) { clearTimeout(recT); recT = setTimeout(recommend, 350); clearTimeout(hT); hT = setTimeout(histRec, 300); }
  }

  // ---------- Отменить / Вернуть (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z) ----------
  // Снимок всего состояния после каждого пересчёта (с задержкой, чтобы набор числа был одним шагом).
  // Картинка плана в снимок не сериализуется — хранится ссылкой.
  var hT = 0, hist = Hist(function () {
    return { key: JSON.stringify(st, function (k, v) { return k === 'bg' ? undefined : v; }), bg: st.bg };
  }, function (s) {
    var o = JSON.parse(s.key); for (var k in o) st[k] = o[k]; st.bg = s.bg;
    root.querySelectorAll('.side [data-k]').forEach(function (el) { el.value = st[el.dataset.k]; });
    $('mlp-iso').checked = st.iso;
    renderDims(); renderGroups(); update();
  });
  function histRec() { if (tr) return; hist.rec(); histUI(); }
  function histUI() { var c = hist.can(); $('mlp-undo').disabled = !c[0]; $('mlp-redo').disabled = !c[1]; }
  function histGo(back) {
    if (tr) { back ? tr.h.undo() : tr.h.redo(); return; }
    clearTimeout(hT); histRec(); // незаписанное изменение — сначала в историю
    if (back ? hist.undo() : hist.redo()) { clearTimeout(hT); histUI(); }
  }
  document.addEventListener('keydown', function (e) {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    var z = e.code === 'KeyZ', y = e.code === 'KeyY'; if (!z && !y) return;
    var t = e.target; if (t && t !== document.body && !root.contains(t)) return; // чужие поля Тильды не трогаем
    if (!root.getClientRects().length) return;
    e.preventDefault(); histGo(z && !e.shiftKey);
  });

  // ---------- Рекомендация: сколько светильников нужно в симметричной схеме ----------
  // Если света мало или он неровный — перебираем симметричные варианты для спотов (или предлагаем добавить споты)
  // и ищем наименьшее количество, при котором средняя ≥ нормы и равномерность ≥ 0,4.
  var recT = 0, recApply = null;
  function cfgText(sym) {
    if (!sym || !sym.cfg) return '';
    var one = function (c) { return c[1] > 1 ? c[1] + ' ' + plural(c[1], 'ряд', 'ряда', 'рядов') + ' по ' + c[0] : 'в ряд'; };
    return sym.cfg.length === 1 ? one(sym.cfg[0]) : 'по зонам: ' + sym.cfg.map(function (c) { return c[0] * c[1]; }).join(' + ');
  }
  function recommend() {
    var box = $('mlp-rec'); recApply = null; box.hidden = true;
    if (!res || drag) return;
    if (res.active && res.avg >= st.E * 0.9 && res.u0 >= 0.4) return;
    var poly = makePoly(), room = { poly: poly, H: st.H, wp: st.wp, refl: REFL[st.refl][1], kz: KZ[st.kz][1] };
    var tg = st.groups.filter(function (g) { return g.on !== false && !isMain(g) && M.TYPES[g.type].mount !== 'wall'; }).pop(), isNew = !tg;
    if (isNew) { tg = { id: -1, type: 'spot', pos: [], eff: 0, on: true }; for (var k in DEF.spot) tg[k] = DEF.spot[k]; }
    var fixed = []; st.groups.forEach(function (o) { if (o !== tg && M.TYPES[o.type].mount !== 'wall') fixed = fixed.concat(o.pos); });
    var cur = tg.pos.length, opts = M.symOptions(poly, fixed), cands;
    if (opts) {
      var neat = opts.filter(function (o) { return o.neat && o.n > cur; }), rest = opts.filter(function (o) { return !o.neat && o.n > cur; });
      cands = neat.slice(0, 12).concat(rest.slice(0, 8));
    } else {
      cands = []; for (var n = cur + 1; n <= cur + 12; n++) cands.push({ n: n, pts: M.layout(poly, n, 'ceiling', { fixed: fixed }) });
    }
    var others = lumsAll().filter(function (l) { return l.g !== tg; }), found = null, last = null;
    for (var i = 0; i < cands.length && !found; i++) {
      var c = cands[i], test = others.concat(c.pts.map(function (p) { return { x: p[0], y: p[1], z: lumZ(tg), flux: lumFlux(tg), type: tg.type, beam: tg.beam }; }));
      var r = M.compute(room, test, { fast: true }); last = { c: c, r: r };
      if (r.avg >= st.E && r.u0 >= 0.4) { r = M.compute(room, test); last = { c: c, r: r }; if (r.avg >= st.E && r.u0 >= 0.4) found = last; } // перепроверка точным расчётом
    }
    var name = M.TYPES[tg.type].name.toLowerCase(), txt, btn = '';
    if (found) {
      var N = found.c.n, sym = found.c;
      txt = (isNew ? 'Добавьте ' + N + ' ' + plural(N, 'спот', 'спота', 'спотов') + ' (' + fmt(lumWatts(tg), 1) + ' Вт)' : 'Поставьте ' + N + ' вместо ' + cur + ' в группе ' + letterOf(tg) + ' (' + name + ')') +
        (sym.cfg ? ', ' + cfgText(sym) : '') + ' — будет в среднем ' + fmt(found.r.avg) + ' лк, минимум ' + fmt(found.r.min) + ' лк, равномерность ' + fmt(found.r.u0, 2) + '.';
      btn = '<button type="button" class="btn small" id="mlp-rec-go">Применить</button>';
      recApply = function () {
        var g = tg;
        if (isNew) { addGroup('spot'); g = st.groups[st.groups.length - 1]; }
        g.count = N; g.pos = found.c.pts.map(function (p) { return p.slice(); }); g.note = '';
        renderGroups(); update();
      };
    } else if (last && last.r.avg < st.E) {
      txt = 'Даже ' + last.c.n + ' светильников группы ' + (isNew ? 'споты' : letterOf(tg)) + ' не дотягивают до нормы — выберите модели мощнее (нужно примерно в ' + fmt(st.E / Math.max(1, last.r.avg) * 1.05, 1) + ' раза больше света).';
    } else return;
    box.innerHTML = '<span><b>Рекомендация:</b> ' + esc(txt) + '</span>' + btn; box.hidden = false;
  }

  // ---------- 3D ----------
  var view3d = false, mode3d = 'real', loading3d = null;
  function loadScript(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  function ensure3d() {
    if (loading3d) return loading3d;
    var p = Promise.resolve();
    if (!window.THREE) p = p.then(function () { return loadScript('https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js'); });
    p = p.then(function () { return window.THREE.OrbitControls ? 0 : loadScript('https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js'); })
      .then(function () { return window.MLP3D ? 0 : loadScript(BASE + 'planner3d.js' + VER); })
      .then(function () { $('mlp-3dmsg').remove(); window.MLP3D.init($('mlp-3d')); });
    return (loading3d = p.catch(function () { loading3d = null; $('mlp-3dmsg').textContent = 'Не удалось загрузить 3D. Проверьте интернет и откройте вкладку ещё раз.'; throw 0; }));
  }
  function refresh3d(refit) {
    if (!window.MLP3D || !window.MLP3D.ready()) return;
    var room = { poly: makePoly(), H: st.H, wp: st.wp, refl: REFL[st.refl][1], kz: KZ[st.kz][1] }, lums = lumsAll();
    var vis = lumsAll(true).filter(function (l) { return M.inside(l.x, l.y, room.poly); });
    window.MLP3D.render({ poly: room.poly, H: st.H, wp: st.wp, refl: room.refl, res: res, surf: M.surfaces(room, lums, res), lums: vis,
      norm: st.E, mode: mode3d, colorAt: colorAt, scaleMax: scaleMax(), refit: refit });
  }
  function setView(v) {
    view3d = v === '3d';
    root.querySelectorAll('.views button').forEach(function (b) { b.classList.toggle('on', b.dataset.view === v); });
    $('mlp-3d').style.height = Math.max(320, cv.clientHeight || 420) + 'px';
    cv.hidden = view3d; $('mlp-3d').hidden = !view3d;
    $('mlp-tools2d').hidden = $('mlp-hint2d').hidden = view3d; $('mlp-tools3d').hidden = $('mlp-hint3d').hidden = !view3d;
    $('mlp-legend').hidden = view3d && mode3d === 'real';
    if (view3d) ensure3d().then(function () { refresh3d(); }, function () {}); else draw();
  }

  // ---------- Рисование ----------
  var cv = $('mlp-cv'), ctx = cv.getContext('2d'), view = null, hover = null;
  var STOPS = [[0, [13, 8, 135]], [0.25, [106, 0, 168]], [0.5, [177, 42, 144]], [0.7, [225, 100, 98]], [0.85, [252, 166, 54]], [1, [240, 249, 33]]];
  function colorAt(t) {
    t = Math.max(0, Math.min(1, t));
    for (var i = 1; i < STOPS.length; i++) if (t <= STOPS[i][0]) {
      var a = STOPS[i - 1], b = STOPS[i], u = (t - a[0]) / (b[0] - a[0]);
      return [0, 1, 2].map(function (c) { return Math.round(a[1][c] + u * (b[1][c] - a[1][c])); });
    }
    return STOPS[STOPS.length - 1][1];
  }
  function scaleMax() { return Math.max(st.E * 2, 50); }
  function legend() {
    $('mlp-bar').style.background = 'linear-gradient(90deg,' + STOPS.map(function (s) { return 'rgb(' + s[1].join(',') + ') ' + s[0] * 100 + '%'; }).join(',') + ')';
    var m = scaleMax();
    $('mlp-ticks').innerHTML = [0, 0.25, 0.5, 0.75, 1].map(function (t) { return '<span>' + fmt(m * t) + (t === 1 ? '+' : '') + (t === 0.5 ? ' (норма)' : '') + '</span>'; }).join('');
  }
  function draw(clean) {
    if (tr) { drawTrace(); return; }
    var poly = makePoly(), bb = M.bbox(poly), dpr = window.devicePixelRatio || 1;
    var cw = cv.clientWidth || 600, pad = 34;
    var maxH = Math.min(640, (window.innerHeight || 800) * 0.72);
    var sc = Math.min((cw - 2 * pad) / bb.w, (maxH - 2 * pad) / bb.h);
    var ch = Math.round(bb.h * sc + 2 * pad);
    cv.style.height = ch + 'px'; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    var ox = (cw - bb.w * sc) / 2 - bb.x0 * sc, oy = pad - bb.y0 * sc;
    view = { sc: sc, ox: ox, oy: oy };
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cw, ch);
    function X(x) { return ox + x * sc; } function Y(y) { return oy + y * sc; }
    function path() { ctx.beginPath(); poly.forEach(function (p, i) { i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1])); }); ctx.closePath(); }
    // подложка — план клиента: метры = поворот(пиксели − p0) · mpp − sh
    if (st.bg && st.bg.show && st.shape === 'custom') {
      var B = st.bg; ctx.save(); ctx.globalAlpha = 0.5;
      ctx.translate(X(-B.sh[0]), Y(-B.sh[1])); ctx.scale(sc * B.mpp, sc * B.mpp); ctx.rotate(-B.ax); ctx.translate(-B.p0[0], -B.p0[1]);
      ctx.drawImage(B.img, 0, 0); ctx.restore();
    }

    // карта освещённости
    var g = res.grid, off = document.createElement('canvas'); off.width = g.nx; off.height = g.ny;
    var oc = off.getContext('2d'), img = oc.createImageData(g.nx, g.ny), m = scaleMax();
    for (var k = 0; k < g.E.length; k++) {
      var c = colorAt(g.E[k] / m), o = k * 4;
      img.data[o] = c[0]; img.data[o + 1] = c[1]; img.data[o + 2] = c[2]; img.data[o + 3] = g.mask[k] ? 255 : 0;
    }
    oc.putImageData(img, 0, 0);
    ctx.save(); path(); ctx.clip(); ctx.imageSmoothingEnabled = true;
    ctx.fillStyle = '#222'; ctx.fill();
    ctx.drawImage(off, X(g.x0), Y(g.y0), g.nx * g.sx * sc, g.ny * g.sy * sc);
    // изолинии
    if (st.iso) {
      [0.5, 1, 1.5].forEach(function (f) {
        var lv = st.E * f, segs = M.isolines(g, lv); if (!segs.length) return;
        ctx.strokeStyle = f === 1 ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.55)'; ctx.lineWidth = f === 1 ? 1.6 : 1;
        ctx.beginPath(); segs.forEach(function (s) { ctx.moveTo(X(s[0][0]), Y(s[0][1])); ctx.lineTo(X(s[1][0]), Y(s[1][1])); }); ctx.stroke();
        var s0 = segs[Math.floor(segs.length / 3)], tx = X((s0[0][0] + s0[1][0]) / 2), ty = Y((s0[0][1] + s0[1][1]) / 2);
        ctx.font = '600 11px Arial'; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3;
        ctx.strokeText(fmt(lv), tx + 3, ty - 3); ctx.fillText(fmt(lv), tx + 3, ty - 3);
      });
    }
    ctx.restore();
    // стены и размеры
    path(); ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = '11px Arial'; ctx.fillStyle = '#555'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var cx0 = 0, cy0 = 0; poly.forEach(function (p) { cx0 += p[0] / poly.length; cy0 += p[1] / poly.length; });
    poly.forEach(function (p, i) {
      var q = poly[(i + 1) % poly.length], L = Math.hypot(q[0] - p[0], q[1] - p[1]); if (L < 0.2) return;
      var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, nx = -(q[1] - p[1]) / L, ny = (q[0] - p[0]) / L;
      if (M.inside(mx + nx * 0.05, my + ny * 0.05, poly)) { nx = -nx; ny = -ny; }
      // подпись вдоль стены, снаружи, чтобы не налезала на «+»
      var ang = Math.atan2(q[1] - p[1], q[0] - p[0]); if (ang > Math.PI / 2 || ang <= -Math.PI / 2) ang += Math.PI;
      ctx.save(); ctx.translate(X(mx) + nx * 16, Y(my) + ny * 16); ctx.rotate(ang); ctx.fillText(fmt(L, 2) + ' м', 0, 0); ctx.restore();
      // «+» для нового угла
      if (!clean) { ctx.beginPath(); ctx.arc(X(mx), Y(my), 7, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = '#000'; ctx.fillText('+', X(mx), Y(my) + 0.5); ctx.fillStyle = '#555'; }
    });
    // углы
    if (!clean) poly.forEach(function (p) { ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.fillRect(X(p[0]) - 5, Y(p[1]) - 5, 10, 10); ctx.strokeRect(X(p[0]) - 5, Y(p[1]) - 5, 10, 10); });
    // светильники
    st.groups.forEach(function (gr) {
      var col = colorOf(gr), lt = letterOf(gr);
      gr.pos.forEach(function (p) {
        var ok = M.inside(p[0], p[1], poly), x = X(p[0]), y = Y(p[1]);
        ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.fillStyle = !ok ? '#c62828' : gr.on === false ? '#bdbdbd' : col; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = '700 11px Arial'; ctx.fillText(ok ? lt : '!', x, y + 0.5);
      });
    });
  }

  // ---------- Перетаскивание ----------
  var drag = null;
  function toM(e) { var r = cv.getBoundingClientRect(); return [(e.clientX - r.left - view.ox) / view.sc, (e.clientY - r.top - view.oy) / view.sc]; }
  function snap(v) { return Math.round(v * 20) / 20; }
  function hit(pt) {
    var R = 14 / view.sc, poly = makePoly(), best = null, bd = R;
    st.groups.forEach(function (g) { g.pos.forEach(function (p, i) { var d = Math.hypot(p[0] - pt[0], p[1] - pt[1]); if (d < bd) { bd = d; best = { kind: 'lum', g: g, i: i }; } }); });
    if (best) return best;
    poly.forEach(function (p, i) { var d = Math.hypot(p[0] - pt[0], p[1] - pt[1]); if (d < bd) { bd = d; best = { kind: 'vtx', i: i }; } });
    if (best) return best;
    poly.forEach(function (p, i) { var q = poly[(i + 1) % poly.length], d = Math.hypot((p[0] + q[0]) / 2 - pt[0], (p[1] + q[1]) / 2 - pt[1]); if (d < bd) { bd = d; best = { kind: 'mid', i: i }; } });
    return best;
  }
  function toCustom() { if (st.shape !== 'custom') { st.poly = makePoly().map(function (p) { return p.slice(); }); st.shape = 'custom'; renderDims(); } }
  var raf = 0; function later() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; update(true); }); }
  var lastTap = { t: 0, i: -1 };
  cv.addEventListener('pointerdown', function (e) {
    if (tr) { trDown(e); return; }
    if (!view) return; var pt = toM(e), h = hit(pt); if (!h) return;
    e.preventDefault(); cv.setPointerCapture(e.pointerId);
    // двойное касание угла на телефоне = удалить угол (dblclick на тачскрине ненадёжен)
    if (h.kind === 'vtx' && e.pointerType !== 'mouse') {
      var now = Date.now();
      if (lastTap.i === h.i && now - lastTap.t < 400) { lastTap.t = 0; removeVertex(h.i); return; }
      lastTap = { t: now, i: h.i };
    }
    if (h.kind === 'mid') { toCustom(); st.poly.splice(h.i + 1, 0, [snap(pt[0]), snap(pt[1])]); h = { kind: 'vtx', i: h.i + 1 }; }
    else if (h.kind === 'vtx') toCustom();
    drag = h; cv.style.cursor = 'grabbing';
  });
  cv.addEventListener('pointermove', function (e) {
    if (tr) { trMove(e); return; }
    if (!view) return; var pt = toM(e);
    if (!drag) { cv.style.cursor = hit(pt) ? 'grab' : 'default'; return; }
    var x = snap(pt[0]), y = snap(pt[1]), poly = makePoly();
    if (drag.kind === 'lum') {
      if (M.TYPES[drag.g.type].mount === 'wall') drag.g.pos[drag.i] = M.snapToWall(poly, pt[0], pt[1], 0.08); // бра — только на стене
      else if (M.inside(x, y, poly)) drag.g.pos[drag.i] = [x, y];
    } else {
      var prev = st.poly[drag.i]; st.poly[drag.i] = [x, y];
      if (!M.isSimple(st.poly)) st.poly[drag.i] = prev; // не даём «перекрутить» комнату
      else snapWallLums();
    }
    later();
  });
  // после изменения стен бра остаются на стенах
  function snapWallLums() {
    var poly = makePoly();
    st.groups.forEach(function (g) { if (M.TYPES[g.type].mount === 'wall') g.pos = g.pos.map(function (p) { return M.snapToWall(poly, p[0], p[1], 0.08); }); });
  }
  function removeVertex(i) { toCustom(); if (st.poly.length > 3) { var prev = st.poly.slice(); st.poly.splice(i, 1); if (!M.isSimple(st.poly)) st.poly = prev; snapWallLums(); update(); } }
  function endDrag() { if (drag) { drag = null; cv.style.cursor = 'default'; update(); } }
  cv.addEventListener('pointerup', function (e) { if (tr) trUp(e); else endDrag(); });
  cv.addEventListener('pointercancel', function (e) { if (tr) trUp(e); else endDrag(); });
  cv.addEventListener('dblclick', function (e) {
    if (tr) { trDbl(e); return; }
    var h = hit(toM(e)); if (!h || h.kind !== 'vtx') return;
    removeVertex(h.i);
  });

  // ---------- Обводка плана по фото или скану ----------
  // Клиент загружает план, ставит точки по углам комнаты (в пикселях картинки), затем вводит длину одной стены —
  // отсюда масштаб. Контур поворачивается так, чтобы стены легли по осям (нужно для симметричной расстановки),
  // картинка остаётся подложкой на плане.
  var tr = null, tp = { ptrs: {}, mode: null };
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  function fitImage(src, w, h) {
    var k = Math.min(1, 2400 / Math.max(w, h)), c = document.createElement('canvas'), x = c.getContext('2d');
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(src, 0, 0, c.width, c.height);
    return c;
  }
  function loadPlan(file) {
    if (/pdf$/i.test(file.type) || /\.pdf$/i.test(file.name)) {
      return (window.pdfjsLib ? Promise.resolve() : load(PDFJS + 'pdf.min.js')).then(function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
        return file.arrayBuffer();
      }).then(function (buf) { return window.pdfjsLib.getDocument({ data: buf }).promise; })
        .then(function (doc) { return doc.getPage(1); })
        .then(function (pg) {
          var v1 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: 2400 / Math.max(v1.width, v1.height) });
          var c = document.createElement('canvas'), x = c.getContext('2d');
          c.width = Math.round(vp.width); c.height = Math.round(vp.height); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
          // intent 'print' — без requestAnimationFrame, иначе в фоновой вкладке рендер стоит
          return pg.render({ canvasContext: x, viewport: vp, intent: 'print' }).promise.then(function () { return c; });
        });
    }
    return new Promise(function (ok, no) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); ok(fitImage(im, im.naturalWidth, im.naturalHeight)); };
      im.onerror = function () { URL.revokeObjectURL(url); no(); };
      im.src = url;
    });
  }
  function startTrace(img) {
    if (view3d) setView('plan');
    tr = { img: img, pts: [], closed: false, sel: -1, axis: null, ortho: $('mlp-tortho').checked, hov: null, cw: 0 };
    tr.h = Hist(function () { return { key: JSON.stringify([tr.pts, tr.closed, tr.sel, tr.axis]) }; },
      function (s) { var o = JSON.parse(s.key); tr.pts = o[0]; tr.closed = o[1]; tr.sel = o[2]; tr.axis = o[3]; tr.hov = null; trMsg(''); drawTrace(); traceUI(); });
    tr.h.rec();
    $('mlp-tlen').value = ''; $('mlp-tmsg').hidden = true;
    traceUI(); drawTrace();
    root.querySelector('.plan').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function endTrace() { tr = null; tp = { ptrs: {}, mode: null }; cv.style.cursor = 'default'; traceUI(); update(); }
  function fitTrace() {
    var cw = cv.clientWidth || 600, maxH = Math.min(640, (window.innerHeight || 800) * 0.72), pad = 10, iw = tr.img.width, ih = tr.img.height;
    var sc = Math.min((cw - 2 * pad) / iw, (maxH - 2 * pad) / ih);
    tr.cw = cw; tr.ch = Math.max(320, Math.round(ih * sc + 2 * pad)); tr.fit = tr.sc = sc;
    tr.ox = (cw - iw * sc) / 2; tr.oy = (tr.ch - ih * sc) / 2;
  }
  function trS(p) { return [tr.ox + p[0] * tr.sc, tr.oy + p[1] * tr.sc]; }  // картинка → экран
  function trI(s) { return [(s[0] - tr.ox) / tr.sc, (s[1] - tr.oy) / tr.sc]; } // экран → картинка
  function scr(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function rot(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[1] * s, -p[0] * s + p[1] * c]; } // в оси плана
  function unrot(p, a) { var c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; }
  var TOL = 8 * Math.PI / 180;
  // Оси плана задаёт первая стена (фото может быть чуть повёрнуто) — угол в пределах ±45°
  function axisOf(d) {
    var q = Math.PI / 2, m = ((Math.atan2(d[1], d[0]) % q) + q) % q;
    return m > q / 2 ? m - q : m;
  }
  // Прилипание: стена вдоль осей плана + угол на одной линии с уже поставленными
  function trSnap(q) {
    var n = tr.pts.length; if (!tr.ortho || !n) return q;
    var prev = tr.pts[n - 1], d = [q[0] - prev[0], q[1] - prev[1]], L = Math.hypot(d[0], d[1]); if (L < 1e-6) return q;
    var ax = tr.axis != null ? tr.axis : axisOf(d), u = rot(d, ax), lim = Math.sin(TOL), hz = false, vt = false;
    if (Math.abs(u[1]) / L < lim) { u[1] = 0; hz = true; } else if (Math.abs(u[0]) / L < lim) { u[0] = 0; vt = true; }
    if (!hz && !vt) return q;
    var P = rot(prev, ax), R = [P[0] + u[0], P[1] + u[1]], tol = 10 / tr.sc;
    for (var i = 0; i < n - 1; i++) {
      var A = rot(tr.pts[i], ax);
      if (hz && Math.abs(R[0] - A[0]) < tol) { R[0] = A[0]; break; }
      if (vt && Math.abs(R[1] - A[1]) < tol) { R[1] = A[1]; break; }
    }
    return unrot(R, ax);
  }
  function trHitPt(s) {
    var best = -1, bd = 14;
    tr.pts.forEach(function (p, i) { var q = trS(p), d = Math.hypot(q[0] - s[0], q[1] - s[1]); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function trHitWall(s) {
    var n = tr.pts.length, best = -1, bd = 14;
    for (var i = 0; i < n; i++) {
      var a = trS(tr.pts[i]), b = trS(tr.pts[(i + 1) % n]), dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1;
      var t = Math.max(0, Math.min(1, ((s[0] - a[0]) * dx + (s[1] - a[1]) * dy) / L2)), d = Math.hypot(a[0] + t * dx - s[0], a[1] + t * dy - s[1]);
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }
  function wallPx(i) { var n = tr.pts.length, a = tr.pts[i], b = tr.pts[(i + 1) % n]; return Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function trMpp() { var L = num($('mlp-tlen').value); return tr.closed && tr.sel >= 0 && L > 0 ? L / wallPx(tr.sel) : 0; }
  function trMsg(t) { $('mlp-tmsg').textContent = t || ''; $('mlp-tmsg').hidden = !t; }
  function trZoom(s, k) {
    var nsc = Math.max(tr.fit * 0.5, Math.min(tr.fit * 12, tr.sc * k)), p = trI(s);
    tr.sc = nsc; tr.ox = s[0] - p[0] * nsc; tr.oy = s[1] - p[1] * nsc;
  }
  function drawTrace() {
    if ((cv.clientWidth || 600) !== tr.cw) fitTrace();
    var dpr = window.devicePixelRatio || 1, cw = tr.cw, ch = tr.ch, P = tr.pts.map(trS), n = P.length;
    cv.style.height = ch + 'px'; cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#f4f4f4'; ctx.fillRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(tr.img, tr.ox, tr.oy, tr.img.width * tr.sc, tr.img.height * tr.sc);
    if (!n) return;
    ctx.beginPath(); P.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
    if (tr.closed) { ctx.closePath(); ctx.fillStyle = 'rgba(229,57,53,.12)'; ctx.fill(); }
    ctx.strokeStyle = '#e53935'; ctx.lineWidth = 2; ctx.stroke();
    if (!tr.closed && tr.hov) {
      var h = trS(tr.hov); ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(P[n - 1][0], P[n - 1][1]); ctx.lineTo(h[0], h[1]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(h[0], h[1], 4, 0, 7); ctx.fillStyle = '#e53935'; ctx.fill();
    }
    if (tr.closed && tr.sel >= 0) {
      var a = P[tr.sel], b = P[(tr.sel + 1) % n]; ctx.strokeStyle = '#1565c0'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    var mpp = trMpp();
    if (mpp) {
      ctx.font = '600 12px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      P.forEach(function (p, i) {
        var q = P[(i + 1) % n], t = fmt(wallPx(i) * mpp, 2) + ' м';
        ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.strokeText(t, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
        ctx.fillStyle = i === tr.sel ? '#1565c0' : '#000'; ctx.fillText(t, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
      });
    }
    P.forEach(function (p, i) {
      var r = i === 0 && !tr.closed && n >= 3 ? 7 : 5;
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#e53935'; ctx.lineWidth = 2; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.strokeRect(p[0] - r, p[1] - r, 2 * r, 2 * r);
    });
  }
  function traceUI() {
    var on = !!tr;
    $('mlp-tbar').hidden = !on;
    root.querySelector('.views').hidden = on; $('mlp-tools2d').hidden = on; $('mlp-hint2d').hidden = on;
    $('mlp-legend').hidden = on || (view3d && mode3d === 'real');
    $('mlp-trace').textContent = st.bg ? 'Загрузить другой план' : 'Обвести по своему плану';
    if (!on) return;
    $('mlp-tstep').innerHTML = tr.closed
      ? '<b>Шаг 2 из 2.</b> Нажмите на стену, длину которой знаете (она выделится синим), и введите её длину — по ней определится масштаб. Сверьте подписи остальных стен.'
      : '<b>Шаг 1 из 2.</b> Нажимайте по углам комнаты по порядку, по внутренней стороне стен. Чтобы замкнуть контур, нажмите на первую точку.';
    $('mlp-tlenrow').hidden = $('mlp-tdone').hidden = !tr.closed;
    $('mlp-tdone').disabled = !trMpp();
    var c = tr.h.can(); $('mlp-tundo').disabled = !c[0]; $('mlp-tredo').disabled = !c[1];
  }
  function trDown(e) {
    e.preventDefault(); try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    var s = scr(e); tp.ptrs[e.pointerId] = s;
    var ids = Object.keys(tp.ptrs);
    if (ids.length === 2) {
      var a = tp.ptrs[ids[0]], b = tp.ptrs[ids[1]];
      tp.mode = 'pinch'; tp.d = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; tp.sc = tr.sc;
      tp.m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; tp.anchor = trI(tp.m);
      return;
    }
    if (ids.length > 2) return;
    tp.mode = 'tap'; tp.start = s; tp.idx = trHitPt(s); tp.o = [tr.ox, tr.oy];
  }
  function trMove(e) {
    var s = scr(e);
    if (tp.ptrs[e.pointerId]) tp.ptrs[e.pointerId] = s;
    if (tp.mode === 'pinch') {
      var ids = Object.keys(tp.ptrs); if (ids.length < 2) return;
      var a = tp.ptrs[ids[0]], b = tp.ptrs[ids[1]], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      tr.sc = Math.max(tr.fit * 0.5, Math.min(tr.fit * 12, tp.sc * Math.hypot(a[0] - b[0], a[1] - b[1]) / tp.d));
      tr.ox = m[0] - tp.anchor[0] * tr.sc; tr.oy = m[1] - tp.anchor[1] * tr.sc;
      drawTrace(); return;
    }
    if (tp.mode) {
      if (tp.mode === 'tap' && Math.hypot(s[0] - tp.start[0], s[1] - tp.start[1]) > 6) tp.mode = tp.idx >= 0 ? 'drag' : 'pan';
      if (tp.mode === 'drag') { tr.pts[tp.idx] = trI(s); drawTrace(); }
      else if (tp.mode === 'pan') { tr.ox = tp.o[0] + s[0] - tp.start[0]; tr.oy = tp.o[1] + s[1] - tp.start[1]; drawTrace(); }
      return;
    }
    var over = trHitPt(s) >= 0 || (tr.closed && trHitWall(s) >= 0);
    cv.style.cursor = over ? 'pointer' : 'crosshair';
    if (!tr.closed && tr.pts.length && e.pointerType === 'mouse') { tr.hov = trSnap(trI(s)); drawTrace(); }
  }
  function trUp(e) {
    delete tp.ptrs[e.pointerId];
    var mode = tp.mode;
    if (mode === 'pinch') { if (!Object.keys(tp.ptrs).length) tp.mode = null; return; } // оставшийся палец точку не ставит
    tp.mode = null;
    if (mode === 'tap' && e.type === 'pointerup') trTap(tp.start, tp.idx);
    if (mode === 'drag' && tr.closed && !M.isSimple(tr.pts)) trMsg('Стены пересекаются — передвиньте точку.');
    tr.h.rec(); drawTrace(); traceUI();
  }
  function trTap(s, idx) {
    trMsg('');
    if (tr.closed) {
      var w = trHitWall(s); if (w < 0) return;
      tr.sel = w; $('mlp-tlen').focus(); return;
    }
    if (idx === 0 && tr.pts.length >= 3) {
      if (!M.isSimple(tr.pts)) { trMsg('Стены пересекаются — передвиньте точки или отмените последнюю.'); return; }
      tr.closed = true; tr.hov = null;
      tr.sel = 0; for (var i = 1; i < tr.pts.length; i++) if (wallPx(i) > wallPx(tr.sel)) tr.sel = i; // по умолчанию — самая длинная стена
      setTimeout(function () { $('mlp-tlen').focus(); }, 0);
      return;
    }
    if (idx >= 0) return;
    tr.pts.push(trSnap(trI(s)));
    if (tr.pts.length === 2) { var a = tr.pts[0], b = tr.pts[1]; tr.axis = axisOf([b[0] - a[0], b[1] - a[1]]); }
  }
  function trDbl(e) {
    var i = trHitPt(scr(e)); if (i < 0 || (tr.closed && tr.pts.length <= 3)) return;
    tr.pts.splice(i, 1); if (tr.pts.length < 2) tr.axis = null;
    if (tr.sel >= tr.pts.length) tr.sel = 0;
    tr.h.rec(); drawTrace(); traceUI();
  }
  function finishTrace() {
    var mpp = trMpp(); if (!mpp) return;
    var ax = tr.axis || 0, p0 = tr.pts[0];
    var poly = tr.pts.map(function (p) { var r = rot([p[0] - p0[0], p[1] - p0[1]], ax); return [r[0] * mpp, r[1] * mpp]; });
    var bb = M.bbox(poly);
    poly = poly.map(function (p) { return [Math.round((p[0] - bb.x0) * 100) / 100, Math.round((p[1] - bb.y0) * 100) / 100]; });
    if (!M.isSimple(poly)) { trMsg('Контур пересекает сам себя или слишком маленький — поправьте точки.'); return; }
    if (bb.w > 60 || bb.h > 60) { trMsg('Комната получается больше 60 м — проверьте длину стены.'); return; }
    st.bg = { img: tr.img, mpp: mpp, ax: ax, p0: p0, sh: [bb.x0, bb.y0], show: true };
    $('mlp-bgshow').checked = true;
    st.shape = 'custom'; st.poly = poly;
    tr = null; tp = { ptrs: {}, mode: null }; cv.style.cursor = 'default';
    traceUI(); renderDims(); relayoutAll();
  }
  cv.addEventListener('wheel', function (e) {
    if (!tr) return; e.preventDefault();
    trZoom(scr(e), Math.exp(-e.deltaY * 0.0015)); drawTrace();
  }, { passive: false });
  $('mlp-file').addEventListener('change', function () {
    var f = this.files && this.files[0], inp = this, btn = $('mlp-trace'); if (!f) return;
    btn.disabled = true; btn.textContent = 'Открываем план…';
    loadPlan(f).then(startTrace, function () { alert('Не удалось открыть файл. Подойдёт фото или скан плана (JPG, PNG) или PDF.'); })
      .then(function () { btn.disabled = false; inp.value = ''; traceUI(); });
  });
  $('mlp-tlen').addEventListener('keydown', function (e) { if (e.key === 'Enter') finishTrace(); });

  // ---------- Ввод ----------
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-shape]'); if (b) { setShape(b.dataset.shape); return; }
    var vb = e.target.closest('[data-view]'); if (vb) { setView(vb.dataset.view); return; }
    var mb = e.target.closest('[data-m3]');
    if (mb) { mode3d = mb.dataset.m3; root.querySelectorAll('[data-m3]').forEach(function (x) { x.classList.toggle('on', x === mb); }); $('mlp-legend').hidden = mode3d === 'real'; refresh3d(); return; }
    if (e.target.closest('#mlp-cam')) { refresh3d(true); return; }
    if (e.target.closest('#mlp-rec-go')) { if (recApply) recApply(); return; }
    if (e.target.closest('#mlp-add')) { addGroup(st.groups.length ? 'spot' : 'pendant'); renderGroups(); update(); return; }
    if (e.target.closest('#mlp-auto')) { relayoutAll(); return; }
    if (e.target.closest('#mlp-undo')) { histGo(true); return; }
    if (e.target.closest('#mlp-redo')) { histGo(false); return; }
    if (e.target.closest('#mlp-trace')) { $('mlp-file').click(); return; }
    if (tr) {
      if (e.target.closest('#mlp-tdone')) { finishTrace(); return; }
      if (e.target.closest('#mlp-tundo')) { tr.h.undo(); return; }
      if (e.target.closest('#mlp-tredo')) { tr.h.redo(); return; }
      if (e.target.closest('#mlp-treset')) { tr.pts = []; tr.closed = false; tr.sel = -1; tr.axis = null; tr.h.rec(); trMsg(''); drawTrace(); traceUI(); return; }
      if (e.target.closest('#mlp-tquit')) { endTrace(); return; }
    }
    var del = e.target.closest('[data-del]');
    if (del) { var id = +del.closest('.grp').dataset.g; st.groups = st.groups.filter(function (g) { return g.id !== id; }); renderGroups(); update(); }
  });
  function onInput(e) {
    var t = e.target, k = t.dataset.k, f = t.dataset.f;
    if (t.id === 'mlp-iso') { st.iso = t.checked; draw(); return; }
    if (t.id === 'mlp-bgshow') { if (st.bg) st.bg.show = t.checked; draw(); return; }
    if (t.id === 'mlp-tortho') { if (tr) tr.ortho = t.checked; return; }
    if (t.id === 'mlp-tlen') { if (tr) { drawTrace(); traceUI(); } return; }
    if (t.id === 'mlp-file') return;
    if (k) {
      if (k === 'room') { st.room = +t.value; var n = ROOMS[st.room][1]; if (n) { st.E = n; root.querySelector('[data-k="E"]').value = n; } }
      else if (k === 'refl' || k === 'kz') st[k] = +t.value;
      else { st[k] = num(t.value); if (/^(a|b|ca|cb)$/.test(k)) { if (e.type !== 'change' && !(st[k] > 0.4)) return; st.poly = makePoly(); relayoutAll(); return; } }
      update(); return;
    }
    if (f) {
      var g = st.groups.filter(function (x) { return x.id === +t.closest('.grp').dataset.g; })[0]; if (!g) return;
      if (f === 'type') { g.type = t.value; var d = DEF[g.type]; ['watts', 'lm', 'lamps', 'drop', 'beam'].forEach(function (p) { g[p] = d[p]; }); g.eff = DEF_LAMP[g.type]; relayout(g); renderGroups(); update(); return; }
      if (f === 'on') { g.on = t.checked; update(); return; }
      if (f === 'mode') { g.mode = t.value; renderGroups(); update(); return; }
      if (f === 'count') {
        var v = Math.max(0, Math.min(60, Math.round(num(t.value))));
        if (e.type === 'input' && Math.abs(v - g.count) === 1 && M.TYPES[g.type].mount !== 'wall') v = stepCount(g, v - g.count); // стрелки
        g.count = v; relayout(g);
        if (e.type === 'change' || Math.abs(g.count - v) === 0) t.value = g.count; // при наборе с клавиатуры поле правим по выходу
        var nt = t.closest('.grp').querySelector('[data-note]'); if (nt) { nt.textContent = g.note || ''; nt.hidden = !g.note; }
        update(); return;
      }
      g[f] = num(t.value);
      updateGroupInfo(); update();
    }
  }
  root.addEventListener('input', onInput); root.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT' || e.target.type === 'checkbox') return; onInput(e); });
  root.querySelectorAll('[data-k]').forEach(function (el) { if (el.tagName === 'INPUT') el.value = st[el.dataset.k]; });

  // ---------- WhatsApp и PDF ----------
  function groupsText() {
    return st.groups.filter(function (g) { return g.pos.length; }).map(function (g) {
      return g.pos.length + ' × ' + M.TYPES[g.type].name.toLowerCase() + ' (' + (g.lamps > 1 ? g.lamps + ' ламп по ' : '') + (g.mode === 'w' ? fmt(g.watts, 1) + ' Вт' : fmt(g.lm) + ' лм') + ')';
    });
  }
  function roomText() {
    return ROOMS[st.room][0] + ', ' + fmt(res.area, 1) + ' м²' + (st.shape === 'rect' ? ' (' + fmt(st.a, 1) + ' × ' + fmt(st.b, 1) + ' м)' : '') + ', потолок ' + fmt(st.H, 2) + ' м';
  }
  function waText() {
    return 'Здравствуйте! Расчёт из планировщика освещения на сайте:\n' +
      '• Комната: ' + roomText() + '\n' +
      '• Светильники: ' + (groupsText().join('; ') || 'нет') + '\n' +
      '• Средняя освещённость ' + fmt(res.avg) + ' лк при норме ' + fmt(st.E) + ' лк, минимум ' + fmt(res.min) + ' лк\n' +
      'Помогите подобрать светильники.';
  }
  function load(src) { return new Promise(function (ok, no) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
  $('mlp-pdf').addEventListener('click', function () {
    var btn = this; btn.disabled = true; btn.textContent = 'Готовим PDF…';
    var p = Promise.resolve();
    if (!window.html2canvas) p = p.then(function () { return load('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'); });
    if (!(window.jspdf && window.jspdf.jsPDF)) p = p.then(function () { return load('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); });
    p.then(function () {
      var box = document.createElement('div'), d = new Date().toLocaleDateString('ru-RU');
      box.style.cssText = 'position:fixed;left:-10000px;top:0;width:760px;padding:36px;background:#fff;color:#000;font:13px Arial,sans-serif;line-height:1.45';
      function tbl(rs) { return '<table style="width:100%;border-collapse:collapse;margin:6px 0 18px">' + rs.map(function (r) { return '<tr><td style="padding:5px 0;border-bottom:1px solid #ddd;color:#555">' + esc(r[0]) + '</td><td style="padding:5px 0;border-bottom:1px solid #ddd;text-align:right;font-weight:600">' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>'; }
      var was3d = view3d; if (was3d) { cv.hidden = false; } // план рисуется только на видимом холсте
      draw(true); var plan = cv.toDataURL('image/png'), ratio = cv.height / cv.width; draw();
      if (was3d) cv.hidden = true;
      var shot = window.MLP3D && window.MLP3D.ready() ? window.MLP3D.snapshot() : null; // 3D — если его открывали
      var iw = shot ? 340 : 688, ih = Math.min(shot ? 300 : 560, iw * ratio), pw = ih < iw * ratio ? ih / ratio : iw;
      box.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:22px;font-weight:700">Moonlight</div><div style="color:#555">moonlight-kg.store · ' + d + '</div></div>' +
        '<div style="font-size:19px;font-weight:600;margin:18px 0 10px">План освещения</div>' +
        '<div style="display:flex;gap:8px;justify-content:center;align-items:center;margin-bottom:6px"><img src="' + plan + '" style="display:block;width:' + pw + 'px;height:' + ih + 'px">' +
        (shot ? '<img src="' + shot + '" style="display:block;width:340px;height:' + ih + 'px;object-fit:cover;border-radius:6px">' : '') + '</div>' +
        '<div style="height:8px;border-radius:4px;background:' + $('mlp-bar').style.background + '"></div>' +
        '<div style="display:flex;justify-content:space-between;color:#555;font-size:11px;margin:2px 0 14px">' + $('mlp-ticks').innerHTML + '</div>' +
        '<div style="display:flex;gap:28px;margin-bottom:10px">' +
          [[fmt(res.avg) + ' лк', 'средняя (норма ' + fmt(st.E) + ')'], [fmt(res.min) + ' лк', 'минимум'], [fmt(res.u0, 2), 'равномерность'], [fmt(res.W) + ' Вт', 'мощность']].map(function (r) { return '<div><div style="font-size:24px;font-weight:700">' + r[0] + '</div><div style="color:#555">' + r[1] + '</div></div>'; }).join('') + '</div>' +
        '<div style="padding:8px 12px;background:#f4f4f4;border-radius:6px;margin-bottom:14px">' + esc($('mlp-verdict').textContent) + '</div>' +
        tbl([['Помещение', roomText()], ['Рабочая поверхность', fmt(st.wp, 2) + ' м'], ['Отделка', REFL[st.refl][0]], ['Условия', KZ[st.kz][0]], ['Электричество', fmt(res.kwh) + ' кВт·ч/год ≈ ' + fmt(res.cost) + ' сом (' + fmt(st.hours, 1) + ' ч/день)']].concat(
          st.groups.map(function (g) { return ['Группа ' + letterOf(g) + (g.on === false ? ' (выключена)' : ''), g.pos.length + ' шт. · ' + M.TYPES[g.type].name + ' · ' + fmt(lumFlux(g)) + ' лм / ' + fmt(lumWatts(g), 1) + ' Вт']; }))) +
        '<div style="color:#777;font-size:11px">Ориентировочный расчёт по типовым кривым света (точечный метод с учётом отражений). Не заменяет светотехнический проект.</div>';
      document.body.appendChild(box);
      return window.html2canvas(box, { scale: 2, backgroundColor: '#fff' }).then(function (c) {
        document.body.removeChild(box);
        var pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), pw = 210, ph = c.height * pw / c.width;
        if (ph > 297) { pw = 297 * c.width / c.height; ph = 297; }
        pdf.addImage(c.toDataURL('image/jpeg', 0.92), 'JPEG', (210 - pw) / 2, 0, pw, ph);
        pdf.save('plan-osveshheniya.pdf');
      });
    }).catch(function () { alert('Не удалось создать PDF. Проверьте интернет и попробуйте ещё раз.'); })
      .then(function () { btn.disabled = false; btn.textContent = 'Скачать расчёт в PDF'; });
  });

  // ---------- Шапка Тильды и старт ----------
  function fitHeader() {
    var bottom = 0;
    document.querySelectorAll('body *').forEach(function (e) {
      if (root.contains(e)) return;
      var s = getComputedStyle(e); if (s.position !== 'fixed' || s.display === 'none' || s.visibility === 'hidden') return;
      var r = e.getBoundingClientRect();
      if (r.top <= 1 && r.bottom > 0 && r.height < 300 && r.width > innerWidth * 0.6) bottom = Math.max(bottom, r.bottom);
    });
    root.style.marginTop = '0px';
    var top = root.getBoundingClientRect().top + (window.pageYOffset || 0);
    root.style.marginTop = Math.max(0, Math.ceil(bottom - top)) + 'px';
  }
  if (document.readyState === 'complete') fitHeader(); else window.addEventListener('load', fitHeader);
  [300, 1000, 2500].forEach(function (t) { setTimeout(fitHeader, t); });
  var rw = 0; window.addEventListener('resize', function () { fitHeader(); clearTimeout(rw); rw = setTimeout(draw, 100); });

  st.poly = makePoly(); addGroup('pendant'); addGroup('spot');
  renderDims(); renderGroups(); legend(); update();
  clearTimeout(hT); histRec(); // исходное состояние — первая точка истории
  window.MLPlanner = { state: st, update: update, result: function () { return res; }, trace: function () { return tr; }, startTrace: startTrace }; // для отладки
})();

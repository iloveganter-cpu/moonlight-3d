/* Moonlight: живые комнаты + курсор-огонёк. Вставка в Тильде (T123): <div id="ml-rooms"></div><script src="https://iloveganter-cpu.github.io/moonlight-3d/rooms/rooms.js"></script>
   Курсор без комнат: <script src=".../rooms.js" data-only="cursor"></script> */
(() => {
if (window.__mlRooms) return; window.__mlRooms = 1;
const SCRIPT = document.currentScript;
const BASE = SCRIPT ? SCRIPT.src.replace(/[^/]*$/, '') : 'https://iloveganter-cpu.github.io/moonlight-3d/rooms/';
const st = document.createElement('style'); st.textContent = "\n#ml-rooms{--night:#201F1F;--night-2:#2B2A2A;--night-3:#383737;--night-line:#3E3D3D;--night-ink:#F4F4FB;--night-muted:#A9A8B0;\n  --muted:#A9A8B0;--f-display:Arial,Helvetica,sans-serif;--f-body:Arial,Helvetica,sans-serif;--f-mono:Arial,Helvetica,sans-serif;\n  background:var(--night);color:var(--night-ink);font-family:Arial,Helvetica,sans-serif;line-height:1.5;padding:72px 0 64px;-webkit-font-smoothing:antialiased}\n:root{--glow:#FFB46B}\n#ml-rooms *{box-sizing:border-box}\n#ml-rooms button{font-family:inherit;margin:0}\n#ml-rooms .ml-wrap{max-width:1200px;margin:0 auto;padding:0 20px}\n#ml-rooms .ml-hd{text-align:center;margin-bottom:34px}\n#ml-rooms .ml-hd h2{font:600 clamp(24px,3.2vw,40px)/1.15 Arial,sans-serif;text-transform:uppercase;letter-spacing:.01em;margin:0 0 14px;color:#fff}\n#ml-rooms .ml-hd p{color:var(--night-muted);font-size:16px;max-width:62ch;margin:0 auto}\n#ml-rooms .lr{border-radius:24px;background:#151414}\n#ml-rooms .lr-note{color:var(--night-muted);margin-top:14px}\n#ml-rooms .lr-lt .nm{font-weight:600}\n#ml-rooms .lr-kval{font-weight:600}\n#ml-rooms .lr-chip.on,#ml-rooms .lr-rooms button.on{background:#F4F4FB;color:#201F1F;border-color:#F4F4FB}\n#ml-rooms .ml-cta{display:flex;justify-content:center;margin-top:28px}\n#ml-rooms .ml-btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 28px;border-radius:30px;background:#F4F4FB;color:#201F1F;font:600 14px/1 Arial,sans-serif;text-decoration:none;transition:transform .15s,box-shadow .2s}\n#ml-rooms .ml-btn:hover{transform:translateY(-1px);box-shadow:0 0 24px color-mix(in srgb,var(--glow) 45%,transparent)}\n@media (max-width:640px){#ml-rooms{padding:48px 0 44px}#ml-rooms .ml-wrap{padding:0 12px}#ml-rooms .lr{border-radius:18px;padding:10px}}\n/* live room */\n#ml-rooms .lr{background:var(--night);color:var(--night-ink);border-radius:24px;padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px}\n@media (max-width:1000px){#ml-rooms .lr{grid-template-columns:minmax(0,1fr)}}\n#ml-rooms .lr-view{display:grid;gap:12px;min-width:0;align-content:start}\n#ml-rooms .lr-loading[hidden]{display:none}\n#ml-rooms .lr-frame{position:relative;aspect-ratio:16/9;max-width:100%;border-radius:14px;overflow:hidden;background:#000}\n#ml-rooms .lr-frame canvas{position:absolute;inset:0;width:100%;height:100%;display:block}\n#ml-rooms .lr-loading{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:16px;font-family:var(--f-mono);font-size:13px;color:var(--night-muted);background:var(--night-2)}\n#ml-rooms .lr-tag{position:absolute;left:12px;top:12px;font-family:var(--f-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;background:rgba(8,9,11,.6);backdrop-filter:blur(6px);padding:6px 10px;border-radius:99px;color:var(--night-muted)}\n#ml-rooms .lr-tag b{color:var(--night-ink);font-weight:500}\n#ml-rooms .lr-hs{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:0;background:transparent;cursor:pointer;padding:0}\n#ml-rooms .lr-hs::after{content:\"\";position:absolute;inset:9px;border-radius:50%;border:1.5px solid rgba(255,255,255,.55);background:rgba(17,19,22,.35);transition:all .25s}\n#ml-rooms .lr-hs.on::after{border-color:var(--glow);background:color-mix(in srgb,var(--glow) 55%,transparent);box-shadow:0 0 14px var(--glow)}\n#ml-rooms .lr-hs:hover::after{inset:6px}\n#ml-rooms .lr-hs .tip{position:absolute;left:50%;top:100%;transform:translateX(-50%);white-space:nowrap;font:500 11px/1 var(--f-mono);background:rgba(8,9,11,.8);padding:5px 8px;border-radius:6px;opacity:0;pointer-events:none;transition:opacity .15s;color:var(--night-ink)}\n#ml-rooms .lr-hs:hover .tip,#ml-rooms .lr-hs:focus-visible .tip{opacity:1}\n#ml-rooms .lr-k{background:var(--night-2);border-radius:14px;padding:14px 16px;display:grid;gap:10px}\n#ml-rooms .lr-krow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}\n#ml-rooms .lr-kval{font:500 26px/1 var(--f-mono);font-variant-numeric:tabular-nums}\n#ml-rooms .lr-kval small{font-size:13px;color:var(--night-muted);margin-left:8px;font-family:var(--f-body)}\n#ml-rooms .lr-chips{display:flex;gap:6px;flex-wrap:wrap}\n#ml-rooms .lr-chip{font:500 13px/1 var(--f-mono);padding:8px 11px;border-radius:99px;border:1px solid var(--night-line);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-chip:hover{color:var(--night-ink)}\n#ml-rooms .lr-chip.on{background:var(--night-ink);color:var(--night);border-color:var(--night-ink)}\n#ml-rooms .lr input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:10px;border-radius:99px;background:var(--night-3);outline:none;margin:0}\n#ml-rooms .lr input[type=range].kt{background:linear-gradient(90deg,#FF9F43,#FFD9A8 25%,#FFF4E6 50%,#E7EEFF 75%,#C9D8FF)}\n#ml-rooms .lr input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid var(--night);cursor:grab}\n#ml-rooms .lr input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--night);cursor:grab}\n#ml-rooms .lr-scale{display:flex;justify-content:space-between;font:400 11px/1 var(--f-mono);color:var(--night-muted)}\n#ml-rooms .lr-panel{display:grid;gap:12px;align-content:start;min-width:0}\n#ml-rooms .lr-seg{display:grid;grid-template-columns:1fr 1fr;background:var(--night-2);border-radius:12px;padding:4px;gap:4px}\n#ml-rooms .lr-seg button{border:0;border-radius:9px;padding:10px;font:500 14px/1 var(--f-body);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-seg button.on{background:var(--night-3);color:var(--night-ink)}\n#ml-rooms .lr-rooms{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:var(--night-2);border-radius:12px;padding:4px}\n#ml-rooms .lr-rooms button{border:0;border-radius:9px;padding:11px 6px;font:500 14px/1 var(--f-display);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-rooms button:hover{color:var(--night-ink)}\n#ml-rooms .lr-rooms button.on{background:var(--night-ink);color:var(--night)}\n#ml-rooms .lr-scenes #ml-rooms .lr-chip{font-family:var(--f-body);font-size:14px}\n#ml-rooms .lr-list{display:grid;gap:6px}\n#ml-rooms .lr-lt{background:var(--night-2);border-radius:12px;padding:12px 14px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center}\n#ml-rooms .lr-lt .nm{font:500 15px/1.25 var(--f-display)}\n#ml-rooms .lr-lt .pr{font:400 12px/1.3 var(--f-mono);color:var(--night-muted);margin-top:3px}\n#ml-rooms .lr-lt .pr.new{color:var(--glow)}\n#ml-rooms .lr-lt input[type=range]{grid-column:1/-1;height:6px}\n#ml-rooms .lr-lt.off input[type=range]{opacity:.35}\n#ml-rooms .lr-sw{position:relative;width:44px;height:26px;border-radius:99px;border:0;background:var(--night-3);cursor:pointer;transition:background .2s;flex:none}\n#ml-rooms .lr-sw::after{content:\"\";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:var(--night-muted);transition:all .2s}\n#ml-rooms .lr-sw[aria-checked=\"true\"]{background:var(--glow)}\n#ml-rooms .lr-sw[aria-checked=\"true\"]::after{left:21px;background:#fff}\n#ml-rooms .lr-lbl{font:500 11px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--night-muted);margin-top:4px}\n#ml-rooms .lr-note{font-size:13px;color:var(--muted);margin:0;max-width:80ch}\n@media (prefers-reduced-motion:reduce){#ml-rooms .lr *{transition:none!important}}\n\n/* курсор-свет v2 */\nhtml.cur-on, html.cur-on *{cursor:none!important}\n.cur,.cur-h{position:fixed;left:0;top:0;pointer-events:none;z-index:70;transform:translate3d(-200px,-200px,0);will-change:transform}\n.cur{width:0;height:0}\n.cur::before{content:\"\";position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:#fff;\n  box-shadow:0 0 0 2px var(--glow),0 0 14px 3px var(--glow),0 0 34px 8px color-mix(in srgb,var(--glow) 45%,transparent);\n  transition:transform .25s cubic-bezier(.3,1.6,.5,1),opacity .2s}\n.cur::after{content:\"\";position:absolute;left:-23px;top:-23px;width:46px;height:46px;border-radius:50%;\n  border:1.5px solid var(--glow);background:color-mix(in srgb,var(--glow) 12%,transparent);\n  box-shadow:0 0 22px color-mix(in srgb,var(--glow) 45%,transparent),inset 0 0 12px color-mix(in srgb,var(--glow) 25%,transparent);\n  transform:scale(.2);opacity:0;transition:transform .3s cubic-bezier(.3,1.5,.5,1),opacity .2s}\n.cur.link::before{transform:scale(.45)}\n.cur.link::after{transform:scale(1);opacity:1}\n.cur.down::before{transform:scale(1.8)}\n.cur.down.link::after{transform:scale(.85)}\n.cur.off::before,.cur.off::after,.cur-h.off{opacity:0}\n.cur-h{width:0;height:0}\n.cur-h::before{content:\"\";position:absolute;left:-150px;top:-150px;width:300px;height:300px;border-radius:50%;\n  background:radial-gradient(circle,color-mix(in srgb,var(--glow) 30%,transparent),transparent 65%);opacity:.55;transition:opacity .3s}\n:root[data-theme=\"dark\"] .cur-h::before{mix-blend-mode:screen;opacity:.5}\n:root:not([data-theme=\"dark\"]) .cur-h::before{mix-blend-mode:multiply;opacity:.35}\n.cur-h.off::before{opacity:0}\n@media (pointer:coarse),(prefers-reduced-motion:reduce){.cur,.cur-h{display:none}}\n\n\n/* огонёк виден и на белом: тёмный ободок под свечением */\n.cur::before{box-shadow:0 0 0 1.5px rgba(20,20,22,.6),0 0 0 3px var(--glow),0 0 14px 3px var(--glow),0 0 34px 8px color-mix(in srgb,var(--glow) 45%,transparent)}\n.cur::after{box-shadow:0 0 0 1px rgba(20,20,22,.28),inset 0 0 0 1px rgba(20,20,22,.18),0 0 22px color-mix(in srgb,var(--glow) 45%,transparent),inset 0 0 12px color-mix(in srgb,var(--glow) 25%,transparent)}\n"; document.head.appendChild(st);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a,b,t) => a + (b-a)*t;
function k2rgb(K){const t=K/100;let r,g,b;
  r=t<=66?255:329.698727446*Math.pow(t-60,-0.1332047592);
  g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-0.0755148492);
  b=t>=66?255:(t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307);
  const c=v=>Math.max(0,Math.min(255,Math.round(v)));return `rgb(${c(r)},${c(g)},${c(b)})`}


function rooms(){
  const host = document.getElementById('ml-rooms'); if (!host) return;
  host.innerHTML = "<div class=\"ml-wrap\">\n  <div class=\"ml-hd\"><h2>Включите свет в комнате</h2>\n  <p>Гостиная, кухня и спальня со светильниками из нашего каталога. Включайте каждый светильник, меняйте яркость и цвет света от тёплого 2700 K до холодного 6500 K.</p></div>\n  <div class=\"lr\" id=\"lr\" aria-label=\"Живая комната: интерактивный свет\">\n    <div class=\"lr-view\">\n      <div class=\"lr-frame\" id=\"lrFrame\">\n        <canvas id=\"lrCv\" aria-label=\"Комната с выбранным светом\"></canvas>\n        <div class=\"lr-loading\" id=\"lrLoading\">Загружаю комнату…</div>\n        <div class=\"lr-tag\" id=\"lrTag\"><b>Вечер</b> · 2700 K</div>\n      </div>\n      <div class=\"lr-k\">\n        <div class=\"lr-krow\"><div class=\"lr-kval\" id=\"kval\">2700 K<small>тёплый</small></div><div class=\"lr-chips\" id=\"lrK\"></div></div>\n        <input id=\"mlK\" class=\"kt\" type=\"range\" min=\"2700\" max=\"6500\" step=\"50\" value=\"2700\" aria-label=\"Цветовая температура, К\">\n        <div class=\"lr-scale\"><span>2700 K</span><span>4000 K</span><span>6500 K</span></div>\n      </div>\n    </div>\n    <div class=\"lr-panel\">\n      <div class=\"lr-rooms\" id=\"lrRooms\" role=\"tablist\" aria-label=\"Комната\"></div>\n      <div class=\"lr-seg\" role=\"radiogroup\" aria-label=\"Время суток\">\n        <button type=\"button\" id=\"lrNight\" role=\"radio\" class=\"on\" aria-checked=\"true\">Вечер</button>\n        <button type=\"button\" id=\"lrDay\" role=\"radio\" aria-checked=\"false\">День</button>\n      </div>\n      <div class=\"lr-lbl\">Сценарии</div>\n      <div class=\"lr-chips lr-scenes\" id=\"lrScenes\"></div>\n      <div class=\"lr-lbl\">Светильники</div>\n      <div class=\"lr-list\" id=\"lrList\"></div>\n    </div>\n  </div>\n  <p class=\"lr-note\" id=\"lrNote\"></p>\n  <div class=\"ml-cta\"><a class=\"ml-btn\" href=\"https://wa.me/996998899675?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9F%D0%BE%D0%BC%D0%BE%D0%B3%D0%B8%D1%82%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%81%D0%B2%D0%B5%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BD%D0%B0%D1%82%D1%8B\" target=\"_blank\" rel=\"noopener\">Подобрать свет для моей комнаты</a></div>\n</div>";
// ---------- Живая комната (relighting: отрендеренные проходы складываются в WebGL). Три комнаты.
(() => {
const ROOMS = {
  living: {
    title:'Гостиная', dir:BASE+'living/',
    note:'Люстра Ambrella LH53263 и бра LH53266 той же серии — новинки, скоро в шоуруме. Торшер EGLO Conivarino 901979 и магнитная система LUMINAIR есть в каталоге. Кружки на картинке тоже включают свет.',
    lights:[
      {id:'chand',      name:'Люстра Ambrella LH53263', prod:'Новинка · скоро в шоуруме', isNew:true, hs:[[.49,.165]]},
      {id:'sconce',     name:'Бра Ambrella LH53266, пара', prod:'Новинка · та же серия', isNew:true, hs:[[.3545,.448],[.724,.438]]},
      {id:'floor_up',   name:'Торшер, верхний свет', prod:'EGLO Conivarino 901979 · LED 2700 K', hs:[[.299,.45]]},
      {id:'floor_read', name:'Торшер, для чтения',   prod:'EGLO 901979 · гибкая лампа', hs:[[.326,.612]]},
      {id:'spots',      name:'Трековые споты ×4',    prod:'LUMINAIR 15 Вт · 1 800 сом', hs:[[.442,.219],[.604,.205],[.52,.212],[.77,.196]]},
      {id:'linear',     name:'Линейный модуль',      prod:'LUMINAIR 24 Вт · 2 200 сом', hs:[[.342,.178]]},
    ],
    scenes:[
      {name:'Вечер',  k:2700, v:{sconce:.7, floor_up:.8, spots:.5}},
      {name:'Чтение', k:3000, v:{sconce:.3, floor_up:.3, floor_read:1}},
      {name:'Гости',  k:3000, v:{chand:1, sconce:.8, floor_up:.6, spots:.8}},
      {name:'Кино',   k:2700, v:{sconce:.15, spots:.25}},
      {name:'Уборка', k:5000, v:{chand:1, sconce:1, floor_up:1, floor_read:1, spots:1, linear:1}},
    ],
    gain:{day:1.4, floor_read:8, spots:2},
  },
  kitchen: {
    title:'Кухня', dir:BASE+'kitchen/',
    note:'Подвес EGLO Caprarola над островом, магнитная система LUMINAIR над рабочей зоной и LED-подсветка под шкафами. Всё есть в каталоге.',
    lights:[
      {id:'pend',   name:'Подвес EGLO Caprarola',      prod:'Рифлёное стекло, 3×E27 · 32 800 сом', hs:[[.3796,.39],[.4759,.39],[.5722,.39]]},
      {id:'under',  name:'Подсветка рабочей зоны',     prod:'LED-лента в профиле под шкафами', hs:[[.2865,.528],[.591,.528]]},
      {id:'spots',  name:'Трековые споты ×3',          prod:'LUMINAIR 15 Вт · 1 800 сом', hs:[[.3158,.2006],[.423,.1978],[.5605,.2011]]},
      {id:'linear', name:'Линейные модули ×2',         prod:'LUMINAIR 24 Вт · 2 200 сом', hs:[[.2457,.1319],[.6929,.1319]]},
    ],
    scenes:[
      {name:'Готовка', k:4000, v:{under:1, spots:1, linear:.7}},
      {name:'Ужин',    k:2700, v:{pend:.8, under:.3}},
      {name:'Завтрак', k:3500, v:{pend:.6, under:.7, linear:.4}},
      {name:'Ночник',  k:2700, v:{under:.25}},
      {name:'Уборка',  k:5000, v:{pend:1, under:1, spots:1, linear:1}},
    ],
    gain:{day:1.5, spots:3},
  },
  bedroom: {
    title:'Спальня', dir:BASE+'bedroom/',
    note:'Люстра Ambrella LH55114, настольные лампы EGLO Viserbella и LED-подсветка изголовья. Всё есть в каталоге.',
    lights:[
      {id:'pend',  name:'Люстра Ambrella LH55114',   prod:'Латунь, янтарное стекло, 6×E14 · 26 600 сом', hs:[[.5,.30]]},
      {id:'table', name:'Лампы EGLO Viserbella, пара', prod:'Золотой абажур · 6 200 сом', hs:[[.3357,.66],[.6643,.66]]},
      {id:'cove',  name:'Подсветка изголовья',       prod:'LED-лента, мягкий отражённый свет', hs:[[.5,.555]]},
    ],
    scenes:[
      {name:'Вечер',      k:2700, v:{table:.7, cove:.8, pend:.3}},
      {name:'Перед сном', k:2700, v:{table:.35, cove:.4}},
      {name:'Чтение',     k:3000, v:{table:1, cove:.3}},
      {name:'Утро',       k:4000, v:{pend:1, cove:.5}},
      {name:'Уборка',     k:5000, v:{pend:1, table:1, cove:1}},
    ],
    gain:{day:1.5},
  },
};
const KPRE = [2700,3000,4000,5000,6500];
const MAXP = 8;

const st = {room:'living', k:2700, day:false, on:{}, dim:{}, lockEx:0};
let plan = null;   // время суток: {day, k} или {scene}
let R, sceneName = '';

function kelvinRGB(T){
  const t=T, t2=t*t, t3=t2*t;
  const x = T<=4000 ? -0.2661239e9/t3 - 0.2343589e6/t2 + 0.8776956e3/t + 0.179910
                    : -3.0258469e9/t3 + 2.1070379e6/t2 + 0.2226347e3/t + 0.240390;
  const y = T<=2222 ? -1.1063814*x**3 - 1.34811020*x*x + 2.18555832*x - 0.20219683
          : T<=4000 ? -0.9549476*x**3 - 1.37418593*x*x + 2.09137015*x - 0.16748867
                    :  3.0817580*x**3 - 5.87338670*x*x + 3.75112997*x - 0.37001483;
  const X=x/y, Y=1, Z=(1-x-y)/y;
  let r= 3.2406*X-1.5372*Y-0.4986*Z, g=-0.9689*X+1.8758*Y+0.0415*Z, b=0.0557*X-0.2040*Y+1.0570*Z;
  r=Math.max(r,0); g=Math.max(g,0); b=Math.max(b,0);
  const A=0.40; r=r*(1-A)+A; g=g*(1-A)+A; b=b*(1-A)+A;   // частичная адаптация глаза
  const L=0.2126*r+0.7152*g+0.0722*b;
  return [r/L,g/L,b/L];
}
const kName = K => K<=2900?'тёплый, как лампа накаливания':K<=3500?'тёплый белый':K<=4500?'нейтральный':K<=5500?'дневной':'холодный';

const $ = id => document.getElementById(id);
const frame = $('lrFrame');
let rows = {};

// вкладки комнат (если на странице есть контейнер)
const tabs = $('lrRooms');
if (tabs) Object.entries(ROOMS).forEach(([id, r]) => {
  const b = document.createElement('button'); b.textContent = r.title; b.setAttribute('role','tab'); b.dataset.room = id;
  b.onclick = () => { if (st.room !== id) loadRoom(id); };
  tabs.appendChild(b);
});
KPRE.forEach(k => {
  const b = document.createElement('button'); b.className='lr-chip'; b.textContent = k+' K'; b.dataset.k=k;
  b.onclick = () => { st.k=k; $('mlK').value=k; sync(); }; $('lrK').appendChild(b);
});
$('mlK').oninput = e => { st.k = +e.target.value; sync(); };
$('lrNight').onclick = () => { st.day=false; sync(); };
$('lrDay').onclick = () => { st.day=true; sync(); };

function buildUI(){
  $('lrList').innerHTML = ''; $('lrScenes').innerHTML = '';
  frame.querySelectorAll('.lr-hs').forEach(b => b.remove());
  rows = {}; st.on = {}; st.dim = {};
  R.lights.forEach(l => {
    st.on[l.id] = false; st.dim[l.id] = 1;
    const d = document.createElement('div'); d.className='lr-lt off';
    d.innerHTML = `<div><div class="nm">${l.name}</div><div class="pr${l.isNew?' new':''}">${l.prod}</div></div>
      <button class="lr-sw" role="switch" aria-checked="false" aria-label="${l.name}: включить"></button>
      <input type="range" min="5" max="100" value="100" aria-label="${l.name}: яркость">`;
    $('lrList').appendChild(d);
    const sw = d.querySelector('.lr-sw'), rg = d.querySelector('input');
    sw.onclick = () => { st.on[l.id] = !st.on[l.id]; userChange(); };
    rg.oninput = () => { st.dim[l.id] = rg.value/100; st.on[l.id] = true; userChange(); };
    rows[l.id] = {d, sw, rg, hs:[]};
    l.hs.forEach(([x,y]) => {
      const b = document.createElement('button'); b.className='lr-hs';
      b.style.left = (x*100)+'%'; b.style.top = (y*100)+'%';
      b.setAttribute('aria-label', l.name); b.innerHTML = `<span class="tip">${l.name}</span>`;
      b.onclick = () => { st.on[l.id] = !st.on[l.id]; userChange(); };
      frame.appendChild(b); rows[l.id].hs.push(b);
    });
  });
  R.scenes.forEach(s => {
    const b = document.createElement('button'); b.className='lr-chip'; b.textContent=s.name;
    b.onclick = () => applyScene(s); s.btn = b; $('lrScenes').appendChild(b);
  });
  if ($('lrNote')) $('lrNote').textContent = R.note;
  if (tabs) [...tabs.children].forEach(b => { const on = b.dataset.room===st.room; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
}
function applyScene(s){
  sceneName = s.name; st.k = s.k; $('mlK').value = s.k;
  R.lights.forEach(l => { const v=s.v[l.id]||0; st.on[l.id]=v>0; if(v>0) st.dim[l.id]=v; });
  sync();
}
function userChange(){ sceneName=''; sync(); }
function sync(){
  R.lights.forEach(l => {
    const r = rows[l.id], on = st.on[l.id];
    r.d.classList.toggle('off', !on);
    r.sw.setAttribute('aria-checked', on); r.sw.setAttribute('aria-label', `${l.name}: ${on?'выключить':'включить'}`);
    r.rg.value = Math.round(st.dim[l.id]*100);
    r.hs.forEach(b => b.classList.toggle('on', on));
  });
  R.scenes.forEach(s => s.btn.classList.toggle('on', s.name===sceneName));
  [...$('lrK').children].forEach(b => b.classList.toggle('on', +b.dataset.k===st.k));
  $('kval').innerHTML = `${st.k} K<small>${kName(st.k)}</small>`;
  $('lrNight').classList.toggle('on', !st.day); $('lrNight').setAttribute('aria-checked', !st.day);
  $('lrDay').classList.toggle('on', st.day); $('lrDay').setAttribute('aria-checked', st.day);
  $('lrTag').innerHTML = `<b>${sceneName || (st.day?'День':'Свой свет')}</b> · ${st.k} K`;
  document.documentElement.style.setProperty('--glow', k2rgb(st.k));
  kick();
}

// ---------- WebGL
const cv = $('lrCv');
const gl = cv.getContext('webgl', {antialias:false, premultipliedAlpha:false});
let meta = null, U = {}, ready = false, prog = null, texB = null, texH = null, loadSeq = 0;
const cur = {w:new Float32Array(MAXP), col:null, exp:0};
const VS = `attribute vec2 p; varying vec2 uv; void main(){ uv = vec2(p.x*.5+.5, .5-p.y*.5); gl_Position = vec4(p,0.,1.); }`;
const FS = `precision highp float;
varying vec2 uv; uniform sampler2D tB, tH; uniform vec2 cell; uniform vec2 off[8];
uniform vec3 wb[8]; uniform vec3 wh[8]; uniform float ex;
vec3 dec(vec3 c){ return pow(c, vec3(2.2)); }
vec3 neutral(vec3 c){
  float st = .76, de = .15;
  float x = min(c.r, min(c.g, c.b));
  float o = x < .08 ? x - 6.25*x*x : .04; c -= o;
  float pk = max(c.r, max(c.g, c.b));
  if (pk < st) return c;
  float d = 1. - st; float np = 1. - d*d/(pk + d - st);
  c *= np/pk; float g = 1. - 1./(de*(pk - np) + 1.);
  return mix(c, vec3(np), g);
}
void main(){
  vec3 L = vec3(0.);
  for (int i = 0; i < 8; i++){
    vec2 q = (uv + off[i]) * cell;
    L += dec(texture2D(tB, q).rgb) * wb[i] + dec(texture2D(tH, q).rgb) * wh[i];
  }
  vec3 c = clamp(neutral(L*ex), 0., 1.);
  c = mix(12.92*c, 1.055*pow(c, vec3(1./2.4)) - .055, step(.0031308, c));
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
  gl_FragColor = vec4(c + (n-.5)/255., 1.);
}`;
function sh(t,s){ const o=gl.createShader(t); gl.shaderSource(o,s); gl.compileShader(o); if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(o); return o; }
function tex(img, unit, old){
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  let src = img;
  if (img.width > max || img.height > max){
    const s = max/Math.max(img.width, img.height), c = document.createElement('canvas');
    c.width = Math.floor(img.width*s); c.height = Math.floor(img.height*s);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height); src = c;
  }
  if (old) gl.deleteTexture(old);
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,t);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,src);
  [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T].forEach(p=>gl.texParameteri(gl.TEXTURE_2D,p,gl.CLAMP_TO_EDGE));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  return t;
}
const loadImg = src => new Promise((ok,no)=>{ const i=new Image(); i.crossOrigin='anonymous'; i.onload=()=>ok(i); i.onerror=()=>no(src); i.src=src; });

function initGL(){
  prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER,VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER,FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(prog,'p'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  ['tB','tH','cell','off','wb','wh','ex'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  gl.uniform1i(U.tB,0); gl.uniform1i(U.tH,1);
  new ResizeObserver(resize).observe(frame);
}

async function loadRoom(id){
  const seq = ++loadSeq;
  st.room = id; R = ROOMS[id]; ready = false;
  buildUI();
  if (plan) applyPlan(plan); else applyScene(R.scenes.find(s => s.name === frame.dataset.scene) || R.scenes[0]);
  if (!gl){ $('lrLoading').textContent = 'Браузер не поддерживает WebGL, поэтому комнату показать не получится.'; return; }
  $('lrLoading').hidden = false; $('lrLoading').textContent = `Загружаю: ${R.title.toLowerCase()}…`;
  try {
    const small = Math.min(screen.width, innerWidth) * (devicePixelRatio||1) < 1300;
    const dir = R.dir + (small ? 'sm/' : 'lg/');
    const m = await (await fetch(dir+'passes.json')).json();
    const [b,h] = await Promise.all([loadImg(dir+'base.jpg'), loadImg(dir+'hot.jpg')]);
    if (seq !== loadSeq) return;                // пока грузили, выбрали другую комнату
    if (!prog) initGL();
    texB = tex(b,0,texB); texH = tex(h,1,texH);
    gl.uniform2f(U.cell, 1/m.cols, 1/m.rows);
    const offs = new Float32Array(MAXP*2); m.passes.forEach((p,i) => { offs[i*2] = i%m.cols; offs[i*2+1] = Math.floor(i/m.cols); });
    gl.uniform2fv(U.off, offs);
    m.lumAll = m.passes.reduce((s,p) => s + (p.name==='day'?0:p.mean), 0);
    m.byName = {}; m.passes.forEach((p,i) => m.byName[p.name] = i);
    meta = m; cur.col = null; ready = true; $('lrLoading').hidden = true;
    resize();
  } catch(e){ if (seq === loadSeq){ $('lrLoading').textContent = 'Не удалось загрузить комнату. Обновите страницу.'; console.error(e); } }
}
function resize(){
  if (!ready) return;
  const r = frame.getBoundingClientRect(), d = Math.min(devicePixelRatio||1, 2);
  cv.width = Math.round(r.width*d); cv.height = Math.round(r.height*d);
  gl.viewport(0,0,cv.width,cv.height); kick(true);
}
function targets(){
  const w = new Float32Array(MAXP);
  meta.passes.forEach((p,i) => {
    const n = p.name;
    let v = n==='night' ? 1 : n==='day' ? (st.day?1:0) : (st.on[n] ? st.dim[n]**1.6 : 0);
    if (R.gain[n]) v *= R.gain[n];
    w[i] = v;
  });
  return w;
}
function exposureFor(w){
  let L = 0; meta.passes.forEach((p,i) => L += p.mean * w[i]);
  return 0.26 / meta.lumAll * Math.pow(meta.lumAll / Math.max(L, meta.lumAll*0.004), 0.6);
}
let raf = 0, last = 0;
function kick(){ if (ready && !raf) { last = performance.now(); raf = requestAnimationFrame(draw); } }
function draw(t){
  raf = 0;
  const dt = Math.min((t-last)/1000, .1); last = t;
  const tw = targets(), tc = kelvinRGB(st.k), te = st.lockEx || exposureFor(tw);
  const a = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 1 - Math.exp(-dt*7);
  if (!cur.col){ cur.col = tc.slice(); cur.exp = te; cur.w.set(tw); }
  let moving = false;
  for (let i=0;i<MAXP;i++){ const d=tw[i]-cur.w[i]; cur.w[i]+=d*a; if (Math.abs(d)>1e-4) moving=true; }
  for (let i=0;i<3;i++){ const d=tc[i]-cur.col[i]; cur.col[i]+=d*a; if (Math.abs(d)>1e-4) moving=true; }
  const de = Math.log(te/cur.exp); cur.exp *= Math.exp(de*a*0.7); if (Math.abs(de)>1e-3) moving = true;
  const wb = new Float32Array(MAXP*3), wh = new Float32Array(MAXP*3);
  meta.passes.forEach((p,i) => {
    const c = (p.name==='night'||p.name==='day') ? [1,1,1] : cur.col;
    for (let j=0;j<3;j++){ wb[i*3+j] = c[j]*cur.w[i]*p.s; wh[i*3+j] = c[j]*cur.w[i]*p.s2; }
  });
  gl.uniform3fv(U.wb, wb); gl.uniform3fv(U.wh, wh);
  gl.uniform1f(U.ex, cur.exp);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  if (moving) raf = requestAnimationFrame(draw);
}

const NIGHT = ['Кино', 'Ночник', 'Перед сном'];
function applyPlan(p){
  if (p.scene === 'night') { const s = R.scenes.find(x => NIGHT.includes(x.name)) || R.scenes[0]; applyScene(s); st.day = false; sync(); return; }
  if (p.scene === 'evening') { applyScene(R.scenes[0]); st.day = false; sync(); return; }
  sceneName = p.label || ''; st.day = true; st.k = p.k || 4000; $('mlK').value = st.k;
  R.lights.forEach(l => st.on[l.id] = false);
  sync();
}
window.lrPlan = p => { plan = p; if (R) applyPlan(p); };
// «включение»: комната гаснет и светильники загораются по очереди; экспозиция зафиксирована на итоговой
window.lrIntro = async (step = 520) => {
  await window.lrReady;
  if (!ready) return;
  const want = {day: st.day, on: {...st.on}};
  st.lockEx = exposureFor(targets());
  st.day = false; R.lights.forEach(l => st.on[l.id] = false); sync();
  cur.w.fill(0); cur.exp = st.lockEx; cur.col = kelvinRGB(st.k); kick();
  const wait = ms => new Promise(r => setTimeout(r, ms));
  await wait(450);
  if (want.day) { st.day = true; sync(); await wait(step * 1.6); }
  for (const l of R.lights) if (want.on[l.id]) { st.on[l.id] = true; sync(); await wait(step); }
  await wait(900); st.lockEx = 0; kick();
};
window.lrRooms = ROOMS;   // для правки кружков из консоли
window.lrLoad = id => { if (ROOMS[id] && st.room !== id) loadRoom(id); };
const start = (frame.dataset.room && ROOMS[frame.dataset.room]) ? frame.dataset.room : 'living';
window.lrReady = loadRoom(start);
})();

  // свет «включается» по очереди, когда блок докрутили до экрана
  if (!RM) new IntersectionObserver(([e], o) => { if (e.isIntersecting && window.lrIntro){ o.disconnect(); window.lrIntro(); } }, {threshold:.4}).observe(document.getElementById('lrFrame'));
}
function cursor(){
// ---------- курсор-свет v2: огонёк + пятно света, на ссылках — светящееся кольцо
const fine = matchMedia('(pointer:fine)').matches && !RM;
if (fine){
  document.documentElement.classList.add('cur-on');
  const d = document.createElement('div'), h = document.createElement('div');
  d.className = 'cur off'; h.className = 'cur-h off'; document.body.append(h, d);
  let x = -200, y = -200, hx = -200, hy = -200, seen = false;
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!seen){ hx = x; hy = y; seen = true; }
    const t = e.target, beam = !!t.closest('.fl-box');
    d.classList.toggle('off', beam); h.classList.toggle('off', beam);   // в фонарике курсор — сам луч
    d.classList.toggle('link', !!t.closest('a,button,input,label,select,.lr-hs,[role=tab],[role=switch]'));
  }, {passive:true});
  addEventListener('pointerdown', () => d.classList.add('down'));
  addEventListener('pointerup', () => d.classList.remove('down'));
  document.addEventListener('pointerleave', () => { d.classList.add('off'); h.classList.add('off'); });
  document.addEventListener('pointerenter', () => { d.classList.remove('off'); h.classList.remove('off'); });
  const loop = () => { hx = lerp(hx, x, .12); hy = lerp(hy, y, .12);
    d.style.transform = `translate3d(${x}px,${y}px,0)`; h.style.transform = `translate3d(${hx}px,${hy}px,0)`; requestAnimationFrame(loop); };
  loop();
}


}
const go = () => { if (!(SCRIPT && SCRIPT.dataset.only === 'cursor')) rooms(); if (!(SCRIPT && SCRIPT.dataset.cursor === 'off')) cursor(); };
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
})();

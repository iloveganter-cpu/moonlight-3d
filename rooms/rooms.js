/* Moonlight: живые комнаты + курсор-огонёк. Вставка в Тильде (T123): <div id="ml-rooms"></div><script src="https://iloveganter-cpu.github.io/moonlight-3d/rooms/rooms.js"></script>
   Только часть: data-only="cursor" / "extras,cursor"; отключить: data-extras="off", data-cursor="off". Фонарик: <div id="ml-flash"></div> (иначе сам встаёт перед T603) */
(() => {
if (window.__mlRooms) return; window.__mlRooms = 1;
const SCRIPT = document.currentScript;
const BASE = SCRIPT ? SCRIPT.src.replace(/[^/]*$/, '') : 'https://iloveganter-cpu.github.io/moonlight-3d/rooms/';
if (!document.getElementById('ml-font')){ const l = document.createElement('link'); l.id = 'ml-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap'; document.head.appendChild(l); }
const st = document.createElement('style'); st.textContent = "\n#ml-rooms{--night:var(--ml-d,#2F3438);--night-2:color-mix(in srgb,var(--night) 86%,#fff);--night-3:color-mix(in srgb,var(--night) 74%,#fff);--night-line:color-mix(in srgb,var(--night) 70%,#fff);--night-ink:#F3F4F5;--night-muted:#AAACAE;\n  --muted:#AAACAE;--f-display:var(--ml-font);--f-body:var(--ml-font);--f-mono:var(--ml-font);\n  background:var(--night);color:var(--night-ink);font-family:var(--ml-font);line-height:1.5;padding:72px 0 64px;-webkit-font-smoothing:antialiased}\n:root{--glow:#FFB46B;--ml-amber:#EFAC3E;--ml-font:'Avenir Next','Avenir','Nunito Sans',Arial,Helvetica,sans-serif}\n#ml-rooms *{box-sizing:border-box}\n#ml-rooms button{font-family:inherit;margin:0}\n#ml-rooms .ml-wrap{max-width:1200px;margin:0 auto;padding:0 20px}\n#ml-rooms .ml-hd{text-align:center;margin-bottom:34px}\n#ml-rooms .ml-hd h2{font:300 clamp(22px,2.9vw,36px)/1.25 var(--ml-font);text-transform:uppercase;letter-spacing:.16em;margin:0 0 14px;color:#fff}\n#ml-rooms .ml-hd::before{content:\"\";display:block;width:34px;height:34px;margin:0 auto 18px;background:var(--ml-star) center/contain no-repeat}\n#ml-rooms .ml-hd p{color:var(--night-muted);font-size:16px;max-width:62ch;margin:0 auto}\n#ml-rooms .lr{border-radius:24px;background:color-mix(in srgb,var(--night) 72%,#000)}\n#ml-rooms .lr-note{color:var(--night-muted);margin-top:14px}\n#ml-rooms .lr-lt .nm{font-weight:600}\n#ml-rooms .lr-kval{font-weight:300;letter-spacing:.02em}\n#ml-rooms .lr-chip.on,#ml-rooms .lr-rooms button.on{background:#F4F4FB;color:#201F1F;border-color:#F4F4FB}\n#ml-rooms .ml-cta{display:flex;justify-content:center;margin-top:28px}\n#ml-rooms .ml-btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 28px;border-radius:30px;background:#F4F4FB;color:#201F1F;font:600 14px/1 var(--ml-font);letter-spacing:.04em;text-decoration:none;transition:transform .15s,box-shadow .2s}\n#ml-rooms .ml-btn:hover{transform:translateY(-1px);box-shadow:0 0 24px color-mix(in srgb,var(--glow) 45%,transparent)}\n@media (max-width:640px){#ml-rooms{padding:48px 0 44px}#ml-rooms .ml-wrap{padding:0 12px}#ml-rooms .lr{border-radius:18px;padding:10px}}\n/* live room */\n#ml-rooms .lr{background:var(--night);color:var(--night-ink);border-radius:24px;padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px}\n@media (max-width:1000px){#ml-rooms .lr{grid-template-columns:minmax(0,1fr)}}\n#ml-rooms .lr-view{display:grid;gap:12px;min-width:0;align-content:start}\n#ml-rooms .lr-loading[hidden]{display:none}\n#ml-rooms .lr-frame{position:relative;aspect-ratio:16/9;max-width:100%;border-radius:14px;overflow:hidden;background:#000}\n#ml-rooms .lr-frame canvas{position:absolute;inset:0;width:100%;height:100%;display:block}\n#ml-rooms .lr-loading{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:16px;font-family:var(--f-mono);font-size:13px;color:var(--night-muted);background:var(--night-2)}\n#ml-rooms .lr-tag{position:absolute;left:12px;top:12px;font-family:var(--f-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;background:rgba(8,9,11,.6);backdrop-filter:blur(6px);padding:6px 10px;border-radius:99px;color:var(--night-muted)}\n#ml-rooms .lr-tag b{color:var(--night-ink);font-weight:500}\n#ml-rooms .lr-hs{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:0;background:transparent;cursor:pointer;padding:0}\n#ml-rooms .lr-hs::after{content:\"\";position:absolute;inset:9px;border-radius:50%;border:1.5px solid rgba(255,255,255,.55);background:rgba(17,19,22,.35);transition:all .25s}\n#ml-rooms .lr-hs.on::after{border-color:var(--glow);background:color-mix(in srgb,var(--glow) 55%,transparent);box-shadow:0 0 14px var(--glow)}\n#ml-rooms .lr-hs:hover::after{inset:6px}\n#ml-rooms .lr-hs .tip{position:absolute;left:50%;top:100%;transform:translateX(-50%);white-space:nowrap;font:500 11px/1 var(--f-mono);background:rgba(8,9,11,.8);padding:5px 8px;border-radius:6px;opacity:0;pointer-events:none;transition:opacity .15s;color:var(--night-ink)}\n#ml-rooms .lr-hs:hover .tip,#ml-rooms .lr-hs:focus-visible .tip{opacity:1}\n#ml-rooms .lr-k{background:var(--night-2);border-radius:14px;padding:14px 16px;display:grid;gap:10px}\n#ml-rooms .lr-krow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}\n#ml-rooms .lr-kval{font:500 26px/1 var(--f-mono);font-variant-numeric:tabular-nums}\n#ml-rooms .lr-kval small{font-size:13px;color:var(--night-muted);margin-left:8px;font-family:var(--f-body)}\n#ml-rooms .lr-chips{display:flex;gap:6px;flex-wrap:wrap}\n#ml-rooms .lr-chip{font:500 13px/1 var(--f-mono);padding:8px 11px;border-radius:99px;border:1px solid var(--night-line);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-chip:hover{color:var(--night-ink)}\n#ml-rooms .lr-chip.on{background:var(--night-ink);color:var(--night);border-color:var(--night-ink)}\n#ml-rooms .lr input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:10px;border-radius:99px;background:var(--night-3);outline:none;margin:0}\n#ml-rooms .lr input[type=range].kt{background:linear-gradient(90deg,#FF9F43,#FFD9A8 25%,#FFF4E6 50%,#E7EEFF 75%,#C9D8FF)}\n#ml-rooms .lr input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid var(--night);cursor:grab}\n#ml-rooms .lr input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--night);cursor:grab}\n#ml-rooms .lr-scale{display:flex;justify-content:space-between;font:400 11px/1 var(--f-mono);color:var(--night-muted)}\n#ml-rooms .lr-panel{display:grid;gap:12px;align-content:start;min-width:0}\n#ml-rooms .lr-seg{display:grid;grid-template-columns:1fr 1fr;background:var(--night-2);border-radius:12px;padding:4px;gap:4px}\n#ml-rooms .lr-seg button{border:0;border-radius:9px;padding:10px;font:500 14px/1 var(--f-body);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-seg button.on{background:var(--night-3);color:var(--night-ink)}\n#ml-rooms .lr-rooms{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:var(--night-2);border-radius:12px;padding:4px}\n#ml-rooms .lr-rooms button{border:0;border-radius:9px;padding:11px 6px;font:500 14px/1 var(--f-display);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-rooms button:hover{color:var(--night-ink)}\n#ml-rooms .lr-rooms button.on{background:var(--night-ink);color:var(--night)}\n#ml-rooms .lr-scenes #ml-rooms .lr-chip{font-family:var(--f-body);font-size:14px}\n#ml-rooms .lr-list{display:grid;gap:6px}\n#ml-rooms .lr-lt{background:var(--night-2);border-radius:12px;padding:12px 14px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center}\n#ml-rooms .lr-lt .nm{font:500 15px/1.25 var(--f-display)}\n#ml-rooms .lr-lt .pr{font:400 12px/1.3 var(--f-mono);color:var(--night-muted);margin-top:3px}\n#ml-rooms .lr-lt .pr.new{color:var(--glow)}\n#ml-rooms .lr-lt input[type=range]{grid-column:1/-1;height:6px}\n#ml-rooms .lr-lt.off input[type=range]{opacity:.35}\n#ml-rooms .lr-sw{position:relative;width:44px;height:26px;border-radius:99px;border:0;background:var(--night-3);cursor:pointer;transition:background .2s;flex:none}\n#ml-rooms .lr-sw::after{content:\"\";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:var(--night-muted);transition:all .2s}\n#ml-rooms .lr-sw[aria-checked=\"true\"]{background:var(--glow)}\n#ml-rooms .lr-sw[aria-checked=\"true\"]::after{left:21px;background:#fff}\n#ml-rooms .lr-lbl{font:500 11px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--night-muted);margin-top:4px}\n#ml-rooms .lr-note{font-size:13px;color:var(--muted);margin:0;max-width:80ch}\n@media (prefers-reduced-motion:reduce){#ml-rooms .lr *{transition:none!important}}\n\n/* курсор-свет v2 */\nhtml.cur-on, html.cur-on *{cursor:none!important}\n.cur,.cur-h{position:fixed;left:0;top:0;pointer-events:none;z-index:70;transform:translate3d(-200px,-200px,0);will-change:transform}\n.cur{width:0;height:0}\n.cur::before{content:\"\";position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:#fff;\n  box-shadow:0 0 0 2px var(--glow),0 0 14px 3px var(--glow),0 0 34px 8px color-mix(in srgb,var(--glow) 45%,transparent);\n  transition:transform .25s cubic-bezier(.3,1.6,.5,1),opacity .2s}\n.cur::after{content:\"\";position:absolute;left:-23px;top:-23px;width:46px;height:46px;border-radius:50%;\n  border:1.5px solid var(--glow);background:color-mix(in srgb,var(--glow) 12%,transparent);\n  box-shadow:0 0 22px color-mix(in srgb,var(--glow) 45%,transparent),inset 0 0 12px color-mix(in srgb,var(--glow) 25%,transparent);\n  transform:scale(.2);opacity:0;transition:transform .3s cubic-bezier(.3,1.5,.5,1),opacity .2s}\n.cur.link::before{transform:scale(.45)}\n.cur.link::after{transform:scale(1);opacity:1}\n.cur.down::before{transform:scale(1.8)}\n.cur.down.link::after{transform:scale(.85)}\n.cur.off::before,.cur.off::after,.cur-h.off{opacity:0}\n.cur-h{width:0;height:0}\n.cur-h::before{content:\"\";position:absolute;left:-150px;top:-150px;width:300px;height:300px;border-radius:50%;\n  background:radial-gradient(circle,color-mix(in srgb,var(--glow) 30%,transparent),transparent 65%);opacity:.55;transition:opacity .3s}\n:root[data-theme=\"dark\"] .cur-h::before{mix-blend-mode:screen;opacity:.5}\n:root:not([data-theme=\"dark\"]) .cur-h::before{mix-blend-mode:multiply;opacity:.35}\n.cur-h.off::before{opacity:0}\n@media (pointer:coarse),(prefers-reduced-motion:reduce){.cur,.cur-h{display:none}}\n\n\n/* огонёк виден и на белом: тёмный ободок под свечением */\n.cur::before{box-shadow:0 0 0 1.5px rgba(20,20,22,.6),0 0 0 3px var(--glow),0 0 14px 3px var(--glow),0 0 34px 8px color-mix(in srgb,var(--glow) 45%,transparent)}\n.cur::after{box-shadow:0 0 0 1px rgba(20,20,22,.28),inset 0 0 0 1px rgba(20,20,22,.18),0 0 22px color-mix(in srgb,var(--glow) 45%,transparent),inset 0 0 12px color-mix(in srgb,var(--glow) 25%,transparent)}\n:root{--ml-star:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22%3E%3Cpath d=%22M30 6 C31 22 38 29 54 30 C38 31 31 38 30 54 C29 38 22 31 6 30 C22 29 29 22 30 6Z%22 fill=%22none%22 stroke=%22%23EFAC3E%22 stroke-width=%221%22/%3E%3Ccircle cx=%2230%22 cy=%222%22 r=%221.4%22 fill=%22%23EFAC3E%22/%3E%3Ccircle cx=%2230%22 cy=%2258%22 r=%221.4%22 fill=%22%23EFAC3E%22/%3E%3Ccircle cx=%222%22 cy=%2230%22 r=%221.4%22 fill=%22%23EFAC3E%22/%3E%3Ccircle cx=%2258%22 cy=%2230%22 r=%221.4%22 fill=%22%23EFAC3E%22/%3E%3C/svg%3E%0A\")}\n/* ===== время суток: палитра сайта ===== */\n:root{--ml-l:#F4F5F6;--ml-d:#2F3438;--ml-hdr:rgba(244,245,246,.86);--ml-ink:#2F3438;--ml-mut:#7D8186;--ml-line:rgba(47,52,56,.16)}\nhtml[data-tod=\"morning\"]{--ml-l:#EEF2F7;--ml-d:#2A3139;--ml-hdr:rgba(238,242,247,.86)}\nhtml[data-tod=\"evening\"]{--ml-l:#F5EDE2;--ml-d:#36322E;--ml-hdr:rgba(245,237,226,.88);--ml-line:rgba(60,45,30,.18)}\nhtml[data-tod=\"night\"]{--ml-l:#25292D;--ml-d:#1C1F23;--ml-hdr:rgba(37,41,45,.88);--ml-ink:#F3F4F5;--ml-mut:#AAACAE;--ml-line:rgba(255,255,255,.14)}\nhtml[data-tod] body{background-color:var(--ml-l)}\nhtml[data-tod] .t-rec[data-bg-color=\"#f4f4fb\"]{background-color:var(--ml-l)!important}\nhtml[data-tod] .t-rec[data-bg-color=\"#201f1f\"]{background-color:var(--ml-d)!important}\nhtml[data-tod] .t3113__firstlevel,html[data-tod] .t3113__secondlevel{background-color:var(--ml-hdr)!important}\nhtml[data-tod] .tmenu-mobile{background-color:var(--ml-l)!important}\nhtml[data-tod] #ml-rooms{--night:var(--ml-d)}\n.t-rec,.t3113__firstlevel,.t3113__secondlevel,#ml-rooms,.ml-marq-box,.ml-bw,body{transition:background-color .9s ease}\n/* обложка: тон по времени суток */\n.t-cover__filter{transition:opacity .9s}\nhtml[data-tod] .t-cover::after{content:\"\";position:absolute;inset:0;pointer-events:none;z-index:0;transition:background .9s}\nhtml[data-tod=\"morning\"] .t-cover::after{background:linear-gradient(rgba(70,110,170,.16),rgba(20,40,70,.10))}\nhtml[data-tod=\"evening\"] .t-cover::after{background:radial-gradient(120% 90% at 50% 10%,rgba(255,150,60,.20),rgba(80,35,5,.18))}\nhtml[data-tod=\"night\"] .t-cover::after{background:rgba(0,0,6,.38)}\n/* ночь: тексты и значки светлых блоков и шапки — инверсия содержимого (фон блока уже тёмный) */\nhtml[data-tod=\"night\"] .t-rec[data-bg-color=\"#f4f4fb\"] > *:not(.ml-keep),\nhtml[data-tod=\"night\"] .t3113__firstlevel > *,\nhtml[data-tod=\"night\"] .t3113__secondlevel > *,\nhtml[data-tod=\"night\"] .tmenu-mobile > *{filter:invert(.9) hue-rotate(180deg)}\nhtml[data-tod=\"night\"] .ml-tod--float{filter:invert(.9) hue-rotate(180deg)}\n\n/* переключатель в шапке */\n.ml-tod{position:relative;align-self:center;font-family:var(--ml-font);z-index:5}\n.ml-tod-btn{display:flex;align-items:center;gap:7px;height:32px;border:1px solid rgba(32,31,31,.22);background:transparent;color:#201F1F;border-radius:30px;padding:0 12px;font:600 12px/1 var(--ml-font);cursor:pointer;white-space:nowrap;margin:0}\n.ml-tod-btn i{width:8px;height:8px;border-radius:50%;background:var(--glow,#FFB46B);box-shadow:0 0 9px var(--glow,#FFB46B)}\n.ml-tod-btn small{color:#7C7B84;font:400 12px/1 var(--ml-font)}\n.ml-tod-menu{position:absolute;right:0;top:calc(100% + 8px);background:#fff;border:1px solid rgba(32,31,31,.12);border-radius:16px;padding:6px;display:grid;min-width:230px;box-shadow:0 18px 50px rgba(0,0,0,.18);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .18s,transform .18s}\n.ml-tod.open .ml-tod-menu{opacity:1;transform:none;pointer-events:auto}\n.ml-tod-menu button{display:flex;justify-content:space-between;align-items:center;gap:12px;border:0;background:transparent;color:#201F1F;padding:10px 12px;border-radius:10px;font:600 14px/1 var(--ml-font);cursor:pointer;text-align:left;margin:0}\n.ml-tod-menu button span{font:400 12px/1 var(--ml-font);color:#7C7B84}\n.ml-tod-menu button:hover,.ml-tod-menu button[aria-checked=\"true\"]{background:#F4F4FB}\n.ml-tod-menu p{margin:6px 12px 8px;font:400 12px/1.4 var(--ml-font);color:#7C7B84}\n.ml-tod--float{position:fixed;left:14px;bottom:14px;z-index:9990}\n.ml-tod--float .ml-tod-btn{background:rgba(244,244,251,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);height:38px;box-shadow:0 6px 20px rgba(0,0,0,.18)}\n.ml-tod--float .ml-tod-menu{top:auto;bottom:calc(100% + 8px);left:0;right:auto;transform:translateY(6px)}\n\n/* ===== фонарик ===== */\n.ml-fl{position:relative;background:#050607;color:#ECEDEA;overflow:hidden;touch-action:pan-y;font-family:var(--ml-font)}\n.ml-fl .fl-box{position:relative;height:min(100vh,56vw);min-height:520px}\n.ml-fl .fl-box img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;max-width:none}\n.ml-fl .fl-on{-webkit-mask-image:radial-gradient(circle var(--fr,260px) at var(--fx,50%) var(--fy,50%),#000 0,rgba(0,0,0,.85) 35%,transparent 100%);\n  mask-image:radial-gradient(circle var(--fr,260px) at var(--fx,50%) var(--fy,50%),#000 0,rgba(0,0,0,.85) 35%,transparent 100%)}\n.ml-fl.lit .fl-on{-webkit-mask-image:none;mask-image:none;transition:opacity .6s}\n.ml-fl-txt{position:absolute;left:0;right:0;bottom:0;padding:0 0 52px;pointer-events:none;background:linear-gradient(transparent,rgba(5,6,7,.8) 60%)}\n.ml-fl-wrap{max-width:1200px;margin:0 auto;padding:0 20px}\n.ml-fl-eye{font:400 12px/1 var(--ml-font);letter-spacing:.3em;text-transform:uppercase;color:#9AA0A8}\n.ml-fl h2{font:300 clamp(26px,3.8vw,52px)/1.2 var(--ml-font);text-transform:uppercase;letter-spacing:.14em;margin:14px 0 0;color:#fff;max-width:28ch}\n.ml-fl h2 b{font-weight:400;color:var(--ml-amber);text-shadow:0 0 40px color-mix(in srgb,var(--ml-amber) 45%,transparent)}\n.ml-fl p{color:#A9A8B0;margin:16px 0 0;max-width:52ch;font:400 16px/1.5 var(--ml-font)}\n.ml-fl-ui{position:absolute;right:max(16px,calc((100vw - 1200px)/2 + 20px));top:24px;display:flex;gap:8px;align-items:center}\n.ml-fl-hint{font:600 11px/1 var(--ml-font);letter-spacing:.08em;text-transform:uppercase;color:#9AA0A8;border:1px solid #2C3036;border-radius:30px;padding:9px 13px;pointer-events:none}\n.ml-fl-sw{font:600 12px/1 var(--ml-font);color:#201F1F;background:#F4F4FB;border:0;border-radius:30px;padding:9px 14px;cursor:pointer;margin:0}\n@media (max-width:640px){.ml-fl .fl-box{height:110vw;min-height:400px}.ml-fl .fl-box img{object-position:50% 50%}.ml-fl-txt{padding:40px 0 18px;background:linear-gradient(transparent,rgba(5,6,7,.7) 55%)}.ml-fl-eye,.ml-fl p,.ml-fl-hint{display:none}.ml-fl h2{font-size:19px;letter-spacing:.1em;margin:0;max-width:none}.ml-fl-ui{top:12px;right:12px}}\n\n/* ===== бегущая строка брендов ===== */\n.ml-marq-box{background:var(--ml-l);padding:26px 0 18px}\n.ml-marq{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}\n.ml-marq-t{display:flex;align-items:center;width:max-content;animation:mlmarq var(--mq,46s) linear infinite}\n.ml-marq:hover .ml-marq-t{animation-play-state:paused}\n.ml-marq a{flex:none;display:flex;align-items:center;justify-content:center;height:84px;padding:0 clamp(26px,3.4vw,52px);position:relative}\n.ml-marq img{height:46px;width:auto;max-width:150px;object-fit:contain;filter:grayscale(1);opacity:.55;transition:filter .3s,opacity .3s,transform .3s;display:block}\n.ml-marq a::before{content:\"\";position:absolute;left:50%;top:50%;width:150px;height:90px;margin:-45px 0 0 -75px;border-radius:50%;\n  background:radial-gradient(closest-side,color-mix(in srgb,var(--glow,#FFB46B) 55%,transparent),transparent);opacity:0;transition:opacity .3s;pointer-events:none}\n.ml-marq a:hover img{filter:none;opacity:1;transform:scale(1.06)}\n.ml-marq a:hover::before{opacity:1}\nhtml[data-tod=\"night\"] .ml-marq img{filter:grayscale(1) invert(1) brightness(1.1);opacity:.6}\nhtml[data-tod=\"night\"] .ml-marq a:hover img{filter:grayscale(1) invert(1) brightness(1.4);opacity:1}\n@keyframes mlmarq{to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion:reduce){.ml-marq-t{animation:none}}\n@media (max-width:640px){.ml-marq a{height:64px}.ml-marq img{height:34px;max-width:110px}}\n\n/* ===== подвал: слово, которое подсвечивает курсор ===== */\n.ml-bw{background:var(--ml-l);text-align:center;overflow:hidden;padding:10px 20px 0;line-height:0}\nhtml[data-tod=\"night\"] .t3113__popover{filter:invert(.9) hue-rotate(180deg)}\n/* телефон: логотип нового фирменного стиля (MOON / LIGHT, буквы O — полумесяцы), свет идёт по буквам */\n.ml-logo{display:block;width:min(84vw,1100px);aspect-ratio:286.46/26.95;margin:40px auto 0;--br:300px;\n  --lf:rgba(32,31,31,.28);\n  background:radial-gradient(circle var(--br,130px) at var(--bx,50%) var(--by,50%),var(--glow,#FFB46B),color-mix(in srgb,var(--glow,#FFB46B) 40%,transparent) 45%,transparent 75%) no-repeat,var(--lf);\n  -webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22348.58 355.07 286.46 26.95%22%3E%3Cg fill=%22%23fff%22%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M338.4357 289.8346C342.6491 294.048 342.6491 300.8795 338.4357 305.0926 336.473 307.0553 333.942 308.1033 331.3721 308.2374 333.1962 307.8825 334.9372 306.9986 336.3497 305.5861 340.1235 301.8124 340.1235 295.6944 336.3497 291.9206 332.5762 288.1471 326.4579 288.1471 322.6844 291.9206 321.2719 293.3331 320.3878 295.0744 320.0329 296.8982 320.167 294.3283 321.215 291.7973 323.1777 289.8346 327.3911 285.6214 334.2226 285.6214 338.4357 289.8346%22 fill-rule=%22evenodd%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M298.1358 308.6011V287.0753H296.4651V304.2961L289.0117 293.6937H288.3691L280.8836 304.2961V287.0753H279.2129V308.6011H279.8555L288.6902 296.0067 297.4932 308.6011Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M413.1955 308.2799V286.7542H412.5209L398.4812 304.7136V287.0753H396.8107V308.6011H397.453L411.5248 290.5132V308.2799Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M553.3699 306.7971H545.741V308.2844H562.6772V306.7971H555.0163V287.3917H553.3699Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M515.094 308.2844H516.7395V299.4205H529.5923V308.2844H531.2387V287.3917H529.5923V297.9326H516.7395V287.3917H515.094Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M488.6388 287.0751C486.6548 287.0751 484.8503 287.5493 483.2252 288.4995 481.6009 289.4491 480.3131 290.7471 479.3635 292.3929 478.4134 294.0398 477.9386 295.854 477.9386 297.8379 477.9386 299.8426 478.4134 301.6627 479.3635 303.2989 480.3131 304.9345 481.6057 306.2271 483.2413 307.1772 484.8766 308.1263 486.6758 308.6011 488.6388 308.6011 490.3486 308.6011 491.9309 308.2371 493.3871 307.5089 494.8432 306.7815 496.0466 305.7625 496.9962 304.4543L495.7611 303.4729C494.9382 304.613 493.92 305.4991 492.7065 306.1321 491.4927 306.7654 490.1474 307.082 488.67 307.082 486.9607 307.082 485.4254 306.6755 484.0642 305.8631 482.703 305.0507 481.6321 303.9423 480.8514 302.5392 480.0702 301.1357 479.6796 299.579 479.6796 297.8697 479.6796 296.1394 480.0702 294.5667 480.8514 293.1531 481.6321 291.7389 482.7081 290.6254 484.0801 289.813 485.4518 289.0006 487.0026 288.5941 488.7334 288.5941 490.3588 288.5941 491.836 288.9635 493.1654 289.7028 494.4951 290.4409 495.5508 291.4438 496.3309 292.71V296.1598H488.6388V297.68H497.9772V292.3617C497.0699 290.7153 495.7824 289.4227 494.115 288.4833 492.4483 287.5445 490.6227 287.0751 488.6388 287.0751%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M461.4503 308.2844H463.0958V287.3917H461.4503Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M433.8711 308.2844H435.5164V288.879H445.8053V287.3917H433.8711Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M362.6158 305.3614C358.4024 301.1479 358.4024 294.3164 362.6158 290.1033 364.5785 288.1406 367.1096 287.0926 369.6795 286.9586 367.8557 287.3134 366.1143 288.1973 364.7018 289.6101 360.9283 293.3836 360.9283 299.5016 364.7018 303.2753 368.4753 307.0488 374.5936 307.0488 378.3671 303.2753 379.7796 301.8628 380.6637 300.1215 381.0186 298.2977 380.8845 300.8676 379.8366 303.3986 377.8739 305.3614 373.6604 309.5748 366.8292 309.5748 362.6158 305.3614%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22348.58 355.07 286.46 26.95%22%3E%3Cg fill=%22%23fff%22%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M338.4357 289.8346C342.6491 294.048 342.6491 300.8795 338.4357 305.0926 336.473 307.0553 333.942 308.1033 331.3721 308.2374 333.1962 307.8825 334.9372 306.9986 336.3497 305.5861 340.1235 301.8124 340.1235 295.6944 336.3497 291.9206 332.5762 288.1471 326.4579 288.1471 322.6844 291.9206 321.2719 293.3331 320.3878 295.0744 320.0329 296.8982 320.167 294.3283 321.215 291.7973 323.1777 289.8346 327.3911 285.6214 334.2226 285.6214 338.4357 289.8346%22 fill-rule=%22evenodd%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M298.1358 308.6011V287.0753H296.4651V304.2961L289.0117 293.6937H288.3691L280.8836 304.2961V287.0753H279.2129V308.6011H279.8555L288.6902 296.0067 297.4932 308.6011Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M413.1955 308.2799V286.7542H412.5209L398.4812 304.7136V287.0753H396.8107V308.6011H397.453L411.5248 290.5132V308.2799Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M553.3699 306.7971H545.741V308.2844H562.6772V306.7971H555.0163V287.3917H553.3699Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M515.094 308.2844H516.7395V299.4205H529.5923V308.2844H531.2387V287.3917H529.5923V297.9326H516.7395V287.3917H515.094Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M488.6388 287.0751C486.6548 287.0751 484.8503 287.5493 483.2252 288.4995 481.6009 289.4491 480.3131 290.7471 479.3635 292.3929 478.4134 294.0398 477.9386 295.854 477.9386 297.8379 477.9386 299.8426 478.4134 301.6627 479.3635 303.2989 480.3131 304.9345 481.6057 306.2271 483.2413 307.1772 484.8766 308.1263 486.6758 308.6011 488.6388 308.6011 490.3486 308.6011 491.9309 308.2371 493.3871 307.5089 494.8432 306.7815 496.0466 305.7625 496.9962 304.4543L495.7611 303.4729C494.9382 304.613 493.92 305.4991 492.7065 306.1321 491.4927 306.7654 490.1474 307.082 488.67 307.082 486.9607 307.082 485.4254 306.6755 484.0642 305.8631 482.703 305.0507 481.6321 303.9423 480.8514 302.5392 480.0702 301.1357 479.6796 299.579 479.6796 297.8697 479.6796 296.1394 480.0702 294.5667 480.8514 293.1531 481.6321 291.7389 482.7081 290.6254 484.0801 289.813 485.4518 289.0006 487.0026 288.5941 488.7334 288.5941 490.3588 288.5941 491.836 288.9635 493.1654 289.7028 494.4951 290.4409 495.5508 291.4438 496.3309 292.71V296.1598H488.6388V297.68H497.9772V292.3617C497.0699 290.7153 495.7824 289.4227 494.115 288.4833 492.4483 287.5445 490.6227 287.0751 488.6388 287.0751%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M461.4503 308.2844H463.0958V287.3917H461.4503Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M433.8711 308.2844H435.5164V288.879H445.8053V287.3917H433.8711Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 d=%22M362.6158 305.3614C358.4024 301.1479 358.4024 294.3164 362.6158 290.1033 364.5785 288.1406 367.1096 287.0926 369.6795 286.9586 367.8557 287.3134 366.1143 288.1973 364.7018 289.6101 360.9283 293.3836 360.9283 299.5016 364.7018 303.2753 368.4753 307.0488 374.5936 307.0488 378.3671 303.2753 379.7796 301.8628 380.6637 300.1215 381.0186 298.2977 380.8845 300.8676 379.8366 303.3986 377.8739 305.3614 373.6604 309.5748 366.8292 309.5748 362.6158 305.3614%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\") center/contain no-repeat}\n.ml-slogan{font:300 clamp(11px,1.15vw,16px)/1 var(--ml-font);letter-spacing:.62em;text-transform:lowercase;color:var(--ml-mut);margin:28px 0 46px;padding-left:.62em;line-height:1.6}\nhtml[data-tod=\"night\"] .ml-logo{--lf:rgba(255,255,255,.22)}\n@media (max-width:640px){.ml-logo{width:min(80vw,400px);aspect-ratio:215.6/72.95;margin-top:26px;--br:130px;-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22384.01 331.26 215.60 72.95%22%3E%3Cg transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 fill=%22%23fff%22%3E%3Cpath d=%22M408.6181 302.0621C415.3037 308.7476 415.3037 319.5876 408.6181 326.2731 405.5037 329.3875 401.4876 331.0503 397.41 331.2629 400.3041 330.7 403.0668 329.2974 405.3081 327.0557 411.296 321.0681 411.296 311.36 405.3081 305.3721 399.3205 299.3845 389.6124 299.3845 383.6248 305.3721 381.3831 307.6138 379.9806 310.3764 379.4176 313.2706 379.6302 309.1929 381.293 305.1765 384.4074 302.0621 391.0929 295.3766 401.9326 295.3766 408.6181 302.0621%22 fill-rule=%22evenodd%22/%3E%3Cpath d=%22M344.6722 331.8401V297.684H342.021V325.0089L330.1943 308.1855H329.1746L317.2966 325.0089V297.684H314.6457V331.8401H315.6653L329.6843 311.8561 343.6523 331.8401Z%22/%3E%3Cpath d=%22M527.2441 331.3304V297.1743H526.1734L503.8957 325.6716V297.684H501.245V331.8401H502.2643L524.5931 303.1387V331.3304Z%22/%3E%3Cpath d=%22M314.6457 281.4814H316.046V264.9708H324.7997V263.7051H314.6457ZM363.3375 281.4814H364.7378V263.7051H363.3375ZM413.1337 263.4358C411.446 263.4358 409.9105 263.8395 408.528 264.6476 407.1458 265.4555 406.05 266.5602 405.2424 267.9605 404.4339 269.3614 404.03 270.9054 404.03 272.5934 404.03 274.299 404.4339 275.8476 405.2424 277.2397 406.05 278.6309 407.1501 279.7308 408.5416 280.5389 409.9331 281.3468 411.4638 281.7507 413.1337 281.7507 414.5885 281.7507 415.9349 281.4409 417.174 280.8215 418.4127 280.2025 419.4366 279.3356 420.2444 278.2225L419.1936 277.3877C418.4935 278.3574 417.6272 279.1114 416.5948 279.65 415.5622 280.1889 414.4175 280.4581 413.1604 280.4581 411.7059 280.4581 410.4 280.1126 409.2418 279.4212 408.0838 278.7301 407.1725 277.7871 406.508 276.5931 405.8436 275.3989 405.5114 274.0745 405.5114 272.6201 405.5114 271.1477 405.8436 269.8101 406.508 268.6071 407.1725 267.404 408.0881 266.4567 409.2554 265.7656 410.4224 265.074 411.7419 264.7284 413.2142 264.7284 414.5975 264.7284 415.8539 265.0425 416.9852 265.6712 418.1165 266.2997 419.0148 267.1529 419.6786 268.23V271.1656H413.1337V272.4585H421.0792V267.9335C420.3071 266.5329 419.2118 265.4331 417.7933 264.634 416.3749 263.8352 414.8218 263.4358 413.1337 263.4358ZM460.5602 281.4814H461.9605V273.9399H472.896V281.4814H474.2966V263.7051H472.896V272.6739H461.9605V263.7051H460.5602ZM519.3252 280.2161H512.8345V281.4814H527.2441V280.2161H520.7261V263.7051H519.3252Z%22/%3E%3Cpath d=%22M446.9862 326.6994C440.3007 320.0139 440.3007 309.174 446.9862 302.4884 450.1006 299.374 454.1168 297.7112 458.1944 297.4986 455.3005 298.0616 452.5376 299.4642 450.2962 301.7058 444.3083 307.6934 444.3083 317.4015 450.2962 323.3894 456.2838 329.377 465.9919 329.377 471.9798 323.3894 474.2212 321.1478 475.6238 318.3851 476.187 315.491 475.9741 319.5686 474.3113 323.585 471.1969 326.6994 464.5114 333.3849 453.6717 333.3849 446.9862 326.6994%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22384.01 331.26 215.60 72.95%22%3E%3Cg transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 fill=%22%23fff%22%3E%3Cpath d=%22M408.6181 302.0621C415.3037 308.7476 415.3037 319.5876 408.6181 326.2731 405.5037 329.3875 401.4876 331.0503 397.41 331.2629 400.3041 330.7 403.0668 329.2974 405.3081 327.0557 411.296 321.0681 411.296 311.36 405.3081 305.3721 399.3205 299.3845 389.6124 299.3845 383.6248 305.3721 381.3831 307.6138 379.9806 310.3764 379.4176 313.2706 379.6302 309.1929 381.293 305.1765 384.4074 302.0621 391.0929 295.3766 401.9326 295.3766 408.6181 302.0621%22 fill-rule=%22evenodd%22/%3E%3Cpath d=%22M344.6722 331.8401V297.684H342.021V325.0089L330.1943 308.1855H329.1746L317.2966 325.0089V297.684H314.6457V331.8401H315.6653L329.6843 311.8561 343.6523 331.8401Z%22/%3E%3Cpath d=%22M527.2441 331.3304V297.1743H526.1734L503.8957 325.6716V297.684H501.245V331.8401H502.2643L524.5931 303.1387V331.3304Z%22/%3E%3Cpath d=%22M314.6457 281.4814H316.046V264.9708H324.7997V263.7051H314.6457ZM363.3375 281.4814H364.7378V263.7051H363.3375ZM413.1337 263.4358C411.446 263.4358 409.9105 263.8395 408.528 264.6476 407.1458 265.4555 406.05 266.5602 405.2424 267.9605 404.4339 269.3614 404.03 270.9054 404.03 272.5934 404.03 274.299 404.4339 275.8476 405.2424 277.2397 406.05 278.6309 407.1501 279.7308 408.5416 280.5389 409.9331 281.3468 411.4638 281.7507 413.1337 281.7507 414.5885 281.7507 415.9349 281.4409 417.174 280.8215 418.4127 280.2025 419.4366 279.3356 420.2444 278.2225L419.1936 277.3877C418.4935 278.3574 417.6272 279.1114 416.5948 279.65 415.5622 280.1889 414.4175 280.4581 413.1604 280.4581 411.7059 280.4581 410.4 280.1126 409.2418 279.4212 408.0838 278.7301 407.1725 277.7871 406.508 276.5931 405.8436 275.3989 405.5114 274.0745 405.5114 272.6201 405.5114 271.1477 405.8436 269.8101 406.508 268.6071 407.1725 267.404 408.0881 266.4567 409.2554 265.7656 410.4224 265.074 411.7419 264.7284 413.2142 264.7284 414.5975 264.7284 415.8539 265.0425 416.9852 265.6712 418.1165 266.2997 419.0148 267.1529 419.6786 268.23V271.1656H413.1337V272.4585H421.0792V267.9335C420.3071 266.5329 419.2118 265.4331 417.7933 264.634 416.3749 263.8352 414.8218 263.4358 413.1337 263.4358ZM460.5602 281.4814H461.9605V273.9399H472.896V281.4814H474.2966V263.7051H472.896V272.6739H461.9605V263.7051H460.5602ZM519.3252 280.2161H512.8345V281.4814H527.2441V280.2161H520.7261V263.7051H519.3252Z%22/%3E%3Cpath d=%22M446.9862 326.6994C440.3007 320.0139 440.3007 309.174 446.9862 302.4884 450.1006 299.374 454.1168 297.7112 458.1944 297.4986 455.3005 298.0616 452.5376 299.4642 450.2962 301.7058 444.3083 307.6934 444.3083 317.4015 450.2962 323.3894 456.2838 329.377 465.9919 329.377 471.9798 323.3894 474.2212 321.1478 475.6238 318.3851 476.187 315.491 475.9741 319.5686 474.3113 323.585 471.1969 326.6994 464.5114 333.3849 453.6717 333.3849 446.9862 326.6994%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\")}.ml-slogan{font-size:10px;letter-spacing:.42em;margin:18px 0 36px}.ml-bw{padding-top:4px}}\n\n/* ===== 3D-модели: ровная сетка вместо кнопок T1331 ===== */\n.ml-3d{max-width:1200px;margin:0 auto;padding:6px 20px 26px;font-family:var(--ml-font)}\n.ml-3d-hd{text-align:center;font:400 12px/1 var(--ml-font);letter-spacing:.3em;text-transform:uppercase;color:var(--ml-mut);margin:0 0 18px}\n.ml-3d-grid{display:grid;grid-template-columns:repeat(var(--n,6),minmax(0,1fr));gap:12px}\n.ml-3d-c{display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-height:96px;padding:16px 18px;border-radius:16px;border:1px solid var(--ml-line);background:color-mix(in srgb,var(--ml-l) 60%,#fff);color:var(--ml-ink)!important;text-decoration:none!important;position:relative;overflow:hidden;transition:border-color .25s,transform .25s,box-shadow .25s}\nhtml[data-tod=\"night\"] .ml-3d-c{background:color-mix(in srgb,var(--ml-l) 85%,#fff)}\n.ml-3d-c b{font:600 17px/1.15 var(--ml-font);letter-spacing:.02em}\n.ml-3d-c span{display:flex;justify-content:space-between;align-items:center;font:400 12px/1 var(--ml-font);letter-spacing:.08em;text-transform:uppercase;color:var(--ml-mut)}\n.ml-3d-c i{font-style:normal;font-size:16px;color:var(--ml-amber);transition:transform .25s}\n.ml-3d-c::before{content:\"\";position:absolute;right:-30px;top:-30px;width:110px;height:110px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--ml-amber) 35%,transparent),transparent);opacity:0;transition:opacity .3s;pointer-events:none}\n.ml-3d-c:hover{border-color:var(--ml-amber);transform:translateY(-2px);box-shadow:0 10px 30px -14px rgba(47,52,56,.35)}\n.ml-3d-c:hover::before{opacity:1}\n.ml-3d-c:hover i{transform:translate(2px,-2px)}\nhtml[data-tod=\"night\"] .t-rec[data-bg-color=\"#f4f4fb\"] > .ml-3d{filter:none}\n@media (max-width:980px){.ml-3d-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}\n@media (max-width:640px){.ml-3d{padding:4px 12px 20px}.ml-3d-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ml-3d-c{min-height:78px;padding:13px 14px;border-radius:14px}.ml-3d-c b{font-size:15px}.ml-3d-c span{font-size:10px}}\n\n/* ===== фирменный стиль для блоков самой Тильды (брендбук: графит, янтарь, Avenir Next) ===== */\nhtml:not(.ml-nobrand) :is(.t-title,.t-descr,.t-text,.t-name,.t-uptitle,.t-heading,.t-menu__link-item,.t-menusub__link-item,.t-btn,.t-submit,.t-input,.t-input-title,.t-store,.t706,.t985,.t-popup,.t-catalog,.t-store__card,.js-store-prod-name,.js-product-price,.t-store__filter,.t-form){font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) body{color:var(--ml-ink)}\n/* заголовки секций: тонкие, капслок, разрядка */\nhtml:not(.ml-nobrand) .t-section__title{font-weight:300!important;text-transform:uppercase;letter-spacing:.16em;font-size:clamp(22px,2.9vw,36px)!important;line-height:1.25!important}\nhtml:not(.ml-nobrand) .t-section__title::before{content:\"\";display:block;width:30px;height:30px;margin:0 auto 18px;background:var(--ml-star) center/contain no-repeat}\nhtml:not(.ml-nobrand) .t-section__descr{font-weight:300!important;letter-spacing:.14em;text-transform:uppercase;font-size:clamp(16px,1.8vw,22px)!important;line-height:1.5!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#f4f4fb\"] .t-section__title,html:not(.ml-nobrand) .t-rec[data-bg-color=\"#f4f4fb\"] .t-section__descr{color:var(--ml-d)!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] .t-section__title,html:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] .t-section__descr{color:#F3F4F5!important}\n/* обложка */\nhtml:not(.ml-nobrand) .t183__title{font-weight:300!important;text-transform:uppercase;letter-spacing:.14em;font-size:clamp(26px,4.6vw,64px)!important;line-height:1.18!important;color:#fff!important;font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) .t183__title span{color:inherit!important;font-family:inherit!important}\nhtml:not(.ml-nobrand) .t183__title br+br{display:none}\nhtml:not(.ml-nobrand) .t183__title span+br+br+span,html:not(.ml-nobrand) .t183__title br+span:last-child{color:var(--ml-amber)!important;text-shadow:0 0 50px color-mix(in srgb,var(--ml-amber) 45%,transparent)}\n.ml-hero-eye{display:block;font:300 13px/1 var(--ml-font);letter-spacing:.62em;padding-left:.62em;text-transform:lowercase;color:rgba(255,255,255,.72);margin:0 0 26px;text-align:center}\n.ml-hero-eye::before{content:\"\";display:block;width:30px;height:30px;margin:0 auto 20px;background:var(--ml-star) center/contain no-repeat}\n@media (max-width:640px){.ml-hero-eye{font-size:10px;letter-spacing:.42em;margin-bottom:16px}.ml-hero-eye::before{width:22px;height:22px;margin-bottom:14px}}\n/* шапка: меню */\nhtml:not(.ml-nobrand) .t3113 .t-menu__link-item{font-size:13px!important;font-weight:400!important;letter-spacing:.12em;text-transform:uppercase;color:var(--ml-d)!important;transition:color .2s}\nhtml:not(.ml-nobrand) .t3113 .t-menu__link-item:hover{color:var(--ml-amber)!important}\nhtml:not(.ml-nobrand) .t3113 .t-menusub__link-item{font-size:15px!important;color:var(--ml-d)!important}\nhtml:not(.ml-nobrand) .t3113 .t-menusub__link-item:hover{color:var(--ml-amber)!important}\nhtml:not(.ml-nobrand) .t3113 svg [stroke=\"#333333\"]{stroke:var(--ml-d)}\nhtml:not(.ml-nobrand) .t3113 svg [fill=\"#333333\"]{fill:var(--ml-d)}\n/* кнопки: пилюля; графит на светлом, светлая на тёмном; свечение янтарём */\nhtml:not(.ml-nobrand) :is(.t-btn,.t-submit,.t-store__card__btn,.t706__sidebar-continue,.t-store .t-btn){border-radius:30px!important;font-weight:600!important;letter-spacing:.06em;transition:transform .15s,box-shadow .25s,background-color .25s,color .25s!important}\nhtml:not(.ml-nobrand) :is(.t-submit,.t3113 .t-btn,.t-store__card__btn,.t706 .t-submit){background-color:var(--ml-d)!important;color:#F3F4F5!important;border:0!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] :is(.t-btn,.t-store__card__btn){background-color:#F3F4F5!important;color:var(--ml-d)!important;border:0!important}\nhtml:not(.ml-nobrand) :is(.t-btn,.t-submit,.t-store__card__btn):hover{transform:translateY(-1px);box-shadow:0 0 0 1px var(--ml-amber),0 0 26px color-mix(in srgb,var(--ml-amber) 45%,transparent)}\nhtml:not(.ml-nobrand) .t-submit{height:48px!important;padding:0 32px!important}\nhtml:not(.ml-nobrand) .t-btnflex__icon{display:none!important}\n/* формы */\nhtml:not(.ml-nobrand) .t-input{font-size:16px!important;color:var(--ml-ink)!important;border-color:var(--ml-line)!important;background:transparent!important;transition:border-color .2s}\nhtml:not(.ml-nobrand) .t-input:focus{border-color:var(--ml-amber)!important;outline:0}\nhtml:not(.ml-nobrand) .t-input::placeholder{color:var(--ml-mut)!important;opacity:1}\nhtml:not(.ml-nobrand) .t-input-title{font-size:12px!important;letter-spacing:.14em;text-transform:uppercase;color:var(--ml-mut)!important}\nhtml:not(.ml-nobrand) .t718__contacts{font-size:15px!important;line-height:1.7!important;color:var(--ml-ink)!important}\n/* каталог */\nhtml:not(.ml-nobrand) .js-store-prod-name{font-weight:600!important;letter-spacing:.01em}\nhtml:not(.ml-nobrand) .t-store__card__price,html:not(.ml-nobrand) .js-product-price{font-weight:300!important;letter-spacing:.02em}\nhtml:not(.ml-nobrand) .t-store__card__imgwrapper,html:not(.ml-nobrand) .t-store__card__bgimg{border-radius:16px;overflow:hidden}\nhtml:not(.ml-nobrand) .t-store__card:hover .js-store-prod-name{color:var(--ml-amber)!important}\n/* галерея работ */\nhtml:not(.ml-nobrand) .t603__blockimg{transition:transform .5s,filter .5s;filter:saturate(.92)}\nhtml:not(.ml-nobrand) .t603__tile:hover .t603__blockimg{transform:scale(1.03);filter:none}\nhtml:not(.ml-nobrand) .t603__tile{overflow:hidden}\n/* кнопка «наверх» */\nhtml:not(.ml-nobrand) .t890__arrow{background-color:var(--ml-d)!important;border:1px solid color-mix(in srgb,var(--ml-amber) 60%,transparent)!important;box-shadow:0 0 18px -4px color-mix(in srgb,var(--ml-amber) 55%,transparent)}\n/* корзина, поиск, попапы */\nhtml:not(.ml-nobrand) .t706__carticon-counter{background-color:var(--ml-amber)!important;color:var(--ml-d)!important}\nhtml:not(.ml-nobrand) .t706__product-title,html:not(.ml-nobrand) .t706__cartwin-heading{font-weight:600!important}\n/* контакты: убрать ручной Arial/20px, единый ритм */\nhtml:not(.ml-nobrand) :is(.t718__contacts,.t718__address) :is(div,span){font-family:inherit!important;font-size:inherit!important;color:inherit!important}\nhtml:not(.ml-nobrand) .t718__contacts{font-size:15px!important;font-weight:400!important;line-height:1.7!important}\nhtml:not(.ml-nobrand) :is(.t718__contacts,.t718__address)::first-line{font-weight:600}\nhtml:not(.ml-nobrand) .t718__address{font-size:15px!important;font-weight:400!important;opacity:1!important;margin-top:22px!important;line-height:1.7!important;color:var(--ml-ink)!important;font-family:var(--ml-font)!important}\n/* ссылка «Смотреть работы» (галерея): янтарная пилюля */\nhtml:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 26px;margin-top:6px;border:1px solid var(--ml-amber)!important;border-radius:30px;color:var(--ml-amber)!important;font-size:13px!important;letter-spacing:.16em;transition:background-color .25s,color .25s,box-shadow .25s}\nhtml:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]::after{content:\"→\"}\nhtml:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]:hover{background:var(--ml-amber);color:var(--ml-d)!important;box-shadow:0 0 30px color-mix(in srgb,var(--ml-amber) 50%,transparent)}\nhtml:not(.ml-nobrand) .t-section__descr span{color:inherit!important}\n/* ночь: содержимое светлых блоков и шапки инвертируется фильтром — внутри держим дневные цвета */\nhtml[data-tod=\"night\"] :is(.t-rec[data-bg-color=\"#f4f4fb\"] > :not(.ml-keep):not(.ml-3d),.t3113__firstlevel,.t3113__secondlevel,.tmenu-mobile,.t3113__popover){--ml-ink:#2F3438;--ml-mut:#7D8186;--ml-line:rgba(47,52,56,.16);--ml-d:#2F3438}\n@media (max-width:640px){html:not(.ml-nobrand) .t-section__title{font-size:22px!important;letter-spacing:.12em}html:not(.ml-nobrand) .t-section__descr,html:not(.ml-nobrand) .t-section__descr :is(p,span){font-size:17px!important;letter-spacing:.1em}html:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]{font-size:12px!important;height:40px}}\n/* каталог (новый блок t-catalog) */\nhtml:not(.ml-nobrand) .t-catalog__card{border-radius:18px!important;border:1px solid rgba(47,52,56,.10)!important;background:#fff!important;overflow:hidden;transition:transform .25s,box-shadow .25s,border-color .25s}\nhtml:not(.ml-nobrand) .t-catalog__card:hover{transform:translateY(-3px);border-color:var(--ml-amber)!important;box-shadow:0 18px 40px -18px rgba(0,0,0,.45),0 0 30px -10px color-mix(in srgb,var(--ml-amber) 50%,transparent)}\nhtml:not(.ml-nobrand) .t-catalog__card__title{font-size:15px!important;font-weight:600!important;line-height:1.35!important;color:var(--ml-d)!important;font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) .t-catalog__card:hover .t-catalog__card__title{color:#B87A12!important}\nhtml:not(.ml-nobrand) :is(.t-catalog__card__price,.t-catalog__card__price-value,.t-catalog__card__price-currency){font-family:var(--ml-font)!important;font-weight:400!important;color:var(--ml-d)!important;letter-spacing:.02em}\nhtml:not(.ml-nobrand) .t-catalog__card__price_old *{color:var(--ml-mut)!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] .t-catalog__card .t-btn{background-color:var(--ml-d)!important;color:#F3F4F5!important}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base,html:not(.ml-nobrand) .t-catalog__parts-above-item{font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base{border-radius:18px!important;border-color:rgba(255,255,255,.14)!important;transition:border-color .25s,box-shadow .25s}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base:hover,html:not(.ml-nobrand) .t-catalog__parts-button-base[class*=\"active\"]{border-color:var(--ml-amber)!important;box-shadow:0 0 24px -8px color-mix(in srgb,var(--ml-amber) 60%,transparent)}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base *{font-family:var(--ml-font)!important;letter-spacing:.04em}\n"; document.head.appendChild(st);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a,b,t) => a + (b-a)*t;
function k2rgb(K){const t=K/100;let r,g,b;
  r=t<=66?255:329.698727446*Math.pow(t-60,-0.1332047592);
  g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-0.0755148492);
  b=t>=66?255:(t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307);
  const c=v=>Math.max(0,Math.min(255,Math.round(v)));return `rgb(${c(r)},${c(g)},${c(b)})`}


function rooms(){
  const host = document.getElementById('ml-rooms'); if (!host) return;
  host.innerHTML = "<div class=\"ml-wrap\">\n  <div class=\"ml-hd\"><h2>Включите свет в комнате</h2>\n  <p>Ваши комнаты со светильниками из нашего каталога. Включайте каждый светильник, меняйте яркость и цвет света от тёплого 2700 K до холодного 6500 K.</p></div>\n  <div class=\"lr\" id=\"lr\" aria-label=\"Живая комната: интерактивный свет\">\n    <div class=\"lr-view\">\n      <div class=\"lr-frame\" id=\"lrFrame\">\n        <canvas id=\"lrCv\" aria-label=\"Комната с выбранным светом\"></canvas>\n        <div class=\"lr-loading\" id=\"lrLoading\">Загружаю комнату…</div>\n        <div class=\"lr-tag\" id=\"lrTag\"><b>Вечер</b> · 2700 K</div>\n      </div>\n      <div class=\"lr-k\">\n        <div class=\"lr-krow\"><div class=\"lr-kval\" id=\"kval\">2700 K<small>тёплый</small></div><div class=\"lr-chips\" id=\"lrK\"></div></div>\n        <input id=\"mlK\" class=\"kt\" type=\"range\" min=\"2700\" max=\"6500\" step=\"50\" value=\"2700\" aria-label=\"Цветовая температура, К\">\n        <div class=\"lr-scale\"><span>2700 K</span><span>4000 K</span><span>6500 K</span></div>\n      </div>\n    </div>\n    <div class=\"lr-panel\">\n      <div class=\"lr-rooms\" id=\"lrRooms\" role=\"tablist\" aria-label=\"Комната\"></div>\n      <div class=\"lr-seg\" role=\"radiogroup\" aria-label=\"Время суток\">\n        <button type=\"button\" id=\"lrNight\" role=\"radio\" class=\"on\" aria-checked=\"true\">Вечер</button>\n        <button type=\"button\" id=\"lrDay\" role=\"radio\" aria-checked=\"false\">День</button>\n      </div>\n      <div class=\"lr-lbl\">Сценарии</div>\n      <div class=\"lr-chips lr-scenes\" id=\"lrScenes\"></div>\n      <div class=\"lr-lbl\">Светильники</div>\n      <div class=\"lr-list\" id=\"lrList\"></div>\n    </div>\n  </div>\n  <p class=\"lr-note\" id=\"lrNote\"></p>\n  <div class=\"ml-cta\"><a class=\"ml-btn\" href=\"https://wa.me/996998899675?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9F%D0%BE%D0%BC%D0%BE%D0%B3%D0%B8%D1%82%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%81%D0%B2%D0%B5%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BD%D0%B0%D1%82%D1%8B\" target=\"_blank\" rel=\"noopener\">Подобрать свет для моей комнаты</a></div>\n</div>";
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
    note:'Люстра Ambrella LH55114, настольные лампы EGLO Viserbella, LED-подсветка изголовья и «парящий» потолок с лентой Geniled. Всё есть в каталоге.',
    lights:[
      {id:'pend',  name:'Люстра Ambrella LH55114',   prod:'Латунь, янтарное стекло, 6×E14 · 26 600 сом', hs:[[.5,.30]]},
      {id:'table', name:'Лампы EGLO Viserbella, пара', prod:'Золотой абажур · 6 200 сом', hs:[[.3357,.66],[.6643,.66]]},
      {id:'cove',  name:'Подсветка изголовья',       prod:'LED-лента, мягкий отражённый свет', hs:[[.5,.555]]},
      {id:'float', name:'Парящий потолок',           prod:'Профиль для ГКЛ 0,9 с лентой (парящий) 3000 мм + лента Geniled 03464', hs:[[.2724,.2364],[.8521,.1863]]},
    ],
    scenes:[
      {name:'Вечер',      k:2700, v:{table:.7, cove:.8, pend:.3, float:.5}},
      {name:'Перед сном', k:2700, v:{table:.35, cove:.4}},
      {name:'Чтение',     k:3000, v:{table:1, cove:.3}},
      {name:'Утро',       k:4000, v:{pend:1, cove:.5, float:.6}},
      {name:'Уборка',     k:5000, v:{pend:1, table:1, cove:1, float:1}},
    ],
    gain:{day:1.5, float:.45},
  },
  bath: {
    title:'Ванная', dir:BASE+'bath/',
    note:'Встраиваемые софиты Ambrella IP44, светильник EGLO Peguera над зеркалом и «парящий» потолок: профиль для ГКЛ с влагозащищённой лентой Geniled. Всё есть в каталоге.',
    lights:[
      {id:'down',   name:'Софиты Ambrella TN6630 ×4', prod:'IP44, GX53 · 630 сом', hs:[[.2822,.0279],[.6949,.0279],[.3457,.1753],[.638,.1753]]},
      {id:'mirror', name:'Над зеркалом EGLO Peguera', prod:'Латунь и чёрный, 80 см · 9 300 сом', hs:[[.5414,.3576]]},
      {id:'cove',   name:'Парящий потолок',           prod:'Профиль для ГКЛ 0,9 с лентой (парящий) 3000 мм + лента Geniled 03592 IP65 · 2 950 сом / 5 м', hs:[[.3227,.2132],[.8039,.1423]]},
    ],
    scenes:[
      {name:'Утро',    k:4000, v:{down:1, mirror:1, cove:.5}},
      {name:'У зеркала', k:4000, v:{mirror:1, down:.3}},
      {name:'Ванна',   k:2700, v:{cove:.6, mirror:.15}},
      {name:'Ночник',  k:2700, v:{cove:.2}},
      {name:'Уборка',  k:5000, v:{down:1, mirror:1, cove:1}},
    ],
    gain:{day:1.2, cove:.45, down:1.6, mirror:1.4},
  },
  office: {
    title:'Кабинет', dir:BASE+'office/',
    note:'Настольная лампа EGLO Narices, магнитная система LUMINAIR и LED-подсветка полок стеллажа. Всё есть в каталоге.',
    lights:[
      {id:'table',  name:'Лампа EGLO Narices',      prod:'Латунный конус, E27 · 8 500 сом', hs:[[.5988,.64]]},
      {id:'linear', name:'Линейные модули ×2', prod:'LUMINAIR 24 Вт · 2 200 сом', hs:[[.3869,.0689],[.6131,.0689]]},
      {id:'spots',  name:'Трековые споты ×3',       prod:'LUMINAIR 15 Вт · 1 800 сом', hs:[[.2644,.1404],[.5226,.1269],[.7182,.1406]]},
      {id:'shelf',  name:'Подсветка стеллажа',      prod:'LED-лента в профиле под полками', hs:[[.4567,.2962],[.6833,.5256]]},
    ],
    scenes:[
      {name:'Работа',  k:4000, v:{linear:1, table:.8, shelf:.4}},
      {name:'Созвон',  k:4000, v:{linear:.8, spots:.6, shelf:.6}},
      {name:'Чтение',  k:3000, v:{table:1, shelf:.5}},
      {name:'Вечер',   k:2700, v:{shelf:.8, spots:.5, table:.4}},
      {name:'Уборка',  k:5000, v:{table:1, linear:1, spots:1, shelf:1}},
    ],
    gain:{day:1.5, table:7, spots:3, shelf:.7},
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
  const A=0.55; r=r*(1-A)+A; g=g*(1-A)+A; b=b*(1-A)+A;   // частичная адаптация глаза (было 0.40)
  const L=0.2126*r+0.7152*g+0.0722*b;
  // светоотдача реальных LED: тёплые дают меньше лм/Вт (2700K ≈ −10% к 4000K)
  const eff = T>=4000 ? 1 : 1 - 0.10*Math.min(1,(4000-T)/1300);
  return [r/L*eff,g/L*eff,b/L*eff];
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
function extras(){
  const D = document, root = D.documentElement;
  const store = {get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }};
  const rec = t => D.querySelector('.t-rec[data-record-type="' + t + '"]');
  const coarse = matchMedia('(pointer:coarse)').matches;

  // ---------- фирменный стиль блоков Тильды (CSS в extras.css); отключить: data-brand="off"
  if (SCRIPT && SCRIPT.dataset.brand === 'off') root.classList.add('ml-nobrand');
  else { const ht = D.querySelector('.t183__title');
    if (ht && !D.querySelector('.ml-hero-eye')){ const e = D.createElement('div'); e.className = 'ml-hero-eye'; e.textContent = 'здесь есть свет.'; ht.before(e); } }

  // ---------- время суток: сайт подстраивается под час посетителя
  const TOD = {
    morning:{name:'Утро',  hint:'свежий, прохладный'},
    day:    {name:'День',  hint:'обычные цвета'},
    evening:{name:'Вечер', hint:'тёплый, 2700 K', plan:{scene:'evening'}},
    night:  {name:'Ночь',  hint:'тёмная тема',    plan:{scene:'night'}},
  };
  const autoMode = h => h>=6&&h<11 ? 'morning' : h>=11&&h<17 ? 'day' : h>=17&&h<22 ? 'evening' : 'night';
  let pick = store.get('ml-tod') || 'auto';
  if (pick !== 'auto' && !TOD[pick]) pick = 'auto';
  const tod = D.createElement('div'); tod.className = 'ml-tod';
  tod.innerHTML = '<button type="button" class="ml-tod-btn" aria-haspopup="menu" aria-expanded="false"></button><div class="ml-tod-menu" role="menu" aria-label="Время суток"></div>';
  const btn = tod.firstChild, menu = tod.lastChild;
  menu.innerHTML = '<p>Сайт освещён по вашему времени. Можно выбрать вручную.</p>' +
    [['auto','Авто','по часам'], ...Object.entries(TOD).map(([k,v]) => [k, v.name, v.hint])]
    .map(([m,n,h]) => `<button type="button" role="menuitemradio" data-m="${m}">${n}<span>${h}</span></button>`).join('');
  let last = null;
  function apply(){
    const now = new Date(), mode = pick === 'auto' ? autoMode(now.getHours()) : pick;
    root.dataset.tod = mode;
    const hm = now.toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'});
    btn.innerHTML = `<i></i>${TOD[mode].name}<small>${pick === 'auto' ? '· ' + hm : '· вручную'}</small>`;
    btn.setAttribute('aria-label', `Время суток на сайте: ${TOD[mode].name}. Изменить`);
    menu.querySelectorAll('button').forEach(b => b.setAttribute('aria-checked', b.dataset.m === pick));
    if (mode !== last && window.lrPlan){ window.lrPlan(TOD[mode].plan || {scene:'evening'}); }
    last = mode;
  }
  btn.onclick = e => { e.stopPropagation(); tod.classList.toggle('open'); btn.setAttribute('aria-expanded', tod.classList.contains('open')); };
  menu.onclick = e => { const b = e.target.closest('button'); if (!b) return; pick = b.dataset.m; store.set('ml-tod', pick); last = null; apply(); tod.classList.remove('open'); };
  D.addEventListener('click', e => { if (!tod.contains(e.target)) tod.classList.remove('open'); });
  D.addEventListener('keydown', e => { if (e.key === 'Escape') tod.classList.remove('open'); });
  function place(){
    const w = D.querySelector('.t3113__firstlevel__rightwrapper');
    const inHdr = w && innerWidth > 980 && w.getBoundingClientRect().width > 0;
    if (inHdr){ if (tod.parentNode !== w) w.prepend(tod); tod.classList.remove('ml-tod--float'); }
    else { if (tod.parentNode !== D.body) D.body.appendChild(tod); tod.classList.add('ml-tod--float'); }
  }
  apply(); place();
  addEventListener('resize', place); setTimeout(place, 1500);
  setInterval(() => { if (pick === 'auto') apply(); }, 60000);

  // ---------- фонарик: курсор — луч света в тёмной спальне
  let flHost = D.getElementById('ml-flash');
  if (!flHost){
    const before = rec('603') || rec('718');
    if (before){ flHost = D.createElement('div'); flHost.id = 'ml-flash'; before.parentNode.insertBefore(flHost, before); }
  }
  if (flHost){
    flHost.innerHTML = `<section class="ml-fl" aria-label="Спальня: без света и со светом"><div class="fl-box">
      <img src="${BASE}fl/off.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async">
      <img class="fl-on" src="${BASE}fl/on.jpg" alt="Спальня с включённым светом: люстра Ambrella LH55114, лампы EGLO Viserbella, подсветка изголовья и парящий потолок" loading="lazy" decoding="async">
      <div class="ml-fl-ui"><span class="ml-fl-hint">${coarse ? 'Ведите пальцем — это луч' : 'Ведите курсором — это луч'}</span><button type="button" class="ml-fl-sw" aria-pressed="false">Включить свет</button></div>
      <div class="ml-fl-txt"><div class="ml-fl-wrap"><div class="ml-fl-eye">Спальня · 2700 K</div>
        <h2>Без света комната <b>просто темнота</b></h2>
        <p>Одна и та же спальня: в темноте и с люстрой Ambrella LH55114, лампами EGLO Viserbella, подсветкой изголовья и парящим потолком. Подберём такой же свет для вашей.</p></div></div>
    </div></section>`;
    const sec = flHost.firstChild, fl = sec.querySelector('.fl-box'), on = fl.querySelector('.fl-on'), sw = fl.querySelector('.ml-fl-sw');
    let tx = .5, ty = .45, cx = .5, cy = .45, idle = 0, user = false, vis = false;
    const set = e => { if (e.target.closest('.ml-fl-ui')) return; const b = fl.getBoundingClientRect(); tx = (e.clientX - b.left)/b.width; ty = (e.clientY - b.top)/b.height; user = true; idle = performance.now(); };
    fl.addEventListener('pointermove', set, {passive:true});
    fl.addEventListener('pointerdown', set, {passive:true});
    sw.onclick = () => { const lit = sec.classList.toggle('lit'); sw.setAttribute('aria-pressed', lit); sw.textContent = lit ? 'Выключить' : 'Включить свет'; };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) requestAnimationFrame(loop); }).observe(fl);
    function loop(t){
      if (!vis) return;
      if (!user || t - idle > 2600){ user = false; const s = t/1000; tx = .5 + .28*Math.sin(s*.55); ty = .42 + .16*Math.sin(s*.9 + 1); }
      cx = lerp(cx, tx, RM ? 1 : .09); cy = lerp(cy, ty, RM ? 1 : .09);
      const b = fl.getBoundingClientRect();
      on.style.setProperty('--fx', (cx*100) + '%'); on.style.setProperty('--fy', (cy*100) + '%');
      on.style.setProperty('--fr', Math.round(Math.max(150, Math.min(b.width, b.height*1.8)*.2)) + 'px');
      requestAnimationFrame(loop);
    }
  }

  // ---------- бегущая строка брендов: из логотипов слайдера Тильды (T738)
  const lg = rec('738');
  if (lg && !D.querySelector('.ml-marq-box')){
    const items = [...lg.querySelectorAll('.t738__item')].map(it => {
      const a = it.querySelector('a'), i = it.querySelector('img');
      const src = i && (i.getAttribute('data-original') || i.src);
      return src && !/empty\//.test(src) ? {href: a ? a.href : '', src, alt: (i.alt || '').trim()} : null;
    }).filter(Boolean);
    if (items.length >= 3){
      const one = (x, dup) => {
        const tag = x.href ? `a href="${x.href}" target="_blank" rel="noopener"` : 'a';
        return `<${tag}${dup ? ' tabindex="-1"' : ''}><img src="${x.src}" alt="${dup ? '' : (x.alt || 'Бренд')}" loading="lazy" decoding="async"></a>`;
      };
      const box = D.createElement('div'); box.className = 'ml-marq-box';
      box.innerHTML = `<div class="ml-marq" aria-label="Бренды в каталоге"><div class="ml-marq-t">${items.map(x => one(x)).join('')}<span aria-hidden="true" style="display:contents">${items.map(x => one(x, 1)).join('')}</span></div></div>`;
      box.querySelector('.ml-marq-t').style.setProperty('--mq', Math.max(30, items.length * 3.2) + 's');
      lg.parentNode.insertBefore(box, lg); lg.style.display = 'none';
    }
  }

  // ---------- кнопки «3D models …» (T1331) → ровная сетка карточек
  const m3 = rec('1331');
  if (m3 && !m3.querySelector('.ml-3d')){
    const links = [...m3.querySelectorAll('a.t-btn')].map(a => ({href: a.href, name: (a.querySelector('.t-btnflex__text') || a).textContent.replace(/3d\s*models?/i, '').trim()})).filter(x => x.href && x.name);
    if (links.length){
      const nice = n => ({eglo:'EGLO', isonex:'Isonex', geniled:'Geniled'})[n.toLowerCase()] || (/^[a-zа-я]+$/.test(n) ? n.charAt(0).toUpperCase() + n.slice(1) : n);
      const box = D.createElement('div'); box.className = 'ml-3d';
      box.innerHTML = `<div class="ml-3d-hd">3D-модели для дизайнеров</div><div class="ml-3d-grid" style="--n:${links.length}">` +
        links.map(x => `<a class="ml-3d-c" href="${x.href}" target="_blank" rel="noopener"><b>${nice(x.name)}</b><span>3D-модели<i aria-hidden="true">↗</i></span></a>`).join('') + '</div>';
      const row = m3.querySelector('.t1331') || m3.firstElementChild;
      row.style.display = 'none'; m3.appendChild(box);
    }
  }

  // ---------- подвал: слово moonlight подсвечивается курсором
  const ft = rec('718') || D.getElementById('t-footer');
  if (ft && !D.querySelector('.ml-bw')){
    const bwBox = D.createElement('div'); bwBox.className = 'ml-bw';
    bwBox.innerHTML = '<div class="ml-logo" role="img" aria-label="Moonlight"></div><div class="ml-slogan">профессиональное освещение</div>';
    ft.matches('.t-rec') ? ft.after(bwBox) : ft.prepend(bwBox);
    const words = [bwBox.querySelector('.ml-logo')];
    const vis = () => words.find(el => el.offsetWidth > 0) || words[0];
    const bw = { getBoundingClientRect: () => vis().getBoundingClientRect() };
    const setB = (x, y) => { const el = vis(), b = el.getBoundingClientRect(); el.style.setProperty('--bx', (x - b.left) + 'px'); el.style.setProperty('--by', (y - b.top) + 'px'); };
    D.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') setB(e.clientX, e.clientY); }, {passive:true});
    if (coarse || !matchMedia('(pointer:fine)').matches){
      // на телефоне свет сам «гуляет» по слову, палец тоже двигает
      let v = false, touchT = 0;
      bwBox.addEventListener('pointermove', e => { touchT = performance.now(); setB(e.clientX, e.clientY); }, {passive:true});
      new IntersectionObserver(([e]) => { v = e.isIntersecting; if (v) requestAnimationFrame(walk); }).observe(bwBox);
      function walk(t){ if (!v) return; if (t - touchT > 2000){ const b = bw.getBoundingClientRect(), s = t/1000;
        setB(b.left + b.width*(.5 + .42*Math.sin(s*.7)), b.top + b.height*(.45 + .2*Math.sin(s*1.3))); } requestAnimationFrame(walk); }
    }
  }
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
const only = SCRIPT && SCRIPT.dataset.only, has = k => !only || only.split(',').includes(k);
const go = () => {
  if (has('rooms')) rooms();
  if (has('extras') && !(SCRIPT && SCRIPT.dataset.extras === 'off')) extras();
  if (has('cursor') && !(SCRIPT && SCRIPT.dataset.cursor === 'off')) cursor();
};
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
})();

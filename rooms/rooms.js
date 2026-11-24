/* Moonlight: живые комнаты + курсор-огонёк. Вставка в Тильде (T123): <div id="ml-rooms"></div><script src="https://iloveganter-cpu.github.io/moonlight-3d/rooms/rooms.js"></script>
   Только часть: data-only="cursor" / "extras,cursor"; отключить: data-extras="off", data-cursor="off"; курсор по умолчанию — звезда; data-cursor="spot" — трековый спот, "glow" — старый огонёк. Фонарик: <div id="ml-flash"></div> (иначе сам встаёт перед T603) */
(() => {
if (window.__mlRooms) return; window.__mlRooms = 1;
const SCRIPT = document.currentScript;
const BASE = SCRIPT ? SCRIPT.src.replace(/[^/]*$/, '') : 'https://iloveganter-cpu.github.io/moonlight-3d/rooms/';
if (!document.getElementById('ml-font')){ const l = document.createElement('link'); l.id = 'ml-font'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700&display=swap'; document.head.appendChild(l); }
const st = document.createElement('style'); st.textContent = "\n#ml-rooms{--night:var(--ml-d,var(--mlc-graphite,#2F3438));--night-2:color-mix(in srgb,var(--night) 86%,#fff);--night-3:color-mix(in srgb,var(--night) 74%,#fff);--night-line:color-mix(in srgb,var(--night) 70%,#fff);--night-ink:#F3F4F5;--night-muted:#AAACAE;\n  --muted:#AAACAE;--f-display:var(--ml-font);--f-body:var(--ml-font);--f-mono:var(--ml-font);\n  background:var(--night);color:var(--night-ink);font-family:var(--ml-font);line-height:1.5;padding:72px 0 64px;-webkit-font-smoothing:antialiased}\n:root{--glow:#FFB46B;--ml-amber:var(--mlc-moon,#BCD0E6);--ml-font:var(--mlc-font,'Avenir Next','Avenir','Nunito Sans',Arial,Helvetica,sans-serif)}\n#ml-rooms *{box-sizing:border-box}\n#ml-rooms button{font-family:inherit;margin:0}\n#ml-rooms .ml-wrap{max-width:1200px;margin:0 auto;padding:0 20px}\n#ml-rooms .ml-hd{text-align:center;margin-bottom:34px}\n#ml-rooms .ml-hd h2{font:300 clamp(22px,2.9vw,36px)/1.25 var(--ml-font);text-transform:uppercase;letter-spacing:.16em;margin:0 0 14px;color:#fff}\n#ml-rooms .ml-hd::before{content:\"\";display:block;width:34px;height:34px;margin:0 auto 18px;background:var(--ml-star) center/contain no-repeat}\n#ml-rooms .ml-hd p{color:var(--night-muted);font-size:16px;max-width:62ch;margin:0 auto}\n#ml-rooms .lr{border-radius:24px;background:color-mix(in srgb,var(--night) 72%,#000)}\n#ml-rooms .lr-note{color:var(--night-muted);margin-top:14px}\n#ml-rooms .lr-lt .nm{font-weight:600}\n#ml-rooms .lr-kval{font-weight:300;letter-spacing:.02em}\n#ml-rooms .lr-chip.on,#ml-rooms .lr-rooms button.on{background:var(--mlc-light,#F4F5F6);color:var(--mlc-graphite,#2F3438);border-color:var(--mlc-light,#F4F5F6)}\n#ml-rooms .ml-cta{display:flex;justify-content:center;margin-top:28px}\n#ml-rooms .ml-btn{display:inline-flex;align-items:center;justify-content:center;height:46px;padding:0 28px;border-radius:30px;background:var(--mlc-light,#F4F5F6);color:var(--mlc-graphite,#2F3438);font:600 14px/1 var(--ml-font);letter-spacing:.04em;text-decoration:none;transition:transform .15s,box-shadow .2s}\n#ml-rooms .ml-btn:hover{transform:translateY(-1px);box-shadow:0 0 24px color-mix(in srgb,var(--glow) 45%,transparent)}\n@media (max-width:640px){#ml-rooms{padding:48px 0 44px}#ml-rooms .ml-wrap{padding:0 12px}#ml-rooms .lr{border-radius:18px;padding:10px}}\n/* live room */\n#ml-rooms .lr{background:var(--night);color:var(--night-ink);border-radius:24px;padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:14px}\n@media (max-width:1000px){#ml-rooms .lr{grid-template-columns:minmax(0,1fr)}}\n#ml-rooms .lr-view{display:grid;gap:12px;min-width:0;align-content:start}\n#ml-rooms .lr-loading[hidden]{display:none}\n#ml-rooms .lr-frame{position:relative;aspect-ratio:16/9;max-width:100%;border-radius:14px;overflow:hidden;background:#000}\n#ml-rooms .lr-frame canvas{position:absolute;inset:0;width:100%;height:100%;display:block}\n#ml-rooms .lr-loading{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:16px;font-family:var(--f-mono);font-size:13px;color:var(--night-muted);background:var(--night-2)}\n#ml-rooms .lr-tag{position:absolute;left:12px;top:12px;font-family:var(--f-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;background:rgba(8,9,11,.6);backdrop-filter:blur(6px);padding:6px 10px;border-radius:99px;color:var(--night-muted)}\n#ml-rooms .lr-tag b{color:var(--night-ink);font-weight:500}\n#ml-rooms .lr-hs{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:0;background:transparent;cursor:pointer;padding:0}\n#ml-rooms .lr-hs::after{content:\"\";position:absolute;inset:9px;border-radius:50%;border:1.5px solid rgba(255,255,255,.55);background:rgba(17,19,22,.35);transition:all .25s}\n#ml-rooms .lr-hs.on::after{border-color:var(--glow);background:color-mix(in srgb,var(--glow) 55%,transparent);box-shadow:0 0 14px var(--glow)}\n#ml-rooms .lr-hs:hover::after{inset:6px}\n#ml-rooms .lr-hs .tip{position:absolute;left:50%;top:100%;transform:translateX(-50%);white-space:nowrap;font:500 11px/1 var(--f-mono);background:rgba(8,9,11,.8);padding:5px 8px;border-radius:6px;opacity:0;pointer-events:none;transition:opacity .15s;color:var(--night-ink)}\n#ml-rooms .lr-hs:hover .tip,#ml-rooms .lr-hs:focus-visible .tip{opacity:1}\n#ml-rooms .lr-k{background:var(--night-2);border-radius:14px;padding:14px 16px;display:grid;gap:10px}\n#ml-rooms .lr-krow{display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}\n#ml-rooms .lr-kval{font:500 26px/1 var(--f-mono);font-variant-numeric:tabular-nums}\n#ml-rooms .lr-kval small{font-size:13px;color:var(--night-muted);margin-left:8px;font-family:var(--f-body)}\n#ml-rooms .lr-chips{display:flex;gap:6px;flex-wrap:wrap}\n#ml-rooms .lr-chip{font:500 13px/1 var(--f-mono);padding:8px 11px;border-radius:99px;border:1px solid var(--night-line);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-chip:hover{color:var(--night-ink)}\n#ml-rooms .lr-chip.on{background:var(--night-ink);color:var(--night);border-color:var(--night-ink)}\n#ml-rooms .lr input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:10px;border-radius:99px;background:var(--night-3);outline:none;margin:0}\n#ml-rooms .lr input[type=range].kt{background:linear-gradient(90deg,#FF9F43,#FFD9A8 25%,#FFF4E6 50%,#E7EEFF 75%,#C9D8FF)}\n#ml-rooms .lr input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid var(--night);cursor:grab}\n#ml-rooms .lr input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid var(--night);cursor:grab}\n#ml-rooms .lr-scale{display:flex;justify-content:space-between;font:400 11px/1 var(--f-mono);color:var(--night-muted)}\n#ml-rooms .lr-panel{display:grid;gap:12px;align-content:start;min-width:0}\n#ml-rooms .lr-seg{display:grid;grid-template-columns:1fr 1fr;background:var(--night-2);border-radius:12px;padding:4px;gap:4px}\n#ml-rooms .lr-seg button{border:0;border-radius:9px;padding:10px;font:500 14px/1 var(--f-body);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-seg button.on{background:var(--night-3);color:var(--night-ink)}\n#ml-rooms .lr-rooms{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:var(--night-2);border-radius:12px;padding:4px}\n#ml-rooms .lr-rooms button{border:0;border-radius:9px;padding:11px 6px;font:500 14px/1 var(--f-display);background:transparent;color:var(--night-muted);cursor:pointer}\n#ml-rooms .lr-rooms button:hover{color:var(--night-ink)}\n#ml-rooms .lr-rooms button.on{background:var(--night-ink);color:var(--night)}\n#ml-rooms .lr-scenes #ml-rooms .lr-chip{font-family:var(--f-body);font-size:14px}\n#ml-rooms .lr-list{display:grid;gap:6px}\n#ml-rooms .lr-lt{background:var(--night-2);border-radius:12px;padding:12px 14px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 12px;align-items:center}\n#ml-rooms .lr-lt .nm{font:500 15px/1.25 var(--f-display)}\n#ml-rooms .lr-lt .pr{font:400 12px/1.3 var(--f-mono);color:var(--night-muted);margin-top:3px}\n#ml-rooms .lr-lt .pr.new{color:var(--glow)}\n#ml-rooms .lr-lt input[type=range]{grid-column:1/-1;height:6px}\n#ml-rooms .lr-lt.off input[type=range]{opacity:.35}\n#ml-rooms .lr-sw{position:relative;width:44px;height:26px;border-radius:99px;border:0;background:var(--night-3);cursor:pointer;transition:background .2s;flex:none}\n#ml-rooms .lr-sw::after{content:\"\";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:var(--night-muted);transition:all .2s}\n#ml-rooms .lr-sw[aria-checked=\"true\"]{background:var(--glow)}\n#ml-rooms .lr-sw[aria-checked=\"true\"]::after{left:21px;background:#fff}\n#ml-rooms .lr-lbl{font:500 11px/1 var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--night-muted);margin-top:4px}\n#ml-rooms .lr-note{font-size:13px;color:var(--muted);margin:0;max-width:80ch}\n@media (prefers-reduced-motion:reduce){#ml-rooms .lr *{transition:none!important}}\n\n/* курсор-свет v2 */\nhtml.cur-on, html.cur-on *{cursor:none!important}\n.cur,.cur-h{position:fixed;left:0;top:0;pointer-events:none;z-index:70;transform:translate3d(-200px,-200px,0);will-change:transform}\n.cur{width:0;height:0}\n.cur::before{content:\"\";position:absolute;left:-5px;top:-5px;width:10px;height:10px;border-radius:50%;background:#fff;\n  box-shadow:0 0 0 2px var(--glow),0 0 14px 3px var(--glow),0 0 34px 8px color-mix(in srgb,var(--glow) 45%,transparent);\n  transition:transform .25s cubic-bezier(.3,1.6,.5,1),opacity .2s}\n.cur::after{content:\"\";position:absolute;left:-23px;top:-23px;width:46px;height:46px;border-radius:50%;\n  border:1.5px solid var(--glow);background:color-mix(in srgb,var(--glow) 12%,transparent);\n  box-shadow:0 0 22px color-mix(in srgb,var(--glow) 45%,transparent),inset 0 0 12px color-mix(in srgb,var(--glow) 25%,transparent);\n  transform:scale(.2);opacity:0;transition:transform .3s cubic-bezier(.3,1.5,.5,1),opacity .2s}\n.cur.link::before{transform:scale(.45)}\n.cur.link::after{transform:scale(1);opacity:1}\n.cur.down::before{transform:scale(1.8)}\n.cur.down.link::after{transform:scale(.85)}\n.cur.off::before,.cur.off::after,.cur-h.off{opacity:0}\n.cur-h{width:0;height:0}\n.cur-h::before{content:\"\";position:absolute;left:-150px;top:-150px;width:300px;height:300px;border-radius:50%;\n  background:radial-gradient(circle,color-mix(in srgb,var(--glow) 30%,transparent),transparent 65%);opacity:.55;transition:opacity .3s}\n:root[data-theme=\"dark\"] .cur-h::before{mix-blend-mode:screen;opacity:.5}\n:root:not([data-theme=\"dark\"]) .cur-h::before{mix-blend-mode:multiply;opacity:.35}\n.cur-h.off::before{opacity:0}\n@media (pointer:coarse),(prefers-reduced-motion:reduce){.cur,.cur-h{display:none}}\n\n\n/* курсор поверх всего: шапки, меню, корзины, попапов Тильды и шторки каталога */\n.cur,.cur-h{z-index:2147483647!important}\n/* огонёк виден и на белом: тёмный ободок под свечением */\n.cur::before{box-shadow:0 0 0 1.5px rgba(20,20,22,.6),0 0 0 3px var(--glow),0 0 14px 3px var(--glow),0 0 34px 8px color-mix(in srgb,var(--glow) 45%,transparent)}\n.cur::after{box-shadow:0 0 0 1px rgba(20,20,22,.28),inset 0 0 0 1px rgba(20,20,22,.18),0 0 22px color-mix(in srgb,var(--glow) 45%,transparent),inset 0 0 12px color-mix(in srgb,var(--glow) 25%,transparent)}\n:root{--ml-star:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22%3E%3Cpath d=%22M30 6 C31 22 38 29 54 30 C38 31 31 38 30 54 C29 38 22 31 6 30 C22 29 29 22 30 6Z%22 fill=%22none%22 stroke=%22%23BCD0E6%22 stroke-width=%221%22/%3E%3Ccircle cx=%2230%22 cy=%222%22 r=%221.4%22 fill=%22%23BCD0E6%22/%3E%3Ccircle cx=%2230%22 cy=%2258%22 r=%221.4%22 fill=%22%23BCD0E6%22/%3E%3Ccircle cx=%222%22 cy=%2230%22 r=%221.4%22 fill=%22%23BCD0E6%22/%3E%3Ccircle cx=%2258%22 cy=%2230%22 r=%221.4%22 fill=%22%23BCD0E6%22/%3E%3C/svg%3E%0A\")}\n/* ===== время суток: палитра сайта ===== */\n:root{--ml-l:var(--mlc-light,#F4F5F6);--ml-d:var(--mlc-graphite,#2F3438);--ml-hdr:color-mix(in srgb,var(--mlc-light,#F4F5F6) 86%,transparent);--ml-ink:var(--mlc-graphite,#2F3438);--ml-mut:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));--ml-line:color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent)}\nhtml[data-tod=\"morning\"]{--ml-l:var(--mlc-morning-bg,#EEF2F7);--ml-d:var(--mlc-morning-dark,#2A3139);--ml-hdr:color-mix(in srgb,var(--ml-l) 86%,transparent)}\nhtml[data-tod=\"evening\"]{--ml-l:var(--mlc-evening-bg,#F5EDE2);--ml-d:var(--mlc-evening-dark,#36322E);--ml-hdr:color-mix(in srgb,var(--ml-l) 88%,transparent);--ml-line:rgba(60,45,30,.18)}\nhtml[data-tod=\"night\"]{--ml-l:var(--mlc-night,#25292D);--ml-d:var(--mlc-night-deep,#1C1F23);--ml-hdr:color-mix(in srgb,var(--mlc-night,#25292D) 88%,transparent);--ml-ink:#F3F4F5;--ml-mut:#AAACAE;--ml-line:rgba(255,255,255,.14)}\nhtml[data-tod] body{background-color:var(--ml-l)}\nhtml[data-tod] .t-rec[data-bg-color=\"#f4f4fb\"]{background-color:var(--ml-l)!important}\nhtml[data-tod] .t-rec[data-bg-color=\"#201f1f\"]{background-color:var(--ml-d)!important}\nhtml[data-tod] .t3113__firstlevel,html[data-tod] .t3113__secondlevel{background-color:var(--ml-hdr)!important}\n.t3113__firstlevel{-webkit-backdrop-filter:blur(18px) saturate(1.15);backdrop-filter:blur(18px) saturate(1.15)}\nhtml[data-tod] .tmenu-mobile{background-color:var(--ml-l)!important}\nhtml[data-tod] #ml-rooms{--night:var(--ml-d)}\n.t-rec,.t3113__firstlevel,.t3113__secondlevel,#ml-rooms,.ml-marq-box,.ml-bw,body{transition:background-color .9s ease}\n/* обложка: тон по времени суток */\n.t-cover__filter{transition:opacity .9s}\nhtml[data-tod] .t-cover::after{content:\"\";position:absolute;inset:0;pointer-events:none;z-index:0;transition:background .9s}\nhtml[data-tod=\"morning\"] .t-cover::after{background:linear-gradient(rgba(70,110,170,.16),rgba(20,40,70,.10))}\nhtml[data-tod=\"evening\"] .t-cover::after{background:radial-gradient(120% 90% at 50% 10%,rgba(255,150,60,.20),rgba(80,35,5,.18))}\nhtml[data-tod=\"night\"] .t-cover::after{background:rgba(0,0,6,.38)}\n/* ночь: тексты и значки светлых блоков и шапки — инверсия содержимого (фон блока уже тёмный) */\nhtml[data-tod=\"night\"] .t-rec[data-bg-color=\"#f4f4fb\"] > *:not(.ml-keep),\nhtml[data-tod=\"night\"] .t3113__firstlevel > *,\nhtml[data-tod=\"night\"] .t3113__secondlevel > *,\nhtml[data-tod=\"night\"] .tmenu-mobile > *{filter:invert(.9) hue-rotate(180deg)}\nhtml[data-tod=\"night\"] .ml-tod--float{filter:invert(.9) hue-rotate(180deg)}\n\n/* переключатель в шапке */\n.ml-tod{position:relative;align-self:center;font-family:var(--ml-font);z-index:5}\n.ml-tod-btn{display:flex;align-items:center;gap:7px;height:32px;border:1px solid rgba(32,31,31,.22);background:transparent;color:var(--mlc-graphite,#2F3438);border-radius:30px;padding:0 12px;font:600 12px/1 var(--ml-font);cursor:pointer;white-space:nowrap;margin:0}\n.ml-tod-btn i{width:8px;height:8px;border-radius:50%;background:var(--glow,#FFB46B);box-shadow:0 0 9px var(--glow,#FFB46B)}\n.ml-tod-btn small{color:#7C7B84;font:400 12px/1 var(--ml-font)}\n.ml-tod-menu{position:absolute;right:0;top:calc(100% + 8px);background:#fff;border:1px solid rgba(32,31,31,.12);border-radius:16px;padding:6px;display:grid;min-width:230px;box-shadow:0 18px 50px rgba(0,0,0,.18);opacity:0;transform:translateY(-6px);pointer-events:none;transition:opacity .18s,transform .18s}\n.ml-tod.open .ml-tod-menu{opacity:1;transform:none;pointer-events:auto}\n.ml-tod-menu button{display:flex;justify-content:space-between;align-items:center;gap:12px;border:0;background:transparent;color:var(--mlc-graphite,#2F3438);padding:10px 12px;border-radius:10px;font:600 14px/1 var(--ml-font);cursor:pointer;text-align:left;margin:0}\n.ml-tod-menu button span{font:400 12px/1 var(--ml-font);color:#7C7B84}\n.ml-tod-menu button:hover,.ml-tod-menu button[aria-checked=\"true\"]{background:var(--mlc-light,#F4F5F6)}\n.ml-tod-menu p{margin:6px 12px 8px;font:400 12px/1.4 var(--ml-font);color:#7C7B84}\n.ml-tod--float{position:fixed;left:14px;bottom:14px;z-index:9990}\n.ml-tod--float .ml-tod-btn{background:rgba(244,244,251,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);height:38px;box-shadow:0 6px 20px rgba(0,0,0,.18)}\n.ml-tod--float .ml-tod-menu{top:auto;bottom:calc(100% + 8px);left:0;right:auto;transform:translateY(6px)}\n\n/* ===== фонарик ===== */\n.ml-fl{position:relative;background:#050607;color:#ECEDEA;overflow:hidden;touch-action:pan-y;font-family:var(--ml-font)}\n.ml-fl .fl-box{position:relative;height:min(100vh,56vw);min-height:520px}\n.ml-fl .fl-box img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;max-width:none}\n.ml-fl .fl-on{-webkit-mask-image:radial-gradient(circle var(--fr,260px) at var(--fx,50%) var(--fy,50%),#000 var(--fc,0%),rgba(0,0,0,.85) max(35%,var(--fc,0%)),transparent 100%);\n  mask-image:radial-gradient(circle var(--fr,260px) at var(--fx,50%) var(--fy,50%),#000 var(--fc,0%),rgba(0,0,0,.85) max(35%,var(--fc,0%)),transparent 100%)}\n.ml-fl .fl-flash{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:2}\n.ml-fl .fl-flash>*{position:absolute;left:0;top:0;opacity:0}\n.ml-fl .fl-star{width:76px;height:76px;margin:-38px 0 0 -38px;overflow:visible;filter:drop-shadow(0 0 6px #fff) drop-shadow(0 0 22px var(--ml-amber)) drop-shadow(0 0 60px var(--ml-amber))}\n.ml-fl .fl-star path{fill:#fff;stroke:var(--ml-amber);stroke-width:.8;stroke-linejoin:round}\n.ml-fl .fl-rays{width:220px;height:220px;margin:-110px 0 0 -110px;overflow:visible;filter:drop-shadow(0 0 4px var(--ml-amber))}\n.ml-fl .fl-rays line{stroke:#fff;stroke-width:1.4;stroke-linecap:round}\n.ml-fl .fl-wave{width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;box-shadow:0 0 0 1.5px color-mix(in srgb,var(--ml-amber) 80%,transparent),0 0 30px color-mix(in srgb,var(--ml-amber) 50%,transparent),inset 0 0 20px color-mix(in srgb,#fff 25%,transparent)}\n.ml-fl.lit .fl-on{-webkit-mask-image:none;mask-image:none;transition:opacity .6s}\n.ml-fl-txt{position:absolute;left:0;right:0;bottom:0;padding:0 0 52px;pointer-events:none;background:linear-gradient(transparent,rgba(5,6,7,.8) 60%)}\n.ml-fl-wrap{max-width:1200px;margin:0 auto;padding:0 20px}\n.ml-fl-eye{font:400 12px/1 var(--ml-font);letter-spacing:.3em;text-transform:uppercase;color:#9AA0A8}\n.ml-fl h2{font:300 clamp(26px,3.8vw,52px)/1.2 var(--ml-font);text-transform:uppercase;letter-spacing:.14em;margin:14px 0 0;color:#fff;max-width:28ch}\n.ml-fl h2 b{font-weight:400;color:var(--ml-amber);text-shadow:0 0 40px color-mix(in srgb,var(--ml-amber) 45%,transparent)}\n.ml-fl p{color:#A9A8B0;margin:16px 0 0;max-width:52ch;font:400 16px/1.5 var(--ml-font)}\n.ml-fl-ui{position:absolute;right:max(16px,calc((100vw - 1200px)/2 + 20px));top:24px;display:flex;gap:8px;align-items:center}\n.ml-fl-hint{font:600 11px/1 var(--ml-font);letter-spacing:.08em;text-transform:uppercase;color:#9AA0A8;border:1px solid #2C3036;border-radius:30px;padding:9px 13px;pointer-events:none}\n.ml-fl-sw{font:600 12px/1 var(--ml-font);color:var(--mlc-graphite,#2F3438);background:var(--mlc-light,#F4F5F6);border:0;border-radius:30px;padding:9px 14px;cursor:pointer;margin:0}\n@media (max-width:640px){.ml-fl .fl-box{height:110vw;min-height:400px}.ml-fl .fl-box img{object-position:50% 50%}.ml-fl-txt{padding:40px 0 18px;background:linear-gradient(transparent,rgba(5,6,7,.7) 55%)}.ml-fl-eye,.ml-fl p,.ml-fl-hint{display:none}.ml-fl h2{font-size:19px;letter-spacing:.1em;margin:0;max-width:none}.ml-fl-ui{top:12px;right:12px}}\n/* фонарик первым экраном вместо обложки: высота = экран минус шапка */\n.ml-fl-hero .ml-fl .fl-box{height:calc(100vh - var(--ml-hdr,90px));height:calc(100svh - var(--ml-hdr,90px));min-height:480px}\n@media (max-width:640px){.ml-fl-hero .ml-fl .fl-box{height:min(calc(100svh - var(--ml-hdr,64px)),150vw);min-height:420px}}\n\n/* ===== бегущая строка брендов ===== */\n.ml-marq-box{background:var(--ml-l);padding:26px 0 18px}\n.ml-marq{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}\n.ml-marq-t{display:flex;align-items:center;width:max-content;animation:mlmarq var(--mq,46s) linear infinite}\n.ml-marq:hover .ml-marq-t{animation-play-state:paused}\n.ml-marq a{flex:none;display:flex;align-items:center;justify-content:center;height:84px;padding:0 clamp(26px,3.4vw,52px);position:relative}\n.ml-marq img{height:46px;width:auto;max-width:150px;object-fit:contain;filter:grayscale(1);opacity:.55;transition:filter .3s,opacity .3s,transform .3s;display:block}\n.ml-marq a::before{content:\"\";position:absolute;left:50%;top:50%;width:150px;height:90px;margin:-45px 0 0 -75px;border-radius:50%;\n  background:radial-gradient(closest-side,color-mix(in srgb,var(--glow,#FFB46B) 55%,transparent),transparent);opacity:0;transition:opacity .3s;pointer-events:none}\n.ml-marq a:hover img{filter:none;opacity:1;transform:scale(1.06)}\n.ml-marq a:hover::before{opacity:1}\nhtml[data-tod=\"night\"] .ml-marq img{filter:grayscale(1) invert(1) brightness(1.1);opacity:.6}\nhtml[data-tod=\"night\"] .ml-marq a:hover img{filter:grayscale(1) invert(1) brightness(1.4);opacity:1}\n@keyframes mlmarq{to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion:reduce){.ml-marq-t{animation:none}}\n@media (max-width:640px){.ml-marq a{height:64px}.ml-marq img{height:34px;max-width:110px}}\n\n/* ===== подвал: слово, которое подсвечивает курсор ===== */\n.ml-bw{background:var(--ml-l);text-align:center;overflow:hidden;padding:10px 20px 0;line-height:0}\nhtml[data-tod=\"night\"] .t3113__popover{filter:invert(.9) hue-rotate(180deg)}\n/* телефон: логотип нового фирменного стиля (MOON / LIGHT, буквы O — полумесяцы), свет идёт по буквам */\n.ml-logo{display:block;width:min(84vw,1100px);aspect-ratio:276.06/26.95;margin:40px auto 0;--br:300px;\n  --lf:rgba(32,31,31,.28);\n  --l1:var(--mlc-moon-deep,#5F7896);--l2:color-mix(in srgb,var(--mlc-moon-day,#7895B5) 55%,transparent);\n  background:radial-gradient(circle var(--br,130px) at var(--bx,50%) var(--by,50%),var(--l1),var(--l2) 45%,transparent 75%) no-repeat,var(--lf);\n  -webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22353.78 355.07 276.06 26.95%22%3E%3Cg fill=%22%23fff%22%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M338.4357 289.8346C342.6491 294.048 342.6491 300.8795 338.4357 305.0926 336.473 307.0553 333.942 308.1033 331.3721 308.2374 333.1962 307.8825 334.9372 306.9986 336.3497 305.5861 340.1235 301.8124 340.1235 295.6944 336.3497 291.9206 332.5762 288.1471 326.4579 288.1471 322.6844 291.9206 321.2719 293.3331 320.3878 295.0744 320.0329 296.8982 320.167 294.3283 321.215 291.7973 323.1777 289.8346 327.3911 285.6214 334.2226 285.6214 338.4357 289.8346%22 fill-rule=%22evenodd%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,76.0661,666.1417%29%22 d=%22M298.1358 308.6011V287.0753H296.4651V304.2961L289.0117 293.6937H288.3691L280.8836 304.2961V287.0753H279.2129V308.6011H279.8555L288.6902 296.0067 297.4932 308.6011Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M413.1955 308.2799V286.7542H412.5209L398.4812 304.7136V287.0753H396.8107V308.6011H397.453L411.5248 290.5132V308.2799Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M553.3699 306.7971H545.741V308.2844H562.6772V306.7971H555.0163V287.3917H553.3699Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M515.094 308.2844H516.7395V299.4205H529.5923V308.2844H531.2387V287.3917H529.5923V297.9326H516.7395V287.3917H515.094Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M488.6388 287.0751C486.6548 287.0751 484.8503 287.5493 483.2252 288.4995 481.6009 289.4491 480.3131 290.7471 479.3635 292.3929 478.4134 294.0398 477.9386 295.854 477.9386 297.8379 477.9386 299.8426 478.4134 301.6627 479.3635 303.2989 480.3131 304.9345 481.6057 306.2271 483.2413 307.1772 484.8766 308.1263 486.6758 308.6011 488.6388 308.6011 490.3486 308.6011 491.9309 308.2371 493.3871 307.5089 494.8432 306.7815 496.0466 305.7625 496.9962 304.4543L495.7611 303.4729C494.9382 304.613 493.92 305.4991 492.7065 306.1321 491.4927 306.7654 490.1474 307.082 488.67 307.082 486.9607 307.082 485.4254 306.6755 484.0642 305.8631 482.703 305.0507 481.6321 303.9423 480.8514 302.5392 480.0702 301.1357 479.6796 299.579 479.6796 297.8697 479.6796 296.1394 480.0702 294.5667 480.8514 293.1531 481.6321 291.7389 482.7081 290.6254 484.0801 289.813 485.4518 289.0006 487.0026 288.5941 488.7334 288.5941 490.3588 288.5941 491.836 288.9635 493.1654 289.7028 494.4951 290.4409 495.5508 291.4438 496.3309 292.71V296.1598H488.6388V297.68H497.9772V292.3617C497.0699 290.7153 495.7824 289.4227 494.115 288.4833 492.4483 287.5445 490.6227 287.0751 488.6388 287.0751%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M461.4503 308.2844H463.0958V287.3917H461.4503Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M433.8711 308.2844H435.5164V288.879H445.8053V287.3917H433.8711Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M362.6158 305.3614C358.4024 301.1479 358.4024 294.3164 362.6158 290.1033 364.5785 288.1406 367.1096 287.0926 369.6795 286.9586 367.8557 287.3134 366.1143 288.1973 364.7018 289.6101 360.9283 293.3836 360.9283 299.5016 364.7018 303.2753 368.4753 307.0488 374.5936 307.0488 378.3671 303.2753 379.7796 301.8628 380.6637 300.1215 381.0186 298.2977 380.8845 300.8676 379.8366 303.3986 377.8739 305.3614 373.6604 309.5748 366.8292 309.5748 362.6158 305.3614%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22353.78 355.07 276.06 26.95%22%3E%3Cg fill=%22%23fff%22%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M338.4357 289.8346C342.6491 294.048 342.6491 300.8795 338.4357 305.0926 336.473 307.0553 333.942 308.1033 331.3721 308.2374 333.1962 307.8825 334.9372 306.9986 336.3497 305.5861 340.1235 301.8124 340.1235 295.6944 336.3497 291.9206 332.5762 288.1471 326.4579 288.1471 322.6844 291.9206 321.2719 293.3331 320.3878 295.0744 320.0329 296.8982 320.167 294.3283 321.215 291.7973 323.1777 289.8346 327.3911 285.6214 334.2226 285.6214 338.4357 289.8346%22 fill-rule=%22evenodd%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,76.0661,666.1417%29%22 d=%22M298.1358 308.6011V287.0753H296.4651V304.2961L289.0117 293.6937H288.3691L280.8836 304.2961V287.0753H279.2129V308.6011H279.8555L288.6902 296.0067 297.4932 308.6011Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M413.1955 308.2799V286.7542H412.5209L398.4812 304.7136V287.0753H396.8107V308.6011H397.453L411.5248 290.5132V308.2799Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M553.3699 306.7971H545.741V308.2844H562.6772V306.7971H555.0163V287.3917H553.3699Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M515.094 308.2844H516.7395V299.4205H529.5923V308.2844H531.2387V287.3917H529.5923V297.9326H516.7395V287.3917H515.094Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M488.6388 287.0751C486.6548 287.0751 484.8503 287.5493 483.2252 288.4995 481.6009 289.4491 480.3131 290.7471 479.3635 292.3929 478.4134 294.0398 477.9386 295.854 477.9386 297.8379 477.9386 299.8426 478.4134 301.6627 479.3635 303.2989 480.3131 304.9345 481.6057 306.2271 483.2413 307.1772 484.8766 308.1263 486.6758 308.6011 488.6388 308.6011 490.3486 308.6011 491.9309 308.2371 493.3871 307.5089 494.8432 306.7815 496.0466 305.7625 496.9962 304.4543L495.7611 303.4729C494.9382 304.613 493.92 305.4991 492.7065 306.1321 491.4927 306.7654 490.1474 307.082 488.67 307.082 486.9607 307.082 485.4254 306.6755 484.0642 305.8631 482.703 305.0507 481.6321 303.9423 480.8514 302.5392 480.0702 301.1357 479.6796 299.579 479.6796 297.8697 479.6796 296.1394 480.0702 294.5667 480.8514 293.1531 481.6321 291.7389 482.7081 290.6254 484.0801 289.813 485.4518 289.0006 487.0026 288.5941 488.7334 288.5941 490.3588 288.5941 491.836 288.9635 493.1654 289.7028 494.4951 290.4409 495.5508 291.4438 496.3309 292.71V296.1598H488.6388V297.68H497.9772V292.3617C497.0699 290.7153 495.7824 289.4227 494.115 288.4833 492.4483 287.5445 490.6227 287.0751 488.6388 287.0751%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M461.4503 308.2844H463.0958V287.3917H461.4503Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M433.8711 308.2844H435.5164V288.879H445.8053V287.3917H433.8711Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M362.6158 305.3614C358.4024 301.1479 358.4024 294.3164 362.6158 290.1033 364.5785 288.1406 367.1096 287.0926 369.6795 286.9586 367.8557 287.3134 366.1143 288.1973 364.7018 289.6101 360.9283 293.3836 360.9283 299.5016 364.7018 303.2753 368.4753 307.0488 374.5936 307.0488 378.3671 303.2753 379.7796 301.8628 380.6637 300.1215 381.0186 298.2977 380.8845 300.8676 379.8366 303.3986 377.8739 305.3614 373.6604 309.5748 366.8292 309.5748 362.6158 305.3614%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\") center/contain no-repeat}\n.ml-slogan{font:300 clamp(11px,1.15vw,16px)/1 var(--ml-font);letter-spacing:.62em;text-transform:lowercase;color:transparent;margin:28px 0 46px;padding-left:.62em;line-height:1.6;\n  --l1:var(--mlc-moon-deep,#5F7896);--l2:color-mix(in srgb,var(--mlc-moon-day,#7895B5) 60%,transparent);\n  background:radial-gradient(circle 260px at var(--bx,-999px) var(--by,-999px),var(--l1),var(--l2) 40%,transparent 72%) no-repeat,linear-gradient(var(--ml-mut),var(--ml-mut));\n  -webkit-background-clip:text;background-clip:text}\nhtml[data-tod=\"night\"] .ml-logo{--lf:rgba(255,255,255,.22);--l1:#FFFFFF;--l2:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 60%,transparent)}\nhtml[data-tod=\"night\"] .ml-slogan{--l1:#FFFFFF;--l2:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 75%,transparent)}\n\n/* ===== шапка: живой логотип (вместо PNG) ===== */\nhtml.ml-hlogo-on .t3113__header img.t-menu-base__imglogo,html.ml-hlogo-on .tmenu-mobile img.t-menu-base__imglogomobile{visibility:hidden}\n.ml-hlogo-m .ml-hlogo-s{font-size:8px;letter-spacing:.38em;padding-left:.38em}\n.ml-hlogo{position:absolute;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9%;text-decoration:none;transition:filter .4s;\n  --hb:var(--mlc-graphite,#2F3438);--h1:var(--mlc-moon-day,#7895B5);--h2:color-mix(in srgb,var(--mlc-moon-day,#7895B5) 50%,transparent)}\n.ml-hlogo-w{display:block;width:100%;aspect-ratio:276.06/26.95;\n  background:radial-gradient(circle 110px at var(--bx,-999px) var(--by,-999px),var(--h1),var(--h2) 45%,transparent 75%) no-repeat,var(--hb);\n  -webkit-mask:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22353.78 355.07 276.06 26.95%22%3E%3Cg fill=%22%23fff%22%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M338.4357 289.8346C342.6491 294.048 342.6491 300.8795 338.4357 305.0926 336.473 307.0553 333.942 308.1033 331.3721 308.2374 333.1962 307.8825 334.9372 306.9986 336.3497 305.5861 340.1235 301.8124 340.1235 295.6944 336.3497 291.9206 332.5762 288.1471 326.4579 288.1471 322.6844 291.9206 321.2719 293.3331 320.3878 295.0744 320.0329 296.8982 320.167 294.3283 321.215 291.7973 323.1777 289.8346 327.3911 285.6214 334.2226 285.6214 338.4357 289.8346%22 fill-rule=%22evenodd%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,76.0661,666.1417%29%22 d=%22M298.1358 308.6011V287.0753H296.4651V304.2961L289.0117 293.6937H288.3691L280.8836 304.2961V287.0753H279.2129V308.6011H279.8555L288.6902 296.0067 297.4932 308.6011Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M413.1955 308.2799V286.7542H412.5209L398.4812 304.7136V287.0753H396.8107V308.6011H397.453L411.5248 290.5132V308.2799Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M553.3699 306.7971H545.741V308.2844H562.6772V306.7971H555.0163V287.3917H553.3699Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M515.094 308.2844H516.7395V299.4205H529.5923V308.2844H531.2387V287.3917H529.5923V297.9326H516.7395V287.3917H515.094Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M488.6388 287.0751C486.6548 287.0751 484.8503 287.5493 483.2252 288.4995 481.6009 289.4491 480.3131 290.7471 479.3635 292.3929 478.4134 294.0398 477.9386 295.854 477.9386 297.8379 477.9386 299.8426 478.4134 301.6627 479.3635 303.2989 480.3131 304.9345 481.6057 306.2271 483.2413 307.1772 484.8766 308.1263 486.6758 308.6011 488.6388 308.6011 490.3486 308.6011 491.9309 308.2371 493.3871 307.5089 494.8432 306.7815 496.0466 305.7625 496.9962 304.4543L495.7611 303.4729C494.9382 304.613 493.92 305.4991 492.7065 306.1321 491.4927 306.7654 490.1474 307.082 488.67 307.082 486.9607 307.082 485.4254 306.6755 484.0642 305.8631 482.703 305.0507 481.6321 303.9423 480.8514 302.5392 480.0702 301.1357 479.6796 299.579 479.6796 297.8697 479.6796 296.1394 480.0702 294.5667 480.8514 293.1531 481.6321 291.7389 482.7081 290.6254 484.0801 289.813 485.4518 289.0006 487.0026 288.5941 488.7334 288.5941 490.3588 288.5941 491.836 288.9635 493.1654 289.7028 494.4951 290.4409 495.5508 291.4438 496.3309 292.71V296.1598H488.6388V297.68H497.9772V292.3617C497.0699 290.7153 495.7824 289.4227 494.115 288.4833 492.4483 287.5445 490.6227 287.0751 488.6388 287.0751%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M461.4503 308.2844H463.0958V287.3917H461.4503Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M433.8711 308.2844H435.5164V288.879H445.8053V287.3917H433.8711Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M362.6158 305.3614C358.4024 301.1479 358.4024 294.3164 362.6158 290.1033 364.5785 288.1406 367.1096 287.0926 369.6795 286.9586 367.8557 287.3134 366.1143 288.1973 364.7018 289.6101 360.9283 293.3836 360.9283 299.5016 364.7018 303.2753 368.4753 307.0488 374.5936 307.0488 378.3671 303.2753 379.7796 301.8628 380.6637 300.1215 381.0186 298.2977 380.8845 300.8676 379.8366 303.3986 377.8739 305.3614 373.6604 309.5748 366.8292 309.5748 362.6158 305.3614%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\") center/contain no-repeat;mask:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22353.78 355.07 276.06 26.95%22%3E%3Cg fill=%22%23fff%22%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M338.4357 289.8346C342.6491 294.048 342.6491 300.8795 338.4357 305.0926 336.473 307.0553 333.942 308.1033 331.3721 308.2374 333.1962 307.8825 334.9372 306.9986 336.3497 305.5861 340.1235 301.8124 340.1235 295.6944 336.3497 291.9206 332.5762 288.1471 326.4579 288.1471 322.6844 291.9206 321.2719 293.3331 320.3878 295.0744 320.0329 296.8982 320.167 294.3283 321.215 291.7973 323.1777 289.8346 327.3911 285.6214 334.2226 285.6214 338.4357 289.8346%22 fill-rule=%22evenodd%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,76.0661,666.1417%29%22 d=%22M298.1358 308.6011V287.0753H296.4651V304.2961L289.0117 293.6937H288.3691L280.8836 304.2961V287.0753H279.2129V308.6011H279.8555L288.6902 296.0067 297.4932 308.6011Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M413.1955 308.2799V286.7542H412.5209L398.4812 304.7136V287.0753H396.8107V308.6011H397.453L411.5248 290.5132V308.2799Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M553.3699 306.7971H545.741V308.2844H562.6772V306.7971H555.0163V287.3917H553.3699Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M515.094 308.2844H516.7395V299.4205H529.5923V308.2844H531.2387V287.3917H529.5923V297.9326H516.7395V287.3917H515.094Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M488.6388 287.0751C486.6548 287.0751 484.8503 287.5493 483.2252 288.4995 481.6009 289.4491 480.3131 290.7471 479.3635 292.3929 478.4134 294.0398 477.9386 295.854 477.9386 297.8379 477.9386 299.8426 478.4134 301.6627 479.3635 303.2989 480.3131 304.9345 481.6057 306.2271 483.2413 307.1772 484.8766 308.1263 486.6758 308.6011 488.6388 308.6011 490.3486 308.6011 491.9309 308.2371 493.3871 307.5089 494.8432 306.7815 496.0466 305.7625 496.9962 304.4543L495.7611 303.4729C494.9382 304.613 493.92 305.4991 492.7065 306.1321 491.4927 306.7654 490.1474 307.082 488.67 307.082 486.9607 307.082 485.4254 306.6755 484.0642 305.8631 482.703 305.0507 481.6321 303.9423 480.8514 302.5392 480.0702 301.1357 479.6796 299.579 479.6796 297.8697 479.6796 296.1394 480.0702 294.5667 480.8514 293.1531 481.6321 291.7389 482.7081 290.6254 484.0801 289.813 485.4518 289.0006 487.0026 288.5941 488.7334 288.5941 490.3588 288.5941 491.836 288.9635 493.1654 289.7028 494.4951 290.4409 495.5508 291.4438 496.3309 292.71V296.1598H488.6388V297.68H497.9772V292.3617C497.0699 290.7153 495.7824 289.4227 494.115 288.4833 492.4483 287.5445 490.6227 287.0751 488.6388 287.0751%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M461.4503 308.2844H463.0958V287.3917H461.4503Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,65.6661,666.1417%29%22 d=%22M433.8711 308.2844H435.5164V288.879H445.8053V287.3917H433.8711Z%22/%3E%3Cpath transform=%22matrix%281,0,0,-1,67.7661,666.1417%29%22 d=%22M362.6158 305.3614C358.4024 301.1479 358.4024 294.3164 362.6158 290.1033 364.5785 288.1406 367.1096 287.0926 369.6795 286.9586 367.8557 287.3134 366.1143 288.1973 364.7018 289.6101 360.9283 293.3836 360.9283 299.5016 364.7018 303.2753 368.4753 307.0488 374.5936 307.0488 378.3671 303.2753 379.7796 301.8628 380.6637 300.1215 381.0186 298.2977 380.8845 300.8676 379.8366 303.3986 377.8739 305.3614 373.6604 309.5748 366.8292 309.5748 362.6158 305.3614%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/svg%3E\") center/contain no-repeat}\n.ml-hlogo-s{font:400 clamp(8px,.62vw,11px)/1 var(--ml-font);letter-spacing:.42em;padding-left:.42em;text-transform:lowercase;white-space:nowrap;color:transparent;\n  background:radial-gradient(circle 110px at var(--bx,-999px) var(--by,-999px),var(--h1),var(--h2) 45%,transparent 75%) no-repeat,linear-gradient(var(--hs,color-mix(in srgb,var(--mlc-graphite,#2F3438) 62%,transparent)),var(--hs,color-mix(in srgb,var(--mlc-graphite,#2F3438) 62%,transparent)));\n  -webkit-background-clip:text;background-clip:text}\nhtml[data-tod=\"night\"] .ml-hlogo{--hb:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6));--hs:color-mix(in srgb,color-mix(in srgb,var(--mlc-moon-day,#7895B5) 20%,var(--mlc-light,#F4F5F6)) 62%,transparent);--h1:#FFFFFF;--h2:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 90%,transparent)}\nhtml[data-tod=\"night\"] .ml-hlogo{filter:drop-shadow(0 0 7px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 45%,transparent))}\nhtml[data-tod=\"night\"] .ml-hlogo:hover{filter:drop-shadow(0 0 12px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 75%,transparent))}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-hlogo:hover{filter:drop-shadow(0 0 6px color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 35%,transparent))}\n@media (max-width:640px){.ml-logo{width:min(80vw,400px);aspect-ratio:215.6/72.95;margin-top:26px;--br:130px;-webkit-mask-image:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22384.01 331.26 215.60 72.95%22%3E%3Cg transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 fill=%22%23fff%22%3E%3Cg transform=%22translate%28-4.5500,0%29%22%3E%3Cpath d=%22M408.6181 302.0621C415.3037 308.7476 415.3037 319.5876 408.6181 326.2731 405.5037 329.3875 401.4876 331.0503 397.41 331.2629 400.3041 330.7 403.0668 329.2974 405.3081 327.0557 411.296 321.0681 411.296 311.36 405.3081 305.3721 399.3205 299.3845 389.6124 299.3845 383.6248 305.3721 381.3831 307.6138 379.9806 310.3764 379.4176 313.2706 379.6302 309.1929 381.293 305.1765 384.4074 302.0621 391.0929 295.3766 401.9326 295.3766 408.6181 302.0621%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3Cpath d=%22M344.6722 331.8401V297.684H342.021V325.0089L330.1943 308.1855H329.1746L317.2966 325.0089V297.684H314.6457V331.8401H315.6653L329.6843 311.8561 343.6523 331.8401Z%22/%3E%3Cpath d=%22M527.2441 331.3304V297.1743H526.1734L503.8957 325.6716V297.684H501.245V331.8401H502.2643L524.5931 303.1387V331.3304Z%22/%3E%3Cpath d=%22M314.6457 281.4814H316.046V264.9708H324.7997V263.7051H314.6457ZM363.3375 281.4814H364.7378V263.7051H363.3375ZM413.1337 263.4358C411.446 263.4358 409.9105 263.8395 408.528 264.6476 407.1458 265.4555 406.05 266.5602 405.2424 267.9605 404.4339 269.3614 404.03 270.9054 404.03 272.5934 404.03 274.299 404.4339 275.8476 405.2424 277.2397 406.05 278.6309 407.1501 279.7308 408.5416 280.5389 409.9331 281.3468 411.4638 281.7507 413.1337 281.7507 414.5885 281.7507 415.9349 281.4409 417.174 280.8215 418.4127 280.2025 419.4366 279.3356 420.2444 278.2225L419.1936 277.3877C418.4935 278.3574 417.6272 279.1114 416.5948 279.65 415.5622 280.1889 414.4175 280.4581 413.1604 280.4581 411.7059 280.4581 410.4 280.1126 409.2418 279.4212 408.0838 278.7301 407.1725 277.7871 406.508 276.5931 405.8436 275.3989 405.5114 274.0745 405.5114 272.6201 405.5114 271.1477 405.8436 269.8101 406.508 268.6071 407.1725 267.404 408.0881 266.4567 409.2554 265.7656 410.4224 265.074 411.7419 264.7284 413.2142 264.7284 414.5975 264.7284 415.8539 265.0425 416.9852 265.6712 418.1165 266.2997 419.0148 267.1529 419.6786 268.23V271.1656H413.1337V272.4585H421.0792V267.9335C420.3071 266.5329 419.2118 265.4331 417.7933 264.634 416.3749 263.8352 414.8218 263.4358 413.1337 263.4358ZM460.5602 281.4814H461.9605V273.9399H472.896V281.4814H474.2966V263.7051H472.896V272.6739H461.9605V263.7051H460.5602ZM519.3252 280.2161H512.8345V281.4814H527.2441V280.2161H520.7261V263.7051H519.3252Z%22/%3E%3Cg transform=%22translate%28-4.5500,0%29%22%3E%3Cpath d=%22M446.9862 326.6994C440.3007 320.0139 440.3007 309.174 446.9862 302.4884 450.1006 299.374 454.1168 297.7112 458.1944 297.4986 455.3005 298.0616 452.5376 299.4642 450.2962 301.7058 444.3083 307.6934 444.3083 317.4015 450.2962 323.3894 456.2838 329.377 465.9919 329.377 471.9798 323.3894 474.2212 321.1478 475.6238 318.3851 476.187 315.491 475.9741 319.5686 474.3113 323.585 471.1969 326.6994 464.5114 333.3849 453.6717 333.3849 446.9862 326.6994%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%22384.01 331.26 215.60 72.95%22%3E%3Cg transform=%22matrix%281,0,0,-1,70.8661,666.1417%29%22 fill=%22%23fff%22%3E%3Cg transform=%22translate%28-4.5500,0%29%22%3E%3Cpath d=%22M408.6181 302.0621C415.3037 308.7476 415.3037 319.5876 408.6181 326.2731 405.5037 329.3875 401.4876 331.0503 397.41 331.2629 400.3041 330.7 403.0668 329.2974 405.3081 327.0557 411.296 321.0681 411.296 311.36 405.3081 305.3721 399.3205 299.3845 389.6124 299.3845 383.6248 305.3721 381.3831 307.6138 379.9806 310.3764 379.4176 313.2706 379.6302 309.1929 381.293 305.1765 384.4074 302.0621 391.0929 295.3766 401.9326 295.3766 408.6181 302.0621%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3Cpath d=%22M344.6722 331.8401V297.684H342.021V325.0089L330.1943 308.1855H329.1746L317.2966 325.0089V297.684H314.6457V331.8401H315.6653L329.6843 311.8561 343.6523 331.8401Z%22/%3E%3Cpath d=%22M527.2441 331.3304V297.1743H526.1734L503.8957 325.6716V297.684H501.245V331.8401H502.2643L524.5931 303.1387V331.3304Z%22/%3E%3Cpath d=%22M314.6457 281.4814H316.046V264.9708H324.7997V263.7051H314.6457ZM363.3375 281.4814H364.7378V263.7051H363.3375ZM413.1337 263.4358C411.446 263.4358 409.9105 263.8395 408.528 264.6476 407.1458 265.4555 406.05 266.5602 405.2424 267.9605 404.4339 269.3614 404.03 270.9054 404.03 272.5934 404.03 274.299 404.4339 275.8476 405.2424 277.2397 406.05 278.6309 407.1501 279.7308 408.5416 280.5389 409.9331 281.3468 411.4638 281.7507 413.1337 281.7507 414.5885 281.7507 415.9349 281.4409 417.174 280.8215 418.4127 280.2025 419.4366 279.3356 420.2444 278.2225L419.1936 277.3877C418.4935 278.3574 417.6272 279.1114 416.5948 279.65 415.5622 280.1889 414.4175 280.4581 413.1604 280.4581 411.7059 280.4581 410.4 280.1126 409.2418 279.4212 408.0838 278.7301 407.1725 277.7871 406.508 276.5931 405.8436 275.3989 405.5114 274.0745 405.5114 272.6201 405.5114 271.1477 405.8436 269.8101 406.508 268.6071 407.1725 267.404 408.0881 266.4567 409.2554 265.7656 410.4224 265.074 411.7419 264.7284 413.2142 264.7284 414.5975 264.7284 415.8539 265.0425 416.9852 265.6712 418.1165 266.2997 419.0148 267.1529 419.6786 268.23V271.1656H413.1337V272.4585H421.0792V267.9335C420.3071 266.5329 419.2118 265.4331 417.7933 264.634 416.3749 263.8352 414.8218 263.4358 413.1337 263.4358ZM460.5602 281.4814H461.9605V273.9399H472.896V281.4814H474.2966V263.7051H472.896V272.6739H461.9605V263.7051H460.5602ZM519.3252 280.2161H512.8345V281.4814H527.2441V280.2161H520.7261V263.7051H519.3252Z%22/%3E%3Cg transform=%22translate%28-4.5500,0%29%22%3E%3Cpath d=%22M446.9862 326.6994C440.3007 320.0139 440.3007 309.174 446.9862 302.4884 450.1006 299.374 454.1168 297.7112 458.1944 297.4986 455.3005 298.0616 452.5376 299.4642 450.2962 301.7058 444.3083 307.6934 444.3083 317.4015 450.2962 323.3894 456.2838 329.377 465.9919 329.377 471.9798 323.3894 474.2212 321.1478 475.6238 318.3851 476.187 315.491 475.9741 319.5686 474.3113 323.585 471.1969 326.6994 464.5114 333.3849 453.6717 333.3849 446.9862 326.6994%22 fill-rule=%22evenodd%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")}.ml-slogan{font-size:10px;letter-spacing:.42em;margin:18px 0 36px}.ml-bw{padding-top:4px}}\n\n/* ===== 3D-модели: ровная сетка вместо кнопок T1331 ===== */\n.ml-3d{max-width:1200px;margin:0 auto;padding:6px 20px 26px;font-family:var(--ml-font)}\n.ml-3d-hd{text-align:center;font:400 12px/1 var(--ml-font);letter-spacing:.3em;text-transform:uppercase;color:var(--ml-mut);margin:0 0 18px}\n.ml-3d-grid{display:grid;grid-template-columns:repeat(var(--n,6),minmax(0,1fr));gap:12px}\n.ml-3d-c{display:flex;flex-direction:column;justify-content:space-between;gap:14px;min-height:96px;padding:16px 18px;border-radius:16px;border:1px solid var(--ml-line);background:color-mix(in srgb,var(--ml-l) 60%,#fff);color:var(--ml-ink)!important;text-decoration:none!important;position:relative;overflow:hidden;transition:border-color .25s,transform .25s,box-shadow .25s}\nhtml[data-tod=\"night\"] .ml-3d-c{background:color-mix(in srgb,var(--ml-l) 85%,#fff)}\n.ml-3d-c b{font:600 17px/1.15 var(--ml-font);letter-spacing:.02em}\n.ml-3d-c span{display:flex;justify-content:space-between;align-items:center;font:400 12px/1 var(--ml-font);letter-spacing:.08em;text-transform:uppercase;color:var(--ml-mut)}\n.ml-3d-c i{font-style:normal;font-size:16px;color:var(--ml-amber);transition:transform .25s}\n.ml-3d-c::before{content:\"\";position:absolute;right:-30px;top:-30px;width:110px;height:110px;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--ml-amber) 35%,transparent),transparent);opacity:0;transition:opacity .3s;pointer-events:none}\n.ml-3d-c:hover{border-color:var(--ml-amber);transform:translateY(-2px);box-shadow:0 10px 30px -14px color-mix(in srgb,var(--mlc-graphite,#2F3438) 35%,transparent)}\n.ml-3d-c:hover::before{opacity:1}\n.ml-3d-c:hover i{transform:translate(2px,-2px)}\nhtml[data-tod=\"night\"] .t-rec[data-bg-color=\"#f4f4fb\"] > .ml-3d{filter:none}\n@media (max-width:980px){.ml-3d-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}\n@media (max-width:640px){.ml-3d{padding:4px 12px 20px}.ml-3d-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ml-3d-c{min-height:78px;padding:13px 14px;border-radius:14px}.ml-3d-c b{font-size:15px}.ml-3d-c span{font-size:10px}}\n\n/* ===== фирменный стиль для блоков самой Тильды (брендбук: графит, янтарь, Avenir Next) ===== */\nhtml:not(.ml-nobrand) :is(.t-title,.t-descr,.t-text,.t-name,.t-uptitle,.t-heading,.t-menu__link-item,.t-menusub__link-item,.t-btn,.t-submit,.t-input,.t-input-title,.t-store,.t706,.t985,.t-popup,.t-catalog,.t-store__card,.js-store-prod-name,.js-product-price,.t-store__filter,.t-form){font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) body{color:var(--ml-ink)}\n/* заголовки секций: тонкие, капслок, разрядка */\nhtml:not(.ml-nobrand) .t-section__title{font-weight:300!important;text-transform:uppercase;letter-spacing:.16em;font-size:clamp(22px,2.9vw,36px)!important;line-height:1.25!important}\nhtml:not(.ml-nobrand) .t-section__title::before{content:\"\";display:block;width:30px;height:30px;margin:0 auto 18px;background:var(--ml-star) center/contain no-repeat}\nhtml:not(.ml-nobrand) .t-section__descr{font-weight:300!important;letter-spacing:.14em;text-transform:uppercase;font-size:clamp(16px,1.8vw,22px)!important;line-height:1.5!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#f4f4fb\"] .t-section__title,html:not(.ml-nobrand) .t-rec[data-bg-color=\"#f4f4fb\"] .t-section__descr{color:var(--ml-d)!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] .t-section__title,html:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] .t-section__descr{color:#F3F4F5!important}\n/* обложка */\nhtml:not(.ml-nobrand) .t183__title{font-weight:300!important;text-transform:uppercase;letter-spacing:.14em;font-size:clamp(26px,4.6vw,64px)!important;line-height:1.18!important;color:#fff!important;font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) .t183__title span{color:inherit!important;font-family:inherit!important}\nhtml:not(.ml-nobrand) .t183__title br+br{display:none}\nhtml:not(.ml-nobrand) .t183__title span+br+br+span,html:not(.ml-nobrand) .t183__title br+span:last-child{color:var(--ml-amber)!important;text-shadow:0 0 50px color-mix(in srgb,var(--ml-amber) 45%,transparent)}\n.ml-hero-eye{display:block;font:300 13px/1 var(--ml-font);letter-spacing:.62em;padding-left:.62em;text-transform:lowercase;color:rgba(255,255,255,.72);margin:0 0 26px;text-align:center}\n.ml-hero-eye::before{content:\"\";display:block;width:30px;height:30px;margin:0 auto 20px;background:var(--ml-star) center/contain no-repeat}\n@media (max-width:640px){.ml-hero-eye{font-size:10px;letter-spacing:.42em;margin-bottom:16px}.ml-hero-eye::before{width:22px;height:22px;margin-bottom:14px}}\n/* шапка: меню */\nhtml:not(.ml-nobrand) .t3113 .t-menu__link-item{font-size:13px!important;font-weight:400!important;letter-spacing:.12em;text-transform:uppercase;color:var(--ml-d)!important;transition:color .2s}\nhtml:not(.ml-nobrand) .t3113 .t-menu__link-item:hover{color:var(--ml-amber)!important}\nhtml:not(.ml-nobrand) .t3113 .t-menusub__link-item{font-size:15px!important;color:var(--ml-d)!important}\nhtml:not(.ml-nobrand) .t3113 .t-menusub__link-item:hover{color:var(--ml-amber)!important}\nhtml:not(.ml-nobrand) .t3113 svg [stroke=\"#333333\"]{stroke:var(--ml-d)}\nhtml:not(.ml-nobrand) .t3113 svg [fill=\"#333333\"]{fill:var(--ml-d)}\n/* кнопки: пилюля; графит на светлом, светлая на тёмном; свечение янтарём */\nhtml:not(.ml-nobrand) :is(.t-btn,.t-submit,.t-store__card__btn,.t706__sidebar-continue,.t-store .t-btn){border-radius:30px!important;font-weight:600!important;letter-spacing:.06em;transition:transform .15s,box-shadow .25s,background-color .25s,color .25s!important}\nhtml:not(.ml-nobrand) :is(.t-submit,.t3113 .t-btn,.t-store__card__btn,.t706 .t-submit){background-color:var(--ml-d)!important;color:#F3F4F5!important;border:0!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] :is(.t-btn,.t-store__card__btn){background-color:#F3F4F5!important;color:var(--ml-d)!important;border:0!important}\nhtml:not(.ml-nobrand) :is(.t-btn,.t-submit,.t-store__card__btn):hover{transform:translateY(-1px);box-shadow:0 0 0 1px var(--ml-amber),0 0 26px color-mix(in srgb,var(--ml-amber) 45%,transparent)}\n/* ховер кнопки — «свет включился»: янтарная заливка вместо розового #ffd5d3 из настроек шапки Тильды (там правило с #rec…, поэтому :not(#ml_x) для веса id) */\nhtml:not(.ml-nobrand) body :is(.t-btn,.t-submit,.t-store__card__btn,.t-btnflex.t-btnflex_type_button):not(#ml_x):hover{background-color:var(--ml-amber)!important;border-color:var(--ml-amber)!important;color:var(--mlc-graphite,#2F3438)!important}\nhtml:not(.ml-nobrand) body :is(.t-btn,.t-submit,.t-store__card__btn,.t-btnflex.t-btnflex_type_button):not(#ml_x):hover :is(.t-btnflex__text,span){color:var(--mlc-graphite,#2F3438)!important}\nhtml:not(.ml-nobrand) .t-submit{height:48px!important;padding:0 32px!important}\nhtml:not(.ml-nobrand) .t-btnflex__icon{display:none!important}\n/* формы */\nhtml:not(.ml-nobrand) .t-input{font-size:16px!important;color:var(--ml-ink)!important;border-color:var(--ml-line)!important;background:transparent!important;transition:border-color .2s}\nhtml:not(.ml-nobrand) .t-input:focus{border-color:var(--ml-amber)!important;outline:0}\nhtml:not(.ml-nobrand) .t-input::placeholder{color:var(--ml-mut)!important;opacity:1}\nhtml:not(.ml-nobrand) .t-input-title{font-size:12px!important;letter-spacing:.14em;text-transform:uppercase;color:var(--ml-mut)!important}\nhtml:not(.ml-nobrand) .t718__contacts{font-size:15px!important;line-height:1.7!important;color:var(--ml-ink)!important}\n/* каталог */\nhtml:not(.ml-nobrand) .js-store-prod-name{font-weight:600!important;letter-spacing:.01em}\nhtml:not(.ml-nobrand) .t-store__card__price,html:not(.ml-nobrand) .js-product-price{font-weight:300!important;letter-spacing:.02em}\nhtml:not(.ml-nobrand) .t-store__card__imgwrapper,html:not(.ml-nobrand) .t-store__card__bgimg{border-radius:16px;overflow:hidden}\nhtml:not(.ml-nobrand) .t-store__card:hover .js-store-prod-name{color:var(--ml-amber)!important}\n/* галерея работ */\nhtml:not(.ml-nobrand) .t603__blockimg{transition:transform .5s,filter .5s;filter:saturate(.92)}\nhtml:not(.ml-nobrand) .t603__tile:hover .t603__blockimg{transform:scale(1.03);filter:none}\nhtml:not(.ml-nobrand) .t603__tile{overflow:hidden}\n/* кнопка «наверх» */\nhtml:not(.ml-nobrand) .t890__arrow{background-color:var(--ml-d)!important;border:1px solid color-mix(in srgb,var(--ml-amber) 60%,transparent)!important;box-shadow:0 0 18px -4px color-mix(in srgb,var(--ml-amber) 55%,transparent)}\n/* корзина, поиск, попапы */\nhtml:not(.ml-nobrand) .t706__carticon-counter{background-color:var(--ml-amber)!important;color:var(--ml-d)!important}\nhtml:not(.ml-nobrand) .t706__product-title,html:not(.ml-nobrand) .t706__cartwin-heading{font-weight:600!important}\n/* контакты: убрать ручной Arial/20px, единый ритм */\nhtml:not(.ml-nobrand) :is(.t718__contacts,.t718__address) :is(div,span){font-family:inherit!important;font-size:inherit!important;color:inherit!important}\nhtml:not(.ml-nobrand) .t718__contacts{font-size:15px!important;font-weight:400!important;line-height:1.7!important}\nhtml:not(.ml-nobrand) :is(.t718__contacts,.t718__address)::first-line{font-weight:600}\nhtml:not(.ml-nobrand) .t718__address{font-size:15px!important;font-weight:400!important;opacity:1!important;margin-top:22px!important;line-height:1.7!important;color:var(--ml-ink)!important;font-family:var(--ml-font)!important}\n/* ссылка «Смотреть работы» (галерея): янтарная пилюля */\nhtml:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 26px;margin-top:6px;border:1px solid var(--ml-amber)!important;border-radius:30px;color:var(--ml-amber)!important;font-size:13px!important;letter-spacing:.16em;transition:background-color .25s,color .25s,box-shadow .25s}\nhtml:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]::after{content:\"→\"}\nhtml:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]:hover{background:var(--ml-amber);color:var(--ml-d)!important;box-shadow:0 0 30px color-mix(in srgb,var(--ml-amber) 50%,transparent)}\nhtml:not(.ml-nobrand) .t-section__descr span{color:inherit!important}\n/* ночь: содержимое светлых блоков и шапки инвертируется фильтром — внутри держим дневные цвета */\nhtml[data-tod=\"night\"] :is(.t-rec[data-bg-color=\"#f4f4fb\"] > :not(.ml-keep):not(.ml-3d),.t3113__firstlevel,.t3113__secondlevel,.tmenu-mobile,.t3113__popover){--ml-ink:var(--mlc-graphite,#2F3438);--ml-mut:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));--ml-line:color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent);--ml-d:var(--mlc-graphite,#2F3438)}\n@media (max-width:640px){html:not(.ml-nobrand) .t-section__title{font-size:22px!important;letter-spacing:.12em}html:not(.ml-nobrand) .t-section__descr,html:not(.ml-nobrand) .t-section__descr :is(p,span){font-size:17px!important;letter-spacing:.1em}html:not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]{font-size:12px!important;height:40px}}\n/* каталог (новый блок t-catalog) */\nhtml:not(.ml-nobrand) .t-catalog__card{border-radius:18px!important;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 10%,transparent)!important;background:#fff!important;overflow:hidden;transition:transform .25s,box-shadow .25s,border-color .25s}\nhtml:not(.ml-nobrand) .t-catalog__card:hover{transform:translateY(-3px);border-color:var(--ml-amber)!important;box-shadow:0 18px 40px -18px rgba(0,0,0,.45),0 0 30px -10px color-mix(in srgb,var(--ml-amber) 50%,transparent)}\nhtml:not(.ml-nobrand) .t-catalog__card__title{font-size:15px!important;font-weight:600!important;line-height:1.35!important;color:var(--ml-d)!important;font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) .t-catalog__card:hover .t-catalog__card__title{color:var(--mlc-moon-deep,#5F7896)!important}\nhtml:not(.ml-nobrand) :is(.t-catalog__card__price,.t-catalog__card__price-value,.t-catalog__card__price-currency){font-family:var(--ml-font)!important;font-weight:400!important;color:var(--ml-d)!important;letter-spacing:.02em}\nhtml:not(.ml-nobrand) .t-catalog__card__price_old *{color:var(--ml-mut)!important}\nhtml:not(.ml-nobrand) .t-rec[data-bg-color=\"#201f1f\"] .t-catalog__card .t-btn{background-color:var(--ml-d)!important;color:#F3F4F5!important}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base,html:not(.ml-nobrand) .t-catalog__parts-above-item{font-family:var(--ml-font)!important}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base{border-radius:18px!important;border-color:rgba(255,255,255,.14)!important;transition:border-color .25s,box-shadow .25s}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base:hover,html:not(.ml-nobrand) .t-catalog__parts-button-base[class*=\"active\"]{border-color:var(--ml-amber)!important;box-shadow:0 0 24px -8px color-mix(in srgb,var(--ml-amber) 60%,transparent)}\nhtml:not(.ml-nobrand) .t-catalog__parts-button-base *{font-family:var(--ml-font)!important;letter-spacing:.04em}\n/* «Каталог» в шапке */\n.ml-hcat{display:inline-flex;align-items:center;gap:9px;height:32px;margin-left:26px;padding:0 14px 0 11px;border:1px solid rgba(32,31,31,.22);border-radius:30px;color:var(--mlc-graphite,#2F3438)!important;text-decoration:none!important;font:600 12px/1 var(--ml-font);letter-spacing:.16em;text-transform:uppercase;white-space:nowrap;transition:color .2s,border-color .2s,box-shadow .2s;align-self:center}\n.ml-hcat svg{width:16px;height:16px;flex:none}\n.ml-hcat:hover{border-color:var(--ml-amber);box-shadow:0 0 18px -6px var(--ml-amber)}\n.t3113__firstlevel__leftwrapper:has(.ml-hcat){display:flex;align-items:center;flex-wrap:nowrap}\n.ml-hcat{margin-left:14px}\n@media (max-width:980px){.ml-hcat{display:none!important}}\n\n/* ===== каталог: панель разделов + шторка ===== */\n.ml-cat{display:grid;grid-template-columns:300px minmax(0,1fr);gap:28px;max-width:1440px;margin:0 auto;padding:0 20px;position:relative;font-family:var(--ml-font);color:#F3F4F5}\n.ml-cat *{box-sizing:border-box}\n.ml-cat button{font-family:inherit;margin:0}\n.ml-cat svg{width:22px;height:22px;flex:none}\n.ml-cat-open,.ml-cat-x,.ml-cat-dim,.ml-cat-acc{display:none}\n.ml-cat-side{position:sticky;top:92px;align-self:start;z-index:30}\n.ml-cat-panel{background:color-mix(in srgb,var(--ml-d) 88%,#fff);border:1px solid rgba(255,255,255,.09);border-radius:22px;padding:10px;position:relative;z-index:2}\n.ml-cat-hd{display:flex;justify-content:space-between;align-items:center;padding:14px 14px 12px;font:400 12px/1 var(--ml-font);letter-spacing:.3em;text-transform:uppercase;color:#AAACAE}\n.ml-cat-list{list-style:none;margin:0;padding:0}\n.ml-cat-row{display:flex;align-items:center;gap:14px;width:100%;padding:14px;border:0;border-radius:14px;background:transparent;color:#F3F4F5;text-align:left;cursor:pointer;transition:background-color .2s,color .2s}\n.ml-cat-row svg{color:#AAACAE;transition:color .2s,filter .2s}\n.ml-cat-row span{flex:1;display:flex;flex-direction:column;gap:4px;font:600 15px/1.2 var(--ml-font)}\n.ml-cat-row small{font:400 12px/1 var(--ml-font);color:#8E9196;letter-spacing:.02em}\n.ml-cat-row i{font-style:normal;font-size:20px;color:#8E9196;transition:transform .25s,color .2s}\n.ml-cat-row:hover,.ml-cat-row.on{background:rgba(255,255,255,.07)}\n.ml-cat-row:hover svg,.ml-cat-row.on svg{color:var(--ml-amber);filter:drop-shadow(0 0 6px color-mix(in srgb,var(--ml-amber) 70%,transparent))}\n.ml-cat-row.on i{color:var(--ml-amber);transform:translateX(3px)}\n.ml-cat-help{display:block;margin:10px 4px 4px;padding:16px;border-radius:16px;border:1px dashed color-mix(in srgb,var(--ml-amber) 45%,transparent);color:#AAACAE!important;text-decoration:none!important;font:400 13px/1.45 var(--ml-font);transition:border-color .2s,background-color .2s}\n.ml-cat-help b{display:block;color:var(--ml-amber);font:600 14px/1.3 var(--ml-font);margin-bottom:4px}\n.ml-cat-help:hover{border-style:solid;background:color-mix(in srgb,var(--ml-amber) 8%,transparent)}\n/* шторка */\n.ml-sh{position:absolute;left:calc(100% - 18px);top:0;width:min(780px,calc(100vw - 380px));min-height:100%;padding-left:18px;pointer-events:none;visibility:hidden;z-index:1;display:flex}\n.ml-sh-in{flex:1}\n.ml-sh.open{pointer-events:auto;visibility:visible}\n.ml-sh-in{min-height:100%;height:100%;background:var(--ml-l);color:var(--ml-ink);border-radius:0 22px 22px 0;padding:30px 34px 34px;box-shadow:30px 30px 70px -30px rgba(0,0,0,.6);position:relative;\n  clip-path:inset(0 100% 0 0 round 0 22px 22px 0);transition:clip-path .45s cubic-bezier(.2,.8,.2,1)}\n.ml-sh.open .ml-sh-in{clip-path:inset(0 0 0 0 round 0 22px 22px 0)}\n.ml-sh-in::before{content:\"\";position:absolute;left:0;top:18px;bottom:18px;width:2px;border-radius:2px;background:var(--ml-amber);box-shadow:0 0 18px 2px color-mix(in srgb,var(--ml-amber) 60%,transparent)}\n.ml-sh-hd{display:flex;align-items:center;gap:16px;margin-bottom:22px}\n.ml-sh-hd > span{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--ml-amber) 14%,transparent);color:var(--mlc-moon-deep,#5F7896)}\n.ml-sh-hd svg{width:26px;height:26px}\n.ml-sh-hd b{display:block;font:300 24px/1.15 var(--ml-font);text-transform:uppercase;letter-spacing:.12em}\n.ml-sh-hd small{display:block;margin-top:6px;font:400 12px/1 var(--ml-font);letter-spacing:.14em;text-transform:uppercase;color:var(--ml-mut)}\n.ml-sh-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:28px}\n.ml-sh-links a{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 2px;border-bottom:1px solid var(--ml-line);color:var(--ml-ink)!important;text-decoration:none!important;font:400 15px/1.3 var(--ml-font);transition:color .2s,padding .25s}\n.ml-sh-links a i{font-style:normal;color:var(--ml-amber);opacity:0;transform:translateX(-6px);transition:opacity .2s,transform .25s}\n.ml-sh-links a:hover{color:var(--mlc-moon-deep,#5F7896)!important;padding-left:8px}\n.ml-sh-links a:hover i{opacity:1;transform:none}\n.ml-sh.in .ml-sh-links a,.ml-sh.in .ml-sh-brands a{animation:mlshin .5s both}\n.ml-sh.in :is(.ml-sh-links,.ml-sh-brands) a:nth-child(2){animation-delay:.03s}.ml-sh.in :is(.ml-sh-links,.ml-sh-brands) a:nth-child(3){animation-delay:.06s}\n.ml-sh.in :is(.ml-sh-links,.ml-sh-brands) a:nth-child(4){animation-delay:.09s}.ml-sh.in :is(.ml-sh-links,.ml-sh-brands) a:nth-child(5){animation-delay:.12s}\n.ml-sh.in :is(.ml-sh-links,.ml-sh-brands) a:nth-child(6){animation-delay:.15s}.ml-sh.in :is(.ml-sh-links,.ml-sh-brands) a:nth-child(n+7){animation-delay:.18s}\n@keyframes mlshin{from{opacity:0;transform:translateY(6px)}}\n.ml-sh-brands{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}\n.ml-sh-brands a{display:grid;place-items:center;height:76px;border-radius:14px;border:1px solid var(--ml-line);background:color-mix(in srgb,var(--ml-l) 50%,#fff);transition:border-color .2s,box-shadow .2s}\n.ml-sh-brands img{max-width:76%;max-height:38px;object-fit:contain;filter:grayscale(1);opacity:.7;transition:filter .2s,opacity .2s}\n.ml-sh-brands a:hover{border-color:var(--ml-amber);box-shadow:0 0 22px -8px color-mix(in srgb,var(--ml-amber) 70%,transparent)}\n.ml-sh-brands a:hover img{filter:none;opacity:1}\nhtml[data-tod=\"night\"] .ml-sh-brands img{filter:grayscale(1) invert(1);opacity:.75}\n/* товары справа */\n.ml-cat-main{min-width:0}\n.ml-cat-top{display:flex;align-items:center;gap:20px;margin:0 0 18px}\n.ml-cat-ttl{flex:none;font:400 12px/1 var(--ml-font);letter-spacing:.3em;text-transform:uppercase;color:#AAACAE}\n.ml-chips-w{display:flex;align-items:center;gap:8px;min-width:0;flex:1}\n.ml-chips{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:4px 2px;user-select:none;--fl:#000;--fr:#000;-webkit-mask-image:linear-gradient(90deg,var(--fl),#000 64px,#000 calc(100% - 64px),var(--fr));mask-image:linear-gradient(90deg,var(--fl),#000 64px,#000 calc(100% - 64px),var(--fr))}\n.ml-chips-w.can-l .ml-chips{--fl:transparent}\n.ml-chips-w.can-r .ml-chips{--fr:transparent}\n.ml-chips.drag{cursor:grabbing}\n.ml-chips.drag button{pointer-events:none}\n.ml-chips{flex:1;min-width:0}\n.ml-cat .ml-chips-ar{flex:none;display:none;align-items:center;justify-content:center;width:38px!important;height:38px!important;margin:0!important;padding:0!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.22)!important;background:transparent!important;color:#F3F4F5!important;cursor:pointer;transition:border-color .2s,box-shadow .2s}\n.ml-cat .ml-chips-ar svg{width:16px;height:16px;display:block}\n.ml-chips-w.can-l .ml-chips-ar.l,.ml-chips-w.can-r .ml-chips-ar.r{display:flex}\n.ml-cat .ml-chips-ar:hover{border-color:var(--ml-amber)!important;box-shadow:0 0 16px -4px var(--ml-amber)}\n@media (hover:none){.ml-cat .ml-chips-ar{display:none!important}}\n/* «Загрузить ещё»: отступ от карточек, по центру, в стиле кнопок сайта */\n.ml-cat .t-catalog__load-more-btn-wrap{display:flex!important;justify-content:center;margin:40px 0 8px!important;padding:0!important;width:100%!important}\n.ml-cat .t-catalog__load-more-btn{margin:0!important;height:48px!important;padding:0 34px!important}\n.ml-cur{margin-left:.3em}\n.ml-chips::-webkit-scrollbar{display:none}\n.ml-chips button{flex:none;height:38px;padding:0 16px;border-radius:30px;border:1px solid rgba(255,255,255,.18);background:transparent;color:#E4E5E7;font:400 13px/1 var(--ml-font);letter-spacing:.03em;cursor:pointer;white-space:nowrap;transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s}\n.ml-chips button:hover{border-color:var(--ml-amber)}\n.ml-chips button.on{background:#F3F4F5;color:var(--ml-d);border-color:#F3F4F5;box-shadow:0 0 20px -6px color-mix(in srgb,var(--ml-amber) 70%,transparent)}\n.ml-cat .t-catalog__cont-w-filter,.ml-cat .t-catalog__grid-cont{padding-left:0!important;padding-right:0!important;max-width:none!important;width:100%!important}\n.ml-cat .t-catalog__cont-wrapper,.ml-cat .js-catalog-grid-cont{width:100%!important;max-width:none!important;margin:0!important}\n.ml-cat .t-catalog__card-list{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0!important;width:100%!important}\n.ml-cat .t-catalog__card{width:auto!important;max-width:none!important;margin:0!important}\n@media (min-width:1500px){.ml-cat .t-catalog__card-list{grid-template-columns:repeat(4,minmax(0,1fr))}}\n/* телефон / планшет: кнопка «Каталог товаров», панель выезжает слева */\n@media (max-width:980px){\n  .ml-cat{grid-template-columns:minmax(0,1fr);gap:14px;padding:0 12px}\n  .ml-cat-open{display:flex;align-items:center;gap:12px;width:100%;height:54px;padding:0 20px;border-radius:30px;border:1px solid rgba(255,255,255,.16);background:color-mix(in srgb,var(--ml-d) 85%,#fff);color:#F3F4F5;font:600 15px/1 var(--ml-font);cursor:pointer}\n  .ml-cat-open svg{color:var(--ml-amber)}\n  .ml-cat-open span{flex:1;text-align:left}\n  .ml-cat-side{position:fixed;left:0;top:0;bottom:0;width:min(88vw,380px);z-index:100000;transform:translateX(-104%);transition:transform .4s cubic-bezier(.2,.8,.2,1);visibility:hidden}\n  .ml-cat.drawer .ml-cat-side{transform:none;visibility:visible}\n  .ml-cat-panel{height:100%;overflow-y:auto;border-radius:0 22px 22px 0;border-left:0;padding:8px 8px 24px;overscroll-behavior:contain}\n  .ml-cat-x{display:block;border:0;background:rgba(255,255,255,.08);color:#F3F4F5;width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:14px}\n  .ml-cat-dim{display:block;position:fixed;inset:0;background:rgba(10,12,14,.55);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);z-index:99999;opacity:0;pointer-events:none;transition:opacity .3s}\n  .ml-cat.drawer .ml-cat-dim{opacity:1;pointer-events:auto}\n  .ml-sh{display:none}\n  .ml-cat-row i{transition:transform .25s}\n  .ml-cat-list li.open .ml-cat-row{background:rgba(255,255,255,.07)}\n  .ml-cat-list li.open .ml-cat-row i{transform:rotate(90deg);color:var(--ml-amber)}\n  .ml-cat-list li.open .ml-cat-row svg{color:var(--ml-amber)}\n  .ml-cat-acc{display:block;max-height:0;overflow:hidden;transition:max-height .35s ease}\n  .ml-cat-list li.open .ml-cat-acc{max-height:1200px}\n  .ml-cat-acc .ml-sh-links{grid-template-columns:1fr;padding:2px 14px 10px 50px}\n  .ml-cat-acc .ml-sh-links a{color:#E4E5E7!important;border-color:rgba(255,255,255,.08);font-size:14px;padding:12px 0}\n  .ml-cat-acc .ml-sh-links a i{opacity:1;transform:none}\n  .ml-cat-acc .ml-sh-brands{grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 10px 12px}\n  .ml-cat-acc .ml-sh-brands a{height:60px;background:#F3F4F5;border-color:transparent}\n  .ml-cat-acc .ml-sh-brands img{filter:grayscale(1)!important;opacity:.8}\n  .ml-cat .t-catalog__card-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n  .ml-cat-top{flex-direction:column;align-items:stretch;gap:10px}\n  .ml-cat-ttl{display:none}\n}\nhtml.ml-noscroll,html.ml-noscroll body{overflow:hidden}\n@media (prefers-reduced-motion:reduce){.ml-sh-in,.ml-cat-side{transition:none}.ml-sh.in a{animation:none!important}}\n/* хлебные крошки каталога («Главная / Техническое освещение / Споты»): светлые на графите */\n.t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *),.t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *) *{color:#AAACAE!important;font-family:var(--ml-font)!important}\n.t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *) a{transition:color .2s;text-decoration:none!important}\n.t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *) a:hover{color:var(--ml-amber)!important}\n.t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *) :is(span,div,li):last-child:not(:has(a)){color:#F3F4F5!important}\n.t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *) svg *{stroke:#AAACAE!important;fill:none}\n/* верхняя строка меню с разделами скрыта — разделы в панели каталога */\n@media (min-width:981px){html:not(.ml-nobrand) .t3113__secondlevel{display:none!important}}\n/* ---------- каталог на главной: наши разделы и карточки (.ml-hc) */\n.ml-hc{--mk-ink:#F3F4F5;--mk-mut:#AAACAE;--mk-line:rgba(255,255,255,.1);--mk-card:var(--mlc-light,#F4F5F6);font-family:var(--ml-font);color:var(--mk-ink);margin-top:18px}\n.ml-hc *,.mk-pop,.mk-pop *{box-sizing:border-box}\n.mk-pop{font-family:var(--ml-font)}\n.ml-hc button,.mk-pop button{font-family:inherit;cursor:pointer}\n.ml-hc-hd{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin:0 0 18px}\n.ml-hc-hd b{font:300 24px/1.2 var(--ml-font);letter-spacing:.02em;color:var(--mk-ink)}\n.ml-hc-hd span{font-size:13px;color:var(--mk-mut);letter-spacing:.04em}\n.ml-hc-hd a{margin-left:auto;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 18px;border-radius:30px;border:1px solid color-mix(in srgb,var(--mlc-moon,#BCD0E6) 55%,transparent);color:var(--mk-ink);font-size:13px;letter-spacing:.04em;text-decoration:none;transition:border-color .2s,box-shadow .2s}\n.ml-hc-hd a:hover{border-color:var(--ml-amber);box-shadow:0 0 22px -8px var(--ml-amber)}\n.ml-hc-hd a i{font-style:normal;color:var(--ml-amber)}\n.ml-hc .mk-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}\n.ml-hc-tile{text-decoration:none}\n.ml-hc-tile h3{margin-bottom:6px}\n.ml-hc-tile .mk-sku{margin-bottom:2px}\n.ml-hc-load{grid-column:1/-1;padding:80px 20px}\n@media (min-width:1500px){.ml-hc .mk-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}\n@media (max-width:980px){\n  .ml-hc .mk-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n  .ml-hc-hd b{font-size:20px}\n  .ml-hc-hd a{margin-left:0;height:34px;padding:0 14px}\n}\n.ml-sh-brands a.ml-br-txt{font:600 13px/1.2 var(--ml-font);letter-spacing:.08em;text-transform:uppercase;color:var(--ml-d);text-decoration:none;text-align:center;padding:0 8px;opacity:.75;transition:opacity .2s,border-color .2s,box-shadow .2s}\n.ml-sh-brands a.ml-br-txt:hover{opacity:1}\nhtml[data-tod=\"night\"] .ml-sh-brands a.ml-br-txt{color:#F3F4F5}\n/* ---------- карточка товара (всплывающее окно каталога Тильды) */\n.t-popup:has(.ml-pp-on){background:rgba(18,20,23,.72)!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}\n.t-popup:has(.ml-pp-on) .t-popup__container{background:var(--mlc-light,#F4F5F6)!important;border-radius:26px!important;max-width:1180px!important;width:calc(100% - 64px)!important;box-shadow:0 40px 120px -30px rgba(0,0,0,.6)!important;overflow:hidden}\n.t-popup:has(.ml-pp-on) .t-catalog__prod-popup__container{padding:34px 40px 40px!important;max-width:none!important}\n.t-popup:has(.ml-pp-on) .t-popup__close{width:46px!important;height:46px!important;border-radius:50%;background:color-mix(in srgb,var(--mlc-light,#F4F5F6) 12%,transparent);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;transition:border-color .2s,box-shadow .2s;top:22px!important;right:22px!important}\n.t-popup:has(.ml-pp-on) .t-popup__close:hover{border-color:var(--ml-amber);box-shadow:0 0 18px -4px var(--ml-amber)}\n.t-popup:has(.ml-pp-on) .t-popup__close svg{width:18px;height:18px}\n.t-popup:has(.ml-pp-on) .t-popup__close svg g,.t-popup:has(.ml-pp-on) .t-popup__close svg path,.t-popup:has(.ml-pp-on) .t-popup__close svg rect{stroke:#F3F4F5!important;fill:#F3F4F5}\n.ml-pp-on,.ml-pp-on *{font-family:var(--ml-font)!important}\n.t-rec .ml-pp-on .t-catalog__breadcrumbs,.t-rec .ml-pp-on .t-catalog__breadcrumbs :is(span,div,li,a){color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;font-size:12px!important;letter-spacing:.04em}\n.t-rec .ml-pp-on .t-catalog__breadcrumbs .t-catalog__breadcrumbs-item_active *{color:var(--mlc-graphite,#2F3438)!important}\n.t-popup:has(.ml-pp-on) .t-catalog__prod-popup__close-txt-wr{display:none!important}\n.ml-pp-on .t-catalog__breadcrumbs-item_clickable:hover *{color:var(--ml-amber)!important}\n.ml-pp-on .t-catalog__prod-popup__breadcrumbs{margin-bottom:22px!important}\n/* две колонки: фото | описание */\n.ml-pp-on > div:has(.t-catalog__prod-popup__info){display:grid!important;grid-template-columns:minmax(0,1.12fr) minmax(0,1fr);gap:48px;align-items:start}\n.ml-pp-on > div:has(.t-catalog__prod-popup__info) > .t-col:first-child{grid-column:1/-1;margin:0!important;width:auto!important}\n.ml-pp-on .t-catalog__prod-popup__col-left,.ml-pp-on .t-catalog__prod-popup__info{width:auto!important;max-width:none!important;margin:0!important;padding:0!important;float:none!important}\n.ml-pp-on .t-catalog__prod-popup__col-left{position:sticky;top:0;border-radius:20px;overflow:hidden;background:radial-gradient(60% 55% at 50% 42%,#fff 0%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6)) 45%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 15%,var(--mlc-light,#F4F5F6)) 100%);aspect-ratio:1/1;display:flex;align-items:center;justify-content:center}\n.ml-pp-on .t-catalog__prod-popup__col-left::after{content:\"\";position:absolute;left:18%;right:18%;bottom:9%;height:7%;border-radius:50%;background:radial-gradient(closest-side,color-mix(in srgb,var(--mlc-night-deep,#1C1F23) 22%,transparent),transparent);pointer-events:none}\n.ml-pp-on .t-catalog__prod-popup__gallery-column,.ml-pp-on .t-catalog__prod-popup__wrapper{width:100%!important;height:100%!important;display:flex;align-items:center;justify-content:center;background:transparent!important}\n.ml-pp-on .t-catalog__prod-popup__col-left img{max-width:82%!important;max-height:82%!important;width:auto!important;height:auto!important;object-fit:contain;mix-blend-mode:multiply;position:relative;z-index:1;transition:transform .35s cubic-bezier(.2,.8,.2,1);cursor:zoom-in}\n.ml-pp-on .t-catalog__prod-popup__col-left img.ml-zoomed{transform:scale(1.9)}\n.ml-pp-zoomhint{position:absolute;left:16px;bottom:14px;z-index:2;display:flex;align-items:center;gap:7px;font-size:12px;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));transition:opacity .3s}\n.ml-pp-zoomhint svg{width:16px;height:16px}\n.ml-pp-on .t-catalog__prod-popup__col-left:hover .ml-pp-zoomhint{opacity:0}\n/* описание */\n.ml-pp-eye{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:0 0 14px}\n.ml-pp-eye b{font-weight:600;font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--mlc-moon-deep,#5F7896)}\n.ml-pp-eye span{font-size:12px;letter-spacing:.06em;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));padding-left:14px;border-left:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 18%,transparent)}\n.ml-pp-on .t-catalog__prod-popup__brand,.ml-pp-on .t-catalog__prod-popup__sku{display:none!important}\n.ml-pp-on .t-catalog__prod-popup__name{font-weight:300!important;font-size:30px!important;line-height:1.18!important;letter-spacing:.01em!important;color:var(--mlc-graphite,#2F3438)!important;margin:0!important}\n.ml-pp-on .t-catalog__prod-popup__price-wrapper{width:100%!important;margin:26px 0 22px!important;padding:22px 0 0!important;border-top:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 12%,transparent)}\n.ml-pp-on .t-catalog__prod-popup__price{display:flex;align-items:baseline}\n.ml-pp-on .t-catalog__prod-popup__price .t-catalog__prod-popup__price-value{font-weight:300!important;font-size:38px!important;letter-spacing:.01em;color:var(--mlc-graphite,#2F3438)!important}\n.ml-pp-on .t-catalog__prod-popup__price .ml-cur{font-size:18px!important;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;margin-left:.35em}\n.ml-pp-on .t-catalog__prod-popup__price_old .t-catalog__prod-popup__price-value{font-size:18px!important;color:#AAACAE!important}\n.ml-pp-on .t-catalog__prod-popup__btn-wrapper{margin:0!important}\n.ml-pp-on .t-catalog__prod-popup__btn-wrapper .t-btn:not(#ml_x){width:100%!important;height:56px!important;border-radius:30px!important;background:var(--mlc-graphite,#2F3438)!important;color:#F3F4F5!important;border:0!important;margin:0!important}\n.ml-pp-on .t-catalog__prod-popup__btn-wrapper .t-btn:not(#ml_x) .t-btnflex__text{font-size:14px!important;letter-spacing:.16em;text-transform:uppercase;font-weight:500!important;color:inherit!important}\n.ml-pp-on .t-catalog__prod-popup__btn-wrapper .t-btn:not(#ml_x):hover{box-shadow:0 0 0 1px var(--ml-amber),0 10px 30px -10px var(--ml-amber)!important}\n.ml-pp-acts{display:grid;gap:10px;margin:10px 0 0}\n.ml-pp-acts>*{display:flex;align-items:center;justify-content:center;gap:12px;min-height:52px;padding:8px 22px;border-radius:30px;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 22%,transparent);background:transparent;color:var(--mlc-graphite,#2F3438)!important;font:400 14px/1.2 var(--ml-font);letter-spacing:.04em;text-decoration:none!important;cursor:pointer;transition:border-color .2s,box-shadow .2s,background-color .2s}\n.ml-pp-acts>*:hover{border-color:var(--ml-amber);box-shadow:0 0 22px -8px var(--ml-amber)}\n.ml-pp-acts svg{width:20px;height:20px;flex:none}\n.ml-pp-room{border-color:var(--ml-amber)!important;background:color-mix(in srgb,var(--ml-amber) 10%,transparent)!important}\n.ml-pp-room svg{color:var(--mlc-moon-deep,#5F7896)}\n.ml-pp-room span{display:flex;flex-direction:column;text-align:left}\n.ml-pp-room small{font-size:12px;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));letter-spacing:.02em;margin-top:2px}\n.ml-pp-on .t-catalog__prod-popup__text{display:none!important}\n.ml-pp-specs{margin:30px 0 0}\n.ml-pp-txt{font-size:15px;line-height:1.6;color:#45494E;margin:0 0 22px}\n.ml-pp-h{font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));margin:0 0 10px}\n.ml-pp-specs dl{margin:0}\n.ml-pp-specs dl div{display:flex;align-items:baseline;gap:10px;padding:11px 0;border-bottom:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 10%,transparent);font-size:14px}\n.ml-pp-specs dt{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));flex:none}\n.ml-pp-specs dl div::after{content:none}\n.ml-pp-specs dd{margin:0 0 0 auto;color:var(--mlc-graphite,#2F3438);text-align:right}\n.ml-pp-help{margin:26px 0 0;padding:18px 20px;border-radius:18px;background:var(--mlc-graphite,#2F3438);color:#C9CBCE;font-size:13px;line-height:1.5;display:flex;flex-direction:column;gap:8px;position:relative;overflow:hidden}\n.ml-pp-help::before{content:\"\";position:absolute;right:-30px;top:-30px;width:120px;height:120px;background:radial-gradient(closest-side,color-mix(in srgb,var(--ml-amber) 45%,transparent),transparent)}\n.ml-pp-help a{color:var(--ml-amber)!important;text-decoration:none!important;font-weight:500;position:relative}\n/* телефон */\n@media (max-width:980px){\n  .t-popup:has(.ml-pp-on) .t-popup__container{width:100%!important;border-radius:0!important;min-height:100%}\n  .t-popup:has(.ml-pp-on) .t-catalog__prod-popup__container{padding:16px 16px 30px!important}\n  .t-popup:has(.ml-pp-on) .t-popup__close{background:color-mix(in srgb,var(--mlc-graphite,#2F3438) 75%,transparent);top:12px!important;right:12px!important;left:auto!important;z-index:5}\n  .ml-pp-on > div:has(.t-catalog__prod-popup__info){grid-template-columns:minmax(0,1fr);gap:22px}\n  .ml-pp-on .t-catalog__prod-popup__col-left{position:relative;aspect-ratio:1/1}\n  .ml-pp-zoomhint{display:none}\n  .ml-pp-on .t-catalog__prod-popup__name{font-size:23px!important}\n  .ml-pp-on .t-catalog__prod-popup__price .t-catalog__prod-popup__price-value{font-size:30px!important}\n}\n/* отдельная страница товара /tproduct/… — карточка на графитовом фоне страницы */\nhtml.ml-tproduct body{background:var(--mlc-graphite,#2F3438)!important}\n.t-catalog__product-snippet:has(.ml-pp-on){padding:40px 0 60px!important}\n.t-catalog__product-snippet > .t-container.ml-pp-on{background:var(--mlc-light,#F4F5F6);border-radius:26px;max-width:1180px!important;width:calc(100% - 64px)!important;margin:0 auto;padding:34px 40px 40px!important;box-shadow:0 40px 120px -30px rgba(0,0,0,.6);box-sizing:border-box}\n.t-catalog__product-snippet .t-catalog__prod-popup__close-txt-wr{display:none!important}\n@media (max-width:640px){\n  .t-catalog__product-snippet:has(.ml-pp-on){padding:12px 0 32px!important}\n  .t-catalog__product-snippet > .t-container.ml-pp-on{width:calc(100% - 20px)!important;border-radius:20px;padding:20px 16px 24px!important}\n}\n.ml-pp-on > div:has(.t-catalog__prod-popup__info) > .t-catalog__prod-popup__breadcrumbs{grid-column:1/-1;margin:0!important;width:auto!important}\n.ml-pp-on > div:has(.t-catalog__prod-popup__info) > meta{display:none}\nhtml.ml-tproduct .t-rec:has(.t-catalog__product-snippet){background:transparent!important}\nhtml.ml-tproduct .t-catalog__prod-snippet__container > .t-catalog__prod-popup__close-txt-wr{padding:22px 32px 0!important}\nhtml.ml-tproduct .t-catalog__prod-snippet__container .t-catalog__prod-popup__close-txt{color:#AAACAE!important;font:400 13px/1 var(--ml-font)!important;letter-spacing:.08em;text-transform:uppercase;transition:color .2s}\nhtml.ml-tproduct .t-catalog__prod-snippet__container .t-catalog__prod-popup__close-txt:hover{color:var(--ml-amber)!important}\nhtml.ml-tproduct .t-catalog__prod-snippet__container > .t-popup__close{width:46px!important;height:46px!important;border-radius:50%;background:color-mix(in srgb,var(--mlc-light,#F4F5F6) 8%,transparent);border:1px solid rgba(255,255,255,.22);display:flex!important;align-items:center;justify-content:center;top:14px!important;right:22px!important;transition:border-color .2s,box-shadow .2s}\nhtml.ml-tproduct .t-catalog__prod-snippet__container > .t-popup__close:hover{border-color:var(--ml-amber);box-shadow:0 0 18px -4px var(--ml-amber)}\nhtml.ml-tproduct .t-catalog__prod-snippet__container > .t-popup__close svg{width:18px;height:18px}\nhtml.ml-tproduct .t-catalog__prod-snippet__container > .t-popup__close svg :is(g,path,rect){stroke:#F3F4F5!important;fill:#F3F4F5}\n/* своя шапка на странице товара (у Тильды там шапки сайта нет) */\nhtml.ml-tproduct .t-catalog__prod-snippet__container > .t-catalog__prod-popup__close-txt-wr,html.ml-tproduct .t-catalog__prod-snippet__container > .t-popup__close{display:none!important}\n.ml-tp-bar{position:sticky;top:0;z-index:50;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;height:72px;padding:0 32px;background:color-mix(in srgb,var(--mlc-graphite,#2F3438) 86%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08);font-family:var(--ml-font)}\n.ml-tp-bar a,.ml-tp-bar button{color:#D9DADC;text-decoration:none;font:400 12px/1 var(--ml-font);letter-spacing:.12em;text-transform:uppercase;background:none;border:0;padding:0;cursor:pointer;transition:color .2s;display:inline-flex;align-items:center;gap:8px}\n.ml-tp-bar a:hover,.ml-tp-bar button:hover{color:var(--ml-amber)}\n.ml-tp-bar svg{width:18px;height:18px;flex:none}\n.ml-tp-l{justify-self:start}\n/* живой логотип, как в шапке главной (.ml-hlogo-w/-s из extras.css): ночью светлый с лунным сиянием */\n.ml-tp-logo{display:flex!important;flex-direction:column;align-items:center;gap:7px!important;width:200px;text-decoration:none;\n  --hb:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6));--hs:color-mix(in srgb,color-mix(in srgb,var(--mlc-moon-day,#7895B5) 20%,var(--mlc-light,#F4F5F6)) 62%,transparent);--h1:#FFFFFF;--h2:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 90%,transparent);filter:drop-shadow(0 0 7px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 45%,transparent));transition:filter .4s!important}\n.ml-tp-logo:hover{filter:drop-shadow(0 0 12px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 75%,transparent))}\n.ml-tp-logo .ml-hlogo-s{font-size:9px}\n.ml-tp-r{justify-self:end;display:flex;align-items:center;gap:26px}\n.ml-tp-cart{position:relative}\n.ml-tp-cart b{position:absolute;top:-8px;right:-10px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:var(--ml-amber);color:var(--mlc-graphite,#2F3438);font:700 10px/17px var(--ml-font);letter-spacing:0;text-align:center}\n.ml-tp-cart b:empty{display:none}\n@media (max-width:640px){\n  .ml-tp-bar{height:58px;padding:0 14px;gap:10px}\n  .ml-tp-logo{width:132px;gap:0!important}\n  .ml-tp-logo .ml-hlogo-s{display:none}\n  .ml-tp-bar .ml-tp-txt{display:none}\n  .ml-tp-r{gap:18px}\n}\nhtml.ml-tproduct .t706__carticon{display:none!important}\n.ml-pp-on .t-catalog__prod-popup__col-left > .t-slds{width:100%;flex:1 1 100%;align-self:stretch}\n.t-catalog__product-snippet:has(.ml-pp-on){padding-top:24px!important}\n/* ---------- страница серии KRANZ ROUND */\n.mk-root{--mk-bg:var(--mlc-graphite,#2F3438);--mk-ink:#F3F4F5;--mk-mut:#AAACAE;--mk-line:rgba(255,255,255,.1);--mk-card:var(--mlc-light,#F4F5F6);--mk-sw:#141214;background:var(--mk-bg);color:var(--mk-ink);font-family:var(--ml-font);padding:28px 0 90px;min-height:70vh}\n.mk-root *{box-sizing:border-box}\n.mk-root button{font-family:inherit;margin:0;cursor:pointer}\n.mk-load{text-align:center;color:var(--mk-mut);padding:120px 20px;font-size:15px;letter-spacing:.04em}\n.mk-wrap{max-width:1240px;margin:0 auto;padding:0 32px}\n.mk-crumbs{display:flex;flex-wrap:wrap;gap:8px;font-size:12px;letter-spacing:.06em;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));margin-bottom:26px}\n.mk-crumbs a{color:#9C9FA3;text-decoration:none;transition:color .2s}\n.mk-crumbs a:hover{color:var(--ml-amber)}\n.mk-crumbs b{font-weight:400;color:var(--mk-ink)}\n/* герой */\n.mk-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:56px;align-items:center;margin-bottom:56px}\n.mk-eye{font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--ml-amber);margin-bottom:18px}\n.mk-hero h1{font:200 clamp(38px,5.4vw,72px)/1.02 var(--ml-font);letter-spacing:.14em;text-transform:uppercase;margin:0 0 22px;color:#fff}\n.mk-hero p{color:var(--mk-mut);font-size:16px;line-height:1.6;max-width:46ch;margin:0 0 30px}\n.mk-cols{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:34px}\n.mk-col{display:inline-flex;align-items:center;gap:10px;height:46px;padding:0 18px 0 8px;border-radius:30px;border:1px solid var(--mk-line);background:rgba(255,255,255,.03);color:var(--mk-ink);font-size:14px;transition:border-color .2s,background .2s,box-shadow .2s}\n.mk-col i{width:30px;height:30px;border-radius:50%;background:var(--sw);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),inset 0 -6px 10px rgba(0,0,0,.18),inset 0 5px 8px rgba(255,255,255,.22)}\n.mk-col:hover{border-color:rgba(255,255,255,.3)}\n.mk-col[aria-checked=\"true\"]{border-color:var(--ml-amber);background:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 8%,transparent);box-shadow:0 0 22px -8px var(--ml-amber)}\n.mk-stats{display:flex;gap:38px;padding-top:26px;border-top:1px solid var(--mk-line)}\n.mk-stats div{display:flex;flex-direction:column;gap:6px}\n.mk-stats b{font:300 30px/1 var(--ml-font);color:#fff}\n.mk-stats span{font-size:12px;color:var(--mk-mut);letter-spacing:.04em}\n.mk-hero-v{position:relative;aspect-ratio:1/1;border-radius:28px;overflow:hidden;background:radial-gradient(70% 62% at 50% 44%,#fff 0%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6)) 40%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 15%,var(--mlc-light,#F4F5F6)) 100%)}\n.mk-glow{position:absolute;inset:0;background:radial-gradient(40% 34% at 50% 46%,color-mix(in srgb,var(--mk-sw) 22%,transparent),transparent 70%);transition:background .6s}\n.mk-hero-img{position:absolute;inset:5%;width:90%;height:90%;object-fit:contain;opacity:0;transform:scale(.97);transition:opacity .55s,transform .8s cubic-bezier(.2,.7,.2,1);filter:drop-shadow(0 34px 34px color-mix(in srgb,var(--mlc-night-deep,#1C1F23) 28%,transparent))}\n.mk-hero-img.on{opacity:1;transform:none}\n.mk-hero-cap{position:absolute;left:22px;bottom:18px;font-size:12px;letter-spacing:.06em;color:#6E6A64}\n/* фильтры */\n.mk-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:24px;flex-wrap:wrap}\n.mk-cats{display:flex;gap:8px;flex-wrap:wrap}\n.mk-cats button{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 18px;border-radius:30px;border:1px solid var(--mk-line);background:none;color:var(--mk-ink);font-size:13px;letter-spacing:.04em;transition:border-color .2s,background .2s,color .2s}\n.mk-cats small{font-size:11px;color:var(--mk-mut)}\n.mk-cats button:hover{border-color:rgba(255,255,255,.3)}\n.mk-cats button[aria-selected=\"true\"]{background:var(--mlc-light,#F4F5F6);color:var(--mlc-graphite,#2F3438);border-color:var(--mlc-light,#F4F5F6)}\n.mk-cats button[aria-selected=\"true\"] small{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))}\n.mk-sort{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--mk-mut);letter-spacing:.04em}\n.mk-sort select{height:40px;padding:0 34px 0 16px;border-radius:30px;border:1px solid var(--mk-line);background:transparent url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23AAACAE' stroke-width='1.5'%3E%3Cpath d='M7 10l5 5 5-5'/%3E%3C/svg%3E\") right 12px center/16px no-repeat;color:var(--mk-ink);font:400 13px var(--ml-font);appearance:none;-webkit-appearance:none;cursor:pointer}\n.mk-sort select option{color:var(--mlc-graphite,#2F3438)}\n/* сетка */\n.mk-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}\n.mk-card{position:relative;display:flex;flex-direction:column;background:var(--mk-card);color:var(--mlc-graphite,#2F3438);border-radius:18px;padding:14px 14px 16px;cursor:pointer;outline:none;transition:box-shadow .25s,transform .25s}\n.mk-card[hidden]{display:none}\n.mk-card:hover,.mk-card:focus-visible{box-shadow:0 0 0 1.5px var(--ml-amber),0 18px 40px -18px rgba(0,0,0,.55);transform:translateY(-2px)}\n.mk-in .mk-card:not([hidden]){animation:mkIn .45s var(--d,0ms) both cubic-bezier(.2,.7,.2,1)}\n@keyframes mkIn{from{opacity:0;transform:translateY(14px)}}\n.mk-img{aspect-ratio:1/1;border-radius:13px;background:radial-gradient(64% 58% at 50% 44%,#fff 0%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6)) 50%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 15%,var(--mlc-light,#F4F5F6)) 100%);display:flex;align-items:center;justify-content:center;overflow:hidden;margin-bottom:12px}\n.mk-img img{width:96%;height:96%;object-fit:contain;transition:opacity .3s,transform .5s;filter:drop-shadow(0 14px 14px color-mix(in srgb,var(--mlc-night-deep,#1C1F23) 20%,transparent))}\n.mk-img img.mk-fade{opacity:0}\n.mk-card:hover .mk-img img{transform:scale(1.05)}\n.mk-dots{display:flex;gap:6px;margin-bottom:10px}\n.mk-dots i{width:14px;height:14px;border-radius:50%;background:var(--sw);box-shadow:inset 0 0 0 1px rgba(0,0,0,.14);transition:box-shadow .2s}\n.mk-dots i.on{box-shadow:0 0 0 2px var(--mk-card),0 0 0 3px var(--ml-amber)}\n.mk-card h3{font:400 14px/1.4 var(--ml-font);margin:0 0 6px;color:var(--mlc-graphite,#2F3438);flex:1}\n.mk-sku{font-size:11px;color:#8A8E93;letter-spacing:.04em;margin-bottom:14px}\n.mk-buy{display:flex;align-items:center;justify-content:space-between;gap:10px}\n.mk-price{font:400 19px/1 var(--ml-font);white-space:nowrap}\n.mk-price small,.mk-pop-price small{font-size:.62em;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));margin-left:2px}\n.mk-add{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:38px;padding:0 16px;border-radius:30px;border:0;background:var(--mlc-graphite,#2F3438);color:#F3F4F5;font:600 12px/1 var(--ml-font);letter-spacing:.06em;white-space:nowrap;transition:box-shadow .2s,background .2s}\n.mk-add:hover{box-shadow:0 0 20px -4px var(--ml-amber)}\n.mk-add svg{width:16px;height:16px}\n.mk-add.mk-done{background:var(--ml-amber);color:var(--mlc-graphite,#2F3438)}\n/* помощь */\n.mk-help{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:44px;padding:26px 30px;border-radius:22px;border:1px solid color-mix(in srgb,var(--mlc-moon,#BCD0E6) 35%,transparent);background:linear-gradient(100deg,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 8%,transparent),transparent 60%)}\n.mk-help div{display:flex;flex-direction:column;gap:6px}\n.mk-help b{font:400 18px/1.3 var(--ml-font);color:#fff}\n.mk-help div span{color:var(--mk-mut);font-size:14px}\n.mk-help a{display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 24px;border-radius:30px;background:var(--ml-amber);color:var(--mlc-graphite,#2F3438);text-decoration:none;font:600 13px/1 var(--ml-font);letter-spacing:.04em;white-space:nowrap;transition:box-shadow .2s}\n.mk-help a:hover{box-shadow:0 0 26px -4px var(--ml-amber)}\n.mk-help svg,.mk-wa svg{width:18px;height:18px}\n/* окно товара */\nhtml.mk-lock{overflow:hidden}\n.mk-pop{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:24px}\n.mk-pop[hidden]{display:none}\n.mk-pop-bg{position:absolute;inset:0;background:rgba(18,20,23,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .25s}\n.mk-pop-card{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:40px;width:min(1040px,100%);max-height:calc(100vh - 48px);overflow:auto;background:var(--mlc-light,#F4F5F6);color:var(--mlc-graphite,#2F3438);border-radius:26px;padding:30px;box-shadow:0 40px 120px -30px rgba(0,0,0,.6);opacity:0;transform:translateY(16px) scale(.98);transition:opacity .25s,transform .3s cubic-bezier(.2,.7,.2,1)}\n.mk-pop.on .mk-pop-bg,.mk-pop.on .mk-pop-card{opacity:1}\n.mk-pop.on .mk-pop-card{transform:none}\n.mk-x{position:absolute;top:16px;right:16px;width:42px;height:42px;border-radius:50%;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent);background:#fff;color:var(--mlc-graphite,#2F3438);display:flex;align-items:center;justify-content:center;z-index:2;transition:border-color .2s,box-shadow .2s}\n.mk-x:hover{border-color:var(--ml-amber);box-shadow:0 0 16px -4px var(--ml-amber)}\n.mk-x svg{width:18px;height:18px}\n.mk-pop-img{aspect-ratio:1/1;border-radius:20px;background:radial-gradient(60% 55% at 50% 42%,#fff 0%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6)) 45%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 15%,var(--mlc-light,#F4F5F6)) 100%);display:flex;align-items:center;justify-content:center}\n.mk-pop-img img{width:94%;height:94%;object-fit:contain;filter:drop-shadow(0 26px 26px color-mix(in srgb,var(--mlc-night-deep,#1C1F23) 25%,transparent))}\n.mk-pop-info{display:flex;flex-direction:column;padding-top:8px}\n.mk-pop-info .mk-eye{display:flex;gap:12px;align-items:center;letter-spacing:.2em;margin-bottom:12px}\n.mk-pop-info .mk-eye b{font-weight:600}\n.mk-pop-info .mk-eye span{color:#8A8E93;letter-spacing:.06em;text-transform:none;padding-left:12px;border-left:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 18%,transparent)}\n.mk-pop-info h2{font:300 26px/1.25 var(--ml-font);margin:0 0 22px;padding-right:44px;color:var(--mlc-graphite,#2F3438)}\n.mk-pop-col{margin-bottom:22px}\n.mk-pop-col > span{display:block;font-size:13px;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));margin-bottom:10px}\n.mk-pop-col b{color:var(--mlc-graphite,#2F3438);font-weight:600}\n.mk-pop-col div{display:flex;gap:8px;flex-wrap:wrap}\n.mk-col-s{height:40px;padding:0 14px 0 6px;font-size:13px;color:var(--mlc-graphite,#2F3438);border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent);background:#fff}\n.mk-col-s i{width:26px;height:26px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.14),inset 0 -5px 8px rgba(0,0,0,.12),inset 0 4px 6px rgba(255,255,255,.3)}\n.mk-col-s[aria-checked=\"true\"]{background:#fff}\n.mk-pop-price{font:300 36px/1 var(--ml-font);margin-bottom:20px}\n.mk-add-l{height:50px;font-size:13px;margin-bottom:10px}\n.mk-wa{display:flex;align-items:center;justify-content:center;gap:10px;height:50px;border-radius:30px;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 20%,transparent);color:var(--mlc-graphite,#2F3438);text-decoration:none;font-size:14px;transition:border-color .2s,color .2s}\n.mk-wa:hover{border-color:var(--ml-amber);color:var(--mlc-graphite,#2F3438)}\n.mk-specs{margin:24px 0 0;padding:0}\n.mk-specs div{display:flex;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 10%,transparent);font-size:13px}\n.mk-specs dt{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))}\n.mk-specs dd{margin:0;color:var(--mlc-graphite,#2F3438);text-align:right}\n@media (max-width:1100px){.mk-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}\n@media (max-width:980px){\n  .mk-hero{grid-template-columns:minmax(0,1fr);gap:28px}\n  .mk-hero-v{order:-1;aspect-ratio:4/3}\n  .mk-pop{padding:0;align-items:flex-end}\n  .mk-pop-card{grid-template-columns:minmax(0,1fr);gap:18px;border-radius:24px 24px 0 0;max-height:92vh;padding:18px 16px 26px}\n  .mk-pop-img{aspect-ratio:4/3}\n}\n@media (max-width:640px){\n  .mk-root{padding:16px 0 60px}\n  .mk-wrap{padding:0 12px}\n  .mk-hero h1{letter-spacing:.1em}\n  .mk-hero p{font-size:15px}\n  .mk-col{height:40px;padding:0 14px 0 6px;font-size:13px}\n  .mk-col i{width:26px;height:26px}\n  .mk-stats{gap:24px}\n  .mk-stats b{font-size:24px}\n  .mk-bar{display:block}\n  .mk-sort{margin-top:12px}\n  .mk-cats{flex-wrap:wrap;gap:8px 6px}\n  .mk-cats button{height:38px;padding:0 14px;font-size:13px}\n  .mk-sort{justify-content:flex-end}\n  .mk-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n  .mk-card{padding:10px 10px 12px;border-radius:16px}\n  .mk-card h3{font-size:13px}\n  .mk-buy{flex-direction:column;align-items:stretch;gap:10px}\n  .mk-add{height:36px}\n  .mk-help{flex-direction:column;align-items:stretch;padding:20px}\n  .mk-help a{justify-content:center}\n  .mk-pop-info h2{font-size:21px}\n}\n.mk-pop-img img{transition:opacity .25s}\n\n.mk-card.mk-na .mk-img img{opacity:.35;filter:grayscale(1)}\n.mk-card.mk-na .mk-add{visibility:hidden}\n.mk-na-t{font-size:12px;color:#8A8E93;white-space:normal;line-height:1.3}\n/* ---------- страница категории (на базе стилей Kranz: .mk-*) */\n.mc-brands .mk-col{padding:0 16px;gap:8px}\n.mc-brands .mk-col small{font-size:11px;color:var(--mk-mut)}\n.mc-brands{margin-bottom:30px}\n.mc-hero-v{cursor:pointer}\n.mc-hero-v .mk-hero-img{inset:9%;width:82%;height:82%}\n.mc-hero-dots{position:absolute;right:20px;bottom:20px;display:flex;gap:8px}\n.mc-hero-dots i{width:8px;height:8px;border-radius:50%;background:color-mix(in srgb,var(--mlc-graphite,#2F3438) 22%,transparent);cursor:pointer;transition:background .3s,transform .3s}\n.mc-hero-dots i.on{background:var(--ml-amber);transform:scale(1.25)}\n.mc-tools{display:flex;align-items:center;gap:12px;flex-wrap:wrap}\n.mc-search{position:relative;display:flex;align-items:center}\n.mc-search svg{position:absolute;left:14px;width:16px;height:16px;color:var(--mk-mut);pointer-events:none}\n.mc-search input{height:40px;width:250px;padding:0 16px 0 38px;border-radius:30px;border:1px solid var(--mk-line);background:transparent;color:var(--mk-ink);font:400 13px var(--ml-font);outline:none;transition:border-color .2s}\n.mc-search input::placeholder{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))}\n.mc-search input:focus{border-color:var(--ml-amber)}\n.mk-cats button[hidden]{display:none}\n.mc-brand{font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--mlc-moon-deep,#5F7896);margin-bottom:5px}\n.mk-img{position:relative}\n.mc-sale{position:absolute;top:10px;left:10px;padding:4px 10px;border-radius:20px;background:var(--ml-amber);color:var(--mlc-graphite,#2F3438);font:600 10px/1.2 var(--ml-font);letter-spacing:.08em;text-transform:uppercase}\n.mc-noimg{font-size:12px;color:#9A9DA0}\n.mk-price s,.mk-pop-price s{font-size:.6em;color:#9A9DA0;margin-right:8px}\n.mc-ask{font-size:13px;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))}\n.mk-pop-price .mc-ask{font-size:20px}\n.mc-empty{text-align:center;color:var(--mk-mut);padding:60px 20px;font-size:15px}\n.mc-empty button{background:none;border:0;color:var(--ml-amber);font:inherit;text-decoration:underline;text-underline-offset:3px}\n.mc-more-w{display:flex;justify-content:center;margin-top:36px}\n.mc-more-w[hidden]{display:none}\n.mc-more{height:48px;padding:0 30px;border-radius:30px;border:1px solid rgba(255,255,255,.25);background:none;color:var(--mk-ink);font:400 14px var(--ml-font);letter-spacing:.04em;transition:border-color .2s,box-shadow .2s}\n.mc-more:hover{border-color:var(--ml-amber);box-shadow:0 0 22px -8px var(--ml-amber)}\n.mc-pop-l{display:flex;flex-direction:column;gap:12px;min-width:0}\n.mc-thumbs{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}\n.mc-thumbs button{flex:0 0 64px;height:64px;padding:0;border-radius:12px;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 14%,transparent);background:#fff;overflow:hidden;transition:border-color .2s}\n.mc-thumbs button.on{border-color:var(--ml-amber);box-shadow:0 0 0 1px var(--ml-amber)}\n.mc-thumbs img{width:100%;height:100%;object-fit:contain}\n.mc-room{margin-bottom:10px;border-color:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 60%,transparent)}\n.mk-pop-info .mk-wa + .mk-wa{margin-top:0}\n.mc-descr{font-size:13px;line-height:1.6;color:#5F6368;margin:18px 0 0}\n.mk-pop-info .mk-specs{max-height:none}\n@media (max-width:980px){ .mc-search input{width:200px} }\n@media (max-width:640px){\n  .mc-tools{margin-top:12px;justify-content:space-between}\n  .mc-search{flex:1 1 100%}\n  .mc-search input{width:100%}\n  .mc-tools .mk-sort{margin-top:0;flex:1 1 100%}\n  .mc-brands .mk-col{height:36px;padding:0 12px;font-size:12.5px}\n  .mc-brand{font-size:9.5px;letter-spacing:.12em}\n  .mk-price s{display:block;margin:0 0 3px}\n}\n/* фото с белым фоном растворяются в тёплом «пятне света» */\n.mk-root:not(.mk-kr) .mk-img img,.mk-root:not(.mk-kr) .mk-hero-img,.mk-root:not(.mk-kr) .mk-pop-img img,.mc-thumbs img{mix-blend-mode:multiply;filter:none}\n.mc-root .mk-img img{width:88%;height:88%}\n/* длинные слова в заголовке не должны заходить на фото */\n.mk-hero h1.mc-h-m{font-size:clamp(34px,4.6vw,62px)}\n.mk-hero h1.mc-h-l{font-size:clamp(28px,3.9vw,54px);letter-spacing:.1em}\n.mk-hero-t{min-width:0}\n.mk-hero h1{overflow-wrap:normal;word-break:normal;hyphens:manual}\n.mc-site{display:inline-flex;align-items:center;gap:6px;margin:-14px 0 26px;font-size:12px;letter-spacing:.06em;color:var(--mk-mut);text-decoration:none;border-bottom:1px solid transparent;transition:color .2s,border-color .2s}\n.mc-site:hover{color:var(--ml-amber);border-color:var(--ml-amber)}\n.mc-site i{font-style:normal}\n\n/* ===== свой поиск по каталогу (search.js) — все цвета из палитры темы ===== */\n.ml-sr{position:fixed;inset:0;z-index:100500;font-family:var(--ml-font);color:var(--ml-ink,var(--mlc-graphite,#2F3438))}\n.ml-sr[hidden]{display:none}\nhtml.ml-sr-on{overflow:hidden}\n.ml-sr-bg{position:absolute;inset:0;background:color-mix(in srgb,var(--ml-d,var(--mlc-graphite,#2F3438)) 55%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;transition:opacity .22s}\n.ml-sr-pan{position:absolute;left:50%;top:0;width:min(1180px,100%);max-height:100%;transform:translate(-50%,-14px);opacity:0;transition:transform .26s cubic-bezier(.22,.61,.36,1),opacity .22s;\n  display:flex;flex-direction:column;background:var(--ml-l,var(--mlc-light,#F4F5F6));border-radius:0 0 26px 26px;box-shadow:0 40px 90px -30px rgba(0,0,0,.55);overflow:hidden}\n.ml-sr.on .ml-sr-bg{opacity:1}.ml-sr.on .ml-sr-pan{transform:translate(-50%,0);opacity:1}\n.ml-sr-top{display:flex;align-items:center;gap:10px;padding:18px 22px 14px;border-bottom:1px solid var(--ml-line,color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent))}\n.ml-sr-in{flex:1;display:flex;align-items:center;gap:10px;height:54px;padding:0 10px 0 18px;border-radius:16px;background:color-mix(in srgb,var(--ml-l) 60%,#fff);border:1px solid var(--ml-line);transition:border-color .2s,box-shadow .2s;cursor:text}\nhtml[data-tod=\"night\"] .ml-sr-in{background:color-mix(in srgb,var(--ml-l) 80%,#000)}\n.ml-sr-in:focus-within{border-color:var(--ml-amber);box-shadow:0 0 0 4px color-mix(in srgb,var(--ml-amber) 18%,transparent)}\n.ml-sr-in svg{width:22px;height:22px;flex:none;color:var(--ml-amber)}\n.ml-sr-in input{flex:1;min-width:0;height:100%;border:0;background:none;outline:0;font:400 18px/1 var(--ml-font);color:var(--ml-ink);caret-color:var(--ml-amber);padding:0;margin:0;-webkit-appearance:none;appearance:none}\n.ml-sr-in input::-webkit-search-cancel-button{display:none}\n.ml-sr-in input::placeholder{color:var(--ml-mut,color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6)));opacity:1}\n.ml-sr-clr,.ml-sr-x{flex:none;display:flex;align-items:center;justify-content:center;border:0;background:none;color:var(--ml-mut);cursor:pointer;border-radius:50%;padding:0;margin:0;transition:background .2s,color .2s}\n.ml-sr-clr{width:34px;height:34px}.ml-sr-x{width:46px;height:46px}\n.ml-sr-clr[hidden]{display:none}\n.ml-sr-clr svg{width:16px;height:16px}.ml-sr-x svg{width:22px;height:22px}\n.ml-sr-clr:hover,.ml-sr-x:hover{color:var(--ml-ink);background:color-mix(in srgb,var(--ml-amber) 14%,transparent)}\n.ml-sr-body{overflow:auto;padding:16px 22px 26px;overscroll-behavior:contain;min-height:180px}\n.ml-sr-h{font:600 11px/1 var(--ml-font);letter-spacing:.14em;text-transform:uppercase;color:var(--ml-mut);margin:10px 0 10px}\n.ml-sr-h:not(:first-child){margin-top:22px}\n.ml-sr-chips{display:flex;flex-wrap:wrap;gap:8px}\n.ml-sr-chip{height:36px;padding:0 16px;border-radius:30px;border:1px solid var(--ml-line);background:transparent;color:var(--ml-ink);font:500 14px/1 var(--ml-font);cursor:pointer;margin:0;transition:border-color .2s,background .2s,color .2s}\n.ml-sr-chip:hover{border-color:var(--ml-amber);background:color-mix(in srgb,var(--ml-amber) 10%,transparent)}\n.ml-sr-rec::before{content:\"↺ \";color:var(--ml-mut)}\n.ml-sr-parts{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}\n.ml-sr-parts a,.ml-sr-parts button{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:12px;border:1px solid var(--ml-line);background:color-mix(in srgb,var(--ml-amber) 6%,transparent);color:var(--ml-ink);font:600 14px/1 var(--ml-font);text-decoration:none;cursor:pointer;margin:0;transition:border-color .2s,background .2s}\n.ml-sr-parts a:hover,.ml-sr-parts button:hover,.ml-sr-parts button.on{border-color:var(--ml-amber);background:color-mix(in srgb,var(--ml-amber) 16%,transparent)}\n.ml-sr-parts i{font:500 10px/1 var(--ml-font);font-style:normal;letter-spacing:.1em;text-transform:uppercase;color:var(--ml-amber)}\n.ml-sr-parts small{font-weight:400;color:var(--ml-mut);font-size:12px}\n.ml-sr-fix{font-size:14px;color:var(--ml-mut);margin:0 0 12px}.ml-sr-fix b{color:var(--ml-ink)}\n.ml-sr-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:4px 0 14px}\n.ml-sr-bar>b{font:600 15px/1 var(--ml-font)}\n.ml-sr-fb{display:flex;gap:6px;flex-wrap:wrap}\n.ml-sr-fb button{height:30px;padding:0 12px;border-radius:30px;border:1px solid var(--ml-line);background:transparent;color:var(--ml-ink);font:500 13px/1 var(--ml-font);cursor:pointer;margin:0}\n.ml-sr-fb button small{color:var(--ml-mut)}\n.ml-sr-fb button.on{background:var(--ml-d);border-color:var(--ml-d);color:var(--ml-l)}\n.ml-sr-fb button.on small{color:inherit;opacity:.7}\nhtml[data-tod=\"night\"] .ml-sr-fb button.on{background:var(--ml-amber);border-color:var(--ml-amber);color:#16181B}\n.ml-sr-grid{grid-template-columns:repeat(4,minmax(0,1fr))}\n.ml-sr-more{display:block;margin:20px auto 0;height:46px;padding:0 28px;border-radius:30px;border:1px solid var(--ml-amber);background:transparent;color:var(--ml-ink);font:600 14px/1 var(--ml-font);cursor:pointer}\n.ml-sr-more:hover{background:color-mix(in srgb,var(--ml-amber) 14%,transparent)}\n.ml-sr-msg{display:flex;align-items:center;justify-content:center;gap:12px;padding:50px 0;color:var(--ml-mut);font-size:15px}\n.ml-sr-msg a{color:var(--ml-amber)}\n.ml-sr-spin{width:18px;height:18px;border-radius:50%;border:2px solid color-mix(in srgb,var(--ml-amber) 30%,transparent);border-top-color:var(--ml-amber);animation:mlSrSpin .8s linear infinite}\n@keyframes mlSrSpin{to{transform:rotate(360deg)}}\n.ml-sr-empty{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center;padding:36px 0 20px}\n.ml-sr-empty b{font:600 18px/1.2 var(--ml-font)}.ml-sr-empty span{color:var(--ml-mut);max-width:44ch}\n.ml-sr-wa{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 22px;border-radius:30px;background:var(--ml-d);color:var(--ml-l)!important;text-decoration:none;font:600 14px/1 var(--ml-font);margin-top:6px}\nhtml[data-tod=\"night\"] .ml-sr-wa{background:var(--ml-amber);color:#16181B!important}\n.ml-sr-wa svg{width:18px;height:18px}\n.ml-sr .mk-pop{z-index:5}\n@media (max-width:900px){.ml-sr-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}\n@media (max-width:640px){\n  .ml-sr-pan{border-radius:0;height:100%}\n  .ml-sr-top{padding:12px 12px 10px;gap:6px}.ml-sr-in{height:48px;padding-left:14px}.ml-sr-in input{font-size:16px}\n  .ml-sr-body{padding:12px 12px 24px}\n  .ml-sr-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n}\n/* ---------- корзина Тильды (T706) в фирменном стиле: светлая панель, графит, янтарь, Avenir */\n.t706 :is(.t-name,.t-descr,.t-text,.t-title,.t-input-title,.t-input,.t-submit,.t-btn,input,textarea,select,label,button){font-family:var(--ml-font)!important}\n.t706__sidebar{background:rgba(18,20,23,.55)!important;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}\n.t706__sidebar-content{background:var(--mlc-light,#F4F5F6)!important;color:var(--mlc-graphite,#2F3438);width:min(460px,100%)!important;max-width:100%!important;border-radius:26px 0 0 26px;box-shadow:-40px 0 100px -30px rgba(0,0,0,.55);padding:26px 28px 24px!important;box-sizing:border-box}\n.t706__sidebar-top{display:flex!important;align-items:center;justify-content:space-between;border-bottom:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 12%,transparent)!important;padding:0 0 20px!important;margin:0 0 4px!important}\n.t706__sidebar-heading{font:300 20px/1.2 var(--ml-font)!important;letter-spacing:.16em;text-transform:uppercase;color:var(--mlc-graphite,#2F3438)!important;display:flex;align-items:center;gap:12px}\n.t706__sidebar-heading::before{content:\"\";width:22px;height:22px;flex:none;background:var(--ml-star) center/contain no-repeat}\n.t706__sidebar-close{position:static!important}\n.t706__sidebar-close-btn{width:42px!important;height:42px!important;border-radius:50%!important;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent)!important;background:#fff!important;display:flex!important;align-items:center;justify-content:center;padding:0!important;cursor:pointer;transition:border-color .2s,box-shadow .2s}\n.t706__sidebar-close-btn:hover{border-color:var(--ml-amber)!important;box-shadow:0 0 18px -4px var(--ml-amber)}\n.t706__sidebar-close-icon{width:14px!important;height:14px!important}\n.t706__sidebar-close-icon :is(rect,path){fill:var(--mlc-graphite,#2F3438)!important;stroke:var(--mlc-graphite,#2F3438)!important}\n.t706__product{border-bottom:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 10%,transparent)!important;padding:16px 0!important;align-items:center!important}\n.t706__product-imgdiv{border-radius:12px!important;background-color:#fff!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mlc-graphite,#2F3438) 8%,transparent)}\n.t706__product-title,.t706__product-title a{color:var(--mlc-graphite,#2F3438)!important;font-size:14px!important;line-height:1.4!important;font-weight:400!important}\n.t706__product-title__option{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;font-size:11px!important;letter-spacing:.06em;margin-top:4px}\n.t706__product-plusminus{white-space:nowrap}\n.t706__product-plusminus :is(.t706__product-minus,.t706__product-plus){display:inline-flex!important;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 18%,transparent);background:#fff;opacity:1!important;transition:border-color .2s}\n.t706__product-plusminus :is(.t706__product-minus,.t706__product-plus):hover{border-color:var(--ml-amber)}\n.t706__product-plusminus img{width:10px!important;height:10px!important;opacity:.7}\n.t706__product-quantity{color:var(--mlc-graphite,#2F3438)!important;font-size:14px!important;margin:0 8px!important;min-width:14px;text-align:center}\n.t706__product-amount{color:var(--mlc-graphite,#2F3438)!important;font-weight:600!important;font-size:14px!important;white-space:nowrap}\n.t706__product-del{opacity:.45!important;transition:opacity .2s}\n.t706__product-del:hover{opacity:1!important}\n.t706__cartwin-totalamount-wrap{border-top:0!important;padding:20px 0 6px!important;color:var(--mlc-graphite,#2F3438)!important}\n.t706__sidebar-totalamount-label{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;font-size:12px!important;letter-spacing:.2em;text-transform:uppercase}\n.t706__sidebar-totalamount{font:300 26px/1 var(--ml-font)!important;color:var(--mlc-graphite,#2F3438)!important;letter-spacing:.01em}\n.t706__sidebar-bottom{padding-top:10px!important}\n.t706 :is(.t706__sidebar-continue,.t-submit){width:100%!important;height:56px!important;border-radius:30px!important;background:var(--mlc-graphite,#2F3438)!important;color:#F3F4F5!important;border:0!important;font:600 13px/1 var(--ml-font)!important;letter-spacing:.1em!important;text-transform:uppercase;box-shadow:none!important;transition:box-shadow .25s,transform .15s!important}\n.t706 :is(.t706__sidebar-continue,.t-submit):hover{box-shadow:0 0 30px -6px var(--ml-amber)!important;transform:translateY(-1px)}\n.t706 :is(.t706__sidebar-continue,.t-submit) *{color:inherit!important;font:inherit!important;letter-spacing:inherit!important}\n/* окно оформления заявки */\n.t706__cartwin{background:rgba(18,20,23,.72)!important;-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}\n.t706__cartwin-content{background:var(--mlc-light,#F4F5F6)!important;border-radius:26px!important;box-shadow:0 40px 120px -30px rgba(0,0,0,.6);padding:34px 36px!important;color:var(--mlc-graphite,#2F3438)}\n.t706__cartwin-heading{font:300 22px/1.25 var(--ml-font)!important;letter-spacing:.14em;text-transform:uppercase;color:var(--mlc-graphite,#2F3438)!important}\n.t706__cartwin-top,.t706__cartwin-products,.t706__cartwin-bottom{border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 12%,transparent)!important}\n.t706__cartwin .t-input-title{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;font-size:12px!important;letter-spacing:.12em;text-transform:uppercase}\n.t706__cartwin :is(.t-input,input[type=text],input[type=tel],input[type=email],textarea){border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent)!important;background:#fff!important;border-radius:14px!important;color:var(--mlc-graphite,#2F3438)!important;font-size:15px!important}\n.t706__cartwin :is(.t-input,input,textarea):focus{border-color:var(--ml-amber)!important;outline:none!important}\n.t706__cartwin .t-checkbox__indicator{border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 35%,transparent)!important;border-radius:6px}\n.t706__close,.t706__cartwin-close{opacity:.75}\n@media (max-width:640px){\n  .t706__sidebar-content{border-radius:0!important;padding:18px 16px!important}\n  .t706__cartwin-content{border-radius:20px!important;padding:24px 18px!important}\n}\n/* строка товара: название шире, «− 1 +» своими знаками, без двойной линии */\n.t706__sidebar-content{width:min(500px,100%)!important}\n.t706__product{display:flex!important;gap:12px}\n.t706__product-thumb{flex:none!important;padding:0!important}\n.t706__product-title{flex:1 1 auto!important;min-width:0!important;width:auto!important;padding:0!important}\n.t706__product-plusminus,.t706__product-amount,.t706__product-del{flex:none!important;width:auto!important;padding:0!important}\n.t706__product-plusminus img{display:none!important}\n.t706__product-plusminus :is(.t706__product-minus,.t706__product-plus)::before{font:400 16px/1 var(--ml-font);color:var(--mlc-graphite,#2F3438)}\n.t706__product-minus::before{content:\"−\"}\n.t706__product-plus::before{content:\"+\"}\n.t706__product:last-child{border-bottom:0!important}\n.t706__sidebar-products{border-bottom:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 12%,transparent)!important}\n.t706__sidebar-products{padding:4px 0 0!important;margin:0!important}\n.t706__sidebar-products .t706__product{padding:18px 0!important;margin:0!important;height:auto!important}\n/* поля формы везде в корзине (форма Тильды бывает прямо в боковой панели, не только в окне) */\n.t706 .t-input-title{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;font-size:12px!important;letter-spacing:.12em;text-transform:uppercase}\n.t706 :is(.t-input,input[type=text],input[type=tel],input[type=email],input[type=number],textarea,select){border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent)!important;background:#fff!important;border-radius:14px!important;color:var(--mlc-graphite,#2F3438)!important;-webkit-text-fill-color:var(--mlc-graphite,#2F3438)!important;caret-color:var(--mlc-graphite,#2F3438);font-size:15px!important}\n.t706 :is(.t-input,input,textarea)::placeholder{color:#9A9DA1!important;-webkit-text-fill-color:#9A9DA1!important;opacity:1}\n.t706 :is(.t-input,input,textarea,select):focus{border-color:var(--mlc-moon-day,#7895B5)!important;outline:none!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--mlc-moon-day,#7895B5) 18%,transparent)!important}\n.t706 :is(.t-checkbox__control,.t-radio__control,.t-text,.t-descr,label){color:var(--mlc-graphite,#2F3438)!important}\n/* ---------- НОЧЬ: корзина тёмная, как карточки */\nhtml[data-tod=\"night\"] .t706__sidebar-content,html[data-tod=\"night\"] .t706__cartwin-content{background:linear-gradient(180deg,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 5%,var(--mlc-night,#25292D)),var(--mlc-night,#25292D))!important;color:#F3F4F5;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 28%,transparent),-40px 0 100px -30px rgba(0,0,0,.7)!important}\nhtml[data-tod=\"night\"] .t706 :is(.t706__sidebar-heading,.t706__cartwin-heading,.t706__product-title,.t706__product-title a,.t706__product-quantity,.t706__product-amount,.t706__sidebar-totalamount,.t706__cartwin-totalamount-wrap,.t706__cartwin-totalamount,.t-text,.t-descr,label,.t-checkbox__control,.t-radio__control){color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .t706 :is(.t706__product-title__option,.t706__sidebar-totalamount-label,.t-input-title){color:#9A9DA1!important}\nhtml[data-tod=\"night\"] .t706 :is(.t706__sidebar-top,.t706__product,.t706__sidebar-products,.t706__cartwin-top,.t706__cartwin-products,.t706__cartwin-bottom){border-color:rgba(255,255,255,.1)!important}\nhtml[data-tod=\"night\"] .t706__product-imgdiv{background-color:color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 25%,#fff)!important;box-shadow:none}\nhtml[data-tod=\"night\"] .t706 :is(.t706__sidebar-close-btn,.t706__product-minus,.t706__product-plus){background:#353B41!important;border-color:rgba(255,255,255,.16)!important}\nhtml[data-tod=\"night\"] .t706 :is(.t706__product-minus,.t706__product-plus)::before{color:#F3F4F5}\nhtml[data-tod=\"night\"] .t706__sidebar-close-icon :is(rect,path){fill:#F3F4F5!important;stroke:#F3F4F5!important}\nhtml[data-tod=\"night\"] .t706__product-del{filter:invert(1)}\nhtml[data-tod=\"night\"] .t706 :is(.t-input,input[type=text],input[type=tel],input[type=email],input[type=number],textarea,select){background:color-mix(in srgb,var(--mlc-night,#25292D) 40%,var(--mlc-night-deep,#1C1F23))!important;border-color:rgba(255,255,255,.14)!important;color:#F3F4F5!important;-webkit-text-fill-color:#F3F4F5!important;caret-color:var(--mlc-moon,#BCD0E6)}\nhtml[data-tod=\"night\"] .t706 :is(.t-input,input,textarea)::placeholder{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;-webkit-text-fill-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important}\nhtml[data-tod=\"night\"] .t706 :is(.t-input,input,textarea,select):focus{border-color:var(--mlc-moon,#BCD0E6)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 18%,transparent)!important}\nhtml[data-tod=\"night\"] .t706 .t-checkbox__indicator{border-color:rgba(255,255,255,.4)!important}\nhtml[data-tod=\"night\"] .t706 :is(.t706__sidebar-continue,.t-submit){background:var(--mlc-moon,#BCD0E6)!important;color:color-mix(in srgb,var(--mlc-night,#25292D) 40%,var(--mlc-night-deep,#1C1F23))!important}\nhtml[data-tod=\"night\"] .t706 :is(.t706__sidebar-continue,.t-submit):hover{box-shadow:0 0 30px -6px var(--mlc-moon,#BCD0E6)!important}\n/* ---------- страница оформления (t706__cartpage): фирменная, две карточки — форма и состав заказа */\n.t706__cartpage{background:#ECEEF0!important;color:var(--mlc-graphite,#2F3438)!important;font-family:var(--ml-font)!important}\n.t706__cartpage-top{background:color-mix(in srgb,var(--mlc-light,#F4F5F6) 85%,transparent)!important;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-bottom:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 10%,transparent)!important;color:var(--mlc-graphite,#2F3438)!important}\n.t706__cartpage-heading{font:300 20px/1.2 var(--ml-font)!important;letter-spacing:.16em;text-transform:uppercase;color:var(--mlc-graphite,#2F3438)!important;display:flex;align-items:center;justify-content:center;gap:12px}\n.t706__cartpage-heading::before{content:\"\";width:20px;height:20px;flex:none;background:var(--ml-star) center/contain no-repeat}\n.t706__cartpage :is(.t706__cartpage-back,.t706__cartpage-close){width:42px;height:42px;border-radius:50%!important;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent)!important;background:#fff!important;display:inline-flex!important;align-items:center;justify-content:center;color:var(--mlc-graphite,#2F3438)!important}\n.t706__cartpage :is(.t706__cartpage-back,.t706__cartpage-close) :is(path,rect,line,polyline){stroke:currentColor!important}\n.t706__cartpage-content{color:var(--mlc-graphite,#2F3438)!important;padding-top:40px!important;padding-bottom:60px!important;gap:28px;align-items:flex-start!important}\n.t706__cartpage :is(.t706__cartpage-form,.t706__cartpage-info){background:#F7F8F9;border-radius:26px;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mlc-graphite,#2F3438) 8%,transparent),0 30px 60px -40px color-mix(in srgb,var(--mlc-night-deep,#1C1F23) 35%,transparent);padding:30px 30px 26px!important;box-sizing:border-box;color:var(--mlc-graphite,#2F3438)!important}\n.t706__cartpage-form::before,.t706__cartpage-info::before{display:block;font:600 12px/1 var(--ml-font);letter-spacing:.2em;text-transform:uppercase;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));margin:0 0 22px}\n.t706__cartpage-form::before{content:\"Ваши контакты\"}\n.t706__cartpage-info::before{content:\"Состав заказа\"}\n.t706__cartpage :is(.t706__cartpage-form-wrapper,.t-form,.t-input-title,.t-text,.t-descr,label,.t706__product-title,.t706__product-title a,.t706__product-quantity,.t706__product-amount,.t706__product-amount *,[class*=totalamount]){color:var(--mlc-graphite,#2F3438)!important}\n.t706__cartpage .t-input-title{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important}\n.t706__cartpage .t706__product-title__option{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important}\n.t706__cartpage [class*=totalamount]{font-family:var(--ml-font)!important}\n.t706__cartpage :is(.t706__cartpage-totals,.t706__cartpage-info [class*=totalamount-wrap]){border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 12%,transparent)!important}\n.t706__cartpage .t706__product{border-bottom:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 10%,transparent)!important}\n.t706__cartpage div.t-input{background:#fff!important;border:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 16%,transparent)!important;border-radius:14px!important}\n.t706__cartpage div.t-input input{border:0!important;background:transparent!important}\n.t706__cartpage .t-input-phonemask__select{color:var(--mlc-graphite,#2F3438)!important}\n.t706__cartpage .t-submit{margin-top:6px}\n@media (max-width:640px){.t706__cartpage-content{padding-top:20px!important}.t706__cartpage :is(.t706__cartpage-form,.t706__cartpage-info){padding:22px 18px!important;border-radius:20px}}\n/* ночь */\nhtml[data-tod=\"night\"] .t706__cartpage{background:var(--mlc-night-deep,#1C1F23)!important;color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .t706__cartpage-top{background:rgba(28,31,35,.85)!important;border-color:rgba(255,255,255,.08)!important}\nhtml[data-tod=\"night\"] .t706__cartpage :is(.t706__cartpage-heading,.t706__cartpage-form-wrapper,.t-form,.t-text,.t-descr,label,.t706__product-title,.t706__product-title a,.t706__product-quantity,.t706__product-amount,.t706__product-amount *,[class*=totalamount],.t-input-phonemask__select){color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .t706__cartpage :is(.t-input-title,.t706__product-title__option){color:#9A9DA1!important}\nhtml[data-tod=\"night\"] .t706__cartpage :is(.t706__cartpage-form,.t706__cartpage-info){background:linear-gradient(180deg,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 5%,var(--mlc-night,#25292D)),var(--mlc-night,#25292D));box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 28%,transparent),0 0 30px -14px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 40%,transparent),0 30px 60px -40px rgba(0,0,0,.7)}\nhtml[data-tod=\"night\"] .t706__cartpage :is(.t706__cartpage-form,.t706__cartpage-info)::before{color:var(--mlc-moon,#BCD0E6)}\nhtml[data-tod=\"night\"] .t706__cartpage :is(.t706__cartpage-back,.t706__cartpage-close){background:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 5%,var(--mlc-night,#25292D))!important;border-color:rgba(255,255,255,.16)!important;color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .t706__cartpage .t706__product{border-color:rgba(255,255,255,.1)!important}\nhtml[data-tod=\"night\"] .t706__cartpage div.t-input{background:color-mix(in srgb,var(--mlc-night,#25292D) 40%,var(--mlc-night-deep,#1C1F23))!important;border-color:rgba(255,255,255,.14)!important}\n.t706__cartpage .t706__cartpage-totals{background:transparent!important;border-top:1px solid color-mix(in srgb,var(--mlc-graphite,#2F3438) 12%,transparent)!important;padding:18px 0 0!important;margin-top:6px!important}\n.t706__cartpage .t706__product-del{opacity:.55!important}\nhtml[data-tod=\"night\"] .t706__cartpage .t706__cartpage-totals{border-color:rgba(255,255,255,.1)!important}\n/* строки товара не зажимать по высоте (Тильда ставит 50px — длинное название и артикул вылезали) */\n.t706 .t706__product{height:auto!important;min-height:0!important;padding:16px 0!important;margin:0!important;gap:12px}\n.t706 .t706__product-title{display:flex;flex-direction:column;justify-content:center}\n/* итог: одна линия (у Тильды своя граница у строки «Итого») */\n.t706__cartpage .t706__cartpage-totals{border-top:0!important;padding:0!important;margin:0!important}\n.t706__cartpage .t706__cartwin-totalamount-wrap{padding:0!important}\n.t706__cartpage .t706__cartwin-totalamount-row{padding-top:18px!important;border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 12%,transparent)!important}\nhtml[data-tod=\"night\"] .t706__cartpage .t706__cartwin-totalamount-row{border-color:rgba(255,255,255,.1)!important}\n.t706__cartpage .t706__product:last-child{border-bottom:0!important}\n/* ---------- геометрия главной: одна ширина у каталога, комнат и 3D (1440), ровные ряды кнопок */\n#ml-rooms .ml-wrap{max-width:1480px}\n.ml-3d{max-width:1440px}\n@media (min-width:1001px){#ml-rooms .lr{grid-template-columns:minmax(0,1fr) 340px}}\n/* подпись под комнатой — по краю кадра, а не на 14px левее */\n#ml-rooms .lr-note{padding:0 14px}\n@media (max-width:640px){#ml-rooms .lr-note{padding:0 10px}}\n/* комнаты и сценарии: ряды по 3, неполный последний ряд растягивается на всю ширину (3+2, 3+1) */\n#ml-rooms .lr-rooms,#ml-rooms .lr-scenes{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px}\n#ml-rooms .lr-scenes{gap:6px}\n#ml-rooms :is(.lr-rooms,.lr-scenes) > *{grid-column:span 2;text-align:center;min-width:0}\n#ml-rooms :is(.lr-rooms,.lr-scenes) > :nth-child(3n+1):nth-last-child(2),\n#ml-rooms :is(.lr-rooms,.lr-scenes) > :nth-child(3n+1):nth-last-child(2) + *{grid-column:span 3}\n#ml-rooms :is(.lr-rooms,.lr-scenes) > :nth-child(3n+1):last-child{grid-column:span 6}\n/* температура на телефоне: 5 кнопок в один ряд */\n@media (max-width:640px){\n  #ml-rooms .lr-k .lr-chips{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));width:100%;gap:5px}\n  #ml-rooms .lr-k .lr-chip{padding:8px 0;font-size:12px;text-align:center}\n}\n\n/* «Все разделы»: две доп. плитки, чтобы последний ряд был полным */\n.ml-hc-x{display:flex;flex-direction:column;text-decoration:none;border:0;text-align:left;font:inherit;color:var(--mlc-graphite,#2F3438);cursor:pointer;width:100%}\n.ml-hc-x .mk-img{position:relative;background:radial-gradient(75% 65% at 50% 38%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 20%,var(--mlc-night,#25292D)) 0%,var(--mlc-graphite,#2F3438) 62%,color-mix(in srgb,var(--mlc-night,#25292D) 90%,var(--mlc-graphite,#2F3438)) 100%)}\n.ml-hc-x .mk-img::after{content:\"\";position:absolute;inset:0;background:radial-gradient(40% 35% at 50% 30%,color-mix(in srgb,var(--ml-amber) 30%,transparent),transparent 70%);pointer-events:none}\n.ml-hc-br .ml-hc-logos{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:8px;width:78%}\n.ml-hc-br .ml-hc-logos i{display:grid;place-items:center;aspect-ratio:2/1;border-radius:10px;background:var(--mlc-light,#F4F5F6)}\n.ml-hc-br .ml-hc-logos img{max-width:78%;max-height:56%;object-fit:contain;filter:grayscale(1)}\n.ml-hc-wa .mk-img svg{position:relative;z-index:1;width:30%;height:auto;color:var(--ml-amber);filter:drop-shadow(0 0 22px color-mix(in srgb,var(--ml-amber) 60%,transparent))}\n.ml-hc-x h3 i{font-style:normal;color:var(--mlc-moon-deep,#5F7896);margin-left:6px}\n@media (min-width:981px) and (max-width:1499px){.ml-hc-wa{display:none!important}}\n/* ПК: правая панель не выше кадра со шкалой — без пустоты под шкалой K; лишние светильники прокручиваются */\n@media (min-width:1001px){\n  #ml-rooms .lr-panel{height:0;min-height:100%;display:flex;flex-direction:column;gap:12px}\n  #ml-rooms .lr-list{flex:1 1 auto;min-height:0;overflow-y:auto;align-content:start;padding-right:4px;margin-right:-4px;scrollbar-width:thin;scrollbar-color:var(--night-line) transparent}\n}\n/* ---------- дневная тема: всё, что было графитовым всегда, светлеет в «Утро / День / Вечер» (ночь — как раньше) */\nhtml[data-tod]:not([data-tod=\"night\"]){--dd-bg:var(--ml-l);--dd-card:#fff;--dd-ink:var(--mlc-graphite,#2F3438);--dd-mut:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6));--dd-line:color-mix(in srgb,var(--mlc-graphite,#2F3438) 14%,transparent);--dd-soft:color-mix(in srgb,var(--mlc-graphite,#2F3438) 5%,transparent)}\nhtml[data-tod=\"evening\"]{--dd-card:#FFFBF5}\n\n/* тёмные секции Тильды (var(--mlc-graphite,#2F3438)): каталог на главной, «Как рождается атмосфера», страницы категорий */\nhtml[data-tod]:not([data-tod=\"night\"]) .t-rec[data-bg-color=\"#201f1f\"]{background-color:var(--dd-bg)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .t-rec[data-bg-color=\"#201f1f\"] :is(.t-section__title,.t-section__descr,.t-title,.t-name,.t-descr,.t-text){color:var(--dd-ink)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .t-rec[data-bg-color=\"#201f1f\"] .t-section__descr :is(p,span,div){color:inherit!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *) :is(span,div,li):last-child:not(:has(a)){color:var(--dd-ink)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *),\nhtml[data-tod]:not([data-tod=\"night\"]) .t-rec[data-bg-color=\"#201f1f\"] .t-catalog__breadcrumbs:not(.ml-pp-on *) *{color:var(--dd-mut)!important}\n\n/* каталог на главной: панель разделов, чипсы, плитки */\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat{color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-panel{background:var(--dd-card);border-color:var(--dd-line);box-shadow:0 20px 50px -30px color-mix(in srgb,var(--mlc-graphite,#2F3438) 35%,transparent)}\nhtml[data-tod]:not([data-tod=\"night\"]) :is(.ml-cat-hd,.ml-cat-ttl){color:var(--dd-mut)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-row{color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-row small{color:var(--dd-mut)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-row svg{color:var(--dd-mut)}\nhtml[data-tod]:not([data-tod=\"night\"]) :is(.ml-cat-row:hover,.ml-cat-row.on,.ml-cat-list li.open .ml-cat-row){background:var(--dd-soft)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-help{color:var(--dd-mut)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-chips button{border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 20%,transparent);color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-chips button:hover{border-color:var(--ml-amber)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-chips button.on{background:var(--dd-ink);color:#F3F4F5;border-color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat .ml-chips-ar{border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 20%,transparent)!important;color:var(--dd-ink)!important;background:var(--dd-card)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-open{background:var(--dd-card);border-color:var(--dd-line);color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-x{background:var(--dd-soft);color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-acc .ml-sh-links a{color:var(--dd-ink)!important;border-color:var(--dd-line)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-cat-acc .ml-sh-brands a{background:var(--dd-bg)}\nhtml[data-tod]:not([data-tod=\"night\"]) :is(.ml-hc,.mk-root){--mk-bg:var(--dd-bg);--mk-ink:var(--dd-ink);--mk-mut:var(--dd-mut);--mk-line:var(--dd-line);--mk-card:var(--dd-card)}\nhtml[data-tod]:not([data-tod=\"night\"]) .mk-card{box-shadow:0 1px 0 color-mix(in srgb,var(--mlc-graphite,#2F3438) 6%,transparent),0 18px 40px -28px color-mix(in srgb,var(--mlc-graphite,#2F3438) 40%,transparent)}\n\n/* страницы категорий и серий (.mk-*) */\nhtml[data-tod]:not([data-tod=\"night\"]) :is(.mk-hero h1,.mk-stats b,.mk-help b){color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .mk-col{background:var(--dd-card)}\nhtml[data-tod]:not([data-tod=\"night\"]) :is(.mk-col:hover,.mk-cats button:hover){border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 35%,transparent)}\nhtml[data-tod]:not([data-tod=\"night\"]) .mk-cats button[aria-selected=\"true\"]{background:var(--dd-ink);color:#F3F4F5;border-color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .mc-more{border-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 25%,transparent)}\nhtml[data-tod]:not([data-tod=\"night\"]) .mc-hero-dots i:not(.on){background:color-mix(in srgb,var(--mlc-graphite,#2F3438) 22%,transparent)}\n\n/* живые комнаты: светлые панели, тёмный текст; сам кадр комнаты не трогаем */\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms{--night:var(--dd-bg);--night-2:var(--dd-card);--night-3:#E2E4E7;--night-line:color-mix(in srgb,var(--mlc-graphite,#2F3438) 18%,transparent);--night-ink:var(--dd-ink);--night-muted:var(--dd-mut);--muted:var(--dd-mut)}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .ml-hd h2{color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr{background:color-mix(in srgb,var(--dd-bg) 80%,#C9CDD2);box-shadow:inset 0 0 0 1px var(--dd-line)}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms :is(.lr-chip.on,.lr-rooms button.on){background:var(--dd-ink);color:#F3F4F5;border-color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-seg button.on{background:var(--dd-ink);color:#F3F4F5}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-sw::after{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25)}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-sw:not([aria-checked=\"true\"]){background:#C9CDD2}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-lt{box-shadow:0 1px 0 color-mix(in srgb,var(--mlc-graphite,#2F3438) 5%,transparent)}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-tag{color:#C9CBCE}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-tag b,html[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-hs .tip{color:#F3F4F5}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-loading{background:var(--mlc-graphite,#2F3438);color:#AAACAE}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr input[type=range]::-webkit-slider-thumb{border-color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .ml-btn{background:var(--dd-ink);color:#F3F4F5}\n\n/* отдельная страница товара */\nhtml.ml-tproduct[data-tod]:not([data-tod=\"night\"]) body{background:var(--dd-bg)!important}\nhtml.ml-tproduct[data-tod]:not([data-tod=\"night\"]) .t-catalog__product-snippet > .t-container.ml-pp-on{background:var(--dd-card);box-shadow:0 40px 100px -40px color-mix(in srgb,var(--mlc-graphite,#2F3438) 35%,transparent)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-tp-bar{background:color-mix(in srgb,var(--dd-bg) 88%,transparent);border-bottom-color:var(--dd-line)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-tp-bar :is(a,button){color:var(--dd-ink)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-tp-bar :is(a,button):hover{color:var(--mlc-moon-deep,#5F7896)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-tp-logo{--hb:var(--mlc-graphite,#2F3438);--hs:color-mix(in srgb,var(--mlc-graphite,#2F3438) 62%,transparent);--h1:var(--mlc-moon-day,#7895B5);--h2:color-mix(in srgb,var(--mlc-moon-day,#7895B5) 50%,transparent);filter:none}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-tp-logo:hover{filter:drop-shadow(0 0 6px color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 35%,transparent))}\n/* НОЧЬ: тёмные карточки товаров (принято 23.11 по пробе preview.css) — все .mk-card и окна .mk-pop-card: главная, категории, бренды, серии/Kranz */\nhtml[data-tod=\"night\"] .mk-card{background:linear-gradient(180deg,#373D44,#31363C);color:#F3F4F5;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ml-amber) 55%,transparent),0 0 30px -14px color-mix(in srgb,var(--ml-amber) 60%,transparent),0 20px 40px -24px rgba(0,0,0,.6)}\nhtml[data-tod=\"night\"] .mk-card:is(:hover,:focus-visible){box-shadow:inset 0 0 0 1.5px var(--ml-amber),0 0 36px -10px var(--ml-amber),0 18px 40px -18px rgba(0,0,0,.6)}\nhtml[data-tod=\"night\"] .mk-card:not(.ml-hc-x) .mk-img{background:radial-gradient(64% 58% at 50% 44%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6)) 0%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 25%,#fff) 55%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 40%,var(--mlc-light,#F4F5F6)) 100%)}\nhtml[data-tod=\"night\"] .mk-card:not(.ml-hc-x) .mk-img img{mix-blend-mode:multiply;filter:drop-shadow(0 12px 12px color-mix(in srgb,var(--mlc-night-deep,#1C1F23) 25%,transparent))}\nhtml[data-tod=\"night\"] .mk-card.mk-na .mk-img img{opacity:.35;filter:grayscale(1)}\nhtml[data-tod=\"night\"] .mk-card :is(h3,.mk-price){color:#F3F4F5}\nhtml[data-tod=\"night\"] .mk-card .mk-sku{color:#9A9DA1}\nhtml[data-tod=\"night\"] .mk-card .mc-brand{color:var(--ml-amber)}\nhtml[data-tod=\"night\"] .mk-card .mk-price small{color:#AAACAE}\nhtml[data-tod=\"night\"] .mk-card .mc-noimg{color:#7D756B}\nhtml[data-tod=\"night\"] .mk-card .mk-add{background:var(--ml-amber);color:var(--mlc-graphite,#2F3438)}\nhtml[data-tod=\"night\"] .mk-card .mk-add:hover{box-shadow:0 0 22px -4px var(--ml-amber)}\nhtml[data-tod=\"night\"] .ml-hc-x h3 i{color:var(--ml-amber)}\nhtml[data-tod=\"night\"] .mk-card .mk-dots i{box-shadow:0 0 0 1px rgba(255,255,255,.22)}\n\n/* окно товара */\nhtml[data-tod=\"night\"] .mk-pop-card{background:linear-gradient(180deg,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 5%,var(--mlc-graphite,#2F3438)),var(--mlc-graphite,#2F3438));color:#F3F4F5;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ml-amber) 45%,transparent),0 40px 120px -30px rgba(0,0,0,.7)}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-pop-img{background:radial-gradient(60% 55% at 50% 42%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6)) 0%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 25%,#fff) 50%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 40%,var(--mlc-light,#F4F5F6)) 100%)}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-pop-img img{mix-blend-mode:multiply}\nhtml[data-tod=\"night\"] .mk-pop-card :is(h2,.mk-pop-price,.mk-specs dd,.mk-pop-col b){color:#F3F4F5}\nhtml[data-tod=\"night\"] .mk-pop-card :is(.mk-specs dt,.mk-pop-price small,.mk-pop-info .mk-eye span){color:#9A9DA1}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-pop-info .mk-eye span{border-left-color:rgba(255,255,255,.16)}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-specs div{border-bottom-color:rgba(255,255,255,.09)}\nhtml[data-tod=\"night\"] .mk-pop-card .mc-descr{color:#B9BBBE}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-add{background:var(--ml-amber);color:var(--mlc-graphite,#2F3438)}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-wa{color:#F3F4F5;border-color:rgba(255,255,255,.2)}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-wa:hover{border-color:var(--ml-amber);color:#F3F4F5}\nhtml[data-tod=\"night\"] .mk-pop-card .mk-x{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18);color:#F3F4F5}\nhtml[data-tod=\"night\"] .mk-pop-card .mc-thumbs button{background:color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 25%,#fff);border-color:rgba(255,255,255,.12)}\n\n/* страница товара /tproduct/ и окно каталога Тильды (.ml-pp-on) */\nhtml[data-tod=\"night\"].ml-tproduct body{background:var(--mlc-night,#25292D)!important}\nhtml[data-tod=\"night\"] .t-catalog__product-snippet > .t-container.ml-pp-on,\nhtml[data-tod=\"night\"] .t-popup:has(.ml-pp-on) .t-popup__container{background:linear-gradient(180deg,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 5%,var(--mlc-graphite,#2F3438)),var(--mlc-graphite,#2F3438))!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ml-amber) 45%,transparent),0 40px 120px -30px rgba(0,0,0,.7)!important}\nhtml[data-tod=\"night\"] .ml-pp-on .t-catalog__prod-popup__col-left{background:radial-gradient(60% 55% at 50% 42%,color-mix(in srgb,var(--mlc-moon,#BCD0E6) 10%,var(--mlc-light,#F4F5F6)) 0%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 25%,#fff) 50%,color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 40%,var(--mlc-light,#F4F5F6)) 100%)}\nhtml[data-tod=\"night\"] .t-rec .ml-pp-on .t-catalog__breadcrumbs,html[data-tod=\"night\"] .t-rec .ml-pp-on .t-catalog__breadcrumbs :is(span,div,li,a){color:#9A9DA1!important}\nhtml[data-tod=\"night\"] .t-rec .ml-pp-on .t-catalog__breadcrumbs .t-catalog__breadcrumbs-item_active *{color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .ml-pp-eye b{color:var(--ml-amber)}\nhtml[data-tod=\"night\"] .ml-pp-eye span{color:#9A9DA1;border-left-color:rgba(255,255,255,.16)}\nhtml[data-tod=\"night\"] .ml-pp-on .t-catalog__prod-popup__name{color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .ml-pp-on .t-catalog__prod-popup__price-wrapper{border-top-color:rgba(255,255,255,.1)}\nhtml[data-tod=\"night\"] .ml-pp-on .t-catalog__prod-popup__price .t-catalog__prod-popup__price-value{color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .ml-pp-on .t-catalog__prod-popup__price .ml-cur{color:#9A9DA1!important}\nhtml[data-tod=\"night\"] .ml-pp-on .t-catalog__prod-popup__price_old .t-catalog__prod-popup__price-value{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important}\nhtml[data-tod=\"night\"] .ml-pp-on .t-catalog__prod-popup__btn-wrapper .t-btn:not(#ml_x){background:var(--ml-amber)!important;color:var(--mlc-graphite,#2F3438)!important}\nhtml[data-tod=\"night\"] .ml-pp-on :is(.t-product__option-title,.t-product__option-variants,.t-descr,.t-name,.t-text){color:#D9DADC!important}\nhtml[data-tod=\"night\"] .ml-pp-acts>*{color:#F3F4F5!important;border-color:rgba(255,255,255,.2)}\nhtml[data-tod=\"night\"] .ml-pp-room svg{color:var(--ml-amber)}\nhtml[data-tod=\"night\"] .ml-pp-room small{color:#9A9DA1}\nhtml[data-tod=\"night\"] .ml-pp-txt{color:#B9BBBE}\nhtml[data-tod=\"night\"] .ml-pp-h,html[data-tod=\"night\"] .ml-pp-specs dt,html[data-tod=\"night\"] .ml-pp-zoomhint{color:#9A9DA1}\nhtml[data-tod=\"night\"] .ml-pp-specs dl div{border-bottom-color:rgba(255,255,255,.09)}\nhtml[data-tod=\"night\"] .ml-pp-specs dd{color:#F3F4F5}\nhtml[data-tod=\"night\"] .ml-pp-help{background:color-mix(in srgb,var(--mlc-night,#25292D) 90%,var(--mlc-graphite,#2F3438));box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}\n/* Kranz/серии с прозрачным фоном: без multiply, иначе белые изделия становятся бежевыми */\nhtml[data-tod=\"night\"] .mk-kr .mk-card .mk-img img,html[data-tod=\"night\"] .mk-kr .mk-pop-card .mk-pop-img img{mix-blend-mode:normal}\n/* ЛУННЫЙ АКЦЕНТ (23.11, вместо янтаря): var(--mlc-moon,#BCD0E6) на тёмном; на светлых фонах днём — темнее, иначе не читается */\nhtml[data-tod]:not([data-tod=\"night\"]){--ml-amber:var(--mlc-moon-day,#7895B5)}\nhtml[data-tod]:not([data-tod=\"night\"]) :is(.ml-fl,.ml-fl-hero,.ml-pp-help,.ml-hc-x .mk-img,.t706__cartwin-top){--ml-amber:var(--mlc-moon,#BCD0E6)}\n/* акцент утра и вечера — свои цвета из HEAD (по умолчанию как днём) */\nhtml[data-tod=\"morning\"]:not([data-tod=\"night\"]){--ml-amber:var(--mlc-morning-accent,var(--mlc-moon-day,var(--mlc-moon-day,#7895B5)))}\nhtml[data-tod=\"evening\"]:not([data-tod=\"night\"]){--ml-amber:var(--mlc-evening-accent,var(--mlc-moon-day,var(--mlc-moon-day,#7895B5)))}\n/* ===== ночь для любых блоков Тильды (классы ставит night_any.js) ===== */\n.ml-na,.ml-na-bg0,.ml-na-bg{transition:background-color .9s ease}\nhtml[data-tod=\"night\"] .t-rec.ml-na,html[data-tod=\"night\"] .ml-na-bg0{background-color:var(--ml-l)!important}\nhtml[data-tod=\"night\"] .ml-na-bg{background-color:var(--na-bg,color-mix(in srgb,var(--ml-l) 88%,#fff))!important}\nhtml[data-tod=\"night\"] .ml-na-tx{color:var(--na-c,var(--ml-ink))!important;-webkit-text-fill-color:currentColor}\nhtml[data-tod=\"night\"] .ml-na-mu{color:var(--ml-mut)!important}\nhtml[data-tod=\"night\"] .ml-na-bd{border-color:var(--ml-line)!important}\nhtml[data-tod=\"night\"] .ml-na-ic{filter:invert(.88) hue-rotate(180deg)}\nhtml[data-tod=\"night\"] .ml-na :is(input,textarea)::placeholder{color:var(--ml-mut)!important;opacity:1}\nhtml[data-tod=\"night\"] .ml-na hr{border-color:var(--ml-line)!important}\n/* ===== theme_fix.css — дыры в цветах тем по итогам полной проверки 23.11 (последним в бандле) ===== */\n\n/* --- ночь: поиск по сайту (T985). У Тильды шторка белая, а текст ночью светлый → белое на белом --- */\nhtml[data-tod=\"night\"] .t985 :is(.t-search-widget__header,.t-search-widget__popup){background:var(--mlc-night-deep,#1C1F23)!important;color:#E6E9EC!important}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__header{box-shadow:0 1px 0 color-mix(in srgb,var(--mlc-moon,#BCD0E6) 16%,transparent),0 24px 60px -30px rgba(0,0,0,.85)!important}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__blockinput{background:var(--mlc-night,#25292D)!important;border-color:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 32%,transparent)!important;border-radius:12px}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__blockinput:focus-within{border-color:var(--mlc-moon,#BCD0E6)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--mlc-moon,#BCD0E6) 16%,transparent)}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__input{background:transparent!important;color:#F3F4F5!important;-webkit-text-fill-color:#F3F4F5!important;caret-color:var(--mlc-moon,#BCD0E6)}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__input::placeholder{color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;-webkit-text-fill-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important}\nhtml[data-tod=\"night\"] .t985 :is(.t-search-widget__search-icon,.t-search-widget__clear-icon,.t-search-widget__close-icon,.t-search-widget__popup svg){filter:invert(.88)}\nhtml[data-tod=\"night\"] .t985 .t985__searchvariant{color:color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 25%,#fff)!important;background:transparent!important;border-color:rgba(255,255,255,.22)!important}\nhtml[data-tod=\"night\"] .t985 .t985__searchvariant:hover{color:color-mix(in srgb,var(--mlc-night,#25292D) 40%,var(--mlc-night-deep,#1C1F23))!important;background:var(--mlc-moon,#BCD0E6)!important;border-color:var(--mlc-moon,#BCD0E6)!important}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__popup :is(a,div,span,p,li,h1,h2,h3,h4,strong,b){color:inherit}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__popup :is([class*=\"__title\"],.t-name,.t-title){color:#F3F4F5!important}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__popup :is([class*=\"__descr\"],[class*=\"__url\"],[class*=\"_error\"],.t-descr,.t-text){color:#A3A8AE!important}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__popup mark{background:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 22%,transparent);color:#F3F4F5}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__result{border-color:rgba(255,255,255,.08)!important}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__result:hover{background:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 6%,transparent)}\nhtml[data-tod=\"night\"] .t985 :is(.t-search-widget__loadmore-btn,.t-search-widget__pagination-item){background:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 5%,var(--mlc-night,#25292D))!important;color:#F3F4F5!important;border-color:rgba(255,255,255,.16)!important}\nhtml[data-tod=\"night\"] .t985 .t-search-widget__pagination-active{background:var(--mlc-moon,#BCD0E6)!important;color:color-mix(in srgb,var(--mlc-night,#25292D) 40%,var(--mlc-night-deep,#1C1F23))!important}\n\n/* --- ночь: корзина --- */\n/* «Корзина пуста…» — у Тильды .t-name чёрный */\nhtml[data-tod=\"night\"] .t706 :is(.t-name,.t-title,.t706__sidebar-products > div,.t706__cartwin-products > div){color:#C9CDD2!important}\n/* крестик удаления: фильтр стоял и на span, и на img — инверсии гасили друг друга */\nhtml[data-tod=\"night\"] .t706__product-del img{filter:none!important}\nhtml[data-tod=\"night\"] .t706__product-del{opacity:.7!important}\nhtml[data-tod=\"night\"] .t706__product-del:hover{opacity:1!important}\n/* «Оставить заявку» в пустой корзине (неактивна): не серое на лунном, а приглушённая лунная */\nhtml[data-tod=\"night\"] .t706 :is(.t706__sidebar-continue,.t-submit):is(:disabled,.t706__sidebar-continue_disabled,[class*=\"disabled\"]){opacity:1!important;background:color-mix(in srgb,var(--mlc-moon-deep,#5F7896) 45%,var(--mlc-night,#25292D))!important;color:color-mix(in srgb,var(--mlc-moon,#BCD0E6) 75%,#fff)!important}\n\n/* --- день: слабый контраст --- */\nhtml[data-tod]:not([data-tod=\"night\"]) .mk-crumbs{color:#5F6469}\nhtml[data-tod]:not([data-tod=\"night\"]) .mk-crumbs a{color:#6E7378}\nhtml[data-tod]:not([data-tod=\"night\"]) .mk-eye{color:var(--mlc-moon-deep,#5F7896)}\nhtml[data-tod]:not([data-tod=\"night\"]) :is(.mk-price s,.mk-pop-price s){color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))}\nhtml[data-tod]:not([data-tod=\"night\"]) #ml-rooms .lr-lt .pr.new{color:color-mix(in srgb,var(--glow) 50%,#3A2A1A)}\nhtml[data-tod]:not([data-tod=\"night\"]):not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]{color:var(--mlc-moon-deep,#5F7896)!important;border-color:var(--mlc-moon-deep,#5F7896)!important}\nhtml[data-tod]:not([data-tod=\"night\"]):not(.ml-nobrand) .t-section__descr a[href*=\"ourworks\"]:hover{color:#fff!important;background:var(--mlc-moon-deep,#5F7896)}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-pp-on .t-catalog__breadcrumbs :is(span,div,li,a){color:#6E7378!important}\n\n/* подпись под фото в шапке категорий: серое на серебристой подложке */\n.mk-hero-cap{color:#4A5056}\n\n/* подсказки в полях форм: у Тильды placeholder с opacity .5 — ночью (под invert) и днём почти не видно */\n.t-rec :is(.t-input,textarea.t-input)::placeholder{opacity:1!important;color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important;-webkit-text-fill-color:color-mix(in srgb,var(--mlc-graphite,#2F3438) 60%,var(--mlc-light,#F4F5F6))!important}\n\n/* крошки страницы товара: у Тильды текущий пункт с opacity .5 — делаем полным и тёмным днём */\n.ml-pp-on .t-catalog__breadcrumbs-item_active{opacity:1!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .ml-pp-on .t-catalog__breadcrumbs .t-catalog__breadcrumbs-item_active :is(span,div,li,a){color:var(--mlc-graphite,#2F3438)!important}\n\n/* мобильная панель каталога → «Бренды»: плашки светлые всегда, а текстовые бренды ночью были белыми; сетка вылезала за панель */\n@media (max-width:980px){\n  .ml-cat-acc .ml-sh-brands{grid-template-columns:repeat(3,minmax(0,1fr))!important}\n  .ml-cat-acc .ml-sh-brands a{min-width:0;overflow:hidden}\n  .ml-cat-acc .ml-sh-brands img{max-width:82%}\n  .ml-cat-acc .ml-sh-brands a.ml-br-txt{color:var(--mlc-graphite,#2F3438)!important;font-size:10px;letter-spacing:.03em;padding:0 4px;overflow-wrap:anywhere}\n}\n\n/* --- день/утро/вечер: поиск по сайту в цветах палитры (24.11) --- */\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 :is(.t-search-widget__header,.t-search-widget__popup){background:var(--ml-l)!important;color:var(--ml-ink)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 .t-search-widget__blockinput{background:#fff!important;border-color:var(--ml-line)!important;border-radius:12px}\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 .t-search-widget__blockinput:focus-within{border-color:var(--ml-amber)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--ml-amber) 18%,transparent)}\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 .t-search-widget__input{caret-color:var(--ml-amber);color:var(--ml-ink)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 .t985__searchvariant:hover{color:#fff!important;background:var(--ml-amber)!important;border-color:var(--ml-amber)!important}\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 .t-search-widget__popup mark{background:color-mix(in srgb,var(--ml-amber) 22%,transparent);color:inherit}\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 .t-search-widget__result:hover{background:color-mix(in srgb,var(--ml-amber) 7%,transparent)}\nhtml[data-tod]:not([data-tod=\"night\"]) .t985 .t-search-widget__pagination-active{background:var(--ml-d)!important;color:var(--ml-l)!important}\n/* артикул на карточках: на тонированном фоне утра/вечера #8A8E93 давал контраст 2,9 — берём от цвета текста темы (24.11, найдено проверкой Студии) */\nhtml[data-tod]:not([data-tod=\"night\"]) .mk-sku{color:color-mix(in srgb,var(--ml-ink,var(--mlc-graphite,#2F3438)) 64%,#fff)}\n"; document.head.appendChild(st);
// ---------- СТУДИЯ: настройки оформления. Источник — window.mlStudio из HEAD Тильды (вставляет мастер, собирает студия).
// В режиме студии (адрес с ?studio, затем запоминается) поверх HEAD действует черновик из localStorage — его видит только сам мастер.
const mlStudio = (() => {
  const D = document, root = D.documentElement;
  const ls = {get(k){ try { return localStorage.getItem(k); } catch (e){ return null; } }, set(k, v){ try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e){} }};
  const q = location.search;
  if (/[?&]studio=off\b/.test(q)) ls.set('ml-studio-on', null);
  else if (/[?&]studio\b/.test(q)) ls.set('ml-studio-on', '1');
  const frame = /[?&]studio-frame\b/.test(q);
  let on = frame || ls.get('ml-studio-on') === '1';
  let draft = null; try { draft = JSON.parse(ls.get('ml-studio-draft') || 'null'); } catch (e){}
  const head = window.mlStudio && typeof window.mlStudio === 'object' ? window.mlStudio : {};
  const cfg = Object.assign({}, head, on && draft ? draft : {});
  window.mlStudioCfg = cfg;

  const COLORS = {graphite: '--mlc-graphite', light: '--mlc-light', night: '--mlc-night', nightDeep: '--mlc-night-deep', moon: '--mlc-moon', moonDay: '--mlc-moon-day', moonDeep: '--mlc-moon-deep',
    morningBg: '--mlc-morning-bg', morningDark: '--mlc-morning-dark', morningAccent: '--mlc-morning-accent', eveningBg: '--mlc-evening-bg', eveningDark: '--mlc-evening-dark', eveningAccent: '--mlc-evening-accent'};
  const FONTS = ['Nunito Sans', 'Manrope', 'Montserrat', 'Raleway', 'Inter', 'Onest', 'Golos Text', 'Jost', 'Comfortaa', 'Unbounded', 'Oswald', 'Tenor Sans',
    'Playfair Display', 'Cormorant Garamond', 'Lora', 'PT Serif', 'Prata', 'Forum', 'Philosopher', 'Marck Script'];
  const loaded = new Set(['Nunito Sans']);
  const font = f => { if (!f || f === 'brand' || loaded.has(f) || !FONTS.includes(f)) return; loaded.add(f);
    const l = D.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@300;400;500;600;700&display=swap'; D.head.appendChild(l); };
  const fam = f => f && f !== 'brand' ? `'${f}',var(--mlc-font,'Avenir Next',Arial,sans-serif)` : '';
  const HS = {s: 'clamp(20px,2.2vw,28px)', m: 'clamp(22px,2.9vw,36px)', l: 'clamp(26px,3.8vw,48px)', xl: 'clamp(30px,5vw,64px)'};
  const EASE = {soft: 'cubic-bezier(.22,.61,.36,1)', spring: 'cubic-bezier(.34,1.56,.64,1)', sharp: 'cubic-bezier(.7,0,.3,1)', slow: 'cubic-bezier(.16,1,.3,1)'};
  const CARDS = '.mk-card,.t-card,.t-store__card,.t-catalog__card,.t-item';
  const BTNS = '.t-btn,.t-submit,.t-store__card__btn,.ml-btn,.mk-card button,.ml-sh-links a';
  const HEADS = '.t-section__title,.t-title,.ml-hd h2,.mk-hd b,.t183__title,.ml-cat h1,.ml-cat h2';

  function css(c){
    let s = '';
    const hf = fam(c.headFont), bf = fam(c.font);
    if (bf) s += `:root{--ml-font:${bf}!important}`;
    if (hf || c.headWeight || c.headCase || c.headSpacing != null || c.headSize || c.headAlign){
      s += `html :is(${HEADS}){` + (hf ? `font-family:${hf}!important;` : '') + (c.headWeight ? `font-weight:${c.headWeight}!important;` : '')
        + (c.headCase ? `text-transform:${c.headCase === 'upper' ? 'uppercase' : 'none'}!important;` : '') + (c.headSpacing != null ? `letter-spacing:${c.headSpacing}em!important;` : '')
        + (c.headSize ? `font-size:${HS[c.headSize]}!important;line-height:1.2!important;` : '') + (c.headAlign ? `text-align:${c.headAlign}!important;` : '') + '}';
    }
    if (c.textAlign) s += `html :is(.t-descr,.t-text,.t-section__descr,.ml-hd p){text-align:${c.textAlign}!important}`;
    if (c.radiusCard != null) s += `html :is(${CARDS}){border-radius:${c.radiusCard}px!important}html .mk-img{border-radius:${Math.max(0, c.radiusCard - 5)}px!important}`;
    if (c.radiusBtn != null) s += `html :is(${BTNS}){border-radius:${c.radiusBtn}px!important}`;
    if (c.shadow != null) s += `html :is(${CARDS}){box-shadow:0 ${2 * c.shadow}px ${6 * c.shadow}px rgba(0,0,0,${.06 * c.shadow}),0 ${18 * c.shadow}px ${44 * c.shadow}px -${20 * c.shadow}px rgba(0,0,0,${.32 * c.shadow})!important}`;
    if (c.gap != null) s += `html .mk-grid{gap:${c.gap}px!important}`;
    if (c.btnStyle === 'outline') s += `html :is(.t-btn,.t-submit,.ml-btn,.t-store__card__btn){background:transparent!important;color:inherit!important;box-shadow:inset 0 0 0 1.5px currentColor!important}`;
    if (c.btnStyle === 'glass') s += `html :is(.t-btn,.t-submit,.ml-btn,.t-store__card__btn){background:color-mix(in srgb,var(--ml-amber) 22%,transparent)!important;color:inherit!important;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ml-amber) 60%,transparent)!important}`;
    if (c.btnStyle === 'moon') s += `html :is(.t-btn,.t-submit,.ml-btn,.t-store__card__btn){background:var(--ml-amber)!important;color:var(--mlc-graphite,#2F3438)!important}`;
    // наведение на карточки
    const hv = {lift: 'transform:translateY(-6px)', glow: 'box-shadow:0 0 0 1px var(--ml-amber),0 0 34px color-mix(in srgb,var(--ml-amber) 50%,transparent)!important', zoom: '', tilt: 'transform:perspective(700px) rotateX(4deg) rotateY(-4deg) translateY(-3px)', none: 'transform:none!important;box-shadow:inherit'};
    if (c.hover && c.hover in hv){
      s += `html :is(${CARDS}){transition:transform .35s ${EASE.soft},box-shadow .35s!important}`;
      if (hv[c.hover]) s += `html :is(${CARDS}):hover{${hv[c.hover]}}`;
      if (c.hover === 'zoom') s += `html :is(${CARDS}) img{transition:transform .6s ${EASE.soft}!important}html :is(${CARDS}):hover img{transform:scale(1.08)}`;
    }
    if (c.marquee) s += `.ml-marq-t{--mq:${c.marquee}s}`;
    if (c.grain) s += `html::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:2147483000;opacity:${c.grain * .5};mix-blend-mode:overlay;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}`;
    if (c.glow != null) s += `:root{--ml-glow-k:${c.glow}}html .ml-hlogo{filter:drop-shadow(0 0 ${10 * c.glow}px color-mix(in srgb,var(--ml-amber) ${Math.round(60 * c.glow)}%,transparent))!important}`;
    // рамка карточек и регистр кнопок
    if (c.cardBorder) s += `html :is(${CARDS}){outline:${c.cardBorder}px solid color-mix(in srgb,var(--ml-amber) 70%,transparent)!important;outline-offset:-${c.cardBorder}px}`;
    if (c.btnCase) s += `html :is(${BTNS}){text-transform:${c.btnCase === 'upper' ? 'uppercase' : 'none'}!important;letter-spacing:${c.btnCase === 'upper' ? '.08em' : 'normal'}!important}`;
    // наведение на кнопку
    const BH = `html :is(.t-btn,.t-submit,.ml-btn,.t-store__card__btn,.mk-card button)`;
    if (c.btnHover === 'shine') s += `${BH}{position:relative;overflow:hidden}${BH}::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-20deg);pointer-events:none;transition:none}${BH}:hover::after{left:130%;transition:left .7s ${EASE.soft}}`;
    if (c.btnHover === 'fill') s += `${BH}{background-image:linear-gradient(var(--ml-amber),var(--ml-amber))!important;background-repeat:no-repeat!important;background-size:0 100%!important;transition:background-size .45s ${EASE.soft},color .3s!important}${BH}:hover{background-size:100% 100%!important;color:var(--mlc-graphite,#2F3438)!important}`;
    if (c.btnHover === 'lift') s += `${BH}{transition:transform .3s ${EASE.spring},box-shadow .3s!important}${BH}:hover{transform:translateY(-3px);box-shadow:0 12px 26px -10px rgba(0,0,0,.45)!important}`;
    if (c.btnHover === 'pulse') s += `@keyframes mlsPulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ml-amber) 70%,transparent)}100%{box-shadow:0 0 0 16px transparent}}${BH}:hover{animation:mlsPulse 1.1s ease-out infinite}`;
    // ссылки в тексте и меню
    const LK = `html :is(.t-text a,.t-descr a,.t-menu__link-item,.t-menu-base__link-item,.t-menusub__link-item,.ml-bw a)`;
    if (c.linkHover === 'underline') s += `${LK}{background-image:linear-gradient(currentColor,currentColor)!important;background-repeat:no-repeat!important;background-position:0 100%!important;background-size:0 1px!important;transition:background-size .4s ${EASE.soft}!important;text-decoration:none!important}${LK}:hover{background-size:100% 1px!important}`;
    if (c.linkHover === 'glow') s += `${LK}{transition:text-shadow .3s,color .3s!important}${LK}:hover{color:var(--ml-amber)!important;text-shadow:0 0 12px color-mix(in srgb,var(--ml-amber) 70%,transparent)}`;
    // выделение текста и полоса прокрутки в цвет акцента
    if (c.selection) s += `::selection{background:color-mix(in srgb,var(--ml-amber) 45%,transparent)}html{scrollbar-color:var(--ml-amber) transparent}::-webkit-scrollbar{width:10px}::-webkit-scrollbar-thumb{background:var(--ml-amber);border-radius:6px;border:2px solid transparent;background-clip:padding-box}`;
    // полоса прочитанного и кнопка «наверх»
    if (c.progress) s += `.mls-prog{position:fixed;left:0;top:0;height:${c.progress === 'thick' ? 4 : 2}px;width:100%;z-index:2147483500;background:var(--ml-amber);box-shadow:0 0 10px var(--ml-amber);transform-origin:0 50%;transform:scaleX(var(--p,0));pointer-events:none}`;
    if (c.topBtn) s += `.mls-top{position:fixed;right:20px;bottom:20px;z-index:9980;width:46px;height:46px;border-radius:50%;border:1px solid color-mix(in srgb,var(--ml-amber) 60%,transparent);background:color-mix(in srgb,var(--mlc-night-deep,#1C1F23) 82%,transparent);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:var(--ml-amber);display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(16px);transition:opacity .35s,transform .35s ${EASE.spring};pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.3)}.mls-top.on{opacity:1;transform:none;pointer-events:auto}.mls-top:hover{box-shadow:0 0 0 1px var(--ml-amber),0 0 24px color-mix(in srgb,var(--ml-amber) 50%,transparent)}.mls-top svg{width:20px;height:20px}@media (max-width:980px){.mls-top{bottom:74px;right:14px}}`;
    if (c.hdrHide) s += `.mls-hdr{transition:translate .4s ${EASE.soft}!important}.mls-hdr-up .mls-hdr{translate:0 -110%}`;
    // звёздное небо на тёмных блоках
    if (c.sky) s += `@keyframes mlsTw{0%,100%{opacity:var(--o1)}50%{opacity:var(--o2)}}.mls-sky{position:relative}.mls-sky::before,.mls-sky::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;background-image:var(--mls-sky1);--o1:${(.35 + .5 * c.sky).toFixed(2)};--o2:.08;animation:mlsTw 4.5s ease-in-out infinite}.mls-sky::after{background-image:var(--mls-sky2);--o1:.08;--o2:${(.35 + .5 * c.sky).toFixed(2)};animation-duration:6.5s}.mls-sky>.mls-up{position:relative;z-index:1}`;
    // переходы между страницами
    if (c.pageFade && !RMQ) s += `@keyframes mlsPageIn{from{opacity:0}to{opacity:1}}html.mls-pf body{animation:mlsPageIn .55s ${EASE.soft} both}html.mls-out body{opacity:0!important;transition:opacity .28s ease!important}`;
    // заголовки
    const ha = c.headAnim;
    if (ha && !RMQ){
      if (ha === 'words' || ha === 'letters') s += `.mls-h .mls-wi{display:inline-block;opacity:0;transform:translateY(.55em);filter:blur(${ha === 'letters' ? 4 : 0}px);transition:opacity .6s ${EASE.soft},transform .7s ${EASE[c.ease] || EASE.soft},filter .6s;transition-delay:calc(var(--i)*${ha === 'letters' ? 22 : 70}ms)}.mls-h.mls-hin .mls-wi{opacity:1;transform:none;filter:none}`;
      if (ha === 'mask') s += `.mls-h .mls-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}.mls-h .mls-wi{display:inline-block;transform:translateY(110%);transition:transform .9s ${EASE.slow};transition-delay:calc(var(--i)*60ms)}.mls-h.mls-hin .mls-wi{transform:none}`;
      if (ha === 'line') s += `.mls-h::after{content:"";display:block;height:2px;width:0;margin-top:.45em;background:var(--ml-amber);box-shadow:0 0 10px var(--ml-amber);transition:width 1.1s ${EASE.slow} .15s}.mls-h[data-al=center]::after{margin-left:auto;margin-right:auto}.mls-h[data-al=right]::after{margin-left:auto}.mls-h.mls-hin::after{width:min(120px,40%)}`;
      if (ha === 'light') s += `.mls-h{background:linear-gradient(90deg,currentColor 0 40%,var(--ml-amber) 50%,currentColor 60% 100%) 100% 0/250% 100% no-repeat;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}.mls-h.mls-hin{background-position:0 0;transition:background-position 1.6s ${EASE.slow} .1s}`;
    }
    // фото
    const ir = c.imgReveal;
    if (ir && !RMQ){
      const from = {curtain: 'clip-path:inset(0 0 100% 0)', zoom: 'opacity:0;transform:scale(.9)', fade: 'opacity:0;filter:blur(12px)', side: 'clip-path:inset(0 100% 0 0)'}[ir];
      if (from) s += `.mls-img{${from}}.mls-img.mls-iin{clip-path:inset(0);opacity:1;transform:none;filter:none;transition:clip-path 1.1s ${EASE.slow},opacity .9s,transform 1.1s ${EASE.slow},filter .9s}`;
    }
    // появление блоков
    const a = c.anim;
    if (a && a !== 'none' && !RMQ){
      const d = c.dist == null ? 40 : c.dist;
      const from = {fade: 'opacity:0', up: `opacity:0;transform:translateY(${d}px)`, down: `opacity:0;transform:translateY(-${d}px)`, left: `opacity:0;transform:translateX(-${d}px)`, right: `opacity:0;transform:translateX(${d}px)`,
        zoom: 'opacity:0;transform:scale(.92)', blur: 'opacity:0;filter:blur(14px)', flip: 'opacity:0;transform:perspective(900px) rotateX(18deg) translateY(20px);transform-origin:50% 0'}[a] || 'opacity:0';
      // пока блок «за кадром» (сдвиг/разворот), он не должен давать горизонтальную прокрутку
      s += `html,body{overflow-x:clip}.mls-a{${from}}.mls-a.mls-in{opacity:1;transform:none;filter:none;transition:opacity ${c.dur || .8}s ${EASE[c.ease] || EASE.soft},transform ${c.dur || .8}s ${EASE[c.ease] || EASE.soft},filter ${c.dur || .8}s ${EASE[c.ease] || EASE.soft};transition-delay:var(--mls-d,0s)}.mls-a.mls-done{transition:none;transform:none!important}`;
    }
    return s;
  }
  const RMQ = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // анимация появления: блоки целиком и карточки по очереди
  const SKIP = '[data-record-type="3113"],[data-record-type="706"],[data-record-type="985"],[data-record-type="228"],[data-record-type="257"],[data-record-type="360"]';
  let io = null, mo = null, ac = null;
  function anim(c){
    D.querySelectorAll('.mls-a').forEach(e => e.classList.remove('mls-a', 'mls-in', 'mls-done'));
    if (io){ io.disconnect(); io = null; } if (mo){ mo.disconnect(); mo = null; }
    ac = c; if (!c.anim || c.anim === 'none' || RMQ) return;
    io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
      // карточки в ряду — каскадом
      if (el.matches(CARDS)){ const sib = [...el.parentElement.children].filter(x => x.classList.contains('mls-a') && !x.classList.contains('mls-in')); const i = Math.max(0, sib.indexOf(el));
        el.style.setProperty('--mls-d', ((c.stagger == null ? 80 : c.stagger) * Math.min(i, 8) / 1000) + 's'); }
      requestAnimationFrame(() => el.classList.add('mls-in'));
      setTimeout(() => { el.classList.add('mls-done'); el.style.removeProperty('--mls-d'); }, ((c.dur || .8) + 1.2) * 1000);
    }), {rootMargin: '0px 0px -8% 0px', threshold: .08});
    const add = el => { if (el.classList.contains('mls-a') || el.closest('.mls-host')) return; el.classList.add('mls-a'); io.observe(el); };
    const scan = () => {
      D.querySelectorAll('.t-rec').forEach(r => { if (r.matches(SKIP) || r.offsetHeight < 20) return;
        // с карточками — анимируем карточки и заголовки (окна товаров внутри блока не трогаем)
        if (r.querySelector(CARDS)) { [...r.querySelectorAll(CARDS)].filter(x => !x.closest('.t-popup')).forEach(add); r.querySelectorAll('.t-section__topwrapper,.mk-hd,.ml-hd,.ml-cat-hd').forEach(add); }
        else if (!r.querySelector('.t-popup,.t-cover,#ml-flash,.ml-fl')) add(r); });
    };
    scan();
    mo = new MutationObserver(() => { clearTimeout(mo.t); mo.t = setTimeout(scan, 120); });
    mo.observe(D.body, {childList: true, subtree: true});
  }
  // отступы блоков: множитель к родным отступам Тильды
  function spacing(k){
    D.querySelectorAll('.t-rec').forEach(r => {
      if (r.dataset.mlsPt == null){ r.dataset.mlsPt = r.style.paddingTop || ''; r.dataset.mlsPb = r.style.paddingBottom || ''; }
      const pt = parseFloat(r.dataset.mlsPt), pb = parseFloat(r.dataset.mlsPb);
      r.style.paddingTop = k != null && pt ? Math.round(pt * k) + 'px' : r.dataset.mlsPt; r.style.paddingBottom = k != null && pb ? Math.round(pb * k) + 'px' : r.dataset.mlsPb;
    });
  }
  // ---------- заголовки: делим на слова/буквы (исходный HTML запоминаем, чтобы вернуть)
  const NOSPLIT = '.mls-host,.t-popup,.t706,.ml-pp-on,.t-catalog__product-popup,[data-record-type="3113"]';
  const orig = new Map(); let hio = null, hmo = null;
  function split(h, letters){
    let i = 0; const tw = D.createTreeWalker(h, NodeFilter.SHOW_TEXT), list = []; let n; while ((n = tw.nextNode())) list.push(n);
    list.forEach(tn => { if (!tn.nodeValue.trim()) return; const frag = D.createDocumentFragment();
      tn.nodeValue.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)){ frag.appendChild(D.createTextNode(w)); return; }
        const o = D.createElement('span'); o.className = 'mls-w'; if (letters) o.style.whiteSpace = 'nowrap';
        (letters ? [...w] : [w]).forEach(ch => { const s = D.createElement('span'); s.className = 'mls-wi'; s.textContent = ch; s.style.setProperty('--i', Math.min(i++, 60)); o.appendChild(s); });
        frag.appendChild(o); });
      tn.parentNode.replaceChild(frag, tn); });
  }
  function heads(c){
    orig.forEach((html, h) => { if (h.isConnected) h.innerHTML = html; h.classList.remove('mls-h', 'mls-hin'); }); orig.clear();
    D.querySelectorAll('.mls-h').forEach(h => h.classList.remove('mls-h', 'mls-hin'));
    if (hio){ hio.disconnect(); hio = null; } if (hmo){ hmo.disconnect(); hmo = null; }
    const ha = c.headAnim; if (!ha || RMQ) return;
    hio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; hio.unobserve(e.target); const h = e.target; requestAnimationFrame(() => requestAnimationFrame(() => h.classList.add('mls-hin'))); }), {rootMargin: '0px 0px -10% 0px'});
    const scan = () => D.querySelectorAll(HEADS).forEach(h => {
      if (h.classList.contains('mls-h') || h.closest(NOSPLIT) || !h.textContent.trim() || h.offsetHeight < 8) return;
      if (ha !== 'line' && ha !== 'light'){ orig.set(h, h.innerHTML); split(h, ha === 'letters'); }
      h.dataset.al = getComputedStyle(h).textAlign.replace('start', 'left');
      h.classList.add('mls-h'); hio.observe(h); });
    scan(); hmo = new MutationObserver(() => { clearTimeout(hmo.t); hmo.t = setTimeout(scan, 200); }); hmo.observe(D.body, {childList: true, subtree: true});
  }
  // ---------- фото: проявляются при прокрутке
  const IMGSKIP = '.mls-host,.t-popup,.t706,[data-record-type="3113"],[data-record-type="738"],.ml-marq-box,.ml-hlogo,.ml-fl,#ml-flash,.lr-stage,#ml-rooms,.ml-pp-on,.t-catalog__product-popup';
  let iio = null, imo = null;
  function imgs(c){
    D.querySelectorAll('.mls-img').forEach(e => e.classList.remove('mls-img', 'mls-iin'));
    if (iio){ iio.disconnect(); iio = null; } if (imo){ imo.disconnect(); imo = null; }
    if (!c.imgReveal || RMQ) return;
    iio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; iio.unobserve(e.target); const el = e.target; requestAnimationFrame(() => el.classList.add('mls-iin')); }), {rootMargin: '0px 0px -6% 0px', threshold: .05});
    const scan = () => D.querySelectorAll('.t-rec img,.t-rec .t-bgimg,.mk-img img').forEach(el => {
      if (el.classList.contains('mls-img') || el.closest(IMGSKIP)) return; const r = el.getBoundingClientRect(); if (r.width < 90 || r.height < 70) return;
      if (r.top < innerHeight * .9 && r.bottom > 0 && !anyReplay) return;   // уже на экране при загрузке — не прячем
      el.classList.add('mls-img'); iio.observe(el); });
    scan(); imo = new MutationObserver(() => { clearTimeout(imo.t); imo.t = setTimeout(scan, 250); }); imo.observe(D.body, {childList: true, subtree: true});
  }
  let anyReplay = false;
  // ---------- прокрутка: полоса прочитанного, кнопка «наверх», шапка прячется при прокрутке вниз
  let prog = null, topB = null, hdrEls = [], lastY = scrollY, scrollOn = false;
  function onScroll(){
    const c = window.mlStudioCfg || {}, y = scrollY, max = D.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (topB) topB.classList.toggle('on', y > innerHeight * 1.2);
    if (c.hdrHide){ const dy = y - lastY; if (y < 120 || dy < -6) root.classList.remove('mls-hdr-up'); else if (dy > 6 && !D.querySelector('.tmenu-mobile_opened,.t3113__popover_opened,.t706__cartwin_showed')) root.classList.add('mls-hdr-up'); }
    lastY = y;
  }
  function scrollFx(c){
    if (c.progress && !prog){ prog = D.createElement('div'); prog.className = 'mls-prog'; D.body.appendChild(prog); }
    if (!c.progress && prog){ prog.remove(); prog = null; }
    if (c.topBtn && !topB){ topB = D.createElement('button'); topB.className = 'mls-top'; topB.type = 'button'; topB.setAttribute('aria-label', 'Наверх');
      topB.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/></svg>';
      topB.onclick = () => scrollTo({top: 0, behavior: RMQ ? 'auto' : 'smooth'}); D.body.appendChild(topB); }
    if (!c.topBtn && topB){ topB.remove(); topB = null; }
    hdrEls.forEach(e => e.classList.remove('mls-hdr')); hdrEls = []; root.classList.remove('mls-hdr-up');
    if (c.hdrHide){ const rec = D.querySelector('[data-record-type="3113"]');
      if (rec) hdrEls = [...rec.querySelectorAll('*')].filter(e => getComputedStyle(e).position === 'fixed' && e.offsetHeight > 30 && !e.closest('.t3113__popover,.tmenu-mobile__menu'));
      // чтобы не прятать вложенные дважды — берём только внешние
      hdrEls = hdrEls.filter(e => !hdrEls.some(o => o !== e && o.contains(e))); hdrEls.forEach(e => e.classList.add('mls-hdr')); }
    if (!scrollOn && (c.progress || c.topBtn || c.hdrHide)){ scrollOn = true; addEventListener('scroll', onScroll, {passive: true}); }
    onScroll();
  }
  // ---------- звёзды на тёмных блоках
  let skyT = 0;
  const skyLayer = n => { const a = []; for (let i = 0; i < n; i++){ const x = (Math.random() * 100).toFixed(1), y = (Math.random() * 100).toFixed(1), r = (Math.random() < .85 ? 1 : 1.8);
    a.push(`radial-gradient(${r}px ${r}px at ${x}% ${y}%,color-mix(in srgb,var(--ml-amber) 70%,#fff) 98%,transparent)`); } return a.join(','); };
  let skyFirst = true;
  function sky(c){
    if (skyFirst && c.sky){ skyFirst = false; setTimeout(() => sky(window.mlStudioCfg || c), 1600); }   // тёмные блоки докрашиваются скриптами позже
    D.querySelectorAll('.mls-sky').forEach(e => e.classList.remove('mls-sky')); D.querySelectorAll('.mls-up').forEach(e => e.classList.remove('mls-up'));
    if (!c.sky) return;
    if (!root.style.getPropertyValue('--mls-sky1')){ root.style.setProperty('--mls-sky1', skyLayer(70)); root.style.setProperty('--mls-sky2', skyLayer(70)); }
    D.querySelectorAll('.t-rec').forEach(r => { if (r.matches('[data-record-type="3113"],[data-record-type="706"],[data-record-type="985"]') || r.querySelector('.ml-fl,.t-cover,.t-popup_show') || r.offsetHeight < 60) return;
      const m = getComputedStyle(r).backgroundColor.match(/[\d.]+/g); if (!m || (m.length > 3 && +m[3] < .5)) return;
      if ((.2126 * m[0] + .7152 * m[1] + .0722 * m[2]) / 255 > .3) return;
      r.classList.add('mls-sky'); [...r.children].forEach(ch => { if (getComputedStyle(ch).position === 'static') ch.classList.add('mls-up'); }); });
  }
  new MutationObserver(() => { const c = window.mlStudioCfg || {}; if (!c.sky) return; clearTimeout(skyT); skyT = setTimeout(() => sky(c), 1000); }).observe(root, {attributes: true, attributeFilter: ['data-tod']});
  // ---------- плавные переходы между страницами
  let pfOn = false;
  function pageFade(c){
    root.classList.toggle('mls-pf', !!c.pageFade && !RMQ);
    if (pfOn || !c.pageFade || RMQ) return; pfOn = true;
    addEventListener('pageshow', () => root.classList.remove('mls-out'));
    D.addEventListener('click', e => { const cc = window.mlStudioCfg || {}; if (!cc.pageFade || e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download') || a.closest('.mls-host')) return;
      const raw = a.getAttribute('href'); if (!raw || raw[0] === '#' || /^(javascript|mailto|tel|whatsapp):/i.test(raw)) return;
      let u; try { u = new URL(a.href, location.href); } catch (x){ return; }
      if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search) || /tproduct|#!/.test(u.href)) return;
      e.preventDefault(); root.classList.add('mls-out'); setTimeout(() => { location.href = u.href; }, 260); });
  }
  // ---------- тексты наших блоков (метки data-mlt): мастер меняет в Студии, попадают в HEAD как mlStudio.texts
  let tmo = null;
  function texts(){
    const T = (window.mlStudioCfg || {}).texts || {};
    if (!on && !Object.keys(T).length) return;   // у обычного посетителя без своих текстов — ничего не делаем
    D.querySelectorAll('[data-mlt]').forEach(el => {
      if (el.closest('.mls-host')) return;
      if (el.dataset.mltO == null) el.dataset.mltO = el.textContent;
      if (el === D.activeElement) return;   // её сейчас печатают — не трогаем
      const want = T[el.dataset.mlt] != null && T[el.dataset.mlt] !== '' ? T[el.dataset.mlt] : el.dataset.mltO;
      if (el.textContent !== want) el.textContent = want;
    });
    if (!tmo){ tmo = new MutationObserver(() => { clearTimeout(tmo.t); tmo.t = setTimeout(texts, 40); }); tmo.observe(D.body || root, {childList: true, subtree: true}); }
  }
  // порядок и скрытие блоков — только примерка в студии (закреплять в редакторе Тильды)
  // группы: блок Тильды + наши вставки перед ним (например, фонарик перед скрытой обложкой)
  function groups(){
    const box = D.getElementById('allrecords') || D.querySelector('.t-records'); if (!box) return [];
    const out = []; let pend = [];
    [...box.children].forEach(el => { if (el.classList.contains('t-rec')){ out.push({id: el.id, rec: el, els: pend.concat(el)}); pend = []; } else if (!/^(SCRIPT|STYLE|LINK)$/.test(el.tagName)) pend.push(el); });
    if (pend.length && out.length) out[out.length - 1].els.push(...pend);
    return out;
  }
  function blocks(c){
    const b = on && c.blocks && c.blocks[location.pathname]; const box = D.getElementById('allrecords') || D.querySelector('.t-records'); if (!box) return;
    const gs = groups();
    gs.forEach(g => g.els.forEach(e => { e.style.order = ''; e.classList.remove('mls-hide'); }));
    if (!b) { box.classList.remove('mls-order'); return; }
    box.classList.add('mls-order');
    const ord = (b.order || []).slice(); gs.forEach(g => { if (!ord.includes(g.id)) ord.push(g.id); });
    gs.forEach(g => { const i = ord.indexOf(g.id); g.els.forEach(e => e.style.order = i + 1); if ((b.hidden || []).includes(g.id)) g.els.forEach(e => e.classList.add('mls-hide')); });
  }
  const st = D.createElement('style'); st.id = 'mls-css';
  // применяем только то, что поменялось: цвета и CSS — мгновенно, анимации/отступы/блоки — лишь когда менялись их настройки
  let prev = null, lastCss = '';
  const AK = ['anim', 'dur', 'stagger', 'dist', 'ease'];
  const ch = (keys, a, b) => !a || keys.some(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
  function apply(c, force){
    c = c || cfg; window.mlStudioCfg = c;
    Object.entries(COLORS).forEach(([k, v]) => { c.colors && c.colors[k] ? root.style.setProperty(v, c.colors[k]) : root.style.removeProperty(v); });
    font(c.font); font(c.headFont);
    const t = '.mls-order{display:flex!important;flex-direction:column}.mls-hide{display:none!important}' + css(c);
    if (t !== lastCss){ st.textContent = lastCss = t; }
    if (!st.isConnected) D.head.appendChild(st);
    const p = force ? null : prev; prev = JSON.parse(JSON.stringify(c));
    const ready = () => { texts(); if (ch(AK, p, c)) anim(c); if (ch(['spacing'], p, c)) spacing(c.spacing); if (ch(['blocks'], p, c)) blocks(c);
      if (ch(['headAnim'], p, c)) heads(c); if (ch(['imgReveal'], p, c)) imgs(c); if (ch(['progress', 'topBtn', 'hdrHide'], p, c)) scrollFx(c);
      if (ch(['sky'], p, c)) sky(c); if (ch(['pageFade'], p, c)) pageFade(c);
      D.dispatchEvent(new Event('mls-apply')); };
    D.readyState === 'loading' ? D.addEventListener('DOMContentLoaded', ready, {once: true}) : ready();
  }
  apply(cfg);
  const go = () => { if (window.__mlStudioUI || D.getElementById('mls-js')) return; const s = D.createElement('script'); s.id = 'mls-js'; s.src = BASE + 'studio.js?v=' + Date.now(); D.head.appendChild(s); };
  if (on && !frame) D.readyState === 'loading' ? D.addEventListener('DOMContentLoaded', go) : go();
  // тайный вход: Ctrl+Shift+S (на любой раскладке) или 5 быстрых кликов по большому логотипу в подвале
  if (!frame){
    const open = () => { on = true; ls.set('ml-studio-on', '1'); ls.set('ml-studio-min', null);
      if (window.__mlStudioUI) return;
      // черновик мог остаться с прошлого раза — применяем его и открываем панель
      try { const d = JSON.parse(ls.get('ml-studio-draft') || 'null'); if (d) apply(Object.assign({}, head, d)); } catch (e){}
      go(); };
    D.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === 'KeyS'){ e.preventDefault(); open(); } });
    let n = 0, t = 0;
    D.addEventListener('click', e => { if (!e.target.closest || !e.target.closest('.ml-bw .ml-logo')) return;
      const now = Date.now(); n = now - t < 800 ? n + 1 : 1; t = now; if (n >= 5){ n = 0; open(); } });
  }
  if (frame) addEventListener('storage', e => { if (e.key !== 'ml-studio-draft') return; let d = {}; try { d = JSON.parse(e.newValue || '{}'); } catch (x){}
    const prev = window.mlStudioCfg, next = Object.assign({}, head, d);
    if (prev.cursor !== next.cursor || prev.flash !== next.flash) location.reload(); else apply(next); });
  // проиграть появление заново (кнопка в Студии)
  function replay(){ const c = window.mlStudioCfg || cfg; anyReplay = true; anim({}); heads({}); imgs({});
    setTimeout(() => { anim(c); heads(c); imgs(c); anyReplay = false; }, 80); }
  return {get on(){ return on; }, frame, head, cfg, apply, groups, replay, texts, FONTS, COLORS, ls};
})();
window.mlStudioApi = mlStudio;

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lerp = (a,b,t) => a + (b-a)*t;
function k2rgb(K){const t=K/100;let r,g,b;
  r=t<=66?255:329.698727446*Math.pow(t-60,-0.1332047592);
  g=t<=66?99.4708025861*Math.log(t)-161.1195681661:288.1221695283*Math.pow(t-60,-0.0755148492);
  b=t>=66?255:(t<=19?0:138.5177312231*Math.log(t-10)-305.0447927307);
  const c=v=>Math.max(0,Math.min(255,Math.round(v)));return `rgb(${c(r)},${c(g)},${c(b)})`}


function rooms(){
  const host = document.getElementById('ml-rooms'); if (!host) return;
  host.innerHTML = "<div class=\"ml-wrap\">\n  <div class=\"ml-hd\"><h2 data-mlt=\"rooms.title\">Включите свет в комнате</h2>\n  <p data-mlt=\"rooms.text\">Ваши комнаты со светильниками из нашего каталога. Включайте каждый светильник, меняйте яркость и цвет света от тёплого 2700&nbsp;K до&nbsp;холодного 6500&nbsp;K.</p></div>\n  <div class=\"lr\" id=\"lr\" aria-label=\"Живая комната: интерактивный свет\">\n    <div class=\"lr-view\">\n      <div class=\"lr-frame\" id=\"lrFrame\">\n        <canvas id=\"lrCv\" aria-label=\"Комната с выбранным светом\"></canvas>\n        <div class=\"lr-loading\" id=\"lrLoading\">Загружаю комнату…</div>\n        <div class=\"lr-tag\" id=\"lrTag\"><b>Вечер</b> · 2700 K</div>\n      </div>\n      <div class=\"lr-k\">\n        <div class=\"lr-krow\"><div class=\"lr-kval\" id=\"kval\">2700 K<small>тёплый</small></div><div class=\"lr-chips\" id=\"lrK\"></div></div>\n        <input id=\"mlK\" class=\"kt\" type=\"range\" min=\"2700\" max=\"6500\" step=\"50\" value=\"2700\" aria-label=\"Цветовая температура, К\">\n        <div class=\"lr-scale\"><span>2700 K</span><span>4000 K</span><span>6500 K</span></div>\n      </div>\n    </div>\n    <div class=\"lr-panel\">\n      <div class=\"lr-rooms\" id=\"lrRooms\" role=\"tablist\" aria-label=\"Комната\"></div>\n      <div class=\"lr-seg\" role=\"radiogroup\" aria-label=\"Время суток\">\n        <button type=\"button\" id=\"lrNight\" role=\"radio\" class=\"on\" aria-checked=\"true\">Вечер</button>\n        <button type=\"button\" id=\"lrDay\" role=\"radio\" aria-checked=\"false\">День</button>\n      </div>\n      <div class=\"lr-lbl\">Сценарии</div>\n      <div class=\"lr-chips lr-scenes\" id=\"lrScenes\"></div>\n      <div class=\"lr-lbl\">Светильники</div>\n      <div class=\"lr-list\" id=\"lrList\"></div>\n    </div>\n  </div>\n  <p class=\"lr-note\" id=\"lrNote\"></p>\n  <div class=\"ml-cta\"><a class=\"ml-btn\" href=\"https://wa.me/996998899675?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%9F%D0%BE%D0%BC%D0%BE%D0%B3%D0%B8%D1%82%D0%B5%20%D0%BF%D0%BE%D0%B4%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%81%D0%B2%D0%B5%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BD%D0%B0%D1%82%D1%8B\" target=\"_blank\" rel=\"noopener\" data-mlt=\"rooms.cta\">Подобрать свет для моей комнаты</a></div>\n</div>";
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
// «Посмотреть в интерьере»: открыть комнату вечером, включён только этот светильник
window.lrShow = async (id, light) => {
  if (!ROOMS[id]) return;
  if (st.room !== id) await loadRoom(id); else await window.lrReady;
  if (!ready) return;
  sceneName = ""; st.day = false; st.k = 2700; $('mlK').value = st.k;
  R.lights.forEach(l => { st.on[l.id] = l.id === light; });
  if (light) st.dim[light] = 1;
  sync(); kick();
};
const start = (frame.dataset.room && ROOMS[frame.dataset.room]) ? frame.dataset.room : 'living';
window.lrReady = loadRoom(start);
})();

  // свет «включается» по очереди, когда блок докрутили до экрана
  // ссылка со страницы товара: /#ml-room=kitchen.pend — комната с включённым только этим светильником
  const mh = location.hash.match(/^#ml-room=(\w+)\.(\w+)/);
  if (mh){
    history.replaceState(null, '', location.pathname + location.search);
    const toRooms = () => scrollTo({top: document.getElementById('lrFrame').getBoundingClientRect().top + scrollY - ((document.querySelector('.t3113__header') || {}).offsetHeight || 80) - 16});
    setTimeout(() => { toRooms(); if (window.lrShow) window.lrShow(mh[1], mh[2]); }, 500);
    setTimeout(toRooms, 1600);
  }
  else if (!RM) new IntersectionObserver(([e], o) => { if (e.isIntersecting && window.lrIntro){ o.disconnect(); window.lrIntro(); } }, {threshold:.4}).observe(document.getElementById('lrFrame'));
}
function extras(){
  const D = document, root = D.documentElement;
  const store = {get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }};
  const rec = t => D.querySelector('.t-rec[data-record-type="' + t + '"]');
  const coarse = matchMedia('(pointer:coarse)').matches;

  // ---------- фирменный стиль блоков Тильды (CSS в extras.css); отключить: data-brand="off"
  if (SCRIPT && SCRIPT.dataset.brand === 'off') root.classList.add('ml-nobrand');
  else { const ht = D.querySelector('.t183__title');
    if (ht && !D.querySelector('.ml-hero-eye')){ const e = D.createElement('div'); e.className = 'ml-hero-eye'; e.dataset.mlt = 'hero.eye'; e.textContent = 'здесь есть свет.'; ht.before(e); } }

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
  menu.innerHTML = '<p data-mlt="tod.text">Сайт освещён по вашему времени. Можно выбрать вручную.</p>' +
    [['auto','Авто','по часам'], ...Object.entries(TOD).map(([k,v]) => [k, v.name, v.hint])]
    .map(([m,n,h]) => `<button type="button" role="menuitemradio" data-m="${m}">${n}<span>${h}</span></button>`).join('');
  let last = null;
  function apply(){
    const now = new Date(), mode = pick === 'auto' ? autoMode(now.getHours()) : pick;
    root.dataset.tod = mode;
    const hm = now.toLocaleTimeString('ru-RU', {hour:'2-digit', minute:'2-digit'});
    btn.innerHTML = `<i></i>${TOD[mode].name}<small>${pick === 'auto' ? '· ' + hm : '· изменить'}</small>`;
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

  // ---------- «Каталог» в шапке (вместо второй строки меню): слева после соцсетей; только ПК
  const addHcat = () => { const lw = D.querySelector('.t3113__firstlevel__leftwrapper');
    if (lw && !D.querySelector('.ml-hcat')){
      const a = D.createElement('a'); a.className = 'ml-hcat'; a.href = '/#ml-catalog';
      a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg><span>Каталог</span>';
      a.onclick = e => { const rc = rec('2861'); if (!rc) return; e.preventDefault();
        scrollTo({top: rc.getBoundingClientRect().top + scrollY - ((D.querySelector('.t3113__header') || {}).offsetHeight || 80), behavior: RM ? 'auto' : 'smooth'}); };
      lw.appendChild(a);
    } };
  addHcat(); [600, 1500, 3000].forEach(t => setTimeout(addHcat, t));

  // ---------- фонарик: курсор — луч света в тёмной спальне
  // первый экран: обложка Тильды (T183 «Создаём атмосферу…», rec 206) скрыта, на её месте фонарик
  let flHost = D.getElementById('ml-flash'), flHero = false;
  const cover = (D.querySelector('.t183') || {}).closest ? D.querySelector('.t183').closest('.t-rec') : null;
  if (!flHost){
    const before = cover;   // только первым экраном на главной; на других страницах фонарик не ставим
    if (before && (window.mlStudioCfg || {}).flash !== false){ flHost = D.createElement('div'); flHost.id = 'ml-flash'; before.parentNode.insertBefore(flHost, before); }
  }
  if (flHost && cover && flHost.nextElementSibling === cover){ cover.style.display = 'none'; flHero = true; flHost.classList.add('ml-fl-hero');
    const hdr = () => { const t = flHost.getBoundingClientRect().top + scrollY; if (t > 0 && t < 200) flHost.style.setProperty('--ml-hdr', Math.round(t) + 'px'); };
    hdr(); addEventListener('resize', hdr); setTimeout(hdr, 1200); }
  if (flHost){
    const ld = flHero ? 'eager" fetchpriority="high' : 'lazy';
    flHost.innerHTML = `<section class="ml-fl" aria-label="Спальня: без света и со светом"><div class="fl-box">
      <img src="${BASE}fl/off.jpg" alt="" aria-hidden="true" loading="${ld}" decoding="async">
      <img class="fl-on" src="${BASE}fl/on.jpg" alt="Спальня с включённым светом: люстра Ambrella LH55114, лампы EGLO Viserbella, подсветка изголовья и парящий потолок" loading="${ld}" decoding="async">
      <div class="fl-flash" aria-hidden="true"><i class="fl-wave"></i><svg class="fl-rays" viewBox="-50 -50 100 100"><g>${[0,45,90,135,180,225,270,315].map(a => `<line x1="0" y1="${a % 90 ? -9 : -11}" x2="0" y2="${a % 90 ? -30 : -48}" transform="rotate(${a})"/>`).join('')}</g></svg><svg class="fl-star" viewBox="-13 -13 26 26"><path d="M0,-12 C1,-3 3,-1 12,0 C3,1 1,3 0,12 C-1,3 -3,1 -12,0 C-3,-1 -1,-3 0,-12Z"/></svg></div>
      <div class="ml-fl-ui"><span class="ml-fl-hint">${coarse ? 'Ведите пальцем — это луч' : 'Ведите курсором — это луч'}</span><button type="button" class="ml-fl-sw" aria-pressed="false">Включить свет</button></div>
      <div class="ml-fl-txt"><div class="ml-fl-wrap"><div class="ml-fl-eye" data-mlt="fl.eye">Спальня · 2700 K</div>
        <h2><span data-mlt="fl.title1">Без света комната</span> <b data-mlt="fl.title2">просто темнота</b></h2>
        <p data-mlt="fl.text">Одна и та же спальня: в темноте и с люстрой Ambrella LH55114, лампами EGLO Viserbella, подсветкой изголовья и парящим потолком. Подберём такой же свет для вашей.</p></div></div>
    </div></section>`;
    const sec = flHost.firstChild, fl = sec.querySelector('.fl-box'), on = fl.querySelector('.fl-on'), sw = fl.querySelector('.ml-fl-sw');
    let tx = .5, ty = .45, cx = .5, cy = .45, idle = 0, user = false, vis = false;
    const set = e => { if (e.target.closest('.ml-fl-ui')) return; const b = fl.getBoundingClientRect(); tx = (e.clientX - b.left)/b.width; ty = (e.clientY - b.top)/b.height; user = true; idle = performance.now(); };
    fl.addEventListener('pointermove', set, {passive:true});
    fl.addEventListener('pointerdown', set, {passive:true});
    // включение: луч сжимается в точку → вспыхивает звезда → свет разливается из неё на всю комнату;
    // выключение: свет стягивается обратно в звезду, она гаснет, луч раскрывается снова
    const fx = fl.querySelector('.fl-flash'), fxStar = fx.querySelector('.fl-star'), fxRays = fx.querySelector('.fl-rays'), fxWave = fx.querySelector('.fl-wave');
    let want = false, anim = null, flashed = false;
    const beamR = b => Math.max(150, Math.min(b.width, b.height*1.8)*.2);
    const floodR = b => 1.5*Math.hypot(Math.max(cx, 1 - cx)*b.width, Math.max(cy, 1 - cy)*b.height);
    function flash(on){
      fx.style.left = (cx*100) + '%'; fx.style.top = (cy*100) + '%';
      const o = {fill:'forwards'}, OUT = 'cubic-bezier(.2,.8,.2,1)', IN = 'cubic-bezier(.6,0,.9,.4)';  // плавность — по участкам, иначе пик звезды уезжает раньше света
      if (on){
        fxStar.animate([{transform:'scale(0) rotate(-90deg)', opacity:0, easing:OUT}, {transform:'scale(2.1) rotate(0deg)', opacity:1, offset:.28, easing:'ease-in-out'},
          {transform:'scale(1.1) rotate(25deg)', opacity:1, offset:.6, easing:IN}, {transform:'scale(0) rotate(45deg)', opacity:0}], {...o, duration:1300});
        fxRays.animate([{transform:'scale(.2) rotate(0deg)', opacity:0, easing:OUT}, {transform:'scale(1) rotate(10deg)', opacity:1, offset:.25, easing:OUT},
          {transform:'scale(1.9) rotate(22deg)', opacity:0}], {...o, duration:1000});
        fxWave.animate([{transform:'scale(0)', opacity:.9}, {transform:'scale(14)', opacity:0}], {...o, duration:1100, easing:'cubic-bezier(.1,.7,.3,1)'});
      } else {
        fxStar.animate([{transform:'scale(0) rotate(45deg)', opacity:0, easing:IN}, {transform:'scale(1.5) rotate(0deg)', opacity:1, offset:.58, easing:OUT},
          {transform:'scale(1.9) rotate(-10deg)', opacity:1, offset:.68, easing:IN}, {transform:'scale(0) rotate(-90deg)', opacity:0}], {...o, duration:1100});
        fxRays.animate([{transform:'scale(1.7)', opacity:0, easing:IN}, {transform:'scale(.9)', opacity:.8, offset:.6, easing:IN}, {transform:'scale(.1)', opacity:0}], {...o, duration:1050});
      }
    }
    sw.onclick = e => {
      want = !want; sw.setAttribute('aria-pressed', want); sw.textContent = want ? 'Выключить' : 'Включить свет';
      if (RM){ sec.classList.toggle('lit', want); return; }
      // точка вспышки — под курсором (на кнопке), иначе звезда рождается там, где гуляет луч, и выглядит как «улетевший курсор»;
      // с клавиатуры (detail 0) — там, где луч
      const b = fl.getBoundingClientRect(), mouse = e && e.detail > 0;
      const px = mouse ? (e.clientX - b.left)/b.width : cx, py = mouse ? (e.clientY - b.top)/b.height : cy;
      anim = {on:want, t0:performance.now(), x0:cx, y0:cy, x1:px, y1:py}; flashed = false;
      tx = px; ty = py; user = true; idle = performance.now() + (want ? 1500 : 1150);  // после выключения луч сперва стоит у кнопки
      if (!want){ cx = px; cy = py; sec.classList.remove('lit'); flash(false); }  // маска возвращается сразу, но закрывает всю комнату — шва нет
      requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) requestAnimationFrame(loop); }).observe(fl);
    function loop(t){
      if (!vis) return;
      const b = fl.getBoundingClientRect();
      let r = beamR(b), core = 0;
      if (anim){  // во время перехода луч стоит на месте
        const p = Math.min(1, (t - anim.t0) / (anim.on ? 1500 : 1150)), eo = x => 1 - Math.pow(1 - x, 3), R = floodR(b);
        if (anim.on){
          if (p < .2){ const q = eo(p/.2); r = beamR(b) * (1 - q) + 2;          // луч подъезжает к курсору и сжимается в точку
            cx = anim.x0 + (anim.x1 - anim.x0)*q; cy = anim.y0 + (anim.y1 - anim.y0)*q; }
          else { if (!flashed){ flashed = true; flash(true); }
            const q = eo((p - .2)/.8); r = 2 + (R - 2)*q; core = 70*q; }        // точка → свет на всю комнату
          if (p >= 1){ anim = null; sec.classList.add('lit'); }
        } else {
          if (p < .55){ const q = eo(p/.55); r = R - (R - 2)*q; core = 70*(1 - q); }   // свет стягивается в звезду
          else r = 2 + (beamR(b) - 2)*eo((p - .55)/.45);                                // звезда гаснет, луч раскрывается
          if (p >= 1) anim = null;
        }
      } else if (!sec.classList.contains('lit')){
        if (!user || t - idle > 2600){ user = false; const s = t/1000; tx = .5 + .28*Math.sin(s*.55); ty = .42 + .16*Math.sin(s*.9 + 1); }
        cx = lerp(cx, tx, RM ? 1 : .09); cy = lerp(cy, ty, RM ? 1 : .09);
      } else { cx = tx; cy = ty; }  // свет горит: точка вспышки при выключении — там, где курсор
      on.style.setProperty('--fx', (cx*100) + '%'); on.style.setProperty('--fy', (cy*100) + '%');
      on.style.setProperty('--fr', Math.round(r) + 'px'); on.style.setProperty('--fc', core.toFixed(1) + '%');
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
      box.innerHTML = `<div class="ml-3d-hd" data-mlt="models.title">3D-модели для дизайнеров</div><div class="ml-3d-grid" style="--n:${links.length}">` +
        links.map(x => `<a class="ml-3d-c" href="${x.href}" target="_blank" rel="noopener"><b>${nice(x.name)}</b><span>3D-модели<i aria-hidden="true">↗</i></span></a>`).join('') + '</div>';
      const row = m3.querySelector('.t1331') || m3.firstElementChild;
      row.style.display = 'none'; m3.appendChild(box);
    }
  }

  // ---------- подвал: слово moonlight подсвечивается курсором
  const ft = rec('718') || D.getElementById('t-footer');
  if (ft && !D.querySelector('.ml-bw')){
    const bwBox = D.createElement('div'); bwBox.className = 'ml-bw';
    bwBox.innerHTML = '<div class="ml-logo" role="img" aria-label="Moonlight"></div><div class="ml-slogan" data-mlt="logo.slogan">профессиональное освещение</div>';
    ft.matches('.t-rec') ? ft.after(bwBox) : ft.prepend(bwBox);
    const words = [bwBox.querySelector('.ml-logo')];
    const vis = () => words.find(el => el.offsetWidth > 0) || words[0];
    const bw = { getBoundingClientRect: () => vis().getBoundingClientRect() };
    const lit = [vis(), bwBox.querySelector('.ml-slogan')];
    const setB = (x, y) => lit.forEach(el => { const b = el.getBoundingClientRect(); el.style.setProperty('--bx', (x - b.left) + 'px'); el.style.setProperty('--by', (y - b.top) + 'px'); });
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

  // ---------- шапка: живой логотип вместо PNG (ярче, лунное сияние, подсвечивается курсором)
  // PNG лежит внутри контейнера, который ночью инвертируется, поэтому наш логотип — сосед этого контейнера
  // в .t3113__firstlevel и встаёт ровно на место картинки.
  // На телефоне то же самое: PNG в .tmenu-mobile__container (его ночью инвертируют), наш логотип — в .tmenu-mobile.
  const hLit = [];
  const hMount = (host, imgSel, mob) => {
    if (host.querySelector(':scope > .ml-hlogo')) return;
    const imgs = () => [...host.querySelectorAll(imgSel)];
    const vis = () => imgs().find(i => i.getBoundingClientRect().width > 0);
    const a = imgs()[0] && imgs()[0].closest('a');
    const hl = D.createElement('a'); hl.className = 'ml-hlogo' + (mob ? ' ml-hlogo-m' : ''); hl.href = (a && a.getAttribute('href')) || '/'; hl.setAttribute('aria-label', 'Moonlight — на главную');
    hl.innerHTML = '<i class="ml-hlogo-w"></i><span class="ml-hlogo-s" data-mlt="logo.slogan">профессиональное освещение</span>';
    host.appendChild(hl); D.documentElement.classList.add('ml-hlogo-on');
    const place = () => { const im = vis(), p = host.getBoundingClientRect();
      if (!im) { hl.style.display = 'none'; return; }
      const r = im.getBoundingClientRect();
      hl.style.display = ''; hl.style.left = (r.left - p.left) + 'px'; hl.style.top = (r.top - p.top) + 'px'; hl.style.width = r.width + 'px'; hl.style.height = r.height + 'px'; };
    place(); imgs().forEach(i => i.complete || i.addEventListener('load', place));
    if (window.ResizeObserver) new ResizeObserver(place).observe(host);
    addEventListener('resize', place, {passive:true}); setTimeout(place, 600); setTimeout(place, 2000);
    hLit.push(hl.querySelector('.ml-hlogo-w'), hl.querySelector('.ml-hlogo-s'));
  };
  D.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return;
    hLit.forEach(el => { const b = el.getBoundingClientRect(); if (!b.width) return; el.style.setProperty('--bx', (e.clientX - b.left) + 'px'); el.style.setProperty('--by', (e.clientY - b.top) + 'px'); }); }, {passive:true});
  (function hLogo(n){
    const hImg = D.querySelector('.t3113__header img.t-menu-base__imglogo');
    const hLvl = hImg && hImg.closest('.t3113__firstlevel');
    if (hLvl) hMount(hLvl, '.t3113__header img.t-menu-base__imglogo', false);
    const mImg = D.querySelector('.tmenu-mobile img.t-menu-base__imglogomobile');
    const mHost = mImg && mImg.closest('.tmenu-mobile');
    if (mHost) hMount(mHost, 'img.t-menu-base__imglogomobile', true);
    if ((!hLvl || !mHost) && n < 60) setTimeout(() => hLogo(n + 1), 250);
  })(0);
  // ---------- общие карточка товара, корзина и окно товара (страницы категорий и каталог на главной)
  const ML_WA = '996998899675';
  const mlEsc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const mlFmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');
  const mlPlural = (n, a, b, c) => { n = Math.abs(n) % 100; const d = n % 10; return n > 10 && n < 20 ? c : d === 1 ? a : d > 1 && d < 5 ? b : c; };
  // большой заголовок: слова не рвём, а уменьшаем шрифт, пока самое длинное слово не влезет в ширину
  const mlFitH1 = (() => {
    const set = new Set();
    const fit = h => {
      if (!h.isConnected){ set.delete(h); return; }
      h.style.fontSize = '';
      if (!h.clientWidth) return;
      let fs = parseFloat(getComputedStyle(h).fontSize), n = 0;
      while (h.scrollWidth > h.clientWidth + 1 && fs > 16 && n++ < 60){ fs -= 1; h.style.fontSize = fs + 'px'; }
    };
    const all = () => set.forEach(fit);
    let t = 0; const later = () => { clearTimeout(t); t = setTimeout(all, 60); };
    addEventListener('resize', later);
    document.addEventListener('mls-apply', later);
    if (document.fonts){ document.fonts.ready.then(all); document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', later); }
    return h => { if (!h) return; set.add(h); fit(h); requestAnimationFrame(() => fit(h)); };
  })();
  const ML_ICO = {
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/></svg>',
    room: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10l9-6 9 6v10H3z"/><path d="M12 9v3m-2.5 0h5l-1 3h-3z"/></svg>'
  };
  // host — контейнер (в него добавляется окно товара); grid-ы подключаются через shop.bind(grid)
  function mlShop(host){
    const esc = mlEsc, fmt = mlFmt, ICO = ML_ICO, byId = {};
    const priceHtml = x => x.p ? `${x.po ? `<s>${fmt(x.po)}</s>` : ''}${fmt(x.p)} <small>сом</small>` : '<span class="mc-ask">Цена по запросу</span>';
    const card = x => { byId[x.id] = x; return `<article class="mk-card" data-id="${x.id}" tabindex="0">
  <div class="mk-img">${x.i ? `<img src="${esc(x.i)}" alt="${esc(x.n)}" loading="lazy">` : '<span class="mc-noimg">нет фото</span>'}${x.po ? '<b class="mc-sale">скидка</b>' : ''}</div>
  ${x.b ? `<div class="mc-brand">${esc(x.b)}</div>` : ''}<h3>${esc(x.n)}</h3><div class="mk-sku">${x.s ? 'Арт. ' + esc(x.s) : ' '}</div>
  <div class="mk-buy"><div class="mk-price">${priceHtml(x)}</div><button type="button" class="mk-add">${x.p ? 'В корзину' : 'Спросить'}</button></div>
</article>`; };
    // корзина Тильды; без цены или без корзины — WhatsApp
    const waLink = x => `https://wa.me/${ML_WA}?text=` + encodeURIComponent(`Здравствуйте! Интересует ${x.n}${x.s ? ` (арт. ${x.s})` : ''}`);
    function add(x, btn){
      if (x.p && window.tcart__addProduct){
        window.tcart__addProduct({name: x.n, price: x.p, img: x.i, sku: x.s, quantity: 1, uid: x.id});
        if (btn){ const t = btn.textContent; btn.classList.add('mk-done'); btn.innerHTML = ICO.ok + '<span>В корзине</span>'; setTimeout(() => { btn.classList.remove('mk-done'); btn.textContent = t; }, 1800); }
      } else window.open(waLink(x), '_blank', 'noopener');
    }
    function bind(grid){
      grid.addEventListener('click', e => {
        const el = e.target.closest('.mk-card'); if (!el || !byId[el.dataset.id]) return; const x = byId[el.dataset.id];
        if (e.target.closest('.mk-add')){ add(x, e.target.closest('.mk-add')); return; }
        open(x);
      });
      grid.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('mk-card')) e.target.click(); });
    }
    // окно товара
    const pop = D.createElement('div'); pop.className = 'mk-pop'; pop.hidden = true;
    pop.innerHTML = '<div class="mk-pop-bg"></div><div class="mk-pop-card" role="dialog" aria-modal="true"></div>';
    host.appendChild(pop);
    const pc = pop.querySelector('.mk-pop-card');
    function open(x){
      const gal = [x.i].concat(x.g || []).filter(Boolean);
      const room = (typeof ML_IN_ROOM !== 'undefined') && ML_IN_ROOM.find(r => r[0].test(x.n + ' ' + x.s));
      pc.dataset.id = x.id;
      pc.innerHTML = `<button type="button" class="mk-x" aria-label="Закрыть">${ICO.x}</button>
<div class="mc-pop-l"><div class="mk-pop-img">${gal[0] ? `<img src="${esc(gal[0])}" alt="${esc(x.n)}">` : '<span class="mc-noimg">нет фото</span>'}</div>
  ${gal.length > 1 ? `<div class="mc-thumbs">${gal.map((g, i) => `<button type="button" data-g="${i}" aria-label="Фото ${i + 1}"${i ? '' : ' class="on"'}><img src="${esc(g)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}</div>
<div class="mk-pop-info">
  <div class="mk-eye">${x.b ? `<b>${esc(x.b)}</b>` : ''}${x.s ? `<span>Арт. ${esc(x.s)}</span>` : ''}</div>
  <h2>${esc(x.n)}</h2>
  <div class="mk-pop-price">${priceHtml(x)}</div>
  <button type="button" class="mk-add mk-add-l">${x.p ? 'В корзину' : 'Узнать цену в WhatsApp'}</button>
  ${room ? `<a class="mk-wa mc-room" href="/#ml-room=${room[1]}.${room[2]}">${ICO.room}<span>Посмотреть в интерьере · ${room[3]}</span></a>` : ''}
  <a class="mk-wa" href="${waLink(x)}" target="_blank" rel="noopener">${ICO.wa}<span>Спросить в WhatsApp</span></a>
  ${x.sp && x.sp.length ? `<dl class="mk-specs">${x.sp.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
  ${x.d ? `<p class="mc-descr">${esc(x.d)}</p>` : ''}
</div>`;
      pc.querySelector('.mk-x').onclick = close;
      pc.querySelector('.mk-add').onclick = e => add(x, e.currentTarget);
      const big = pc.querySelector('.mk-pop-img img');
      pc.querySelectorAll('.mc-thumbs button').forEach(b => b.onclick = () => {
        pc.querySelectorAll('.mc-thumbs button').forEach(t => t.classList.toggle('on', t === b));
        big.style.opacity = 0; const n = new Image(); n.onload = n.onerror = () => { big.src = gal[+b.dataset.g]; big.style.opacity = ''; }; n.src = gal[+b.dataset.g];
      });
      pop.hidden = false; D.documentElement.classList.add('mk-lock'); pc.scrollTop = 0;
      requestAnimationFrame(() => pop.classList.add('on'));
    }
    function close(){ pop.classList.remove('on'); D.documentElement.classList.remove('mk-lock'); setTimeout(() => { pop.hidden = true; }, RM ? 0 : 260); }
    pop.querySelector('.mk-pop-bg').onclick = close;
    D.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) close(); });
    return {card, add, bind, open, isOpen: () => !pop.hidden, priceHtml};
  }
  // ---------- живой каталог Тильды: товары, разделы и описания берутся прямо из «Каталога товаров» проекта.
  // Страница сама сообщает свой раздел: родной блок каталога Тильды (ST340… и т.п.) кладёт в код var options={recid,storepart}.
  // На адресах /catalog/<uid>-<slug> Тильда подставляет раздел сама, на обычной странице — раздел, выбранный в настройках блока.
  const mlStore = (() => {
    const API = 'https://store.tildaapi.one/api/getproductslist/';
    const tx = D.createElement('textarea');
    const clean = s => { tx.innerHTML = String(s || '').replace(/<[^>]+>/g, ' '); return tx.value.replace(/\s+/g, ' ').trim(); };
    // характеристики: сначала родное поле Тильды «Характеристики», потом строки «Ключ: значение» из текста товара
    function specs(p){
      const out = [], seen = new Set();
      const push = (k, v) => { k = String(k || '').trim().replace(/,$/, '').replace(/,?\s+мм$/, ', мм'); v = String(v || '').trim();
        if (!k || !v || seen.has(k.toLowerCase()) || /^технические/i.test(k) || v.length > 80) return; seen.add(k.toLowerCase()); out.push([k, v]); };
      (p.characteristics || []).forEach(c => push(c.title, c.value));
      String(p.text || '').split(/<br\s*\/?>|<\/p>|<\/div>|<\/li>|\n/i).forEach(line => { const m = clean(line).match(/^([^:]{2,40}):\s*(.+)$/); if (m) push(m[1], m[2]); });
      return out.slice(0, 16);
    }
    // бренд: поле «Бренд» в карточке товара. Если пусто — пробуем узнать по названию (подсказка, лучше заполнять поле)
    const NORM = [['reluce', 'Reluce'], ['ambrella', 'Ambrella Light'], ['philips', 'PHILIPS'], ['st luce', 'ST Luce'], ['odeon', 'Odeon Light']];
    const GUESS = ['Reluce', 'Ambrella', 'EGLO', 'MLT', 'LUMINAIR', 'Maytoni', 'Odeon', 'Lumion', 'Novotech', 'PHILIPS', 'Geniled', 'ST Luce', 'Schneider',
      'Kranz', 'Arte Lamp', 'Citilux', 'Feron', 'Gauss', 'Elektrostandard', 'TOT', 'WESA', 'Crystal Lux', 'Vele Luce', 'Lightstar', 'Freya', 'Sonex', 'Loft It', 'Kink Light', 'Arlight'];
    function brand(p){
      const b = String(p.brand || '').trim();
      if (b){ const n = NORM.find(([k]) => b.toLowerCase().startsWith(k)); return n ? n[1] : b; }
      const t = p.title + ' ' + clean(p.text);
      const g = GUESS.find(x => new RegExp('(^|[^\\wА-я])' + x.replace(/ /g, '\\s') + '([^\\wА-я]|$)', 'i').test(t));
      if (!g) return '';
      const n = NORM.find(([k]) => g.toLowerCase().startsWith(k)); return n ? n[1] : g === 'Schneider' ? 'Schneider Electric' : g;
    }
    const num = v => Math.round(parseFloat(String(v || '0').replace(/[^\d.,]/g, '').replace(',', '.')) || 0);
    function item(p){
      let gal = []; try { gal = JSON.parse(p.gallery || '[]').map(g => g.img).filter(Boolean); } catch (e) {}
      const pr = num(p.price), po = num(p.priceold);
      const x = {id: String(p.uid), n: clean(p.title), b: brand(p), s: p.sku || '', p: pr, i: gal[0] || '', u: p.url || '', sp: specs(p),
        pu: (Array.isArray(p.partuids) ? p.partuids : String(p.partuids || '').match(/\d+/g) || []).map(String)};
      if (gal.length > 1) x.g = gal.slice(1, 6);
      if (po > pr) x.po = po;
      const d = clean(p.descr); if (d) x.d = d.slice(0, 300);
      return x;
    }
    // настройки родного блока каталога на этой странице
    function opts(){
      for (const s of D.scripts){ const m = s.textContent.match(/var options=\{recid:'(\d+)',storepart:'(\d+)'/); if (m) return {rec: m[1], part: m[2]}; }
      return null;
    }
    const url = (part, rec, slice, size) => `${API}?storepartuid=${part}&recid=${rec}&getallparts=true&getpartinfo=true&getbreadcrumbs%5B%5D=parts&slice=${slice}&size=${size}`;
    // все товары раздела (с подразделами) + дерево разделов + крошки; size=1 — только сведения о разделе и первый товар
    async function load(part, rec, size){
      size = size || 500;
      let slice = 1, first = null; const items = [];
      for (let guard = 0; guard < 20; guard++){
        const r = await fetch(url(part, rec, slice, size)); if (!r.ok) throw new Error('store ' + r.status);
        const j = await r.json(); if (!first) first = j;
        (j.products || []).forEach(p => items.push(item(p)));
        if (size < 500 || !j.nextslice || j.nextslice == slice) break; slice = j.nextslice;
      }
      const flat = [], walk = (ps, par) => (ps || []).forEach(p => { flat.push(Object.assign({}, p, {parentuid: p.parentuid || par || ''})); walk(p.subparts, p.uid); });
      walk(first.parts);
      const parts = flat.filter(p => !p.hideonpublic).map(p => ({uid: String(p.uid), t: p.title, h: p.alias || '', img: p.img || '',
        d: p.description || '', par: String(p.parentuid || ''), root: !!p.root, sort: +p.sort || 0}));
      return {info: first.partinfo || {}, crumbs: first.breadcrumbs || [], parts, total: first.total || items.length, items};
    }
    // прямые подразделы раздела по порядку из Тильды
    // (у разделов верхнего уровня parentuid пустой — они дети корня «Все»)
    const kids = (parts, uid) => { uid = String(uid); const r = parts.find(p => p.root), isRoot = !parts.some(p => p.uid === uid) || (r && r.uid === uid);
      return parts.filter(p => !p.root && (p.par === uid || (isRoot && !p.par))).sort((a, b) => a.sort - b.sort); };
    const rootOf = parts => parts.find(p => p.root);
    // к какому из прямых подразделов относится товар (с учётом вложенности глубже)
    function kidOf(parts, uid){
      const byId = {}; parts.forEach(p => byId[p.uid] = p);
      const ks = new Set(kids(parts, uid).map(k => k.uid));
      return x => { for (const pu of x.pu){ let c = byId[pu], g = 0; while (c && g++ < 8){ if (ks.has(c.uid)) return c.uid; c = byId[c.par]; } } return ''; };
    }
    return {opts, load, kids, kidOf, rootOf, clean};
  })();
  // ---------- каталог: панель разделов слева + выезжающая шторка, товары Тильды справа
  // страницы, которые уже собраны на тест-сайте: ссылки живого сайта ведут на них (только на *.tilda.ws)
  const ML_LOCAL = {'/kranz_round': '/kranz'};
  // страницы категорий тест-сайта — те же адреса, что на живом
  'lustra lustra_potolok podvessvetilniki nastensvet nastolsvet tochechnye_svetilniki nakladnye_svetilniki svetilniki_gipsovye ulichnye_osveshchenie kommercheskie standart_lamp lamposhki lenta profil bloki_pitaniya umnye_datchiki termostaty shinoprovod_220 svet_220 magnit_shinoprovod magneticstandard magnet20 super5 stluceband eglo lyuchki atlas_design_karbon asfora_rozetki rita-mutlusan_bk totelectric wesa artgallery'.split(' ').forEach(s => { ML_LOCAL['/' + s] = '/' + s; });
  const mlLocal = h => { if (!/\.tilda\.ws$/.test(location.host)) return h;
    const m = String(h).match(/^https?:\/\/(?:www\.)?moonlight-kg\.store(\/[^?#]*)/); return m && ML_LOCAL[m[1]] ? ML_LOCAL[m[1]] : h; };
  D.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href*="moonlight-kg.store/"]'); if (!a) return;
    const n = mlLocal(a.getAttribute('href')); if (n !== a.getAttribute('href')){ e.preventDefault(); e.stopPropagation(); location.href = n; } }, true);
  // «Контакты» (/podval): если блок контактов есть на странице — плавно к нему; на тест-сайте страницы /podval нет
  D.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href$="/podval"]'); if (!a) return;
    const rec = [...D.querySelectorAll('.t-rec')].find(r => /контактная информация/i.test(r.textContent));
    if (rec){ e.preventDefault(); e.stopPropagation(); const hd = D.querySelector('.t3113__header, .tmenu-mobile'); window.scrollTo({top: rec.getBoundingClientRect().top + scrollY - (hd ? hd.offsetHeight : 80), behavior: 'smooth'}); }
    else if (/\.tilda\.ws$/.test(location.host)){ e.preventDefault(); location.href = 'https://moonlight-kg.store/podval'; } }, true);
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
      groups.push({name, subs: subs.map(s => ({t: s.textContent.trim(), h: mlLocal(s.getAttribute('href') || '#')}))});
    });
    // бренды — из логотипов слайдера T738
    const brands = [...D.querySelectorAll('.t738__item')].map(it => {
      const a = it.querySelector('a'), i = it.querySelector('img'); const src = i && (i.getAttribute('data-original') || i.src);
      return src && !/empty\//.test(src) ? {h: a ? a.getAttribute('href') : '', src, alt: (i.alt || '').trim()} : null; }).filter((b, k, arr) => b && arr.findIndex(x => x && x.src === b.src) === k);
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
    // бренды: у кого есть товары у нас — своя страница /brand?b=…, серии розеток — их страницы, остальные — сайт бренда
    const BR_PAGE = [[/stluce/i, 'st-luce'], [/LUMION/i, 'lumion'], [/reluce/i, 'reluce'], [/eglo\./i, 'eglo'], [/geniled/i, 'geniled'], [/maytoni/i, 'maytoni'],
      [/ODEON/i, 'odeon-light'], [/ambrella/i, 'ambrella-light'], [/tild3636-3835/, 'luminair']];
    const BR_SER = [[/kranz/i, '/kranz'], [/tild3661-3738/, '/totelectric']];
    brands.forEach(b => { const key = b.h + ' ' + b.src;
      const ser = BR_SER.find(r => r[0].test(key)); if (ser){ b.go = ser[1]; return; }
      const pg = BR_PAGE.find(r => r[0].test(key)); if (pg) b.slug = pg[1]; });
    const brandsBody = bidx => {
      const logos = brands.filter(b => !b.slug || !bidx || bidx[b.slug]);
      const has = new Set(logos.map(b => b.slug).filter(Boolean));
      const text = bidx ? Object.keys(bidx).filter(k => !has.has(k)) : [];
      const link = b => b.go ? `href="${esc(b.go)}"` : b.slug ? `href="/brand?b=${esc(b.slug)}"` : b.h ? `href="${esc(b.h)}" target="_blank" rel="noopener" class="ml-br-ext" title="Сайт бренда"` : '';
      return `<div class="ml-sh-brands">${logos.map(b => `<a ${link(b)}><img src="${esc(b.src)}" alt="${esc(b.alt || 'Бренд')}" loading="lazy"></a>`).join('')}${text.map(k => `<a href="/brand?b=${esc(k)}" class="ml-br-txt">${esc(bidx[k].t)}</a>`).join('')}</div>`;
    };
    const brandsItem = brands.length ? {name: 'Бренды', icon: 4, n: brands.length + ' брендов', body: brandsBody(null)} : null;
    if (brandsItem) items.push(brandsItem);
    const WA = 'https://wa.me/996998899675?text=' + encodeURIComponent('Здравствуйте! Помогите подобрать светильник');

    const box = D.createElement('div'); box.className = 'ml-cat';
    box.innerHTML = `<button type="button" class="ml-cat-open" aria-expanded="false">${ico(4)}<span>Каталог товаров</span><b aria-hidden="true">☰</b></button>
      <aside class="ml-cat-side" aria-label="Разделы каталога"><div class="ml-cat-panel">
        <div class="ml-cat-hd"><span data-mlt="cat.title">Каталог</span><button type="button" class="ml-cat-x" aria-label="Закрыть">✕</button></div>
        <ul class="ml-cat-list">${items.map((it, i) => `<li><button type="button" class="ml-cat-row" data-i="${i}" aria-expanded="false">${ico(it.icon)}<span>${esc(it.name)}<small>${it.n}</small></span><i aria-hidden="true">›</i></button>
          <div class="ml-cat-acc">${it.body}</div></li>`).join('')}</ul>
        <a class="ml-cat-help" href="${WA}" target="_blank" rel="noopener"><b data-mlt="cat.help1">Не нашли нужное?</b><span data-mlt="cat.help2">Подберём свет под ваш проект — напишите в WhatsApp</span></a>
      </div>
      <div class="ml-sh" role="region" aria-live="polite"><div class="ml-sh-in"></div></div></aside>
      <div class="ml-cat-main"><div class="ml-cat-top"><div class="ml-cat-ttl">Товары</div><div class="ml-chips-w"><button type="button" class="ml-chips-ar l" aria-label="Прокрутить фильтры влево"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg></button><div class="ml-chips" role="tablist" aria-label="Фильтр товаров"></div><button type="button" class="ml-chips-ar r" aria-label="Прокрутить фильтры вправо"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></button></div></div></div>
      <div class="ml-cat-dim"></div>`;
    const main = box.querySelector('.ml-cat-main'), sh = box.querySelector('.ml-sh'), shIn = sh.firstChild, side = box.querySelector('.ml-cat-side');
    if (brandsItem) fetch(BASE + 'brands/index.json').then(r => r.json()).then(bidx => {
      brandsItem.body = brandsBody(bidx); brandsItem.n = (brandsItem.body.match(/<a /g) || []).length + ' брендов';
      const k = items.indexOf(brandsItem), li = box.querySelectorAll('.ml-cat-list > li')[k];
      if (li){ li.querySelector('.ml-cat-acc').innerHTML = brandsItem.body; li.querySelector('small').textContent = brandsItem.n; }
    }).catch(() => {});
    cat.before(box); main.appendChild(cat);
    // чипсы = наши разделы (те же данные, что у страниц категорий), товары рисуем сами:
    // фильтрация Тильды на главной ломается (после клика она перерисовывает строку подразделов, назад не возвращается)
    const chips = box.querySelector('.ml-chips');
    cat.style.display = 'none';
    if (/tfc_storepartnav|tfc_div/.test(location.search) || /tstore/.test(location.hash)) history.replaceState(null, '', location.pathname);
    const hc = D.createElement('div'); hc.className = 'ml-hc'; main.appendChild(hc);
    const shop = mlShop(D.body), HPAGE = 12, cache = {};
    hc.innerHTML = '<div class="ml-hc-hd"></div><div class="mk-grid ml-hc-grid"></div><div class="mc-more-w ml-hc-more" hidden><button type="button" class="mc-more"></button></div>';
    const hd = hc.firstChild, grid = hc.querySelector('.ml-hc-grid'), moreW = hc.querySelector('.ml-hc-more');
    shop.bind(grid);
    let idx = null, curSlug = 'all', shown = HPAGE, req = 0;
    const pick = slug => { chips.querySelectorAll('button').forEach(x => { const on = x.dataset.s === slug; x.classList.toggle('on', on); x.setAttribute('aria-selected', on);
      if (on && chips.scrollWidth > chips.clientWidth) chips.scrollTo({left: chips.scrollLeft + x.getBoundingClientRect().left - chips.getBoundingClientRect().left - (chips.clientWidth - x.offsetWidth) / 2, behavior: RM ? 'auto' : 'smooth'}); }); };
    const anim = () => { if (!RM){ grid.classList.remove('mk-in'); void grid.offsetWidth; grid.classList.add('mk-in'); } };
    function overview(){
      curSlug = 'all'; pick('all'); moreW.hidden = true; grid.classList.add('ml-hc-tiles');
      const ks = Object.keys(idx), total = ks.reduce((s, k) => s + idx[k].n, 0);
      hd.innerHTML = `<b>Все разделы</b><span>${ks.length} ${mlPlural(ks.length, 'раздел', 'раздела', 'разделов')} · ${mlFmt(total)} ${mlPlural(total, 'товар', 'товара', 'товаров')}</span>`;
      grid.innerHTML = ks.map(k => { const c = idx[k]; return `<a class="mk-card ml-hc-tile" href="${esc(c.h || '/' + k)}" data-s="${k}">
  <div class="mk-img">${c.i ? `<img src="${esc(c.i)}" alt="" loading="lazy">` : ''}</div><h3>${esc(c.t)}</h3>
  <div class="mk-sku">${c.n} ${mlPlural(c.n, 'товар', 'товара', 'товаров')}</div></a>`; }).join('') + extraTiles();
      anim();
    }
    // доп. плитки «Бренды» и «Подберём свет» — добивают последний ряд (26 разделов + 2 = ровно 4 и 2 колонки)
    function extraTiles(){
      const br = items[items.length - 1] || {}, logos = [...String(br.body || '').matchAll(/<img[^>]+src="([^"]+)"/g)].slice(0, 4).map(m => `<i><img src="${m[1]}" alt="" loading="lazy"></i>`).join('');
      return (br.name !== 'Бренды' ? '' : `<button type="button" class="mk-card ml-hc-x ml-hc-br"><div class="mk-img"><div class="ml-hc-logos">${logos}</div></div><h3>Бренды<i aria-hidden="true">→</i></h3><div class="mk-sku">${esc(String(br.n || ''))}</div></button>`)
        + `<a class="mk-card ml-hc-x ml-hc-wa" href="https://wa.me/996998899675?text=${encodeURIComponent('Здравствуйте! Помогите подобрать свет')}" target="_blank" rel="noopener"><div class="mk-img"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z"/></svg></div><h3><span data-mlt="cat.help1">Не нашли нужное?</span><i aria-hidden="true">↗</i></h3><div class="mk-sku" data-mlt="cat.wa">Подберём свет в WhatsApp</div></a>`;
    }
    function draw(again){
      const d = cache[curSlug], list = d.items, part = list.slice(0, shown);
      grid.innerHTML = part.map(shop.card).join('');
      grid.querySelectorAll('.mk-card').forEach((el, i) => el.style.setProperty('--d', (again ? i % 8 : Math.max(0, i - shown + HPAGE) % 8) * 40 + 'ms'));
      moreW.hidden = list.length <= shown;
      moreW.firstChild.textContent = `Показать ещё ${Math.min(HPAGE, list.length - shown)} из ${list.length - shown}`;
      if (again) anim(); else grid.classList.remove('mk-in');
    }
    function hcShow(slug){
      if (slug === 'all' || !idx[slug]){ overview(); return; }
      curSlug = slug; shown = HPAGE; pick(slug); grid.classList.remove('ml-hc-tiles');
      const c = idx[slug];
      hd.innerHTML = `<b>${esc(c.t)}</b><span>${c.n} ${mlPlural(c.n, 'товар', 'товара', 'товаров')}</span><a href="${esc(c.h || '/' + slug)}">Весь раздел<i aria-hidden="true">→</i></a>`;
      if (cache[slug]){ draw(true); return; }
      const my = ++req; grid.innerHTML = '<div class="mk-load ml-hc-load">Загружаем…</div>'; moreW.hidden = true;
      (so ? mlStore.load(slug, so.rec).then(st => ({items: st.items})) : fetch(BASE + 'cats/' + slug + '.json').then(r => r.json())).then(d => { cache[slug] = d; if (my === req && curSlug === slug) draw(true); })
        .catch(() => { if (my === req) grid.innerHTML = '<div class="mk-load ml-hc-load">Не удалось загрузить товары. Попробуйте ещё раз.</div>'; });
    }
    moreW.firstChild.onclick = () => { const y = scrollY; shown += HPAGE; draw(false); scrollTo(0, y); };
    grid.addEventListener('click', e => { if (e.target.closest('.ml-hc-br')){ const bi = rows.length - 1;
        if (wide()){ show(bi); side.scrollIntoView({behavior: RM ? 'auto' : 'smooth', block: 'center'}); }
        else { drawer(true); if (!rows[bi].parentNode.classList.contains('open')) rows[bi].click(); } return; } });
    grid.addEventListener('click', e => { const t = e.target.closest('.ml-hc-tile'); if (t && !e.ctrlKey && !e.metaKey && !e.shiftKey){ e.preventDefault(); hcShow(t.dataset.s);
      const top = hc.getBoundingClientRect().top; if (top < 0) scrollBy({top: top - ((D.querySelector('.t3113__header') || {}).offsetHeight || 80) - 70, behavior: RM ? 'auto' : 'smooth'}); } });
    chips.addEventListener('click', e => { const b = e.target.closest('button'); if (b && !chips.classList.contains('drag')) hcShow(b.dataset.s); });
    grid.innerHTML = '<div class="mk-load ml-hc-load">Загружаем каталог…</div>';
    // живой режим: разделы верхнего уровня из «Каталога товаров» Тильды (порядок, названия, картинки — оттуда же)
    const so = mlStore.opts();
    const liveIdx = () => mlStore.load(so.part, so.rec, 1).then(st => {
      const tops = mlStore.kids(st.parts, so.part), j = {};
      return Promise.all(tops.map(t => mlStore.load(t.uid, so.rec, 1).then(r => { if (r.total) j[t.uid] = {t: t.t, n: r.total, i: t.img || (r.items[0] || {}).i || '', h: t.h}; }, () => {})))
        .then(() => { const o = {}; tops.forEach(t => { if (j[t.uid]) o[t.uid] = j[t.uid]; }); return o; });
    });
    (so ? liveIdx() : fetch(BASE + 'cats/index.json').then(r => r.json())).then(j => {
      idx = j;
      chips.innerHTML = [['all', 'Все разделы']].concat(Object.keys(j).map(k => [k, j[k].t])).map(([k, t]) => `<button type="button" role="tab" data-s="${k}">${esc(t)}</button>`).join('');
      overview(); arrows();
    }).catch(() => { cat.style.display = ''; hc.remove(); });
    // ПК: строку фильтров листают стрелками и перетаскиванием мышью
    const cw = box.querySelector('.ml-chips-w'), arL = cw.querySelector('.l'), arR = cw.querySelector('.r');
    const arrows = () => { const max = chips.scrollWidth - chips.clientWidth - 2;
      cw.classList.toggle('can-l', chips.scrollLeft > 2); cw.classList.toggle('can-r', chips.scrollLeft < max); };
    const step = d => chips.scrollBy({left: d * chips.clientWidth * .7, behavior: RM ? 'auto' : 'smooth'});
    arL.onclick = () => step(-1); arR.onclick = () => step(1);
    chips.addEventListener('scroll', arrows, {passive: true}); addEventListener('resize', arrows); arrows();
    let drag = null;
    chips.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.button === 0) drag = {x: e.clientX, s: chips.scrollLeft, moved: false}; });
    addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5){ drag.moved = true; chips.classList.add('drag'); } if (drag.moved) chips.scrollLeft = drag.s - dx; });
    addEventListener('pointerup', () => { if (drag && drag.moved) setTimeout(() => chips.classList.remove('drag'), 0); drag = null; });
    chips.addEventListener('click', e => { if (chips.classList.contains('drag')){ e.stopPropagation(); e.preventDefault(); } }, true);
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
  // валюта: в тестовом проекте Тильды стоит «$» — показываем «сом» справа, как на живом сайте
  // (если в настройках проекта поставить «Сом», это просто перестанет срабатывать)
  function mlCurrency(rootEl){
    (rootEl || D).querySelectorAll('[class*="price-currency"]').forEach(el => {
      if (el.textContent.trim() !== '$') return;
      el.textContent = 'сом'; el.classList.add('ml-cur');
      const val = el.parentNode && el.parentNode.querySelector('[class*="price-value"]');
      if (val && (el.compareDocumentPosition(val) & Node.DOCUMENT_POSITION_FOLLOWING)) val.after(el);
    });
  }
  mlCurrency();
  { let qd = 0; new MutationObserver(() => { if (!qd) qd = requestAnimationFrame(() => { qd = 0; mlCurrency(); }); })
      .observe(D.body, {childList: true, subtree: true}); }
  // каталог выше блока «Включите свет в комнате»
  { const rc = D.querySelector('.t-rec[data-record-type="2861"]'), rr = D.getElementById('ml-rooms'), rrRec = rr && rr.closest('.t-rec');
    if (rc && rrRec && (rrRec.compareDocumentPosition(rc) & Node.DOCUMENT_POSITION_FOLLOWING)) rrRec.before(rc); }
  // разделы теперь в панели каталога — верхнюю строку меню шапки прячем (только если каталог на странице)
  if (D.querySelector('.t-rec[data-record-type="2861"]')) root.classList.add('ml-cat-page');
  if (mlCatalog() === false){ let tries = 0; const iv = setInterval(() => { if (mlCatalog() !== false || ++tries > 40) clearInterval(iv); }, 400); }
  // ссылка «Каталог» со страницы товара: /#ml-catalog
  if (location.hash === '#ml-catalog'){ const rc = D.querySelector('.t-rec[data-record-type="2861"]');
    if (rc){ history.replaceState(null, '', location.pathname + location.search);
      const go = () => scrollTo({top: rc.getBoundingClientRect().top + scrollY - ((D.querySelector('.t3113__header') || {}).offsetHeight || 80)});
      setTimeout(go, 500); setTimeout(go, 1600); } }
  // ---------- карточка товара: всплывающее окно каталога Тильды в фирменном стиле
  // светильники, которые есть в живых комнатах: [проверка по названию, комната, проход]
  const ML_IN_ROOM = [
    [/CAPRAROLA/i, 'kitchen', 'pend', 'Кухня'],
    [/LH55114/i, 'bedroom', 'pend', 'Спальня'],
    [/VISERBELLA/i, 'bedroom', 'table', 'Спальня'],
    [/CONIVARINO/i, 'living', 'floor_up', 'Гостиная'],
    [/LH53263/i, 'living', 'chand', 'Гостиная'],
    [/LH53266/i, 'living', 'sconce', 'Гостиная'],
    [/PEGUERA/i, 'bath', 'mirror', 'Ванная'],
    [/TN6630/i, 'bath', 'down', 'Ванная'],
    [/NARICES/i, 'office', 'table', 'Кабинет'],
  ];
  const ML_BRANDS = /\b(EGLO|Ambrella|Maytoni|ST Luce|LUMINAIR|MODERNI|Geniled|Feron|Arte Lamp|Odeon|Favourite|Lightstar|Novotech|Citilux|Freya|Sonex|MLT)\b/i;
  const ppEsc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
  const PP_ICO = {
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z"/></svg>',
    room: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10l9-6 9 6v10H3z"/><path d="M12 9v3m-2.5 0h5l-1 3h-3z"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5"/></svg>'
  };
  function mlProduct(pp){
    const info = pp.querySelector('.t-catalog__prod-popup__info'); if (!info) return;
    const nameEl = pp.querySelector('.t-catalog__prod-popup__name'); const name = nameEl ? nameEl.textContent.trim() : '';
    if (!name || pp.dataset.mlFor === name) return;
    pp.dataset.mlFor = name;
    pp.querySelectorAll('.ml-pp').forEach(e => e.remove());
    pp.classList.add('ml-pp-on');
    const sku = ((pp.querySelector('.t-catalog__prod-popup__sku') || {}).textContent || '').replace(/Артикул:?/i, '').trim();
    const bm = name.match(ML_BRANDS);
    const brandTxt = ((pp.querySelector('.t-catalog__prod-popup__brand') || {}).textContent || '').trim() || (bm ? bm[1] : '');
    // надзаголовок: бренд · артикул
    const tw = pp.querySelector('.t-catalog__prod-popup__title-wrapper');
    if (tw && (brandTxt || sku)){
      const eb = D.createElement('div'); eb.className = 'ml-pp ml-pp-eye';
      eb.innerHTML = (brandTxt ? `<b>${ppEsc(brandTxt)}</b>` : '') + (sku ? `<span>Артикул ${ppEsc(sku)}</span>` : '');
      tw.prepend(eb);
    }
    // кнопки: WhatsApp и «в интерьере»
    const room = ML_IN_ROOM.find(r => r[0].test(name));
    const wa = 'https://wa.me/996998899675?text=' + encodeURIComponent(`Здравствуйте! Интересует ${name}${sku ? ' (арт. ' + sku + ')' : ''}\n${location.href}`);
    const acts = D.createElement('div'); acts.className = 'ml-pp ml-pp-acts';
    const roomInner = room ? `${PP_ICO.room}<span>Посмотреть в интерьере<small>${room[3]} · включим только его</small></span>` : '';
    acts.innerHTML = (room ? (D.getElementById('ml-rooms') ? `<button type="button" class="ml-pp-room">${roomInner}</button>`
        : `<a class="ml-pp-room" href="/#ml-room=${room[1]}.${room[2]}">${roomInner}</a>`) : '') +
      `<a class="ml-pp-wa" href="${wa}" target="_blank" rel="noopener">${PP_ICO.wa}<span>Спросить в WhatsApp</span></a>`;
    const bw = pp.querySelector('.t-catalog__prod-popup__btn-wrapper'); (bw || info).after(acts);
    const rb = acts.querySelector('.ml-pp-room');
    if (rb && rb.tagName === 'BUTTON') rb.onclick = () => {
      const pop = pp.closest('.t-popup'), x = pop && pop.querySelector('.t-popup__close');
      if (x) x.click();
      setTimeout(() => {
        const r = D.getElementById('ml-rooms'); if (!r) return;
        const y = r.getBoundingClientRect().top + scrollY - ((D.querySelector('.t3113__header') || {}).offsetHeight || 80);
        scrollTo({top: y, behavior: RM ? 'auto' : 'smooth'});
        if (window.lrShow) window.lrShow(room[1], room[2]);
      }, 350);
    };
    // характеристики: строки «Ключ: значение» из описания → аккуратная таблица
    const all = pp.querySelector('.js-catalog-prod-all-text');
    const rows = [], text = [];
    if (all){
      all.innerHTML.split(/<br\s*\/?>|<\/p>|<\/div>/i).map(h => { const t = D.createElement('div'); t.innerHTML = h; return t.textContent.replace(/\s+/g, ' ').trim(); })
        .filter(Boolean).forEach(l => {
          if (/^технические характеристики:?$|^характеристики:?$/i.test(l)) return;
          const m = l.match(/^([^:]{2,40}):\s*(.+)$/);
          if (m) rows.push([m[1].trim(), m[2].trim().replace(/^е(\d)/i, 'E$1').replace(/^E(\d+)\s*[*xх×]\s*(\d+)$/i, '$2×E$1')]); else text.push(l);
        });
    }
    pp.querySelectorAll('.js-catalog-prod-all-charcs p').forEach(p => { const m = p.textContent.trim().match(/^([^:]{2,40}):\s*(.+)$/); if (m) rows.push([m[1].trim(), m[2].trim()]); });
    if (rows.length || text.length){
      const sp = D.createElement('div'); sp.className = 'ml-pp ml-pp-specs';
      sp.innerHTML = (text.length ? `<p class="ml-pp-txt">${text.map(ppEsc).join('<br>')}</p>` : '') +
        (rows.length ? `<div class="ml-pp-h">Характеристики</div><dl>${rows.map(([k, v]) => `<div><dt>${ppEsc(k)}</dt><dd>${ppEsc(v)}</dd></div>`).join('')}</dl>` : '');
      acts.after(sp);
      pp.classList.add('ml-pp-hastxt');
    }
    const help = D.createElement('div'); help.className = 'ml-pp ml-pp-help';
    help.innerHTML = `<span>Подберём лампы, рассчитаем свет для вашей комнаты и подскажем по монтажу.</span><a href="${wa}" target="_blank" rel="noopener">Написать консультанту →</a>`;
    (pp.querySelector('.ml-pp-specs') || acts).after(help);
    // фото: мягкое «пятно света» за товаром + лупа по наведению
    const col = pp.querySelector('.t-catalog__prod-popup__col-left');
    if (col && !col.querySelector('.ml-pp-zoomhint')){
      const h = D.createElement('div'); h.className = 'ml-pp ml-pp-zoomhint'; h.innerHTML = PP_ICO.zoom + '<span>наведите, чтобы рассмотреть</span>'; col.appendChild(h);
    }
    pp.querySelectorAll('.t-catalog__prod-popup__col-left img').forEach(img => {
      if (img.dataset.mlZoom) return; img.dataset.mlZoom = 1;
      const box = img.parentElement;
      box.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = box.getBoundingClientRect();
        img.style.transformOrigin = `${((e.clientX - r.left) / r.width * 100).toFixed(1)}% ${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`; img.classList.add('ml-zoomed'); });
      box.addEventListener('pointerleave', () => img.classList.remove('ml-zoomed'));
    });
  }
  // своя шапка на странице товара: назад · логотип · каталог, WhatsApp, корзина
  function mlTpBar(){
    let bar = D.querySelector('.ml-tp-bar');
    if (!bar){
      bar = D.createElement('div'); bar.className = 'ml-tp-bar';
      const back = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
      const cat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>';
      const cart = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>';
      bar.innerHTML = `<a class="ml-tp-l" href="/">${back}<span class="ml-tp-txt">Назад</span></a>` +
        `<a class="ml-tp-logo" href="/" aria-label="Moonlight — на главную"><i class="ml-hlogo-w"></i><span class="ml-hlogo-s">профессиональное освещение</span></a>` +
        `<div class="ml-tp-r"><a href="/#ml-catalog">${cat}<span class="ml-tp-txt">Каталог</span></a>` +
        `<a href="https://wa.me/996998899675" target="_blank" rel="noopener" aria-label="WhatsApp">${PP_ICO.wa}</a>` +
        `<button type="button" class="ml-tp-cart" aria-label="Корзина">${cart}<b></b></button></div>`;
      // «Назад»: вернуться, если пришли с нашего сайта, иначе на главную
      bar.querySelector('.ml-tp-l').onclick = e => { if (D.referrer && new URL(D.referrer).host === location.host && history.length > 1){ e.preventDefault(); history.back(); } };
      bar.querySelector('.ml-tp-cart').onclick = () => { if (window.tcart__openCart) window.tcart__openCart(); };
      D.body.prepend(bar);
      // логотип подсвечивается курсором, как в шапке главной
      const lit = [...bar.querySelectorAll('.ml-tp-logo > *')];
      D.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return;
        lit.forEach(el => { const b = el.getBoundingClientRect(); if (!b.width) return; el.style.setProperty('--bx', (e.clientX - b.left) + 'px'); el.style.setProperty('--by', (e.clientY - b.top) + 'px'); }); }, {passive:true});
    }
    const n = window.tcart && window.tcart.total ? String(window.tcart.total) : '';
    const b = bar.querySelector('.ml-tp-cart b'); if (b.textContent !== n) b.textContent = n;
  }
  // отдельная страница товара /tproduct/…: та же карточка, корень — .t-container внутри сниппета
  { let q = 0; const scan = () => { q = 0; D.querySelectorAll('.t-catalog__product-popup').forEach(mlProduct);
      D.querySelectorAll('.t-catalog__product-snippet > .t-container').forEach(c => { D.documentElement.classList.add('ml-tproduct'); mlProduct(c); mlTpBar(); }); };
    new MutationObserver(() => { if (!q) q = requestAnimationFrame(scan); }).observe(D.body, {childList: true, subtree: true, characterData: true}); scan(); }
  // ---------- страница серии KRANZ ROUND на тест-сайте: <div id="ml-kranz"></div>; данные — rooms/kranz/data.json
  (function mlKranz(){
    // серии по адресу страницы: на всех страницах тест-сайта один и тот же блок <div id="ml-cat"></div>
    const SER_BY_PATH = {kranz_round: 'kranz', kranz: 'kranz', atlas_design_karbon: 'atlas', asfora_rozetki: 'asfora', artgallery: 'artgallery', totelectric: 'tot', wesa: 'wesa', 'rita-mutlusan_bk': 'rita'};
    const cat = D.getElementById('ml-cat'), pth = location.pathname.replace(/^\/|\/$/g, '');
    const host = D.getElementById('ml-kranz') || D.getElementById('ml-series') || (cat && !cat.dataset.cat && SER_BY_PATH[pth] ? cat : null);
    if (!host || host.dataset.on) return; host.dataset.on = 1; host.classList.add('mk-root');
    const SID = host.id === 'ml-kranz' ? 'kranz' : host.id === 'ml-cat' ? SER_BY_PATH[pth] : (host.dataset.s || '');
    if (SID === 'kranz') host.classList.add('mk-kr');
    const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
    const plural = (n, a, b, c) => { n = Math.abs(n) % 100; const d = n % 10; return n > 10 && n < 20 ? c : d === 1 ? a : d > 1 && d < 5 ? b : c; };
    const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');
    const WA = '996998899675';
    const ICO = {
      wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2z"/></svg>',
      x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
      ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
    };
    host.innerHTML = '<div class="mk-load">Загружаем серию…</div>';
    // шапка Тильды фиксированная: отступ сверху, чтобы крошки не уходили под неё
    const pad = () => { const h = D.querySelector('.t3113__header'); if (!h) return;
      const over = h.getBoundingClientRect().bottom - host.getBoundingClientRect().top;
      host.style.paddingTop = Math.max(28, Math.round(over + 24)) + 'px'; };
    if (scrollY < 5){ pad(); setTimeout(pad, 800); }
    addEventListener('resize', () => { if (scrollY < 5) pad(); });
    fetch(BASE + (SID === 'kranz' ? 'kranz/data.json' : 'series/' + SID + '.json')).then(r => r.json()).then(build).catch(() => { host.innerHTML = '<div class="mk-load">Не удалось загрузить товары. Обновите страницу.</div>'; });

    function build(data){
      const KR = SID === 'kranz';
      const NM = data.name || (KR ? 'Kranz Round' : data.title), BR = data.brand || 'KRANZ', PAR = data.parent || 'Розетки';
      const SKEY = KR ? 'ml-kranz-col' : 'ml-ser-' + SID;
      const st = {col: store.get(SKEY) || (KR ? 'bk' : data.colors[0].id), cat: 'all', sort: 'def'};
      if (!data.colors.some(c => c.id === st.col)) st.col = data.colors[0].id;
      const colOf = id => data.colors.find(c => c.id === id);
      const hrx = new RegExp(data.hero || '^Выключатель 2 кл 10А', 'i');
      const HERO = data.items.find(x => hrx.test(x.n) && Object.keys(x.c).length === data.colors.length) || data.items.find(x => Object.keys(x.c).length === data.colors.length) || data.items[0];
      const count = k => data.items.filter(x => k === 'all' || x.k === k).length;
      const sw = (c, cls) => `<button type="button" class="${cls}" data-col="${c.id}" role="radio" aria-label="${esc(c.n)}" style="--sw:${c.hex}"><i></i><span>${esc(c.n)}</span></button>`;
      host.innerHTML = `
<div class="mk-wrap">
  <nav class="mk-crumbs"><a href="/">Главная</a><span>/</span><a href="/#ml-catalog">${esc(PAR)}</a><span>/</span><b>${esc(NM)}</b></nav>
  <section class="mk-hero">
    <div class="mk-hero-t">
      <div class="mk-eye">${esc(KR ? 'серия · розетки и выключатели' : data.eye || 'серия · розетки и выключатели')}</div>
      <h1>${esc(data.title)}</h1>
      <p>${KR ? `${data.items.length} модели одной серии: выключатели, розетки, рамки до 5 постов, диммер и терморегулятор с Wi‑Fi.` : `${data.items.length} ${plural(data.items.length, 'модель', 'модели', 'моделей')} одной серии: выключатели, розетки, рамки и аксессуары в ${data.colors.length} ${plural(data.colors.length, 'цвете', 'цветах', 'цветах')}.`} Выберите цвет — каталог ниже перекрасится целиком.</p>
      <div class="mk-cols" role="radiogroup" aria-label="Цвет серии">${data.colors.map(c => sw(c, 'mk-col')).join('')}</div>
      <div class="mk-stats"><div><b>${data.items.length}</b><span>${plural(data.items.length, 'модель', 'модели', 'моделей')}</span></div><div><b>${data.colors.length}</b><span>${plural(data.colors.length, 'цвет', 'цвета', 'цветов')}</span></div></div>
    </div>
    <div class="mk-hero-v"><div class="mk-glow"></div><img class="mk-hero-img" alt=""><img class="mk-hero-img mk-b" alt=""><div class="mk-hero-cap"></div></div>
  </section>
  <div class="mk-bar">
    <div class="mk-cats" role="tablist">${[{id:'all', n:'Все'}].concat(data.cats).filter(c => count(c.id)).map(c => `<button type="button" role="tab" data-cat="${c.id}">${esc(c.n)}<small>${count(c.id)}</small></button>`).join('')}</div>
    <label class="mk-sort"><span>Сортировка</span><select><option value="def">по типу</option><option value="asc">сначала дешевле</option><option value="desc">сначала дороже</option></select></label>
  </div>
  <div class="mk-grid"></div>
  <div class="mk-help"><div><b>Не знаете, сколько нужно рамок и механизмов?</b><span>Пришлите план квартиры или фото стен — посчитаем комплект ${esc(NM)} и пришлём смету.</span></div>
    <a href="https://wa.me/${WA}?text=${encodeURIComponent('Здравствуйте! Хочу посчитать комплект ' + NM)}" target="_blank" rel="noopener">${ICO.wa}<span>Посчитать в WhatsApp</span></a></div>
</div>
<div class="mk-pop" hidden><div class="mk-pop-bg"></div><div class="mk-pop-card" role="dialog" aria-modal="true"></div></div>`;
      mlFitH1(host.querySelector('.mk-hero h1'));
      const $ = s => host.querySelector(s), $$ = s => host.querySelectorAll(s);
      const grid = $('.mk-grid');

      // карточки
      grid.innerHTML = data.items.map(x => `<article class="mk-card" data-b="${x.b}" data-k="${x.k}" tabindex="0">
  <div class="mk-img"><img alt="${esc(x.n)}" loading="lazy"></div>
  <div class="mk-dots">${data.colors.filter(c => x.c[c.id]).map(c => `<i data-col="${c.id}" style="--sw:${c.hex}" title="${esc(c.n)}"></i>`).join('')}</div>
  <h3>${esc(x.n)}</h3><div class="mk-sku"></div>
  <div class="mk-buy"><div class="mk-price"></div><button type="button" class="mk-add">В корзину</button></div>
</article>`).join('');

      function paint(){
        const c = colOf(st.col);
        host.style.setProperty('--mk-sw', c.hex);
        $$('.mk-col').forEach(b => b.setAttribute('aria-checked', b.dataset.col === st.col));
        grid.querySelectorAll('.mk-card').forEach(el => {
          const x = data.items.find(i => i.b === el.dataset.b), na = !x.c[st.col], v = x.c[st.col] || Object.values(x.c)[0];
          el.classList.toggle('mk-na', na);
          const img = el.querySelector('img');
          if (img.dataset.src !== v.i){ img.dataset.src = v.i; img.classList.add('mk-fade'); const n = new Image(); n.onload = n.onerror = () => { img.src = v.i; img.classList.remove('mk-fade'); }; n.src = v.i; }
          el.querySelector('.mk-sku').textContent = v.s ? 'Арт. ' + v.s : ' ';
          el.querySelector('.mk-price').innerHTML = na ? `<span class="mk-na-t">нет в цвете «${esc(c.n.toLowerCase())}»</span>` : `${fmt(v.p)} <small>сом</small>`;
          el.querySelectorAll('.mk-dots i').forEach(d => d.classList.toggle('on', d.dataset.col === st.col));
        });
        // герой: плавная смена кадра
        const hv = HERO.c[st.col], a = $('.mk-hero-img:not(.mk-b)'), b = $('.mk-hero-img.mk-b');
        const front = a.classList.contains('on') ? a : b, back = front === a ? b : a;
        if (front.dataset.src !== hv.i){ back.dataset.src = hv.i; back.onload = () => { back.classList.add('on'); front.classList.remove('on'); }; back.src = hv.i; }
        $('.mk-hero-cap').textContent = `${HERO.n} · ${c.n}`;
      }
      function filter(){
        $$('.mk-cats button').forEach(b => b.setAttribute('aria-selected', b.dataset.cat === st.cat));
        const cards = [...grid.children];
        const price = el => { const x = data.items.find(i => i.b === el.dataset.b); return (x.c[st.col] || Object.values(x.c)[0]).p; };
        const order = st.sort === 'def' ? cards.sort((p, q) => data.items.findIndex(i => i.b === p.dataset.b) - data.items.findIndex(i => i.b === q.dataset.b))
          : cards.sort((p, q) => (price(p) - price(q)) * (st.sort === 'asc' ? 1 : -1));
        order.forEach((el, i) => { el.hidden = !(st.cat === 'all' || el.dataset.k === st.cat); grid.appendChild(el); el.style.setProperty('--d', (i % 8) * 40 + 'ms'); });
        if (!RM){ grid.classList.remove('mk-in'); void grid.offsetWidth; grid.classList.add('mk-in'); }
      }
      $$('.mk-col').forEach(b => b.onclick = () => { st.col = b.dataset.col; store.set(SKEY, st.col); paint(); if (st.sort !== 'def') filter(); });
      $$('.mk-cats button').forEach(b => b.onclick = () => { st.cat = b.dataset.cat; filter(); });
      $('.mk-sort select').onchange = e => { st.sort = e.target.value; filter(); };

      // в корзину Тильды (если корзины на странице нет — WhatsApp)
      function add(x, col, btn){
        const v = x.c[col], name = `${NM} ${x.n}, ${colOf(col).n.toLowerCase()}`;
        if (window.tcart__addProduct){
          window.tcart__addProduct({name, price: v.p, img: v.i, sku: v.s, quantity: 1, uid: v.id});
          if (btn){ btn.classList.add('mk-done'); btn.innerHTML = ICO.ok + '<span>В корзине</span>'; setTimeout(() => { btn.classList.remove('mk-done'); btn.textContent = 'В корзину'; }, 1800); }
        } else window.open(`https://wa.me/${WA}?text=${encodeURIComponent('Здравствуйте! Хочу заказать ' + name + ' (арт. ' + v.s + ')')}`, '_blank', 'noopener');
      }
      grid.addEventListener('click', e => {
        const card = e.target.closest('.mk-card'); if (!card) return;
        const x = data.items.find(i => i.b === card.dataset.b);
        const dot = e.target.closest('.mk-dots i');
        if (e.target.closest('.mk-add')){ add(x, x.c[st.col] ? st.col : Object.keys(x.c)[0], e.target.closest('.mk-add')); return; }
        open(x, dot ? dot.dataset.col : (x.c[st.col] ? st.col : Object.keys(x.c)[0]));
      });
      grid.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('mk-card')) e.target.click(); });

      // окно товара
      const pop = $('.mk-pop'), card = $('.mk-pop-card');
      function open(x, col){
        const draw = () => {
          const v = x.c[col], c = colOf(col);
          card.innerHTML = `<button type="button" class="mk-x" aria-label="Закрыть">${ICO.x}</button>
<div class="mk-pop-img"><img src="${v.i}" alt="${esc(x.n)}"></div>
<div class="mk-pop-info">
  <div class="mk-eye"><b>${esc(BR)}</b><span class="mk-p-sku">${v.s ? 'Арт. ' + esc(v.s) : ''}</span></div>
  <h2>${esc(NM)} · ${esc(x.n)}</h2>
  <div class="mk-pop-col"><span>Цвет: <b class="mk-p-cn">${esc(c.n)}</b></span><div>${data.colors.filter(k => x.c[k.id]).map(k => sw(k, 'mk-col mk-col-s')).join('')}</div></div>
  <div class="mk-pop-price">${fmt(v.p)} <small>сом</small></div>
  <button type="button" class="mk-add mk-add-l">В корзину</button>
  <a class="mk-wa" href="https://wa.me/${WA}?text=${encodeURIComponent(`Здравствуйте! Интересует ${NM} ${x.n}, ${c.n.toLowerCase()}${v.s ? ` (арт. ${v.s})` : ''}`)}" target="_blank" rel="noopener">${ICO.wa}<span>Спросить в WhatsApp</span></a>
  <dl class="mk-specs">${KR ? `<div><dt>Серия</dt><dd>ROUND</dd></div><div><dt>Цвет</dt><dd class="mk-p-cn">${esc(c.n)}</dd></div><div><dt>Материал</dt><dd>Поликарбонат</dd></div><div><dt>Монтаж</dt><dd>${/с\/у/.test(x.n) ? 'Скрытый (с/у)' : '—'}</dd></div>` : `<div><dt>Бренд</dt><dd>${esc(BR)}</dd></div><div><dt>Серия</dt><dd>${esc(data.title)}</dd></div><div><dt>Цвет</dt><dd class="mk-p-cn">${esc(c.n)}</dd></div><div><dt>Есть в цветах</dt><dd>${Object.keys(x.c).length} из ${data.colors.length}</dd></div>`}</dl>
</div>`;
          card.querySelectorAll('.mk-col').forEach(b => { b.setAttribute('aria-checked', b.dataset.col === col); b.onclick = () => { col = b.dataset.col; update(); }; });
          card.querySelector('.mk-x').onclick = close;
          card.querySelector('.mk-add').onclick = e => add(x, col, e.currentTarget);
        };
        // смена цвета — правим на месте, не пересоздаём кнопки (иначе курсор теряет кнопку под собой)
        const update = () => {
          const v = x.c[col], c = colOf(col), img = card.querySelector('.mk-pop-img img');
          img.style.opacity = 0; const n = new Image(); n.onload = n.onerror = () => { img.src = v.i; img.style.opacity = ''; }; n.src = v.i;
          card.querySelector('.mk-p-sku').textContent = v.s ? 'Арт. ' + v.s : '';
          card.querySelectorAll('.mk-p-cn').forEach(e => e.textContent = c.n);
          card.querySelector('.mk-pop-price').innerHTML = `${fmt(v.p)} <small>сом</small>`;
          card.querySelector('.mk-wa').href = `https://wa.me/${WA}?text=` + encodeURIComponent(`Здравствуйте! Интересует ${NM} ${x.n}, ${c.n.toLowerCase()}${v.s ? ` (арт. ${v.s})` : ''}`);
          card.querySelectorAll('.mk-col').forEach(b => b.setAttribute('aria-checked', b.dataset.col === col));
        };
        draw(); pop.hidden = false; D.documentElement.classList.add('mk-lock');
        requestAnimationFrame(() => pop.classList.add('on'));
      }
      function close(){ pop.classList.remove('on'); D.documentElement.classList.remove('mk-lock'); setTimeout(() => { pop.hidden = true; }, RM ? 0 : 260); }
      $('.mk-pop-bg').onclick = close;
      D.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) close(); });

      paint(); filter();
    }
  })();
  // ---------- страница категории на тест-сайте: <div id="ml-cat" data-cat="lustra"></div>; данные — rooms/cats/<slug>.json
  (function mlCat(){
    const host = D.getElementById('ml-cat'); if (!host || host.dataset.on) return; host.dataset.on = 1;
    host.classList.add('mk-root', 'mc-root');
    const slug = host.dataset.cat || location.pathname.replace(/^\/|\/$/g, '');
    // страница бренда: /brand?b=eglo → rooms/brands/eglo.json (чипсы = наши разделы)
    const brand = slug === 'brand' ? (new URLSearchParams(location.search).get('b') || '').replace(/[^a-z0-9-]/g, '') : null;
    const esc = mlEsc, fmt = mlFmt, plural = mlPlural, ICO = ML_ICO, WA = ML_WA, PAGE = 24;
    host.innerHTML = '<div class="mk-load">Загружаем каталог…</div>';
    const pad = () => { const h = D.querySelector('.t3113__header'); if (!h) return;
      const over = h.getBoundingClientRect().bottom - host.getBoundingClientRect().top;
      host.style.paddingTop = Math.max(28, Math.round(over + 24)) + 'px'; };
    if (scrollY < 5){ pad(); setTimeout(pad, 800); }
    addEventListener('resize', () => { if (scrollY < 5) pad(); });
    if (brand === '') { location.replace('/#ml-catalog'); return; }
    // живой режим: на странице есть родной блок каталога Тильды → раздел и товары берём из каталога, блок прячем
    const so = !brand && mlStore.opts();
    if (so){
      const rec = D.getElementById('rec' + so.rec); if (rec) rec.style.display = 'none';
      mlStore.load(so.part, so.rec).then(st => {
        const info = st.info, cr = st.crumbs, par = cr.length > 1 ? cr[cr.length - 2] : null;
        const kid = mlStore.kidOf(st.parts, so.part);
        st.items.forEach(x => { x.k = kid(x); });
        const types = mlStore.kids(st.parts, so.part).map(k => ({id: k.uid, n: k.t, h: k.h})).filter(t => st.items.some(x => x.k === t.id));
        const title = info.title || (info.root || !par ? 'Каталог' : '');
        if (!info.title) D.title = 'Каталог — Moonlight';
        build({live: true, title, parent: par ? (par.title || 'Каталог') : '', parentHref: par ? par.alias : '', about: info.description || '', types, items: st.items});
      }).catch(() => { if (rec) rec.style.display = ''; host.innerHTML = ''; });
    } else
    fetch(BASE + (brand ? 'brands/' + brand : 'cats/' + slug) + '.json').then(r => r.json()).then(build).catch(() => { if (brand){ location.replace('/#ml-catalog'); return; } host.innerHTML = '<div class="mk-load">Не удалось загрузить товары. Обновите страницу.</div>'; });

    function build(data){
      if (brand) D.title = data.title + ' — Moonlight';
      const items = data.items, byId = {}; items.forEach((x, i) => { byId[x.id] = x; x._i = i; });
      const st = {type: 'all', brand: 'all', q: '', sort: 'def', shown: PAGE};
      const brands = {}; items.forEach(x => { if (x.b) brands[x.b] = (brands[x.b] || 0) + 1; });
      const blist = Object.keys(brands).sort((a, b) => brands[b] - brands[a]);
      const prices = items.map(x => x.p).filter(Boolean);
      // витрина героя: товары с фото и ценой, по одному от каждого бренда, потом остальные
      const show = []; blist.concat(['']).forEach(b => { const x = items.find(i => i.i && i.p && (i.b || '') === b); if (x) show.push(x); });
      items.forEach(x => { if (show.length < 5 && x.i && x.p && !show.includes(x)) show.push(x); });
      const matches = (x, skip) => (skip === 'type' || st.type === 'all' || x.k === st.type) && (skip === 'brand' || st.brand === 'all' || x.b === st.brand) &&
        (!st.q || (x.n + ' ' + x.s + ' ' + x.b).toLowerCase().includes(st.q));

      host.innerHTML = `
<div class="mk-wrap">
  <nav class="mk-crumbs"><a href="/">Главная</a><span>/</span>${data.live && !data.parent ? '' : `<a href="${esc(data.parentHref || '/#ml-catalog')}">${esc(data.parent || 'Каталог')}</a><span>/</span>`}<b>${esc(data.title)}</b></nav>
  <section class="mk-hero">
    <div class="mk-hero-t">
      <div class="mk-eye">${esc(data.parent || 'каталог')}</div>${data.live && !data.items.length ? '<p>В этом разделе пока нет товаров.</p>' : ''}
      <h1 class="${(w => w >= 11 ? 'mc-h-l' : w >= 9 ? 'mc-h-m' : '')(Math.max(...data.title.split(/\s+/).map(w => w.length)))}">${esc(data.title)}</h1>
      ${data.about ? `<p>${esc(data.about)}</p>` : ''}${data.site ? `<a class="mc-site" href="${esc(data.site)}" target="_blank" rel="noopener">Сайт бренда<i aria-hidden="true">↗</i></a>` : ''}
      ${blist.length > 1 ? `<div class="mk-cols mc-brands" role="radiogroup" aria-label="Бренд">${['all'].concat(blist).map(b => `<button type="button" class="mk-col mc-br" role="radio" data-br="${esc(b)}">${b === 'all' ? 'Все бренды' : esc(b)}<small>${b === 'all' ? items.length : brands[b]}</small></button>`).join('')}</div>` : ''}
      <div class="mk-stats"><div><b>${items.length}</b><span>${plural(items.length, 'товар', 'товара', 'товаров')}</span></div>${brand ? `<div><b>${data.types.length}</b><span>${plural(data.types.length, 'раздел', 'раздела', 'разделов')}</span></div>` : ''}${blist.length > 1 ? `<div><b>${blist.length}</b><span>${plural(blist.length, 'бренд', 'бренда', 'брендов')}</span></div>` : ''}</div>
    </div>
    <div class="mk-hero-v mc-hero-v" role="button" tabindex="0" aria-label="Открыть товар"><div class="mk-glow"></div><img class="mk-hero-img" alt=""><img class="mk-hero-img mk-b" alt=""><div class="mk-hero-cap"></div><div class="mc-hero-dots">${show.map((_, i) => `<i data-i="${i}"></i>`).join('')}</div></div>
  </section>
  <div class="mk-bar">
    <div class="mk-cats" role="tablist"></div>
    <div class="mc-tools">
      <label class="mc-search">${ICO.search}<input type="search" placeholder="Поиск: название, артикул" aria-label="Поиск по категории"></label>
      <label class="mk-sort"><span>Сортировка</span><select><option value="def">по умолчанию</option><option value="asc">сначала дешевле</option><option value="desc">сначала дороже</option></select></label>
    </div>
  </div>
  <div class="mk-grid"></div>
  <div class="mc-empty" hidden>Ничего не нашлось. <button type="button">Сбросить фильтры</button></div>
  <div class="mc-more-w"><button type="button" class="mc-more">Показать ещё</button></div>
  <div class="mk-help"><div><b>Не нашли нужное или сомневаетесь?</b><span>Пришлите фото комнаты или план — подберём свет и пришлём варианты с ценами.</span></div>
    <a href="https://wa.me/${WA}?text=${encodeURIComponent('Здравствуйте! Нужна помощь с выбором: ' + data.title)}" target="_blank" rel="noopener">${ICO.wa}<span>Подобрать в WhatsApp</span></a></div>
</div>`;
      mlFitH1(host.querySelector('.mk-hero h1'));
      const shop = mlShop(host), priceHtml = shop.priceHtml, open = shop.open;
      const $ = s => host.querySelector(s), $$ = s => host.querySelectorAll(s);
      const grid = $('.mk-grid'), cats = $('.mk-cats');
      const card = shop.card;

      // чипсы типов: счётчики с учётом бренда и поиска; при пустом — скрываем
      function chips(){
        if (!data.types.length){ cats.hidden = true; return; }
        const n = id => items.filter(x => (id === 'all' || x.k === id) && matches(x, 'type')).length;
        // перерисовываем только счётчики, кнопки не пересоздаём (курсор держит кнопку)
        if (!cats.children.length) cats.innerHTML = [{id: 'all', n: 'Все'}].concat(data.types).map(c => `<button type="button" role="tab" data-t="${c.id}">${esc(c.n)}<small></small></button>`).join('');
        cats.querySelectorAll('button').forEach(b => { const k = n(b.dataset.t); b.querySelector('small').textContent = k; b.hidden = !k && b.dataset.t !== 'all';
          b.setAttribute('aria-selected', b.dataset.t === st.type); });
      }
      function render(again){
        const list = items.filter(x => matches(x));
        if (st.sort !== 'def') list.sort((a, b) => ((a.p || 1e9) - (b.p || 1e9)) * (st.sort === 'asc' ? 1 : -1) || a._i - b._i);
        const part = list.slice(0, st.shown);
        grid.innerHTML = part.map(card).join('');
        grid.querySelectorAll('.mk-card').forEach((el, i) => el.style.setProperty('--d', (again ? i % 8 : Math.max(0, i - st.shown + PAGE) % 8) * 40 + 'ms'));
        $('.mc-empty').hidden = !!list.length;
        const more = $('.mc-more'); more.parentNode.hidden = list.length <= st.shown;
        more.textContent = `Показать ещё ${Math.min(PAGE, list.length - st.shown)} из ${list.length - st.shown}`;
        $$('.mc-br').forEach(b => b.setAttribute('aria-checked', b.dataset.br === st.brand));
        chips();
        if (!RM && again){ grid.classList.remove('mk-in'); void grid.offsetWidth; grid.classList.add('mk-in'); }
      }
      const reset = () => { st.shown = PAGE; render(true); };
      cats.addEventListener('click', e => { const b = e.target.closest('button'); if (b){ st.type = b.dataset.t; reset(); } });
      $$('.mc-br').forEach(b => b.onclick = () => { st.brand = b.dataset.br; reset(); });
      let qt; $('.mc-search input').oninput = e => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value.trim().toLowerCase(); reset(); }, 180); };
      $('.mk-sort select').onchange = e => { st.sort = e.target.value; reset(); };
      $('.mc-more').onclick = () => { const y = scrollY; st.shown += PAGE; grid.classList.remove('mk-in'); render(false); scrollTo(0, y); };
      $('.mc-empty button').onclick = () => { st.type = 'all'; st.brand = 'all'; st.q = ''; $('.mc-search input').value = ''; reset(); };

      // герой: витрина товаров по кругу
      let hi = 0, ht;
      function hero(i){
        if (!show.length) return; hi = (i + show.length) % show.length; const x = show[hi];
        const a = $('.mk-hero-img:not(.mk-b)'), b = $('.mk-hero-img.mk-b');
        const front = a.classList.contains('on') ? a : b, back = front === a ? b : a;
        back.onload = () => { back.classList.add('on'); front.classList.remove('on'); }; back.src = x.i;
        $('.mk-hero-cap').textContent = `${x.b ? x.b + ' · ' : ''}${x.p ? fmt(x.p) + ' сом' : ''}`;
        $$('.mc-hero-dots i').forEach((d, k) => d.classList.toggle('on', k === hi));
        clearTimeout(ht); if (!RM && show.length > 1) ht = setTimeout(() => { if (!D.hidden && !shop.isOpen()) hero(hi + 1); else ht = setTimeout(() => hero(hi), 2000); }, 4200);
      }
      const hv = $('.mc-hero-v');
      hv.addEventListener('click', e => { const d = e.target.closest('.mc-hero-dots i'); if (d){ hero(+d.dataset.i); return; } open(show[hi]); });
      hv.addEventListener('keydown', e => { if (e.key === 'Enter') open(show[hi]); });

      shop.bind(grid);

      render(true); hero(0);
    }
  })();
  // ---------- ночь для ЛЮБЫХ блоков Тильды, которые добавит мастер (текст, обложки без фото, карточки, формы, Zero Block…)
  // Один раз запоминаем «дневные» цвета каждого элемента и выдаём ночной вариант классами (стили в night_any.css):
  // светлый фон → фон сайта / чуть светлее (цветной — тёмный того же оттенка), тёмный текст → светлый, тёмные рамки и значки → светлые.
  // Свои блоки (фирменные, каталог, шапка, корзина, поиск) не трогаем — у них ручная ночная тема.
  // Оставить блок как днём: якорь блока (Настройки блока → «Якорь для ссылки») начинается с keep, например keep-promo.
  (function mlNightAny(){
    const SKIP_REC = '[data-bg-color="#f4f4fb"],[data-bg-color="#201f1f"]';
    const SKIP_IN = '[id^="ml-"],.ml-keep,.ml-cat,.t-store,.t-catalog,.t3113,.t706,.t985,.t-cover,.t-menu-base,.t-menusub';
    const done = new WeakSet();
    const rgb = c => { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
      const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(parseFloat); return {r: p[0], g: p[1], b: p[2], a: p[3] == null ? 1 : p[3]}; };
    const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
    const hsl = c => { const r = c.r / 255, g = c.g / 255, b = c.b / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
      if (mx === mn) return [0, 0, l]; const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [h * 60, s, l]; };
    const css = (h, s, l) => `hsl(${h.toFixed(0)} ${(s * 100).toFixed(0)}% ${(l * 100).toFixed(0)}%)`;
    const same = (a, b) => a && b && Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) < 12;
    const hasImg = (el, cs) => (cs.backgroundImage && cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) || el.classList.contains('t-bgimg') || el.hasAttribute('data-original') || el.hasAttribute('data-content-cover-bg');
    const keep = rec => [...rec.querySelectorAll('a[name],[data-anchor]')].some(a => /^keep/i.test(a.getAttribute('name') || a.getAttribute('data-anchor') || ''))
      || /^keep/i.test(rec.getAttribute('data-anchor') || '');
    function recBg(rec){
      for (const el of [rec, rec.firstElementChild, rec.querySelector('.t396__artboard,.t-section,.t-container')]){
        if (!el) continue; const cs = getComputedStyle(el); if (hasImg(el, cs)) return {img: true}; const c = rgb(cs.backgroundColor); if (c && c.a > .5) return c; }
      const b = rgb(getComputedStyle(D.body).backgroundColor); return b && b.a > .5 && !root.dataset.tod ? b : {r: 255, g: 255, b: 255, a: 1};
    }
    function pass(rec, base){
      rec.querySelectorAll('*').forEach(el => {
        if (done.has(el)) return; done.add(el);
        if (el.closest(SKIP_IN)) return;
        const cs = getComputedStyle(el);
        // фон
        const bg = rgb(cs.backgroundColor);
        if (bg && bg.a > .3 && !hasImg(el, cs) && lum(bg) > .45){
          const [h, s] = hsl(bg);
          if (same(bg, base)) el.classList.add('ml-na-bg0');
          else if (s < .12) el.classList.add('ml-na-bg');
          else { el.style.setProperty('--na-bg', css(h, Math.min(s, .35), .2)); el.classList.add('ml-na-bg'); }
        }
        // текст: элементы с собственным текстом и поля форм
        const own = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || [...el.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim());
        const fg = rgb(cs.color);
        if (own && fg && fg.a > .2){ const L = lum(fg);
          if (L < .45){ const [h, s] = hsl(fg);
            if (s < .15) el.classList.add(L < .1 ? 'ml-na-tx' : 'ml-na-mu');
            else { el.style.setProperty('--na-c', css(h, s, Math.max(.68, 1 - hsl(fg)[2]))); el.classList.add('ml-na-tx'); } } }
        // рамки и линии
        const bw = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
        if (bw > 0){ const bc = rgb(cs.borderTopColor) || rgb(cs.borderLeftColor); if (bc && bc.a > .1 && lum(bc) < .5) el.classList.add('ml-na-bd'); }
        // значки svg тёмного цвета
        if (el.tagName === 'svg'){ const p = el.querySelector('[fill]:not([fill="none"]),[stroke]:not([stroke="none"])') || el;
          const pc = getComputedStyle(p); const c = rgb(pc.fill !== 'none' ? pc.fill : pc.stroke); if (c && lum(c) < .3) el.classList.add('ml-na-ic'); }
      });
    }
    function scan(){
      D.querySelectorAll('.t-rec').forEach(rec => {
        if (!rec.classList.contains('ml-na')){
          if (rec.dataset.naSeen) return; rec.dataset.naSeen = 1;
          if (rec.matches(SKIP_REC) || rec.querySelector(SKIP_IN) || keep(rec)) return;
          const base = recBg(rec); if (base.img || lum(base) < .45) return;
          rec.classList.add('ml-na'); rec._naBase = base;
        }
        pass(rec, rec._naBase);
      });
    }
    const run = () => { try { scan(); } catch (e) {} };
    run(); setTimeout(run, 1500); setTimeout(run, 4000);
    addEventListener('load', () => setTimeout(run, 300));
    window.mlNightScan = run;
  })();
  // ---------- свой поиск по каталогу (24.11) вместо поиска Тильды (тот ничего не находил).
  // Товары — живьём из «Каталога товаров» Тильды (раздел «Все»), мастеру ничего поддерживать не надо.
  // При переносе на другой проект: в HEAD до бандла <script>window.mlSearch={part:'…',rec:'…'}</script> (раздел «Все» и блок каталога)
  (() => {
    if (window.__mlSearch) return; window.__mlSearch = 1;
    if (typeof mlStore === 'undefined' || typeof mlShop === 'undefined') return;
    const CFG = Object.assign({part: '907933120514', rec: '6109761903'}, window.mlSearch || {});
    const KEY = 'ml-srch-v1', TTL = 30 * 60e3, PAGE = 24;
    const esc = mlEsc, ls = {get: k => { try { return localStorage.getItem(k); } catch (e){ return null; } }, set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e){} }};
    // ---- нормализация: регистр, ё, раскладка, транслит
    const norm = s => String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/g, ' ').trim();
    const EN = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`", RU = 'йцукенгшщзхъфывапролджэячсмитьбюё';
    const layout = s => [...String(s).toLowerCase()].map(c => { const i = EN.indexOf(c); return i < 0 ? c : RU[i]; }).join('');
    const TR = {а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e', ю: 'yu', я: 'ya', ь: '', ъ: ''};
    const translit = s => [...s].map(c => TR[c] !== undefined ? TR[c] : c).join('');
    // ---- данные
    let data = null, loading = null;
    function load(){
      if (data) return Promise.resolve(data);
      if (loading) return loading;
      try { const c = JSON.parse(ls.get(KEY) || 'null'); if (c && Date.now() - c.t < TTL && c.items && c.items.length){ data = index(c); return Promise.resolve(data); } } catch (e){}
      loading = mlStore.load(CFG.part, CFG.rec).then(r => {
        const parts = r.parts.filter(p => !p.root).map(p => ({uid: p.uid, t: p.t, h: p.h, par: p.par}));
        const c = {t: Date.now(), parts, items: r.items};
        ls.set(KEY, JSON.stringify(c)); if (!ls.get(KEY)) ls.set(KEY, JSON.stringify(Object.assign({}, c, {items: r.items.map(x => Object.assign({}, x, {d: undefined, g: undefined}))})));
        data = index(c); loading = null; return data;
      }, e => { loading = null; throw e; });
      return loading;
    }
    function index(c){
      const pt = {}; c.parts.forEach(p => pt[p.uid] = p);
      const brands = {};
      c.items.forEach(x => {
        const ps = (x.pu || []).map(u => pt[u]).filter(Boolean);
        x._n = norm(x.n); x._b = norm(x.b); x._s = norm(x.s).replace(/ /g, ''); x._p = norm(ps.map(p => p.t).join(' '));
        x._w = (x._n + ' ' + x._b + ' ' + x._p).split(' ');
        if (x.b) (brands[x.b] = brands[x.b] || {n: x.b, _n: x._b, c: 0}).c++;
      });
      const counts = {}; c.items.forEach(x => (x.pu || []).forEach(u => counts[u] = (counts[u] || 0) + 1));
      const parts = c.parts.filter(p => counts[p.uid] && !/^бренд/i.test(p.t)).map(p => Object.assign({}, p, {_n: norm(p.t), c: counts[p.uid]}));
      return {items: c.items, parts, brands: Object.values(brands)};
    }
    // ---- поиск: каждое слово запроса должно найтись (начало слова названия/бренда/раздела или часть артикула)
    // одна опечатка (замена, лишняя или пропущенная буква) — для слов от 4 букв
    const near = (w, t) => { if (Math.abs(w.length - t.length) > 1) return false; let i = 0, j = 0, e = 0;
      while (i < w.length && j < t.length){ if (w[i] === t[j]){ i++; j++; continue; } if (++e > 1) return false;
        if (w.length > t.length) i++; else if (w.length < t.length) j++; else { i++; j++; } } return e + (w.length - i) + (t.length - j) <= 1; };
    let fuzzy = false;
    function score(x, toks){
      let s = 0;
      for (const t of toks){
        let best = 0;
        if (t.length >= 3 && x._s.includes(t)) best = x._s === t ? 40 : 14;
        x._w.forEach((w, i) => { if (w.startsWith(t)) { const v = (w === t ? 6 : 4) + (i < 3 ? 2 : 0); if (v > best) best = v; } });
        if (!best && t.length >= 4 && x._n.includes(t)) best = 2;
        if (!best && fuzzy && t.length >= 4) x._w.forEach(w => { if (!best && (near(w.slice(0, t.length), t) || near(w.slice(0, t.length + 1), t) || near(w, t))) best = 1; });
        if (!best) return 0;
        s += best;
      }
      if (x.p) s += .5; if (x.i) s += .5;
      return s;
    }
    function find(q, brand){
      const d = data; if (!d) return {items: [], parts: [], brands: []};
      const run = qq => { const toks = norm(qq).split(' ').filter(Boolean);
        if (!toks.length) return [];
        return d.items.map(x => [x, score(x, toks)]).filter(a => a[1] > 0).sort((a, b) => b[1] - a[1]).map(a => a[0]); };
      let items = run(q), fixed = '', how = '';
      if (!items.length && /[a-z]/i.test(q)){ const l = layout(q); const r = run(l); if (r.length){ items = r; fixed = l; how = 'layout'; } }
      if (!items.length && /[а-я]/i.test(q)){ const t = translit(norm(q)); const r = run(t); if (r.length){ items = r; fixed = t; how = 'tr'; } }
      if (!items.length){ fuzzy = true; items = run(fixed || q); fuzzy = false; if (items.length) how = 'typo'; }
      const qn = norm(fixed || q);
      const parts = qn ? d.parts.filter(p => qn.split(' ').every(t => p._n.split(' ').some(w => w.startsWith(t)))).sort((a, b) => b.c - a.c).slice(0, 6) : [];
      const bq = qn.split(' ').filter(Boolean);
      const brands = bq.length ? d.brands.filter(b => bq.some(t => t.length >= 2 && b._n.split(' ').some(w => w.startsWith(t)))).sort((a, b) => b.c - a.c).slice(0, 5) : [];
      // бренды из найденных товаров — для фильтра
      const facet = {}; items.forEach(x => { if (x.b) facet[x.b] = (facet[x.b] || 0) + 1; });
      if (brand) items = items.filter(x => x.b === brand);
      return {items, parts, brands, fixed, facet, how};
    }
    // ---- окно поиска
    const box = D.createElement('div'); box.className = 'ml-sr'; box.hidden = true;
    box.innerHTML = `<div class="ml-sr-bg"></div><div class="ml-sr-pan" role="dialog" aria-modal="true" aria-label="Поиск по каталогу">
  <div class="ml-sr-top"><label class="ml-sr-in">${ML_ICO.search}<input type="search" placeholder="Люстра, бра, трековый, артикул или бренд…" autocomplete="off" spellcheck="false" enterkeyhint="search"><button type="button" class="ml-sr-clr" aria-label="Очистить" hidden>${ML_ICO.x}</button></label>
  <button type="button" class="ml-sr-x" aria-label="Закрыть поиск">${ML_ICO.x}</button></div>
  <div class="ml-sr-body"></div></div>`;
    D.body.appendChild(box);
    const inp = box.querySelector('input'), body = box.querySelector('.ml-sr-body'), clr = box.querySelector('.ml-sr-clr');
    const shop = mlShop(box);
    let brand = '', shown = PAGE, last = null, lastFocus = null;
    const HINTS = ['люстра', 'трековый', 'магнитная система', 'бра', 'точечный', 'подвесной', 'лента', 'настольная лампа', 'уличный', 'торшер'];
    const recent = () => { try { return JSON.parse(ls.get('ml-srch-recent') || '[]'); } catch (e){ return []; } };
    const remember = q => { q = q.trim(); if (q.length < 2) return; ls.set('ml-srch-recent', JSON.stringify([q, ...recent().filter(x => x !== q)].slice(0, 6))); };
    const chip = (q, cls) => `<button type="button" class="ml-sr-chip${cls ? ' ' + cls : ''}" data-q="${esc(q)}">${esc(q)}</button>`;
    const wa = q => `https://wa.me/${ML_WA}?text=` + encodeURIComponent(`Здравствуйте! Ищу на сайте: ${q}`);
    function render(){
      const q = inp.value; clr.hidden = !q;
      if (!data){ body.innerHTML = `<div class="ml-sr-msg"><span class="ml-sr-spin"></span>Загружаю каталог…</div>`; return; }
      if (!norm(q)){
        const r = recent();
        body.innerHTML = (r.length ? `<div class="ml-sr-h">Вы искали</div><div class="ml-sr-chips">${r.map(x => chip(x, 'ml-sr-rec')).join('')}</div>` : '') +
          `<div class="ml-sr-h">Часто ищут</div><div class="ml-sr-chips">${HINTS.map(x => chip(x)).join('')}</div>` +
          `<div class="ml-sr-h">Разделы</div><div class="ml-sr-parts">${data.parts.filter(p => !p.par).sort((a, b) => b.c - a.c).slice(0, 10).map(p => `<a href="${esc(p.h || '/catalog')}">${esc(p.t)}<small>${p.c}</small></a>`).join('')}</div>`;
        return;
      }
      const r = last = find(q, brand);
      const n = r.items.length;
      let h = '';
      if (r.how === 'layout') h += `<div class="ml-sr-fix">Показываю «<b>${esc(r.fixed)}</b>» — похоже, была английская раскладка</div>`;
      else if (r.how === 'tr') h += `<div class="ml-sr-fix">Показываю «<b>${esc(r.fixed)}</b>»</div>`;
      else if (r.how === 'typo') h += `<div class="ml-sr-fix">Точных совпадений нет — показываю похожие</div>`;
      if (r.parts.length || r.brands.length) h += `<div class="ml-sr-parts">${r.parts.map(p => `<a href="${esc(p.h || '/catalog')}"><i>раздел</i>${esc(p.t)}<small>${p.c}</small></a>`).join('')}${r.brands.map(b => `<button type="button" data-b="${esc(b.n)}" class="${brand === b.n ? 'on' : ''}"><i>бренд</i>${esc(b.n)}<small>${b.c}</small></button>`).join('')}</div>`;
      if (!n){
        h += `<div class="ml-sr-empty"><b>Ничего не нашлось${brand ? ' у ' + esc(brand) : ''}</b><span>Проверьте написание или опишите, что ищете, — подберём сами.</span>
          ${brand ? `<button type="button" class="ml-sr-chip" data-b="">Искать у всех брендов</button>` : ''}<a class="ml-sr-wa" href="${wa(q)}" target="_blank" rel="noopener">${ML_ICO.wa}<span>Спросить в WhatsApp</span></a></div>`;
        body.innerHTML = h; return;
      }
      const fb = Object.entries(r.facet).sort((a, b) => b[1] - a[1]);
      h += `<div class="ml-sr-bar"><b>${n} ${mlPlural(n, 'товар', 'товара', 'товаров')}</b>${fb.length > 1 || brand ? `<div class="ml-sr-fb"><button type="button" data-b="" class="${brand ? '' : 'on'}">Все</button>${fb.slice(0, 8).map(([b, c]) => `<button type="button" data-b="${esc(b)}" class="${brand === b ? 'on' : ''}">${esc(b)} <small>${c}</small></button>`).join('')}</div>` : ''}</div>`;
      h += `<div class="mk-grid ml-sr-grid">${r.items.slice(0, shown).map(shop.card).join('')}</div>`;
      if (n > shown) h += `<button type="button" class="ml-sr-more">Показать ещё ${Math.min(PAGE, n - shown)} из ${n - shown}</button>`;
      body.innerHTML = h;
      body.querySelectorAll('.ml-sr-grid').forEach(g => { if (!g.__b){ g.__b = 1; shop.bind(g); } });
    }
    let tmr = 0;
    inp.addEventListener('input', () => { clearTimeout(tmr); shown = PAGE; brand = ''; tmr = setTimeout(() => { render(); body.scrollTop = 0; }, 120); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); remember(inp.value); inp.blur(); } });
    clr.onclick = () => { inp.value = ''; brand = ''; render(); inp.focus(); };
    box.querySelector('.ml-sr-x').onclick = close; box.querySelector('.ml-sr-bg').onclick = close;
    body.addEventListener('click', e => {
      const c = e.target.closest('[data-q]'); if (c){ inp.value = c.dataset.q; brand = ''; shown = PAGE; remember(c.dataset.q); render(); return; }
      const b = e.target.closest('[data-b]'); if (b){ brand = b.dataset.b === brand ? '' : b.dataset.b; shown = PAGE; render(); return; }
      if (e.target.closest('.ml-sr-more')){ shown += PAGE; render(); return; }
      if (e.target.closest('.mk-card,.ml-sr-parts a')) remember(inp.value);
    });
    function open(q){
      if (!box.hidden) return; lastFocus = D.activeElement;
      box.hidden = false; D.documentElement.classList.add('ml-sr-on');
      requestAnimationFrame(() => box.classList.add('on'));
      if (typeof q === 'string') inp.value = q;
      render(); setTimeout(() => inp.focus(), 30);
      load().then(render, () => { body.innerHTML = `<div class="ml-sr-msg">Каталог не загрузился. <a href="${wa(inp.value || 'светильник')}" target="_blank" rel="noopener">Напишите нам в WhatsApp</a> — подберём.</div>`; });
    }
    function close(){
      if (box.hidden || shop.isOpen()) return;
      box.classList.remove('on'); D.documentElement.classList.remove('ml-sr-on');
      setTimeout(() => { box.hidden = true; }, 220);
      if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e){}
    }
    window.mlSearchOpen = open;
    // перехватываем значок поиска Тильды (#opensearch) — до её обработчиков
    D.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[href="#opensearch"],a[href$="#opensearch"],.t985__search-widget-button,.t-menuwidgeticons__link_search');
      if (!a) return; e.preventDefault(); e.stopImmediatePropagation(); open(); }, true);
    D.addEventListener('pointerover', e => { if (e.target.closest && e.target.closest('a[href$="#opensearch"],.t-menuwidgeticons__link_search')) load().catch(() => {}); }, true);
    D.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !box.hidden && !shop.isOpen()){ close(); return; }
      const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (((e.ctrlKey || e.metaKey) && e.code === 'KeyK') || (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey)){ e.preventDefault(); open(); }
    });
    // ?search=… в адресе (так ссылается Тильда) — открыть сразу
    try { const q = new URL(location.href).searchParams.get('search'); if (q) setTimeout(() => open(q), 400); } catch (e){}
  })();
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
function cursorStar(){
// ---------- курсор-конструктор (по умолчанию — «звезда бренда»). Всё настраивается в Студии и меняется вживую:
// форма, размер, цвет, сияние, плавность, вращение, след, поведение над кнопкой, эффект клика.
// над кнопкой (режим «кольцо») звезда исчезает, кольцо обнимает кнопку по её форме, кнопка чуть тянется к курсору
const fine = matchMedia('(pointer:fine)').matches;
if (fine){
  const D = document, root = D.documentElement;
  let O = window.mlStudioCfg || {};
  const SHAPES = {
    star: 'M0,-12 C1,-3 3,-1 12,0 C3,1 1,3 0,12 C-1,3 -3,1 -12,0 C-3,-1 -1,-3 0,-12Z',
    star8: 'M0,-12 L1.6,-3.9 L7.8,-7.8 L3.9,-1.6 L12,0 L3.9,1.6 L7.8,7.8 L1.6,3.9 L0,12 L-1.6,3.9 L-7.8,7.8 L-3.9,1.6 L-12,0 L-3.9,-1.6 L-7.8,-7.8 L-1.6,-3.9Z',
    dot: 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0Z',
    ring: 'M-8,0a8,8 0 1,0 16,0a8,8 0 1,0 -16,0Z',
    crescent: 'M3,-9.5 A10,10 0 1,0 3,9.5 A11,11 0 0,1 3,-9.5Z',
    diamond: 'M0,-11 L7,0 L0,11 L-7,0Z',
    bulb: 'M0,-11 C5.5,-11 8,-7 8,-3.5 C8,0 5.5,2 4,4.5 L4,6.5 L-4,6.5 L-4,4.5 C-5.5,2 -8,0 -8,-3.5 C-8,-7 -5.5,-11 0,-11Z M-3.5,8 L3.5,8 L3.5,9.4 L-3.5,9.4Z M-2.2,10.6 L2.2,10.6 L2.2,11.8 L-2.2,11.8Z',
    plus: 'M-1.4,-10 H1.4 V-1.4 H10 V1.4 H1.4 V10 H-1.4 V1.4 H-10 V-1.4 H-1.4Z',
  };
  window.mlCursorShapes = SHAPES;
  const pal = {};
  const hexRgb = h => { h = (h || '').trim().replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) || 0).join(','); };
  const cvar = (v, def) => pal[v] || (pal[v] = hexRgb(getComputedStyle(root).getPropertyValue(v).trim() || def));
  setInterval(() => { for (const k in pal) delete pal[k]; }, 1500);   // --glow меняется ползунком комнат, цвета — Студией
  const css = D.createElement('style');
  css.textContent = `html.ml-star-on,html.ml-star-on *{cursor:none!important}
html.ml-star-on *::-webkit-slider-thumb{cursor:none!important}
html.ml-star-on *::-webkit-slider-runnable-track{cursor:none!important}
html.ml-star-on *::-moz-range-thumb{cursor:none!important}
html.ml-star-on input[type=text],html.ml-star-on input[type=tel],html.ml-star-on input[type=email],html.ml-star-on textarea{cursor:text!important}
.ml-star,.ml-star-ring,.ml-star-cv{position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647}
.ml-star{width:26px;height:26px;margin:-13px 0 0 -13px;opacity:0;transition:opacity .2s}
.ml-star svg{display:block;overflow:visible}
.ml-star-in .ml-star{opacity:1}
.ml-star-in .ml-star.off{opacity:0}
.ml-star-ring{opacity:0;transition:opacity .22s}
.ml-star-ring.on{opacity:1}
.ml-star-cv{z-index:2147483646}
html:not(.ml-star-on) :is(.ml-star,.ml-star-ring,.ml-star-cv){display:none}`;
  D.head.appendChild(css);
  const star = D.createElement('div'); star.className = 'ml-star';
  star.innerHTML = '<svg viewBox="-13 -13 26 26" width="26" height="26"><path stroke-linejoin="round"/></svg>';
  const pth = star.querySelector('path'), svg = star.querySelector('svg');
  const ring = D.createElement('div'); ring.className = 'ml-star-ring';
  const cv = D.createElement('canvas'); cv.className = 'ml-star-cv';
  D.body.append(cv, ring, star);
  const ctx = cv.getContext('2d');
  let W = 0, H = 0;
  const rs = () => { const r = devicePixelRatio || 1; W = innerWidth; H = innerHeight; cv.width = W*r; cv.height = H*r; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(r,0,0,r,0,0); };
  rs(); addEventListener('resize', rs);

  // настройки: читаем при каждом изменении в Студии
  let opt = {};
  function readOpts(){
    O = window.mlStudioCfg || {};
    opt = {off: O.cursor === 'off', shape: SHAPES[O.curShape] ? O.curShape : 'star', size: O.curSize || 1, color: O.curColor || 'auto', hex: O.curHex || '#BCD0E6',
      halo: O.curHalo == null ? 1 : O.curHalo, lag: O.curLag || 0, spin: O.curSpin || 'speed', trail: O.curTrail || 'dots', len: O.curTrailLen || 1,
      btn: O.curBtn || 'ring', pull: O.curPull == null ? 1 : O.curPull, click: O.curClick || 'burst', link: O.curLink !== 'none'};
    root.classList.toggle('ml-star-on', !opt.off);
    const big = 26 * opt.size; star.style.width = star.style.height = big + 'px'; star.style.margin = (-big / 2) + 'px 0 0 ' + (-big / 2) + 'px';
    svg.setAttribute('width', big); svg.setAttribute('height', big);
    pth.setAttribute('d', SHAPES[opt.shape]);
    lastDark = null; trail.length = 0;
  }
  // цвет курсора: на тёмном фоне и на светлом
  function rgb(){ const m = opt.color;
    if (m === 'warm') return dark ? cvar('--glow', '#FFC37A') : '214,140,60';
    if (m === 'mono') return dark ? '255,255,255' : cvar('--mlc-graphite', '#2F3438');
    if (m === 'custom') return hexRgb(opt.hex);
    return dark ? cvar('--mlc-moon', '#BCD0E6') : cvar('--mlc-moon-deep', '#5F7896'); }
  const rgba = (a) => 'rgba(' + rgb() + ',' + Math.max(0, Math.min(1, a)).toFixed(3) + ')';
  function paint(){
    const C = rgba(1), outline = opt.shape === 'ring';
    let fill, stroke;
    if (opt.color === 'mono'){ fill = dark ? '#fff' : 'var(--mlc-graphite,#2F3438)'; stroke = dark ? 'rgba(255,255,255,.35)' : '#fff'; }
    else if (opt.color === 'custom' || opt.color === 'warm'){ fill = dark ? '#fff' : C; stroke = dark ? C : '#fff'; }
    else { fill = dark ? '#fff' : 'var(--mlc-graphite,#2F3438)'; stroke = dark ? C : '#fff'; }
    if (outline){ pth.style.fill = 'none'; pth.style.stroke = dark ? (opt.color === 'mono' ? '#fff' : C) : (opt.color === 'mono' ? 'var(--mlc-graphite,#2F3438)' : C); pth.setAttribute('stroke-width', 2.2); }
    else { pth.style.fill = fill; pth.style.stroke = stroke; pth.setAttribute('stroke-width', dark ? '1.2' : '1.4'); }
    const h = opt.halo;
    svg.style.filter = !h ? 'none' : dark ? `drop-shadow(0 0 ${5 * h}px ${rgba(.95)})` : `drop-shadow(0 0 1.5px ${rgba(.9)}) drop-shadow(0 0 ${7 * h}px ${rgba(.6)})`;
    ring.style.boxShadow = opt.btn === 'fill' ? `0 0 0 1px ${rgba(.5)},0 0 30px ${rgba(.35)}` : `0 0 0 ${dark ? 1.5 : 2}px ${C},0 0 ${24 * Math.max(.4, h)}px ${rgba(.6)},inset 0 0 14px ${rgba(.28)}`;
    ring.style.background = opt.btn === 'fill' ? rgba(dark ? .22 : .18) : 'none';
  }

  const LINK = 'a,button,input,label,select,textarea,[role=button],[role=tab],[role=switch],.lr-hs,.js-product';
  // «кнопка» = ссылка/кнопка с собственным фоном или рамкой и кнопочным размером
  function asButton(el){
    if (!el || el.closest('.ml-star-skip,.mls-host')) return null;
    const b = el.closest('.t-btn,.t-btnflex,.t-submit,.ml-btn,.ml-fl-sw,.t-store__card__btn,.t-catalog__card__btn,button,a,[role=button]');
    if (!b) return null;
    const r = b.getBoundingClientRect(); if (r.height < 26 || r.height > 90 || r.width > 520 || r.width < 40) return null;
    // настоящие кнопки, вкладки, переключатели — всегда (у невыбранной вкладки фона нет, но это тоже кнопка)
    if (b.matches('button,[role=button],[role=tab],[role=radio],[role=menuitemradio],.t-btn,.t-btnflex,.t-submit')) return b;
    const cs = getComputedStyle(b), bg = cs.backgroundColor.match(/[\d.]+/g);
    const filled = bg && (bg.length < 4 || +bg[3] > .3), bordered = parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none';
    return filled || bordered ? b : null;
  }
  let inPanel = false, lastDark = null, mx = -500, my = -500, sx = -500, sy = -500, px = 0, py = 0, seen = false, link = false, btn = null, dark = true, beam = false, clickAt = -1e9, lastProbe = 0, burst = false;
  function probe(){
    const el = D.elementFromPoint(mx, my); if (!el) return;
    let n = el, c = null;
    while (n && n.nodeType === 1){ const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > .5)){ c = m; break; } n = n.parentElement; }
    if (c) dark = (.2126*c[0] + .7152*c[1] + .0722*c[2]) / 255 < .45;
    if (dark === lastDark) return; lastDark = dark;
    paint(); root.classList.toggle('ml-star-light', !dark);
  }
  function target(el){
    beam = !!(el && el.closest('.fl-box') && !el.closest('.ml-fl-ui') && !el.closest('.ml-fl.lit'));  // в фонарике курсор = луч; свет включён — снова звезда
    inPanel = !!(el && el.closest && el.closest('.mls-host'));   // над панелью Студии — обычная стрелка
    const b = beam || opt.off || inPanel ? null : asButton(el);
    if (btn && btn !== b){ btn.style.translate = ''; }
    btn = b; link = !b && !!(el && el.closest(LINK));
    const hug = btn && (opt.btn === 'ring' || opt.btn === 'fill');
    star.classList.toggle('off', inPanel || beam || (btn && opt.btn === 'ring'));
    ring.classList.toggle('on', !!hug);
    if (btn){ const r = btn.getBoundingClientRect(), br = parseFloat(getComputedStyle(btn).borderTopLeftRadius) || 0;
      if (!ring.classList.contains('was')){ rx = sx; ry = sy; rw = 10; rh = 10; }
      rr = Math.min(br + 6, (r.height + 12)/2); }
    ring.classList.toggle('was', !!hug);
  }
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!seen){ seen = true; px = sx = mx; py = sy = my; root.classList.add('ml-star-in'); probe(); }
    target(e.target);
  }, {passive:true});
  addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') clickAt = performance.now(); });
  addEventListener('scroll', () => { lastProbe = 0; if (seen) target(D.elementFromPoint(mx, my)); }, {passive:true});
  D.addEventListener('mouseleave', () => { root.classList.remove('ml-star-in'); target(null); });
  D.addEventListener('mouseenter', () => { if (seen) root.classList.add('ml-star-in'); });
  D.addEventListener('mls-apply', () => { readOpts(); if (seen){ probe(); target(D.elementFromPoint(mx, my)); } });

  const dots = [], trail = []; let dotsDirty = false, ang = 0, sc = 1, lastDot = 0, rx = 0, ry = 0, rw = 10, rh = 10, rr = 20;
  const K = RM ? 1 : 0;
  // маленькая 4-лучевая звезда на холсте (искры)
  function spark(x, y, r, a){ ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.beginPath();
    for (let i = 0; i < 4; i++){ ctx.rotate(Math.PI / 2); ctx.moveTo(0, -r); ctx.quadraticCurveTo(r * .12, -r * .12, r, 0); ctx.lineTo(0, 0); }
    ctx.closePath(); ctx.restore(); }
  readOpts();
  function frame(t){
    requestAnimationFrame(frame);
    if (!seen || opt.off){ if (dotsDirty){ ctx.clearRect(0, 0, W, H); dotsDirty = false; dots.length = 0; } return; }
    if (t - lastProbe > 120){ lastProbe = t; probe();
      // кнопку закрыли/перекрыли без движения мыши (корзина, окно) — кольцо не должно висеть в пустоте
      if (btn && seen){ const h = D.elementFromPoint(mx, my); if (!h || !btn.isConnected || !(btn === h || btn.contains(h))) target(h); } }
    // плавность: курсор догоняет мышь с инерцией
    const f = RM ? 1 : 1 - Math.min(.92, opt.lag * .95);
    sx = lerp(sx, mx, f); sy = lerp(sy, my, f);
    const vx = sx - px; px = sx;
    const vy = sy - py; py = sy; const sp = Math.hypot(vx, vy);
    // вращение: от скорости / спокойно / всё время; над ссылкой — на 45° и крупнее
    const tgt = link && opt.link ? 45 : 0;
    if (!RM){ if (opt.spin === 'spin') ang += 1.4; else if (opt.spin === 'still') ang = lerp(ang, Math.round(ang / 90) * 90 + tgt, .15);
      else ang += vx * .6 + (tgt ? (45 - ((ang % 90) + 90) % 90) * .12 : 0); }
    const grow = (link && opt.link ? 1.6 : 1) * (btn && opt.btn === 'magnet' ? 1.5 : 1) * (btn && opt.btn === 'none' ? 1.3 : 1);
    sc = lerp(sc, grow, K || .15);
    star.style.transform = `translate3d(${sx}px,${sy}px,0) rotate(${ang}deg) scale(${sc})`;
    // кнопку под курсором убрали из страницы (перерисовка) — берём то, что теперь под курсором
    if (btn && !btn.isConnected){ btn = null; target(D.elementFromPoint(mx, my)); }
    // над кнопкой: кнопка тянется к курсору; кольцо обнимает её или под курсором — полупрозрачный круг
    if (btn){
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const still = RM || btn.closest('.ml-chips');   // в листаемой строке фильтров кнопки не тянем — иначе наезжают друг на друга
      const k = opt.pull * (opt.btn === 'magnet' ? 1.6 : 1);
      const ox = still ? 0 : (mx - cx) * .18 * k, oy = still ? 0 : (my - cy) * .25 * k;
      btn.style.translate = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
      const blink = t - clickAt < 160, rs_ = ring.style;
      if (opt.btn === 'ring'){
        rx = lerp(rx, cx + ox*.5, K || .25); ry = lerp(ry, cy + oy*.5, K || .25);
        rw = lerp(rw, r.width + 12, K || .22); rh = lerp(rh, r.height + 12, K || .22);
        rs_.width = rw + 'px'; rs_.height = rh + 'px'; rs_.borderRadius = rr + 'px';
        rs_.transform = `translate3d(${rx - rw/2}px,${ry - rh/2}px,0) scale(${blink ? .96 : 1})`;
      } else if (opt.btn === 'fill'){
        const d = Math.min(64, r.height + 14) * Math.max(.8, opt.size);
        rx = lerp(rx, sx, K || .35); ry = lerp(ry, sy, K || .35); rw = lerp(rw, d, K || .2); rh = rw;
        rs_.width = rw + 'px'; rs_.height = rh + 'px'; rs_.borderRadius = '50%';
        rs_.transform = `translate3d(${rx - rw/2}px,${ry - rh/2}px,0) scale(${blink ? .85 : 1})`;
      }
    }
    // след
    const tr = !RM && !beam && !inPanel && !(btn && opt.btn === 'ring') ? opt.trail : 'none', L = opt.len;
    if (tr === 'dots' && sp > 2 && t - lastDot > 30){ lastDot = t;
      dots.push({x:sx + (Math.random()-.5)*10, y:sy + (Math.random()-.5)*10, r:1 + Math.random()*1.6, b:t, life:(700 + Math.random()*500) * L, vx:0, vy:.15}); }
    if (tr === 'sparks' && sp > 1.5 && t - lastDot > 45){ lastDot = t;
      dots.push({x:sx + (Math.random()-.5)*18, y:sy + (Math.random()-.5)*18, r:3 + Math.random()*4, b:t, life:(600 + Math.random()*600) * L, vx:(Math.random()-.5)*.6, vy:.3 + Math.random()*.4, s:1, a:Math.random()*3}); }
    if (tr === 'comet' || tr === 'light'){ trail.push({x:sx, y:sy, t}); }
    while (trail.length && (t - trail[0].t > (tr === 'comet' ? 260 * L : 600 * L) || trail.length > 120)) trail.shift();
    if (tr !== 'comet' && tr !== 'light') trail.length = 0;
    // клик: вспышка точек / волна / звёзды
    if (!RM && !beam && t - clickAt < 40 && !burst){ burst = true;
      if (opt.click === 'burst') for (let i = 0; i < 14; i++){ const a = i/14*Math.PI*2; dots.push({x:sx, y:sy, r:1.6 + Math.random(), b:t, life:800, vx:Math.cos(a)*2.4, vy:Math.sin(a)*2.4}); }
      if (opt.click === 'ripple') dots.push({x:sx, y:sy, b:t, life:650, w:1}), dots.push({x:sx, y:sy, b:t + 120, life:650, w:1});
      if (opt.click === 'stars') for (let i = 0; i < 9; i++){ const a = Math.random()*Math.PI*2, v = 1.5 + Math.random()*3; dots.push({x:sx, y:sy, r:3 + Math.random()*4, b:t, life:900, vx:Math.cos(a)*v, vy:Math.sin(a)*v - 1, s:1, a:Math.random()*3, g:.08}); }
    }
    if (t - clickAt >= 40) burst = false;
    if (dots.length || trail.length || dotsDirty){
      ctx.clearRect(0, 0, W, H); dotsDirty = dots.length > 0 || trail.length > 0;
      if (trail.length > 1 && tr === 'comet'){ ctx.lineCap = 'round';
        for (let i = 1; i < trail.length; i++){ const k = i / trail.length; ctx.beginPath(); ctx.moveTo(trail[i-1].x, trail[i-1].y); ctx.lineTo(trail[i].x, trail[i].y);
          ctx.lineWidth = 1 + k * 5 * opt.size; ctx.strokeStyle = rgba(k * .75); ctx.stroke(); } }
      if (trail.length && tr === 'light'){ const p = trail[0], R = 120 * L * opt.size;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R); g.addColorStop(0, rgba(dark ? .22 : .16)); g.addColorStop(1, rgba(0));
        ctx.fillStyle = g; ctx.fillRect(p.x - R, p.y - R, R * 2, R * 2); }
      for (let i = dots.length - 1; i >= 0; i--){ const d = dots[i], k = (t - d.b)/d.life;
        if (k >= 1){ dots.splice(i, 1); continue; } if (k < 0) continue;
        if (d.w){ ctx.beginPath(); ctx.arc(d.x, d.y, 6 + k * 46 * opt.size, 0, 7); ctx.lineWidth = 2 * (1 - k); ctx.strokeStyle = rgba((1 - k) * .9); ctx.stroke(); continue; }
        d.x += d.vx; d.y += d.vy; d.vx *= .94; d.vy *= .94; if (d.g) d.vy += d.g;
        if (d.s){ const tw = .55 + .45 * Math.sin(t / 90 + d.a * 5); spark(d.x, d.y, d.r * (1 - k * .4), d.a + k * 2); ctx.fillStyle = rgba((1 - k) * tw); ctx.fill(); continue; }
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r*(1 - k*.5), 0, 7);
        ctx.fillStyle = rgba((1-k)*.9); ctx.fill(); }
    }
  }
  requestAnimationFrame(frame);
}

}
function cursorSpot(){
// ---------- курсор «трековый спот»: шина вверху экрана, по ней едет спот и светит лучом в курсор
// страница чуть приглушена, светло там, куда смотрит спот; над товаром/кнопкой луч сужается и ярче; клик — вспышка
const fine = matchMedia('(pointer:fine)').matches;
if (fine){
  const D = document, root = D.documentElement;
  const css = D.createElement('style');
  css.textContent = `html.ml-spot-on,html.ml-spot-on *{cursor:none!important}
html.ml-spot-on *::-webkit-slider-thumb{cursor:none!important}
html.ml-spot-on *::-webkit-slider-runnable-track{cursor:none!important}
html.ml-spot-on *::-moz-range-thumb{cursor:none!important}
html.ml-spot-on input[type=text],html.ml-spot-on input[type=tel],html.ml-spot-on input[type=email],html.ml-spot-on textarea{cursor:text!important}
.ml-spot-dim,.ml-spot-cv,.ml-spot-dot{position:fixed;pointer-events:none;z-index:2147483646}
.ml-spot-dim{inset:0;opacity:0;transition:opacity .45s}
.ml-spot-cv{left:0;top:0;opacity:0;transition:opacity .45s}
.ml-spot-on.ml-spot-in .ml-spot-dim,.ml-spot-on.ml-spot-in .ml-spot-cv{opacity:1}
.ml-spot-dot{left:0;top:0;z-index:2147483647;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:#fff;box-shadow:0 0 0 1.5px rgba(20,20,22,.5),0 0 10px 2px var(--mlc-moon,#BCD0E6);opacity:0;transition:opacity .2s}
.ml-spot-in .ml-spot-dot{opacity:1}
.ml-spot-in .ml-spot-dot.off{opacity:0}`;
  D.head.appendChild(css);
  root.classList.add('ml-spot-on');
  const dim = D.createElement('div'); dim.className = 'ml-spot-dim';
  const cv = D.createElement('canvas'); cv.className = 'ml-spot-cv';
  const dot = D.createElement('div'); dot.className = 'ml-spot-dot';
  D.body.append(dim, cv, dot);
  const ctx = cv.getContext('2d');
  let W = 0, H = 0;
  const rs = () => { const r = devicePixelRatio || 1; W = innerWidth; H = innerHeight; cv.width = W*r; cv.height = H*r; cv.style.width = W + 'px'; cv.style.height = H + 'px'; ctx.setTransform(r,0,0,r,0,0); dirty = 1; };
  let dirty = 1; rs(); addEventListener('resize', rs);

  const HOV = 'a,button,input,label,select,textarea,[role=button],[role=tab],[role=switch],.lr-hs,.js-product,.t-store__card,.t-catalog__card';
  let mx = -500, my = -500, seen = false, hov = false, dark = true, beamOnly = false, clickAt = -1e9, lastProbe = 0;
  // тон фона под курсором: ищем первый непрозрачный фон вверх по дереву
  function probe(){
    const el = D.elementFromPoint(mx, my); if (!el) return;
    hov = !!el.closest(HOV);
    beamOnly = !!el.closest('.fl-box');            // в фонарике свой луч — гасим приглушение и точку
    let n = el, c = null;
    while (n && n.nodeType === 1){ const b = getComputedStyle(n).backgroundColor; const m = b.match(/[\d.]+/g);
      if (m && (m.length < 4 || +m[3] > .5)){ c = m; break; } n = n.parentElement; }
    if (c) dark = (.2126*c[0] + .7152*c[1] + .0722*c[2]) / 255 < .45;
    dot.classList.toggle('off', beamOnly);
  }
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!seen){ seen = true; sx = fx = mx; fy = my; root.classList.add('ml-spot-in'); }
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
  }, {passive:true});
  addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') clickAt = performance.now(); });
  D.addEventListener('mouseleave', () => root.classList.remove('ml-spot-in'));
  D.addEventListener('mouseenter', () => { if (seen) root.classList.add('ml-spot-in'); });

  let sx = 0, fx = 0, fy = 0, foc = 0, dimA = .3, last = '';
  const k = RM ? 1 : 0;
  function frame(t){
    requestAnimationFrame(frame);
    if (!seen) return;
    if (t - lastProbe > 110){ lastProbe = t; probe(); }
    const flash = RM ? 0 : Math.max(0, 1 - (t - clickAt)/350);
    const nsx = lerp(sx, mx, k || .06), nfx = lerp(fx, mx, k || .16), nfy = lerp(fy, my, k || .16), nfoc = lerp(foc, hov ? 1 : 0, k || .12);
    const nd = lerp(dimA, beamOnly ? 0 : dark ? .4 : .26, .08);
    const moving = Math.abs(nsx - sx) + Math.abs(nfx - fx) + Math.abs(nfy - fy) + Math.abs(nfoc - foc) + Math.abs(nd - dimA) > .05;
    sx = nsx; fx = nfx; fy = nfy; foc = nfoc; dimA = nd;
    if (!moving && !flash && !dirty) return;
    dirty = 0;
    const R = lerp(210, 125, foc) * (1 + flash*.4);
    const bg = `radial-gradient(ellipse ${R*1.25|0}px ${R|0}px at ${fx|0}px ${fy|0}px, rgba(255,214,150,${(.1 + foc*.08 + flash*.25)*(beamOnly ? 0 : 1)}) 0, transparent 60%, rgba(12,13,15,${dimA.toFixed(3)}) 100%)`;
    if (bg !== last){ dim.style.background = bg; last = bg; }
    ctx.clearRect(0, 0, W, H);
    const RY = 0;                                    // шина у верхнего края
    ctx.fillStyle = '#16181b'; ctx.fillRect(0, RY, W, 6);
    ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(0, RY + 5, W, 1);
    const ang = Math.atan2(fy - (RY + 18), fx - sx);
    ctx.save(); ctx.translate(sx, RY + 6);
    ctx.fillStyle = '#16181b'; ctx.fillRect(-7, 0, 14, 7);
    ctx.rotate(ang - Math.PI/2);
    ctx.fillStyle = '#1e2125'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-9, 4, 18, 30, 4) : ctx.rect(-9, 4, 18, 30); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(-9, 4, 1.5, 30);
    ctx.fillStyle = `rgba(255,226,170,${.85 + flash*.15})`; ctx.beginPath(); ctx.ellipse(0, 34, 7, 2.6, 0, 0, 7); ctx.fill();
    ctx.restore();
    const ox = sx + Math.cos(ang)*34, oy = RY + 6 + Math.sin(ang)*34;
    const len = Math.max(1, Math.hypot(fx - ox, fy - oy)), nx = -(fy - oy)/len, ny = (fx - ox)/len, w = R*.55;
    const gr = ctx.createLinearGradient(ox, oy, fx, fy);
    gr.addColorStop(0, `rgba(255,220,160,${.32 + flash*.3})`); gr.addColorStop(1, `rgba(255,220,160,${.05 + foc*.05})`);
    ctx.fillStyle = gr; ctx.beginPath();
    ctx.moveTo(ox + nx*6, oy + ny*6); ctx.lineTo(fx + nx*w, fy + ny*w); ctx.lineTo(fx - nx*w, fy - ny*w); ctx.lineTo(ox - nx*6, oy - ny*6); ctx.closePath();
    ctx.filter = 'blur(6px)'; ctx.globalCompositeOperation = 'screen'; ctx.fill(); ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  }
  addEventListener('scroll', () => { lastProbe = 0; }, {passive:true});
  requestAnimationFrame(frame);
}

}
const only = SCRIPT && SCRIPT.dataset.only, has = k => !only || only.split(',').includes(k);
const go = () => {
  if (has('rooms')) rooms();
  if (has('extras') && !(SCRIPT && SCRIPT.dataset.extras === 'off')) extras();
  const CUR = (window.mlStudioCfg || {}).cursor || (SCRIPT && SCRIPT.dataset.cursor);
  // конструктор курсора работает и при «Обычный» (спит) — чтобы Студия переключала курсор без перезагрузки
  if (has('cursor') && (CUR !== 'off' || window.mlStudioApi && window.mlStudioApi.on)) ({glow:cursor, spot:cursorSpot}[CUR] || cursorStar)();
};
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
})();

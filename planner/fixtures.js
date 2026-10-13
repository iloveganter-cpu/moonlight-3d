/* Moonlight: планировщик освещения — светильники с листа дизайн-проекта.
   1) register: совмещаем лист освещения с листом, по которому обведены комнаты (масштаб и сдвиг) — подгоняем
      контуры комнат к краям на листе освещения по карте расстояний (цветные линии светильников не учитываем);
   2) auto: уверенные группы одинаковых значков (красные, оранжевые, розовые — так обычно рисуют свет);
   3) byClick: клиент нажал на значок — находим все такие же по цвету и форме (и повёрнутые на 90°).
   Координаты — пиксели картинки листа освещения. window.MLPFix = { register, auto, byClick }. */
(function () {
  'use strict';

  function pixels(img, W) {
    var k = W ? W / Math.max(img.width, img.height) : 1, w = Math.max(1, Math.round(img.width * k)), h = Math.max(1, Math.round(img.height * k));
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
    return { d: x.getImageData(0, 0, w, h).data, w: w, h: h, k: k };
  }
  var cache = { img: null, P: null };
  function full(img) { if (cache.img !== img) { cache.img = img; cache.P = pixels(img, 0); } return cache.P; }

  // ---------- Совмещение листов ----------
  // Края без цвета рядом (стены, перегородки) → расстояние до ближайшего края (проходы 3-4, в пикселях)
  function edgeDist(img, W) {
    var P = pixels(img, W), w = P.w, h = P.h, d = P.d, N = w * h, g = new Float32Array(N), sat = new Uint8Array(N), i, x, y;
    for (i = 0; i < N; i++) { var r = d[4 * i], gg = d[4 * i + 1], b = d[4 * i + 2]; g[i] = (r + gg + b) / 3; sat[i] = Math.max(r, gg, b) - Math.min(r, gg, b); }
    var gb = new Float32Array(N);
    for (y = 1; y < h - 1; y++) for (x = 1; x < w - 1; x++) { i = y * w + x; gb[i] = (g[i - w - 1] + g[i - w] + g[i - w + 1] + g[i - 1] + g[i] + g[i + 1] + g[i + w - 1] + g[i + w] + g[i + w + 1]) / 9; }
    var D = new Float32Array(N), INF = 1e6;
    for (i = 0; i < N; i++) D[i] = INF;
    for (y = 2; y < h - 2; y++) for (x = 2; x < w - 2; x++) {
      i = y * w + x;
      var gx = gb[i - w + 1] + 2 * gb[i + 1] + gb[i + w + 1] - gb[i - w - 1] - 2 * gb[i - 1] - gb[i + w - 1];
      var gy = gb[i + w - 1] + 2 * gb[i + w] + gb[i + w + 1] - gb[i - w - 1] - 2 * gb[i - w] - gb[i - w + 1];
      if (gx * gx + gy * gy < 3600) continue;
      var sm = 0; for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) sm = Math.max(sm, sat[i + dy * w + dx]);
      if (sm < 50) D[i] = 0;
    }
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) { i = y * w + x; var v = D[i];
      if (x > 0) v = Math.min(v, D[i - 1] + 3); if (y > 0) { v = Math.min(v, D[i - w] + 3); if (x > 0) v = Math.min(v, D[i - w - 1] + 4); if (x < w - 1) v = Math.min(v, D[i - w + 1] + 4); } D[i] = v; }
    for (y = h - 1; y >= 0; y--) for (x = w - 1; x >= 0; x--) { i = y * w + x; var u = D[i];
      if (x < w - 1) u = Math.min(u, D[i + 1] + 3); if (y < h - 1) { u = Math.min(u, D[i + w] + 3); if (x < w - 1) u = Math.min(u, D[i + w + 1] + 4); if (x > 0) u = Math.min(u, D[i + w - 1] + 4); } D[i] = u; }
    for (i = 0; i < N; i++) D[i] /= 3;
    return { D: D, w: w, h: h, k: P.k };
  }
  // точки по стенам комнат (в пикселях исходного листа комнат), через step пикселей уменьшенной картинки
  function tplPts(polys, k, step) {
    var out = [];
    polys.forEach(function (P) {
      for (var i = 0; i < P.length; i++) {
        var a = P[i], b = P[(i + 1) % P.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]) * k, n = Math.max(1, Math.floor(L / step));
        for (var j = 0; j < n; j++) { var t = j / n; out.push([(a[0] + t * (b[0] - a[0])) * k, (a[1] + t * (b[1] - a[1])) * k]); }
      }
    });
    // перемешиваем — для раннего отсева по первым точкам
    for (var q = out.length - 1; q > 0; q--) { var r = (q * 7919) % (q + 1), tmp = out[q]; out[q] = out[r]; out[r] = tmp; }
    return out;
  }
  function chamfer(E, pts, s, tx, ty, cap, lim, best) {
    var D = E.D, w = E.w, h = E.h, sum = 0, n = pts.length;
    for (var i = 0; i < n; i++) {
      var x = Math.round(pts[i][0] * s + tx), y = Math.round(pts[i][1] * s + ty), v = cap;
      if (x >= 0 && y >= 0 && x < w && y < h) { v = D[y * w + x]; if (v > cap) v = cap; }
      sum += v;
      if (i === lim && sum / (lim + 1) > best + 1.5) return 1e9; // явно хуже лучшего — дальше не считаем
    }
    return sum / n;
  }
  // polys — контуры комнат в пикселях листа комнат (srcW — его ширина), img — лист освещения.
  // Возвращает x_осв = s · x_комн + tx (в пикселях исходных картинок) и качество (средний промах в px при 1000 px).
  // Края стен листа комнат вокруг обведённых комнат (в радиусе ext px): с одной обведённой комнатой одного контура
  // мало — прямоугольник подходит ко многим местам листа, а окружающие стены делают совмещение однозначным
  // Берём только толстые стены (тёмная или светлая заливка, штриховка) — размеры и надписи листа комнат на листе
  // освещения другие и сбивали бы совмещение. Граница маски стен после открытия квадратом 5×5 (тонкое уходит)
  function wallPts(src, W, polys, ext, maxN) {
    var P = pixels(src, W), w = P.w, h = P.h, d = P.d, N = w * h, g = new Float32Array(N), m = new Uint8Array(N), i, x, y;
    var hist = new Int32Array(256), paper = 255, cnt = 0;
    for (i = 0; i < N; i++) { var gg = (d[4 * i] + d[4 * i + 1] + d[4 * i + 2]) / 3; g[i] = gg; hist[gg | 0]++; }
    for (i = 255; i >= 0; i--) { cnt += hist[i]; if (cnt > 0.3 * N) { paper = i; break; } }
    var thr = Math.min(236, paper - 16), bl = new Float32Array(N), fh = new Int32Array(64);
    for (y = 1; y < h - 1; y++) for (x = 1; x < w - 1; x++) {
      i = y * w + x; var b = (g[i - w - 1] + g[i - w] + g[i - w + 1] + g[i - 1] + g[i] + g[i + 1] + g[i + w - 1] + g[i + w] + g[i + w + 1]) / 9;
      var sat = Math.max(d[4 * i], d[4 * i + 1], d[4 * i + 2]) - Math.min(d[4 * i], d[4 * i + 1], d[4 * i + 2]);
      bl[i] = b; if (b < thr && sat < 40) { m[i] = 1; fh[b >> 2]++; }
    }
    // сплошная заливка потолка/пола одним серым на пол-листа — не стены: без неё стены (часто светлая штриховка)
    // не сливаются с заливкой, и край стены остаётся
    var pk = 0; for (i = 1; i < 64; i++) if (fh[i] > fh[pk]) pk = i;
    if (fh[pk] > 0.12 * N && pk * 4 + 2 < thr - 10) { var lv = pk * 4 + 2; for (i = 0; i < N; i++) if (m[i] && Math.abs(bl[i] - lv) <= 6) m[i] = 0; }
    var er = new Uint8Array(N), op = new Uint8Array(N), R = 2;
    for (y = R; y < h - R; y++) for (x = R; x < w - R; x++) { var ok = 1; for (var dy = -R; dy <= R && ok; dy++) for (var dx = -R; dx <= R; dx++) if (!m[(y + dy) * w + x + dx]) { ok = 0; break; } er[y * w + x] = ok; }
    for (y = R; y < h - R; y++) for (x = R; x < w - R; x++) if (er[y * w + x]) for (var ey = -R; ey <= R; ey++) for (var ex = -R; ex <= R; ex++) op[(y + ey) * w + x + ex] = 1;
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, out = [], all = [];
    polys.forEach(function (Q) { Q.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); });
    if (!polys.length) { x0 = y0 = 0; x1 = src.width; y1 = src.height; } // весь лист
    var k = P.k, X0 = Math.max(1, Math.floor((x0 - ext) * k)), Y0 = Math.max(1, Math.floor((y0 - ext) * k)), X1 = Math.min(w - 1, Math.ceil((x1 + ext) * k)), Y1 = Math.min(h - 1, Math.ceil((y1 + ext) * k));
    for (y = Y0; y < Y1; y++) for (x = X0; x < X1; x++) { i = y * w + x; if (op[i] && (!op[i - 1] || !op[i + 1] || !op[i - w] || !op[i + w])) all.push([x / k, y / k]); }
    var st = Math.max(1, Math.ceil(all.length / maxN));
    for (var i = 0; i < all.length; i += st) out.push(all[i]);
    return out;
  }
  function mix(a, b) { var o = a.concat(b); for (var q = o.length - 1; q > 0; q--) { var r = (q * 7919 + 13) % (q + 1), t = o[q]; o[q] = o[r]; o[r] = t; } return o; }
  function register(polys, src, img, ext) {
    var srcW = src.width, base = img.width / srcW, Wc = 250, E = edgeDist(img, Wc), kc = E.k * base, best = 1e9, B = null;
    var walls = ext ? wallPts(src, 500, polys, ext, 4000) : [];
    var pts = mix(tplPts(polys, kc, 3), walls.filter(function (_, i) { return i % 4 === 0; }).map(function (p) { return [p[0] * kc, p[1] * kc]; }));
    if (!pts.length) return null;
    var bx = 0, by = 0, bw = 0, bh = 0; pts.forEach(function (p) { bx = Math.max(bx, p[0]); by = Math.max(by, p[1]); });
    bw = E.w; bh = E.h;
    for (var s = 0.6; s <= 1.62; s += 0.02)
      for (var tx = -Math.round(bx * s); tx <= bw; tx += 2)
        for (var ty = -Math.round(by * s); ty <= bh; ty += 2) {
          var sc = chamfer(E, pts, s, tx, ty, 6, 40, best);
          if (sc < best) { best = sc; B = [s, tx, ty]; }
        }
    if (!B) return null;
    var Wf = 1000, F = edgeDist(img, Wf), kf = F.k * base, pf = mix(tplPts(polys, kf, 2), walls.map(function (p) { return [p[0] * kf, p[1] * kf]; })), r = Wf / Wc, bf = 1e9, R = null;
    for (var s2 = B[0] - 0.03; s2 <= B[0] + 0.031; s2 += 0.005)
      for (var tx2 = Math.round(B[1] * r) - 12; tx2 <= Math.round(B[1] * r) + 12; tx2++)
        for (var ty2 = Math.round(B[2] * r) - 12; ty2 <= Math.round(B[2] * r) + 12; ty2++) {
          var sf = chamfer(F, pf, s2, tx2, ty2, 10, 80, bf);
          if (sf < bf) { bf = sf; R = [s2, tx2, ty2]; }
        }
    // в пикселях исходных картинок: x_осв = (s · x_комн · kf + tx) / F.k
    return { s: R[0] * base, tx: R[1] / F.k, ty: R[2] / F.k, score: bf };
  }

  // ---------- Значки ----------
  function hueOf(r, g, b) {
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn || 1;
    return mx === r ? ((60 * (g - b) / d) + 360) % 360 : mx === g ? 60 * (b - r) / d + 120 : 60 * (r - g) / d + 240;
  }
  // связные области маски m (8-связность) в прямоугольнике; f(comp) — для каждой
  function comps(m, w, h, f, x0, y0, x1, y1) {
    x0 = x0 || 0; y0 = y0 || 0; x1 = x1 == null ? w : x1; y1 = y1 == null ? h : y1;
    var lab = new Uint8Array(w * h);
    for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) {
      var i = y * w + x; if (!m[i] || lab[i]) continue;
      var st = [i], px = [], X0 = x, X1 = x, Y0 = y, Y1 = y; lab[i] = 1;
      while (st.length) {
        var p = st.pop(), u = p % w, v = (p / w) | 0; px.push(p);
        if (u < X0) X0 = u; if (u > X1) X1 = u; if (v < Y0) Y0 = v; if (v > Y1) Y1 = v;
        if (px.length > 40000) continue;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var a = u + dx, b = v + dy; if (a < x0 || b < y0 || a >= x1 || b >= y1) continue;
          var q = b * w + a; if (m[q] && !lab[q]) { lab[q] = 1; st.push(q); }
        }
      }
      f({ px: px, x0: X0, y0: Y0, x1: X1, y1: Y1, w: X1 - X0 + 1, h: Y1 - Y0 + 1 });
    }
  }
  // Шаблон: маска значка в рамке; поиск — IoU шаблона с маской цвета в окне, по интегральному изображению отсев
  function crop(m, w, c) {
    var t = new Uint8Array(c.w * c.h), n = 0;
    for (var y = 0; y < c.h; y++) for (var x = 0; x < c.w; x++) if (m[(c.y0 + y) * w + c.x0 + x]) { t[y * c.w + x] = 1; n++; }
    return { t: t, w: c.w, h: c.h, n: n };
  }
  function rot90(T) { var o = new Uint8Array(T.w * T.h); for (var y = 0; y < T.h; y++) for (var x = 0; x < T.w; x++) o[x * T.h + (T.h - 1 - y)] = T.t[y * T.w + x]; return { t: o, w: T.h, h: T.w, n: T.n }; }
  function integral(m, w, h) { var S = new Int32Array((w + 1) * (h + 1)); for (var y = 0; y < h; y++) { var row = 0; for (var x = 0; x < w; x++) { row += m[y * w + x]; S[(y + 1) * (w + 1) + x + 1] = S[y * (w + 1) + x + 1] + row; } } return S; }
  function dilate(m, w, h) {
    var o = new Uint8Array(w * h);
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (m[y * w + x]) for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { var X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < w && Y < h) o[Y * w + X] = 1; }
    return o;
  }
  // Совпадение с допуском 1 px: какая доля шаблона нашлась рядом (полнота) и какая доля найденного легла на шаблон
  // (точность), итог — их среднее гармоническое. Значки, перечёркнутые линиями по-разному, так находятся надёжнее
  function match(m, w, h, tpls, minF) {
    var S = integral(m, w, h), W1 = w + 1, hits = [], md = dilate(m, w, h);
    tpls.forEach(function (T) {
      var tw = T.w, th = T.h, td = dilate(T.t, tw, th), bw = Math.max(3, Math.round(0.35 * Math.max(tw, th)));
      var st = tw * th > 900 ? 2 : 1; // крупный шаблон — шаг 2 px, точность хватает
      for (var y = 0; y + th <= h; y += st) for (var x = 0; x + tw <= w; x += st) {
        var n = S[(y + th) * W1 + x + tw] - S[y * W1 + x + tw] - S[(y + th) * W1 + x] + S[y * W1 + x];
        if (n < 0.45 * T.n || n > 2.2 * T.n) continue;
        // значок стоит отдельно: в кольце вокруг почти нет того же цвета (иначе это кусок линии подсветки или заливки)
        var bx0 = Math.max(0, x - bw), by0 = Math.max(0, y - bw), bx1 = Math.min(w, x + tw + bw), by1 = Math.min(h, y + th + bw);
        var ring = S[by1 * W1 + bx1] - S[by0 * W1 + bx1] - S[by1 * W1 + bx0] + S[by0 * W1 + bx0] - n, ra = (bx1 - bx0) * (by1 - by0) - tw * th;
        if (ring > 0.12 * ra) continue;
        var rec = 0, pre = 0;
        for (var v = 0; v < th; v++) {
          var o = (y + v) * w + x, to = v * tw;
          for (var u = 0; u < tw; u++) { if (T.t[to + u] && md[o + u]) rec++; if (m[o + u] && td[to + u]) pre++; }
        }
        rec /= T.n; pre /= n;
        var f = 2 * rec * pre / (rec + pre || 1);
        if (f >= minF) hits.push({ x: x + tw / 2, y: y + th / 2, s: f, r: Math.max(tw, th) });
      }
    });
    hits.sort(function (a, b) { return b.s - a.s; });
    var out = [];
    hits.forEach(function (p) { if (!out.some(function (q) { return Math.hypot(q.x - p.x, q.y - p.y) < 0.8 * Math.max(p.r, q.r); })) out.push(p); });
    return out;
  }
  // Маска цвета значка. Цветной — по оттенку (тонкие линии со сглаживанием светлеют: красный → розовый),
  // серый или чёрный — по тёмности
  function colorMask(P, c) {
    var d = P.d, N = P.w * P.h, m = new Uint8Array(N), cs = Math.max(c[0], c[1], c[2]) - Math.min(c[0], c[1], c[2]), h0 = hueOf(c[0], c[1], c[2]);
    var lum = (c[0] + c[1] + c[2]) / 3, dark = Math.min(200, lum + 70);
    for (var i = 0; i < N; i++) {
      var r = d[4 * i], g = d[4 * i + 1], b = d[4 * i + 2], mx = Math.max(r, g, b), s = mx - Math.min(r, g, b);
      if (cs >= 40) { if (s < Math.max(30, cs * 0.3) || mx < 70) continue; var dh = Math.abs(hueOf(r, g, b) - h0); if (Math.min(dh, 360 - dh) <= 22) m[i] = 1; }
      else if (s < 40 && (r + g + b) / 3 < dark) m[i] = 1;
    }
    return m;
  }
  // Пунктир (шинопровод, лента) — цепочка из 3 и больше одинаковых кусков почти вплотную на одной линии; убираем.
  // Пары (двойной спот) и одиночные значки остаются
  function dropChains(hits, L) {
    var n = hits.length, par = hits.map(function (_, i) { return i; });
    function find(a) { while (par[a] !== a) a = par[a] = par[par[a]]; return a; }
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) if (Math.hypot(hits[i].x - hits[j].x, hits[i].y - hits[j].y) < 1.6 * L) par[find(i)] = find(j);
    var sz = {}; hits.forEach(function (_, i) { var r = find(i); sz[r] = (sz[r] || 0) + 1; });
    return hits.filter(function (_, i) { return sz[find(i)] < 3; });
  }
  function group(pts, T, color, kind) {
    return { pts: pts.map(function (p) { return [p.x, p.y]; }), w: T.w, h: T.h, color: color, kind: kind, tpl: T };
  }

  // Нажали на значок: цвет значка рядом с точкой нажатия → маска этого цвета → сам значок → все такие же
  function byClick(img, pt, ppm) {
    var P = full(img), w = P.w, h = P.h, d = P.d, R = Math.max(8, Math.round(0.35 * ppm)), r0 = Math.max(4, Math.round(0.1 * ppm));
    var cx = Math.round(pt[0]), cy = Math.round(pt[1]);
    // фон окна — самый частый цвет
    var hist = {}, best = null, bn = 0, x, y, i;
    for (y = Math.max(0, cy - R); y < Math.min(h, cy + R); y++) for (x = Math.max(0, cx - R); x < Math.min(w, cx + R); x++) {
      i = (y * w + x) * 4; var key = (d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4); hist[key] = (hist[key] || 0) + 1;
      if (hist[key] > bn) { bn = hist[key]; best = [d[i], d[i + 1], d[i + 2]]; }
    }
    // цвет значка — самый частый «не фон» около точки, ближе всего к нажатию
    var h2 = {}, sc = null, sn = 0;
    for (var rr = r0; rr <= R && !sc; rr += r0) {
      for (y = Math.max(0, cy - rr); y < Math.min(h, cy + rr); y++) for (x = Math.max(0, cx - rr); x < Math.min(w, cx + rr); x++) {
        i = (y * w + x) * 4; var dr = d[i] - best[0], dg = d[i + 1] - best[1], db = d[i + 2] - best[2];
        if (dr * dr + dg * dg + db * db < 50 * 50 || Math.min(d[i], d[i + 1], d[i + 2]) > 225) continue; // фон и белые подложки надписей
        var k2 = (d[i] >> 5) + ',' + (d[i + 1] >> 5) + ',' + (d[i + 2] >> 5); h2[k2] = h2[k2] || [0, 0, 0, 0]; var e = h2[k2]; e[0]++; e[1] += d[i]; e[2] += d[i + 1]; e[3] += d[i + 2];
      }
      for (var k3 in h2) { var q = h2[k3], cs = Math.max(q[1], q[2], q[3]) - Math.min(q[1], q[2], q[3]); var wgt = q[0] * (cs / q[0] > 40 ? 5 : 1); if (wgt > sn) { sn = wgt; sc = [q[1] / q[0], q[2] / q[0], q[3] / q[0]]; } }
    }
    if (!sc) return null;
    var m = colorMask(P, sc);
    // сам значок — область маски у точки нажатия в пределах окна; разрывы (размерная линия поверх значка)
    // склеиваем расширением на 2 px, шаблон берём из исходной маски
    var X0 = Math.max(0, cx - R), Y0 = Math.max(0, cy - R), X1 = Math.min(w, cx + R), Y1 = Math.min(h, cy + R), md = new Uint8Array(w * h);
    for (y = Y0; y < Y1; y++) for (x = X0; x < X1; x++) {
      if (!m[y * w + x]) continue;
      for (var ey = Math.max(Y0, y - 2); ey <= Math.min(Y1 - 1, y + 2); ey++) for (var ex = Math.max(X0, x - 2); ex <= Math.min(X1 - 1, x + 2); ex++) md[ey * w + ex] = 1;
    }
    var cand = null, cd = 1e9;
    comps(md, w, h, function (c) {
      if (c.w < 5 || c.h < 5) return;
      var dx = Math.max(c.x0 - cx, 0, cx - c.x1), dy = Math.max(c.y0 - cy, 0, cy - c.y1), dd = Math.hypot(dx, dy);
      if (dd < cd) { cd = dd; cand = c; }
    }, X0, Y0, X1, Y1);
    if (!cand || cd > r0 * 2) return null;
    // рамку — по исходной маске (без 2 px расширения)
    var bx0 = cand.x1, by0 = cand.y1, bx1 = cand.x0, by1 = cand.y0;
    for (y = cand.y0; y <= cand.y1; y++) for (x = cand.x0; x <= cand.x1; x++) if (m[y * w + x] && md[y * w + x]) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
    if (bx1 < bx0) return null;
    cand = { x0: bx0, y0: by0, x1: bx1, y1: by1, w: bx1 - bx0 + 1, h: by1 - by0 + 1 };
    if (cand.w > R * 1.9 || cand.h > R * 1.9) return null; // слилось с линией или заливкой — это не значок
    var T = crop(m, w, cand), tpls = [T]; if (T.w !== T.h) tpls.push(rot90(T));
    var hits = dropChains(match(m, w, h, tpls, 0.72), Math.max(T.w, T.h));
    return group(hits, T, sc, Math.sqrt(cand.w * cand.h) > 0.24 * ppm ? 'pendant' : 'spot'); // по площади: вытянутый спот не люстра
  }

  // Автоматически: компактные цветные значки тёплых оттенков (красный, оранжевый, розовый), повторяющиеся
  function auto(img, ppm) {
    var P = full(img), w = P.w, h = P.h, d = P.d, N = w * h, smin = 0.09 * ppm, smax = 1.4 * ppm, all = [];
    var bins = [[330, 30], [30, 60]]; // красно-розовый, оранжевый
    bins.forEach(function (bn) {
      var m = new Uint8Array(N), n = 0;
      for (var i = 0; i < N; i++) {
        var r = d[4 * i], g = d[4 * i + 1], b = d[4 * i + 2], mx = Math.max(r, g, b), sat = mx - Math.min(r, g, b);
        if (sat < 60 || mx < 110) continue;
        var hu = hueOf(r, g, b), inb = bn[0] > bn[1] ? hu >= bn[0] || hu < bn[1] : hu >= bn[0] && hu < bn[1];
        if (inb) { m[i] = 1; n++; }
      }
      if (n < 50) return;
      var cs = [];
      comps(m, w, h, function (c) {
        var L = Math.max(c.w, c.h); if (L < smin || L > smax || L / Math.max(1, Math.min(c.w, c.h)) > 3.5) return;
        var T = crop(m, w, c), sig = new Float32Array(144);
        for (var y = 0; y < 12; y++) for (var x = 0; x < 12; x++) sig[y * 12 + x] = T.t[Math.floor((y + 0.5) * T.h / 12) * T.w + Math.floor((x + 0.5) * T.w / 12)];
        cs.push({ c: c, T: T, sig: sig, x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 });
      });
      var groups = [];
      cs.forEach(function (a) {
        for (var j = 0; j < groups.length; j++) {
          var b = groups[j][0];
          if (Math.abs(a.c.w - b.c.w) > 0.3 * Math.max(a.c.w, b.c.w) || Math.abs(a.c.h - b.c.h) > 0.3 * Math.max(a.c.h, b.c.h)) continue;
          var mn = 0, mxs = 0; for (var q = 0; q < 144; q++) { mn += Math.min(a.sig[q], b.sig[q]); mxs += Math.max(a.sig[q], b.sig[q]); }
          if (mn / (mxs || 1) > 0.55) { groups[j].push(a); return; }
        }
        groups.push([a]);
      });
      groups.forEach(function (G) {
        var L = Math.max(G[0].c.w, G[0].c.h), big = Math.sqrt(G[0].c.w * G[0].c.h) > 0.24 * ppm;
        if (G.length < (big ? 1 : 3)) return;
        // пунктир (LED-лента) — у каждого куска такой же сосед совсем рядом
        var near = G.filter(function (a) { return G.some(function (b) { return b !== a && Math.hypot(a.x - b.x, a.y - b.y) < 2.2 * L; }); }).length;
        if (!big && near > 0.5 * G.length) return;
        var c0 = G[0].c.px[0], col = [d[4 * c0], d[4 * c0 + 1], d[4 * c0 + 2]];
        if (big) {
          // крупный значок (люстра) — по шаблону ищем такие же, в том числе перечёркнутые размерами; одиночка —
          // скорее заливка или подсветка
          var fill = G[0].T.n / (G[0].c.w * G[0].c.h), asp = Math.max(G[0].c.w, G[0].c.h) / Math.min(G[0].c.w, G[0].c.h);
          if (fill < 0.04 || fill > 0.6 || asp > 1.25) return;
          var hits = match(m, w, h, [G[0].T], 0.72);
          if (hits.length < 2 || hits.length > 10) return; // люстр в квартире немного; десятки одинаковых крупных — узор, не свет
          if (all.some(function (o) { return o.kind === 'pendant' && hits.filter(function (p) { return o.pts.some(function (q) { return Math.hypot(q[0] - p.x, q[1] - p.y) < L; }); }).length > hits.length / 2; })) return;
          all.push(group(hits, G[0].T, col, 'pendant'));
          return;
        }
        all.push(group(G.map(function (a) { return { x: a.x, y: a.y }; }), G[0].T, col, 'spot'));
      });
    });
    all.sort(function (a, b) { return b.pts.length - a.pts.length; });
    return all;
  }

  // Два листа одного проекта (обмерный и освещения) целиком: x_осв = s · x_обм + tx — по толстым стенам всего листа
  // Грубо — стены к стенам (края всего листа освещения сбивают: потолочные линии, значки, рамка тянут к себе),
  // точно — как register: стены обмерного к краям листа освещения рядом с найденным положением
  function ptDist(pts, k, w, h) {
    var D = new Float32Array(w * h), INF = 1e6, i, x, y;
    for (i = 0; i < w * h; i++) D[i] = INF;
    pts.forEach(function (p) { var u = Math.round(p[0] * k), v = Math.round(p[1] * k); if (u >= 0 && v >= 0 && u < w && v < h) D[v * w + u] = 0; });
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) { i = y * w + x; var a = D[i];
      if (x > 0) a = Math.min(a, D[i - 1] + 3); if (y > 0) { a = Math.min(a, D[i - w] + 3); if (x > 0) a = Math.min(a, D[i - w - 1] + 4); if (x < w - 1) a = Math.min(a, D[i - w + 1] + 4); } D[i] = a; }
    for (y = h - 1; y >= 0; y--) for (x = w - 1; x >= 0; x--) { i = y * w + x; var b = D[i];
      if (x < w - 1) b = Math.min(b, D[i + 1] + 3); if (y < h - 1) { b = Math.min(b, D[i + w] + 3); if (x < w - 1) b = Math.min(b, D[i + w + 1] + 4); if (x > 0) b = Math.min(b, D[i + w - 1] + 4); } D[i] = b; }
    for (i = 0; i < w * h; i++) D[i] /= 3;
    return { D: D, w: w, h: h, k: k };
  }
  function sheets(src, img) {
    var A = wallPts(src, 500, [], 1, 6000), Bp = wallPts(img, 500, [], 1, 6000);
    if (A.length < 50 || Bp.length < 50) return null;
    var base = img.width / src.width, Wc = 250, kI = Wc / Math.max(img.width, img.height), E = ptDist(Bp, kI, Math.round(img.width * kI), Math.round(img.height * kI));
    var kc = kI * base, pts = mix(A.filter(function (_, i) { return i % 3 === 0; }).map(function (p) { return [p[0] * kc, p[1] * kc]; }), []), best = 1e9, B = null, bx = 0, by = 0;
    pts.forEach(function (p) { bx = Math.max(bx, p[0]); by = Math.max(by, p[1]); });
    for (var s = 0.6; s <= 1.62; s += 0.02)
      for (var tx = -Math.round(bx * s); tx <= E.w; tx += 2)
        for (var ty = -Math.round(by * s); ty <= E.h; ty += 2) {
          var sc = chamfer(E, pts, s, tx, ty, 6, 40, best);
          if (sc < best) { best = sc; B = [s, tx, ty]; }
        }
    if (!B) return null;
    // обратная проверка: стены листа освещения к стенам обмерного (чужой лист даёт большой промах)
    var kS = Wc / Math.max(src.width, src.height), EA = ptDist(A, kS, Math.round(src.width * kS), Math.round(src.height * kS)), rv = 0, rn = 0;
    Bp.forEach(function (p) { var x = ((p[0] * kI - B[1]) / B[0]) / kc * kS, y = ((p[1] * kI - B[2]) / B[0]) / kc * kS; x = Math.round(x); y = Math.round(y);
      if (x >= 0 && y >= 0 && x < EA.w && y < EA.h) { rv += Math.min(6, EA.D[y * EA.w + x]); rn++; } });
    var Wf = 1000, F = edgeDist(img, Wf), kf = F.k * base, pf = mix(A.map(function (p) { return [p[0] * kf, p[1] * kf]; }), []), r = Wf / Wc, bf = 1e9, R = null;
    for (var s2 = B[0] - 0.03; s2 <= B[0] + 0.031; s2 += 0.005)
      for (var tx2 = Math.round(B[1] * r) - 12; tx2 <= Math.round(B[1] * r) + 12; tx2++)
        for (var ty2 = Math.round(B[2] * r) - 12; ty2 <= Math.round(B[2] * r) + 12; ty2++) {
          var sf = chamfer(F, pf, s2, tx2, ty2, 10, 80, bf);
          if (sf < bf) { bf = sf; R = [s2, tx2, ty2]; }
        }
    return { s: R[0] * base, tx: R[1] / F.k, ty: R[2] / F.k, score: bf, fwd: best, rev: rn ? rv / rn : 6 };
  }
  window.MLPFix = { register: register, sheets: sheets, auto: auto, byClick: byClick, _: { edgeDist: edgeDist } };
})();

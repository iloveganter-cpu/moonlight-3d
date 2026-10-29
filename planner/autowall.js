/* Moonlight: планировщик освещения — поиск стен комнаты на картинке плана.
   Клиент нажимает внутри комнаты, ищем её контур по внутренней стороне стен:
   1) выравниваем картинку по главному направлению линий (фото бывает повёрнуто);
   2) тёмное = стены и линии; тонкие линии (мебель, надписи, размеры) пробуем убрать открытием;
   3) расстояние до стен → «водораздел»: пространства, соединённые узко (дверь, окно), — разные комнаты,
      соединённые широко (Г-образная комната, проём-арка) — одна;
   4) дверные проёмы закрываем квадратным открытием — срез ровно по линии стены, углы остаются прямыми;
   5) контур по границе пикселей → упрощение → стены по осям.
   window.MLPAutoWall.detect(canvas, [x, y]) → { pts: [[x, y]…] в пикселях картинки, axis } или { error }. */
(function () {
  'use strict';
  var MAXW = 1000;

  // ---------- Картинка → серое, выравнивание ----------
  function grayOf(img, k) {
    var w = Math.max(1, Math.round(img.width * k)), h = Math.max(1, Math.round(img.height * k));
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h);
    var d = x.getImageData(0, 0, w, h).data, g = new Uint8Array(w * h);
    for (var i = 0; i < w * h; i++) g[i] = (d[4 * i] * 77 + d[4 * i + 1] * 150 + d[4 * i + 2] * 29) >> 8;
    return { g: g, w: w, h: h, d: d };
  }
  // Комнаты залиты своим цветом (бледно-голубым и т. п.), а стены — белые с тонкой светлой штриховкой: тёмная
  // и светлая маски таких стен не видят. Стена = всё, что не цвета заливки под кликом. null — заливки нет
  // (под кликом бумага, или такого цвета на плане почти нет)
  function fillMask(G0, s) {
    var w = G0.w, h = G0.h, d = G0.d, x, y, i, W = {}, c = null, cn = 0;
    var sx = Math.round(s[0]), sy = Math.round(s[1]), r = Math.round(Math.max(w, h) / 40);
    // кликают обычно по подписи площади, а она на белой плашке — цвет заливки ищем вокруг, чисто белое не в счёт
    for (y = sy - r; y <= sy + r; y++) for (x = sx - r; x <= sx + r; x++) {
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      i = y * w + x; if (G0.g[i] < 200) continue; // буквы и линии
      if (d[4 * i] > 253 && d[4 * i + 1] > 253 && d[4 * i + 2] > 253) continue;
      var key0 = d[4 * i] + ',' + d[4 * i + 1] + ',' + d[4 * i + 2]; W[key0] = (W[key0] || 0) + 1;
      if (W[key0] > cn) { cn = W[key0]; c = [d[4 * i], d[4 * i + 1], d[4 * i + 2]]; }
    }
    if (!c || cn < 0.2 * r * r) return null;
    // бумага — самый частый светлый цвет вне заливки; заливка должна отличаться от неё хотя бы на 3
    var hist = {}, top = null, tn = 0;
    for (i = 0; i < w * h; i += 7) { var key = (d[4 * i] >> 1) + ',' + (d[4 * i + 1] >> 1) + ',' + (d[4 * i + 2] >> 1); hist[key] = (hist[key] || 0) + 1; }
    var near = function (r, g, b, tol) { return Math.abs(r - c[0]) <= tol && Math.abs(g - c[1]) <= tol && Math.abs(b - c[2]) <= tol; };
    for (var k in hist) {
      var p = k.split(',').map(function (v) { return 2 * v; });
      if (p[0] + p[1] + p[2] > 690 && !near(p[0], p[1], p[2], 2) && hist[k] > tn) { tn = hist[k]; top = p; }
    }
    var dist = top ? Math.max(Math.abs(top[0] - c[0]), Math.abs(top[1] - c[1]), Math.abs(top[2] - c[2])) : 255;
    if (dist < 3) return null;
    var tol = Math.max(1, Math.min(12, Math.floor(dist / 2))), g = new Uint8Array(w * h), n = 0;
    for (i = 0; i < w * h; i++) if (near(d[4 * i], d[4 * i + 1], d[4 * i + 2], tol)) { g[i] = 255; n++; }
    if (n < 0.02 * w * h) return null;
    return { g: g, w: w, h: h };
  }
  // Главное направление линий (по модулю 90°) — гистограмма направлений градиента
  function boxBlur(g, w, h, r) { // два прохода «скользящего среднего» по строкам и столбцам
    var a = new Float32Array(w * h), b = new Float32Array(w * h), x, y, s, n = 2 * r + 1;
    for (y = 0; y < h; y++) { s = 0; for (x = -r; x <= r; x++) s += g[y * w + Math.min(w - 1, Math.max(0, x))]; for (x = 0; x < w; x++) { a[y * w + x] = s / n; s += g[y * w + Math.min(w - 1, x + r + 1)] - g[y * w + Math.max(0, x - r)]; } }
    for (x = 0; x < w; x++) { s = 0; for (y = -r; y <= r; y++) s += a[Math.min(h - 1, Math.max(0, y)) * w + x]; for (y = 0; y < h; y++) { b[y * w + x] = s / n; s += a[Math.min(h - 1, y + r + 1) * w + x] - a[Math.max(0, y - r) * w + x]; } }
    return b;
  }
  // по размытой картинке: мелкая штриховка стен (обычно под 45°) и надписи не перетягивают направление
  function skewOf(G) {
    var w = G.w, h = G.h, B = 180, hist = new Float64Array(B), g = boxBlur(G.g, w, h, Math.max(2, Math.round(Math.max(w, h) / 300)));
    for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) {
      var i = y * w + x;
      var gx = g[i - w + 1] + 2 * g[i + 1] + g[i + w + 1] - g[i - w - 1] - 2 * g[i - 1] - g[i + w - 1];
      var gy = g[i + w - 1] + 2 * g[i + w] + g[i + w + 1] - g[i - w - 1] - 2 * g[i - w] - g[i - w + 1];
      var m = Math.abs(gx) + Math.abs(gy); if (m < 24) continue;
      var a = Math.atan2(gy, gx), q = ((a % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2); // 0..90°
      hist[Math.floor(q / (Math.PI / 2) * B) % B] += m;
    }
    var best = 0, bv = -1;
    for (var b = 0; b < B; b++) { var s = 0; for (var j = -2; j <= 2; j++) s += hist[(b + j + B) % B] * (3 - Math.abs(j)); if (s > bv) { bv = s; best = b; } }
    // уточняем по соседним корзинам
    var l = hist[(best - 1 + B) % B], c0 = hist[best], r = hist[(best + 1) % B], dd = l - 2 * c0 + r, off = dd < 0 ? 0.5 * (l - r) / dd : 0;
    var ang = (best + 0.5 + off) / B * Math.PI / 2;
    return ang > Math.PI / 4 ? ang - Math.PI / 2 : ang; // ±45°
  }
  // Уточнение наклона: при точном повороте стены ложатся в строки и столбцы — проекции тёмного самые «резкие»
  function refineSkew(G, a0) {
    var m = darkMask(G), w = G.w, h = G.h, X = [], Y = [], i, step = 1;
    var n = 0; for (i = 0; i < w * h; i++) if (m[i]) n++;
    step = Math.max(1, Math.round(n / 150000));
    for (i = 0, n = 0; i < w * h; i++) if (m[i] && (n++ % step === 0)) { X.push(i % w - w / 2); Y.push(((i / w) | 0) - h / 2); }
    var L = Math.ceil(Math.hypot(w, h)) + 4, hu = new Float64Array(L), hv = new Float64Array(L);
    function score(a) {
      var c = Math.cos(a), s = Math.sin(a), sc = 0, j; hu.fill(0); hv.fill(0);
      for (j = 0; j < X.length; j++) { hu[(X[j] * c + Y[j] * s + L / 2) | 0]++; hv[(-X[j] * s + Y[j] * c + L / 2) | 0]++; }
      for (j = 0; j < L; j++) sc += hu[j] * hu[j] + hv[j] * hv[j];
      return sc;
    }
    if (X.length < 50) return a0;
    var best = a0, bs = -1, D2R = Math.PI / 180, d;
    for (d = -3; d <= 3.001; d += 0.1) { var v = score(a0 + d * D2R); if (v > bs) { bs = v; best = a0 + d * D2R; } }
    var b2 = best;
    for (d = -0.1; d <= 0.1001; d += 0.02) { v = score(b2 + d * D2R); if (v > bs) { bs = v; best = b2 + d * D2R; } }
    return best;
  }
  function rotP(p, a, c) { var co = Math.cos(a), s = Math.sin(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co + y * s, c[1] - x * s + y * co]; } // поворот на −a
  function unrotP(p, a, c) { var co = Math.cos(a), s = Math.sin(a), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * s, c[1] + x * s + y * co]; }
  function deskew(G, a) {
    if (Math.abs(a) < 0.004) return G;
    var w = G.w, h = G.h, g = G.g, o = new Uint8Array(w * h), oob = new Uint8Array(w * h), c = [w / 2, h / 2];
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      var p = unrotP([x + 0.5, y + 0.5], a, c), px = p[0] - 0.5, py = p[1] - 0.5, x0 = Math.floor(px), y0 = Math.floor(py);
      if (x0 < 0 || y0 < 0 || x0 >= w - 1 || y0 >= h - 1) { o[y * w + x] = 255; oob[y * w + x] = 1; continue; } // за краем исходной картинки
      var fx = px - x0, fy = py - y0, i = y0 * w + x0;
      o[y * w + x] = (g[i] * (1 - fx) + g[i + 1] * fx) * (1 - fy) + (g[i + w] * (1 - fx) + g[i + w + 1] * fx) * fy;
    }
    return { g: o, w: w, h: h, oob: oob };
  }

  // ---------- Маски ----------
  // Тёмное относительно местного фона (неровный свет на фото)
  function darkMask(G) {
    var w = G.w, h = G.h, g = G.g, R = Math.max(8, Math.round(Math.max(w, h) / 40)), S = new Float64Array((w + 1) * (h + 1)), m = new Uint8Array(w * h);
    for (var y = 0; y < h; y++) { var row = 0; for (var x = 0; x < w; x++) { row += g[y * w + x]; S[(y + 1) * (w + 1) + x + 1] = S[y * (w + 1) + x + 1] + row; } }
    for (y = 0; y < h; y++) {
      var y0 = Math.max(0, y - R), y1 = Math.min(h, y + R + 1);
      for (x = 0; x < w; x++) {
        var x0 = Math.max(0, x - R), x1 = Math.min(w, x + R + 1), n = (y1 - y0) * (x1 - x0);
        var bg = (S[y1 * (w + 1) + x1] - S[y0 * (w + 1) + x1] - S[y1 * (w + 1) + x0] + S[y0 * (w + 1) + x0]) / n;
        var v = g[y * w + x]; m[y * w + x] = v < 215 && v < bg - Math.max(18, bg * 0.16) ? 1 : 0;
      }
    }
    return m;
  }
  // Светлые стены: бледная заливка или частая тонкая штриховка (после уменьшения — ровный светло-серый).
  // Порог по размытой картинке: стена ≈ 225, подкраска комнат в цвет ≈ 245, бумага 255
  function tintMask(G) {
    var w = G.w, h = G.h, b = boxBlur(G.g, w, h, 1), m = new Uint8Array(w * h), hist = new Int32Array(256), i, n = 0, paper = 255;
    for (i = 0; i < w * h; i++) hist[G.g[i]]++;
    for (i = 255; i >= 0; i--) { n += hist[i]; if (n > 0.3 * w * h) { paper = i; break; } }
    var thr = Math.min(236, paper - 16);
    for (i = 0; i < w * h; i++) m[i] = b[i] < thr ? 1 : 0;
    return m; // размытие раздувает стены на пиксель — найденную комнату потом расширяем обратно (grow1)
  }
  // Шахматное расстояние (L∞) до ближайшего пикселя, где m = 0; за краем картинки — «стена нет»
  function cheb(m, w, h, edge) {
    var d = new Int32Array(w * h), INF = 1 << 28, x, y, i, v;
    for (i = 0; i < w * h; i++) d[i] = m[i] ? INF : 0;
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) {
      i = y * w + x; if (!d[i]) continue; v = d[i];
      var e = edge ? 1 : INF;
      v = Math.min(v, x > 0 ? d[i - 1] + 1 : e, y > 0 ? d[i - w] + 1 : e, x > 0 && y > 0 ? d[i - w - 1] + 1 : e, x < w - 1 && y > 0 ? d[i - w + 1] + 1 : e);
      d[i] = v;
    }
    for (y = h - 1; y >= 0; y--) for (x = w - 1; x >= 0; x--) {
      i = y * w + x; if (!d[i]) continue; v = d[i];
      var e2 = edge ? 1 : INF;
      v = Math.min(v, x < w - 1 ? d[i + 1] + 1 : e2, y < h - 1 ? d[i + w] + 1 : e2, x < w - 1 && y < h - 1 ? d[i + w + 1] + 1 : e2, x > 0 && y < h - 1 ? d[i + w - 1] + 1 : e2);
      d[i] = v;
    }
    return d;
  }
  // Открытие квадратом радиуса t: убирает линии тоньше 2t+1
  function openMask(m, w, h, t) {
    if (!t) return m;
    var d = cheb(m, w, h, true), er = new Uint8Array(w * h), i;
    for (i = 0; i < w * h; i++) er[i] = d[i] > t ? 1 : 0;
    // расширение: пиксели в пределах t от уцелевших
    var inv = new Uint8Array(w * h); for (i = 0; i < w * h; i++) inv[i] = er[i] ? 0 : 1;
    var d2 = cheb(inv, w, h, false), o = new Uint8Array(w * h);
    for (i = 0; i < w * h; i++) o[i] = d2[i] <= t ? 1 : 0;
    return o;
  }
  // Отдельные мелкие пятна (буквы, цифры, значки, остатки надписей) стенами не считаем — иначе посреди комнаты
  // появляются «колонны» и комната делится. После снятия тонких линий оставляем только толстое (стены толще t+2).
  function filterWalls(W, w, h, t, frac) {
    var N = w * h, lab = new Int32Array(N), out = new Uint8Array(N), dep = t ? cheb(W, w, h, true) : null, minSide = Math.max(6, frac * Math.max(w, h));
    for (var i = 0; i < N; i++) {
      if (!W[i] || lab[i]) continue;
      var st = [i], comp = [], x0 = w, x1 = 0, y0 = h, y1 = 0, md = 0; lab[i] = 1;
      while (st.length) {
        var p = st.pop(), px = p % w, py = (p / w) | 0; comp.push(p);
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; if (dep && dep[p] > md) md = dep[p];
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var X = px + dx, Y = py + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
          var q = Y * w + X; if (W[q] && !lab[q]) { lab[q] = 1; st.push(q); }
        }
      }
      if (Math.max(x1 - x0, y1 - y0) + 1 < minSide || (dep && md < t + 3)) continue;
      for (var k = 0; k < comp.length; k++) out[comp[k]] = 1;
    }
    return out;
  }
  // Толщина «мусорных» тонких линий: при каком t перестаёт резко убывать тёмная масса
  function thinT(D, w, h) {
    var d = cheb(D, w, h, true), cnt = [0, 0, 0, 0, 0, 0, 0, 0], i;
    for (i = 0; i < w * h; i++) if (d[i]) for (var t = 0; t < 8 && d[i] > t; t++) cnt[t]++;
    // cnt[t] — тёмные пиксели, глубже t от края штриха (эрозия). Ищем первое t, после которого убыль замедляется
    for (t = 1; t < 6; t++) if (cnt[t] && cnt[t + 1] / cnt[t] > 0.72) return t;
    return 0;
  }

  // Буквы, цифры, значки: мелкие пятна в стороне от крупных линий. Мелкое, но примыкающее к крупному
  // (штрихи штриховки в толще стены, рамы окон) оставляем
  function dropText(m, w, h) {
    var big = filterWalls(m, w, h, 0, 0.025), N = w * h, inv = new Uint8Array(N), i;
    for (i = 0; i < N; i++) inv[i] = big[i] ? 0 : 1;
    var d = cheb(inv, w, h, false), lab = new Uint8Array(N), out = big.slice();
    for (i = 0; i < N; i++) {
      if (!m[i] || big[i] || lab[i]) continue;
      var st = [i], comp = [], near = false; lab[i] = 1;
      while (st.length) {
        var p = st.pop(), px = p % w, py = (p / w) | 0; comp.push(p); if (d[p] <= 2) near = true;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var X = px + dx, Y = py + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
          var q = Y * w + X; if (m[q] && !big[q] && !lab[q]) { lab[q] = 1; st.push(q); }
        }
      }
      if (near) for (var k = 0; k < comp.length; k++) out[comp[k]] = 1;
    }
    return out;
  }

  // ---------- Комната вокруг точки ----------
  function room(Wm, w, h, seed0, ALPHA, oob) {
    var N = w * h, free = new Uint8Array(N), i;
    for (i = 0; i < N; i++) free[i] = Wm[i] ? 0 : 1;
    var D = cheb(free, w, h, false); // расстояние до стены; край картинки стеной не считаем
    for (i = 0; i < N; i++) if (D[i] > w + h) D[i] = w + h;
    var sx = Math.max(0, Math.min(w - 1, Math.round(seed0[0]))), sy = Math.max(0, Math.min(h - 1, Math.round(seed0[1]))), s = sy * w + sx;
    if (!D[s]) { // нажали на стену — ближайший свободный пиксель
      var best = -1, bd = 1e9;
      for (var yy = Math.max(0, sy - 40); yy < Math.min(h, sy + 41); yy++) for (var xx = Math.max(0, sx - 40); xx < Math.min(w, sx + 41); xx++) {
        var j = yy * w + xx, dd = (xx - sx) * (xx - sx) + (yy - sy) * (yy - sy); if (D[j] && dd < bd) { bd = dd; best = j; }
      }
      if (best < 0) return null; s = best;
    }
    // подъём к местному максимуму — «середина» пространства, где нажали
    for (;;) {
      var x = s % w, y = (s / w) | 0, nb = s;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var X = x + dx, Y = y + dy; if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        if (D[Y * w + X] > D[nb]) nb = Y * w + X;
      }
      if (nb === s) break; s = nb;
    }
    // Заливка по убыванию расстояния (union-find): соединение на уровне lev двух частей с вершинами m1 ≥ m2
    // считаем одной комнатой, если lev ≥ ALPHA·m2 (широкий проход), иначе это дверь/окно между комнатами
    var maxD = 0; for (i = 0; i < N; i++) if (D[i] > maxD) maxD = D[i];
    var cnt = new Int32Array(maxD + 2); for (i = 0; i < N; i++) if (D[i]) cnt[D[i]]++;
    var start = new Int32Array(maxD + 2); for (var l = maxD - 1; l >= 1; l--) start[l] = start[l + 1] + cnt[l + 1];
    var order = new Int32Array(N), pos = start.slice(); for (i = 0; i < N; i++) if (D[i]) order[pos[D[i]]++] = i;
    var total = start[1] + cnt[1];
    var par = new Int32Array(N).fill(-1), top = new Int32Array(N), rej = [];
    function find(a) { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; }
    for (var k = 0; k < total; k++) {
      var p = order[k], lev = D[p], px = p % w, py = (p / w) | 0; par[p] = p; top[p] = lev;
      for (var n = 0; n < 4; n++) {
        var qx = px + (n === 0 ? -1 : n === 1 ? 1 : 0), qy = py + (n === 2 ? -1 : n === 3 ? 1 : 0);
        if (qx < 0 || qy < 0 || qx >= w || qy >= h) continue;
        var q = qy * w + qx; if (par[q] < 0) continue;
        var ra = find(p), rb = find(q); if (ra === rb) continue;
        var m2 = Math.min(top[ra], top[rb]);
        if (m2 <= 3 || lev >= ALPHA * m2) { par[rb] = ra; top[ra] = Math.max(top[ra], top[rb]); }
        else rej.push(lev, p, q);
      }
    }
    var R = find(s), reg = new Uint8Array(N), E = [], rArea = 0;
    for (i = 0; i < N; i++) if (par[i] >= 0 && find(i) === R) { reg[i] = 1; rArea++; }
    for (k = 0; k < rej.length; k += 3) if (reg[rej[k + 1]] !== reg[rej[k + 2]]) E.push([rej[k], rej[k + 1]]);
    // Проёмы (двери, окна) — места, где комната соединена с соседним пространством узко. Водораздел делит
    // пространство у проёма как попало, поэтому закрываем каждый проём виртуальной стенкой от косяка до косяка
    // по грани стены со стороны комнаты и заново заливаем от точки нажатия.
    E.sort(function (a, b) { return b[0] - a[0]; });
    var acc = [];
    E.forEach(function (e) {
      var l = e[0], zx = e[1] % w, zy = (e[1] / w) | 0;
      if (acc.some(function (a) { return Math.abs(a[1] - zx) <= a[0] + 2 && Math.abs(a[2] - zy) <= a[0] + 2; })) return;
      acc.push([l, zx, zy]);
    });
    var W2 = new Uint8Array(N); for (i = 0; i < N; i++) W2[i] = D[i] ? 0 : 1;
    function run(x, y, dx, dy, max) { // сколько свободных пикселей подряд в направлении; край картинки — «открыто»
      for (var t = 1; t <= max; t++) { var X = x + dx * t, Y = y + dy * t; if (X < 0 || Y < 0 || X >= w || Y >= h) return max; if (W2[Y * w + X]) return t - 1; }
      return max;
    }
    // длины свободных отрезков по горизонтали и вертикали через каждый пиксель: поперечник проёма = меньшая
    var RH = new Int32Array(N), RV = new Int32Array(N), x4, y4, b4;
    for (y4 = 0; y4 < h; y4++) for (x4 = 0; x4 < w;) { if (W2[y4 * w + x4]) { x4++; continue; } b4 = x4; while (x4 < w && !W2[y4 * w + x4]) x4++; for (var z4 = b4; z4 < x4; z4++) RH[y4 * w + z4] = b4 === 0 || x4 === w ? 1e6 : x4 - b4; }
    for (x4 = 0; x4 < w; x4++) for (y4 = 0; y4 < h;) { if (W2[y4 * w + x4]) { y4++; continue; } b4 = y4; while (y4 < h && !W2[y4 * w + x4]) y4++; for (z4 = b4; z4 < y4; z4++) RV[z4 * w + x4] = b4 === 0 || y4 === h ? 1e6 : y4 - b4; }
    var closed = 0, clipped = false;
    acc.forEach(function (a) {
      var l = a[0], zx = a[1], zy = a[2], M = 4 * l + 12;
      // точка встречи на водоразделе бывает в стороне от проёма — ищем рядом самое узкое место на гребне
      var bx = -1, by = -1, bv = 2 * l + 5, bd = 1e9, rr = 3 * l + 6;
      for (var yy = Math.max(0, zy - rr); yy <= Math.min(h - 1, zy + rr); yy++) for (var xx = Math.max(0, zx - rr); xx <= Math.min(w - 1, zx + rr); xx++) {
        var ii = yy * w + xx; if (D[ii] < l - 1 || D[ii] > l + 1) continue;
        var cs = Math.min(RH[ii], RV[ii]), dd = (xx - zx) * (xx - zx) + (yy - zy) * (yy - zy);
        if (cs < bv || (cs === bv && dd < bd)) { bv = cs; bd = dd; bx = xx; by = yy; }
      }
      if (bx < 0) return; zx = bx; zy = by;
      var hl = run(zx, zy, -1, 0, M), hr = run(zx, zy, 1, 0, M), vu = run(zx, zy, 0, -1, M), vd = run(zx, zy, 0, 1, M);
      var wh = hl + hr + 1, wv = vu + vd + 1, cx = wh <= wv ? 1 : 0, cy = 1 - cx, px = cy, py = cx; // c — поперёк проёма, p — вдоль прохода
      var wc = Math.min(wh, wv); if (wc > 2 * l + 5) return;
      var face = [0, 0], inR = [false, false];
      [1, -1].forEach(function (sg, j) {
        var t = 0;
        for (var u = 1; u <= M; u++) {
          var X = zx + sg * u * px, Y = zy + sg * u * py; if (X < 0 || Y < 0 || X >= w || Y >= h || W2[Y * w + X]) break;
          if (run(X, Y, -cx, -cy, wc + 6) + run(X, Y, cx, cy, wc + 6) + 1 > wc + 4) break;
          t = u;
        }
        face[j] = t;
        // за гранью — глубина комнаты: пиксели дальше l от стен водораздел относит к своей части надёжно
        for (var v = t + 2; v <= t + 3 * l + 6; v++) {
          var X2 = zx + sg * v * px, Y2 = zy + sg * v * py; if (X2 < 0 || Y2 < 0 || X2 >= w || Y2 >= h || W2[Y2 * w + X2]) break;
          if (D[Y2 * w + X2] > l) { inR[j] = !!reg[Y2 * w + X2]; break; }
        }
      });
      var j = inR[0] && !inR[1] ? 0 : inR[1] && !inR[0] ? 1 : -1, sg = j === 1 ? -1 : 1, t = j < 0 ? 0 : face[j];
      var X = zx + sg * t * px, Y = zy + sg * t * py, A = run(X, Y, -cx, -cy, wc + 6), B = run(X, Y, cx, cy, wc + 6);
      for (var u = -A - 1; u <= B + 1; u++) {
        var X3 = X + u * cx, Y3 = Y + u * cy; if (X3 < 0 || Y3 < 0 || X3 >= w || Y3 >= h) continue;
        W2[Y3 * w + X3] = 1;
        // «проём» по краю картинки — комната обрезана краем, а не дверь
        if (X3 <= 1 || Y3 <= 1 || X3 >= w - 2 || Y3 >= h - 2 || (oob && (oob[Y3 * w + X3] || oob[Math.max(0, Y3 - 2) * w + X3] || oob[Math.min(h - 1, Y3 + 2) * w + X3] || oob[Y3 * w + Math.max(0, X3 - 2)] || oob[Y3 * w + Math.min(w - 1, X3 + 2)]))) clipped = true;
      }
      closed++;
    });
    // заливка от точки нажатия
    var keep = new Uint8Array(N), st = [s], area = 1; keep[s] = 1;
    while (st.length) {
      var c = st.pop(), qx2 = c % w, qy2 = (c / w) | 0;
      for (n = 0; n < 4; n++) {
        var ex = qx2 + (n === 0 ? -1 : n === 1 ? 1 : 0), ey = qy2 + (n === 2 ? -1 : n === 3 ? 1 : 0);
        if (ex < 0 || ey < 0 || ex >= w || ey >= h) continue;
        var e2 = ey * w + ex; if (keep[e2] || W2[e2]) continue;
        keep[e2] = 1; st.push(e2); area++;
      }
    }
    // какой-то проём не закрылся и залили соседей — тогда берём комнату по водоразделу
    if (area > 1.5 * rArea + 200) keep = reg;
    return { reg: keep, clipped: clipped, sDoor: acc.length ? acc[0][0] : 0, doors: acc.length, closed: closed, fallback: keep === reg, seed: s, top: D[s] };
  }
  // Дыры (мебель, надписи внутри) заливаем; касание края картинки = «вытекли наружу»
  function solid(reg, w, h, oob) {
    var N = w * h, out = new Uint8Array(N), st = [], i, area = 0, edge = false;
    for (var x = 0; x < w; x++) { st.push(x, (h - 1) * w + x); }
    for (var y = 0; y < h; y++) { st.push(y * w, y * w + w - 1); }
    for (i = 0; i < N; i++) if (reg[i] && (i < w || i >= N - w || i % w === 0 || i % w === w - 1 || (oob && (oob[i - 1] || oob[i + 1] || oob[i - w] || oob[i + w])))) edge = true;
    while (st.length) {
      var p = st.pop(); if (out[p] || reg[p]) continue; out[p] = 1;
      var px = p % w, py = (p / w) | 0;
      if (px > 0) st.push(p - 1); if (px < w - 1) st.push(p + 1); if (py > 0) st.push(p - w); if (py < h - 1) st.push(p + w);
    }
    var r = new Uint8Array(N); for (i = 0; i < N; i++) if (!out[i]) { r[i] = 1; area++; }
    return { m: r, area: area, edge: edge };
  }

  // ---------- Контур ----------
  // Обход по рёбрам пикселей, область справа; только точки поворота
  function contour(m, w, h) {
    function at(x, y) { return x >= 0 && y >= 0 && x < w && y < h && m[y * w + x]; }
    var s = -1; for (var i = 0; i < w * h; i++) if (m[i]) { s = i; break; } if (s < 0) return [];
    var x0 = s % w, y0 = (s / w) | 0, x = x0, y = y0, dx = 1, dy = 0, pts = [], guard = 4 * w * h;
    do {
      x += dx; y += dy;
      var Rx, Ry, Lx, Ly;
      if (dx === 1) { Rx = x; Ry = y; Lx = x; Ly = y - 1; }
      else if (dy === 1) { Rx = x - 1; Ry = y; Lx = x; Ly = y; }
      else if (dx === -1) { Rx = x - 1; Ry = y - 1; Lx = x - 1; Ly = y; }
      else { Rx = x; Ry = y - 1; Lx = x - 1; Ly = y - 1; }
      var ndx = dx, ndy = dy;
      if (!at(Rx, Ry)) { ndx = -dy; ndy = dx; } else if (at(Lx, Ly)) { ndx = dy; ndy = -dx; }
      if (ndx !== dx || ndy !== dy) pts.push([x, y]);
      dx = ndx; dy = ndy;
    } while ((x !== x0 || y !== y0 || dx !== 1 || dy !== 0) && --guard > 0);
    return pts;
  }
  function dp(P, eps) { // Дуглас — Пекер для замкнутого контура
    var n = P.length; if (n < 4) return P.map(function (_, i) { return i; });
    var a = 0, b = 0, bd = -1;
    for (var i = 0; i < n; i++) { var d = (P[i][0] - P[0][0]) * (P[i][0] - P[0][0]) + (P[i][1] - P[0][1]) * (P[i][1] - P[0][1]); if (d > bd) { bd = d; b = i; } }
    var keep = new Uint8Array(n); keep[a] = keep[b] = 1;
    function rec(i0, i1) {
      var A = P[i0], B = P[i1 % n], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, best = -1, bv = eps;
      for (var j = i0 + 1; j < i1; j++) { var Q = P[j % n], v = Math.abs((Q[0] - A[0]) * dy - (Q[1] - A[1]) * dx) / L; if (v > bv) { bv = v; best = j; } }
      if (best >= 0) { keep[best % n] = 1; rec(i0, best); rec(best, i1); }
    }
    rec(a, b); rec(b, n + a);
    var out = []; for (i = 0; i < n; i++) if (keep[i]) out.push(i); return out;
  }
  // Отрезки → прямые (по осям, если почти по осям) → пересечения; короткие стены убираем
  // minStep — ступеньки и ниши мельче этого (оконный проём на толщину стены, выступ колонны) сглаживаем
  function vectorize(P, minEdge, minStep) {
    minStep = Math.max(minEdge, minStep || 0);
    var n = P.length, idx = dp(P, 1.6), m = idx.length; if (m < 3) return null;
    var SN = Math.sin(7 * Math.PI / 180), L = [];
    function mk(t, c, o, p, d, len, e0, e1) { return { t: t, c: c, o: o, p: p, d: d, len: len, e0: e0, e1: e1 }; }
    for (var k = 0; k < m; k++) {
      var i0 = idx[k], i1 = idx[(k + 1) % m]; if (i1 <= i0) i1 += n;
      var A = P[i0 % n], B = P[i1 % n], dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1;
      var sx = 0, sy = 0, c = 0; // средняя по точкам отрезка, взвешенная длинами
      for (var j = i0; j < i1; j++) { var p = P[j % n], q = P[(j + 1) % n], wl = Math.hypot(q[0] - p[0], q[1] - p[1]); sx += (p[0] + q[0]) / 2 * wl; sy += (p[1] + q[1]) / 2 * wl; c += wl; }
      var cx = c ? sx / c : (A[0] + B[0]) / 2, cy = c ? sy / c : (A[1] + B[1]) / 2;
      if (Math.abs(dy) / len < SN) L.push(mk('h', cy, dx > 0 ? 1 : -1, null, null, len, A, B));
      else if (Math.abs(dx) / len < SN) L.push(mk('v', cx, dy > 0 ? 1 : -1, null, null, len, A, B));
      else L.push(mk('d', 0, 0, [cx, cy], [dx / len, dy / len], len, A, B));
    }
    // контур почти весь по осям — короткие косые куски (срезанный угол, размытый край) убираем, иначе после
    // удаления соседей такой кусок вытягивается в длинную диагональ через всю комнату
    var all = 0, axl = 0; L.forEach(function (l) { all += l.len; if (l.t !== 'd') axl += l.len; });
    if (axl > 0.85 * all) L = L.filter(function (l) { return l.t !== 'd' || l.len >= 3 * minEdge; });
    if (L.length < 3) return null;
    function dirOf(l) { return l.t === 'h' ? [l.o, 0] : l.t === 'v' ? [0, l.o] : l.d; }
    function ptOf(l) { return l.t === 'h' ? [l.e0[0], l.c] : l.t === 'v' ? [l.c, l.e0[1]] : l.p; }
    function cross(a, b) {
      var p = ptOf(a), r = dirOf(a), q = ptOf(b), s = dirOf(b), den = r[0] * s[1] - r[1] * s[0];
      if (Math.abs(den) < 0.12) return null; // почти параллельны
      var t = ((q[0] - p[0]) * s[1] - (q[1] - p[1]) * s[0]) / den; return [p[0] + t * r[0], p[1] + t * r[1]];
    }
    function merge(a, b) { // одна стена из двух параллельных, положение — среднее по длине
      var W = a.len + b.len, l = mk(a.t, (a.c * a.len + b.c * b.len) / W, a.o, null, a.d, W, a.e0, b.e1);
      if (a.t === 'd') { var pa = a.p, pb = b.p; l.p = [(pa[0] * a.len + pb[0] * b.len) / W, (pa[1] * a.len + pb[1] * b.len) / W]; }
      return l;
    }
    function offOf(a, b) { var pa = ptOf(a), pb = ptOf(b), d = dirOf(a); return (pb[0] - pa[0]) * -d[1] + (pb[1] - pa[1]) * d[0]; }
    function bridge(a, b) {
      var J = [(a.e1[0] + b.e0[0]) / 2, (a.e1[1] + b.e0[1]) / 2], off = offOf(a, b), d = dirOf(a), s = off > 0 ? 1 : -1;
      if (a.t === 'h') return mk('v', J[0], s * a.o, null, null, Math.abs(off), J, J);
      if (a.t === 'v') return mk('h', J[1], -s * a.o, null, null, Math.abs(off), J, J);
      return mk('d', 0, 0, J, [-d[1] * s, d[0] * s], Math.abs(off), J, J);
    }
    function dot(a, b) { var u = dirOf(a), v = dirOf(b); return u[0] * v[0] + u[1] * v[1]; }
    // повернуть массив так, чтобы элемент i стал первым
    function roll(i) { i = ((i % L.length) + L.length) % L.length; L = L.slice(i).concat(L.slice(0, i)); }
    // соседние параллельные: навстречу — убираем оба, близко — сливаем, далеко — перемычка
    function tidy() {
      for (var guard = 0; guard < 500 && L.length >= 3; guard++) {
        var nn = L.length, k2 = -1;
        for (var z = 0; z < nn; z++) if (!cross(L[z], L[(z + 1) % nn])) { k2 = z; break; }
        if (k2 < 0) return;
        roll(k2); var a = L[0], b = L[1];
        if (dot(a, b) < 0) L.splice(0, 2);
        else if (Math.abs(offOf(a, b)) < 2.5) L.splice(0, 2, merge(a, b));
        else L.splice(1, 0, bridge(a, b));
      }
    }
    function verts() { var nn = L.length, V = []; for (var k3 = 0; k3 < nn; k3++) V.push(cross(L[(k3 - 1 + nn) % nn], L[k3])); return V; }
    function edgeLen(V, k4) { var a = V[k4], b = V[(k4 + 1) % V.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]); }
    tidy();
    for (var guard2 = 0; guard2 < 300 && L.length > 3; guard2++) {
      var V = verts(), nn = L.length, worst = -1, wl2 = 1;
      for (k = 0; k < nn; k++) {
        var e = edgeLen(V, k), lim = cross(L[(k - 1 + nn) % nn], L[(k + 1) % nn]) ? minEdge : minStep; // соседи параллельны — ступенька
        if (e / lim < wl2) { wl2 = e / lim; worst = k; }
      }
      if (worst < 0) break;
      roll(worst - 1); var prev = L[0], next = L[2];
      if (cross(prev, next)) L.splice(1, 1);                 // срезанный угол
      else if (dot(prev, next) > 0) L.splice(0, 3, merge(prev, next)); // ступенька
      else if (L.length >= 7) L.splice(0, 3);                // узкий выступ или ниша
      else break;
      tidy();
    }
    if (L.length < 3) return null;
    var out = verts(); if (out.some(function (v) { return !v; })) return null;
    return out;
  }

  function simple(P) { // без самопересечений
    var n = P.length;
    function seg(a, b, c, d) {
      function o(p, q, r) { return Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); }
      return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
    }
    for (var i = 0; i < n; i++) for (var j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; if (seg(P[i], P[(i + 1) % n], P[j], P[(j + 1) % n])) return false; }
    return true;
  }
  function areaOf(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; }

  // Типичная толщина стен вокруг комнаты: стенные пиксели в полосе у её границы, медиана по «гребням» (2·глубина+1)
  function wallT(W, reg, w, h) {
    var N = w * h, inv = new Uint8Array(N), i;
    for (i = 0; i < N; i++) inv[i] = reg[i] ? 0 : 1;
    var dr = cheb(inv, w, h, false), dw = cheb(W, w, h, true), v = [];
    for (i = 0; i < N; i++) {
      if (!W[i] || dr[i] > 30) continue;
      var d = dw[i], x = i % w, y = (i / w) | 0;
      if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
      if (d >= dw[i - 1] && d >= dw[i + 1] && d >= dw[i - w] && d >= dw[i + w]) v.push(d);
    }
    if (!v.length) return 0;
    v.sort(function (a, b) { return a - b; });
    return 2 * v[v.length >> 1] + 1;
  }
  // Закрытие квадратом радиуса r: заливает узкие светлые полосы между линиями (стены, нарисованные контуром,
  // штриховка, окна), комнаты шире — остаются
  function closeMask(m, w, h, r) {
    var N = w * h, inv = new Uint8Array(N), i;
    for (i = 0; i < N; i++) inv[i] = m[i] ? 0 : 1;
    var d = cheb(inv, w, h, false), dil = new Uint8Array(N);
    for (i = 0; i < N; i++) dil[i] = d[i] <= r ? 1 : 0;
    var e = cheb(dil, w, h, false), o = new Uint8Array(N);
    for (i = 0; i < N; i++) o[i] = dil[i] && e[i] > r ? 1 : 0;
    return o;
  }

  function detect(img, click, opt) {
    opt = opt || {};
    var k = Math.min(1, MAXW / Math.max(img.width, img.height)), G0 = grayOf(img, k);
    var ax = refineSkew(G0, skewOf(G0)), C = [G0.w / 2, G0.h / 2], G = deskew(G0, ax), w = G.w, h = G.h;
    var seed = rotP([click[0] * k, click[1] * k], ax, C);
    // буквы, цифры и значки — отдельные мелкие пятна: убираем до заливки узких мест, иначе слипнутся со стеной
    var Dk = dropText(darkMask(G), w, h), t1 = thinT(Dk, w, h), res = [], ALPHA = opt.alpha || 0.7, S1 = Math.max(w, h) / 1000;
    // Варианты по порядку, берём первый, где комната не утекла наружу:
    // 1) стены залиты — снимаем тонкие линии (мебель, двери, надписи);
    // 2) стены контуром или штриховкой — сначала заливаем узкие полосы, радиус от меньшего к большему;
    // 3) как есть, со всеми линиями.
    var V = [];
    if (t1) V.push({ t: t1 });
    // 1а) стены светлые (бледная заливка, тонкая штриховка) — тёмная маска их не видит; вариант нужен, только
    // если светлого «не тёмного» много (иначе это просто размытые края линий)
    var Tn = tintMask(G), extra = 0, i3;
    for (i3 = 0; i3 < w * h; i3++) if (Tn[i3] && !Dk[i3]) extra++;
    var VT = [], lightR = 0, dkF = 0, tnF = 0;
    if (extra > 0.02 * w * h) {
      for (i3 = 0; i3 < w * h; i3++) if (Dk[i3]) Tn[i3] = 1;
      var Dt = dropText(Tn, w, h), t2 = Math.max(t1, 2);
      VT.push({ src: Dt, t: t2 });
      [3, 5].forEach(function (r) { VT.push({ src: Dt, c: Math.round(r * S1), t: t2 }); });
      // светлые ли стены на всём плане: толстого «стенного» в светлой маске намного больше, чем в тёмной
      var sumOf = function (m) { var s = 0; for (var i4 = 0; i4 < w * h; i4++) s += m[i4]; return s; };
      var sT = sumOf(filterWalls(openMask(Dt, w, h, t2), w, h, t2, 0.03)), sD = sumOf(filterWalls(openMask(Dk, w, h, t2), w, h, t2, 0.03));
      lightR = sT / Math.max(1, sD); dkF = sD / (w * h); tnF = sT / (w * h);
    }
    // светлое на полкартинки — неровный свет на фото; светлого совсем мало — не стены, а размытые края линий
    var LIGHT = lightR > (opt.lightR || 2) && tnF > 0.01 && tnF < 0.3;
    // на планах со светлыми стенами — сразу после мелких закрытий (крупные там склеивают пунктир балок в стены),
    // на обычных — запасной вариант после всех остальных
    [3, 5, 8, 12, 17].forEach(function (r, j) {
      if (LIGHT && j === 2) V = V.concat(VT);
      V.push({ c: Math.round(r * S1), t: Math.max(t1, 2) });
    });
    if (!LIGHT) V = V.concat(VT);
    V.push({ t: 0 });
    // 4) последним — по цвету заливки комнаты (строится, только если до него дошло)
    V.push({ fill: true });
    var pick = null, backup = null;
    for (var vi = 0; vi < V.length && !pick; vi++) {
      var v = V[vi];
      if (v.fill) {
        var F = fillMask(G0, [click[0] * k, click[1] * k]); if (!F) continue;
        F = deskew(F, ax); var Fm = new Uint8Array(w * h);
        for (var i7 = 0; i7 < w * h; i7++) Fm[i7] = F.g[i7] < 128 ? 1 : 0;
        v.src = Fm; v.t = 2;
      }
      var src = v.src || Dk, m0 = v.c ? closeMask(src, w, h, v.c) : src;
      var W = filterWalls(openMask(m0, w, h, v.t), w, h, v.t, v.c ? 0.1 : 0.03);
      if (G.oob) for (var i2 = 0; i2 < w * h; i2++) if (G.oob[i2]) W[i2] = 1; // за краем исходной картинки — «стена», касание отметим ниже
      var r = room(W, w, h, seed, ALPHA, G.oob); if (!r) continue;
      var S = solid(r.reg, w, h, G.oob), x = { v: v, s: S, r: r, W: W, ok: !S.edge && !r.clipped && S.area > 300 && S.area < 0.5 * w * h };
      if (opt.dbg) opt.dbg.push({ c: v.c || 0, W: W, reg: S.m, w: w, h: h });
      res.push(x);
      // залили по водоразделу (какой-то проём не закрылся) — запасной вариант, пробуем следующие
      if (x.ok) { if (!r.fallback) pick = x; else if (!backup) backup = x; }
    }
    if (!pick) pick = backup;
    var info = { ax: +(ax * 180 / Math.PI).toFixed(2), lightR: +lightR.toFixed(2), dkF: +dkF.toFixed(4), tnF: +tnF.toFixed(4), thin: t1, k: k, tries: res.map(function (x) { return [x.v.c || 0, x.v.t, x.s.area, x.ok]; }) };
    if (!pick) return { error: res.some(function (x) { return x.s.edge || x.r.clipped; }) ? 'edge' : 'none', info: info };
    if (pick.v.src && !pick.v.fill) { // светлые стены искали по размытой картинке — они вышли на пиксель толще, комнату расширяем
      var inv6 = new Uint8Array(w * h), i6; for (i6 = 0; i6 < w * h; i6++) inv6[i6] = pick.s.m[i6] ? 0 : 1;
      var d6 = cheb(inv6, w, h, false), g6 = new Uint8Array(w * h), a6 = 0;
      for (i6 = 0; i6 < w * h; i6++) if (d6[i6] <= 1) { g6[i6] = 1; a6++; }
      pick.s = { m: g6, area: a6, edge: false };
    }
    // узкие вырезы в комнате (полотно двери или линия, прилипшие к стене) заполняем
    var RM = closeMask(pick.s.m, w, h, Math.max(2, Math.round(3 * S1)));
    // и наоборот, узкие зубцы наружу (комната заходит в стену между штрихами штриховки) срезаем открытием;
    // если открытие разорвало узкий перешеек — оставляем часть, где нажали
    var RO = openMask(RM, w, h, Math.max(2, Math.round(2 * S1))), sd = pick.r.seed;
    if (RO[sd] && !opt.noRO) {
      var kp = new Uint8Array(w * h), stk = [sd]; kp[sd] = 1;
      while (stk.length) {
        var c5 = stk.pop(), x5 = c5 % w, y5 = (c5 / w) | 0;
        [[x5 - 1, y5], [x5 + 1, y5], [x5, y5 - 1], [x5, y5 + 1]].forEach(function (e) {
          if (e[0] < 0 || e[1] < 0 || e[0] >= w || e[1] >= h) return;
          var j5 = e[1] * w + e[0]; if (RO[j5] && !kp[j5]) { kp[j5] = 1; stk.push(j5); }
        });
      }
      var a5 = 0; for (var i5 = 0; i5 < w * h; i5++) a5 += kp[i5];
      if (a5 > 0.85 * pick.s.area) RM = kp;
    }
    var P = contour(RM, w, h); if (opt.keepP) info.P = P; var minEdge = Math.max(4, 0.045 * Math.sqrt(pick.s.area)), wt = wallT(pick.W, pick.s.m, w, h);
    // упрощение изредка даёт самопересечение — пробуем мельче, в крайнем случае просто Дуглас — Пекер
    // и каждый угол рядом с настоящей границей — площадь может сойтись и при шипе, ушедшем за стену
    function nearP(q, lim) {
      for (var j = 0; j < P.length; j++) {
        var a = P[j], b = P[(j + 1) % P.length], dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
        var t = L2 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2)) : 0;
        if (Math.hypot(a[0] + t * dx - q[0], a[1] + t * dy - q[1]) <= lim) return true;
      }
      return false;
    }
    function okV(X) {
      if (!X || X.length < 3 || !simple(X) || Math.abs(areaOf(X) - pick.s.area) >= 0.25 * pick.s.area) return false;
      var lim = Math.max(2 * minEdge, 1.5 * wt);
      return X.every(function (q) { return nearP(q, lim); });
    }
    var Vs = vectorize(P, minEdge, opt.noStep ? 0 : Math.min(1.5 * wt, 0.12 * Math.sqrt(pick.s.area)));
    if (!okV(Vs)) Vs = vectorize(P, minEdge);
    if (!okV(Vs)) Vs = vectorize(P, minEdge / 2);
    if (!okV(Vs)) Vs = dp(P, 2).map(function (i) { return P[i]; });
    if (!okV(Vs)) return { error: 'shape', info: info };
    var pts = Vs.map(function (p) { var q = unrotP(p, ax, C); return [q[0] / k, q[1] / k]; });
    info.c = pick.v.c || 0; info.t = pick.v.t; info.sDoor = pick.r.sDoor; info.doors = pick.r.doors; info.closed = pick.r.closed; info.fb = pick.r.fallback; info.area = pick.s.area; info.wt = wt;
    return { pts: pts, axis: ax, info: info };
  }
  // ---------- Масштаб по подписям плана ----------
  // В PDF дизайн-проекта размеры уже подписаны: площадь комнаты («21,90 м²») и размеры стен в мм («5 125»).
  // poly — контур комнаты в пикселях; labels — надписи листа в тех же пикселях: { s, x, y (середина), ux, uy
  // (направление строки), h (высота) }. Итог: { mpp (м на пиксель), src: 'dims' | 'area', votes, area, walls } или null.
  //  — площадь: подпись внутри контура (если одна) → mpp = √(S / S_px);
  //  — размеры: число параллельно стене у её середины и не дальше ~четверти её длины → mpp = мм / 1000 / длина;
  //    оценки разных стен голосуют, берём самую частую (±2 %), нужно ≥ 2 стен — одиночная подпись бывает
  //    размером проёма или куска стены;
  //  — две стены без подтверждения площадью (± 8 %) не верим: совпадение бывает случайным (проёмы, куски цепочки)
  function inPoly(p, P) {
    var c = false; for (var i = 0, j = P.length - 1; i < P.length; j = i++) {
      var a = P[i], b = P[j];
      if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  function areaLabels(labels) {
    var out = [];
    labels.forEach(function (o, i) {
      var t = o.s.replace(/\s+/g, ' ').trim(), m = t.match(/^(\d{1,3}[.,]\d{1,2})\s*(м²|м2|м 2|м|m²|m2|кв\.?\s*м)?$/i);
      if (!m) return;
      // единица в той же надписи или отдельной надписью сразу правее
      var unit = !!m[2] || labels.some(function (q, j) { return j !== i && /^(м²|м2|м|m²|m2|2)$/i.test(q.s.trim()) && Math.abs(q.y - o.y) < 1.2 * o.h && q.x > o.x && q.x - o.x < o.s.length * 0.7 * o.h + 3 * o.h; });
      if (!unit) return;
      var v = parseFloat(m[1].replace(',', '.')); if (v >= 0.5 && v <= 400) out.push({ v: v, x: o.x, y: o.y });
    });
    return out;
  }
  function scaleFrom(poly, labels) {
    var n = poly.length, Apx = areaOf(poly), res = { walls: [] };
    var ins = areaLabels(labels).filter(function (a) { return inPoly([a.x, a.y], poly); });
    // одна подпись (или одинаковые) — площадь этой комнаты; разные — внутри несколько помещений, не берём
    if (ins.length && ins.every(function (a) { return Math.abs(a.v - ins[0].v) < 0.05; })) { res.area = ins[0].v; res.mppA = Math.sqrt(ins[0].v / Apx); }
    var C = [];
    labels.forEach(function (o) {
      var t = o.s.replace(/[\s  ]/g, ''); if (!/^\d{3,5}$/.test(t)) return;
      var v = +t; if (v < 300 || v > 30000) return;
      for (var i = 0; i < n; i++) {
        var a = poly[i], b = poly[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 4 * o.h) continue;
        var ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
        if (Math.abs(ux * o.ux + uy * o.uy) < 0.97) continue; // подпись вдоль стены
        var px = o.x - a[0], py = o.y - a[1], tt = px * ux + py * uy, dd = Math.abs(px * -uy + py * ux);
        if (tt < 0.3 * L || tt > 0.7 * L || dd > Math.max(0.25 * L, 3 * o.h)) continue;
        C.push({ mpp: v / 1000 / L, wall: i, v: v, d: dd });
      }
    });
    // голосование: оценки разных стен, совпадающие в пределах 2 %
    var best = null;
    C.forEach(function (c) {
      var ws = {}, s = 0, k = 0;
      C.forEach(function (e) { if (Math.abs(e.mpp / c.mpp - 1) < 0.02 && !ws[e.wall]) { ws[e.wall] = e; s += e.mpp; k++; } });
      if (!best || k > best.votes) best = { votes: k, mpp: s / k, walls: Object.keys(ws).map(function (w) { return { i: +w, mm: ws[w].v }; }) };
    });
    if (best && best.votes >= 2) { res.mppD = best.mpp; res.votes = best.votes; res.walls = best.walls; }
    // две стены совпали случайно бывает (подписи проёмов, половина цепочки) — тогда нужна площадь в подтверждение
    if (res.mppD && res.votes < 3 && !(res.mppA && Math.abs(res.mppD / res.mppA - 1) <= 0.08)) res.mppD = 0;
    if (res.mppD) { res.mpp = res.mppD; res.src = 'dims'; }
    else if (res.mppA) { res.mpp = res.mppA; res.src = 'area'; }
    return res.mpp ? res : null;
  }

  // Масштаб всего чертежа: каждая подпись площади стоит внутри своей комнаты — обводим её отсюда же и считаем
  // масштаб по её стенам и площади; комнаты голосуют (медиана), одна неточно обведённая комнату не сбивает.
  // Сначала оценки по размерам стен (точнее), без них — по площадям. Итог: { mpp, n, src } или null
  function sheetMpp(img, labels, maxN, cb) {
    var A = areaLabels(labels), D = [], S = [];
    // сколько оценок сходятся (± tol) с самой «поддержанной» — и их среднее
    function agree(v, tol) {
      var b = null; v.forEach(function (m) { var k = v.filter(function (e) { return Math.abs(e / m - 1) <= tol; }); if (!b || k.length > b.length) b = k; });
      return b ? { n: b.length, mpp: b.reduce(function (s, e) { return s + e; }, 0) / b.length } : { n: 0 };
    }
    function result() {
      var d = agree(D, 0.02); if (d.n >= 2 || (d.n === 1 && !S.length)) return { mpp: d.mpp, n: d.n, src: 'dims' };
      // по площадям — только если хотя бы две комнаты совпали: подпись общей площади квартиры внутри комнаты бывает
      var a = agree(D.concat(S), 0.05); return a.n >= 2 ? { mpp: a.mpp, n: a.n, src: 'area' } : null;
    }
    // комнаты обводятся по секунде и дольше — хватит трёх совпавших по размерам стен
    var i = 0, more = function () { return i < A.length && i < (maxN || 12) && agree(D, 0.02).n < 3; };
    function step() {
      var r = detect(img, [A[i].x, A[i].y]); i++; if (!r.pts) return;
      var s = scaleFrom(r.pts, labels); if (s) (s.src === 'dims' ? D : S).push(s.mpp);
    }
    // cb — по комнате за раз, между ними страница отвечает (иначе подвисает на десяток секунд)
    if (cb) { (function go() { if (!more()) { cb(result()); return; } step(); setTimeout(go, 0); })(); return; }
    while (more()) step();
    return result();
  }

  window.MLPAutoWall = { detect: detect, scale: scaleFrom, sheetMpp: sheetMpp, areaLabels: areaLabels, _: { skewOf: skewOf, contour: contour, vectorize: vectorize } };
})();

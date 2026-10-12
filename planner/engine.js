/* Moonlight: планировщик освещения — расчётное ядро (без DOM).
   Точечный метод для прямого света + равномерная добавка межотражений. Метры, люмены, люксы. */
(function (root) {
  'use strict';

  // ---------- Геометрия ----------
  function rect(a, b) { return [[0, 0], [a, 0], [a, b], [0, b]]; }
  // Г: общий габарит a×b, из правого верхнего угла вырезан прямоугольник ca×cb
  function lshape(a, b, ca, cb) {
    ca = clamp(ca, 0.3, a - 0.3); cb = clamp(cb, 0.3, b - 0.3);
    return [[0, 0], [a, 0], [a, b - cb], [a - ca, b - cb], [a - ca, b], [0, b]];
  }
  // П: габарит a×b, сверху по центру вырезана ниша ca×cb
  function ushape(a, b, ca, cb) {
    ca = clamp(ca, 0.3, a - 0.6); cb = clamp(cb, 0.3, b - 0.3);
    var x0 = (a - ca) / 2, x1 = x0 + ca;
    return [[0, 0], [a, 0], [a, b], [x1, b], [x1, b - cb], [x0, b - cb], [x0, b], [0, b]];
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function area(poly) {
    var s = 0;
    for (var i = 0, n = poly.length; i < n; i++) { var p = poly[i], q = poly[(i + 1) % n]; s += p[0] * q[1] - q[0] * p[1]; }
    return Math.abs(s) / 2;
  }
  function perimeter(poly) {
    var s = 0;
    for (var i = 0, n = poly.length; i < n; i++) { var p = poly[i], q = poly[(i + 1) % n]; s += Math.hypot(q[0] - p[0], q[1] - p[1]); }
    return s;
  }
  function bbox(poly) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    poly.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    return { x0: x0, y0: y0, x1: x1, y1: y1, w: x1 - x0, h: y1 - y0 };
  }
  function inside(x, y, poly) {
    var c = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  function distToEdges(x, y, poly) {
    var m = Infinity;
    for (var i = 0, n = poly.length; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1];
      var t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1), 0, 1);
      m = Math.min(m, Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy));
    }
    return m;
  }
  // Пересекает ли отрезок PQ какую-то стену (строго, без касания концов) — для заслонения в Г/П
  function blocked(px, py, qx, qy, poly) {
    for (var i = 0, n = poly.length; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n];
      var d1 = cross(a[0], a[1], b[0], b[1], px, py), d2 = cross(a[0], a[1], b[0], b[1], qx, qy);
      var d3 = cross(px, py, qx, qy, a[0], a[1]), d4 = cross(px, py, qx, qy, b[0], b[1]);
      if (((d1 > 1e-9 && d2 < -1e-9) || (d1 < -1e-9 && d2 > 1e-9)) && ((d3 > 1e-9 && d4 < -1e-9) || (d3 < -1e-9 && d4 > 1e-9))) return true;
    }
    return false;
  }
  function cross(ax, ay, bx, by, cx, cy) { return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax); }

  // ---------- Светильники ----------
  // Кривые силы света на 1 лм: возвращают I(γ) [кд/лм], γ — угол от вертикали вниз.
  // down — доля потока в нижнюю полусферу (остальное уходит на потолок/стены → в межотражения).
  var TYPES = {
    pendant: { name: 'Люстра / подвес', down: 0.7, mount: 'ceiling' },
    ceiling: { name: 'Потолочный плафон, панель', down: 1, mount: 'ceiling' },
    spot:    { name: 'Спот, трек', down: 1, mount: 'ceiling', beam: true },
    wall:    { name: 'Бра', down: 0.5, mount: 'wall' }
  };
  function spotN(beamDeg) { var c = Math.cos(clamp(beamDeg, 8, 150) / 2 * Math.PI / 180); return Math.log(0.5) / Math.log(c); }
  function intensity(type, g, beamDeg) {
    var t = TYPES[type] || TYPES.ceiling;
    if (g >= Math.PI / 2) return (1 - t.down) / (2 * Math.PI); // верхняя полусфера (люстра, бра) — равномерно
    if (type === 'spot') { var n = spotN(beamDeg || 36); return (n + 1) / (2 * Math.PI) * Math.pow(Math.cos(g), n); }
    if (type === 'ceiling') return Math.cos(g) / Math.PI;
    return t.down / (2 * Math.PI); // люстра и бра: равномерно по нижней полусфере
  }

  // ---------- Расчёт ----------
  // room: {poly, H, wp, refl:[потолок,стены,пол] 0..1, kz}; lums: [{x,y,z,flux,type,beam}]
  function compute(room, lums, opt) {
    opt = opt || {};
    var poly = room.poly, bb = bbox(poly), S = area(poly);
    var step = opt.step || clamp(Math.sqrt(S) / (opt.fast ? 28 : 45), 0.05, opt.fast ? 0.35 : 0.25); // fast — грубее, для перетаскивания
    var nx = Math.max(2, Math.round(bb.w / step)), ny = Math.max(2, Math.round(bb.h / step));
    var sx = bb.w / nx, sy = bb.h / ny;
    var E = new Float32Array(nx * ny), mask = new Uint8Array(nx * ny);
    var active = lums.filter(function (l) { return l.flux > 0 && inside(l.x, l.y, poly) && l.z - room.wp > 0.05; });
    var convex = isConvex(poly);
    function vis(ax, ay, bx, by) { return convex || !blocked(ax, ay, bx, by, poly); }

    // 1) прямой свет на рабочую плоскость
    var sumD = 0, cnt = 0, pts = [];
    for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
      var x = bb.x0 + (i + 0.5) * sx, y = bb.y0 + (j + 0.5) * sy, k = j * nx + i;
      if (!inside(x, y, poly)) continue;
      mask[k] = 1; pts.push(k);
      var e = 0;
      for (var q = 0; q < active.length; q++) {
        var l = active[q], h = l.z - room.wp, dx = x - l.x, dy = y - l.y, d2 = dx * dx + dy * dy + h * h, d = Math.sqrt(d2);
        if (!vis(l.x, l.y, x, y)) continue;
        var cg = h / d;
        e += l.flux * intensity(l.type, Math.acos(cg), l.beam) * cg / d2;
      }
      E[k] = e; sumD += e; cnt++;
    }

    // 2) первое отражение от стен и потолка — по участкам, поэтому близкая светлая стена
    //    даёт локальную подсветку. Участок получает свет от светильников и светит как матовая поверхность.
    var r = room.refl, patches = surfacePatches(poly, room.H, S, bb);
    patches.forEach(function (p) {
      p.rho = p.ceil ? r[0] : r[1];
      var e = 0;
      for (var q = 0; q < active.length; q++) {
        var l = active[q], dx = p.x - l.x, dy = p.y - l.y, dz = p.z - l.z, d2 = dx * dx + dy * dy + dz * dz, d = Math.sqrt(d2);
        if (d < 1e-4) continue; // светильник вплотную к центру участка (накладной на потолке)
        var ci = -(dx * p.nx + dy * p.ny + dz * p.nz) / d; // косинус падения на участок
        if (ci <= 0 || !vis(l.x, l.y, p.vx, p.vy)) continue;
        e += l.flux * intensity(l.type, Math.acos(Math.max(-1, Math.min(1, -dz / d))), l.beam) * ci / (d2 + p.A / Math.PI);
      }
      p.E = e; p.M = p.rho * e / Math.PI; // яркость (кд/м²)
    });
    var lit = patches.filter(function (p) { return p.M > 1e-6; });
    for (var t = 0; t < pts.length; t++) {
      var k2 = pts[t], x2 = bb.x0 + (k2 % nx + 0.5) * sx, y2 = bb.y0 + (Math.floor(k2 / nx) + 0.5) * sy, add = 0;
      for (var u = 0; u < lit.length; u++) {
        var p = lit[u], ddx = p.x - x2, ddy = p.y - y2, ddz = p.z - room.wp;
        if (ddz <= 0) continue; // участки ниже рабочей плоскости её не освещают
        var dd2 = ddx * ddx + ddy * ddy + ddz * ddz, dd = Math.sqrt(dd2);
        var cp = -(ddx * p.nx + ddy * p.ny + ddz * p.nz) / dd; // косинус выхода с участка
        if (cp <= 0 || !vis(p.vx, p.vy, x2, y2)) continue;
        add += p.M * p.A * cp * (ddz / dd) / (dd2 + p.A / Math.PI + p.s * p.s); // + размер участка² — сглаживает «зубцы» у самой стены
      }
      E[k2] += add;
    }

    // 3) последующие отражения — равномерно: Φ₁·ρ / (A·(1−ρ)), Φ₁ — весь поток после первого отражения
    var P = perimeter(poly), Aw = P * room.H, A = 2 * S + Aw;
    var rho = (S * r[0] + Aw * r[1] + S * r[2]) / A;
    var Ftot = active.reduce(function (s, l) { return s + l.flux; }, 0);
    var Fwp = Math.min(Ftot, cnt ? sumD / cnt * S : 0);
    var F1 = Fwp * r[2] + patches.reduce(function (s, p) { return s + p.rho * p.E * p.A; }, 0);
    var Eind = A > 0 && rho < 1 ? F1 * rho / (A * (1 - rho)) : 0;
    for (var m = 0; m < E.length; m++) if (mask[m]) E[m] = (E[m] + Eind) / room.kz;

    // Статистика: как в EN 12464 — без полосы 0,5 м у стен (если комната позволяет)
    var band = opt.band != null ? opt.band : 0.5, stats = statsOf(band), all = statsOf(0);
    if (stats.n < all.n * 0.25) stats = all;
    function statsOf(b) {
      var s = 0, n = 0, mn = Infinity, mx = 0;
      for (var j = 0; j < ny; j++) for (var i = 0; i < nx; i++) {
        var k = j * nx + i; if (!mask[k]) continue;
        if (b > 0 && distToEdges(bb.x0 + (i + 0.5) * sx, bb.y0 + (j + 0.5) * sy, poly) < b) continue;
        s += E[k]; n++; mn = Math.min(mn, E[k]); mx = Math.max(mx, E[k]);
      }
      return { n: n, avg: n ? s / n : 0, min: n ? mn : 0, max: mx };
    }
    return {
      grid: { nx: nx, ny: ny, x0: bb.x0, y0: bb.y0, sx: sx, sy: sy, E: E, mask: mask },
      avg: stats.avg, min: stats.min, max: Math.max(stats.max, all.max), u0: stats.avg ? stats.min / stats.avg : 0,
      area: S, indirect: Eind / room.kz, flux: Ftot, active: active.length,
      balance: Fwp + patches.reduce(function (s, p) { return s + p.E * p.A; }, 0) // для проверки: поток, дошедший до поверхностей
    };
  }

  function isConvex(poly) {
    var sgn = 0;
    for (var i = 0, n = poly.length; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n], c = poly[(i + 2) % n], z = cross(a[0], a[1], b[0], b[1], c[0], c[1]);
      if (Math.abs(z) < 1e-9) continue;
      if (!sgn) sgn = z > 0 ? 1 : -1; else if ((z > 0 ? 1 : -1) !== sgn) return false;
    }
    return true;
  }
  // Участки стен (полосы по высоте) и потолка: центр, внутренняя нормаль, площадь, точка для проверки видимости
  function surfacePatches(poly, H, S, bb) {
    var out = [], P = perimeter(poly), pw = Math.max(0.15, P / 120), rows = 5;
    for (var i = 0, n = poly.length; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue;
      var nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      if (!inside(mx + nx * 0.01, my + ny * 0.01, poly)) { nx = -nx; ny = -ny; }
      var cols = Math.max(1, Math.round(L / pw));
      for (var c = 0; c < cols; c++) {
        var u = (c + 0.5) / cols, x = a[0] + u * (b[0] - a[0]), y = a[1] + u * (b[1] - a[1]);
        for (var r = 0; r < rows; r++) out.push({ x: x, y: y, z: (r + 0.5) * H / rows, nx: nx, ny: ny, nz: 0, A: L / cols * H / rows, s: L / cols, vx: x + nx * 0.01, vy: y + ny * 0.01 });
      }
    }
    var cs = clamp(Math.sqrt(S) / 10, 0.25, 0.6), cx = Math.max(1, Math.round(bb.w / cs)), cy = Math.max(1, Math.round(bb.h / cs));
    for (var j = 0; j < cy; j++) for (var k = 0; k < cx; k++) {
      var px = bb.x0 + bb.w * (k + 0.5) / cx, py = bb.y0 + bb.h * (j + 0.5) / cy;
      if (inside(px, py, poly)) out.push({ x: px, y: py, z: H, nx: 0, ny: 0, nz: -1, A: bb.w / cx * bb.h / cy, s: 0, vx: px, vy: py, ceil: true });
    }
    return out;
  }

  // Изолинии (marching squares) по значениям в центрах ячеек; возвращает отрезки в метрах
  function isolines(g, level) {
    var segs = [], nx = g.nx, ny = g.ny;
    function v(i, j) { var k = j * nx + i; return g.mask[k] ? g.E[k] : NaN; }
    function px(i) { return g.x0 + (i + 0.5) * g.sx; }
    function py(j) { return g.y0 + (j + 0.5) * g.sy; }
    for (var j = 0; j < ny - 1; j++) for (var i = 0; i < nx - 1; i++) {
      var a = v(i, j), b = v(i + 1, j), c = v(i + 1, j + 1), d = v(i, j + 1);
      if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) continue;
      var pts = [];
      edge(a, b, px(i), py(j), px(i + 1), py(j));
      edge(b, c, px(i + 1), py(j), px(i + 1), py(j + 1));
      edge(d, c, px(i), py(j + 1), px(i + 1), py(j + 1));
      edge(a, d, px(i), py(j), px(i), py(j + 1));
      if (pts.length === 2) segs.push(pts);
      else if (pts.length === 4) { segs.push([pts[0], pts[1]]); segs.push([pts[2], pts[3]]); }
    }
    function edge(v1, v2, x1, y1, x2, y2) {
      if ((v1 < level) === (v2 < level)) return;
      var t = (level - v1) / (v2 - v1);
      pts.push([x1 + t * (x2 - x1), y1 + t * (y2 - y1)]);
    }
    return segs;
  }

  // ---------- Автоматическая расстановка ----------
  // Ряды×колонки под n светильников с учётом пропорций (как в простом калькуляторе)
  function gridDims(n, a, b) {
    if (n <= 1) return [1, 1];
    var best = null;
    for (var c = 1; c <= n; c++) { var r = Math.ceil(n / c), sc = Math.abs(a / c - b / r) + (r * c - n) * Math.min(a, b) * 0.6; if (!best || sc < best[2]) best = [c, r, sc]; }
    return [best[0], best[1]];
  }
  function layout(poly, n, mount, wallOffset) {
    if (n <= 0) return [];
    return mount === 'wall' ? layoutWall(poly, n, wallOffset || 0.08) : layoutCeiling(poly, n);
  }
  function layoutCeiling(poly, n) {
    var bb = bbox(poly), pts;
    if (poly.length === 4) { // прямоугольник: ровная сетка
      var g = gridDims(n, bb.w, bb.h); pts = [];
      for (var r = 0, k = 0; r < g[1]; r++) { var inRow = Math.min(g[0], n - k); for (var c = 0; c < inRow; c++, k++) pts.push([bb.x0 + bb.w * (c + 0.5) / inRow, bb.y0 + bb.h * (r + 0.5) / g[1]]); }
      return pts;
    }
    if (n === 1) return [centroidInside(poly)];
    // Произвольный контур: подбираем шаг решётки, чтобы внутри было ≥ n узлов, лишние — ближайшие к стенам
    var S = area(poly), s = Math.sqrt(S / n) * 1.6, best = null;
    for (var it = 0; it < 80; it++, s *= 0.97) {
      var cand = [];
      var cols = Math.max(1, Math.round(bb.w / s)), rows = Math.max(1, Math.round(bb.h / s));
      for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) {
        var x = bb.x0 + bb.w * (i + 0.5) / cols, y = bb.y0 + bb.h * (j + 0.5) / rows;
        if (inside(x, y, poly) && distToEdges(x, y, poly) > Math.min(bb.w / cols, bb.h / rows) * 0.3) cand.push([x, y]);
      }
      if (cand.length >= n) { best = cand; break; }
    }
    if (!best) return [];
    best.sort(function (p, q) { return distToEdges(q[0], q[1], poly) - distToEdges(p[0], p[1], poly); });
    return best.slice(0, n);
  }
  function centroidInside(poly) {
    var bb = bbox(poly), c = [bb.x0 + bb.w / 2, bb.y0 + bb.h / 2];
    if (inside(c[0], c[1], poly)) return c;
    var best = null, bd = -1; // самая «глубокая» точка
    for (var j = 1; j < 20; j++) for (var i = 1; i < 20; i++) {
      var x = bb.x0 + bb.w * i / 20, y = bb.y0 + bb.h * j / 20;
      if (!inside(x, y, poly)) continue;
      var d = distToEdges(x, y, poly); if (d > bd) { bd = d; best = [x, y]; }
    }
    return best || c;
  }
  // Бра — равномерно по периметру, чуть отступив от стены внутрь
  function layoutWall(poly, n, off) {
    var P = perimeter(poly), pts = [], n2 = poly.length;
    for (var k = 0; k < n; k++) {
      var t = P * (k + 0.5) / n, acc = 0;
      for (var i = 0; i < n2; i++) {
        var a = poly[i], b = poly[(i + 1) % n2], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        if (acc + L >= t) {
          var u = (t - acc) / L, x = a[0] + u * (b[0] - a[0]), y = a[1] + u * (b[1] - a[1]);
          var nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L; // нормаль; выбираем ту, что внутрь
          if (!inside(x + nx * off, y + ny * off, poly)) { nx = -nx; ny = -ny; }
          pts.push([x + nx * off, y + ny * off]); break;
        }
        acc += L;
      }
    }
    return pts;
  }

  // ---------- Метод коэффициента использования (для сверки, из простого калькулятора) ----------
  var IDX = [0.6, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5];
  function uOf(i, tab) {
    if (i <= IDX[0]) return tab[0] * Math.max(i, 0.3) / IDX[0] / 100;
    for (var k = 1; k < IDX.length; k++) if (i <= IDX[k]) { var t = (i - IDX[k - 1]) / (IDX[k] - IDX[k - 1]); return (tab[k - 1] + t * (tab[k] - tab[k - 1])) / 100; }
    return tab[tab.length - 1] / 100;
  }

  var api = {
    rect: rect, lshape: lshape, ushape: ushape, area: area, perimeter: perimeter, bbox: bbox, inside: inside,
    distToEdges: distToEdges, blocked: blocked, TYPES: TYPES, intensity: intensity, compute: compute,
    isolines: isolines, layout: layout, gridDims: gridDims, uOf: uOf, clamp: clamp
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MLPEngine = api;
})(typeof window !== 'undefined' ? window : this);

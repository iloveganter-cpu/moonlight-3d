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
      // низ стен (ниже рабочей плоскости) прямой свет не считаем: этот поток уже прошёл через
      // рабочую плоскость и учтён в Fwp (с отражением пола) — иначе двойной счёт
      if (p.z < room.wp) { p.E = 0; p.M = 0; return; }
      for (var q = 0; q < active.length; q++) {
        var l = active[q], dx = p.x - l.x, dy = p.y - l.y, dz = p.z - l.z, d2 = dx * dx + dy * dy + dz * dz, d = Math.sqrt(d2);
        if (d < 1e-4) continue; // светильник вплотную к центру участка (накладной на потолке)
        var ci = -(dx * p.nx + dy * p.ny + dz * p.nz) / d; // косинус падения на участок
        if (ci <= 0 || !vis(l.x, l.y, p.vx, p.vy)) continue;
        e += l.flux * intensity(l.type, Math.acos(Math.max(-1, Math.min(1, -dz / d))), l.beam) * ci / (d2 + p.A / Math.PI);
      }
      p.E = e; p.M = p.rho * e / Math.PI; // яркость (кд/м²)
    });
    // Комната закрыта: весь поток, не попавший на рабочую плоскость, обязан лечь на стены/потолок.
    // Дискретизация (участок у самого светильника) даёт ±15 % — нормируем сумму, распределение оставляем.
    var Ftot = active.reduce(function (s, l) { return s + l.flux; }, 0);
    var Fwp = Math.min(Ftot, cnt ? sumD / cnt * S : 0);
    var Fp = patches.reduce(function (s, p) { return s + p.E * p.A; }, 0);
    if (Fp > 0) { var kf = (Ftot - Fwp) / Fp; patches.forEach(function (p) { p.E *= kf; p.M *= kf; }); }
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
    var F1 =Fwp * r[2] + patches.reduce(function (s, p) { return s + p.rho * p.E * p.A; }, 0);
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
      reflected: ((A > 0 ? F1 / A : 0) + Eind) / room.kz, // средний отражённый свет на стенах/потолке (для 3D)
      balance: Fwp + patches.reduce(function (s, p) { return s + p.E * p.A; }, 0) // для проверки: поток, дошедший до поверхностей
    };
  }

  // Прямая освещённость точки любой поверхности (для 3D): точка (x,y,z), нормаль (nx,ny,nz) внутрь комнаты,
  // (vx,vy) — точка на плане чуть внутри комнаты для проверки заслонения. lums — уже отфильтрованные.
  function directAt(poly, convex, lums, x, y, z, nx, ny, nz, vx, vy) {
    var e = 0;
    for (var q = 0; q < lums.length; q++) {
      var l = lums[q], dx = x - l.x, dy = y - l.y, dz = z - l.z, d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < 1e-6) continue;
      var d = Math.sqrt(d2), ci = -(dx * nx + dy * ny + dz * nz) / d;
      if (ci <= 0 || (!convex && blocked(l.x, l.y, vx, vy, poly))) continue;
      e += l.flux * intensity(l.type, Math.acos(Math.max(-1, Math.min(1, -dz / d))), l.beam) * ci / (d2 + 0.01);
    }
    return e;
  }
  // Освещённость стен (сетка по каждой стене) и потолка для 3D-вида: прямой свет + равномерные отражения, с Кз
  function surfaces(room, lums, res, opt) {
    opt = opt || {};
    var poly = room.poly, convex = isConvex(poly), H = room.H, kz = room.kz, add = res.reflected;
    var act = lums.filter(function (l) { return l.flux > 0 && inside(l.x, l.y, poly) && l.z - room.wp > 0.05; });
    var walls = [], du = opt.du || 0.1, rows = opt.rows || 24;
    for (var i = 0, n = poly.length; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (L < 1e-6) continue;
      var nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
      if (!inside((a[0] + b[0]) / 2 + nx * 0.01, (a[1] + b[1]) / 2 + ny * 0.01, poly)) { nx = -nx; ny = -ny; }
      var cols = Math.max(4, Math.round(L / du)), E = new Float32Array(cols * rows);
      for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
        var u = (c + 0.5) / cols, x = a[0] + u * (b[0] - a[0]), y = a[1] + u * (b[1] - a[1]), z = (r + 0.5) * H / rows;
        E[r * cols + c] = (directAt(poly, convex, act, x, y, z, nx, ny, 0, x + nx * 0.02, y + ny * 0.02) / kz) + add;
      }
      walls.push({ a: a, b: b, L: L, nx: nx, ny: ny, cols: cols, rows: rows, E: E });
    }
    var g = res.grid, C = new Float32Array(g.nx * g.ny);
    for (var j = 0; j < g.ny; j++) for (var k = 0; k < g.nx; k++) {
      var m = j * g.nx + k; if (!g.mask[m]) continue;
      var px = g.x0 + (k + 0.5) * g.sx, py = g.y0 + (j + 0.5) * g.sy;
      C[m] = directAt(poly, convex, act, px, py, H, 0, 0, -1, px, py) / kz + add;
    }
    return { walls: walls, ceiling: C };
  }

  // Контур без самопересечений (иначе площадь и «внутри/снаружи» неверны)
  function isSimple(poly) {
    var n = poly.length; if (n < 3) return false;
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      if (j === i + 1 || (i === 0 && j === n - 1)) continue; // соседние стены
      var a = poly[i], b = poly[(i + 1) % n], c = poly[j], d = poly[(j + 1) % n];
      var d1 = cross(a[0], a[1], b[0], b[1], c[0], c[1]), d2 = cross(a[0], a[1], b[0], b[1], d[0], d[1]);
      var d3 = cross(c[0], c[1], d[0], d[1], a[0], a[1]), d4 = cross(c[0], c[1], d[0], d[1], b[0], b[1]);
      if (((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)) && d1 && d2 && d3 && d4) return false;
    }
    return area(poly) > 0.5;
  }
  // Ближайшая точка на стене, сдвинутая внутрь на off — для бра
  function snapToWall(poly, x, y, off) {
    var best = null, bd = Infinity;
    for (var i = 0, n = poly.length; i < n; i++) {
      var a = poly[i], b = poly[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy; if (!L2) continue;
      var t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / L2, 0.02, 0.98), px = a[0] + t * dx, py = a[1] + t * dy, d = Math.hypot(x - px, y - py);
      if (d < bd) {
        var L = Math.sqrt(L2), nx = -dy / L, ny = dx / L;
        if (!inside(px + nx * 0.01, py + ny * 0.01, poly)) { nx = -nx; ny = -ny; }
        bd = d; best = [px + nx * off, py + ny * off];
      }
    }
    return best;
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
  // fixed — уже стоящие потолочные светильники других групп (люстра): споты их обходят
  function layout(poly, n, mount, opt) {
    if (n <= 0) return [];
    opt = opt || {};
    if (mount === 'wall') return layoutWall(poly, n, opt.wallOffset || 0.08);
    var sym = opt.exact ? null : symLayout(poly, n, opt); // exact — ровно n, без подгонки под симметрию
    return sym ? sym.pts : layoutCVT(poly, n, (opt.fixed || []).filter(function (p) { return inside(p[0], p[1], poly); }));
  }

  // ---------- Симметричная («дизайнерская») расстановка ----------
  // Комната со стенами под прямым углом делится на прямоугольные зоны (Г — 2, П — 3); в каждой зоне —
  // ровная сетка по центру, шаг одинаковый для всей комнаты, от стены — половина шага.
  function isOrtho(poly) {
    for (var i = 0, n = poly.length; i < n; i++) { var a = poly[i], b = poly[(i + 1) % n]; if (Math.abs(a[0] - b[0]) > 1e-6 && Math.abs(a[1] - b[1]) > 1e-6) return false; }
    return true;
  }
  // Разбиение на прямоугольники полосами (вертикальными или горизонтальными — где зон меньше)
  function zones(poly) {
    if (!isOrtho(poly)) return null;
    function slabs(ax) { // ax=0: вертикальные полосы по x
      var cs = uniq(poly.map(function (p) { return p[ax]; })), out = [];
      for (var i = 0; i < cs.length - 1; i++) {
        var c0 = cs[i], c1 = cs[i + 1], mid = (c0 + c1) / 2, cut = [];
        for (var k = 0, n = poly.length; k < n; k++) { // пересечения линии mid с рёбрами, параллельными другой оси
          var a = poly[k], b = poly[(k + 1) % n];
          if (Math.abs(a[ax] - b[ax]) > 1e-9 && (a[ax] - mid) * (b[ax] - mid) < 0) cut.push(a[1 - ax]);
        }
        cut.sort(function (p, q) { return p - q; });
        for (var j = 0; j + 1 < cut.length; j += 2) out.push({ c0: c0, c1: c1, d0: cut[j], d1: cut[j + 1] });
      }
      // склеиваем соседние полосы с одинаковым «сечением»
      var merged = [];
      out.forEach(function (s) {
        var m = merged.filter(function (r) { return Math.abs(r.c1 - s.c0) < 1e-9 && Math.abs(r.d0 - s.d0) < 1e-9 && Math.abs(r.d1 - s.d1) < 1e-9; })[0];
        if (m) m.c1 = s.c1; else merged.push({ c0: s.c0, c1: s.c1, d0: s.d0, d1: s.d1 });
      });
      return merged.map(function (r) { return ax === 0 ? { x0: r.c0, x1: r.c1, y0: r.d0, y1: r.d1 } : { x0: r.d0, x1: r.d1, y0: r.c0, y1: r.c1 }; });
    }
    function uniq(a) { a = a.slice().sort(function (p, q) { return p - q; }); return a.filter(function (v, i) { return !i || v - a[i - 1] > 1e-9; }); }
    var v = slabs(0), h = slabs(1);
    // меньше зон — лучше; при равенстве — та разбивка, где главная зона больше (у П — перемычка во всю ширину,
    // туда встанет люстра)
    var maxA = function (z) { return Math.max.apply(null, z.map(function (r) { return (r.x1 - r.x0) * (r.y1 - r.y0); })); };
    var best = v.length !== h.length ? (v.length < h.length ? v : h) : (maxA(v) >= maxA(h) ? v : h);
    return best.sort(function (p, q) { return (q.x1 - q.x0) * (q.y1 - q.y0) - (p.x1 - p.x0) * (p.y1 - p.y0); }); // первая — главная (самая большая)
  }
  function zoneGrid(z, cols, rows) {
    var pts = [], w = z.x1 - z.x0, h = z.y1 - z.y0;
    for (var j = 0; j < rows; j++) for (var i = 0; i < cols; i++) pts.push([z.x0 + w * (i + 0.5) / cols, z.y0 + h * (j + 0.5) / rows]);
    return pts;
  }
  function near(pts, fixed, d) { return pts.some(function (p) { return fixed.some(function (f) { return Math.hypot(p[0] - f[0], p[1] - f[1]) < d; }); }); }
  // Все симметричные варианты: перебираем общий шаг s; в зоне колонки=round(w/s), ряды=round(h/s).
  // Если в зоне стоит люстра — сетка этой зоны чётная (центр свободен). Возвращает варианты по возрастанию числа.
  function symOptions(poly, fixed) {
    var zs = zones(poly); if (!zs) return null;
    fixed = (fixed || []).filter(function (p) { return inside(p[0], p[1], poly); });
    if (zs.length <= 3) return symOptionsFree(zs, fixed);
    return symOptionsShared(zs, fixed);
  }
  // До 3 зон: у каждой зоны своя сетка (колонки×ряды), но шаг сетки во всех зонах и по обеим осям должен
  // быть близким (разброс ≤ 60 % от среднего) — иначе выглядит неаккуратно. На каждое число — самый ровный вариант.
  function symOptionsFree(zs, fixed) {
    var per = zs.map(function (z) {
      var w = z.x1 - z.x0, h = z.y1 - z.y0, list = [];
      for (var c = 1; c <= 16; c++) for (var r = 1; r <= 16; r++) {
        var cw = w / c, ch = h / r;
        if ((cw < 0.5 || ch < 0.5) || (c > 1 && cw > 4.5) || (r > 1 && ch > 4.5)) continue;
        if (Math.max(cw, ch) / Math.min(cw, ch) > 2.6 && c * r > 1) continue;
        if (fixed.length && near(zoneGrid(z, c, r), fixed, 0.8)) continue; // ближе 0,8 м к люстре — тесно
        list.push([c, r, cw, ch]);
      }
      return list;
    });
    // одинаковые зоны (обе «ноги» П-комнаты) обязаны получить одинаковую сетку — иначе несимметрично
    var twin = zs.map(function (z, j) {
      for (var i = 0; i < j; i++) { var o = zs[i]; if (Math.abs((o.x1 - o.x0) - (z.x1 - z.x0)) < 1e-6 && Math.abs((o.y1 - o.y0) - (z.y1 - z.y0)) < 1e-6) return i; }
      return -1;
    });
    var byN = {};
    (function rec(i, acc) {
      if (i < zs.length && twin[i] >= 0) {
        var t = acc[twin[i]], same = per[i].filter(function (a) { return a[0] === t[0] && a[1] === t[1]; });
        same.forEach(function (a) { rec(i + 1, acc.concat([a])); });
        return;
      }
      if (i === zs.length) {
        var N = 0, st = []; acc.forEach(function (a) { N += a[0] * a[1]; if (a[0] > 1) st.push(a[2]); if (a[1] > 1) st.push(a[3]); });
        if (N > 60) return;
        if (!st.length) acc.forEach(function (a) { st.push(Math.min(a[2], a[3])); });
        var mean = st.reduce(function (s, v) { return s + v; }, 0) / st.length, score = (Math.max.apply(null, st) - Math.min.apply(null, st)) / mean;
        if (score > 0.75) return;
        var mis = misalign(zs, acc) / mean; // ряды/колонки соседних зон на одной линии — аккуратнее
        var tot = score + 0.8 * mis;
        if (!byN[N] || tot < byN[N].score) byN[N] = { n: N, cfg: acc.map(function (a) { return [a[0], a[1]]; }), score: tot, neat: score <= 0.5 && mis <= 0.12 };
        return;
      }
      per[i].forEach(function (a) { rec(i + 1, acc.concat([a])); });
    })(0, []);
    return Object.keys(byN).map(function (k) {
      var o = byN[k]; o.pts = [].concat.apply([], zs.map(function (z, i) { return zoneGrid(z, o.cfg[i][0], o.cfg[i][1]); })); return o;
    }).sort(function (p, q) { return p.n - q.n; });
  }
  // Насколько ряды (y) зон, стоящих бок о бок, и колонки (x) зон, стоящих друг над другом, не совпадают (м)
  function misalign(zs, acc) {
    var tot = 0, cnt = 0;
    function lines(z, a, ax) { var n = ax ? a[1] : a[0], lo = ax ? z.y0 : z.x0, L = ax ? z.y1 - z.y0 : z.x1 - z.x0, o = []; for (var i = 0; i < n; i++) o.push(lo + L * (i + 0.5) / n); return o; }
    for (var i = 0; i < zs.length; i++) for (var j = i + 1; j < zs.length; j++) {
      var A = zs[i], B = zs[j];
      [[1, Math.min(A.y1, B.y1) - Math.max(A.y0, B.y0)], [0, Math.min(A.x1, B.x1) - Math.max(A.x0, B.x0)]].forEach(function (t) {
        if (t[1] <= 0.3) return; // зоны не соседствуют по этой оси
        var la = lines(A, acc[i], t[0]), lb = lines(B, acc[j], t[0]), sm = la.length <= lb.length ? la : lb, bg = sm === la ? lb : la;
        sm.forEach(function (v) { tot += Math.min.apply(null, bg.map(function (u) { return Math.abs(u - v); })); cnt++; });
      });
    }
    return cnt ? tot / cnt : 0;
  }
  function symOptionsShared(zs, fixed) {
    var seen = {}, out = [];
    for (var s = 4; s >= 0.45; s -= 0.02) {
      var cfg = zs.map(function (z) {
        var w = z.x1 - z.x0, h = z.y1 - z.y0, c = Math.max(1, Math.round(w / s)), r = Math.max(1, Math.round(h / s));
        if (fixed.length && near(zoneGrid(z, c, r), fixed, 0.6)) { // освобождаем место под люстрой: делаем чётным
          var opts = [[c + (c % 2), r], [c, r + (r % 2)], [c + (c % 2), r + (r % 2)], [Math.max(2, c - (c % 2)), r]];
          var ok = opts.filter(function (o) { return !near(zoneGrid(z, o[0], o[1]), fixed, 0.6); });
          ok.sort(function (p, q) { return Math.abs(w / p[0] - h / p[1]) - Math.abs(w / q[0] - h / q[1]); });
          if (ok.length) { c = ok[0][0]; r = ok[0][1]; }
        }
        return [c, r];
      });
      var N = cfg.reduce(function (t, c) { return t + c[0] * c[1]; }, 0), key = JSON.stringify(cfg);
      if (seen[key]) continue; seen[key] = 1;
      // «квадратность» ячеек: чем ближе шаг по x и y и между зонами, тем аккуратнее
      var steps = []; zs.forEach(function (z, i) { steps.push((z.x1 - z.x0) / cfg[i][0], (z.y1 - z.y0) / cfg[i][1]); });
      var score = (Math.max.apply(null, steps) - Math.min.apply(null, steps)) / s;
      out.push({ n: N, cfg: cfg, s: s, score: score, neat: score <= 0.5, pts: [].concat.apply([], zs.map(function (z, i) { return zoneGrid(z, cfg[i][0], cfg[i][1]); })) });
    }
    // на одно и то же число — самый аккуратный вариант
    var byN = {}; out.forEach(function (o) { if (!byN[o.n] || o.score < byN[o.n].score) byN[o.n] = o; });
    return Object.keys(byN).map(function (k) { return byN[k]; }).sort(function (p, q) { return p.n - q.n; });
  }
  // Ближайший симметричный вариант к n (при равенстве — больше). Меньше светильников, чем зон: центры главных зон.
  function symLayout(poly, n, opt) {
    var zs = zones(poly); if (!zs) return null;
    var fixed = opt && opt.fixed || [];
    if (n <= zs.length && !fixed.length) return { pts: zs.slice(0, n).map(function (z) { return [(z.x0 + z.x1) / 2, (z.y0 + z.y1) / 2]; }), n: n };
    var all = symOptions(poly, fixed); if (!all || !all.length) return null;
    // «аккуратные» варианты (ровный шаг, ряды зон на одной линии); если ровно n не выходит — ближайший больше
    // 1) аккуратный не меньше n (если не слишком далеко); 2) любой не меньше n (чуть менее ровный);
    // 3) только если больше n ничего нет — самый большой из возможных
    var neat = all.filter(function (o) { return o.neat; }), pool = neat;
    var neatUp = neat.filter(function (o) { return o.n >= n; })[0], allUp = all.filter(function (o) { return o.n >= n; })[0], best;
    if (neatUp && neatUp.n <= n * 1.35 + 1) best = neatUp;
    else if (allUp) { best = allUp; pool = all; }
    else { pool = neat.length ? neat : all; best = pool[pool.length - 1]; }
    return { pts: best.pts, n: best.n, cfg: best.cfg, options: pool.map(function (o) { return o.n; }) };
  }
  // Прямоугольник: ровная симметричная сетка (так ставят дизайнеры); из вариантов рядов×колонок берём
  // самый пропорциональный, где ни одна точка не ближе 0,6 м к уже стоящему светильнику (люстре)
  function rectGridAvoiding(poly, n, fixed) {
    var bb = bbox(poly), cand = [];
    for (var c = 1; c <= n; c++) { var r = Math.ceil(n / c); if ((r - 1) * c >= n) continue; cand.push([c, r, Math.abs(bb.w / c - bb.h / r) + (r * c - n) * Math.min(bb.w, bb.h) * 0.6]); }
    cand.sort(function (p, q) { return p[2] - q[2]; });
    for (var t = 0; t < cand.length; t++) {
      var pts = [], cc = cand[t][0], rr = cand[t][1];
      for (var j = 0, k = 0; j < rr; j++) { var inRow = Math.min(cc, n - k); for (var i = 0; i < inRow; i++, k++) pts.push([bb.x0 + bb.w * (i + 0.5) / inRow, bb.y0 + bb.h * (j + 0.5) / rr]); }
      var clash = pts.some(function (p) { return fixed.some(function (f) { return Math.hypot(p[0] - f[0], p[1] - f[1]) < 0.6; }); });
      if (!clash) return pts;
    }
    return null;
  }
  function isAxisRect(poly) {
    if (poly.length !== 4) return false;
    for (var i = 0; i < 4; i++) { var a = poly[i], b = poly[(i + 1) % 4]; if (Math.abs(a[0] - b[0]) > 1e-6 && Math.abs(a[1] - b[1]) > 1e-6) return false; }
    return true;
  }
  // Равномерное покрытие любой формы: центроидальное разбиение Вороного (алгоритм Ллойда).
  // Каждому светильнику достаётся примерно равная «своя» площадь, поэтому заполняются и узкие рукава Г/П.
  function layoutCVT(poly, n, fixed) {
    var S = area(poly), bb = bbox(poly), step = clamp(Math.sqrt(S / ((n + fixed.length) * 80)), 0.03, 0.12), smp = [];
    for (var y = bb.y0 + step / 2; y < bb.y1; y += step) for (var x = bb.x0 + step / 2; x < bb.x1; x += step) if (inside(x, y, poly)) smp.push([x, y]);
    if (!smp.length) return [];
    // старт: самая «глубокая» точка, затем каждый раз — самая далёкая от уже выбранных (детерминированно)
    var seeds = fixed.slice(), pts = [], dmin = smp.map(function () { return Infinity; });
    function addSeed(p) { smp.forEach(function (s, k) { dmin[k] = Math.min(dmin[k], Math.hypot(s[0] - p[0], s[1] - p[1])); }); }
    seeds.forEach(addSeed);
    for (var k = 0; k < n; k++) {
      var bi = 0, bv = -1;
      for (var q = 0; q < smp.length; q++) {
        var v = seeds.length || pts.length ? dmin[q] : distToEdges(smp[q][0], smp[q][1], poly);
        if (v > bv) { bv = v; bi = q; }
      }
      pts.push(smp[bi].slice()); addSeed(smp[bi]);
    }
    for (var it = 0; it < 40; it++) {
      var sx = new Float64Array(n), sy = new Float64Array(n), cnt = new Float64Array(n), all = fixed.concat(pts);
      for (var s = 0; s < smp.length; s++) {
        var best = 0, bd = Infinity;
        for (var j = 0; j < all.length; j++) { var dx = smp[s][0] - all[j][0], dy = smp[s][1] - all[j][1], d2 = dx * dx + dy * dy; if (d2 < bd) { bd = d2; best = j; } }
        best -= fixed.length; if (best < 0) continue; // точка «принадлежит» неподвижному светильнику
        sx[best] += smp[s][0]; sy[best] += smp[s][1]; cnt[best]++;
      }
      var moved = 0;
      for (var m = 0; m < n; m++) {
        if (!cnt[m]) continue;
        var c = [sx[m] / cnt[m], sy[m] / cnt[m]];
        if (!inside(c[0], c[1], poly)) c = nearestSample(smp, c); // центр «своей» зоны в вогнутом углу — ближайшая точка комнаты
        moved = Math.max(moved, Math.hypot(c[0] - pts[m][0], c[1] - pts[m][1])); pts[m] = c;
      }
      if (moved < 0.005) break;
    }
    return pts.map(function (p) { return [Math.round(p[0] * 20) / 20, Math.round(p[1] * 20) / 20]; }) // шаг 5 см, как при ручной расстановке
      .map(function (p, i) { return inside(p[0], p[1], poly) ? p : pts[i]; });
  }
  function nearestSample(smp, c) {
    var b = smp[0], bd = Infinity;
    smp.forEach(function (s) { var d = (s[0] - c[0]) * (s[0] - c[0]) + (s[1] - c[1]) * (s[1] - c[1]); if (d < bd) { bd = d; b = s; } });
    return b.slice();
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
    distToEdges: distToEdges, blocked: blocked, isSimple: isSimple, snapToWall: snapToWall, zones: zones, symOptions: symOptions, symLayout: symLayout, surfaces: surfaces, directAt: directAt, TYPES: TYPES, intensity: intensity, compute: compute,
    isolines: isolines, layout: layout, gridDims: gridDims, uOf: uOf, clamp: clamp
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MLPEngine = api;
})(typeof window !== 'undefined' ? window : this);

/* Moonlight: планировщик освещения — 3D-вид (three.js r147 UMD + OrbitControls).
   Яркость поверхностей берётся из расчёта (engine.compute + engine.surfaces), а не из освещения three.js:
   картинка показывает именно посчитанные люксы. Комната — «кукольный домик»: стены и потолок
   односторонние, поэтому ближние к камере скрываются сами. */
(function () {
  'use strict';
  var T = window.THREE, S = null;

  function init(el) {
    var r = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.outputEncoding = T.sRGBEncoding;
    r.setClearColor(0xeeeeee);
    el.appendChild(r.domElement);
    r.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;border-radius:6px';
    var scene = new T.Scene(), cam = new T.PerspectiveCamera(45, 1, 0.05, 200);
    var ctl = new T.OrbitControls(cam, r.domElement);
    ctl.enableDamping = true; ctl.maxPolarAngle = Math.PI * 0.49; ctl.minDistance = 1; ctl.maxDistance = 60;
    var group = new T.Group(); scene.add(group);
    S = { el: el, r: r, scene: scene, cam: cam, ctl: ctl, group: group, fitted: false, running: false };
    new ResizeObserver(resize).observe(el); resize();
    loop();
  }
  function resize() {
    if (!S) return; var w = S.el.clientWidth || 600, h = S.el.clientHeight || 400;
    S.r.setSize(w, h, false); S.cam.aspect = w / h; S.cam.updateProjectionMatrix();
  }
  function loop() {
    if (!S || S.running) return; S.running = true;
    (function tick() {
      if (!S.el.isConnected) { S.running = false; return; }
      requestAnimationFrame(tick);
      if (S.el.offsetParent === null) return; // вкладка 3D скрыта — не рисуем
      S.ctl.update(); S.r.render(S.scene, S.cam);
    })();
  }

  // Текстура из сетки значений: fill — заполнить пустые клетки соседями (чтобы край не темнел при сглаживании)
  function dataTex(vals, w, h, mask, color) {
    var v = Float32Array.from(vals), m = mask ? Uint8Array.from(mask) : null;
    if (m) for (var pass = 0; pass < 3; pass++) {
      var add = [];
      for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) {
        var k = j * w + i; if (m[k]) continue;
        var s = 0, n = 0;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (o) { var x = i + o[0], y = j + o[1]; if (x >= 0 && y >= 0 && x < w && y < h && m[y * w + x]) { s += v[y * w + x]; n++; } });
        if (n) add.push([k, s / n]);
      }
      add.forEach(function (a) { v[a[0]] = a[1]; m[a[0]] = 1; });
    }
    var data = new Uint8Array(w * h * 4);
    for (var k2 = 0; k2 < w * h; k2++) { var c = color(v[k2]); data[k2 * 4] = c[0]; data[k2 * 4 + 1] = c[1]; data[k2 * 4 + 2] = c[2]; data[k2 * 4 + 3] = 255; }
    var t = new T.DataTexture(data, w, h, T.RGBAFormat);
    t.magFilter = T.LinearFilter; t.minFilter = T.LinearFilter; t.encoding = T.sRGBEncoding; t.needsUpdate = true;
    return t;
  }
  function glowTex() {
    if (S.glow) return S.glow;
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,240,200,1)'); gr.addColorStop(0.3, 'rgba(255,225,160,.45)'); gr.addColorStop(1, 'rgba(255,220,150,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (S.glow = new T.CanvasTexture(c));
  }
  function clear() {
    S.group.children.slice().forEach(function (o) {
      S.group.remove(o);
      o.traverse(function (x) { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map && x.material.map !== S.glow) x.material.map.dispose(); x.material.dispose(); } });
    });
  }

  // d: {poly, H, wp, refl, res, surf, lums:[{x,y,z,type,flux}], norm, mode:'real'|'map', colorAt(t), scaleMax}
  function render(d) {
    if (!S) return;
    clear();
    var poly = d.poly, H = d.H, g = d.res.grid;
    var warm = [1, 0.96, 0.89]; // тёплый белый
    // «как будет выглядеть»: яркость поверхности = освещённость × отражение, мягкая кривая (как экспозиция камеры);
    // опорная яркость — пол с отражением 0,3 при норме даёт ~80 % белого. hue — цвет материала (без учёта ρ).
    function shade(hue, rho) {
      var K = 0.3 * Math.max(d.norm, 30);
      return function (E) { var l = rho * E, v = Math.min(1, l / (l + K) * 1.6); return [0, 1, 2].map(function (i) { return Math.round(255 * Math.min(1, hue[i] * warm[i] * v)); }); };
    }
    function mapC(E) { return d.colorAt(E / d.scaleMax); }
    var real = d.mode !== 'map';
    var WOOD = [0.9, 0.74, 0.56], WHITE = [1, 1, 0.98];

    // пол и потолок — по контуру комнаты, UV = координаты в сетке расчёта
    var shape = new T.Shape(poly.map(function (p) { return new T.Vector2(p[0], p[1]); }));
    function plane(y, vals, color, side) {
      var geo = new T.ShapeGeometry(shape), uv = geo.attributes.uv, pos = geo.attributes.position;
      for (var i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - g.x0) / (g.nx * g.sx), (pos.getY(i) - g.y0) / (g.ny * g.sy));
      geo.rotateX(Math.PI / 2); geo.translate(0, y, 0); // (x,y) плана → (x, высота, y); нормаль вниз
      var m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: dataTex(vals, g.nx, g.ny, g.mask, color), side: side }));
      S.group.add(m);
    }
    plane(0, g.E, real ? shade(WOOD, d.refl[2]) : mapC, T.DoubleSide);           // пол (освещённость рабочей плоскости)
    plane(H, d.surf.ceiling, real ? shade(WHITE, d.refl[0]) : mapC, T.FrontSide); // потолок: виден только снизу

    // стены: текстура по сетке стены, видны только изнутри
    d.surf.walls.forEach(function (w) {
      var geo = new T.PlaneGeometry(w.L, H), th = Math.atan2(w.nx, w.ny);
      var dx = (w.b[0] - w.a[0]) / w.L, dy = (w.b[1] - w.a[1]) / w.L;
      if (Math.abs(Math.cos(th) - dx) > 1e-3 || Math.abs(-Math.sin(th) - dy) > 1e-3) { // локальная ось X смотрит от b к a — разворачиваем текстуру
        var uv = geo.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
      }
      var m = new T.Mesh(geo, new T.MeshBasicMaterial({ map: dataTex(w.E, w.cols, w.rows, null, real ? shade(WHITE, d.refl[1]) : mapC), side: T.FrontSide }));
      m.position.set((w.a[0] + w.b[0]) / 2, H / 2, (w.a[1] + w.b[1]) / 2); m.rotation.y = th;
      S.group.add(m);
    });
    // контур пола и верх стен — чтобы читалась форма
    var pts = []; poly.forEach(function (p, i) { var q = poly[(i + 1) % poly.length]; pts.push(p[0], 0.005, p[1], q[0], 0.005, q[1], p[0], H, p[1], q[0], H, q[1], p[0], 0, p[1], p[0], H, p[1]); });
    var lg = new T.BufferGeometry(); lg.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
    S.group.add(new T.LineSegments(lg, new T.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.6 })));

    // светильники: простые формы + свечение
    var bodyM = new T.MeshBasicMaterial({ color: 0x2b2b2b }), lightM = new T.MeshBasicMaterial({ color: 0xfff4d8 });
    var offM = new T.MeshBasicMaterial({ color: 0xd8d8d8 });
    d.lums.forEach(function (l) {
      var o = new T.Group(), z = l.z, lightM0 = lightM;
      if (l.off) lightM = offM; // выключенная группа — без свечения
      if (l.type === 'pendant') {
        var cord = new T.Mesh(new T.CylinderGeometry(0.006, 0.006, Math.max(0.01, H - z), 6), bodyM); cord.position.y = (H + z) / 2; o.add(cord);
        var sh = new T.Mesh(new T.SphereGeometry(0.16, 20, 14), lightM); sh.position.y = z; o.add(sh);
      } else if (l.type === 'ceiling') {
        var dk = new T.Mesh(new T.CylinderGeometry(0.25, 0.25, 0.05, 32), lightM); dk.position.y = z - 0.03; o.add(dk);
      } else if (l.type === 'spot') {
        var sp = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 0.07, 16), bodyM); sp.position.y = z - 0.04; o.add(sp);
        var lens = new T.Mesh(new T.CircleGeometry(0.035, 16), lightM); lens.rotation.x = Math.PI / 2; lens.position.y = z - 0.076; o.add(lens);
      } else {
        var br = new T.Mesh(new T.BoxGeometry(0.14, 0.22, 0.14), lightM); br.position.y = z; o.add(br);
      }
      lightM = lightM0;
      if (l.off) { o.position.set(l.x, 0, l.y); S.group.add(o); return; }
      var sz = Math.min(1.4, 0.35 + Math.sqrt(l.flux) / 70);
      var sp2 = new T.Sprite(new T.SpriteMaterial({ map: glowTex(), blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 }));
      sp2.scale.set(sz, sz, 1); sp2.position.y = l.type === 'pendant' || l.type === 'wall' ? z : z - 0.08; o.add(sp2);
      o.position.set(l.x, 0, l.y);
      S.group.add(o);
    });

    if (!S.fitted || d.refit) fit(poly, H);
  }
  function fit(poly, H) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    poly.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    var cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, size = Math.max(x1 - x0, y1 - y0, H);
    S.ctl.target.set(cx, H * 0.35, cy);
    S.cam.position.set(cx - size * 0.12, H + size * 0.8, cy + size * 0.9);
    S.ctl.update(); S.fitted = true;
  }
  function snapshot() { if (!S) return null; S.ctl.update(); S.r.render(S.scene, S.cam); return S.r.domElement.toDataURL('image/jpeg', 0.9); }

  window.MLP3D = { init: init, render: render, snapshot: snapshot, ready: function () { return !!S; } };
})();

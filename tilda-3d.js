/*
 * 3D view for Tilda store product cards (moonlight-kg.store).
 *
 * Adds a «3D-модель» button over the gallery of products listed in
 * models.json (keyed by Tilda product uid = data-product-lid). The viewer
 * (<model-viewer>) and the model are loaded only when the button is pressed.
 * Products not in models.json are left untouched.
 *
 * Install: one line in Tilda → Site settings → Insert code → inside HEAD:
 *   <script src="https://cdn.jsdelivr.net/gh/<user>/<repo>@<tag>/tilda-3d.js" defer></script>
 */
(function () {
  "use strict";

  var MODEL_VIEWER =
    "https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js";
  var CARD_SELECTOR =
    ".t-store__product-popup[data-product-lid], .t-store__product-snippet[data-product-lid]";
  var script = document.currentScript;
  var BASE = script && script.src ? script.src.replace(/[^\/]*$/, "") : "./";

  var models = null;
  var overlay = null;

  function asset(path) {
    return /^https?:/.test(path) ? path : BASE + path;
  }

  // ---------------------------------------------------------------- styles
  var CSS = [
    ".ml3d-btn{position:absolute;left:12px;top:12px;z-index:5;display:inline-flex;align-items:center;gap:6px;",
    "padding:9px 14px;border:0;border-radius:5px;background:#000;color:#fff;cursor:pointer;",
    "font:600 13px/1 Arial,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.18)}",
    ".ml3d-btn:hover{background:#333}",
    ".ml3d-btn svg{width:16px;height:16px}",
    ".ml3d-overlay{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.55);",
    "display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}",
    ".ml3d-card{position:relative;width:min(960px,100%);height:min(760px,100%);background:#fff;",
    "border-radius:8px;overflow:hidden;display:flex;flex-direction:column}",
    ".ml3d-card model-viewer{flex:1;width:100%;min-height:0;background:#fff;--poster-color:#fff}",
    ".ml3d-bar{display:flex;justify-content:space-between;gap:12px;padding:12px 16px;",
    "border-top:1px solid #eee;font:13px/1.4 Arial,sans-serif;color:#555}",
    ".ml3d-bar b{color:#000}",
    ".ml3d-close{position:absolute;right:8px;top:8px;z-index:2;width:44px;height:44px;border:0;",
    "border-radius:50%;background:rgba(255,255,255,.9);cursor:pointer;font:28px/44px Arial,sans-serif;color:#000}",
    ".ml3d-progress{position:absolute;left:0;top:0;height:3px;background:#000;width:0;transition:width .2s}",
    "@media (max-width:640px){.ml3d-overlay{padding:0}.ml3d-card{width:100%;height:100%;border-radius:0}",
    ".ml3d-bar{flex-direction:column;gap:2px}}"
  ].join("");

  function addStyles() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ---------------------------------------------------------------- viewer
  var viewerLoading = null;
  function loadViewer() {
    if (window.customElements && customElements.get("model-viewer")) {
      return Promise.resolve();
    }
    if (!viewerLoading) {
      viewerLoading = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.type = "module";
        s.src = MODEL_VIEWER;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return viewerLoading;
  }

  function onKey(event) {
    // Capture phase, so Esc closes only the 3D window, not Tilda's popup under it.
    if (event.key === "Escape" && overlay) {
      event.stopImmediatePropagation();
      event.preventDefault();
      close();
    }
  }

  function close() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    window.removeEventListener("keydown", onKey, true);
  }

  function open(model) {
    close();
    overlay = document.createElement("div");
    overlay.className = "ml3d-overlay";
    overlay.innerHTML =
      '<div class="ml3d-card" role="dialog" aria-label="3D-модель">' +
      '<div class="ml3d-progress"></div>' +
      '<button class="ml3d-close" type="button" aria-label="Закрыть">×</button>' +
      '<model-viewer camera-controls auto-rotate auto-rotate-delay="1500" ' +
      'rotation-per-second="20deg" interaction-prompt="none" shadow-intensity="0.6" ' +
      'environment-image="neutral" exposure="1.1" touch-action="pan-y" ' +
      'camera-orbit="0deg 82deg auto" min-camera-orbit="auto 20deg auto" ' +
      'max-camera-orbit="auto 160deg auto"></model-viewer>' +
      '<div class="ml3d-bar"><span><b></b></span>' +
      "<span>Вращайте мышкой или пальцем, колёсико / два пальца — приблизить</span></div>" +
      "</div>";
    var viewer = overlay.querySelector("model-viewer");
    viewer.setAttribute("alt", model.title || "3D-модель товара");
    viewer.setAttribute("poster", asset(model.poster));
    overlay.querySelector(".ml3d-bar b").textContent =
      (model.title ? model.title + " · " : "") + (model.size || "");
    var progress = overlay.querySelector(".ml3d-progress");
    viewer.addEventListener("progress", function (e) {
      var p = e.detail.totalProgress;
      progress.style.width = p * 100 + "%";
      if (p >= 1) setTimeout(function () { progress.style.opacity = 0; }, 300);
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay || e.target.classList.contains("ml3d-close")) close();
    });
    window.addEventListener("keydown", onKey, true);
    document.body.appendChild(overlay);

    loadViewer().then(function () {
      viewer.setAttribute("src", asset(model.glb));
    }, function () {
      overlay.querySelector(".ml3d-bar span").textContent =
        "Не удалось загрузить 3D-просмотрщик. Попробуйте обновить страницу.";
    });
  }

  // ---------------------------------------------------------------- buttons
  var ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linejoin="round"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>';

  function decorate(card) {
    var model = models[card.getAttribute("data-product-lid")];
    if (!model || card.querySelector(".ml3d-btn")) return;
    var slider = card.querySelector(".js-store-prod-slider");
    if (!slider) return;
    if (getComputedStyle(slider).position === "static") slider.style.position = "relative";
    var button = document.createElement("button");
    button.type = "button";
    button.className = "ml3d-btn";
    button.innerHTML = ICON + "<span>3D-модель</span>";
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      open(model);
    });
    slider.appendChild(button);
  }

  var queued = false;
  function scan() {
    queued = false;
    var cards = document.querySelectorAll(CARD_SELECTOR);
    for (var i = 0; i < cards.length; i++) decorate(cards[i]);
  }

  function start(map) {
    models = map || {};
    if (!Object.keys(models).length) return;
    addStyles();
    scan();
    new MutationObserver(function () {
      if (!queued) {
        queued = true;
        requestAnimationFrame(scan);
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    fetch(BASE + "models.json")
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(start, function () {});
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

# 3D-модели в карточках moonlight-kg.store

Кнопки «3D-модель» (просмотр) и «Скачать 3D» (ZIP для дизайнеров) на галерее
товаров Тильды. Файлы раздаёт jsDelivr прямо из этого репозитория.

- `tilda-3d.js` — скрипт для сайта (ищет попап товара по `data-product-lid`).
- `models.json` — какие товары с моделями: ключ = ID товара в Тильде
  (в каталоге: карточка товара → внизу «Идентификатор товара»).
- `<КОД>/` — `<КОД>.glb` (для просмотра), `poster.webp`, `<КОД>_3d.zip`.

## Подключение в Тильде (один раз)

Настройки сайта → Вставка кода → HTML-код для вставки внутрь HEAD:

```html
<!-- 3D-модели в карточках товаров: github.com/iloveganter-cpu/moonlight-3d -->
<script>(function(){var s=document.createElement('script');s.defer=true;s.src='https://cdn.jsdelivr.net/gh/iloveganter-cpu/moonlight-3d@main/tilda-3d.js?d='+new Date().toISOString().slice(0,10);document.head.appendChild(s);})();</script>
```

После сохранения — переопубликовать все страницы.

## Новая модель

Исходники моделей — `~/3d/ambrella-light/<КОД>/build_*.py`.

```bash
BL="C:/Program Files/Blender Foundation/Blender 5.2/blender.exe"
cd ~/3d/ambrella-light
# 1. веб-модель (запекает мрамор) и сжатие
"$BL" -b --factory-startup -P export_web.py -- <КОД>/build_<код>.py web/<КОД>/raw.glb
npx -y @gltf-transform/cli@4 optimize web/<КОД>/raw.glb web/<КОД>/<КОД>.glb \
    --compress draco --texture-compress webp --texture-size 1024 --simplify false
# 2. архив для дизайнеров (FBX + OBJ для 3ds Max, текстура, README)
"$BL" -b --factory-startup -P export_designer.py -- <КОД>/build_<код>.py <КОД> web/<КОД> "<размеры>"
# 3. постер: рендер hero.py с прозрачным фоном → web/<КОД>/poster.webp
```

Добавить запись в `models.json`, затем:

```bash
cd web && git add -A && git commit -m "Add <КОД>" && git push
for f in tilda-3d.js models.json; do curl -s https://purge.jsdelivr.net/gh/iloveganter-cpu/moonlight-3d@main/$f; done
```

Тильду трогать не нужно. Посетители увидят модель сразу после сброса кэша
(постоянные — не позже чем через сутки).

Если меняется уже выложенный файл модели — дать ему новое имя (или
`?v=2` в models.json), иначе браузеры держат старый до 7 дней.

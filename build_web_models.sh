#!/usr/bin/env bash
# Build site assets (GLB + poster) for models listed below.
#   bash build_web_models.sh [CODE ...]     (default: all in the table)
# Each row: CODE  build-script  poster-azimuth-deg  poster-cam-z  target-z  dist
# Poster camera mirrors the viewer's start (models.json "orbit"):
#   azimuth = theta - 90, cam-z = target + dist * tan(90deg - phi).
set -euo pipefail
cd "$(dirname "$0")/.."
BL="C:/Program Files/Blender Foundation/Blender 5.2/blender.exe"
PY="/c/Users/user/AppData/Local/Python/pythoncore-3.14-64/python.exe"

TABLE='
LH56063 LH56063/build_lh56063.py -90 0.83 0.376 2.6
LH56064 LH56064/build_lh56064.py -90 0.88 0.376 2.9
LH56057 LH56057/build_lh56057.py -90 0.83 0.376 2.6
LH56058 LH56058/build_lh56058.py -90 0.88 0.376 2.9
LH56066 LH56066/build_lh56066.py -55 0.26 0.155 1.2
LH56061 LH56061/build_lh56061.py -55 0.26 0.155 1.2
LH31115 LH31115/build_lh31115.py -60 0.22 0.125 1.1
'

want=" $* "
echo "$TABLE" | while read -r code build az camz tz dist; do
  [ -z "$code" ] && continue
  if [ $# -gt 0 ] && [[ "$want" != *" $code "* ]]; then continue; fi
  out="web/$code"; mkdir -p "$out"
  "$BL" -b --factory-startup -P export_web.py -- "$build" "$out/raw.glb" 2>&1 \
    | grep -E "Error|Traceback|WEB_EXPORTED" || true
  npx -y @gltf-transform/cli@4 optimize "$out/raw.glb" "$out/$code.glb" \
    --compress draco --texture-compress webp --texture-size 1024 --simplify false 2>&1 \
    | grep -E "info:|error" || true
  "$BL" -b --factory-startup -P LH53293/hero.py -- "$build" "$PWD/$out/poster.png" 96 \
    --azimuth "$az" --cam-z "$camz" --target-z "$tz" --dist "$dist" 2>&1 \
    | grep -E "Error|Traceback" || true
  "$PY" - "$out" <<'EOF'
import sys
from PIL import Image
out = sys.argv[1]
im = Image.open(out + "/poster.png").convert("RGBA")
im = im.crop(im.getbbox())
im.thumbnail((900, 900))
side = max(im.size)
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
canvas.save(out + "/poster.webp", quality=82)
EOF
  rm -f "$out/poster.png"
  echo "DONE $code: $(du -k "$out/$code.glb" | cut -f1) KB glb, $(du -k "$out/poster.webp" | cut -f1) KB poster"
done

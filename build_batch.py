"""Build web assets for rows of web/batch.tsv and merge them into models.json.
   python web/build_batch.py [CODE ...]   (default: all rows)
Poster camera mirrors the viewer start orbit: azimuth = theta - 90,
cam_z = target + dist * tan(90 - phi)."""
import json, math, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WEB = os.path.join(ROOT, "web")
BL = "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe"
rows = []
for line in open(os.path.join(WEB, "batch.tsv"), encoding="utf8"):
    if line.strip() and not line.startswith("#"):
        rows.append(line.rstrip("\n").split("\t"))
want = set(sys.argv[1:])
models = json.load(open(os.path.join(WEB, "models.json"), encoding="utf8"))
for code, uid, size, orbit, build, dist, tz in rows:
    if want and code not in want:
        continue
    th, ph = map(float, orbit.split())
    dist, tz = float(dist), float(tz)
    out = os.path.join(WEB, code.replace("/", "_"))
    os.makedirs(out, exist_ok=True)
    name = code.replace("/", "_")
    r = subprocess.run([BL, "-b", "--factory-startup", "-P", os.path.join(ROOT, "export_web.py"), "--",
                        os.path.join(ROOT, build), os.path.join(out, "raw.glb")], capture_output=True, text=True, errors="replace")
    if "WEB_EXPORTED" not in r.stdout:
        print(code, "EXPORT FAILED", r.stdout[-1500:], r.stderr[-800:]); continue
    subprocess.run("npx -y @gltf-transform/cli@4 optimize raw.glb %s.glb --compress draco "
                   "--texture-compress webp --texture-size 1024 --simplify false" % name,
                   cwd=out, shell=True, capture_output=True)
    camz = tz + dist * math.tan(math.radians(90 - ph))
    subprocess.run([BL, "-b", "--factory-startup", "-P", os.path.join(ROOT, "LH53293", "hero.py"), "--",
                    os.path.join(ROOT, build), os.path.join(out, "poster.png"), "96",
                    "--azimuth", str(th - 90), "--cam-z", "%.3f" % camz, "--target-z", str(tz),
                    "--dist", str(dist)], capture_output=True)
    from PIL import Image
    im = Image.open(os.path.join(out, "poster.png")).convert("RGBA")
    im = im.crop(im.getbbox()); im.thumbnail((900, 900))
    side = max(im.size); cv = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    cv.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    cv.save(os.path.join(out, "poster.webp"), quality=82)
    os.remove(os.path.join(out, "poster.png"))
    models[uid] = {"title": "Ambrella " + code, "size": size, "glb": "%s/%s.glb" % (name, name),
                   "poster": "%s/poster.webp" % name, "orbit": "%gdeg %gdeg auto" % (th, ph)}
    kb = os.path.getsize(os.path.join(out, name + ".glb")) // 1024
    print("DONE", code, kb, "KB", flush=True)
json.dump(models, open(os.path.join(WEB, "models.json"), "w", encoding="utf8"), ensure_ascii=False, indent=2)

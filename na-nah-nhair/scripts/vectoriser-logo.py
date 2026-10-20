# Vectorise le logo (assets/logo/logo-na-nah-nhair.jpg) sans redessiner les lettres :
#   - public/images/logo-na-nah-nhair.svg : logo sur trois lignes (violet du logo)
#   - lib/brand-glyphs.ts : « Na Nah N’hair » sur une ligne, pour le composant BrandName
# Usage : pip install potracer pillow numpy && python3 scripts/vectoriser-logo.py
import json
import numpy as np
import potrace
from PIL import Image

im = np.asarray(Image.open("assets/logo/logo-na-nah-nhair.jpg").convert("RGB")).astype(float)
bg, fg = np.array([0xF1, 0xE1, 0xB0]), np.array([0x80, 0x76, 0xB3])
mask = np.linalg.norm(im - bg, axis=2) / np.linalg.norm(fg - bg) > 0.5
curves = []
for c in potrace.Bitmap(mask).trace(turdsize=10, alphamax=1.0, opticurve=True, opttolerance=0.2):
    pts = [c.start_point] + [s.end_point for s in c.segments]
    d = f"M{c.start_point.x:.1f} {c.start_point.y:.1f}"
    for s in c.segments:
        if s.is_corner:
            d += f"L{s.c.x:.1f} {s.c.y:.1f}L{s.end_point.x:.1f} {s.end_point.y:.1f}"
        else:
            d += f"C{s.c1.x:.1f} {s.c1.y:.1f} {s.c2.x:.1f} {s.c2.y:.1f} {s.end_point.x:.1f} {s.end_point.y:.1f}"
    xs, ys = [p.x for p in pts], [p.y for p in pts]
    if max(xs) - min(xs) < 1500:  # ignore le cadre de l'image
        curves.append({"d": d + "Z", "minx": min(xs), "maxx": max(xs), "miny": min(ys), "maxy": max(ys)})

lines = {1: [], 2: [], 3: []}
for c in curves:
    if c["minx"] > 1450:
        continue  # point d'exclamation : seulement dans le logo complet
    cy = (c["miny"] + c["maxy"]) / 2
    lines[1 if cy < 650 else 2 if cy < 1000 else 3].append(c)

minx, maxx = min(c["minx"] for c in curves), max(c["maxx"] for c in curves)
miny, maxy = min(c["miny"] for c in curves), max(c["maxy"] for c in curves)
vb = f"{minx - 4:.0f} {miny - 4:.0f} {maxx - minx + 8:.0f} {maxy - miny + 8:.0f}"
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="Na Nah N’hair !">'
    f'<title>Na Nah N’hair !</title><path fill="#8076B3" fill-rule="evenodd" d="{"".join(c["d"] for c in curves)}"/></svg>\n'
)
open("public/images/logo-na-nah-nhair.svg", "w").write(svg)
open("assets/logo/logo-na-nah-nhair.svg", "w").write(svg)

n_top, n_height = {1: 344, 2: 699, 3: 1053}, 265  # haut et hauteur du « N » de chaque ligne
gap = 0.30 * n_height
x, groups, top, bottom = 0, [], 0, 0
for i in (1, 2, 3):
    L = lines[i]
    lx0, lx1 = min(c["minx"] for c in L), max(c["maxx"] for c in L)
    groups.append({"x": round(x - lx0, 1), "y": -n_top[i], "d": "".join(c["d"] for c in L)})
    top = min(top, min(c["miny"] for c in L) - n_top[i])
    bottom = max(bottom, max(c["maxy"] for c in L) - n_top[i])
    x += (lx1 - lx0) + gap
width = x - gap
open("lib/brand-glyphs.ts", "w").write(
    "// Lettres du logo (assets/logo/logo-na-nah-nhair.jpg), vectorisées sans être redessinées,\n"
    "// recomposées sur une ligne : « Na Nah N’hair ». Généré par scripts/vectoriser-logo.py.\n"
    "export const brandGlyphs = {\n"
    f'  viewBox: "0 {top - 2:.0f} {width:.0f} {bottom - top + 4:.0f}",\n'
    "  // hauteur des capitales (N) / hauteur totale : sert à aligner le nom sur le texte voisin\n"
    f"  capRatio: {n_height / (bottom - top + 4):.3f},\n"
    f"  groups: {json.dumps(groups)},\n"
    "};\n"
)
print("ok", vb, width)

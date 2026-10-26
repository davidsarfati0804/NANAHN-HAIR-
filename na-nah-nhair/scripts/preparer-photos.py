# Prépare les photos du site à partir de assets/images/*.jpg (originaux intacts dans assets/sources/photos/).
# Aucun filtre ni retouche : on retire seulement du fond blanc autour du sujet (jamais le flacon ni l'étiquette),
# pour que les trois flacons aient la même taille visuelle dans un même format 4:5.
# Usage : python3 scripts/preparer-photos.py
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps

SRC, OUT = Path("assets/images"), Path("public/images/produits")
OUT.mkdir(parents=True, exist_ok=True)
RATIO = 4 / 5  # largeur / hauteur
WIDTHS = (400, 800, 1200)
# Part de la hauteur occupée par le sujet : identique pour les trois flacons
# Les flacons seuls utilisent désormais les détourages (scripts/preparer-detoures.py) : seul le pack reste ici
FILL = {"pack": 0.92}

for name, fill in FILL.items():
    im = ImageOps.exif_transpose(Image.open(SRC / f"{name}.jpg")).convert("RGB")
    a = np.asarray(im).astype(int)
    # Couleur du fond = médiane des bords de la photo
    border = np.concatenate([a[:20].reshape(-1, 3), a[-20:].reshape(-1, 3), a[:, :20].reshape(-1, 3), a[:, -20:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    # Sujet = pixels nettement différents du fond ; lignes et colonnes où le sujet est réellement présent
    mask = np.abs(a - bg).max(axis=2) > 40
    rows = np.where(mask.sum(axis=1) > mask.shape[1] * 0.01)[0]
    cols = np.where(mask.sum(axis=0) > mask.shape[0] * 0.01)[0]
    y0, y1, x0, x1 = rows.min(), rows.max(), cols.min(), cols.max()
    h = y1 - y0
    canvas_h = int(h / fill)
    canvas_w = int(canvas_h * RATIO)
    if canvas_w < (x1 - x0) / 0.9:  # sujet large (pack) : on agrandit le cadre
        canvas_w = int((x1 - x0) / 0.9)
        canvas_h = int(canvas_w / RATIO)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    canvas = Image.new("RGB", (canvas_w, canvas_h), tuple(int(v) for v in bg))
    left, top = cx - canvas_w // 2, cy - canvas_h // 2
    canvas.paste(im, (-left, -top))
    # Bords éventuellement hors photo : couleur du fond de la photo
    for w in WIDTHS:
        r = canvas.resize((w, int(w / RATIO)), Image.LANCZOS)
        r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=82, method=6)
        r.save(OUT / f"{name}-{w}.jpg", "JPEG", quality=84, optimize=True, progressive=True)
    print(name, "sujet", (x1 - x0, h), "→ cadre", (canvas_w, canvas_h))

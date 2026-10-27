# Flacons détourés (fond transparent, modifications 40, 51 et 55 : version 3), à partir de assets/images/<soin>.png :
# WebP qualité 90 en 160 / 320 px et pleine résolution, PNG pleine résolution en secours.
# Jamais d'agrandissement : la plus grande version est la taille du fichier fourni. Images non retouchées.
# (Le premier écran de l'accueil garde ses fichiers <soin>-accueil-*, version de référence du 24/10/2026,
#  sources dans assets/sources/detoures-accueil/ ; Miraculous y est remplacé par le fichier de la modification 56.)
# Usage : python3 scripts/preparer-detoures.py (depuis na-nah-nhair/)
from pathlib import Path
from PIL import Image

SRC = Path("assets/images")
OUT = Path("public/images/produits")
OUT.mkdir(parents=True, exist_ok=True)
for slug in ["fabulous", "miraculous", "luxurious"]:
    im = Image.open(SRC / f"{slug}.png").convert("RGBA")
    full_w, full_h = im.size
    for w in (160, 320, full_w):
        r = im if w == full_w else im.resize((w, round(full_h * w / full_w)), Image.LANCZOS)
        name = "max" if w == full_w else str(w)
        r.save(OUT / f"{slug}-detoure-{name}.webp", quality=90, method=6)
    # Secours : PNG pleine résolution, sans perte
    im.save(OUT / f"{slug}-detoure-max.png", optimize=True)
    print(slug, full_w, full_h)

# Image de partage (Open Graph, modification 55) : le flacon v3 posé sur la couleur du soin, 1200 x 1500 JPG
COLORS = {"fabulous": (0xB2, 0xDC, 0xCB), "miraculous": (0xB9, 0xA5, 0xE2), "luxurious": (0xEB, 0xC4, 0xDE)}  # = lib/design-tokens.ts
for slug, color in COLORS.items():
    im = Image.open(SRC / f"{slug}.png").convert("RGBA")
    canvas = Image.new("RGBA", (1200, 1500), color + (255,))
    h = round(1500 * 0.8)
    w = round(im.width * h / im.height)
    # Jamais d'agrandissement au-delà du fichier fourni : on garde sa taille si elle est plus petite
    if h > im.height:
        h, w = im.height, im.width
    bottle = im if (w, h) == im.size else im.resize((w, h), Image.LANCZOS)
    canvas.alpha_composite(bottle, ((1200 - w) // 2, (1500 - h) // 2))
    canvas.convert("RGB").save(OUT / f"{slug}-partage.jpg", quality=88)

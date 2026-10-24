# Photos détourées (fond transparent) du premier écran de l'accueil (modification 22) :
# versions web 240 / 480 / 720 px de large en WebP et PNG (transparence conservée, image non retouchée).
# Usage : python3 scripts/preparer-detoures.py (depuis na-nah-nhair/)
from pathlib import Path
from PIL import Image

SRC = Path("assets/images")
OUT = Path("public/images/produits")
OUT.mkdir(parents=True, exist_ok=True)
for slug in ["fabulous", "miraculous", "luxurious"]:
    im = Image.open(SRC / f"{slug}.png").convert("RGBA")
    im = im.crop(im.getchannel("A").getbbox())
    for w in (240, 480, 720):
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(OUT / f"{slug}-detoure-{w}.webp", quality=88, method=6)
        # PNG de secours (navigateurs sans WebP) : 256 couleurs, transparence conservée
        r.quantize(256, method=Image.Quantize.FASTOCTREE).save(OUT / f"{slug}-detoure-{w}.png", optimize=True)
        print(slug, w, h)

"""Ріже фон героя з одного оригіналу: десктоп 16:9 і вертикальний під телефон.

Запуск з кореня проєкту:  python3 design/hero/generate.py
Потрібен Pillow:          python3 -m pip install pillow

Щоб підставити інший кадр — поклади його як design/hero/source.png.
Ця папка поза public/, тож ані оригінал, ані цей скрипт у збірку не потрапляють.
"""

import os
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "source.png")
OUT = os.path.join(HERE, "..", "..", "public", "hero")

src = Image.open(SRC).convert("RGB")
# Дзеркалимо: вікно йде вправо, темніший кут (шафа, підлокітник) — вліво,
# саме туди, де на десктопі лягає заголовок. Тексту в кадрі немає,
# тож дзеркало непомітне.
src = ImageOps.mirror(src)
W, H = src.size


def cut(box, size, name, quality):
    src.crop(box).resize(size, Image.LANCZOS).save(
        os.path.join(OUT, name), "WEBP", quality=quality, method=6
    )


# Десктоп 16:9 — на всю ширину, трохи зрізаємо стелю
top = 96
cut((0, top, W, top + 864), (1920, 1080), "hero.webp", 82)

# Телефон 2:3 — вертикальна смуга по центру дивана.
# Трохи зрізаємо стелю згори, щоб диван піднявся у кадрі.
mtop = 82
mh = H - mtop
mw = round(mh * 1080 / 1620)
cx = 750  # центр кропу (координати вже дзеркальні)
left = max(0, min(W - mw, cx - mw // 2))
cut((left, mtop, left + mw, H), (1080, 1620), "hero-mobile.webp", 86)

for n in ("hero.webp", "hero-mobile.webp"):
    im = Image.open(os.path.join(OUT, n))
    kb = os.path.getsize(os.path.join(OUT, n)) // 1024
    print(f"{n}: {im.size[0]}x{im.size[1]}, {kb} КБ")

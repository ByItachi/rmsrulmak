# -*- coding: utf-8 -*-
"""Hero banner'larin mobil (3:2) kirpmalarini uretir — metin bloğuna gore hizalanir.

2560x853 kaynaklardan 1280x853 (3:2) kirpmi; kirpma penceresi her slaytin
yazi blok merkezine gore secilir (sol/sag kompozisyon farki).
"""
from PIL import Image
from pathlib import Path

SRC = Path('artifacts/rms-rulmak-platform/public/hero')
DST = SRC / 'mobile'
DST.mkdir(exist_ok=True)

# slide -> kirpma sol kenari (px, 2560 uzerinden). 3:2 icin genislik 1280.
CROPS = {
    'slide-gates.jpg': 947,    # yazi sagda (%46-78)
    'slide-koyo.jpg': 0,       # yazi solda (%7-37)
    'slide-nsk.jpg': 0,        # yazi solda (%3-40)
    'slide-schaeffler.jpg': 26,  # yazi solda (%4-48)
    'slide-ntn.jpg': 1165,     # yazi sagda (%53-88)
    'slide-timken.jpg': 10,    # yazi solda (%4-47)
}

W = 1280
for name, left in CROPS.items():
    img = Image.open(SRC / name)
    assert img.size == (2560, 853), f'{name}: {img.size}'
    crop = img.crop((left, 0, left + W, 853))
    crop.save(DST / name, quality=82, optimize=True)
    kb = (DST / name).stat().st_size / 1024
    print(f'{name}: sol={left} -> {W}x853 ({kb:.0f} KB)')
print('OK')

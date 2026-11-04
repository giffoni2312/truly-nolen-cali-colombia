"""Puts the real Truly Nolen emblem on a shirt as an embroidered patch (not a flat sticker).

Usage: uv run --with pillow --with numpy --with opencv-python-headless python tools/bordado.py
       <photo> <emblem.png> <out> <cx> <cy> <height_px> <angle_deg> [squash]

Embroidery look, built at 4x and scaled down:
  - satin-stitch texture (fine diagonal threads) on every color of the emblem
  - merrow border: a darker gold stitched edge around the patch
  - raised relief lit from the top-left, plus small relief on the ears, letters and tail
  - a soft shadow of the patch on the fabric, and the fabric's own light and folds over the patch
"""
import sys
import numpy as np
import cv2
from PIL import Image

src, emb_path, out = sys.argv[1:4]
cx, cy, h = float(sys.argv[4]), float(sys.argv[5]), int(sys.argv[6])
ang = float(sys.argv[7])
squash = float(sys.argv[8]) if len(sys.argv) > 8 else 1.0
K = 4  # supersampling

photo = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
emb = Image.open(emb_path).convert('RGBA')
emb = emb.crop(emb.getbbox())
H4 = h * K
W4 = round(emb.width * H4 / emb.height * squash)
pad = 6 * K
e = np.asarray(emb.resize((W4, H4), Image.LANCZOS)).astype(np.float32)
e = np.pad(e, ((pad, pad), (pad, pad), (0, 0)))
rgb, a = e[..., :3], e[..., 3] / 255.0
hh, ww = a.shape

# Merrow border: a stitched ring just outside the patch, darker gold.
ring_w = max(2, int(0.9 * K))
grown = cv2.dilate((a > 0.5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * ring_w + 1, 2 * ring_w + 1)))
inner = cv2.erode((a > 0.5).astype(np.uint8), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (ring_w + 1, ring_w + 1)))
ring = (grown > 0) & (inner == 0)
rgb = rgb.copy()
rgb[ring] = (214, 168, 18)
alpha = np.maximum(a, cv2.GaussianBlur(grown.astype(np.float32), (0, 0), 0.6 * K))

# Satin stitches: fine diagonal threads, a second direction on the border (twisted thread).
yy, xx = np.mgrid[0:hh, 0:ww].astype(np.float32)
period = 2.2 * K
sat = np.sin((xx * np.cos(0.7) + yy * np.sin(0.7)) * 2 * np.pi / period)
sat_b = np.sin((xx * np.cos(-0.7) + yy * np.sin(-0.7)) * 2 * np.pi / (1.6 * K))
tex = np.where(ring, 1 + 0.10 * sat_b, 1 + 0.07 * sat)
rng = np.random.default_rng(11)
tex = tex * (1 + rng.normal(0, 0.025, tex.shape))

# Relief: the whole patch is raised (light from the top-left), and so are the shapes inside it.
height = cv2.GaussianBlur(alpha, (0, 0), 1.6 * K)
gy, gx = np.gradient(height)
light = 1 + (-gx - gy) * 6.0
lum = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32) / 255
lum_h = cv2.GaussianBlur(lum, (0, 0), 0.8 * K)
ly, lx = np.gradient(lum_h)
light = light * (1 + (-lx - ly) * 2.5)
col = rgb * tex[..., None] * np.clip(light, 0.7, 1.3)[..., None]
gray = col.mean(axis=2, keepdims=True)
col = gray + (col - gray) * 0.9  # thread is a little less saturated than print

# Rotate with the torso.
M = cv2.getRotationMatrix2D((ww / 2, hh / 2), ang, 1.0)
col = cv2.warpAffine(col, M, (ww, hh), flags=cv2.INTER_CUBIC)
alpha = cv2.warpAffine(alpha, M, (ww, hh), flags=cv2.INTER_CUBIC)

# Back to photo scale.
w1, h1 = round(ww / K), round(hh / K)
col1 = cv2.resize(col, (w1, h1), interpolation=cv2.INTER_AREA)
a1 = np.clip(cv2.resize(alpha, (w1, h1), interpolation=cv2.INTER_AREA), 0, 1)
x0, y0 = round(cx - w1 / 2), round(cy - h1 / 2)
reg = photo[y0:y0 + h1, x0:x0 + w1]

# Shadow of the patch on the fabric.
sh = cv2.GaussianBlur(a1, (0, 0), 0.9)
sh = np.roll(np.roll(sh, 1, axis=0), 1, axis=1)
reg_sh = reg * (1 - 0.16 * sh[..., None])

# The fabric's light and folds also fall on the patch.
fl = cv2.cvtColor(reg.astype(np.uint8), cv2.COLOR_RGB2GRAY).astype(np.float32)
fl = cv2.GaussianBlur(fl, (0, 0), 2.0)
shade = np.clip(fl / max(fl.mean(), 1), 0.8, 1.12)[..., None]
patch = col1 * shade * 0.97 + rng.normal(0, 2.5, col1.shape)  # same grain as the photo
res = patch * a1[..., None] + reg_sh * (1 - a1[..., None])
photo[y0:y0 + h1, x0:x0 + w1] = res
Image.fromarray(photo.clip(0, 255).astype(np.uint8)).save(out)
print('ok', out, w1, h1)

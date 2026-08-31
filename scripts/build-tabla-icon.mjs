/**
 * Builds the Golden Tabla Club hero mark from the supplied artwork.
 *
 * The source is an opaque PNG: gold artwork sitting on a white sheet with a
 * faint checkerboard printed into it. Dropped straight onto the club's paper
 * background that reads as a white box with a grid in it, so the background is
 * keyed out here rather than at runtime.
 *
 * The key uses saturation, not brightness. The artwork is gold — strongly
 * saturated everywhere including its bright gradient highlights — while the
 * sheet and the checkerboard are neutral. A brightness key would eat the
 * highlights inside the cart body; a saturation key keeps them.
 */

import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = process.argv[2] ?? "C:/Users/ademb/Downloads/TABLA ICON.png";
const OUT_DIR = "public/images";
const BASE = "golden-tabla-club-mark";
const WIDTHS = [420, 640, 900];

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const keyed = Buffer.alloc(width * height * 4);

for (let i = 0, o = 0; i < data.length; i += channels, o += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  // A little darkness still counts, so the thin motion lines and the wheel
  // spokes — which are close to neutral where they fade out — do not vanish.
  // It only starts below the sheet's own tone, or the printed checkerboard
  // would key in as a faint grid across the whole mark.
  const darkness = Math.max(0, 1 - max / 255 - 0.12);
  const raw = Math.max(saturation * 4.2, darkness * 3);
  const alpha = raw < 0.08 ? 0 : Math.min(1, raw);

  keyed[o] = r;
  keyed[o + 1] = g;
  keyed[o + 2] = b;
  keyed[o + 3] = Math.round(alpha * 255);
}

mkdirSync(OUT_DIR, { recursive: true });

const trimmed = await sharp(keyed, { raw: { width, height, channels: 4 } })
  .png()
  .trim({ threshold: 1 })
  .toBuffer({ resolveWithObject: true });

console.log(`source ${width}x${height} -> trimmed ${trimmed.info.width}x${trimmed.info.height}`);

for (const w of WIDTHS) {
  const file = path.join(OUT_DIR, `${BASE}-${w}.webp`);
  const out = await sharp(trimmed.data)
    .resize({ width: w, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 92, effort: 6 })
    .toFile(file);
  console.log(`${file} ${out.width}x${out.height} ${(out.size / 1024).toFixed(1)}kB`);
}

const fallback = path.join(OUT_DIR, `${BASE}.webp`);
const out = await sharp(trimmed.data)
  .resize({ width: WIDTHS[1], withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 92, effort: 6 })
  .toFile(fallback);
console.log(`${fallback} ${out.width}x${out.height} ${(out.size / 1024).toFixed(1)}kB`);

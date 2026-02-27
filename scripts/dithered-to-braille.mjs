#!/usr/bin/env node

// Convert a dithered PNG to Unicode braille art.
//
// Usage:
//   node scripts/dithered-to-braille.mjs [options]
//
// Options:
//   --input, -i    Source PNG (default: public/assets/arach-dithered.png)
//   --output, -o   Output text file (default: public/assets/arach-dithered.braille.txt)
//   --cols, -c     Target columns wide (default: 40)
//   --threshold -t Luminance threshold 0-255 (default: 100)
//   --invert       Swap dots/blanks
//   --stdout       Print to stdout only, skip file write

import sharp from "sharp";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { parseArgs } from "util";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { values: args } = parseArgs({
  options: {
    input:     { type: "string",  short: "i", default: resolve(__dirname, "../public/assets/arach-dithered.png") },
    output:    { type: "string",  short: "o", default: resolve(__dirname, "../public/assets/arach-dithered.braille.txt") },
    cols:      { type: "string",  short: "c", default: "40" },
    threshold: { type: "string",  short: "t", default: "100" },
    invert:    { type: "boolean", default: false },
    stdout:    { type: "boolean", default: false },
  },
  strict: true,
});

const targetCols = parseInt(args.cols, 10);
const threshold = parseInt(args.threshold, 10);

// Braille chars encode 2×4 pixel grids
const pxW = targetCols * 2;

// Read source and get its aspect ratio to compute height
const meta = await sharp(args.input).metadata();
const aspect = meta.height / meta.width;
const pxH = Math.round(pxW * aspect);

const { data, info } = await sharp(args.input)
  .resize(pxW, pxH, { fit: "contain", background: { r: 14, g: 14, b: 13, alpha: 1 } })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

const BRAILLE_BASE = 0x2800;
const DOT_MAP = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
];

function isLight(x, y) {
  if (x >= width || y >= height) return false;
  const i = (y * width + x) * channels;
  const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
  if (a < 128) return false;
  const lit = 0.299 * r + 0.587 * g + 0.114 * b > threshold;
  return args.invert ? !lit : lit;
}

const cols = Math.ceil(width / 2);
const rows = Math.ceil(height / 4);
const lines = [];

for (let row = 0; row < rows; row++) {
  let line = "";
  for (let col = 0; col < cols; col++) {
    const ox = col * 2;
    const oy = row * 4;
    let code = BRAILLE_BASE;
    for (let dy = 0; dy < 4; dy++) {
      for (let dx = 0; dx < 2; dx++) {
        if (isLight(ox + dx, oy + dy)) {
          code |= DOT_MAP[dy][dx];
        }
      }
    }
    line += String.fromCodePoint(code);
  }
  lines.push(line);
}

// Trim trailing blank braille lines
while (lines.length > 0 && lines[lines.length - 1].replace(/\u2800/g, "") === "") {
  lines.pop();
}

const result = lines.join("\n");

if (!args.stdout) {
  await writeFile(args.output, result, "utf-8");
  console.error(`${cols}×${lines.length} → ${args.output}`);
}

console.log(result);

#!/usr/bin/env node
/*
  Conversão de imagens para formatos mais leves (WebP/AVIF).
  Uso:
    node scripts/convert-images.js --format=webp --quality=82
    node scripts/convert-images.js --format=avif --quality=50
  Converte recursivamente a pasta public/img.
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const args = process.argv.slice(2);
const formatArg = args.find(a => a.startsWith('--format=')) || '--format=webp';
const qualityArg = args.find(a => a.startsWith('--quality=')) || '--quality=82';
const format = formatArg.split('=')[1];
const quality = parseInt(qualityArg.split('=')[1], 10);

const IMG_ROOT = path.resolve(__dirname, '..', 'public', 'img');
const VALID_EXT = new Set(['.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG']);

function targetExt() {
  if (format === 'avif') return '.avif';
  return '.webp';
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function walk(dir, files = []) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

function outPath(input) {
  const ext = path.extname(input);
  const base = input.slice(0, input.length - ext.length);
  return base + targetExt();
}

async function convertOne(input) {
  const ext = path.extname(input);
  if (!VALID_EXT.has(ext)) return { skipped: true, input };
  const output = outPath(input);
  try {
    const buf = sharp(input);
    if (format === 'avif') {
      await buf.avif({ quality: Number.isFinite(quality) ? quality : 50 }).toFile(output);
    } else {
      await buf.webp({ quality: Number.isFinite(quality) ? quality : 82 }).toFile(output);
    }
    return { ok: true, input, output };
  } catch (err) {
    return { ok: false, input, error: err };
  }
}

(async () => {
  console.log(`Convertendo imagens em: ${IMG_ROOT}`);
  console.log(`Formato: ${format} | Qualidade: ${quality}`);
  await ensureDir(IMG_ROOT);
  const files = await walk(IMG_ROOT);
  const results = await Promise.allSettled(files.map(convertOne));
  const stats = { converted: 0, skipped: 0, failed: 0 };
  for (const r of results) {
    if (r.status === 'fulfilled') {
      const v = r.value;
      if (v.skipped) stats.skipped++;
      else if (v.ok) stats.converted++;
      else stats.failed++;
    } else {
      stats.failed++;
    }
  }
  console.log(`Feito. Convertidas: ${stats.converted}, Puladas: ${stats.skipped}, Falhas: ${stats.failed}`);
})();
/*
  Otimiza imagens em public/img:
  - Converte JPG/PNG para WebP
  - Reduz dimensões (ex.: máx. 1600px de largura)
  - Logos em public/img/apoiadores ficam com altura padronizada
  - Gera saída em public/img-opt, mantendo estrutura de pastas
  - Cria um relatório com economia total

  Como usar:
    1) npm i -D sharp
    2) node scripts/optimize-images.js
*/

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.resolve(__dirname, '..', 'public', 'img');
const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'img-opt');

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']);

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function* walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function rel(p) {
  return path.relative(INPUT_DIR, p);
}

function isLogo(p) {
  return rel(p).startsWith('apoiadores') || rel(p).toLowerCase().includes('logo');
}

async function processImage(file) {
  const ext = path.extname(file);
  if (!SUPPORTED.has(ext)) return null;

  const relative = rel(file);
  const outDir = path.dirname(path.join(OUTPUT_DIR, relative));
  const outFile = path.join(outDir, path.basename(file, ext) + '.webp');

  await ensureDir(outDir);

  const inputBuf = await fs.promises.readFile(file);
  const inputSize = inputBuf.length;

  const img = sharp(inputBuf, { limitInputPixels: 268435456 }); // 16384^2
  const meta = await img.metadata();

  const pipeline = sharp(inputBuf);

  // Regras de resize
  if (isLogo(file)) {
    // Logos: altura padronizada, preservando transparência
    pipeline.resize({ height: 140, withoutEnlargement: true });
  } else if (meta.width && meta.width > 1600) {
    pipeline.resize({ width: 1600, withoutEnlargement: true });
  }

  // Conversão para WebP (qualidade equilibrada)
  pipeline.webp({ quality: 75, alphaQuality: 80 });

  const outputBuf = await pipeline.toBuffer();
  await fs.promises.writeFile(outFile, outputBuf);

  const outputSize = outputBuf.length;
  const savedKB = (inputSize - outputSize) / 1024;
  return { file, outFile, inputSize, outputSize, savedKB };
}

async function main() {
  console.log('➡️  Otimizando imagens...');
  await ensureDir(OUTPUT_DIR);

  const results = [];
  for await (const file of walk(INPUT_DIR)) {
    try {
      const r = await processImage(file);
      if (r) {
        results.push(r);
        console.log(`✓ ${rel(file)} -> ${path.relative(OUTPUT_DIR, r.outFile)} (${(r.outputSize/1024).toFixed(1)}KB)`);
      }
    } catch (err) {
      console.warn(`⚠️  Falha em ${rel(file)}:`, err.message);
    }
  }

  const totalSavedKB = results.reduce((sum, r) => sum + r.savedKB, 0);
  const totalInputKB = results.reduce((sum, r) => sum + r.inputSize/1024, 0);
  const totalOutputKB = results.reduce((sum, r) => sum + r.outputSize/1024, 0);

  const report = {
    filesProcessed: results.length,
    totalInputMB: +(totalInputKB/1024).toFixed(2),
    totalOutputMB: +(totalOutputKB/1024).toFixed(2),
    savedMB: +((totalSavedKB/1024)).toFixed(2)
  };

  const reportPath = path.join(OUTPUT_DIR, 'optimization-report.json');
  await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log('📄  Relatório salvo em', reportPath);
  console.log(`✅  Concluído: ${report.filesProcessed} arquivos | Economia: ${report.savedMB} MB`);
}

main().catch(err => {
  console.error('Erro geral:', err);
  process.exit(1);
});
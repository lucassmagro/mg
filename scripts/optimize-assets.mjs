import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";

const SRC = "assets/projetos/valley_business";
const OUT = "public/projetos/valley-business";

function slug(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/^25_204_/i, "")
    .replace(/_PH_/i, "")
    .replace(/_R\d+(\s*\(\d+\))?$/i, "")
    .replace(/_FINAL_?$/i, "")
    .replace(/_COM_DRONE/i, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^\d+_/, (m) => m) // keep leading numeric index for ordering
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensure(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function process(srcDir, outDir, maxEdge, quality) {
  await ensure(outDir);
  const files = (await fs.readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  const map = [];
  for (const file of files) {
    const out = slug(file) + ".jpg";
    const src = path.join(srcDir, file);
    const dest = path.join(outDir, out);
    const img = sharp(src).rotate();
    const meta = await img.metadata();
    await img
      .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(dest);
    const st = await fs.stat(dest);
    map.push({ from: file, to: out, kb: Math.round(st.size / 1024), w: meta.width, h: meta.height });
  }
  return map;
}

const imgs = await process(path.join(SRC, "imgs"), path.join(OUT, "imgs"), 2200, 80);
const capa = await process(path.join(SRC, "foto_capa"), path.join(OUT, "capa"), 2600, 82);
const plantas = await process(path.join(SRC, "plantas"), path.join(OUT, "plantas"), 2000, 82);

console.log("=== IMGS ===");
imgs.forEach((m) => console.log(m.to.padEnd(48), m.kb + "KB"));
console.log("\n=== CAPA ===");
capa.forEach((m) => console.log(m.to.padEnd(48), m.kb + "KB"));
console.log("\n=== PLANTAS ===");
plantas.forEach((m) => console.log(m.to.padEnd(48), m.kb + "KB"));

import sharp from "sharp";
import { promises as fs } from "fs";

const OUT = "public/logo";
const DENSITY = 200;

function stripBg(svg) {
  return svg.replace(
    /<path fill="#ffffff"[^>]*d="M 0 0\.078125[^"]*"[^>]*\/>/g,
    ""
  );
}

function parseViewBox(svg) {
  const m = svg.match(/viewBox="([\d.\s-]+)"/);
  const [x, y, w, h] = m[1].trim().split(/\s+/).map(Number);
  return { x, y, w, h };
}

async function tightViewBox(svg) {
  const full = await sharp(Buffer.from(svg), { density: DENSITY })
    .png()
    .toBuffer({ resolveWithObject: true });
  const Wpx = full.info.width;
  const Hpx = full.info.height;
  const t = await sharp(Buffer.from(svg), { density: DENSITY })
    .png()
    .trim()
    .toBuffer({ resolveWithObject: true });
  const vb = parseViewBox(svg);
  const x = vb.x + (-(t.info.trimOffsetLeft ?? 0) / Wpx) * vb.w;
  const y = vb.y + (-(t.info.trimOffsetTop ?? 0) / Hpx) * vb.h;
  const w = (t.info.width / Wpx) * vb.w;
  const h = (t.info.height / Hpx) * vb.h;
  return { x, y, w, h };
}

function setViewBox(svg, vb, pad = 8) {
  const x = (vb.x - pad).toFixed(2);
  const y = (vb.y - pad).toFixed(2);
  const w = (vb.w + pad * 2).toFixed(2);
  const h = (vb.h + pad * 2).toFixed(2);
  return svg
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace(/viewBox="[^"]*"/, `viewBox="${x} ${y} ${w} ${h}"`);
}

async function build(srcN, name, { light = false } = {}) {
  let svg = stripBg(await fs.readFile(`assets/logo/${srcN}.svg`, "utf8"));
  const vb = await tightViewBox(svg);
  svg = setViewBox(svg, vb);
  if (light) svg = svg.replace(/fill="#000000"/g, 'fill="#ffffff"');
  await fs.writeFile(`${OUT}/${name}.svg`, svg);
  console.log(name, "viewBox", vb.x.toFixed(1), vb.y.toFixed(1), vb.w.toFixed(1), vb.h.toFixed(1));
}

await build("3", "mg-horizontal");
await build("3", "mg-horizontal-light", { light: true });
await build("1", "mg-stacked");
await build("1", "mg-stacked-light", { light: true });

const stacked = await fs.readFile(`${OUT}/mg-stacked.svg`, "utf8");
for (const size of [32, 180, 512]) {
  await sharp(Buffer.from(stacked), { density: 400 })
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(`${OUT}/icon-${size}.png`);
}
console.log("favicons done");

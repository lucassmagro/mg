import sharp from "sharp";
import { promises as fs } from "fs";

const OUT = "public/logo";
await fs.mkdir(OUT, { recursive: true });

// remove the full-canvas white background rects so the logo is transparent
function stripBg(svg) {
  return svg.replace(
    /<path fill="#ffffff"[^>]*d="M 0 0\.078125[^"]*"[^>]*\/>/g,
    ""
  );
}

for (const n of ["1", "3", "4"]) {
  const raw = await fs.readFile(`assets/logo/${n}.svg`, "utf8");
  const clean = stripBg(raw);
  await fs.writeFile(`${OUT}/src-${n}.svg`, clean);
  const png = await sharp(Buffer.from(clean), { density: 200 })
    .png()
    .trim()
    .toBuffer();
  const meta = await sharp(png).metadata();
  await fs.writeFile(`${OUT}/preview-${n}.png`, png);
  console.log(`logo ${n}: ${meta.width}x${meta.height}`);
}

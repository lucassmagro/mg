import sharp from "sharp";
import { promises as fs } from "fs";

const OUT = "public/logo";

// 1.svg = marca (cubo MG) + "INCORPORAÇÕES". Recortamos só o cubo para o favicon.
let svg = await fs.readFile("assets/logo/1.svg", "utf8");
svg = svg.replace(
  /<path fill="#ffffff"[^>]*d="M 0 0\.078125[^"]*"[^>]*\/>/g,
  "",
);
// bbox do cubo (do clip-path do arquivo): x[453.5,755] y[188,451]
svg = svg
  .replace(/\swidth="[^"]*"/, "")
  .replace(/\sheight="[^"]*"/, "")
  .replace(/viewBox="[^"]*"/, 'viewBox="447 182 315 277"');

await fs.writeFile(`${OUT}/mark.svg`, svg);

// PNGs com fundo branco (visível em qualquer aba) + leve respiro
async function gerar(size, file) {
  const pad = Math.round(size * 0.14);
  const mark = await sharp(Buffer.from(svg), { density: 600 })
    .resize(size - pad * 2, size - pad * 2, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(file);
}

await gerar(512, `${OUT}/icon-512.png`);
await gerar(180, `${OUT}/icon-180.png`);
await gerar(64, `${OUT}/icon-32.png`);
// arquivos que o Next usa como favicon (app router)
await gerar(64, "app/icon.png");
await gerar(180, "app/apple-icon.png");
console.log("favicon (marca MG) gerado");

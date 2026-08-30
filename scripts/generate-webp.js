import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const images = [
  {
    input: path.join(rootDir, "src/assets/polaris-logo.png"),
    outputWebp: path.join(rootDir, "src/assets/polaris-logo.webp"),
    outputPublicWebp: path.join(rootDir, "public/polaris-logo.webp"),
    width: 160,
    height: 160,
    quality: 90,
  },
  {
    input: path.join(rootDir, "src/assets/students-building.jpg"),
    outputWebp: path.join(rootDir, "src/assets/students-building.webp"),
    outputPublicWebp: path.join(rootDir, "public/students-building.webp"),
    width: 800,
    height: 600,
    quality: 80,
  },
  {
    input: path.join(rootDir, "src/assets/night-observation.jpg"),
    outputWebp: path.join(rootDir, "src/assets/night-observation.webp"),
    outputPublicWebp: path.join(rootDir, "public/night-observation.webp"),
    width: 800,
    height: 600,
    quality: 80,
  },
];

async function run() {
  console.log("Generating high-efficiency WebP images...");
  for (const img of images) {
    if (fs.existsSync(img.input)) {
      const buffer = await sharp(img.input)
        .resize(img.width, img.height, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: img.quality, effort: 6 })
        .toBuffer();

      fs.writeFileSync(img.outputWebp, buffer);
      fs.writeFileSync(img.outputPublicWebp, buffer);
      console.log(
        `✓ Created: ${path.basename(img.outputWebp)} (${(buffer.length / 1024).toFixed(1)} KiB)`,
      );
    }
  }
}

run().catch(console.error);

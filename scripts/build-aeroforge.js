import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const AEROFORGE_DIR = path.join(ROOT_DIR, "AeroForge_ai-main");
const DEST_DIR = path.join(ROOT_DIR, "public", "aeroforge");

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      copyFolderRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  }
}

try {
  console.log("=== Building AeroForge AI ===");
  console.log(`Running build in: ${AEROFORGE_DIR}`);
  execSync("npm run build", { cwd: AEROFORGE_DIR, stdio: "inherit" });
  
  console.log("=== Copying AeroForge Build to Polaris Public Directory ===");
  if (fs.existsSync(DEST_DIR)) {
    console.log(`Cleaning existing target directory: ${DEST_DIR}`);
    fs.rmSync(DEST_DIR, { recursive: true, force: true });
  }
  
  const distDir = path.join(AEROFORGE_DIR, "dist");
  if (!fs.existsSync(distDir)) {
    throw new Error(`AeroForge build output directory does not exist: ${distDir}`);
  }
  
  copyFolderRecursiveSync(distDir, DEST_DIR);
  console.log(`Successfully integrated AeroForge into: ${DEST_DIR}`);
  console.log("=== AeroForge Integration Complete ===");
} catch (error) {
  console.error("Error integrating AeroForge:", error);
  process.exit(1);
}

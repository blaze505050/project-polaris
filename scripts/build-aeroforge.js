import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const AEROFORGE_DIR = path.join(ROOT_DIR, "AeroForge_ai-main");
const DEST_DIR = path.join(ROOT_DIR, "public", "aeroforge");

/**
 * Cross-platform recursive directory copy with fallback
 */
function copyDirectorySync(source, target) {
  if (typeof fs.cpSync === "function") {
    fs.cpSync(source, target, { recursive: true, force: true });
    return;
  }

  // Fallback for legacy Node environments
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Main automated build pipeline
 */
function buildAeroForge() {
  console.log("==================================================");
  console.log("[AEROFORGE BUILD] Starting AeroForge AI Pipeline");
  console.log(`[AEROFORGE BUILD] Working directory: ${AEROFORGE_DIR}`);
  console.log("==================================================");

  // 1. Verify directory integrity
  if (!fs.existsSync(AEROFORGE_DIR)) {
    console.error(`[AEROFORGE BUILD] Critical Error: AeroForge directory not found at ${AEROFORGE_DIR}`);
    process.exit(1);
  }

  const packageJsonPath = path.join(AEROFORGE_DIR, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`[AEROFORGE BUILD] Critical Error: package.json missing in ${AEROFORGE_DIR}`);
    process.exit(1);
  }

  const nodeModulesPath = path.join(AEROFORGE_DIR, "node_modules");
  const viteBinPath = path.join(nodeModulesPath, ".bin", process.platform === "win32" ? "vite.cmd" : "vite");
  const isCI = Boolean(process.env.CI || process.env.VERCEL || process.env.GITHUB_ACTIONS);
  const needsInstall = !fs.existsSync(nodeModulesPath) || !fs.existsSync(viteBinPath);

  // 2. Deterministic dependency installation
  if (needsInstall || isCI) {
    console.log(`[AEROFORGE BUILD] Installing AeroForge dependencies (CI=${isCI}, needsInstall=${needsInstall})...`);
    try {
      const lockfilePath = path.join(AEROFORGE_DIR, "package-lock.json");
      if (fs.existsSync(lockfilePath)) {
        console.log("[AEROFORGE BUILD] Executing deterministic 'npm ci'...");
        execSync("npm ci --prefer-offline --no-audit", {
          cwd: AEROFORGE_DIR,
          stdio: "inherit",
          env: { ...process.env, CI: "true" },
        });
      } else {
        console.log("[AEROFORGE BUILD] package-lock.json not found, executing 'npm install'...");
        execSync("npm install --prefer-offline --no-audit", {
          cwd: AEROFORGE_DIR,
          stdio: "inherit",
        });
      }
      console.log("[AEROFORGE BUILD] Dependencies installed successfully.");
    } catch (installError) {
      console.error("[AEROFORGE BUILD] dependency installation failed");
      console.error(installError.message || installError);
      process.exit(1);
    }
  } else {
    console.log("[AEROFORGE BUILD] Using cached local dependencies.");
  }

  // 3. Compile AeroForge AI via Vite
  console.log("[AEROFORGE BUILD] Compiling AeroForge AI production bundle...");
  try {
    execSync("npm run build", {
      cwd: AEROFORGE_DIR,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "production" },
    });
    console.log("[AEROFORGE BUILD] Compilation completed successfully.");
  } catch (buildError) {
    console.error("[AEROFORGE BUILD] production build failed");
    console.error(buildError.message || buildError);
    process.exit(1);
  }

  // 4. Verify build output integrity
  const distDir = path.join(AEROFORGE_DIR, "dist");
  const indexHtmlPath = path.join(distDir, "index.html");

  if (!fs.existsSync(distDir)) {
    console.error(`[AEROFORGE BUILD] Build output verification failed: Directory does not exist at ${distDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`[AEROFORGE BUILD] Build output verification failed: index.html missing at ${indexHtmlPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(indexHtmlPath);
  if (stat.size === 0) {
    console.error(`[AEROFORGE BUILD] Build output verification failed: index.html is empty at ${indexHtmlPath}`);
    process.exit(1);
  }

  // 5. Clean and copy to public/aeroforge
  console.log(`[AEROFORGE BUILD] Cleaning target destination: ${DEST_DIR}`);
  if (fs.existsSync(DEST_DIR)) {
    fs.rmSync(DEST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DEST_DIR, { recursive: true });

  console.log(`[AEROFORGE BUILD] Copying production artifacts to: ${DEST_DIR}`);
  copyDirectorySync(distDir, DEST_DIR);

  // 6. Final verification of public/aeroforge/index.html
  const finalIndexHtml = path.join(DEST_DIR, "index.html");
  if (!fs.existsSync(finalIndexHtml) || fs.statSync(finalIndexHtml).size === 0) {
    console.error(`[AEROFORGE BUILD] Critical Error: Integration verification failed at ${finalIndexHtml}`);
    process.exit(1);
  }

  console.log("==================================================");
  console.log(`[AEROFORGE BUILD] Successfully integrated AeroForge AI into: ${DEST_DIR}`);
  console.log("==================================================");
}

try {
  buildAeroForge();
} catch (fatalError) {
  console.error("[AEROFORGE BUILD] Fatal pipeline exception:", fatalError);
  process.exit(1);
}

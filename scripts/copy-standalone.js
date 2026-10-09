const fs = require("fs");
const path = require("path");

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // 1. Copy public -> .next/standalone/public
  const publicSrc = path.join(__dirname, "..", "public");
  const publicDest = path.join(__dirname, "..", ".next", "standalone", "public");
  if (fs.existsSync(publicSrc)) {
    copyDir(publicSrc, publicDest);
    console.log("[standalone] Synced public/ to .next/standalone/public");
  }

  // 2. Copy .next/static -> .next/standalone/.next/static
  const staticSrc = path.join(__dirname, "..", ".next", "static");
  const staticDest = path.join(__dirname, "..", ".next", "standalone", ".next", "static");
  if (fs.existsSync(staticSrc)) {
    copyDir(staticSrc, staticDest);
    console.log("[standalone] Synced .next/static/ to .next/standalone/.next/static");
  }
} catch (err) {
  console.error("[standalone sync warning]:", err.message);
}

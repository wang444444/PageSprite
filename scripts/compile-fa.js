/**
 * Pre-compile Font Awesome 6 CSS with base64-embedded font files.
 * Generates electron/assets/fa-inline.css so @fortawesome/fontawesome-free
 * doesn't need to be a production dependency.
 *
 * Runs via postinstall hook. In dev mode, if FA is not installed (e.g.
 * npm install --production), the already-generated file is reused; if
 * neither exists, the main process falls back to on-demand generation.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const faRoot = path.join(root, "node_modules", "@fortawesome", "fontawesome-free");
const cssPath = path.join(faRoot, "css", "all.min.css");
const outputPath = path.join(root, "electron", "assets", "fa-inline.css");

// If FA is not installed, skip silently — the file may already exist from a
// previous install, or main process will fall back to on-demand generation.
if (!fs.existsSync(cssPath)) {
  if (!fs.existsSync(outputPath)) {
    console.warn("[compile-fa] Font Awesome not found — skipped (no pre-existing fa-inline.css either)");
  }
  process.exit(0);
}

let css = fs.readFileSync(cssPath, "utf-8");

css = css.replace(/url\(["']?([^"')]+)["']?\)/g, (_match, filePath) => {
  const fullPath = path.resolve(path.join(faRoot, "css"), filePath);
  if (!fs.existsSync(fullPath)) return _match;

  const ext = path.extname(filePath).toLowerCase();
  const mime =
    ext === ".woff2" ? "font/woff2" :
    ext === ".woff"  ? "font/woff"  :
    ext === ".ttf"   ? "font/ttf"   :
    ext === ".svg"   ? "image/svg+xml" : "application/octet-stream";

  const data = fs.readFileSync(fullPath).toString("base64");
  return `url(data:${mime};base64,${data})`;
});

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, css);
console.log(`[compile-fa] Generated ${outputPath} (${(css.length / 1024).toFixed(0)} KB)`);

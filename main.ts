// Deal Verdict — black-friday-deal-finder-01 entry program (Node 22, stdlib only).
//
// The site is plain static files under app/ (index.html, style.css and the ES
// modules deals.js, verdict.js and finder.js — no build step, no network at
// runtime). This program hands it in: it copies app/ and screenshots/ from this
// repository into /output and writes /output/dossier.json with the vendored
// make.fun library, exactly as the scorer re-derives it. vendor/makefun-frontend.ts
// is the kit's copy, unchanged.
//
// Run locally with:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output).

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
if (existsSync(join(repoRoot, "screenshots"))) {
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });
}

// Caps mirror the gate: at most 4 screenshots of 256 KiB, app/ under 993 files
// and 16 MiB, dossier text capped at 160 KiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

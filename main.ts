import { join } from "node:path";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One-star review of something essential: sleep.
// Deadpan, one line, 58 characters, no trailing newline.
const ENTRY = "Sleep takes a third of my life and still returns me tired.";

// The kit's gate: /output/entry.txt must be UTF-8 text of 1 to 160
// characters and not only white space. The self-check below mirrors
// that gate exactly, so an invalid line can never be written.
const MAX_CHARS = 160;

function assertGate(line: string): void {
  if (line.length === 0 || line.length > MAX_CHARS) {
    throw new Error(`entry must be 1..${MAX_CHARS} characters, got ${line.length}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
}

assertGate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read back what actually landed on disk: a partial or altered write
// must fail loudly here instead of reaching the gate as a bad entry.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error(`written entry ${JSON.stringify(written)} != intended line`);
}
assertGate(written);

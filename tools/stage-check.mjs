// Composed-frame check for every playable stage.
//
// Structural asset tests inspect PNG files on disk; they cannot see what the
// renderer actually composes. This tier boots each stage in a real browser,
// plays it with real input, and asserts on the resulting frame. It writes an
// image only when an assertion fails — a screenshot nobody compares is cost
// without cover.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import fs from "node:fs";
import { PNG } from "pngjs";

const PORT = process.env.PORT || 4176;
const baseURL = `http://127.0.0.1:${PORT}`;
const stages = [
  { name: "Pilgrim Road", page: "index.html", key: "encounter" },
  { name: "Ruined Cloister", page: "cloister.html", key: "cloister" },
];

const server = spawn(process.execPath, ["tools/serve.mjs"], {
  env: { ...process.env, PORT },
  stdio: "ignore",
});
const stop = (code) => {
  server.kill();
  process.exit(code);
};
process.on("uncaughtException", (e) => {
  console.error(e);
  stop(1);
});

/** Warmth (red minus blue) per horizontal bucket for one row of the frame. */
function warmthBuckets(png, y, buckets = 16, skip = () => false) {
  const out = [];
  const span = Math.floor(png.width / buckets);
  for (let b = 0; b < buckets; b++) {
    if (skip(b * span, (b + 1) * span)) continue;
    let sum = 0,
      n = 0;
    for (let x = b * span; x < (b + 1) * span; x++) {
      const i = (y * png.width + x) << 2;
      if (png.data[i + 3] < 200) continue;
      sum += png.data[i] - png.data[i + 2];
      n++;
    }
    if (n) out.push(sum / n);
  }
  return out;
}

// Poll for readiness rather than guessing at a sleep: a slow or already
// occupied port must fail loudly here, not as a mystery timeout later.
await (async () => {
  const deadline = Date.now() + 15000;
  for (;;) {
    try {
      const res = await fetch(baseURL, { signal: AbortSignal.timeout(1000) });
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    if (Date.now() > deadline)
      throw new Error(`server did not become ready on ${baseURL}`);
    await new Promise((r) => setTimeout(r, 100));
  }
})();
const browser = await chromium.launch();
let checked = 0;

for (const stage of stages) {
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(`${baseURL}/${stage.page}`, { waitUntil: "networkidle" });
  await page.waitForFunction((k) => window[k]?.ready, stage.key, {
    timeout: 15000,
  });
  await page.locator("#enter").click();

  // Real input, not a simulated state poke.
  const before = await page.evaluate((k) => window[k].snapshot(), stage.key);
  await page.keyboard.down("KeyD");
  await page.waitForTimeout(2200);
  await page.keyboard.up("KeyD");
  await page.waitForTimeout(400);
  const after = await page.evaluate((k) => window[k].snapshot(), stage.key);

  assert.ok(
    after.x > before.x + 100,
    `${stage.name}: holding right must move the character (${before.x} -> ${after.x})`,
  );
  assert.ok(
    after.walk >= 0 && Number.isFinite(after.x) && Number.isFinite(after.y),
    `${stage.name}: state must stay finite`,
  );
  assert.ok(after.grounded, `${stage.name}: must be standing on the floor`);

  const buffer = await page.locator("canvas").screenshot();
  const png = PNG.sync.read(buffer);
  const fail = (msg) => {
    fs.mkdirSync("tmp", { recursive: true });
    const out = `tmp/fail-${stage.key}.png`;
    fs.writeFileSync(out, buffer);
    assert.fail(`${msg} (frame written to ${out})`);
  };

  // The frame must actually contain a drawn scene.
  const mid = warmthBuckets(png, Math.floor(png.height / 2));
  if (!mid.length) fail(`${stage.name}: frame is fully transparent`);
  let spread = 0;
  for (let y = 4; y < png.height; y += 17) {
    const i = (y * png.width + (png.width >> 1)) << 2;
    spread = Math.max(spread, png.data[i] + png.data[i + 1] + png.data[i + 2]);
  }
  if (spread < 30) fail(`${stage.name}: frame is blank`);

  // A repeated floor must not alternate warm and cool along one row: that is
  // the painted cap gradient tiling as visible stripes. Only the main floor
  // cap band is sampled, and the character column is skipped — a warm hero on
  // cool masonry is art, not a seam.
  const scale = png.width / 1280;
  const charX = (after.x - after.camera) * scale;
  const skip = (x0, x1) => x1 > charX - 70 * scale && x0 < charX + 70 * scale;
  for (
    let y = Math.floor(png.height * 0.83);
    y < Math.floor(png.height * 0.91);
    y++
  ) {
    const b = warmthBuckets(png, y, 16, skip);
    if (b.length < 8) continue;
    const hi = Math.max(...b),
      lo = Math.min(...b);
    if (hi > 15 && lo < -15)
      fail(
        `${stage.name}: floor row ${y} alternates warm (${hi.toFixed(0)}) and cool (${lo.toFixed(0)}) — the cap is tiling as stripes`,
      );
  }

  assert.deepEqual(errors, [], `${stage.name}: console must be clean`);
  await page.close();
  checked++;
  console.log(`${stage.name}: input, state and composed frame verified.`);
}

// Secondary pages: boot cleanly and draw something. These replace a 26-shot
// screenshot tour that compared nothing.
for (const [name, url] of [
  ["Original study", "study.html"],
  ["Retained art gallery", "art/library/gallery.html"],
]) {
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${baseURL}/${url}`, { waitUntil: "networkidle" });
  const painted = await page.evaluate(
    () => document.body.getBoundingClientRect().height > 200,
  );
  assert.ok(painted, `${name}: must render content`);
  assert.deepEqual(errors, [], `${name}: console must be clean`);
  await page.close();
  console.log(`${name}: loads clean.`);
}

await browser.close();
console.log(`${checked} stage(s) passed the composed-frame check.`);
stop(0);

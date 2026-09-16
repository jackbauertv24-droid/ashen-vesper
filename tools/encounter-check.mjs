import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const server = spawn(process.execPath, ["tools/serve.mjs"], {
  env: { ...process.env, PORT: "4175" },
  stdio: "pipe",
});
let browser;
try {
  await new Promise((r, j) => {
    server.stdout.once("data", r);
    server.once("error", j);
  });
  browser = await chromium.launch();
  const page = await browser.newPage({
      viewport: { width: 1440, height: 1100 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(r.url());
  });
  await page.clock.install();
  await page.goto("http://127.0.0.1:4175");
  await page.waitForFunction(() => window.encounter?.ready);
  await page.locator("#enter").click();
  await mkdir("tmp", { recursive: true });
  await page.clock.runFor(100);
  await page.screenshot({ path: "tmp/encounter-entrance.png", fullPage: true });
  let right = false,
    mid = false,
    airShot = false,
    fightShot = false;
  for (let i = 0; i < 1300; i++) {
    const s = await page.evaluate(() => window.encounter.snapshot());
    if (s.complete) break;
    const enemy = s.enemies.find(
      (e) => e.hp > 0 && e.x > s.x - 10 && e.x - s.x < 108,
    );
    const brazier = !s.broken[0] && s.x > 333 && s.x < 430;
    const move = !enemy && !brazier;
    const jump =
      s.grounded && [820, 2330, 4000].some((x) => s.x > x - 40 && s.x < x);
    const attack = (!!enemy || brazier) && s.attack <= 0;
    const interact = s.x > 5550 && !s.gateOpen;
    if (move !== right) {
      await page.keyboard[move ? "down" : "up"]("KeyD");
      right = move;
    }
    if (attack) await page.keyboard.press("KeyJ");
    if (jump) await page.keyboard.press("Space");
    if (interact) await page.keyboard.press("KeyE");
    await page.clock.runFor(50);
    if (jump && !airShot) {
      await page.screenshot({ path: "tmp/encounter-jump.png", fullPage: true });
      airShot = true;
    }
    if (enemy && !fightShot) {
      await page.screenshot({
        path: "tmp/encounter-combat.png",
        fullPage: true,
      });
      fightShot = true;
    }
    if (!mid && s.x > 3100) {
      await page.screenshot({
        path: "tmp/encounter-middle.png",
        fullPage: true,
      });
      mid = true;
    }
  }
  const result = await page.evaluate(() => window.encounter.snapshot());
  assert.equal(result.complete, true);
  assert.equal(result.deaths, 0);
  assert.equal(result.enemies.filter((e) => e.hp <= 0).length, 3);
  assert.ok(result.camera > 4900);
  await page.keyboard.up("KeyD");
  await page.screenshot({ path: "tmp/encounter-finish.png", fullPage: true });
  await page.locator("#reset").click();
  assert.equal(await page.evaluate(() => window.encounter.snapshot().x), 180);
  await page.locator("#camera").selectOption("tight");
  await page.locator("#air").check();
  await page.locator("#sound").click();
  assert.equal(
    await page.locator("#sound").getAttribute("aria-pressed"),
    "true",
  );
  await page.locator("#sound").click();
  // Exercise a standard-mapped gamepad through the same polling path as a real device.
  await page.evaluate(() => {
    window.fakePad = {
      axes: [1, 0],
      buttons: Array.from({ length: 16 }, () => ({ pressed: false })),
    };
    navigator.getGamepads = () => [window.fakePad];
  });
  await page.clock.runFor(250);
  assert.ok((await page.evaluate(() => window.encounter.snapshot().x)) > 220);
  await page.evaluate(() => (window.fakePad.axes[0] = 0));
  await page.clock.runFor(100);
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto("http://127.0.0.1:4175");
  await mobile.waitForFunction(() => window.encounter?.ready);
  await mobile.locator("#enter").tap();
  const b = mobile.locator('[data-control="right"]');
  await b.dispatchEvent("pointerdown", { pointerId: 1 });
  await mobile.waitForFunction(() => window.encounter.snapshot().x > 220);
  await b.dispatchEvent("pointerup", { pointerId: 1 });
  await mobile.waitForTimeout(80);
  const stopped = await mobile.evaluate(() => window.encounter.snapshot().x);
  await mobile.waitForTimeout(100);
  assert.equal(
    await mobile.evaluate(() => window.encounter.snapshot().x),
    stopped,
  );
  assert.equal(
    await mobile.evaluate(() => document.documentElement.scrollWidth <= 390),
    true,
  );
  await mobile.screenshot({ path: "tmp/encounter-mobile.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    "Full keyboard encounter: ember, 3 guards, all gaps, gate, checkpoint; camera, reset, controls, gamepad movement and mobile release/layout passed.",
  );
} finally {
  await browser?.close();
  server.kill();
}

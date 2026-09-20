import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const baseURL = process.env.BASE_URL || "http://127.0.0.1:4175";
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
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.goto(baseURL);
  await page.waitForFunction(() => window.encounter?.ready);
  await page.locator("#enter").click();
  await mkdir("tmp", { recursive: true });
  await page.clock.runFor(100);
  await page.keyboard.down("KeyS");
  await page.clock.runFor(50);
  assert.equal(
    await page.evaluate(() => window.encounter.snapshot().crouching),
    true,
  );
  await page.keyboard.press("KeyJ");
  await page.clock.runFor(180);
  assert.equal(
    await page.evaluate(() => window.encounter.snapshot().attackCrouched),
    true,
  );
  await page.keyboard.up("KeyS");
  await page.clock.runFor(400);
  assert.equal(
    await page.evaluate(() => window.encounter.snapshot().crouching),
    false,
  );
  await page.keyboard.down("KeyD");
  await page.keyboard.press("Space");
  await page.clock.runFor(100);
  const jumpBefore = await page.evaluate(() => window.encounter.snapshot());
  await page.keyboard.press("KeyJ");
  await page.clock.runFor(180);
  const jumpAfter = await page.evaluate(() => window.encounter.snapshot());
  assert.ok(jumpAfter.attack > 0 && !jumpAfter.grounded);
  assert.ok(jumpAfter.x > jumpBefore.x && jumpAfter.y < jumpBefore.y);
  await page.keyboard.up("KeyD");
  await page.locator("#reset").click();
  let right = false,
    left = false,
    mid = false,
    airShot = false,
    fightShot = false;
  for (let i = 0; i < 1300; i++) {
    const s = await page.evaluate(() => window.encounter.snapshot());
    if (s.complete) break;
    const enemy = s.enemies.find(
      (e) =>
        e.hp > 0 &&
        Math.abs(e.x - s.x) < 340 &&
        s.grounded &&
        Math.abs(e.y - s.y) < 100,
    );
    const brazier = !s.broken[0] && s.x > 333 && s.x < 430;
    const move = !brazier && (!enemy || enemy.x - s.x > 100);
    const moveLeft = !!enemy && enemy.x - s.x < -100;
    const jump =
      s.grounded &&
      ([820, 2330, 4000].some((x) => s.x > x - 40 && s.x < x) ||
        [
          [1240, 520],
          [1420, 450],
          [1620, 390],
          [4400, 530],
          [4580, 460],
          [4760, 390],
        ].some(
          ([x, y]) => x - s.x < 100 && x > s.x && y < s.y && y >= s.y - 115,
        ));
    const attack =
      ((!!enemy && Math.abs(enemy.x - s.x) <= 100) || brazier) && s.attack <= 0;
    const interact = s.x > 5550 && !s.gateOpen;
    if (move !== right) {
      await page.keyboard[move ? "down" : "up"]("KeyD");
      right = move;
    }
    if (moveLeft !== left) {
      await page.keyboard[moveLeft ? "down" : "up"]("KeyA");
      left = moveLeft;
    }
    if (enemy && attack && enemy.x < s.x) {
      await page.keyboard.down("KeyA");
      left = true;
    }
    if (attack) await page.keyboard.press("KeyJ");
    if (jump) await page.keyboard.press("Space");
    if (interact) await page.keyboard.press("KeyE");
    await page.clock.runFor(50);
    if (jump && !airShot) {
      airShot = true;
    }
    if (enemy && !fightShot) {
      fightShot = true;
    }
    if (!mid && s.x > 3100) {
      mid = true;
    }
  }
  const result = await page.evaluate(() => window.encounter.snapshot());
  assert.equal(result.complete, true);
  assert.equal(result.deaths, 0);
  assert.equal(result.enemies.filter((e) => e.hp <= 0).length, 3);
  assert.ok(result.camera > 4900);
  await page.keyboard.up("KeyD");
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
  await page.evaluate(() => (window.fakePad.buttons[13].pressed = true));
  await page.clock.runFor(100);
  assert.equal(
    await page.evaluate(() => window.encounter.snapshot().crouching),
    true,
  );
  await page.evaluate(() => (window.fakePad.buttons[13].pressed = false));
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto(baseURL);
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
  const crouch = mobile.locator('[data-control="crouch"]');
  const crouchBounds = await crouch.boundingBox();
  const touchSession = await mobile.context().newCDPSession(mobile);
  await touchSession.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      {
        x: crouchBounds.x + crouchBounds.width / 2,
        y: crouchBounds.y + crouchBounds.height / 2,
      },
    ],
  });
  await mobile.waitForFunction(() => window.encounter.snapshot().crouching);
  await touchSession.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await mobile.waitForFunction(() => !window.encounter.snapshot().crouching);
  assert.deepEqual(errors, []);
  console.log(
    "Full encounter, solid-step traversal, aerial attack momentum, crouch/low attack, gamepad crouch, touch release and layout passed.",
  );
} finally {
  await browser?.close();
  server.kill();
}

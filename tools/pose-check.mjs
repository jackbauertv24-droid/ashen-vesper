import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
const server = spawn(process.execPath, ["tools/serve.mjs"], {
  env: { ...process.env, PORT: "4176" },
  stdio: "pipe",
});
let browser;
try {
  await new Promise((resolve, reject) => {
    server.stdout.once("data", resolve);
    server.once("error", reject);
  });
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
  });
  // Test-only state control: the published application does not expose this hook.
  await page.route("**/prototype/encounter.js", async (route) => {
    const response = await route.fetch();
    const source = (await response.text()).replace(
      "snapshot: () => structuredClone(s)",
      "props: () => ({brazier:art.brazier,ember:art.ember}), preview: state => { s = {...s, ...state}; running = false; draw(); }, snapshot: () => structuredClone(s)",
    );
    await route.fulfill({ response, body: source });
  });
  await page.goto("http://127.0.0.1:4176");
  await page.waitForFunction(() => window.encounter?.ready);
  await page.evaluate(() => {
    const review = document.createElement("canvas");
    review.id = "pose-review";
    review.width = 1200;
    review.height = 920;
    document.body.prepend(review);
    const g = review.getContext("2d");
    g.fillStyle = "#142130";
    g.fillRect(0, 0, 1200, 920);
    const snapshot = window.encounter.snapshot();
    const capture = (state, x, y, label, sourceX = 110) => {
      window.encounter.preview({ ...snapshot, x: 180, camera: 0, ...state });
      g.drawImage(
        document.querySelector("#game"),
        sourceX,
        420,
        200,
        200,
        x,
        y,
        200,
        200,
      );
      g.fillStyle = "white";
      g.font = "13px sans-serif";
      g.fillText(label, x + 10, y + 215);
    };
    const names = [
      "Idle",
      "Crawl A",
      "Crawl B",
      "Anticipation",
      "Contact",
      "Recovery",
    ];
    capture({ crouching: false }, 0, 460, "Standing reference");
    capture({ crouching: true }, 200, 460, "Crouch reference");
    capture({ crouching: true, facing: -1 }, 400, 460, "Crouch mirrored");
    capture({ x: 420, drops: [{ x: 180, y: 570 }] }, 600, 460, "Ember cutout");
    capture({ x: 800 }, 800, 460, "Brazier alpha", 350);
    const props = window.encounter.props();
    for (const [i, color] of ["#ffffff", "#000000", "#287acb"].entries()) {
      for (const [j, name] of ["brazier", "ember"].entries()) {
        const x = (i * 2 + j) * 200;
        g.fillStyle = color;
        g.fillRect(x, 690, 200, 200);
        g.drawImage(props[name], x + 50, 730, 100, 120);
        g.fillStyle = "#dfba7b";
        g.font = "13px sans-serif";
        g.fillText(name + " / " + color, x + 8, 905);
      }
    }
    for (let i = 0; i < 6; i++)
      capture(
        {
          crouching: true,
          vx: i === 1 || i === 2 ? 85 : 0,
          walk: i === 2 ? 0.2 : 0,
          attack: i >= 3 ? [0.36, 0.2, 0.08][i - 3] : 0,
          attackCrouched: true,
        },
        i * 200,
        0,
        names[i],
      );
    for (const [i, [mode, timer]] of [
      ["patrol", 0],
      ["windup", 0.4],
      ["strike", 0.1],
      ["recover", 0.6],
    ].entries()) {
      capture(
        {
          x: 400,
          enemies: [{ ...snapshot.enemies[0], x: 180, mode, timer, facing: 1 }],
        },
        i * 200,
        230,
        mode,
      );
    }
  });
  await mkdir("tmp", { recursive: true });
  await page
    .locator("#pose-review")
    .screenshot({ path: "tmp/pose-review.png" });
  console.log("Runtime pose contact sheet: tmp/pose-review.png");
} finally {
  await browser?.close();
  server.kill();
}

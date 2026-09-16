import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

test("art contract accepts a correctly packed RGBA fixture and rejects broken exports", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ashen-art-contract-"));
  const script = fileURLToPath(
    new URL("../tools/validate-art-submission.mjs", import.meta.url),
  );
  try {
    const relative =
      "art/contributions/01-bellwarden-crouch/v001/exports/test.png";
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    const png = new PNG({ width: 1536, height: 1024 });
    const names = [
      "crouch-idle",
      "crawl-a",
      "crawl-b",
      "low-windup",
      "low-contact",
      "low-recovery",
    ];
    const frames = names.map((name, i) => ({
      name,
      x: (i % 3) * 512,
      y: Math.floor(i / 3) * 512,
      width: 512,
      height: 512,
      pivotX: 192,
      pivotY: 464,
    }));
    for (const f of frames)
      for (let y = 330; y < 464; y++)
        for (let x = 150; x < 240; x++) {
          const i = ((f.y + y) * png.width + f.x + x) * 4;
          png.data.set([100, 120, 130, 255], i);
        }
    const a = {
      path: relative,
      width: 1536,
      height: 1024,
      cellWidth: 512,
      cellHeight: 512,
      referenceHeight: 384,
      displayHeight: 144,
      frames,
    };
    const doc = {
      jobId: "01-bellwarden-crouch",
      status: "candidate",
      assets: [a],
    };
    const save = () => {
      const bytes = PNG.sync.write(png);
      fs.writeFileSync(path.join(root, relative), bytes);
      a.sha256 = createHash("sha256").update(bytes).digest("hex");
      fs.writeFileSync(path.join(root, "submission.json"), JSON.stringify(doc));
    };
    const run = () =>
      spawnSync(process.execPath, [script, "submission.json"], {
        cwd: root,
        encoding: "utf8",
      });
    save();
    assert.equal(
      run().status,
      0,
      "valid synthetic export must pass structural checks",
    );
    a.frames[2].pivotX = 193;
    save();
    assert.notEqual(run().status, 0, "anchor drift must fail");
    a.frames[2].pivotX = 192;
    png.data[3] = 255;
    save();
    assert.match(run().stderr, /painted cell border/);
    png.data[3] = 0;
    for (let y = 0; y < 512; y++)
      for (let x = 0; x < 512; x++) png.data[(y * png.width + x) * 4 + 3] = 0;
    save();
    assert.match(run().stderr, /empty\/nearly empty/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

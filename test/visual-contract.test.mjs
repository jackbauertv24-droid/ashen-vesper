import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { PNG } from "pngjs";
import {
  standingHead,
  crouchHead,
  crouchScale,
} from "../prototype/character-metrics.js";
test("calibrated crouch head matches standing anatomy within five percent", () => {
  for (const axis of ["width", "height"]) {
    const reference = standingHead[axis] * standingHead.scale;
    assert.ok(
      Math.abs((crouchHead[axis] * crouchScale) / reference - 1) < 0.05,
    );
  }
});
test("replacement brazier has real exterior and chain-gap transparency", () => {
  const bytes = fs.readFileSync(
    "art/contributions/04-brazier-alpha/v001/source/brazier-alpha-generated-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  for (const [u, v] of [
    [0, 0],
    [0.05, 0.5],
    [0.95, 0.5],
    [0.4, 0.24],
    [0.6, 0.24],
  ])
    assert.equal(
      im.data[
        (Math.floor(v * im.height) * im.width + Math.floor(u * im.width)) * 4 +
          3
      ],
      0,
    );
});
test("ember cutout has genuine RGBA transparency and clear 32px outer border", () => {
  const bytes = fs.readFileSync(
    "art/contributions/05-ember-alpha/v001/exports/ember-alpha-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);
  for (let y = 0; y < 1024; y++)
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) assert.equal(alpha, 0);
      if (alpha) assert.ok(x >= 256 && x <= 768 && y >= 160 && y <= 864);
    }
  assert.ok(im.data[(550 * im.width + 512) * 4 + 3] > 200);
});
test("healing vial pickup candidate has genuine RGBA transparency, clear 32px border, and valid envelope", () => {
  const bytes = fs.readFileSync(
    "art/contributions/14-pickups-and-relics/v001/exports/healing-vial-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);
  for (let y = 0; y < 1024; y++)
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) assert.equal(alpha, 0);
      if (alpha) assert.ok(x >= 256 && x <= 768 && y >= 192 && y <= 832);
    }
  assert.ok(im.data[(512 * im.width + 512) * 4 + 3] > 200);
});

test("bell moth design candidate has genuine RGBA transparency, clear 32px border, and 640px wingspan", () => {
  const bytes = fs.readFileSync(
    "art/contributions/11-bell-moth/v001/exports/bell-moth-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);
  let minX = 1024,
    maxX = 0;
  for (let y = 0; y < 1024; y++)
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) assert.equal(alpha, 0);
      if (alpha) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  assert.equal(maxX - minX + 1, 640);
  const metrics = JSON.parse(
    fs.readFileSync(
      "art/contributions/11-bell-moth/v002/runtime-metrics.json",
      "utf8",
    ),
  );
  assert.equal((maxX - minX + 1) * metrics.scale, metrics.runtimeWingspan);
  assert.equal(im.width * metrics.scale, metrics.displayCanvas[0]);
  assert.ok(im.data[(512 * im.width + 512) * 4 + 3] > 200);
});

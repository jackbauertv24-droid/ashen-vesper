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
  for (const [x, y] of [
    [0, 0],
    [1023, 0],
    [0, 1023],
    [1023, 1023],
    [16, 512],
    [1007, 512],
    [512, 16],
    [512, 1007],
  ]) {
    assert.equal(im.data[(y * im.width + x) * 4 + 3], 0);
  }
  assert.ok(im.data[(550 * im.width + 512) * 4 + 3] > 200);
});

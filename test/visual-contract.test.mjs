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

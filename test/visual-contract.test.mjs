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

test("cistern lurker design candidate has genuine RGBA transparency, clear 32px border, and low crouch silhouette", () => {
  const bytes = fs.readFileSync(
    "art/contributions/13-cistern-lurker/v001/exports/cistern-lurker-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);

  let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) {
        assert.equal(alpha, 0, `Border violation at (${x}, ${y})`);
      }
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  assert.equal(minX, 43, "Left margin");
  assert.equal(maxX, 984, "Right margin");
  assert.equal(minY, 267, "Top of reliquary back arch");
  assert.equal(maxY, 772, "Claw contact ground level");

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  assert.equal(width, 942);
  assert.equal(height, 506);

  // Aspect ratio confirms low crouching profile (ratio ~ 1.86)
  const ratio = width / height;
  assert.ok(ratio > 1.8 && ratio < 1.95, `Aspect ratio ${ratio} matches low threat target`);

  // Reliquary amber core presence: (740, 440) shines bright amber between the grille bars
  const coreIdx = (440 * 1024 + 740) * 4;
  assert.ok(im.data[coreIdx + 3] > 200, "Core must be opaque");
  assert.ok(im.data[coreIdx] > 180, "Core must have warm amber red component");
  assert.ok(im.data[coreIdx + 1] > 160, "Core must have warm amber green component");

  // Vertical iron grille bar in front of core at (730, 440)
  const barIdx = (440 * 1024 + 730) * 4;
  assert.ok(im.data[barIdx + 3] > 200, "Grille bar must be opaque");
  assert.ok(im.data[barIdx] < im.data[coreIdx], "Grille bar must be darker than glowing amber core");
});

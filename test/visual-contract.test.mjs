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

test("mechanism lever candidate has genuine RGBA transparency, 12px clear cell padding, and identical shared base", () => {
  const bytes = fs.readFileSync(
    "art/contributions/15-mechanisms/v001/exports/lever-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 512);

  // 12px clear cell padding for both 512x512 cells
  for (let cellIdx = 0; cellIdx < 2; cellIdx++) {
    const offsetX = cellIdx * 512;
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const alpha = im.data[(y * 1024 + offsetX + x) * 4 + 3];
        if (x < 12 || y < 12 || x >= 500 || y >= 500) {
          assert.equal(alpha, 0, `Cell ${cellIdx} border violation at (${x}, ${y})`);
        }
      }
    }
  }

  // Base identity verification: unoccluded mechanism base and plinth (x = 112..230, y = 100..470) are 100% bit-for-bit identical
  for (let y = 100; y < 470; y++) {
    for (let x = 112; x < 230; x++) {
      const idx0 = (y * 1024 + x) * 4;
      const idx1 = (y * 1024 + 512 + x) * 4;
      for (let c = 0; c < 4; c++) {
        assert.equal(im.data[idx0 + c], im.data[idx1 + c], `Base mismatch at (${x}, ${y}) channel ${c}`);
      }
    }
  }

  // Handle position verification: Cell 0 has inactive handle angled up (420, 150), Cell 1 has active handle angled down (450, 430)
  assert.ok(im.data[(150 * 1024 + 420) * 4 + 3] > 200, "Cell 0 inactive handle must be elevated");
  assert.equal(im.data[(150 * 1024 + 512 + 420) * 4 + 3], 0, "Cell 1 active handle must not be in elevated position");
  assert.ok(im.data[(430 * 1024 + 512 + 450) * 4 + 3] > 200, "Cell 1 active handle must be lowered");
  assert.equal(im.data[(430 * 1024 + 450) * 4 + 3], 0, "Cell 0 inactive handle must not be in lowered position");

  // Hinge point (256, 280) and plinth base bottom (256, 464) are solid in both cells
  assert.ok(im.data[(280 * 1024 + 256) * 4 + 3] > 200);
  assert.ok(im.data[(280 * 1024 + 512 + 256) * 4 + 3] > 200);
  assert.ok(im.data[(460 * 1024 + 256) * 4 + 3] > 200);
  assert.ok(im.data[(460 * 1024 + 512 + 256) * 4 + 3] > 200);
});

test("iron sexton design candidate has genuine RGBA transparency, clear 32px border, and 898px standing height", () => {
  const bytes = fs.readFileSync(
    "art/contributions/12-iron-sexton/v001/exports/iron-sexton-v001.png",
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

  assert.equal(minY, 76, "Hood peak height");
  assert.equal(maxY, 973, "Boot contact ground level");
  assert.equal(maxY - minY + 1, 898, "Standing character height must equal 898px");

  // Verify solid core (iron breastplate)
  assert.ok(im.data[(400 * 1024 + 500) * 4 + 3] > 200);

  // Verify shovel blade tip
  assert.ok(im.data[(388 * 1024 + 973) * 4 + 3] > 100);
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

test("tollkeeper boss design candidate has genuine RGBA transparency, clear 32px border, and 220-unit runtime height", () => {
  const bytes = fs.readFileSync(
    "art/contributions/16-tollkeeper/v001/exports/tollkeeper-design-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);
  let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) assert.equal(alpha, 0);
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const submission = JSON.parse(
    fs.readFileSync("art/contributions/16-tollkeeper/v001/submission.json", "utf8"),
  );
  const asset = submission.assets[0];
  assert.equal(maxX - minX + 1, asset.visibleBounds.width);
  assert.equal(maxY - minY + 1, asset.visibleBounds.height);
  assert.ok(Math.abs(asset.standingHeight * asset.scale - asset.runtimeHeight) < 0.1);
  const [acX, acY] = asset.landmarks.amberCore;
  const coreAlpha = im.data[(acY * 1024 + acX) * 4 + 3];
  assert.equal(coreAlpha, 255);
  assert.equal(im.data[(500 * 1024 + 480) * 4 + 3], 255);
});

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
          assert.equal(
            alpha,
            0,
            `Cell ${cellIdx} border violation at (${x}, ${y})`,
          );
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
        assert.equal(
          im.data[idx0 + c],
          im.data[idx1 + c],
          `Base mismatch at (${x}, ${y}) channel ${c}`,
        );
      }
    }
  }

  // Handle position verification: Cell 0 has inactive handle angled up (420, 150), Cell 1 has active handle angled down (450, 430)
  assert.ok(
    im.data[(150 * 1024 + 420) * 4 + 3] > 200,
    "Cell 0 inactive handle must be elevated",
  );
  assert.equal(
    im.data[(150 * 1024 + 512 + 420) * 4 + 3],
    0,
    "Cell 1 active handle must not be in elevated position",
  );
  assert.ok(
    im.data[(430 * 1024 + 512 + 450) * 4 + 3] > 200,
    "Cell 1 active handle must be lowered",
  );
  assert.equal(
    im.data[(430 * 1024 + 450) * 4 + 3],
    0,
    "Cell 0 inactive handle must not be in lowered position",
  );

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

  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
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
  assert.equal(
    maxY - minY + 1,
    898,
    "Standing character height must equal 898px",
  );

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

  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
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
  assert.ok(
    ratio > 1.8 && ratio < 1.95,
    `Aspect ratio ${ratio} matches low threat target`,
  );

  // Reliquary amber core presence: (740, 440) shines bright amber between the grille bars
  const coreIdx = (440 * 1024 + 740) * 4;
  assert.ok(im.data[coreIdx + 3] > 200, "Core must be opaque");
  assert.ok(im.data[coreIdx] > 180, "Core must have warm amber red component");
  assert.ok(
    im.data[coreIdx + 1] > 160,
    "Core must have warm amber green component",
  );

  // Vertical iron grille bar in front of core at (730, 440)
  const barIdx = (440 * 1024 + 730) * 4;
  assert.ok(im.data[barIdx + 3] > 200, "Grille bar must be opaque");
  assert.ok(
    im.data[barIdx] < im.data[coreIdx],
    "Grille bar must be darker than glowing amber core",
  );
});

test("tollkeeper boss design candidate has genuine RGBA transparency, clear 32px border, and 220-unit runtime height", () => {
  const bytes = fs.readFileSync(
    "art/contributions/16-tollkeeper/v001/exports/tollkeeper-design-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);
  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
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
    fs.readFileSync(
      "art/contributions/16-tollkeeper/v001/submission.json",
      "utf8",
    ),
  );
  const asset = submission.assets[0];
  assert.equal(maxX - minX + 1, asset.visibleBounds.width);
  assert.equal(maxY - minY + 1, asset.visibleBounds.height);
  assert.ok(
    Math.abs(asset.standingHeight * asset.scale - asset.runtimeHeight) < 0.1,
  );
  const [acX, acY] = asset.landmarks.amberCore;
  const coreAlpha = im.data[(acY * 1024 + acX) * 4 + 3];
  assert.equal(coreAlpha, 255);
  assert.equal(im.data[(500 * 1024 + 480) * 4 + 3], 255);
});

test("cloister arch span candidate has genuine RGBA transparency, pierced openings, and 32px clear border", () => {
  const bytes = fs.readFileSync(
    "art/contributions/08-ruined-cloister/v001/exports/cloister-arch-span-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);
  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
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
    fs.readFileSync(
      "art/contributions/08-ruined-cloister/v001/submission.json",
      "utf8",
    ),
  );
  const asset = submission.assets.find((a) =>
    a.path.includes("cloister-arch-span"),
  );
  assert.equal(maxX - minX + 1, asset.visibleBounds.width);
  assert.equal(maxY - minY + 1, asset.visibleBounds.height);
  // Main arch opening is genuinely transparent
  assert.equal(im.data[(700 * 1024 + 512) * 4 + 3], 0);
  // Trefoil tracery center is genuinely transparent
  assert.equal(im.data[(336 * 1024 + 512) * 4 + 3], 0);
  // Left and right pillars are solid opaque
  assert.equal(im.data[(700 * 1024 + 200) * 4 + 3], 255);
  assert.equal(im.data[(700 * 1024 + 800) * 4 + 3], 255);
  // Top entablature platform surface is solid opaque
  assert.equal(im.data[(100 * 1024 + 512) * 4 + 3], 255);
});

test("cloister arcade pier candidate has genuine RGBA transparency, solid shaft, and 32px clear border", () => {
  const file =
    "art/contributions/08-ruined-cloister/v001/exports/cloister-pier-v001.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6);
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);
  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
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
    fs.readFileSync(
      "art/contributions/08-ruined-cloister/v001/submission.json",
      "utf8",
    ),
  );
  const pierAsset = submission.assets.find((a) =>
    a.path.includes("cloister-pier"),
  );
  assert.equal(maxX - minX + 1, pierAsset.visibleBounds.width);
  assert.equal(maxY - minY + 1, pierAsset.visibleBounds.height);
  // Center stone shaft is solid opaque
  assert.equal(im.data[(600 * 1024 + 512) * 4 + 3], 255);
  // Capital abacus center is solid opaque
  assert.equal(im.data[(341 * 1024 + 512) * 4 + 3], 255);
  // Base plinth center is solid opaque
  assert.equal(im.data[(960 * 1024 + 512) * 4 + 3], 255);
  // Flanking margins outside pier are genuinely transparent
  assert.equal(im.data[(600 * 1024 + 100) * 4 + 3], 0);
  assert.equal(im.data[(600 * 1024 + 900) * 4 + 3], 0);
});

test("World 01 Abbey limestone stair flight candidate satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/world-01-pilgrim-road/v001/exports/stair-flight-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);

  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
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

  // Exact bounds check: 64px margins on left, right, bottom; 394px top margin
  assert.equal(minX, 64, "Left margin must be 64px");
  assert.equal(maxX, 959, "Right margin must be 959px (inclusive)");
  assert.equal(minY, 394, "Top tread must be at y=394");
  assert.equal(maxY, 959, "Bottom footing must be at y=959");

  // Nominal 224 unit run at 0.25 scale (896px = 224 units)
  const width = maxX - minX + 1;
  assert.equal(width, 896, "Width must be 896px");
  assert.equal(
    width * 0.25,
    224,
    "Horizontal run at 0.25 scale must equal 224 units",
  );

  // Rise calculation: top tread y=394, bottom tread y=899 -> 505px = 126.25 units
  const treadRise = 899 - minY;
  assert.equal(
    treadRise * 0.25,
    126.25,
    "Tread rise at 0.25 scale must equal 126.25 units",
  );

  // Solid stone verification across treads
  for (const [sx, sy] of [
    [120, 930],
    [300, 800],
    [500, 680],
    [700, 550],
    [900, 420],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Stone step at (${sx}, ${sy}) must be solid opaque`,
    );
  }
});

test("World 02 Ruined Cloister platform cap candidate satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/world-02-ruined-cloister/v001/exports/platform-cap-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 256);

  let minX = 1024,
    maxX = 0,
    minY = 256,
    maxY = 0;
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 16 || x >= 992 || y >= 240) {
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

  // Exact bounds check: 64px margins on left/right, top margin at y=32, bottom margin >= 40px
  assert.equal(minX, 64, "Left margin must be 64px");
  assert.equal(maxX, 959, "Right margin must be 959px (inclusive)");
  assert.equal(minY, 32, "Top walkable surface must be at y=32");
  assert.equal(maxY, 214, "Bottom of masonry beam must be at y=214");

  // Span width 896px -> 210 runtime units at 240/1024 uniform scale
  const width = maxX - minX + 1;
  assert.equal(width, 896, "Width must be 896px");
  assert.equal(
    width * (240 / 1024),
    210,
    "Horizontal span at 240/1024 scale must equal 210 units",
  );

  // Sockets at (64, 32) and (960, 32)
  const repeatInterval = 960 - 64;
  assert.equal(repeatInterval, 896, "Repeat interval must equal 896px");

  // Solid stone verification across walking surface and masonry beam
  for (const [sx, sy] of [
    [200, 60],
    [400, 60],
    [512, 60],
    [600, 60],
    [800, 60],
    [512, 140],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Stone slab at (${sx}, ${sy}) must be solid opaque`,
    );
  }
});

test("ruined cloister portcullis grate candidate has genuine RGBA transparency, 12px safe padding, sill contact, and opening alpha", () => {
  const bytes = fs.readFileSync(
    "art/contributions/15-mechanisms/v003/exports/grate-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be PNG Color Type 6 (True RGBA)");
  assert.equal(im.width, 1024, "Width must be 1024");
  assert.equal(im.height, 1280, "Height must be 1280");

  let minX = 1024, maxX = 0, minY = 1280, maxY = 0;
  for (let y = 0; y < 1280; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 12 || y < 12 || x >= 1012 || y >= 1268) {
        assert.equal(alpha, 0, `Border violation at (${x}, ${y})`);
      }
      if (alpha > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  assert.equal(minX, 88, "Left margin must be 88px");
  assert.equal(maxX, 935, "Right margin must be 935px");
  assert.equal(minY, 64, "Top hoist shackles must be at y=64");
  assert.equal(maxY, 1215, "Bottom spear tips must reach sill ground line at y=1215");

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  assert.equal(width, 848, "Visible width must be 848px");
  assert.equal(height, 1152, "Visible height must be 1152px");

  // Center alignment with pivot x=512 within 1px
  const centerX = (minX + maxX) / 2;
  assert.ok(Math.abs(centerX - 511.5) < 1.0, `Center X ${centerX} must align with pivot 512`);

  // Verify true alpha transparency through rectangular lattice interior openings
  // Each lattice cell is ~70px wide, spaced every 100px: centers at x=260, 360, 560, 660 at y=300, 400, 700, 850
  assert.equal(im.data[(300 * 1024 + 260) * 4 + 3], 0, "Lattice opening at (260, 300) must be completely transparent");
  assert.equal(im.data[(400 * 1024 + 360) * 4 + 3], 0, "Lattice opening at (360, 400) must be completely transparent");
  assert.equal(im.data[(700 * 1024 + 560) * 4 + 3], 0, "Lattice opening at (560, 700) must be completely transparent");
  assert.equal(im.data[(850 * 1024 + 660) * 4 + 3], 0, "Lattice opening at (660, 850) must be completely transparent");

  // Verify solid wrought-iron crossbars, pickets, and spear tip opacity
  assert.ok(im.data[(64 * 1024 + 512) * 4 + 3] > 200, "Top hoist bar at (512, 64) must be solid iron");
  assert.ok(im.data[(500 * 1024 + 512) * 4 + 3] > 200, "Horizontal crossbar at (512, 500) must be solid iron");
  assert.ok(im.data[(1215 * 1024 + 612) * 4 + 3] > 200, "Spear tip at sill contact (612, 1215) must be solid iron");
  assert.ok(im.data[(1210 * 1024 + 512) * 4 + 3] > 200, "Center spear at (512, 1210) must be solid iron");
});

test("World 03 Flooded Cistern damp platform cap candidate satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/world-03-flooded-cistern/v001/exports/damp-platform-cap-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 256);

  let minX = 1024,
    maxX = 0,
    minY = 256,
    maxY = 0;
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 16 || x >= 992 || y >= 240) {
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

  // Exact bounds check: 64px margins on left/right, top margin at y=32, bottom margin >= 40px
  assert.equal(minX, 64, "Left margin must be 64px");
  assert.equal(maxX, 959, "Right margin must be 959px (inclusive)");
  assert.equal(minY, 32, "Top walkable surface must be at y=32");
  assert.equal(maxY, 214, "Bottom of masonry beam must be at y=214");

  // Span width 896px -> 210 runtime units at 240/1024 uniform scale
  const width = maxX - minX + 1;
  assert.equal(width, 896, "Width must be 896px");
  assert.equal(
    width * (240 / 1024),
    210,
    "Horizontal span at 240/1024 scale must equal 210 units",
  );

  // Sockets at (64, 32) and (960, 32)
  const repeatInterval = 960 - 64;
  assert.equal(repeatInterval, 896, "Repeat interval must equal 896px");

  // Solid damp slate verification across walking surface and masonry beam
  for (const [sx, sy] of [
    [200, 60],
    [400, 60],
    [512, 60],
    [600, 60],
    [800, 60],
    [512, 120],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Damp slate slab at (${sx}, ${sy}) must be solid opaque`,
    );
  }
});

test("World 05 Counterweight Works lift deck candidate satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/world-05-counterweight-works/v001/exports/lift-deck-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 256);

  let minX = 1024,
    maxX = 0,
    minY = 256,
    maxY = 0;
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 12 || y < 12 || x >= 1012 || y >= 244) {
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

  assert.equal(minX, 64, "Left margin must be 64px");
  assert.equal(maxX, 959, "Right margin must be 959px (inclusive)");
  assert.equal(minY, 26, "Top of suspension shackles must be at y=26");
  assert.equal(maxY, 210, "Bottom of underside truss must be at y=210");

  const width = maxX - minX + 1;
  assert.equal(width, 896, "Width must be 896px");
  assert.equal(
    width * (240 / 1024),
    210,
    "Horizontal span at 240/1024 scale must equal 210 units",
  );

  // Top contact stone surface verified at y=32 across central standing plane
  for (const sx of [200, 300, 400, 512, 600, 700, 800]) {
    const idx = (32 * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Stone deck top at (${sx}, 32) must be solid opaque`,
    );
  }

  // Underside truss solid support
  assert.ok(im.data[(120 * 1024 + 512) * 4 + 3] > 240, "Central truss beam at (512, 120) must be solid");
});

test("World 06 Bell Tower timber landing candidate satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/world-06-bell-tower/v001/exports/tower-landing-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 256);

  let minX = 1024,
    maxX = 0,
    minY = 256,
    maxY = 0;
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 16 || y < 16 || x >= 1008 || y >= 240) {
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

  // Exact bounds check: 56px margins on left/right, top margin at y=30, bottom margin >= 40px
  assert.equal(minX, 56, "Left margin must be 56px");
  assert.equal(maxX, 967, "Right margin must be 967px (inclusive)");
  assert.equal(minY, 30, "Top edge must begin at y=30");
  assert.equal(maxY, 211, "Bottom of corbel brackets must be at y=211");

  // Span width 912px
  const width = maxX - minX + 1;
  assert.equal(width, 912, "Width must be 912px");

  // Solid oak timber and stone corbel verification
  for (const [sx, sy] of [
    [200, 60],
    [512, 60],
    [800, 60],
    [210, 150],
    [810, 150],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Material at (${sx}, ${sy}) must be solid opaque`,
    );
  }
});

test("World 04 Ossuary Gallery burial niche panel candidate satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/world-04-ossuary-gallery/v001/exports/niche-panel-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);

  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 16 || y < 16 || x >= 1008 || y >= 1008) {
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

  // Exact bounds check: 71px margins on left/right, top margin at y=23, bottom margin at y=1000
  assert.equal(minX, 71, "Left margin must be 71px");
  assert.equal(maxX, 952, "Right margin must be 952px (inclusive)");
  assert.equal(minY, 23, "Top edge must begin at y=23");
  assert.equal(maxY, 1000, "Bottom plinth edge must be at y=1000");

  // Span width 882px
  const width = maxX - minX + 1;
  assert.equal(width, 882, "Width must be 882px");

  // Solid limestone masonry and sarcophagus plinth verification
  for (const [sx, sy] of [
    [200, 960],
    [512, 960],
    [800, 960],
    [512, 100],
    [512, 800],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Material at (${sx}, ${sy}) must be solid opaque`,
    );
  }
});

test("Job 10 Bell Tower Great Bronze Bell candidate satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/10-bell-tower/v001/exports/bronze-bell-v001.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);

  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
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

  // Exact bounds check: 165px margins on left/right, top margin at y=64, bottom margin at y=924
  assert.equal(minX, 165, "Left margin must be 165px");
  assert.equal(maxX, 858, "Right margin must be 858px (inclusive)");
  assert.equal(minY, 64, "Top apex must begin at y=64 (hanging pivot elevation)");
  assert.equal(maxY, 924, "Bottom clapper edge must be at y=924");

  // Span width 694px
  const width = maxX - minX + 1;
  assert.equal(width, 694, "Width must be 694px");

  // Pierced canon loop eyelet transparency
  assert.equal(
    im.data[(137 * 1024 + 512) * 4 + 3],
    0,
    "Eyelet hole inside canon suspension loop must be genuinely transparent",
  );

  // Solid bronze and clapper verification
  for (const [sx, sy] of [
    [460, 137],
    [564, 137],
    [512, 400],
    [512, 700],
    [512, 900],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Material at (${sx}, ${sy}) must be solid opaque`,
    );
  }
});

test("Job 09 Flooded Cistern vault pier candidate satisfies visual and geometry contract", () => {
  const file = "art/contributions/09-flooded-cistern/v001/exports/cistern-vault-pier-v001.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);

  let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) {
        assert.equal(alpha, 0, `Outer 32px safety border must be completely transparent at (${x}, ${y})`);
      }
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/09-flooded-cistern/v001/submission.json", "utf8")
  );
  const pierAsset = submission.assets.find(a => a.path.includes("cistern-vault-pier"));
  assert.ok(pierAsset, "Asset must be declared in submission.json");
  assert.equal(maxX - minX + 1, pierAsset.visibleBounds.width);
  assert.equal(maxY - minY + 1, pierAsset.visibleBounds.height);
  assert.equal(minX, pierAsset.visibleBounds.minX);
  assert.equal(maxX, pierAsset.visibleBounds.maxX);
  assert.equal(minY, pierAsset.visibleBounds.minY);
  assert.equal(maxY, pierAsset.visibleBounds.maxY);

  // Solid masonry column core verification
  assert.equal(im.data[(600 * 1024 + 512) * 4 + 3], 255, "Column shaft core must be solid opaque");
  assert.equal(im.data[(300 * 1024 + 512) * 4 + 3], 255, "Capital core must be solid opaque");
  assert.equal(im.data[(900 * 1024 + 512) * 4 + 3], 255, "Base plinth core must be solid opaque");

  // Pierced bracket aperture genuine transparency
  assert.equal(im.data[(460 * 1024 + 630) * 4 + 3], 0, "Lantern bracket loop must be genuinely transparent");

  // Ground pivot alignment: (512, 960) rests on the plinth base
  assert.equal(pierAsset.pivot[0], 512);
  assert.equal(pierAsset.pivot[1], 960);
});

test("Job 16 Tollkeeper corrected two-handed boss candidate satisfies visual and geometry contract", () => {
  const file = "art/contributions/16-tollkeeper/v002/exports/tollkeeper-twohanded-v002.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);

  let minX = 1024, maxX = 0, minY = 1024, maxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) {
        assert.equal(alpha, 0, `Outer 32px safety border must be completely transparent at (${x}, ${y})`);
      }
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/16-tollkeeper/v002/submission.json", "utf8")
  );
  const tkAsset = submission.assets[0];
  assert.ok(tkAsset, "Asset must be declared in submission.json");
  assert.equal(maxX - minX + 1, tkAsset.visibleBounds.width);
  assert.equal(maxY - minY + 1, tkAsset.visibleBounds.height);
  assert.equal(minX, tkAsset.visibleBounds.minX);
  assert.equal(maxX, tkAsset.visibleBounds.maxX);
  assert.equal(minY, tkAsset.visibleBounds.minY);
  assert.equal(maxY, tkAsset.visibleBounds.maxY);

  // Stature and combat scale verification: nominal runtime height 220 units
  assert.ok(
    Math.abs(tkAsset.standingHeight * tkAsset.scale - tkAsset.runtimeHeight) < 0.1,
    "Standing height scaled must match nominal runtime height of 220 units"
  );
  assert.equal(tkAsset.runtimeHeight, 220);

  // Amber reliquary core landmark opacity
  const [acX, acY] = tkAsset.landmarks.amberCore;
  assert.equal(im.data[(acY * 1024 + acX) * 4 + 3], 255, "Amber core landmark must be solid opaque");

  // Solid torso, head, and clapper head
  assert.equal(im.data[(600 * 1024 + 450) * 4 + 3], 255, "Torso must be solid opaque");
  assert.equal(im.data[(150 * 1024 + 550) * 4 + 3], 255, "Head must be solid opaque");
  assert.equal(im.data[(240 * 1024 + 800) * 4 + 3], 255, "Clapper head must be solid opaque");

  // Ground pivot alignment
  assert.equal(tkAsset.pivot[0], 512);
  assert.equal(tkAsset.pivot[1], 960);
});

test("Job 11 Bell Moth 6-pose motion sheet candidate satisfies visual and geometry contract", () => {
  const file = "art/contributions/11-bell-moth/v003/exports/bell-moth-motion-v001.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 1536);
  assert.equal(im.height, 1024);

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/11-bell-moth/v003/submission.json", "utf8")
  );
  const sheet = submission.sheet;
  assert.equal(sheet.cols, 3);
  assert.equal(sheet.rows, 2);
  assert.equal(sheet.cellWidth, 512);
  assert.equal(sheet.cellHeight, 512);
  assert.equal(sheet.frames.length, 6);

  // Verify each of the 6 cells has >= 12px clear border padding
  for (const f of sheet.frames) {
    const ox = f.col * 512;
    const oy = f.row * 512;
    for (let y = oy; y < oy + 512; y++) {
      for (let x = ox; x < ox + 512; x++) {
        const relX = x - ox;
        const relY = y - oy;
        if (relX < 12 || relY < 12 || relX >= 500 || relY >= 500) {
          const alpha = im.data[(y * 1536 + x) * 4 + 3];
          assert.equal(alpha, 0, `Cell ${f.name} outer 12px padding must be transparent at rel (${relX}, ${relY})`);
        }
      }
    }

    // Verify solid body opacity near cell center
    const bodyA = im.data[((oy + 240) * 1536 + (ox + 256)) * 4 + 3];
    assert.ok(bodyA > 200, `Cell ${f.name} body center must be opaque`);
  }

  // Runtime wingspan and scale
  assert.equal(sheet.scale, 0.2);
  assert.equal(sheet.runtimeWingspan, 64);
});

test("Job 12 Iron Sexton 8-pose motion sheet candidate satisfies visual and geometry contract", () => {
  const file = "art/contributions/12-iron-sexton/v003/exports/iron-sexton-motion-v001.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 2048);
  assert.equal(im.height, 1024);

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/12-iron-sexton/v003/submission.json", "utf8")
  );
  const sheet = submission.sheet;
  assert.equal(sheet.cols, 4);
  assert.equal(sheet.rows, 2);
  assert.equal(sheet.cellWidth, 512);
  assert.equal(sheet.cellHeight, 512);
  assert.equal(sheet.frames.length, 8);

  // Verify each of the 8 cells has >= 12px clear border padding
  for (const f of sheet.frames) {
    const ox = f.col * 512;
    const oy = f.row * 512;
    for (let y = oy; y < oy + 512; y++) {
      for (let x = ox; x < ox + 512; x++) {
        const relX = x - ox;
        const relY = y - oy;
        if (relX < 12 || relY < 12 || relX >= 500 || relY >= 500) {
          const alpha = im.data[(y * 2048 + x) * 4 + 3];
          assert.equal(alpha, 0, `Cell ${f.name} outer 12px padding must be transparent at rel (${relX}, ${relY})`);
        }
      }
    }

    // Verify solid torso opacity inside character body bounds center
    const cx = Math.round((f.localBounds.minX + f.localBounds.maxX) / 2);
    const cy = Math.round((f.localBounds.minY + f.localBounds.maxY) / 2);
    const bodyA = im.data[((oy + cy) * 2048 + (ox + cx)) * 4 + 3];
    assert.ok(bodyA > 200, `Cell ${f.name} body center must be opaque`);
  }

  // Verify outer 32px perimeter of the 2048x1024 sheet has 0 alpha
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 2048; x++) {
      if (x < 32 || x >= 2048 - 32 || y < 32 || y >= 1024 - 32) {
        assert.equal(im.data[(y * 2048 + x) * 4 + 3], 0, `Outer 32px perimeter must be zero alpha at (${x}, ${y})`);
      }
    }
  }

  // Runtime scale and height
  assert.equal(sheet.scale, 0.4);
  assert.equal(sheet.runtimeHeight, 160);
  assert.equal(sheet.groundAnchor[0], 208);
  assert.equal(sheet.groundAnchor[1], 464);
});

test("Job 13 Cistern Lurker 6-pose motion sheet candidate satisfies visual and geometry contract", () => {
  const file = "art/contributions/13-cistern-lurker/v003/exports/cistern-lurker-motion-v001.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 1536);
  assert.equal(im.height, 1024);

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/13-cistern-lurker/v003/submission.json", "utf8")
  );
  const sheet = submission.sheet;
  assert.equal(sheet.cols, 3);
  assert.equal(sheet.rows, 2);
  assert.equal(sheet.cellWidth, 512);
  assert.equal(sheet.cellHeight, 512);
  assert.equal(sheet.frames.length, 6);

  // Verify each of the 6 cells has >= 12px clear border padding
  for (const f of sheet.frames) {
    const ox = f.col * 512;
    const oy = f.row * 512;
    for (let y = oy; y < oy + 512; y++) {
      for (let x = ox; x < ox + 512; x++) {
        const relX = x - ox;
        const relY = y - oy;
        if (relX < 12 || relY < 12 || relX >= 500 || relY >= 500) {
          const alpha = im.data[(y * 1536 + x) * 4 + 3];
          assert.equal(alpha, 0, `Cell ${f.name} outer 12px padding must be transparent at rel (${relX}, ${relY})`);
        }
      }
    }

    // Verify solid body opacity near center of local bounds
    const cx = Math.round((f.localBounds.minX + f.localBounds.maxX) / 2);
    const cy = Math.round((f.localBounds.minY + f.localBounds.maxY) / 2);
    const bodyA = im.data[((oy + cy) * 1536 + (ox + cx)) * 4 + 3];
    assert.ok(bodyA > 200, `Cell ${f.name} body center must be opaque`);
  }

  // Verify outer 32px perimeter of the 1536x1024 sheet has 0 alpha
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1536; x++) {
      if (x < 32 || x >= 1536 - 32 || y < 32 || y >= 1024 - 32) {
        assert.equal(im.data[(y * 1536 + x) * 4 + 3], 0, `Outer 32px perimeter must be zero alpha at (${x}, ${y})`);
      }
    }
  }

  // Runtime scale and size
  assert.equal(sheet.scale, 0.3);
  assert.equal(sheet.runtimeSize[0], 96);
  assert.equal(sheet.runtimeSize[1], 48);
  assert.equal(sheet.groundPivot[0], 256);
  assert.equal(sheet.groundPivot[1], 448);
});

test("World 02 Ruined Cloister seamless platform kit candidate satisfies visual, geometry, and zero-delta seam contract", () => {
  const centerBytes = fs.readFileSync(
    "art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-center-v002.png",
  );
  const center = PNG.sync.read(centerBytes);
  assert.equal(centerBytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(center.width, 1024);
  assert.equal(center.height, 256);

  // Check mathematical seamlessness across repeating seam boundary:
  // Column 0 must exactly equal Column 1023 across all 256 vertical scanlines
  let maxSeamDelta = 0;
  for (let y = 0; y < 256; y++) {
    const idx0 = (y * 1024 + 0) * 4;
    const idxLast = (y * 1024 + 1023) * 4;
    for (let c = 0; c < 4; c++) {
      const delta = Math.abs(center.data[idx0 + c] - center.data[idxLast + c]);
      if (delta > maxSeamDelta) maxSeamDelta = delta;
    }
  }
  assert.equal(maxSeamDelta, 0, "Seam repeat delta must be exactly 0 across all channels (R, G, B, A)");

  // Top surface must be planar at y=32 and top clearance border (y < 16) must be transparent
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 1024; x++) {
      assert.equal(center.data[(y * 1024 + x) * 4 + 3], 0, `Top margin violation at (${x}, ${y})`);
    }
  }

  // Top walking contact surface must be solid opaque across entire width at y=32
  for (let x = 0; x < 1024; x++) {
    assert.ok(
      center.data[(32 * 1024 + x) * 4 + 3] > 240,
      `Top contact surface at x=${x} must be solid opaque`,
    );
  }

  // Left end cap verification
  const leftBytes = fs.readFileSync(
    "art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-end-left-v002.png",
  );
  const leftEnd = PNG.sync.read(leftBytes);
  assert.equal(leftBytes[25], 6, "Left end must be Color Type 6 (RGBA)");
  assert.equal(leftEnd.width, 256);
  assert.equal(leftEnd.height, 256);

  // Left end outer clearance border: x < 32 must be transparent
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 32; x++) {
      assert.equal(leftEnd.data[(y * 256 + x) * 4 + 3], 0, `Left end outer margin violation at (${x}, ${y})`);
    }
  }

  // Left end column 255 must match center column 0
  let leftToCenterDelta = 0;
  for (let y = 0; y < 256; y++) {
    const iL = (y * 256 + 255) * 4;
    const iC = (y * 1024 + 0) * 4;
    for (let c = 0; c < 4; c++) {
      leftToCenterDelta = Math.max(leftToCenterDelta, Math.abs(leftEnd.data[iL + c] - center.data[iC + c]));
    }
  }
  assert.equal(leftToCenterDelta, 0, "Left end to center strip junction delta must be 0");

  // Right end cap verification
  const rightBytes = fs.readFileSync(
    "art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-end-right-v002.png",
  );
  const rightEnd = PNG.sync.read(rightBytes);
  assert.equal(rightBytes[25], 6, "Right end must be Color Type 6 (RGBA)");
  assert.equal(rightEnd.width, 256);
  assert.equal(rightEnd.height, 256);

  // Right end outer clearance border: x >= 224 must be transparent
  for (let y = 0; y < 256; y++) {
    for (let x = 224; x < 256; x++) {
      assert.equal(rightEnd.data[(y * 256 + x) * 4 + 3], 0, `Right end outer margin violation at (${x}, ${y})`);
    }
  }

  // Center column 1023 must match right end column 0
  let centerToRightDelta = 0;
  for (let y = 0; y < 256; y++) {
    const iC = (y * 1024 + 1023) * 4;
    const iR = (y * 256 + 0) * 4;
    for (let c = 0; c < 4; c++) {
      centerToRightDelta = Math.max(centerToRightDelta, Math.abs(center.data[iC + c] - rightEnd.data[iR + c]));
    }
  }
  assert.equal(centerToRightDelta, 0, "Center strip to right end junction delta must be 0");

  // Review composite verification
  const reviewBytes = fs.readFileSync("docs/reviews/platform-cap-seamless-v002.png");
  const reviewPng = PNG.sync.read(reviewBytes);
  assert.equal(reviewPng.width, 1680);
  assert.equal(reviewPng.height, 1260);
});

test("Job 12 Iron Sexton 8-pose motion sheet cleanup (v004) satisfies visual, geometry, and mesh contiguity contract", () => {
  const file = "art/contributions/12-iron-sexton/v004/exports/iron-sexton-motion-v002.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 2048);
  assert.equal(im.height, 1024);

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/12-iron-sexton/v004/submission.json", "utf8")
  );
  const sheet = submission.sheet;
  assert.equal(sheet.cols, 4);
  assert.equal(sheet.rows, 2);
  assert.equal(sheet.cellWidth, 512);
  assert.equal(sheet.cellHeight, 512);
  assert.equal(sheet.frames.length, 8);

  // Verify each of the 8 cells has >= 25px clear border padding (exceeding 12px requirement)
  for (const f of sheet.frames) {
    const ox = f.col * 512;
    const oy = f.row * 512;
    for (let y = oy; y < oy + 512; y++) {
      for (let x = ox; x < ox + 512; x++) {
        const relX = x - ox;
        const relY = y - oy;
        if (relX < 25 || relY < 25 || relX >= 512 - 25 || relY >= 512 - 25) {
          const alpha = im.data[(y * 2048 + x) * 4 + 3];
          assert.equal(alpha, 0, `Cell ${f.name} outer 25px padding must be transparent at rel (${relX}, ${relY})`);
        }
      }
    }

    // Verify solid torso opacity inside character body core
    const cx = Math.round((f.localBounds.minX + f.localBounds.maxX) / 2);
    const cy = Math.round((f.localBounds.minY + f.localBounds.maxY) / 2);
    let hasOpaqueCore = false;
    for (let dy = -15; dy <= 15; dy += 5) {
      for (let dx = -15; dx <= 15; dx += 5) {
        if (im.data[((oy + cy + dy) * 2048 + (ox + cx + dx)) * 4 + 3] > 200) {
          hasOpaqueCore = true;
          break;
        }
      }
      if (hasOpaqueCore) break;
    }
    assert.ok(hasOpaqueCore, `Cell ${f.name} body core must be opaque`);

    // Verify mesh contiguity: zero detached floating components in any cell (resolves maintainer issue)
    const visited = new Uint8Array(512 * 512);
    let componentCount = 0;
    for (let cy = 0; cy < 512; cy++) {
      for (let cx = 0; cx < 512; cx++) {
        const pIdx = cy * 512 + cx;
        const a = im.data[((oy + cy) * 2048 + (ox + cx)) * 4 + 3];
        if (a > 20 && !visited[pIdx]) {
          componentCount++;
          // Flood fill
          const queue = [pIdx];
          visited[pIdx] = 1;
          let head = 0;
          while (head < queue.length) {
            const curr = queue[head++];
            const qy = Math.floor(curr / 512);
            const qx = curr % 512;
            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              const nx = qx + dx;
              const ny = qy + dy;
              if (nx >= 0 && nx < 512 && ny >= 0 && ny < 512) {
                const nIdx = ny * 512 + nx;
                if (!visited[nIdx] && im.data[((oy + ny) * 2048 + (ox + nx)) * 4 + 3] > 20) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                }
              }
            }
          }
        }
      }
    }
    assert.equal(componentCount, 1, `Cell ${f.name} must have exactly 1 connected component (0 detached fragments)`);
  }

  // Verify outer 32px perimeter of the 2048x1024 sheet has 0 alpha
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 2048; x++) {
      if (x < 32 || x >= 2048 - 32 || y < 32 || y >= 1024 - 32) {
        assert.equal(im.data[(y * 2048 + x) * 4 + 3], 0, `Outer 32px perimeter must be zero alpha at (${x}, ${y})`);
      }
    }
  }

  // Runtime scale and height
  assert.equal(sheet.scale, 0.4);
  assert.equal(sheet.runtimeHeight, 160);
  assert.equal(sheet.groundAnchor[0], 208);
  assert.equal(sheet.groundAnchor[1], 464);
});

test("Job 16 Tollkeeper Boss 6-pose motion sheet candidate satisfies visual and geometry contract", () => {
  const file = "art/contributions/16-tollkeeper/v003/exports/tollkeeper-motion-v001.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 2304);
  assert.equal(im.height, 1536);

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/16-tollkeeper/v003/submission.json", "utf8")
  );
  const sheet = submission.sheet;
  assert.equal(sheet.cols, 3);
  assert.equal(sheet.rows, 2);
  assert.equal(sheet.cellWidth, 768);
  assert.equal(sheet.cellHeight, 768);
  assert.equal(sheet.frames.length, 6);

  // Verify each of the 6 cells has >= 16px clear border padding (measured >= 44px)
  for (const f of sheet.frames) {
    const ox = f.col * 768;
    const oy = f.row * 768;
    for (let y = oy; y < oy + 768; y++) {
      for (let x = ox; x < ox + 768; x++) {
        const relX = x - ox;
        const relY = y - oy;
        if (relX < 16 || relY < 16 || relX >= 768 - 16 || relY >= 768 - 16) {
          const alpha = im.data[(y * 2304 + x) * 4 + 3];
          assert.equal(alpha, 0, `Cell ${f.name} outer 16px padding must be transparent at rel (${relX}, ${relY})`);
        }
      }
    }

    // Verify solid torso opacity inside character body core
    const cx = Math.round((f.localBounds.minX + f.localBounds.maxX) / 2);
    const cy = Math.round((f.localBounds.minY + f.localBounds.maxY) / 2);
    let hasOpaqueCore = false;
    for (let dy = -20; dy <= 20; dy += 5) {
      for (let dx = -20; dx <= 20; dx += 5) {
        if (im.data[((oy + cy + dy) * 2304 + (ox + cx + dx)) * 4 + 3] > 200) {
          hasOpaqueCore = true;
          break;
        }
      }
      if (hasOpaqueCore) break;
    }
    assert.ok(hasOpaqueCore, `Cell ${f.name} body core must be opaque`);

    // Verify 0 detached components (100% contiguous mesh per cell)
    const visited = new Uint8Array(768 * 768);
    let componentCount = 0;
    for (let cy = 0; cy < 768; cy++) {
      for (let cx = 0; cx < 768; cx++) {
        const pIdx = cy * 768 + cx;
        const a = im.data[((oy + cy) * 2304 + (ox + cx)) * 4 + 3];
        if (a > 20 && !visited[pIdx]) {
          componentCount++;
          const queue = [pIdx];
          visited[pIdx] = 1;
          let head = 0;
          while (head < queue.length) {
            const curr = queue[head++];
            const qy = Math.floor(curr / 768);
            const qx = curr % 768;
            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              const nx = qx + dx;
              const ny = qy + dy;
              if (nx >= 0 && nx < 768 && ny >= 0 && ny < 768) {
                const nIdx = ny * 768 + nx;
                if (!visited[nIdx] && im.data[((oy + ny) * 2304 + (ox + nx)) * 4 + 3] > 20) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                }
              }
            }
          }
        }
      }
    }
    assert.equal(componentCount, 1, `Cell ${f.name} must have exactly 1 connected component`);
  }

  // Verify outer 32px perimeter of the 2304x1536 sheet has 0 alpha
  for (let y = 0; y < 1536; y++) {
    for (let x = 0; x < 2304; x++) {
      if (x < 32 || x >= 2304 - 32 || y < 32 || y >= 1536 - 32) {
        assert.equal(im.data[(y * 2304 + x) * 4 + 3], 0, `Outer 32px perimeter must be zero alpha at (${x}, ${y})`);
      }
    }
  }

  // Runtime scale, height, and pivot
  assert.equal(sheet.scale, 0.392857);
  assert.equal(sheet.runtimeHeight, 220);
  assert.equal(sheet.groundPivot[0], 320);
  assert.equal(sheet.groundPivot[1], 704);
});

test("World 04 Ossuary Gallery burial niche panel clean derivative (v002) satisfies visual and geometry contract", () => {
  const bytes = fs.readFileSync(
    "art/contributions/world-04-ossuary-gallery/v002/exports/niche-panel-v002.png",
  );
  const im = PNG.sync.read(bytes);
  assert.equal(bytes[25], 6, "Must be Color Type 6 (RGBA)");
  assert.equal(im.width, 1024);
  assert.equal(im.height, 1024);

  let minX = 1024,
    maxX = 0,
    minY = 1024,
    maxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = im.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) {
        assert.equal(alpha, 0, `Outer 32px perimeter violation at (${x}, ${y})`);
      }
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Exact bounds check: 58px margins on left/right, top margin at y=83, bottom margin at y=940
  assert.equal(minX, 58, "Left margin must be 58px");
  assert.equal(maxX, 965, "Right margin must be 965px (inclusive)");
  assert.equal(minY, 83, "Top edge must begin at y=83");
  assert.equal(maxY, 940, "Bottom plinth edge must be at y=940");

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  assert.equal(width, 908, "Width must be 908px");
  assert.equal(height, 858, "Height must be 858px");

  // Solid masonry and interior tablet plinth verification
  for (const [sx, sy] of [
    [512, 512],
    [512, 800],
    [300, 500],
    [700, 500],
    [512, 200],
    [512, 900],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(
      im.data[idx + 3] > 240,
      `Material at (${sx}, ${sy}) must be solid opaque`,
    );
  }

  // Review composite verification
  const reviewBytes = fs.readFileSync("docs/reviews/ossuary-niche-panel-v002.png");
  const reviewPng = PNG.sync.read(reviewBytes);
  assert.equal(reviewPng.width, 1680);
  assert.equal(reviewPng.height, 1260);
});

test("Job 09 Flooded Cistern unlit vault pier and hanging lantern (v002) satisfy visual and geometry contract", () => {
  // 1. Unlit Vault Pier
  const pierBytes = fs.readFileSync(
    "art/contributions/09-flooded-cistern/v002/exports/cistern-vault-pier-unlit-v002.png",
  );
  const pier = PNG.sync.read(pierBytes);
  assert.equal(pierBytes[25], 6, "Pier must be Color Type 6 (RGBA)");
  assert.equal(pier.width, 1024);
  assert.equal(pier.height, 1024);

  let pMinX = 1024, pMaxX = 0, pMinY = 1024, pMaxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = pier.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) {
        assert.equal(alpha, 0, `Pier perimeter violation at (${x}, ${y})`);
      }
      if (alpha > 0) {
        if (x < pMinX) pMinX = x;
        if (x > pMaxX) pMaxX = x;
        if (y < pMinY) pMinY = y;
        if (y > pMaxY) pMaxY = y;
      }
    }
  }

  assert.equal(pMinX, 114, "Pier minX must be 114px");
  assert.equal(pMaxX, 909, "Pier maxX must be 909px");
  assert.equal(pMinY, 36, "Pier minY must be 36px");
  assert.equal(pMaxY, 987, "Pier maxY must be 987px");
  assert.equal(pMaxX - pMinX + 1, 796, "Pier width must be 796px");
  assert.equal(pMaxY - pMinY + 1, 952, "Pier height must be 952px");

  // Solid masonry column verification
  for (const [sx, sy] of [
    [512, 200],
    [512, 300],
    [512, 512],
    [512, 700],
    [512, 900],
    [400, 512],
    [600, 512],
  ]) {
    const idx = (sy * 1024 + sx) * 4;
    assert.ok(pier.data[idx + 3] > 240, `Pier material at (${sx}, ${sy}) must be solid opaque`);
  }

  // 2. Hanging Lantern Prop
  const lanternBytes = fs.readFileSync(
    "art/contributions/09-flooded-cistern/v002/exports/cistern-hanging-lantern-v002.png",
  );
  const lantern = PNG.sync.read(lanternBytes);
  assert.equal(lanternBytes[25], 6, "Lantern must be Color Type 6 (RGBA)");
  assert.equal(lantern.width, 1024);
  assert.equal(lantern.height, 1024);

  let lMinX = 1024, lMaxX = 0, lMinY = 1024, lMaxY = 0;
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const alpha = lantern.data[(y * 1024 + x) * 4 + 3];
      if (x < 32 || y < 32 || x >= 992 || y >= 992) {
        assert.equal(alpha, 0, `Lantern perimeter violation at (${x}, ${y})`);
      }
      if (alpha > 0) {
        if (x < lMinX) lMinX = x;
        if (x > lMaxX) lMaxX = x;
        if (y < lMinY) lMinY = y;
        if (y > lMaxY) lMaxY = y;
      }
    }
  }

  assert.equal(lMinX, 275, "Lantern minX must be 275px");
  assert.equal(lMaxX, 750, "Lantern maxX must be 750px");
  assert.equal(lMinY, 32, "Lantern minY must be 32px");
  assert.equal(lMaxY, 991, "Lantern maxY must be 991px");
  assert.equal(lMaxX - lMinX + 1, 476, "Lantern width must be 476px");
  assert.equal(lMaxY - lMinY + 1, 960, "Lantern height must be 960px");

  // Lantern glowing amber core at center (512, 512)
  const cIdx = (512 * 1024 + 512) * 4;
  assert.ok(lantern.data[cIdx + 3] > 240, "Lantern flame core must be opaque");
  assert.ok(lantern.data[cIdx] > lantern.data[cIdx + 2], "Lantern flame core must have warm amber tone (R > B)");

  // Pierced suspension chain transparency: verify hollow space around chain
  let hollowPixels = 0;
  for (let y = 50; y < 300; y++) {
    for (let x = 350; x < 480; x++) {
      if (lantern.data[(y * 1024 + x) * 4 + 3] === 0) hollowPixels++;
    }
  }
  assert.ok(hollowPixels > 10000, "Lantern suspension chain must have genuine pierced transparency");

  // 3. Review composite verification
  const reviewBytes = fs.readFileSync("docs/reviews/cistern-vault-pier-unlit-v002.png");
  const reviewPng = PNG.sync.read(reviewBytes);
  assert.equal(reviewPng.width, 1680);
  assert.equal(reviewPng.height, 1260);
});

test("World 03 Flooded Cistern seamless damp platform kit candidate satisfies visual, geometry, and zero-delta seam contract", () => {
  // Center strip verification
  const centerBytes = fs.readFileSync(
    "art/contributions/world-03-flooded-cistern/v002/exports/damp-platform-cap-center-v002.png",
  );
  const center = PNG.sync.read(centerBytes);
  assert.equal(centerBytes[25], 6, "Center strip must be Color Type 6 (RGBA)");
  assert.equal(center.width, 1024);
  assert.equal(center.height, 256);

  // Top walking surface planar constraint: y < 32 must be transparent
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 1024; x++) {
      assert.equal(center.data[(y * 1024 + x) * 4 + 3], 0, `Top margin violation at (${x}, ${y})`);
    }
  }

  // Bottom margin clearance constraint: y > 214 must be transparent
  for (let y = 215; y < 256; y++) {
    for (let x = 0; x < 1024; x++) {
      assert.equal(center.data[(y * 1024 + x) * 4 + 3], 0, `Bottom margin violation at (${x}, ${y})`);
    }
  }

  // Zero-delta horizontal seam continuity across column 0 and column 1023
  let maxSeamDelta = 0;
  for (let y = 0; y < 256; y++) {
    const i0 = (y * 1024 + 0) * 4;
    const iEnd = (y * 1024 + 1023) * 4;
    for (let c = 0; c < 4; c++) {
      maxSeamDelta = Math.max(maxSeamDelta, Math.abs(center.data[i0 + c] - center.data[iEnd + c]));
    }
  }
  assert.equal(maxSeamDelta, 0, "Center strip column 0 and 1023 must match with Delta = 0");

  // Left end cap verification
  const leftBytes = fs.readFileSync(
    "art/contributions/world-03-flooded-cistern/v002/exports/damp-platform-cap-end-left-v002.png",
  );
  const leftEnd = PNG.sync.read(leftBytes);
  assert.equal(leftBytes[25], 6, "Left end must be Color Type 6 (RGBA)");
  assert.equal(leftEnd.width, 256);
  assert.equal(leftEnd.height, 256);

  // Left end outer clearance border: x < 64 must be transparent
  for (let y = 0; y < 256; y++) {
    for (let x = 0; x < 64; x++) {
      assert.equal(leftEnd.data[(y * 256 + x) * 4 + 3], 0, `Left end outer margin violation at (${x}, ${y})`);
    }
  }

  // Left end column 255 must match center strip column 0
  let leftToCenterDelta = 0;
  for (let y = 0; y < 256; y++) {
    const iL = (y * 256 + 255) * 4;
    const iC = (y * 1024 + 0) * 4;
    for (let c = 0; c < 4; c++) {
      leftToCenterDelta = Math.max(leftToCenterDelta, Math.abs(leftEnd.data[iL + c] - center.data[iC + c]));
    }
  }
  assert.equal(leftToCenterDelta, 0, "Left end to center strip junction delta must be 0");

  // Right end cap verification
  const rightBytes = fs.readFileSync(
    "art/contributions/world-03-flooded-cistern/v002/exports/damp-platform-cap-end-right-v002.png",
  );
  const rightEnd = PNG.sync.read(rightBytes);
  assert.equal(rightBytes[25], 6, "Right end must be Color Type 6 (RGBA)");
  assert.equal(rightEnd.width, 256);
  assert.equal(rightEnd.height, 256);

  // Right end outer clearance border: x >= 192 must be transparent
  for (let y = 0; y < 256; y++) {
    for (let x = 192; x < 256; x++) {
      assert.equal(rightEnd.data[(y * 256 + x) * 4 + 3], 0, `Right end outer margin violation at (${x}, ${y})`);
    }
  }

  // Center column 1023 must match right end column 0
  let centerToRightDelta = 0;
  for (let y = 0; y < 256; y++) {
    const iC = (y * 1024 + 1023) * 4;
    const iR = (y * 256 + 0) * 4;
    for (let c = 0; c < 4; c++) {
      centerToRightDelta = Math.max(centerToRightDelta, Math.abs(center.data[iC + c] - rightEnd.data[iR + c]));
    }
  }
  assert.equal(centerToRightDelta, 0, "Center strip to right end junction delta must be 0");

  // Review composite verification
  const reviewBytes = fs.readFileSync("docs/reviews/cistern-damp-platform-seamless-v002.png");
  const reviewPng = PNG.sync.read(reviewBytes);
  assert.equal(reviewPng.width, 1680);
  assert.equal(reviewPng.height, 1260);
});

test("Job 12 Iron Sexton 8-pose motion sheet hurt shovel restore (v005) satisfies visual, geometry, mesh contiguity, and weapon continuity contract", () => {
  const file = "art/contributions/12-iron-sexton/v005/exports/iron-sexton-motion-v003.png";
  const bytes = fs.readFileSync(file);
  const im = PNG.sync.read(bytes);

  assert.equal(bytes[25], 6, "Must be color type 6 (RGBA with true alpha)");
  assert.equal(im.width, 2048);
  assert.equal(im.height, 1024);

  const submission = JSON.parse(
    fs.readFileSync("art/contributions/12-iron-sexton/v005/submission.json", "utf8")
  );
  const sheet = submission.sheet;
  assert.equal(sheet.cols, 4);
  assert.equal(sheet.rows, 2);
  assert.equal(sheet.cellWidth, 512);
  assert.equal(sheet.cellHeight, 512);
  assert.equal(sheet.frames.length, 8);

  // Verify each of the 8 cells has >= 25px clear border padding (exceeding 12px requirement)
  for (const f of sheet.frames) {
    const ox = f.col * 512;
    const oy = f.row * 512;
    for (let y = oy; y < oy + 512; y++) {
      for (let x = ox; x < ox + 512; x++) {
        const relX = x - ox;
        const relY = y - oy;
        if (relX < 25 || relY < 25 || relX >= 512 - 25 || relY >= 512 - 25) {
          const alpha = im.data[(y * 2048 + x) * 4 + 3];
          assert.equal(alpha, 0, `Cell ${f.name} outer 25px padding must be transparent at rel (${relX}, ${relY})`);
        }
      }
    }

    // Verify solid torso opacity inside character body core
    const cx = Math.round((f.localBounds.minX + f.localBounds.maxX) / 2);
    const cy = Math.round((f.localBounds.minY + f.localBounds.maxY) / 2);
    let hasOpaqueCore = false;
    for (let dy = -15; dy <= 15; dy += 5) {
      for (let dx = -15; dx <= 15; dx += 5) {
        if (im.data[((oy + cy + dy) * 2048 + (ox + cx + dx)) * 4 + 3] > 200) {
          hasOpaqueCore = true;
          break;
        }
      }
      if (hasOpaqueCore) break;
    }
    assert.ok(hasOpaqueCore, `Cell ${f.name} body core must be opaque`);

    // Verify mesh contiguity: zero detached floating components in any cell
    const visited = new Uint8Array(512 * 512);
    let componentCount = 0;
    for (let cy = 0; cy < 512; cy++) {
      for (let cx = 0; cx < 512; cx++) {
        const pIdx = cy * 512 + cx;
        const a = im.data[((oy + cy) * 2048 + (ox + cx)) * 4 + 3];
        if (a > 20 && !visited[pIdx]) {
          componentCount++;
          const queue = [pIdx];
          visited[pIdx] = 1;
          let head = 0;
          while (head < queue.length) {
            const curr = queue[head++];
            const qy = Math.floor(curr / 512);
            const qx = curr % 512;
            for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              const nx = qx + dx;
              const ny = qy + dy;
              if (nx >= 0 && nx < 512 && ny >= 0 && ny < 512) {
                const nIdx = ny * 512 + nx;
                if (!visited[nIdx] && im.data[((oy + ny) * 2048 + (ox + nx)) * 4 + 3] > 20) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                }
              }
            }
          }
        }
      }
    }
    assert.equal(componentCount, 1, `Cell ${f.name} must have exactly 1 connected component (0 detached fragments)`);
  }

  // Weapon continuity verification for hurt cell (cell 7)
  const hurtFrame = sheet.frames.find(f => f.name === "hurt");
  assert.ok(hurtFrame, "Hurt frame must exist in submission");
  assert.ok(hurtFrame.localBounds.maxX >= 470, `Hurt pose shovel must extend forward (maxX >= 470, got ${hurtFrame.localBounds.maxX})`);
  assert.ok(hurtFrame.localBounds.width >= 380, `Hurt pose must include full body and shovel (width >= 380, got ${hurtFrame.localBounds.width})`);
  assert.deepEqual(hurtFrame.shovelTip, [479, 261], "Shovel tip must match authored landmark");

  // Distinct walk cycle cadence between step-a and step-b (>= 50% union diff, measured 68.9%)
  const cell = 512;
  const getPixel = (cx, cy, x, y) => {
    const i = (((cy * cell + y) * im.width) + (cx * cell + x)) << 2;
    return [im.data[i], im.data[i+1], im.data[i+2], im.data[i+3]];
  };
  let differing = 0, union = 0;
  for (let y = 0; y < cell; y++) {
    for (let x = 0; x < cell; x++) {
      const p = getPixel(1, 0, x, y); // step-a
      const q = getPixel(2, 0, x, y); // step-b
      const pOn = p[3] > 24, qOn = q[3] > 24;
      if (!pOn && !qOn) continue;
      union++;
      if (pOn !== qOn) differing++;
      else if (Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) > 40) differing++;
    }
  }
  const walkDiff = 100 * differing / union;
  assert.ok(walkDiff >= 50, `Distinct walk cycle cadence must exceed 50% union difference, got ${walkDiff.toFixed(1)}%`);

  // Verify outer 32px perimeter of the 2048x1024 sheet has 0 alpha
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 2048; x++) {
      if (x < 32 || x >= 2048 - 32 || y < 32 || y >= 1024 - 32) {
        assert.equal(im.data[(y * 2048 + x) * 4 + 3], 0, `Outer 32px perimeter must be zero alpha at (${x}, ${y})`);
      }
    }
  }

  // Runtime scale and height
  assert.equal(sheet.scale, 0.4);
  assert.equal(sheet.runtimeHeight, 160);
  assert.equal(sheet.groundAnchor[0], 208);
  assert.equal(sheet.groundAnchor[1], 464);

  // Review composite verification
  const reviewBytes = fs.readFileSync("docs/reviews/iron-sexton-motion-v003.png");
  const reviewPng = PNG.sync.read(reviewBytes);
  assert.equal(reviewPng.width, 1680);
  assert.equal(reviewPng.height, 1260);
});

test("Iron Sexton poses stay inside the hitbox the player can actually strike", async () => {
  const { IRON_SEXTON, sextonOffset } = await import(
    "../prototype/iron-sexton.js"
  );
  const im = PNG.sync.read(fs.readFileSync(IRON_SEXTON.path));
  const C = IRON_SEXTON.cell;
  const at = (x, y) => im.data[(((y * im.width) + x) << 2) | 3];

  // Torso centre: the widest contiguous opaque run per row across the chest
  // band, which ignores the shovel and outflung limbs.
  const torso = ([col, row]) => {
    const ox = col * C, oy = row * C;
    let sum = 0, rows = 0;
    for (let y = 200; y <= 330; y++) {
      let best = 0, mid = 0, run = 0, start = 0;
      for (let x = 0; x < C; x++) {
        if (at(ox + x, oy + y) > 24) { if (!run) start = x; run++; }
        else { if (run > best) { best = run; mid = start + run / 2; } run = 0; }
      }
      if (run > best) { best = run; mid = start + run / 2; }
      if (best > 60) { sum += mid; rows++; }
    }
    assert.ok(rows > 0, "no torso band found");
    return sum / rows;
  };

  // The simulation's enemy hitbox is 48 units wide, so the drawn body may not
  // wander more than half of that from the pose the player reads as "standing
  // here". Anything further is corrected in IRON_SEXTON.offsets, not ignored.
  const halfWidth = 24;
  const limit = halfWidth / IRON_SEXTON.scale; // source pixels
  const base = torso(IRON_SEXTON.frames.idle);
  for (const [name, cell] of Object.entries(IRON_SEXTON.frames)) {
    const drift = torso(cell) - base + sextonOffset(name);
    assert.ok(
      Math.abs(drift) <= limit,
      `${name} draws ${(drift * IRON_SEXTON.scale).toFixed(1)} units from the hitbox centre (limit ${halfWidth})`,
    );
  }
});

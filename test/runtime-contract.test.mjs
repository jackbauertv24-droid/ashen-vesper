// The runtime contract every stage must satisfy.
//
// Part A pins the shared rules in prototype/physics.js against synthetic
// geometry. Part B runs the same assertions against every registered stage,
// so a stage that re-implements movement fails here instead of shipping a
// quietly different game. Register new stages in `stages` below.
import test from "node:test";
import assert from "node:assert/strict";
import {
  BODY,
  MOVE,
  standBlocked,
  groundAt,
  stepHorizontal,
  stepVertical,
} from "../prototype/physics.js";
import fs from "node:fs";
import { PNG } from "pngjs";
import { platformCap } from "../prototype/environment-metrics.js";
import { IRON_SEXTON, sextonFrame } from "../prototype/iron-sexton.js";
import { DAMAGE, DEATH_TIME, HURT_TIME, damagePose } from "../prototype/hero-render.js";
import * as road from "../prototype/encounter-sim.js";
import * as cloister from "../prototype/cloister-sim.js";
import * as cistern from "../prototype/cistern-sim.js";

const stages = [
  ["Pilgrim Road", road],
  ["Ruined Cloister", cloister],
  ["Flooded Cistern", cistern],
];

const body = (over = {}) => ({
  x: 200,
  y: 600,
  vx: 0,
  vy: 0,
  grounded: true,
  facing: 1,
  crouching: false,
  attackCrouched: false,
  attack: 0,
  attackId: 0,
  hitstop: 0,
  time: 0,
  noticeTime: 0,
  invulnerable: 0,
  events: [],
  ...over,
});
const frame = (s, input, platforms, dt = 1 / 60, options = {}) => {
  s.events = [];
  const ctx = stepHorizontal(s, input, dt, platforms, options);
  stepVertical(s, ctx, dt, platforms);
  return s;
};

// ---------- Part A: the shared rules ----------

test("contract: a low ceiling keeps the body crouched when crouch is released", () => {
  const platforms = [
    { x: 0, y: 600, w: 400 },
    { x: 120, y: 400, w: 200, h: 100 }, // underside at 500
  ];
  const s = body({ crouching: true });
  assert.equal(standBlocked(s, platforms), true);
  frame(s, {}, platforms);
  assert.equal(s.crouching, true, "must not stand up into the ceiling");
  const clear = body({ x: 380, crouching: true });
  frame(clear, {}, platforms);
  assert.equal(clear.crouching, false, "must stand once clear of the ceiling");
});

test("contract: solid masonry blocks both directions", () => {
  const platforms = [
    { x: 0, y: 600, w: 1000 },
    { x: 500, y: 500, w: 100, h: 100 },
  ];
  const right = body({ x: 470 });
  for (let i = 0; i < 30; i++) frame(right, { right: true }, platforms);
  assert.ok(
    right.x <= 500 - BODY.halfWidth + 0.01,
    `blocked from the left, got ${right.x}`,
  );
  const left = body({ x: 630 });
  for (let i = 0; i < 30; i++) frame(left, { left: true }, platforms);
  assert.ok(
    left.x >= 600 + BODY.halfWidth - 0.01,
    `blocked from the right, got ${left.x}`,
  );
});

test("contract: the underside of a ledge stops a jump", () => {
  const platforms = [
    { x: 0, y: 700, w: 600 },
    { x: 100, y: 400, w: 300, h: 100 }, // underside at 500
  ];
  const s = body({ y: 700 });
  let highest = s.y;
  frame(s, { jump: true }, platforms);
  for (let i = 0; i < 40; i++) {
    frame(s, {}, platforms);
    highest = Math.min(highest, s.y);
  }
  assert.ok(
    highest >= 500 + BODY.standing - 0.5,
    `head must stop at the underside, feet reached ${highest}`,
  );
});

test("contract: a large frame delay cannot teleport the body", () => {
  const platforms = [{ x: 0, y: 600, w: 4000 }];
  const s = body();
  frame(s, { right: true }, platforms, 5);
  assert.ok(s.x - 200 <= MOVE.run / 30 + 0.01, `moved ${s.x - 200}`);
});

// ---------- Part B: every stage obeys the same contract ----------

for (const [name, M] of stages) {
  const tick = (s, input = {}, n = 1, options = {}) => {
    for (let i = 0; i < n; i++) M.step(s, input, 1 / 60, options);
    return s;
  };

  test(`${name}: ground run speed is the shared run speed`, () => {
    const s = tick(M.create(), { right: true }, 20);
    assert.equal(Math.abs(s.vx), MOVE.run);
  });

  test(`${name}: crouch walk speed is the shared crouch speed`, () => {
    const s = tick(M.create(), { right: true, crouch: true }, 20);
    assert.equal(s.crouching, true);
    assert.equal(Math.abs(s.vx), MOVE.crouchRun);
  });

  test(`${name}: air control is opt-in and steers the body`, () => {
    const off = M.create();
    M.step(off, { jump: true }, 1 / 60, { airControl: false });
    tick(off, { right: true }, 12, { airControl: false });
    assert.equal(off.vx, 0, "no steering without air control");

    const on = M.create();
    M.step(on, { jump: true }, 1 / 60, { airControl: true });
    tick(on, { right: true }, 12, { airControl: true });
    assert.ok(on.vx > 100, `air control must steer, got ${on.vx}`);
  });

  test(`${name}: a jump leaves the ground with the shared impulse`, () => {
    const s = M.create();
    M.step(s, { jump: true }, 1 / 60, {});
    assert.equal(s.grounded, false);
    assert.ok(s.vy < MOVE.jump / 2, `jump impulse, got ${s.vy}`);
    assert.ok(s.events.includes("jump"));
  });

  test(`${name}: a ground attack locks horizontal movement`, () => {
    const s = tick(M.create(), { right: true, attack: true }, 1);
    assert.ok(s.attack > 0);
    assert.equal(s.vx, 0);
  });

  test(`${name}: impact pause freezes the simulation`, () => {
    const s = M.create();
    assert.ok("hitstop" in s, "every stage carries the impact pause field");
    s.hitstop = 0.05;
    const x = s.x;
    tick(s, { right: true }, 1);
    assert.equal(s.x, x, "no movement while frozen");
  });

  test(`${name}: falling off the world respawns and counts a death`, () => {
    const s = M.create();
    s.y = MOVE.killPlane + 10;
    s.grounded = false;
    tick(s, {}, 1);
    assert.equal(s.deaths, 1);
    assert.equal(s.hp, 5);
    assert.ok(s.y <= MOVE.killPlane);
  });
}

// ---------- Part C: art the runtime repeats must actually tile ----------

test("contract: the repeated floor cap tiles without a seam or lighting drift", () => {
  const im = PNG.sync.read(fs.readFileSync(platformCap.path));
  const { width: w, height: h, data } = im;
  const px = (x, y) => {
    const i = (y * w + x) << 2;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };
  const rows = [];
  for (let y = 0; y < h; y++) if (px(w >> 1, y)[3] > 200) rows.push(y);
  assert.ok(rows.length > 0, "cap must have an opaque body");

  // Butting two copies together must not produce a visible edge.
  let seam = 0,
    n = 0;
  for (const y of rows) {
    const a = px(w - 1, y),
      b = px(0, y);
    assert.ok(
      a[3] > 200 && b[3] > 200,
      `repeating strip must be opaque at both edges (row ${y})`,
    );
    seam += Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
    n++;
  }
  assert.ok(seam / n <= 6, `seam colour jump ${(seam / n).toFixed(1)} is visible`);

  // Painted left-to-right lighting repeats as stripes across a long floor.
  const band = (x0, x1) => {
    let sum = 0,
      count = 0;
    for (const y of rows)
      for (let x = x0; x < x1; x++) {
        const q = px(x, y);
        if (q[3] > 200) {
          sum += q[0] - q[2];
          count++;
        }
      }
    return count ? sum / count : 0;
  };
  const drift = Math.abs(band(0, Math.floor(w * 0.1)) - band(Math.floor(w * 0.9), w));
  assert.ok(drift <= 8, `cool-to-warm drift of ${drift.toFixed(1)} will stripe`);
});

// ---------- Part D: stage actors are wired to real sheet cells ----------

test("contract: every enemy mode maps to a real Iron Sexton pose", () => {
  const { cell, frames, offsets, anchor, scale } = IRON_SEXTON;
  const modes = ["patrol", "approach", "windup", "strike", "recover", "hurt"];
  for (const mode of modes) {
    for (const timer of [0.8, 0.2]) {
      const pose = sextonFrame({ mode, timer }, 0);
      assert.ok(frames[pose], `${mode} -> unknown pose ${pose}`);
      const [col, row] = frames[pose];
      assert.ok(col >= 0 && col < 4 && row >= 0 && row < 2, `${pose} outside the grid`);
    }
  }
  // A mode that covers ground must never hold a standing pose. Patrol drifts
  // as well as approach, and keying poses to the mode left the Sexton sliding
  // back and forth in the idle frame.
  for (const mode of ["patrol", "approach"]) {
    assert.equal(
      sextonFrame({ mode, timer: 0, moving: false, walk: 0 }),
      "idle",
      `${mode} should stand still when it is not moving`,
    );
    const walking = sextonFrame({ mode, timer: 0, moving: true, walk: 0 });
    assert.notEqual(walking, "idle", `${mode} must not slide in a standing pose`);
    const later = sextonFrame({ mode, timer: 0, moving: true, walk: 40 });
    assert.notEqual(walking, later, `${mode} must alternate its step poses`);
  }
  // every recorded offset names a pose that exists
  for (const name of Object.keys(offsets))
    assert.ok(frames[name], `offset recorded for unknown pose ${name}`);
  assert.equal(cell, 512);
  assert.ok(anchor[0] > 0 && anchor[1] > 0);
  assert.ok(scale > 0.4 && scale < 0.5, `unexpected runtime scale ${scale}`);
});

test("contract: a walking enemy stops at a ledge instead of crossing the gap", () => {
  const solid = [
    { x: 0, y: 600, w: 900 },
    { x: 1010, y: 600, w: 1050 },
  ];
  assert.ok(groundAt(500, 600, solid), "solid ground is found");
  assert.equal(groundAt(950, 600, solid), null, "a gap has no ground");
  assert.equal(groundAt(500, 400, solid), null, "ground far below does not count");

  // Lure the Cloister enemy toward the hole at 900..1010 and hold it there.
  const s = cloister.create();
  // Just across the gap and inside the 430-unit approach range, so the enemy
  // actively walks right toward the hole at 900..1010.
  s.x = 1150;
  for (let i = 0; i < 900; i++) {
    cloister.step(s, {}, 1 / 60, {});
    s.x = 1150;
    assert.ok(
      groundAt(s.enemy.x, s.enemy.y, cloister.platforms),
      `enemy walked out over the gap at x=${s.enemy.x.toFixed(1)}`,
    );
  }
  assert.ok(s.enemy.x > 800, "it should still have advanced toward the ledge");
});

test("contract: at stage start an idle enemy never slides in a standing pose", () => {
  // Exactly the opening of Stage 02: the player has not moved yet, and the
  // Sexton is drifting on patrol well outside its approach range.
  const s = cloister.create();
  let slid = 0, drifted = 0;
  for (let i = 0; i < 1200; i++) {
    const before = s.enemy.x;
    cloister.step(s, {}, 1 / 60, {});
    const moved = Math.abs(s.enemy.x - before);
    if (moved > 0.05) {
      drifted++;
      if (sextonFrame(s.enemy, s.time) === "idle") slid++;
    }
  }
  assert.ok(drifted > 100, `the patrol should actually move, got ${drifted} frames`);
  assert.equal(slid, 0, `enemy slid in a standing pose on ${slid} of ${drifted} moving frames`);
});

// ---------- Part E: no game object is a coloured box ----------

test("contract: filled rectangles are UI or debug only, never world objects", () => {
  // A flat rectangle may be UI chrome, a debug overlay, or a full-screen
  // wash. It may never stand in for a prop, an actor or a platform. Each
  // entry is a deliberate exception with a reason; an unlisted colour means
  // something in the world is being drawn as a box again.
  const allowed = {
    "#292333": "Pilgrim Road enemy health bar backing (UI)",
    "#392832": "Ruined Cloister enemy health bar backing (UI)",
    "#d0a079": "enemy health bar fill (UI)",
    "#ffa95a66": "attack hitbox, only behind the guide toggle (debug)",
    "#0b131b": "Stage 02 background clear, pending a painted backdrop",
    "#1d2b33": "Stage 03 enemy health bar backing (UI)",
  };
  for (const file of ["encounter", "cloister", "cistern"]) {
    const src = fs.readFileSync(
      new URL(`../prototype/${file}.js`, import.meta.url),
      "utf8",
    );
    for (const m of src.matchAll(/ctx\.fillRect\(/g)) {
      // the nearest preceding fillStyle assignment governs this rectangle
      const before = src.slice(0, m.index);
      const k = before.lastIndexOf("fillStyle");
      assert.ok(k >= 0, `${file}.js: fillRect with no fillStyle before it`);
      const decl = before.slice(k, k + 80);
      const literal = decl.match(/fillStyle\s*=\s*"([^"]+)"/);
      if (!literal) continue; // a gradient or pattern, not a flat colour
      assert.ok(
        allowed[literal[1]],
        `${file}.js fills a rectangle with ${literal[1]}, which is not a permitted UI or debug colour. Game objects must use an art asset.`,
      );
    }

    // Gradients are the other way a world object gets faked. Each renderer
    // gets exactly one: the full-screen atmospheric wash behind the art. A
    // second one means something in the world is being shaded by hand —
    // Stage 03's water was a gradient with a sine-wave stroke for ripples
    // before it was removed.
    const gradients = (src.match(/create(Linear|Radial)Gradient/g) || []).length;
    assert.equal(
      gradients,
      1,
      `${file}.js creates ${gradients} gradients; one full-screen wash is allowed and anything else must be an art asset`,
    );
  }
});

// ---------- Part F: going down is a sequence, not a teleport ----------

for (const [name, M] of stages) {
  test(`${name}: a fatal hit plays out before the respawn`, () => {
    const s = M.create();
    s.x = 400;
    s.dying = DEATH_TIME;
    const where = s.x;

    // The stage holds still while the player is down.
    for (let i = 0; i < 40; i++) M.step(s, { right: true }, 1 / 60, {});
    assert.equal(s.x, where, "the player must not be driveable while down");
    assert.ok(s.dying > 0, "still going down");
    assert.ok(damagePose(s), "a damage pose is showing");

    // And the pose progresses rather than holding one frame.
    const early = damagePose(s);
    for (let i = 0; i < 60; i++) M.step(s, {}, 1 / 60, {});
    assert.notEqual(damagePose(s), early, "the sequence advances");

    // Then, and only then, the respawn.
    for (let i = 0; i < 120; i++) M.step(s, {}, 1 / 60, {});
    assert.equal(s.dying, 0);
    assert.equal(s.hp, 5, "respawned at full health");
    assert.equal(s.deaths, 1);
    assert.equal(damagePose(s), null, "upright again");
  });
}

test("contract: a non-fatal hit shows the recoil pose, then clears", () => {
  const s = cloister.create();
  s.hurtFor = HURT_TIME;
  assert.equal(damagePose(s), "hurt");
  for (let i = 0; i < 30; i++) cloister.step(s, {}, 1 / 60, {});
  assert.equal(damagePose(s), null, "the recoil is brief");
});

test("contract: the damage sheet faces the same way as the hero's other sheets", () => {
  // All Bellwarden sheets are drawn facing right, so they all take the same
  // mirror from s.facing. Setting this to -1 flips the hero to face away
  // from whatever just hit her, which is easy to do and hard to notice in a
  // still frame. Change it only with a sheet that genuinely faces left.
  assert.equal(
    DAMAGE.sheetFacing,
    1,
    "the damage sheet faces right like the pilot and airborne sheets",
  );
});

test("contract: hand-drawn strokes and arcs are accounted for", () => {
  // fillRect and gradients are covered above. Paths are the third way a
  // world object gets faked: the Pilgrim Road drew a censer's chain as a
  // line, its broken remnant as an arc, a highlight along every platform
  // lip, and the sanctuary checkpoint as a filled circle. Each renderer
  // declares what it still draws by hand and why.
  const expected = {
    encounter: {
      arc: 1, // enemy windup timer ring (HUD drawn in world space)
      stroke: 1, // the same ring
      fill: 0,
      moveTo: 1, // gate seal outline, a clip path over the portal art
      lineTo: 1, // the same outline
    },
    cloister: { arc: 0, stroke: 0, fill: 0, moveTo: 0, lineTo: 0 },
    cistern: { arc: 0, stroke: 0, fill: 0, moveTo: 0, lineTo: 0 },
  };
  for (const [file, counts] of Object.entries(expected)) {
    const src = fs.readFileSync(
      new URL(`../prototype/${file}.js`, import.meta.url),
      "utf8",
    );
    for (const [call, want] of Object.entries(counts)) {
      const found = (src.match(new RegExp(`ctx\\.${call}\\(`, "g")) || []).length;
      assert.equal(
        found,
        want,
        `${file}.js has ${found} ctx.${call}() calls, expected ${want}. A new one must either be UI or use an art asset.`,
      );
    }
  }
});

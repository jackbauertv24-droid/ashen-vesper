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
import { HERO_HEIGHT, platformCap, censer, props, visible } from "../prototype/environment-metrics.js";
import { IRON_SEXTON, sextonFrame } from "../prototype/iron-sexton.js";
import { DAMAGE, DEATH_TIME, HURT_TIME, damagePose } from "../prototype/hero-render.js";
import { LOOK, VIEW, trackCamera } from "../prototype/camera.js";
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
    // A stage deeper than one screen sets its own floor; the shared 900-unit
    // plane was written when every stage fitted the viewport.
    s.y = (M.LEVEL.killPlane ?? MOVE.killPlane) + 10;
    s.grounded = false;
    tick(s, {}, 1);
    assert.equal(s.deaths, 1);
    assert.equal(s.hp, 5);
    assert.ok(s.y <= (M.LEVEL.killPlane ?? MOVE.killPlane));
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

test("contract: enemy disengaging from chase never teleports into patrol", () => {
  // Cloister Sexton: lure enemy in approach mode, then step away.
  const cl = cloister.create();
  cl.x = cl.enemy.home - 200;
  for (let i = 0; i < 60; i++) cloister.step(cl, {}, 1 / 60, {});
  assert.equal(cl.enemy.mode, "approach");
  cl.x = cl.enemy.x - 500;
  const beforeClX = cl.enemy.x;
  cloister.step(cl, {}, 1 / 60, {});
  const deltaCl = Math.abs(cl.enemy.x - beforeClX);
  assert.equal(cl.enemy.mode, "patrol");
  assert.ok(deltaCl <= (78 / 60) + 0.05, `Sexton snapped ${deltaCl.toFixed(1)}px on disengage, expected smooth walk`);

  // Pilgrim Road enemy: lure into approach, then disengage.
  const rd = road.create();
  const e = rd.enemies[0];
  rd.x = e.home - 200;
  for (let i = 0; i < 60; i++) road.step(rd, {}, 1 / 60, {});
  assert.equal(e.mode, "approach");
  rd.x = e.x - 500;
  const beforeRdX = e.x;
  road.step(rd, {}, 1 / 60, {});
  const deltaRd = Math.abs(e.x - beforeRdX);
  assert.equal(e.mode, "patrol");
  assert.ok(deltaRd <= (78 / 60) + 0.05, `Pilgrim snapped ${deltaRd.toFixed(1)}px on disengage, expected smooth walk`);
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

test("contract: hurt state locks horizontal sprint, jumping, and new attack swings", () => {
  for (const [name, M] of stages) {
    const s = M.create();
    s.hurtFor = HURT_TIME;
    const startX = s.x;

    // Movement input while hurt must not slide the character.
    M.step(s, { right: true }, 1 / 60, {});
    assert.equal(s.vx, 0, `${name}: grounded sprint must be locked during hurt recoil`);
    assert.equal(s.x, startX, `${name}: position must not advance during hurt recoil`);

    // Attack input while hurt must not initiate a swing.
    M.step(s, { attack: true }, 1 / 60, {});
    assert.equal(s.attack, 0, `${name}: new attack must be locked during hurt recoil`);
  }
});

test("contract: tactical quick-step dodge grants evasion, i-frames and smooth deceleration", () => {
  for (const [name, M] of stages) {
    const s = M.create();
    s.x = 400;
    s.facing = 1;
    const initialX = s.x;

    // Neutral dodge triggers backward quick-step away from facing.
    M.step(s, { dodge: true }, 1 / 60, {});
    assert.ok(s.dodging > 0, `${name}: dodging must activate`);
    assert.equal(s.dodgeDir, -1, `${name}: neutral dodge must retreat backwards`);
    assert.ok(s.invulnerable > 0, `${name}: dodge must grant invulnerability`);
    assert.ok(s.events.includes("dodge"), `${name}: dodge event must fire`);
    assert.ok(s.vx < 0, `${name}: backward velocity must be applied`);

    // While dodging, attack and jump cannot interrupt the slide.
    M.step(s, { attack: true, jump: true }, 1 / 60, {});
    assert.equal(s.attack, 0, `${name}: attack locked during dodge`);
    assert.equal(s.grounded, true, `${name}: jump locked during dodge`);

    // Let the dodge conclude.
    for (let i = 0; i < 30; i++) M.step(s, {}, 1 / 60, {});
    assert.equal(s.dodging, 0, `${name}: dodge clears`);
    assert.ok(s.x < initialX, `${name}: player completed backward displacement`);
  }
});

test("contract: every stage declares its dodge state instead of leaning on undefined", () => {
  // The dodge guards read s.dodging and s.dodgeCooldown before anything sets
  // them. Relying on `undefined > 0` being false works until someone writes
  // a guard the other way round, so each stage must own the fields.
  for (const [name, M] of stages) {
    const s = M.create();
    for (const field of ["dodging", "dodgeDir", "dodgeCooldown"])
      assert.equal(
        typeof s[field],
        "number",
        `${name}: create() must declare ${field} as a number`,
      );

    s.x = 400;
    M.step(s, { dodge: true }, 1 / 60, {});
    assert.ok(s.dodging > 0, `${name}: dodge must be mid-flight before respawn`);
    M.respawn(s);
    assert.equal(s.dodging, 0, `${name}: respawn must clear the dodge`);
    assert.equal(s.dodgeCooldown, 0, `${name}: respawn must clear the cooldown`);
  }
});

test("contract: a chained dodge cannot buy permanent invulnerability", () => {
  // Without a recovery window the i-frames of one dodge reach the start of the
  // next, so holding the button is a free win. Two seconds of spam must still
  // leave the player open for a meaningful share of the time.
  for (const [name, M] of stages) {
    const s = M.create();
    s.x = 400;
    let open = 0;
    for (let i = 0; i < 120; i++) {
      M.step(s, { dodge: true }, 1 / 60, {});
      if (!(s.invulnerable > 0)) open++;
    }
    assert.ok(
      open > 24,
      `${name}: chained dodging left only ${open}/120 vulnerable frames`,
    );
  }
});

test("contract: dodge cannot start out of an attack, a flinch or the air", () => {
  for (const [name, M] of stages) {
    const attacking = M.create();
    attacking.x = 400;
    M.step(attacking, { attack: true }, 1 / 60, {});
    assert.ok(attacking.attack > 0, `${name}: attack must be running`);
    M.step(attacking, { dodge: true }, 1 / 60, {});
    assert.equal(attacking.dodging, 0, `${name}: no dodge cancel out of a swing`);

    const hurt = M.create();
    hurt.x = 400;
    hurt.hurtFor = HURT_TIME;
    M.step(hurt, { dodge: true }, 1 / 60, {});
    assert.equal(hurt.dodging, 0, `${name}: no dodge cancel out of a flinch`);

    const airborne = M.create();
    airborne.x = 400;
    M.step(airborne, { jump: true }, 1 / 60, {});
    assert.equal(airborne.grounded, false, `${name}: must be airborne`);
    M.step(airborne, { dodge: true }, 1 / 60, {});
    assert.equal(airborne.dodging, 0, `${name}: dodge is a grounded move`);
  }
});

test("contract: a held direction steers the dodge, neutral retreats", () => {
  for (const [name, M] of stages) {
    const forward = M.create();
    forward.x = 400;
    forward.facing = 1;
    M.step(forward, { dodge: true, right: true }, 1 / 60, {});
    assert.equal(forward.dodgeDir, 1, `${name}: held direction steers the dodge`);

    const neutral = M.create();
    neutral.x = 400;
    neutral.facing = 1;
    M.step(neutral, { dodge: true }, 1 / 60, {});
    assert.equal(neutral.dodgeDir, -1, `${name}: neutral dodge retreats`);
  }
});

test("contract: striking an enemy applies physical flinch displacement", () => {
  // Pilgrim Road enemy strike flinch
  const rd = road.create();
  const pe = rd.enemies[0];
  rd.x = pe.x - 70;
  const peBefore = pe.x;
  road.step(rd, { attack: true }, 1 / 60, {});
  for (let i = 0; i < 15; i++) road.step(rd, {}, 1 / 60, {});
  assert.ok(pe.x > peBefore, "Pilgrim flinched backwards on hit");

  // Cloister Sexton strike flinch
  const cl = cloister.create();
  cl.x = cl.enemy.x - 70;
  const seBefore = cl.enemy.x;
  cloister.step(cl, { attack: true }, 1 / 60, {});
  for (let i = 0; i < 15; i++) cloister.step(cl, {}, 1 / 60, {});
  assert.ok(cl.enemy.x > seBefore, "Sexton flinched backwards on hit");
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

// ---------- Part G: one camera, two axes ----------

test("contract: the camera lead eases rather than snapping when you turn", () => {
  const s = { x: 1000, y: 600, facing: 1, look: LOOK.lead, camera: 0, cameraY: 0 };
  const level = { width: 6400, height: 720 };
  trackCamera(s, level, 1 / 60, {});
  s.facing = -1;
  trackCamera(s, level, 1 / 60, {});
  assert.ok(
    s.look > 0,
    `turning must swing the lead gradually, not jump to ${s.look}`,
  );
  for (let i = 0; i < 240; i++) trackCamera(s, level, 1 / 60, {});
  assert.ok(s.look < -LOOK.lead * 0.9, "and it does arrive");
});

test("contract: the camera stays inside the stage on both axes", () => {
  const level = { width: 4000, height: 3000 };
  for (const [x, y] of [[-500, -500], [99999, 99999], [2000, 1500]]) {
    const s = { x, y, facing: 1, look: 0, camera: 0, cameraY: 0 };
    for (let i = 0; i < 400; i++) trackCamera(s, level, 1 / 60, {});
    assert.ok(s.camera >= 0 && s.camera <= level.width - VIEW.width,
      `camera x ${s.camera} outside 0..${level.width - VIEW.width}`);
    assert.ok(s.cameraY >= 0 && s.cameraY <= level.height - VIEW.height,
      `camera y ${s.cameraY} outside 0..${level.height - VIEW.height}`);
  }
});

test("contract: vertical tracking is inert on a stage that fits one screen", () => {
  const s = { x: 500, y: 600, facing: 1, look: 0, camera: 0, cameraY: 0 };
  for (let i = 0; i < 200; i++) trackCamera(s, { width: 4000, height: 720 }, 1 / 60, {});
  assert.equal(s.cameraY, 0, "a short stage never scrolls vertically");
});

test("contract: vertical tracking follows the player on a tall stage", () => {
  const level = { width: 4000, height: 2600 };
  const s = { x: 500, y: 2200, facing: 1, look: 0, camera: 0, cameraY: 0 };
  for (let i = 0; i < 300; i++) trackCamera(s, level, 1 / 60, {});
  assert.ok(s.cameraY > 600, `deep in the stage the view follows down, got ${s.cameraY}`);
  s.y = 200;
  for (let i = 0; i < 300; i++) trackCamera(s, level, 1 / 60, {});
  assert.ok(s.cameraY < 200, `and back up, got ${s.cameraY}`);
});

for (const [name, M] of stages) {
  test(`${name}: scrolls vertically only as far as the stage is deep`, () => {
    const s = M.create();
    const limit = Math.max(0, (M.LEVEL.height ?? 720) - VIEW.height);
    for (let i = 0; i < 400; i++) M.step(s, { right: true }, 1 / 60, {});
    assert.ok(
      s.cameraY >= 0 && s.cameraY <= limit,
      `${name}: camera y ${s.cameraY} outside 0..${limit}`,
    );
    if (limit === 0)
      assert.equal(s.cameraY, 0, "a one-screen stage must not scroll at all");
  });
}

// ---------- Part H: a prop is drawn the size of the thing you can hit ----------

test("contract: the censer is not drawn larger than its strike box", () => {
  // encounter-sim gives each brazier a 48x62 strike box from b.y-48 to b.y+14.
  // The art was once drawn at 96x103, twice the box, so the bell the player
  // saw was not the bell the player could hit — and it towered over a hero
  // only 144 units tall.
  // Art must not EXCEED the interactive box. Sitting inside it is fine and
  // makes the prop marginally easier to strike than it looks; filling it
  // exactly is not required, and demanding that once grew this bell by a
  // fifth.
  const box = { w: 48, h: 62, top: -48, bottom: 14 };
  const bellH = censer.draw * (censer.bellBottom - censer.bellTop);
  const bellW = censer.draw * censer.bellWidth;
  const bellTop = censer.top + censer.draw * censer.bellTop;
  const bellBottom = censer.top + censer.draw * censer.bellBottom;

  assert.ok(
    bellH <= box.h + 2,
    `bell is ${bellH.toFixed(0)} units tall, taller than its ${box.h}-unit strike box`,
  );
  assert.ok(
    bellW <= box.w + 2,
    `bell is ${bellW.toFixed(0)} units wide, wider than its ${box.w}-unit strike box`,
  );
  assert.ok(
    bellTop >= box.top - 2 && bellBottom <= box.bottom + 2,
    `bell spans ${bellTop.toFixed(0)}..${bellBottom.toFixed(0)}, outside the box ${box.top}..${box.bottom}`,
  );
  assert.ok(
    censer.draw < 144,
    `the whole censer assembly (${censer.draw}) should not out-scale the 144-unit hero`,
  );
});

test("contract: pickups are readable and scenery is plausible", () => {
  // These are judged by different rules on purpose.
  //
  // A pickup has to be spotted across a scrolling room, so it is sized for
  // readability. Sizing it for physical plausibility instead produced a
  // 22cm ember — a believable coal and an unreadable game item — which is
  // the wrong trade for the object the whole first encounter is about.
  //
  // Scenery nobody has to find, so plausible size is the right rule there.
  const bands = {
    ember: ["pickup", 40, 56, "the quest item; it must be unmistakable"],
    vial: ["pickup", 30, 44, "a consumable; clearly readable, below the quest item"],
    lantern: ["scenery", 32, 52, "a hanging lantern at a believable size"],
  };
  for (const [name, [kind, lo, hi, why]] of Object.entries(bands)) {
    const prop = props[name];
    assert.ok(prop, `${name} is declared in environment-metrics`);
    assert.equal(prop.kind, kind, `${name} is categorised as ${kind}`);
    const v = visible(prop);
    assert.ok(
      v.h >= lo && v.h <= hi,
      `${name} draws ${v.h.toFixed(0)} units tall, ${((v.h / HERO_HEIGHT) * 100).toFixed(0)}% of the hero; ${why} — expected ${lo}-${hi}`,
    );
  }

  // The floor that matters: a pickup smaller than a fifth of the hero does
  // not read as a collectable at all.
  for (const [name, prop] of Object.entries(props)) {
    if (prop.kind !== "pickup") continue;
    const v = visible(prop);
    assert.ok(
      v.h >= HERO_HEIGHT * 0.2,
      `${name} is only ${((v.h / HERO_HEIGHT) * 100).toFixed(0)}% of the hero; a pickup that small is missable`,
    );
    assert.ok(
      v.h <= HERO_HEIGHT * 0.45,
      `${name} at ${((v.h / HERO_HEIGHT) * 100).toFixed(0)}% of the hero is competing with the character`,
    );
  }

  // And the quest item should read as the more important of the two.
  assert.ok(
    visible(props.ember).h > visible(props.vial).h,
    "the ember is the object of the encounter and should be the larger pickup",
  );
});

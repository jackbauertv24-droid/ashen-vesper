import test from "node:test";
import assert from "node:assert/strict";
import {
  create,
  step,
  LEVEL,
  WATER,
  VIAL,
  platforms,
} from "../prototype/cistern-sim.js";
import { reachableFrom } from "../prototype/reachability.js";

const tick = (s, input = {}, n = 1, o = {}) => {
  for (let i = 0; i < n; i++) step(s, input, 1 / 60, o);
  return s;
};

test("every ledge in the cistern can be reached from the entrance", () => {
  const out = reachableFrom(platforms, { x: 150, y: 420 });
  assert.deepEqual(
    out.unreachable.map((u) => `y=${u.p.y} x=${u.p.x}`),
    [],
    "a vertical map is where you strand a ledge; none here is stranded",
  );
});

test("the cistern is a descent and a climb, not a corridor", () => {
  const heights = new Set(platforms.map((p) => p.y));
  assert.ok(heights.size >= 8, `only ${heights.size} distinct heights`);
  const span = Math.max(...heights) - Math.min(...heights);
  assert.ok(span > 720, `vertical span is only ${span}, still one screen`);
  assert.ok(LEVEL.height > 720, "the stage box must be taller than a screen");
});

test("the route forks and both ways lead on", () => {
  // From the foot of the descent one way climbs the gallery and the other
  // drops to the flooded floor. Both must continue to the valve chamber.
  const foot = platforms.find((p) => p.y === 880);
  const gallery = platforms.find((p) => p.y === 610 && p.w > 400);
  const flood = platforms.find((p) => p.y === 1360);
  const valve = platforms.find((p) => p.y === 980);
  for (const [name, p] of Object.entries({ foot, gallery, flood, valve }))
    assert.ok(p, `${name} platform exists`);

  const fromFoot = reachableFrom(platforms, { x: foot.x + 20, y: foot.y });
  const idx = (q) => platforms.indexOf(q);
  for (const [name, q] of Object.entries({ gallery, flood, valve }))
    assert.ok(fromFoot.reached.has(idx(q)), `${name} is reachable from the fork`);
});

test("the vial sits on the long way round, not the short one", () => {
  const gallery = platforms.find((p) => p.y === 610 && p.w > 400);
  assert.ok(
    VIAL.x >= gallery.x && VIAL.x <= gallery.x + gallery.w,
    "the reward belongs to the safer, longer route",
  );
  assert.ok(VIAL.y < 900, "and it is up on the gallery, not down in the water");
});

test("cistern water drowns and returns the player to the entrance", () => {
  const s = create();
  s.x = 2300; // off the side of the flooded floor
  s.y = WATER.drown - 20;
  s.grounded = false;
  tick(s, {}, 60);
  assert.equal(s.drownings, 1);
  assert.equal(s.deaths, 1);
  assert.equal(s.hp, 5);
  assert.ok(s.y <= 500, "respawn is back at the sluice");
});

test("cistern gate holds until the sluice valve is turned", () => {
  const s = create();
  s.x = LEVEL.gate - 80;
  s.y = 980;
  tick(s, { right: true }, 40);
  assert.ok(s.x < LEVEL.gate, `gate must block, got ${s.x}`);
  s.x = LEVEL.lever;
  tick(s, { interact: true });
  assert.equal(s.leverOn, true);
  s.x = LEVEL.gate - 80;
  tick(s, { right: true }, 40);
  assert.ok(s.x > LEVEL.gate, `the way opens once the valve is turned, got ${s.x}`);
});

test("the Lurker waits on the flooded floor and telegraphs before it strikes", () => {
  const s = create();
  assert.equal(s.enemy.mode, "rest");
  assert.equal(s.enemy.y, 1360, "it lives down in the water, not on the route above");
  // Stand at the far end of the flooded floor: on solid ground, but outside
  // its notice. The floor is wider than the Lurker's reach on purpose.
  s.x = 2450;
  s.y = s.enemy.y;
  tick(s, {}, 30);
  assert.equal(s.enemy.mode, "rest", "still hidden at the far end of the floor");
  s.x = s.enemy.x - 150;
  tick(s, {}, 4);
  assert.equal(s.enemy.mode, "emerge");
  assert.equal(s.hp, 5, "rising must not damage on its own");
});

test("the Lurker cannot be hit while submerged, and dies in three strikes", () => {
  const s = create();
  s.x = s.enemy.x - 60;
  s.y = s.enemy.y;
  tick(s, { attack: true }, 1);
  assert.equal(s.enemy.hp, 3, "a resting Lurker is not a target");
  assert.equal(s.enemy.mode, "emerge");
  tick(s, {}, 60);
  for (let i = 0; i < 3 && s.enemy.hp > 0; i++) {
    s.x = s.enemy.x - 60;
    s.y = s.enemy.y;
    s.invulnerable = 2;
    s.attack = 0;
    tick(s, { attack: true }, 30);
  }
  assert.equal(s.enemy.hp, 0);
});

test("the vial heals once and only once", () => {
  const s = create();
  s.hp = 2;
  s.x = VIAL.x;
  s.y = VIAL.y;
  tick(s, {}, 2);
  assert.equal(s.vialTaken, true);
  assert.equal(s.hp, 4);
  tick(s, {}, 30);
  assert.equal(s.hp, 4);
});

test("the route can be completed without drowning", () => {
  const s = create();
  for (let frame = 0; frame < 40000 && !s.complete; frame++) {
    const near =
      s.enemy.hp > 0 && s.enemy.mode !== "rest" && Math.abs(s.enemy.x - s.x) < 110;
    const here = platforms.find(
      (p) => s.x >= p.x - 14 && s.x <= p.x + p.w + 14 && Math.abs(p.y - s.y) < 4,
    );
    const atEdge = here && s.x > here.x + here.w - 50;
    const stepUp = platforms.find(
      (p) => p.x > s.x && p.x - s.x < 130 && p.y < s.y && p.y >= s.y - 110,
    );
    step(
      s,
      {
        right: !near,
        attack: near,
        jump: s.grounded && !!(stepUp || (atEdge && !stepUp)),
        interact: Math.abs(s.x - LEVEL.lever) < 90,
      },
      1 / 60,
    );
  }
  assert.equal(s.complete, true, "the route must be completable");
  assert.equal(s.drownings, 0, `no drownings on the main route, got ${s.drownings}`);
});

test("falling off the route costs progress, not a life", () => {
  // A vertical stage invites the player to drop. The first draft had ten
  // lethal edges, the very first being the entry ledge: walk right without
  // jumping and you drowned. The second draft still drowned you at the two
  // ends of the basin — which would be fair if the water were drawn, and it
  // is not, so it was an invisible instant death.
  //
  // The basin now spans the chamber and every fall lands on it. Falling
  // costs the climb back up, which is a real cost, and the player can see
  // every surface involved.
  const lethal = [];
  for (const p of platforms) {
    for (const dir of [-1, 1]) {
      const s = create();
      s.x = dir > 0 ? p.x + p.w - 6 : p.x + 6;
      s.y = p.y;
      s.grounded = true;
      s.leverOn = true; // the gate is not what this is testing
      const before = s.deaths;
      for (let i = 0; i < 420; i++) {
        step(s, dir > 0 ? { right: true } : { left: true }, 1 / 60, {});
        if (s.deaths > before) {
          lethal.push(`y=${p.y} ${dir > 0 ? "right" : "left"}`);
          break;
        }
        if (s.grounded && Math.abs(s.y - p.y) > 4) break;
      }
    }
  }
  assert.deepEqual(
    lethal.sort(),
    [],
    "nothing on the route may kill a player for walking off an edge while the water is undrawn",
  );
});

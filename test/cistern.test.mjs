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

const tick = (s, input = {}, n = 1, o = {}) => {
  for (let i = 0; i < n; i++) step(s, input, 1 / 60, o);
  return s;
};

test("cistern water drowns and returns the player to the entrance", () => {
  const s = create();
  s.x = 880; // over the first channel
  s.y = WATER.drown - 10;
  s.grounded = false;
  tick(s, {}, 40); // let it actually fall past the drown line
  assert.equal(s.drownings, 1, "falling in must count as a drowning");
  assert.equal(s.deaths, 1);
  assert.equal(s.hp, 5);
  assert.ok(s.y <= 600, "respawn is on dry ledge");
});

test("cistern gate holds until the sluice valve is turned", () => {
  const s = create();
  s.x = LEVEL.gate - 80;
  tick(s, { right: true }, 90);
  assert.ok(s.x < LEVEL.gate, `gate must block, got ${s.x}`);
  s.x = LEVEL.lever;
  tick(s, { interact: true });
  assert.equal(s.leverOn, true);
  s.x = LEVEL.gate - 80;
  // Stop short of the next channel at 3060; this checks the gate, not the jump.
  tick(s, { right: true }, 30);
  assert.ok(s.x > LEVEL.gate, `the way opens once the valve is turned, got ${s.x}`);
  assert.ok(s.x < 3060, "and this check never reaches the next channel");
});

test("the Lurker stays submerged until approached, then telegraphs", () => {
  const s = create();
  assert.equal(s.enemy.mode, "rest", "it begins hidden");
  s.x = s.enemy.x - 600;
  tick(s, {}, 30);
  assert.equal(s.enemy.mode, "rest", "still hidden at distance");
  s.x = s.enemy.x - 200;
  tick(s, {}, 4);
  assert.equal(s.enemy.mode, "emerge", "it rises when approached");
  assert.equal(s.hp, 5, "rising must not damage on its own");
  tick(s, {}, 60);
  assert.ok(["crawl", "lunge"].includes(s.enemy.mode));
});

test("the Lurker cannot be hit while submerged, and dies in three strikes", () => {
  const s = create();
  s.x = s.enemy.x - 60;
  // One frame: the strike is resolved while it is still resting, and only
  // then does it wake. A submerged Lurker is not a target.
  tick(s, { attack: true }, 1);
  assert.equal(s.enemy.hp, 3, "a resting Lurker is not a target");
  assert.equal(s.enemy.mode, "emerge", "but the approach does wake it");

  tick(s, {}, 60); // let it finish rising
  assert.notEqual(s.enemy.mode, "rest");
  for (let i = 0; i < 3 && s.enemy.hp > 0; i++) {
    s.x = s.enemy.x - 60;
    s.invulnerable = 2; // ignore its counter-attacks for this check
    s.attack = 0;
    tick(s, { attack: true }, 30);
  }
  assert.equal(s.enemy.hp, 0, "three landed strikes finish it");
});

test("the vial heals once and only once", () => {
  const s = create();
  s.hp = 2;
  s.x = VIAL.x;
  tick(s, {}, 2);
  assert.equal(s.vialTaken, true);
  assert.equal(s.hp, 4);
  tick(s, {}, 30);
  assert.equal(s.hp, 4);
});

test("every channel is jumpable and the route can be completed", () => {
  const s = create();
  for (let frame = 0; frame < 20000 && !s.complete; frame++) {
    const near =
      s.enemy.hp > 0 && s.enemy.mode !== "rest" && Math.abs(s.enemy.x - s.x) < 110;
    const edge = platforms.find((p) => s.x > p.x + p.w - 45 && s.x < p.x + p.w);
    const stepUp = platforms.find(
      (p) => p.x > s.x && p.x - s.x < 100 && p.y < s.y && p.y >= s.y - 180,
    );
    step(
      s,
      {
        right: !near,
        attack: near,
        jump: s.grounded && !!(edge || stepUp),
        interact: Math.abs(s.x - LEVEL.lever) < 90,
      },
      1 / 60,
    );
  }
  assert.equal(s.complete, true, "the route must be completable");
  assert.equal(s.drownings, 0, `no drownings on the main route, got ${s.drownings}`);
  assert.equal(s.deaths, 0);
  assert.equal(s.leverOn, true);
});

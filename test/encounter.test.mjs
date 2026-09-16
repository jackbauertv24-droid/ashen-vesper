import test from "node:test";
import assert from "node:assert/strict";
import {
  create,
  step,
  respawn,
  platforms,
  LEVEL,
} from "../prototype/encounter-sim.js";
const tick = (s, i = {}, n = 1, o = {}) => {
  for (let k = 0; k < n; k++) step(s, i, 1 / 60, o);
};
test("camera follows across screens, stays level and never leaves the world", () => {
  const s = create();
  s.x = 3300;
  tick(s, {}, 180);
  assert.ok(s.camera > 2000);
  s.x = 6380;
  s.gateOpen = true;
  tick(s, {}, 300);
  assert.ok(s.camera <= 5120);
  const before = s.camera;
  tick(s, { jump: true }, 1);
  tick(s, {}, 10);
  assert.ok(Math.abs(s.camera - before) < 1);
});
test("brazier breaks once and drops exactly one collectible", () => {
  const s = create();
  s.x = 345;
  tick(s, { attack: true }, 25);
  assert.equal(s.broken[0], true);
  assert.equal(s.drops.length, 1);
  tick(s, { attack: true }, 60);
  assert.equal(s.drops.length, 1);
  s.x = 420;
  tick(s, {}, 60);
  assert.equal(s.embers, 1);
  assert.equal(s.drops.length, 0);
});
test("enemy takes one hit per swing and dies after three strikes", () => {
  const s = create(),
    e = s.enemies[0];
  s.x = e.x - 85;
  for (let i = 0; i < 3; i++) {
    tick(s, { attack: true }, 1);
    tick(s, {}, 50);
  }
  assert.equal(e.hp, 0);
  assert.ok(s.hp > 0);
});
test("enemy telegraphs before dealing damage and invulnerability prevents repeated ticks", () => {
  const s = create();
  s.x = s.enemies[0].x - 60;
  tick(s, {}, 30);
  assert.equal(s.hp, 5);
  assert.equal(s.enemies[0].mode, "windup");
  tick(s, {}, 25);
  assert.equal(s.hp, 4);
  tick(s, {}, 6);
  assert.equal(s.hp, 4);
});
test("gate rejects missing ember and living guardian, then spends exactly one ember", () => {
  const s = create();
  s.x = 5650;
  tick(s, { interact: true });
  assert.equal(s.gateOpen, false);
  assert.match(s.notice, /one ember/);
  s.embers = 2;
  tick(s, { interact: true });
  assert.equal(s.gateOpen, false);
  s.enemies[2].hp = 0;
  tick(s, { interact: true });
  assert.equal(s.gateOpen, true);
  assert.equal(s.embers, 1);
  tick(s, { interact: true }, 30);
  assert.equal(s.embers, 1);
});
test("closed gate blocks traversal", () => {
  const s = create();
  s.x = 5650;
  tick(s, { right: true }, 180);
  assert.ok(s.x < LEVEL.gate);
});
test("checkpoint restores health and becomes respawn point", () => {
  const s = create();
  s.gateOpen = true;
  s.x = 6030;
  s.hp = 2;
  tick(s);
  assert.equal(s.checkpoint, true);
  assert.equal(s.complete, true);
  assert.equal(s.hp, 5);
  respawn(s);
  assert.equal(s.x, 6020);
  assert.equal(s.hp, 5);
});
test("death preserves collected resources and defeated enemies", () => {
  const s = create();
  s.embers = 1;
  s.broken[0] = true;
  s.enemies[0].hp = 0;
  s.y = 950;
  tick(s);
  assert.equal(s.x, 180);
  assert.equal(s.embers, 1);
  assert.equal(s.enemies[0].hp, 0);
  assert.equal(s.broken[0], true);
});
test("air control is opt-in and changes horizontal velocity", () => {
  const a = create(),
    b = create();
  tick(a, { right: true, jump: true });
  tick(b, { right: true, jump: true });
  tick(a, { left: true }, 12);
  tick(b, { left: true }, 12, { airControl: true });
  assert.equal(a.vx, 235);
  assert.ok(b.vx < 0);
});
test("all three main-route gaps can be jumped", () => {
  for (const x of [800, 2310, 3980]) {
    const s = create();
    s.x = x;
    tick(s, { right: true, jump: true });
    for (let i = 0; i < 55 && !s.grounded; i++) tick(s);
    assert.equal(s.deaths, 0);
    assert.equal(s.grounded, true);
    assert.ok(s.x > x + 100);
  }
});
test("full route can be completed using movement, jumping, combat and interaction", () => {
  const s = create();
  for (let frame = 0; frame < 12000 && !s.complete; frame++) {
    const nearby = s.enemies.find(
      (e) => e.hp > 0 && e.x > s.x - 10 && e.x - s.x < 110,
    );
    const atBrazier = !s.broken[0] && s.x > 330 && s.x < 430;
    const edge = platforms
      .slice(0, 4)
      .find((p) => s.x > p.x + p.w - 40 && s.x < p.x + p.w);
    const input = {
      right: !nearby && !atBrazier,
      attack: !!nearby || atBrazier,
      jump: !!edge && s.grounded,
      interact: s.x > 5550,
    };
    tick(s, input);
  }
  assert.equal(s.complete, true);
  assert.equal(s.deaths, 0);
  assert.equal(s.enemies.filter((e) => e.hp <= 0).length, 3);
  assert.equal(s.collected, 1);
  assert.equal(s.gateOpen, true);
});

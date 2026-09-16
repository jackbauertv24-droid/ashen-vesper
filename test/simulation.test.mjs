import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, advance, PLATFORMS, MOTION, poseIndex } from '../prototype/simulation.js';
const step = (s, input, n) => { for (let i = 0; i < n; i++) advance(s, input, 1 / 60); };
test('walking uses elapsed time and stops immediately when released', () => {
  const s = createState(); step(s, { right: true }, 60); assert.equal(s.x, 420);
  step(s, {}, 20); assert.equal(s.x, 420); assert.equal(s.y, 610); assert.equal(s.mode, 'idle');
});
test('airborne direction is locked at takeoff and movement is applied once', () => {
  const s = createState(); advance(s, { right: true, jump: true }, 1 / 60);
  assert.equal(s.x, 243); step(s, { left: true }, 10); assert.equal(s.x, 273); assert.equal(s.facing, 1);
});
test('jump clears the causeway gap and lands on the other platform', () => {
  const s = createState(); s.x = 499; advance(s, { right: true, jump: true }, 1 / 60);
  for (let i = 0; i < 50 && !s.grounded; i++) advance(s, {}, 1 / 60);
  assert.equal(s.grounded, true); assert.equal(s.y, 610); assert.ok(s.x > PLATFORMS[1].x);
});
test('raised platform catches a descending jump but allows upward passage', () => {
  const s = createState(); s.x = 820; advance(s, { jump: true }, 1 / 60);
  let highest = s.y; for (let i = 0; i < 60 && !s.grounded; i++) { advance(s, {}, 1 / 60); highest = Math.min(highest, s.y); }
  assert.ok(highest < 520); assert.equal(s.y, 520); assert.equal(s.grounded, true);
});
test('walking into a gap falls and respawns', () => {
  const s = createState(); s.x = 550; step(s, {}, 120); assert.equal(s.falls, 1); assert.equal(s.x, 240); assert.equal(s.y, 610);
});
test('attack has anticipation, one hit, recovery, and a movement lock', () => {
  const s = createState(); s.x = 1100; advance(s, { attack: true, right: true }, 1 / 60);
  assert.equal(poseIndex(s), 5); assert.equal(s.hits, 0);
  step(s, { right: true }, 22); assert.equal(s.x, 1100); assert.equal(s.hits, 1);
  assert.equal(poseIndex(s), 7); step(s, {}, 4); assert.equal(s.attacking, false); assert.equal(s.hits, 1);
});
test('turning does not move attack geometry behind the actor during a strike', () => {
  const s = createState(); s.x = 1250; s.facing = -1; advance(s, { attack: true }, 1 / 60);
  step(s, { right: true }, 24); assert.equal(s.facing, -1); assert.equal(s.hits, 1);
});
test('large frame delay cannot teleport the actor', () => {
  const s = createState(); advance(s, { right: true }, 3); assert.equal(s.x, 240 + MOTION.speed / 30);
});

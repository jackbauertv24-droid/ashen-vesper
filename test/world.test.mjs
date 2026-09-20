// Acceptance criteria from docs/ROOM_TRANSITION_BRIEF.md.
import test from "node:test";
import assert from "node:assert/strict";
import * as world from "../prototype/world.js";
import { BODY } from "../prototype/physics.js";

const tick = (w, input = {}, n = 1, o = {}) => {
  for (let i = 0; i < n; i++) world.step(w, input, 1 / 60, o);
  return w;
};
/** Put the player in the road's exit, with the encounter finished or not.
 *  The gate is opened either way: while it is shut the player is clamped
 *  behind it and cannot reach the exit at all, so the reachable locked case
 *  is an open gate with the sanctuary still unlit. */
const atExit = (complete) => {
  const w = world.create();
  const s = world.active(w);
  s.gateOpen = true;
  s.complete = complete;
  s.checkpoint = complete;
  s.x = world.ROOMS.road.exits[0].x;
  return w;
};

test("a shut gate keeps the player away from the exit entirely", () => {
  const w = world.create();
  const s = world.active(w);
  s.x = world.ROOMS.road.exits[0].x;
  tick(w, { interact: true }, 2);
  assert.ok(s.x < 5700, `gate must hold the player back, got ${s.x}`);
  assert.equal(world.exitAt(w), null);
  assert.equal(w.transitions, 0);
});

test("the exit refuses an unfinished encounter", () => {
  // Reaching this exit also lights the sanctuary, so the guard cannot be
  // observed through play. Assert it directly instead of faking a state the
  // game cannot produce.
  const exit = world.ROOMS.road.exits[0];
  const fresh = world.create();
  assert.equal(exit.open(world.active(fresh)), false);
  assert.ok(exit.x > 6020, "exit must sit beyond the sanctuary checkpoint");
  const done = world.create();
  world.active(done).complete = true;
  assert.equal(exit.open(world.active(done)), true);
});

test("a fresh interact crosses; a held interact cannot loop", () => {
  const w = atExit(true);
  tick(w, { interact: true }, 1);
  assert.equal(w.room, "cloister");
  assert.equal(w.transitions, 1);
  // Keeping the button down must not bounce back and forth.
  tick(w, { interact: true }, 240);
  assert.equal(w.transitions, 1);
  assert.equal(w.room, "cloister");
});

test("arrival is on safe floor with no pending attack or stale velocity", () => {
  const w = atExit(true);
  const from = world.active(w);
  from.attack = 0.4;
  from.vx = 235;
  from.vy = -400;
  tick(w, { interact: true }, 1);
  const s = world.active(w);
  assert.equal(s.attack, 0);
  assert.equal(s.vx, 0);
  assert.equal(s.crouching, false);
  assert.ok(s.invulnerable > 0, "brief grace on arrival");
  tick(w, {}, 30);
  assert.equal(s.grounded, true, "must settle on a floor, not fall");
  assert.ok(s.y <= 600 + BODY.standing);
});

test("health carries across the threshold", () => {
  const w = atExit(true);
  world.active(w).hp = 3;
  tick(w, { interact: true }, 1);
  assert.equal(w.hp, 3);
  assert.equal(world.active(w).hp, 3);
});

test("each room keeps its own progress across a round trip", () => {
  const w = atExit(true);
  const road = world.active(w);
  road.broken[0] = true;
  road.enemies[0].hp = 0;
  tick(w, { interact: true }, 1);
  assert.equal(w.room, "cloister");

  const cl = world.active(w);
  cl.leverOn = true;
  cl.vialTaken = true;
  cl.enemy.hp = 0;

  // Walk back to the return arch and cross.
  cl.x = world.ROOMS.cloister.exits[0].x;
  tick(w, {}, 2);
  tick(w, { interact: true }, 1);
  assert.equal(w.room, "road", "return path works");
  assert.equal(world.active(w).broken[0], true, "brazier stays broken");
  assert.equal(world.active(w).enemies[0].hp, 0, "guard stays defeated");

  // And forward again: the cloister remembers too.
  world.active(w).x = world.ROOMS.road.exits[0].x;
  tick(w, {}, 2);
  tick(w, { interact: true }, 1);
  assert.equal(w.room, "cloister");
  assert.equal(world.active(w).leverOn, true, "lever stays pulled");
  assert.equal(world.active(w).vialTaken, true, "vial stays taken");
  assert.equal(world.active(w).enemy.hp, 0, "enemy stays defeated");
});

test("a pickup cannot be collected twice by reloading a room", () => {
  const w = atExit(true);
  tick(w, { interact: true }, 1);
  const cl = world.active(w);
  cl.hp = 2;
  cl.x = 1900; // the vial
  tick(w, {}, 2);
  assert.equal(cl.vialTaken, true);
  assert.equal(cl.hp, 4);

  // Leave and come back; the vial must not pay out again.
  cl.x = world.ROOMS.cloister.exits[0].x;
  tick(w, {}, 2);
  tick(w, { interact: true }, 1);
  world.active(w).x = world.ROOMS.road.exits[0].x;
  tick(w, {}, 2);
  tick(w, { interact: true }, 1);
  const back = world.active(w);
  back.x = 1900;
  const before = back.hp;
  tick(w, {}, 4);
  assert.equal(back.hp, before, "no second heal");
});

test("dying stays in the room and does not cross a threshold", () => {
  const w = atExit(true);
  tick(w, { interact: true }, 1);
  const s = world.active(w);
  s.y = 3000; // below the kill plane
  s.grounded = false;
  tick(w, {}, 2);
  assert.equal(w.room, "cloister");
  assert.equal(s.deaths, 1);
  assert.equal(s.hp, 5);
});

test("restart clears both rooms", () => {
  const w = atExit(true);
  world.active(w).broken[0] = true;
  tick(w, { interact: true }, 1);
  world.active(w).leverOn = true;
  world.restart(w);
  assert.equal(w.room, "road");
  assert.equal(w.transitions, 0);
  assert.equal(w.rooms.road.broken[0], false);
  assert.equal(w.rooms.cloister.leverOn, false);
  assert.equal(w.hp, 5);
});

test("crossing into cistern lands on the entrance ledge with zero drownings", () => {
  const w = atExit(true);
  tick(w, { interact: true }, 1);
  assert.equal(w.room, "cloister");
  const cl = world.active(w);
  cl.complete = true;
  cl.x = world.ROOMS.cloister.exits[1].x;
  tick(w, {}, 2);
  tick(w, { interact: true }, 1);
  assert.equal(w.room, "cistern");
  const cis = world.active(w);
  assert.equal(cis.x, 150);
  assert.equal(cis.y, 420);
  tick(w, {}, 60);
  assert.equal(cis.grounded, true, "settles on entrance ledge");
  assert.equal(cis.y, 420, "does not plunge through the floor");
  assert.equal(cis.drownings, 0, "no drowning on arrival");
  assert.equal(cis.deaths, 0, "no death on arrival");
});

test("returning to cloister from cistern arrives at end spawn without gate snap", () => {
  const w = world.create("cistern");
  const cis = world.active(w);
  cis.x = world.ROOMS.cistern.exits[0].x;
  tick(w, {}, 2);
  tick(w, { interact: true }, 1);
  assert.equal(w.room, "cloister");
  const cl = world.active(w);
  assert.equal(cl.x, 3950);
  assert.equal(cl.y, 600);
  tick(w, {}, 30);
  assert.ok(cl.x > 3800, `player must not be snapped backwards to gate, stayed at ${cl.x}`);
  assert.equal(cl.grounded, true);
});


// Room graph: two connected rooms over one run.
//
// A room owns its geometry, props, enemies and mechanisms and keeps stepping
// itself. This module owns only what must survive crossing a threshold: which
// room is active, the player's health, and the fact that each room's own state
// object is kept rather than rebuilt, so broken braziers, defeated enemies,
// opened gates, pulled levers and taken pickups are all still true when you
// come back.
import * as road from "./encounter-sim.js";
import * as cloister from "./cloister-sim.js";
import * as cistern from "./cistern-sim.js";

export const ROOMS = {
  road: {
    sim: road,
    label: "The Pilgrim Road",
    page: "index.html",
    // The exit sits past the sanctuary, so reaching it lights the checkpoint
    // and completes the encounter on the way. The open() guard therefore
    // holds by geography here; it is kept because a later room may place an
    // exit somewhere a player can stand before earning it.
    spawns: { entrance: { x: 180, y: 600 }, sanctuary: { x: 6120, y: 600 } },
    exits: [
      {
        x: 6260,
        to: "cloister",
        spawn: "entrance",
        open: (s) => s.complete,
        label: "The cloister gate stands open. Press interact to cross.",
        locked: "The way on is sealed until the sanctuary is lit.",
      },
    ],
  },
  cloister: {
    sim: cloister,
    label: "The Ruined Cloister",
    page: "cloister.html",
    spawns: { entrance: { x: 200, y: 600 }, end: { x: 3950, y: 600 } },
    exits: [
      {
        x: 110,
        to: "road",
        spawn: "sanctuary",
        open: () => true,
        label: "The road back lies through the arch. Press interact to return.",
      },
      {
        x: 4140,
        to: "cistern",
        spawn: "entrance",
        open: (s) => s.complete,
        label: "Steps fall away toward water. Press interact to descend.",
        locked: "The cloister is not yet crossed.",
      },
    ],
  },
  cistern: {
    sim: cistern,
    label: "The Flooded Cistern",
    page: "cistern.html",
    spawns: { entrance: { x: 150, y: 600 }, end: { x: 4340, y: 600 } },
    exits: [
      {
        x: 90,
        to: "cloister",
        spawn: "end",
        open: () => true,
        label: "The stair back to the cloister. Press interact to climb.",
      },
    ],
  },
};

export const EXIT_RADIUS = 90;

export function create(start = "road") {
  const rooms = {};
  for (const [id, r] of Object.entries(ROOMS)) rooms[id] = r.sim.create();
  return {
    room: start,
    rooms,
    hp: 5,
    transitions: 0,
    interactHeld: false,
    notice: "",
    noticeTime: 0,
    events: [],
  };
}

export const active = (w) => w.rooms[w.room];

/** The exit the player is standing in, if any. */
export function exitAt(w) {
  const s = active(w);
  return (
    ROOMS[w.room].exits.find((e) => Math.abs(s.x - e.x) < EXIT_RADIUS) || null
  );
}

function place(state, spawn) {
  state.x = spawn.x;
  state.y = spawn.y;
  state.vx = 0;
  state.vy = 0;
  state.grounded = true;
  // A pending swing or a stale hitstop must not cross the threshold with you.
  state.attack = 0;
  state.attackCrouched = false;
  state.crouching = false;
  state.hitstop = 0;
  state.invulnerable = 1;
}

export function travel(w, exit) {
  const from = active(w);
  w.hp = from.hp;
  w.room = exit.to;
  const to = active(w);
  place(to, ROOMS[exit.to].spawns[exit.spawn]);
  to.hp = w.hp;
  w.transitions++;
  w.events.push("travel");
  w.notice = `Entered ${ROOMS[exit.to].label}.`;
  w.noticeTime = 4;
  return w;
}

export function restart(w) {
  const fresh = create("road");
  Object.assign(w, fresh);
  return w;
}

export function step(w, input = {}, dt = 1 / 60, options = {}) {
  w.events = [];
  w.noticeTime = Math.max(0, w.noticeTime - dt);
  const s = active(w);

  // A held interact opens the gate, pulls the lever and would otherwise
  // re-trigger travel every frame. Only a fresh press may move you.
  const pressed = !!input.interact && !w.interactHeld;
  w.interactHeld = !!input.interact;

  ROOMS[w.room].sim.step(s, input, dt, options);
  w.hp = s.hp;

  const exit = exitAt(w);
  if (exit) {
    if (!exit.open(s)) {
      if (pressed && exit.locked) {
        w.notice = exit.locked;
        w.noticeTime = 3;
      }
    } else if (pressed) {
      travel(w, exit);
    } else if (w.noticeTime <= 0) {
      w.notice = exit.label;
      w.noticeTime = 1.5;
    }
  }
  return w;
}

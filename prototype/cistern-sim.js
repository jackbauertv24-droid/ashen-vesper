// Stage 03 — Flooded Cistern.
//
// Level data, the water hazard, the Lurker and the camera. All player
// movement, collision and combat geometry come from the shared runtime
// contract in physics.js; nothing here re-implements a step().
//
// This is a horizontal integration route, not the six-room baseline in
// docs/world/examples. That baseline spans 2000 vertical units across five
// stacked rooms and needs the vertical camera (M4.1), and its spawn and
// checkpoint lists are empty. Adapting it stays M3.1.
import {
  MOVE,
  beginFrame,
  bodyBox,
  groundAt,
  hitbox,
  overlaps,
  stepHorizontal,
  stepVertical,
} from "./physics.js";
import { DEATH_TIME, HURT_TIME } from "./hero-render.js";

export const VIEW = { width: 1280, height: 720 };
export const LEVEL = {
  width: 4400,
  height: 720,
  lever: 2400,
  gate: 2900,
  finish: 4300,
};

/** Dry ledges. The gaps between them are open water. */
export const platforms = [
  { x: 0, y: 600, w: 820 },
  { x: 940, y: 600, w: 1060 },
  { x: 2120, y: 600, w: 940 },
  { x: 3180, y: 600, w: 1220 },
  { x: 1550, y: 505, w: 240, h: 95 },
  { x: 3600, y: 505, w: 250, h: 95 },
];

/** Falling below this drowns you. There is no swimming in this stage. */
export const WATER = { surface: 626, drown: 700 };
export const VIAL = { x: 1500, y: 600 };

export { bodyBox, hitbox, overlaps };

export function create() {
  return {
    x: 150,
    y: 600,
    vx: 0,
    vy: 0,
    grounded: true,
    facing: 1,
    crouching: false,
    attackCrouched: false,
    attack: 0,
    attackId: 0,
    walk: 0,
    hp: 5,
    invulnerable: 0,
    hitstop: 0,
    dying: 0,
    hurtFor: 0,
    camera: 0,
    time: 0,
    leverOn: false,
    vialTaken: false,
    complete: false,
    deaths: 0,
    drownings: 0,
    enemy: {
      x: 1300,
      y: 600,
      home: 1300,
      hp: 3,
      facing: -1,
      lastHit: -1,
      mode: "rest",
      timer: 0,
      walk: 0,
      moving: false,
      deadFor: 0,
    },
    notice: "Cross the cistern. The water is not shallow.",
    noticeTime: 6,
    events: [],
  };
}

export function message(s, text) {
  s.notice = text;
  s.noticeTime = 4;
}

export function respawn(s, reason) {
  s.x = 150;
  s.y = 600;
  s.vx = s.vy = 0;
  s.grounded = true;
  s.hp = 5;
  s.attack = 0;
  s.crouching = false;
  s.attackCrouched = false;
  s.invulnerable = 1;
  s.dying = 0;
  s.hurtFor = 0;
  s.deaths++;
  s.events.push("death");
  message(s, reason ?? "Returned to the cistern entrance. Your progress is kept.");
}

function damage(s) {
  if (s.invulnerable > 0 || s.complete) return;
  s.hp--;
  s.invulnerable = 1.1;
  s.events.push("hurt");
  s.hurtFor = HURT_TIME;
  message(s, "The Lurker struck from the water. Watch it rise.");
  if (s.hp <= 0) s.dying = DEATH_TIME;
}

/**
 * The Lurker waits submerged, rises when you come near, crawls in, then
 * lunges. The rise is the telegraph, so the player is never hit without
 * warning.
 */
function stepEnemy(s, dt, options) {
  const e = s.enemy;
  if (e.hp <= 0) {
    e.deadFor += dt;
    return;
  }
  const wasAt = e.x;
  const previous = e.timer;
  e.timer = Math.max(0, e.timer - dt);

  const box = hitbox(s);
  if (
    box &&
    e.lastHit !== s.attackId &&
    e.mode !== "rest" &&
    overlaps(box, { x: e.x - 30, y: e.y - 70, w: 60, h: 70 })
  ) {
    e.lastHit = s.attackId;
    e.hp--;
    e.mode = e.hp ? "hurt" : "dead";
    e.timer = 0.35;
    s.events.push("hit");
    if (options.hitstop !== false) s.hitstop = MOVE.hitstop;
    return;
  }

  const distance = s.x - e.x;
  if (e.mode === "hurt") {
    if (!e.timer) e.mode = "crawl";
  } else if (e.mode === "rest") {
    // Submerged and harmless until the player is close enough to wake it.
    if (Math.abs(distance) < 320 && Math.abs(s.y - e.y) < 120) {
      e.mode = "emerge";
      e.timer = 0.7;
      s.events.push("emerge");
      message(s, "Something rises from the water ahead.");
    }
  } else if (e.mode === "emerge") {
    if (!e.timer) e.mode = "crawl";
  } else if (e.mode === "lunge") {
    if (
      previous > 0.12 &&
      e.timer <= 0.12 &&
      Math.abs(s.x - e.x) < 96 &&
      Math.abs(s.y - e.y) < 90
    )
      damage(s);
    if (!e.timer) {
      e.mode = "recover";
      e.timer = 0.9;
    }
  } else if (e.mode === "recover") {
    if (!e.timer) e.mode = "crawl";
  } else {
    e.facing = distance > 0 ? 1 : -1;
    if (Math.abs(distance) < 86 && Math.abs(s.y - e.y) < 90) {
      e.mode = "lunge";
      e.timer = 0.25;
    } else {
      const next = Math.max(
        e.home - 420,
        Math.min(e.home + 420, e.x + e.facing * 92 * dt),
      );
      // It crawls the ledge; it does not cross open water.
      if (groundAt(next, e.y, platforms)) e.x = next;
    }
  }
  const moved = Math.abs(e.x - wasAt);
  e.moving = moved > 0.01;
  e.walk += moved;
}

export function step(s, input = {}, dt = 1 / 60, options = {}) {
  const frame = beginFrame(s, dt);
  if (frame.frozen) return;
  dt = frame.dt;
  s.hurtFor = Math.max(0, s.hurtFor - dt);
  if (s.dying > 0) {
    // The player is down; the stage waits rather than teleporting them back.
    s.dying = Math.max(0, s.dying - dt);
    if (s.dying === 0) respawn(s);
    return;
  }

  const ctx = stepHorizontal(s, input, dt, platforms, {
    ...options,
    levelWidth: LEVEL.width,
  });
  if (!s.leverOn) s.x = Math.min(s.x, LEVEL.gate - 36);
  stepVertical(s, ctx, dt, platforms);

  // Explicit hazard bounds: fall between the ledges and you drown.
  if (s.y > WATER.drown) {
    s.drownings++;
    respawn(s, "The cistern water took you. Jump the channels.");
  } else if (s.y > MOVE.killPlane) {
    respawn(s);
  }

  if (s.grounded && Math.abs(s.vx) > 1) s.walk += dt;
  else s.walk = 0;

  if (input.interact && Math.abs(s.x - LEVEL.lever) < 90 && !s.leverOn) {
    s.leverOn = true;
    s.events.push("gate");
    message(s, "The sluice valve turns. The grate beyond lifts.");
  }
  if (
    !s.vialTaken &&
    Math.abs(s.x - VIAL.x) < 38 &&
    Math.abs(s.y - VIAL.y) < 130
  ) {
    s.vialTaken = true;
    s.hp = Math.min(5, s.hp + 2);
    s.events.push("pickup");
    message(s, "Healing vial collected.");
  }

  stepEnemy(s, dt, options);

  if (s.x > LEVEL.finish && !s.complete) {
    s.complete = true;
    message(s, "Cistern route complete — the Ossuary lies beyond.");
    s.noticeTime = 999;
  }

  const focus = s.x + s.facing * 80;
  const screen = focus - s.camera;
  let target = s.camera;
  if (screen > 760) target = focus - 760;
  if (screen < 420) target = focus - 420;
  target = Math.max(0, Math.min(LEVEL.width - VIEW.width, target));
  s.camera +=
    (target - s.camera) *
    Math.min(1, dt * (options.camera === "tight" ? 12 : 5));
}

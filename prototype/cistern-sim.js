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
import { trackCamera } from "./camera.js";
import { DEATH_TIME, HURT_TIME } from "./hero-render.js";

export const VIEW = { width: 1280, height: 720 };
export const LEVEL = {
  width: 4600,
  // Taller than a screen, so the camera tracks vertically. This is the first
  // stage that is not a single floor line.
  height: 1700,
  // The stage is 1700 deep, so the shared 900-unit kill plane — written when
  // every stage fitted one screen — would fire in mid-air.
  killPlane: 1620,
  lever: 3700,
  gate: 4050,
  finish: 4480,
};

// A descent, a fork, and a climb back out, over a basin that catches you.
//
// The first version had ten lethal edges, including the very first one: walk
// right off the entry ledge and you drowned. A vertical stage invites the
// player to drop, so a fall has to cost progress rather than a life. The
// flooded basin now runs under almost the whole stage — fall anywhere on the
// route and you land in it, with the Lurker, and have to climb back out.
// Only the two ends of the basin itself are open water.
//
// Jump envelope: 114 units of rise and 165 of reach, so every climb here is
// 90-95 and every gap 120 or less.
export const platforms = [
  // Descent from the sluice, top left. One continuous entry ledge: the old
  // gap here was a death pit dressed as a descent.
  { x: 0, y: 420, w: 1280 },
  { x: 1180, y: 640, w: 520 },
  { x: 1520, y: 880, w: 520 },

  // The fork. Up and right is the gallery: longer, safer, and it passes the
  // vial. Down and left is the flooded basin: shorter, and occupied.
  { x: 2000, y: 790, w: 160 },
  { x: 2220, y: 700, w: 160 },
  { x: 2440, y: 610, w: 160 },
  { x: 2660, y: 610, w: 740 },

  // The low way. Held high enough over the basin that a standing body can
  // walk underneath it: a platform 95 above the floor with a 150-deep body
  // leaves no headroom and jams the player against it.
  { x: 1960, y: 1080, w: 540 },

  // The basin. Wide on purpose: it is the floor of the stage, not a trap.
  // The basin is the floor of the chamber. A player who drops lands on it
  // rather than falling through an unmarked hole into water that is not
  // drawn. The drown check below stays as a floor of last resort; the
  // hazard returns when there is a water surface to show it.
  { x: 0, y: 1360, w: 3000, h: 340 },

  // The way out is a solid stair cut into the far end of the basin, not
  // ledges floating above it. Floating ledges 95 units up left no headroom
  // to walk under and sealed a pocket of basin behind them that nothing
  // could climb out of.
  { x: 3000, y: 1265, w: 180, h: 435 },
  { x: 3180, y: 1170, w: 180, h: 530 },
  { x: 3360, y: 1075, w: 180, h: 625 },

  // The valve chamber, where both ways meet, and the way out.
  { x: 3540, y: 980, w: 1060, h: 720 },
];

/** Falling below this drowns you. There is no swimming in this stage. */
export const WATER = { surface: 1430, drown: 1500 };
/** On the high gallery, so the safe route is the one that pays. */
export const VIAL = { x: 3000, y: 610 };

export { bodyBox, hitbox, overlaps };

export function create() {
  return {
    x: 150,
    y: 420,
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
    cameraY: 0,
    look: 85,
    time: 0,
    leverOn: false,
    vialTaken: false,
    complete: false,
    deaths: 0,
    drownings: 0,
    enemy: {
      x: 2700,
      y: 1360,
      home: 2700,
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
  s.y = 420;
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
    // Narrower than the flooded floor is wide, so there is a stretch of
    // ground where it is still hidden and you can choose to keep your distance.
    if (Math.abs(distance) < 200 && Math.abs(s.y - e.y) < 120) {
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
    respawn(s, "The cistern water took you. Mind the flooded floor.");
  } else if (s.y > (LEVEL.killPlane ?? MOVE.killPlane)) {
    respawn(s);
  }

  if (s.grounded && Math.abs(s.vx) > 1) s.walk += dt;
  else s.walk = 0;

  const inValveChamber = s.y < 1050;
  if (
    input.interact &&
    inValveChamber &&
    Math.abs(s.x - LEVEL.lever) < 90 &&
    !s.leverOn
  ) {
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

  if (s.x > LEVEL.finish && inValveChamber && !s.complete) {
    s.complete = true;
    message(s, "Cistern route complete — the Ossuary lies beyond.");
    s.noticeTime = 999;
  }

  trackCamera(s, LEVEL, dt, options);
}

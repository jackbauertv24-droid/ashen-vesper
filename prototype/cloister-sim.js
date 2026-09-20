// Stage 02 — Ruined Cloister.
// Level data, mechanisms, enemy and camera only. All player movement,
// collision and combat geometry come from the shared runtime contract.
import {
  MOVE,
  beginFrame,
  bodyBox,
  hitbox,
  overlaps,
  stepHorizontal,
  stepVertical,
  groundAt,
} from "./physics.js";
import { trackCamera } from "./camera.js";
import { DEATH_TIME, HURT_TIME } from "./hero-render.js";

export const VIEW = { width: 1280, height: 720 };
export const LEVEL = { width: 4200, height: 720, gate: 2740, lever: 2300 };
export const platforms = [
  { x: 0, y: 600, w: 900 },
  { x: 1010, y: 600, w: 1050 },
  { x: 2170, y: 600, w: 900 },
  { x: 3190, y: 600, w: 1010 },
  { x: 1270, y: 505, w: 260, h: 95 },
  { x: 1530, y: 430, w: 300, h: 170 },
  { x: 3340, y: 505, w: 250, h: 95 },
];
export const VIAL = { x: 1900, y: 600 };
export { bodyBox, hitbox, overlaps };

export function create() {
  return {
    x: 160,
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
    dodging: 0,
    dodgeDir: 0,
    dodgeCooldown: 0,
    camera: 0,
    cameraY: 0,
    look: 85,
    time: 0,
    leverOn: false,
    vialTaken: false,
    complete: false,
    deaths: 0,
    enemy: {
      deadFor: 0,
      walk: 0,
      moving: false,
      x: 760,
      y: 600,
      hp: 3,
      home: 760,
      facing: -1,
      lastHit: -1,
      mode: "patrol",
      timer: 0,
    },
    notice: "Cross the cloister and inspect its mechanisms.",
    noticeTime: 6,
    events: [],
  };
}

export function message(s, text) {
  s.notice = text;
  s.noticeTime = 4;
}

export function respawn(s) {
  s.x = 160;
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
  s.dodging = 0;
  s.dodgeDir = 0;
  s.dodgeCooldown = 0;
  s.deaths++;
  s.events.push("death");
  message(
    s,
    "Returned to the Cloister entrance. The lever and vial state are preserved.",
  );
}

function damage(s) {
  if (s.invulnerable > 0 || s.complete) return;
  s.hp--;
  s.invulnerable = 1.1;
  s.events.push("hurt");
  s.hurtFor = HURT_TIME;
  message(s, "The Sexton struck. Watch its windup and step away.");
  if (s.hp <= 0) s.dying = DEATH_TIME;
}

function stepEnemy(s, dt, options) {
  const e = s.enemy;
  if (e.hp <= 0) {
    // Keep counting after death so the renderer can play it out.
    e.deadFor += dt;
    return;
  }
  const previous = e.timer;
  const wasAt = e.x;
  e.timer = Math.max(0, e.timer - dt);
  const box = hitbox(s);
  if (
    box &&
    e.lastHit !== s.attackId &&
    overlaps(box, { x: e.x - 24, y: e.y - 130, w: 48, h: 130 })
  ) {
    e.lastHit = s.attackId;
    e.hp--;
    e.mode = e.hp ? "hurt" : "dead";
    e.timer = 0.35;
    s.events.push("hit");
    if (options.hitstop !== false) s.hitstop = MOVE.hitstop;
    const pushDir = e.x >= s.x ? 1 : -1;
    const pushedX = e.x + pushDir * 12;
    if (groundAt(pushedX, e.y, platforms)) e.x = pushedX;
    return;
  }
  if (e.mode === "hurt") {
    if (!e.timer) e.mode = "patrol";
  } else if (e.mode === "windup") {
    if (!e.timer) {
      e.mode = "strike";
      e.timer = 0.28;
    }
  } else if (e.mode === "strike") {
    if (
      previous > 0.16 &&
      e.timer <= 0.16 &&
      Math.abs(s.x - e.x) < 105 &&
      Math.abs(s.y - e.y) < 100
    )
      damage(s);
    if (!e.timer) {
      e.mode = "recover";
      e.timer = 0.9;
    }
  } else if (e.mode === "recover") {
    if (!e.timer) e.mode = "patrol";
  } else {
    const distance = s.x - e.x;
    e.facing = distance > 0 ? 1 : -1;
    if (Math.abs(distance) < 90 && Math.abs(s.y - e.y) < 90) {
      e.mode = "windup";
      e.timer = 0.8;
    } else if (Math.abs(distance) < 430) {
      e.mode = "approach";
      const next = Math.max(
        e.home - 250,
        Math.min(e.home + 250, e.x + e.facing * 78 * dt),
      );
      // Do not stride out over a hole; stop at the ledge.
      if (groundAt(next, e.y, platforms)) e.x = next;
    } else {
      e.mode = "patrol";
      const drift = e.home + Math.sin(s.time * 0.5) * 45;
      const diff = drift - e.x;
      const stepDist = Math.min(Math.abs(diff), 78 * dt);
      const next = e.x + stepDist * Math.sign(diff);
      if (groundAt(next, e.y, platforms)) {
        // On patrol it watches its route, not the player, so it does not
        // stride backwards. It turns to face the player once it engages.
        if (Math.abs(next - e.x) > 0.01) e.facing = next > e.x ? 1 : -1;
        e.x = next;
      }
    }
  }
  // Drive the walk cycle from distance actually covered, not from the mode.
  // Patrol drifts as well as approach, so keying poses to the mode left the
  // Sexton sliding back and forth in a standing pose.
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
  if (!s.leverOn) {
    if (ctx.oldX <= LEVEL.gate && s.x > LEVEL.gate - 36) {
      s.x = LEVEL.gate - 36;
      if (s.grounded) s.vx = 0;
    } else if (ctx.oldX > LEVEL.gate && s.x < LEVEL.gate + 36) {
      s.x = LEVEL.gate + 36;
      if (s.grounded) s.vx = 0;
    }
  }
  stepVertical(s, ctx, dt, platforms);

  if (s.y > MOVE.killPlane) respawn(s);
  if (s.grounded && Math.abs(s.vx) > 1) s.walk += dt;
  else s.walk = 0;

  if (input.interact && Math.abs(s.x - LEVEL.lever) < 90 && !s.leverOn) {
    s.leverOn = true;
    s.events.push("gate");
    message(s, "The lever raises the cloister grate.");
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

  if (s.x > 4050 && !s.complete) {
    s.complete = true;
    message(s, "Cloister blockout complete — the Cistern route is next.");
    s.noticeTime = 999;
  }

  trackCamera(s, LEVEL, dt, options);
}

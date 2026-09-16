export const WORLD = { width: 1440, height: 810 };
export const MOTION = { speed: 180, gravity: 1800, jump: 600, attackDuration: 25 / 60, walkFrame: 7 / 60 };
export const PLATFORMS = [
  { x: 32, y: 610, width: 480, height: 116 },
  { x: 592, y: 610, width: 816, height: 116 },
  { x: 790, y: 520, width: 240, height: 58 },
];
export const TARGET = { x: 1170, y: 555, width: 32, height: 55 };
export function createState() {
  return { x: 240, y: 610, vx: 0, vy: 0, facing: 1, grounded: true, mode: 'idle', time: 0,
    walkTime: 0, attackTime: 0, attacking: false, attackHit: false, hits: 0, targetFlash: 0, falls: 0 };
}
export function attackBox(s) {
  if (!s.attacking || s.attackTime + 1e-9 < 13 / 60 || s.attackTime + 1e-9 >= 23 / 60) return null;
  return { x: s.facing === 1 ? s.x + 12 : s.x - 100, y: s.y - 95, width: 88, height: 45 };
}
const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
export function advance(s, input, dt) {
  dt = Math.min(Math.max(dt, 0), 1 / 30);
  s.time += dt;
  s.targetFlash = Math.max(0, s.targetFlash - dt);
  const dir = Number(Boolean(input.right)) - Number(Boolean(input.left));
  if (input.attack && s.grounded && !s.attacking) {
    s.attacking = true; s.attackTime = 0; s.attackHit = false;
  }
  if (s.attacking) {
    s.vx = 0;
    s.attackTime += dt;
    const box = attackBox(s);
    if (box && !s.attackHit && overlaps(box, TARGET)) {
      s.hits++; s.attackHit = true; s.targetFlash = 0.28;
    }
    if (s.attackTime + 1e-9 >= MOTION.attackDuration) s.attacking = false;
  } else if (s.grounded) {
    s.vx = dir * MOTION.speed;
    if (dir) s.facing = dir;
    if (input.jump) { s.vy = -MOTION.jump; s.grounded = false; }
  }
  const oldY = s.y;
  s.x = Math.max(18, Math.min(WORLD.width - 18, s.x + s.vx * dt));
  s.vy += MOTION.gravity * dt;
  s.y += s.vy * dt;
  s.grounded = false;
  if (s.vy >= 0) {
    for (const p of PLATFORMS) {
      if (s.x + 13 > p.x && s.x - 13 < p.x + p.width && oldY <= p.y + 0.01 && s.y >= p.y) {
        s.y = p.y; s.vy = 0; s.grounded = true; break;
      }
    }
  }
  if (s.y > WORLD.height + 160) {
    const hits = s.hits, falls = s.falls + 1, time = s.time;
    Object.assign(s, createState(), { hits, falls, time });
  }
  s.mode = s.attacking ? 'attack' : !s.grounded ? 'airborne' : Math.abs(s.vx) > 0 ? 'walk' : 'idle';
  if (s.mode === 'walk') s.walkTime += dt; else s.walkTime = 0;
  return s;
}
export function poseIndex(s) {
  if (s.attacking) return s.attackTime + 1e-9 < 13 / 60 ? 5 : s.attackTime + 1e-9 < 23 / 60 ? 6 : 7;
  if (!s.grounded) return 2; // Deliberate temporary pose until dedicated jump art exists.
  if (s.mode === 'walk') return [1, 2, 3, 4][Math.floor(s.walkTime / MOTION.walkFrame) % 4];
  return 0;
}

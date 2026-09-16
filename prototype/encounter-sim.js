export const VIEW = { width: 1280, height: 720 };
export const LEVEL = { width: 6400, height: 720, gate: 5700, checkpoint: 6020 };
export const platforms = [
  { x: 0, y: 600, w: 820 },
  { x: 910, y: 600, w: 1420 },
  { x: 2420, y: 600, w: 1580 },
  { x: 4090, y: 600, w: 2310 },
  { x: 1240, y: 520, w: 180 },
  { x: 1420, y: 450, w: 200 },
  { x: 1620, y: 390, w: 260 },
  { x: 4400, y: 530, w: 180 },
  { x: 4580, y: 460, w: 180 },
  { x: 4760, y: 390, w: 280 },
];
export const braziers = [
  { x: 420, y: 515 },
  { x: 1550, y: 370 },
  { x: 3200, y: 515 },
  { x: 4880, y: 310 },
];
export const overlaps = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
export function create() {
  return {
    x: 180,
    y: 600,
    vx: 0,
    vy: 0,
    facing: 1,
    grounded: true,
    hp: 5,
    invulnerable: 0,
    attack: 0,
    attackId: 0,
    time: 0,
    embers: 0,
    collected: 0,
    broken: braziers.map(() => false),
    drops: [],
    enemies: [
      {
        x: 2050,
        home: 2050,
        y: 600,
        hp: 3,
        mode: "patrol",
        timer: 0,
        facing: -1,
        lastHit: -1,
      },
      {
        x: 3560,
        home: 3560,
        y: 600,
        hp: 3,
        mode: "patrol",
        timer: 0,
        facing: -1,
      },
      {
        x: 5300,
        home: 5300,
        y: 600,
        hp: 3,
        mode: "patrol",
        timer: 0,
        facing: -1,
      },
    ],
    gateOpen: false,
    checkpoint: false,
    complete: false,
    deaths: 0,
    camera: 0,
    look: 70,
    notice: "Break a hanging brazier with J. Collect its ember.",
    noticeTime: 7,
    events: [],
    hitstop: 0,
    walk: 0,
  };
}
export function message(s, text) {
  s.notice = text;
  s.noticeTime = 4;
}
export function hitbox(s) {
  return s.attack > 0.12 && s.attack < 0.28
    ? { x: s.facing > 0 ? s.x + 8 : s.x - 115, y: s.y - 110, w: 107, h: 82 }
    : null;
}
export function respawn(s) {
  s.x = s.checkpoint ? 6020 : 180;
  s.y = 600;
  s.vx = s.vy = 0;
  s.hp = 5;
  s.attack = 0;
  s.invulnerable = 1;
  s.grounded = true;
  s.camera = Math.max(0, Math.min(5120, s.x - 500));
  s.deaths++;
  s.events.push("death");
  message(
    s,
    s.checkpoint
      ? "Returned to the sanctuary."
      : "Returned to the entrance. Collected embers and opened paths are kept.",
  );
  for (const e of s.enemies) {
    if (e.hp > 0) {
      e.x = e.home;
      e.mode = "patrol";
      e.timer = 0;
    }
  }
}
function damage(s) {
  if (s.invulnerable > 0 || s.complete) return;
  s.hp--;
  s.invulnerable = 1.1;
  s.events.push("hurt");
  message(s, "Hit! Step out of the staff’s reach during its windup.");
  if (s.hp <= 0) respawn(s);
}
export function step(s, input, dt, options = {}) {
  dt = Math.min(Math.max(dt, 0), 1 / 30);
  s.events = [];
  s.time += dt;
  s.noticeTime = Math.max(0, s.noticeTime - dt);
  s.invulnerable = Math.max(0, s.invulnerable - dt);
  if (s.hitstop > 0) {
    s.hitstop -= dt;
    return;
  }
  const dir = Number(!!input.right) - Number(!!input.left);
  if (input.attack && s.attack <= 0 && s.grounded) {
    s.attack = 0.42;
    s.attackId++;
    s.events.push("swing");
  }
  if (s.attack > 0) {
    s.attack = Math.max(0, s.attack - dt);
    s.vx = 0;
  } else if (s.grounded) {
    s.vx = dir * 235;
    if (dir) s.facing = dir;
    if (input.jump) {
      s.vy = -650;
      s.grounded = false;
      s.events.push("jump");
    }
  } else if (options.airControl) {
    s.vx += (dir * 235 - s.vx) * Math.min(1, dt * 5);
  }
  const old = s.y;
  s.x = Math.max(20, Math.min(6380, s.x + s.vx * dt));
  if (!s.gateOpen) s.x = Math.min(s.x, LEVEL.gate - 36);
  s.vy += 1850 * dt;
  s.y += s.vy * dt;
  s.grounded = false;
  for (const p of platforms)
    if (
      s.vy >= 0 &&
      old <= p.y + 0.01 &&
      s.y >= p.y &&
      s.x + 12 > p.x &&
      s.x - 12 < p.x + p.w
    ) {
      s.y = p.y;
      s.vy = 0;
      s.grounded = true;
      break;
    }
  if (s.y > 900) respawn(s);
  if (s.grounded && Math.abs(s.vx) > 1) s.walk += dt;
  else s.walk = 0;
  const box = hitbox(s);
  braziers.forEach((b, i) => {
    if (
      !s.broken[i] &&
      box &&
      overlaps(box, { x: b.x - 24, y: b.y - 48, w: 48, h: 62 })
    ) {
      s.broken[i] = true;
      s.drops.push({ x: b.x, y: b.y, vy: -110 });
      s.events.push("break");
      message(s, "An ember falls. Walk into it to collect.");
    }
  });
  for (const d of s.drops) {
    const old = d.y;
    d.vy += 1100 * dt;
    d.y += d.vy * dt;
    for (const p of platforms)
      if (
        d.vy >= 0 &&
        old <= p.y - 12 &&
        d.y >= p.y - 12 &&
        d.x >= p.x &&
        d.x <= p.x + p.w
      ) {
        d.y = p.y - 12;
        d.vy = 0;
      }
    if (Math.abs(d.x - s.x) < 36 && d.y > s.y - 145 && d.y < s.y + 20) {
      d.taken = true;
      s.embers++;
      s.collected++;
      s.events.push("pickup");
      message(s, "Ember collected. One ember opens the final gate.");
    }
  }
  s.drops = s.drops.filter((d) => !d.taken);
  for (const e of s.enemies) {
    if (e.hp <= 0) continue;
    e.timer = Math.max(0, e.timer - dt);
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
      if (options.hitstop !== false) s.hitstop = 0.045;
      if (!e.hp) {
        s.events.push("defeat");
        message(s, "The pilgrim falls. The path is clear.");
      }
      continue;
    }
    if (e.mode === "hurt") {
      if (!e.timer) e.mode = "patrol";
      continue;
    }
    if (e.mode === "windup") {
      if (!e.timer) {
        e.mode = "strike";
        e.timer = 0.18;
        s.events.push("staff");
      }
    } else if (e.mode === "strike") {
      const area = {
        x: e.facing > 0 ? e.x : e.x - 145,
        y: e.y - 100,
        w: 145,
        h: 100,
      };
      if (overlaps(area, { x: s.x - 13, y: s.y - 120, w: 26, h: 120 }))
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
      if (Math.abs(distance) < 125 && Math.abs(s.y - e.y) < 80) {
        e.mode = "windup";
        e.timer = 0.8;
      } else if (Math.abs(distance) < 430) {
        e.mode = "approach";
        e.x = Math.max(
          e.home - 300,
          Math.min(e.home + 260, e.x + e.facing * 78 * dt),
        );
      } else {
        e.mode = "patrol";
        e.x = e.home + Math.sin(s.time * 0.5 + e.home) * 45;
      }
    }
  }
  if (Math.abs(s.x - LEVEL.gate) < 150 && !s.gateOpen) {
    if (input.interact) {
      if (!s.embers)
        message(s, "The gate needs one ember. Braziers mark the way back.");
      else if (
        s.enemies.some((e) => e.hp > 0 && Math.abs(e.x - LEVEL.gate) < 550)
      )
        message(s, "Defeat the gate’s guardian first.");
      else {
        s.embers--;
        s.gateOpen = true;
        s.events.push("gate");
        message(s, "The gate opens. Reach the sanctuary beyond.");
      }
    } else if (s.noticeTime === 0)
      message(s, "Press E to offer one ember at the gate.");
  }
  if (s.x > LEVEL.checkpoint && !s.checkpoint) {
    s.checkpoint = true;
    s.complete = true;
    s.hp = 5;
    s.events.push("checkpoint");
    message(s, "Sanctuary reached. Checkpoint lit — encounter complete!");
    s.noticeTime = 999;
  }
  const lookTarget = s.facing * 85;
  s.look += (lookTarget - s.look) * Math.min(1, dt * 3);
  const focus = s.x + s.look,
    screen = focus - s.camera;
  let target = s.camera;
  if (screen > 740) target = focus - 740;
  if (screen < 430) target = focus - 430;
  target = Math.max(0, Math.min(LEVEL.width - VIEW.width, target));
  s.camera +=
    (target - s.camera) *
    Math.min(1, dt * (options.camera === "tight" ? 12 : 5));
}

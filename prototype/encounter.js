import {
  VIEW,
  LEVEL,
  platforms,
  braziers,
  create,
  step,
  hitbox,
  bodyBox,
  staffPose,
  solidHeight,
} from "./encounter-sim.js";
const canvas = document.querySelector("#game"),
  ctx = canvas.getContext("2d");
let s = create(),
  running = false,
  art,
  atlas,
  acc = 0,
  last = 0,
  guide = false,
  audioContext;
const input = {
    crouch: false,
    left: false,
    right: false,
    jump: false,
    attack: false,
    interact: false,
  },
  held = new Set(),
  touch = new Map();
let padPrevious = {};
const options = {
  camera: "smooth",
  airControl: false,
  hitstop: !matchMedia("(prefers-reduced-motion: reduce)").matches,
};
const $ = (q) => document.querySelector(q);
const keys = {
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  Space: "jump",
  KeyW: "jump",
  ArrowUp: "jump",
  KeyJ: "attack",
  KeyX: "attack",
  KeyE: "interact",
  KeyS: "crouch",
  ArrowDown: "crouch",
};
const load = (path) =>
  new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(Error("Artwork unavailable: " + path));
    im.src = path;
  });
function keyed(im, magenta = false) {
  const c = document.createElement("canvas");
  c.width = im.width;
  c.height = im.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(im, 0, 0);
  const pixels = g.getImageData(0, 0, c.width, c.height),
    a = pixels.data;
  if (magenta) {
    for (let i = 0; i < a.length; i += 4) {
      const excess = Math.min(a[i], a[i + 2]) - a[i + 1];
      if (excess > 80) a[i + 3] = 0;
      else if (excess > 20) {
        a[i + 3] = (255 * (80 - excess)) / 60;
        a[i] = Math.max(a[i + 1], a[i] - excess);
        a[i + 2] = Math.max(a[i + 1], a[i + 2] - excess);
      }
    }
  } else {
    // Border-connected background only; never globally erase all dark costume pixels.
    const base = [a[0], a[1], a[2]];
    const seen = new Uint8Array(c.width * c.height),
      queue = new Int32Array(seen.length);
    let head = 0,
      tail = 0;
    const add = (n) => {
      if (n < 0 || n >= seen.length || seen[n]) return;
      seen[n] = 1;
      const i = n * 4;
      const distance =
        (a[i] - base[0]) ** 2 +
        (a[i + 1] - base[1]) ** 2 +
        (a[i + 2] - base[2]) ** 2;
      if (distance <= 64) queue[tail++] = n;
    };
    for (let x = 0; x < c.width; x++) {
      add(x);
      add((c.height - 1) * c.width + x);
    }
    for (let y = 0; y < c.height; y++) {
      add(y * c.width);
      add(y * c.width + c.width - 1);
    }
    while (head < tail) {
      const n = queue[head++];
      a[n * 4 + 3] = 0;
      if (n % c.width) add(n - 1);
      if (n % c.width < c.width - 1) add(n + 1);
      add(n - c.width);
      add(n + c.width);
    }
  }
  g.putImageData(pixels, 0, 0);
  return c;
}
function clear() {
  held.clear();
  touch.clear();
  padPrevious = {};
  for (const k in input) input[k] = false;
}
function start() {
  if (!art) return;
  running = true;
  $("#start-overlay").classList.add("hidden");
  canvas.focus({ preventScroll: true });
}
function reset() {
  s = create();
  clear();
  start();
}
$("#enter").onclick = start;
$("#reset").onclick = reset;
$("#inspect").onclick = () => {
  guide = !guide;
  $("#inspect").setAttribute("aria-pressed", String(guide));
  canvas.focus();
};
$("#camera").onchange = (e) => {
  options.camera = e.target.value;
  canvas.focus();
};
$("#air").onchange = (e) => {
  options.airControl = e.target.checked;
  canvas.focus();
};
$("#hitstop").checked = options.hitstop;
$("#hitstop").onchange = (e) => (options.hitstop = e.target.checked);
$("#sound").onclick = () => {
  const on = $("#sound").getAttribute("aria-pressed") !== "true";
  $("#sound").setAttribute("aria-pressed", String(on));
  $("#sound").textContent = on ? "Sound on" : "Sound off";
  if (on) {
    audioContext ??= new AudioContext();
    audioContext.resume();
  }
  canvas.focus();
};
window.addEventListener("keydown", (e) => {
  if (!running || document.activeElement !== canvas) return;
  const action = keys[e.code];
  if (action) {
    e.preventDefault();
    held.add(e.code);
    if (!e.repeat && !["left", "right", "crouch"].includes(action))
      input[action] = true;
  }
  if (e.code === "KeyR") reset();
});
window.addEventListener("keyup", (e) => held.delete(e.code));
window.addEventListener("blur", clear);
document.addEventListener("visibilitychange", () => {
  clear();
  acc = 0;
});
for (const b of document.querySelectorAll("[data-control]")) {
  b.onpointerdown = (e) => {
    e.preventDefault();
    start();
    b.setPointerCapture(e.pointerId);
    touch.set(e.pointerId, b.dataset.control);
    if (!["left", "right", "crouch"].includes(b.dataset.control))
      input[b.dataset.control] = true;
  };
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    b.addEventListener(event, (e) => touch.delete(e.pointerId));
}
function controls() {
  input.crouch =
    [...held].some((k) => keys[k] === "crouch") ||
    [...touch.values()].includes("crouch");
  input.left =
    [...held].some((k) => keys[k] === "left") ||
    [...touch.values()].includes("left");
  input.right =
    [...held].some((k) => keys[k] === "right") ||
    [...touch.values()].includes("right");
  const pad = [...(navigator.getGamepads?.() || [])].find(Boolean);
  if (!pad) {
    padPrevious = {};
    return;
  }
  input.crouch ||= pad.axes[1] > 0.5 || pad.buttons[13]?.pressed;
  input.left ||= pad.axes[0] < -0.25 || pad.buttons[14]?.pressed;
  input.right ||= pad.axes[0] > 0.25 || pad.buttons[15]?.pressed;
  for (const [action, index] of Object.entries({
    jump: 0,
    attack: 2,
    interact: 1,
  })) {
    const pressed = !!pad.buttons[index]?.pressed;
    if (pressed && !padPrevious[action]) input[action] = true;
    padPrevious[action] = pressed;
  }
}
function tone(event) {
  if (!audioContext || $("#sound").getAttribute("aria-pressed") !== "true")
    return;
  const hz = {
    jump: 250,
    swing: 140,
    hit: 95,
    hurt: 65,
    break: 480,
    pickup: 880,
    gate: 180,
    checkpoint: 660,
    death: 45,
    defeat: 110,
    staff: 80,
  }[event];
  if (!hz) return;
  const oscillator = audioContext.createOscillator(),
    gain = audioContext.createGain(),
    t = audioContext.currentTime;
  oscillator.type = event === "pickup" ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(hz, t);
  oscillator.frequency.exponentialRampToValueAtTime(hz * 0.6, t + 0.16);
  gain.gain.setValueAtTime(0.035, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(t);
  oscillator.stop(t + 0.21);
}
function text(str, x, y, color = "#ddc18a", size = 16) {
  ctx.fillStyle = color;
  ctx.font = `${size}px Georgia`;
  ctx.fillText(str, x, y);
}
function background() {
  const drift = s.camera * 0.045;
  ctx.drawImage(art.sky, -340 - drift, -30, 2100, 840);
  const fog = ctx.createLinearGradient(0, 300, 0, 720);
  fog.addColorStop(0, "#0c172000");
  fog.addColorStop(1, "#080f1af5");
  ctx.fillStyle = fog;
  ctx.fillRect(0, 0, 1280, 720);
  ctx.save();
  ctx.translate(-s.camera * 0.35, 0);
  ctx.fillStyle = "#14213199";
  for (let x = 0; x < 9000; x += 690) {
    ctx.fillRect(x, 420, 70, 250);
    ctx.beginPath();
    ctx.moveTo(x - 12, 420);
    ctx.lineTo(x + 35, 320);
    ctx.lineTo(x + 82, 420);
    ctx.fill();
  }
  ctx.restore();
}
function platform(p) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.x, p.y, p.w, solidHeight(p));
  ctx.clip();
  for (let x = p.x; x < p.x + p.w; x += 240) {
    ctx.drawImage(art.stone, x, p.y, 240, 80);
    ctx.drawImage(
      art.stone,
      0,
      180,
      art.stone.width,
      art.stone.height - 180,
      x,
      p.y + 80,
      240,
      80,
    );
  }
  ctx.restore();
  ctx.strokeStyle = "#afbdc7";
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + p.w, p.y);
  ctx.stroke();
}
function hero() {
  const air = !s.grounded;
  let f = atlas.frames[0],
    sheet = art.hero,
    scale = 144 / 418;
  if (s.attack > 0)
    f = atlas.frames[s.attack > 0.28 ? 5 : s.attack > 0.1 ? 6 : 7];
  else if (air) {
    const frames = [
      { x: 40, y: 20, width: 415, height: 680, pivotX: 240, pivotY: 644 },
      { x: 475, y: 130, width: 420, height: 390, pivotX: 245, pivotY: 354 },
      { x: 910, y: 130, width: 400, height: 580, pivotX: 235, pivotY: 542 },
    ];
    f = frames[s.vy < -140 ? 0 : s.vy > 140 ? 2 : 1];
    sheet = art.air;
    scale = 144 / 510;
  } else if (Math.abs(s.vx) > 0)
    f = atlas.frames[1 + (Math.floor(s.walk / 0.115) % 4)];
  ctx.save();
  ctx.translate(s.x, s.y);
  // Temporary pose until contributor job 01 supplies anatomically drawn crouch frames.
  ctx.scale(s.facing, s.crouching ? 0.39 : 1);
  if (s.invulnerable > 0 && Math.floor(s.time * 15) % 2) ctx.globalAlpha = 0.4;
  ctx.drawImage(
    sheet,
    f.x,
    f.y,
    f.width,
    f.height,
    -f.pivotX * scale,
    -f.pivotY * scale,
    f.width * scale,
    f.height * scale,
  );
  ctx.restore();
}
function enemy(e) {
  if (e.hp <= 0) {
    ctx.fillStyle = "#9b998244";
    ctx.fillRect(e.x - 30, e.y - 4, 60, 4);
    return;
  }
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.scale(-e.facing, 1);
  if (e.mode === "hurt") ctx.globalAlpha = 0.5;
  ctx.rotate(e.mode === "windup" ? 0.1 : e.mode === "strike" ? -0.16 : 0);
  // Body-only source crop avoids showing the old painted staff alongside the moving weapon.
  ctx.drawImage(art.enemy, 330, 175, 430, 945, -37, -138, 74, 138);
  ctx.restore();
  if (e.mode === "windup") {
    text("!", e.x - 5, e.y - 172, "#ffcc77", 28);
    ctx.strokeStyle = "#ecb464";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(
      e.x,
      e.y - 160,
      17,
      -Math.PI / 2,
      -Math.PI / 2 + (1 - e.timer / 0.8) * Math.PI * 2,
    );
    ctx.stroke();
  }
  const weapon = staffPose(e);
  ctx.save();
  ctx.strokeStyle = "#5e4936";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(weapon.x, weapon.y);
  ctx.lineTo(weapon.tipX, weapon.tipY);
  ctx.stroke();
  ctx.strokeStyle = "#a49980";
  ctx.lineWidth = 1;
  ctx.stroke();
  // A solid bell head follows the same tip used by the melee collision sweep.
  ctx.translate(weapon.tipX, weapon.tipY);
  ctx.rotate(Math.atan2(weapon.tipY - weapon.y, weapon.tipX - weapon.x));
  ctx.fillStyle = "#9b7a4c";
  ctx.beginPath();
  ctx.moveTo(-8, -7);
  ctx.lineTo(8, -11);
  ctx.lineTo(8, 11);
  ctx.lineTo(-8, 7);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#d3b98a";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
  ctx.fillStyle = "#292333";
  ctx.fillRect(e.x - 22, e.y - 150, 44, 4);
  ctx.fillStyle = "#d0a079";
  ctx.fillRect(e.x - 22, e.y - 150, (44 * e.hp) / 3, 4);
}
function draw() {
  if (!art) return;
  background();
  ctx.save();
  ctx.translate(-s.camera, 0);
  for (const p of platforms)
    if (p.x + p.w > s.camera && p.x < s.camera + 1280) platform(p);
  braziers.forEach((b, i) => {
    ctx.strokeStyle = "#67747c";
    ctx.beginPath();
    ctx.moveTo(b.x, b.y - 165);
    ctx.lineTo(b.x, b.y - 75);
    ctx.stroke();
    if (!s.broken[i]) ctx.drawImage(art.brazier, b.x - 42, b.y - 86, 84, 100);
    else {
      ctx.fillStyle = "#b89767";
      ctx.fillRect(b.x - 12, b.y - 70, 24, 4);
    }
  });
  for (const d of s.drops) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.drawImage(
      art.ember,
      d.x - 27,
      d.y - 42 + Math.sin(s.time * 4) * 3,
      54,
      54,
    );
    ctx.restore();
  }
  // Portal is scenery; a separate code-drawn seal represents its gameplay lock.
  ctx.save();
  ctx.beginPath();
  const outline = [
    [82, 95],
    [814, 95],
    [814, 398],
    [830, 402],
    [830, 442],
    [816, 447],
    [817, 1028],
    [864, 1070],
    [864, 1115],
    [34, 1115],
    [34, 1070],
    [76, 1060],
    [82, 447],
    [69, 444],
    [69, 403],
    [82, 402],
  ];
  outline.forEach(([x, y], i) => {
    const px = LEVEL.gate - 110 + ((x - 34) * 260) / 830,
      py = 280 + ((y - 95) * 320) / 1020;
    if (i) ctx.lineTo(px, py);
    else ctx.moveTo(px, py);
  });
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(art.portal, 34, 95, 830, 1020, LEVEL.gate - 110, 280, 260, 320);
  ctx.restore();
  if (!s.gateOpen) {
    ctx.fillStyle = "#c9a56b80";
    ctx.fillRect(LEVEL.gate - 4, 435, 8, 165);
    text("E · 1 EMBER", LEVEL.gate - 45, 262);
  } else text("PATH OPEN", LEVEL.gate - 42, 262, "#a3d7bd");
  const cx = LEVEL.checkpoint + 30;
  ctx.fillStyle = s.checkpoint ? "#f9d88c" : "#677a82";
  ctx.beginPath();
  ctx.arc(cx, 555, 14, 0, Math.PI * 2);
  ctx.fill();
  text("SANCTUARY", cx - 48, 520);
  for (const e of s.enemies) enemy(e);
  hero();
  const signs = [
    [180, "I · THE OUTER COURT"],
    [1120, "II · THE BROKEN CAUSEWAY"],
    [2600, "III · THE PILGRIM ROAD"],
    [4300, "IV · THE UPPER WALK"],
    [5460, "V · THE SEALED GATE"],
  ];
  for (const [x, label] of signs) text(label, x, 215, "#c8b38f", 17);
  text("J / X · BREAK", 340, 380);
  text("Optional embers above", 1280, 300);
  text("Jump near the edge", 650, 475);
  text("S / ↓ · crouch below the arch", 1640, 565);
  text("Watch the windup. Strike, then retreat.", 1770, 370);
  if (guide) {
    ctx.strokeStyle = "#8ee6d2";
    for (const p of platforms) ctx.strokeRect(p.x, p.y, p.w, 5);
    const body = bodyBox(s);
    ctx.strokeRect(body.x, body.y, body.w, body.h);
    const b = hitbox(s);
    if (b) {
      ctx.fillStyle = "#ffa95a66";
      ctx.fillRect(b.x, b.y, b.w, b.h);
    }
  }
  ctx.restore();
  // Foreground markers scroll faster than the action plane for depth.
  ctx.save();
  ctx.translate(-s.camera * 1.08, 0);
  ctx.fillStyle = "#050b1399";
  for (let x = 200; x < 7600; x += 930) {
    ctx.fillRect(x, 675, 18, 45);
    ctx.fillRect(x - 12, 687, 42, 8);
  }
  ctx.restore();
  $("#health").textContent = "♥".repeat(s.hp) + "♡".repeat(5 - s.hp);
  $("#embers").textContent = s.embers;
  $("#progress").value = (s.x / LEVEL.width) * 100;
  $("#notice").textContent = s.noticeTime > 0 ? s.notice : "";
  $("#motion-status").textContent = s.complete
    ? "SANCTUARY REACHED"
    : `${Math.floor(s.x / 64)}% · ${s.grounded ? "GROUNDED" : "AIRBORNE"}`;
  $("#objective").textContent = s.complete
    ? "Encounter complete — explore or restart"
    : !s.collected
      ? "Break a brazier and collect an ember"
      : !s.gateOpen
        ? "Pass the guards · offer an ember at the gate"
        : "Reach the sanctuary";
}
function tick(now) {
  if (running && !document.hidden) {
    controls();
    acc += Math.min((now - last) / 1000, 0.1);
    while (acc >= 1 / 60) {
      step(s, input, 1 / 60, options);
      for (const e of s.events) tone(e);
      input.jump = input.attack = input.interact = false;
      acc -= 1 / 60;
    }
  }
  last = now;
  draw();
  requestAnimationFrame(tick);
}
try {
  const r = await fetch("art/production/bellwarden/bellwarden-pilot-v001.json");
  if (!r.ok) throw Error("Atlas unavailable");
  atlas = await r.json();
  const paths = {
    sky: "abbey/skyline-distant-v001",
    stone: "abbey/masonry-module-v001",
    hero: "bellwarden/bellwarden-pilot-v001",
    air: "bellwarden/bellwarden-airborne-v001",
    brazier: "props/hanging-brazier-v001",
    ember: "props/consecration-ember-v001",
    portal: "abbey/abbey-gate-portal-v001",
  };
  art = Object.fromEntries(
    await Promise.all(
      Object.entries(paths).map(async ([k, p]) => [
        k,
        await load("art/production/" + p + ".png"),
      ]),
    ),
  );
  art.enemy = await load("art/concepts/hollow-pilgrim-concept-v001.png");
  art.hero = keyed(art.hero, true);
  for (const k of ["air", "brazier", "enemy"]) art[k] = keyed(art[k]);
  $("#enter").disabled = false;
  $("#enter").textContent = "Enter the pilgrim road";
  window.encounter = { snapshot: () => structuredClone(s), ready: true };
  requestAnimationFrame(tick);
} catch (e) {
  $("#enter").textContent = "Could not load — reload to retry";
  $("#notice").textContent = e.message;
  console.error(e);
}

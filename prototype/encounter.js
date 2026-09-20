import {
  VIEW,
  LEVEL,
  platforms,
  braziers,
  hitbox,
  bodyBox,
  solidHeight,
} from "./encounter-sim.js";
import { pilgrimFrames, pilgrimScale, pilgrimPose } from "./pilgrim-poses.js";
import { platformCap, arcade } from "./environment-metrics.js";
import * as run from "./run.js";
import { DEATH_FADE } from "./iron-sexton.js";
import { loadHero, drawHero } from "./hero-render.js";
import { keyed, silhouette } from "./render.js";
const canvas = document.querySelector("#game"),
  ctx = canvas.getContext("2d");
const W = run.enter("road");
let heroArt = null;
let s = run.roomState(W),
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
  s = run.restart(W, "road");
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
  ctx.translate(-s.camera * arcade.parallax, 0);
  // Faded architecture belongs to the distant scenery, behind all actors.
  ctx.globalAlpha = 0.25;
  for (let x = 0; x < 9000; x += 690) {
    for (let bay = 0; bay < 3; bay++) {
      ctx.drawImage(
        art.arcade,
        x + bay * 190,
        670 - arcade.groundY * arcade.scale,
        1024 * arcade.scale,
        1024 * arcade.scale,
      );
    }
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
  for (let x = p.x; x < p.x + p.w; x += platformCap.repeat) {
    ctx.drawImage(
      art.platformCap,
      x,
      p.y - platformCap.lift,
      platformCap.repeat,
      platformCap.height,
    );
  }
  ctx.restore();
  // No drawn highlight along the lip: the cap art already has a lit top.
}

function enemy(e) {
  const dying = e.hp <= 0;
  const fade = dying ? 1 - (e.deadFor ?? 0) / DEATH_FADE : 1;
  // No remains marker: a flat bar on the floor is not a game object. When a
  // rubble or scorch decal exists it belongs here. See docs/WANTED_ASSETS.md.
  if (dying && fade <= 0) return;
  ctx.save();
  ctx.translate(e.x, dying ? e.y + (1 - fade) * 10 : e.y);
  // The Hollow Pilgrim sheet has only idle, shuffle, windup and strike — no
  // hurt or death pose — so a falling guard fades out in whatever pose it
  // holds. A real death pose is requested in docs/WANTED_ASSETS.md.
  const pose = pilgrimPose(e),
    frame = pilgrimFrames[pose];
  ctx.scale(e.facing * frame.facing, 1);
  ctx.globalAlpha = dying ? fade : e.mode === "hurt" ? 0.5 : 1;
  ctx.drawImage(
    art.enemyFrames[pose],
    -frame.pivot[0] * pilgrimScale,
    -frame.pivot[1] * pilgrimScale,
    1376 * pilgrimScale,
    768 * pilgrimScale,
  );
  ctx.restore();
  if (dying) return;
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
  ctx.fillStyle = "#292333";
  ctx.fillRect(e.x - 22, e.y - 150, 44, 4);
  ctx.fillStyle = "#d0a079";
  ctx.fillRect(e.x - 22, e.y - 150, (44 * e.hp) / 3, 4);
}
function draw() {
  if (!heroArt) return;
  if (!art) return;
  background();
  ctx.save();
  ctx.translate(-s.camera, 0);
  for (const p of platforms)
    if (p.x + p.w > s.camera && p.x < s.camera + 1280) platform(p);
  braziers.forEach((b, i) => {
    // The censer art carries its own ceiling mount and chains, so none of
    // this is drawn by hand. Struck, it is clipped above the bowl so the
    // chains are left hanging empty.
    const top = b.y - 166;
    const size = 200;
    ctx.save();
    if (s.broken[i]) {
      ctx.beginPath();
      ctx.rect(b.x - size / 2, top, size, b.y - 86 - top);
      ctx.clip();
    }
    ctx.drawImage(art.brazier, b.x - size / 2, top, size, size);
    ctx.restore();
  });
  for (const d of s.drops) {
    ctx.save();
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
    ctx.drawImage(art.grate, LEVEL.gate - 64, 448, 128, 160);
    text("E · 1 EMBER", LEVEL.gate - 45, 262);
  } else text("PATH OPEN", LEVEL.gate - 42, 262, "#a3d7bd");
  const cx = LEVEL.checkpoint + 30;
  // Lit, the sanctuary is a consecration ember. Unlit, there is nothing to
  // draw: a grey disc standing in for a flame is worse than an empty niche.
  if (s.checkpoint)
    ctx.drawImage(
      art.ember,
      cx - 34,
      524 + Math.sin(s.time * 3) * 4,
      68,
      68,
    );
  text("SANCTUARY", cx - 48, 496);
  for (const e of s.enemies) enemy(e);
  drawHero(ctx, s, heroArt);
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
  // Foreground parallax posts used to be dark filled rectangles. A flat box is
  // not a game object, and the one balustrade asset in the library is painted
  // on an opaque background, so its openings cannot be keyed out for use as a
  // foreground overlay. An alpha cutout is requested in docs/WANTED_ASSETS.md;
  // until it exists this layer stays empty rather than shipping boxes.
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
      if (run.step(W, input, 1 / 60, options)) return; // crossing to the cloister
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
  const paths = {
    sky: "abbey/skyline-distant-v001",
    stone: "abbey/masonry-module-v001",
    portal: "abbey/abbey-gate-portal-v001",
    enemy: "enemies/hollow-pilgrim-motion-v001",
  };
  art = Object.fromEntries(
    await Promise.all(
      Object.entries(paths).map(async ([k, p]) => [
        k,
        await load("art/production/" + p + ".png"),
      ]),
    ),
  );
  art.platformCap = await load(platformCap.path);
  art.grate = await load("art/contributions/15-mechanisms/v003/exports/grate-v001.png");
  art.arcade = await load(arcade.path);
  art.enemy = keyed(art.enemy);
  heroArt = await loadHero(load);
  atlas = heroArt.atlas;
  art.brazier = await load(
    "art/contributions/04-brazier-alpha/v001/source/brazier-alpha-generated-v001.png",
  );
  art.ember = await load(
    "art/contributions/05-ember-alpha/v001/exports/ember-alpha-v001.png",
  );
  art.enemyFrames = Object.fromEntries(
    Object.entries(pilgrimFrames).map(([name, frame]) => [
      name,
      silhouette(art.enemy, frame.outline),
    ]),
  );
  $("#enter").disabled = false;
  $("#enter").textContent = "Enter the pilgrim road";
  window.encounter = { snapshot: () => structuredClone(s), ready: true };
  requestAnimationFrame(tick);
} catch (e) {
  $("#enter").textContent = "Could not load — reload to retry";
  $("#notice").textContent = e.message;
  console.error(e);
}

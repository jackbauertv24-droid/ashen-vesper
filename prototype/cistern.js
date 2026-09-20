// Stage 03 — Flooded Cistern renderer.
import { LEVEL, platforms, VIAL } from "./cistern-sim.js";
import { LURKER, DEATH_FADE, lurkerPose } from "./cistern-lurker.js";
import { loadHero, drawHero } from "./hero-render.js";
import { platformCap } from "./environment-metrics.js";
import { solidHeight } from "./physics.js";
import * as run from "./run.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const $ = (q) => document.querySelector(q);

const W = run.enter("cistern");
let s = run.roomState(W);
let running = false;
let art = {};
let hero = null;
let last = 0;
let acc = 0;
let padPrevious = {};
const held = new Set();
const pulse = {};

const KEYS = {
  KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right",
  Space: "jump", KeyW: "jump", ArrowUp: "jump",
  KeyS: "crouch", ArrowDown: "crouch",
  KeyJ: "attack", KeyX: "attack", KeyE: "interact",
};

function input() {
  const pad = navigator.getGamepads?.().find(Boolean);
  const down = (name) => held.has(name) || !!pulse[name];
  const state = {
    left: down("left"), right: down("right"), crouch: down("crouch"),
    jump: down("jump"), attack: down("attack"), interact: down("interact"),
  };
  if (pad) {
    const ax = pad.axes[0] ?? 0;
    state.left ||= ax < -0.4 || pad.buttons[14]?.pressed;
    state.right ||= ax > 0.4 || pad.buttons[15]?.pressed;
    state.crouch ||= (pad.axes[1] ?? 0) > 0.5 || pad.buttons[13]?.pressed;
    for (const [i, key] of [[0, "jump"], [2, "attack"], [1, "interact"]]) {
      const now = !!pad.buttons[i]?.pressed;
      if (now && !padPrevious[key]) state[key] = true;
      padPrevious[key] = now;
    }
  }
  return state;
}

addEventListener("keydown", (e) => {
  const k = KEYS[e.code];
  if (!k) return;
  e.preventDefault();
  if (k === "jump" || k === "attack" || k === "interact") pulse[k] = true;
  held.add(k);
});
addEventListener("keyup", (e) => { const k = KEYS[e.code]; if (k) held.delete(k); });
addEventListener("blur", () => held.clear());
for (const button of document.querySelectorAll("[data-control]")) {
  const name = button.dataset.control;
  button.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    held.add(name);
    if (name === "jump" || name === "attack" || name === "interact") pulse[name] = true;
  });
  for (const end of ["pointerup", "pointercancel", "pointerleave"])
    button.addEventListener(end, () => held.delete(name));
}

function start() { running = true; $("#start-overlay").classList.add("hidden"); canvas.focus(); }
function reset() { s = run.restart(W, "cistern"); held.clear(); start(); }
$("#enter").onclick = start;
$("#reset").onclick = reset;

function platform(p) {
  const h = solidHeight(p);
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.x, p.y, p.w, h);
  ctx.clip();
  for (let x = p.x; x < p.x + p.w; x += 240) {
    ctx.drawImage(art.stone, x, p.y, 240, 80);
    for (let y = p.y + 80; y < p.y + h; y += 80)
      ctx.drawImage(art.stone, 0, 180, art.stone.width, art.stone.height - 180, x, y, 240, 80);
  }
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(p.x, p.y, p.w, 60);
  ctx.clip();
  for (let x = p.x; x < p.x + p.w; x += platformCap.repeat)
    ctx.drawImage(art.cap, x, p.y - platformCap.lift, platformCap.repeat, platformCap.height);
  ctx.restore();
}

function enemy() {
  const e = s.enemy;
  const dying = e.hp <= 0;
  const fade = dying ? 1 - e.deadFor / DEATH_FADE : 1;
  if (fade <= 0) return;
  const pose = lurkerPose(e);
  const [col, row] = LURKER.frames[pose];
  const C = LURKER.cell;
  const S = LURKER.scale;
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.scale(e.facing * LURKER.sheetFacing, 1);
  ctx.globalAlpha = dying ? fade : e.mode === "hurt" ? 0.5 : 1;
  if (e.mode === "rest") ctx.globalAlpha *= 0.55; // still mostly under water
  if (dying) ctx.translate(0, (1 - fade) * 8);
  ctx.drawImage(art.lurker, col * C, row * C, C, C,
    -LURKER.anchor[0] * S, -LURKER.anchor[1] * S, C * S, C * S);
  ctx.restore();
  if (dying) return;
  if (e.mode === "emerge") {
    ctx.fillStyle = "#ffcc77";
    ctx.font = "28px Georgia";
    ctx.fillText("!", e.x - 5, e.y - 120);
  }
  if (e.mode !== "rest") {
    ctx.fillStyle = "#1d2b33";
    ctx.fillRect(e.x - 22, e.y - 108, 44, 4);
    ctx.fillStyle = "#d0a079";
    ctx.fillRect(e.x - 22, e.y - 108, (44 * e.hp) / 3, 4);
  }
}

function draw() {
  const fog = ctx.createLinearGradient(0, 0, 0, 720);
  fog.addColorStop(0, "#111c22");
  fog.addColorStop(1, "#060d11");
  ctx.fillStyle = fog;
  ctx.fillRect(0, 0, 1280, 720);
  if (!hero) return;

  ctx.save();
  ctx.translate(-s.camera * 0.3, 0);
  for (let x = -200; x < LEVEL.width; x += 460)
    ctx.drawImage(art.pier, x, 40, 240, 590);
  ctx.restore();

  ctx.save();
  ctx.translate(-s.camera, 0);
  // The channels are left as open dark water. They had a canvas gradient
  // with a sine-wave stroke for ripples, which read as cheap shading rather
  // than a flooded cistern. A painted water surface is requested in
  // docs/WANTED_ASSETS.md; until it exists the gaps stay honest.
  for (const p of platforms) platform(p);
  for (let x = 520; x < LEVEL.width; x += 940)
    ctx.drawImage(art.lantern, x, 196, 74, 74);
  ctx.drawImage(art.lever, s.leverOn ? 512 : 0, 0, 512, 512,
    LEVEL.lever - 56, 600 - 102, 112, 112);
  ctx.drawImage(art.grate, LEVEL.gate - 65, s.leverOn ? 275 : 438, 130, 162);
  if (!s.vialTaken)
    ctx.drawImage(art.vial, VIAL.x - 32, 520 + Math.sin(s.time * 3) * 5, 64, 64);
  enemy();
  drawHero(ctx, s, hero);
  ctx.fillStyle = "#d9bc82";
  ctx.font = "17px Georgia";
  for (const [x, t] of [[200, "I · THE SLUICE"], [1450, "II · STILL WATER"],
                        [2400, "III · THE VALVE"], [3600, "IV · THE OUTFALL"]])
    ctx.fillText(t, x, 340);
  ctx.restore();

  $("#health").textContent = "♥".repeat(Math.max(0, s.hp));
  $("#progress").value = Math.min(100, (s.x / LEVEL.finish) * 100);
  $("#status").textContent = s.complete ? "ROUTE COMPLETE" : "CISTERN";
  if (s.noticeTime > 0) $("#notice").textContent = s.notice;
}

function tick(now) {
  if (running) {
    acc += Math.min((now - last) / 1000, 0.1);
    while (acc >= 1 / 60) {
      if (run.step(W, input(), 1 / 60, {})) return;
      for (const k of Object.keys(pulse)) delete pulse[k];
      acc -= 1 / 60;
    }
  }
  last = now;
  draw();
  requestAnimationFrame(tick);
}

const load = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`failed to load ${src}`));
    image.src = src;
  });

try {
  const [cap, stone, pier, lantern, lurker, lever, grate, vial] = await Promise.all([
    load("art/contributions/world-03-flooded-cistern/v002/exports/damp-platform-cap-center-v002.png"),
    load("art/production/abbey/masonry-module-v001.png"),
    load("art/contributions/09-flooded-cistern/v002/exports/cistern-vault-pier-unlit-v002.png"),
    load("art/contributions/09-flooded-cistern/v002/exports/cistern-hanging-lantern-v002.png"),
    load(LURKER.path),
    load("art/contributions/15-mechanisms/v001/exports/lever-v001.png"),
    load("art/contributions/15-mechanisms/v003/exports/grate-v001.png"),
    load("art/contributions/14-pickups-and-relics/v001/exports/healing-vial-v001.png"),
  ]);
  art = { cap, stone, pier, lantern, lurker, lever, grate, vial };
  hero = await loadHero(load);
  window.cistern = { ready: true, snapshot: () => structuredClone(s) };
  requestAnimationFrame(tick);
} catch (error) {
  console.error(error);
  $("#notice").textContent = `Stage assets failed to load: ${error.message}`;
}

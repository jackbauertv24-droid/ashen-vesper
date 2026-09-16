import { WORLD, PLATFORMS, TARGET, createState, advance, poseIndex, attackBox } from './simulation.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#motion-status');
const overlay = document.querySelector('#start-overlay');
const enter = document.querySelector('#enter');
const inspect = document.querySelector('#inspect');
const hits = document.querySelector('#hit-count');
const state = createState();
const input = { left: false, right: false, jump: false, attack: false };
let running = false, guides = false, art = null, atlas = null;
let accumulator = 0, lastTime = 0;
const keys = new Set(), touches = new Map();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}. Serve this folder over HTTP using npm run dev.`));
    img.src = src;
  });
}

// Source remains intact. Runtime compositing turns its key color into alpha.
export function prepareCharacter(image, settings) {
  const surface = document.createElement('canvas');
  surface.width = image.width; surface.height = image.height;
  const c = surface.getContext('2d', { willReadFrequently: true });
  c.drawImage(image, 0, 0);
  if (settings.transparency === 'magenta-key') {
    const pixels = c.getImageData(0, 0, surface.width, surface.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
      const excess = Math.min(r, b) - g;
      if (excess > 80) pixels.data[i + 3] = 0;
      else if (excess > 20) {
        pixels.data[i + 3] = Math.round(255 * (1 - (excess - 20) / 60));
        pixels.data[i] = Math.max(g, r - excess);
        pixels.data[i + 2] = Math.max(g, b - excess);
      }
    }
    c.putImageData(pixels, 0, 0);
  }
  return surface;
}

function reset() { Object.assign(state, createState()); clearInput(); }
function clearInput() { keys.clear(); touches.clear(); for (const k of Object.keys(input)) input[k] = false; }
function start() { if (!art) return; running = true; overlay.classList.add('hidden'); canvas.focus({ preventScroll: true }); }
enter.addEventListener('click', start);
document.querySelector('#reset').addEventListener('click', () => { reset(); canvas.focus({ preventScroll: true }); });
inspect.addEventListener('click', () => { guides = !guides; inspect.setAttribute('aria-pressed', String(guides)); inspect.textContent = guides ? 'Hide guides' : 'Show guides'; });
const keyMap = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'jump', ArrowUp: 'jump', KeyW: 'jump', KeyJ: 'attack', KeyX: 'attack' };
function updateHeld() {
  input.left = [...keys].some(k => keyMap[k] === 'left') || [...touches.values()].includes('left');
  input.right = [...keys].some(k => keyMap[k] === 'right') || [...touches.values()].includes('right');
}
window.addEventListener('keydown', e => {
  if (!running || (document.activeElement !== canvas && !e.target.closest('.touch-controls'))) return;
  const action = keyMap[e.code];
  if (action) {
    e.preventDefault(); keys.add(e.code); updateHeld();
    if (!e.repeat && (action === 'jump' || action === 'attack')) input[action] = true;
  }
  if (e.code === 'KeyR' && !e.repeat) { e.preventDefault(); reset(); }
});
window.addEventListener('keyup', e => { keys.delete(e.code); updateHeld(); });
window.addEventListener('blur', clearInput);
document.addEventListener('visibilitychange', () => { clearInput(); accumulator = 0; });
document.querySelectorAll('[data-control]').forEach(button => {
  button.addEventListener('pointerdown', e => {
    e.preventDefault(); if (!art) return; start();
    button.setPointerCapture(e.pointerId);
    const action = button.dataset.control;
    touches.set(e.pointerId, action); updateHeld();
    if (action === 'jump' || action === 'attack') input[action] = true;
  });
  const release = e => { touches.delete(e.pointerId); updateHeld(); };
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
});

function drawBackdrop() {
  ctx.drawImage(art.background, 0, 0, WORLD.width, WORLD.height);
  const wash = ctx.createLinearGradient(0, 0, 0, WORLD.height);
  wash.addColorStop(0, '#0a142b16'); wash.addColorStop(0.65, '#050d190a'); wash.addColorStop(1, '#040b13aa');
  ctx.fillStyle = wash; ctx.fillRect(0, 0, WORLD.width, WORLD.height);
}

function drawPlatform(p) {
  // Modules use the same cap height and stone scale, regardless of ledge height.
  const tileWidth = 240, tileHeight = 80;
  ctx.save(); ctx.beginPath(); ctx.rect(p.x, p.y, p.width, p.height); ctx.clip();
  ctx.fillStyle = '#1b2229'; ctx.fillRect(p.x, p.y, p.width, p.height);
  for (let x = p.x; x < p.x + p.width; x += tileWidth) {
    ctx.drawImage(art.stone, x, p.y, tileWidth, tileHeight);
    if (p.height > tileHeight) ctx.drawImage(art.stone, 0, art.stone.height * 0.25, art.stone.width, art.stone.height * 0.75,
      x, p.y + tileHeight, tileWidth, tileHeight * 0.75);
    // Narrow mortar joint makes the modules' joins explicit rather than claiming a seamless texture.
    if (x > p.x) { ctx.fillStyle = '#17212ac0'; ctx.fillRect(x - 1, p.y + 5, 2, p.height - 5); }
  }
  const shade = ctx.createLinearGradient(0, p.y, 0, p.y + p.height);
  shade.addColorStop(0, '#09172500'); shade.addColorStop(1, '#07121bab');
  ctx.fillStyle = shade; ctx.fillRect(p.x, p.y, p.width, p.height);
  ctx.restore();
  ctx.strokeStyle = '#bac8cb88'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y + 0.5); ctx.lineTo(p.x + p.width, p.y + 0.5); ctx.stroke();
}

function drawWard() {
  const x = TARGET.x + TARGET.width / 2, y = TARGET.y + 12;
  ctx.save();
  ctx.fillStyle = '#4c4540'; ctx.fillRect(x - 3, y, 6, 610 - y);
  ctx.fillStyle = '#74604a'; ctx.fillRect(x - 17, 605, 34, 5);
  const glow = ctx.createRadialGradient(x, y, 2, x, y, state.targetFlash > 0 ? 100 : 55);
  glow.addColorStop(0, state.targetFlash > 0 ? '#ffedb9b0' : '#d3a45866'); glow.addColorStop(1, '#daab5700');
  ctx.fillStyle = glow; ctx.fillRect(x - 100, y - 100, 200, 200);
  ctx.translate(x, y); ctx.rotate(Math.PI / 4);
  ctx.fillStyle = state.targetFlash > 0 ? '#fff0bf' : '#ad8857'; ctx.fillRect(-15, -15, 30, 30);
  ctx.fillStyle = '#242731'; ctx.fillRect(-10, -10, 20, 20);
  ctx.strokeStyle = '#f1cf91'; ctx.lineWidth = 1; ctx.strokeRect(-5, -5, 10, 10);
  ctx.restore();
  if (state.targetFlash > 0) {
    const t = 0.28 - state.targetFlash;
    ctx.save(); ctx.globalAlpha = state.targetFlash / 0.28; ctx.strokeStyle = '#f6d99f';
    for (let i = 0; i < 9; i++) { const a = i * 2.4; const r = 12 + t * 190;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.lineTo(x + Math.cos(a) * (r + 7), y + Math.sin(a) * (r + 7)); ctx.stroke(); }
    ctx.restore();
  }
}

function drawCharacter() {
  const pose = atlas.frames[poseIndex(state)];
  const scale = atlas.displayHeight / atlas.referenceHeight;
  ctx.save();
  if (state.grounded) {
    ctx.fillStyle = '#060c1499'; ctx.beginPath(); ctx.ellipse(state.x, state.y + 2, 24, 4, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.translate(state.x, state.y); ctx.scale(state.facing, 1);
  ctx.drawImage(art.character, pose.x, pose.y, pose.width, pose.height,
    -pose.pivotX * scale, -pose.pivotY * scale, pose.width * scale, pose.height * scale);
  ctx.restore();
  if (state.attacking && state.attackTime >= 13 / 60 && state.attackTime < 18 / 60) {
    ctx.save(); ctx.translate(state.x, state.y - 75); ctx.scale(state.facing, 1);
    ctx.globalAlpha = (18 / 60 - state.attackTime) / (5 / 60) * 0.5;
    ctx.strokeStyle = '#dfeaff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(20, 0, 83, 43, -0.25, -1.4, 0.5); ctx.stroke(); ctx.restore();
  }
}

function drawGuides() {
  ctx.save(); ctx.lineWidth = 1.5; ctx.font = '13px monospace';
  for (const p of PLATFORMS) { ctx.strokeStyle = '#8cd7c4'; ctx.strokeRect(p.x, p.y, p.width, p.height); }
  ctx.strokeStyle = '#f0c184'; ctx.strokeRect(state.x - 13, state.y - 118, 26, 118);
  ctx.beginPath(); ctx.moveTo(state.x - 8, state.y); ctx.lineTo(state.x + 8, state.y); ctx.moveTo(state.x, state.y - 8); ctx.lineTo(state.x, state.y + 8); ctx.stroke();
  const box = attackBox(state); if (box) { ctx.fillStyle = '#f0a75c44'; ctx.fillRect(box.x, box.y, box.width, box.height); }
  ctx.strokeStyle = '#e2a562'; ctx.strokeRect(TARGET.x, TARGET.y, TARGET.width, TARGET.height);
  ctx.fillStyle = '#d8e7ec'; ctx.fillText(`x ${state.x.toFixed(1)} / feet ${state.y.toFixed(1)} / pose ${poseIndex(state)} / ${state.mode}`, 35, 780);
  ctx.restore();
}

function draw() {
  if (!art) return;
  ctx.clearRect(0, 0, WORLD.width, WORLD.height); drawBackdrop();
  for (const p of PLATFORMS) drawPlatform(p);
  drawWard(); drawCharacter();
  if (!reducedMotion) {
    ctx.fillStyle = '#d6e1e24a';
    for (let i = 0; i < 20; i++) { const x = (i * 197 + state.time * (5 + i % 5)) % WORLD.width;
      const y = 250 + ((i * 73 + Math.sin(state.time * 0.4 + i) * 18) % 310); ctx.fillRect(x, y, 1.3, 1.3); }
  }
  if (guides) drawGuides();
  status.textContent = running ? `${state.mode.toUpperCase()} · ${state.facing > 0 ? 'EAST' : 'WEST'}` : 'READY TO EXPLORE';
  hits.textContent = state.hits;
}

function tick(time) {
  if (running && !document.hidden) {
    accumulator += Math.min((time - lastTime) / 1000, 0.1);
    while (accumulator >= 1 / 60) {
      advance(state, input, 1 / 60); input.jump = false; input.attack = false; accumulator -= 1 / 60;
    }
  }
  lastTime = time; draw(); requestAnimationFrame(tick);
}

try {
  const response = await fetch('art/production/bellwarden/bellwarden-pilot-v001.json');
  if (!response.ok) throw new Error('The character atlas metadata is unavailable.');
  atlas = await response.json();
  const [background, character, stone] = await Promise.all([
    loadImage('art/concepts/abbey-gate-concept-v001.png'),
    loadImage('art/production/bellwarden/bellwarden-pilot-v001.png'),
    loadImage('art/production/abbey/masonry-module-v001.png'),
  ]);
  art = { background, character: prepareCharacter(character, atlas), stone };
  enter.disabled = false; enter.textContent = 'Enter the courtyard';
  // Read-only state supports automated checks without introducing debug controls in the player flow.
  window.artStudy = { snapshot: () => ({ ...state }), get ready() { return !!art; } };
  draw(); requestAnimationFrame(tick);
} catch (error) {
  overlay.classList.add('hidden'); document.querySelector('#error-panel').hidden = false;
  document.querySelector('#error-message').textContent = error.message;
  status.textContent = 'SCENE UNAVAILABLE'; console.error(error);
}

// One camera for every stage, on both axes.
//
// The three stages each carried their own copy of this and had already
// drifted: the Pilgrim Road eased its look-ahead and framed at 740/430,
// while the Cloister and Cistern snapped the lead instantly and framed at
// 760/420. The eased lead is the better behaviour, so it is the one kept.
//
// Vertical tracking is inert while a stage fits inside one screen, which is
// true of all three stages today. It exists because every stage baseline in
// docs/world is taller than a screen and cannot be shown without it.
export const VIEW = { width: 1280, height: 720 };

export const LOOK = {
  lead: 85, // how far ahead of the player the view aims
  ease: 3, // how quickly the lead swings when the player turns
  right: 740, // keep the focus inside this horizontal band
  left: 430,
  bottom: 470, // and inside this vertical band, on a tall stage
  top: 300,
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * @param s      simulation state; reads x, y, facing, writes look, camera, cameraY
 * @param level  the stage box: { width, height }
 */
export function trackCamera(s, level, dt, options = {}) {
  const rate = Math.min(1, dt * (options.camera === "tight" ? 12 : 5));

  s.look += (s.facing * LOOK.lead - s.look) * Math.min(1, dt * LOOK.ease);

  const focusX = s.x + s.look;
  const screenX = focusX - s.camera;
  let targetX = s.camera;
  if (screenX > LOOK.right) targetX = focusX - LOOK.right;
  if (screenX < LOOK.left) targetX = focusX - LOOK.left;
  targetX = clamp(targetX, 0, Math.max(0, level.width - VIEW.width));
  s.camera += (targetX - s.camera) * rate;

  const height = level.height ?? VIEW.height;
  if (height <= VIEW.height) {
    s.cameraY = 0;
    return;
  }
  const screenY = s.y - s.cameraY;
  let targetY = s.cameraY;
  if (screenY > LOOK.bottom) targetY = s.y - LOOK.bottom;
  if (screenY < LOOK.top) targetY = s.y - LOOK.top;
  targetY = clamp(targetY, 0, height - VIEW.height);
  s.cameraY += (targetY - s.cameraY) * rate;
}

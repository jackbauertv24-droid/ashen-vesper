// Iron Sexton heavy enemy — runtime frame map for the Job 12 v005 motion sheet.
//
// The sheet is a 4x2 grid of 512px cells sharing one ground anchor, so a pose
// is a cell index and the runtime never needs per-frame pivots.
/** Seconds a defeated Sexton stays on screen, fading, before it is gone. */
export const DEATH_FADE = 0.5;

export const IRON_SEXTON = {
  path: "art/contributions/12-iron-sexton/v005/exports/iron-sexton-motion-v003.png",
  cell: 512,
  anchor: [208, 464],
  sheetFacing: 1,
  // Recorded deviation: the submission declares BOTH scale 0.40 and a runtime
  // height of 160 units, and those disagree. Its standing source height is
  // 362px, so scale 0.40 renders 144.8 units — the same as the 144-unit hero
  // and shorter than the 162-unit placeholder this replaces. The declared
  // runtime height is the intent, since a heavy enemy should read as taller
  // than the player, so the runtime honours 160 rather than silently
  // shrinking the Sexton. Change this only with a new reviewed sheet.
  standingSource: 362,
  runtimeHeight: 160,
  get scale() {
    return this.runtimeHeight / this.standingSource;
  },
  frames: {
    idle: [0, 0],
    stepA: [1, 0],
    stepB: [2, 0],
    brace: [3, 0],
    windup: [0, 1],
    contact: [1, 1],
    recover: [2, 1],
    hurt: [3, 1],
  },
  // Recorded deviation: the sheet declares one shared ground anchor, and
  // vertically it holds to within 2px across all eight cells. Horizontally it
  // does not. Measured torso centres drift from the idle pose by 0.6-5.3px for
  // the walk and telegraph poses, by 30px for contact and 24px for recover —
  // a forward lunge and a pull back, which read as intended — and by 58.8px
  // for hurt.
  //
  // 58.8px is 26 world units at this scale, wider than the hitbox half-width
  // of 24, so an uncorrected hurt pose would draw the Sexton's body clear of
  // the box the player can actually hit. Art must not fake displacement the
  // simulation does not know about; real knockback belongs in the simulation,
  // where the hitbox moves with it. Only poses exceeding the half-width are
  // corrected, so the authored lunge and recovery survive untouched.
  offsets: { hurt: -59 },
};

/**
 * Map a simulation enemy mode to a sheet pose name.
 * The windup splits across two poses so the telegraph reads as a brace and
 * then a raise, matching the 0.8s windup the simulation gives the player.
 */
/** Horizontal source-pixel correction for a pose, 0 when none is recorded. */
export function sextonOffset(name) {
  return IRON_SEXTON.offsets[name] ?? 0;
}

export function sextonFrame(e, time = 0) {
  switch (e.mode) {
    case "hurt":
      return "hurt";
    case "strike":
      return "contact";
    case "recover":
      return "recover";
    case "windup":
      return e.timer > 0.45 ? "brace" : "windup";
    case "approach":
      return Math.floor(time / 0.25) % 2 ? "stepB" : "stepA";
    default:
      return "idle";
  }
}

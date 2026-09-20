// Cistern Lurker — runtime frame map for the Job 13 v003 motion sheet.
//
// A 3x2 grid of 512px cells. Unlike the Iron Sexton sheet this one needs no
// per-pose correction: measured body centres sit within 4px of 256 and every
// foot line within 2px of 448, across all six cells.
export const LURKER = {
  path: "art/contributions/13-cistern-lurker/v003/exports/cistern-lurker-motion-v001.png",
  cell: 512,
  anchor: [256, 448],
  sheetFacing: 1,
  scale: 0.3,
  frames: {
    rest: [0, 0],
    emerge: [1, 0],
    crawlA: [2, 0],
    crawlB: [0, 1],
    lunge: [1, 1],
    recover: [2, 1],
  },
};

/** World units covered per step pose while crawling. */
export const STRIDE = 26;

/** Seconds a defeated Lurker stays on screen, fading. */
export const DEATH_FADE = 0.5;

/**
 * Map a simulation mode to a sheet pose.
 *
 * The sheet has no hurt and no death pose, so both fall back to `recover`.
 * That gap is recorded in docs/WANTED_ASSETS.md; it is the same shortfall
 * the other two enemies have.
 */
export function lurkerPose(e) {
  const f = LURKER.frames;
  switch (e.mode) {
    case "rest":
      return "rest";
    case "emerge":
      return "emerge";
    case "lunge":
      return "lunge";
    case "recover":
    case "hurt":
    case "dead":
      return "recover";
    default:
      if (!e.moving) return "emerge";
      return Math.floor((e.walk ?? 0) / STRIDE) % 2 ? "crawlB" : "crawlA";
  }
}

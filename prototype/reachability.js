// Static reachability over a stage's platforms.
//
// Authoring a vertical map by hand is how you ship a ledge nobody can get
// to. This walks the platform graph using the shared jump envelope and says
// which surfaces cannot be reached from the spawn, and why.
import { MOVE } from "./physics.js";

/** How high the hero rises from a standing jump, and how far she carries. */
export const ENVELOPE = {
  rise: (MOVE.jump * MOVE.jump) / (2 * MOVE.gravity),
  reach: MOVE.run * ((2 * Math.abs(MOVE.jump)) / MOVE.gravity),
};

const spanGap = (a, b) => {
  if (a.x + a.w < b.x) return b.x - (a.x + a.w);
  if (b.x + b.w < a.x) return a.x - (b.x + b.w);
  return 0; // they overlap horizontally
};

/** Can a body standing on `from` get onto `to`? */
export function canReach(from, to, margin = 0.9) {
  const gap = spanGap(from, to);
  const rise = from.y - to.y; // positive when `to` is higher
  if (rise > ENVELOPE.rise * margin) return false;
  if (rise <= 0) {
    // Dropping. Overlapping means step off; otherwise it is a running jump.
    return gap <= ENVELOPE.reach * margin;
  }
  // Climbing costs height, so less of the arc is left for distance.
  const spent = rise / ENVELOPE.rise;
  return gap <= ENVELOPE.reach * margin * (1 - spent * 0.55);
}

/**
 * @returns { reached, unreachable, spawnIndex } indices into `platforms`
 */
export function reachableFrom(platforms, spawn) {
  const start = platforms.findIndex(
    (p) => spawn.x >= p.x - 40 && spawn.x <= p.x + p.w + 40 && Math.abs(p.y - spawn.y) < 60,
  );
  if (start < 0) throw new Error(`no platform under the spawn at ${spawn.x},${spawn.y}`);
  const reached = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const i = queue.shift();
    platforms.forEach((to, j) => {
      if (reached.has(j)) return;
      if (!canReach(platforms[i], to)) return;
      reached.add(j);
      queue.push(j);
    });
  }
  return {
    reached,
    spawnIndex: start,
    unreachable: platforms
      .map((p, i) => ({ p, i }))
      .filter(({ i }) => !reached.has(i)),
  };
}

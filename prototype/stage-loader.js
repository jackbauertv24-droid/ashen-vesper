// Turn a stage layout baseline into runtime geometry.
//
// Baselines live in docs/world/examples and are authored room-local with y
// pointing down, each room carrying an origin that places it in the stage.
// The runtime uses the same y-down convention, so a solid becomes a platform
// by adding its room origin — no flipping, no scaling.
//
// A baseline is a sketch, not a finished stage: the ones written so far are
// marked not-runtime-ready and carry empty spawn, checkpoint and encounter
// lists. The loader reports that in `warnings` so a caller cannot mistake a
// sketch for a stage.

/** @param doc a parsed stage baseline document */
export function loadStageLayout(doc) {
  if (!doc || !Array.isArray(doc.rooms))
    throw new Error("stage baseline has no rooms");

  const warnings = [];
  if (doc.status && !/runtime-ready/.test(doc.status))
    warnings.push(`status is "${doc.status}"`);

  const rooms = doc.rooms.map((room) => {
    const ox = room.origin?.x ?? 0;
    const oy = room.origin?.y ?? 0;
    const platforms = (room.solids ?? []).map((s) => ({
      id: s.id,
      room: room.id,
      x: ox + s.x,
      y: oy + s.y,
      w: s.w,
      h: s.h,
    }));
    if (!room.spawns?.length) warnings.push(`${room.id}: no spawn point`);
    if (!room.checkpoints?.length) warnings.push(`${room.id}: no checkpoint`);
    if (!room.encounters?.length) warnings.push(`${room.id}: no encounters`);
    return {
      id: room.id,
      label: room.label,
      origin: { x: ox, y: oy },
      bounds: room.bounds,
      platforms,
      limitations: room.limitations ?? [],
    };
  });

  const platforms = rooms.flatMap((r) => r.platforms);
  const bounds = doc.bounds ?? boundsOf(platforms);

  // Anything outside the declared stage box is a translation error, and it
  // would be invisible rather than obviously wrong, so fail loudly.
  for (const p of platforms) {
    const inside =
      p.x >= bounds.x &&
      p.y >= bounds.y &&
      p.x + p.w <= bounds.x + bounds.w &&
      p.y + p.h <= bounds.y + bounds.h;
    if (!inside)
      throw new Error(
        `solid ${p.id} at (${p.x},${p.y},${p.w}x${p.h}) falls outside stage bounds ${bounds.w}x${bounds.h}`,
      );
  }

  return {
    id: doc.stageId,
    name: doc.name,
    bounds,
    rooms,
    platforms,
    warnings,
    /** True only when the baseline claims to be finished and has spawns. */
    runtimeReady: warnings.length === 0,
  };
}

function boundsOf(platforms) {
  const x = Math.min(...platforms.map((p) => p.x));
  const y = Math.min(...platforms.map((p) => p.y));
  return {
    x,
    y,
    w: Math.max(...platforms.map((p) => p.x + p.w)) - x,
    h: Math.max(...platforms.map((p) => p.y + p.h)) - y,
  };
}

/** Platforms whose top edge a body standing at `y` could rest on. */
export function surfacesAt(layout, y, tolerance = 2) {
  return layout.platforms.filter((p) => Math.abs(p.y - y) <= tolerance);
}

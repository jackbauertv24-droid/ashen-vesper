// Shared runtime contract for every Ashen Vesper stage.
//
// A stage may own its level geometry, props, enemies and camera, but it must
// move the player through this module. Duplicating these rules is how Stage 02
// silently drifted from Pilgrim Road: crouch speed, air control, impact pause
// and the low-ceiling guard were all lost in a hand-copied step().

export const BODY = { halfWidth: 13, standing: 120, crouched: 84 };

export const MOVE = {
  run: 235,
  crouchRun: 85,
  jump: -650,
  gravity: 1850,
  airControlRate: 5,
  attackTime: 0.42,
  hitFrom: 0.12,
  hitTo: 0.28,
  hitstop: 0.045,
  edgeMargin: 20,
  killPlane: 900,
  maxFrame: 1 / 30,
};

export const solidHeight = (p) => p.h ?? 150;

/** A frame step is never longer than this, so a stall cannot teleport a body. */
export const clampDt = (dt) => Math.min(Math.max(dt, 0), MOVE.maxFrame);

export const overlaps = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

export const bodyHeight = (s) => (s.crouching ? BODY.crouched : BODY.standing);

export const bodyBox = (s) => ({
  x: s.x - BODY.halfWidth,
  y: s.y - bodyHeight(s),
  w: BODY.halfWidth * 2,
  h: bodyHeight(s),
});

export function hitbox(s) {
  return s.attack > MOVE.hitFrom && s.attack < MOVE.hitTo
    ? {
        x: s.facing > 0 ? s.x + 8 : s.x - 115,
        y: s.y - (s.attackCrouched ? 64 : 110),
        w: 107,
        h: s.attackCrouched ? 57 : 82,
      }
    : null;
}

// Never force the standing body through a low ceiling when crouch is released.
export const standBlocked = (s, platforms) =>
  platforms.some((p) =>
    overlaps(
      {
        x: s.x - BODY.halfWidth,
        y: s.y - BODY.standing,
        w: BODY.halfWidth * 2,
        h: BODY.standing,
      },
      { x: p.x, y: p.y, w: p.w, h: solidHeight(p) },
    ),
  );

/**
 * Crouch/facing/attack resolution, horizontal velocity and side collision.
 * Returns the frame context that stepVertical needs. Callers may clamp s.x
 * (gates, doors) between the two calls.
 */
export function stepHorizontal(s, input, dt, platforms, options = {}) {
  dt = clampDt(dt);
  const dir = Number(!!input.right) - Number(!!input.left);
  const blocked = standBlocked(s, platforms);
  s.crouching =
    s.grounded &&
    (!!input.crouch ||
      (s.attack > 0 && s.attackCrouched) ||
      (s.crouching && blocked));
  if (s.grounded && !s.attack && !s.hurtFor && dir) s.facing = dir;
  if (input.attack && s.attack <= 0 && !s.hurtFor) {
    s.attack = MOVE.attackTime;
    s.attackId++;
    s.attackCrouched = s.crouching;
    s.events.push("swing");
  }
  if (s.attack > 0) s.attack = Math.max(0, s.attack - dt);
  if (s.grounded) {
    s.vx =
      s.attack > 0 || s.hurtFor > 0
        ? 0
        : dir * (s.crouching ? MOVE.crouchRun : MOVE.run);
    if (input.jump && !s.crouching && !s.hurtFor) {
      s.vx = dir * MOVE.run;
      s.vy = MOVE.jump;
      s.grounded = false;
      s.events.push("jump");
    }
  } else if (options.airControl && !s.hurtFor) {
    s.vx += (dir * MOVE.run - s.vx) * Math.min(1, dt * MOVE.airControlRate);
  }

  const ctx = { oldX: s.x, oldY: s.y, height: bodyHeight(s) };
  const limit = options.levelWidth ?? Infinity;
  s.x = Math.max(
    MOVE.edgeMargin,
    Math.min(limit - MOVE.edgeMargin, s.x + s.vx * dt),
  );
  // Resolve solid side faces independently from top/bottom collisions.
  for (const p of platforms) {
    if (
      ctx.oldY > p.y + 0.01 &&
      ctx.oldY - ctx.height < p.y + solidHeight(p) - 0.01
    ) {
      if (
        s.vx > 0 &&
        ctx.oldX + BODY.halfWidth <= p.x + 0.01 &&
        s.x + BODY.halfWidth > p.x
      ) {
        s.x = p.x - BODY.halfWidth;
        if (s.grounded) s.vx = 0;
      } else if (
        s.vx < 0 &&
        ctx.oldX - BODY.halfWidth >= p.x + p.w - 0.01 &&
        s.x - BODY.halfWidth < p.x + p.w
      ) {
        s.x = p.x + p.w + BODY.halfWidth;
        if (s.grounded) s.vx = 0;
      }
    }
  }
  return ctx;
}

/** Gravity, vertical integration and top/underside collision. */
export function stepVertical(s, ctx, dt, platforms) {
  dt = clampDt(dt);
  s.vy += MOVE.gravity * dt;
  s.y += s.vy * dt;
  s.grounded = false;
  for (const p of platforms) {
    if (s.x + BODY.halfWidth <= p.x || s.x - BODY.halfWidth >= p.x + p.w)
      continue;
    if (s.vy >= 0 && ctx.oldY <= p.y + 0.01 && s.y >= p.y) {
      s.y = p.y;
      s.vy = 0;
      s.grounded = true;
    } else if (
      s.vy < 0 &&
      ctx.oldY - ctx.height >= p.y + solidHeight(p) - 0.01 &&
      s.y - ctx.height < p.y + solidHeight(p)
    ) {
      s.y = p.y + solidHeight(p) + ctx.height;
      s.vy = 0;
    }
  }
}

/**
 * The platform whose top supports a point, or null when it is over a gap.
 * Actors that walk without gravity use this so they stop at a ledge instead
 * of striding out over a hole.
 */
export function groundAt(x, y, platforms, tolerance = 2) {
  return (
    platforms.find(
      (p) => x >= p.x && x <= p.x + p.w && Math.abs(p.y - y) <= tolerance,
    ) ?? null
  );
}

/** Shared per-frame preamble: clamp dt, clear events, advance timers. */
export function beginFrame(s, dt) {
  dt = clampDt(dt);
  s.events = [];
  s.time += dt;
  s.noticeTime = Math.max(0, s.noticeTime - dt);
  s.invulnerable = Math.max(0, s.invulnerable - dt);
  if (s.hitstop > 0) {
    s.hitstop -= dt;
    return { dt, frozen: true };
  }
  return { dt, frozen: false };
}

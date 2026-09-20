// A portcullis withdraws into the masonry above its doorway. It does not
// levitate. Both stages previously drew the grate 163 units higher when the
// lever was pulled, so the whole gate hung unsupported in mid-air.
import { solidHeight } from "./physics.js";

export const PORTCULLIS = { width: 130, height: 162, housing: 54 };

/**
 * @param x      world x of the doorway centre
 * @param floorY ground line the closed grate rests on
 * @param open   true once the mechanism has been released
 * @param grate  the portcullis cutout
 * @param stone  masonry module, used for the housing it retracts into
 */
export function drawPortcullis(ctx, { x, floorY, open, grate, stone }) {
  const { width: w, height: h, housing } = PORTCULLIS;
  const left = x - w / 2;
  const top = floorY - h;

  // The housing is real masonry, so the point the grate disappears into is
  // something the player can see rather than an invisible clip edge.
  ctx.drawImage(
    stone,
    0,
    180,
    stone.width,
    stone.height - 180,
    left - 12,
    top - housing,
    w + 24,
    housing,
  );

  ctx.save();
  ctx.beginPath();
  ctx.rect(left, top, w, h);
  ctx.clip();
  // Raised, only the toothed foot of the grate still shows under the lintel.
  ctx.drawImage(grate, left, top - (open ? h * 0.86 : 0), w, h);
  ctx.restore();
}

export { solidHeight };

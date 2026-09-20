// The Bellwarden, drawn once for every stage.
//
// Preparing the hero is not trivial — three sheets, colour keying, a
// hand-cut crouch atlas and blade repairs — and it is identical in every
// stage. It lived inline in each renderer, which is how the stages drifted
// before. One copy.
import { keyed, silhouette } from "./render.js";
import { crouchScale, crouchAnchors } from "./character-metrics.js";

export const HERO_SHEETS = {
  pilot: "art/production/bellwarden/bellwarden-pilot-v001.png",
  air: "art/production/bellwarden/bellwarden-airborne-v001.png",
  crouch:
    "art/contributions/01-bellwarden-crouch/v001/source/crouch-generated-v001.png",
  atlas: "art/production/bellwarden/bellwarden-pilot-v001.json",
};

const GROUND_SCALE = 144 / 418;
const AIR_SCALE = 144 / 510;

// Ascent, apex and fall, cut from the airborne sheet.
const AIR_FRAMES = [
  { x: 40, y: 20, width: 415, height: 680, pivotX: 240, pivotY: 644 },
  { x: 475, y: 130, width: 420, height: 390, pivotX: 245, pivotY: 354 },
  { x: 910, y: 130, width: 400, height: 580, pivotX: 235, pivotY: 542 },
];

// The generator clipped the sword in six crouch cells; these triangles
// restore each blade from the unkeyed source.
const CROUCH_BLADES = [
  [[266, 362], [480, 417], [268, 376]],
  [[814, 337], [1019, 383], [814, 350]],
  [[1370, 342], [1518, 409], [1367, 356]],
  [[163, 768], [404, 818], [160, 781]],
  [[972, 725], [1188, 732], [972, 741]],
  [[1374, 796], [1508, 763], [1380, 809]],
];

const CROUCH_OUTLINES = [
  [[0, 110], [505, 110], [505, 480], [0, 480]],
  [[525, 110], [1020, 110], [1020, 480], [525, 480]],
  [[1045, 110], [1536, 110], [1536, 480], [1045, 480]],
  [[0, 610], [510, 610], [510, 980], [0, 980]],
  [[515, 610], [1200, 610], [1200, 750], [980, 750], [980, 980], [515, 980]],
  [[1070, 840], [1200, 700], [1200, 610], [1536, 610], [1536, 980], [1070, 980]],
];

/** `load` is the page's image loader: (path) => Promise<HTMLImageElement>. */
export async function loadHero(load) {
  const [pilot, air, crouchSource] = await Promise.all([
    load(HERO_SHEETS.pilot),
    load(HERO_SHEETS.air),
    load(HERO_SHEETS.crouch),
  ]);
  const atlas = await fetch(HERO_SHEETS.atlas).then((r) => r.json());
  const crouch = keyed(crouchSource, false, true);
  for (const blade of CROUCH_BLADES)
    crouch.getContext("2d").drawImage(silhouette(crouchSource, blade), 0, 0);
  return {
    atlas,
    sheet: keyed(pilot, true),
    air: keyed(air),
    crouchFrames: CROUCH_OUTLINES.map((o) => silhouette(crouch, o)),
  };
}

/** Draw the hero for a simulation state at its world position. */
export function drawHero(ctx, s, h) {
  let frame = h.atlas.frames[0];
  let sheet = h.sheet;
  let scale = GROUND_SCALE;
  if (s.attack > 0) {
    frame = h.atlas.frames[s.attack > 0.28 ? 5 : s.attack > 0.1 ? 6 : 7];
  } else if (!s.grounded) {
    frame = AIR_FRAMES[s.vy < -140 ? 0 : s.vy > 140 ? 2 : 1];
    sheet = h.air;
    scale = AIR_SCALE;
  } else if (Math.abs(s.vx) > 0) {
    frame = h.atlas.frames[1 + (Math.floor(s.walk / 0.115) % 4)];
  }
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.scale(s.facing, 1);
  if (s.invulnerable > 0 && Math.floor(s.time * 15) % 2) ctx.globalAlpha = 0.4;
  if (s.crouching) {
    const n =
      s.attack > 0
        ? s.attack > 0.28
          ? 3
          : s.attack > 0.12
            ? 4
            : 5
        : Math.abs(s.vx) > 0
          ? 1 + (Math.floor(s.walk / 0.18) % 2)
          : 0;
    const [ax, ay] = crouchAnchors[n];
    ctx.drawImage(
      h.crouchFrames[n],
      -ax * crouchScale,
      -ay * crouchScale,
      1536 * crouchScale,
      1024 * crouchScale,
    );
  } else {
    ctx.drawImage(
      sheet,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      -frame.pivotX * scale,
      -frame.pivotY * scale,
      frame.width * scale,
      frame.height * scale,
    );
  }
  ctx.restore();
}

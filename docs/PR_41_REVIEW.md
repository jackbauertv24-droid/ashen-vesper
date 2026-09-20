# Maintainer review — PR 41

**Job 01 Bellwarden damage reaction and death motion sheet (v001): selected
and integrated.** This is the first submission to close the top item on
[the wanted list](WANTED_ASSETS.md).

All originals, exports, prompts, notes and metadata are retained and locked.
Maintainer image-generation attempts: zero.

## Verified independently

| check | result |
| --- | --- |
| Grid | 2x2 of 512px cells: hurt, stagger, collapse, death |
| Detached fragments | none — every cell a single contiguous component |
| Ground anchor, vertical | footline at exactly 464 in all four cells |
| Ground anchor, horizontal | body centres 226–287 against a declared 256; worst drift 31px = 10.7 units, inside the 13-unit body half-width, so no correction |
| Scale | declared 0.3444976 against a 418px standing height = **144.0 units**, which agrees with itself and matches the existing hero sheet exactly |
| Format | true RGBA cutout, zero magenta, so no colour keying needed |

The scale agreeing with the declared runtime height is worth calling out: the
Iron Sexton sheet declared two figures that contradicted, and needed a
recorded deviation. This one is internally consistent and needs none.

## One integration detail

The sheet is drawn **facing left**; the pilot and airborne sheets face right.
The runtime mirrors it with `sheetFacing: -1` in `prototype/hero-render.js`.
Not a defect — just a fact the renderer has to know, recorded next to the
frame map.

## What it changed in the game

The player previously had no damage reaction at all: a hit flickered the
current pose to 40% alpha, and death teleported the player back instantly.

- A non-fatal hit now holds the recoil pose for 0.35s.
- A fatal hit plays stagger, collapse and death over 1.6s, during which the
  stage holds still and input is ignored, then fades and respawns.
- Falling out of the world or drowning still respawns immediately; there is
  no body to show.

All three stages share this through `hero-render.js`, and the sequence is
covered per stage in `test/runtime-contract.test.mjs`.

## Note on the merge

Integrating this exposed that `hero-render.js` had been extracted but never
adopted: the Cloister and the Pilgrim Road still carried their own inline
hero renderers, so the new poses would have appeared only in the Cistern.
Both are now migrated, which removed 204 lines from `encounter.js` alone.

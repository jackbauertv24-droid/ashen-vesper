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

## Facing — and a mistake worth recording

The sheet faces **right**, the same way the pilot and airborne sheets do, so
it takes the same mirror from `s.facing` and needs no correction.

On first integration this was misread as facing left and wired with
`sheetFacing: -1`, which flipped the hero to face *away* from whatever had
just hit her. It survived the composed-frame check, the route check and a
screenshot review, because a mirrored character still renders perfectly and
looks plausible in a still image — it is only wrong relative to the attacker.
It was caught by the maintainer playing the game.

`test/runtime-contract.test.mjs` now pins `DAMAGE.sheetFacing` to 1 with the
reason, so changing it has to be deliberate.

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

# Map design — why the stages feel alike, and the plan

## The three stages are the same map

Measured from the runtime geometry:

| stage | width | platforms | distinct floor heights | vertical range | gaps |
| --- | --- | --- | --- | --- | --- |
| Pilgrim Road | 6400 | 10 | 6 | 210 | 3 |
| Ruined Cloister | 4200 | 7 | 3 | 170 | 3 |
| Flooded Cistern | 4400 | 6 | 2 | 95 | 3 |

Every one is a single floor line, left to right, with exactly three gaps and a
handful of steps. The viewport is 720 units tall; the tallest stage uses 210
of them. There is no branch, no loop, no backtrack, no optional route, and
nothing above or below the walking plane. They are the same map in three
costumes, and no amount of art will hide that.

## We already designed better maps

The six baselines in `docs/world/examples/v001` are original designs for this
project, and they are not simple:

| baseline | rooms | collision solids | extent | vertical |
| --- | --- | --- | --- | --- |
| 01 Pilgrim Road | 5 | 311 | 13920 x 1360 | yes |
| 02 Ruined Cloister | 6 | **666** | 8192 x 2640 | yes |
| 03 Flooded Cistern | 5 | 62 | 14336 x 2000 | yes |
| 04 Ossuary Gallery | 3 | 74 | 16012 x 1168 | yes |
| 05 Counterweight Works | 6 | 88 | 9216 x 2640 | yes |
| 06 Bell Tower | 5 | 174 | 11944 x 2000 | yes |

The playable Cloister has 7 platforms in a 170-unit strip. Its own baseline
has 666 solids across six rooms spanning 2,640 units of height. **We ship
about two percent of the geometry we have already designed, flattened onto
one screen line.**

So the shortage is not design and not reference material. The runtime cannot
express what the design documents already specify.

## What actually blocks it

1. **The camera is a horizontal scalar.** `s.camera` is one number. A stage
   taller than 720 units cannot be shown, so verticality is unrenderable.
2. **Geometry is hand-written literals.** Nobody is going to hand-type 666
   solids into a JavaScript array. Without a loader, map size is capped by
   patience.
3. **A stage is one flat array of platforms.** There are no rooms, doors or
   connectivity, so there is nothing for a branch or a loop to be made of.
4. **The vocabulary is thin.** Solid blocks and one lever. No one-way drops,
   shafts, ladders, keys, destructible walls or hidden rooms — the pieces
   that make a map worth exploring.

## On borrowing ideas

This project is inspired by the genre and is not affiliated with any
existing game, which is the position [RIGHTS.md](../RIGHTS.md) states and
that we intend to keep.

The useful things to borrow are **structural ideas**, and they belong to the
genre rather than to any one title: vertical shafts that link floors, a main
route with optional side rooms, a gate that sends you back through space you
have already crossed, encounter spacing that alternates pressure and rest,
rooms that are read in one screen versus rooms that scroll. Those are design
concepts, and applying them is ordinary craft.

What we will not do is copy level geometry from another game, or build a
layout that would be recognised as a reproduction of a specific one. That is
copying expression rather than borrowing an idea, and it would contradict
the project's own stated position. No extracted map data from any other game
belongs in this repository, and none is here.

Where an outside reference is genuinely useful is as a **yardstick**:
aggregate figures for how complex a stage of this kind usually is — how many
rooms, how much of the map is optional, how often the route turns vertical.
Those are measurements, they inform targets, and they can be quoted as
numbers without importing anything.

## Plan

**Phase 1 — let the runtime express a real map.** Nothing else matters until
this is done, and none of it needs new art.

1. **Baseline loader.** Read a stage JSON, translate room-local y-down solids
   into runtime platforms, and validate it by loading a stage whose shape we
   already know. Geometry becomes data.
2. **Vertical camera.** `camera` becomes a point with bounds, look-ahead and
   clamping on both axes. This is M4.1 and it unblocks every baseline, all
   six of which are taller than a screen.
3. **Rooms within a stage.** A stage becomes a graph of rooms joined by
   thresholds, reusing the room-graph machinery `prototype/world.js` already
   uses between stages. Branches and loops need somewhere to exist.

**Phase 2 — prove it on the smallest baseline.** Rebuild the Flooded Cistern
from its own 5-room, 62-solid baseline. It is the least geometry of the six,
so it is the cheapest honest test of the loader and camera. Keep the current
route until the rebuilt one passes the same tests.

**Phase 3 — widen the vocabulary.** One-way drops, climbable shafts, a locked
door with a key held elsewhere, a breakable wall, one hidden room. Each is a
small runtime feature and each multiplies what a layout can say.

**Phase 4 — hold new stages to a standard.** A complexity contract in the
test suite, the same way the runtime contract works: a stage must have at
least three rooms, span more than one screen vertically, offer at least one
optional route, and place at least one encounter off the critical path. A
stage that cannot meet it is a corridor, and we have three of those already.

## Sequencing note

Phases 1 and 2 are pure runtime work with the art already accepted. Phase 3
needs a little art — a ladder or shaft treatment, a door, a breakable wall —
which will be raised in [wanted assets](WANTED_ASSETS.md) when the runtime
can use it, not before.

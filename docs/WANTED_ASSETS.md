# Wanted assets — what this game can actually use

Read this before generating anything. The library is not short of good
images. It is short of **motion** and of **depth per subject**, and those are
the two things a side-scrolling action game consumes.

## The state of the library, measured

| | count |
| --- | --- |
| Exported PNG assets | 35 |
| **Single static images** | **28 (80%)** |
| Multi-pose motion sheets | 7 — but three are revisions of one enemy, so **5 distinct animated subjects** |
| Frames in the deepest sheet | 8 |
| Retained candidates in total | 74 |
| Assets the running game loads | 12 |

## Why beautiful images are often not usable

The art quality is genuinely high and the single-image work is good. The
problem is structural, not a matter of skill.

A generator is excellent at "one striking picture of a thing." A platformer
does not render pictures of things; it renders the **same** thing many times
— across animation frames, across repeats of a floor tile, across a
colonnade of identical piers. What it needs is not beauty per image but
**identity across instances**: the same silhouette, proportions, lighting
direction, palette and ground contact, every time.

That is precisely where this pipeline has failed, every time, this project:

- **Iron Sexton v003** — detached shovel fragments in two of eight cells.
- **v004** — the fragments were removed by deleting the whole shovel in the
  `hurt` cell, so the weapon vanished whenever the player landed a hit.
- **v005** — fixed, but the `hurt` cell sits 59px off the shared ground
  anchor: 26 runtime units, wider than the enemy's own hitbox half-width, so
  the body would draw clear of where it can be struck.
- **platform-cap v001** — a painted left-to-right lighting gradient. Lovely
  alone; tiled across a floor it produced visible warm/cool stripes, and it
  shipped on the front page for days.

None of those are quality failures. Every one is a consistency failure. So:

> **A single image is a design reference. A game asset is a set that agrees
> with itself.** Assume any one-pose submission will be retained and not
> integrated.

## Depth before breadth

The obvious reading of "we lack variety" is to generate more subjects. That
would make things worse. The library already spans five enemies, six stage
kits, three mechanisms and two pickups; what it lacks is **more than one
pose of almost any of them.** Seventy-four retained candidates against
twelve in use is not a breadth problem.

So the rule for now: **finish a subject before starting another.** A subject
is finished when it has its minimum set below, on one sheet, on one anchor.

### Minimum viable set, per kind

| Kind | Minimum to be integrable |
| --- | --- |
| Player | idle, walk cycle, attack, **hurt**, **death**, plus the existing crouch and airborne sets |
| Walking enemy | idle, two walk poses, telegraph, contact, recover, hurt, death |
| Flying enemy | two hover poses, warn, approach, contact, recover |
| Boss | ready, telegraph, each attack's contact, recover, hurt, death |
| Pickup | one cutout, plus an idle bob if it should read as collectable |
| Mechanism | one cell per state, on one shared base |
| Repeating floor or wall | centre strip that tiles seamlessly, plus left and right end caps |
| Backdrop | one wide parallax layer per stage |

## Wanted now, in order

### 1. Bellwarden hurt and death — the biggest hole

The player has **no damage reaction at all.** The hero atlas has eight
frames: idle, four walk, three attack. A hit is shown by flickering the
current pose to 40% alpha. Five health points, invulnerability frames,
death and respawn all exist in the simulation with nothing behind them.

Two poses, same sheet conventions as `bellwarden-pilot-v001`: a short recoil
and a collapse. Same grid, same ground anchor, 144-unit runtime height.

### 2. Ruined Cloister backdrop

Stage 02 fills flat `#0b131b` and a gradient where the Pilgrim Road has a
painted sky. The upper third of the screen is empty colour — the most
visible difference between the two playable stages. Wanted: one wide
parallax layer reading as enclosed interior, not open sky, covering a
4,200-unit stage at the 0.18 parallax the stage already uses.

### 3. Depth for the two enemies that are actually in the game

The Hollow Pilgrim (Pilgrim Road) and the Iron Sexton (Ruined Cloister) are
the only enemies a player meets. Neither has a **death** pose; both simply
stop being drawn. The Sexton sheet is otherwise complete.

### 4. A second Pilgrim Road enemy

The Road places three guards, all the same sprite. One contrasting
silhouette — something that forces a different response than "wait for the
staff windup" — would do more for the encounter than any new stage kit.

### 5. Pickup variety

Two pickups exist in the whole game: the consecration ember and the healing
vial. No relics, no keys, no throwables. A small set that shares one cutout
convention would be worth more than another architectural module.

### 6. Iron Sexton v006 hurt cell — optional

Low priority. Re-author `hurt` on the same anchor as the other seven cells
so the runtime's recorded -59px correction can be deleted. Nothing is broken
without it.

## Do not generate

- **Anything for the Flooded Cistern, Ossuary Gallery, Counterweight Works
  or Bell Tower.** All four already have accepted environment kits, and the
  Cistern also has a selected enemy motion sheet. None of them exists as
  playable space. Art cannot be integrated into a stage that has no layout.
- **Another Bell Moth, Cistern Lurker or Tollkeeper sheet.** All three are
  selected and waiting on behaviour code, not on better art.
- **New single-pose design references for new subjects.** They will be
  retained and not used. Add poses to an accepted subject instead.
- **Polish passes on assets already running.** Generation is
  budget-sensitive.

## How to make a sheet that passes review

These come from defects actually caught here, not from theory.

1. **One grid, one anchor.** Fixed cell size, and every pose's ground contact
   on the same point. Measure it in the exported PNG; do not assume the
   generator honoured the prompt. Vertical drift under ~2px is achievable —
   the v005 sheet manages it. Horizontal drift is what slips.
2. **Keep the weapon attached in every cell.** Run a connected-component
   check: each cell should be one blob. Two blobs means a detached fragment;
   a cell that is suddenly much lighter than its neighbours means something
   was deleted rather than fixed.
3. **Make the poses differ.** Two walk poses that differ by 27% of their
   silhouette read as a stutter; 60–70% reads as a stride.
4. **A repeating strip must tile.** Butt a copy against itself and check the
   join, and check the left tenth against the right tenth for a lighting
   gradient. A painted cool-to-warm fall-off tiles as stripes even when the
   seam itself is perfect.
5. **State one status** — planning-only, retained candidate, selected
   prototype, usable export, runtime integration — and do not claim
   behaviour a preview cannot demonstrate.
6. **Check your own claims before submitting.** Three of the defects above
   were asserted as fixed in the submission notes and were not.

The tests in `npm run test:art` enforce the structural half of this. The
rest is visual review, which is why previews and multi-background composites
are required.

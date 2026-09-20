# Image generation — what is actually needed

**Art supply is not the bottleneck; runtime capability is.** The retained
library holds 74 candidate assets. The game loads 12. Four stages have
accepted environment kits and enemy motion sheets but do not exist as
playable space. Generating more art for those stages adds cost and review
load without moving the game forward.

This list therefore exists to say *no* as much as to say yes. It is ordered
by how visible the gap is in something a player can actually reach today.

## Generate these

### 1. Ruined Cloister backdrop — highest value

Stage 02 has no painted backdrop. `draw()` fills flat `#0b131b` and a linear
gradient, so the upper third of the screen is empty colour behind the
arcade, while the Pilgrim Road has a painted sky with moon, cloud bank and a
distant mountain and spire line. It is the most visible difference between
the two playable stages, and the one a first-time player sees immediately.

Wanted: a single wide parallax backdrop for an enclosed cloister at night —
far wall, upper clerestory openings with moonlight, roof line above the
arcade. It must tile or be wide enough for a 4,200-unit stage at the 0.18
parallax factor the stage already uses, and must read as interior-enclosed
rather than open sky, so it does not duplicate the Road's horizon.

### 2. Bellwarden hurt and death poses

The player has no damage reaction. `encounter.js` shows a hit by flickering
the current pose to 40% alpha; the hero's atlas has eight frames — idle,
four walk, three attack — and nothing for being struck or dying. Five health
points, invulnerability frames and a respawn loop all exist in the
simulation with no art behind them.

Wanted: two poses on the existing Bellwarden sheet conventions — a short
recoil, and a collapse. Same cell grid, same ground anchor, same runtime
height of 144 units as the current sheet.

### 3. Iron Sexton v006 hurt cell — optional

Low priority; the runtime already compensates. The v005 `hurt` cell sits
58.8px right of the shared ground anchor, 26 units at runtime, wider than
the 24-unit hitbox half-width, so `prototype/iron-sexton.js` carries a
recorded -59px correction. A v006 with `hurt` authored on the same anchor as
the other seven cells would let that correction be deleted. Nothing is
broken without it — this only removes a special case.

## Do not generate

- **Anything for the Flooded Cistern, Ossuary Gallery, Counterweight Works
  or Bell Tower.** Each already has an accepted environment kit, and the
  Cistern also has a selected enemy motion sheet. None of those stages has a
  playable layout. Art cannot be integrated into space that does not exist,
  and a retained image is not an integrated feature.
- **Another Bell Moth, Cistern Lurker or Tollkeeper sheet.** All three are
  selected motion candidates awaiting behaviour code, not better art.
- **Polish passes on assets already in the runtime.** Generation is
  budget-sensitive; do not spend it to refine something that already works.

## What unblocks the most, and it is not art

The queue in [NEXT_MILESTONES.md](NEXT_MILESTONES.md) is almost entirely
code: merging the two renderers so a room crossing is not a page load, the
Cloister blockout, the grate and vial persistence, then Bell Moth and Iron
Sexton behaviour. Every one of those has its art already accepted and
waiting.

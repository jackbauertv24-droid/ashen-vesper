# Iron Sexton — runtime integration

The Ruined Cloister enemy is now drawn from the accepted Job 12 v005 motion
sheet instead of the Hollow Pilgrim placeholder. This is a rendering change
only: the enemy behaviour, timings and hitbox in `cloister-sim.js` are
unchanged, so the encounter plays exactly as before.

## Pose mapping

`prototype/iron-sexton.js` maps each simulation mode to one cell of the 4x2
sheet. The windup deliberately splits across two poses — brace, then raise —
so the 0.8s telegraph the simulation grants the player is legible as a
wind-up rather than a single held frame.

| mode | pose | cell |
| --- | --- | --- |
| patrol | idle | 0,0 |
| approach | stepA / stepB alternating | 1,0 / 2,0 |
| windup (timer > 0.45) | brace | 3,0 |
| windup (timer <= 0.45) | windup | 0,1 |
| strike | contact | 1,1 |
| recover | recover | 2,1 |
| hurt | hurt | 3,1 |

## Two recorded deviations

**Scale.** The submission declares both `scale 0.40` and a runtime height of
160 units, and those disagree: the standing source height is 362px, so 0.40
renders 144.8 units — the same as the 144-unit hero, and shorter than the
162-unit placeholder being replaced. The declared runtime height is the
intent, since a heavy enemy should read as taller than the player, so the
runtime uses 160/362 = 0.442 and records it rather than silently shrinking
the Sexton.

**Horizontal anchor.** The sheet declares one shared ground anchor.
Vertically it holds to within 2px across all eight cells. Horizontally it
does not. Measured torso drift from the idle pose:

| pose | drift (source px) | drift (units) | corrected |
| --- | --- | --- | --- |
| stepA, stepB, brace, windup | 0.6 – 5.3 | 0.3 – 2.3 | no |
| contact | +29.8 | +13.2 | no — reads as an authored lunge |
| recover | -23.6 | -10.4 | no — reads as an authored pull back |
| hurt | **+58.8** | **+26.0** | **yes, -59px** |

The simulation's enemy hitbox is 48 units wide. A pose that draws the body
more than 24 units from centre puts the visible Sexton outside the box the
player can actually hit, so the sprite would lie about where the enemy is.
Only `hurt` crosses that line; the lunge and recovery are inside it and are
left exactly as authored. Displacement the player should feel belongs in the
simulation, where the hitbox moves with it — not in an art offset.

`test/visual-contract.test.mjs` measures this rule directly and fails if any
pose, after its recorded correction, draws further than the half-width.

## Still outstanding for M2.1

The behaviour work is untouched: bait, miss, recovery and wall handling, and
physical shovel contact driven by the weapon sweep rather than a box around
the body. The sheet is in the game; the heavy-enemy fight is not.

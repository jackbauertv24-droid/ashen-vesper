# Handoff — open findings and ideas

Written at the point the project was put down deliberately, not abandoned.
Everything here is verified against the tree at `2293040`, not recalled. The
forward plan lives in [MAP_DESIGN](MAP_DESIGN.md); this file is the things
that plan does not cover — defects nobody has hit yet, inconsistencies that
will bite the next person, and ideas that were never committed to.

## Where it stands

All five test tiers green, CI green on main, no open pull requests. Three
playable stages, forty-three pull requests reviewed, and a shared runtime
contract that all three stages now go through.

| stage | platforms | distinct heights | size | verdict |
| --- | --- | --- | --- | --- |
| Pilgrim Road | 10 | 6 | 6400 x 720 | corridor |
| Ruined Cloister | 7 | 3 | 4200 x 720 | corridor |
| Flooded Cistern | 13 | 12 | 4600 x 1700 | a real map |

The Cistern is the proof the runtime can express a map. The other two have
not been rebuilt on it.

## If you pick this up again, do this first

**Phase 1.3, rooms within a stage.** Not because it is the most fun, but
because all six baselines are blocked on the same thing and nothing else
unblocks them. The baselines are far richer than anything shipped:

| baseline | rooms | solids | vertical span | runtime ready |
| --- | --- | --- | --- | --- |
| 01 pilgrim road | 5 | 311 | 1184 | no |
| 02 ruined cloister | 6 | 666 | 2528 | no |
| 03 flooded cistern | 5 | 62 | 1856 | no |
| 04 ossuary gallery | 3 | 74 | 960 | no |
| 05 counterweight works | 6 | 88 | 2176 | no |
| 06 bell tower | 5 | 174 | 1856 | no |

Every one of them fails `runtimeReady` for the same reason: no spawn points
and no checkpoints. The loader parses all six and places their geometry
correctly. The shipped Cistern has 13 platforms; its own baseline has 62
across 5 rooms. The gap between what the project has designed and what it
runs is the whole story of the project right now.

## Open findings

Ranked by what a player would notice, not by how interesting they are.

### 1. Two of the three stages have no sound at all

`prototype/encounter.js` has a working Web Audio tone map — swing, jump,
hit, hurt, death, gate, pickup, and now dodge. `cloister.js` and
`cistern.js` have **zero** references to `AudioContext`. Stage 1 is audible
and stages 2 and 3 are silent, which reads as broken rather than as a
stylistic choice.

This is the fifth instance of the pattern that has driven most of this
project's cleanup: **anything each stage owns a copy of has already
drifted.** Sims, sprite preparation, hero rendering and the camera were all
merged for this reason. Audio was never merged because Stage 1 was the only
stage when it was written. The fix is the same shape as the others — a
shared `prototype/audio.js` taking the event names the contract already
emits — and it is maybe an hour of work.

### 2. The Cistern's drowning system is unreachable

`WATER = { surface: 1430, drown: 1500 }`, and the basin is a solid floor at
y=1360 spanning x 0 to 3000. The player always lands on the basin before
reaching the drown plane. I walked off both sides of all 13 platforms: **no
edge drowns.** This is correct and intended — falling costs the climb back,
not a life — but it leaves live code, a `drownings` counter and a respawn
path modelling a hazard that cannot happen.

The uncomfortable part is `test/cistern.test.mjs`, which asserts the
drowning works by teleporting the player to y=1480 first. It passes, and it
guards nothing a player can experience. That is precisely the kind of test
this project decided not to write.

Decide one of two things when the water art lands: either the hazard comes
back for real, with an edge a player can actually fall off, or the counter,
the respawn path and the test all come out. Leaving it is the worst option,
because the next person will read the test and believe the hazard exists.

### 3. `cloister.js` is minified and its siblings are not

Longest line: `cloister.js` 1300 characters, `cistern.js` 102,
`encounter.js` 88. Same job, same directory. The Cloister was also the stage
that silently drifted from the shared physics — crouch speed, air control,
impact pause and the low-ceiling guard were all lost in a hand-copied
`step()`. A file nobody can comfortably read is a file that drifts, and this
one already has. Reformat it; the tests will confirm nothing moved.

### 4. Reachability is enforced on one stage only

`prototype/reachability.js` — the forward BFS that fails the build when a
ledge cannot be reached, and the reverse BFS that fails it when a pit has no
way out — is imported by `test/cistern.test.mjs` and `test/world.test.mjs`
and by nothing else. The Road and the Cloister are flat enough that nothing
is currently wrong, so this is a latent gap rather than a defect. But it is
opt-in per stage, and it guards against exactly the mistake that vertical
maps invite. It belongs in `runtime-contract.test.mjs`, running over the
`stages` array like every other contract rule, before Phase 2 makes any
stage tall.

### 5. The dodge has no art

Landed in PR43 and recorded as item 8 in [WANTED_ASSETS](WANTED_ASSETS.md).
`drawHero` renders the whole 0.22-second slide with `h.atlas.frames[4]`, a
walk frame, so the most readable defensive move in the game looks like
taking one ordinary step. Mechanically complete, visually mute.

## Ideas, not commitments

**A stage complexity contract is the highest-leverage test left to write.**
Phase 4 in the map plan, but worth pulling forward. A stage must have at
least three rooms, span more than one screen vertically, offer at least one
optional route, and place at least one encounter off the critical path. Two
of the three shipped stages fail it today, which is the point: the contract
makes "this is a corridor" a build failure instead of an opinion. It is also
the only test on the list that would have prevented the situation the
project is actually in.

**The enemies are the thinnest part of the game and nobody has said so.**
Three stages, three enemies, and all three do the same thing: patrol, notice
the player, wind up, strike, recover. The Cistern Lurker has six poses and
uses them for the same loop the four-pose Hollow Pilgrim runs. Before more
enemy art is requested, one enemy should get a second behaviour — a ranged
attack, a shield that must be broken from a particular side, something that
asks a different question. More sprites will not fix an encounter design
with one verb in it.

**Reconsider whether hitstop and i-frames are pulling the same direction.**
The dodge gives 0.22 seconds of invulnerability with a 0.18-second recovery;
hitstop freezes 0.045 seconds on a landed hit; the hurt flinch locks
movement for 0.35. These were tuned separately and never against each other.
Nothing is visibly wrong, but the combat's feel is now the sum of four
independent timing decisions and no one has sat down with all four at once.

**The Pages cache is a recurring source of confusion, not a bug.** GitHub
Pages serves ES modules with `cache-control: max-age=600` and it cannot be
overridden. A change is live but invisible for up to ten minutes. This cost
real debugging time once already. If it keeps happening, a cache-busting
query string on the module imports at deploy time is the only real fix.

## Deliberately not done

- **No feature branches.** Work goes straight to main on this repo.
- **No procedural art.** No coloured boxes, gradients or shaded fills for
  anything in the world. The guard in `runtime-contract.test.mjs` holds each
  renderer to a per-file budget of `arc`, `stroke`, `fill`, `moveTo` and
  `lineTo` — zero for the Cloister and the Cistern, two documented exceptions
  on the Road for a gate clip path — and separately rejects `fillRect` and
  gradients used as scenery. When something needs water or a backdrop it is
  requested in
  [WANTED_ASSETS](WANTED_ASSETS.md) rather than drawn in code.
- **No references to the game this is inspired by.** Baselines informed the
  shape of the Cistern's descent-fork-climb; nothing in the repo names a
  source and nothing should.
- **Rejected pull requests keep their art.** Every submitted asset is
  retained byte-for-byte under `art/contributions/` — 262 resources — even
  when the pull request was closed.

## Operational notes

- Working copy is `/config/claude-workspace/ashen-vesper`. The checkout at
  `/config/vs-workspace/ashen-vesper` belongs to another agent; do not use it.
- Test tiers: `npm test` (~1s, 113 tests) · `test:art` (~4s, 34) ·
  `validate:assets` (~5s) · `test:stage` (~20s, browser) · `test:route`
  (~26s, browser). CI runs them as two jobs.
- CI warns that `actions/checkout@v4`, `setup-node@v4` and `cache@v4` target
  the deprecated Node 20. Harmless today, forced onto Node 24 by the runner.
  Bump to v5 when convenient.

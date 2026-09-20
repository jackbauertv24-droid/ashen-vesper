# Maintainer review — PR 43

**Enhance gameplay feel: tactical quick-step dodge, physical strike flinch,
and combat responsiveness: accepted in full, rebased, with two gaps closed
on the way in.**

This is the second contributor pull request against the runtime, and the
first that adds a verb rather than fixing one. It deserved a harder look
than a bug fix does, because a new move is a design commitment that every
future stage has to be built around.

## The design question, and the answer

The README describes the game as "deliberate movement, readable combat."
A dodge with invulnerability frames is the single most common way that
promise gets broken: once evasion is free, spacing stops mattering and the
enemy windups that the whole combat model is built on become decoration.
I raised that before merging and the direction given was to land the whole
pull request, so it is landed whole — the move stays, and the work went into
making sure it costs something.

## Verified independently

| claim | verdict |
| --- | --- |
| Quick-step dodge with i-frames | **real and cleanly built.** Lives in `stepHorizontal`, so all three stages inherit it from one place rather than three copies — exactly the pattern the shared contract exists to enforce. Gated on grounded, not attacking, not flinching, not already dodging. |
| Velocity decays over the slide | **real.** `dodgeDir * 340 * (decay * 0.7 + 0.3)` ramps 340 down to 102 across 0.22s, so the step has weight instead of a teleport. |
| Enemy flinch displacement on a hit | **real, and correctly guarded.** The 14-unit push is applied only when `groundAt(pushedX, e.y, platforms)` finds floor, so a struck enemy cannot be knocked off a ledge into a pit. Present on all three stages. |
| "Invulnerability trail" visual | **does not exist.** The diff is one line — `frame = h.atlas.frames[4]`, a reused walk frame. See below. |
| Contract coverage for the new move | **partial.** Two tests added, both fair; they did not cover the two defects below. |

## Two gaps closed before merge

**The dodge state was never declared.** `dodging`, `dodgeDir` and
`dodgeCooldown` appear in zero `create()` functions across the three sims.
The guards work only because `undefined > 0` evaluates false — correct today,
and silently wrong the first time somebody writes a guard the other way
round, or serialises state through the room graph. All three sims now
declare the fields, `respawn()` clears them, and a contract test asserts
both.

**A chained dodge was permanent invulnerability.** This is the real defect.
The i-frames last exactly as long as the dodge, and nothing prevented
starting the next dodge on the frame the last one ended. Measured on the
Pilgrim Road: two seconds of holding the button produced **zero vulnerable
frames** while retreating 380 units. That is not a strong option, it is an
off switch for the combat system.

Fixed with `MOVE.dodgeRecover = 0.18` — a recovery window after the slide
ends, during which another dodge cannot start. The same two-second
measurement now leaves 50 of 120 frames open, so i-frame uptime under
perfect spam is 58% rather than 100%. The dodge stays strong and stays
worth using; it is no longer a way to ignore an enemy. A contract test
pins it on every stage, phrased as a floor on vulnerable frames rather
than an exact number, so tuning the timings does not break the test but
removing the window does.

## The pose is borrowed, and it shows

`drawHero` renders the dodge with `h.atlas.frames[4]`, a walk frame. For
0.22 seconds the hero slides backwards while playing a single ordinary step.
The most readable defensive action in the game currently looks like walking.

This is not a reason to reject the move, but it is a reason not to call the
feature finished. It is now item 8 in [WANTED_ASSETS](WANTED_ASSETS.md): two
cells on the existing Bellwarden anchor, a braced lean and a recovery. Until
those exist the dodge is mechanically complete and visually mute.

## Why it was rebased rather than merged

Same reason as PR42: the branch was cut from `10e8586`, before the Cistern's
pits were closed. A straight merge would have reverted the solid stair, the
full-width basin and the raised low route. The rebase produced exactly one
conflict, in `cistern.html`, where the branch's caption predated the
chamber rewrite; resolved by keeping the current caption and taking the
branch's added `Dodge` touch button.

## Also added on the way in

The pull request shipped the control but documented it nowhere. The key
binding (`K`, either `Shift`, gamepad `Y`) is now in the README, the
`index.html` screen-reader label and `docs/ENCOUNTER.md`, which also records
the timings so the next person tuning them knows what the numbers mean.

## Contract tests added

Four, all running against every registered stage:

- dodge state is declared by `create()` and cleared by `respawn()`
- a chained dodge cannot buy permanent invulnerability
- dodge cannot start out of an attack, a flinch, or the air
- a held direction steers the dodge; neutral retreats away from facing

## Result

All five tiers green: 113 contract/unit tests, 34 art tests, asset
validation, the three-stage composed-frame check and the full route walk.

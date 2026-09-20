# Next milestones and bounded contributor tasks

This queue follows the accepted assets and verified runtime. **Do code/blockout dependencies before further image generation.** Each task is one PR; use existing preservation, preview and test rules, and the tiers in [the build standard](BUILD_STANDARD.md).

**Image generation: see [wanted assets](WANTED_ASSETS.md).**
The retained library holds 74 candidates and the game loads 12. Eighty percent of exported art is a
single static image, and the game needs motion: finish a subject before
starting another. Everything else on this queue is code whose art is
already accepted.

**Direction: no new stage until the engine is one engine.** Art supply is not the bottleneck — the retained library already holds selected assets for five stages, while one route is playable end to end. Runtime capability is the bottleneck. Every stage built on its own copy of the loop multiplies the drift, so a stage ships on `prototype/physics.js` and registers itself in `test/runtime-contract.test.mjs`, or it does not ship.

## Definition of a playable stage demonstration

Every stage milestone must ship with a discoverable link from the main demo, a scrolling route longer than one viewport, collision and camera bounds, at least one environmental interaction, one enemy or hazard interaction, a checkpoint or explicit end marker, restart behavior, and keyboard/touch/gamepad verification. Place retained assets at measured runtime scale and label placeholders honestly. A stage is not complete because its map or art preview exists.

## Current inventory and missing work

| Area | Available now | Still missing |
| --- | --- | --- |
| Ruined Cloister | Playable four-beat scrolling integration demo on the shared runtime contract; arch, pier, cap, lever, grate and vial | Pilgrim Road transition, persistent room state, return path, authored enemy motion, final room-graph adaptation, settings UI, sound and checkpoint object |
| Flooded Cistern | **Playable four-beat route**; damp kit, unlit pier, lantern, Lurker all integrated | Baseline six-room adaptation, backdrop, Lurker hurt and death poses |
| Ossuary Gallery | Selected niche panel | Playable layout, lettering cleanup, doors/hazards and encounter placement |
| Counterweight Works | Selected lift deck | Lift runner, shaft layout, chains/counterweights, crush/reversal rules and transition |
| Bell Tower | Selected landing and bell | Vertical camera, playable layout, hanging support, bell interaction/audio and boss |

The standalone [Ruined Cloister demo](../cloister.html) is the first asset-integration stage. It proves scrolling, platform collision, a collectible, a lever-controlled grate and a combat target. It is deliberately separate until M1.1 connects stage state and transitions safely.

The [Stage02 runtime regression review](CLOISTER_RUNTIME_REVIEW.md) is the parity checklist for every new stage. Sound and checkpoint parity are still open even after the animation, input, enemy, damage and tiling corrections.

## Standing now

| Area | State |
| --- | --- |
| Shared runtime contract | Both stages step through `prototype/physics.js`; `test/runtime-contract.test.mjs` holds them to it |
| Shared sprite preparation | One copy in `prototype/render.js` |
| Connected run | `prototype/world.js` joins both rooms — threshold, safe spawn, carried health, per-room persistence |
| Rendering | **Still two pages.** A crossing is a page load |
| Ruined Cloister enemy | Drawn from the accepted Iron Sexton sheet; behaviour is still the placeholder melee loop |
| CI | Every tier runs on each push and pull request |

## Milestone 1 — Ruined Cloister becomes playable

1. **M1.1 Connected-room runtime (code, P0 — run connected, rendering outstanding):** both stages step through `prototype/physics.js`, and `prototype/world.js` now joins them into one run: threshold interaction, safe spawn, carried health and per-room persistence, verified end to end in a browser. What remains is merging the two renderers so a crossing is not a page load, plus an explicit camera reset once it is not. See [the transition brief](ROOM_TRANSITION_BRIEF.md). Acceptance: Road completion → Cloister → return; checkpoint/death/restart; keyboard/touch/gamepad; no duplicate pickups.
2. **M1.2 Cloister blockout (layout/code, P0, first playable version shipped):** adapt the current four-beat integration route to the Stage02 baseline JSON without changing source v001 silently. Record deviations. Verify main route, optional return, narrow viewport and both camera modes.
3. **M1.3 Grate/lever interaction (code, P0):** reuse retained lever and integrated grate. Proximity E/B action, debounce, visible connection, grate collision follows its position, state persists across death. Provide closed/open/mid-travel tests; no invisible blocker.
4. **M1.4 Healing vial (code, P1):** reuse selected vial. Carry at most one; use action restores2 up to5; full-health use does not waste it; persistence/restart and touch/gamepad binding visible.
5. **M1.5 Bell Moth motion and AI (art then code, P1):** reuse selected reference; produce the documented motion sheet, then telegraphed swoop/two-hit behavior. No new design reference.
6. **M1.6 Seamless Cloister platform kit (center strip integrated in both stages; layout follow-up):** PR33 center strip passed three-copy color/grayscale/difference review and is integrated at its authored repeat scale. Pilgrim Road was still repeating the v001 crop and tiling visible warm/cool stripes until this was ported; the tiling contract in `test/runtime-contract.test.mjs` now fails any runtime cap with a seam jump or lighting drift. Separate end caps are retained. Snap final platform widths to whole repeat intervals before attaching those ends; do not stretch or crop a join to force them.

## Milestone 2 — Heavy combat and moving platforms

7. **M2.1 Iron Sexton motion/AI (art accepted and now rendered in the Cloister; behaviour outstanding):** see [the integration note](IRON_SEXTON_INTEGRATION.md) for the two recorded deviations. the v005 sheet is selected — hurt-cell shovel restored, zero detached fragments, distinct walk cadence (see [the PR40 review](PR_40_REVIEW.md)). Eight poses and physical shovel contact. Implement bait/miss/recovery and wall behavior with current movement.
8. **M2.2 Lift runner (code, blockout first):** use rectangles or selected lift deck. Carry grounded player, permit jump-off, solid sides/underside, safe reversal, no silent crush, camera/checkpoint tests. Art is not evidence of behavior.
9. **M2.3 Lift assembly (art cleanup after M2.2):** separate deck, chain and counterweight sockets; chain three-copy seam. Reuse selected deck. Generate only missing pieces proven visible by the runner.

## Milestone 3 — Flooded Cistern

10. **M3.1 Cistern blockout/transition:** adapt Stage03 baseline; dry main route, explicit water hazard bounds, valve links, lift endpoints and checkpoint. No swimming.
11. **M3.2 Cistern kit cleanup:** central repeat strip/end caps from damp cap; unlit vault pier derivative; lantern as separate prop. Reuse originals, record dimensions/sockets and avoid repeated identical lights.
12. **M3.3 Lurker motion/AI:** use selected reference; six poses, visible emerge warning, low blade/core contact, jump avoidance, safe respawn placement.

## Milestone 4 — Vertical stages

13. **M4.1 Vertical camera and safe landing tests:** general camera bounds, look-ahead, top/bottom clamps, respawn and visibility-before-jump. Prove with blockout landings.
14. **M4.2 Ossuary:** Stage04 blockout plus versioned niche panel without pseudo-lettering. Add Sexton only after M2.1.
15. **M4.3 Counterweight Works:** Stage05 blockout using M2 lift runner and shared-space ownership.
16. **M4.4 Bell Tower:** Stage06 blockout, selected landing and bell. Implement hanging support separately; sound/interaction after layout.
17. **M4.5 Tollkeeper:** corrected two-handed design reference, motion, then boss AI/arena. Do not animate current one-handed candidate.

## Nice-to-have after core milestones

- Platform/cap left and right end variants driven by actual visible map edges.
- Separate lantern, moss, water reflections and restrained foreground overlays after readability tests.
- Audio for mechanisms, water ambience and bell only after matching interactions exist.
- World-map/menu visualization after stage portals and checkpoint semantics stabilize.

## Maintainer acceptance rule

A retained image is not an integrated feature, and a test is only worth its cost if it prevents a defect someone would see. Every PR must state one status: planning-only, retained candidate, selected prototype, usable export, or runtime integration. Previews cannot claim collision, movement, damage or persistence without corresponding code and actual-input tests. Unknown generation cost stays unknown. Preserve every original/reject and create derivatives in v002+.

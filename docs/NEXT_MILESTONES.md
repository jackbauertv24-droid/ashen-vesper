# Next milestones and bounded contributor tasks

This queue follows the accepted assets and verified runtime. **Do code/blockout dependencies before further image generation.** Each task is one PR; use existing preservation, preview and test rules.

## Milestone 1 — Ruined Cloister becomes playable

1. **M1.1 Connected-room runtime (code, P0):** implement the existing room-transition brief, persistent room state, safe spawn and camera reset using rectangles/current art. Acceptance: Road completion → Cloister blockout → return; checkpoint/death/restart; keyboard/touch/gamepad; no duplicate pickups.
2. **M1.2 Cloister blockout (layout/code, P0):** adapt Stage02 baseline JSON into four encounter beats without changing source v001 silently. Record deviations. Verify main route, optional return, narrow viewport and both camera modes.
3. **M1.3 Grate/lever interaction (code, P0):** reuse retained lever and integrated grate. Proximity E/B action, debounce, visible connection, grate collision follows its position, state persists across death. Provide closed/open/mid-travel tests; no invisible blocker.
4. **M1.4 Healing vial (code, P1):** reuse selected vial. Carry at most one; use action restores2 up to5; full-health use does not waste it; persistence/restart and touch/gamepad binding visible.
5. **M1.5 Bell Moth motion and AI (art then code, P1):** reuse selected reference; produce the documented motion sheet, then telegraphed swoop/two-hit behavior. No new design reference.
6. **M1.6 Cloister kit corrections (art cleanup, P1):** versioned structural metadata for arch/pier/cap; measure compatible sockets and ground boundaries. Add platform end caps only if blockout exposes them. No replacement concept.

## Milestone 2 — Heavy combat and moving platforms

7. **M2.1 Iron Sexton motion/AI (art then code):** use selected reference; eight poses and physical shovel contact. Implement bait/miss/recovery and wall behavior with current movement.
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

A retained image is not an integrated feature. Every PR must state one status: planning-only, retained candidate, selected prototype, usable export, or runtime integration. Previews cannot claim collision, movement, damage or persistence without corresponding code and actual-input tests. Unknown generation cost stays unknown. Preserve every original/reject and create derivatives in v002+.

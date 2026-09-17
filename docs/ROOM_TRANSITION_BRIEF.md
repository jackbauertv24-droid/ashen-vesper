# Next code contribution — connected room transition

Priority P1, dependency for calling the Ruined Cloister a second playable map. Reuse existing art where possible; do not generate a bespoke full-screen scene just to implement loading.

## Copyable implementation prompt

> Extend Ashen Vesper's browser encounter from one connected Pilgrim Road to two explicit rooms, Pilgrim Road and the planned Ruined Cloister. Start by preserving all current movement, aerial attack, crouch, solid collision, resource and gate rules. Represent room-specific platforms, props, enemy spawns, camera bounds and entrance/checkpoint data separately from persistent run state. After the existing sanctuary, expose a clearly labeled exit interaction using the current keyboard/touch/gamepad interact action. Load the Cloister blockout and spawn the player on a safe floor without carrying a pending attack or stale velocity into a wall. Reset camera to the destination safely, then resume ordinary look-ahead. Preserve player health/resources and per-room broken props, defeated enemies and opened mechanisms during a run. Death returns to the latest valid checkpoint; restart resets both rooms. Scope this PR to room data, transition and persistence; use current enemies/props or labeled blockout art until the new content is accepted. Document implementation and test it through actual controls.

## Minimum acceptance

- Existing Pilgrim Road route still completes; its gate still requires ember and guardian defeat.
- Exit is visible and uses existing interact bindings. Holding a touch/gamepad button must not create an infinite transition loop.
- Destination spawn is on a safe floor, camera stays in that room's bounds, and no pending attack/drop/contact damages the player while loading.
- Revisit the Road: collected pickups, defeated enemies and opened gate remain correct. A resource cannot be collected twice through a room reload.
- Activate the Cloister checkpoint, die, and return to that exact safe room/spawn. Restart clears both rooms.
- Test both camera presets, air-control option, keyboard, narrow touch layout and standard gamepad. Add focused transition/persistence tests rather than rewriting unrelated combat.
- Catalog/preservation checks pass; originals remain untouched. Clearly label blockout versus accepted visual integration.

This is an implementation brief for contributors, not a claim the transition exists. Proposed new item/enemy/lever behaviors are separate bounded PRs linked in docs/FUTURE_CONTENT.md.

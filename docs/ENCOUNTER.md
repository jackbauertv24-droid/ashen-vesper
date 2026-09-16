# The Pilgrim Road — playable encounter v0.3

The main demo is now a connected 6,400-unit road viewed through a 1,280 × 720 camera: five screens of movement, three gaps, two optional elevated routes, four braziers and three Hollow Pilgrim guards. The original two-scene art study remains at `study.html`.

## Playthrough

1. Move right and strike the first hanging brazier. Its ember falls onto the platform; walk into it.
2. Jump near the edge of each broken section. Optional stairs lead to additional embers.
3. Watch each pilgrim's gold warning, avoid its staff, and attack during recovery. Three player strikes defeat it.
4. Defeat the final guardian and offer one ember at the gate with E.
5. Walk to the sanctuary to restore health, set the checkpoint and complete the encounter.

A direct practiced run is short; exploring optional paths, learning combat and comparing settings should take longer. The original 3–5-minute target is a playtest hypothesis, not a measured completion-time claim.

## Controls and comparisons

- Keyboard: A/D or arrows move, Space/W/up jump, J/X attack, E interact, R restart.
- Standard gamepad: left stick or D-pad move, A jump, X attack, B interact. Enter the game first with its button. Browser standard mapping is assumed.
- Touch: simultaneous movement and action buttons.
- Camera: smooth or tighter exponential follow, horizontal dead zone, gradual facing look-ahead, fixed vertical position. Background, architecture silhouettes and foreground marks move at different rates.
- Optional limited air control; default commits horizontal movement at takeoff.
- Optional 45ms hit-stop; disabled initially when reduced motion is requested.
- Sound defaults off. Opting in enables short synthesized cues; there are no externally generated audio assets.

## Rules

The player has five health, 1.1 seconds of post-hit invulnerability and a 0.42-second grounded attack. A swing can hit each enemy only once. Guards patrol, approach, telegraph for 0.8 seconds, strike for 0.18 seconds and recover for 0.9 seconds. Hurt briefly interrupts a guard. Patrol/chase bounds keep them on safe ground. They deal damage through attacks rather than contact.

Braziers break once; each drops one ember. Collection, broken braziers, defeated enemies and gate state persist across death in the current run. Restart resets everything. Progress is not saved across page reloads. The gate requires both one ember and defeat of its nearby guardian. Missing requirements are shown in the notice bar. The final sanctuary restores health and becomes the respawn location. Completing the encounter disables further damage; exploration remains available.

## Art and limitations

All source files remain unchanged. Runtime canvas compositing removes only border-connected dark background pixels from the enemy concept, braziers and airborne study; this is a provisional mask and may lose connected dark details. Native alpha exports remain preferable. The existing magenta-key hero sheet remains the basis for ground movement and attacks. Dedicated airborne poses use separately defined runtime crop/anchor values, without modifying the submitted draft JSON.

The enemy uses the retained single-pose concept with small transformations, an anticipation indicator and a code-drawn staff strike. It does not claim a finished multi-frame enemy animation. The submitted enemy motion sheet remains retained pending crop/facing cleanup. The gate is a flattened portal with a separate glowing gameplay seal; spending the ember removes that seal, not an independently animated portcullis. No new image generations were needed.

## Validation

`npm test` covers camera bounds, collectible uniqueness, enemy damage windows, invulnerability, gate requirements, checkpoint/death state, air control, all main gaps and a full simulation playthrough. Original pilot tests remain.

`npm run test:encounter` completes the route using keyboard events and accelerated browser time, then checks reset, configuration, sound toggle, simulated standard-gamepad movement and touch release/layout. It does not mutate gameplay state. Screenshots cover entrance, middle, completion and mobile. A physical controller and subjective combat/camera feel still need human playtesting.

`npm run test:browser` verifies the preserved art study and gallery. `npm run validate:assets` verifies original image checksums and all 25 locked submission resources.

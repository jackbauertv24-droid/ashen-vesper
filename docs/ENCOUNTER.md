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

- Keyboard: A/D or arrows move, Space/W/up jump, J/X attack on the ground or in the air, S/down crouch and crawl, E interact, R restart.
- Standard gamepad: left stick or D-pad move, A jump, X attack, B interact, down crouch. Enter the game first with its button. Browser standard mapping is assumed.
- Touch: simultaneous movement and action buttons.
- Camera: smooth or tighter exponential follow, horizontal dead zone, gradual facing look-ahead, fixed vertical position. Background, architecture silhouettes and foreground marks move at different rates.
- Optional limited air control; default commits horizontal movement at takeoff.
- Optional 45ms hit-stop; disabled initially when reduced motion is requested.
- Sound defaults off. Opting in enables short synthesized cues; there are no externally generated audio assets.

## Rules

The player has five health, 1.1 seconds of post-hit invulnerability and a 0.42-second attack usable on the ground or in the air. Aerial attacks preserve horizontal travel and gravity. Crouching reduces body height from 120 to 84 units, permits a slow 85-unit/second crawl and lowers the attack. The two low passages provide 90 units of clearance. Releasing crouch below a ceiling keeps the player crouched until there is standing room. Masonry blocks are solid on all faces; the original art study retains its older one-way platform behavior.

A swing can hit each enemy only once. Guards patrol, approach within 80 units, telegraph for 0.8 seconds, strike for 0.28 seconds and recover for 0.9 seconds. The retained motion sheet supplies overhead anticipation and downward contact poses. Only the final 0.16 seconds of the strike deal damage, along the visible contact staff; raising the staff and recovering do not hurt the player. Crouching does not avoid a downward strike. Hurt briefly interrupts a guard. The final guardian must be defeated even if lured away from the gate.

Braziers break once; each drops one ember. Collection, broken braziers, defeated enemies and gate state persist across death in the current run. Restart resets everything. Progress is not saved across page reloads. The gate requires both one ember and defeat of its nearby guardian. Missing requirements are shown in the notice bar. The final sanctuary restores health and becomes the respawn location. Completing the encounter disables further damage; exploration remains available.

## Art and limitations

All source files remain unchanged. Runtime canvas compositing removes border-connected dark backgrounds from the enemy motion sheet and airborne study. New crouch artwork uses a runtime checkerboard mask with protected steel-blade regions. Masks can lose edge detail; native alpha exports remain preferable. The existing magenta-key hero sheet remains the basis for standing movement and attacks. Runtime crop/anchor values do not modify submitted draft metadata.

The enemy now uses whole-body shuffle, overhead windup, contact and recovery poses from the retained motion sheet, with the weapon drawn in the actor's hands. This is still a sparse animation: intermediate swing and shuffle frames remain contributor work. Six newly drawn crouch poses replace vertical sprite compression. One authorized built-in generation attempt was used; its original, exact prompt and limitations are preserved in `art/contributions/01-bellwarden-crouch/v001/`. The output failed the production alpha/grid contract and is integrated through reviewed runtime crops, not certified as a production export. Aerial attacks still reuse ground attack poses. [Contributor briefs](art-jobs/README.md) define further work. The gate seal opens; the painted portcullis is not independently animated.

Run `node tools/pose-check.mjs` for a contact sheet of the actual runtime poses in `tmp/pose-review.png`. The [reviewed pose sheet](reviews/crouch-melee-v002.png) is retained here. Review anatomy, complete weapons, stable feet and contact timing alongside the interactive demo; gameplay tests alone cannot establish visual quality.

See [crouch and alpha calibration](CROUCH_ALPHA_REVIEW.md) for measurements and [updated runtime evidence](reviews/crouch-alpha-v003.png). The one brazier edit attempt is preserved with its prompt in art/contributions/04-brazier-alpha/v001/.

## Validation

`npm test` covers camera bounds, collectible uniqueness, enemy damage windows, invulnerability, gate requirements, checkpoint/death state, air control, all main gaps and a full simulation playthrough. Original pilot tests remain.

`npm run test:encounter` completes the route using keyboard events and accelerated browser time, then checks reset, configuration, sound toggle, simulated standard-gamepad movement and touch release/layout. It does not mutate gameplay state. Screenshots cover entrance, middle, completion and mobile. A physical controller and subjective combat/camera feel still need human playtesting.

`npm run test:browser` verifies the preserved art study and gallery. `npm run validate:assets` verifies original image checksums and all 25 locked submission resources.

The native-alpha ember is integrated following [PR 12 review](PR_12_REVIEW.md). [Runtime prop evidence](reviews/ember-runtime-v002.png) shows the actual export against the scene and white/black/blue.

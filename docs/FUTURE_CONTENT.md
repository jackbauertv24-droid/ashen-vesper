# Future content and contributor queue

This is the forward plan for Ashen Vesper. **Future features below are planned, not implemented.** Selected prototype assets are marked explicitly; asset selection does not complete a gameplay feature. The playable Pilgrim Road remains the baseline. Contributions should help build a coherent next encounter, rather than unrelated concept images.

## Build order

1. Finish continuity: clean hero crouch/air attacks, add enemy swing intermediates, and separate the existing gate. Native-alpha brazier and ember are integrated; further polish is follow-up work.
2. Build the **Ruined Cloister** as the next playable map: a real transition from the sanctuary, a lever-operated grate, one Bell Moth encounter and one limited healing pickup.
3. Add an Iron Sexton and a lift to expand melee spacing and environmental timing.
4. Build the **Flooded Cistern** using those established interactions, then add its ambush enemy.
5. Build the **Bell Tower** only after vertical camera and moving-platform behavior work. End it with the Tollkeeper boss.

Art contributors can prepare later candidates now. Runtime integration follows dependencies. A retained candidate is useful reference; it is not a completed game feature.

## Prioritized jobs

Priority P0 means finish the current slice; P1 means next expansion; P2 means later encounter; P3 means optional polish.

| Priority | ID / brief | Deliverable | Intended experience | Dependency / status |
| --- | --- | --- | --- | --- |
| P0 | [01 Crouch continuity](art-jobs/01-bellwarden-crouch.md) | Clean consistent low poses | No scale or costume jump on crouch | Calibrated prototype integrated; export cleanup remains |
| P0 | [02 Aerial attack](art-jobs/02-bellwarden-air-attack.md) | Corrected six-frame sequence | Readable hits during ascent/descent | PR 11 candidate needs scale/sword/costume corrections |
| P0 | [03 Pilgrim melee](art-jobs/03-hollow-pilgrim-melee.md) | Intermediate swing/recoil/death | Visible weight and recovery | Sparse poses integrated; new intermediate study retained |
| P0 | [06 Gate layers](art-jobs/06-gate-layers.md) | Frame, portcullis and sill | See a gate physically open | Existing gate logic; layers not integrated |
| P1 | [08 Ruined Cloister](art-jobs/08-ruined-cloister.md) | Modular environment and map layout | Longer traversal with combat and a mechanism | Real room transition needs implementation |
| P1 | [11 Bell Moth](art-jobs/11-bell-moth.md) | Flying enemy reference and motion | Practice aerial attacks against a telegraphed swoop | PR 14 design selected; motion and behavior needed |
| P1 | [14 Useful pickups](art-jobs/14-pickups-and-relics.md) | Healing vial first | Choose when to spend healing | PR 13 vial selected; inventory/use action and binding needed |
| P1 | [15 Mechanisms](art-jobs/15-mechanisms.md) | Lever and grate first | Action causes a visible world change | PR 15 lever retained; missing attempt preservation, interaction and grate needed |
| P1 | [Room transition](ROOM_TRANSITION_BRIEF.md) | Code and reused doorway layers | Sanctuary leads into a second area | Contributor implementation brief; no new image required |
| P2 | [12 Iron Sexton](art-jobs/12-iron-sexton.md) | Heavy melee enemy | Bait a committed attack, punish recovery | PR 16 reference selected; motion and combat tuning needed |
| P2 | [09 Flooded Cistern](art-jobs/09-flooded-cistern.md) | Stone/water layers and layout | Timing around valves and moving routes | Lever/lift behavior should be proven first |
| P2 | [13 Cistern Lurker](art-jobs/13-cistern-lurker.md) | Low ambush enemy | Read floor-level tells and crouched contact | PR 17 reference selected; motion and low blade/core alignment needed |
| P2 | [15 Counterweight lift](art-jobs/15-mechanisms.md) | Lift, chains and weight | Riding and landing on a moving surface | Platform carrying and crush safeguards needed |
| P2 | [14 Seal fragment](art-jobs/14-pickups-and-relics.md) | Route key | Optional detour opens a shortcut | Key inventory and gate requirements needed |
| P2 | [10 Bell Tower](art-jobs/10-bell-tower.md) | Vertical architecture kit and layout | Climbing, looking ahead and checkpointing | Vertical camera/world expansion; defer runtime |
| P2 | [16 Tollkeeper](art-jobs/16-tollkeeper.md) | Boss design first, then bounded sequences | Combine spacing, aerial contact and recovery | Boss arena/camera/states needed |
| P3 | [07 Break/contact effects](art-jobs/07-break-impact-effects.md) | Local debris and sparks | Actions have material feedback | Keep collectibles and effects visually distinct |
| P3 | [14 Coin token / HUD](art-jobs/14-pickups-and-relics.md) | Optional economy pickup and icons | Clear reward and readable inventory | Economy not selected; reference art only |
| P3 | Weather / cloth / sound | [Small optional briefs below](#optional-briefs) | A more inhabited world | Never obscure gameplay or distract from priorities |

## Next playable map: minimum slice

The Cloister should be four horizontal screens (5120 × 720 world; 1280 × 720 reference viewport). Begin at a safe entrance after the Pilgrim Road sanctuary. Keep the main floor around y=600, main gaps no wider than 90 units, reachable steps no higher than 100 units, and low passages at least 90 units clear. These values reuse current movement; do not silently change jump physics to fit art.

Suggested route:

1. Entrance: quiet space, healing vial and a clear sightline to a closed grate.
2. Broken arcade: short gaps plus optional upper ledges; introduce one Bell Moth with room to observe its warning.
3. Machinery court: lever visibly opens the grate; nearby pilgrim makes timing the interaction matter.
4. Return loop: grate creates a shortcut to the exit checkpoint. Keep one main objective and a readable destination.

The map PR should include a blockout/layout file with platform and spawn coordinates, optional route, checkpoint, mechanism links and annotated screenshots. A single panoramic illustration cannot satisfy the map job.

Suggested tuning targets, pending playtest: Bell Moth takes two sword hits and deals one health damage; healing vial restores two health up to the existing five-health cap, carries at most one and is consumed once; lever stays activated across death in a run. Label these as proposals until implemented. No new control should be hidden: keyboard, touch and gamepad bindings need a visible decision and evidence before integration.

## How to claim and submit work

Pick one row and one deliverable within it. PR title: Job NN — deliverable — candidate/integration. State what is already implemented and what still needs code. Use art/contributions/JOB-ID/v001/ with untouched source, versioned exports, prompt, notes, metadata and preview. Preserve rejected attempts. Register all images in the catalog and all source/variant resources in the preservation lock. No credentials or personal machine paths.

For a multi-stage enemy or boss, start with a design reference; only produce motion once that reference is recorded as the selected prototype direction. Do not spend attempts making twelve inconsistent characters. An existing selected reference can be reused without asking for another design decision.

Apply the [shared submission and visual checks](art-jobs/README.md). The current character validator supports jobs 01–03 only; new briefs need their declared geometry checked explicitly. General resource/gameplay/browser checks still apply. Standalone animation playback does not prove engine integration. Document actual model/attempt count and costs if exposed; unknown cost is not zero.

## Optional briefs

These are nice to have. Each is a separate PR with preserved originals, declared dimensions/hash, source/runtime preview and honest status.

| Item | Copyable prompt / creation brief | Contract and acceptance |
| --- | --- | --- |
| Fog ribbons | Paint three sparse cool-indigo horizontal mist ribbons for an original moonlit Gothic abbey, with genuine transparent exterior, no rectangular wash, no stone/sky/characters/text; keep the center gameplay band clear. | Three 1024 × 256 RGBA strips, runtime 512 × 128; alpha zero on borders. Background layer only. Show grayscale combat and platform edges with/without mist. |
| Distant rooks | Six side-profile wingbeats of one small dark rook, HD painted silhouette, constant body scale, actual alpha, no sky or labels. | 1536 × 1024, 3 × 2 512 cells, pivot (256,256), runtime cell 32 × 32. Background flock only; cannot resemble a hostile Bell Moth. |
| Cloth pennant | Six frames of the same torn midnight-blue abbey pennant moving gently in a breeze, fixed upper attachment, consistent weave and subdued brass emblem, transparent background, no pole or text. | Same 3 × 2 grid, attachment (256,64), runtime cell 48 × 48. No edge clipping or origin jitter; attach to a retained pillar. |
| Material footsteps | Create original short dry boot steps on worn limestone, damp stone steps and light iron-grate steps; restrained room ambience, no music or voices. | WAV 48kHz mono, at least three variants/material, peaks below clipping; metadata volume/duration/license/source method. Test muted default, no stacking bursts, consistency with player speed. |
| Readable map markers | Design restrained matching vector/code-native checkpoint, locked gate, lever and room-exit symbols in limestone/amber/indigo, no embedded words or elaborate illustration. | SVG icons 32 × 32 plus 16px preview; accessible names supplied in UI, clear grayscale/state differences. Image generation is unnecessary for these simple symbols. |

Do not introduce weather collision, new enemies or item rewards as an incidental part of a decoration PR. Each gameplay behavior gets its own reviewable scope.

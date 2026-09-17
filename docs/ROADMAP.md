# Production roadmap

## Current contributor plan

Start with the [prioritized future-content queue](FUTURE_CONTENT.md) and [art-job catalog](art-jobs/README.md). They specify upcoming maps, enemies, useful items, mechanisms, a boss and optional polish, with prompts and acceptance criteria. Future content is planned until its runtime evidence passes.

Delivered prototype: five-screen Pilgrim Road, solid masonry, jump/aerial attack/crouch, three pilgrim guards, breakable braziers, ember collection, gate/checkpoint, keyboard/touch/gamepad and horizontal camera presets. Native-alpha brazier and PR 12 ember are integrated. Crouch scale is calibrated; character masks and motion continuity remain prototype quality. PR 11 aerial attack and the new enemy intermediate sheet remain candidates.

Next milestone: **Ruined Cloister**, four horizontal screens connected to the sanctuary, one Bell Moth, a limited healing vial and a lever-operated grate. Complete room transition and interaction state before calling this a second playable map. Exit evidence: traverse both maps, use the lever, evade/hit the moth, collect/use healing, die/return safely and complete the second checkpoint on keyboard, touch and gamepad.

Following milestones: Iron Sexton and lift; Flooded Cistern and its low lurker; Bell Tower and Tollkeeper after vertical camera/moving-platform support. Candidate art can be prepared ahead of runtime work. Retain established protagonist scale and material rendering.

## Original milestone checklist

The checklist below records earlier production stages; partial prototype delivery does not certify finished animation, final art approval or a complete game. Use the current contributor queue above for task priority.

## M0 — Art direction

- [x] Review the first abbey-gate concept.
- [ ] Confirm palette, material rendering, and side-on camera.
- [ ] Choose a protagonist silhouette and signature weapon.
- [ ] Approve one enemy design (candidate submitted: [The Hollow Pilgrim](PROPOSALS_GOTHIC_ASSETS.md#asset-4-the-hollow-pilgrim-enemy-concept-hollow-pilgrim-concept-v001)).

Exit criterion: one coherent scene reference and approved character silhouettes.

## M1 — Entrance environment kit

- [ ] Separate sky and distant architecture (skyline submitted: [skyline-distant-v001](PROPOSALS_AIRBORNE_AND_PARALLAX.md#asset-2-distant-abbey-skyline-parallax-layer-skyline-distant-v001)).
- [ ] Create modular ground, walls, pillars, and gate pieces (edge module: [masonry-endcap-v001](PROPOSALS_GOTHIC_ASSETS.md#asset-3-abbey-masonry-end-cap-module-masonry-endcap-v001); vertical arch: [buttress-pillar-v001](PROPOSALS_AIRBORNE_AND_PARALLAX.md#asset-4-abbey-buttress-pillar--arch-segment-buttress-pillar-v001)).
- [ ] Add a small foreground prop set (destructible bell-brazier & consecrated ember submitted: [PROPOSALS_GOTHIC_ASSETS.md](PROPOSALS_GOTHIC_ASSETS.md)).
- [ ] Validate seams, parallax, and ground readability.

Exit criterion: assemble an entrance scene from separate assets in-engine.

## M2 — Character production pilot

- [ ] Select animation method: rigged 2D, rendered 3D, or cleaned frame sequences.
- [ ] Produce idle, walk, jump, and one attack (airborne ascent/apex/descent study submitted: [bellwarden-airborne-v001](PROPOSALS_AIRBORNE_AND_PARALLAX.md#asset-1-bellwarden-airborne-motion-study-bellwarden-airborne-v001)).
- [ ] Produce one enemy idle/move/hit sequence (4-pose study submitted: [hollow-pilgrim-motion-v001](PROPOSALS_AIRBORNE_AND_PARALLAX.md#asset-3-hollow-pilgrim-motion-pilot-sheet-hollow-pilgrim-motion-v001)).
- [ ] Validate foot pivots, action timing, and silhouettes.

Exit criterion: consistent motion at normal gameplay scale.

## M3 — Playable slice

- [x] Implement movement and collision (browser pilot).
- [ ] Integrate one enemy, attack, pickup, and room transition.
- [ ] Test input response, visual readability, and scene performance.
- [ ] Record a short in-engine demonstration.

Exit criterion: a small enjoyable encounter with no placeholder critical art.

## M4 — Expand

Prepare the next environment and cast using the future-content briefs. Integrate expansion after the relevant M3 interaction and visual dependencies work. Reuse materials and character rules across rooms.

## Open decisions

- Final title and story.
- Protagonist and weapon design.
- Engine and deployment targets.
- Animation pipeline.
- Distribution and asset licensing.

Track concrete tasks in GitHub issues. An accepted concept does not automatically close production or integration tasks.

## Pilot delivered

The browser courtyard integrates a Bellwarden eight-pose animation study, repeated masonry, a gap jump, a raised one-way ledge, and a practice ward. See [pilot notes](PILOT.md). Character approval, animation cleanup, dedicated jump art, separate scenery layers, and the full encounter remain open.

## v0.3 encounter milestone

Implemented a five-screen road, three guarded encounters, breakable braziers and collectible embers, a gate interaction and a final checkpoint. Camera presets, optional air control, synthesized cues and keyboard/touch/standard-gamepad controls are available. See [ENCOUNTER.md](ENCOUNTER.md). M3 remains a prototype: actor animation continuity, some alpha exports and a true room transition are unfinished; opening the gate continues within the same connected map. Native-alpha brazier and ember are now integrated.

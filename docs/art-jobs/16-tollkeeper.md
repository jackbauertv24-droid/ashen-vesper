# Job 16 — Tollkeeper boss, design first

Priority P2, after Bell Tower traversal. A boss combines the slice's established spacing, aerial contact and environmental timing; it should not introduce three unproven combat systems simultaneously.

## Design prompt

> Design one original Tollkeeper boss for Ashen Vesper: tall gaunt abbey bell-keeper beneath layered ash-indigo vestments, a cracked bronze bell-shaped shoulder harness, exposed weathered iron joints and a heavy two-handed bronze clapper staff. Solemn haunted Gothic silhouette, restrained amber chest core, no skull pile or copied franchise costume. Strict right-facing orthographic side profile, HD painted non-pixel materials matching the supplied pilgrim and bronze props. Full body/weapon inside 1024 × 1024 with 16px clear padding, real alpha, no arena, shadow plane, labels, HUD, checkerboard or energy beam.

## First motion prompt after design selection

> Keep the selected Tollkeeper anatomy, harness, weapon, core and body scale identical. Six coherent stages of ONE physical clapper slam: ready; brace; overhead warning; descending swing; floor contact; vulnerable recovery. Both hands maintain believable grip, feet anchored, torso transfers weight, complete weapon within each cell. 2304 × 1536 true-alpha sheet, 3 × 2 cells of 768, ground pivot (320,704), 16px clear cell borders. HD painted side-on, no backdrop, floor shadow, glow streak or text. Effects are separate assets.

## Contract and dependency

Design reference first. Boss nominal runtime height 220 units, not scaled to fill arbitrary frames. Motion reference body height 600 source pixels, uniform scale 220/600; record each frame's body bounds, grip/tip and duration. The 2304 × 1536 export may be assembled from generator output; original remains intact. No full boss animation set is required by a design PR.

First behavior proposal: HP 12, one damage per slam contact, visible 1.2s warning, committed 0.35s slam, 1.3s punishable recovery. Tune only after a playable arena exists. Later second phase may add a bounded floor pulse with explicit tells and collision; no projectile art should imply that behavior is already implemented.

## Acceptance

View design beside real-scale hero and pilgrim, in grayscale and white/black/blue/abbey composites. Weapons and harness must not crop, shift or change material between poses. One 1280-wide arena must provide a clear escape route and safe checkpoint. Integration tests warning/miss/contact, one hit per sword swing, recovery vulnerability, boss death unlock, retry resets and no camera hiding attack tells. A design candidate closes no boss-gameplay task. Submit sound, pulse or death effects as separate future jobs.

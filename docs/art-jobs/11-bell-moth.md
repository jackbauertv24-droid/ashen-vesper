# Job 11 — Bell Moth flying enemy

Priority P1, first new enemy for the Cloister. A hovering threat with a clearly warned diagonal swoop creates a reason to attack in the air. No projectile or contact damage while harmlessly hovering.

## Design prompt

> Design one original Bell Moth for Ashen Vesper: a ragged nocturnal moth with slate-indigo wings, pale worn wing markings, a small bronze bell husk suspended beneath its abdomen, and two restrained amber eyes. Haunted but readable, not cute or a humanoid, no costume copied from a franchise. HD painted non-pixel game art, orthographic right-facing side profile, complete isolated silhouette with genuine transparent background. Single neutral hovering pose, no scene, text, ground shadow, painted checkerboard or wide glow. Keep wings and dangling bell complete, material detail simple enough to read at small scale.

## Motion prompt after reference selection

> Animate the supplied original Bell Moth without changing body, wing markings, bell size or eye color. Six right-facing orthographic poses: hover wings high; hover wings low; attack anticipation with wings drawn back; diagonal swoop start; swoop contact; recovery climb. HD painted non-pixel, true alpha. Fixed body anchor, constant anatomical scale, complete wings/bell in every cell, no backdrop, streaks, text or detached bell. One 1536 × 1024 sheet, 3 × 2 512px cells, body anchor (256,256), 12px clear cell padding.

## Contract

Design first: one 1024 × 1024 RGBA reference, subject approximately 640px wingspan, center (512,512). Motion: fixed 512px cells, nominal wingspan 320px, runtime wingspan 64 units (uniform 0.2 scale). Shared body pivot (256,256); names hover-high/hover-low/warn/swoop-start/swoop-contact/climb. Body/core dimensions vary no more than 5%; wings naturally change envelope.

Proposed state timing: hover cycle 0.12/0.12s; warning 0.6s; swoop 0.35s; vulnerable climb/recovery 0.8s. Proposed HP 2, damage 1. These are tuning proposals, not implemented behavior. Telegraph direction before committing; do not home continuously during the swoop. Movement/collision path needs explicit data separate from the sprite.

## Acceptance

Show source/runtime/mirrored playback over white/black/blue/abbey. Bell never teleports between wingbeats. Runtime must demonstrate: ground attack misses a high hover; aerial attack can hit; warning allows evasion; committed swoop misses if player moves away; one damage event per contact with invulnerability; no wall penetration or unreachable pursuit. Keep travel over the main floor initially so a ground-only player can still progress. Submit art-only versus integration status honestly.

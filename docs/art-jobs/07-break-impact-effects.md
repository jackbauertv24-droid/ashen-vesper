# Job 07 — brazier break and melee impact effects

Priority: polish after native-alpha props and stable actors. Use retained iron/bronze and warm ember palette. Keep effects local and platform edges readable.

## Copyable prompt

> Create six consecutive frames of a small original Gothic censer break effect for Ashen Vesper. HD painted non-pixel game art, orthographic side view. Few aged iron/bronze fragments and restrained amber sparks: small fracture, maximum burst A/B, falling fragments A/B, nearly dissipated fade. Same burst origin and particle/material scale. No whole censer, actor, background, lettering, laser, glowing slash, wide fog, ground shadow or painted checkerboard. Actual RGBA transparency, crisp isolated debris, bounded translucent sparks. One 1536 × 1024 sheet, 3 × 2 cells of 512px, fixed local pivot (256,256). Every fragment remains at least 16px from cell edges.

## Contract and tests

Frame names fracture/burst-a/burst-b/fall-a/fall-b/fade. Durations 0.04/0.06/0.06/0.08/0.08/0.10s. Runtime cell 64 × 64, centered on actual brazier break. RGBA, outer 16px cell borders clear, no neighbor overlap. Source/export, full frame metadata, hashes, exact prompt and attempts retained.

Show three cycles over white/black/blue/abbey at source/runtime scales, stable origin. In-game play once per break and remove after fade. Keep collectible separate: debris must not resemble extra pickup drops. No collision changes; exactly one ember. Run gameplay/resource/browser checks.

Sword-contact sparks can be a separate PR using the same geometry with small local metal-contact poses. Originate at actual contact, never a line from actor to enemy.

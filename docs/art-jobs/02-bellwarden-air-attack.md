# Job 02 — Bellwarden aerial sword attack

## References

Costume and sword: `art/production/bellwarden/bellwarden-pilot-v001.png`. Use `bellwarden-airborne-v001.png` only for pose exploration; maintain the original short mantle rather than adopting the longer cape.

## Copyable generation prompt

> Create six coherent airborne sword-attack poses for Ashen Vesper's original Bellwarden using the attached ground-pose character as the costume and anatomy reference. HD painted non-pixel art, strict right-facing orthographic side view. Same tied dark hair, short ivory shoulder mantle, midnight-blue split coat, aged brass, boots, gloves and straight arming sword in every frame. Reading order: aerial windup A, aerial windup B, horizontal sword contact A, follow-through contact B, airborne recovery A, airborne recovery B. Knees naturally bend in flight; the hips remain anchored consistently. Show a deliberate forward sword strike, not a projectile or magical beam. The character continues traveling through a jump; do not imply hovering, standing on ground or a downward dive. Keep sword length, facial direction and handedness consistent. True transparent alpha, isolated full silhouettes, no backdrop, text, checkerboard, key color or cast ground shadow. Keep every sword tip and garment within its own specified cell.

## Export contract

- One 1536 × 1024 RGBA sheet, 3 × 2 cells of 512 × 512.
- Names: `air-windup-a`, `air-windup-b`, `air-contact-a`, `air-contact-b`, `air-recovery-a`, `air-recovery-b`.
- Shared virtual feet anchor: (192,464), standing reference height 384px, runtime reference 144 units. Knees can tuck without moving the common anchor; do not align frames by their changing lowest toe.
- Target timing: 0.07s, 0.07s, 0.08s, 0.08s, 0.06s, 0.06s. Total 0.42s.
- Forward contact matches x=8..115, y=-110..-28 in world units relative to virtual feet. Keep the sword within the cell with 4px transparent padding.
- Provide transition previews from jump ascent, apex and descent and when landing during recovery.

## Job-specific tests

Attack during ascent and descent; horizontal position and gravity must continue on the same trajectory as an otherwise identical jump. Show a hit on a guard, a miss above its head, a hit on a hanging brazier and one hit per swing. Landing must not duplicate or restart an attack. Include mirrored playback. Do not change physics to align a sprite. See shared acceptance requirements.

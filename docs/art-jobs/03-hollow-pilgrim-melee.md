# Job 03 — Hollow Pilgrim physical staff attack

## References

`art/concepts/hollow-pilgrim-concept-v001.png` and `art/production/enemies/hollow-pilgrim-motion-v001.png`. Preserve the thin, hooded pilgrim, weathered slate vestments, amber eyes and bronze bell-topped staff. Existing motion-sheet facing and crops are unapproved; create a consistent right-facing sequence.

## Copyable generation prompt

> Production animation sequence for Ashen Vesper's original Hollow Pilgrim enemy, based on the attached retained designs. HD painted Gothic art, not pixel art. Thin hooded figure in tattered slate-indigo vestments, small amber eyes and a solid wooden/iron staff with a heavy cracked bronze bell head. Exactly the same anatomy, costume, staff length and bell shape throughout. All frames face right in strict side-on orthographic view. Twelve poses in order: idle; walking contact A; walking passing; walking contact B; staff windup A; raised overhead windup B; forward/downward staff sweep A; staff impact B; recovery A; recovery B; struck recoil; collapsed defeat. Both hands convincingly grip the staff. Show weight and physical rotation around the grip, from overhead anticipation through a downward arc. No energy beam, laser, luminous straight line, projectile, detached weapon or glowing slash. Keep effects out of the character sheet. True transparent alpha with complete silhouettes, no background, text, checkerboard or key color. Maintain shared ground and body anchors. Never crop the raised staff or bell head or overlap neighboring cells.

## Export contract

- One 3072 × 2304 RGBA sheet: 4 columns × 3 rows of 768 × 768 cells. Individual frame PNGs may be generated first, then assembled; retain them all.
- Names: `idle`, `walk-a`, `walk-pass`, `walk-b`, `windup-a`, `windup-b`, `strike-a`, `strike-b`, `recover-a`, `recover-b`, `hurt`, `death`.
- Common feet anchor (256,704), reference standing height 480px, runtime height 150 units (scale 0.3125).
- Runtime grip is about (18,-90) relative to feet and mirrors with facing. Staff grip-to-head length: 118 units (about 378 source pixels). Preserve 4px padding even when raised.
- Runtime windup lasts 0.8s and rotates from -1.15 to -2 radians. Strike lasts 0.28s, rotating from -2 to +0.65 radians. Recovery lasts 0.9s, returning to -1.15. Angles are measured from forward horizontal, negative upward. Pair the artwork with the current `staffPose()` geometry; do not change weapon reach silently.
- All frames have one staff only. If proposing separate body/weapon layers, supply them in addition to the full sequence and document grip anchors. Do not erase the originals.

## Job-specific tests

Preview both facing directions with a visible grip and staff-tip path. The staff must remain attached to the hands and retain length. Compare live contact guides with its silhouette at multiple paused swing times. A target outside the swept weapon path must not take damage. Show a standing target hit, a crouched target outside the early high sweep missed, a late low swing that may still hit, and recovery vulnerability. Crouching is not blanket invulnerability against a downward strike.

Show patrol-to-windup, interrupted windup/hurt, death and repeated recovery cycles without stance flips. A concept collage with clipped weapons does not satisfy this job.

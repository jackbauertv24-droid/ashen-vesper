# Job 03 — Hollow Pilgrim physical staff attack

## References

`art/concepts/hollow-pilgrim-concept-v001.png` and `art/production/enemies/hollow-pilgrim-motion-v001.png`. Preserve the thin, hooded pilgrim, weathered slate vestments, amber eyes and bronze bell-topped staff. Existing motion-sheet facing and crops are unapproved; create a consistent right-facing sequence.

## Copyable generation prompt

> Production animation sequence for Ashen Vesper's original Hollow Pilgrim enemy, based on the attached retained designs. HD painted Gothic art, not pixel art. Thin hooded figure in tattered slate-indigo vestments, small amber eyes and a solid wooden/iron staff with a heavy cracked bronze bell head. Exactly the same anatomy, costume, staff length and bell shape throughout. All frames face right in strict side-on orthographic view. Twelve poses in order: idle; walking contact A; walking passing; walking contact B; staff windup A; raised overhead windup B; forward/downward staff sweep A; staff impact B; recovery A; recovery B; struck recoil; collapsed defeat. Both hands convincingly grip the staff. Show weight and physical rotation around the grip, from overhead anticipation through a downward arc. No energy beam, laser, luminous straight line, projectile, detached weapon or glowing slash. Keep effects out of the character sheet. True transparent alpha with complete silhouettes, no background, text, checkerboard or key color. Maintain shared ground and body anchors. Never crop the raised staff or bell head or overlap neighboring cells.

## Export contract

- One 3072 × 2304 RGBA sheet: 4 columns × 3 rows of 768 × 768 cells. Individual frame PNGs may be generated first, then assembled; retain them all.
- Names: `idle`, `walk-a`, `walk-pass`, `walk-b`, `windup-a`, `windup-b`, `strike-a`, `strike-b`, `recover-a`, `recover-b`, `hurt`, `death`.
- Common feet anchor (256,704), reference standing height 480px, runtime height 150 units (scale 0.3125).
- Contact grip is about (29,-61) relative to feet and mirrors with facing. Target grip-to-bell length is about 60 runtime units (192 source pixels at the export scale). Preserve 4px padding even when raised. Keep length consistent across the new sequence; the retained prototype has some perspective/length drift.
- Runtime windup lasts 0.8s overhead. Strike lasts 0.28s; its final 0.16s use the painted contact pose. Recovery lasts 0.9s. Current right-facing contact grip is about (29,-61) and bell tip (59,-10) relative to the enemy's ground anchor, from the retained sheet. Use `staffPose()` and `pilgrim-poses.js` as the integration reference. Add intermediate poses without silently restoring the rejected rotating-stick effect or extending damage reach.
- All frames have one staff only. If proposing separate body/weapon layers, supply them in addition to the full sequence and document grip anchors. Do not erase the originals.

## Job-specific tests

Preview both facing directions with a visible grip and staff-tip path. The staff must remain attached to the hands and retain length. Compare live contact guides with its silhouette at multiple paused swing times. A target outside the swept weapon path must not take damage. Show a standing target hit, a crouched target outside the early high sweep missed, a late low swing that may still hit, and recovery vulnerability. Crouching is not blanket invulnerability against a downward strike.

Show patrol-to-windup, interrupted windup/hurt, death and repeated recovery cycles without stance flips. A concept collage with clipped weapons does not satisfy this job.

# Job 12 — Iron Sexton heavy enemy

Priority P2. A slow abbey caretaker in battered iron plates, with a physical two-handed shovel/cleaver. Distinct silhouette and timing from the pilgrim; no new shield/parry system required for its first version.

## Design prompt

> Create one original Iron Sexton enemy for Ashen Vesper. Broad hunched abbey caretaker, battered dark iron half-mask and apron plates, torn muted-indigo work cloth, heavy boots, a long-handled iron grave shovel with a broad worn cutting edge held in both hands. Solemn Gothic painted HD non-pixel game art, strict right-facing side profile, fixed orthographic lighting matching supplied abbey/pilgrim references. Full body and complete weapon on genuine transparent alpha, no scene, shadow plane, checkerboard, lettering, energy effects or franchise costume.

## Motion prompt after reference selection

> Keep the supplied Iron Sexton's body, armor, shovel and scale identical. Eight consecutive right-facing poses: idle, heavy step A, heavy step B, attack brace, raised shovel anticipation, forward/downward physical cleave contact, committed recovery, struck recoil. Both hands grip the weapon. HD painted non-pixel, true alpha, fixed ground anchor, body weight transfer without resizing. One 2048 × 1024 sheet, 4 × 2 cells of 512, ground anchor (208,464), 12px transparent cell padding. Entire weapon inside each cell; no beam or luminous slash.

## Contract and acceptance

Reference 1024 × 1024 RGBA; motion as above, standing source height 400px, runtime 160 units/scale 0.4, names idle/step-a/step-b/brace/windup/contact/recover/hurt. Any death sequence is a separate follow-up. Do not shrink the weapon to fit different cells.

Proposed HP 4, damage 1, speed about 45 units/s, warning 0.9s, cleave 0.3s, recovery 1.1s. Actual grip/tip coordinates per pose must be recorded and used for contact timing. No invisible full-width damage rectangle. Keep an escape route; ground spacing should beat the attack without requiring an unimplemented dodge.

Preview at real hero scale, both facings, grayscale and white/black/blue/abbey. Integration shows bait/miss, contact, recovery punish, interrupted hurt, solid-wall behavior and no repeated damage during one attack. Different enemy types must not share one mutable animation state accidentally. Label all tuning and unimplemented death behavior.

## Current review

PR 16 v001 is the selected prototype design reference. Reuse its body, armor and complete shovel for the eight-pose sequence. Corrected reference scale is 160/898; future motion scale remains 0.4. See [PR 15–17 review](../PR_15_17_REVIEW.md).

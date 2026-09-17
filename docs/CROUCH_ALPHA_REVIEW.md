# Crouch scale and prop compositing review

## Measured scale

Manual source-image head envelopes, including hair crown through chin and excluding the shoulder mantle:

| Pose | Source envelope | Old runtime envelope | Corrected runtime envelope |
| --- | --- | --- | --- |
| Standing idle | approximately 79 × 76px | 27.2 × 26.2 units | unchanged |
| Crouch idle | approximately 111 × 104px | 23.9 × 22.4 units | 27.8 × 26.0 units |

These are approximate visual landmarks, not a claim of exact anatomical segmentation. They establish an approximately 12–15% shrink at the old 0.215 scale. Uniform 0.25 scaling gives head dimensions within about 2% of the standing reference. All six poses use that same scale; no axis compression or cell-filling normalization. Per-frame ground anchors remain separate from scale. The rendered crouch is about 83 units high; its body is now 84 and arch clearance 90. Low contact guides now cover feet-relative y=-64..-7, consistent with the enlarged thrust pose.

This corrects the runtime scale mismatch. It cannot fix remaining generated differences in face, equipment or pose anatomy; contributor cleanup remains necessary. Compare standing/crouch at the same camera scale and check all transitions in both directions.

## Transparency

The original ember is opaque. Screen blending brightened its entire blue studio rectangle; the original brazier's dark background varied too much for a single border-color flood fill. The encounter now uses the newly generated real-alpha brazier directly. The ember uses a narrow warm-color alpha separation and normal source-over compositing. Its blue matte disappears; this provisional mask may lose cool metal detail, so a native-alpha pickup is the next contributor priority.

Run `node tools/pose-check.mjs` for runtime standing/crouch, mirrored poses and props. `npm test` verifies the recorded scale calibration and sampled real-alpha gaps. These tests do not replace visual review of the remaining edge detail.
